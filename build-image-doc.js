const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

// ─── Colour palette ───────────────────────────────────────────────
const FOREST   = "005005";
const GREEN    = "00CC3B";
const CREAM_BG = "FCF6E8";
const PALE_GRN = "E8F8EC";
const BEFORE_BG = "FFF3E0";  // warm amber tint for BEFORE
const AFTER_BG  = "E8F5E9";  // soft green tint for AFTER
const LIGHT_GREY = "F5F5F5";
const MID_GREY   = "CCCCCC";
const DARK_TEXT  = "1A1A1A";

// ─── Page geometry (US Letter, 1" margins) ────────────────────────
const PAGE_W   = 12240;
const PAGE_H   = 15840;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9360

// ─── Helper: thin border set ──────────────────────────────────────
function borders(color = MID_GREY, size = 4) {
  const b = { style: BorderStyle.SINGLE, size, color };
  return { top: b, bottom: b, left: b, right: b };
}

function noBorders() {
  const nb = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: nb, bottom: nb, left: nb, right: nb };
}

// ─── Helper: left accent border (paragraph) ───────────────────────
function accentBorder(color = FOREST) {
  return {
    left: { style: BorderStyle.SINGLE, size: 18, color, space: 8 }
  };
}

// ─── Helper: horizontal rule paragraph ───────────────────────────
function hr(color = MID_GREY) {
  return new Paragraph({
    paragraph: { spacing: { before: 0, after: 0 } },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color } }
  });
}

// ─── Helper: spacing paragraph ───────────────────────────────────
function spacer(pts = 6) {
  return new Paragraph({ spacing: { before: 0, after: pts * 20 } });
}

// ─── Helper: field row (Label + value) ────────────────────────────
function fieldPara(label, value, opts = {}) {
  const runs = [
    new TextRun({ text: label + "  ", bold: true, color: FOREST, size: 20, font: "Arial" }),
    new TextRun({ text: value || "—", color: opts.italic ? "555555" : DARK_TEXT, italics: !!opts.italic, size: 20, font: "Arial" })
  ];
  return new Paragraph({
    children: runs,
    spacing: { before: 40, after: 40 },
    indent: { left: 200 }
  });
}

// ─── Helper: badge label (BEFORE / AFTER) ─────────────────────────
function badgePara(label, bgHex) {
  return new Paragraph({
    children: [
      new TextRun({
        text: `  ${label}  `,
        bold: true,
        color: "FFFFFF",
        size: 18,
        font: "Arial",
        highlight: "none"
      })
    ],
    shading: { fill: bgHex, type: ShadingType.CLEAR },
    spacing: { before: 60, after: 20 },
    indent: { left: 200 }
  });
}

// ─── Image card builder ───────────────────────────────────────────
function imageCard(num, data, isBefore, isAfter) {
  const cardBg   = isBefore ? BEFORE_BG : isAfter ? AFTER_BG : "FFFFFF";
  const labelTag = isBefore ? "BEFORE" : isAfter ? "AFTER" : null;
  const labelBg  = isBefore ? "E65100" : "1B5E20";

  const headerText = `Image ${num}${labelTag ? "  ·  " + labelTag : ""}`;

  const rows = [];

  // Header row
  rows.push(new TableRow({
    children: [new TableCell({
      columnSpan: 1,
      width: { size: CONTENT_W - 40, type: WidthType.DXA },
      borders: noBorders(),
      shading: { fill: FOREST, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: [new Paragraph({
        children: [
          new TextRun({ text: headerText, bold: true, color: "FFFFFF", size: 22, font: "Arial" })
        ]
      })]
    })]
  }));

  // Placeholder row
  rows.push(new TableRow({
    children: [new TableCell({
      width: { size: CONTENT_W - 40, type: WidthType.DXA },
      borders: noBorders(),
      shading: { fill: cardBg, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 200, right: 200 },
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "Placeholder  ", bold: true, color: FOREST, size: 20, font: "Arial" }),
            new TextRun({ text: data.placeholder, color: DARK_TEXT, size: 20, font: "Arial", italics: true })
          ],
          spacing: { before: 40, after: 40 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Context/Mood  ", bold: true, color: FOREST, size: 20, font: "Arial" }),
            new TextRun({ text: data.mood, color: "444444", size: 20, font: "Arial" })
          ],
          spacing: { before: 40, after: 40 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Caption  ", bold: true, color: FOREST, size: 20, font: "Arial" }),
            new TextRun({ text: data.caption, color: data.caption === "(none)" ? "888888" : DARK_TEXT, size: 20, font: "Arial", italics: data.caption !== "(none)" })
          ],
          spacing: { before: 40, after: 40 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Placement  ", bold: true, color: FOREST, size: 20, font: "Arial" }),
            new TextRun({ text: data.placement, color: DARK_TEXT, size: 20, font: "Arial" })
          ],
          spacing: { before: 40, after: 40 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Type  ", bold: true, color: FOREST, size: 20, font: "Arial" }),
            new TextRun({ text: data.type, color: DARK_TEXT, size: 20, font: "Arial" })
          ],
          spacing: { before: 40, after: 60 }
        }),
      ]
    })]
  }));

  return new Table({
    width: { size: CONTENT_W - 40, type: WidthType.DXA },
    columnWidths: [CONTENT_W - 40],
    borders: borders(isBefore ? "E65100" : isAfter ? "1B5E20" : MID_GREY, isBefore || isAfter ? 8 : 4),
    rows
  });
}

