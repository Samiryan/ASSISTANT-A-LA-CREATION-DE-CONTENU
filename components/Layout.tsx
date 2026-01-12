
import React from 'react';

export const Header: React.FC = () => (
  <header className="border-b border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#00F3FF] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)]">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-xl font-extrabold tracking-tighter uppercase">
          OmniContent <span className="text-[#00F3FF]">Architect</span>
        </h1>
      </div>
      <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
        <span className="hover:text-[#00F3FF] cursor-pointer transition-colors">Stratégie</span>
        <span className="hover:text-[#00F3FF] cursor-pointer transition-colors">Assets</span>
        <span className="hover:text-[#00F3FF] cursor-pointer transition-colors">ROI</span>
      </div>
    </div>
  </header>
);

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    {children}
  </main>
);
