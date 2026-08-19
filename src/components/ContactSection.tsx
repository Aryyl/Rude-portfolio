"use client";

import { useEffect, useRef } from "react";
import { Great_Vibes, Montserrat } from "next/font/google";
import ScrollReveal from "@/components/ScrollReveal";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ weight: ["500", "700"], subsets: ["latin"] });

interface ContactSectionProps {
  onCopyrightClick?: () => void;
}

/* ── Canvas particle animation ─────────────────────────────────────────── */
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0;

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
    };

    const particles: Particle[] = [];
    const MAX_PARTICLES = 90;

    function spawnParticle(): Particle {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1 + Math.random() * 2.5,
        opacity: 0,
        life: 0,
        maxLife: 180 + Math.random() * 200,
      };
    }

    type Ring = { cx: number; cy: number; r: number; speed: number; dotCount: number; phase: number };
    const rings: Ring[] = [];

    function buildRings() {
      rings.length = 0;
      const count = W < 600 ? 2 : 3;
      for (let i = 0; i < count; i++) {
        rings.push({
          cx: W * (0.2 + i * 0.3),
          cy: H * (0.35 + (i % 2 === 0 ? 0.1 : -0.05)),
          r: 60 + i * 50,
          speed: 0.0006 + i * 0.0003,
          dotCount: 8 + i * 4,
          phase: (i * Math.PI * 2) / 3,
        });
      }
    }

    const filmLines: { x: number; speed: number; opacity: number }[] = [];
    function buildFilmLines() {
      filmLines.length = 0;
      const n = Math.floor(W / 120);
      for (let i = 0; i < n; i++) {
        filmLines.push({ x: i * 120 + Math.random() * 60, speed: 0.15 + Math.random() * 0.2, opacity: 0.04 + Math.random() * 0.06 });
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      buildRings();
      buildFilmLines();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let t = 0;

    function draw() {
      if (!canvas || !ctx) return;
      t++;
      ctx.clearRect(0, 0, W, H);

      // Film strip lines
      for (const fl of filmLines) {
        fl.x -= fl.speed;
        if (fl.x < -4) fl.x = W + 4;
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,${fl.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fl.x, 0);
        ctx.lineTo(fl.x, H);
        ctx.stroke();
        for (let y = 8; y < H; y += 18) {
          ctx.beginPath();
          ctx.moveTo(fl.x - 3, y);
          ctx.lineTo(fl.x + 3, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Orbiting rings
      for (const ring of rings) {
        for (let d = 0; d < ring.dotCount; d++) {
          const angle = ring.phase + (d / ring.dotCount) * Math.PI * 2 + t * ring.speed;
          const rx = ring.cx + Math.cos(angle) * ring.r;
          const ry = ring.cy + Math.sin(angle) * ring.r * 0.35;
          const depth = (Math.sin(angle) + 1) / 2;
          const alpha = 0.1 + depth * 0.35;
          const sz = 1.2 + depth * 1.8;
          ctx.beginPath();
          ctx.arc(rx, ry, sz, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();
          if (d % 3 === 0) {
            const nextAngle = ring.phase + ((d + 1) / ring.dotCount) * Math.PI * 2 + t * ring.speed;
            const nx = ring.cx + Math.cos(nextAngle) * ring.r;
            const ny = ring.cy + Math.sin(nextAngle) * ring.r * 0.35;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.ellipse(ring.cx, ring.cy, ring.r, ring.r * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Particles
      for (const p of particles) {
        p.life++;
        if (p.life > p.maxLife) {
          Object.assign(p, spawnParticle());
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.15
          ? progress / 0.15
          : progress > 0.75
          ? 1 - (progress - 0.75) / 0.25
          : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity * 0.5})`;
        ctx.fill();
      }

      // Lens flare sweep
      const flareT = t % 420;
      if (flareT < 80) {
        const progress = flareT / 80;
        const flareX = -W * 0.1 + progress * W * 1.2;
        const grd = ctx.createLinearGradient(flareX - 60, 0, flareX + 60, 0);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(0.5, `rgba(255,255,255,${0.06 * Math.sin(progress * Math.PI)})`);
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

export default function ContactSection({ onCopyrightClick }: ContactSectionProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative w-full text-white overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #080808 0%, #0f0f12 40%, #060610 100%)",
        minHeight: "420px",
      }}
    >
      {/* Animated canvas background */}
      <AnimatedBackground />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(5,5,8,0.7) 100%)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top blend fade effect to seamlessly connect with Work section */}
      <div className="absolute top-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-b from-[#0D0D0D] to-transparent z-[2] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-[2]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-8 flex flex-col items-center text-center">

        <ScrollReveal direction="up" delay={0}>
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30 mb-8 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-white/20" />
            Open for collaborations
            <span className="inline-block w-8 h-px bg-white/20" />
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <h2
            className={`${montserrat.className} font-bold tracking-tighter leading-[0.95] mb-3`}
            style={{ fontSize: "clamp(2.4rem, 6vw, 5.5rem)" }}
          >
            Let&apos;s create something
          </h2>
          <span
            className={`${greatVibes.className} font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/30 block mt-1 pb-4`}
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
          >
            extraordinary.
          </span>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={180}>
          <p className="text-white/35 text-sm md:text-base max-w-md leading-relaxed mb-12 font-light">
            Whether it&apos;s a short film, a reel, a music video, or just a vibe —
            I&apos;m ready to make it unforgettable.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={260}>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-5 w-full max-w-4xl mx-auto">

            {/* Email Button */}
            <a
              href="mailto:rudrangshusonowal@gmail.com"
              className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 bg-white text-black rounded-full transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] whitespace-nowrap flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/85 group-hover:opacity-100 opacity-95 transition-opacity rounded-full" />
              <span className="relative font-medium text-xs sm:text-sm md:text-base tracking-tight z-10 text-black">
                rudrangshusonowal@gmail.com
              </span>
            </a>

            {/* Gallery Button */}
            <a
              href="/gallery"
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 bg-white/5 text-white border border-white/15 rounded-full transition-all duration-500 hover:bg-white/10 hover:border-white/30 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] whitespace-nowrap flex-shrink-0"
            >
              <span className="font-medium text-xs sm:text-sm md:text-base tracking-wide z-10">View Video Gallery</span>
              <span className="font-mono text-sm sm:text-base transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>

            {/* Instagram Button */}
            <a
              href="https://www.instagram.com/rudrangshu___s/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 bg-white/5 text-white border border-white/15 rounded-full transition-all duration-500 hover:bg-white/10 hover:border-white/30 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] whitespace-nowrap flex-shrink-0"
            >
              <span className="text-white/50 text-xs sm:text-sm md:text-base font-normal">Instagram</span>
              <span className="font-medium text-xs sm:text-sm md:text-base tracking-wide">@rudrangshu___s</span>
              <span className="font-mono text-xs sm:text-sm transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">↗</span>
            </a>
          </div>
        </ScrollReveal>

        {/* Footer bar */}
        <div className="w-full mt-20">
          <div className="w-full h-px bg-white/8" />
          <div className="pt-6 pb-2 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p
              className="font-mono text-[10px] tracking-widest text-white/25 uppercase cursor-pointer select-none hover:text-white/50 transition-colors"
              onClick={onCopyrightClick}
              title="A secret lies beneath the surface..."
            >
              © {currentYear} Rudrangshu Sonowal
            </p>
            <p className="font-mono text-[10px] tracking-widest text-white/25 uppercase">
              Designed &amp; developed with ❤️ by{" "}
              <a
                href="https://aryyaman-s-about.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 font-semibold hover:text-white transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-white/70"
              >
                Aryyaman Bora
              </a>
            </p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="font-mono text-[10px] tracking-widest text-white/25 uppercase hover:text-white transition-colors flex items-center gap-2 group"
            >
              Back to top <span className="group-hover:-translate-y-1 transition-transform">↑</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
