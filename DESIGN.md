---
name: 烟标记忆
description: 一个关于八十年代旧烟标的个人收藏博物馆 — 纸墨之间的旧时光
colors:
  copperplate-gold: "#B8860B"
  burnished-gold: "#D4AF37"
  deep-gold: "#8B6914"
  gold-ghost: "rgba(184, 134, 11, 0.12)"
  highlight-gold: "#E8C547"
  gold-shadow: "rgba(0, 0, 0, 0.12)"
  rice-paper: "#F5F0E8"
  rice-paper-card: "#FAF7F0"
  rice-paper-deep: "#EDE6DA"
  rice-paper-stain: "#F0E9DD"
  aged-ink: "#262626"
  ink-light: "#5C5650"
  ink-wash: "#3D3D3D"
  border-line: "#D9CFC0"
  night-bg: "#1C1B19"
  night-card: "#252320"
  night-text: "#D8CDBA"
  night-border: "#36332E"
typography:
  display:
    fontFamily: "'ZCOOL XiaoWei', serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "4px"
  hero:
    fontFamily: "'Ma Shan Zheng', cursive"
    fontSize: "clamp(56px, 7vw, 66px)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "14px"
  body:
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif"
    fontSize: "15px"
    fontWeight: 300
    lineHeight: 2.2
    letterSpacing: "0.3px"
  label:
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "1.5px"
  section-heading:
    fontFamily: "'Ma Shan Zheng', cursive"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "8px"
  subtitle:
    fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif"
    fontSize: "13px"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "3px"
  handwritten:
    fontFamily: "'Ma Shan Zheng', cursive"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "3px"
  decorative-quote:
    fontFamily: "'ZCOOL XiaoWei', serif"
    fontSize: "80px"
    fontWeight: 400
    lineHeight: 1
rounded:
  sm: "2px"
  md: "3px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.copperplate-gold}"
    rounded: "{rounded.sm}"
    padding: "8px 40px"
  button-primary-hover:
    backgroundColor: "{colors.copperplate-gold}"
    textColor: "{colors.rice-paper-card}"
    rounded: "{rounded.sm}"
    padding: "8px 40px"
  card-cigar:
    backgroundColor: "{colors.rice-paper-card}"
    textColor: "{colors.aged-ink}"
    rounded: "{rounded.sm}"
    padding: "14px 14px 22px"
  card-cigar-hover:
    backgroundColor: "{colors.rice-paper-card}"
    textColor: "{colors.aged-ink}"
    rounded: "{rounded.sm}"
    padding: "14px 14px 22px"
---

# Design System: 烟标记忆

## 1. Overview: 纸墨之间的旧时光

**Creative North Star: "黄金时代的余烬"**

This design system evokes the tactile world of old paper artifacts — cigarette labels gathered by hand, worn at the edges, touched by time. It is warm without sentimentality, melancholic without self-pity. Every surface should feel like something you could hold: rice paper, aged ink, copperplate gold. The system explicitly rejects digital gloss, algorithmic optimization, and anything that reads as "modern" for its own sake. It is a frame for artifacts, not a performance.

**Key Characteristics:**
- Tactile, analog materiality — paper grain, ink bleed, gold patina — over digital effects
- Restraint as generosity: the site recedes so the labels can speak
- Warmth from recognition, not manipulation
- Ink-wash texture as breathing room: white space that feels inhabited, not empty
- Day and night as two moods of the same room, not a functional toggle

## 2. Colors: 铜版金与旧墨

The palette is built from three material metaphors: rice paper (宣纸), aged ink (旧墨), and copperplate gold (铜版金). Color is used sparingly; gold carries all the emotional weight.