// ─── Section heading builder ──────────────────────────────────────
function sectionH1(text) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text, color: "FFFFFF", bold: true, size: 36, font: "Arial" })],
      shading: { fill: FOREST, type: ShadingType.CLEAR },
      spacing: { before: 400, after: 200 },
      indent: { left: 200 }
    })
  ];
}

function lpH2(title, filename, total) {
  return [
    spacer(12),
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: title, color: FOREST, bold: true, size: 28, font: "Arial" })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GREEN } },
      spacing: { before: 300, after: 60 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "File: ", bold: true, size: 18, color: "666666", font: "Arial" }),
        new TextRun({ text: filename, size: 18, color: "666666", font: "Arial", italics: true }),
        new TextRun({ text: "   |   ", size: 18, color: MID_GREY, font: "Arial" }),
        new TextRun({ text: `${total} images`, bold: true, size: 18, color: FOREST, font: "Arial" })
      ],
      spacing: { before: 0, after: 200 }
    })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const ADV1 = {
  title: 'ADV1 — "It Took Me 4 Years"',
  file: "Advertorials/ADV1 (It Took Me 4 Years).html",
  images: [
    { placeholder: "Koda on a walk, slightly low energy, not engaged.",
      mood: 'Opening hero image — establish the "before" energy before the story begins. Dog looks fine but flat. Not suffering, just muted.',
      caption: '"I told myself this was just him getting older."',
      placement: "Hero / opening section",
      type: "Original shoot or UGC — real dog preferred" },
    { placeholder: "Visual of whole raw ingredients (meat, vegetables) next to a bowl of processed kibble.",
      mood: "Simple, clean. No text overlay — contrast does the work. Side-by-side composition. Neutral surface, natural light.",
      caption: '"Same ingredients on the label. Very different story in the gut."',
      placement: "Education section — kibble vs. real food contrast",
      type: "Product / flat lay shoot" },
    { placeholder: "Get Joy bag arriving — unboxing, natural home setting.",
      mood: "Relatable moment of opening a package. Kitchen counter or entryway. Warm, honest, not overly styled.",
      caption: '"The sample bag was $4.95. I figured worst case, I\'d wasted $4.95."',
      placement: "Trial / transition moment",
      type: "Product lifestyle — unboxing" },
    { placeholder: "Koda — coat dull, posture low, not engaged.",
      mood: "Same setting/angle as Image 5 AFTER if possible. Coat visibly flat. Energy settled. Not distressed — just ordinary.",
      caption: "(none — before/after pair, caption on AFTER)",
      placement: "Before/after section",
      type: "Original shoot — must pair with Image 5",
      isBefore: true },
    { placeholder: "Koda — coat visibly different, alert ears, engaged eyes, upright posture.",
      mood: "Same setting/angle as Image 4 BEFORE. Clear visual contrast — coat sheen, posture, eye brightness. Not over-staged.",
      caption: '"Month 2 on Get Joy. My sister asked if I\'d taken him to a groomer."',
      placement: "Before/after section",
      type: "Original shoot — must pair with Image 4",
      isAfter: true },
    { placeholder: "Get Joy product — freeze-dried bag, clean brand photography.",
      mood: "Multiple flavor options visible. Premium feel. Clean background. This is the product moment.",
      caption: "(none)",
      placement: "Product CTA section",
      type: "Product photography — brand asset" },
    { placeholder: "Grid of UGC — real dogs, real owners, diverse breeds.",
      mood: "Mosaic / grid layout. Mix of breeds and sizes. Before/after coat photos if available. Lifestyle shots of happy dogs eating Get Joy. Authentic, not polished.",
      caption: "(none — social proof grid)",
      placement: "Social proof / testimonials section",
      type: "UGC — needs real customer submissions" },
    { placeholder: "Koda eating from his bowl — Get Joy bag visible in background.",
      mood: "Closing image. Dog fully committed to eating. Get Joy bag casually visible but not forced. Warm, quiet, satisfying.",
      caption: '"He actually finishes the bowl now. Every time."',
      placement: "Closing / final CTA",
      type: "Original shoot or UGC" },
  ]
};

