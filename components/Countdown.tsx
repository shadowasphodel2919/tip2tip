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

  return { hours, minutes, seconds, totalMs: diff, isOverdue: diff < 0 };
}

function getStatusInfo(totalMs: number, isOverdue: boolean): { text: string; icon: string; color: string } {
  if (isOverdue) {
    const overdueHours = Math.abs(totalMs) / (1000 * 60 * 60);
    if (overdueHours > 2) return { text: "Cam, bro, you missed the upload.", icon: "✖", color: "#ff0000" };
    return { text: "Cam is cooking... hopefully.", icon: "⚠", color: "#ff8000" };
  }
  const hoursLeft = totalMs / (1000 * 60 * 60);
  if (hoursLeft > 12) return { text: "Cam actually has time.", icon: "✔", color: "#008000" };
  if (hoursLeft > 6)  return { text: "Tick tock, Cam.", icon: "⚠", color: "#808000" };
  if (hoursLeft > 2)  return { text: "Cam better be rendering.", icon: "⚠", color: "#ff8000" };
  return { text: "Cam is panicking.", icon: "✖", color: "#ff0000" };
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

  const status = getStatusInfo(timeLeft.totalMs, timeLeft.isOverdue);

  if (!mounted) {
    return (
      <div className="text-center py-4">
        <p className="text-xs mb-3" style={{ color: "var(--win-btn-shadow)" }}>
          Loading countdown...
        </p>
        <div className="win-countdown inline-block">--:--:--</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in text-center py-2">
      {/* Label */}
      <p className="text-xs font-bold uppercase mb-3" style={{ color: "var(--win-btn-dark-shadow)", letterSpacing: "0.1em" }}>
        {timeLeft.isOverdue ? "⏰ Cam is late by" : "⏰ New upload due in"}
      </p>

      {/* Digital display */}
      <div className={`win-countdown ${timeLeft.isOverdue ? "overdue" : ""}`}>
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </div>

      {/* Progress bar */}
      <div className="mt-4 mx-auto max-w-xs">
        <div
          className="h-4 w-full win-sunken overflow-hidden"
          role="progressbar"
          aria-label="Time remaining"
        >
          {(() => {
            const totalWindow = 24 * 60 * 60 * 1000;
            const elapsed = totalWindow - Math.max(timeLeft.totalMs, 0);
            const pct = Math.min(100, Math.max(0, (elapsed / totalWindow) * 100));
            return (
              <div
                className="h-full"
                style={{
                  width: `${pct}%`,
                  background: timeLeft.isOverdue
                    ? "#ff0000"
                    : pct > 80
                    ? "#ff8000"
                    : "#0000ff",
                  transition: "width 1s linear",
                }}
              />
            );
          })()}
        </div>
        <div className="flex justify-between text-xs mt-0.5" style={{ color: "var(--win-btn-shadow)" }}>
          <span>0h</span>
          <span>24h</span>
        </div>
      </div>

      {/* Status message */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div
          className="win-raised px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
          style={{ color: status.color }}
        >
          <span>{status.icon}</span>
          <span>{status.text}</span>
        </div>
      </div>
    </div>
  );
}
