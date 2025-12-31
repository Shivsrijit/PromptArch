
import React from 'react';
import { SectionHeading } from './SectionHeading';

interface Props {
  sourceImage: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentPrompt: string;
  setCurrentPrompt: (val: string) => void;
  onPublish: () => void;
  onNavigateToRemix: () => void;
}

export const ReverseEngineerSection: React.FC<Props> = ({ 
  sourceImage, onUpload, currentPrompt, setCurrentPrompt, onPublish, onNavigateToRemix 
}) => (
  <div className="animate-in fade-in duration-700">
    <SectionHeading title="Deconstruct" subtitle="Map the visual coordinates of any image." />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7">
        <div className="relative group cursor-pointer aspect-[4/5] rounded-[40px] overflow-hidden bg-zinc-800 shadow-2xl">
          <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
          {sourceImage ? (
            <img src={sourceImage} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="Reference" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 mb-6 rounded-full border border-zinc-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🧩</div>
              <p className="text-xl serif italic mb-2">Upload Reference</p>
            </div>
          )}
        </div>
      </div>
      <div className="lg:col-span-5 flex flex-col justify-center">
        <div className="glass-panel p-10 rounded-[40px] space-y-8">
          <textarea 
            value={currentPrompt} 
            onChange={(e) => setCurrentPrompt(e.target.value)} 
            placeholder="Awaiting DNA scan..." 
            className="w-full h-64 bg-transparent text-xl serif italic resize-none focus:outline-none scrollbar-hide text-inherit" 
          />
          <div className="pt-6 border-t border-zinc-500/10 flex gap-4">
            <button onClick={onPublish} disabled={!currentPrompt} className="flex-1 btn-primary py-4 rounded-2xl text-xs uppercase tracking-widest disabled:opacity-30 font-bold">Publish Style</button>
            <button onClick={onNavigateToRemix} className="flex-1 py-4 border border-zinc-500/10 hover:bg-zinc-500/5 rounded-2xl text-xs uppercase tracking-widest transition-all text-inherit font-medium">Remix Selfie</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
