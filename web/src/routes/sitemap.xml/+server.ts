import type { RequestHandler } from './$types';
import { api } from '$lib/api.js';

export const GET: RequestHandler = async () => {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://yourdomain.com';
  let cigarUrls = '';

  try {
    const cigars = await api.getCigars();
    cigarUrls = cigars
      .map(
        (c) =>
          `  <url><loc>${baseUrl}/cigar/${c.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
      )
      .join('\n');
  } catch {
    // If API is down, generate sitemap without cigar pages
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/gallery</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/guestbook</loc><changefreq>daily</changefreq><priority>0.6</priority></url>
  <url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
${cigarUrls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
};
