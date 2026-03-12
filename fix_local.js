const fs = require('fs');
let html = fs.readFileSync('pdp_local.html', 'utf-8');

// Remove the Shoplift preview script that causes redirect (line 860 area)
html = html.replace(/<script type="text\/javascript">\(function\(rootPath, template, themeRole, themeId, isThemePreview\)[\s\S]*?<\/script>\s*<!-- End of Shoplift scripts -->/g, '<!-- Shoplift preview removed -->');

// Remove Shopify preview mode script
html = html.replace(/Shopify\.previewMode = true;/g, '// preview mode disabled');

// Remove any remaining preview bar iframes
html = html.replace(/<script[^>]*preview-bar[^>]*>[\s\S]*?<\/script>/gi, '');

// Fix the srcset values that have protocol-relative URLs  
// Pattern: ,//2pfr... in srcset attributes
html = html.replace(/(srcset="[^"]*?)\/\/2pfr0bh45gq6kyy8/g, '$1https://2pfr0bh45gq6kyy8');

// Fix any remaining protocol-relative URLs in srcset (after commas)
html = html.replace(/, \/\/2pfr0bh45gq6kyy8/g, ', https://2pfr0bh45gq6kyy8');
html = html.replace(/,\/\/2pfr0bh45gq6kyy8/g, ',https://2pfr0bh45gq6kyy8');

fs.writeFileSync('pdp_local.html', html, 'utf-8');
console.log('Fixed pdp_local.html:', html.length, 'chars');
