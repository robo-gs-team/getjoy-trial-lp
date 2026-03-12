const fs = require('fs');
let html = fs.readFileSync('pdp_local.html', 'utf-8');

// Find the custom style block
const marker = '/* === FIX 1:';
const styleStart = html.indexOf(marker);
const blockStart = html.lastIndexOf('<style>', styleStart);
const blockEnd = html.indexOf('</style>', styleStart) + 8;
const oldBlock = html.substring(blockStart, blockEnd);

const newBlock = `<style>
/* ============================================================
   RESPONSIVE CSS OVERRIDES — GetJoy PDP Local Clone
   Desktop: >800px  |  Mobile: <=800px
   ============================================================ */

/* === FIX 1: Recommended badge — top-right of plan card === */

/* The card container needs relative positioning for the badge */
.iPgdKH8qTfJ3AnLmm {
  position: relative !important;
}

/* Break the positioned ancestor chain so badge anchors to the card */
.iuhGnXIL1UJ6I9mhP {
  position: static !important;
}
.iMKkv9k20DWfhqh2e {
  position: static !important;
}

/* Badge: absolutely positioned top-right of card */
.ilIn7FbR7R1Fh9Hmi {
  position: absolute !important;
  top: 6px !important;
  right: 12px !important;
  left: auto !important;
  bottom: auto !important;
  margin: 0 !important;
  z-index: 2 !important;
}
.ilUd5qd33hluxsCkB p {
  background: #2d6b4f !important;
  color: #fff !important;
  padding: 4px 14px !important;
  border-radius: 20px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  white-space: nowrap !important;
  line-height: 1.4 !important;
}

/* Desktop: add padding-top to card for badge room */
@media (min-width: 801px) {
  .iPgdKH8qTfJ3AnLmm {
    padding-top: 30px !important;
  }
}

/* Mobile: smaller padding-top */
@media (max-width: 800px) {
  .iPgdKH8qTfJ3AnLmm {
    padding-top: 28px !important;
  }
  .ilIn7FbR7R1Fh9Hmi {
    top: 4px !important;
    right: 8px !important;
  }
  .ilUd5qd33hluxsCkB p {
    font-size: 10px !important;
    padding: 3px 10px !important;
  }
}


/* === FIX 2: Sticky ATC bar — responsive layout === */

/* Shared: ensure height isn't constrained */
.iRNCJSBBGhFO272Xd {
  height: auto !important;
  max-height: none !important;
  padding: 12px 20px !important;
}

/* Desktop (>800px): horizontal row — info left, ATC right */
@media (min-width: 801px) {
  .iRNCJSBBGhFO272Xd {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 16px !important;
  }
  .im3krBNb1Cxdb5YoR {
    flex: 0 1 auto !important;
  }
  .ip9BDEgaoFYAR1pHT {
    flex: 0 0 auto !important;
    min-width: 280px !important;
  }
}

/* Mobile (<=800px): stacked column — info on top, ATC below */
@media (max-width: 800px) {
  .iRNCJSBBGhFO272Xd {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 8px !important;
  }
  .im3krBNb1Cxdb5YoR {
    width: 100% !important;
    justify-content: center !important;
  }
  .ip9BDEgaoFYAR1pHT {
    width: 100% !important;
    align-items: center !important;
  }
}

/* ATC button area always stacks vertically */
.ipGw2HmoVIFbFt2Xm {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 6px !important;
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

@media (min-width: 801px) {
  .iibnvUCPjK9rSFgZx > * {
    max-width: 1200px !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
}

@media (max-width: 800px) {
  .iibnvUCPjK9rSFgZx {
    padding: 24px 16px !important;
  }
}


/* === FIX 4: Align 3 guarantee bullet points === */

/* Desktop: horizontal row */
@media (min-width: 801px) {
  .i9quKPDktjfMl8lRR {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
    align-items: flex-start !important;
    gap: 24px !important;
    flex-wrap: nowrap !important;
  }
  .inc1DeHwH5qw6YHbh,
  .i6ItWYTLyWB0ViLEr,
  .iKakYmpDnoJC4Pd2K {
    flex: 1 1 0 !important;
    min-width: 180px !important;
    max-width: 320px !important;
    text-align: center !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }
}

/* Mobile: horizontal row, wrapped */
@media (max-width: 800px) {
  .i9quKPDktjfMl8lRR {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
    align-items: flex-start !important;
    gap: 12px !important;
    flex-wrap: wrap !important;
  }
  .inc1DeHwH5qw6YHbh,
  .i6ItWYTLyWB0ViLEr,
  .iKakYmpDnoJC4Pd2K {
    flex: 1 1 calc(33% - 12px) !important;
    min-width: 100px !important;
    text-align: center !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }
}


/* === FIX 6: SHOP NOW buttons — stay on 1 line (all viewports) === */
.iGJ89jl5WAdvXPVmC p,
.iz0reb9BsFSkCKZdh p,
.idAmPCLsj2ikpywf3 p {
  white-space: nowrap !important;
  display: inline-block !important;
}
</style>`;

html = html.replace(oldBlock, newBlock);
fs.writeFileSync('pdp_local.html', html, 'utf-8');
console.log('Responsive CSS overhaul applied.');
console.log('Old block size:', oldBlock.length, '-> New block size:', newBlock.length);
console.log('File size:', html.length);
