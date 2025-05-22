use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount, Transfer},
};
use solana_program::pubkey::Pubkey; // Explicit import for clarity

declare_id!("4r6tCfcZddGA72vHBoCSB35oCYu7Ftqr3E7Psy2bfj8V");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize_ride(
        ctx: Context<InitializeRide>,
        ride_id: String,
        amount: u64,
        driver: Pubkey,
    ) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        ride.ride_id = ride_id.clone();
        ride.amount = amount;
        ride.driver = driver;
        ride.passenger = ctx.accounts.passenger.key();
        ride.status = RideStatus::PaymentLocked;
        ride.created_at = Clock::get()?.unix_timestamp;

        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer { // Using direct Transfer
                    from: ctx.accounts.passenger_wsol_ata.to_account_info(),
                    to: ctx.accounts.escrow_wsol_ata.to_account_info(),
                    authority: ctx.accounts.passenger.to_account_info(),
                },
            ),
            amount,
        )?;

        msg!(
            "Ride initialized with ID: {}, amount: {}, driver: {}, passenger: {}",
            ride.ride_id,
            ride.amount,
            ride.driver,
            ride.passenger
        );
        Ok(())
    }

    pub fn release_payment(ctx: Context<ReleasePayment>) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        // Driver and status checks are handled by constraints in ReleasePayment struct

        // Define PDA signer seeds
        let ride_id_bytes = ride.ride_id.as_bytes();
        let bump_seed = &[ctx.bumps.ride]; // Correct way to get bump
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"ride".as_ref(),
            ride_id_bytes,
            bump_seed
        ]];

        // Transfer WSOL from escrow to driver's ATA
        anchor_spl::token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer { // Ensure 'Transfer' is correctly namespaced
                    from: ctx.accounts.escrow_wsol_ata.to_account_info(),
                    to: ctx.accounts.driver_wsol_ata.to_account_info(),
                    authority: ride.to_account_info(), // ride PDA is the authority
                },
                signer_seeds,
            ),
            ride.amount, // This is the full amount locked in escrow
        )?;

        // The escrow_wsol_ata is designated to be closed by Anchor via `close = driver`
        // after this instruction successfully completes and the account balance is zero.
        // Anchor invokes `spl_token::close_account` under the hood.

        ride.status = RideStatus::PaymentReleased;
        msg!("Payment released for ride: {}. Amount: {}", ride.ride_id, ride.amount);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(ride_id: String)] // This is for InitializeRide, ReleasePayment does not need it at struct level
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

    #[account(
        mut,
        constraint = passenger_wsol_ata.mint == wsol_mint.key() @ RideError::InvalidMint,
        constraint = passenger_wsol_ata.owner == passenger.key() @ RideError::InvalidOwner
    )]
    pub passenger_wsol_ata: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = passenger,
        associated_token::mint = wsol_mint,
        associated_token::authority = ride,
    )]
    pub escrow_wsol_ata: Account<'info, TokenAccount>, // This is the escrow ATA for InitializeRide

    #[account(address = anchor_spl::token::spl_token::native_mint::ID @ RideError::InvalidMint)]
    pub wsol_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct ReleasePayment<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride.ride_id.as_ref()], // Use .as_ref() for String seed
        bump,
        has_one = driver @ RideError::Unauthorized, // driver field in Ride struct must match signer
        constraint = ride.status == RideStatus::PaymentLocked @ RideError::InvalidStatus
    )]
    pub ride: Account<'info, Ride>,

    #[account(mut)] // Driver needs to be mutable to receive rent from closed escrow
    pub driver: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = wsol_mint,
        associated_token::authority = ride, // ride PDA is the authority for this ATA
        close = driver // Close account after operations, rent to driver
    )]
    pub escrow_wsol_ata: Account<'info, TokenAccount>, // This is the escrow ATA for ReleasePayment

    #[account(
        mut,
        constraint = driver_wsol_ata.mint == wsol_mint.key() @ RideError::InvalidMint,
        constraint = driver_wsol_ata.owner == driver.key() @ RideError::InvalidOwner
    )]
    pub driver_wsol_ata: Account<'info, TokenAccount>,

    #[account(address = anchor_spl::token::spl_token::native_mint::ID @ RideError::InvalidMint)]
    pub wsol_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>, // Required by Anchor when `close` is used on an account
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
    #[msg("Invalid token mint for this operation")]
    InvalidMint,
    #[msg("Invalid token account owner for this operation")]
    InvalidOwner,
}