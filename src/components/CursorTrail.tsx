"use client";

import { useEffect, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  born: number;
  duration: number; // ms
}

const MAX_RIPPLES = 10;
const THROTTLE_MS = 80;

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < THROTTLE_MS) return;
      lastSpawnRef.current = now;

      if (ripplesRef.current.length >= MAX_RIPPLES) {
        ripplesRef.current.shift();
      }

      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 3,
        maxRadius: 44 + Math.random() * 20,
        alpha: 0.45,
        born: now,
        duration: 900 + Math.random() * 300,
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const ripples = ripplesRef.current;

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const t = (now - r.born) / r.duration;
        if (t >= 1) { ripples.splice(i, 1); continue; }

        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        r.radius = Math.max(0, 3 + eased * (r.maxRadius - 3));
        r.alpha = 0.45 * (1 - t);

        if (r.radius > 0) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(100, 210, 240, ${r.alpha.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Second inner ring (smaller, faster)
        const innerR = Math.max(0, r.radius * 0.45);
        if (innerR > 0 && r.radius > 8) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, innerR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(160, 235, 255, ${(r.alpha * 0.5).toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9990,
      }}
      aria-hidden="true"
    />
  );
}
