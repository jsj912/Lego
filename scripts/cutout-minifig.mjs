#!/usr/bin/env node
// One-off: make a transparent cutout of the minifigure photo (white studio
// background → alpha). The original file is left untouched.
// Usage: node scripts/cutout-minifig.mjs "<input.png>" public/minifig.png
import sharp from "sharp";

const [input, output = "public/minifig.png"] = process.argv.slice(2);
if (!input) {
  console.error("usage: node scripts/cutout-minifig.mjs <input> [output]");
  process.exit(1);
}

const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];

// background candidate: pale and unsaturated (white backdrop + soft grey floor shadow)
const isBg = (i) => {
  const [r, g, b] = px(i);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min < 22 && min > 150;
};

// flood fill from every border pixel
const bg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
while (stack.length) {
  const i = stack.pop();
  if (bg[i] || !isBg(i)) continue;
  bg[i] = 1;
  const x = i % W;
  const y = (i / W) | 0;
  if (x > 0) stack.push(i - 1);
  if (x < W - 1) stack.push(i + 1);
  if (y > 0) stack.push(i - W);
  if (y < H - 1) stack.push(i + W);
}

// RGBA out: background → transparent; its darker (shadow) pixels keep a soft dark alpha
const out = Buffer.alloc(W * H * 4);
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let i = 0; i < W * H; i++) {
  const [r, g, b] = px(i);
  let a = 255;
  let [or, og, ob] = [r, g, b];
  if (bg[i]) {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    a = Math.max(0, Math.min(255, Math.round(((246 - lum) / 70) * 180)));
    [or, og, ob] = [40, 36, 34];
  }
  out[i * 4] = or;
  out[i * 4 + 1] = og;
  out[i * 4 + 2] = ob;
  out[i * 4 + 3] = a;
  if (!bg[i]) {
    const x = i % W;
    const y = (i / W) | 0;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
}

// crop to the figure (plus room for the floor shadow) and export
const pad = 12;
const left = Math.max(0, minX - pad);
const top = Math.max(0, minY - pad);
const cw = Math.min(W - left, maxX - minX + pad * 2);
const ch = Math.min(H - top, maxY - minY + pad * 4);
const img = sharp(out, { raw: { width: W, height: H, channels: 4 } }).extract({ left, top, width: cw, height: ch });
await img.clone().resize({ height: 900 }).png({ compressionLevel: 9 }).toFile(output);
await img.clone().resize({ height: 900 }).webp({ quality: 88, alphaQuality: 95 }).toFile(output.replace(/\.png$/, ".webp"));
const meta = await sharp(output).metadata();
console.log(`wrote ${output} (+ .webp) ${meta.width}x${meta.height}, alpha: ${meta.hasAlpha}`);
