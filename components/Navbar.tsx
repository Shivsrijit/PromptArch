
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
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-transparent pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 cursor-pointer group" onClick={() => setMode(AppMode.HOME)}>
        <div className="w-10 h-10 rounded-full btn-primary flex items-center justify-center text-xl serif italic font-bold group-hover:rotate-12 transition-transform">P</div>
        <span className="text-xl serif font-semibold tracking-tight hidden sm:block text-inherit">Prompt <span className="italic font-normal opacity-40">Architect</span></span>
      </div>
      
      <div className="pointer-events-auto flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 glass-panel px-2 py-2 rounded-full shadow-xl">
          {(Object.values(AppMode) as AppMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all uppercase ${mode === m ? 'btn-primary shadow-lg scale-105' : 'text-zinc-500 hover:text-inherit'}`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 border border-zinc-500/10 shadow-lg">
                {user.user_metadata.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="w-6 h-6 rounded-full border border-white/20" alt="User" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-accent-lavender flex items-center justify-center text-[10px] text-black font-bold">{user.email?.charAt(0).toUpperCase()}</div>
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:block opacity-60">Architect</span>
                <button onClick={onSignOut} className="hover:text-accent-peach transition-colors text-[10px] uppercase font-black ml-2">Sign Out</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="glass-panel px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest btn-primary shadow-lg border-transparent"
            >
              Sign In
            </button>
          )}
          
          <button 
            onClick={toggleTheme}
            className="pointer-events-auto glass-panel p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-xl text-inherit"
            title="Toggle Light/Dark Mode"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};