const ADV2 = {
  title: 'ADV2 — "Dietitian Labels"',
  file: "Advertorials/ADV2 (Dietitian Labels).html",
  images: [
    { placeholder: "Maya Chen headshot — professional but warm, with her dog",
      mood: "Author avatar used in byline. Small format. Professional but not stiff — approachable expert energy. Dog present if possible.",
      caption: "(none — byline avatar)",
      placement: "Author byline / article header",
      type: "Original shoot — persona photo" },
    { placeholder: "Maya with her dog — professional setting, warm. Dog looks healthy but not obviously thriving.",
      mood: 'Opening image establishing narrator and dog. Feels competent and caring but something is subtly off with the dog\'s vitality. The "before" exists quietly in this frame.',
      caption: '"Three years of doing everything right. The results told a different story."',
      placement: "Hero / opening section",
      type: "Original shoot — persona + dog" },
    { placeholder: "Get Joy bag arriving — natural home setting, unboxing.",
      mood: "Relatable trial moment. Natural lighting. Not overly styled. Kitchen or entryway.",
      caption: '"I gave it four weeks before I let myself have an opinion."',
      placement: "Trial / transition moment",
      type: "Product lifestyle — unboxing" },
    { placeholder: "Mochi — adequate coat, settled energy, not engaged.",
      mood: '"Looks fine. Healthy. Just muted." Same location as Image 5 if possible. Coat adequate but not gleaming. Energy calm but not curious.',
      caption: "(none — before/after pair)",
      placement: "Before/after section",
      type: "Original shoot — must pair with Image 5",
      isBefore: true },
    { placeholder: "Mochi — coat visibly improved, alert, pulling toward something.",
      mood: "Same setting/angle as Image 4. Clear change — coat sheen, forward energy, engaged posture.",
      caption: '"Eight weeks on Get Joy. My colleague asked: \'What changed?\'"',
      placement: "Before/after section",
      type: "Original shoot — must pair with Image 4",
      isAfter: true },
    { placeholder: "Get Joy product — freeze-dried bag, clean brand photography.",
      mood: "Multiple flavor options visible. Premium, clean. Product moment.",
      caption: "(none)",
      placement: "Product CTA section",
      type: "Product photography — brand asset" },
    { placeholder: "Grid of UGC — real dogs, real owners, diverse breeds.",
      mood: "Social proof grid. Authentic, diverse. Before/after coat photos. Lifestyle shots of happy dogs eating Get Joy.",
      caption: "(none)",
      placement: "Social proof / testimonials section",
      type: "UGC — real customer submissions" },
    { placeholder: "Mochi eating from his bowl — Get Joy bag visible in background.",
      mood: "Closing image. Dog fully committed to eating. Get Joy bag casually in frame. Warm, quiet.",
      caption: '"He eats it every time. No performance required."',
      placement: "Closing / final CTA",
      type: "Original shoot or UGC" },
  ]
};

