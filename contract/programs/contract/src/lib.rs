use anchor_lang::prelude::*;

declare_id!("4r6tCfcZddGA72vHBoCSB35oCYu7Ftqr3E7Psy2bfj8V");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize_ride(
        ctx: Context<InitializeRide>,
        amount: u64,
    ) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        ride.amount = amount;
        ride.driver = ctx.accounts.driver.key();
        ride.passenger = ctx.accounts.passenger.key();
        ride.payment_status = "locked".to_string();
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

        msg!("Ride payment locked with amount: {}", amount);
        Ok(())
    }

    pub fn release_payment(ctx: Context<ReleasePayment>) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        require!(ride.payment_status == "locked", RideError::InvalidStatus);
        
        // Get the SOL amount in the account
        let rent_exemption = Rent::get()?.minimum_balance(ride.to_account_info().data_len());
        let amount_to_transfer = ride.to_account_info().lamports() - rent_exemption;
        
        if amount_to_transfer > 0 {
            // Transfer SOL from the PDA to the driver
            **ride.to_account_info().try_borrow_mut_lamports()? -= amount_to_transfer;
            **ctx.accounts.driver.to_account_info().try_borrow_mut_lamports()? += amount_to_transfer;
        }

        ride.payment_status = "released".to_string();
        msg!("Payment released for ride: {}", ride.id);
        Ok(())
    }

    pub fn create_or_update_ride(
        ctx: Context<CreateOrUpdateRide>,
        ride_id: String,
        origin: String,
        destination: String,
        price: u64,
        date: String,
        time: String,
        seats: u8,
        state: String,
        university: String,
        ride_type: String,
        status: String,
    ) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        ride.id = ride_id;
        ride.driver = *ctx.accounts.driver.key;
        ride.origin = origin;
        ride.destination = destination;
        ride.price = price;
        ride.date = date;
        ride.time = time;
        ride.seats = seats;
        ride.state = state;
        ride.university = university;
        ride.ride_type = ride_type;
        ride.status = status;
        ride.payment_status = "pending".to_string();
        
        Ok(())
    }
    
    // Function to update a ride's status
    pub fn update_ride_status(
        ctx: Context<UpdateRideStatus>,
        ride_id: String,
        status: String,
    ) -> Result<()> {
        let ride = &mut ctx.accounts.ride;
        ride.status = status;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeRide<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride.id.as_bytes()],
        bump
    )]
    pub ride: Account<'info, Ride>,
    
    /// The passenger account - this account pays for the ride
    #[account(mut)]
    pub passenger: Signer<'info>,
    
    /// The driver account who will receive payment
    /// CHECK: This is just used as a data field
    #[account(mut)]
    pub driver: UncheckedAccount<'info>,
    
    /// The system program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleasePayment<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride.id.as_bytes()],
        bump
    )]
    pub ride: Account<'info, Ride>,
    
    /// The passenger account who approved the release
    #[account(mut)]
    pub passenger: Signer<'info>,
    
    /// The driver account that will receive payment
    /// CHECK: This is just a recipient of funds
    #[account(mut)]
    pub driver: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Ride {
    pub id: String,                // Unique identifier for the ride
    pub driver: Pubkey,            // Driver's wallet address
    pub passenger: Pubkey,         // Passenger's wallet address (optional)
    pub origin: String,            // Origin location
    pub destination: String,       // Destination location
    pub price: u64,                // Price in lamports
    pub date: String,              // Date of the ride
    pub time: String,              // Time of the ride
    pub seats: u8,                 // Number of seats available
    pub state: String,             // State location
    pub university: String,        // University/Institution
    pub ride_type: String,         // "offer" or "request"
    pub status: String,            // "pending", "confirmed", "completed", "canceled"
    pub payment_status: String,    // "pending", "locked", "released"
    pub amount: u64,               // Amount locked in payment
    pub created_at: i64,           // Timestamp when created
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

#[derive(Accounts)]
#[instruction(ride_id: String)]
pub struct CreateOrUpdateRide<'info> {
    #[account(
        init_if_needed,
        payer = driver,
        space = 8 + 36 + 32 + 32 + 100 + 100 + 8 + 20 + 20 + 1 + 50 + 100 + 10 + 20 + 20,
        seeds = [b"ride", ride_id.as_bytes()],
        bump
    )]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub driver: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(ride_id: String)]
pub struct UpdateRideStatus<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride_id.as_bytes()],
        bump,
        constraint = ride.driver == *driver.key
    )]
    pub ride: Account<'info, Ride>,
    pub driver: Signer<'info>,
}