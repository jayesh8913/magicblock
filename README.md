# GhostAuction: Privacy-Preserving AI Auctions

GhostAuction is a high-performance, privacy-first auction terminal built on **Solana**, leveraging **MagicBlock Ephemeral Rollups** to eliminate front-running and **Groq-powered AI agents** for autonomous bidding.

## 🚀 The Problem
Standard on-chain auctions suffer from **mempool sniffing** and **MEV (Maximal Extractable Value)**. Competitors can see bids before they are finalized and outbid users at the last millisecond (front-running).

## 🛡️ The Solution: GhostAuction
GhostAuction utilizes a **Sealed-Bid** architecture:
1.  **MagicBlock Ephemeral Rollups (ER):** Auction state is delegated to a temporary, high-speed rollup.
2.  **Privacy:** Bids are processed within a secure execution environment, keeping them hidden from the public mempool.
3.  **Settlement:** Once the auction ends, the ER state is committed back to the Solana Devnet for final settlement.
4.  **AI Agents:** Three distinct autonomous agents (The Whale, The Quant, and The Chaos Agent) compete in real-time using high-quality LLM reasoning.

## 🛠️ Technical Stack
-   **Blockchain:** Solana (Devnet)
-   **Scaling/Privacy:** [MagicBlock Ephemeral Rollups](https://docs.magicblock.gg/)
-   **Oracles:** [Pyth Network](https://pyth.network/) (Real-time SOL/USD price feeds)
-   **NFT Standard:** [Metaplex](https://www.metaplex.com/)
-   **AI Reasoning:** [Groq](https://groq.com/) (Llama 3 70B)
-   **Frontend:** React, Vite, Framer Motion, Tailwind CSS

## 📋 Environment Variables
To run this project locally or on Vercel, you need the following in your `.env` (prefixed with `VITE_` for the frontend):

```env
VITE_MAGICBLOCK_RPC_URL=https://devnet-rpc.magicblock.app
VITE_HELIUS_API_KEY=your_helius_key
VITE_SENDAI_API_KEY=your_groq_key
VITE_SOLANA_NETWORK=devnet
VITE_PYTH_PRICE_FEED=J83w4HB6uCmSVoH2NQW56AoJotHQZBTvYWE7k4a6uJ9
VITE_PROGRAM_ID=6GQNCZPJYDMbEvVnY3b229TyWKfEss41Viaf57T4PGrW
```

## 📦 Installation

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/jayesh8913/magicblock.git
    cd magicblock
    ```

2.  **Install dependencies:**
    ```bash
    cd app
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 🏗️ Deployment (Vercel)
If deploying to Vercel, ensure you set the **Root Directory** to `app` in the project settings.

---
*Built for the MagicBlock Hackathon 2026.*