const ADV3 = {
  title: 'ADV3 — "Sister Dogs"',
  file: "Advertorials/ADV3 (Sister Dogs).html",
  images: [
    { placeholder: "Sarah and her sister together, each holding their Golden Retriever puppy — small, identical, from the same litter.",
      mood: "Warm, candid, joyful. Founding moment of the story — the two puppies are indistinguishable. Joy of new dog energy. Lifestyle, not staged.",
      caption: '"The day we picked them up. We couldn\'t tell them apart."',
      placement: "Opening / hero section",
      type: "Original shoot — two people + two matching puppies" },
    { placeholder: "Cooper — coat slightly flat, soft body, relaxed posture. Healthy but muted.",
      mood: '"Fine." — Every vet visit. Healthy enough. Not remarkable. Soft build.',
      caption: "(dog card format — no traditional caption)",
      placement: "Dog profile card — Cooper",
      type: "Original shoot" },
    { placeholder: "Sunny — full gleaming coat, lean defined build, alert ears, engaged eyes.",
      mood: "Dog card for Sunny. Same litter, same age, same breeder — visual contrast to Image 2 is the entire point of this LP.",
      caption: "(dog card format — no traditional caption)",
      placement: "Dog profile card — Sunny",
      type: "Original shoot — must visually contrast with Image 2" },
    { placeholder: "Cooper eating from his bowl — Get Joy bag visible nearby. Kitchen setting, warm light.",
      mood: "First bowl of Get Joy moment. Dog is committed to eating. Warm kitchen. Bag present but not forced. Candid.",
      caption: '"He finished the bowl without checking to see if something better was coming. That was new."',
      placement: "Trial / first bowl moment",
      type: "Original shoot or UGC" },
    { placeholder: "Cooper — flat coat, soft build, settled on couch.",
      mood: "Year 3. Before the switch. Same framing as Image 6 if possible. Not sick — just the plateau version of him.",
      caption: "(none — before/after pair)",
      placement: "Before/after section",
      type: "Original shoot — must pair with Image 6",
      isBefore: true },
    { placeholder: "Cooper — fuller coat, leaner build, alert and engaged.",
      mood: "Month 4 on Get Joy. Clear visual change — coat, build, eyes, energy.",
      caption: '"Lauren says they finally look like siblings again."',
      placement: "Before/after section",
      type: "Original shoot — must pair with Image 5",
      isAfter: true },
    { placeholder: "Get Joy product — freeze-dried bag, clean brand photography.",
      mood: "Multiple flavor options visible. Premium, clean. Product moment.",
      caption: "(none)",
      placement: "Product CTA section",
      type: "Product photography — brand asset" },
    { placeholder: "Grid of UGC — real dogs, real owners, diverse breeds.",
      mood: "Social proof grid. Authentic, diverse. Before/after coat photos. Lifestyle shots.",
      caption: "(none)",
      placement: "Social proof / testimonials section",
      type: "UGC — real customer submissions" },
    { placeholder: "Cooper and Sunny side by side — both looking healthy, both gleaming.",
      mood: "Closing payoff image. Both dogs together, healthy and matched. Sarah and Lauren in background, coffee in hand, Sunday morning energy. Warm, quiet triumph.",
      caption: '"Same litter. Finally the same dog again."',
      placement: "Closing / final section",
      type: "Original shoot — both dogs + both owners, candid" },
  ]
};

