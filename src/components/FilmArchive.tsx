"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  number: string;
  title: string;
  category: string;
  year: string;
  role: string;
  description: string;
  type: "video" | "photo";
  src: string;
  accentHue: string;
}

// ─── Project data ─────────────────────────────────────────────────────────────
// Add / reorder / remove entries here — no component logic changes needed.

const PROJECTS: Project[] = [
  {
    number: "01",
    title: "If I Can, U Can Too",
    category: "Short Film · Motivational",
    year: "2024",
    role: "Editor · Colorist",
    description:
      "A raw, unfiltered message to anyone who doubts their own potential.",
    type: "video",
    src: "/gallery/If i can u can too..POST IT.mp4",
    accentHue: "rgba(200,155,70,0.14)",
  },
  {
    number: "02",
    title: "Pitai Is Important",
    category: "Comedy · Brand Film",
    year: "2024",
    role: "Director · Editor",
    description:
      "Flame Kaiser, discipline, and the art of making pain look good on screen.",
    type: "video",
    src: "/gallery/Pitai is important.Flame Kaiser being my fav one..mp4",
    accentHue: "rgba(55,115,220,0.13)",
  },
  {
    number: "03",
    title: "The Break Is Over",
    category: "Personal · Cinematic",
    year: "2024",
    role: "Filmmaker · Editor",
    description: "When stillness ends and the lens wakes back up.",
    type: "video",
    src: "/gallery/The break is over..mp4",
    accentHue: "rgba(70,175,145,0.13)",
  },
  {
    number: "04",
    title: "Totally Random",
    category: "Experimental · Creative",
    year: "2024",
    role: "Editor · Visual Director",
    description:
      "No brief, no client, no rules. Pure visual experimentation.",
    type: "video",
    src: "/gallery/Totally random..mp4",
    accentHue: "rgba(145,70,200,0.13)",
  },
];

const N = PROJECTS.length;

// ─── Pre-computed static particle positions ────────────────────────────────────

const PARTICLES = [
  { id:  0, x:  8.2, y: 22.4, r: 1.8, dur:  8.2, delay: 0.0, op: 0.09 },
  { id:  1, x: 16.7, y: 58.1, r: 1.3, dur: 11.4, delay: 1.7, op: 0.07 },
  { id:  2, x: 27.3, y: 34.6, r: 2.2, dur:  7.6, delay: 3.2, op: 0.11 },
  { id:  3, x: 38.9, y: 71.2, r: 1.5, dur: 13.1, delay: 0.8, op: 0.08 },
  { id:  4, x: 48.4, y: 18.7, r: 2.8, dur:  9.3, delay: 4.6, op: 0.10 },
  { id:  5, x: 57.1, y: 45.3, r: 1.6, dur: 10.7, delay: 2.1, op: 0.08 },
  { id:  6, x: 63.8, y: 79.6, r: 2.1, dur:  8.8, delay: 5.5, op: 0.09 },
  { id:  7, x: 72.5, y: 29.8, r: 1.4, dur: 12.2, delay: 1.3, op: 0.07 },
  { id:  8, x: 81.2, y: 55.4, r: 2.4, dur:  7.9, delay: 3.9, op: 0.12 },
  { id:  9, x: 89.6, y: 68.3, r: 1.7, dur: 14.5, delay: 0.4, op: 0.08 },
  { id: 10, x: 91.4, y: 40.1, r: 1.2, dur:  9.6, delay: 6.2, op: 0.07 },
  { id: 11, x: 33.7, y: 82.9, r: 2.6, dur: 11.8, delay: 2.8, op: 0.10 },
  { id: 12, x: 52.9, y: 13.5, r: 1.9, dur:  8.4, delay: 4.1, op: 0.09 },
  { id: 13, x: 76.3, y: 90.2, r: 1.1, dur: 15.0, delay: 1.0, op: 0.06 },
];

// ─── Fish SVG (Rude brand identity) ──────────────────────────────────────────

