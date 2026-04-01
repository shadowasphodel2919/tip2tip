import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getSubscribers(): Promise<string[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: string[]): Promise<void> {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Please enter an email address." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const subscribers = await getSubscribers();

    if (subscribers.includes(email)) {
      return NextResponse.json({
        success: true,
        message: "You're already on the list!",
      });
    }

    subscribers.push(email);
    await saveSubscribers(subscribers);

    return NextResponse.json({
      success: true,
      message: "You're in.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
