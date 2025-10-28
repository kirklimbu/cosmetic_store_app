import { Request, Response } from 'express';

export function sitemapHandler(req: Request, res: Response) {
  const baseUrl = 'https://shreeshyamsuppliers.com.np'; // change this to your domain

  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/products`,
    `${baseUrl}/categories`,
    `${baseUrl}/home`,
    `${baseUrl}/home/product-detail`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`
      )
      .join('')}
  </urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
}
