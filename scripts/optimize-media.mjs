// Optimize generated source PNGs → web-ready webp variants.
// Hero poster is tuned to land < 100 KB so it can serve as the LCP element.
import sharp from "sharp";
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "assets-src");
const OUT = path.resolve(process.cwd(), "public");

/** name (no ext) → { dir, widths, quality, poster? } */
// Full-bleed page heroes / Fork plates need 2.4–2.6k so they stay crisp on
// large + retina screens (next/image still serves small variants to phones via
// sizes). The homepage hero keeps a small poster for its LCP (WebGL covers it).
const JOBS = {
  "hero-cool": { dir: "brand", widths: [2560], quality: 82, poster: { w: 1600, q: 64 }, blur: true },
  "current-cool": { dir: "brand", widths: [2560], quality: 80, poster: { w: 1600, q: 62 }, blur: true },
  "current-warm": { dir: "brand", widths: [2400], quality: 80, blur: true },
  "current-fork": { dir: "brand", widths: [2400], quality: 78, poster: { w: 1600, q: 62 }, blur: true },
  "halifax-street": { dir: "media", widths: [1680], quality: 72, blur: true },
  "halifax-harbour": { dir: "media", widths: [2560], quality: 78, blur: true },
  "office-interior": { dir: "media", widths: [2000], quality: 78, blur: true },
};

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function run() {
  for (const [name, cfg] of Object.entries(JOBS)) {
    const src = path.join(SRC, cfg.dir, `${name}.png`);
    try {
      await stat(src);
    } catch {
      continue; // source not present yet
    }
    const input = await readFile(src);
    for (const w of cfg.widths) {
      const out = path.join(OUT, cfg.dir, `${name}.webp`);
      const buf = await sharp(input).resize({ width: w }).webp({ quality: cfg.quality }).toBuffer();
      await writeFile(out, buf);
      console.log(`${name}.webp  ${w}w  ${kb(buf.length)}`);
    }
    if (cfg.poster) {
      const out = path.join(OUT, cfg.dir, `${name}-poster.webp`);
      const buf = await sharp(input).resize({ width: cfg.poster.w }).webp({ quality: cfg.poster.q }).toBuffer();
      await writeFile(out, buf);
      console.log(`${name}-poster.webp  ${cfg.poster.w}w  ${kb(buf.length)}${buf.length < 100 * 1024 ? "  ✓ <100KB" : "  ⚠ over budget"}`);
    }
    if (cfg.blur) {
      const tiny = await sharp(input).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
      const dataURL = `data:image/webp;base64,${tiny.toString("base64")}`;
      const out = path.join(OUT, cfg.dir, `${name}.blur.txt`);
      await writeFile(out, dataURL);
      console.log(`${name}.blur.txt  ${kb(tiny.length)}`);
    }
  }
}

run().then(() => console.log("done"));
