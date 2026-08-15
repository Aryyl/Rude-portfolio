"use client";

import { useEffect, useRef } from "react";

const VERT = `#version 300 es
in  vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv        = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2  u_resolution;
in  vec2 v_uv;
out vec4 fragColor;

float hash(vec2 p) {
  p  = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}
float smoothNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * smoothNoise(p);
    p  = p * 2.13 + vec2(3.1, 5.7);
    a *= 0.45;
  }
  return v;
}
float waveH(vec2 p, vec2 dir, float wl, float spd, float ph, float sharp) {
  float proj = dot(p, dir);
  float s    = sin(proj * (6.28318 / wl) - u_time * spd + ph) * 0.5 + 0.5;
  return pow(s, sharp);
}
float oceanH(vec2 p) {
  float h1 = waveH(p, normalize(vec2( 0.07,-1.0)), 1.20, 0.36, 0.00, 4.0) * 0.40;
  float h2 = waveH(p, normalize(vec2(-0.09,-1.0)), 0.85, 0.50, 2.10, 3.0) * 0.27;
  float h3 = waveH(p, normalize(vec2( 0.14,-1.0)), 0.52, 0.65, 3.80, 2.5) * 0.16;
  float h4 = waveH(p, normalize(vec2(-0.18,-1.0)), 0.38, 0.78, 5.40, 2.0) * 0.09;
  float n  = fbm(p * 2.1 + vec2(u_time * 0.11, -u_time * 0.14)) * 0.08;
  return h1 + h2 + h3 + h4 + n;
}

void main() {
  vec2  uv     = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  float perspScale = mix(1.0, 3.0, uv.y);
  vec2  p = vec2((uv.x - 0.5) * aspect * perspScale, uv.y * perspScale * 1.9);

  float h   = oceanH(p);
  float eps  = 0.012;
  float hpx  = oceanH(p + vec2(eps, 0.0));
  float hpy  = oceanH(p + vec2(0.0, eps));

  vec3 normal = normalize(vec3(-(hpx - h) / eps * 0.55, -(hpy - h) / eps * 0.55, 1.0));
  vec3 moonDir = normalize(vec3(-0.28, 0.38, 0.90));
  vec3 viewDir = normalize(vec3( 0.00, 0.18, 1.00));

  float diffuse = max(0.0, dot(normal, moonDir));
  vec3  halfV   = normalize(moonDir + viewDir);
  float spec    = pow(max(0.0, dot(normal, halfV)), 90.0);

  float env = smoothstep(0.0, 0.10, uv.y) * smoothstep(1.0, 0.70, uv.y);
  float shoreFlat = smoothstep(0.0, 0.20, uv.y);
  h *= env * shoreFlat;

  vec3 deepCol  = vec3(0.008, 0.010, 0.014);
  vec3 midCol   = vec3(0.020, 0.026, 0.036);
  vec3 crestCol = vec3(0.340, 0.380, 0.420);

  vec3 base = mix(deepCol, midCol, smoothstep(0.05, 0.65, uv.y));
  float troughMask = smoothstep(0.32, 0.06, h);
  base = mix(base, deepCol * 0.45, troughMask * 0.55);

  float crestMask = smoothstep(0.42, 0.80, h);
  vec3 col = mix(base, crestCol, crestMask * 0.50);
  col += vec3(0.08, 0.10, 0.13) * diffuse * (1.0 - crestMask * 0.5) * 0.65;
  col += vec3(0.45, 0.48, 0.52) * spec * 0.35;

  float shoreZone = smoothstep(0.14, 0.0, uv.y);
  if (shoreZone > 0.001) {
    float wc       = mod(u_time * 0.13, 1.0);
    float wash     = wc < 0.5 ? wc * 2.0 : (1.0 - wc) * 2.0;
    float foamN    = fbm(p * vec2(3.8, 2.2) + u_time * 0.04);
    float latWave  = sin(uv.x * 6.28318 * 2.5 + u_time * 0.30) * 0.5 + 0.5;
    float foam     = foamN * latWave * shoreZone * wash * 0.40;
    col = mix(col, vec3(0.40, 0.43, 0.46), foam);
  }

  float atm = smoothstep(0.78, 1.0, uv.y);
  col = mix(col, vec3(0.032, 0.038, 0.048), atm * 0.52);

  vec2  vUV = uv * 2.0 - 1.0;
  float vig = 1.0 - dot(vUV * vec2(0.50, 0.66), vUV * vec2(0.50, 0.66));
  col *= clamp(vig, 0.0, 1.0) * 0.36 + 0.64;
  col *= smoothstep(0.0, 0.035, uv.y) * 0.38 + 0.62;

  fragColor = vec4(col, 1.0);
}`;

export default function OceanWave({ className = "" }: { className?: string }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error("Shader:", gl.getShaderInfoLog(s));
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error("Program:", gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_resolution");

    const resize = () => {
      // Cap DPR at 1.0 — ocean shaders are fullscreen fills; extra resolution is invisible but expensive
      const dpr = Math.min(window.devicePixelRatio, 1.0);
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let start = performance.now();
    let pausedAt = 0;
    let totalPaused = 0;

    const render = (now: number) => {
      // Elapsed time excludes paused intervals so the animation doesn't jump
      const elapsed = (now - start - totalPaused) / 1000;
      const t = prefersReduced ? elapsed * 0.07 : elapsed;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };

    // IntersectionObserver fully starts/stops the RAF loop — zero CPU/GPU when off-screen
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Resume: account for time spent paused so animation doesn't jump
          if (pausedAt > 0) {
            totalPaused += performance.now() - pausedAt;
            pausedAt = 0;
          }
          rafRef.current = requestAnimationFrame(render);
        } else {
          // Pause: cancel RAF entirely
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
          pausedAt = performance.now();
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", contain: "strict" }}
    />
  );
}