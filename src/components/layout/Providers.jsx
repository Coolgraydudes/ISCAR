"use client";

import { IntroProvider } from "../intro/IntroContext";

export default function Providers({ children }) {
  return <IntroProvider>{children}</IntroProvider>;
}
