const fs = require('fs');
let html = fs.readFileSync('pdp_rendered.html', 'utf-8');

const previewDomain = 'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com';

// 1. Convert protocol-relative URLs to absolute https for the preview domain
html = html.replace(/\/\/2pfr0bh45gq6kyy8-1559199790\.shopifypreview\.com/g, previewDomain.replace('https:', ''));
// Actually just make them all absolute
html = html.replace(/"\/\/2pfr0bh45gq6kyy8/g, '"https://2pfr0bh45gq6kyy8');
html = html.replace(/'\/\/2pfr0bh45gq6kyy8/g, "'https://2pfr0bh45gq6kyy8");
html = html.replace(/,\s*\/\/2pfr0bh45gq6kyy8/g, ', https://2pfr0bh45gq6kyy8');

// 2. Add base tag for remaining relative URLs
if (!html.includes('<base ')) {
  html = html.replace('<head>', '<head>\n<base href="' + previewDomain + '/">');
}

// 3. Remove Shoplift preview redirect script
html = html.replace(/<script type="text\/javascript">\(function\(rootPath, template, themeRole, themeId, isThemePreview\)[\s\S]*?<\/script>\s*<!-- End of Shoplift scripts -->/g, '<!-- Shoplift removed -->');

// 4. Disable Shopify preview mode
html = html.replace(/Shopify\.previewMode = true;/g, '// preview disabled');

// 5. Remove preview bar
html = html.replace(/<iframe[^>]*preview-bar[^>]*>[\s\S]*?<\/iframe>/gi, '');
html = html.replace(/<div[^>]*id="[^"]*preview[^"]*bar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

// 6. Remove scripts that do Shopify checkout/cart redirects (they fail on localhost)
// Keep them but wrap in try-catch? No - just remove the ones that cause redirects
// Actually, let's remove the Shopify.routes that would redirect
html = html.replace(/window\.location\.href\s*=\s*['"][^'"]*shopify[^'"]*['"]/gi, '// redirect removed');

fs.writeFileSync('pdp_local.html', html, 'utf-8');
console.log('Created pdp_local.html from rendered DOM:', html.length, 'chars');
