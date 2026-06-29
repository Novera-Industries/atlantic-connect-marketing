"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { cn } from "@/lib/cn";

const VERT = /* glsl */ `
  attribute float aT;      // 0..1 along the current
  attribute float aBand;   // -1..1 across the ribbon
  attribute float aStream; // -1 cool (left), +1 warm (right)
  attribute float aRand;   // per-particle seed
  attribute float aSize;

  uniform float uTime;
  uniform float uSplit;
  uniform float uPointScale;
  uniform float uPixelRatio;
  uniform vec3  uCool;
  uniform vec3  uWarm;
  uniform vec3  uChrome;

  varying vec3  vColor;
  varying float vAlpha;

  // cheap hash noise
  float hash(float n){ return fract(sin(n) * 43758.5453); }

  void main() {
    float t = aT;

    // ---- MERGED: a single flowing horizontal current (wave band) ----
    float waveX = (t - 0.5) * 3.0;                      // span the width
    float wave  = sin(t * 6.2831 * 1.4 - uTime * 0.45)  // travelling wave
                + 0.4 * sin(t * 6.2831 * 0.6 + uTime * 0.25);
    float mY = wave * 0.16 + aBand * 0.16;
    vec3 merged = vec3(waveX, mY, aBand * 0.5);

    // ---- SPLIT: two streams peeling to the bottom corners ----
    float side = aStream;                               // -1 left / +1 right
    vec2 start = vec2(0.0, 0.42);                       // converge near top-centre
    vec2 end   = vec2(side * 1.85, -0.62);              // bottom corners (toward CTAs)
    vec2 base  = mix(start, end, t);
    base.x += side * 0.35 * sin(t * 3.14159);           // gentle outward bow
    vec2 dir  = normalize(end - start);
    vec2 perp = vec2(-dir.y, dir.x);
    base += perp * (aBand * 0.085 + sin(t * 9.0 + uTime * 0.6 + aRand * 6.28) * 0.012);
    vec3 split = vec3(base, aBand * 0.4);

    // morph merged -> split with a slight per-particle stagger so it "peels"
    float s = smoothstep(0.0, 1.0, clamp(uSplit * (1.15) - aRand * 0.15, 0.0, 1.0));
    vec3 pos = mix(merged, split, s);

    // living drift
    pos.x += sin(uTime * 0.3 + aRand * 6.28) * 0.012;
    pos.y += cos(uTime * 0.27 + aRand * 6.28) * 0.012;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // size: a touch of twinkle, scaled to DPR
    float twinkle = 0.75 + 0.25 * sin(uTime * 1.6 + aRand * 30.0);
    gl_PointSize = aSize * uPointScale * uPixelRatio * twinkle;

    // colour: unified current reads cool/chrome; split reveals the two temps
    vec3 mergedCol = mix(uCool, uChrome, 0.28 + 0.2 * hash(aRand));
    vec3 splitCol  = (side < 0.0) ? uCool : uWarm;
    vColor = mix(mergedCol, splitCol, s);
    // crest particles glow brighter
    vAlpha = 0.55 + 0.45 * smoothstep(0.2, 1.0, abs(wave)) * (1.0 - s) + 0.35 * s;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);     // soft round sprite
    float core = smoothstep(0.28, 0.0, d); // bright core
    vec3 col = vColor + core * 0.6;
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;

/**
 * `splitRef.current` (0 = unified current wave, 1 = fully split into two
 * streams) is driven by the Fork's scroll. We read it in the render loop and
 * ease the uniform toward it — no React re-render on scroll.
 */
export function CurrentParticles({
  splitRef,
  className,
}: {
  splitRef: MutableRefObject<number>;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const splitUniform = useRef(0);

  useEffect(() => {
      const mount = mountRef.current;
      if (!mount) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 768px)").matches;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      if (!renderer.getContext()) return;
      const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(DPR);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const scene = new THREE.Scene();
      let aspect = mount.clientWidth / Math.max(1, mount.clientHeight);
      const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100);
      camera.position.z = 3;

      // ---- particles ----
      const COUNT = reduced ? 3500 : wide ? 16000 : 6500;
      const pos = new Float32Array(COUNT * 3); // unused base (shader computes pos)
      const aT = new Float32Array(COUNT);
      const aBand = new Float32Array(COUNT);
      const aStream = new Float32Array(COUNT);
      const aRand = new Float32Array(COUNT);
      const aSize = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        aT[i] = Math.random();
        aBand[i] = (Math.random() * 2 - 1) * Math.pow(Math.random(), 0.5);
        aStream[i] = i % 2 === 0 ? -1 : 1;
        aRand[i] = Math.random();
        aSize[i] = 1.4 + Math.random() * 2.6;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
      geo.setAttribute("aBand", new THREE.BufferAttribute(aBand, 1));
      geo.setAttribute("aStream", new THREE.BufferAttribute(aStream, 1));
      geo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
      geo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));

      const uniforms = {
        uTime: { value: 0 },
        uSplit: { value: 0 },
        uPointScale: { value: wide ? 1.0 : 0.85 },
        uPixelRatio: { value: DPR },
        uCool: { value: new THREE.Color(0.16, 0.6, 0.96) },
        uWarm: { value: new THREE.Color(0.93, 0.78, 0.5) },
        uChrome: { value: new THREE.Color(0.78, 0.86, 0.96) },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, material);
      scene.add(points);

      const resize = () => {
        const w = mount.clientWidth;
        const h = Math.max(1, mount.clientHeight);
        aspect = w / h;
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        uniforms.uPointScale.value = (w >= 768 ? 1.0 : 0.85) * Math.min(1.4, Math.max(0.7, w / 1280));
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(mount);

      let raf = 0;
      let running = false;
      const clock = new THREE.Clock();
      const loop = () => {
        if (!running) return;
        uniforms.uTime.value = clock.getElapsedTime();
        // ease the split uniform toward the scroll-driven target
        const target = Math.max(0, Math.min(1, splitRef.current));
        splitUniform.current += (target - splitUniform.current) * 0.12;
        uniforms.uSplit.value = splitUniform.current;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      const play = () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(loop);
      };
      const pause = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      const io = new IntersectionObserver(
        ([e]) => (e.isIntersecting && !document.hidden ? play() : pause()),
        { threshold: 0.01 }
      );
      io.observe(mount);
      const onVis = () => (document.hidden ? pause() : play());
      document.addEventListener("visibilitychange", onVis);

      return () => {
        pause();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        geo.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return <div ref={mountRef} aria-hidden className={cn("h-full w-full", className)} />;
}
