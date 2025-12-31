
import React from 'react';
import { SectionHeading } from './SectionHeading';
import { ImageAdjustments, ChatMessage } from '../types';

interface Props {
  dynamicAttributes: string[];
  selectedAttributes: string[];
  toggleAttribute: (attr: string) => void;
  userTargetImage: string | null;
  generatedImage: string | null;
  onTargetUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyStyle: () => void;
  onPublish: () => void;
  adjustments: ImageAdjustments;
  onAdjustmentsChange: (adjustments: ImageAdjustments) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  onChatSubmit: (e: React.FormEvent) => void;
  chatScrollRef: React.RefObject<HTMLDivElement>;
  downloadImage: () => void;
}

export const RemixSection: React.FC<Props> = ({
  dynamicAttributes, selectedAttributes, toggleAttribute, userTargetImage, generatedImage,
  onTargetUpload, onApplyStyle, onPublish, adjustments, onAdjustmentsChange, chatMessages, chatInput,
  setChatInput, onChatSubmit, chatScrollRef, downloadImage
}) => {
  const handleAdjChange = (key: keyof ImageAdjustments, val: number) => {
    onAdjustmentsChange({ ...adjustments, [key]: val });
  };

  const resetAdjustments = () => {
    onAdjustmentsChange({
      brightness: 100,
      contrast: 100,
      rotation: 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0
    });
  };

  return (
    <div className="animate-in fade-in duration-700">
      <SectionHeading title="Studio Remix" subtitle="Subject-locked transformation studio." />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          {/* Aesthetic Markers */}
          <div className="glass-panel p-6 rounded-[32px] space-y-4">
            <div className="flex justify-between items-end"><span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">DNA Markers</span></div>
            {dynamicAttributes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dynamicAttributes.map(attr => (
                  <button 
                    key={attr} 
                    onClick={() => toggleAttribute(attr)} 
                    className={`px-3 py-1.5 rounded-full text-[10px] uppercase border transition-all ${selectedAttributes.includes(attr) ? 'btn-primary border-transparent' : 'border-zinc-500/20 text-zinc-500'}`}
                  >
                    {attr}
                  </button>
                ))}
              </div>
            ) : <p className="text-[10px] text-zinc-500 italic">No markers detected. Use Deconstruct first.</p>}
          </div>

          {/* Manual Tuning Panel */}
          <div className="glass-panel p-6 rounded-[32px] space-y-5 h-fit">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Geometry & Color</span>
              <button onClick={resetAdjustments} className="text-[9px] uppercase font-bold text-accent-lavender hover:opacity-70">Reset</button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {/* Scale (Zoom/Crop) */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400">
                  <span>Zoom (Crop)</span>
                  <span>{adjustments.scale.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="1" max="3" step="0.1" value={adjustments.scale} 
                  onChange={(e) => handleAdjChange('scale', parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent-lavender"
                />
              </div>

              {/* Pan X */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400">
                  <span>Offset X</span>
                  <span>{adjustments.offsetX}px</span>
                </div>
                <input 
                  type="range" min="-200" max="200" value={adjustments.offsetX} 
                  onChange={(e) => handleAdjChange('offsetX', parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500"
                />
              </div>

              {/* Pan Y */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400">
                  <span>Offset Y</span>
                  <span>{adjustments.offsetY}px</span>
                </div>
                <input 
                  type="range" min="-200" max="200" value={adjustments.offsetY} 
                  onChange={(e) => handleAdjChange('offsetY', parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500"
                />
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400">
                  <span>Rotation</span>
                  <span>{adjustments.rotation}°</span>
                </div>
                <input 
                  type="range" min="-180" max="180" value={adjustments.rotation} 
                  onChange={(e) => handleAdjChange('rotation', parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500"
                />
              </div>

              <div className="border-t border-zinc-500/10 my-4"></div>

              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400">
                  <span>Brightness</span>
                  <span>{adjustments.brightness}%</span>
                </div>
                <input 
                  type="range" min="0" max="200" value={adjustments.brightness} 
                  onChange={(e) => handleAdjChange('brightness', parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent-peach"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400">
                  <span>Contrast</span>
                  <span>{adjustments.contrast}%</span>
                </div>
                <input 
                  type="range" min="0" max="200" value={adjustments.contrast} 
                  onChange={(e) => handleAdjChange('contrast', parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent-peach"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={onApplyStyle} className="w-full py-5 btn-primary rounded-[24px] text-sm uppercase tracking-widest shadow-xl font-bold">Shift Aesthetic</button>
            {generatedImage && <button onClick={onPublish} className="w-full py-4 border border-zinc-500/10 rounded-[24px] text-[10px] uppercase tracking-widest font-bold text-inherit">Publish Remix</button>}
          </div>
        </div>
        
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[40px] overflow-hidden shadow-2xl border border-zinc-500/20 relative bg-black aspect-square flex items-center justify-center">
            {(userTargetImage || generatedImage) ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
                <img 
                  src={generatedImage || userTargetImage || ''} 
                  style={{ 
                    filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%)`,
                    transform: `scale(${adjustments.scale}) rotate(${adjustments.rotation}deg) translate(${adjustments.offsetX}px, ${adjustments.offsetY}px)`,
                    transition: 'filter 0.3s ease'
                  }} 
                  className="max-w-full max-h-[70vh] object-contain shadow-2xl" 
                  alt="Preview"
                />
                <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-20">
                  <button onClick={downloadImage} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl shadow-xl">↓</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center relative w-full h-full cursor-pointer">
                <input type="file" accept="image/*" onChange={onTargetUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                <div className="w-24 h-24 rounded-full bg-zinc-500/10 border border-zinc-500/20 flex items-center justify-center text-4xl mb-4">📸</div>
                <p className="serif italic text-2xl text-zinc-500 font-medium">Upload Anchor Selfie</p>
              </div>
            )}
          </div>
          <div className="glass-panel rounded-[32px] flex flex-col h-[300px]">
            <div className="p-4 border-b border-zinc-500/10 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent-lavender animate-pulse"></span><span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Studio Chat</span></div>
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide text-xs serif italic text-zinc-500">
              {chatMessages.length === 0 && <p>Identity anchored. Request adjustments or apply style markers.</p>}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'btn-primary shadow-sm' : 'glass-panel text-inherit'}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={onChatSubmit} className="p-4 border-t border-zinc-500/10 flex gap-3">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Refine results..." className="flex-1 bg-zinc-500/5 border border-zinc-500/10 rounded-full px-6 py-3 text-sm focus:outline-none text-inherit" />
              <button type="submit" className="w-12 h-12 rounded-full btn-primary flex items-center justify-center text-lg shadow-lg">↵</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
