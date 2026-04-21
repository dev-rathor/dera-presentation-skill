# Gen Digital / MoneyLion Presentation Styling Guide

---

## Color Palette

### Primary Colors

| Role | Hex | Name | Usage |
|------|-----|------|-------|
| **Primary** | `#0400F5` | Gen Digital Blue | Titles, accent bar, bullet points, emphasis |
| **Secondary** | `#49C2C1` | Teal | Supporting accents, highlights |
| **Text Dark** | `#000000` | Black | Primary body text |
| **Text Body** | `#242E38` | Dark Slate | Body text, bullets |
| **Background** | `#FFFFFF` | White | Slide backgrounds |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Purple | `#7D49F2` | Charts, callouts |
| Light Purple | `#C3ABFD` | Secondary accents |
| Light Teal | `#A3E0E0` | Backgrounds, cards |
| Gray | `#92969B` | Muted text, dividers |
| Light Gray | `#E3E3E3` | Subtle backgrounds |

### Semantic Colors

| Role | Hex | Usage |
|------|-----|-------|
| Success | `#38A169` | Positive status, "working", pros |
| Warning | `#D69E2E` | Caution, pending status |
| Error | `#E53E3E` | Problem indicators, cons, blockers |

### UI Colors

| Role | Hex |
|------|-----|
| Hyperlinks | `#5C6169` |
| Visited Links | `#C9CBCD` |

---

## Typography

All presentations use **Calibri**. No other fonts.

### Font Scale (LAYOUT_WIDE — 13.3" x 7.5")

| Level | Size | Weight | Color | Usage |
|-------|------|--------|-------|-------|
| **Title** | 28pt | Bold | Primary Blue | Slide title — one per slide, action sentence |
| **Heading** | 18pt | Bold | Primary Blue | Section headers inside cards or content zones |
| **Body** | 14pt | Regular | Dark Slate | Paragraphs, bullet items, card descriptions |
| **Caption** | 12pt | Regular | Gray | Secondary labels, source lines, sub-descriptions |
| **Metric Value** | 13pt | Bold | Dark Slate | Numbers in comparison rows |
| **Metric Label** | 10pt | Regular | Gray | Labels above metric values |
| **Footer** | 9pt | Regular | Gray | Footer citation + page number |
| **Big Number** | 72pt | Bold | White | Hero stat callouts on colored backgrounds |
| **Big Number Label** | 20pt | Regular | Light Teal | Subtitle beneath big number |

### Rules

- **Never go below 12pt** for any text a viewer needs to read (footer excluded).
- **Title is always 28pt.** Don't shrink it to fit — rewrite the title shorter instead.
- **Body is always 14pt.** If text overflows, cut words — don't reduce font size.
- **White text on colored backgrounds** must be 14pt+ for body, 18pt+ for headings.

---

## Layout Grid (LAYOUT_WIDE — 13.3" x 7.5")

### Vertical Zones

```
┌─────────────────────────────────────────────┐
│  Y 0.35 → Title zone (H: ~1.1")            │
│                                              │
│  Y 1.55 → Content start                     │
│                                              │
│                                              │
│           Content zone                       │
│           (5.15" tall)                       │
│                                              │
│                                              │
│  Y 6.70 → Content end                       │
│                                              │
│  Y 7.00 → Footer (H: 0.3")                 │
└─────────────────────────────────────────────┘
```

| Zone | Y Start | Y End | Height | What goes here |
|------|---------|-------|--------|----------------|
| Title | 0.35 | 1.45 | 1.1" | Action title (28pt bold). May wrap to 2 lines. |
| Content | 1.55 | 6.70 | 5.15" | Cards, charts, flows, callouts — all content. |
| Footer | 7.00 | 7.30 | 0.3" | Citation left-aligned, page number right-aligned. |

### Horizontal Margins

| Edge | Value |
|------|-------|
| Left margin | 0.6" |
| Right margin | 0.6" (content ends at X 12.7") |
| Usable width | 12.1" |

### Content Split Patterns

Use these X-positions for common layouts:

| Layout | Left col | Gap | Right col |
|--------|----------|-----|-----------|
| **50/50** | 0.6" → 6.2" (W: 5.6") | 0.35" | 6.55" → 12.7" (W: 6.15") |
| **35/65** | 0.6" → 4.8" (W: 4.2") | 0.4" | 5.2" → 12.7" (W: 7.5") |
| **3-column** | 0.6" → 4.4" / 4.75" → 8.55" / 8.9" → 12.7" (W: 3.8" each, gap: 0.35") |
| **4-column** | W: 2.65" each, gap: 0.3", starting at 0.6" |
| **Full-width** | 0.6" → 12.7" (W: 12.1") |

---

## Spacing Constants

Use these exact values. Do not mix or improvise.

### Between Elements

| Context | Gap | Notes |
|---------|-----|-------|
| Title bottom → content top | 0.1–0.15" | Content zone starts at Y 1.55 |
| Between cards (vertical) | 0.25" | Tight enough to read as a group |
| Between cards (horizontal) | 0.35" | Column gutters |
| Section heading → content below | 0.35" | e.g., "Pros" label → bullet list |
| Between bullet items | Use default | Don't set `paraSpaceAfter` — let pptxgenjs handle it |
| Content bottom → footer | 0.3" | Breathing room above footer |

### Inside Cards

| Context | Value |
|---------|-------|
| Card internal padding (top) | 0.15–0.2" |
| Card internal padding (sides) | 0.2–0.3" |
| Card accent bar height | 0.08–0.12" |
| Left accent bar width | 0.10–0.12" |

### Pinning Rule

> **Pin repeated elements at fixed Y-positions across cards.**
>
> When multiple cards sit side-by-side, their Pros, Cons, metrics rows, and dividers
> must share the same Y value — even if one card has less content. Uneven content
> creates white space; that's fine. Misaligned labels across cards is not.

---

## Content Fills Canvas

Content should fill the space between Y 1.55 and Y 6.70. If there's dead space:

1. **Extend cards** to fill the content zone height (bottom of card at ~6.65)
2. **Scale up font size** of the lowest-priority text by 1–2pt
3. **Add vertical padding** inside cards rather than leaving gaps between them
4. **Never leave the bottom 30% of a slide empty** — redistribute content or add a callout/status box

If content overflows Y 6.70:

1. **Cut words** — tighten copy
2. **Remove a bullet** — 5 max
3. **Never shrink fonts below the scale** — rewrite instead
