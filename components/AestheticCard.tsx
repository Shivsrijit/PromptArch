
import React from 'react';
import { PublicPrompt } from '../types';

interface AestheticCardProps {
  prompt: PublicPrompt;
  onAdopt: () => void;
  onLike?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  isLibrary?: boolean;
  currentUserId?: string;
  isLiked?: boolean;
}

export const AestheticCard: React.FC<AestheticCardProps> = ({ 
  prompt, onAdopt, onLike, onDelete, onEdit, isLibrary, currentUserId, isLiked 
}) => {
  const isOwner = currentUserId && prompt.userId === currentUserId;

  return (
    <div className="pinterest-card group flex flex-col p-4 shadow-sm border border-zinc-500/10">
      <div className="relative aspect-square rounded-[24px] overflow-hidden mb-5 bg-zinc-800">
        {prompt.sourceImageUrl ? (
          <img src={prompt.sourceImageUrl} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" alt={prompt.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-900 text-6xl font-bold italic serif bg-zinc-700/20">P</div>
        )}
        
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
          {isOwner && (
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors"
                title="Edit Name"
              >
                <i className="fa-solid fa-pen text-[10px]"></i>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-200 backdrop-blur-md transition-colors"
                title="Delete"
              >
                <i className="fa-solid fa-trash text-[10px]"></i>
              </button>
            </div>
          )}

          <p className="text-xs italic text-white/90 mb-4 line-clamp-3 serif">"{prompt.text}"</p>
          <button 
            onClick={onAdopt}
            className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-110 transition-transform"
          >
            {isLibrary ? 'Apply Style' : 'Adopt DNA'}
          </button>
        </div>
      </div>

      <div className="px-1 flex justify-between items-start text-inherit">
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-lg serif font-medium line-clamp-1 truncate">{prompt.name}</h4>
          {!isLibrary && <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">By <span className="text-accent-lavender font-bold">{prompt.author}</span></p>}
        </div>
        {onLike && (
          <button onClick={onLike} className="flex flex-col items-center group/like shrink-0">
            <span className={`text-xl transition-all duration-300 ${isLiked ? 'scale-125 grayscale-0' : 'grayscale group-hover/like:grayscale-0 group-hover/like:scale-110'}`}>
              {isLiked ? '💎' : '💎'}
            </span>
            <span className={`text-[10px] font-bold mt-1 transition-colors ${isLiked ? 'text-accent-lavender' : 'text-zinc-400'}`}>
              {prompt.likes}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
