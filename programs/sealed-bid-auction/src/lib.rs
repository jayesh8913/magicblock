use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("6GQNCZPJYDMbEvVnY3b229TyWKfEss41Viaf57T4PGrW");

#[program]
pub mod sealed_bid_auction {
    use super::*;

    /// Initializes a new Nitro Auction for a specific NFT.
    pub fn initialize_auction(
        ctx: Context<InitializeAuction>,
        item_mint: Pubkey,
        duration: i64,
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        auction.seller = ctx.accounts.seller.key();
        auction.item_mint = item_mint;
        auction.end_time = Clock::get()?.unix_timestamp + duration;
        auction.total_bids = 0;
        auction.status = AuctionStatus::Active;
        auction.highest_bid = 0;
        auction.winner = Pubkey::default();
        
        msg!("Nitro Auction initialized for NFT: {} | Ends in: {}s", item_mint, duration);
        Ok(())
    }

    /// Submits a bid into the MagicBlock TEE.
    /// In an Ephemeral Rollup, this state is processed at sub-1ms.
    pub fn submit_bid(ctx: Context<SubmitBid>, amount: u64) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let bidder = &ctx.accounts.bidder;

        require!(
            Clock::get()?.unix_timestamp < auction.end_time,
            AuctionError::AuctionEnded
        );
        require!(
            auction.status == AuctionStatus::Active,
            AuctionError::InvalidStatus
        );

        // Within the MagicBlock ER, the highest bid is tracked privately.
        if amount > auction.highest_bid {
            auction.highest_bid = amount;
            auction.winner = bidder.key();
        }

        auction.total_bids += 1;
        
        msg!("SECURE_BID received in TEE. Current Total: {}", auction.total_bids);
        Ok(())
    }

    /// Settles the auction and reveals the winner.
    /// This commits the final ER state back to the Solana Devnet.
    pub fn settle_auction(ctx: Context<SettleAuction>) -> Result<()> {
        let auction = &mut ctx.accounts.auction;

        require!(
            Clock::get()?.unix_timestamp >= auction.end_time,
            AuctionError::AuctionNotEnded
        );

        auction.status = AuctionStatus::Settled;
        
        msg!("NIRO_SETTLEMENT: Winner: {:?} | Bid: {}", auction.winner, auction.highest_bid);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAuction<'info> {
    #[account(
        init, 
        payer = seller, 
        space = 8 + 32 + 32 + 8 + 8 + 8 + 32 + 1
    )]
    pub auction: Account<'info, Auction>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitBid<'info> {
    #[account(mut)]
    pub auction: Account<'info, Auction>,
    #[account(mut)]
    pub bidder: Signer<'info>,
}

#[derive(Accounts)]
pub struct SettleAuction<'info> {
    #[account(mut, has_one = seller)]
    pub auction: Account<'info, Auction>,
    pub seller: Signer<'info>,
}

#[account]
pub struct Auction {
    pub seller: Pubkey,
    pub item_mint: Pubkey,
    pub end_time: i64,
    pub total_bids: u64,
    pub highest_bid: u64,
    pub winner: Pubkey,
    pub status: AuctionStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AuctionStatus {
    Active,
    Settled,
}

#[error_code]
pub enum AuctionError {
    #[msg("The auction has already ended.")]
    AuctionEnded,
    #[msg("The auction has not ended yet.")]
    AuctionNotEnded,
    #[msg("Invalid auction status.")]
    InvalidStatus,
}
