# QA (Required)

**Assume there are problems. Your job is to find them.**

Your first render is almost never correct. Approach QA as a bug hunt, not a confirmation step. If you found zero issues on first inspection, you weren't looking hard enough.

## Content QA

```bash
python3 -m markitdown output.pptx
```

Check for missing content, typos, wrong order.

**When using templates, check for leftover placeholder text:**

```bash
python3 -m markitdown output.pptx | grep -iE "xxxx|lorem|ipsum|this.*(page|slide).*layout"
```

If grep returns results, fix them before declaring success.

## Visual QA

**⚠️ USE SUBAGENTS** — even for 2-3 slides. You've been staring at the code and will see what you expect, not what's there. Subagents have fresh eyes.

Convert slides to images (see [Converting to Images](#converting-to-images)), then use this prompt:

```
Visually inspect these slides. Assume there are issues — find them.

Look for:
- Overlapping elements (text through shapes, lines through words, stacked elements)
- Text overflow or cut off at edges/box boundaries
- Decorative lines positioned for single-line text but title wrapped to two lines
- Source citations or footers colliding with content above
- Elements too close (< 0.3" gaps) or cards/sections nearly touching
- Uneven gaps (large empty area in one place, cramped in another)
- Insufficient margin from slide edges (< 0.5")
- Columns or similar elements not aligned consistently
- Low-contrast text (e.g., light gray text on cream-colored background)
- Low-contrast icons (e.g., dark icons on dark backgrounds without a contrasting circle)
- Text boxes too narrow causing excessive wrapping
- Leftover placeholder content

For each slide, list issues or areas of concern, even if minor.

Read and analyze these images:
1. /path/to/slide-01.jpg (Expected: [brief description])
2. /path/to/slide-02.jpg (Expected: [brief description])

Report ALL issues found, including minor ones.
```

## Verification Loop

1. Generate slides → Convert to images → Inspect
2. **List issues found** (if none found, look again more critically)
3. Fix issues
4. **Re-verify affected slides** — one fix often creates another problem
5. Repeat until a full pass reveals no new issues

**Do not declare success until you've completed at least one fix-and-verify cycle.**

---

# Converting to Images

Convert presentations to individual slide images for visual inspection:

```bash
python3 scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

This creates `slide-01.jpg`, `slide-02.jpg`, etc.

To re-render specific slides after fixes:

```bash
pdftoppm -jpeg -r 150 -f N -l N output.pdf slide-fixed
```

---

# Dependencies

**These should already be installed by Step 0 in SKILL.md.** If you skipped Step 0, go back and run it now.

### Python (installed via pip)
- `pip install "markitdown[pptx]"` — text extraction for content QA
- `pip install Pillow` — thumbnail grids
- `pip install defusedxml` — safe XML parsing for thumbnail script

### Node.js (installed via npm install in project root)
- `pptxgenjs` — slide generation
- `react-icons`, `react`, `react-dom`, `sharp` — icon rendering

### System tools
- **LibreOffice** (`soffice`) — PPTX→PDF conversion. Auto-configured for sandboxed environments via `scripts/office/soffice.py`. Install: `brew install --cask libreoffice`
- **Poppler** (`pdftoppm`) — PDF→image conversion. Install: `brew install poppler`

### Pre-QA verification

Before running any QA commands, verify tools are available:

```bash
python3 -m markitdown --help >/dev/null 2>&1 || echo "MISSING: pip install 'markitdown[pptx]'"
command -v soffice >/dev/null 2>&1 || echo "MISSING: brew install --cask libreoffice"
command -v pdftoppm >/dev/null 2>&1 || echo "MISSING: brew install poppler"
```

If visual QA tools are missing, tell the user and offer to QA by opening the .pptx directly.