const LIST1 = {
  title: 'LIST1 — "6 Symptoms Your Dog\'s Food Isn\'t Working"',
  file: "Listicles/LIST1 (6 Symptoms Your Dog Food Isn't Working).html",
  images: [
    { placeholder: "Split shot — left dog with flat dull coat, right same breed with full gleaming coat",
      mood: "Warm natural light · lifestyle photography. Same breed both sides. Side-by-side composition. Visual contrast should be immediate and clear without needing labels.",
      caption: "(none)",
      placement: "Symptom 01 — Coat section",
      type: "Original shoot or stock — matched breed pair" },
    { placeholder: "Dog alert and engaged — ears forward, eyes bright, pulling on leash, clearly present and full of drive",
      mood: "Active outdoor lifestyle · Golden/Lab breed ideal. Forward motion, energy visible. Leash taut. Not posed — caught mid-pull.",
      caption: "(none)",
      placement: "Symptom 02 — Energy section",
      type: "Stock or UGC — active outdoor lifestyle" },
    { placeholder: "Dog eating calmly and enthusiastically — head fully in bowl, clean relaxed posture",
      mood: "Kitchen setting · warm natural light. Head down in bowl, relaxed body, not tense or distracted. Clean composition.",
      caption: "(none)",
      placement: "Symptom 03 — Digestion section",
      type: "Stock or UGC — kitchen setting" },
    { placeholder: "Dog absolutely committed to bowl — head fully in, tail up, clearly excited about the food",
      mood: "Contrast with a disinterested dog standing back from bowl. If using two images: one dog engaged, one dog standing back skeptically. If single: maximum excitement.",
      caption: "(none)",
      placement: "Symptom 04 — Picky eating section",
      type: "Stock or UGC" },
    { placeholder: "Dog relaxed and content — healthy skin visible in coat, no scratching posture, calm and present",
      mood: "Close-up coat detail · warm studio or outdoor light. Healthy skin, coat texture visible. Not itching, not tense. Serene.",
      caption: "(none)",
      placement: "Symptom 05 — Allergies / skin section",
      type: "Stock — close-up coat/skin" },
    { placeholder: "Dog alert, ears forward, eyes engaged — clearly present and curious, not watching from couch",
      mood: "Contrast: not resting — actively present. Engaged energy. Curious posture. Could be indoors but forward-looking, attentive.",
      caption: "(none)",
      placement: "Symptom 06 — Low drive section",
      type: "Stock or UGC" },
    { placeholder: "Get Joy product — freeze-dried bag, clean lifestyle shot. Multiple flavors visible.",
      mood: "Premium feel · dog eating in background ideal. Closing product image. Lifestyle not pure product photography.",
      caption: "(none)",
      placement: "Product / CTA section",
      type: "Product photography — brand asset" },
  ]
};

const LIST2 = {
  title: 'LIST2 — "5 Reasons The Switch To Premium Food Didn\'t Work"',
  file: "Listicles/LIST2 (5 Reasons The Switch To Premium Food Didn't Work The Way You Expected).html",
  images: [
    { placeholder: "Close-up of premium dog food label - clean ingredient list, high protein content visible",
      mood: "Clinical feel · the promise vs. the reality. Premium bag label, well-designed, impressive ingredient list. The gap is invisible — this image should look good.",
      caption: "(none)",
      placement: "Reason 01 — The Label section",
      type: "Product / flat lay" },
    { placeholder: "Fresh dog food being prepared - warm kitchen, premium sourcing feel",
      mood: 'The "gently cooked" aesthetic · aspirational but the temperature problem is invisible. Warm kitchen, fresh ingredients, human-grade feel. Beautiful but the heat processing issue is the point.',
      caption: "(none)",
      placement: "Reason 02 — The Process section",
      type: "Stock — fresh food / kitchen lifestyle" },
    { placeholder: "Probiotic supplement bottle next to a dog bowl",
      mood: "Well-intentioned · the supplement-on-top-of-cooked-food gap. Simple, clean product placement. The bottle represents doing \"extra\" when the foundation isn't right.",
      caption: "(none)",
      placement: "Reason 03 — The Supplement section",
      type: "Product / flat lay — supplement bottle + bowl" },
    { placeholder: "Dog at vet - calm exam table, owner present, results being reviewed",
      mood: 'Reassuring but inconclusive · the "everything looks fine" moment. Vet visit where everything checks out — on paper. Dog calm. Owner present. Normal.',
      caption: "(none)",
      placement: "Reason 04 — The Vet Visit section",
      type: "Stock — vet / clinic setting" },
    { placeholder: "Dog resting - calm but low-energy, owner nearby looking thoughtful",
      mood: 'The resigned acceptance moment · quiet, warm. Dog settled on couch or floor. Owner nearby, reflective. The quiet plateau of "maybe this is just how it is."',
      caption: "(none)",
      placement: "Reason 05 — The Wait section",
      type: "Stock or UGC — home lifestyle" },
    { placeholder: "Get Joy freeze-dried bag - clean product shot, multiple flavors.",
      mood: "Dog eating with interest in background ideal. Closing product image.",
      caption: "(none)",
      placement: "Product / CTA section",
      type: "Product photography — brand asset" },
  ]
};

