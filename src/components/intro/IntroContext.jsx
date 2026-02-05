"use client";

import { createContext, useContext, useState } from "react";

const IntroContext = createContext(null);

export function IntroProvider({ children }) {
  // loader / asset
  const [loadingDone, setLoadingDone] = useState(false);

  // intro camera selesai (KF1 → KF2)
  const [introReady, setIntroReady] = useState(false);

  // UI hover (buat text / button effect)
  const [uiHover, setUiHover] = useState(false);

  // hover zoom (khusus FOV camera)
  const [hoverZoom, setHoverZoom] = useState(false);

  // 🔴 trigger Explore → KF3
  const [startExplore, setStartExplore] = useState(false);

  // 🔒 Explore sudah diklik (lock UI + fade out)
  const [exploreClicked, setExploreClicked] = useState(false);

  return (
    <IntroContext.Provider
      value={{
        // loading
        loadingDone,
        setLoadingDone,

        // intro
        introReady,
        setIntroReady,

        // ui hover
        uiHover,
        setUiHover,

        // camera hover zoom
        hoverZoom,
        setHoverZoom,

        // explore → keyframe 3
        startExplore,
        setStartExplore,

        // click lock / fade ui
        exploreClicked,
        setExploreClicked,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error("useIntro must be used inside <IntroProvider>");
  }
  return ctx;
}
