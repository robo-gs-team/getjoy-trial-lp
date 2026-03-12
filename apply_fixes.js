const fs = require('fs');
let html = fs.readFileSync('pdp_local.html', 'utf-8');

// ===== FIX 1: Change discount code banner =====
// Replace "Get Free Treats For A Year!" with "50% OFF your first order!"
// Replace "JOYFULYEAR20" with "JOY50"
html = html.replace(/Get Free Treats For A Year!/g, '50% OFF your first order!');
html = html.replace(/JOYFULYEAR20/g, 'JOY50');

// Also update the JSON config if present
html = html.replace(/"promoCode":\s*"JOYFULYEAR20"/g, '"promoCode": "JOY50"');
html = html.replace(/promo_code:\s*JOYFULYEAR20/g, 'promo_code: JOY50');

console.log('Fix 1: Discount banner updated to JOY50');

// ===== FIX 2: Fix size selector - change Chicken/Beef to Trial/Small/Large =====
// The current variant selector shows "Chicken" and "Beef"
// Need to change to "Trial (4oz)" / "Small (16oz)" / "Large (32oz)"

// Find variant/option selectors and replace option text
// Look for variant labels like "Chicken" and "Beef" in select options and radio buttons
html = html.replace(/>Chicken<\/option>/g, '>Trial (4oz)</option>');
html = html.replace(/>Beef<\/option>/g, '>Small (16oz)</option>');

// Also fix swatch/button labels
html = html.replace(/data-value="Chicken"/g, 'data-value="Trial (4oz)"');
html = html.replace(/data-value="Beef"/g, 'data-value="Small (16oz)"');

// Fix variant titles in JSON data
html = html.replace(/"variant":\s*"Beef"/g, '"variant": "Small (16oz)"');
html = html.replace(/"variant":\s*"Chicken"/g, '"variant": "Trial (4oz)"');
html = html.replace(/"variant_title":\s*"Chicken/g, '"variant_title": "Trial (4oz)');
html = html.replace(/"variant_title":\s*"Beef/g, '"variant_title": "Small (16oz)');

// Fix the displayed swatch text - look for the visible text in buttons/labels
// These are typically in span or div elements with the variant name
html = html.replace(/aria-label="Chicken"/g, 'aria-label="Trial (4oz)"');
html = html.replace(/aria-label="Beef"/g, 'aria-label="Small (16oz)"');

// Fix option values in the Instant page builder variant selector
html = html.replace(/"value":"Chicken"/g, '"value":"Trial (4oz)"');
html = html.replace(/"value":"Beef"/g, '"value":"Small (16oz)"');

// Fix visible labels in the variant picker (button text)
// Pattern: >Chicken</span> or >Chicken</button> or >Chicken</label>
html = html.replace(/>Chicken<\/(span|button|label|p|div)/g, '>Trial (4oz)</$1');
html = html.replace(/>Beef<\/(span|button|label|p|div)/g, '>Small (16oz)</$1');

console.log('Fix 2: Size selectors updated');

// ===== FIX 3: Replace carousel images =====
// Target variant page carousel images (from /products/freeze-dried-raw?variant=40926803656750)
const newCarouselImages = [
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/Screenshot_2026-03-02_at_4.51.46_PM.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/GJ_FDR_1lb_Beef_Front_WithProduct.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/Carousel-FFD-Beef-11_3.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/Frame2_1.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/GJ_BragInfographic_V3.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/FFDIngredients-Beef.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/FFDIngredients-Chicken.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/Carousel-FFD-Chicken-7.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/Carousel-FFD-Beef-4_3.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/Carousel-Bundle-B-FDR1lb_8_2.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/Carousel-Bundle-B-FDR1lb_5_1.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/FDRPDP_Carousel_Chicken_Stats.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/Carousel-FFD-Beef-8_2.png',
  'https://2pfr0bh45gq6kyy8-1559199790.shopifypreview.com/cdn/shop/files/FDRPDP_Carousel_Beef_Stats.png',
];

// Current old carousel images to replace
const oldCarouselImages = [
  'Carousel-FFD-Beef-16.png',
  'Get_Joy_FFD_Chicken-Back_Web.jpg',
  'ChickenFFDBowl1.png',
  'FFDLifestyle1-c_d0f065be-c38f-4adc-a94c-03c67d6085dc.jpg',
  'Get_Joy_FFD_Beef-Back_Web.jpg',
  'BeefFFDBowl2.png',
  'HANK_AND_ALEXANDRA_CFFD-C.jpg',
  'Carousel-FFD-Beef-15_1.png',
];

// Replace old images with new ones in order
for (let i = 0; i < oldCarouselImages.length && i < newCarouselImages.length; i++) {
  const oldFile = oldCarouselImages[i];
  const newUrl = newCarouselImages[i];
  const newFile = newUrl.split('/').pop();
  
  // Replace all occurrences of the old filename
  const re = new RegExp(oldFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const count = (html.match(re) || []).length;
  if (count > 0) {
    html = html.replace(re, newFile);
    console.log(`  Replaced ${oldFile} -> ${newFile} (${count} occurrences)`);
  }
}

// Also, the first image (hero/main) - replace Screenshot reference with the new hero
// The main product image is Screenshot_2026-03-02_at_4.51.46_PM
// This one stays as it's already the correct image on the target page

console.log('Fix 3: Carousel images updated');
console.log('');

fs.writeFileSync('pdp_local.html', html, 'utf-8');
console.log('All fixes applied! File size:', html.length, 'chars');
