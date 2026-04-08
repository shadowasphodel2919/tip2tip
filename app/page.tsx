import VideoCard from "@/components/VideoCard";
import CommunitySection from "@/components/CommunitySection";
import KomootMap from "@/components/KomootMap";
import CiggyRush from "@/components/CiggyRush";

const videos = [
  { day: "Day 16", id: "QmhskSqnWa8", url: "https://www.youtube.com/watch?v=QmhskSqnWa8" },
  { day: "Day 15", id: "AuCUZ9bSbao", url: "https://www.youtube.com/watch?v=AuCUZ9bSbao" },
  { day: "Day 14", id: "VddSkJ5LxHQ", url: "https://www.youtube.com/watch?v=VddSkJ5LxHQ" },
  { day: "Day 13", id: "Al8lWmEc_XI", url: "https://www.youtube.com/watch?v=Al8lWmEc_XI" },
  { day: "Day 12", id: "PAJ3B42tp10", url: "https://www.youtube.com/watch?v=PAJ3B42tp10" },
  { day: "Day 11", id: "4UPYWw7wU_4", url: "https://www.youtube.com/watch?v=4UPYWw7wU_4" },
  { day: "Day 10", id: "-kEZicGTeoA", url: "https://www.youtube.com/watch?v=-kEZicGTeoA" },
  { day: "Day 9", id: "IkTqiTdOkS4", url: "https://www.youtube.com/watch?v=IkTqiTdOkS4" },
  { day: "Day 8", id: "0Kl9KHYZddM", url: "https://www.youtube.com/watch?v=0Kl9KHYZddM" },
  { day: "Day 7", id: "LFe7wewoZvU", url: "https://www.youtube.com/watch?v=LFe7wewoZvU" },
  { day: "Day 6", id: "u8kj5uwfbUE", url: "https://www.youtube.com/watch?v=u8kj5uwfbUE" },
  { day: "Day 5", id: "bjymP2RpESE", url: "https://www.youtube.com/watch?v=bjymP2RpESE" },
  { day: "Day 4", id: "J4QE73WfqWU", url: "https://www.youtube.com/watch?v=J4QE73WfqWU" },
  { day: "Day 3", id: "rm0u1isPEME", url: "https://www.youtube.com/watch?v=rm0u1isPEME" },
  { day: "Day 2", id: "98ncYUOPSHk", url: "https://www.youtube.com/watch?v=98ncYUOPSHk" },
  { day: "Day 1", id: "_41P6UrwQKY", url: "https://www.youtube.com/watch?v=_41P6UrwQKY" }
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">


      {/* Header / Hero */}
      <header className="pt-16 pb-12 text-center px-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
          Thank you for following the trip
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-muted)] tracking-wide">
          You can rest now, Cam.
        </p>

        {/* Banner Image */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-subtle)]">
           <img 
              src="/greetings-from-erenhot.jpg" 
              alt="Greetings from Erenhot" 
              className="w-full h-auto object-cover"
           />
        </div>
      </header>

      {/* Videos Section */}
      <section className="px-4 py-8 max-w-7xl mx-auto w-full relative z-10">
        <h2 className="text-xl md:text-2xl font-bold text-center text-[var(--text-primary)] mb-10 tracking-widest uppercase">
          The Journey
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((vid) => (
            <a
              key={vid.id}
              href={vid.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden transition-all duration-300 hover:border-[var(--text-muted)] hover:shadow-lg hover:shadow-black/20 flex flex-col h-full">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`}
                    alt={vid.day}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1 group-hover:text-[#ef4444] transition-colors">
                    {vid.day}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

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
          Let's not harass Cam anymore.
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