const LIST3 = {
  title: 'LIST3 — "Kibble vs. Fresh vs. Freeze-Dried: Which One Actually Changes Your Dog"',
  file: "Listicles/LIST3 Kibble vs. Fresh vs. Freeze-Dried Which One Actually Changes Your Dog.html",
  images: [
    { placeholder: "Kibble in a bowl -- neutral kitchen setting",
      mood: "90% of dogs eat it. Not the same as it working. Straightforward. Neutral. Not demonizing kibble — just honest. Clean bowl, clean counter.",
      caption: "(none)",
      placement: "Format 01 — Kibble section",
      type: "Stock — plain kibble bowl" },
    { placeholder: "Fresh food pouch being portioned -- clean lifestyle shot",
      mood: "Better ingredients. Same temperature ceiling. Premium fresh food being portioned or served. Looks aspirational. The heat processing problem is invisible in this image — intentionally.",
      caption: "(none)",
      placement: "Format 02 — Fresh section",
      type: "Stock or product — fresh food serving" },
    { placeholder: "Get Joy bag open, freeze-dried nuggets visible -- premium product shot",
      mood: "No heat at any stage. What goes in is what gets to the bowl. Open bag, nuggets visible. Premium product photography. This is the reveal moment.",
      caption: "(none)",
      placement: "Format 03 — Freeze Dried Raw section",
      type: "Product photography — brand asset (open bag)" },
    { placeholder: "Get Joy freeze-dried bag -- clean product shot, multiple flavors.",
      mood: "Closing product image. Clean, multiple SKUs visible.",
      caption: "(none)",
      placement: "Product / CTA section",
      type: "Product photography — brand asset" },
  ]
};

// ═══════════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════════════════════

function buildLPSection(lp) {
  const blocks = [];
  blocks.push(...lpH2(lp.title, lp.file, lp.images.length));

  lp.images.forEach((img, i) => {
    blocks.push(imageCard(i + 1, img, !!img.isBefore, !!img.isAfter));
    blocks.push(spacer(8));
  });

  return blocks;
}

