"use client";

import { useEffect, useRef, useState } from "react";

// Positioned entirely with a canvas-style ref approach to avoid React state on every RAF tick
export default function FishCursor() {
  const [active, setActive] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // DOM refs — we mutate the DOM directly for position/flip to avoid 60fps setState
  const fishRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const prevXRef = useRef(-100);
  const facingLeftRef = useRef(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  // Key listeners — toggle active
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "f" || e.key === "F") && !e.repeat) {
        activeRef.current = true;
        setActive(true);
        setShowHint(true);
        document.body.style.cursor = "none";
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        hintTimerRef.current = setTimeout(() => setShowHint(false), 2000);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        activeRef.current = false;
        setActive(false);
        setShowHint(false);
        document.body.style.cursor = "";
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      document.body.style.cursor = "";
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  // RAF loop — mutates DOM directly, no setState per frame
  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const prev = currentRef.current;
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      const nx = lerp(prev.x, tx, 0.12);
      const ny = lerp(prev.y, ty, 0.12);
      currentRef.current = { x: nx, y: ny };

      const fish = fishRef.current;
      const hint = hintRef.current;

      if (fish) {
        fish.style.left = `${nx}px`;
        fish.style.top  = `${ny}px`;

        const dx = nx - prevXRef.current;
        if (Math.abs(dx) > 0.5) {
          const nowLeft = dx < 0;
          if (nowLeft !== facingLeftRef.current) {
            facingLeftRef.current = nowLeft;
            fish.style.transform = `translate(-50%, -50%) scaleX(${nowLeft ? -1 : 1})`;
          }
        }
        prevXRef.current = nx;
      }

      if (hint) {
        hint.style.left = `${nx + 28}px`;
        hint.style.top  = `${ny - 24}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* Fish SVG — positioned via ref mutation, not state */}
      <div
        ref={fishRef}
        style={{
          position: "fixed",
          left: -100,
          top: -100,
          transform: "translate(-50%, -50%) scaleX(1)",
          zIndex: 99999,
          pointerEvents: "none",
          filter: "drop-shadow(0 0 6px rgba(100,220,255,0.8))",
          willChange: "left, top, transform",
        }}
        aria-hidden="true"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(100,220,255,0.95)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12C21.5 10 19 7 15 7S8 10 5 12C8 14 11 17 15 17S21.5 14 22 12Z" fill="rgba(100,220,255,0.15)" />
          <path d="M2 8L6 12L2 16Z" fill="rgba(100,220,255,0.25)" />
          <path d="M13 7 Q15 4 18 6" />
          <circle cx="17.5" cy="10.5" r="1" fill="rgba(100,220,255,0.95)" />
          <circle cx="21" cy="8" r="0.5" stroke="rgba(160,235,255,0.6)" />
          <circle cx="23" cy="6" r="0.3" stroke="rgba(160,235,255,0.4)" />
        </svg>
      </div>

      {/* Hint tooltip */}
      {showHint && (
        <div
          ref={hintRef}
          style={{
            position: "fixed",
            left: -100,
            top: -100,
            background: "rgba(0,0,0,0.75)",
            border: "1px solid rgba(100,220,255,0.3)",
            borderRadius: 6,
            padding: "4px 10px",
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "rgba(100,220,255,0.9)",
            zIndex: 99999,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            backdropFilter: "blur(8px)",
            animation: "fadeInScale 0.3s ease forwards",
            willChange: "left, top",
          }}
        >
          🐟 fish mode
        </div>
      )}
    </>
  );
}
