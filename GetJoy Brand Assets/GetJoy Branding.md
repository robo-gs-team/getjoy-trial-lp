# GetJoy Brand Reference

---

## COLORS

### Main Colors (Core Palette)
| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| CREAM | `#FCF6E8` | 252, 246, 232 | Primary background (~25% usage) |
| PALE GREEN | `#CAF7C0` | 202, 247, 192 | Secondary background / light sections |
| GET JOY GREEN | `#00CC3B` | 0, 204, 59 | Primary brand color (~35% usage — dominant) |
| FOREST GREEN | `#005005` | 0, 80, 5 | Dark text / dark sections (~12% usage) |

> **Usage ratio:** GET JOY GREEN > CREAM > FOREST GREEN > PALE GREEN, then accent colors as needed.

---

### Flavor Colors (Product Line)
| Name | HEX | RGB | Protein |
|------|-----|-----|---------|
| SKY | `#5EDBFF` | 94, 219, 255 | Chicken |
| ORANGE | `#FFAF00` | 255, 175, 0 | Beef |
| VIOLET | `#C76BFC` | 199, 107, 252 | Turkey |
| PEACH | `#FF8F57` | 255, 143, 87 | Lamb (TBD) |

---

### Supplement / Treat Line Colors (Accents)
| Name | HEX | RGB | Product Line |
|------|-----|-----|-------------|
| VIOLET | `#C76BFC` | 199, 107, 252 | Calm Supplement |
| CORAL | `#FF6F4F` | 255, 111, 79 | Gut Supplement |
| SUN | `#F5E500` | 245, 229, 0 | Hip & Joint Supplement |
| AQUAMARINE | `#00F5B4` | 0, 245, 180 | Balance Treats |
| PINK | `#FF64C3` | 255, 100, 195 | Support Treats |
| TENNIS BALL | `#C3F54A` | 195, 245, 74 | Endurance Treats |
| BLUE | `#3A96FF` | 58, 150, 255 | Accent / UI |

---

## TYPOGRAPHY

### Type Scale (Brand Guide)
| Role | Font | Weight | Web Equivalent |
|------|------|--------|----------------|
| EYEBROW 1 | ABC Diatype | Bold | DM Sans Bold |
| H1 (Hero) | Work Sans | Black | `WorkSans-Black.ttf` ✓ |
| H2 (Display) | Ivory (Literata) | Light / Light Italic | `Literata_60pt-Light.ttf` ✓ |
| EYEBROW 2 | Ivory (Literata) | Regular / Italic | `Literata_36pt-Regular.ttf` ✓ |
| BODY | ABC Diatype | Medium / Bold | `DMSans_24pt-Regular.ttf` + `Bold.ttf` ✓ |
| BUTTONS | ABC Diatype | Bold | `DMSans_24pt-Bold.ttf` ✓ |

### Local Font Files Available
```
DMSans_24pt-Bold.ttf       → Body bold, buttons, eyebrows
DMSans_24pt-Regular.ttf    → Body text
Literata_36pt-Regular.ttf  → H2 regular / eyebrow 2
Literata_60pt-Light.ttf    → H2 display / subheadings
WorkSans-Black.ttf         → H1 hero headlines
```

### Google Fonts CDN (for HTML pages)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@900&family=Literata:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

### CSS Font Variables
```css
--font-headline: 'Work Sans', sans-serif;       /* H1 — weight 900 */
--font-display: 'Literata', serif;              /* H2 — weight 300/400 */
--font-body: 'DM Sans', sans-serif;             /* Body, buttons, eyebrows */
```

---

## CSS CUSTOM PROPERTIES (Ready to Use)

```css
:root {
  /* Main Colors */
  --color-cream:         #FCF6E8;
  --color-pale-green:    #CAF7C0;
  --color-green:         #00CC3B;
  --color-forest:        #005005;

  /* Flavor Colors */
  --color-sky:           #5EDBFF;
  --color-orange:        #FFAF00;
  --color-violet:        #C76BFC;
  --color-peach:         #FF8F57;

  /* Accent / Supplement Colors */
  --color-coral:         #FF6F4F;
  --color-sun:           #F5E500;
  --color-aquamarine:    #00F5B4;
  --color-pink:          #FF64C3;
  --color-tennis-ball:   #C3F54A;
  --color-blue:          #3A96FF;

  /* Typography */
  --font-headline: 'Work Sans', sans-serif;
  --font-display:  'Literata', serif;
  --font-body:     'DM Sans', sans-serif;
}
```

---

## SVG ICONS

All icons are 22×22px, filled with `#00CC3B` (GET JOY GREEN). Path located at:
`GetJoy Brand Assets/SVG ICONS/`

| File | Label |
|------|-------|
| `GJ-Icon-DevelopedByVets.svg` | Developed by Vets |
| `GJ-Icon-NoSeedOils.svg` | No Seed Oils |
| `GJ-Icon-NothingArtificial.svg` | Nothing Artificial |
| `GJ-Icon-WholeFoodIngredients.svg` | Whole Food Ingredients |

To recolor icons, change `fill: #00cc3b` in each SVG's `<style>` block.

---

## COPY TONE & GUIDELINES

### Hyphenation Rules
**Hyphenate** compound descriptors:
- gluten-free
- grain-free
- 100% USDA-sourced

**Do NOT hyphenate:**
- Freeze Dried Raw
- prebiotics / probiotics / postbiotics (written as separate words)
  - If all 3 together: "pre, pro, and postbiotics"

### Trademark
- Always write: **Belly Biotics™** (with trademark symbol)

### Language & Tone
- Avoid cutesy language — no "doggo," "pup," "fur baby"
- Refer to dog owners as **"dog companions"** wherever possible
- Avoid "ownership" language — treat dogs as family members, humanize them
- Use exclamation points and emojis **sparingly**

---

## BRAND USAGE NOTES

- **Default page background:** `#FCF6E8` (Cream) or `#FFFFFF`
- **Primary CTA color:** `#00CC3B` (Get Joy Green) with `#005005` (Forest) text or white text
- **Dark sections:** `#005005` background with `#FCF6E8` or `#CAF7C0` text
- **Headlines on light bg:** `#005005` (Forest Green)
- **Headlines on green bg:** `#FFFFFF` or `#FCF6E8`
- **Body text:** `#005005` (Forest Green) on light backgrounds
- **Supplement accent colors** are used sparingly as highlights, badges, or section accents — not as primary backgrounds across entire pages
