"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

// --- Data ---

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
    desc: "Mood, tone and emotion dialed in pixel by pixel to create a cohesive and striking visual language.",
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
    tag: "Reels - Shorts - TikTok",
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

// --- Single shared floating video ---
// Only ONE video element in the DOM. src is swapped imperatively on demand.

interface FloatingVideoProps {
  src: string | null;
  visible: boolean;
  anchorY: number;
}

const FloatingVideo = memo(function FloatingVideo({
  src, visible, anchorY,
}: FloatingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevSrc  = useRef<string | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!visible) { v.pause(); return; }
    if (src && src !== prevSrc.current) {
      prevSrc.current = src;
      v.src = src;
      v.load();
    }
    v.play().catch(() => {});
  }, [visible, src]);

  return (
    <div
      className="hidden lg:block absolute right-4 pointer-events-none z-20 w-60 rounded-sm shadow-xl"
      style={{
        top: anchorY,
        height: "20rem",
        background: "rgba(0,0,0,0.05)",
        opacity: visible ? 1 : 0,
        transform: `translateY(-50%) translateX(${visible ? "0px" : "20px"}) scale(${visible ? 1 : 0.95})`,
        transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity, transform",
        overflow: "visible",
      }}
    >
      <video
        ref={videoRef}
        muted loop playsInline preload="none"
        className="w-full h-full object-cover opacity-90 border border-black/10 p-2 bg-white"
      />
    </div>
  );
});

// --- Memoized service row ---

interface RowProps {
  s: (typeof SERVICES)[0];
  idx: number;
  isActive: boolean;
  isClicked: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const ServiceRow = memo(function ServiceRow({
  s, idx, isActive, isClicked, rowRef, onEnter, onLeave, onClick,
}: RowProps) {
  return (
    <div
      ref={rowRef}
      className="relative cursor-pointer py-4 lg:py-3 flex flex-col justify-center border-b border-black/5 lg:border-none"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="flex items-center w-full">
        <span className="hidden md:block font-mono text-[10px] tracking-widest text-black/20 w-8 shrink-0">
          {String(idx + 1).padStart(2, "0")}
        </span>

        <h2
          className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-tighter z-10 w-full lg:w-auto pr-4 lg:pr-0"
          style={{
            lineHeight: 0.95,
            color: isActive ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.12)",
            transform: isActive ? "scaleX(1.02)" : "scaleX(1)",
            transformOrigin: "left center",
            transition: "color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
            willChange: "color, transform",
          }}
        >
          {s.title}
        </h2>

        {isClicked && (
          <span className="hidden lg:block ml-3 font-mono text-[8px] uppercase tracking-widest text-black/25 shrink-0">
            pinned
          </span>
        )}

        <div
          className="lg:hidden ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-black/5 shrink-0"
          style={{
            transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="black" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Mobile inline details */}
      <div
        className="lg:hidden overflow-hidden"
        style={{
          maxHeight: isActive ? "800px" : "0px",
          opacity: isActive ? 1 : 0,
          marginTop: isActive ? "24px" : "0px",
          marginBottom: isActive ? "8px" : "0px",
          transition: "max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease",
        }}
      >
        <div className="w-full aspect-video mb-5 rounded-lg overflow-hidden bg-black/5 shadow-inner">
          {isActive && (
            <video
              src={s.video}
              autoPlay muted loop playsInline preload="metadata"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 mb-2">{s.tag}</h4>
        <p className="text-sm text-black/60 leading-relaxed mb-5">{s.desc}</p>

        <div className="pl-3 border-l border-black/15 mb-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/30 mb-1">My Approach</p>
          <p className="text-xs italic font-medium text-black/70">&quot;{s.approach}&quot;</p>
        </div>

        <a href="#contact" className="inline-flex items-center gap-2 text-[10px] font-bold text-black uppercase tracking-widest">
          Discuss Project
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
});

// --- Main Component ---

export default function ServicesSection() {
  const [clickedService, setClickedService] = useState<number | null>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((idx: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoveredService(idx);
  }, []);

  const handleLeave = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => setHoveredService(null), 80);
  }, []);

  const handleClick = useCallback((idx: number) => {
    setClickedService(prev => prev === idx ? null : idx);
  }, []);

  const activeIdx = hoveredService !== null ? hoveredService : clickedService;
  const active = activeIdx !== null ? SERVICES[activeIdx] : null;

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftColRef = useRef<HTMLDivElement>(null);
  const [anchorY, setAnchorY] = useState(0);

  useEffect(() => {
    if (activeIdx === null) return;
    const row = rowRefs.current[activeIdx];
    const col = leftColRef.current;
    if (!row || !col) return;
    const rowRect = row.getBoundingClientRect();
    const colRect = col.getBoundingClientRect();
    setAnchorY(rowRect.top - colRect.top + rowRect.height / 2);
  }, [activeIdx]);

  return (
    <section className="relative w-full bg-white text-black min-h-screen py-24 md:py-32 px-6 md:px-12 flex flex-col items-center overflow-hidden border-y border-black/5">

      {/* Header */}
      <div className="w-full max-w-7xl mb-16 md:mb-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-black/30" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">Services Provided</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black leading-none">
          What I{" "}
          <span className={`${greatVibes.className} font-normal text-[1.15em] text-black/40`}>do</span>
        </h2>
      </div>

      {/* Main Layout */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 lg:gap-24 relative z-10">

        {/* LEFT: List + shared floating video */}
        <div ref={leftColRef} className="w-full lg:w-[65%] flex flex-col relative">

          <FloatingVideo
            src={active?.video ?? null}
            visible={activeIdx !== null}
            anchorY={anchorY}
          />

          {SERVICES.map((s, idx) => (
            <ServiceRow
              key={idx}
              s={s}
              idx={idx}
              isActive={idx === activeIdx}
              isClicked={idx === clickedService}
              rowRef={(el) => { rowRefs.current[idx] = el; }}
              onEnter={() => handleEnter(idx)}
              onLeave={handleLeave}
              onClick={() => handleClick(idx)}
            />
          ))}
        </div>

        {/* RIGHT: Info panel */}
        <div
          className="hidden lg:flex w-full lg:w-[35%] flex-col justify-center relative"
          style={{
            opacity: active !== null ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-bold text-black/[0.02] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            {activeIdx !== null ? String(activeIdx + 1).padStart(2, "0") : ""}
          </div>

          <div className="relative z-10 p-8 border border-black/5 bg-black/[0.01] rounded-2xl">
            <div className="w-8 h-[2px] bg-black/20 mb-6" />
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 mb-3">
              {active?.tag ?? ""}
            </h4>
            <h3 className="text-2xl font-semibold tracking-tight text-black mb-6 leading-snug">
              {active?.title ?? ""}
            </h3>
            <p className="text-base text-black/60 leading-relaxed mb-8">
              {active?.desc ?? ""}
            </p>
            <div className="pl-4 border-l border-black/15">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/30 mb-1">My Approach</p>
              <p className="text-sm italic font-medium text-black/70">
                {active ? `"${active.approach}"` : ""}
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-black/5">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs font-semibold text-black hover:text-black/60 uppercase tracking-widest"
                style={{ transition: "color 0.2s ease" }}
              >
                Discuss Project
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}