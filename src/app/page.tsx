"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import ScrollReveal from "@/components/ScrollReveal";
import { useKonami } from "@/hooks/useKonami";
import { Montserrat, Poppins, Playfair_Display } from "next/font/google";

// Removed OceanWave import
const FilmArchive = dynamic(() => import("@/components/FilmArchive"), { ssr: false });
const TextLoop = dynamic(() => import("@/components/TextLoop"), { ssr: false });
const ServicesSection = dynamic(() => import("@/components/ServicesSection"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/ContactSection"), { ssr: false });
const AboutSection = dynamic(() => import("@/components/AboutSection"), { ssr: false });
import { useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const montserrat = Montserrat({ weight: ["500", "700"], subsets: ["latin"] });
const poppins = Poppins({ weight: ["400", "500"], subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"] });

/* ─── Ink wave SVG divider ──────────────────────────────────────────────── */
function InkWaveDivider({ visible }: { visible: boolean }) {
  return (
    <svg
      viewBox="0 0 500 20"
      fill="none"
      className="w-full max-w-sm"
      style={{ overflow: "visible" }}
    >
      <path
        d="M0 10 Q 60 0, 120 10 T 240 10 T 360 10 T 500 10"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        style={
          visible
            ? {
                strokeDasharray: 1,
                strokeDashoffset: 0,
                animation: "inkDraw 1.6s cubic-bezier(0.16,1,0.3,1) forwards",
              }
            : { strokeDasharray: 1, strokeDashoffset: 1 }
        }
        pathLength={1}
      />
    </svg>
  );
}

/* ─── Pre-computed random values (computed once at module load, never on render) ── */
const BUBBLE_POSITIONS = Array.from({ length: 12 }, () => ({
  left: Math.random() * 100,
  bottom: Math.random() * 40,
  width: 4 + Math.random() * 8,
  opacity: 0.1 + Math.random() * 0.3,
  dur: 3 + Math.random() * 2,
  delay: Math.random() * 2,
}));

const KRAKEN_POSITIONS = Array.from({ length: 8 }, () => ({
  left: 10 + Math.random() * 80,
  top: 10 + Math.random() * 80,
  fontSize: 40 + Math.random() * 60,
  dur: 0.8 + Math.random() * 0.5,
  delay: Math.random() * 0.4,
}));

/* ─── Konami overlay ────────────────────────────────────────────────────── */
function KonamiOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99990,
        background: "linear-gradient(180deg, rgba(0,20,60,0.97) 0%, rgba(0,5,20,0.98) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "deepOceanWash 4.5s ease forwards",
        pointerEvents: "none",
      }}
    >
      {/* Swimming fish */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: 0,
          animation: "fishSwim 4s ease-in-out forwards",
          fontSize: 48,
          filter: "drop-shadow(0 0 12px rgba(100,220,255,0.8))",
        }}
      >
        🐟
      </div>

      {/* Second fish */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: 0,
          animation: "fishSwim 4s 0.6s ease-in-out forwards",
          fontSize: 28,
          filter: "drop-shadow(0 0 8px rgba(100,220,255,0.6))",
          opacity: 0,
        }}
      >
        🐠
      </div>

      {/* Message */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(100,220,255,0.9)",
          textAlign: "center",
          animation: "konamiMsg 4.5s ease forwards",
          padding: "0 2rem",
          textShadow: "0 0 20px rgba(100,220,255,0.5)",
        }}
      >
        🌊 You found the deep.<br />
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7em" }}>
          Rudrangshu approves.
        </span>
      </div>

      {/* Floating bubbles — uses pre-computed positions */}
      {BUBBLE_POSITIONS.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${b.left}%`,
            bottom: `${b.bottom}%`,
            width: `${b.width}px`,
            height: `${b.width}px`,
            borderRadius: "50%",
            border: `1px solid rgba(100,200,255,${b.opacity})`,
            animation: `float ${b.dur}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Kraken ink splat overlay ──────────────────────────────────────────── */
function KrakenOverlay({ onDone }: { onDone: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99991,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Ink splatters — uses pre-computed positions */}
      {KRAKEN_POSITIONS.map((k, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${k.left}%`,
            top: `${k.top}%`,
            fontSize: `${k.fontSize}px`,
            animation: `inkSplat ${k.dur}s ${k.delay}s ease forwards`,
            opacity: 0,
            filter: "blur(1px)",
          }}
          onAnimationEnd={i === 0 ? onDone : undefined}
        >
          🦑
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const konamiActive = useKonami();
  
  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Timeline for cinematic transition between Hero and About
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top bottom", // Starts when top of about enters bottom of screen
        end: "top top",      // Ends when top of about hits top of screen
        scrub: true,
      }
    });

    // 1. Fade out the typography faster
    tl.to(".hero-typography", { opacity: 0, duration: 0.3 }, 0);
    
    // 2. Scale down and fade out the hero artwork
    tl.to(".hero-bg", { opacity: 0, scale: 0.95, duration: 1, ease: "power1.inOut" }, 0);
    
    // 3. Fade the About section background from transparent to pitch black
    tl.fromTo(".about-bg-element", 
      { backgroundColor: "rgba(0,0,0,0)" }, 
      { backgroundColor: "rgba(0,0,0,1)", duration: 1, ease: "none" }, 
      0
    );

    // 4. Stagger reveal the elements inside About section
    tl.fromTo(".about-stagger", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
      0.3
    );

  }, { scope: containerRef });

  // Kraken easter egg state
  const [krakenActive, setKrakenActive] = useState(false);
  const copyrightClicksRef = useRef(0);
  const copyrightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ink wave divider visibility
  const [inkVisible, setInkVisible] = useState(false);
  const inkRef = useRef<HTMLDivElement>(null);

  const handleCopyrightClick = useCallback(() => {
    copyrightClicksRef.current++;
    if (copyrightTimerRef.current) clearTimeout(copyrightTimerRef.current);
    copyrightTimerRef.current = setTimeout(() => {
      copyrightClicksRef.current = 0;
    }, 2000);

    if (copyrightClicksRef.current >= 5) {
      copyrightClicksRef.current = 0;
      setKrakenActive(true);
      // Apply screen shake
      document.body.style.animation = "krakenShake 0.6s ease forwards";
      setTimeout(() => {
        document.body.style.animation = "";
      }, 700);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      {/* ── Konami Easter Egg overlay ── */}
      {konamiActive && <KonamiOverlay />}

      {/* ── Kraken Easter Egg overlay ── */}
      {krakenActive && <KrakenOverlay onDone={() => setKrakenActive(false)} />}

      {/* ── Hero Section ── */}
      <div className="sticky top-0 min-h-screen w-full overflow-hidden hero-bg">
        {/* ── Video background (Desktop) ── */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 hidden md:block"
          src="/RUDE%20FRONT%20WITHOUT%20LOGO.mp4"
        />
        {/* ── Video background (Mobile 9:16) ── */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 block md:hidden"
          src="/hero%20section%20bg/916.MP4"
        />

        {/* ── Hero content ── */}
        <main className="relative z-10 flex flex-col md:flex-row min-h-screen w-full hero-typography">

          {/* ── LEFT COLUMN ── */}
          <div className="w-full md:w-1/2 relative h-[45vh] md:h-screen">
            
            {/* Cinematic Camera Overlay (Left) */}
            <div className="hidden md:flex absolute top-32 left-12 md:left-16 font-mono text-[9px] text-white/20 tracking-[0.3em] flex-col gap-2 pointer-events-none select-none z-20">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500/50 animate-pulse" /> REC</span>
              <span>[00:00:24:12]</span>
            </div>
            
            {/* Brand wrapper */}
            <div
              className="absolute top-[75%] md:top-1/2 left-1/2 md:left-[4vw] -translate-x-1/2 md:translate-x-0 -translate-y-1/2 logo-reveal pointer-events-none flex flex-col items-center md:items-start w-full md:w-auto"
            >
              {/* Logo + Tagline */}
              <div className="flex w-fit flex-col items-center md:items-start text-center md:text-left">
                <img
                  src="/rude logo.png"
                  alt="Rude"
                  className="block h-auto w-[clamp(160px,50vw,280px)] md:w-[clamp(200px,26vw,380px)]"
                />

                <p className="mt-4 md:mt-6 text-[clamp(14px,3.5vw,18px)] md:text-[clamp(14px,1.2vw,20px)] leading-[1.15] text-white md:-translate-y-[8px]">
                  i fix bad <strong>footage.</strong>
                  <br />
                  Miracles cost <strong>extra.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col justify-end md:justify-center items-center md:items-end w-full md:w-1/2 px-6 md:pr-12 lg:pr-16 text-center md:text-right relative h-[55vh] md:h-auto pb-24 md:pb-0">
            
            {/* Cinematic Camera Overlay (Right) */}
            <div className="hidden md:flex absolute top-32 right-8 md:right-12 lg:right-16 font-mono text-[9px] text-white/20 tracking-[0.3em] flex-col items-end gap-2 pointer-events-none select-none">
              <span>ISO 800</span>
              <span>5600K</span>
              <span>24 FPS</span>
            </div>



            {/* Label */}
            <p
              className={`text-white/80 font-bold text-sm md:text-base mb-1 ${montserrat.className}`}
              style={{ letterSpacing: "0.04em" }}
            >
              What i do
            </p>

            {/* Video Editor — cursive large title looping */}
            <TextLoop 
              items={[
                <span key="1">Video <span className={`${montserrat.className} not-italic tracking-tighter font-medium`}>Editor</span></span>, 
                <span key="2">Cinematic <span className={`${montserrat.className} not-italic tracking-tighter font-medium`}>Filmmaker</span></span>, 
                <span key="3">Visual <span className={`${montserrat.className} not-italic tracking-tighter font-medium`}>Storyteller</span></span>, 
                <span key="4">Creative <span className={`${montserrat.className} not-italic tracking-tighter font-medium`}>Director</span></span>
              ]}
              interval={4000}
              className={`text-white leading-none ${playfair.className} italic tracking-tight whitespace-nowrap`}
              style={{ fontSize: "clamp(2rem, 3.5vw, 4.5rem)" }}
            />

            {/* Tagline */}
            <p
              className={`text-white/55 ${poppins.className} text-xs md:text-sm leading-relaxed mt-4 mb-10`}
              style={{ maxWidth: "30ch", letterSpacing: "0.05em" }}
            >
              Every frame matters. <br/>
              Every cut tells a story.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center md:justify-end items-center gap-6 w-full mt-4 md:mt-0">
              <a href="#work" className="group flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                  View Archive
                </span>
                <div className="w-8 h-[1px] bg-white/20 group-hover:bg-white group-hover:w-12 transition-all duration-300 hidden md:block" />
              </a>
              <span className="w-[1px] h-3 bg-white/20" />
              <a href="#contact" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                Contact
              </a>
            </div>

            {/* Aesthetic Grid Crosshair (Bottom Right) */}
            <div className="absolute bottom-32 right-8 md:right-12 lg:right-16 pointer-events-none select-none">
              <div className="w-4 h-4 border-b border-r border-white/20" />
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-[10px] tracking-widest uppercase"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <span>Scroll</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </main>
      </div>

      {/* ── About the Author Section ── */}
      <div id="about" className="relative z-10 w-full">
        <AboutSection />
      </div>

      {/* ── Services Section ── */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* ── Work Gallery Section ── */}
      {/* NOTE: no overflow-hidden — it would break position:sticky inside FilmArchive */}
      <section id="work" className="relative w-full">
        <FilmArchive />
      </section>

      {/* ── Contact / Footer Section ── */}
      <ContactSection onCopyrightClick={handleCopyrightClick} />
    </div>
  );
}
