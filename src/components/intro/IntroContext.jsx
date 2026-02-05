"use client";

import { createContext, useContext, useState } from "react";

const IntroContext = createContext(null);

export function IntroProvider({ children }) {
  const [loadingDone, setLoadingDone] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [uiHover, setUiHover] = useState(false);
  const [hoverZoom, setHoverZoom] = useState(false);
  const [startExplore, setStartExplore] = useState(false);

  return (
    <IntroContext.Provider
      value={{
        loadingDone,
        setLoadingDone,
        introReady,
        setIntroReady,
        uiHover,
        setUiHover,
        hoverZoom,
        setHoverZoom,
        startExplore,
        setStartExplore,

      }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
