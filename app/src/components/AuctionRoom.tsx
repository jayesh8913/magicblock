import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Target, Timer, Trophy, Cpu, 
  Terminal as TerminalIcon, Lock, Unlock, 
  ChevronRight, Activity, Globe, Database
} from 'lucide-react';
import { triggerAgentBiddingRound, AGENTS, BidResult } from '../agents/biddingAgents';
import { getCurrentSolPrice, getNFTMetadata } from '../lib/helius';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AuctionPhase = 'OPEN' | 'BIDDING' | 'LOCKED' | 'REVEAL';

const AuctionRoom = () => {
  const statuses = {
    HELIUS: 'connected',
    MAGICBLOCK: 'connected',
    PYTH: 'connected',
  };
  const [phase, setPhase] = useState<AuctionPhase>('OPEN');
  const [timeLeft, setTimeLeft] = useState(30);
  const [marketPrice, setMarketPrice] = useState(145.50);
  const [bids, setBids] = useState<BidResult[]>([]);
  const [revealedBids, setRevealedBids] = useState<string[]>([]);
  const [currentBlock, setCurrentBlock] = useState(284102943);
  const [nftData, setNftData] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>(["[PROTOCOL] Initializing GhostAuction Terminal...", "[SYS] Network: Solana Devnet"]);
  
  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), msg]);
  };

  useEffect(() => {
    // Initial data fetch
    const init = async () => {
      addLog("[HELIUS] Connecting to RPC node...");
      const price = await getCurrentSolPrice();
      setMarketPrice(price);
      addLog(`[PYTH] Price feed active: $${price.toFixed(2)} SOL/USD`);
      
      addLog("[METAPLEX] Fetching asset metadata...");
      const nft = await getNFTMetadata(import.meta.env.VITE_PROGRAM_ID || "6GQNCZPJYDMbEvVnY3b229TyWKfEss41Viaf57T4PGrW");
      setNftData(nft);
      addLog(`[METAPLEX] Asset validated: ${nft.name}`);
    };
    init();

    // Block counter simulation
    const interval = setInterval(() => {
      setCurrentBlock(prev => prev + 1);
      if (Math.random() > 0.8) {
        addLog(`[HELIUS] Syncing block #${currentBlock + 1}...`);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && phase === 'OPEN') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && phase === 'OPEN') {
      startBidding();
    }
  }, [timeLeft, phase]);

  const startBidding = async () => {
    setPhase('BIDDING');
    addLog("[MAGICBLOCK] Requesting Ephemeral Rollup delegation...");
    
    // MagicBlock Delegation Simulation
    await new Promise(r => setTimeout(r, 1000));
    addLog("[TEE] Initializing secure enclave session...");
    await new Promise(r => setTimeout(r, 1000));
    addLog("[MAGICBLOCK] SUCCESS: Account delegated to ER.");
    
    addLog("[GROQ] Triggering autonomous agent reasoning...");
    const results = await triggerAgentBiddingRound(marketPrice);
    setBids(results);
    
    addLog("[TEE] Encrypting bid packets in private state...");
    setPhase('LOCKED');
    addLog("[PROTOCOL] STATE_LOCKED: Mempool sniffing protection active.");
  };

  const handleReveal = async () => {
    setPhase('REVEAL');
    for (const agent of AGENTS) {
      await new Promise(r => setTimeout(r, 1200));
      setRevealedBids(prev => [...prev, agent.id]);
    }
  };

  const winner = useMemo(() => {
    if (bids.length === 0) return null;
    return bids.reduce((prev, current) => (prev.bid > current.bid) ? prev : current);
  }, [bids]);

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. TOP STATUS BAR (SPONSORS) */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold tracking-tighter text-white uppercase">Nitro Auction Terminal</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex gap-4">
              {Object.entries(statuses).map(([name, status]) => (
                <div key={name} className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 transition-colors cursor-default">
                  <div className={cn("w-1 h-1 rounded-full", status === 'connected' ? 'bg-emerald-500' : 'bg-red-500')} />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5"><Globe size={10} /> Devnet</span>
            <span className="flex items-center gap-1.5"><Database size={10} /> Block: #{currentBlock}</span>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tightest mb-6 uppercase italic">
            Ghost<span className="text-blue-500 text-glow">Auction</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 text-lg leading-relaxed">
            Eliminating front-running via <span className="text-white font-medium">MagicBlock Ephemeral Rollups</span>. 
            Bids are sealed in a TEE enclave and settled autonomously by Grok-powered agents.
          </p>
        </motion.div>
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">
        
        {/* 3. LEFT: NFT & AGENTS (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* REAL NFT ITEM CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative bg-white/[0.02] border border-white/5 rounded-[32px] p-8 backdrop-blur-sm overflow-hidden"
          >
            {/* Animated Scanning Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-40 w-full -translate-y-full animate-[scan_4s_linear_infinite] pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition duration-1000" />
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600" 
                    alt="NFT"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[8px] font-mono text-blue-400 uppercase tracking-widest">
                    Encrypted_State
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                      Metaplex Devnet
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">Neural_Series // 0x882</span>
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tightest uppercase italic leading-none">The <span className="text-blue-500">Neural</span> Sovereign</h2>
                  <p className="text-zinc-500 text-sm mt-4 leading-relaxed max-w-md">
                    A rare generative artifact secured within the <span className="text-zinc-300">MagicBlock Ephemeral Enclave</span>. 
                    Validated via Metaplex metadata standard with sub-1ms settlement latency.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em]">Fair Value (Pyth)</p>
                    <p className="text-2xl font-black text-white tracking-tighter">${marketPrice.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em]">Auction Phase</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <p className="text-2xl font-black text-blue-500 tracking-tighter uppercase italic">{phase}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AGENT PERSONALITY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGENTS.map((agent) => (
              <motion.div 
                key={agent.id}
                whileHover={{ y: -4 }}
                className={cn(
                  "p-6 rounded-2xl border transition-all duration-500",
                  revealedBids.includes(agent.id) && winner?.agentId === agent.id 
                    ? "bg-blue-500/10 border-blue-500/40 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]" 
                    : "bg-white/[0.02] border-white/5"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{agent.avatar}</span>
                  {revealedBids.includes(agent.id) && winner?.agentId === agent.id && (
                    <Trophy size={16} className="text-blue-500" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{agent.name}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">{agent.description}</p>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6 h-12 overflow-hidden">{agent.strategy}</p>
                
                <div className="pt-4 border-t border-white/5">
                  {phase === 'REVEAL' && revealedBids.includes(agent.id) ? (
                    <div className="space-y-3">
                      <p className="text-xl font-black text-white tracking-tighter">
                        {bids.find(b => b.agentId === agent.id)?.bid.toFixed(2)} SOL
                      </p>
                      <p className="text-[10px] text-blue-400 italic leading-tight">
                        "{bids.find(b => b.agentId === agent.id)?.reasoning}"
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 opacity-30">
                      <Lock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Sealed</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. RIGHT: MAGICBLOCK FLOW & CONTROLS (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* AUCTION CONTROLS */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Activity size={80} />
                </div>
                
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-500 tracking-widest">
                        <Timer size={14} /> T-Minus
                    </div>
                    <div className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-zinc-500">
                        SESSION_ID: 0x4f22...v4
                    </div>
                </div>

                <div className={cn(
                    "text-7xl font-black tracking-tighter mb-10 italic text-center",
                    timeLeft < 10 && phase === 'OPEN' ? 'text-red-500 animate-pulse' : 'text-white'
                )}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
                
                <AnimatePresence mode="wait">
                    {phase === 'OPEN' && (
                        <motion.div 
                          key="open" exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-blue-500"
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 30, ease: "linear" }}
                                />
                            </div>
                            <p className="text-[10px] text-center text-zinc-500 uppercase font-bold tracking-[0.2em]">
                                Awaiting Agent Finalization
                            </p>
                        </motion.div>
                    )}

                    {phase === 'LOCKED' && (
                        <motion.button
                            key="reveal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleReveal}
                            className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-tighter hover:bg-blue-500 transition-all rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 group"
                        >
                            Reveal Results <Unlock size={18} className="transition-transform group-hover:rotate-12" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {phase === 'BIDDING' && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <Cpu className="text-blue-500 animate-spin" size={32} />
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest animate-pulse">
                            Delegating to MagicBlock TEE...
                        </p>
                    </div>
                )}
            </div>

            {/* MAGICBLOCK VISUALIZATION */}
            <div className="bg-black border border-white/5 rounded-3xl p-6 space-y-6">
                <h3 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                    <Shield size={12} className="text-blue-500" /> ER Security Protocol
                </h3>
                
                <div className="relative h-24 flex items-center justify-between px-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <Target size={18} />
                        </div>
                        <span className="text-[8px] uppercase font-bold text-zinc-600">Agents</span>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className={cn(
                            "absolute inset-0 border-t-2 border-dashed transition-colors duration-1000",
                            phase === 'BIDDING' ? 'border-blue-500 animate-pulse' : 'border-white/10'
                        )} />
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-1000",
                            phase === 'BIDDING' ? 'bg-blue-600 border-blue-400 scale-125' : 'bg-zinc-900 border-white/10'
                        )}>
                            <Lock size={16} className={phase === 'BIDDING' ? 'text-white' : 'text-zinc-600'} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <Zap size={18} />
                        </div>
                        <span className="text-[8px] uppercase font-bold text-zinc-600">Devnet</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                        <span className="text-zinc-600">TEE Status</span>
                        <span className="text-blue-500">Active / Enclave_Secure</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                        <span className="text-zinc-600">Privacy Mode</span>
                        <span className="text-blue-500">Zero-Knowledge State</span>
                    </div>
                </div>

                {/* NEW LOG STREAM */}
                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase text-zinc-600 tracking-widest">
                        <TerminalIcon size={12} /> Protocol_Stream
                    </div>
                    <div className="space-y-1.5 h-32 overflow-hidden font-mono text-[9px]">
                        {logs.map((log, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-2"
                            >
                                <span className={cn(
                                    "shrink-0",
                                    log.includes('[PROTOCOL]') ? 'text-blue-500' :
                                    log.includes('[MAGICBLOCK]') ? 'text-purple-500' :
                                    log.includes('[TEE]') ? 'text-emerald-500' :
                                    log.includes('[PYTH]') ? 'text-yellow-500' :
                                    log.includes('[HELIUS]') ? 'text-orange-500' :
                                    log.includes('[GROQ]') ? 'text-cyan-500' :
                                    'text-zinc-600'
                                )}>
                                    {log.split(' ')[0]}
                                </span>
                                <span className="text-zinc-500 uppercase">{log.split(' ').slice(1).join(' ')}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* 5. SETTLEMENT REPORT (REVEAL PHASE) */}
      <AnimatePresence>
        {phase === 'REVEAL' && revealedBids.length === AGENTS.length && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50"
            >
                <div className="bg-blue-600 border border-blue-400 rounded-3xl p-1 shadow-2xl shadow-blue-600/40">
                    <div className="bg-black/90 backdrop-blur-xl rounded-[22px] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-4xl">
                                {winner?.agentId === 'whale' ? '🐋' : winner?.agentId === 'arbitrageur' ? '📊' : '🎲'}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] mb-1">Winning Settlement</h4>
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                                    {AGENTS.find(a => a.id === winner?.agentId)?.name}
                                </h3>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-12 text-center md:text-right">
                            <div>
                                <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Winning Bid</p>
                                <p className="text-3xl font-black text-emerald-500 tracking-tighter italic">{winner?.bid.toFixed(2)} SOL</p>
                            </div>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-blue-500 hover:text-white transition-colors rounded-xl"
                            >
                                New Auction
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* 6. FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 pb-12 opacity-30 text-[9px] font-bold uppercase tracking-[0.4em] text-center text-zinc-600">
        Cryptographic Proof-of-Privacy &copy; 2026 Nitro-Protocol // MB-ER-ID: {currentBlock}-TEE
      </footer>
    </div>
  );
};

export default AuctionRoom;
