"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface VideoItem {
  src: string;
  title: string;
}

const VIDEOS: VideoItem[] = [
  { src: "/gallery/If i can u can too..POST IT.mp4",               title: "If I Can, U Can Too" },
  { src: "/gallery/Pitai is important.Flame Kaiser being my fav one..mp4", title: "Pitai Is Important" },
  { src: "/gallery/The break is over..mp4",                         title: "The Break Is Over" },
  { src: "/gallery/Totally random..mp4",                            title: "Totally Random" },
];

/* ─── constants ─────────────────────────────────────────── */
const TILE_W       = 280;
const TILE_H       = 280;
const SPACING      = 3.2;
const SPEED        = 5;          // deg / s autorotate
const TILT         = -8;         // rotateX
const PERSPECTIVE  = 3200;
const CORNER_R     = 18;
const INNER_DIM    = 0.30;       // brightness of back face

export default function VideoGallery() {
  const count  = VIDEOS.length;
  const angle  = 360 / count;
  const factor = 1 + SPACING * 0.15;
  const radius = (TILE_W * factor) / (2 * Math.tan(Math.PI / count));
  const degPerSec = SPEED * 6;

  /* ── ring rotation state ── */
  const ringRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef(0);
  const rotYRef  = useRef(0);
  const velRef   = useRef(0);
  const lastRef  = useRef(0);
  const dragRef  = useRef({ active: false, x: 0 });

  /* ── video tile refs (for hover-preview) ── */
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  /* ── modal state ── */
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  /* ─── animation loop ─────────────────────────────────── */
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const apply = () => {
      ring.style.transform =
        `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
    };
    apply();

    const draw = (now: number) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);
      const d = dragRef.current;
      if (!d.active) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * f;
          velRef.current  *= 0.93;
        } else {
          rotYRef.current += degPerSec * f;
        }
      }
      apply();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, degPerSec]);

  /* ─── pointer handlers ───────────────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, x: e.clientX };
    velRef.current  = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    const k = 0.3 * 5;
    rotYRef.current += dx * k;
    velRef.current   = dx * k * 60;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current.active = false;
  };

  /* ─── tile hover preview ─────────────────────────────── */
  const onTileEnter = (i: number) => {
    const v = videoRefs.current[i];
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  };
  const onTileLeave = (i: number) => {
    const v = videoRefs.current[i];
    if (v) { v.pause(); v.currentTime = 0; }
  };

  /* ─── modal close on Escape ──────────────────────────── */
  const closeModal = useCallback(() => setActiveIdx(null), []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  /* ─── shared styles ──────────────────────────────────── */
  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: CORNER_R,
    overflow: "hidden",
    backfaceVisibility: "hidden",
  };

  return (
    <>
      {/* ── 3-D ring ─────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: `${PERSPECTIVE}px`,
          cursor: "grab",
          touchAction: "none",
          overflow: "hidden",
          background: "transparent",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${TILT}deg)` }}>
          <div
            ref={ringRef}
            style={{
              position: "relative",
              width: TILE_W,
              height: TILE_H,
              transformStyle: "preserve-3d",
            }}
          >
            {VIDEOS.map((vid, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
                onMouseEnter={() => onTileEnter(i)}
                onMouseLeave={() => onTileLeave(i)}
                onClick={() => setActiveIdx(i)}
              >
                {/* FRONT face */}
                <div style={{ ...faceBase, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
                  <video
                    ref={el => { videoRefs.current[i] = el; }}
                    src={vid.src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Play icon overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "14px 16px",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {vid.title}
                    </span>
                  </div>
                  {/* Click-to-play hint */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.12)",
                      border: "1.5px solid rgba(255,255,255,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(6px)",
                      pointerEvents: "none",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                      <path d="M4 3l9 5-9 5V3z"/>
                    </svg>
                  </div>
                </div>

                {/* BACK face (dimmed mirror) */}
                <div
                  style={{
                    ...faceBase,
                    transform: "rotateY(180deg)",
                    filter: `brightness(${INNER_DIM})`,
                    background: "#111",
                  }}
                >
                  <video
                    src={vid.src}
                    muted
                    loop
                    playsInline
                    preload="none"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full-screen modal player ──────────────────────── */}
      {activeIdx !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(18px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 20,
          }}
          onClick={closeModal}
        >
          {/* stop propagation so clicking video itself doesn't close */}
          <div
            style={{ position: "relative", maxWidth: "92vw", maxHeight: "82vh" }}
            onClick={e => e.stopPropagation()}
          >
            <video
              key={activeIdx}
              src={VIDEOS[activeIdx].src}
              controls
              autoPlay
              playsInline
              style={{
                display: "block",
                maxWidth: "92vw",
                maxHeight: "82vh",
                width: "auto",
                height: "auto",
                borderRadius: 12,
                boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
                background: "#000",
              }}
            />
          </div>

          {/* Title */}
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {VIDEOS[activeIdx].title}
          </p>

          {/* Close button */}
          <button
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 24,
              right: 28,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: 42,
              height: 42,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              backdropFilter: "blur(8px)",
              transition: "background 0.2s",
            }}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
