"use client";

import { useState, useEffect } from "react";
// Trip is over — hype can no longer be incremented, kept for future reuse
// import { incrementHype } from "@/app/actions/community";

interface HypeButtonProps {
  initialCount: number;
}

interface HypeData {
  count: number;
  lastHypedAt: number;
}

export default function HypeButton({ initialCount }: HypeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hypeData, setHypeData] = useState<HypeData>({ count: 0, lastHypedAt: 0 });
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const rawData = localStorage.getItem("cam_hyped_data");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setHypeData(parsed);
      } catch (e) {
        // Fallback or old data
      }
    } else {
      // Migrate old "cam_hyped" string if exists
      const oldVal = localStorage.getItem("cam_hyped");
      if (oldVal === "true") {
        const migrated = { count: 1, lastHypedAt: Date.now() - 60000 };
        setHypeData(migrated);
        localStorage.setItem("cam_hyped_data", JSON.stringify(migrated));
        localStorage.removeItem("cam_hyped");
      }
    }
  }, []);

  useEffect(() => {
    // Timer to calculate lock state
    const checkTimer = () => {
      const now = Date.now();
      const diff = now - hypeData.lastHypedAt;
      if (diff < 60000 && hypeData.count > 0 && hypeData.count < 5) {
        setTimeLeft(Math.ceil((60000 - diff) / 1000));
      } else {
        setTimeLeft(0);
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [hypeData.lastHypedAt, hypeData.count]);

  const isMaxedOut = hypeData.count >= 5;
  // Trip is over — hype button is permanently locked
  const isLocked = true;

  const handleHype = async () => {
    // Trip is over — hype incrementing is disabled
    return;

    /* Kept for future reuse:
    if (isLocked || loading) return;

    setLoading(true);
    
    const newData = {
      count: hypeData.count + 1,
      lastHypedAt: Date.now(),
    };

    // Optimistic UI update
    setCount((prev) => prev + 1);
    setHypeData(newData);
    localStorage.setItem("cam_hyped_data", JSON.stringify(newData));

    const result = await incrementHype();
    if (result && result.success) {
      setCount(result.count);
    } else {
      // Revert if failed
      setCount((prev) => prev - 1);
      setHypeData(hypeData);
      localStorage.setItem("cam_hyped_data", JSON.stringify(hypeData));
    }
    setLoading(false);
    */
  };

  const getButtonText = () => {
    // Trip is over — always show locked state
    return "Trip's Over 🏁";
    /* Kept for future reuse:
    if (isMaxedOut) return "Maxed 💛";
    if (timeLeft > 0) return `Wait ${timeLeft}s`;
    if (hypeData.count > 0) return "Hype Again ⚡";
    return "Hype Cam ⚡";
    */
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-1 py-1 pr-4 rounded-full shadow-lg">
      <button
        onClick={handleHype}
        disabled={isLocked || loading}
        className={`flex items-center justify-center h-10 px-4 rounded-full font-medium transition-all duration-300 text-sm ${
          isLocked
            ? "bg-white/10 text-[var(--text-muted)] cursor-not-allowed"
            : "bg-[#ef4444] text-white hover:bg-[#dc2626] hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
        }`}
      >
        {getButtonText()}
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
