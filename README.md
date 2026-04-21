# DERA Presentation Skill

A Claude Code skill that generates professional PowerPoint presentations using pptxgenjs. Auto-detects presentation type (Explain, Pitch, Board, Strategy, Teach) and adapts structure accordingly.

## What it does

- Drafts a "ghost deck" (action titles only) for approval before generating slides
- Generates `.pptx` files via pptxgenjs with brand-consistent styling
- Enforces action titles, layout variety, and visual elements on every slide
- Runs visual QA by converting slides to images and inspecting for issues

## Installation

### Option A: Project-level (one repo)

Clone the repo and copy it into your project's skills directory:

```bash
git clone https://github.com/dev-rathor/dera-presentation-skill.git
mkdir -p /path/to/your-project/.claude/skills/dera-presentation
cp -r dera-presentation-skill/* /path/to/your-project/.claude/skills/dera-presentation/
```

### Option B: User-level (all projects)

Install to your personal Claude skills directory so it's available everywhere:

```bash
git clone https://github.com/dev-rathor/dera-presentation-skill.git
mkdir -p ~/.claude/skills/dera-presentation
cp -r dera-presentation-skill/* ~/.claude/skills/dera-presentation/
```

### Dependencies

Install the required npm and Python packages:

```bash
# Slide generation
npm install -g pptxgenjs

# Icons and rendering (required)
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

## Verify It Works

After installing, paste these two prompts into Claude Code to confirm everything is working.

**1. Check dependencies**

```
Check all dependencies for the dera-presentation skill. Run the dependency
check script at .claude/skills/dera-presentation/scripts/check_deps.sh and
tell me what's installed and what's missing.
```

You'll see PASS/FAIL for each dependency. Install anything marked FAIL before continuing.

**2. Test with a sample slide**

```
Create a 3-slide sample presentation to test that the presentation skill
is working. Topic: Q3 priorities overview. Save to output/presentations/.
```

If a `.pptx` file appears and opens cleanly in PowerPoint or Keynote, you're good.

## Customization

Edit `.claude/skills/dera-presentation/styling.md` to match your brand colors, fonts, and layout grid. The skill reads this file before generating any slides.

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Skill definition and workflow |
| `strategy.md` | Presentation modes, action title rules, anti-patterns |
| `pptxgenjs.md` | Full pptxgenjs API reference with icons and charts |
| `qa.md` | 3-phase QA process (content, visual, verification loop) |
| `styling.md` | Brand colors and styling specs |
| `scripts/check_deps.sh` | Dependency checker (PASS/FAIL for each requirement) |
| `scripts/office/soffice.py` | LibreOffice wrapper for sandboxed environments |
| `scripts/thumbnail.py` | Thumbnail grid generator for visual QA |
