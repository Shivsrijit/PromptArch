import React from 'react';

export const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 border-b-2 border-[#d4c1ec] rounded-full animate-spin" style={{borderColor: '#d4c1ec', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent'}}></div>
      <div className="absolute inset-2 border-t-2 border-[#ffd6ba] rounded-full animate-spin-slow" style={{borderColor: '#ffd6ba', borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent', animationDuration: '3s'}}></div>
    </div>
    <p className="text-2xl serif italic tracking-wide text-white animate-pulse">{message}</p>
    <p className="text-xs uppercase tracking-[0.3em] text-white/30 mt-4">PromptArch is Working</p>
  </div>
);