import HypeButton from "./HypeButton";
import SupportWall from "./SupportWall";
// Trip is over — live API calls commented out, kept for future reuse
// import { getApprovedMessages, getHypeCount, getTopComments } from "@/app/actions/community";
import { getApprovedMessages, getTopComments } from "@/app/actions/community";

// Hype count is locked at the final number from when the trip ended
const FINAL_HYPE_COUNT = 28314;

export const revalidate = 60;

export default async function CommunitySection() {
  const [messages, topMessages] = await Promise.all([
    getApprovedMessages(),
    // getHypeCount(), // Trip is over — no longer fetching live hype count
    getTopComments(),
  ]);

  return (
    <section className="w-full max-w-5xl mx-auto">
      <HypeButton initialCount={FINAL_HYPE_COUNT} />
      <SupportWall recentMessages={messages} topMessages={topMessages} />
    </section>
  );
}
