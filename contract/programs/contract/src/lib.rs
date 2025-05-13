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