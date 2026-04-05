export interface VideoData {
  found: true;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  videoId: string;
}

export interface NoVideoData {
  found: false;
}

export type LatestVideoResponse = VideoData | NoVideoData;

// Ludwig's YouTube channel ID
const CHANNEL_ID = "UCrPseYLGpNygVi34QpGNqpA";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

async function isShort(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: "HEAD",
      redirect: "manual",
    });
    // YouTube redirects 303 (or 301/302) to /watch?v= if it's NOT a short.
    // If it's a short, it returns 200.
    return res.status >= 200 && res.status < 300;
  } catch {
    return false;
  }
}

function getThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

export async function fetchLatestVideo(): Promise<LatestVideoResponse> {
  const res = await fetch(RSS_URL, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    console.error("Failed to fetch RSS feed:", res.status);
    return { found: false };
  }

  const xml = await res.text();

  // Simple XML parsing without external dependencies
  const entries = xml.split("<entry>").slice(1); // Skip the feed header

  for (const entry of entries) {
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract video ID
    const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const videoId = videoIdMatch ? videoIdMatch[1] : "";

    if (!videoId) continue;
    
    // Ignore livestreams based on title heuristic
    if (title.toUpperCase().includes("LIVE")) {
      continue;
    }

    const isVideoShort = await isShort(videoId);
    if (isVideoShort) continue; // Skip shorts!

    // Extract published date
    const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
    const publishedAt = publishedMatch ? publishedMatch[1] : "";

    // Extract link
    const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/);
    const url = linkMatch ? linkMatch[1] : `https://www.youtube.com/watch?v=${videoId}`;

    // Get thumbnail from media:group or derive from video ID
    let thumbnail = "";
    const thumbMatch = entry.match(/<media:thumbnail[^>]+url="([^"]+)"/);
    if (thumbMatch) {
      thumbnail = thumbMatch[1];
    } else if (videoId) {
      thumbnail = getThumbnail(videoId);
    }

    return {
      found: true,
      title,
      publishedAt,
      thumbnail,
      url,
      videoId,
    };
  }

  return { found: false };
}
