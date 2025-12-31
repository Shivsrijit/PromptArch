import React from 'react';

export const Footer: React.FC = () => (
  <footer className="mt-32 pb-12 border-t border-zinc-500/10 pt-16 px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-inherit">
      <div className="col-span-1 md:col-span-2 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full btn-primary flex items-center justify-center text-lg serif italic font-bold">P</div>
          <span className="text-xl serif font-semibold tracking-tight">Prompt <span className="italic font-normal text-zinc-400">Architect</span></span>
        </div>
        <p className="text-zinc-500 max-w-xs text-sm">
          Deconstructing the future of visual intelligence. Turn inspiration into reusable DNA.
        </p>
      </div>
      <div className="space-y-4">
        <h4 className="text-xs uppercase tracking-widest font-bold opacity-60">Connect</h4>
        <ul className="text-sm space-y-2 text-zinc-500">
          <li><a href="mailto:shivsrijit@gmail.com" className="hover:text-accent-lavender transition-colors">Email Us</a></li>
          <li><a href="https://github.com/Shivsrijit/PromptArch" className="hover:text-accent-lavender transition-colors">GitHub Repository</a></li>
          <li><a href="https://x.com/shivsrijit" className="hover:text-accent-lavender transition-colors">Twitter / X</a></li>
        </ul>
      </div>
      <div className="space-y-4">
        <h4 className="text-xs uppercase tracking-widest font-bold opacity-60">Product</h4>
        <ul className="text-sm space-y-2 text-zinc-500">
          <li>&copy; 2025 PromptArch</li>
          <li>All Rights Reserved.</li>
          <li>Using Gemini NanoBanana</li>
        </ul>
      </div>
    </div>
  </footer>
);