function RudeFish({ opacity = 0.75 }: { opacity?: number }) {
  return (
    <svg
      width="32"
      height="20"
      viewBox="0 0 24 15"
      fill="none"
      stroke={`rgba(120,210,255,${opacity})`}
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M20 7.5C19.5 5.5 17.5 4 14 4S7.5 5.5 5 7.5C7.5 9.5 10 11 14 11S19.5 9.5 20 7.5Z"
        fill={`rgba(100,190,255,${opacity * 0.1})`}
      />
      <path d="M2 4.5L5.5 7.5L2 10.5Z" fill={`rgba(100,190,255,${opacity * 0.18})`} />
      <circle cx="16.5" cy="6.8" r="0.8" fill={`rgba(140,220,255,${opacity})`} />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FilmArchive() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRefs  = useRef<(HTMLVideoElement | null)[]>([]);
  const rafRef     = useRef<number>(0);
  const prevIdxRef = useRef(0);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [textIn,    setTextIn]    = useState(true);
  const [fishAnim,  setFishAnim]  = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hovering,  setHovering]  = useState(false);
  const [modal,     setModal]     = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  // Detect mobile (no hooks calls inside conditionals — safe here)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Scroll tracking: RAF reads wrapper rect, derives active project ─────────
  const tick = useCallback(() => {
    const w = wrapperRef.current;
    if (!w) return;
    const vh = window.innerHeight;
    const scrolledIn = Math.max(0, -w.getBoundingClientRect().top);
    const idx = Math.min(N - 1, Math.floor(scrolledIn / vh));

    if (idx !== prevIdxRef.current) {
      prevIdxRef.current = idx;
      if (timerRef.current) clearTimeout(timerRef.current);

      setTextIn(false);
      setFishAnim(true);

      timerRef.current = setTimeout(() => {
        setActiveIdx(idx);
        setTextIn(true);
        timerRef.current = setTimeout(() => setFishAnim(false), 700);
      }, 260);
    }
  }, []);

  // Start / stop RAF loop based on visibility
  useEffect(() => {
    const run = () => { tick(); rafRef.current = requestAnimationFrame(run); };
    const io = new IntersectionObserver(([e]) => {
      setIsVisible(e.isIntersecting);
      if (e.isIntersecting) { rafRef.current = requestAnimationFrame(run); }
      else { cancelAnimationFrame(rafRef.current); }
    }, { threshold: 0 });
    if (wrapperRef.current) io.observe(wrapperRef.current);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      io.disconnect();
    };
  }, [tick]);

  // ── Video lazy-load: only active + next get src ─────────────────────────────
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      const isActive = i === activeIdx;
      const isNext   = i === (activeIdx + 1) % N;
      if (isActive) {
        if (!v.getAttribute("src")) { v.setAttribute("src", PROJECTS[i].src); v.load(); }
        if (isVisible) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      } else if (isNext) {
        if (!v.getAttribute("src")) { v.setAttribute("src", PROJECTS[i].src); v.load(); }
        v.pause();
      } else {
        v.pause();
      }
    });
  }, [activeIdx, isVisible]);

  // ── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const proj = PROJECTS[activeIdx];

  // ─────────────────── MOBILE LAYOUT ─────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div style={{ background: "#020306" }}>
          <div style={{ padding: "56px 20px 36px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ margin: "0 0 10px", fontFamily: "monospace", fontSize: 9, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(255,255,255,0.20)" }}>
              Selected Works
            </p>
            <h2 className={greatVibes.className} style={{ margin: 0, fontSize: "clamp(2.2rem, 10vw, 3.4rem)", fontWeight: 400, color: "rgba(255,255,255,0.86)" }}>
              The Archive
            </h2>
          </div>

          {PROJECTS.map((p, i) => (
            <div
              key={i}
              style={{ position: "relative", height: "72vh", overflow: "hidden", cursor: "pointer" }}
              onClick={() => { setActiveIdx(i); setModal(true); }}
            >
              <video
                src={p.src}
                muted loop playsInline autoPlay
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)" }} />
              <div style={{ position: "absolute", top: 16, left: 20 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,255,255,0.28)" }}>
                  {p.number} / {String(N).padStart(2, "0")}
                </span>
              </div>
              <div style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
                <p style={{ margin: "0 0 5px", fontFamily: "monospace", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.40)" }}>
                  {p.category}
                </p>
                <h3 className={greatVibes.className} style={{ margin: "0 0 6px", fontSize: "clamp(1.6rem, 7vw, 2.4rem)", fontWeight: 400, color: "rgba(255,255,255,0.92)" }}>
                  &ldquo;{p.title}&rdquo;
                </h3>
                <p style={{ margin: 0, fontFamily: "var(--font-geist-sans, system-ui)", fontSize: 12, color: "rgba(255,255,255,0.34)", letterSpacing: "0.03em" }}>
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {modal && (
          <ProjectModal
            project={PROJECTS[activeIdx]}
            total={N}
            gvClass={greatVibes.className}
            onClose={() => setModal(false)}
          />
        )}
        <KeyframeStyles />
      </>
    );
  }

  // ─────────────────── DESKTOP LAYOUT ────────────────────────────────────────
  //
  // Wrapper height = (N + 1) × 100vh
  //   • Each of the N projects owns 100vh of scroll.
  //   • The final extra 100vh means the last project gets a full screen of dwell
  //     before the sticky element unsticks and normal page scroll resumes.
  //
  return (
    <>
      <div
        ref={wrapperRef}
        style={{ height: `${(N + 1) * 100}vh`, position: "relative" }}
        aria-label="Film Archive — Selected Works"
      >
        {/* ── STICKY VIEWPORT ─────────────────────────────────────────────── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#020306",
            cursor: hovering ? "pointer" : "default",
          }}
        >

          {/* Layer 1 ─ Fullscreen video backgrounds (opacity crossfade) */}
          {PROJECTS.map((p, i) => (
            <video
              key={i}
              ref={el => { videoRefs.current[i] = el; }}
              muted loop playsInline preload="none"
              aria-hidden="true"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                opacity: i === activeIdx ? 1 : 0,
                transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1)",
                zIndex: i === activeIdx ? 1 : 0,
                pointerEvents: "none",
                willChange: "opacity",
              }}
            />
          ))}

          {/* Layer 2 ─ Film grain overlay */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 3,
            opacity: 0.038,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
            pointerEvents: "none",
            animation: "fa-grain 0.2s steps(1) infinite",
          }} />

          {/* Layer 3 ─ Cinematic vignette */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
            background: `
              radial-gradient(ellipse at 50% 44%, transparent 26%, rgba(0,0,0,0.70) 100%),
              linear-gradient(to bottom,
                rgba(0,0,0,0.74) 0%,
                rgba(0,0,0,0.10) 20%,
                rgba(0,0,0,0.06) 58%,
                rgba(0,0,0,0.80) 100%)
            `,
          }} />

          {/* Layer 4 ─ Ocean particles */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none", overflow: "hidden" }}>
            {PARTICLES.map(p => (
              <div key={p.id} style={{
                position: "absolute",
                left: `${p.x}%`, top: `${p.y}%`,
                width: p.r * 2, height: p.r * 2,
                borderRadius: "50%",
                background: "rgba(140,210,255,1)",
                opacity: p.op,
                animation: `fa-drift ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
                willChange: "transform",
              }} />
            ))}
          </div>

          {/* Layer 5 ─ Project accent glow (bottom-center, transitions per project) */}
          <div aria-hidden="true" style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "42%",
            zIndex: 4, pointerEvents: "none",
            background: `radial-gradient(ellipse at 50% 100%, ${proj.accentHue} 0%, transparent 70%)`,
            transition: "background 1.5s ease",
          }} />

          {/* ── LEFT EDGE: Vertical progress rail ─────────────────────────── */}
          <div aria-hidden="true" style={{
            position: "absolute",
            left: "clamp(18px, 2.2vw, 38px)",
            top: "50%", transform: "translateY(-50%)",
            zIndex: 10,
            display: "flex", flexDirection: "column", gap: 7,
            pointerEvents: "none",
          }}>
            {PROJECTS.map((_, i) => (
              <div key={i} style={{
                width: 2,
                height: i === activeIdx ? 40 : 14,
                background: i === activeIdx
                  ? "rgba(255,255,255,0.80)"
                  : i < activeIdx
                  ? "rgba(255,255,255,0.26)"
                  : "rgba(255,255,255,0.10)",
                borderRadius: 1,
                transition: "all 0.55s cubic-bezier(0.16,1,0.3,1)",
              }} />
            ))}
          </div>

          {/* ── BOTTOM-LEFT: Project counter ──────────────────────────────── */}
          <div style={{
            position: "absolute",
            bottom: "clamp(24px, 4vh, 46px)",
            left: "clamp(18px, 2.2vw, 38px)",
            zIndex: 10, pointerEvents: "none",
          }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: "clamp(9px, 0.82vw, 11px)",
              letterSpacing: "0.32em",
              color: "rgba(255,255,255,0.30)",
              textTransform: "uppercase",
            }}>
              {proj.number}&nbsp;/&nbsp;{String(N).padStart(2, "0")}
            </span>
          </div>

          {/* ── RIGHT EDGE: Year · Role (rotated 90°) ─────────────────────── */}
          <div aria-hidden="true" style={{
            position: "absolute",
            right: "clamp(14px, 1.8vw, 30px)",
            top: "50%",
            zIndex: 10, pointerEvents: "none",
            transform: "translateY(-50%) rotate(90deg)",
            transformOrigin: "center center",
            whiteSpace: "nowrap",
            opacity: textIn ? 0.30 : 0,
            transition: "opacity 0.4s ease",
          }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: "clamp(8px, 0.76vw, 10px)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "white",
            }}>
              {proj.year}&ensp;·&ensp;{proj.role}
            </span>
          </div>

          {/* ── BOTTOM-RIGHT: Category ─────────────────────────────────────── */}
          <div style={{
            position: "absolute",
            bottom: "clamp(24px, 4vh, 46px)",
            right: "clamp(18px, 2.2vw, 38px)",
            zIndex: 10, pointerEvents: "none",
            whiteSpace: "nowrap",
            opacity: textIn ? 0.30 : 0,
            transition: "opacity 0.4s ease",
          }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: "clamp(9px, 0.82vw, 11px)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "white",
            }}>
              {proj.category}
            </span>
          </div>

          {/* ── TOP-CENTER: Archive label ──────────────────────────────────── */}
          <div aria-hidden="true" style={{
            position: "absolute",
            top: "clamp(18px, 2.8vh, 34px)",
            left: "50%", transform: "translateX(-50%)",
            zIndex: 10, pointerEvents: "none", textAlign: "center",
          }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: "clamp(8px, 0.74vw, 10px)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.17)",
            }}>
              Selected Works — Film Archive
            </span>
          </div>

          {/* ── CENTER: Large title + description + View Film button ─────────── */}
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "clamp(8px, 1.5vh, 22px)",
              paddingBottom: "8vh",
              cursor: "pointer",
            }}
            onClick={() => setModal(true)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            role="button"
            tabIndex={0}
            aria-label={`Open project: ${proj.title}`}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setModal(true); }
            }}
          >
            {/* Large Great Vibes italic title */}
            <h2
              className={greatVibes.className}
              style={{
                margin: 0,
                fontSize: "clamp(2.6rem, 7.5vw, 8.5rem)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.93)",
                textAlign: "center",
                letterSpacing: "0.015em",
                textShadow: "0 4px 60px rgba(0,0,0,0.88)",
                lineHeight: 1.06,
                maxWidth: "80vw",
                opacity: textIn ? 1 : 0,
                transform: textIn ? "translateY(0px)" : "translateY(24px)",
                transition: "opacity 0.44s cubic-bezier(0.16,1,0.3,1), transform 0.44s cubic-bezier(0.16,1,0.3,1)",
                willChange: "transform, opacity",
              }}
            >
              &ldquo;{proj.title}&rdquo;
            </h2>

            {/* Short cinematic description */}
            <p style={{
              margin: 0,
              fontFamily: "var(--font-geist-sans, -apple-system, BlinkMacSystemFont, system-ui)",
              fontSize: "clamp(11px, 1.1vw, 14px)",
              color: "rgba(255,255,255,0.34)",
              letterSpacing: "0.04em",
              textAlign: "center",
              maxWidth: "44ch",
              opacity: textIn ? 1 : 0,
              transform: textIn ? "translateY(0px)" : "translateY(16px)",
              transition: "opacity 0.44s cubic-bezier(0.16,1,0.3,1) 0.07s, transform 0.44s cubic-bezier(0.16,1,0.3,1) 0.07s",
              willChange: "transform, opacity",
            }}>
              {proj.description}
            </p>

            {/* View Film pill button */}
            <div
              aria-hidden="true"
              style={{
                marginTop: 6,
                display: "flex", alignItems: "center", gap: 10,
                opacity: textIn ? (hovering ? 0.88 : 0.28) : 0,
                transform: hovering ? "scale(1.06)" : "scale(1)",
                transition: "opacity 0.4s ease 0.12s, transform 0.32s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.42)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
                background: "rgba(255,255,255,0.045)",
                boxShadow: hovering ? "0 0 22px rgba(140,210,255,0.22)" : "none",
                transition: "box-shadow 0.35s ease",
              }}>
                <svg width="9" height="10" viewBox="0 0 16 18" fill="white">
                  <path d="M3 1.5l12 7.5-12 7.5V1.5z" />
                </svg>
              </div>
              <span style={{
                fontFamily: "monospace", fontSize: 9,
                letterSpacing: "0.24em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
              }}>
                View Film
              </span>
            </div>
          </div>

          {/* ── FISH SIGNATURE ─────────────────────────────────────────────── */}
          {/* Swims left-to-right on each project transition.
              Rests as a faint persistent mark between transitions. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "clamp(18px, 3vh, 34px)",
              left: "50%",
              zIndex: 10, pointerEvents: "none",
              filter: "drop-shadow(0 0 6px rgba(100,200,255,0.55))",
              opacity: fishAnim ? undefined : 0.16,
              transform: fishAnim ? undefined : "translateX(-50%)",
              animation: fishAnim ? "fa-fish 0.85s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
            }}
          >
            <RudeFish opacity={fishAnim ? 0.75 : 0.16} />
          </div>

          {/* ── SCROLL HINT (first project only) ─────────────────────────── */}
          <div aria-hidden="true" style={{
            position: "absolute",
            bottom: "clamp(18px, 3vh, 34px)",
            left: "50%",
            transform: "translateX(calc(-50% + 72px))",
            zIndex: 10, pointerEvents: "none",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            opacity: activeIdx === 0 ? 0.22 : 0,
            transition: "opacity 0.7s ease",
          }}>
            <span style={{
              fontFamily: "monospace", fontSize: 8,
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
            }}>
              Scroll
            </span>
            <svg width="10" height="14" viewBox="0 0 10 18" fill="none"
              stroke="rgba(255,255,255,0.8)" strokeWidth="1.4" strokeLinecap="round">
              <rect x="1.5" y="1.5" width="7" height="12" rx="3.5" />
              <line x1="5" y1="4.5" x2="5" y2="7"
                style={{ animation: "fa-scroll-dot 1.9s ease-in-out infinite" }} />
            </svg>
          </div>

        </div>{/* /sticky */}
      </div>{/* /wrapper */}

      {/* ── Project detail modal ─────────────────────────────────────────── */}
      {modal && (
        <ProjectModal
          project={proj}
          total={N}
          gvClass={greatVibes.className}
          onClose={() => setModal(false)}
        />
      )}

      <KeyframeStyles />
    </>
  );
}

// ─── Keyframe styles (isolated so they're included once) ─────────────────────

function KeyframeStyles() {
  return (
    <style>{`
      /* Ocean particles: slow diagonal drift */
      @keyframes fa-drift {
        from { transform: translate(0px, 0px); }
        to   { transform: translate(10px, -18px); }
      }
      /* Film grain: tile-offset flicker */
      @keyframes fa-grain {
        0%   { background-position:   0px   0px; }
        25%  { background-position:  44px  18px; }
        50%  { background-position:  18px  44px; }
        75%  { background-position: -10px  10px; }
        100% { background-position:   0px   0px; }
      }
      /* Fish signature: swims left → right across bottom center */
      @keyframes fa-fish {
        0%   { transform: translateX(calc(-50% - 36px)) scaleX(1); opacity: 0;    }
        18%  { opacity: 0.76; }
        82%  { opacity: 0.58; }
        100% { transform: translateX(calc(-50% + 36px)) scaleX(1); opacity: 0.16; }
      }
      /* Modal backdrop fade */
      @keyframes fa-modal-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      /* Scroll-indicator dot bounce */
      @keyframes fa-scroll-dot {
        0%, 100% { transform: translateY(0px);  }
        50%       { transform: translateY(4px);  }
      }
    `}</style>
  );
}

// ─── Project detail modal ─────────────────────────────────────────────────────

function ProjectModal({
  project,
  total,
  gvClass,
  onClose,
}: {
  project: Project;
  total: number;
  gvClass: string;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(1,3,7,0.97)",
        backdropFilter: "blur(28px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "clamp(20px, 4vw, 56px)",
        overflowY: "auto",
        animation: "fa-modal-in 0.32s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 1120, display: "flex", flexDirection: "column", gap: 22 }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <p style={{
              margin: "0 0 6px",
              fontFamily: "monospace", fontSize: 9,
              letterSpacing: "0.34em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.24)",
            }}>
              {project.number}&nbsp;/&nbsp;{String(total).padStart(2, "0")}
              &nbsp;&nbsp;·&nbsp;&nbsp;{project.year}
            </p>
            <h2
              className={gvClass}
              style={{
                margin: 0,
                fontSize: "clamp(2rem, 5.5vw, 5.5rem)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.90)",
                lineHeight: 1.08,
              }}
            >
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close project detail"
            style={{
              flexShrink: 0, marginTop: 6,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%",
              width: 42, height: 42,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(10px)",
              transition: "background 0.2s, color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => {
              const b = e.currentTarget;
              b.style.background = "rgba(255,255,255,0.10)";
              b.style.color = "#fff";
              b.style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={e => {
              const b = e.currentTarget;
              b.style.background = "rgba(255,255,255,0.05)";
              b.style.color = "rgba(255,255,255,0.55)";
              b.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* Video */}
        <div style={{
          width: "100%", aspectRatio: "16 / 9",
          background: "#000", borderRadius: 10, overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.85)",
        }}>
          <video
            key={project.src}
            src={project.src}
            controls autoPlay playsInline
            style={{ width: "100%", height: "100%", display: "block", objectFit: "contain", background: "#000" }}
          />
        </div>

        {/* Meta grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px 40px",
          paddingTop: 4,
        }}>
          {([
            { label: "Role",        value: project.role        },
            { label: "Category",    value: project.category    },
            { label: "Description", value: project.description },
          ] as const).map(({ label, value }) => (
            <div key={label}>
              <p style={{
                margin: "0 0 4px",
                fontFamily: "monospace", fontSize: 9,
                letterSpacing: "0.32em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)",
              }}>
                {label}
              </p>
              <p style={{
                margin: 0,
                fontFamily: "var(--font-geist-sans, -apple-system, BlinkMacSystemFont, system-ui)",
                fontSize: 14,
                color: "rgba(255,255,255,0.64)",
                lineHeight: 1.58,
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
