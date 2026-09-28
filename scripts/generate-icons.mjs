import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
const SS = 4;

const COLOR = {
  background: [79, 70, 229],
  bar: [241, 245, 249],
  plates: [
    [220, 38, 38],
    [37, 99, 235],
    [250, 204, 21],
  ],
};

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const src = y * width * 4;
    const dst = y * (width * 4 + 1);
    raw[dst] = 0;
    rgba.copy(raw, dst + 1, src, src + width * 4);
  }
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function roundedRectSdf(px, py, cx, cy, halfW, halfH, radius) {
  const dx = Math.abs(px - cx) - (halfW - radius);
  const dy = Math.abs(py - cy) - (halfH - radius);
  const ax = Math.max(dx, 0);
  const ay = Math.max(dy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(dx, dy), 0) - radius;
}

function coverage(sdf) {
  return Math.min(Math.max(0.5 - sdf, 0), 1);
}

function blend(buffer, index, color, alpha) {
  if (alpha <= 0) return;
  const a = Math.min(alpha, 1);
  for (let c = 0; c < 3; c++) {
    buffer[index + c] = Math.round(buffer[index + c] * (1 - a) + color[c] * a);
  }
  buffer[index + 3] = Math.round(buffer[index + 3] * (1 - a) + 255 * a);
}

function paint(buffer, size, sdf, color) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const a = coverage(sdf(x + 0.5, y + 0.5));
      if (a > 0) blend(buffer, (y * size + x) * 4, color, a);
    }
  }
}

function renderIcon(size, { maskable }) {
  const big = size * SS;
  const buffer = Buffer.alloc(big * big * 4);
  const s = big;
  const round = maskable ? 0 : 0.225 * s;

  paint(
    buffer,
    big,
    (x, y) => roundedRectSdf(x, y, s / 2, s / 2, s / 2, s / 2, round),
    COLOR.background,
  );

  const spread = maskable ? 0.35 : 0.42;
  const barHalf = spread * s;
  const barThick = 0.032 * s;
  paint(
    buffer,
    big,
    (x, y) => roundedRectSdf(x, y, s / 2, s / 2, barHalf, barThick, barThick),
    COLOR.bar,
  );

  const plateWidth = 0.052 * s;
  const radius = 0.016 * s;
  const inner = spread - 0.1 * s;
  const step = plateWidth * 1.8;
  const heights = [0.31, 0.24, 0.17];

  for (let side = 0; side < 2; side++) {
    const dir = side === 0 ? -1 : 1;
    for (let i = 0; i < heights.length; i++) {
      const cx = s / 2 + dir * (inner - i * step);
      const halfH = heights[i] * s;
      const color = COLOR.plates[i];
      paint(
        buffer,
        big,
        (x, y) => roundedRectSdf(x, y, cx, s / 2, plateWidth, halfH, radius),
        color,
      );
    }
  }

  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const idx = ((y * SS + sy) * big + (x * SS + sx)) * 4;
          r += buffer[idx];
          g += buffer[idx + 1];
          b += buffer[idx + 2];
          a += buffer[idx + 3];
        }
      }
      const n = SS * SS;
      const idx = (y * size + x) * 4;
      out[idx] = Math.round(r / n);
      out[idx + 1] = Math.round(g / n);
      out[idx + 2] = Math.round(b / n);
      out[idx + 3] = Math.round(a / n);
    }
  }

  return encodePng(size, size, out);
}

mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["icon-maskable-192.png", 192, true],
  ["icon-maskable-512.png", 512, true],
  ["apple-touch-icon.png", 180, false],
];

for (const [name, size, maskable] of targets) {
  writeFileSync(join(OUT_DIR, name), renderIcon(size, { maskable }));
  console.log(`wrote public/icons/${name}`);
}
