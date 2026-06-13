import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "icons");

const INK = "#2b2620";
const GOLD = "#a87e35";
const PAPER = "#f7f3e8";

/**
 * @param {number} size - output canvas size in px
 * @param {number} scale - portion of canvas the 64-unit mark occupies (1 = full bleed)
 */
function markSvg(size, scale) {
  const s = (size * scale) / 64;
  const offset = (size - 64 * s) / 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${PAPER}"/>
  <g transform="translate(${offset} ${offset}) scale(${s})">
    <path d="M8 42a24 24 0 0 1 48 0" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M15.5 42a16.5 16.5 0 0 1 33 0" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M23 42a9 9 0 0 1 18 0" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>
    <circle cx="32" cy="42" r="3.25" fill="${GOLD}"/>
    <path d="M7 50h50" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M10 56h44" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>
  </g>
</svg>`);
}

await mkdir(outDir, { recursive: true });

const jobs = [
  { file: path.join(outDir, "icon-192.png"), size: 192, scale: 0.84 },
  { file: path.join(outDir, "icon-512.png"), size: 512, scale: 0.84 },
  { file: path.join(outDir, "maskable-512.png"), size: 512, scale: 0.62 },
  { file: path.join(root, "src", "app", "apple-icon.png"), size: 180, scale: 0.78 }
];

for (const job of jobs) {
  const png = await sharp(markSvg(job.size, job.scale)).png().toBuffer();
  await writeFile(job.file, png);
  console.log(`wrote ${path.relative(root, job.file)} (${png.length} bytes)`);
}
