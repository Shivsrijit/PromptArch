import React from 'react';

export const SectionHeading: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="mb-12 text-center md:text-left">
    <h2 className="text-5xl md:text-6xl font-bold mb-4 serif tracking-tight text-inherit">{title}</h2>
    <p className="text-lg text-zinc-500 max-w-2xl font-light">{subtitle}</p>
  </div>
);