"use client";

import { useEffect, useState } from "react";
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

  const [uiHidden, setUiHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoverArmed, setHoverArmed] = useState(false);

  useEffect(() => {
    if (!loadingDone || !cameraSettled) return;
    const t = setTimeout(() => { setHoverArmed(true); }, 120);
    return () => clearTimeout(t); 
  }, [loadingDone, cameraSettled]);

  if (!loadingDone || !cameraSettled) return null;

  const clashDisplay = "'Clash Display', sans-serif";
  const interTight = "'Inter Tight', sans-serif";
  const interTightBold = "'Inter Tight Bold', sans-serif";
  const interSemiBold = "'Inter SemiBold', sans-serif";

  const handleExploreClick = () => {
    if (exploreClicked) return;
    setHoverZoom(false);
    setExploreClicked(true);
  
    // Sinyal untuk kamera 3D mulai bergerak setelah UI intro memudar
    setTimeout(() => {
      setUiHidden(true);
      setStartExplore(true);
    }, 650); 
  };

  return (
    <div className="fixed inset-0 z-50 text-white select-none pointer-events-none">
      
      {/* ============================================================
          SECTION 1: NAVBAR (Yang MUNCUL saat Explore diklik)
          ============================================================ */}
      <div className={`fixed top-0 left-0 w-full px-[7.3vw] py-10 flex flex-row justify-between items-center transition-all duration-1000 ease-in-out
        ${exploreClicked ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
        
        {/* Logo Teks ISCAR */}
        <span 
          className="text-2xl font-bold tracking-tighter pointer-events-auto cursor-pointer"
          style={{ fontFamily: clashDisplay }}
        >
          ISCAR
        </span>

        {/* Menu Navbar (Opsional: Muncul di kanan saat sudah Explore) */}
        <nav className="flex gap-8 pointer-events-auto" style={{ fontFamily: interTight }}>
          <span className="text-[0.8vw] hover:opacity-50 cursor-pointer">ABOUT</span>
          <span className="text-[0.8vw] hover:opacity-50 cursor-pointer">DIVISIONS</span>
          <span className="text-[0.8vw] hover:opacity-50 cursor-pointer">GALLERY</span>
        </nav>
      </div>


      {/* ============================================================
          SECTION 2: INTRO UI (Yang HILANG saat Explore diklik)
          ============================================================ */}
      <div
        className={`fixed inset-0 flex flex-col justify-between py-10 transition-opacity duration-700 ease-out
          ${exploreClicked ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        
        {/* --- HEADER INTRO (SVG & NAV LEBAR) --- */}
        <div className="w-full">
          <div className="relative w-full overflow-hidden top-3">
            <div className="relative left-[7.3vw]">
              <svg viewBox="0 0 584 126" className="w-[85.3vw] h-auto max-w-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34.1939 123.68H-2.37717e-06V1.8188H34.1939V123.68ZM104.227 125.499C91.8593 125.499 81.1888 123.983 72.2159 120.952C63.2431 117.799 56.3315 113.01 51.4813 106.583C46.6311 100.035 44.206 91.6082 44.206 81.3015V80.2102H78.3999V84.0298C78.3999 86.6974 78.9456 88.8193 80.0369 90.3956C81.2494 91.8507 83.6745 92.8814 87.3122 93.4877C90.9498 94.0939 96.5882 94.3971 104.227 94.3971C111.139 94.3971 116.232 94.2152 119.505 93.8514C122.779 93.3664 124.841 92.6389 125.689 91.6688C126.659 90.5775 127.144 89.1225 127.144 87.3036C127.144 85.1211 126.296 83.4841 124.598 82.3928C123.022 81.3015 119.748 80.4527 114.776 79.8465L76.5811 74.7537C69.0633 73.6624 62.758 71.6617 57.6653 68.7516C52.5726 65.7202 48.7531 61.7794 46.2067 56.9292C43.6604 52.079 42.3872 46.38 42.3872 39.8323C42.3872 34.9821 43.4178 30.1925 45.4792 25.4635C47.5405 20.7346 50.875 16.4907 55.4827 12.7318C60.0904 8.8516 66.1532 5.75959 73.671 3.45575C81.1888 1.1519 90.4648 -2.38839e-05 101.499 -2.38839e-05C114.473 -2.38839e-05 125.144 1.8188 133.51 5.45645C141.998 8.97285 148.304 14.0656 152.426 20.7346C156.67 27.2824 158.792 35.1033 158.792 44.1975V45.2888H124.598V42.5605C124.598 39.6504 123.931 37.3465 122.597 35.649C121.385 33.9514 118.839 32.7388 114.958 32.0113C111.199 31.2838 105.5 30.92 97.8614 30.92C92.0411 30.92 87.6153 31.2232 84.584 31.8294C81.5526 32.3145 79.4306 33.1026 78.2181 34.1939C77.1268 35.2852 76.5811 36.7403 76.5811 38.5591C76.5811 39.7716 76.8236 40.8629 77.3086 41.833C77.9149 42.6818 78.8243 43.3487 80.0369 43.8337C81.3707 44.3187 83.1289 44.7431 85.3115 45.1069L123.507 50.7452C133.45 52.2003 141.149 54.7466 146.606 58.3843C152.062 61.9007 155.882 66.084 158.065 70.9342C160.247 75.7844 161.338 80.8165 161.338 86.0305C161.338 92.942 159.398 99.4292 155.518 105.492C151.759 111.433 145.697 116.284 137.33 120.043C128.963 123.68 117.929 125.499 104.227 125.499ZM234.927 125.499C220.861 125.499 208.797 122.953 198.732 117.86C188.668 112.646 180.968 105.371 175.633 96.034C170.298 86.5761 167.63 75.4813 167.63 62.7495C167.63 50.0177 170.298 38.9835 175.633 29.6468C180.968 20.1889 188.668 12.9136 198.732 7.82093C208.797 2.60696 220.861 -2.38839e-05 234.927 -2.38839e-05C248.629 -2.38839e-05 260.33 2.06131 270.03 6.18398C279.852 10.3067 287.37 16.2482 292.584 24.0085C297.798 31.7688 300.405 41.1055 300.405 52.0184V55.1104H262.209V52.0184C262.209 45.1069 260.269 40.196 256.389 37.2859C252.509 34.2545 245.537 32.7389 235.473 32.7389C227.227 32.7389 220.801 33.5876 216.193 35.2852C211.707 36.8615 208.554 39.8323 206.735 44.1975C204.916 48.4414 204.007 54.6254 204.007 62.7495C204.007 70.7523 204.916 76.9363 206.735 81.3015C208.554 85.6667 211.707 88.6981 216.193 90.3956C220.801 91.972 227.227 92.7601 235.473 92.7601C245.537 92.7601 252.509 91.3051 256.389 88.3949C260.269 85.3636 262.209 80.3921 262.209 73.4806V70.3886H300.405V73.4806C300.405 84.2723 297.798 93.6089 292.584 101.49C287.37 109.251 279.852 115.192 270.03 119.315C260.33 123.438 248.629 125.499 234.927 125.499ZM340.516 123.68H302.138L354.702 1.8188H403.629L456.375 123.68H417.088L388.169 53.2916L380.166 32.7389H377.802L369.981 53.2916L340.516 123.68ZM423.09 101.127H333.24V70.3886H423.09V101.127ZM494.229 123.68H460.035V1.8188H531.151C541.943 1.8188 550.977 3.27386 558.252 6.18398C565.527 9.0941 570.984 13.338 574.621 18.9158C578.38 24.3722 580.26 31.1019 580.26 39.1047C580.26 45.5313 579.108 51.109 576.804 55.8379C574.621 60.4456 571.105 64.2045 566.255 67.1147C561.404 69.9035 555.099 71.783 547.339 72.753V74.5719C553.644 76.1482 558.131 78.5127 560.798 81.6653C563.587 84.6967 566.133 88.5162 568.437 93.1239L583.534 123.68H544.065L529.514 93.8514C528.059 90.82 526.544 88.4556 524.967 86.758C523.391 85.0604 521.33 83.9085 518.783 83.3022C516.237 82.5747 512.721 82.2109 508.234 82.2109H494.229V123.68ZM494.229 32.557V56.7474H530.788C535.759 56.7474 539.275 56.0198 541.337 54.5648C543.398 53.1097 544.429 49.7752 544.429 44.5612C544.429 39.711 543.398 36.4978 541.337 34.9214C539.275 33.3451 535.759 32.557 530.788 32.557H494.229Z" fill="white" />
              </svg>
            </div>
          </div>

          <nav className="flex w-full justify-between lg:text-[0.8vw] mt-4 lg:px-28" style={{ fontFamily: interTight }}>
            <BlurText text="ABOUT" delay={400} />
            <BlurText text="DIVISIONS" delay={500} />
            <BlurText text="GALLERY" delay={600} />
          </nav>
        </div>

        {/* --- BOTTOM SECTION (TOMBOL & INFO) --- */}
        <div className="grid grid-cols-3 items-end lg:px-28 lg:pb-10">
          <div className="flex flex-col text-left" style={{ fontFamily: interTight }}>
            <BlurText text="Independent" delay={900} className="text-[1vw]" />
            <BlurText text="Student Council" delay={1000} className="text-[1vw]" />
            <BlurText text="Of Abu Dzar" delay={1100} className="text-[1vw]" />
          </div>

          <div className="flex justify-center pointer-events-auto">
            <button
              disabled={exploreClicked}
              onClick={handleExploreClick}
              onMouseEnter={() => !exploreClicked && setHoverZoom(true)}
              onMouseLeave={() => !exploreClicked && setHoverZoom(false)}
              className="flex h-14 w-52 items-center justify-center rounded-[20px] border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10"
              style={{ fontFamily: interSemiBold }}
            >
              <BlurText text="Explore" delay={800} />
            </button>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[15vw] text-right">
              <BlurText
                text="Official representative body of Abu Dzar students. We bridge ideas, foster innovation, and create a home for every aspiring leader"
                delay={200}
                className="text-[0.9vw] leading-relaxed opacity-90"
                style={{ fontFamily: interTight }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}