// Summary table
function summaryTable() {
  const headerBorder = borders(FOREST, 6);
  const rowBorder = borders(MID_GREY, 4);

  const colW = [2800, 1400, 5160]; // sum = 9360

  function headerCell(text) {
    return new TableCell({
      width: { size: colW[0], type: WidthType.DXA },
      borders: headerBorder,
      shading: { fill: FOREST, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20, font: "Arial" })]
      })]
    });
  }

  function dataCell(text, w, bg = "FFFFFF") {
    return new TableCell({
      width: { size: w, type: WidthType.DXA },
      borders: rowBorder,
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({ text, size: 19, font: "Arial", color: DARK_TEXT })]
      })]
    });
  }

  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: colW[0], type: WidthType.DXA }, borders: headerBorder, shading: { fill: FOREST, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true, color: "FFFFFF", size: 20, font: "Arial" })] })] }),
        new TableCell({ width: { size: colW[1], type: WidthType.DXA }, borders: headerBorder, shading: { fill: FOREST, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Count", bold: true, color: "FFFFFF", size: 20, font: "Arial" })] })] }),
        new TableCell({ width: { size: colW[2], type: WidthType.DXA }, borders: headerBorder, shading: { fill: FOREST, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Notes", bold: true, color: "FFFFFF", size: 20, font: "Arial" })] })] }),
      ]
    }),
  ];

  const tableData = [
    ["Product photography (brand asset)", "~10", "Get Joy bags — clean, multi-flavor, premium. 1–2 hero product shots probably cover most uses.", LIGHT_GREY],
    ["Before/After pairs", "6 pairs\n(12 images)", "ADV1 (Koda), ADV2 (Mochi), ADV3 (Cooper) each need matched B/A pairs. Consistent angle + lighting critical.", "FFFFFF"],
    ["Lifestyle / dog UGC", "~8", "Eating from bowl, walking, alert and engaged. Real dogs preferred over stock.", LIGHT_GREY],
    ["Social proof grid (UGC)", "3", "One per ADV. Needs real customer submissions — before/after coats + lifestyle.", "FFFFFF"],
    ["Stock / flat lay", "~8", "Ingredients, labels, vet visit, kibble bowl, fresh food. Stock is fine here.", LIGHT_GREY],
    ["Persona / character", "3", "ADV2: Maya Chen headshot + with dog. ADV3: Sarah + sister with puppies. Needs original shoot.", "FFFFFF"],
  ];

  tableData.forEach(([type, count, notes, bg]) => {
    rows.push(new TableRow({
      children: [
        new TableCell({ width: { size: colW[0], type: WidthType.DXA }, borders: rowBorder, shading: { fill: bg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: type, bold: true, size: 19, font: "Arial", color: DARK_TEXT })] })] }),
        new TableCell({ width: { size: colW[1], type: WidthType.DXA }, borders: rowBorder, shading: { fill: bg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: count, bold: true, size: 19, font: "Arial", color: FOREST })] })] }),
        new TableCell({ width: { size: colW[2], type: WidthType.DXA }, borders: rowBorder, shading: { fill: bg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: notes, size: 19, font: "Arial", color: DARK_TEXT })] })] }),
      ]
    }));
  });

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colW,
    rows
  });
}

// Shared assets section
function sharedAssetsSection() {
  const items = [
    { asset: "Get Joy bag — clean multi-flavor product shot", usage: "ADV1 img6, ADV2 img6, ADV3 img7, LIST1 img7, LIST2 img6, LIST3 img4", placements: "6 placements" },
    { asset: "Get Joy bag — open, nuggets visible", usage: "LIST3 img3", placements: "1 placement, unique angle" },
    { asset: "UGC social proof grid", usage: "ADV1 img7, ADV2 img7, ADV3 img8", placements: "3 placements — same grid, different ADV context" },
    { asset: "Dog eating from bowl with bag in background", usage: "ADV1 img8, ADV2 img8", placements: "can share if breed matches persona" },
    { asset: "Unboxing / bag arriving", usage: "ADV1 img3, ADV2 img3", placements: "same shot works for both" },
  ];

  const blocks = [
    spacer(16),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "SHARED ASSETS", color: "FFFFFF", bold: true, size: 36, font: "Arial" })],
      shading: { fill: FOREST, type: ShadingType.CLEAR },
      spacing: { before: 400, after: 200 },
      indent: { left: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Shoot once, deploy everywhere. These images appear across multiple LPs.", size: 20, color: "555555", font: "Arial", italics: true })],
      spacing: { before: 100, after: 200 }
    }),
  ];

  items.forEach((item, i) => {
    const bg = i % 2 === 0 ? PALE_GRN : "FFFFFF";
    const colW2 = [4000, 5360];
    blocks.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: colW2,
      borders: borders(MID_GREY, 4),
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: colW2[0], type: WidthType.DXA },
            borders: borders(MID_GREY, 4),
            shading: { fill: bg, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 150, right: 150 },
            children: [
              new Paragraph({ children: [new TextRun({ text: `${i + 1}.  ${item.asset}`, bold: true, size: 20, font: "Arial", color: FOREST })] }),
              new Paragraph({ children: [new TextRun({ text: item.placements, size: 18, font: "Arial", color: "666666", italics: true })], spacing: { before: 40 } })
            ]
          }),
          new TableCell({
            width: { size: colW2[1], type: WidthType.DXA },
            borders: borders(MID_GREY, 4),
            shading: { fill: bg, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 150, right: 150 },
            children: [new Paragraph({ children: [new TextRun({ text: "Used in: " + item.usage, size: 20, font: "Arial", color: DARK_TEXT })] })]
          })
        ]
      })]
    }));
    blocks.push(spacer(4));
  });

  return blocks;
}

