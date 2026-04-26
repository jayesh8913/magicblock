# 🛡️ Private Sealed-Bid Auction (Solana Blitz v4)

An autonomous, agentic, and private sealed-bid auction system built on Solana using **MagicBlock Ephemeral Rollups** for TEE-based privacy and **SendAI** for agentic logic.

## 🚀 The Vision
In traditional on-chain auctions, bids are public. This leads to sniping and "last-look" advantages. Our system uses MagicBlock's Ephemeral Rollups to delegate the auction state to a private session. Bids are submitted into a TEE (Trusted Execution Environment) where they remain hidden until the auction closes and the state is committed back to the Solana Devnet.

## 🤖 Agentic Bidding
We've integrated **3 AI Agents** with distinct strategies:
- **Whale Agent:** Aggressive, uses Pyth price feeds to bid 20%+ over market.
- **Arbitrage Agent:** Conservative, seeks bargains below market price.
- **Chaos Agent:** Unpredictable, bids based on "vibes" and randomness.

## 🛠️ Tech Stack
- **MagicBlock Engine:** Ephemeral Rollups for private, real-time auction state.
- **Anchor (Solana):** On-chain program for auction lifecycle and settlement.
- **SendAI (Groq):** LLM reasoning for autonomous agent bidding strategies.
- **Helius:** High-performance RPC and Asset API for real-time updates.
- **Pyth Network:** Real-time SOL/USD price feeds to inform agent decisions.
- **SOAR:** Agent leaderboard tracking (Integrated for post-demo scaling).

## 🏃 How to Run

### 1. Prerequisites
- Solana CLI & Anchor installed.
- Node.js & npm/yarn.

### 2. Setup Environment
```bash
cp .env.example .env
# Fill in your HELIUS_API_KEY, SENDAI_API_KEY (Groq), and MAGICBLOCK_RPC_URL
```

### 3. Deploy Program
```bash
anchor build
anchor deploy
```

### 4. Run Frontend
```bash
cd app
npm install
npm run dev
```

## 🏆 Judging Criteria Checklist
- [x] **MagicBlock ER:** Used for private state delegation during the bidding phase.
- [x] **Agentic Theme:** 3 AI agents autonomously participating in the auction.
- [x] **Real-time Feel:** Live countdown and masked bid count updates.
- [x] **Sponsor Breadth:** Integrates MagicBlock, Helius, Pyth, and SendAI.
- [x] **Demo-ability:** End-to-end flow from "Start Auction" to "Reveal Winner".

---
Built with ⚡ by the Sealed-Bid Team for Solana Blitz v4.
