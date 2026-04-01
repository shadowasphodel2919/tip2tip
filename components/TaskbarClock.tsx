"use client";

import { useEffect, useState } from "react";

export default function TaskbarClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = document.getElementById("taskbar-clock");
    if (el && time) el.textContent = time;
  }, [time]);

  return null;
}
