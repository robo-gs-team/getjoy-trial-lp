# Get Joy — Landing Page & PDP Source

Working repo for Get Joy's Shopify landing pages, product detail pages, advertorials, and listicles.

> **Read this first:** this repo is **not a complete Shopify theme**. It holds the sections and template
> JSON that *we* author, plus research/reference material. The live theme contains many sections that
> exist only on the store (see [What lives where](#what-lives-where)). Treat the store as the source of
> truth for anything you can't find here.

---

## Table of contents

1. [What lives where](#what-lives-where)
2. [How Shopify sections work here](#how-shopify-sections-work-here)
3. [Getting changes onto the store](#getting-changes-onto-the-store)
4. [The Pro Chews funnel](#the-pro-chews-funnel) ← the main body of recent work
5. [Tom's Founder Letter page](#toms-founder-letter-page)
6. [The chews design system](#the-chews-design-system)
7. [Copy and compliance rules](#copy-and-compliance-rules)
8. [Gotchas that will bite you](#gotchas-that-will-bite-you)
9. [Open items / handoff checklist](#open-items--handoff-checklist)
10. [Git workflow](#git-workflow)
11. [Other directories](#other-directories)

---

## What lives where

```
/
├── PDP/
│   ├── pro-chews/                      ← Probiotic Chews funnel (most recent work)
│   │   ├── pro-chews-*.liquid          15 sections
│   │   ├── product.pro-chews.json      PDP template (14 sections wired)
│   │   └── page.toms-chews-letter.json Founder letter page template
│   ├── fdr-T-32hero.liquid             32oz subscription hero
│   ├── product.fdr-sub-32oz-pdp.json   32oz subscription PDP template
│   ├── product.fdr-trial-32oz-pdp.json 32oz trial PDP template
│   └── subscription-selector.html      Static reference markup
├── Advertorials/                       5 standalone HTML advertorials
├── Listicles/                          3 standalone HTML listicles
├── GetJoy Brand Assets/                Brand guidelines, fonts, colors, SVG icons, claims PDFs
├── Image Sourcing — All LPs.md         Image brief for all 6 LPs (42 images)
├── theme_export__…zip                  Full theme export, 29 Apr 2026 (reference snapshot)
├── *.js                                One-off build/scrape scripts (see below)
└── pdp_*.html, getjoy-trial-lp-v4.html Scraped/rendered PDP snapshots (build artifacts)
```

### ⚠️ The 32oz templates reference sections that aren't here

`product.fdr-sub-32oz-pdp.json` and `product.fdr-trial-32oz-pdp.json` wire up sections named
`fdr-trial-16oz-*` (hero, nph, trust-band, srt, csm, clinical, faq, ingredients, why-banner,
comparison, reviews, transition, bottom-cta, sticky-atc). **Only `fdr-T-32hero.liquid` is in this
repo.** The rest live on the store theme only. If you need to edit one, pull it from the theme or
from `theme_export__…zip`.

The `pro-chews` funnel is self-contained — every section it references is in this repo.

### The root `*.js` scripts

One-off Node scripts from an earlier phase, when the PDP was being cloned and modified as static HTML
before the Liquid sections existed. They operate on the `pdp_*.html` snapshots, not on the Liquid.
**They are not part of any current build.** Kept for reference:

| Script | What it did |
|---|---|
| `parse_pdp.js`, `extract_body.js`, `extract_urls.js` | Split a scraped PDP into head/body, pull CDN asset URLs |
| `build_local.js`, `build_rendered.js`, `fix_local.js` | Rewrite protocol-relative/relative URLs so a scrape renders offline; strip Shopify preview scripts |
| `fix_selectors.js`, `fix_responsive.js` | Patch the variant selector and responsive CSS in the static clone |
| `apply_fixes.js`, `apply_round2_fixes.js` | Two rounds of CRO fixes applied to the static clone |
| `build-image-doc.js` | Generates `Image Sourcing — All LPs.docx` from the `.md` (uses the `docx` npm package — the only dependency in `package.json`) |
| `serve.js` | Tiny static file server (`node serve.js`, port 8080) for previewing the HTML snapshots |

---

## How Shopify sections work here

Each page is **one template JSON + N section Liquid files**.

- **`*.liquid`** — a section. Contains `<style>`, markup, optional `<script>`, and a `{% schema %}`
  block at the bottom defining the settings and blocks the theme editor exposes.
- **`*.json`** — a template. Lists which sections appear, in what order, and the *values* for every
  setting and block.

The split matters: **structure and styling live in the Liquid; copy lives in the JSON.** If you're
changing words, you almost always want the JSON. If you're changing layout or color, the Liquid.

Sections declare their editor name in the schema (`"name": "Pro Chews Hero"`), which is what shows
in the theme editor's section picker.

### The shared stylesheet

Every `pro-chews-*` section starts with:

```liquid
{{ 'fdr-trial-pdp.css' | asset_url | stylesheet_tag }}
```

That asset lives on the theme (not in this repo) and provides shared design tokens and a few layout
classes used across funnels:

| Token | Used for |
|---|---|
| `--fdr-font-heading` | Display/heading face (weight 900 throughout) |
| `--fdr-font-body` | UI/body sans |
| `--fdr-font-serif` | Italic serif, used for subheadings and pull quotes |
| `--fdr-forest`, `--fdr-ink`, `--fdr-muted`, `--fdr-amber` | Color tokens |
| `--fdr-radius`, `--fdr-radius-lg` | Corner radii |

Shared classes: `.fdr-sec` (section wrapper w/ background variants), `.fdr-h2`, `.fdr-eyebrow`,
`.fdr-sub`, `.fdr-cta-pill`. Only `pro-chews-reviews` and `pro-chews-bottom-cta` use the `.fdr-sec`
wrapper; the rest style their own containers.

**Always use the font tokens, never hardcode a font family.** A section that hardcodes e.g. Fraunces
will visibly drift from the rest of the page — this has already been caught and fixed once.

---

## Getting changes onto the store

There is **no deploy automation in this repo.** Git here is version control and review, not a
pipeline. To get a change live you copy the file into the theme — via Shopify CLI (`shopify theme
push`), the admin code editor, or however the store is currently managed. Confirm the current
process before your first deploy; it isn't encoded anywhere in this repo.

**Because the theme editor writes back to template JSON, the store can silently diverge from this
repo.** If someone edits copy in the Shopify admin, `product.pro-chews.json` here goes stale. Pull
the live template down before making JSON edits, or you'll overwrite their work.

Every template JSON in this repo carries this header, added by Shopify:

```
/*
 * IMPORTANT: The contents of this file are auto-generated.
 * This file may be updated by the Shopify admin theme editor…
 */
```

That header is a real warning, and it also means **these files are not valid strict JSON.** Strip the
leading `/* … */` before parsing:

```bash
python3 -c "
import json,re,sys
s=open('PDP/pro-chews/product.pro-chews.json',encoding='utf-8').read()
print(json.dumps(json.loads(re.sub(r'^\s*/\*.*?\*/','',s,flags=re.S)))[:200])
"
```

---

## The Pro Chews funnel

The Get Joy Probiotic Chews PDP. Template: **`PDP/pro-chews/product.pro-chews.json`**.

Section order on the page (the `main-product` section is present but `"disabled": true` — the hero
replaces it entirely):

| # | Section | What it is |
|---|---|---|
| 1 | `pro-chews-hero` | Buy box. Gallery + thumbs, accordions, weight-tier selector, plan cards (sub vs one-time), SKIO selling plan, AJAX add-to-cart. The biggest and most logic-heavy section. |
| 2 | `pro-chews-valuestack` | "One chew does the job of a whole shelf" — 6 priced ingredient rows totalling ~$100 vs $25.99. |
| 3 | `pro-chews-timeline` | 4-step results arc (Days 1–3 → Day 30+). Horizontal 4-col on desktop, vertical on mobile. |
| 4 | `pro-chews-mechanism` | Belly Biotics™ three layers: prebiotic / probiotic / postbiotic. |
| 5 | `pro-chews-experts` | 4 expert credential cards (PhD nutritionist + 3 DVMs). Photos from Shopify Files. |
| 6 | `pro-chews-ingredients` | Ingredient breakdown cards. |
| 7 | `pro-chews-comparison` | Comparison table vs generic category competitors. |
| 8 | `pro-chews-faq` | 5 FAQ accordions. |
| 9 | `pro-chews-trust-band` | 4 trust items, FontAwesome 6.5.2 Free icons via CDN. |
| 10 | `pro-chews-nph` | Neil Patrick Harris investor section with video. |
| 11 | `pro-chews-why-banner` | "Why we built the chew" brand story. |
| 12 | `pro-chews-reviews` | Auto-scrolling review cards. **All content is fictional placeholder** — see compliance. |
| 13 | `pro-chews-bottom-cta` | Final offer card, forest green, with included-items stack. |
| 14 | `pro-chews-sticky-atc` | Fixed bottom bar, appears after the hero CTA scrolls out of view. |

### Hero mechanics worth knowing

**Weight-tier selector.** Four buttons (≤30 / 31–60 / 61–90 / 91+ lbs) drive a `TIERS` array in JS.
Selecting a tier updates: the summary line ("2 chews/day · one bag lasts 45 days"), the per-day price,
the tub prices (base price × `tier.qty`), and the hidden quantity input. Base prices come from Liquid
settings (`sub_first_price`, `sub_refill_price`, `sub_compare`, `onetime_price`) — **the tier
multipliers are computed in JS, so if you change pricing in the JSON the tiers follow automatically.**

**Cart.** The section renders a real `{% form 'product' %}` with id `pc-atc-form`, carrying hidden
`id` (variant) and `selling_plan` inputs. Submission is intercepted and POSTed to `/cart/add.js`,
then dispatches `ajaxProduct:added` so the Get Joy cart drawer opens. The sticky ATC bar doesn't have
its own form — it calls `requestSubmit()` on the hero's.

**SKIO selling plan.** Set via the `selling_plan_id` section setting (numeric ID from SKIO →
Programs → plan → copy from URL). One ID covers all variants. If it's blank the JS deletes the
`selling_plan` key before POSTing, so one-time purchase still works.

**CTA anchors.** Nine sections link to `#buy-box`, which is the id on the hero's buy column. Keep it.

---

## Tom's Founder Letter page

**Template:** `PDP/pro-chews/page.toms-chews-letter.json`
**Section:** `pro-chews-founder-letter.liquid` + a second `pro-chews-reviews` instance

A long-form founder letter adapting the food page's `toms-founder-letter-32oz-ctas` to chews. The
food-page original is **not in this repo** — it exists only on the store.

Structure is block-driven so the whole letter is theme-editor editable. Five block types:

| Block | Renders |
|---|---|
| `chapter` | Eyebrow + heading (with italic second line) + richtext body + optional pull quote + body-after + optional CTA |
| `cost_table` | Same header, plus a 5-row supplement cost table with total + Get Joy rows, a founder's-trial callout, and a footnote |
| `proof` | Same header, plus a big stat block (95%) and a 4-step vertical timeline |
| `signoff` | Header + body + signature line |
| `closing_offer` | Offer card: bullets, price, 5-row value table, CTA |

The `Check Availability` CTA repeats after each chapter, controlled per-block by a `show_cta`
checkbox.

**Narrative boundary:** this letter is about the *supplement-stack* problem (cost, hassle,
incompleteness). It must not use Cooper, the lymphoma arc, or the 18-month claim — that story is
reserved for the food page.

---

## The chews design system

The chews funnel deliberately **does not** inherit the food page's palette. Food is forest-green-only;
chews adds orange as the action color. When porting anything from a food section, re-skin it.

### Tokens

Each section declares its own local tokens (they are not in the shared CSS):

| Token | Value | Use |
|---|---|---|
| `--pc-orange` | `#E85F2E` | **All action states** — CTAs, selected states, checkmarks, accents |
| `--pc-orange-dk` | `#D24E20` | CTA hover |
| `--pc-forest` | `#1C5236` | Identity — headings, dark panels |
| `--pc-cream` | `#FBF3E8` | Section background |
| `--pc-best` | `#CDEB6B` | Highlight on dark backgrounds (prices, stat numbers) |
| `--pc-pink` | `#F7DDD0` | Gallery background |
| `--pc-line` / `--pc-rule` | `#E7DECC` | Borders, dividers |
| `--pc-muted` | `#8a8270` | Secondary text |

> **Known inconsistency:** `pro-chews-hero.liquid` defines `--pc-muted` as `#6F6A60`, while every other
> section uses `#8a8270`. Harmless so far (the hero's muted text is visually isolated), but worth
> unifying if you touch both.

### CSS is scoped per section

Every section wraps its rules in an id selector — `#pc-timeline .pct-card`, `#pc-comparison .pc-cmp-attr`,
`#pc-letter .pcl-body`. This is not stylistic preference. The theme's global CSS bleeds aggressively
into section content (it will recolor your body text and links), and unscoped rules collide between
sections. **Keep new sections scoped the same way.**

### The color-bleed pattern

Theme CSS repeatedly overrides section text color. The escalation ladder, in order:

1. **Scoped rule** — `#pc-timeline .pct-step-body { color: #8a8270; }`. Try this first.
2. **Scoped `!important`, including child elements.** The theme targets `p` and `a` inside your
   markup, so name them explicitly:
   ```css
   #pc-timeline .pct-step-body,
   #pc-timeline .pct-step-body p,
   #pc-timeline .pct-step-body a { color: #8a8270 !important; text-decoration: none; }
   ```
3. **Inline `!important`** — for elements where a theme rule still wins because it loads later in the
   cascade. Used on the comparison and founder-letter CTA buttons:
   ```html
   <a class="pc-cta-pill" style="color:#ffffff !important;">
     <span style="color:#ffffff !important;">Add to Cart</span>
     <svg><path stroke="#ffffff" …/></svg>
   </a>
   ```
   Note the SVG: arrow icons use `stroke="currentColor"` by default, so they inherit the bleed too.
   Pin them to an explicit color when you pin the text.

⚠️ **Watch for the inverse bug.** A blanket `#pc-comparison a { color: inherit !important; }` fixed
link bleed but turned the white CTA text green, because the pill is an `<a>`. Any blanket link rule
needs a more specific rule restoring the CTA.

### Trademark superscript

`Belly Biotics™` must render with a superscript ™. Since escaped output can't contain markup, the
pattern is an unescaped `replace`:

```liquid
{{ block.settings.step_body | replace: '™', '<sup>™</sup>' }}
```

Because this skips `| escape`, only use it on trusted settings copy — never on anything user-supplied.
Sections using it style `sup { font-size: .62em; }` locally.

---

## Copy and compliance rules

These are house rules for this brand, enforced across every chews section. Violating them means a
rewrite, not a tweak.

**Style:**
- **No em dashes.** Use commas, periods, or a middot separator (`·`).
- **No exclamation points** in conversion copy.
- **No competitor brand names** anywhere.
- `Belly Biotics™` always with superscript ™ (see above).

**Claims:**
- No food-page claims carried onto chew pages.
- Postbiotic and CFU claims only as already approved (3 billion CFU, 200mg postbiotic).
- No "clinically proven" language beyond what's already cleared.
- The **95% stat** must carry its disclaimer: *"Based on a 60-day in-home study on daily probiotic
  supplementation."* Note it says *probiotic supplementation*, not the food format.
- Compliance footers **always render** — they are not schema-gated behind a blank check. Both
  `pro-chews-timeline` and `pro-chews-founder-letter` render theirs unconditionally. Keep it that way.

**Testimonials — read this before touching reviews:**

The chew pages use **nine fictional placeholder reviews**. They are not real customers. Every
rendered review card carries this HTML comment in the source, visible to anyone auditing the live
page:

```html
<!-- PLACEHOLDER REVIEW — fictional, not a real customer. Replace on judge.me sync. -->
```

**Do not remove that comment** until judge.me syndication actually replaces the content. It appears
in both the primary loop and the duplicated `aria-hidden` loop that makes the marquee seamless.

The nine placeholders and their breeds:

| Author | Breed | Angle |
|---|---|---|
| Marissa T. | Goldendoodle | Firmer stools within a week |
| Devon R. | Cavalier King Charles Spaniel | Senior dog energy |
| Priya K. | French Bulldog | Itching stopped |
| Carlos M. | Boxer | Actually takes it willingly |
| Heather B. | Labrador & Beagle | Two dogs, one chew |
| Tom W. | Australian Shepherd | Skeptic, vet-approved |
| Janelle F. | Pit Bull mix | Rescue dog gut |
| Renee S. | English Bulldog | Less gas |
| Ben O. | Dachshund | Took the full 90 days |

The founder letter page uses the strongest four (Marissa, Devon, Tom W., Janelle).

🚫 **Never put the food page's testimonials on a chew page.** Leonard, Brianna, Peter A., Kris, Danny,
Ingrid S., and Llewellyn are **real food customers**. Their reviews describe the freeze-dried food,
not the chews. They were removed from the chews reviews for exactly this reason.

---

## Gotchas that will bite you

**1. `image_picker` rejects external URLs.**
Shopify's `image_picker` setting type only accepts references to files in the store's Files library:

```json
"photo": "shopify://shop_images/faheyDOC.webp"
```

Pasting a `https://cdn.instant.so/…` or any other external URL into that field throws
`FileSaveError`. Upload to Shopify Files first. In Liquid, render with the `image_url` filter:
`{{ block.settings.photo | image_url: width: 400 }}`.

**2. Don't guess image URLs.**
Review images were briefly wired to Unsplash URLs with invented photo IDs. They 404'd, and every card
rendered a broken-image box showing its alt text. They're now blank (the template guards on
`image != blank`, so cards render clean without them). If you want photos, upload real files to
Shopify Files and reference them.

**3. `IntersectionObserver` fires immediately on page load.**
The sticky ATC appeared instantly on load because the observer's first callback runs before the user
has scrolled anywhere. Fixed with a latch:

```javascript
var hasSeenCta = false;
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) hasSeenCta = true;
    if (hasSeenCta) {
      stickyBar.classList.toggle('pc-atc-visible', !entry.isIntersecting);
    }
  });
}, { threshold: 0 });
obs.observe(heroCta);
```

**4. Equal-height cards in a grid need three things.**
Getting the timeline's 4 columns to match height took `align-items: stretch` on the grid, `height: 100%`
on the flex row, and `flex: 1` + `box-sizing: border-box` on the card. Missing any one leaves ragged
columns.

**5. Theme editor overwrites template JSON.** See [deploy](#getting-changes-onto-the-store).

**6. Template JSON isn't strict JSON.** Strip the comment header before parsing. Note that
`page.toms-chews-letter.json` was authored here and has *no* header — Shopify will add one the first
time the template is saved through the admin.

**7. Shared 16oz Liquid hardcodes `#buy-box-16oz`.**
Some inherited sections link to an anchor that doesn't exist on the 32oz page. `fdr-T-32hero.liquid`
works around it with a JS click interceptor catching `a[href*="#buy-box"]`.

---

## Open items / handoff checklist

### Blocking before publish

- [ ] **Reviews are fictional.** Nine placeholder reviews across the PDP and founder letter. Replace
      via judge.me syndication, and remove the `PLACEHOLDER REVIEW` HTML comments only when you do.
- [ ] **Pricing figures are illustrative placeholders.** Two places need category-average confirmation:
      - `pro-chews-valuestack` — the six per-ingredient prices and the `$100.94` separate-total. The
        section already renders a footnote saying so.
      - `pro-chews-founder-letter` cost table — the `$100–145/mo` stack total and the `$800+/year`
        savings claim. Footnoted the same way.
- [ ] **Founder letter `cta_url` is blank.** All CTAs currently fall back to `#buy-box`, which does
      not exist on that page — point it at the chews PDP URL.
- [ ] **Founder letter `hero_image` is unset.** Needs Tom's shot (hand reaching for the chew bag past
      a counter of bottles). Header renders fine without it in the meantime.

### Nice to have

- [ ] **Review card images** — all nine are blank. Cards are styled to look intentional without them
      (open-quote accent up top, author pinned to the bottom with a divider), so this is optional.
- [ ] **Unify `--pc-muted`** between the hero (`#6F6A60`) and everything else (`#8a8270`).
- [ ] **Three sections never audited** in the recent work: `pro-chews-faq.liquid`,
      `pro-chews-nph.liquid`, `pro-chews-why-banner.liquid`. Their JSON content is chews-appropriate,
      but the Liquid hasn't been reviewed for inherited food-page markup or selectors.

---

## Git workflow

- **Default branch is `master`**, not `main`.
- Feature work happens on a branch, then merges to `master`.
- `GITHUB-SETUP.md` documents token-based auth. The token file
  (`robo-gs-github-token.txt`) is gitignored and **must stay that way**. The token documented there
  expired in Apr 2026 — you'll need a fresh one.

```bash
git checkout -b your-branch
# … work …
git add PDP/pro-chews/…
git commit -m "…"
git push -u origin your-branch

git checkout master && git merge your-branch && git push origin master
```

---

## Other directories

**`Advertorials/`** — 5 standalone HTML pages: ADV1 (4 Years), ADV2 (Dietitian Labels), ADV3 (Sister
Dogs), and two versions of the founder presell. Self-contained; not Shopify sections.

**`Listicles/`** — 3 standalone HTML pages: LIST1 (6 Symptoms), LIST2 (5 Reasons The Switch Didn't
Work), LIST3 (Kibble vs Fresh vs Freeze-Dried).

**`GetJoy Brand Assets/`** — brand guidelines PDF, `GetJoy Branding.md`, color palette (PNG + PDF),
fonts (DM Sans, Literata, Work Sans), 4 SVG icons, and two compliance-relevant PDFs:
**`Product_Claims.pdf`** and **`BrandTone_Copy_Callouts.pdf`**. Read those two before writing claims copy.

**`Image Sourcing — All LPs.md`** — image brief covering 42 images across 6 LPs, with placeholder
text, mood notes, captions, placement, and type (stock / UGC / product / original shoot). The `.docx`
is generated from it by `build-image-doc.js`.

**`theme_export__getjoyfood-com-get-joy-main__29APR2026-0343pm.zip`** — full theme snapshot from
29 Apr 2026. Useful for finding sections that aren't in this repo.

**`pdp_*.html`, `getjoy-trial-lp-v4.html`** — scraped and processed PDP snapshots from the static-clone
phase. Build artifacts; not live inputs. Preview with `node serve.js`.
