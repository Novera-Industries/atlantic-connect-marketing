// Replicate GlobalCurrent's vertex formations in JS and render them as scatter
// PNGs at each journey STAGE — verifies the choreography without a GPU (the
// preview can't drive a fixed WebGL canvas while scrolled). The engine now
// blends formations by an anchor-derived stage (0..4); keep these JS mirrors in
// sync with the GLSL in GlobalCurrent.tsx.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const N = 3500, TIME = 0, ASPECT = 1440 / 860;
const clampN = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const clamp01 = (x) => clampN(x, 0, 1);
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };

// mock anchors in world coords, positioned as if each section were centred
const ANCHOR_A = [-0.6, -0.3];   // Partner card
const ANCHOR_B = [0.6, -0.3];    // Careers card
const ANCHOR_C = [0.0, 0.0];     // Client photo (centred on screen)
const ANCHOR_D = [0.35, 0.0];    // Talent card
const ANCHOR_E = [0.0, -0.1];    // Trust CTA

const COL = { merged: "#7fb6e6", split: null, cool: "#2E97E6", warm: "#E8C98A", chrome: "#cdd4d9" };

const P = [];
for (let i = 0; i < N; i++) {
  P.push({ aT: Math.random(), aBand: (Math.random() * 2 - 1) * Math.sqrt(Math.random()), aStream: i % 2 === 0 ? -1 : 1, aRand: Math.random(), aRand2: Math.random() });
}

function fWaveCrest(p) {
  const t = p.aT;
  let x = (t - 0.5) * 2 * ASPECT * 0.82;
  const swell = Math.pow(Math.sin(clamp01(t) * Math.PI), 1.05);
  const lip = Math.exp(-Math.pow((t - 0.38) * 3.8, 2));
  const crestY = swell * 0.26 + lip * 0.18 - 0.02;
  const depth = Math.pow(p.aBand * 0.5 + 0.5, 0.8);
  let y = crestY - depth * (0.26 + swell * 0.22);
  const curlMask = lip * smooth(0.55, 0.0, depth);
  const ang = depth * 9.0 + t * 5.0 - TIME * 0.25;
  x += curlMask * Math.cos(ang) * 0.07;
  y += curlMask * (Math.sin(ang) * 0.07 + 0.11);
  const spray = (p.aRand >= 0.84 ? 1 : 0) * swell;
  y += spray * (0.06 + p.aRand2 * 0.20);
  x += spray * (p.aRand2 - 0.5) * 0.18;
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
function fClientCurrent(p) {
  const x = (p.aT - 0.5) * 2 * ASPECT * 0.95;
  const wave = Math.sin(p.aT * 6.2831 * 1.2 - TIME * 0.3) * 0.06 + Math.sin(p.aT * 6.2831 * 0.55 + TIME * 0.12) * 0.035;
  return [ANCHOR_C[0] + x, ANCHOR_C[1] + wave + p.aBand * 0.42];
}
function fTalentCurrent(p) {
  const x = (p.aT - 0.5) * 2 * ASPECT * 0.95;
  const wave = Math.sin(p.aT * 6.2831 * 1.1 + TIME * 0.28) * 0.06 + Math.sin(p.aT * 6.2831 * 0.6 - TIME * 0.1) * 0.035;
  return [ANCHOR_D[0] + x, ANCHOR_D[1] + wave + p.aBand * 0.42];
}
function fSettle(p) {
  const x = (p.aT - 0.5) * 2 * ASPECT * 0.8;
  const w = Math.sin(p.aT * 6.2831 - TIME * 0.18) * 0.05 + 0.3 * Math.sin(p.aT * 6.2831 * 0.5) * 0.05;
  return [ANCHOR_E[0] + x, ANCHOR_E[1] + 0.34 + w + p.aBand * 0.07];
}

// position + phase tag — mirrors the stage blend in the shader's main()
function pos(p, stage) {
  const s = clampN(stage + (p.aRand - 0.5) * 0.16, 0, 4);
  const F = [fWaveCrest(p), fSplit(p), fClientCurrent(p), fTalentCurrent(p), fSettle(p)];
  const TAG = ["merged", "split", "cool", "warm", "chrome"];
  let i, k;
  if (s < 1) { i = 0; k = smooth(0, 1, s); }
  else if (s < 2) { i = 1; k = smooth(0, 1, s - 1); }
  else if (s < 3) { i = 2; k = smooth(0, 1, s - 2); }
  else { i = 3; k = smooth(0, 1, clampN(s - 3, 0, 1)); }
  const a = F[i], b = F[i + 1];
  return [mix(a[0], b[0], k), mix(a[1], b[1], k), k < 0.5 ? TAG[i] : TAG[i + 1]];
}

const W = 760, H = 440;
const XMIN = -ASPECT, XMAX = ASPECT, YMIN = -1, YMAX = 1;
const mapX = (x) => ((x - XMIN) / (XMAX - XMIN)) * W;
const mapY = (y) => H - ((y - YMIN) / (YMAX - YMIN)) * H;
const ANCH = { A: [...ANCHOR_A, "#2E97E6"], B: [...ANCHOR_B, "#E8C98A"], C: [...ANCHOR_C, "#2E97E6"], D: [...ANCHOR_D, "#E8C98A"], E: [...ANCHOR_E, "#cdd4d9"] };

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
  ["stage 0  WAVE (hero) — the logo ocean wave", 0, []],
  ["stage 1  split → Partner / Careers cards", 1, ["A", "B"]],
  ["stage 2  cool current FLOWS past the CENTRED photo", 2, ["C"]],
  ["stage 3  warm current flows through Talent", 3, ["D"]],
  ["stage 4  settle — current full circle (Trust CTA)", 4, ["E"]],
];
const bufs = await Promise.all(states.map(([l, st, a]) => sharp(Buffer.from(panel(st, l, a))).png().toBuffer()));
const out = await sharp({ create: { width: W, height: (H + 4) * states.length, channels: 4, background: { r: 6, g: 17, b: 30, alpha: 1 } } })
  .composite(bufs.map((b, i) => ({ input: b, top: i * (H + 4), left: 0 })))
  .png().toBuffer();
await writeFile("scripts/global-preview.png", out);
console.log("wrote scripts/global-preview.png");
