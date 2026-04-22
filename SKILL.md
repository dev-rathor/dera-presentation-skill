---
name: dera-presentation
description: "Use this skill to create professional presentations. Handles everything: content strategy, slide generation via pptxgenjs, and QA. Enforces action titles, layout variety, and brand styling. Auto-detects presentation type (Explain, Pitch, Board, Strategy, Teach) and adapts structure accordingly."
---

Dont make boring slides. Make insights pop with clear action titles, varied layouts, and strong visuals. Always QA for alignment, contrast, and readability before delivering.

## Workflow

```
0. DEPENDENCIES → Verify & install all required tools BEFORE anything else
1. STRATEGY     → Read styling.md, detect mode, draft ghost deck with action titles and layout
2. BRAINSTORM   → Discuss with user, share your thoughts and take user feedback on the ghost deck
3. EXECUTE      → Generate via pptxgenjs (see pptxgenjs.md)
4. QA           → Visual inspection via subagent (see qa.md)
```

---

## Step 0: Dependency Check (MANDATORY — run first, every time)

```bash
PROJECT_ROOT="$(pwd)"
SKILL_DIR="$PROJECT_ROOT/.claude/skills/dera-presentation"
bash "$SKILL_DIR/scripts/check_deps.sh"
```

The script checks Node.js, pptxgenjs, react-icons, sharp, markitdown, LibreOffice, and poppler. It prints PASS/FAIL for each and exits non-zero if any required dependency is missing. If it reports a blocker, fix it before continuing. Warnings (QA tools) are non-blocking.

**NODE_PATH**: When using the project's `node_modules`, run scripts from the project root and `require()` resolves automatically. For global packages: `NODE_PATH="$(npm root -g)" node generate_slides.js`

---

## Step 1: Before Writing Any Code

### Load Project Styling and Reference

```bash
# Always read styling and reference before writing any code
cat "$SKILL_DIR/styling.md"
cat "$SKILL_DIR/reference.md"
```

`styling.md` has colors and typography. `reference.md` shows what a polished 13-slide deck looks like — study the slide-by-slide breakdown and reusable patterns before generating.

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

For each slide, write the **action title** and **layout type**. Example:

```
1. "An AI agent can auto-resolve 60%+ of stuck transfers" — 4-column icon cards
2. "One engineer spends every week manually resolving stuck transfers" — two-column (bullets + big number)
3. "Deterministic workflows can't interpret free-form logs" — comparison columns (red vs. green)
```

**Quality check** — read titles in sequence:
- Do they tell a complete story?
- Is each title a sentence (not a topic label)?
- Would someone understand the message from titles alone?
- Do layouts vary slide to slide?

**Do NOT proceed until ghost deck passes.**

---

## Step 2: Brainstorm — Ghost Deck Review

Present the ghost deck (titles + layouts) to the user for approval.

**Do NOT proceed until the user confirms.** They may reorder, add, cut, or reword.

---

## Step 3: Execute

Read [pptxgenjs.md](pptxgenjs.md) for the full API reference.

### Environment

Run scripts from the **project root** so `require()` resolves from `node_modules/`:

```bash
cd "$PROJECT_ROOT" && node generate_slides.js
```

If packages are installed globally instead of locally, auto-detect the path:

```bash
NODE_PATH="$(npm root -g)" node generate_slides.js
```

**Never hardcode** `/opt/homebrew/lib/node_modules` — it only works on ARM Macs.

### Chunked Generation (MANDATORY for 10+ slides)

For decks with 10+ slides, split generation into chunks to avoid output limits. Smaller decks (≤10 slides) can be written in one pass.

**Chunk strategy:**

1. **Chunk 1 — Boilerplate + slides 1–10:** Write the file with imports, color constants, icon pre-rendering, and the first 10 slides. End `main()` with `writeFile()`.
2. **Run and verify** — Execute `node generate_slides.js` to confirm. Message the user: *"First 10 slides generated. Adding remaining now."*
3. **Chunk 2 — slides 11–N:** Use the Edit tool to insert remaining slides before the `writeFile()` call.
4. **Run and verify** — Execute again and confirm all slides render.

**Rules:**
- **Max ~10 slides per write/edit operation.** 10 slides × ~20 lines = ~200 lines, safe for current models.
- **Always ping the user between chunks** with a brief status update. This prevents the appearance of a hang and resets the response timeout.
- **Use Edit (not Write) for chunk 2+.** Insert new slide code before the `writeFile()` line. This is faster and avoids rewriting the entire file.
- **After each Edit, run the script immediately.** Catch duplicate declarations or syntax errors before adding more code. If Edit reports a match failure, re-read the file before retrying — do not use bash surgery.
- Use consistent variable names (`s1`, `s2`, ... `s11`) — never reuse names across chunks.

**Example ping message between chunks:**
> "Slides 1–10 generated and verified. Adding slides 11–18 now."

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
slide.addText("Our new pipeline reduced processing time by 40%", {
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
- **Don't mix spacing randomly** — choose 0.3" or 0.5" gaps and use consistently
- **Don't style one slide and leave the rest plain** — commit fully or keep it simple throughout
- **Don't create text-only slides** — add images, icons, charts, or visual elements; avoid plain title + bullets
- **Don't forget text box padding** — when aligning lines or shapes with text edges, set `margin: 0` on the text box or offset the shape to account for padding
- **Don't use low-contrast elements** — icons AND text need strong contrast against the background; avoid light text on light backgrounds or dark text on dark backgrounds
- **NEVER use accent lines under titles** — these are a hallmark of AI-generated slides; use whitespace or background color instead

---

## Step 4: QA

Read [qa.md](qa.md) for the full process.

### Quick Version

```bash
# Convert to images (use absolute path from Step 0)
python3 "$SKILL_DIR/scripts/office/soffice.py" --headless --convert-to pdf output.pptx
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
| [styling.md](styling.md) | Brand colors and styling specs |
| [reference.md](reference.md) | What a polished deck looks like — slide-by-slide breakdown + reusable patterns |
