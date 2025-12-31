import React from 'react';
import { AppMode } from '../types';

interface HomeHeroProps {
  setMode: (mode: AppMode) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ setMode }) => (
  <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 py-20">
      <span className="text-[10px] uppercase tracking-[0.5em] text-accent-lavender font-bold">The Future of Visual Synthesis</span>
      <h1 className="text-6xl md:text-8xl font-bold serif leading-tight text-inherit">
        Architect of the <br /> <span className="gradient-subtle italic">Visual Future</span>
      </h1>
      <p className="text-xl text-zinc-500 max-w-2xl font-light leading-relaxed">
        Deconstruct inspiration, engineer perfect prompts, and apply high-fidelity aesthetics to your own photography with subject-locked precision.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-8">
        <button onClick={() => setMode(AppMode.REVERSE_ENGINEER)} className="btn-primary px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl">Start Deconstructing</button>
        <button onClick={() => setMode(AppMode.TRENDING_FEED)} className="glass-panel px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest border border-zinc-500/20 hover:bg-zinc-500/5 transition-colors text-inherit">Explore Feed</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
      {[
        { title: 'Deconstruct', icon: '🧩', desc: 'Reverse engineer the visual DNA of any masterpiece.', target: AppMode.REVERSE_ENGINEER },
        { title: 'Remix', icon: '🌀', desc: 'Apply style markers to your own photos while keeping identities intact.', target: AppMode.STYLE_TRANSFER },
        { title: 'Construct', icon: '✧', desc: 'Materialize high-fidelity images from prompt deconstructions.', target: AppMode.IMAGE_GEN },
      ].map(card => (
        <div key={card.title} onClick={() => setMode(card.target)} className="glass-panel p-8 rounded-[40px] hover:scale-[1.03] transition-all cursor-pointer group shadow-lg">
          <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{card.icon}</div>
          <h3 className="text-2xl serif font-bold mb-2 text-inherit">{card.title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">{card.desc}</p>
        </div>
      ))}
    </div>
  </div>
);