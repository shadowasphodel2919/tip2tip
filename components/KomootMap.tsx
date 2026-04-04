export default function KomootMap() {
  return (
    <section className="px-4 py-12 md:py-16 w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
          The Full Journey
        </h2>
        <p className="mt-2 text-[var(--text-muted)]">
          GPS tracking of the actual route.
        </p>
      </div>

      <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#111]">
        <iframe
          src="https://www.komoot.com/tour/2825527139/embed?share_token=a1mCldHJAvUZbHG8qm2zbtQORetJc4Y2O8S1clT46XGYkH9VL6&profile=1"
          width="100%"
          height="650"
          frameBorder="0"
          allowFullScreen
          className="w-full h-[500px] md:h-[650px]"
          title="Komoot Tour Map"
        ></iframe>
      </div>
    </section>
  );
}
