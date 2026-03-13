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

Before any strategy or code work, verify the environment is ready. Skipping this step is the #1 cause of mid-workflow failures.

### Resolve project root

All paths below are relative to the **project root** (the directory containing `package.json`). Determine it once and use absolute paths throughout:

```bash
# Find the project root (directory containing package.json)
PROJECT_ROOT="$(cd "$(dirname "$(find . -maxdepth 3 -name package.json -path '*/dera-pm-agent/*' | head -1)")" && pwd)"
# If running from the project already:
PROJECT_ROOT="$(pwd)"
SKILL_DIR="$PROJECT_ROOT/.claude/skills/dera-presentation"
```

### Node.js dependencies

```bash
# 1. Check node exists
node --version || { echo "BLOCKER: Node.js not installed"; exit 1; }

# 2. Install project packages (pptxgenjs, react-icons, sharp, etc.)
if [ ! -d "$PROJECT_ROOT/node_modules/pptxgenjs" ]; then
  echo "Installing Node dependencies..."
  cd "$PROJECT_ROOT" && npm install
fi

# 3. Verify the critical package loads
node -e "require('pptxgenjs')" 2>/dev/null || {
  echo "pptxgenjs not found — running npm install..."
  cd "$PROJECT_ROOT" && npm install
}
```

**NODE_PATH**: Only needed when packages are installed globally. When using the project's `node_modules`, run scripts from the project root and `require()` resolves automatically. If you must use global packages:

```bash
# Auto-detect global node_modules (works on ARM Mac, Intel Mac, Linux)
NODE_PATH="$(npm root -g)" node generate_slides.js
```

### Python dependencies

```bash
# Install QA tools (markitdown for content extraction, Pillow for thumbnails)
pip install "markitdown[pptx]" Pillow defusedxml 2>/dev/null

# Verify
python -c "import markitdown" 2>/dev/null || { echo "BLOCKER: markitdown not installed"; }
```

### System dependencies (QA phase)

These are only needed for visual QA. Check early so you can warn the user:

```bash
# LibreOffice — converts PPTX to PDF
command -v soffice >/dev/null 2>&1 || echo "WARNING: LibreOffice not found — visual QA will be limited. Install: brew install --cask libreoffice"

# Poppler — converts PDF to images
command -v pdftoppm >/dev/null 2>&1 || echo "WARNING: pdftoppm not found — install: brew install poppler"
```

If either is missing, flag it to the user now (not during QA when slides are already generated). Visual QA can still proceed by opening the .pptx file directly, but automated image conversion won't work.

### Quick dependency checklist

| Dependency | Required for | Check command | Install |
|-----------|-------------|---------------|---------|
| Node.js | Slide generation | `node --version` | [nodejs.org](https://nodejs.org) |
| pptxgenjs | Slide generation | `node -e "require('pptxgenjs')"` | `npm install` (project root) |
| react-icons + sharp | Icons in slides | `node -e "require('react-icons/fa')"` | `npm install` (project root) |
| markitdown | Content QA | `python -m markitdown --help` | `pip install "markitdown[pptx]"` |
| LibreOffice | Visual QA (PPTX→PDF) | `command -v soffice` | `brew install --cask libreoffice` |
| Poppler | Visual QA (PDF→images) | `command -v pdftoppm` | `brew install poppler` |
| Pillow | Thumbnail grids | `python -c "import PIL"` | `pip install Pillow` |

**Do NOT proceed to Step 1 until all "Required for: Slide generation" dependencies pass.** QA dependencies can be warnings.

---

## Step 1: Before Writing Any Code

### Load Project Styling

```bash
# Always read the styling guide first (use absolute path from Step 0)
cat "$SKILL_DIR/styling.md"
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

Run scripts from the **project root** so `require()` resolves from `node_modules/`:

```bash
cd "$PROJECT_ROOT" && node generate_slides.js
```

If packages are installed globally instead of locally, auto-detect the path:

```bash
NODE_PATH="$(npm root -g)" node generate_slides.js
```

**Never hardcode** `/opt/homebrew/lib/node_modules` — it only works on ARM Macs.

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
# Convert to images (use absolute path from Step 0)
python "$SKILL_DIR/scripts/office/soffice.py" --headless --convert-to pdf output.pptx
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
