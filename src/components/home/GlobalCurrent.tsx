"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { getAnchorRect, type AnchorName } from "./anchors";

/* ------------------------------------------------------------------ shaders */

const VERT = /* glsl */ `
  attribute float aT;      // 0..1 along the current
  attribute float aBand;   // -1..1 across the ribbon
  attribute float aStream; // -1 cool (Partner), +1 warm (Careers)
  attribute float aRand;
  attribute float aRand2;

  uniform float uTime;
  uniform float uStage;     // 0..7 journey position, driven by live anchor rects
  uniform float uFade;      // 1 = visible, 0 = hidden (drops to 0 behind the footer)
  uniform float uTwist;     // 0 = white settle, 1 = blue+gold braid (ramps near the footer)
  uniform float uAspect;
  uniform float uPointScale;
  uniform float uPixelRatio;
  uniform vec3  uCool;
  uniform vec3  uWarm;
  uniform vec3  uChrome;
  uniform vec2  uAnchorA;   // Partner card   (world coords)
  uniform vec2  uAnchorB;   // Careers card   (world coords)
  uniform vec2  uAnchorC;   // Client media   (world coords)
  uniform vec2  uAnchorD;   // Talent ladder  (world coords)
  uniform vec2  uAnchorE;   // Culture close  (world coords)
  uniform vec2  uAnchorF;   // Tension copy   (world coords)
  uniform vec2  uAnchorG;   // Process stage  (world coords)
  uniform vec2  uAnchorH;   // Coverage block (world coords)

  varying vec3  vColor;
  varying float vAlpha;

  float hash(float n){ return fract(sin(n) * 43758.5453); }

  // ---- formations -------------------------------------------------
  // Hero rest state: an ocean-wave crest echoing the logo mark (a swell that
  // rises, breaks into a curl, and throws light spray) — not a circular blob.
  // Hero wave (reverted from the barrel attempt): a swelling crest with a body of
  // water below and light spray. Reads as a wave-ish swell behind the headline.
  vec3 fWaveCrest() {
    float t = aT;
    float x = (t - 0.5) * 2.0 * uAspect * 0.82;          // sweep across, centred
    float swell = pow(sin(clamp(t, 0.0, 1.0) * 3.14159), 1.05);
    float lip = exp(-pow((t - 0.38) * 3.8, 2.0));        // breaking-lip bump
    float crestY = swell * 0.26 + lip * 0.18 - 0.02;
    float depth = pow(aBand * 0.5 + 0.5, 0.8);           // 0 at crest .. 1 deep
    float y = crestY - depth * (0.26 + swell * 0.22);    // body hangs below the crest
    float curlMask = lip * smoothstep(0.55, 0.0, depth);
    float ang = depth * 9.0 + t * 5.0 - uTime * 0.25;
    x += curlMask * cos(ang) * 0.07;
    y += curlMask * (sin(ang) * 0.07 + 0.11);
    float spray = step(0.84, aRand) * swell;
    y += spray * (0.06 + aRand2 * 0.20);
    x += spray * (aRand2 - 0.5) * 0.18;
    return vec3(x, y, aBand * 0.4);
  }
  // Tension: the one moment the Current is NOT water — cold digital STATIC.
  // A loose full-width field of points that snap position in hard clocked steps
  // (screen noise, staccato) around the tension copy. Resolves back into the
  // flowing current at the next stage — chaos organizing into connection.
  vec3 fNoise() {
    vec2 f = uAnchorF;
    float gx = (fract(aRand * 13.73) - 0.5) * 2.0 * uAspect * 0.94;
    float gy = f.y + (fract(aRand2 * 7.31) - 0.5) * 1.55;
    float tick = floor(uTime * 6.0) + floor(aRand * 4.0);
    gx += (hash(tick + aRand * 91.7) - 0.5) * 0.15;
    gy += (hash(tick + aRand2 * 57.3) - 0.5) * 0.15;
    return vec3(gx, gy, aBand * 0.4);
  }
  // Process: the current turns VERTICAL and threads down the pinned timeline —
  // order emerging from the noise, one continuous stream through the four steps.
  vec3 fThread() {
    vec2 g = uAnchorG;
    float yy = (aT - 0.5) * 1.7;
    float wave = sin(aT * 6.2831 * 1.1 - uTime * 0.25) * 0.05 + sin(aT * 6.2831 * 0.5 + uTime * 0.1) * 0.03;
    float x = g.x + wave + aBand * 0.34;
    return vec3(x, g.y + yy, aBand * 0.4);
  }
  // Coverage: the one current fans into FOUR parallel lanes — one per in-person
  // channel (residential / retail / B2B / events) — flowing across the block.
  vec3 fLanes() {
    vec2 h = uAnchorH;
    float lane = floor(fract(aRand * 4.999) * 4.0) - 1.5;
    float x = (aT - 0.5) * 2.0 * uAspect * 0.9;
    float wave = sin(aT * 6.2831 * 0.9 + uTime * 0.22 + lane * 2.1) * 0.03;
    float y = h.y + lane * 0.16 + wave + aBand * 0.05;
    return vec3(x, y, aBand * 0.3);
  }
  // Talent: the warm current RISES across the ladder — low on the left, high on
  // the right — the climb made literal.
  vec3 fRise() {
    vec2 d = uAnchorD;
    float x = (aT - 0.5) * 2.0 * uAspect * 0.92;
    float climb = (aT - 0.5) * 0.55;
    float wave = sin(aT * 6.2831 * 1.1 + uTime * 0.28) * 0.05;
    float y = d.y + climb + wave + aBand * 0.30;
    return vec3(x, y, aBand * 0.4);
  }
  // Fork: ONE current at the top splits into two clean ribbons that flow into the
  // Partner / Careers cards (anchors). Tight bands, not scattered dust.
  vec3 fSplit() {
    float side = aStream;
    vec2 start = vec2(side * 0.05, 0.46);                   // a near-single trunk up top
    vec2 end = (side < 0.0) ? uAnchorA : uAnchorB;
    float e = smoothstep(0.0, 1.0, aT);
    vec2 base = mix(start, end, e);
    base.x += side * 0.20 * sin(aT * 3.14159);             // gentle outward bow
    vec2 dir = normalize(end - start + vec2(0.0001));
    vec2 perp = vec2(-dir.y, dir.x);
    base += perp * aBand * 0.04;                           // thin ribbon (was scattered)
    return vec3(base, aBand * 0.3);
  }
  // Client: the current FLOWS past the centred photo as a horizontal wave at the
  // photo's level — the photo sits in the stream (its opaque box masks the middle,
  // so the water reads as flowing around it). A ring read as a hollow "C"; this
  // keeps it part of the one continuous current. Cool.
  vec3 fClientCurrent() {
    vec2 c = uAnchorC;
    float x = (aT - 0.5) * 2.0 * uAspect * 0.95;
    float wave = sin(aT * 6.2831 * 1.2 - uTime * 0.3) * 0.06 + sin(aT * 6.2831 * 0.55 + uTime * 0.12) * 0.035;
    float y = c.y + wave + aBand * 0.42;
    return vec3(x, y, aBand * 0.4);
  }
  // Talent: the same current, warm, flowing through the talent section.
  vec3 fTalentCurrent() {
    vec2 d = uAnchorD;
    float x = (aT - 0.5) * 2.0 * uAspect * 0.95;
    float wave = sin(aT * 6.2831 * 1.1 + uTime * 0.28) * 0.06 + sin(aT * 6.2831 * 0.6 - uTime * 0.1) * 0.035;
    float y = d.y + wave + aBand * 0.42;
    return vec3(x, y, aBand * 0.4);
  }
  // Trust: the current settles into ONE calm, wide wave above the strip (anchor E).
  vec3 fSettle() {
    vec2 e = uAnchorE;
    float x = (aT - 0.5) * 2.0 * uAspect * 0.8;
    float w = sin(aT * 6.2831 - uTime * 0.18) * 0.05 + 0.3 * sin(aT * 6.2831 * 0.5) * 0.05;
    vec2 p = vec2(e.x + x, e.y - 0.42 + w + aBand * 0.07); // below the strip + "Trained…" line
    return vec3(p, aBand * 0.3);
  }
  // Trust finale: the white current BRAIDS into a blue+gold twist — the two
  // temperatures (cool strand / warm strand) wind around each other before the
  // whole thing fades behind the footer. (uTwist ramps 0→1 near the bottom.)
  vec3 fTwist() {
    vec2 e = uAnchorE;
    float t = aT;
    float x = (t - 0.5) * 2.0 * uAspect * 0.78;
    float phase = t * 6.2831 * 2.6 - uTime * 0.45;        // braid frequency along x
    float strandY = sin(phase) * 0.075 * aStream;          // opposite-phase strands cross
    float y = e.y - 0.42 + strandY + aBand * 0.022;        // below the strip + "Trained…" line
    return vec3(x, y, aBand * 0.3);
  }

  void main() {
    // Stage 0..7 is driven in JS from the live section rects, so each formation
    // is active exactly when its section is centred — the morph tracks the scroll.
    // Fluid transitions: spread each particle's transition timing so the morph
    // FLOWS as a travelling wave of motion rather than snapping as a uniform colour
    // shift. The spread peaks mid-transition and ramps up from the noise→client
    // turn onward (the "static organizes into the current" moment); the hero→noise
    // entry keeps its tight feel.
    float transFlow = sin(fract(uStage) * 3.14159);
    float stagger = 0.16 + smoothstep(1.6, 2.2, uStage) * transFlow * 0.62;
    float s = clamp(uStage + (aRand - 0.5) * stagger, 0.0, 7.0);

    vec3 P0 = fWaveCrest();     // hero     — the wave
    vec3 P1 = fNoise();         // tension  — cold digital static
    vec3 P2 = fClientCurrent(); // client   — the current flows past the photo (the turn)
    vec3 P3 = fThread();        // process  — vertical thread down the timeline
    vec3 P4 = fLanes();         // coverage — four channel lanes
    vec3 P5 = fSplit();         // fork     — two streams into the Partner/Careers cards
    vec3 P6 = fRise();          // talent   — the warm climb
    vec3 P7 = mix(fSettle(), fTwist(), uTwist); // culture close — settle → blue+gold braid

    vec3 cMerged = mix(uCool, uChrome, 0.25 + 0.25 * hash(aRand)); // hero wave
    vec3 cNoise  = mix(uChrome, uCool, 0.4) * 0.62;                // tension static (dim, cold)
    vec3 cCool   = mix(uCool, uChrome, 0.18);                      // client (cool)
    vec3 cThread = mix(uCool, uChrome, 0.35);                      // process (cool silver)
    vec3 cSplit  = (aStream < 0.0) ? uCool : uWarm;                // partner / careers
    vec3 cWarm   = uWarm;                                          // talent (warm)
    vec3 cChrome = uChrome;                                        // settle (silver/white)
    vec3 cEnd    = mix(cChrome, cSplit, uTwist);                   // → blue/gold braid strands

    vec3 pos; vec3 col;
    if (s < 1.0) {
      float k = smoothstep(0.0, 1.0, s);
      pos = mix(P0, P1, k); col = mix(cMerged, cNoise, k);
    } else if (s < 2.0) {
      float k = smoothstep(0.0, 1.0, s - 1.0);
      pos = mix(P1, P2, k); col = mix(cNoise, cCool, k);
    } else if (s < 3.0) {
      float k = smoothstep(0.0, 1.0, s - 2.0);
      pos = mix(P2, P3, k); col = mix(cCool, cThread, k);
    } else if (s < 4.0) {
      float k = smoothstep(0.0, 1.0, s - 3.0);
      pos = mix(P3, P4, k); col = mix(cThread, cCool, k);
    } else if (s < 5.0) {
      float k = smoothstep(0.0, 1.0, s - 4.0);
      pos = mix(P4, P5, k); col = mix(cCool, cSplit, k);
    } else if (s < 6.0) {
      float k = smoothstep(0.0, 1.0, s - 5.0);
      pos = mix(P5, P6, k); col = mix(cSplit, cWarm, k);
    } else {
      float k = smoothstep(0.0, 1.0, clamp(s - 6.0, 0.0, 1.0));
      pos = mix(P6, P7, k); col = mix(cWarm, cEnd, k);
    }

    // living drift
    pos.x += sin(uTime * 0.3 + aRand * 6.28) * 0.01;
    pos.y += cos(uTime * 0.27 + aRand2 * 6.28) * 0.01;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    float twinkle = 0.7 + 0.3 * sin(uTime * 1.5 + aRand * 30.0);
    float size = 1.6 + aRand2 * 2.4;
    gl_PointSize = size * uPointScale * uPixelRatio * twinkle;

    vColor = col;
    // soften the left/right edges of the band formations (the wave looked harshly
    // cut off at the sides). aT runs along the width, so fade the outer ~12%.
    // Protected near the split (stage 5, streams must land hard in the cards) and
    // near the static (stage 1, where aT is not an x-position so the fade would
    // just dim a random subset of the noise).
    float aTedge = smoothstep(0.0, 0.12, aT) * (1.0 - smoothstep(0.88, 1.0, aT));
    float edgeW = min(smoothstep(0.5, 1.0, abs(uStage - 5.0)), smoothstep(0.5, 1.0, abs(uStage - 1.0)));
    float edge = mix(1.0, aTedge, edgeW);
    vAlpha = ((0.5 + 0.5 * sin(aT * 12.0 + uTime)) * 0.5 + 0.5) * uFade * edge;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.26, 0.0, d);
    gl_FragColor = vec4(vColor + core * 0.6, a * vAlpha);
  }
`;

