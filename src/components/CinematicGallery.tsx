"use client";

import { useEffect, useRef, useState } from "react";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

const ROMAN = ["I", "II", "III", "IV"];

interface VideoItem {
  src: string;
  title: string;
  tag: string;
}

const VIDEOS: VideoItem[] = [
  {
    src: "/gallery/If i can u can too..POST IT.mp4",
    title: "If I Can, U Can Too",
    tag: "Motivational",
  },
  {
    src: "/gallery/Pitai is important.Flame Kaiser being my fav one..mp4",
    title: "Pitai Is Important",
    tag: "Comedy",
  },
  {
    src: "/gallery/The break is over..mp4",
    title: "The Break Is Over",
    tag: "Personal",
  },
  {
    src: "/gallery/Totally random..mp4",
    title: "Totally Random",
    tag: "Creative",
  },
];

// Layout configuration for the 4 videos to create the staggered masonry look
const LAYOUT_CONFIG = [
  {
    wrapper: "self-start w-full md:w-[42%]",
    textContainer: "mt-4 md:mt-0 md:absolute md:top-[15%] md:-right-[40%] flex gap-8 items-center",
    textClass: "text-white/80 font-serif text-sm md:text-base tracking-wide",
  },
  {
    wrapper: "self-end w-full md:w-[50%] mt-12 md:-mt-[12%]",
    textContainer: "mt-4 md:mt-0 md:absolute md:top-[30%] md:-left-[25%] flex gap-8 items-center",
    textClass: "text-white/80 font-serif text-sm md:text-base tracking-wide",
  },
  {
    wrapper: "self-start w-full md:w-[80%] mt-12 md:mt-[8%]",
    textContainer: "mb-4 md:mb-0 md:absolute md:-top-10 md:left-[15%] flex gap-8 items-center",
    textClass: "text-white/80 font-serif text-sm md:text-base tracking-wide",
  },
  {
    wrapper: "self-end w-full md:w-[28%] mt-12 md:-mt-[10%]",
    textContainer: "mt-4 md:mt-0 md:absolute md:bottom-[20%] md:-left-[45%] flex gap-8 items-center",
    textClass: "text-white/80 font-serif text-sm md:text-base tracking-wide",
  },
];

export default function CinematicGallery() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const openModal = (idx: number) => {
    setActiveIdx(idx);
    setModalOpen(true);
  };

  return (
    <>
      <div className="w-full bg-[#151412] text-white py-32 overflow-hidden relative">
        
        {/* Subtle background grain/texture overlay could go here */}
        
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex flex-col relative z-10">
          
          {VIDEOS.map((vid, i) => {
            const config = LAYOUT_CONFIG[i];
            
            return (
              <div key={i} className={`relative flex flex-col ${config.wrapper}`}>
                
                {/* For video 3, the text is positioned above the video visually in absolute mode, 
                    so we render it before the video in the DOM to make sure margins work on mobile */}
                <div className={`${config.textContainer} z-20`}>
                  <span className="font-serif text-xs md:text-sm text-white/50 w-6 text-right">
                    {ROMAN[i]}
                  </span>
                  <span className={config.textClass}>
                    {vid.title}
                  </span>
                </div>

                <div 
                  className="relative w-full aspect-video md:aspect-auto overflow-hidden cursor-pointer group"
                  onClick={() => openModal(i)}
                >
                  <video
                    src={vid.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 w-12 h-12 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
                       <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
                        <path d="M4 2.5l10 5.5-10 5.5V2.5z" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ FULLSCREEN MODAL ═══ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          onClick={() => setModalOpen(false)}
          style={{ animation: "cinFadeIn 0.3s ease" }}
        >
          <div
            className="relative max-w-[92vw] max-h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <video
              key={activeIdx}
              src={VIDEOS[activeIdx].src}
              controls
              autoPlay
              playsInline
              className="block max-w-[92vw] max-h-[80vh] w-auto h-auto rounded-lg shadow-2xl bg-black"
            />
          </div>
          <p className="font-serif text-xs tracking-[0.2em] uppercase text-white/50 m-0">
            {ROMAN[activeIdx]} &mdash; {VIDEOS[activeIdx].title}
          </p>
          <button
            onClick={() => setModalOpen(false)}
            className="fixed top-6 right-8 bg-white/5 hover:bg-white/15 border border-white/20 rounded-full w-10 h-10 flex items-center justify-center text-white backdrop-blur-md transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>
      )}

      <style>{`
        @keyframes cinFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}

