"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  publishedAt: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isOverdue: boolean;
}

function calculateTimeLeft(publishedAt: string): TimeLeft {
  const deadline = new Date(publishedAt).getTime() + 24 * 60 * 60 * 1000;
  const now = Date.now();
  const diff = deadline - now;

  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalMs: diff,
    isOverdue: diff < 0,
  };
}

function getStatusLabel(totalMs: number, isOverdue: boolean): { text: string; color: string } {
  if (isOverdue) {
    const overdueHours = Math.abs(totalMs) / (1000 * 60 * 60);
    if (overdueHours > 2) return { text: "Cam, bro, you missed the upload.", color: "text-red-400" };
    return { text: "Cam is cooking... hopefully.", color: "text-orange-400" };
  }

  const hoursLeft = totalMs / (1000 * 60 * 60);
  if (hoursLeft > 12) return { text: "Cam actually has time.", color: "text-emerald-400" };
  if (hoursLeft > 6) return { text: "Tick tock, Cam.", color: "text-yellow-400" };
  if (hoursLeft > 2) return { text: "Cam better be rendering.", color: "text-orange-400" };
  return { text: "Cam is panicking.", color: "text-red-400" };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function Countdown({ publishedAt }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(publishedAt));

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(publishedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [publishedAt]);

  const status = getStatusLabel(timeLeft.totalMs, timeLeft.isOverdue);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="text-center">
        <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest mb-4">
          Loading countdown...
        </p>
        <div className="font-mono text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[var(--text-primary)]">
          --:--:--
        </div>
      </div>
    );
  }

  return (
    <div className="text-center animate-fade-in">
      <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest mb-4">
        {timeLeft.isOverdue ? "Cam is late by" : "Tip2Tip new upload is due in"}
      </p>

      <div
        className={`font-mono text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight ${timeLeft.isOverdue ? "text-red-400" : "text-[var(--text-primary)]"
          } countdown-pulse`}
      >
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </div>

      <div className={`mt-6 text-sm font-medium ${status.color} animate-fade-in`}>
        {status.text}
      </div>
    </div>
  );
}
