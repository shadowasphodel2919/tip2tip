"use client";

import { useState, useEffect } from "react";
import { incrementHype } from "@/app/actions/community";

interface HypeButtonProps {
  initialCount: number;
}

export default function HypeButton({ initialCount }: HypeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isHyped, setIsHyped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user has already hyped Cam in this session/browser
    const hasHyped = localStorage.getItem("cam_hyped");
    if (hasHyped) {
      setIsHyped(true);
    }
  }, []);

  const handleHype = async () => {
    if (isHyped || loading) return;

    setLoading(true);
    // Optimistic UI update
    setCount((prev) => prev + 1);
    setIsHyped(true);
    localStorage.setItem("cam_hyped", "true");

    const result = await incrementHype();
    if (result && result.success) {
      setCount(result.count);
    } else {
      // Revert if failed
      setCount((prev) => prev - 1);
      setIsHyped(false);
      localStorage.removeItem("cam_hyped");
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-1 py-1 pr-4 rounded-full shadow-lg">
      <button
        onClick={handleHype}
        disabled={isHyped || loading}
        className={`flex items-center justify-center h-10 px-4 rounded-full font-medium transition-all duration-300 text-sm ${
          isHyped
            ? "bg-white/10 text-[var(--text-muted)] cursor-not-allowed"
            : "bg-[#ef4444] text-white hover:bg-[#dc2626] hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
        }`}
      >
        {isHyped ? "Hyped 💛" : "Hype Cam ⚡"}
      </button>

      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] leading-none mb-0.5">
          Fans rooting
        </span>
        <span className="text-sm font-bold text-[#facc15] leading-none">
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
