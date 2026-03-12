const fs = require('fs');
let html = fs.readFileSync('pdp_full.html', 'utf-8');

// 1. Convert protocol-relative URLs to absolute https
html = html.replace(/href="\/\/2pfr0bh45gq6kyy8/g, 'href="https://2pfr0bh45gq6kyy8');
html = html.replace(/src="\/\/2pfr0bh45gq6kyy8/g, 'src="https://2pfr0bh45gq6kyy8');
html = html.replace(/srcset="\/\/2pfr0bh45gq6kyy8/g, 'srcset="https://2pfr0bh45gq6kyy8');
html = html.replace(/url\('\/\/2pfr0bh45gq6kyy8/g, "url('https://2pfr0bh45gq6kyy8");
html = html.replace(/url\("\/\/2pfr0bh45gq6kyy8/g, 'url("https://2pfr0bh45gq6kyy8');

// Also fix srcset entries that have //2pfr... without quotes at start
html = html.replace(/(,\s*)\/\/2pfr0bh45gq6kyy8/g, '$1https://2pfr0bh45gq6kyy8');

// 2. Fix relative URLs (starting with /) to point to preview domain
const previewDomain = 'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com';
html = html.replace(/href="\//g, `href="${previewDomain}/`);
html = html.replace(/src="\//g, `src="${previewDomain}/`);
html = html.replace(/action="\//g, `action="${previewDomain}/`);

// But don't double-fix already absolute URLs - undo the ones that were already https
html = html.replace(new RegExp(`href="${previewDomain}/https://`, 'g'), 'href="https://');
html = html.replace(new RegExp(`src="${previewDomain}/https://`, 'g'), 'src="https://');
html = html.replace(new RegExp(`href="${previewDomain}/http://`, 'g'), 'href="http://');
html = html.replace(new RegExp(`src="${previewDomain}/http://`, 'g'), 'src="http://');

// Also fix // protocol-relative that we already converted
html = html.replace(new RegExp(`href="${previewDomain}/${previewDomain}`, 'g'), `href="${previewDomain}`);
html = html.replace(new RegExp(`src="${previewDomain}/${previewDomain}`, 'g'), `src="${previewDomain}`);

// 3. Remove Shopify preview bar script
html = html.replace(/<script[^>]*preview-bar[^>]*>[\s\S]*?<\/script>/gi, '');
html = html.replace(/<script[^>]*shopify-preview-bar[^>]*>[\s\S]*?<\/script>/gi, '');

// 4. Add base tag so any remaining relative resources resolve properly
html = html.replace('<head>', `<head>\n<base href="${previewDomain}/">`);

// 5. Write the final file
fs.writeFileSync('pdp_local.html', html, 'utf-8');
console.log('Created pdp_local.html:', html.length, 'chars');
console.log('Done!');
