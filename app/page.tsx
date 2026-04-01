import { fetchLatestVideo } from "@/lib/rss";
import Countdown from "@/components/Countdown";
import VideoCard from "@/components/VideoCard";
import EmailSignup from "@/components/EmailSignup";

export const revalidate = 300;

export default async function Home() {
  const video = await fetchLatestVideo();

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: "var(--win-desktop)" }}>

      {/* ── Main Window ── */}
      <div className="win-window w-full max-w-2xl">

        {/* Title Bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-1.5">
            {/* App icon (tiny pixel monitor) */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="14" height="10" fill="#000080" stroke="#ffffff" strokeWidth="0.5"/>
              <rect x="2" y="3" width="12" height="8" fill="#008080"/>
              <rect x="5" y="12" width="6" height="1" fill="#c0c0c0"/>
              <rect x="3" y="13" width="10" height="1" fill="#c0c0c0"/>
            </svg>
            <span>Editor Cam Watch — Countdown Timer</span>
          </div>
          <div className="flex items-center gap-0.5" aria-hidden="true">
            <div className="win-titlebar-btn" title="Minimize">_</div>
            <div className="win-titlebar-btn" title="Maximize">□</div>
            <div className="win-titlebar-btn" title="Close" style={{ fontWeight: 900, fontSize: "11px" }}>✕</div>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex items-center gap-0 px-1 py-0.5" style={{ background: "var(--win-gray)", borderBottom: "1px solid var(--win-btn-shadow)" }}>
          {["File", "View", "Tools", "Help"].map((item) => (
            <button
              key={item}
              className="px-3 py-0.5 text-xs hover:bg-[var(--win-highlight)] hover:text-white cursor-default focus:outline-none"
              tabIndex={-1}
              aria-label={item + " menu"}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1.5" style={{ background: "var(--win-gray)", borderBottom: "1px solid var(--win-btn-shadow)" }}>
          <div className="win-raised px-3 py-1 text-xs cursor-default flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1L11 10H1z" fill="#0000ff"/>
            </svg>
            Refresh
          </div>
          <div className="win-raised px-3 py-1 text-xs cursor-default flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="8" height="8" stroke="#000" strokeWidth="1" fill="none"/>
              <path d="M9 4l2-2" stroke="#000" strokeWidth="1"/>
            </svg>
            About
          </div>
          <div className="w-px mx-1 self-stretch" style={{ borderLeft: "1px solid var(--win-btn-shadow)", borderRight: "1px solid var(--win-btn-highlight)" }} aria-hidden="true" />
          <div className="text-xs" style={{ color: "var(--win-gray-dark)" }}>
            Tip2Tip Upload Tracker v1.0
          </div>
        </div>

        {/* Marquee ticker */}
        <div className="win-marquee" role="marquee" aria-live="off">
          <span style={{ display: "inline-block", paddingLeft: "100%", animation: "marquee-scroll 18s linear infinite" }}>
            ★ WELCOME TO EDITOR CAM WATCH ★ &nbsp;&nbsp;&nbsp; Is Cam editing? We&apos;re watching. &nbsp;&nbsp;&nbsp; Tip2Tip Upload Tracker — Live Countdown &nbsp;&nbsp;&nbsp; Made by Taha &nbsp;&nbsp;&nbsp; Let&apos;s not harass Cam. &nbsp;&nbsp;&nbsp; ★ WELCOME TO EDITOR CAM WATCH ★
          </span>
        </div>

        {/* Body / Client Area */}
        <div className="p-4 flex flex-col gap-4" style={{ background: "var(--win-gray)" }}>

          {/* Status panel */}
          <div style={{ border: "1px solid var(--win-btn-shadow)", boxShadow: "1px 1px 0 var(--win-btn-highlight)" }}>
            <div className="px-2 py-1 text-xs font-bold flex items-center gap-2" style={{ background: "var(--win-gray-light)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" fill="#ffff00" stroke="#000" strokeWidth="0.5"/>
                <text x="7" y="10" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#000">!</text>
              </svg>
              Countdown Status
            </div>
            <div className="p-4 text-center" style={{ background: "var(--win-white)" }}>
              {video.found ? (
                <Countdown publishedAt={video.publishedAt} />
              ) : (
                <div className="py-4">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--win-btn-shadow)" }}>Status</p>
                  <p className="text-base font-bold" style={{ color: "var(--win-btn-dark-shadow)" }}>
                    Cam hasn&apos;t uploaded anything recently.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Latest video panel */}
          {video.found && (
            <div style={{ border: "1px solid var(--win-btn-shadow)", boxShadow: "1px 1px 0 var(--win-btn-highlight)" }}>
              <div className="px-2 py-1 text-xs font-bold flex items-center gap-2" style={{ background: "var(--win-gray-light)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="1" y="2" width="12" height="9" rx="1" fill="#000080"/>
                  <path d="M5 5l5 2.5-5 2.5z" fill="#fff"/>
                </svg>
                Latest Upload
              </div>
              <div className="p-3" style={{ background: "var(--win-white)" }}>
                <VideoCard
                  title={video.title}
                  publishedAt={video.publishedAt}
                  thumbnail={video.thumbnail}
                  url={video.url}
                />
              </div>
            </div>
          )}

          {/* Email Signup panel */}
          <div style={{ border: "1px solid var(--win-btn-shadow)", boxShadow: "1px 1px 0 var(--win-btn-highlight)" }}>
            <div className="px-2 py-1 text-xs font-bold flex items-center gap-2" style={{ background: "var(--win-gray-light)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="1" y="3" width="12" height="8" rx="1" fill="#ffffff" stroke="#000" strokeWidth="0.5"/>
                <path d="M1 4l6 5 6-5" stroke="#000080" strokeWidth="1" fill="none"/>
              </svg>
              Notification Signup
            </div>
            <div className="p-3" style={{ background: "var(--win-white)" }}>
              <EmailSignup />
            </div>
          </div>

        </div>

        {/* Status Bar */}
        <div className="win-statusbar">
          <div className="win-statusbar-panel text-xs">
            Ready
          </div>
          <div className="win-statusbar-panel text-xs" style={{ flex: "0 0 180px" }}>
            Tip2Tip Upload Tracker
          </div>
          <div className="win-statusbar-panel text-xs" style={{ flex: "0 0 120px" }}>
            <a href="https://x.com/TheTahaJamal" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              Made by Taha
            </a>
          </div>
        </div>

      </div>

      {/* Taskbar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center gap-1 px-1 py-1"
        style={{
          background: "var(--win-gray)",
          borderTop: "2px solid var(--win-btn-highlight)",
          boxShadow: "inset 0 1px 0 var(--win-btn-light)",
          height: "30px",
          zIndex: 100,
        }}
      >
        {/* Start Button */}
        <button
          className="win-btn flex items-center gap-1 px-2 py-0"
          style={{ height: "22px", fontWeight: "bold", fontSize: "11px", minWidth: 0 }}
          aria-label="Start menu"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect width="7" height="7" fill="#FF0000"/>
            <rect x="9" width="7" height="7" fill="#00FF00"/>
            <rect y="9" width="7" height="7" fill="#0000FF"/>
            <rect x="9" y="9" width="7" height="7" fill="#FFFF00"/>
          </svg>
          Start
        </button>

        <div className="w-px self-stretch mx-0.5" style={{ borderLeft: "1px solid var(--win-btn-shadow)", borderRight: "1px solid var(--win-btn-highlight)" }} aria-hidden="true" />

        {/* Active window button */}
        <div
          className="win-sunken flex items-center gap-1 px-2 text-xs font-bold"
          style={{ height: "22px", background: "var(--win-btn-face)", minWidth: "140px" }}
          aria-label="Editor Cam Watch window"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="10" height="8" fill="#000080"/>
            <rect x="2" y="2" width="8" height="6" fill="#008080"/>
          </svg>
          Editor Cam Watch
        </div>

        <div className="flex-1" />

        {/* System tray */}
        <div
          className="win-sunken flex items-center gap-2 px-2 text-xs"
          style={{ height: "22px" }}
          aria-label="System tray"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="#000080" strokeWidth="1.5" fill="none"/>
            <path d="M7 4v3l2 2" stroke="#000080" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span id="taskbar-clock">12:00 PM</span>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>

      <TaskbarClock />
    </main>
  );
}

// Client component for live clock
import TaskbarClock from "@/components/TaskbarClock";
