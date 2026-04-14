"use client";

import { useState } from "react";
// Trip is over — submission action is no longer called, kept for future reuse
// import { submitSupportMessage } from "@/app/actions/community";
import { SupportMessage } from "@/app/actions/community";

interface SupportWallProps {
  recentMessages: SupportMessage[];
  topMessages: SupportMessage[];
}

export default function SupportWall({ recentMessages, topMessages }: SupportWallProps) {
  const [visibleRecentCount, setVisibleRecentCount] = useState(10);
  const [visibleTopCount, setVisibleTopCount] = useState(10);

  const visibleRecentMessages = recentMessages.slice(0, visibleRecentCount);
  const visibleTopMessages = topMessages.slice(0, visibleTopCount);

  const handleSeeMoreRecent = () => {
    setVisibleRecentCount((prev) => prev + 10);
  };

  const handleSeeMoreTop = () => {
    setVisibleTopCount((prev) => prev + 10);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
          Messages from the road
        </h2>
        <p className="mt-2 text-[var(--text-muted)]">
          A little love for Ludwig, Michael, Cam, the editors, and everyone behind the scenes.
        </p>
      </div>

      {/* Submission Form — Trip is over, new comments are closed */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 mb-16 shadow-lg max-w-2xl mx-auto opacity-60">
        <div className="text-center mb-5">
          <span className="inline-block bg-white/10 text-[var(--text-muted)] text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10 mb-3">
            🏁 Trip Complete — Comments Closed
          </span>
          <p className="text-xs text-[var(--text-secondary)]">
            The trip has ended. New messages are no longer being accepted.
          </p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="name" className="block text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1.5">
                Name <span className="opacity-50">(optional)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                disabled
                className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] cursor-not-allowed opacity-50 placeholder:text-white/20"
                placeholder="Anonymous"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1.5">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              disabled
              rows={3}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] resize-none cursor-not-allowed opacity-50 placeholder:text-white/20"
              placeholder="Comments are now closed..."
            />
          </div>
          <button
            type="button"
            disabled
            className="mt-2 bg-white/10 text-[var(--text-muted)] font-medium px-6 py-3 rounded-lg cursor-not-allowed opacity-50"
          >
            Comments Closed
          </button>
        </form>
      </div>

      {/* Top Comments Section */}
      {topMessages.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text-secondary)] mb-6 border-b border-white/10 pb-2">
            Top Comments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleTopMessages.map((msg) => (
              <div key={`top-${msg.id}`} className="bg-[var(--danger)]/20 border border-[var(--text-secondary)]/30 rounded-xl p-6 break-words relative overflow-hidden group hover:border-[var(--text-secondary)]/60 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-50">⭐</div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-semibold text-[var(--text-secondary)]">{msg.name}</span>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
          {visibleTopCount < topMessages.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSeeMoreTop}
                className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors text-sm text-[var(--text-primary)]"
              >
                See More Top Comments 👇
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recent Messages Section */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-6 border-b border-white/10 pb-2">
          Recent Messages
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleRecentMessages.map((msg) => (
            <div key={`recent-${msg.id}`} className="bg-white/5 border border-white/10 rounded-xl p-6 break-words relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="font-semibold text-[var(--text-primary)]">{msg.name}</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>
          ))}

          {recentMessages.length === 0 && (
            <div className="col-span-full border border-dashed border-white/10 rounded-2xl p-12 text-center text-[var(--text-secondary)]">
              <p>No messages yet.</p>
            </div>
          )}
        </div>
      </div>

      {visibleRecentCount < recentMessages.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSeeMoreRecent}
            className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors text-sm text-[var(--text-primary)]"
          >
            See More Recent Notes 👇
          </button>
        </div>
      )}
    </div>
  );
}
