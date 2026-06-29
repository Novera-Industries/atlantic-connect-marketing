"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Domain-warped FBM → flowing liquid-chrome ocean. Cool (client) / warm (talent)
// chosen by u_mode. Kept to one WebGL beat; rendered at reduced internal scale.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_mode;      // 0.0 cool, 1.0 warm
uniform float u_intensity;
uniform vec2 u_pointer;

float hash(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash(i), b = hash(i+vec2(1.0,0.0)), c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ s += a*noise(p); p = m*p; a *= 0.5; }
  return s;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  uv += u_pointer * 0.06;
  float t = u_time * 0.05;

  vec2 q = vec2(fbm(uv*1.5 + t), fbm(uv*1.5 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(uv*2.0 + q*1.6 + vec2(1.7, 9.2) + t*1.15),
    fbm(uv*2.0 + q*1.6 + vec2(8.3, 2.8) - t)
  );
  float h = fbm(uv*1.8 + r*1.8 + t*0.4);
  float ridge = abs(h - 0.5) * 2.0;
  float spec = pow(1.0 - ridge, 6.0);

  // High contrast: a dark navy ground with luminous ocean/azure ribbons and
  // chrome glints concentrated on the high-noise ridges (the "current"),
  // rather than a uniform glow. Reads well as an opaque hero graphic.
  vec3 navy   = vec3(0.04, 0.14, 0.30);
  vec3 ocean  = vec3(0.106, 0.470, 0.800);
  vec3 azure  = vec3(0.200, 0.650, 0.980);
  vec3 chrome = vec3(0.90, 0.95, 1.00);

  vec3 cool = navy;
  cool = mix(cool, ocean, smoothstep(0.28, 0.66, h));
  cool = mix(cool, azure, smoothstep(0.56, 0.92, h) * 0.95);
  cool += chrome * pow(spec, 1.6) * 0.55;

  vec3 gold = vec3(0.93, 0.81, 0.56);
  vec3 warm = navy;
  warm = mix(warm, vec3(0.46, 0.34, 0.17), smoothstep(0.50, 0.84, h));
  warm += gold * pow(spec, 1.4) * 0.9;

  vec3 col = mix(cool, warm, clamp(u_mode, 0.0, 1.0));
  float vig = smoothstep(1.55, 0.2, length(uv));
  col *= vig * 0.85 + 0.15;
  col *= u_intensity;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function CurrentCanvas({
  mode = "cool",
  intensity = 1,
  className,
  pointerParallax = true,
}: {
  mode?: "cool" | "warm";
  intensity?: number;
  className?: string;
  pointerParallax?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Gate: desktop, pointer-fine, motion-OK only. Poster/CSS carries the rest.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    if (reduced || !fine || !wide) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMode = gl.getUniformLocation(prog, "u_mode");
    const uInt = gl.getUniformLocation(prog, "u_intensity");
    const uPtr = gl.getUniformLocation(prog, "u_pointer");
    gl.uniform1f(uMode, mode === "warm" ? 1 : 0);
    gl.uniform1f(uInt, intensity);

    const QUALITY = 0.66; // render under-res, CSS upscales (soft liquid look)
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * DPR * QUALITY));
      const h = Math.max(1, Math.floor(canvas.clientHeight * DPR * QUALITY));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      ptr.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ptr.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (pointerParallax) window.addEventListener("pointermove", onPointer, { passive: true });

    // frameloop on demand: run only while visible + tab focused.
    let raf = 0;
    let running = false;
    let start = performance.now();
    let last = start;
    const loop = (now: number) => {
      if (!running) return;
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;
      gl.uniform2f(uPtr, ptr.x, ptr.y);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      last = now;
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running) return;
      running = true;
      start = performance.now() - (last - start);
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? play() : pause()),
      { threshold: 0.01 }
    );
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (pointerParallax) window.removeEventListener("pointermove", onPointer);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [mode, intensity, pointerParallax]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("h-full w-full block", className)}
    />
  );
}
