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

      {/* Ciggy Rush Game */}
      <CiggyRush />

      {/* Footer */}
      <footer className="pb-8 text-center px-4">
        <p className="text-xs text-[var(--text-muted)]">
          Let's not harass Cam.
        </p>
        <p className="text-xs text-[var(--border-subtle)] mt-1">
          <a href="https://x.com/TheTahaJamal" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-muted)] transition-colors">
            Made By Taha(Drop a follow?)
          </a>
        </p>
      </footer>
    </main>
  );
}
