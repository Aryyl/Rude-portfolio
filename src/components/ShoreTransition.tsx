"use client";

import { useEffect, useRef } from "react";

interface FoamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rx: number;
  ry: number;
  alpha: number;
  maxAlpha: number;
  born: number;
  life: number;
}

export default function ShoreTransition({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 1, h = 1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── Shore-line equation ──────────────────────────────────
       Returns y (in canvas px) for a given normalised x [0,1]
       at time t (seconds).
       The shore is in the upper-middle of the canvas.          */
    const getShoreY = (xn: number, t: number): number => {
      const base = h * 0.40;
      const wash = Math.sin(t * 0.78) * h * 0.09;   // big 8 s wash
      const vary =
        Math.sin(xn * Math.PI * 1.3  + t * 0.28) * h * 0.068
        + Math.sin(xn * Math.PI * 3.4  - t * 0.46) * h * 0.032
        + Math.sin(xn * Math.PI * 0.55 + t * 0.17) * h * 0.095
        + Math.sin(xn * Math.PI * 6.8  + t * 0.59) * h * 0.010;
      return base + wash + vary;
    };

    const particles: FoamParticle[] = [];
    const MAX_P = 90;
    let lastSpawnT = -1;

    const spawnParticles = (t: number) => {
      const count = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count && particles.length < MAX_P; i++) {
        const xn = Math.random();
        const sy = getShoreY(xn, t);
        particles.push({
          x: xn * w, y: sy,
          vx: (Math.random() - 0.5) * 0.55,
          vy: Math.random() * 0.35 + 0.08,
          rx: 5 + Math.random() * 22,
          ry: 1.5 + Math.random() * 4.5,
          alpha: 0,
          maxAlpha: 0.10 + Math.random() * 0.24,
          born: t,
          life: 2.0 + Math.random() * 3.5,
        });
      }
    };

    const SAMPLES = 240;
    const shoreY  = new Float32Array(SAMPLES + 1);

    let start = performance.now();

    const draw = (now: number) => {
      let t = (now - start) / 1000;
      if (prefersReduced) t *= 0.06;

      ctx.clearRect(0, 0, w, h);

      /* Cache shore points */
      let minSY = Infinity, maxSY = -Infinity;
      for (let i = 0; i <= SAMPLES; i++) {
        const y = getShoreY(i / SAMPLES, t);
        shoreY[i] = y;
        if (y < minSY) minSY = y;
        if (y > maxSY) maxSY = y;
      }

      /* ── Wet-sand gradient below max shore position ─────── */
      const wetBot = Math.min(h, maxSY + h * 0.28);
      const wetGrad = ctx.createLinearGradient(0, maxSY * 0.88, 0, wetBot);
      wetGrad.addColorStop(0.00, "rgba(160, 170, 175, 0.22)");
      wetGrad.addColorStop(0.35, "rgba(200, 205, 208, 0.09)");
      wetGrad.addColorStop(1.00, "rgba(255, 255, 255, 0.00)");
      ctx.fillStyle = wetGrad;
      ctx.fillRect(0, maxSY * 0.88, w, wetBot - maxSY * 0.88);

      /* ── Dark water above shore line ─────────────────────── */
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, shoreY[SAMPLES]);
      for (let i = SAMPLES - 1; i >= 0; i--)
        ctx.lineTo((i / SAMPLES) * w, shoreY[i]);
      ctx.closePath();

      const wGrad = ctx.createLinearGradient(0, 0, 0, maxSY + 30);
      wGrad.addColorStop(0.00, "rgba(2,  3,  5, 1.00)");
      wGrad.addColorStop(0.55, "rgba(6,  8, 12, 0.97)");
      wGrad.addColorStop(1.00, "rgba(11,14, 19, 0.90)");
      ctx.fillStyle = wGrad;
      ctx.fill();

      /* ── Foam particles ───────────────────────────────────── */
      if (t - lastSpawnT > 0.07) {
        spawnParticles(t);
        lastSpawnT = t;
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = t - p.born;
        if (age >= p.life) { particles.splice(i, 1); continue; }
        const lr = age / p.life;

        /* Fade envelope */
        let a: number;
        if      (lr < 0.18) a = (lr / 0.18) * p.maxAlpha;
        else if (lr < 0.65) a = p.maxAlpha - (lr - 0.18) * 0.06;
        else                a = ((1 - lr) / 0.35) * (p.maxAlpha * 0.55);

        /* Drift arc (forward then back) */
        p.x += p.vx;
        p.y += p.vy * Math.sin(lr * Math.PI);

        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(195,208,215,${a.toFixed(3)})`;
        ctx.fill();
      }

      /* ── Fine foam edge ───────────────────────────────────── */
      ctx.beginPath();
      ctx.moveTo(0, shoreY[0]);
      for (let i = 1; i <= SAMPLES; i++)
        ctx.lineTo((i / SAMPLES) * w, shoreY[i]);
      ctx.strokeStyle = "rgba(148, 165, 175, 0.16)";
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
