"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type LeaderboardEntry = {
  id: number;
  name: string;
  score: number;
  created_at: Date;
};

export async function saveGameScore(name: string, score: number) {
  try {
    const cleanName = name.trim().toUpperCase().slice(0, 10) || "PLAYER";

    // Exploit guard: the grid is 20x20 = 400 cells, snake starts with 3 segments,
    // so the absolute maximum achievable score is 397.
    // Any score above this was submitted directly to the endpoint — reject it.
    const MAX_POSSIBLE_SCORE = 117;
    if (typeof score !== "number" || !Number.isInteger(score) || score < 0 || score > MAX_POSSIBLE_SCORE) {
      console.warn(`Rejected suspicious score submission: name=${cleanName}, score=${score}`);
      return { success: false, reason: "invalid_score" };
    }

    await sql`
      INSERT INTO ciggy_rush_leaderboard (name, score)
      VALUES (${cleanName}, ${score})
    `;

    // Revalidate the page so new scores load instantly for other players
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to save score:", error);
    return { success: false };
  }
}

export async function getTopScores(): Promise<LeaderboardEntry[]> {
  try {
    const scores = await sql`
      SELECT id, name, score, created_at
      FROM ciggy_rush_leaderboard
      ORDER BY score DESC, created_at ASC
      LIMIT 5
    `;
    return scores as LeaderboardEntry[];
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
}
