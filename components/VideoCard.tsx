interface VideoCardProps {
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function VideoCard({ title, publishedAt, thumbnail, url }: VideoCardProps) {
  const published = new Date(publishedAt);
  const formattedDate = published.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = published.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-xl mx-auto group"
    >
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden transition-all duration-300 hover:border-[var(--text-muted)] hover:shadow-lg hover:shadow-black/20">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-medium text-[var(--text-primary)] text-sm leading-snug mb-2 group-hover:text-white transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              {formattedDate} · {formattedTime}
            </span>
            <span>{timeAgo(publishedAt)}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
