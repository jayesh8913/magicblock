import { getCurrentSolPrice } from '../lib/helius';

const GROQ_API_KEY = import.meta.env.VITE_SENDAI_API_KEY;

interface AgentProfile {
    id: string;
    name: string;
    description: string;
    personality: string;
    strategy: string;
    avatar: string;
}

export const AGENTS: AgentProfile[] = [
    {
        id: "whale",
        name: "Moby Dick",
        description: "Institutional Whale",
        personality: "Aggressive, wealthy, and zero patience. You don't care about the price; you care about owning the asset. You always bid significantly above market value to crush competition.",
        strategy: "Bid 20-40% above market price. Winning is the only metric.",
        avatar: "🐋"
    },
    {
        id: "arbitrageur",
        name: "The Quant",
        description: "Calculated Arbitrageur",
        personality: "Cold, analytical, and precise. You see the auction as a math problem. You want the asset but only if the price is rationally justifiable based on market volatility.",
        strategy: "Bid 5-10% above market price. Calculated and precise.",
        avatar: "📊"
    },
    {
        id: "chaos",
        name: "Vibe Master",
        description: "Chaotic Degenerate",
        personality: "Unpredictable, driven by 'vibes' and cosmic alignment. You might bid double the market price or 1/10th of it. There is no logic, only chaos.",
        strategy: "Truly random within a wide range. No pattern.",
        avatar: "🎲"
    }
];

export interface BidResult {
    agentId: string;
    bid: number;
    reasoning: string;
}

/**
 * Calls Grok (via Groq/xAI) to generate a strategic bid and reasoning.
 */
export const getAgentBid = async (agent: AgentProfile, marketPrice: number): Promise<BidResult> => {
    try {
        const prompt = `
            You are ${agent.name}, a ${agent.description}.
            Your personality: ${agent.personality}
            Your strategy: ${agent.strategy}

            Current SOL market price: $${marketPrice.toFixed(2)}

            Analyze the situation and decide your bid in SOL.
            Provide your reasoning in one short, impactful sentence.
            
            Return your response in this JSON format:
            {
                "bid": number,
                "reasoning": "string"
            }
        `;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-70b-8192", // Using Llama3-70B via Groq for high-quality reasoning
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.8
            })
        });

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);
        
        return {
            agentId: agent.id,
            bid: result.bid,
            reasoning: result.reasoning
        };
    } catch (error) {
        console.error(`Error getting bid for ${agent.name}:`, error);
        // Fallback logic if AI fails
        const fallbackBid = agent.id === 'whale' ? marketPrice * 1.3 : 
                           agent.id === 'arbitrageur' ? marketPrice * 1.05 : 
                           marketPrice * (Math.random() * 2);
        
        return {
            agentId: agent.id,
            bid: fallbackBid,
            reasoning: "The neural link is flickering, but my instincts remain sharp. Executing fallback strategy."
        };
    }
};

/**
 * Orchestrates the full agent bidding round.
 */
export const triggerAgentBiddingRound = async (marketPrice: number): Promise<BidResult[]> => {
    const results = await Promise.all(AGENTS.map(agent => getAgentBid(agent, marketPrice)));
    return results;
};
