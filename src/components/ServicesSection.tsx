"use client";

import { useState, useRef, useEffect } from "react";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

function HoverVideo({ src, isActive, className }: { src: string, isActive: boolean, className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {});
    } else {
      videoRef.current?.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className={className}
    />
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    title: "Cinematic Video Editing",
    tag: "Post-Production",
    desc: "Frame-perfect cuts that breathe life into raw footage, ensuring every moment hits with maximum emotional impact.",
    approach: "Story dictates the rhythm.",
    video: "/gallery/The break is over..mp4",
  },
  {
    title: "Commercial & Brand Content",
    tag: "Advertising",
    desc: "Visuals that sell without ever feeling like an ad. Built to elevate brand identity and drive engagement.",
    approach: "Hook the viewer in the first 3 seconds.",
    video: "/gallery/Totally random..mp4",
  },
  {
    title: "Product Advertisement Videos",
    tag: "Marketing",
    desc: "Make your product the star it deserves to be with dynamic lighting, pacing, and seamless transitions.",
    approach: "Highlight the details that matter.",
    video: "/gallery/Pitai is important.Flame Kaiser being my fav one..mp4",
  },
  {
    title: "Color Grading",
    tag: "Color Science",
    desc: "Mood, tone and emotion — dialed in pixel by pixel to create a cohesive and striking visual language.",
    approach: "Color is an unspoken character.",
    video: "/gallery/If i can u can too..POST IT.mp4",
  },
  {
    title: "Sound Design",
    tag: "Audio",
    desc: "Because great visuals deserve equally great sound. Immersive soundscapes that ground the viewer in the scene.",
    approach: "Half the picture is what you hear.",
    video: "/gallery/Totally random..mp4",
  },
  {
    title: "Short-form Content",
    tag: "Reels · Shorts · TikTok",
    desc: "Hook-first edits built for scroll-stopping impact in the modern attention economy.",
    approach: "Maximize retention without losing substance.",
    video: "/gallery/The break is over..mp4",
  },
  {
    title: "Documentary & Travel Films",
    tag: "Storytelling",
    desc: "Long-form narratives that move and linger, capturing the essence of places and people.",
    approach: "Find the story within the raw moments.",
    video: "/gallery/Totally random..mp4",
  },
  {
    title: "Talking Head & Corporate",
    tag: "Corporate",
    desc: "Professional presence that actually holds attention, shot and cut to feel premium and trustworthy.",
    approach: "Clarity and pacing above all.",
    video: "/gallery/If i can u can too..POST IT.mp4",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<number | null>(null);

  const active = activeService !== null ? SERVICES[activeService] : null;

  return (
    <section className="relative w-full bg-white text-black min-h-screen py-24 md:py-32 px-6 md:px-12 flex flex-col items-center overflow-hidden border-y border-black/5">
      
      {/* ── Top Header ── */}
      <div className="w-full max-w-7xl mb-16 md:mb-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-black/30" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
            Services Provided
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-none">
          What I{" "}
          <span className={`${greatVibes.className} font-normal text-[1.15em] text-black/40`}>
            do
          </span>
        </h2>
      </div>

      {/* ── Main Layout ── */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        
        {/* LEFT: Typography List with original hover collages */}
        <div className="w-full lg:w-[65%] flex flex-col relative" onMouseLeave={() => setActiveService(null)}>
          {SERVICES.map((s, idx) => {
            const isActive = idx === activeService;
            return (
              <div 
                key={idx}
                className="relative cursor-pointer group py-2 md:py-3 flex items-center"
                onMouseEnter={() => setActiveService(idx)}
              >
                {/* Index Number */}
                <span className="hidden md:block font-mono text-[10px] tracking-widest text-black/20 w-8 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Service Text */}
                <h2 
                  className={`text-[clamp(1.5rem,4vw,3.5rem)] font-bold tracking-tighter transition-all duration-500 ease-out z-10 w-[85%] md:w-auto ${
                    isActive ? "text-black scale-[1.02] origin-left" : "text-black/10 hover:text-black/30"
                  }`}
                  style={{ lineHeight: 0.95 }}
                >
                  {s.title}
                </h2>
                
                {/* Image/Video Collage Overlay for active item (Original Style) */}
                <div 
                  className={`absolute right-0 lg:right-4 top-1/2 -translate-y-1/2 w-48 h-64 md:w-56 md:h-72 lg:w-60 lg:h-[20rem] bg-black/5 rounded-sm shadow-2xl transition-all duration-500 pointer-events-none z-20 ${
                    isActive ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-8 scale-95"
                  }`}
                >
                  <HoverVideo
                    src={s.video}
                    isActive={isActive}
                    className="w-full h-full object-cover opacity-90 border border-black/10 p-2 bg-white"
                  />
                  {/* Secondary image for the collage effect */}
                  <div className="absolute -bottom-6 -left-6 w-28 h-36 bg-white p-1 border border-black/10 shadow-xl hidden md:block">
                     <HoverVideo
                        src={SERVICES[(idx + 1) % SERVICES.length].video}
                        isActive={isActive}
                        className="w-full h-full object-cover grayscale opacity-80"
                      />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Detailed Information Panel to fill the space */}
        <div className={`w-full lg:w-[35%] flex flex-col justify-center relative transition-opacity duration-500 ${active !== null ? 'opacity-100' : 'opacity-0'}`}>
          
          {active !== null && (
            <>
              {/* Massive subtle background number */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[20rem] font-bold text-black/[0.02] pointer-events-none select-none z-0 transition-all duration-500">
                {String(activeService! + 1).padStart(2, '0')}
              </div>
              
              <div className="relative z-10 p-8 border border-black/5 bg-black/[0.01] rounded-2xl backdrop-blur-sm">
                <div className="w-8 h-[2px] bg-black/20 mb-6" />
                
                <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 mb-3">
                  {active.tag}
                </h4>
                
                <h3 className="text-2xl font-semibold tracking-tight text-black mb-6 leading-snug">
                  {active.title}
                </h3>
                
                <p className="text-base text-black/60 leading-relaxed mb-8">
                  {active.desc}
                </p>
                
                <div className="pl-4 border-l border-black/15">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/30 mb-1">
                    My Approach
                  </p>
                  <p className="text-sm italic font-medium text-black/70">
                    "{active.approach}"
                  </p>
                </div>
                
                {/* Call to action */}
                <div className="mt-10 pt-6 border-t border-black/5">
                  <a href="#contact" className="inline-flex items-center gap-2 text-xs font-semibold text-black hover:text-black/60 transition-colors uppercase tracking-widest">
                    Discuss Project
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
