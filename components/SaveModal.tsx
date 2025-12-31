import React from 'react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempName: string;
  setTempName: (name: string) => void;
  onSave: (isPublic: boolean) => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, tempName, setTempName, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-md p-8 rounded-[32px] space-y-6 shadow-2xl">
        <h3 className="text-2xl serif italic text-inherit">Publish Creation</h3>
        <input 
          type="text" 
          autoFocus
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          placeholder="Title your creation..."
          className="w-full bg-zinc-500/5 border border-zinc-500/20 p-4 rounded-xl focus:outline-none focus:border-accent-lavender text-inherit"
        />
        <div className="flex flex-col gap-3">
          <button onClick={() => onSave(true)} className="btn-primary py-3 rounded-xl text-sm shadow-lg font-bold uppercase tracking-widest">Share to Community Canvas</button>
          <button onClick={() => onSave(false)} className="bg-zinc-500/10 border border-zinc-500/20 py-3 rounded-xl text-sm text-inherit font-medium">Save Privately</button>
          <button onClick={onClose} className="py-2 text-xs text-zinc-500 uppercase tracking-widest mt-2 hover:text-inherit">Cancel</button>
        </div>
      </div>
    </div>
  );
};