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
  // Depth convention (the textura-reference upgrade): every formation returns
  // pos.z in roughly [-1, 1] where LARGER z = farther away. main() shrinks and
  // dims far particles, so each formation reads as a rotating/receding VOLUME,
  // not a flat sheet.

  // Hero: THE VORTEX — the current as a slow ocean whirlpool seen from above
  // at a tilt (the reference's spiral galaxy, made of water; echoes the logo's
  // circular curl). Five arms wind into a dense luminous eye; the whole disk
  // slowly rotates and the arms blur outward into spray.
  vec3 fVortex() {
    float arm = floor(fract(aRand * 5.0) * 5.0);          // which spiral arm
    float t = aT;                                          // 0 eye .. 1 rim
    float R = 0.68 * clamp(uAspect, 0.58, 1.42);           // disk fits any viewport
    float eye = step(0.88, aRand2);                        // 12% live in the eye
    float r = (0.05 + pow(t, 1.4) * R) * (1.0 - eye * 0.82);
    r *= 1.0 + (hash(aRand * 7.31) - 0.5) * 0.18;
    float theta = arm * 1.25664 + t * 4.6 + uTime * 0.16;  // winding + slow rotation
    theta += (aRand2 - 0.5) * (0.14 + t * 0.62);           // arms blur outward
    vec2 disk = vec2(cos(theta), sin(theta)) * r;
    float depth = disk.y / max(R, 0.001);                  // far side of the tilt
    // eye sits BELOW the headline (reference framing), not behind it
    return vec3(disk.x, disk.y * 0.46 - 0.18, depth);
  }
  // Tension: the one moment the Current is NOT water — cold digital STATIC.
  // A loose full-width field around the tension copy. IMPORTANT: the shimmer is
  // CONTINUOUS with per-particle random phases — an earlier version snapped all
  // particles on one global 6Hz clock and the user read the whole page as
  // "choppy". Nothing here may step on a shared clock; the static texture comes
  // from decorrelated micro-drift plus per-particle alpha flicker (see main()).
  vec3 fNoise() {
    vec2 f = uAnchorF;
    float gx = (fract(aRand * 13.73) - 0.5) * 2.0 * uAspect * 0.94;
    float gy = f.y + (fract(aRand2 * 7.31) - 0.5) * 1.55;
    float ph = aRand * 6.2831 + aRand2 * 17.0;
    gx += sin(uTime * 9.0 + ph) * 0.018 + sin(uTime * 2.3 + ph * 1.7) * 0.02;
    gy += cos(uTime * 11.0 + ph) * 0.018 + cos(uTime * 2.9 + ph * 0.8) * 0.02;
    return vec3(gx, gy, (aRand2 - 0.5));
  }
  // Client: THE SEA — a perspective dot-ocean receding to a horizon just above
  // the photo. Near rows are wide and swell; far rows compress toward the
  // horizon. The opaque photo sits IN the water (masks the middle).
  vec3 fSea() {
    vec2 c = uAnchorC;
    float depth = aBand * 0.5 + 0.5;                       // 0 near .. 1 horizon
    float persp = mix(1.06, 0.30, pow(depth, 0.75));
    float x = (aT - 0.5) * 2.0 * uAspect * persp;
    float swell = sin(aT * 22.0 * persp + uTime * 0.5 + depth * 9.0)
                + sin(aT * 7.0 - uTime * 0.33);
    float y = (c.y + 0.30) - pow(1.0 - depth, 1.5) * 0.62 + swell * 0.5 * 0.035 * (1.0 - depth);
    return vec3(x, y, depth * 2.0 - 1.0);
  }
  // Process: THE HELIX — the current threads down the pinned timeline as a slow
  // double spiral (front and back strands), order made visible.
  vec3 fHelix() {
    vec2 g = uAnchorG;
    float yy = (0.5 - aT) * 1.7;
    float phase = aT * 13.8 + uTime * 0.32 + (aStream < 0.0 ? 0.0 : 3.14159);
    float rad = 0.17 + (hash(aRand * 3.7) - 0.5) * 0.07;
    float x = g.x + cos(phase) * rad + aBand * 0.02;
    return vec3(x, g.y + yy, sin(phase));
  }
  // Coverage: FOUR STREAMS — the four in-person channels as lanes receding
  // toward a shared vanishing point (a fleet heading out).
  vec3 fStreams() {
    vec2 h = uAnchorH;
    float lane = floor(fract(aRand * 4.999) * 4.0) - 1.5;
    float t = aT;                                          // 0 near .. 1 far
    float persp = mix(1.0, 0.24, t);
    float x = h.x + lane * 0.46 * uAspect * persp + aBand * 0.05 * persp;
    float y = h.y - 0.30 + t * 0.58 + sin(t * 12.0 - uTime * 0.4 + lane * 2.1) * 0.02 * (1.0 - t);
    return vec3(x, y, t * 2.0 - 1.0);
  }
  // Talent: the warm current RISES across the ladder — low on the left, high on
  // the right — the climb made literal.
  vec3 fRise() {
    vec2 d = uAnchorD;
    float x = (aT - 0.5) * 2.0 * uAspect * 0.92;
    float climb = (aT - 0.5) * 0.55;
    float wave = sin(aT * 6.9 + uTime * 0.28) * 0.05;
    float y = d.y + climb + wave + aBand * 0.30;
    return vec3(x, y, aBand);
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
    // FLOWS as a travelling wave of motion rather than snapping as a uniform mass.
    // Applied to EVERY transition (recording 2 showed the vortex→static morph
    // travelling as one dense blob): the spread peaks mid-transition and returns
    // to tight at each integer stage, so formations dissolve and re-form in waves.
    float transFlow = sin(fract(uStage) * 3.14159);
    float stagger = 0.16 + smoothstep(0.25, 0.75, uStage) * transFlow * 0.62;
    float s = clamp(uStage + (aRand - 0.5) * stagger, 0.0, 7.0);

    vec3 P0 = fVortex();        // hero     — the whirlpool
    vec3 P1 = fNoise();         // tension  — cold digital static
    vec3 P2 = fSea();           // client   — perspective dot-ocean around the photo (the turn)
    vec3 P3 = fHelix();         // process  — double spiral down the timeline
    vec3 P4 = fStreams();       // coverage — four lanes to the vanishing point
    vec3 P5 = fSplit();         // fork     — two streams into the Partner/Careers cards
    vec3 P6 = fRise();          // talent   — the warm climb
    vec3 P7 = mix(fSettle(), fTwist(), uTwist); // culture close — settle → blue+gold braid

    vec3 cMerged = mix(uCool, uChrome, 0.45 + 0.35 * hash(aRand)); // hero vortex (silvery, reference-white)
    vec3 cNoise  = mix(uChrome, uCool, 0.4) * 0.85;                // tension static (cold, crisp)
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

    // depth shading (the volume illusion): far particles smaller and dimmer.
    float depth01 = clamp(pos.z, -1.0, 1.0) * 0.5 + 0.5;
    float dSize = mix(1.3, 0.58, depth01);
    float dAlpha = mix(1.15, 0.62, depth01);

    // the vortex EYE glows: particles near the hero disk's centre get a hot core
    // (only while the journey is at/near stage 0).
    float coreBoost = (1.0 - smoothstep(0.4, 1.0, uStage))
                    * smoothstep(0.30, 0.04, length(pos.xy - vec2(0.0, -0.18)));
    col *= 1.0 + coreBoost * 1.1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xy, 0.0, 1.0);

    float twinkle = 0.78 + 0.22 * sin(uTime * 1.5 + aRand * 30.0);
    // reference-tier size field: MANY fine dots, a FEW bright carriers.
    float size = 1.35 + pow(aRand2, 1.7) * 4.4;
    gl_PointSize = size * dSize * (1.0 + coreBoost * 0.7) * uPointScale * uPixelRatio * twinkle;

    vColor = col;
    // soften the left/right edges of the band formations (the wave looked harshly
    // cut off at the sides). aT runs along the width, so fade the outer ~12%.
    // Protected near the split (stage 5, streams must land hard in the cards) and
    // near the static (stage 1, where aT is not an x-position so the fade would
    // just dim a random subset of the noise).
    float aTedge = smoothstep(0.0, 0.12, aT) * (1.0 - smoothstep(0.88, 1.0, aT));
    float edgeW = min(smoothstep(0.5, 1.0, abs(uStage - 5.0)), smoothstep(0.5, 1.0, abs(uStage - 1.0)));
    float edge = mix(1.0, aTedge, edgeW);
    // the vortex reads denser/hotter than the travelling formations (reference look)
    float heroLift = (1.0 - smoothstep(0.4, 1.0, uStage)) * 0.25;
    // alpha floor raised: the recording showed the whole journey too faint — the
    // reference's dots are crisp and bright, density carries the drama.
    vAlpha = (0.72 + 0.28 * (0.5 + 0.5 * sin(aT * 12.0 + uTime))) * (1.0 + heroLift) * uFade * edge * dAlpha;
    // TV-static flicker near the tension act: each particle blinks on its OWN
    // clock (random phase), so the field shimmers at 60fps with no global pulse.
    float staticGate = 1.0 - min(abs(uStage - 1.0), 1.0);
    float flick = hash(floor(uTime * 14.0 + aRand * 97.0) + aRand2 * 31.0);
    vAlpha *= mix(1.0, 0.35 + 0.9 * flick, staticGate);
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
    gl_FragColor = vec4(vColor + core * 0.85, a * vAlpha);
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
    // Cap DPR — additive blending is fill-rate bound (the mobile bottleneck, and
    // after the radiance pass the desktop one too); 1.6 is visually identical at
    // arm's length and ~17% cheaper than 1.75 in raster area.
    const DPR = Math.min(window.devicePixelRatio || 1, wide ? 1.6 : 1.5);
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

    // Each anchor's journey waypoint + the uniform its rect feeds. The render
    // loop only reads rects for anchors near the live stage.
    const ANCHOR_MAP = [
      ["noise", 1, "uAnchorF", true],
      ["client", 2, "uAnchorC", true],
      ["process", 3, "uAnchorG", true],
      ["coverage", 4, "uAnchorH", true],
      ["partner", 5, "uAnchorA", false],
      ["careers", 5, "uAnchorB", false],
      ["talent", 6, "uAnchorD", true],
      ["trust", 7, "uAnchorE", true],
    ] as const;

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
      // __forceStage: optional dev override (0..7) to inspect any formation.
      const forced = (window as unknown as { __forceStage?: number }).__forceStage;
      const target = typeof forced === "number" ? forced : computeStage();
      stage.current += (target - stage.current) * 0.12;
      uniforms.uStage.value = stage.current;
      // Only read the rects of anchors whose formation is near the current stage
      // (stagger spreads a morph by ±0.4 at most): 9 getBoundingClientRect calls
      // per frame → ~3, the layout-read cost the Phase-4 note predicted.
      for (const [name, st, uni, centre] of ANCHOR_MAP) {
        if (Math.abs(stage.current - st) < 1.35) {
          anchorWorld(name, uniforms[uni].value, centre);
        }
      }
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
