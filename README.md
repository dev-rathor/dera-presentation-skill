# DERA Presentation Skill

A Claude Code skill that generates professional PowerPoint presentations using pptxgenjs. Auto-detects presentation type (Explain, Pitch, Board, Strategy, Teach) and adapts structure accordingly.

## What it does

- Drafts a "ghost deck" (action titles only) for approval before generating slides
- Generates `.pptx` files via pptxgenjs with brand-consistent styling
- Enforces action titles, layout variety, and visual elements on every slide
- Runs visual QA by converting slides to images and inspecting for issues

## Installation

### Option A: Project-level (one repo)

Copy the skill folder into your project:

```bash
cp -r .claude/skills/dera-presentation /path/to/your-project/.claude/skills/
```

### Option B: User-level (all projects)

Copy to your personal Claude skills directory:

```bash
mkdir -p ~/.claude/skills
cp -r .claude/skills/dera-presentation ~/.claude/skills/
```

### Dependencies

Install the required npm and Python packages:

```bash
# Slide generation
npm install -g pptxgenjs

# Icons (optional — needed for icon-rich slides)
npm install -g react-icons react react-dom sharp

# QA: text extraction
pip install "markitdown[pptx]"

# QA: thumbnail grids
pip install Pillow defusedxml

# QA: slide-to-image conversion (requires LibreOffice + Poppler)
# macOS:
brew install --cask libreoffice
brew install poppler
```

## Usage

In Claude Code, invoke the skill:

```
/dera-presentation Create a quarterly board review for Q1 2026
```

Or just describe what you need — Claude will detect presentation intent and use the skill automatically.

## Customization

Edit `.claude/skills/dera-presentation/styling.md` (or `styling2.md`) to match your brand colors, fonts, and layout grid. The skill reads these files before generating any slides.

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Skill definition and workflow |
| `strategy.md` | Presentation modes, action title rules, anti-patterns |
| `pptxgenjs.md` | Full pptxgenjs API reference with icons and charts |
| `qa.md` | 3-phase QA process (content, visual, verification loop) |
| `styling.md` | Brand colors, fonts, layout specs |
| `styling2.md` | Extended styling guide with typography scale and spacing |
| `scripts/office/soffice.py` | LibreOffice wrapper for sandboxed environments |
| `scripts/thumbnail.py` | Thumbnail grid generator for visual QA |
