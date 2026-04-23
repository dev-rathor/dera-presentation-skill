# QA (Required)

**Assume there are problems. Your job is to find them.**

Your first render is almost never correct. Approach QA as a bug hunt, not a confirmation step. If you found zero issues on first inspection, you weren't looking hard enough.

---

## Phase 1: Content QA

Extract text and check against the ghost deck:

```bash
python3 -m markitdown output.pptx
```

**Check against ghost deck table:**

| Check | How to verify |
|-------|---------------|
| Slide count matches | Count slides vs. ghost deck rows |
| Titles match | Every slide title is the action sentence from the ghost deck — not a shortened or reworded version |
| Layout matches | Each slide uses the layout type specified in the ghost deck |
| No placeholder text | `grep -iE "xxxx\|lorem\|ipsum\|placeholder"` returns nothing |
| No missing content | Every slide has body content, not just a title |

**If any check fails, fix before proceeding to visual QA.**

---

## Phase 2: Visual QA

**⚠️ USE SUBAGENTS** — even for 2-3 slides. You've been staring at the code and will see what you expect, not what's there. Subagents have fresh eyes.

### Convert to images

```bash
python3 "$SKILL_DIR/scripts/office/soffice.py" --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

### Subagent prompt

Include the ghost deck table so the subagent knows what each slide should look like:

```
Visually inspect these slides against the ghost deck spec below.

GHOST DECK:
[paste the ghost deck table here]

For EACH slide, check:

1. TITLE: Is it an action sentence (full insight), not a topic label?
2. LAYOUT: Does it match the layout type in the ghost deck?
3. VARIETY: Is this layout different from the previous slide?
4. VISUAL ELEMENT: Does the slide have at least one non-text element (icon, shape, chart, big number)?
5. CANVAS FILL: Is the bottom 30% of the slide empty? Content should fill the canvas.
6. TEXT SIZE: Are all readable text elements 12pt or larger? (footer excluded)
7. CONTRAST: Can you read all text clearly against its background?
8. OVERLAP: Are any elements overlapping, cut off, or colliding?
9. ALIGNMENT: Are similar elements (cards, columns) aligned consistently?

For each slide, report:
- PASS or FAIL per check
- Specific issue description for any FAIL

Read and analyze these images:
1. slide-01.jpg (Expected: [slide 1 title + layout from ghost deck])
2. slide-02.jpg (Expected: [slide 2 title + layout from ghost deck])
...

Be harsh. Report ALL issues, even minor ones.
```

---

## Phase 3: Fix and Verify

1. Fix every issue the subagent flagged
2. Re-render affected slides:
   ```bash
   python3 "$SKILL_DIR/scripts/office/soffice.py" --headless --convert-to pdf output.pptx
   pdftoppm -jpeg -r 150 -f N -l N output.pdf slide-fixed
   ```
3. Re-inspect fixed slides (subagent or self-check)
4. Repeat until a full pass has no new issues

**Do not declare success until you've completed at least one fix-and-verify cycle.**

**Max 3 cycles.** If issues persist after 3 rounds, disclose remaining issues to the user and deliver with known limitations listed.

---

# Dependencies

**These should already be installed by Step 0 in SKILL.md.** If you skipped Step 0, go back and run it now.

### Python (installed via pip)
- `pip install "markitdown[pptx]"` — text extraction for content QA
- `pip install Pillow` — thumbnail grids
- `pip install defusedxml` — safe XML parsing for thumbnail script

### System tools
- **LibreOffice** (`soffice`) — PPTX→PDF conversion. Install: `brew install --cask libreoffice`
- **Poppler** (`pdftoppm`) — PDF→image conversion. Install: `brew install poppler`

### If visual QA tools are missing

Tell the user and offer to QA by opening the .pptx directly. **Do not skip QA.** At minimum, run content QA (Phase 1) — it needs only markitdown and catches the most common failures.
