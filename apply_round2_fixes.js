const fs = require('fs');
let html = fs.readFileSync('pdp_local.html', 'utf-8');

// ============================================================
// CSS OVERRIDES for fixes 1-4 and 6
// ============================================================
const cssOverrides = `
<style>
/* === FIX 1: Recommended badge — new line, top-right above 90-Day Starter Plan === */
.iMKkv9k20DWfhqh2e {
  position: relative !important;
}
.iuhGnXIL1UJ6I9mhP {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
}
.ilIn7FbR7R1Fh9Hmi {
  position: absolute !important;
  top: 8px !important;
  right: 8px !important;
  margin: 0 !important;
}
.ilUd5qd33hluxsCkB p {
  background: #2d6b4f !important;
  color: #fff !important;
  padding: 3px 12px !important;
  border-radius: 20px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  white-space: nowrap !important;
}

/* === FIX 2: Sticky ATC bar — button under price === */
.ipGw2HmoVIFbFt2Xm {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 8px !important;
  width: 100% !important;
}
.iKbdQxapI0TqRyg2f {
  width: 100% !important;
  text-align: center !important;
}

/* === FIX 3: Green section (Dog Food for Sensitive Stomachs) — proper margins === */
.iibnvUCPjK9rSFgZx {
  padding: 40px 24px !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;
}
.iibnvUCPjK9rSFgZx > * {
  max-width: 1200px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

/* === FIX 4: Align 3 guarantee bullet points === */
.i9quKPDktjfMl8lRR {
  display: flex !important;
  flex-direction: row !important;
  justify-content: center !important;
  align-items: flex-start !important;
  gap: 24px !important;
  flex-wrap: wrap !important;
}
.inc1DeHwH5qw6YHbh,
.i6ItWYTLyWB0ViLEr,
.iKakYmpDnoJC4Pd2K {
  flex: 1 1 0 !important;
  min-width: 200px !important;
  max-width: 300px !important;
  text-align: center !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

/* === FIX 6: SHOP NOW buttons — stay on 1 line === */
.iGJ89jl5WAdvXPVmC p,
.iz0reb9BsFSkCKZdh p,
.idAmPCLsj2ikpywf3 p {
  white-space: nowrap !important;
  display: inline-block !important;
}
</style>
`;

// Inject CSS before </head>
html = html.replace('</head>', cssOverrides + '</head>');
console.log('CSS overrides injected');

// ============================================================
// FIX 5: Replace Lorem ipsum with real FAQ copy
// ============================================================
const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.';

// FAQ answers mapped by their unique class names
const faqAnswers = {
  // Belly Biotics section - Probiotics accordion
  'iNID1owZx8WiikImk': 'Live beneficial bacteria that help crowd out harmful microbes, support nutrient absorption, and promote a balanced gut microbiome for better digestion and overall wellness.',
  // Belly Biotics section - Postbiotics accordion
  'iv6Dg4Fz2GEM2rp0u': 'Beneficial compounds produced during the fermentation process that help strengthen the gut lining, reduce inflammation, and support immune function — even after the bacteria are no longer alive.',
  // Main FAQ - "Will it help with diarrhea or soft stools?"
  'iB8VQtUBx2WPJvSnm': 'Yes! Our freeze-dried raw food is packed with high-quality protein and our proprietary Belly Biotics blend of pre-, pro-, and postbiotics. Many pet parents report firmer, healthier stools within the first few days. The natural, minimally processed ingredients are gentle on sensitive stomachs and support optimal digestion.',
  // Main FAQ - "Is raw freeze-dried food safe for my dog?"
  'idxjdLf24eEwChcrP': 'Absolutely. Our freeze-dried raw recipes are crafted with human-grade ingredients and manufactured in USDA-inspected facilities. The freeze-drying process preserves nutrients while eliminating moisture that bacteria need to thrive. Every batch is tested for safety and quality so you can feel confident about what you\'re feeding your pup.',
  // Main FAQ - "How does the subscription work?"
  'imOxvKbfv1fBV8E2c': 'Choose your plan and we\'ll deliver fresh freeze-dried raw food right to your door on a schedule that works for you. You get 20% off your first box, then 10% off boxes 2 and 3 — plus free treats and access to 24/7 televet support. You can pause, skip, or cancel anytime with no hidden fees.',
  // Main FAQ - "What happens after box 3?"
  'i0kOXCbcs81RarAb0': 'After your 90-Day Starter Plan, you\'ll automatically continue receiving deliveries at our loyal member price with 5% off every order. You\'ll keep your 24/7 televet access and can still pause, skip, or cancel anytime. No commitments, no hassle — just happy, healthy pups.',
};

let replacedCount = 0;
for (const [className, answer] of Object.entries(faqAnswers)) {
  const searchStr = `class="instant-rich-text ${className}"><p>${loremText}</p>`;
  const replaceStr = `class="instant-rich-text ${className}"><p>${answer}</p>`;
  if (html.includes(searchStr)) {
    html = html.replace(searchStr, replaceStr);
    replacedCount++;
    console.log(`FAQ replaced: ${className}`);
  } else {
    console.log(`FAQ NOT FOUND: ${className}`);
  }
}
console.log(`Total FAQ replacements: ${replacedCount}/6`);

// ============================================================
// Save
// ============================================================
fs.writeFileSync('pdp_local.html', html, 'utf-8');
console.log('\nAll Round 2 fixes applied! File size:', html.length, 'chars');
