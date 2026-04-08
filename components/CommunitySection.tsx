import HypeButton from "./HypeButton";
import SupportWall from "./SupportWall";
import { getApprovedMessages, getHypeCount, getTopComments } from "@/app/actions/community";

export const revalidate = 60; // Optional: revalidate every minute if you want fresh hype counts on static loads

export default async function CommunitySection() {
  const [messages, hypeCount, topMessages] = await Promise.all([
    getApprovedMessages(),
    getHypeCount(),
    getTopComments(),
  ]);

  return (
    <section className="w-full max-w-5xl mx-auto">
      <HypeButton initialCount={hypeCount} />
      <SupportWall recentMessages={messages} topMessages={topMessages} />
    </section>
  );
}
