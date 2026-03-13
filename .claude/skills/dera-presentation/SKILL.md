---
name: dera-presentation
description: "Use this skill to create professional presentations. Handles everything: content strategy, slide generation via pptxgenjs, and QA. Enforces action titles, layout variety, and brand styling. Auto-detects presentation type (Explain, Pitch, Board, Strategy, Teach) and adapts structure accordingly."
---

Dont make boring slides. Make insights pop with clear action titles, varied layouts, and strong visuals. Always QA for alignment, contrast, and readability before delivering.

## Workflow

```
1. STRATEGY    → Read styling.md, detect mode, draft ghost deck with action titels and layout
2. Brainstorm  → Discuss with user, share your thought and take user feedback on the ghost deck
3. EXECUTE     → Generate via pptxgenjs (see pptxgenjs.md)
4. QA          → Visual inspection via subagent (see qa.md)
```

---

## Step 1: Before Writing Any Code

### Load Project Styling

```bash
# Always read first
cat styling.md
```

Extract: colors, fonts, margins, footer elements.

### Detect Presentation Mode

Read [strategy.md](strategy.md) and classify:

| Mode | Trigger | Structure |
|------|---------|-----------|
| **Explain** | "show how", "walk through", project demo | Context → What → How → Results |
| **Pitch** | "investor", "fundraise", "VC" | Problem → Solution → Market → Ask |
| **Board** | "quarterly", "exec review" | Summary → Metrics → Risks → Decisions |
| **Strategy** | "recommendation", "analysis" | Answer → Analysis → Options → Plan |
| **Teach** | "training", "tutorial" | Why → Concept → Example → Practice |

**Default to Explain** if unclear.

### Draft Ghost Deck

Write slide titles ONLY. Read them aloud:
- Do they tell a complete story?
- Is each title a sentence (not a topic label)?
- Would someone understand the message from titles alone?

**Do NOT proceed until ghost deck passes.**

---

## Step 2: Execute

Read [pptxgenjs.md](pptxgenjs.md) for the full API reference.

### Environment

When running Node.js scripts, always set `NODE_PATH` so globally installed packages resolve correctly:

```bash
NODE_PATH=/opt/homebrew/lib/node_modules node generate_slides.js
```

### Quick Start

```javascript
const pptxgen = require("pptxgenjs");
let pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';  // 13.3" x 7.5"

// Use styling.md colors
const COLORS = {
  primary: '0400F5',
  secondary: '49C2C1',
  text: '242E38',
  background: 'FFFFFF'
};

let slide = pres.addSlide();
slide.background = { color: COLORS.background };

// Action title (sentence, not topic)
slide.addText("MoneyLion AI reduces personalization noise by 50%", {
  x: 0.5, y: 0.3, w: 12.3, h: 0.8,
  fontSize: 28, fontFace: "Calibri", bold: true,
  color: COLORS.primary
});

pres.writeFile({ fileName: "output.pptx" });
```

### Mandatory Checks During Execution

| Rule | Violation |
|------|-----------|
| Action titles | Title is "Overview" instead of insight sentence |
| Layout variety | Same layout 3+ slides in a row |
| Max 5 bullets | Wall of text |
| Visual element | Slide has ONLY text, no shapes/icons/charts |

### Spacing

- 0.5" minimum margins
- 0.3-0.5" between content blocks
- Leave breathing room—don't fill every inch

### Avoid (Common Mistakes)

- **Don't repeat the same layout** — vary columns, cards, and callouts across slides
- **Don't center body text** — left-align paragraphs and lists; center only titles
- **Don't default to blue** — pick colors that reflect the specific topic
- **Don't mix spacing randomly** — choose 0.3" or 0.5" gaps and use consistently
- **Don't style one slide and leave the rest plain** — commit fully or keep it simple throughout
- **Don't create text-only slides** — add images, icons, charts, or visual elements; avoid plain title + bullets
- **Don't forget text box padding** — when aligning lines or shapes with text edges, set `margin: 0` on the text box or offset the shape to account for padding
- **Don't use low-contrast elements** — icons AND text need strong contrast against the background; avoid light text on light backgrounds or dark text on dark backgrounds
- **NEVER use accent lines under titles** — these are a hallmark of AI-generated slides; use whitespace or background color instead

---

## Step 3: QA

Read [qa.md](qa.md) for the full process.

### Quick Version

```bash
# Convert to images
python scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

Then delegate to subagent:

```
Visually inspect these slides. Find issues:
- Overlapping elements
- Text overflow
- Low contrast
- Misaligned elements

[attach slide images]
```

**Do not deliver until QA passes or issues are disclosed.**

---

## File References

| File | Purpose |
|------|---------|
| [strategy.md](strategy.md) | Mode structures, action title rule, anti-patterns |
| [pptxgenjs.md](pptxgenjs.md) | Full API reference, icons, charts, pitfalls |
| [qa.md](qa.md) | 3-phase QA process |
| `styling.md` (project root) | Brand colors, fonts, layout specs |