// ─── Assemble document ────────────────────────────────────────────
const children = [
  // Title block
  new Paragraph({
    children: [new TextRun({ text: "GetJoy", bold: true, size: 72, font: "Arial", color: FOREST })],
    spacing: { before: 0, after: 60 }
  }),
  new Paragraph({
    children: [new TextRun({ text: "Image Sourcing Master Doc", bold: true, size: 48, font: "Arial", color: DARK_TEXT })],
    spacing: { before: 0, after: 120 }
  }),
  new Paragraph({
    children: [new TextRun({ text: "All 6 LPs  ·  42 images total  ·  2026-03-09", size: 22, font: "Arial", color: "777777" })],
    spacing: { before: 0, after: 60 }
  }),
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GREEN } },
    spacing: { before: 0, after: 300 }
  }),

  // How to use
  new Paragraph({
    children: [new TextRun({ text: "How to use this doc", bold: true, size: 26, font: "Arial", color: FOREST })],
    spacing: { before: 0, after: 120 }
  }),
];

// How-to table
const howToRows = [
  ["#", "Image number within the LP (in page order)"],
  ["Placeholder", "Exact text from the HTML file — copy this to brief your photographer or search stock"],
  ["Context/Mood", "Notes from the HTML on tone, framing, and lighting"],
  ["Caption", "On-page caption the reader sees (if present)"],
  ["Placement", "Where in the LP this image lives"],
  ["Type", "Stock / UGC / Product / Original shoot"],
];

const htColW = [1800, 7560];
children.push(new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: htColW,
  borders: borders(MID_GREY, 4),
  rows: howToRows.map(([label, desc], i) => new TableRow({
    children: [
      new TableCell({ width: { size: htColW[0], type: WidthType.DXA }, borders: borders(MID_GREY, 4), shading: { fill: PALE_GRN, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 150, right: 150 }, children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial", color: FOREST })] })] }),
      new TableCell({ width: { size: htColW[1], type: WidthType.DXA }, borders: borders(MID_GREY, 4), shading: { fill: i % 2 === 0 ? "FFFFFF" : LIGHT_GREY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 150, right: 150 }, children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20, font: "Arial", color: DARK_TEXT })] })] }),
    ]
  }))
}));

children.push(spacer(20));

// BEFORE/AFTER note
children.push(new Paragraph({
  children: [
    new TextRun({ text: "Note: ", bold: true, size: 20, font: "Arial", color: DARK_TEXT }),
    new TextRun({ text: "BEFORE/AFTER pairs are highlighted with amber (before) and green (after) borders. These must be shot at the same angle and lighting — they function as a matched pair.", size: 20, font: "Arial", color: "444444" })
  ],
  border: accentBorder(GREEN),
  shading: { fill: PALE_GRN, type: ShadingType.CLEAR },
  spacing: { before: 0, after: 400 },
  indent: { left: 200 }
}));

// Advertorials section
children.push(...sectionH1("ADVERTORIALS"));
children.push(...buildLPSection(ADV1));
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(...buildLPSection(ADV2));
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(...buildLPSection(ADV3));
children.push(new Paragraph({ children: [new PageBreak()] }));

// Listicles section
children.push(...sectionH1("LISTICLES"));
children.push(...buildLPSection(LIST1));
children.push(spacer(16));
children.push(...buildLPSection(LIST2));
children.push(spacer(16));
children.push(...buildLPSection(LIST3));

// Summary
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(...sectionH1("SUMMARY BY IMAGE TYPE"));
children.push(spacer(12));
children.push(summaryTable());

// Shared assets
children.push(...sharedAssetsSection());

// Build
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: DARK_TEXT } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "FFFFFF" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: FOREST },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    children
  }]
});

const outPath = "C:\\Users\\gianf\\Desktop\\Growth Shop\\GetJoy\\Image Sourcing — All LPs.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("Written:", outPath);
}).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
