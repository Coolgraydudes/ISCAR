"use client";

import { useState } from "react";
import { useIntro } from "./IntroContext";
import BlurText from "../ui/BlurText";
import { i } from "framer-motion/client";

export default function IntroUI({ onClick }) {
  const { introReady, loadingDone } = useIntro();
  const [hovered, setHovered] = useState(false);

  if (!loadingDone || !introReady) return null;

  if (!introReady) return null;

  const clashDisplay = "'Clash Display', sans-serif";
  const interTight = "'Inter Tight', sans-serif";
  const interTightLight = "'Inter Tight Light', sans-serif";
  const interTightBold = "'Inter Tight Bold', sans-serif";

  return (
    <div className="pointer-events-none fixed inset-0 z-20 text-white select-none">

      <div className="lg:hidden absolute inset-0 pointer-events-none">

        <div className="pointer-events-auto absolute top-6 left-6 right-6 flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: clashDisplay }}
          >
            ISCAR
          </span>

          <div className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center">
            <div className="space-y-1">
              <span className="block w-4 h-px bg-white"></span>
              <span className="block w-4 h-px bg-white"></span>
              <span className="block w-4 h-px bg-white"></span>
            </div>
          </div>
        </div>

<div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center gap-6 px-6">

  <div
    className="flex flex-col items-center gap-1"
    style={{ fontFamily: interTightBold }}
  >
    <BlurText
      text="INDEPENDENT"
      animateBy="words"
      delay={800}
      direction="top"
      className="text-2xl font-bold tracking-wide"
    />
    <BlurText
      text="STUDENT COUNCIL"
      animateBy="words"
      delay={900}
      direction="top"
      className="text-2xl font-bold tracking-wide"
    />
    <BlurText
      text="OF ABU DZAR"
      animateBy="words"
      delay={1000}
      direction="top"
      className="text-2xl font-bold tracking-wide"
    />
  </div>

  <button
    onClick={onClick}
    className="pointer-events-auto px-10 py-3 rounded-full border border-white/30 bg-white/5 backdrop-blur-md text-sm tracking-wide active:scale-95 transition"
    style={{ fontFamily: interTight }}
  >
    Explore
  </button>

</div>


        <div
          className="absolute bottom-6 left-6 max-w-xs text-xs leading-relaxed opacity-80"
          style={{ fontFamily: interTight }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis velit
          lectus, semper sed iaculis a, sollicitudin viverra erat. Fusce quis
          massa arcu.
        </div>
      </div>


      <div className="hidden lg:flex fixed inset-0 flex-col justify-between p-6 lg:p-10">

        <div className="flex flex-col w-full gap-2 lg:gap-10">
          <div className="flex w-full items-start justify-between lg:px-11">
            <div className="hidden lg:block max-w-57.5 lg:pt-8 order-2">
              <BlurText
                text="Official representative body of Abu Dzar students. We bridge ideas, foster innovation, and create a home for every aspiring leader"
                animateBy="words"
                delay={100}
                direction="top"
                className="text-[11px] lg:text-[1vw] leading-relaxed opacity-90 text-right"
                style={{ fontFamily: interTight }}
              />
            </div>

            <BlurText
              text="ISCAR"
              animateBy="words"
              delay={1500}
              direction="top"
              className="text-[18vw] lg:text-[20vw] font-bold leading-[0.8] -tracking-normal order-1"
              style={{ fontFamily: clashDisplay }}
            />
          </div>

          <nav
            className="hidden lg:flex w-full justify-between lg:text-[0.8vw] mt-[-2vw] lg:px-14"
            style={{ fontFamily: interTight }}
          >
            <BlurText text="ABOUT" delay={2200} animateBy="words" direction="top" />
            <BlurText text="DIVISIONS" delay={2400} animateBy="words" direction="top" />
            <BlurText text="GALLERY" delay={2600} animateBy="words" direction="top" />
          </nav>
        </div>

        <div className="hidden lg:flex w-full flex-col lg:flex-row items-center lg:items-end justify-between gap-8 lg:gap-0 lg:px-14 lg:pb-8">
          <div className="pointer-events-auto w-full lg:w-64">
            <button
              onClick={onClick}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative flex h-20 w-full lg:h-28 lg:w-64 items-end overflow-hidden rounded-2xl lg:rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-md transition-all duration-500"
              style={{
                transform: hovered ? "scale(1.03)" : "scale(1)",
                boxShadow: hovered ? "0 0 40px rgba(255,255,255,0.1)" : "none"
              }}
            >
              <span
                className="text-xl lg:text-2xl font-semibold tracking-tight"
                style={{ fontFamily: interTight }}
              >
                <BlurText text="Explore" delay={3000} animateBy="words" />
              </span>
              <div className="absolute top-6 right-6 text-xl opacity-70">↗</div>
              <div className={`absolute inset-0 bg-linear-to-tr from-white/10 to-transparent transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />
            </button>
          </div>

          <div
            className="flex flex-col items-end leading-[1.1] text-right text-white"
            style={{ fontFamily: interTightLight }}
          >
            <BlurText
              text="Independent"
              delay={3200}
              className="text-[10px] lg:text-[1vw] font-extralight uppercase"
            />
            <BlurText
              text="Student Council"
              delay={3200}
              className="text-[13px] lg:text-[1vw] font-light opacity-90 uppercase mt-1"
            />
            <BlurText
              text="Of Abu Dzar"
              delay={3200}
              className="text-[10px] lg:text-[1vw] font-extralight uppercase mt-1"
            />
          </div>
        </div>
      </div>

    </div>
  );
}