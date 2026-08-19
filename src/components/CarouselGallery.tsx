"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Great_Vibes, Montserrat, Playfair_Display } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"] });
const playfair = Playfair_Display({ weight: ["400", "500", "600"], subsets: ["latin"], style: ["normal", "italic"] });

// ─── Data ─────────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  type: "video" | "iframe" | "image";
  src: string;
  poster?: string;
  description?: string;
  role?: string;
  isVertical?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "If I Can, U Can Too",
    category: "Short Film",
    year: "2024",
    role: "Editor · Colorist",
    description: "A raw, unfiltered message to anyone who doubts their own potential.",
    type: "video",
    src: "/gallery/If i can u can too..POST IT.mp4",
    poster: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/612d1402-0ad9-4135-3bbc-a30a6a252b00/w=800",
  },
  {
    id: "02",
    title: "Pitai Is Important",
    category: "Documentary",
    year: "2024",
    role: "Director · Editor",
    description: "Flame Kaiser, discipline, and the art of making pain look good on screen.",
    type: "video",
    src: "/gallery/Pitai is important.Flame Kaiser being my fav one..mp4",
    poster: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/6d2ad64a-102d-4eab-0efe-31479e34b500/w=800",
  },
  {
    id: "03",
    title: "The Break Is Over",
    category: "Short Film",
    year: "2024",
    role: "Filmmaker · Editor",
    description: "When stillness ends and the lens wakes back up.",
    type: "video",
    src: "/gallery/The break is over..mp4",
    poster: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/be854dd1-37aa-4fc7-f569-fdb948109300/w=800",
  },
  {
    id: "04",
    title: "Totally Random",
    category: "Short Film",
    year: "2024",
    role: "Editor · Visual Director",
    description: "No brief, no client, no rules. Pure visual experimentation.",
    type: "video",
    src: "/gallery/Totally random..mp4",
    poster: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/51984031-9176-484b-f5e0-4af9a8e9ed00/w=800",
  },
  {
    id: "05",
    title: "Ayra Tea 1",
    category: "Ayra Tea",
    year: "2026",
    role: "Editor",
    type: "iframe",
    src: "https://drive.google.com/file/d/1330uAktITPYX9zKMKQUHQX2ybHvk3C_A/preview",
    isVertical: true,
  },
  {
    id: "06",
    title: "Orfab",
    category: "Documentary",
    year: "2024",
    role: "Editor",
    description: "Every Assamese handloom has a heartbeat, This is hers.",
    type: "iframe",
    src: "https://drive.google.com/file/d/11DcubpXVgW8Mm8U9sL1Uo3GwjsNnk0AM/preview",
    isVertical: true,
  },
  {
    id: "07",
    title: "Ayra Tea 2",
    category: "Ayra Tea,Documentary",
    year: "2026",
    role: "Director",
    type: "iframe",
    src: "https://drive.google.com/file/d/1wXkAJEh_KvW6nJOTKdp43pxbjEvm3GPW/preview",
    isVertical: true,
  },
  {
    id: "08",
    title: "Assam Premier League Video 1",
    category: "Assam Premier League",
    year: "2024",
    description: "Video created for the Jorhat Stallions.",
    type: "iframe",
    src: "https://drive.google.com/file/d/1dtEiz0Dq3sgDcF5cu3xKB7fPuFP5j9Mq/preview",
    isVertical: true,
  },
  {
    id: "09",
    title: "Assam Premier League Video 2",
    category: "Assam Premier League",
    year: "2024",
    description: "Video created for the Jorhat Stallions.",
    type: "iframe",
    src: "https://drive.google.com/file/d/1ISQHFwsgePrlB9iYFiSXl3Ro7UP0Amru/preview",
    isVertical: true,
  },
  {
    id: "10",
    title: "Assam Premier League Video 3",
    category: "Assam Premier League",
    year: "2024",
    description: "Video created for the Jorhat Stallions.",
    type: "iframe",
    src: "https://drive.google.com/file/d/1vMVngIsbtvnsBrqSWLvy1mhHjEYzpvAk/preview",
    isVertical: true,
  },
  {
    id: "11",
    title: "Assam Premier League Video 4",
    category: "Assam Premier League",
    year: "2024",
    description: "Video created for the Jorhat Stallions.",
    type: "iframe",
    src: "https://drive.google.com/file/d/13X1IkWA-BTC6ZPLwUTH-JFarZ09pyhIh/preview",
    isVertical: true,
  },
  {
    id: "12",
    title: "Assam Premier League Video 5",
    category: "Assam Premier League",
    year: "2024",
    description: "Video created for the Jorhat Stallions.",
    type: "iframe",
    src: "https://drive.google.com/file/d/1deRE9tUGlZPw1WS3F8nwvZVhPWuTkYdS/preview",
    isVertical: true,
  },
  {
    id: "13",
    title: "Assam Premier League Video 6",
    category: "Assam Premier League",
    year: "2024",
    description: "Video created for the Jorhat Stallions.",
    type: "iframe",
    src: "https://drive.google.com/file/d/1d18N2FyUPnbTMxH7g1bA0v49VZefNILL/preview",
    isVertical: true,
  },
  {
    id: "14",
    title: "Relentles ep 1",
    category: "Relentless",
    year: "2024",
    description: "Pushing limits at Relentless – fitness, athletics, and martial arts.",
    type: "iframe",
    src: "https://drive.google.com/file/d/1RgJz8FCDIt9Mg2f4JAOjPSNsEba86hvs/preview",
    isVertical: true,
  },
  {
    id: "15",
    title: "Relentles ep 2",
    category: "Relentless",
    year: "2024",
    description: "Pushing limits at Relentless – fitness, athletics, and martial arts.",
    type: "iframe",
    src: "https://drive.google.com/file/d/14aTFm3Z3upvNEr23QgXVEReOkwAMMATh/preview",
    isVertical: true,
  },
  {
    id: "16",
    title: "Relentles ep 3",
    category: "Relentless",
    year: "2024",
    description: "Pushing limits at Relentless – fitness, athletics, and martial arts.",
    type: "iframe",
    src: "https://drive.google.com/file/d/1Cw-7i7lpFAaen0yOadQrA1uB-FQdi9_L/preview",
    isVertical: true,
  },
  {
    id: "17",
    title: "Relentles ep 4",
    category: "Relentless",
    year: "2024",
    description: "Pushing limits at Relentless – fitness, athletics, and martial arts.",
    type: "iframe",
    src: "https://drive.google.com/file/d/1Q1nrB22YWcupZmTtFJZc4hUBWbEs3ERZ/preview",
    isVertical: true,
  },
  {
    id: "18",
    title: "Relentles ep 5",
    category: "Relentless",
    year: "2024",
    description: "Pushing limits at Relentless – fitness, athletics, and martial arts.",
    type: "iframe",
    src: "https://drive.google.com/file/d/18kQuzeTVPKoX8L7EqISnskkxv7DkR53D/preview",
    isVertical: true,
  }
];

