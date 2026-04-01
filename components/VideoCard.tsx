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
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      aria-label={`Watch: ${title}`}
    >
      <div
        className="flex gap-3 p-2 group"
        style={{
          border: "2px solid transparent",
          outline: "1px dotted transparent",
          transition: "border-color 0.1s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--win-highlight)";
          (e.currentTarget as HTMLElement).style.background = "#000080";
          (e.currentTarget as HTMLElement).style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "inherit";
        }}
      >
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{
            width: "120px",
            height: "68px",
            border: "2px solid var(--win-btn-shadow)",
            boxShadow: "inset 1px 1px 0 var(--win-btn-dark-shadow)",
          }}
        >
          <img
            src={thumbnail}
            alt={`Thumbnail for ${title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* VHS-style play overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,128,0.5)", opacity: 0 }}
            aria-hidden="true"
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderLeft: "18px solid #ffff00",
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <h3 className="text-xs font-bold leading-snug mb-1" style={{ color: "#0000ff" }}>
            {title}
          </h3>
          <div className="text-xs" style={{ color: "var(--win-btn-shadow)" }}>
            <div>
              {formattedDate} — {formattedTime}
            </div>
            <div className="mt-0.5 font-bold" style={{ color: "var(--win-btn-dark-shadow)" }}>
              {timeAgo(publishedAt)}
            </div>
          </div>
        </div>

        {/* Arrow icon */}
        <div className="flex-shrink-0 self-center">
          <div
            className="win-btn text-xs px-2 py-1"
            style={{ minWidth: 0, pointerEvents: "none" }}
          >
            ▶ Watch
          </div>
        </div>
      </div>
    </a>
  );
}
