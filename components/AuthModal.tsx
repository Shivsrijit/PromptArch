import React from 'react';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error('Login error:', error.message);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-sm p-10 rounded-[40px] space-y-8 shadow-2xl text-center border border-zinc-500/20">
        <div className="w-16 h-16 rounded-full btn-primary mx-auto flex items-center justify-center text-3xl serif italic font-bold">P</div>
        <div className="space-y-2">
          <h3 className="text-3xl serif italic text-inherit">Join the Archive</h3>
          <p className="text-zinc-500 text-sm font-light">Sign in to save your visual DNA and contribute to the community feed.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg"
          >
            <i className="fa-brands fa-google text-lg"></i> Continue with Google
          </button>
          <button 
            onClick={() => handleLogin('github')}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg border border-white/10"
          >
            <i className="fa-brands fa-github text-lg"></i> Continue with GitHub
          </button>
        </div>
        
        <button onClick={onClose} className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-inherit font-bold">Explore as Guest</button>
      </div>
    </div>
  );
};