const CATEGORIES = ["All", "Short Film", "Documentary", "Assam Premier League", "Ayra Tea", "Relentless"];

const STATS = [
  { value: "07", label: "Projects" },
  { value: "3+", label: "Years Active" },
  { value: "4", label: "Categories" },
  { value: "∞", label: "Stories Told" },
];

export default function CarouselGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Responsive settings
  const [cardWidth, setCardWidth] = useState(400);

  // Touch logic
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setCardWidth(window.innerWidth < 768 ? Math.min(window.innerWidth * 0.70, 320) : 420);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProjects = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.category.includes(activeCategory));

  // Reset active index when filter changes
  useEffect(() => { setActiveIdx(0); }, [activeCategory]);

  // Wheel scrolling logic
  useEffect(() => {
    let lastWheelTime = 0;
    const onWheel = (e: WheelEvent) => {
      if (modalProject) return;
      e.preventDefault(); // Prevent page from scrolling
      const now = Date.now();
      if (now - lastWheelTime < 400) return;
      if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
        if (e.deltaY > 0 || e.deltaX > 0) {
          setActiveIdx(p => Math.min(p + 1, filteredProjects.length - 1));
        } else {
          setActiveIdx(p => Math.max(p - 1, 0));
        }
        lastWheelTime = now;
      }
    };

    const el = carouselRef.current;
    if (el) {
      el.addEventListener("wheel", onWheel, { passive: false });
    }
    return () => {
      if (el) {
        el.removeEventListener("wheel", onWheel);
      }
    };
  }, [modalProject, filteredProjects.length]);

  const getCardStyles = (index: number) => {
    const diff = index - activeIdx;
    const absDiff = Math.abs(diff);

    // Scale distance based on screen size so they don't overlap too much on mobile
    const baseOffset = cardWidth * (window.innerWidth < 768 ? 0.75 : 0.8);

    if (diff === 0) {
      return {
        x: 0,
        z: 100,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 50,
        filter: "brightness(1)",
      };
    } else if (diff < 0) {
      return {
        x: -(baseOffset + absDiff * (cardWidth * 0.34)),
        z: -100 - absDiff * 100,
        rotateY: 35,
        scale: 0.9 - absDiff * 0.05,
        opacity: 1 - absDiff * 0.15,
        zIndex: 40 - absDiff,
        filter: "brightness(0.4)",
      };
    } else {
      return {
        x: baseOffset + absDiff * (cardWidth * 0.34),
        z: -100 - absDiff * 100,
        rotateY: -35,
        scale: 0.9 - absDiff * 0.05,
        opacity: 1 - absDiff * 0.15,
        zIndex: 40 - absDiff,
        filter: "brightness(0.4)",
      };
    }
  };

  return (
    <div className={`${montserrat.className} w-full min-h-screen flex flex-col text-[#111] overflow-x-hidden relative`} style={{ backgroundColor: "#f9f9f7" }}>

      {/* ── GLOBAL PAGE BACKGROUND ────────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        {/* Soft warm off-white base */}
        <div className="absolute inset-0" style={{ backgroundColor: "#f9f9f7" }} />

        {/* Dot-grid pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.30]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="#111" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>

        {/* Radial fade — center lightens so content pops */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(249,249,247,0.95)_0%,rgba(249,249,247,0.6)_55%,transparent_100%)]" />

        {/* Very subtle top-left accent blob */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,0,0,0.025) 0%, transparent 70%)" }} />

        {/* Very subtle bottom-right accent blob */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,0,0,0.025) 0%, transparent 70%)" }} />

        {/* Hairline rules for structure */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#111]/5 to-transparent" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#111]/5 to-transparent" />
      </div>

      {/* ── HERO HEADER ───────────────────────────────────────────────────────── */}
      <header className="relative w-full pt-24 pb-8 md:pt-28 md:pb-16 px-6 md:px-16 overflow-hidden">
        {/* Decorative geometric lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#111]/8 to-transparent" />
          <div className="absolute top-0 left-16 md:left-24 w-px h-full bg-gradient-to-b from-transparent via-[#111]/6 to-transparent" />
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-[#111]/4" />
          <div className="absolute -top-24 -right-24 w-[360px] h-[360px] rounded-full border border-[#111]/3" />
          <svg className="absolute bottom-0 right-0 opacity-[0.04]" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 8 }, (_, col) => (
                <circle key={`${row}-${col}`} cx={col * 26 + 13} cy={row * 26 + 13} r="1.5" fill="#111" />
              ))
            )}
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">


          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`${playfair.className} text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.92] tracking-tight text-[#111]`}
            >
              Selected<br />
              <span className="italic font-normal text-[#111]/50">Works</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="md:max-w-xs text-sm md:text-base text-[#111]/50 leading-relaxed font-light"
            >
              A curated collection of films, edits, and visual experiments — each frame deliberate, each cut intentional.
            </motion.p>
          </div>
        </div>
      </header>



      {/* ── CATEGORY FILTER ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full px-6 md:px-16 pt-2 pb-6 md:py-6 border-b border-[#111]/6"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-3">
          <div className="flex items-center justify-between w-full md:w-auto">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#111]/30 mr-2">Filter</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#111]/25 md:hidden">
              {filteredProjects.length} / {PROJECTS.length} works
            </span>
          </div>
          
          {/* Desktop Filters */}
          <div className="hidden md:flex flex-wrap gap-2 md:gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-mono uppercase tracking-wider border transition-all duration-200 ${cat === activeCategory
                    ? "bg-[#111] text-white border-[#111]"
                    : "bg-transparent text-[#111]/50 border-[#111]/15 hover:border-[#111]/40 hover:text-[#111]/80"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile Dropdown */}
          <div className="block md:hidden relative w-full z-50">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-transparent border border-[#111]/20 rounded-lg px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-[#111]/80 outline-none focus:border-[#111]/50 transition-colors"
            >
              <span>{activeCategory}</span>
              <motion.svg
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-[#111]/10 rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col"
                  >
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                          cat === activeCategory
                            ? "bg-[#111] text-white"
                            : "text-[#111]/60 hover:bg-[#111]/5 hover:text-[#111]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="ml-auto hidden md:block">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#111]/25">
              {filteredProjects.length} / {PROJECTS.length} works
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── CAROUSEL SECTION ──────────────────────────────────────────────────── */}
      <section
        className="relative w-full flex-1 min-h-[70svh] md:min-h-[100svh] py-16 bg-white overflow-hidden flex flex-col justify-center items-center"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
        onTouchEnd={() => {
          if (!touchStartX.current || !touchEndX.current) return;
          const diff = touchStartX.current - touchEndX.current;
          if (diff > 50) {
            setActiveIdx(p => Math.min(p + 1, filteredProjects.length - 1));
          } else if (diff < -50) {
            setActiveIdx(p => Math.max(p - 1, 0));
          }
          touchStartX.current = 0;
          touchEndX.current = 0;
        }}
      >
        {/* Subtle light background texture */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,230,235,0.8)_0%,rgba(255,255,255,1)_70%)]" />
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#111]/4 to-transparent" />
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#111]/4 to-transparent" />
          <div className="absolute top-0 left-[8%] w-px h-full bg-gradient-to-b from-transparent via-[#111]/4 to-transparent" />
          <div className="absolute top-0 right-[8%] w-px h-full bg-gradient-to-b from-transparent via-[#111]/4 to-transparent" />
        </div>

        {/* Section label */}
        <div className="absolute top-10 md:top-12 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-4">
          <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.35em] text-[#111]/30 mb-2 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-[#111]/20" />
            Browse Collection
            <span className="inline-block w-6 h-px bg-[#111]/20" />
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeCategory}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className="text-[9px] font-mono text-[#111]/20 uppercase tracking-[0.2em]"
            >
              {activeCategory} · {filteredProjects.length} {filteredProjects.length === 1 ? "work" : "works"}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Carousel Container — card design & animation UNCHANGED */}
        <div
          ref={carouselRef}
          className="relative w-full flex justify-center items-center h-[50vh] md:h-[60vh] mt-6 md:mt-0 md:-translate-y-8"
          style={{ perspective: "1200px" }}
        >
          {filteredProjects.map((proj, i) => {
            const styles = getCardStyles(i);
            const isCenter = i === activeIdx;

            return (
              <motion.div
                key={proj.id}
                initial={false}
                animate={{
                  x: styles.x,
                  z: styles.z,
                  rotateY: styles.rotateY,
                  scale: styles.scale,
                  opacity: styles.opacity,
                  filter: styles.filter,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute cursor-pointer shadow-2xl rounded-2xl overflow-hidden group"
                style={{
                  width: cardWidth,
                  aspectRatio: "4/5",
                  zIndex: styles.zIndex,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (isCenter) {
                    setModalProject(proj);
                  } else {
                    setActiveIdx(i);
                  }
                }}
              >
                {proj.type === "video" ? (
                  <video
                    src={proj.src}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    preload="metadata"
                    muted
                    playsInline
                    loop
                    ref={(el) => {
                      if (el) {
                        if (isCenter) { el.play().catch(() => { }); }
                        else { el.pause(); }
                      }
                    }}
                  />
                ) : (
                  <iframe
                    src={proj.src}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ border: "none" }}
                    allow="autoplay; fullscreen"
                  />
                )}

                {isCenter && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md bg-white/10 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1">
                          <path d="M8 5V19L19 12L8 5Z" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Project Info */}
        <div className="absolute bottom-6 md:bottom-12 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${activeIdx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center px-4 md:px-6"
            >
              <h2
                className={`${greatVibes.className} text-4xl md:text-7xl font-normal text-[#111]/85 mb-2 md:mb-4 text-center leading-tight`}
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
              >
                &ldquo;{filteredProjects[activeIdx]?.title}&rdquo;
              </h2>
              <p className="text-[#111]/40 text-xs md:text-sm font-sans max-w-xs md:max-w-lg text-center leading-relaxed">
                {filteredProjects[activeIdx]?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-1 md:bottom-4 flex gap-2 z-20">
          {filteredProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? "w-8 bg-[#111]" : "w-1.5 bg-[#111]/15 hover:bg-[#111]/30"
                }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        {/* Keyboard hint */}
        <div className="absolute bottom-1 right-6 md:right-12 z-20 hidden md:flex items-center gap-2 pointer-events-none">
          <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-[#111]/20">Scroll to navigate</span>
        </div>

        {/* Left/Right Navigation Arrows */}
        <div className="absolute top-1/2 left-2 md:left-8 -translate-y-1/2 z-[60]">
          <button
            onClick={() => setActiveIdx(p => Math.max(p - 1, 0))}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#111]/10 bg-white/50 backdrop-blur-sm flex items-center justify-center text-[#111]/70 hover:bg-[#111] hover:text-white hover:border-[#111] transition-all shadow-sm"
            aria-label="Previous Project"
            disabled={activeIdx === 0}
            style={{ opacity: activeIdx === 0 ? 0.3 : 1, cursor: activeIdx === 0 ? 'not-allowed' : 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        <div className="absolute top-1/2 right-2 md:right-8 -translate-y-1/2 z-[60]">
          <button
            onClick={() => setActiveIdx(p => Math.min(p + 1, filteredProjects.length - 1))}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#111]/10 bg-white/50 backdrop-blur-sm flex items-center justify-center text-[#111]/70 hover:bg-[#111] hover:text-white hover:border-[#111] transition-all shadow-sm"
            aria-label="Next Project"
            disabled={activeIdx === filteredProjects.length - 1}
            style={{ opacity: activeIdx === filteredProjects.length - 1 ? 0.3 : 1, cursor: activeIdx === filteredProjects.length - 1 ? 'not-allowed' : 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>



      {/* ── FOOTER NOTE ───────────────────────────────────────────────────────── */}
      <footer className="w-full px-6 md:px-16 py-8 border-t border-[#111]/6 bg-white text-[#111]/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em]">
          <p>
            © {new Date().getFullYear()} RUDRANGSHU SONOWAL
          </p>
          <p className="text-center">
            DESIGNED & DEVELOPED WITH <span className="text-red-500">❤️</span> BY{' '}
            <a
              href="https://aryyaman-s-about.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[#111]/30 text-[#111]/80 hover:text-[#111] hover:decoration-[#111]/60 transition-colors"
            >
              ARYYAMAN BORA
            </a>
          </p>
          <div className="hidden md:block w-24"></div> {/* Spacer to keep center text truly centered */}
        </div>
      </footer>

      {/* ── FULL SCREEN VIDEO MODAL (unchanged) ───────────────────────────────── */}
      <AnimatePresence>
        {modalProject && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 pt-16 md:p-12"
          >
            <button
              onClick={() => setModalProject(null)}
              className="absolute top-4 right-4 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/30 transition-colors z-[110]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-black rounded-xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative flex justify-center items-center ${modalProject.isVertical
                  ? "w-auto h-[75vh] md:h-[85vh] aspect-[9/16]"
                  : "w-full max-w-6xl aspect-video"
                }`}
            >
              {modalProject.type === "video" ? (
                <video
                  src={modalProject.src}
                  poster={modalProject.poster}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={modalProject.src}
                  allow="autoplay"
                  className="absolute inset-0 w-full h-full border-none bg-black"
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-center"
            >
              <h3 className={`${montserrat.className} text-2xl font-bold tracking-tight text-white mb-2`}>
                {modalProject.title}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
