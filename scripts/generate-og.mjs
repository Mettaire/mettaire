// Generates a static 1200x630 social share card (public/og-image.jpg) from an
// artwork, with the METTAIRE wordmark baked in. Run: node scripts/generate-og.mjs
// Source image is fetched/placed at /tmp/og-src.webp first (see README/commit).
import sharp from 'sharp';

const W = 1200;
const H = 630;
const SRC = process.env.OG_SRC || '/tmp/og-src.webp';
const OUT = 'public/og-image.jpg';

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#050505" stop-opacity="0.25"/>
      <stop offset="45%" stop-color="#050505" stop-opacity="0"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <text x="64" y="540" font-family="Helvetica, Arial, sans-serif" font-size="96" font-weight="700"
        letter-spacing="8" fill="#ffffff">METTAIRE</text>
  <text x="68" y="586" font-family="monospace" font-size="25" letter-spacing="4"
        fill="#5ce1e6">DANIEL NELSON — ART / SOFTWARE</text>
</svg>
`);

const base = await sharp(SRC)
  .resize(W, H, { fit: 'cover', position: 'attention' })
  .modulate({ brightness: 0.92 })
  .toBuffer();

await sharp(base)
  .composite([{ input: overlay }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
