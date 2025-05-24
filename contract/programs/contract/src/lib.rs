use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("2qKsmbvz6ySMGuiwRVSWW2LxGowPPMe3fe8ZeCo28RmN");

// Constants for pricing
const BASE_FARE: u64 = 400; // RM4.00 in cents
const BASE_DISTANCE: u64 = 5; // 5 km
const PER_KM_RATE: u64 = 100; // RM1.00 per km in cents

#[program]
pub mod contract {
    use super::*;

    pub fn register_driver(
        ctx: Context<RegisterDriver>,
        license_hash: String,
        vehicle_info: String,
    ) -> Result<()> {
        let driver_profile = &mut ctx.accounts.driver_profile;
        driver_profile.driver = ctx.accounts.driver.key();
        driver_profile.license_hash = license_hash;
        driver_profile.vehicle_info = vehicle_info;
        driver_profile.is_verified = false;
        driver_profile.created_at = Clock::get()?.unix_timestamp;
        
        msg!("Driver registered: {}", ctx.accounts.driver.key());
        Ok(())
    }

    pub fn verify_driver(ctx: Context<VerifyDriver>) -> Result<()> {
        let driver_profile = &mut ctx.accounts.driver_profile;
        require!(!driver_profile.is_verified, RideError::AlreadyVerified);
        driver_profile.is_verified = true;
        
        msg!("Driver verified: {}", driver_profile.driver);
        Ok(())
    }

    pub fn initialize_ride(
        ctx: Context<InitializeRide>,
        ride_id: String,
        amount: u64,
        destination: String,
        distance_km: u64,
    ) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        let driver_profile = &ctx.accounts.driver_profile;
        
        require!(driver_profile.is_verified, RideError::DriverNotVerified);
        
        // Calculate fare based on distance
        let fare = calculate_fare(distance_km);
        require!(amount >= fare, RideError::InsufficientPayment);
        
        ride.ride_id = ride_id;
        ride.amount = amount;
        ride.driver = ctx.accounts.driver.key();
        ride.passenger = ctx.accounts.passenger.key();
        ride.destination = destination;
        ride.distance_km = distance_km;
        ride.estimated_fare = fare;
        ride.status = RideStatus::PaymentLocked;
        ride.created_at = Clock::get()?.unix_timestamp;
        ride.commission = (fare as f64 * 0.1) as u64; // 10% commission

        // Create transaction record
        let transaction = &mut ctx.accounts.transaction;
        transaction.ride_id = ride_id.clone();
        transaction.transaction_type = TransactionType::PaymentLocked;
        transaction.amount = amount;
        transaction.from = ctx.accounts.passenger.key();
        transaction.to = ride.key();
        transaction.timestamp = Clock::get()?.unix_timestamp;
        transaction.signature = ctx.accounts.passenger.key().to_string();

