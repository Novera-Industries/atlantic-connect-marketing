// Replicate GlobalCurrent's vertex formations in JS and render them as scatter
// PNGs at each journey STAGE — verifies the choreography without a GPU (the
// preview can't drive a fixed WebGL canvas while scrolled). The engine blends
// formations by an anchor-derived stage (0..7); keep these JS mirrors in sync
// with the GLSL in GlobalCurrent.tsx.
// Story: wave → static (tension) → client current → process thread → coverage
// lanes → split (fork) → warm rise (ladder) → settle (culture close).
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const N = 3500, TIME = 0, ASPECT = 1440 / 860;
const clampN = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const clamp01 = (x) => clampN(x, 0, 1);
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
const fract = (x) => x - Math.floor(x);
const hash = (n) => fract(Math.sin(n) * 43758.5453);

// mock anchors in world coords, positioned as if each section were centred
const ANCHOR_A = [-0.6, -0.3];   // Partner card
const ANCHOR_B = [0.6, -0.3];    // Careers card
const ANCHOR_C = [0.0, 0.0];     // Client photo (centred on screen)
const ANCHOR_D = [0.0, 0.0];     // Talent ladder (centred)
const ANCHOR_E = [0.0, -0.1];    // Culture close
const ANCHOR_F = [0.0, 0.0];     // Tension copy (centred)
const ANCHOR_G = [0.0, 0.0];     // Process stage (centred)
const ANCHOR_H = [0.0, 0.0];     // Coverage block (centred)

const COL = { merged: "#7fb6e6", noise: "#5d707f", split: null, cool: "#2E97E6", thread: "#9db8d4", warm: "#E8C98A", chrome: "#cdd4d9" };

const P = [];
for (let i = 0; i < N; i++) {
  P.push({ aT: Math.random(), aBand: (Math.random() * 2 - 1) * Math.sqrt(Math.random()), aStream: i % 2 === 0 ? -1 : 1, aRand: Math.random(), aRand2: Math.random() });
}

function fVortex(p) {
  const arm = Math.floor(fract(p.aRand * 5.0) * 5.0);
  const t = p.aT;
  const R = 0.68 * clampN(ASPECT, 0.58, 1.42);
  const eye = p.aRand2 >= 0.88 ? 1 : 0;
  let r = (0.05 + Math.pow(t, 1.4) * R) * (1.0 - eye * 0.82);
  r *= 1.0 + (hash(p.aRand * 7.31) - 0.5) * 0.18;
  let theta = arm * 1.25664 + t * 4.6 + TIME * 0.16;
  theta += (p.aRand2 - 0.5) * (0.14 + t * 0.62);
  const dx = Math.cos(theta) * r, dy = Math.sin(theta) * r;
  return [dx, dy * 0.46 - 0.18];
}
function fNoise(p) {
  let gx = (fract(p.aRand * 13.73) - 0.5) * 2 * ASPECT * 0.94;
  let gy = ANCHOR_F[1] + (fract(p.aRand2 * 7.31) - 0.5) * 1.55;
  const ph = p.aRand * 6.2831 + p.aRand2 * 17.0;
  gx += Math.sin(TIME * 9.0 + ph) * 0.018 + Math.sin(TIME * 2.3 + ph * 1.7) * 0.02;
  gy += Math.cos(TIME * 11.0 + ph) * 0.018 + Math.cos(TIME * 2.9 + ph * 0.8) * 0.02;
  return [gx, gy];
}
function fSea(p) {
  const depth = p.aBand * 0.5 + 0.5;
  const persp = mix(1.06, 0.30, Math.pow(depth, 0.75));
  const x = (p.aT - 0.5) * 2 * ASPECT * persp;
  const swell = Math.sin(p.aT * 22.0 * persp + TIME * 0.5 + depth * 9.0) + Math.sin(p.aT * 7.0 - TIME * 0.33);
  const y = (ANCHOR_C[1] + 0.30) - Math.pow(1.0 - depth, 1.5) * 0.62 + swell * 0.5 * 0.035 * (1.0 - depth);
  return [x, y];
}
function fHelix(p) {
  const yy = (0.5 - p.aT) * 1.7;
  const phase = p.aT * 13.8 + TIME * 0.32 + (p.aStream < 0 ? 0 : Math.PI);
  const rad = 0.17 + (hash(p.aRand * 3.7) - 0.5) * 0.07;
  const x = ANCHOR_G[0] + Math.cos(phase) * rad + p.aBand * 0.02;
  return [x, ANCHOR_G[1] + yy];
}
function fStreams(p) {
  const lane = Math.floor(fract(p.aRand * 4.999) * 4) - 1.5;
  const t = p.aT;
  const persp = mix(1.0, 0.24, t);
  const x = ANCHOR_H[0] + lane * 0.46 * ASPECT * persp + p.aBand * 0.05 * persp;
  const y = ANCHOR_H[1] - 0.30 + t * 0.58 + Math.sin(t * 12.0 - TIME * 0.4 + lane * 2.1) * 0.02 * (1.0 - t);
  return [x, y];
}
function fSplit(p) {
  const side = p.aStream;
  const start = [side * 0.05, 0.46];
  const end = side < 0 ? ANCHOR_A : ANCHOR_B;
  const e = smooth(0, 1, p.aT);
  let bx = mix(start[0], end[0], e), by = mix(start[1], end[1], e);
  bx += side * 0.20 * Math.sin(p.aT * Math.PI);
  const [dx, dy] = norm(end[0] - start[0] + 0.0001, end[1] - start[1]);
  bx += -dy * p.aBand * 0.04; by += dx * p.aBand * 0.04;
  return [bx, by];
}
function fRise(p) {
  const x = (p.aT - 0.5) * 2 * ASPECT * 0.92;
  const climb = (p.aT - 0.5) * 0.55;
  const wave = Math.sin(p.aT * 6.9 + TIME * 0.28) * 0.05;
  return [ANCHOR_D[0] + x, ANCHOR_D[1] + climb + wave + p.aBand * 0.30];
}
function fSettle(p) {
  const x = (p.aT - 0.5) * 2 * ASPECT * 0.8;
  const w = Math.sin(p.aT * 6.2831 - TIME * 0.18) * 0.05 + 0.3 * Math.sin(p.aT * 6.2831 * 0.5) * 0.05;
  return [ANCHOR_E[0] + x, ANCHOR_E[1] - 0.42 + w + p.aBand * 0.07];
}

