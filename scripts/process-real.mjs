// Process the real brand assets the client provided.
// Logo: crop to the chrome AC+wave mark (drop the black wordmark, which is
// invisible on navy) and trim transparent padding. Photos: optimize to webp.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "..");        // /Users/officemac/ACM
const UP = path.resolve(process.cwd(), "assets-src/real/upscaled"); // AI-upscaled originals
const BRAND = path.resolve(process.cwd(), "public/brand");
const REAL = path.resolve(process.cwd(), "public/real");
const APP = path.resolve(process.cwd(), "src/app");

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const blur = async (buf) => `data:image/webp;base64,${(await sharp(buf).resize({ width: 24 }).webp({ quality: 40 }).toBuffer()).toString("base64")}`;

// 1) LOGO MARK — extract the AC monogram + wave, trim, save transparent webp.
{
  const logo = path.join(SRC, "TRANSPARENT+FILE-01.webp"); // 1000x667
  // Tight crop on the chrome AC + wave, above the black wordmark (which is
  // invisible on navy). Transparent margins are fine for a logo lockup.
  const mark = await sharp(logo)
    .extract({ left: 296, top: 116, width: 412, height: 286 })
    .toBuffer();
  await writeFile(path.join(BRAND, "logo-mark.webp"), await sharp(mark).resize({ height: 160 }).webp({ quality: 92 }).toBuffer());
  const meta = await sharp(path.join(BRAND, "logo-mark.webp")).metadata();
  console.log(`logo-mark.webp  ${meta.width}x${meta.height}`);

  // Favicon: AC mark centred on the brand navy, rounded, 256px.
  const markPng = await sharp(mark).resize({ height: 168, fit: "inside" }).png().toBuffer();
  const m2 = await sharp(markPng).metadata();
  const pad = 44;
  const bg = Buffer.from(
    `<svg width="256" height="256"><rect width="256" height="256" rx="56" fill="#0B1A2B"/></svg>`
  );
  const icon = await sharp(bg)
    .composite([{ input: markPng, top: Math.round((256 - (m2.height || 168)) / 2), left: Math.round((256 - (m2.width || 168)) / 2) }])
    .png()
    .toBuffer();
  await writeFile(path.join(APP, "icon.png"), icon);
  console.log(`icon.png  256x256  ${kb(icon.length)}`);
}

// 2) PHOTOS — optimize the AI-upscaled originals to webp + blur placeholders.
const photos = [
  { src: "team.png", out: "team-group", width: 2400, q: 82 },
  { src: "bernie.png", out: "bernie", width: 1400, q: 86 },
  { src: "neely.png", out: "neely", width: 1400, q: 86 },
  { src: "ahnaf.png", out: "ahnaf", width: 1400, q: 86 },
];
for (const p of photos) {
  const input = await sharp(path.join(UP, p.src)).rotate().toBuffer();
  const webp = await sharp(input).resize({ width: p.width }).webp({ quality: p.q }).toBuffer();
  await writeFile(path.join(REAL, `${p.out}.webp`), webp);
  const b = await blur(input);
  await writeFile(path.join(REAL, `${p.out}.blur.txt`), b);
  console.log(`${p.out}.webp  ${p.width}w  ${kb(webp.length)}`);
}

console.log("done");
