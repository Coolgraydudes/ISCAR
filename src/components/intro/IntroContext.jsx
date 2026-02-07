"use client";

import { createContext, useContext, useState } from "react";

const IntroContext = createContext(null);

export function IntroProvider({ children }) {
  const [loadingDone, setLoadingDone] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [uiHover, setUiHover] = useState(false);
  const [hoverZoom, setHoverZoom] = useState(false);
  const [startExplore, setStartExplore] = useState(false);
  const [exploreClicked, setExploreClicked] = useState(false);
  const [cameraSettled, setCameraSettled] = useState(false);

  return (
    <IntroContext.Provider
      value={{
        loadingDone,
        setLoadingDone,
        splashDone,
        setSplashDone,
        introReady,
        setIntroReady,
        uiHover,
        setUiHover,
        hoverZoom,
        setHoverZoom,
        startExplore,
        setStartExplore,
        exploreClicked,
        setExploreClicked,
        cameraSettled,
        setCameraSettled,
      }}
    >
      {children} 
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used inside IntroProvider");
  return ctx;
}