// position + phase tag — mirrors the stage blend in the shader's main()
function pos(p, stage) {
  const s = clampN(stage + (p.aRand - 0.5) * 0.16, 0, 7);
  const F = [fVortex(p), fNoise(p), fSea(p), fHelix(p), fStreams(p), fSplit(p), fRise(p), fSettle(p)];
  const TAG = ["merged", "noise", "cool", "thread", "cool", "split", "warm", "chrome"];
  let i, k;
  if (s < 1) { i = 0; k = smooth(0, 1, s); }
  else if (s < 2) { i = 1; k = smooth(0, 1, s - 1); }
  else if (s < 3) { i = 2; k = smooth(0, 1, s - 2); }
  else if (s < 4) { i = 3; k = smooth(0, 1, s - 3); }
  else if (s < 5) { i = 4; k = smooth(0, 1, s - 4); }
  else if (s < 6) { i = 5; k = smooth(0, 1, s - 5); }
  else { i = 6; k = smooth(0, 1, clampN(s - 6, 0, 1)); }
  const a = F[i], b = F[i + 1];
  return [mix(a[0], b[0], k), mix(a[1], b[1], k), k < 0.5 ? TAG[i] : TAG[i + 1]];
}

const W = 760, H = 440;
const XMIN = -ASPECT, XMAX = ASPECT, YMIN = -1, YMAX = 1;
const mapX = (x) => ((x - XMIN) / (XMAX - XMIN)) * W;
const mapY = (y) => H - ((y - YMIN) / (YMAX - YMIN)) * H;
const ANCH = {
  A: [...ANCHOR_A, "#2E97E6"], B: [...ANCHOR_B, "#E8C98A"], C: [...ANCHOR_C, "#2E97E6"],
  D: [...ANCHOR_D, "#E8C98A"], E: [...ANCHOR_E, "#cdd4d9"], F: [...ANCHOR_F, "#5d707f"],
  G: [...ANCHOR_G, "#9db8d4"], H: [...ANCHOR_H, "#2E97E6"],
};

function panel(stage, label, anchors) {
  let circles = "";
  for (const p of P) {
    const [x, y, tag] = pos(p, stage);
    const col = tag === "split" ? (p.aStream < 0 ? "#2E97E6" : "#E8C98A") : COL[tag];
    circles += `<circle cx="${mapX(x).toFixed(1)}" cy="${mapY(y).toFixed(1)}" r="1.4" fill="${col}" fill-opacity="0.7"/>`;
  }
  let marks = "";
  for (const key of anchors || []) {
    const [ax, ay, c] = ANCH[key];
    if (key === "C") {
      const x0 = mapX(ax - 0.5), x1 = mapX(ax + 0.5), y0 = mapY(ay + 0.37), y1 = mapY(ay - 0.37);
      marks += `<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${(x1 - x0).toFixed(1)}" height="${(y1 - y0).toFixed(1)}" rx="6" fill="none" stroke="${c}" stroke-opacity="0.8"/>`;
    } else {
      marks += `<rect x="${mapX(ax) - 34}" y="${mapY(ay) - 18}" width="68" height="36" rx="4" fill="none" stroke="${c}" stroke-opacity="0.7"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#06111e"/>${circles}${marks}<text x="14" y="26" fill="#8a98a2" font-family="sans-serif" font-size="15">${label}</text></svg>`;
}

const states = [
  ["stage 0  VORTEX (hero) — the whirlpool, arms into a luminous eye", 0, []],
  ["stage 1  STATIC (tension) — cold digital noise", 1, ["F"]],
  ["stage 2  THE SEA — perspective dot-ocean around the photo (the turn)", 2, ["C"]],
  ["stage 3  HELIX — double spiral down the process timeline", 3, ["G"]],
  ["stage 4  FOUR STREAMS to the vanishing point (coverage)", 4, ["H"]],
  ["stage 5  split → Partner / Careers cards (the fork)", 5, ["A", "B"]],
  ["stage 6  warm RISE across the ladder (the climb)", 6, ["D"]],
  ["stage 7  settle — current full circle (culture close)", 7, ["E"]],
];
const bufs = await Promise.all(states.map(([l, st, a]) => sharp(Buffer.from(panel(st, l, a))).png().toBuffer()));
const out = await sharp({ create: { width: W, height: (H + 4) * states.length, channels: 4, background: { r: 6, g: 17, b: 30, alpha: 1 } } })
  .composite(bufs.map((b, i) => ({ input: b, top: i * (H + 4), left: 0 })))
  .png().toBuffer();
await writeFile("scripts/global-preview.png", out);
console.log("wrote scripts/global-preview.png");