### Primary
- **Copperplate Gold** (#B8860B): The single accent. Used on CTAs, links, footer quotes, the gold seal stamp on cards, and the gradient highlight on "岁月盲盒". Carries the warmth of the entire system. Never decorative; every instance must earn its place.
- **Burnished Gold** (#D4AF37): The lighter companion. Used in the hero gradient text and as a hover state on gold elements. Rare.
- **Deep Gold** (#8B6914): The shadow side of gold. Used in the tape stain on cards, dark accents, and the deepest layer of the gold gradient.

### Neutral
- **Rice Paper** (#F5F0E8): The body background. A warm off-white that reads as aged paper, not sterile white. Carries a subtle fiber texture via SVG noise.
- **Rice Paper Card** (#FAF7F0): Card surface. Lighter than the body — cards sit *on* the paper, not within it.
- **Rice Paper Deep** (#EDE6DA): Footer and section backgrounds. Deeper paper tone for spatial separation.
- **Rice Paper Stain** (#F0E9DD): Image placeholder backgrounds. The tone of paper that's been handled.
- **Aged Ink** (#262626): Body text. Near-black with a faint blue-gray undertone — ink, not pixel-black.
- **Ink Light** (#5C5650): Secondary text and metadata. Warm gray, not cold gray.
- **Ink Wash** (#3D3D3D): Intermediate ink tone for gradients and SVG textures.
- **Border Line** (#D9CFC0): Dividers, card borders, subtle separation. Desaturated enough to recede.

### Dark Theme
- **Night BG** (#1C1B19): Body background. Warm near-black — a dark room, not a dark mode.
- **Night Card** (#252320): Card surface in dark theme.
- **Night Text** (#D8CDBA): Body text in dark theme. Warm cream tone, lower contrast than day for a softer reading experience.

### Named Rules
**The Single Accent Rule.** Copperplate gold is used on ≤10% of any given screen. Its rarity is the point. If gold appears everywhere, nothing is precious.

**The Gold Gradient Rule.** Gradient text is permitted in exactly one location on the entire site: the hero tagline "岁月盲盒" on the homepage. The gradient runs from highlight-gold (#E8C547) through burnished-gold to copperplate-gold and back — a luminous, precious quality that solid gold cannot achieve alone. A text-shadow in gold-shadow provides depth. This is a deliberate brand system exception; nowhere else may gradient text appear.

**The No Gray Rule.** All neutrals are warm-tinted. No pure gray (#808080, #999999) appears anywhere in the system. Even the lightest ink tone (#5C5650) carries warmth.

## 3. Typography: 三体书风

**Display Font:** ZCOOL XiaoWei (站酷小薇), with serif fallback
**Body Font:** Noto Serif SC (思源宋体), with Songti SC, SimSun fallback
**Handwritten Font:** Ma Shan Zheng (马善政), with cursive fallback

**Character:** A three-voice chorus. ZCOOL XiaoWei for headings — refined, literary, with the elegance of a brush-drawn title page. Noto Serif SC for body — a classic Song dynasty serif that reads naturally in Chinese at length. Ma Shan Zheng for emotional peaks — hero text, card names, footer quotes — handwriting that feels personal, not decorative.

### Hierarchy
- **Hero** (Ma Shan Zheng, 400, clamp(56px, 7vw, 66px), line-height 1.35, tracking 14-20px): The homepage tagline. Used only on the homepage hero. Each line animates in with a gentle rise.
- **Page Title** (Ma Shan Zheng, 400, 40-44px, line-height 1.35, tracking 14-18px): Section headers on inner pages. Handwritten presence without the hero scale.
- **Display** (ZCOOL XiaoWei, 400, 22px, line-height 1.35, tracking 4px): Content section headings ("关于收藏", "关于网站"). Used with a bottom border for structure.
- **Body** (Noto Serif SC, 300, 15px, line-height 2.2, tracking 0.3px): All prose. Max line length of 65-75ch on desktop. Generous line-height for Chinese readability.
- **Label** (Noto Serif SC, 400, 12px, line-height 1.6, tracking 1.5px): Metadata on cards (factory, era), footer links, tech stack tags. Small but legible.
- **Handwritten Accent** (Ma Shan Zheng, 400, 24px, line-height 1.4, tracking 3px): Card names in the gallery. The personal touch on each artifact.

### Named Rules
**The Two-Font Floor Rule.** Never display more than two font families on one screen simultaneously. The third (Ma Shan Zheng) is reserved for emotional punctuation — one hero line, one card name, one footer quote. Its power is in scarcity.

## 4. Elevation: 纸上的旧物

This system uses **pinned-down flat** elevation — objects resting on a paper surface, not floating above it. The metaphor is a physical desk covered with old photographs and paper scraps: they lie flat, slightly askew, held in place by gravity and memory.

The system is fundamentally flat at rest. Depth comes from subtle shadows (2px-3px offset, 8px blur) that suggest the thickness of paper, not the distance of floating UI. Cards have intentional rotation (±0.5°) to feel hand-placed. On hover, the rotation shifts and the shadow deepens — the object lifts slightly, as if someone picked it up to look closer. There are no z-index layers beyond the header (sticky) and lightbox (fixed).

### Shadow Vocabulary
- **Rest** (`2px 3px 8px rgba(0,0,0,0.05), inset 0 0 80px rgba(184,134,11,0.03)`): Cards at rest. The gold-tinted inset glow suggests a faint halo from aged paper, not a digital effect.
- **Hover** (`8px 14px 30px rgba(0,0,0,0.1), inset 0 0 80px rgba(184,134,11,0.05)`): Card on hover. Shadow deepens, glow warms.
- **Lightbox** (`0 8px 40px rgba(0,0,0,0.4)`): The lightbox image. Dramatic, but only for the focused artifact.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to interaction. No surface "elevates" by existing alone.

## 5. Components

Every component defers to the material metaphor. Borders are thin and warm; backgrounds are paper-toned; states are subtle.

### Buttons
- **Shape:** Rounded 2px corners — almost sharp, like a paper edge.
- **Primary (Outline):** Transparent background, copperplate-gold border and text. On hover: fills with copperplate gold, text becomes rice-paper-card. Transition: 500ms ease-out. Example: the homepage CTA "浏览全部收藏".
- **Secondary (Text):** No border. Ink-light text, gold underline on hover via `::after` pseudo-element. Example: nav links.
- **Pagination:** Same as primary outline but smaller padding. Gold border, gold text, fills on hover.
- **Touch:** All interactive elements meet 44px minimum touch target height.

### Cards (CigarCard)
- **Shape:** Rounded 2px corners. Border in border-line. Background rice-paper-card.
- **Rotation:** Cards are subtly rotated (±0.4-0.5°) alternating even/odd. This is the "hand-placed" signature of the system.
- **Tape:** A semi-transparent beige strip spans the top of every card, rotated -2°. Simulates aged masking tape holding the card to the page.
- **Stamp:** A 38×38px seal ("旧藏") sits in the top-right, rotated -12°, with a double border in gold at 35% opacity. Evokes a collector's chop mark.
- **Image treatment:** Images have a sepia filter (sepia 18%, saturate 85%) that lifts on hover. The bottom of the image area has a gold-fade gradient.
- **Metadata:** Card name in Ma Shan Zheng (24px). Factory and era in label style below.

### Dividers (Divider)
- **Structure:** Two gradient lines (transparent → border → transparent) flanking a circular SVG emblem. The emblem has concentric rings and crosshairs — suggesting a compass or seal, gold at 50% opacity.
- **Spacing:** 40px vertical padding.

### Lightbox
- **Backdrop:** Fixed overlay, black at 82% opacity. The world recedes; only the artifact remains.
- **Image:** Max 90vw × 75vh, rounded corners, heavy shadow. Caption in white/65% below the image.
- **Close:** 44px touch target, white ring at 10% opacity. Escape key closes.
- **Entry animation:** 350ms ease, fading in with slight scale.

### Header
- **Position:** Sticky, with 92% opacity paper background and backdrop-blur.
- **Logo:** Origami crane SVG icon in gold/60% + "烟标记忆" in Ma Shan Zheng (26px, tracking 4px). A gold gradient underline fades in on hover.
- **Navigation:** Ink-light links (14px, tracking 2px) with a gold `::after` underline that slides in on hover (400ms transition).

### Footer
- **Background:** Rice-paper-deep.
- **Quote:** Ma Shan Zheng, 30-34px, gold, tracking 8-10px: "烟消云不散 旧盒藏流年".
- **Links:** Two-column grid on desktop, stacked on mobile. Ink-light at 65% opacity, hover transitions to gold.

### Form Fields (CommentForm)
- **Inputs:** Full-width, border-line border, rice-paper background, rounded-sm. Focus ring: gold border.
- **Submit button:** Matches primary button style. Shows loading state with disabled styling.

## 6. Do's and Don'ts

### Do
- Use the paper texture background on every page — it's the foundation of the tactile feel.
- Keep gold scarce. One gold element per screen section is usually enough.
- Let images breathe. The sepia treatment and generous card padding exist for a reason.
- Use SVG ink-wash textures in page heroes to create depth without performance cost.
- Honor the day/night transition with 500ms ease — it should feel like dimming a lamp, not flipping a switch.
- Test heading text at every breakpoint. Long Chinese titles at large clamp values can overflow narrow grids.

### Don't
- Don't add a third accent color. Gold and ink is the entire palette.
- Don't remove the card rotation. It's the single most distinctive gesture of the system.
- Don't use glassmorphism, gradient text, or decorative blur. These belong to a different aesthetic universe.
- Don't add parallax scroll effects. Objects rest on paper; paper doesn't move.
- Don't make the night theme a functional dark mode. It's a mood — lower contrast, warmer tones, a quiet room.
- Don't use pure black (#000) or pure white (#FFF) anywhere. Even the lightbox backdrop is 82% black.
