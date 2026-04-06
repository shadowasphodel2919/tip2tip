import { fetchLatestVideo } from "@/lib/rss";
import Countdown from "@/components/Countdown";
import VideoCard from "@/components/VideoCard";
import EmailSignup from "@/components/EmailSignup";
import CommunitySection from "@/components/CommunitySection";
import MapWrapper from "@/components/MapWrapper";
import KomootMap from "@/components/KomootMap";
import CiggyRush from "@/components/CiggyRush";

export const revalidate = 300; // Revalidate page every 5 minutes

export default async function Home() {
  const video = await fetchLatestVideo();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header / Hero */}
      <header className="pt-16 pb-8 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Editor Cam Watch
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)] tracking-wide">
          Are you working, Cam?
        </p>
      </header>

      {/* Countdown Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
        {/* Background Map */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 w-full max-w-5xl mx-auto px-4">
          <MapWrapper />
        </div>
        <div className="relative z-10">
          {video.found ? (
            <Countdown publishedAt={video.publishedAt} />
          ) : (
            <div className="text-center animate-fade-in">
              <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest mb-4">
                Status
              </p>
              <p className="text-2xl md:text-3xl font-medium text-[var(--text-muted)]">
                Cam hasn't uploaded anything recently
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Video Card */}
      {video.found && (
        <section className="px-4 pb-12 md:pb-16">
          <p className="text-center text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">
            Latest Upload
          </p>
          <VideoCard
            title={video.title}
            publishedAt={video.publishedAt}
            thumbnail={video.thumbnail}
            url={video.url}
          />
        </section>
      )}

      {/* Divider */}
      <div className="max-w-xs mx-auto w-full border-t border-[var(--border-muted)] mt-12 md:mt-16" />

      {/* Community Section */}
      <CommunitySection />

      {/* Divider */}
      <div className="max-w-xs mx-auto w-full border-t border-[var(--border-muted)]" />

      {/* Komoot Live Path */}
      <KomootMap />

      {/* Divider */}
      <div className="max-w-xs mx-auto w-full border-t border-[var(--border-muted)]" />

      {/* Email Signup */}
      <section className="px-4 py-12 md:py-16">
        <EmailSignup />
      </section>

      {/* Fan Art Promo */}
      <section className="px-4 py-10 md:py-12 max-w-2xl mx-auto text-center border border-white/5 rounded-2xl bg-white/5 mb-4 shadow-lg">
        <h3 className="text-[var(--text-primary)] font-bold text-lg tracking-wide flex items-center justify-center gap-2 mb-4">
          Fan Art Wall? <span className="text-xl">🎨</span>
        </h3>
        <p className="text-[var(--text-muted)] text-[15px] leading-relaxed mb-6">
          I'm thinking of making a wall of fan art or pictures. If anyone wants to submit their art, tweet it and tag me and I'll be sure to add it.
        </p>
        <a
          href="https://x.com/thetahajamal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#ef4444] text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
        >
          Tweet & Tag Me
        </a>
      </section>

      {/* Ciggy Rush Game */}
      <CiggyRush />

      {/* Footer */}
      <footer className="pb-4 text-center px-4 mt-4">
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
          Let's not harass Cam.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs opacity-70 hover:opacity-100 transition-opacity">
          <a href="https://x.com/TheTahaJamal" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors">
            Made By Taha
          </a>
          <span className="hidden sm:inline text-[var(--border-subtle)]">•</span>
          <a href="https://ko-fi.com/Y8Y01X7TID" target="_blank" rel="noopener noreferrer" className="text-[#ff5e5b] hover:text-[#ff7b78] transition-colors flex items-center gap-1">
            Support on Ko-fi ☕
          </a>
        </div>
      </footer>
    </main>
  );
}
