"use client";

import { useState } from "react";
import { useIntro } from "./IntroContext";
import BlurText from "../ui/BlurText";

export default function IntroUI() {
  const {
    loadingDone,
    cameraSettled,
    setHoverZoom,
    setStartExplore,
    exploreClicked,
    setExploreClicked,
  } = useIntro();

  const [hovered, setHovered] = useState(false);

  if (!loadingDone || !cameraSettled) return null;

  const clashDisplay = "'Clash Display', sans-serif";
  const interTight = "'Inter Tight', sans-serif";
  const interTightLight = "'Inter Tight Light', sans-serif";
  const interTightBold = "'Inter Tight Bold', sans-serif";

  const handleExploreClick = () => {
    if (exploreClicked) return;

    setHoverZoom(false);
    setExploreClicked(true);
    setStartExplore(true);
  };

  return (
    <div
      className={`
        fixed inset-0 z-20 text-white select-none
        transition-opacity duration-700 ease-out
        ${exploreClicked ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
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
              <span className="block w-4 h-px bg-white" />
              <span className="block w-4 h-px bg-white" />
              <span className="block w-4 h-px bg-white" />
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center gap-6 px-6">
          <div
            className="flex flex-col items-center gap-1"
            style={{ fontFamily: interTightBold }}
          >
            <BlurText text="INDEPENDENT" delay={0} animateBy="words" />
            <BlurText text="STUDENT COUNCIL" delay={100} animateBy="words" />
            <BlurText text="OF ABU DZAR" delay={200} animateBy="words" />
          </div>

          <button
            onClick={handleExploreClick}
            className="pointer-events-auto px-10 py-3 rounded-full border border-white/30 bg-white/5 backdrop-blur-md text-sm tracking-wide active:scale-95 transition"
            style={{ fontFamily: interTight }}
          >
            Explore
          </button>
        </div>
      </div>

      <div className="hidden lg:flex fixed inset-0 flex-col justify-between p-6 lg:p-10">
        <div className="flex flex-col w-full gap-10">
          <div className="flex w-full items-start justify-between lg:px-11">
            <BlurText
              text="ISCAR"
              delay={0}
              animateBy="words"
              className="text-[20vw] font-bold leading-[0.8]"
              style={{ fontFamily: clashDisplay }}
            />

            <div className="hidden lg:block max-w-60 pt-8">
              <BlurText
                text="Official representative body of Abu Dzar students. We bridge ideas, foster innovation, and create a home for every aspiring leader"
                delay={200}
                animateBy="words"
                className="text-[1vw] leading-relaxed opacity-90 text-right"
                style={{ fontFamily: interTight }}
              />
            </div>
          </div>

          <nav
            className="hidden lg:flex w-full justify-between lg:text-[0.8vw] mt-[-2vw] lg:px-14"
            style={{ fontFamily: interTight }}
          >
            <BlurText text="ABOUT" delay={400} animateBy="words" direction="top" />
            <BlurText text="DIVISIONS" delay={500} animateBy="words" direction="top" />
            <BlurText text="GALLERY" delay={600} animateBy="words" direction="top" />
          </nav>
        </div>

        <div className="flex w-full items-end justify-between lg:px-14 lg:pb-8">
          <div className="pointer-events-auto w-64">
            <button
              disabled={exploreClicked}
              onClick={handleExploreClick}
              onMouseEnter={() => {
                if (exploreClicked) return;
                setHovered(true);
                setHoverZoom(true);
              }}
              onMouseLeave={() => {
                if (exploreClicked) return;
                setHovered(false);
                setHoverZoom(false);
              }}
              className="relative flex h-28 w-full items-end overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-md transition-all duration-500"
              style={{
                transform: hovered ? "scale(1.03)" : "scale(1)",
                boxShadow: hovered
                  ? "0 0 40px rgba(255,255,255,0.1)"
                  : "none",
              }}
            >
              <span
                className="text-2xl font-semibold tracking-tight"
                style={{ fontFamily: interTight }}
              >
                <BlurText text="Explore" delay={800} animateBy="words" />
              </span>

              <div className="absolute top-6 right-6 text-xl opacity-70">↗</div>
            </button>
          </div>

          <div
            className="flex flex-col items-end text-right"
            style={{ fontFamily: interTightLight }}
          >
            <BlurText text="Independent" delay={900} className="text-[1vw]" />
            <BlurText text="Student Council" delay={1000} className="text-[1vw]" />
            <BlurText text="Of Abu Dzar" delay={1100} className="text-[1vw]" />
          </div>
        </div>
      </div>
    </div>
  );
}