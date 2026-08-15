"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;       // for pulsing glow
  phaseSpeed: number;
  hue: number;         // 170–200 (teal/cyan range)
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
}

const MAX_PARTICLES = 55;

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.25 + 0.05), // drift upward
    size: Math.random() * 2.5 + 0.8,
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: Math.random() * 0.02 + 0.008,
    hue: 170 + Math.random() * 35,
    alpha: 0,
    maxAlpha: Math.random() * 0.45 + 0.15,
    life: 0,
    maxLife: 200 + Math.random() * 300,
  };
}

export default function SeaParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    // Seed initial particles spread across the page
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = createParticle(w, h);
      p.life = Math.random() * p.maxLife; // stagger lifetimes
      particlesRef.current.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      if (prefersReduced) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.phase += p.phaseSpeed;

        // Move
        p.x += p.vx;
        p.y += p.vy;
        // Drift side-to-side with a sine wave
        p.x += Math.sin(p.phase * 0.7) * 0.18;

        // Fade in/out envelope
        const lr = p.life / p.maxLife;
        let a: number;
        if (lr < 0.12) a = (lr / 0.12) * p.maxAlpha;
        else if (lr < 0.75) a = p.maxAlpha;
        else a = ((1 - lr) / 0.25) * p.maxAlpha;

        // Pulse brightness
        const pulse = 0.6 + 0.4 * Math.sin(p.phase);
        const finalAlpha = a * pulse;

        // Draw glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grd.addColorStop(0, `hsla(${p.hue}, 90%, 75%, ${finalAlpha})`);
        grd.addColorStop(0.4, `hsla(${p.hue}, 80%, 65%, ${finalAlpha * 0.5})`);
        grd.addColorStop(1, `hsla(${p.hue}, 70%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Draw core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 90%, ${finalAlpha * 0.9})`;
        ctx.fill();

        // Respawn when dead or off-screen
        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1);
          particles.push(createParticle(w, h + 50));
          particles[particles.length - 1].y = h + 10; // start from bottom
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        opacity: 0.7,
      }}
      aria-hidden="true"
    />
  );
}
