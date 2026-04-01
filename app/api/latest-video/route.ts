import { NextResponse } from "next/server";
import { fetchLatestVideo } from "@/lib/rss";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function GET() {
  try {
    const data = await fetchLatestVideo();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching latest video:", error);
    return NextResponse.json({ found: false }, { status: 500 });
  }
}
