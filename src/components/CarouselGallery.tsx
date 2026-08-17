"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Great_Vibes, Montserrat } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ weight: ["400", "500", "700"], subsets: ["latin"] });

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
    category: "Comedy",
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
    category: "Cinematic",
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
    category: "Experimental",
    year: "2024",
    role: "Editor · Visual Director",
    description: "No brief, no client, no rules. Pure visual experimentation.",
    type: "video",
    src: "/gallery/Totally random..mp4",
    poster: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/51984031-9176-484b-f5e0-4af9a8e9ed00/w=800",
  },
  {
    id: "05",
    title: "Project Alpha",
    category: "Cinematic",
    year: "2026",
    role: "Editor",
    type: "video",
    src: "https://drive.google.com/uc?export=download&id=1330uAktITPYX9zKMKQUHQX2ybHvk3C_A",
    isVertical: true,
  },
  {
    id: "06",
    title: "Project Beta",
    category: "Documentary",
    year: "2026",
    role: "Cinematographer",
    type: "video",
    src: "https://drive.google.com/uc?export=download&id=13Tczh56kPa5Q-TMqZpmE7ry47ZZ64tTC",
    isVertical: true,
  },
  {
    id: "07",
    title: "Project Gamma",
    category: "Experimental",
    year: "2026",
    role: "Director",
    type: "video",
    src: "https://drive.google.com/uc?export=download&id=1wXkAJEh_KvW6nJOTKdp43pxbjEvm3GPW",
    isVertical: true,
  }
];

export default function CarouselGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  // Responsive settings
  const [cardWidth, setCardWidth] = useState(400);

  // Touch logic
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setCardWidth(window.innerWidth < 768 ? Math.min(window.innerWidth * 0.55, 240) : 420);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Wheel scrolling logic
  useEffect(() => {
    let lastWheelTime = 0;
    const onWheel = (e: WheelEvent) => {
      if (modalProject) return; // Disable scroll if modal is open
      
      const now = Date.now();
      if (now - lastWheelTime < 400) return; // Throttle
      
      if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
        if (e.deltaY > 0 || e.deltaX > 0) {
          setActiveIdx(p => Math.min(p + 1, PROJECTS.length - 1));
        } else {
          setActiveIdx(p => Math.max(p - 1, 0));
        }
        lastWheelTime = now;
      }
    };
    
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [modalProject]);

  const getCardStyles = (index: number) => {
    const diff = index - activeIdx;
    const absDiff = Math.abs(diff);
    
    // Scale distance based on screen size so they don't overlap too much on mobile
    const baseOffset = cardWidth * (window.innerWidth < 768 ? 0.75 : 0.6);

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
        x: -(baseOffset + absDiff * (cardWidth * 0.3)),
        z: -100 - absDiff * 100,
        rotateY: 35,
        scale: 0.9 - absDiff * 0.05,
        opacity: 1 - absDiff * 0.15,
        zIndex: 40 - absDiff,
        filter: "brightness(0.4)",
      };
    } else {
      return {
        x: baseOffset + absDiff * (cardWidth * 0.3),
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
    <section 
      className="relative w-full h-[100svh] bg-[#020306] overflow-hidden text-white flex flex-col justify-center items-center"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
      onTouchEnd={() => {
        if (!touchStartX.current || !touchEndX.current) return;
        const diff = touchStartX.current - touchEndX.current;
        if (diff > 50) {
          setActiveIdx(p => Math.min(p + 1, PROJECTS.length - 1));
        } else if (diff < -50) {
          setActiveIdx(p => Math.max(p - 1, 0));
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
      }}
    >
      {/* Background Cinematic Grain */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,30,50,0.6)_0%,rgba(2,3,6,1)_70%)]" />
        <div 
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
        />
      </div>

      {/* Header Info */}
      <div className="absolute top-24 md:top-24 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-4">
        <h1 className={`${montserrat.className} text-2xl md:text-5xl font-bold tracking-tight text-white/90 mb-2 md:mb-3 text-center`}>
          Selected Works
        </h1>
        <p className="text-white/40 text-xs md:text-base font-mono uppercase tracking-widest text-center">
          Cinematic Portfolio
        </p>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative w-full flex justify-center items-center h-[45vh] md:h-[50vh] mt-8 md:mt-8"
        style={{ perspective: "1200px" }}
      >
        {PROJECTS.map((proj, i) => {
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
                ease: [0.16, 1, 0.3, 1], // Custom cinematic spring feel
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
              {/* Actual Media instead of Poster */}
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
                      if (isCenter) {
                        el.play().catch(() => {});
                      } else {
                        el.pause();
                      }
                    }
                  }}
                />
              ) : (
                <iframe 
                  src={proj.src}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ border: 'none' }}
                  allow="autoplay; fullscreen"
                />
              )}
              
              {/* Center Item Overlays */}
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

      {/* Bottom Center Project Info */}
      <div className="absolute bottom-20 md:bottom-24 left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center px-4 md:px-6"
          >
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#8CD2FF] mb-2 text-center">
              {PROJECTS[activeIdx].category} · {PROJECTS[activeIdx].year}
            </p>
            <h2 className={`${greatVibes.className} text-4xl md:text-7xl font-normal text-white/90 mb-2 md:mb-4 text-center drop-shadow-lg leading-tight`}>
              &ldquo;{PROJECTS[activeIdx].title}&rdquo;
            </h2>
            <p className="text-white/40 text-xs md:text-base font-sans max-w-xs md:max-w-lg text-center leading-relaxed">
              {PROJECTS[activeIdx].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-6 flex gap-2 z-20">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIdx ? "w-8 bg-white" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>

      {/* Full Screen Video Modal */}
      <AnimatePresence>
        {modalProject && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 pt-16 md:p-12"
          >
            {/* Close Button */}
            <button 
              onClick={() => setModalProject(null)}
              className="absolute top-4 right-4 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/30 transition-colors z-[110]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Video Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-black rounded-xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative flex justify-center items-center ${
                modalProject.isVertical 
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
            
            {/* Modal Meta */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-center"
            >
              <h3 className={`${montserrat.className} text-2xl font-bold tracking-tight text-white mb-2`}>
                {modalProject.title}
              </h3>
              <p className="text-white/50 font-mono text-sm uppercase tracking-widest">
                {modalProject.category} · {modalProject.role}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
