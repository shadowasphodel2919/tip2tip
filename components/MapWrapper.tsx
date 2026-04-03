"use client";

import dynamic from "next/dynamic";

const JourneyMap = dynamic(() => import("@/components/JourneyMap"), {
  ssr: false,
});

export default function MapWrapper() {
  return <JourneyMap />;
}
