const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const siteUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
    const posts = await Post.find({ status: 'published' }).select('slug updatedAt publishedAt');
    const categories = await Category.find().select('slug updatedAt');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    xml += `  <url>\n    <loc>${siteUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${siteUrl}/blogs</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    // Category pages
    categories.forEach((cat) => {
      xml += `  <url>\n    <loc>${siteUrl}/category/${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Post pages
    posts.forEach((post) => {
      const date = (post.updatedAt || post.publishedAt || new Date()).toISOString();
      xml += `  <url>\n    <loc>${siteUrl}/blog/${post.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  const siteUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
  const content = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/*\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain');
  res.send(content);
});

module.exports = router;

