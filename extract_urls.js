const fs = require('fs');
const html = fs.readFileSync('pdp_full.html', 'utf-8');

// Extract all Shopify CDN URLs
const cdnPattern = /https?:\/\/cdn\.shopify\.com[^\s"'<>)]+/g;
const cdnUrls = [...new Set(html.match(cdnPattern) || [])];

// Extract all other external URLs
const urlPattern = /https?:\/\/[^\s"'<>)]+\.(css|js|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp|avif)/gi;
const assetUrls = [...new Set(html.match(urlPattern) || [])];

console.log('=== CDN URLs found:', cdnUrls.length);
console.log('=== Asset URLs found:', assetUrls.length);

// Group by type
const byType = {};
assetUrls.forEach(url => {
  const ext = url.split('?')[0].split('.').pop().toLowerCase();
  byType[ext] = byType[ext] || [];
  byType[ext].push(url);
});

Object.keys(byType).forEach(ext => {
  console.log('\n--- ' + ext.toUpperCase() + ' (' + byType[ext].length + ') ---');
  byType[ext].slice(0, 3).forEach(u => console.log(u.substring(0, 200)));
  if (byType[ext].length > 3) console.log('  ... and ' + (byType[ext].length - 3) + ' more');
});
