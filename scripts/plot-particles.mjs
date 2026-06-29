// Replicates CurrentParticles' vertex math in JS to render the formations
// (merged wave / mid / split streams) as a scatter PNG — so we can verify the
// choreography without a GPU. Time=0; subsampled to ~2600 points.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const N = 2600;
const TIME = 0;
const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };

// deterministic-ish samples
const P = [];
for (let i = 0; i < N; i++) {
  const r1 = Math.random();
  P.push({
    aT: Math.random(),
    aBand: (Math.random() * 2 - 1) * Math.sqrt(Math.random()),
    aStream: i % 2 === 0 ? -1 : 1,
    aRand: Math.random(),
  });
}

function pos(p, uSplit) {
  const t = p.aT;
  // merged
  const waveX = (t - 0.5) * 3.0;
  const wave = Math.sin(t * 6.2831 * 1.4 - TIME * 0.45) + 0.4 * Math.sin(t * 6.2831 * 0.6 + TIME * 0.25);
  const mY = wave * 0.16 + p.aBand * 0.16;
  const merged = [waveX, mY];
  // split
  const side = p.aStream;
  const start = [0.0, 0.42];
  const end = [side * 1.85, -0.62];
  let bx = start[0] + (end[0] - start[0]) * t;
  let by = start[1] + (end[1] - start[1]) * t;
  bx += side * 0.35 * Math.sin(t * Math.PI);
  const [dx, dy] = norm(end[0] - start[0], end[1] - start[1]);
  const [px, py] = [-dy, dx];
  bx += px * p.aBand * 0.085;
  by += py * p.aBand * 0.085;
  const split = [bx, by];
  const s = smoothstep(0, 1, clamp(uSplit * 1.15 - p.aRand * 0.15, 0, 1));
  return [merged[0] + (split[0] - merged[0]) * s, merged[1] + (split[1] - merged[1]) * s, s, side];
}

const W = 900, H = 360;
const XMIN = -2.3, XMAX = 2.3, YMIN = -1.0, YMAX = 0.75;
const mapX = (x) => ((x - XMIN) / (XMAX - XMIN)) * W;
const mapY = (y) => H - ((y - YMIN) / (YMAX - YMIN)) * H;

function panel(uSplit, label) {
  let circles = "";
  for (const p of P) {
    const [x, y, , side] = pos(p, uSplit);
    const col = side < 0 ? "#2E97E6" : "#E8C98A";
    circles += `<circle cx="${mapX(x).toFixed(1)}" cy="${mapY(y).toFixed(1)}" r="1.5" fill="${col}" fill-opacity="0.65"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#06111e"/>
    ${circles}
    <text x="16" y="28" fill="#8a98a2" font-family="sans-serif" font-size="16">${label}</text>
  </svg>`;
}

const splits = [
  ["split = 0.0  (unified current wave)", 0],
  ["split = 0.5  (splitting)", 0.5],
  ["split = 1.0  (two streams → corners)", 1.0],
];
const bufs = await Promise.all(splits.map(([label, s]) => sharp(Buffer.from(panel(s, label))).png().toBuffer()));
// stack vertically
const out = await sharp({ create: { width: W, height: H * 3 + 8, channels: 4, background: { r: 6, g: 17, b: 30, alpha: 1 } } })
  .composite(bufs.map((b, i) => ({ input: b, top: i * (H + 4), left: 0 })))
  .png()
  .toBuffer();
await writeFile("scripts/particles-preview.png", out);
console.log("wrote scripts/particles-preview.png");
