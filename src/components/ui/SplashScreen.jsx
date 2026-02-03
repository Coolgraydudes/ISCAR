"use client";

import { useIntro } from "./IntroContext";

export default function SplashScreen() {
  const { loadingDone } = useIntro();

  if (loadingDone) return null;

  return (
    <div className="splash">
      <h1>Loading World…</h1>
    </div>
  );
}
