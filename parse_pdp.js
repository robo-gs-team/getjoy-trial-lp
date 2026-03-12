const fs = require('fs');
const html = fs.readFileSync('pdp_full.html', 'utf-8');

// Extract <head> section
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const head = headMatch ? headMatch[1] : '';

// Extract all stylesheet links
const cssLinks = [];
const linkRe = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
let m;
while ((m = linkRe.exec(head)) !== null) {
  cssLinks.push(m[0]);
}

// Extract all preload/preconnect links
const preloads = [];
const preloadRe = /<link[^>]*rel=["'](preload|preconnect)["'][^>]*>/gi;
while ((m = preloadRe.exec(head)) !== null) {
  preloads.push(m[0]);
}

// Extract inline styles from head
const styleBlocks = [];
const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
while ((m = styleRe.exec(head)) !== null) {
  styleBlocks.push(m[0]);
}

console.log('Stylesheet links:', cssLinks.length);
console.log('Preload links:', preloads.length);
console.log('Inline style blocks in head:', styleBlocks.length);

// Print stylesheet links
console.log('\n=== STYLESHEET LINKS ===');
cssLinks.forEach(l => console.log(l.substring(0, 300)));

console.log('\n=== PRELOAD LINKS ===');
preloads.forEach(l => console.log(l.substring(0, 300)));

// Find the main body content boundaries
const bodyStart = html.indexOf('<body');
const bodyEnd = html.lastIndexOf('</body>');
console.log('\nBody start position:', bodyStart);
console.log('Body end position:', bodyEnd);
console.log('Body size:', bodyEnd - bodyStart, 'chars');