/* --------------------------------------------------------------- component */

export function GlobalCurrent(_props: { targetRef: RefObject<HTMLElement | null> }) {
  const mountRef = useRef<HTMLDivElement>(null);
  // stage 0..7 along the journey, smoothed; computed each frame from section rects
  const stage = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const vw = window.innerWidth;
    const wide = vw >= 768;

    // Graceful no-WebGL fallback: if the context can't be created, bail cleanly
    // (the sections keep their designed static look) instead of throwing.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      if (!renderer.getContext()) return;
    } catch {
      return;
    }
    // Cap DPR harder on phones — additive blending is fill-rate bound, and the
    // reference clip's whole point is that this stays smooth on mobile.
    const DPR = Math.min(window.devicePixelRatio || 1, wide ? 1.75 : 1.5);
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    let aspect = window.innerWidth / Math.max(1, window.innerHeight);
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100);
    camera.position.z = 3;

    // Particle budget by viewport: full textura-tier on desktop, trimmed on
    // tablet/phone so the morph stays at 60fps (verified target, not blind).
    const COUNT = vw >= 1280 ? 20000 : vw >= 768 ? 14000 : vw >= 480 ? 9000 : 6500;
    const posArr = new Float32Array(COUNT * 3);
    const aT = new Float32Array(COUNT);
    const aBand = new Float32Array(COUNT);
    const aStream = new Float32Array(COUNT);
    const aRand = new Float32Array(COUNT);
    const aRand2 = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      aT[i] = Math.random();
      aBand[i] = (Math.random() * 2 - 1) * Math.sqrt(Math.random());
      aStream[i] = i % 2 === 0 ? -1 : 1;
      aRand[i] = Math.random();
      aRand2[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
    geo.setAttribute("aBand", new THREE.BufferAttribute(aBand, 1));
    geo.setAttribute("aStream", new THREE.BufferAttribute(aStream, 1));
    geo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
    geo.setAttribute("aRand2", new THREE.BufferAttribute(aRand2, 1));

    const uniforms = {
      uTime: { value: 0 },
      uStage: { value: 0 },
      uFade: { value: 1 },
      uTwist: { value: 0 },
      uAspect: { value: aspect },
      uPointScale: { value: wide ? 1.0 : 0.85 },
      uPixelRatio: { value: DPR },
      uCool: { value: new THREE.Color(0.16, 0.6, 0.96) },
      uWarm: { value: new THREE.Color(0.93, 0.78, 0.5) },
      uChrome: { value: new THREE.Color(0.78, 0.86, 0.96) },
      uAnchorA: { value: new THREE.Vector2(-0.9, -0.55) },
      uAnchorB: { value: new THREE.Vector2(0.9, -0.55) },
      uAnchorC: { value: new THREE.Vector2(0.35, 0.0) },   // client media (centred)
      uAnchorD: { value: new THREE.Vector2(0.0, -0.1) },   // talent ladder (centred)
      uAnchorE: { value: new THREE.Vector2(0.0, -0.35) },  // culture close (centred)
      uAnchorF: { value: new THREE.Vector2(0.0, 0.0) },    // tension copy (centred)
      uAnchorG: { value: new THREE.Vector2(0.0, 0.0) },    // process stage (centred)
      uAnchorH: { value: new THREE.Vector2(0.0, 0.0) },    // coverage block (centred)
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
      const w = window.innerWidth;
      const h = window.innerHeight;
      aspect = w / h;
      camera.left = -aspect;
      camera.right = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      uniforms.uAspect.value = aspect;
      uniforms.uPointScale.value = (w >= 768 ? 1.0 : 0.85) * Math.min(1.35, Math.max(0.7, w / 1280));
    };
    resize();
    window.addEventListener("resize", resize);

    // convert a block's screen rect → ortho world coords.
    // partner/careers aim a little inside the top (the split streams land there);
    // the Phase 2 gather formations centre on the block, so aim at its middle.
    const anchorWorld = (name: AnchorName, out: THREE.Vector2, atCentre = false) => {
      const r = getAnchorRect(name);
      if (!r) return;
      const cx = r.left + r.width / 2;
      const ty = atCentre ? r.top + r.height / 2 : r.top + Math.min(r.height * 0.25, 60);
      const ndcX = (cx / window.innerWidth) * 2 - 1;
      const ndcY = -((ty / window.innerHeight) * 2 - 1);
      out.set(ndcX * aspect, ndcY);
    };

    // Journey stage 0..7 from where each section sits on screen. Waypoints are the
    // scroll positions at which each section centres in the viewport, so stage (and
    // thus the formation) tracks the actual content rather than a guessed scroll-%.
    // Story order: hero → tension(noise) → client → process → coverage → fork →
    // talent(ladder) → culture(trust anchor).
    const docCenter = (name: AnchorName) => {
      const r = getAnchorRect(name);
      return r ? window.scrollY + r.top + r.height / 2 : null;
    };
    const computeStage = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const fp = docCenter("partner");
      const fc = docCenter("careers");
      const fork = fp != null && fc != null ? (fp + fc) / 2 : fp ?? fc;
      const raw = [
        0,
        docCenter("noise"),
        docCenter("client"),
        docCenter("process"),
        docCenter("coverage"),
        fork,
        docCenter("talent"),
        docCenter("trust"),
      ];
      const maxScroll = Math.max(1, (document.documentElement.scrollHeight || vh) - vh);
      const wp: number[] = [];
      for (let i = 0; i < raw.length; i++) {
        let v = i === 0 ? 0 : raw[i] == null ? NaN : Math.max(0, (raw[i] as number) - vh / 2);
        if (i === raw.length - 1 && Number.isFinite(v)) v = Math.min(v, maxScroll); // make the end reachable
        wp[i] = !Number.isFinite(v) || (i > 0 && v <= wp[i - 1]) ? (i === 0 ? 0 : wp[i - 1] + 1) : v;
      }
      if (sy <= wp[0]) return 0;
      for (let i = 0; i < wp.length - 1; i++) {
        if (sy < wp[i + 1]) return i + (sy - wp[i]) / (wp[i + 1] - wp[i]);
      }
      return raw.length - 1;
    };

    // Fade the current out once you reach the bottom so it hides behind the footer
    // (and fades back in as you scroll up). Driven by the footer's screen position.
    const sstep = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };
    let footerEl: HTMLElement | null = null;
    let fadeVal = 1;
    let twistVal = 0;

    let raf = 0;
    let running = false;
    const clock = new THREE.Clock();
    const loop = () => {
      if (!running) return;
      uniforms.uTime.value = clock.getElapsedTime();
      anchorWorld("partner", uniforms.uAnchorA.value);
      anchorWorld("careers", uniforms.uAnchorB.value);
      anchorWorld("client", uniforms.uAnchorC.value, true);
      anchorWorld("talent", uniforms.uAnchorD.value, true);
      anchorWorld("trust", uniforms.uAnchorE.value, true);
      anchorWorld("noise", uniforms.uAnchorF.value, true);
      anchorWorld("process", uniforms.uAnchorG.value, true);
      anchorWorld("coverage", uniforms.uAnchorH.value, true);
      // __forceStage: optional dev override (0..7) to inspect any formation.
      const forced = (window as unknown as { __forceStage?: number }).__forceStage;
      const target = typeof forced === "number" ? forced : computeStage();
      stage.current += (target - stage.current) * 0.12;
      uniforms.uStage.value = stage.current;
      // Near the bottom: first the white current BRAIDS into the blue+gold twist
      // (uTwist), then it hides behind the footer (uFade). Twist ramps up earlier
      // than the fade so you see the braid before it disappears.
      if (!footerEl || !footerEl.isConnected) footerEl = document.querySelector("footer");
      const vh = window.innerHeight;
      const ftop = footerEl ? footerEl.getBoundingClientRect().top : Infinity;
      const fadeTarget = Number.isFinite(ftop) ? sstep((ftop - vh * 0.3) / (vh * 0.6)) : 1;
      const twistTarget = Number.isFinite(ftop) ? 1 - sstep((ftop - vh * 0.9) / (vh * 0.4)) : 0;
      fadeVal += (fadeTarget - fadeVal) * 0.15;
      twistVal += (twistTarget - twistVal) * 0.1;
      uniforms.uFade.value = fadeVal;
      uniforms.uTwist.value = twistVal;
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
    play();
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      pause();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      geo.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // z-0 (not -z-10): a fixed negative-z layer paints *below* the body's opaque
  // navy bg and is hidden on real GPUs; z-0 paints above the body bg, with the
  // content wrapper (z-10) on top. pointer-events-none so it never eats clicks.
  return <div ref={mountRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" />;
}