        // Transfer SOL from passenger to the program
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.passenger.key(),
            &ctx.accounts.ride.key(),
            amount,
        );
        let transfer_result = anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.passenger.to_account_info(),
                ctx.accounts.ride.to_account_info(),
            ],
        )?;

        // Log detailed transaction information
        msg!("=== Ride Initialization Details ===");
        msg!("Ride ID: {}", ride_id);
        msg!("Transaction ID: {}", transaction.key());
        msg!("Amount Locked: {} SOL", amount as f64 / 1e9);
        msg!("From: {}", ctx.accounts.passenger.key());
        msg!("To (Escrow): {}", ride.key());
        msg!("Timestamp: {}", transaction.timestamp);
        msg!("Distance: {} km", distance_km);
        msg!("Base Fare: {} SOL", BASE_FARE as f64 / 1e9);
        msg!("Total Fare: {} SOL", fare as f64 / 1e9);
        msg!("Commission: {} SOL", ride.commission as f64 / 1e9);
        msg!("Transaction Signature: {}", transaction.signature);
        msg!("================================");

        Ok(())
    }

    pub fn complete_ride(ctx: Context<CompleteRide>) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        require!(ride.status == RideStatus::PaymentLocked, RideError::InvalidStatus);
        require!(ride.driver == ctx.accounts.driver.key(), RideError::Unauthorized);

        ride.status = RideStatus::Completed;
        ride.completed_at = Clock::get()?.unix_timestamp;
        
        msg!("Ride completed: {}", ride.ride_id);
        Ok(())
    }

    pub fn release_payment(ctx: Context<ReleasePayment>) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        require!(ride.status == RideStatus::Completed, RideError::InvalidStatus);
        require!(ride.driver == ctx.accounts.driver.key(), RideError::Unauthorized);

        let driver_amount = ride.estimated_fare - ride.commission;
        
        // Create transaction record for commission
        let commission_tx = &mut ctx.accounts.commission_transaction;
        commission_tx.ride_id = ride.ride_id.clone();
        commission_tx.transaction_type = TransactionType::CommissionPaid;
        commission_tx.amount = ride.commission;
        commission_tx.from = ride.key();
        commission_tx.to = ctx.accounts.platform.key();
        commission_tx.timestamp = Clock::get()?.unix_timestamp;
        commission_tx.signature = ctx.accounts.driver.key().to_string();

        // Create transaction record for driver payment
        let driver_tx = &mut ctx.accounts.driver_transaction;
        driver_tx.ride_id = ride.ride_id.clone();
        driver_tx.transaction_type = TransactionType::DriverPaid;
        driver_tx.amount = driver_amount;
        driver_tx.from = ride.key();
        driver_tx.to = ctx.accounts.driver.key();
        driver_tx.timestamp = Clock::get()?.unix_timestamp;
        driver_tx.signature = ctx.accounts.driver.key().to_string();
        
        // Transfer commission to platform
        let commission_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.ride.key(),
            &ctx.accounts.platform.key(),
            ride.commission,
        );
        anchor_lang::solana_program::program::invoke(
            &commission_ix,
            &[
                ctx.accounts.ride.to_account_info(),
                ctx.accounts.platform.to_account_info(),
            ],
        )?;

        // Transfer remaining amount to driver
        let driver_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.ride.key(),
            &ctx.accounts.driver.key(),
            driver_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &driver_ix,
            &[
                ctx.accounts.ride.to_account_info(),
                ctx.accounts.driver.to_account_info(),
            ],
        )?;

        // Log detailed payment release information
        msg!("=== Payment Release Details ===");
        msg!("Ride ID: {}", ride.ride_id);
        msg!("Commission Transaction ID: {}", commission_tx.key());
        msg!("Driver Payment Transaction ID: {}", driver_tx.key());
        msg!("Commission Amount: {} SOL", ride.commission as f64 / 1e9);
        msg!("Driver Amount: {} SOL", driver_amount as f64 / 1e9);
        msg!("Platform Address: {}", ctx.accounts.platform.key());
        msg!("Driver Address: {}", ctx.accounts.driver.key());
        msg!("Timestamp: {}", Clock::get()?.unix_timestamp);
        msg!("============================");

        ride.status = RideStatus::PaymentReleased;
        Ok(())
    }

    pub fn initiate_dispute(ctx: Context<InitiateDispute>, reason: String) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        require!(
            ride.status == RideStatus::PaymentLocked || ride.status == RideStatus::Completed,
            RideError::InvalidStatus
        );
        require!(
            ride.passenger == ctx.accounts.passenger.key() || ride.driver == ctx.accounts.driver.key(),
            RideError::Unauthorized
        );

        ride.status = RideStatus::Disputed;
        ride.dispute_reason = Some(reason);
        ride.dispute_initiated_at = Some(Clock::get()?.unix_timestamp);
        
        msg!("Dispute initiated for ride: {}", ride.ride_id);
        Ok(())
    }

    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        resolution: DisputeResolution,
    ) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        require!(ride.status == RideStatus::Disputed, RideError::InvalidStatus);
        require!(ctx.accounts.platform.key() == ctx.accounts.authority.key(), RideError::Unauthorized);

        ride.status = match resolution {
            DisputeResolution::RefundPassenger => {
                // Transfer full amount back to passenger
                let refund_ix = anchor_lang::solana_program::system_instruction::transfer(
                    &ctx.accounts.ride.key(),
                    &ctx.accounts.passenger.key(),
                    ride.amount,
                );
                anchor_lang::solana_program::program::invoke(
                    &refund_ix,
                    &[
                        ctx.accounts.ride.to_account_info(),
                        ctx.accounts.passenger.to_account_info(),
                    ],
                )?;
                RideStatus::Refunded
            }
            DisputeResolution::PayDriver => {
                // Release payment to driver with commission
                let driver_amount = ride.estimated_fare - ride.commission;
                
                // Transfer commission to platform
                let commission_ix = anchor_lang::solana_program::system_instruction::transfer(
                    &ctx.accounts.ride.key(),
                    &ctx.accounts.platform.key(),
                    ride.commission,
                );
                anchor_lang::solana_program::program::invoke(
                    &commission_ix,
                    &[
                        ctx.accounts.ride.to_account_info(),
                        ctx.accounts.platform.to_account_info(),
                    ],
                )?;

                // Transfer remaining amount to driver
                let driver_ix = anchor_lang::solana_program::system_instruction::transfer(
                    &ctx.accounts.ride.key(),
                    &ctx.accounts.driver.key(),
                    driver_amount,
                );
                anchor_lang::solana_program::program::invoke(
                    &driver_ix,
                    &[
                        ctx.accounts.ride.to_account_info(),
                        ctx.accounts.driver.to_account_info(),
                    ],
                )?;
                RideStatus::PaymentReleased
            }
        };

        msg!("Dispute resolved for ride: {}", ride.ride_id);
        Ok(())
    }
}

