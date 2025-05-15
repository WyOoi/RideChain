use anchor_lang::prelude::*;

declare_id!("4r6tCfcZddGA72vHBoCSB35oCYu7Ftqr3E7Psy2bfj8V");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize_ride(
        ctx: Context<InitializeRide>,
        ride_id: String,
        amount: u64,
        driver: Pubkey,
        passenger: Pubkey,
    ) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        ride.ride_id = ride_id;
        ride.amount = amount;
        ride.driver = driver;
        ride.passenger = passenger;
        ride.status = RideStatus::PaymentLocked;
        ride.created_at = Clock::get()?.unix_timestamp;

        // Transfer SOL from passenger to the program
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.passenger.key(),
            &ctx.accounts.ride.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.passenger.to_account_info(),
                ctx.accounts.ride.to_account_info(),
            ],
        )?;

        msg!("Ride initialized with ID: {} and amount: {}", ride_id, amount);
        Ok(())
    }

    pub fn release_payment(ctx: Context<ReleasePayment>) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        require!(ride.status == RideStatus::PaymentLocked, RideError::InvalidStatus);
        require!(ride.driver == ctx.accounts.driver.key(), RideError::Unauthorized);

        // Transfer SOL from program to driver
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.ride.key(),
            &ctx.accounts.driver.key(),
            ride.amount,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.ride.to_account_info(),
                ctx.accounts.driver.to_account_info(),
            ],
        )?;

        ride.status = RideStatus::PaymentReleased;
        msg!("Payment released for ride: {}", ride.ride_id);
        Ok(())
    }
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
    #[account(mut)]
    pub passenger: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleasePayment<'info> {
    #[account(mut)]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub driver: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Ride {
    pub ride_id: String,
    pub amount: u64,
    pub driver: Pubkey,
    pub passenger: Pubkey,
    pub status: RideStatus,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum RideStatus {
    PaymentLocked,
    PaymentReleased,
}

#[error_code]
pub enum RideError {
    #[msg("Invalid ride status for this operation")]
    InvalidStatus,
    #[msg("Unauthorized to perform this action")]
    Unauthorized,
}