const fs = require('fs');
const html = fs.readFileSync('pdp_full.html', 'utf-8');

// Extract head section
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const head = headMatch ? headMatch[1] : '';

// Extract body
const bodyStart = html.indexOf('<body');
const bodyEnd = html.lastIndexOf('</body>') + '</body>'.length;
const body = html.substring(bodyStart, bodyEnd);

// Write head and body separately for inspection
fs.writeFileSync('pdp_head.html', head, 'utf-8');
fs.writeFileSync('pdp_body.html', body, 'utf-8');

console.log('Head size:', head.length);
console.log('Body size:', body.length);

// Now find major sections in the body
const sectionMarkers = [
  'announcement-bar',
  'header',
  'main-product',
  'product-recommendations',
  'footer',
  'instant-page-builder',
  'instant-section',
  'data-section-type',
  'section-template',
];

sectionMarkers.forEach(marker => {
  const count = (body.match(new RegExp(marker, 'gi')) || []).length;
  if (count > 0) console.log(`"${marker}" found ${count} times`);
});

// Find all section ids
const sectionIds = [];
const sectionRe = /id="(shopify-section-[^"]+)"/g;
let match;
while ((match = sectionRe.exec(body)) !== null) {
  sectionIds.push(match[1]);
}
console.log('\nShopify sections found:', sectionIds.length);
sectionIds.forEach(id => console.log(' -', id));

