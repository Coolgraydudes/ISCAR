"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useIntro } from "@/components/intro/IntroContext";

export default function KF3UI() {
  const { startExplore, cameraSettled } = useIntro();

  if (!startExplore || !cameraSettled) return null;

  const clashDisplay = "'Clash Display', sans-serif";
  const InterSemiBold = "'Inter SemiBold', sans-serif";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-6xl lg:px-10 lg:text-white lg:pointer-events-auto">
          <div className="lg:relative lg:flex lg:items-center lg:justify-between">
            
            <div className="lg:flex lg:items-center lg:gap-3 lg:opacity-80">
              <div className="lg:flex lg:h-9 lg:w-9 lg:items-center lg:justify-center lg:rounded-full lg:border lg:border-white/30">
                <span className="lg:text-lg lg:leading-none">‹</span>
              </div>
              <div className="lg:flex lg:flex-col lg:leading-tight">
                <span className="lg:text-xs"
                      style={{ fontFamily: InterSemiBold }}>Divisi</span>
                <span className="lg:text-base"
                      style={{ fontFamily: clashDisplay }}>Bahasa</span>
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:px-10 lg:py-3 lg:rounded-full lg:bg-white/20 lg:backdrop-blur-md lg:border lg:border-white/30 lg:text-sm lg:font-medium lg:tracking-wide lg:hover:bg-white/30 lg:transition lg:active:scale-95"
              style={{ fontFamily: InterSemiBold }}>
              Explore
            </motion.button>

            <div className="lg:flex lg:items-center lg:gap-3 lg:opacity-80">
              <div className="lg:flex lg:flex-col lg:text-right lg:leading-tight">
                <span className="lg:text-xs"
                      style={{ fontFamily: InterSemiBold }}>Divisi</span>
                <span className="lg:text-base"
                      style={{ fontFamily: clashDisplay }}>Kesehatan</span>
              </div>
              <div className="lg:flex lg:h-9 lg:w-9 lg:items-center lg:justify-center lg:rounded-full lg:border lg:border-white/30">
                <span className="lg:text-lg lg:leading-none">›</span>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}