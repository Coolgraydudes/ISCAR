"use client";

import { createContext, useContext, useState } from "react";

const IntroContext = createContext(null);

export function IntroProvider({ children }) {
  const [loadingDone, setLoadingDone] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  return (
    <IntroContext.Provider
      value={{
        loadingDone,
        setLoadingDone,
        introReady,
        setIntroReady,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
