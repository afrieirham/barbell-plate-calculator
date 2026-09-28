import { deflateSync, inflateSync } from "node:zlib";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "barbell.png");
const OUT_DIR = join(HERE, "..", "public", "icons");

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

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

function decodePng(buf) {
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`Unsupported PNG: bitDepth=${bitDepth} colorType=${colorType}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const idat = [];
  for (let p = 8; p < buf.length; ) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString("ascii", p + 4, p + 8);
    if (type === "IDAT") idat.push(buf.subarray(p + 8, p + 8 + len));
    p += 12 + len;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const row = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? pixels[y * stride + x - channels] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= channels ? prev[x - channels] : 0;
      let value = row[x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) value += paeth(a, b, c);
      pixels[y * stride + x] = value & 255;
    }
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = pixels[i * channels];
    rgba[i * 4 + 1] = pixels[i * channels + 1];
    rgba[i * 4 + 2] = pixels[i * channels + 2];
    rgba[i * 4 + 3] = channels === 4 ? pixels[i * channels + 3] : 255;
  }

  return { width, height, data: rgba };
}

function resize(src, size) {
  const out = Buffer.alloc(size * size * 4);
  const scaleX = src.width / size;
  const scaleY = src.height / size;

  for (let y = 0; y < size; y++) {
    const sy0 = y * scaleY;
    const sy1 = (y + 1) * scaleY;
    const yStart = Math.floor(sy0);
    const yEnd = Math.min(Math.ceil(sy1), src.height);
    for (let x = 0; x < size; x++) {
      const sx0 = x * scaleX;
      const sx1 = (x + 1) * scaleX;
      const xStart = Math.floor(sx0);
      const xEnd = Math.min(Math.ceil(sx1), src.width);

      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let weight = 0;

      for (let sy = yStart; sy < yEnd; sy++) {
        const wy = Math.min(sy + 1, sy1) - Math.max(sy, sy0);
        if (wy <= 0) continue;
        for (let sx = xStart; sx < xEnd; sx++) {
          const wx = Math.min(sx + 1, sx1) - Math.max(sx, sx0);
          if (wx <= 0) continue;
          const w = wx * wy;
          const i = (sy * src.width + sx) * 4;
          r += src.data[i] * w;
          g += src.data[i + 1] * w;
          b += src.data[i + 2] * w;
          a += src.data[i + 3] * w;
          weight += w;
        }
      }

      const o = (y * size + x) * 4;
      out[o] = Math.round(r / weight);
      out[o + 1] = Math.round(g / weight);
      out[o + 2] = Math.round(b / weight);
      out[o + 3] = Math.round(a / weight);
    }
  }

  return out;
}

mkdirSync(OUT_DIR, { recursive: true });

const source = decodePng(readFileSync(SOURCE));
const targets = [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["icon-maskable-192.png", 192],
  ["icon-maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
];

for (const [name, size] of targets) {
  writeFileSync(join(OUT_DIR, name), encodePng(size, size, resize(source, size)));
  console.log(`wrote public/icons/${name}`);
}