// Helper function to calculate fare based on distance
fn calculate_fare(distance_km: u64) -> u64 {
    if distance_km <= BASE_DISTANCE {
        BASE_FARE
    } else {
        BASE_FARE + ((distance_km - BASE_DISTANCE) * PER_KM_RATE)
    }
}

#[derive(Accounts)]
pub struct RegisterDriver<'info> {
    #[account(
        init,
        payer = driver,
        space = 8 + DriverProfile::INIT_SPACE,
        seeds = [b"driver", driver.key().as_ref()],
        bump
    )]
    pub driver_profile: Account<'info, DriverProfile>,
    #[account(mut)]
    pub driver: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyDriver<'info> {
    #[account(mut)]
    pub driver_profile: Account<'info, DriverProfile>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct InitializeRide<'info> {
    #[account(
        init,
        payer = passenger,
        space = 8 + Ride::INIT_SPACE,
        seeds = [b"ride", ride_id.as_bytes()],
        bump
    )]
    pub ride: Account<'info, Ride>,
    #[account(
        seeds = [b"driver", driver.key().as_ref()],
        bump,
        constraint = driver_profile.driver == driver.key()
    )]
    pub driver_profile: Account<'info, DriverProfile>,
    #[account(
        init,
        payer = passenger,
        space = 8 + Transaction::INIT_SPACE,
        seeds = [b"transaction", ride_id.as_bytes()],
        bump
    )]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub passenger: Signer<'info>,
    /// CHECK: This is the driver's public key
    pub driver: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteRide<'info> {
    #[account(mut)]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub driver: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReleasePayment<'info> {
    #[account(mut)]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub driver: Signer<'info>,
    /// CHECK: Platform wallet for receiving commission
    #[account(mut)]
    pub platform: AccountInfo<'info>,
    #[account(
        init,
        payer = driver,
        space = 8 + Transaction::INIT_SPACE,
        seeds = [b"commission", ride.key().as_ref()],
        bump
    )]
    pub commission_transaction: Account<'info, Transaction>,
    #[account(
        init,
        payer = driver,
        space = 8 + Transaction::INIT_SPACE,
        seeds = [b"driver_payment", ride.key().as_ref()],
        bump
    )]
    pub driver_transaction: Account<'info, Transaction>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitiateDispute<'info> {
    #[account(mut)]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub passenger: Signer<'info>,
    /// CHECK: This is the driver's public key
    pub driver: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(mut)]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub passenger: AccountInfo<'info>,
    #[account(mut)]
    pub driver: AccountInfo<'info>,
    /// CHECK: Platform wallet for receiving commission
    #[account(mut)]
    pub platform: AccountInfo<'info>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct DriverProfile {
    pub driver: Pubkey,
    pub license_hash: String,
    pub vehicle_info: String,
    pub is_verified: bool,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Ride {
    pub ride_id: String,
    pub amount: u64,
    pub driver: Pubkey,
    pub passenger: Pubkey,
    pub destination: String,
    pub distance_km: u64,
    pub estimated_fare: u64,
    pub commission: u64,
    pub status: RideStatus,
    pub created_at: i64,
    pub completed_at: Option<i64>,
    pub dispute_reason: Option<String>,
    pub dispute_initiated_at: Option<i64>,
    pub transaction_id: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum RideStatus {
    PaymentLocked,
    Completed,
    PaymentReleased,
    Disputed,
    Refunded,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum DisputeResolution {
    RefundPassenger,
    PayDriver,
}

#[error_code]
pub enum RideError {
    #[msg("Invalid ride status for this operation")]
    InvalidStatus,
    #[msg("Unauthorized to perform this action")]
    Unauthorized,
    #[msg("Driver is not verified")]
    DriverNotVerified,
    #[msg("Driver is already verified")]
    AlreadyVerified,
    #[msg("Insufficient payment for the ride")]
    InsufficientPayment,
}

#[account]
#[derive(InitSpace)]
pub struct Transaction {
    pub ride_id: String,
    pub transaction_type: TransactionType,
    pub amount: u64,
    pub from: Pubkey,
    pub to: Pubkey,
    pub timestamp: i64,
    pub signature: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum TransactionType {
    PaymentLocked,
    CommissionPaid,
    DriverPaid,
    Refunded,
}