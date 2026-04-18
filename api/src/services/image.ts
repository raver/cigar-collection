import sharp from 'sharp';
import { uploadOriginal, uploadWatermarked } from './storage.js';

interface ProcessResult {
  originalPath: string;
  watermarkedPath: string;
}

export async function processAndUpload(file: File, slug: string): Promise<ProcessResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${slug}.jpg`;

  // Upload original
  const originalPath = await uploadOriginal(filename, buffer);

  // Create watermarked version
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width || 800;
  const height = metadata.height || 800;

  const watermarkText = '烟标记忆';
  const svgWatermark = createTiledWatermarkSVG(width, height, watermarkText);

  const watermarkedBuffer = await sharp(buffer)
    .composite([{
      input: Buffer.from(svgWatermark),
      top: 0,
      left: 0,
      blend: 'over',
    }])
    .jpeg({ quality: 90 })
    .toBuffer();

  const watermarkedPath = await uploadWatermarked(filename, watermarkedBuffer);

  return { originalPath, watermarkedPath };
}

function createTiledWatermarkSVG(width: number, height: number, text: string): string {
  const tileSize = 200;
  const cols = Math.ceil(width / tileSize) + 2;
  const rows = Math.ceil(height / tileSize) + 2;

  let textElements = '';
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const x = c * tileSize + (r % 2 === 0 ? 0 : tileSize / 2);
      const y = r * tileSize;
      textElements += `<text x="${x}" y="${y}" fill="white" fill-opacity="0.15" font-size="16" font-family="sans-serif" transform="rotate(30 ${x} ${y})" text-anchor="middle">${text}</text>`;
    }
  }

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${textElements}</svg>`;
}
