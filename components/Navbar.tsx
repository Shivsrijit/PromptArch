
import React from 'react';
import { AppMode } from '../types';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  mode, setMode, isDarkMode, toggleTheme, user, onOpenAuth, onSignOut 
}) => {
  const navItems = [
    { mode: AppMode.HOME, label: 'Home', icon: 'fa-house' },
    { mode: AppMode.REVERSE_ENGINEER, label: 'Deconstruct', icon: 'fa-puzzle-piece' },
    { mode: AppMode.STYLE_TRANSFER, label: 'Remix', icon: 'fa-wand-magic-sparkles' },
    { mode: AppMode.IMAGE_GEN, label: 'Construct', icon: 'fa-layer-group' },
    { mode: AppMode.TRENDING_FEED, label: 'Feed', icon: 'fa-fire' },
    { mode: AppMode.MY_LIBRARY, label: 'Library', icon: 'fa-bookmark' },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center bg-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => setMode(AppMode.HOME)}>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full btn-primary flex items-center justify-center text-lg md:text-xl serif italic font-bold group-hover:rotate-12 transition-transform">P</div>
            <span className="text-xl serif font-semibold tracking-tight hidden sm:block text-inherit">Prompt <span className="italic font-normal opacity-40">Architect</span>
          </span>
        </div>
        
        <div className="pointer-events-auto flex items-center gap-2 md:gap-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 glass-panel px-2 py-2 rounded-full shadow-xl">
            {navItems.map((item) => (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all uppercase ${mode === item.mode ? 'btn-primary shadow-lg scale-105' : 'text-zinc-500 hover:text-inherit'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="glass-panel px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 md:gap-3 border border-zinc-500/10 shadow-lg">
                {user.user_metadata.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/20" alt="User" />
                ) : (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent-lavender flex items-center justify-center text-[10px] text-black font-bold">{user.email?.charAt(0).toUpperCase()}</div>
                )}
                <button onClick={onSignOut} className="hover:text-accent-peach transition-colors text-[9px] md:text-[10px] uppercase font-black">Sign Out</button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="glass-panel px-4 py-2 md:px-6 md:py-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest btn-primary shadow-lg border-transparent"
              >
                Sign In
              </button>
            )}
            
            <button 
              onClick={toggleTheme}
              className="glass-panel p-2 md:p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-lg md:text-xl text-inherit"
              title="Toggle Light/Dark Mode"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 glass-panel rounded-3xl p-2 flex items-center justify-around shadow-2xl border border-zinc-500/20">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`flex flex-col items-center justify-center w-12 py-2 gap-1 transition-all rounded-2xl ${
              mode === item.mode ? 'bg-zinc-500/10' : 'text-zinc-500'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg ${mode === item.mode ? 'gradient-subtle' : ''}`}></i>
            <span className={`text-[8px] uppercase font-black tracking-tighter ${mode === item.mode ? 'text-inherit opacity-100' : 'opacity-40'}`}>
              {item.label === 'Deconstruct' ? 'Map' : item.label}
            </span>
            {mode === item.mode && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full btn-primary"></div>
            )}
          </button>
        ))}
      </nav>
    </>
  );
};
