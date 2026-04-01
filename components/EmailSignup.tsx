"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter an email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div className="text-left">
      <div className="mb-3">
        <p className="text-xs font-bold mb-1" style={{ color: "var(--win-black)" }}>
          Want a reminder when Cam uploads?
        </p>
        <p className="text-xs" style={{ color: "var(--win-btn-shadow)" }}>
          Enter your email address below and click &quot;Notify Me&quot; to receive a notification when Cam finally uploads the bloody video.
        </p>
      </div>

      {status === "success" ? (
        <div
          className="flex items-center gap-2 p-2 animate-fade-in"
          style={{
            background: "#dfffdf",
            border: "2px solid var(--win-btn-shadow)",
            boxShadow: "inset 1px 1px 0 var(--win-btn-dark-shadow)",
          }}
          role="alert"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="#008000"/>
            <path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-xs font-bold" style={{ color: "#008000" }}>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Dialog-style label + input row */}
          <div className="flex items-center gap-2 mb-3">
            <label htmlFor="email-signup-input" className="text-xs whitespace-nowrap" style={{ minWidth: "80px" }}>
              E-mail address:
            </label>
            <input
              type="email"
              id="email-signup-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@example.com"
              className="win-input flex-1"
              disabled={status === "loading"}
              autoComplete="email"
            />
          </div>

          {/* Error message */}
          {status === "error" && (
            <div
              className="flex items-center gap-1.5 mb-3 p-1.5 animate-fade-in"
              style={{
                background: "#fff0f0",
                border: "1px solid #ff0000",
              }}
              role="alert"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" fill="#ff0000"/>
                <text x="7" y="10.5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fff">✕</text>
              </svg>
              <span className="text-xs" style={{ color: "#cc0000" }}>{message}</span>
            </div>
          )}

          {/* Button row */}
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              id="email-signup-button"
              disabled={status === "loading"}
              className="win-btn text-xs font-bold"
              aria-busy={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Notify Me"}
            </button>
            <button
              type="button"
              className="win-btn text-xs"
              onClick={() => {
                setEmail("");
                setStatus("idle");
                setMessage("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
