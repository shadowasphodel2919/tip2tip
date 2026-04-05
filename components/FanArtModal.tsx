"use client";

import { useState, useEffect } from "react";

export default function FanArtModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-[#111] border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:border-[#facc15]/50 transition-all duration-300 group hover:scale-110 active:scale-95"
        aria-label="Fan Art Info"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white/60 group-hover:text-[#facc15] transition-colors"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl overflow-hidden transform scale-100 opacity-100 transition-all duration-300">
            
            {/* Subtle glow effect behind content */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ef4444]/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-[var(--text-primary)] font-bold text-lg tracking-wide flex items-center gap-2">
                Fan Art Wall? <span className="text-xl">🎨</span>
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <p className="text-[var(--text-muted)] text-[15px] leading-relaxed mb-8 relative z-10">
              I'm thinking of making a wall of fan art or pictures. If anyone wants to submit their art, tweet it and tag me and I'll be sure to add it.
            </p>

            <a 
              href="https://x.com/thetahajamal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative z-10 w-full flex items-center justify-center gap-2 bg-[#ef4444] text-white py-3.5 rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Tweet & Tag Me
            </a>
          </div>
        </div>
      )}
    </>
  );
}
