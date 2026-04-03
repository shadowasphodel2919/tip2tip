"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type SupportMessage = {
  id: number;
  name: string;
  message: string;
  created_at: Date;
};

export async function submitSupportMessage(formData: FormData) {
  const name = (formData.get("name") as string)?.trim() || "Anonymous";
  const message = (formData.get("message") as string)?.trim();

  // Basic validation
  if (!message || message.length === 0) {
    return { success: false, message: "A message is required." };
  }
  if (message.length > 500) {
    return { success: false, message: "Message is too long (max 500 characters)." };
  }
  if (name.length > 100) {
    return { success: false, message: "Name is too long." };
  }

  try {
    await sql`
      INSERT INTO support_messages (name, message, approved)
      VALUES (${name}, ${message}, true)
    `;
    return { success: true, message: "Your note's on the wall 💛" };
  } catch (error) {
    console.error("Failed to submit message:", error);
    return { success: false, message: "Something went wrong. Try again." };
  }
}

export async function getApprovedMessages(): Promise<SupportMessage[]> {
  try {
    const messages = await sql`
      SELECT id, name, message, created_at
      FROM support_messages
      WHERE approved = true
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return messages as SupportMessage[];
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

export async function incrementHype() {
  try {
    const result = await sql`
      UPDATE hype_stats
      SET count = count + 1
      WHERE id = 'cam_hype'
      RETURNING count
    `;
    if (result.length > 0) {
      // Revalidate path so the new count is visible
      revalidatePath("/");
      return { success: true, count: result[0].count as number };
    }
    return { success: false, count: 0 };
  } catch (error) {
    console.error("Failed to increment hype:", error);
    return { success: false, count: 0 };
  }
}

export async function getHypeCount(): Promise<number> {
  try {
    const result = await sql`
      SELECT count FROM hype_stats WHERE id = 'cam_hype'
    `;
    if (result.length > 0) {
      return result[0].count as number;
    }
    return 0;
  } catch (error) {
    console.error("Failed to fetch hype count:", error);
    return 0;
  }
}
