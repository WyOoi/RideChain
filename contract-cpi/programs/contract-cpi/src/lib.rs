use anchor_lang::prelude::*;

declare_id!("ChHk6QWzTjdRH7eQRkPrh6HUxoNSi1go7jTXUm6YMp7z");

#[program]
pub mod contract_cpi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
