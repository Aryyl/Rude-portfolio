"use client";

import { useMotionValue } from "framer-motion";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  poster: string;
  description?: string;
  role?: string;
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
    type: "iframe",
    src: "https://drive.google.com/file/d/1330uAktITPYX9zKMKQUHQX2ybHvk3C_A/preview",
    poster: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/34ce1842-4b7a-4d52-0302-38582c341700/w=800",
  },
  {
    id: "06",
    title: "Project Beta",
    category: "Documentary",
    year: "2026",
    role: "Cinematographer",
    type: "iframe",
    src: "https://drive.google.com/file/d/13Tczh56kPa5Q-TMqZpmE7ry47ZZ64tTC/preview",
    poster: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/88369c6d-00cc-4ac9-74ca-0f0965e06300/w=800",
  },
  {
    id: "07",
    title: "Project Gamma",
    category: "Experimental",
    year: "2026",
    role: "Director",
    type: "iframe",
    src: "https://drive.google.com/file/d/1wXkAJEh_KvW6nJOTKdp43pxbjEvm3GPW/preview",
    poster: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/aeaa0756-9647-4f6c-d900-204bd25e4a00/w=800",
  }
];

// ─── Math & PRNG ──────────────────────────────────────────────────────────

function hash3(cx: number, cy: number, cz: number, salt: number) {
  let h = (cx | 0) * 0x8da6b343;
  h ^= Math.imul(cy | 0, 0xd8163841);
  h ^= Math.imul(cz | 0, 0xcb1ab31f);
  h ^= salt | 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Engine Constants ─────────────────────────────────────────────────────

const PX_PER_UNIT = 6;
const CELL_SIZE = 140; // Spread things out for a cinematic feel
const MAX_RANGE = 20;

type Tile = {
  wx: number;
  wy: number;
  cx: number;
  cy: number;
  slot: number;
  octave: number;
  projIdx: number;
  w: number;
  h: number;
  rot: number;
  bakedScale: number;
};

// ─── Icons ────────────────────────────────────────────────────────────────

function RudeFish({ opacity = 0.75 }: { opacity?: number }) {
  return (
    <svg width="40" height="25" viewBox="0 0 24 15" fill="none" stroke={`rgba(120,210,255,${opacity})`} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="drop-shadow-lg">
      <path d="M20 7.5C19.5 5.5 17.5 4 14 4S7.5 5.5 5 7.5C7.5 9.5 10 11 14 11S19.5 9.5 20 7.5Z" fill={`rgba(100,190,255,${opacity * 0.1})`} />
      <path d="M2 4.5L5.5 7.5L2 10.5Z" fill={`rgba(100,190,255,${opacity * 0.18})`} />
      <circle cx="16.5" cy="6.8" r="0.8" fill={`rgba(140,220,255,${opacity})`} />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function InfinityArchive() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Settings
  const density = 4; 
  const imageWidth = 260; // 16:9 ratio approximately
  const imageHeight = 146;
  const rounded = 2; // subtle curve
  const dragSpeed = 20;
  const driftAmount = 8;
  const friction = 12;

  // Safe variables
  const safeDragSpeed = Math.max(0.1, Math.min(5, dragSpeed / 20));
  const safeDriftAmount = Math.max(0, Math.min(20, driftAmount));
  const safeFriction = 1 - (Math.max(1, Math.min(20, friction)) / 20) * 0.3;
  const safeRounded = Math.max(0, Math.min(20, rounded));

  // Motion values
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const camX = useMotionValue(0);
  const camY = useMotionValue(0);
  const velX = useMotionValue(0);
  const velY = useMotionValue(0);
  const targetLogZoom = useMotionValue(0);
  const logZoom = useMotionValue(0);
  const velLogZoom = useMotionValue(0);
  const driftTX = useMotionValue(0);
  const driftTY = useMotionValue(0);
  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);

  // Cell generation
  const subN = Math.max(1, Math.ceil(Math.sqrt(density)));
  const subSize = CELL_SIZE / subN;
  const SUBCELL_INNER_PAD = 0.1;
  const effectivePerCell = Math.min(density, subN * subN);
  const projCount = PROJECTS.length;

  const SCALE_MIN = 0.4;
  const SCALE_MAX = 1.8;

  const generateCell = useMemo(() => {
    return (gx: number, gy: number, octave: number): Tile[] => {
      const seed = hash3(gx, gy, octave | 0, 0x9e3779b1);
      const rand = mulberry32(seed);

      const totalSubs = subN * subN;
      const subs = new Array<number>(totalSubs);
      for (let i = 0; i < totalSubs; i++) subs[i] = i;
      for (let i = totalSubs - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const tmp = subs[i];
        subs[i] = subs[j];
        subs[j] = tmp;
      }

      const tiles: Tile[] = [];
      const count = Math.min(effectivePerCell, totalSubs);
      const pad = subSize * SUBCELL_INNER_PAD;
      const innerRange = Math.max(0, subSize - pad * 2);
      const cellX0 = gx * CELL_SIZE;
      const cellY0 = gy * CELL_SIZE;
      const wWorld = imageWidth / PX_PER_UNIT;
      const hWorld = imageHeight / PX_PER_UNIT;

      for (let slot = 0; slot < count; slot++) {
        const subIdx = subs[slot];
        const sx = subIdx % subN;
        const sy = Math.floor(subIdx / subN);
        const wx = cellX0 + sx * subSize + pad + rand() * innerRange;
        const wy = cellY0 + sy * subSize + pad + rand() * innerRange;
        const bakedScale = SCALE_MIN + rand() * (SCALE_MAX - SCALE_MIN);
        
        // Random slight rotation for an organic feel
        const rot = (rand() - 0.5) * 6;

        const projIdx = projCount > 0 ? Math.floor(rand() * projCount) % projCount : 0;

        tiles.push({
          wx, wy, cx: gx, cy: gy, slot, octave, projIdx, w: wWorld, h: hWorld, rot, bakedScale,
        });
      }
      return tiles;
    };
  }, [projCount, imageWidth, imageHeight, subN, subSize, effectivePerCell]);

  // Per-frame loop
  useEffect(() => {
    const scene = sceneRef.current;
    const container = containerRef.current;
    if (!scene || !container) return;

    let cW = container.clientWidth || 900;
    let cH = container.clientHeight || 600;
    const ro = new ResizeObserver(() => {
      if (container) {
        cW = container.clientWidth || cW;
        cH = container.clientHeight || cH;
      }
    });
    ro.observe(container);

    const layerPools = new Map<number, {
      tileEls: Map<string, HTMLDivElement>;
      mediaEls: Map<string, HTMLVideoElement | HTMLImageElement>;
    }>();

    const getPool = (octave: number) => {
      let pool = layerPools.get(octave);
      if (!pool) {
        pool = { tileEls: new Map(), mediaEls: new Map() };
        layerPools.set(octave, pool);
      }
      return pool;
    };

    const disposeLayer = (octave: number) => {
      const pool = layerPools.get(octave);
      if (!pool) return;
      pool.tileEls.forEach((el) => {
        if (el.parentNode === scene) scene.removeChild(el);
      });
      pool.tileEls.clear();
      pool.mediaEls.clear();
      layerPools.delete(octave);
    };

    const disposeAllLayers = () => {
      Array.from(layerPools.keys()).forEach(disposeLayer);
    };

    const removeTile = (octave: number, key: string) => {
      const pool = layerPools.get(octave);
      if (!pool) return;
      const el = pool.tileEls.get(key);
      if (el && el.parentNode === scene) scene.removeChild(el);
      pool.tileEls.delete(key);
      pool.mediaEls.delete(key);
    };

    // Global click handler is now handled via event delegation on the container


    const ensureTile = (t: Tile): HTMLDivElement => {
      const pool = getPool(t.octave);
      const key = `${t.cx},${t.cy},${t.slot}`;
      let el = pool.tileEls.get(key);
      
      if (!el) {
        const proj = PROJECTS[t.projIdx];
        
        el = document.createElement("div");
        el.style.position = "absolute";
        el.style.left = "50%";
        el.style.top = "50%";
        el.style.transformOrigin = "0 0";
        el.style.willChange = "transform, opacity";
        el.style.cursor = "pointer";
        el.dataset.tileKey = key;
        
        // Add styling class for hover effects
        el.className = "group transition-all duration-300 hover:brightness-125 hover:z-50";
        
        const mediaContainer = document.createElement("div");
        mediaContainer.style.width = "100%";
        mediaContainer.style.height = "100%";
        mediaContainer.style.position = "relative";
        mediaContainer.style.overflow = "hidden";
        
        // Render either a video tag (local files) or image poster (iframes/photos)
        let mediaEl: HTMLVideoElement | HTMLImageElement;
        
        if (proj.type === "video") {
          const vid = document.createElement("video");
          vid.src = proj.src;
          vid.poster = proj.poster;
          vid.muted = true;
          vid.loop = true;
          vid.playsInline = true;
          // Start paused to save resources. We will play it dynamically in the loop!
          vid.pause();
          mediaEl = vid;
        } else {
          // For iframe types (Google Drive) and image types, use poster to save heavy iframe loads
          const img = document.createElement("img");
          img.src = proj.poster;
          img.alt = proj.title;
          mediaEl = img;
        }

        mediaEl.draggable = false;
        mediaEl.style.width = "100%";
        mediaEl.style.height = "100%";
        mediaEl.style.objectFit = "cover";
        mediaEl.style.display = "block";
        // Do not intercept pointer events so dragging still bubbles from the div
        mediaEl.style.pointerEvents = "none";
        mediaEl.style.userSelect = "none";
        
        mediaContainer.appendChild(mediaEl);

        // Overlay with project title
        const overlay = document.createElement("div");
        overlay.className = "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center pointer-events-none";
        
        const title = document.createElement("h3");
        title.className = `text-white font-bold tracking-tighter text-xl md:text-2xl mb-1 px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500`;
        title.innerText = proj.title;
        title.style.fontFamily = "Montserrat, sans-serif";
        
        const category = document.createElement("p");
        category.className = "text-white/60 font-mono text-[10px] uppercase tracking-widest mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75";
        category.innerText = `${proj.id} — ${proj.category}`;

        // View Full Screen option icon
        const playBtn = document.createElement("div");
        playBtn.className = "w-12 h-12 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm bg-white/10 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 delay-150";
        playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5V19L19 12L8 5Z" /></svg>`;
        
        overlay.appendChild(title);
        overlay.appendChild(category);
        overlay.appendChild(playBtn);
        
        mediaContainer.appendChild(overlay);
        el.appendChild(mediaContainer);
        scene.appendChild(el);
        
        el.dataset.projIdx = t.projIdx.toString();

        // Play on hover
        el.addEventListener("mouseenter", () => {
          if (mediaEl instanceof HTMLVideoElement) {
            mediaEl.play().catch(() => {});
          }
        });
        el.addEventListener("mouseleave", () => {
          if (mediaEl instanceof HTMLVideoElement) {
            mediaEl.pause();
          }
        });
        
        pool.tileEls.set(key, el);
        pool.mediaEls.set(key, mediaEl);
      }
      return el;
    };

    const projectLayer = (octave: number, layerScale: number, layerAlpha: number, layerZBase: number, cx: number, cy: number) => {
      const pool = getPool(octave);
      const camCellX = Math.floor(cx / CELL_SIZE);
      const camCellY = Math.floor(cy / CELL_SIZE);
      const worldHalfX = cW / 2 / (PX_PER_UNIT * layerScale);
      const worldHalfY = cH / 2 / (PX_PER_UNIT * layerScale);
      const rangeX = Math.min(MAX_RANGE, Math.ceil(worldHalfX / CELL_SIZE) + 1);
      const rangeY = Math.min(MAX_RANGE, Math.ceil(worldHalfY / CELL_SIZE) + 1);

      const visibleKeys = new Set<string>();
      const tilesThisFrame: Tile[] = [];

      for (let dy = -rangeY; dy <= rangeY; dy++) {
        for (let dx = -rangeX; dx <= rangeX; dx++) {
          const tiles = generateCell(camCellX + dx, camCellY + dy, octave);
          for (let i = 0; i < tiles.length; i++) {
            tilesThisFrame.push(tiles[i]);
          }
        }
      }

      const orderKeys: string[] = new Array(tilesThisFrame.length);
      const orderScale: number[] = new Array(tilesThisFrame.length);

      for (let i = 0; i < tilesThisFrame.length; i++) {
        const t = tilesThisFrame[i];
        const key = `${t.cx},${t.cy},${t.slot}`;
        visibleKeys.add(key);

        const dxPx = (t.wx - cx) * layerScale * PX_PER_UNIT;
        const dyPx = (t.wy - cy) * layerScale * PX_PER_UNIT;
        const s = t.bakedScale * layerScale;

        const el = ensureTile(t);
        const media = pool.mediaEls.get(key);

        const wPx = t.w * PX_PER_UNIT;
        const hPx = t.h * PX_PER_UNIT;

        const transformStr = `translate3d(${dxPx.toFixed(1)}px, ${dyPx.toFixed(1)}px, 0) scale(${s.toFixed(3)}) rotate(${t.rot.toFixed(2)}deg) translate(${-wPx / 2}px, ${-hPx / 2}px)`;
        
        // Optimize DOM repaints: only update if changed
        if ((el as any)._lastTransform !== transformStr) {
          el.style.transform = transformStr;
          (el as any)._lastTransform = transformStr;
        }
        
        if ((el as any)._lastOpacity !== layerAlpha) {
          el.style.opacity = String(layerAlpha);
          (el as any)._lastOpacity = layerAlpha;
        }
        
        el.style.width = `${wPx}px`;
        el.style.height = `${hPx}px`;

        if (media) {
          const radiusPx = (safeRounded / 20) * (Math.min(wPx, hPx) / 2);
          media.style.borderRadius = `${radiusPx}px`;
        }

        orderKeys[i] = key;
        orderScale[i] = t.bakedScale;
      }

      for (const key of Array.from(pool.tileEls.keys())) {
        if (!visibleKeys.has(key)) removeTile(octave, key);
      }

      const idxs = orderKeys.map((_, i) => i);
      idxs.sort((a, b) => orderScale[a] - orderScale[b]);
      for (let k = 0; k < idxs.length; k++) {
        const el = pool.tileEls.get(orderKeys[idxs[k]]);
        if (el) el.style.zIndex = String(layerZBase + k);
      }
    };

    let lastOctaves: Set<number> = new Set();

    const project = () => {
      const cx = camX.get();
      const cy = camY.get();
      const lz = logZoom.get();
      const octave = Math.floor(lz);
      const frac = lz - octave;
      const scaleCurrent = Math.pow(2, frac);
      const scaleNext = Math.pow(2, frac - 1);
      const alphaCurrent = 1 - frac;
      const alphaNext = frac;
      const zBaseCurrent = 0;
      const zBaseNext = 100000;

      projectLayer(octave, scaleCurrent, alphaCurrent, zBaseCurrent, cx, cy);
      projectLayer(octave + 1, scaleNext, alphaNext, zBaseNext, cx, cy);

      const nowOctaves = new Set<number>([octave, octave + 1]);
      for (const o of Array.from(lastOctaves)) {
        if (!nowOctaves.has(o)) disposeLayer(o);
      }
      for (const o of Array.from(layerPools.keys())) {
        if (!nowOctaves.has(o)) disposeLayer(o);
      }
      lastOctaves = nowOctaves;
    };

    let raf = 0;
    const loop = () => {
      const tx = targetX.get() + velX.get();
      const ty = targetY.get() + velY.get();
      targetX.set(tx);
      targetY.set(ty);
      velX.set(velX.get() * safeFriction);
      velY.set(velY.get() * safeFriction);

      const vlz = velLogZoom.get();
      if (vlz !== 0) {
        targetLogZoom.set(targetLogZoom.get() + vlz);
        velLogZoom.set(vlz * safeFriction);
      }

      driftX.set(lerp(driftX.get(), driftTX.get() * safeDriftAmount, 0.08));
      driftY.set(lerp(driftY.get(), driftTY.get() * safeDriftAmount, 0.08));

      camX.set(lerp(camX.get(), targetX.get() + driftX.get(), 0.18));
      camY.set(lerp(camY.get(), targetY.get() + driftY.get(), 0.18));
      logZoom.set(lerp(logZoom.get(), targetLogZoom.get(), 0.18));

      project();
      raf = requestAnimationFrame(loop);
    };

    project();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      disposeAllLayers();
    };
  }, [
    generateCell, safeFriction, safeDriftAmount, safeRounded,
    camX, camY, logZoom, targetX, targetY, targetLogZoom,
    velX, velY, velLogZoom, driftX, driftY, driftTX, driftTY
  ]);

  // Input bindings
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let dragging = false;
    let lastPX = 0;
    let lastPY = 0;
    let lastT = 0;
    let dragDist = 0; // track distance to distinguish click from drag
    let pid: number | null = null;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      // Do not initiate drag if detail view is open
      if (document.getElementById("project-detail-overlay")?.getAttribute("data-active") === "true") return;
      
      dragging = true;
      dragDist = 0;
      pid = e.pointerId;
      lastPX = e.clientX;
      lastPY = e.clientY;
      lastT = e.timeStamp;
      
      // Do not use setPointerCapture here as it prevents native clicks on children
      // We will attach move/up to the window for robust dragging instead
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      
      el.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      driftTX.set(Math.max(-1, Math.min(1, nx)));
      driftTY.set(Math.max(-1, Math.min(1, ny)));

      if (!dragging || e.pointerId !== pid) return;

      const dpx = e.clientX - lastPX;
      const dpy = e.clientY - lastPY;
      dragDist += Math.abs(dpx) + Math.abs(dpy);

      const lz = logZoom.get();
      const frac = lz - Math.floor(lz);
      const effScale = (1 - frac) * Math.pow(2, frac) + frac * Math.pow(2, frac - 1);
      const dWorldX = (-dpx / (PX_PER_UNIT * effScale)) * safeDragSpeed;
      const dWorldY = (-dpy / (PX_PER_UNIT * effScale)) * safeDragSpeed;
      
      targetX.set(targetX.get() + dWorldX);
      targetY.set(targetY.get() + dWorldY);

      const dt = Math.max(1, e.timeStamp - lastT);
      const k = 16 / dt;
      velX.set(dWorldX * k);
      velY.set(dWorldY * k);

      lastPX = e.clientX;
      lastPY = e.clientY;
      lastT = e.timeStamp;
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pid) return;
      dragging = false;
      pid = null;
      
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      
      if (el) el.style.cursor = "grab";
      
      // If we dragged significantly, capture and stop the ensuing click event via a flag on container
      if (dragDist > 10) {
        if (el) (el as any)._isDragging = true;
        setTimeout(() => { if (el) (el as any)._isDragging = false; }, 50);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (document.getElementById("project-detail-overlay")?.getAttribute("data-active") === "true") return;
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= 400;
      const step = -delta * 0.0015 * safeDragSpeed;
      velLogZoom.set(velLogZoom.get() + step);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("wheel", onWheel, { passive: false });
    
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [safeDragSpeed, targetX, targetY, velX, velY, velLogZoom, logZoom, driftTX, driftTY]);

  return (
    <section className="relative w-full h-[100svh] bg-[#020306] overflow-hidden text-white">
      {/* Background Texture & Film Grain */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020306] via-[#050914] to-[#020306] opacity-80" />
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
        />
      </div>

      {/* Title / Intro */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 z-10 pointer-events-none select-none text-center md:text-left flex flex-col items-center md:items-start drop-shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Selected Works
          </span>
        </div>
        <h2 className={`${greatVibes.className} text-4xl md:text-5xl text-white/80`}>
          Film Archive
        </h2>
      </div>

      {/* Decorative Fish Logo */}
      <div className="absolute bottom-12 right-12 z-10 pointer-events-none select-none hidden md:block">
        <div className="animate-[pulse_6s_ease-in-out_infinite] opacity-50">
          <RudeFish opacity={0.6} />
        </div>
      </div>

      {/* The Canvas */}
      <div 
        ref={containerRef} 
        onClick={(e) => {
          if (containerRef.current && (containerRef.current as any)._isDragging) return;
          const target = e.target as HTMLElement;
          const tile = target.closest('[data-proj-idx]');
          if (tile) {
            const idx = parseInt(tile.getAttribute('data-proj-idx') || "0", 10);
            if (!isNaN(idx) && PROJECTS[idx]) {
              setActiveProject(PROJECTS[idx]);
            }
          }
        }}
        className="absolute inset-0 z-10 touch-none cursor-grab active:cursor-grabbing"
      >
        <div ref={sceneRef} className="absolute inset-0" />
      </div>

      {/* Detail Overlay View */}
      <div 
        id="project-detail-overlay"
        data-active={activeProject ? "true" : "false"}
        className={`absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col items-center justify-center p-6 md:p-12 ${
          activeProject ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-105"
        }`}
      >
        {activeProject && (
          <div className="w-full max-w-6xl w-full h-full flex flex-col pt-12 md:pt-0 justify-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveProject(null)}
              className="absolute top-6 right-6 md:top-12 md:right-12 z-50 group flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/80 group-hover:scale-90 transition-transform">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              
              {/* Media Player */}
              <div className="w-full lg:w-2/3 aspect-video bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 relative">
                {activeProject.type === "video" ? (
                  <video 
                    src={activeProject.src} 
                    poster={activeProject.poster}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe 
                    src={activeProject.src} 
                    allow="autoplay"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Project Info */}
              <div className="w-full lg:w-1/3 flex flex-col">
                <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-4">
                  <span>{activeProject.id}</span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <span>{activeProject.year}</span>
                </div>
                
                <h3 className={`${montserrat.className} text-3xl md:text-5xl font-bold tracking-tighter mb-4`}>
                  {activeProject.title}
                </h3>
                
                <p className={`${greatVibes.className} text-2xl text-white/60 mb-8`}>
                  {activeProject.category}
                </p>

                {activeProject.role && (
                  <div className="mb-6">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Role</p>
                    <p className={`${montserrat.className} text-sm text-white/90`}>{activeProject.role}</p>
                  </div>
                )}
                
                {activeProject.description && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">About</p>
                    <p className={`${montserrat.className} text-sm text-white/70 leading-relaxed`}>{activeProject.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
    </section>
  );
}
