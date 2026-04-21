#!/bin/bash
# Dependency checker for dera-presentation skill
# Exits 0 if all required deps pass, 1 if any blocker found

set -euo pipefail

PASS="\033[32m[PASS]\033[0m"
FAIL="\033[31m[FAIL]\033[0m"
WARN="\033[33m[WARN]\033[0m"

blockers=0
warnings=0

# Resolve project root (directory containing package.json)
if [ -f "./package.json" ]; then
  PROJECT_ROOT="$(pwd)"
elif [ -f "../package.json" ]; then
  PROJECT_ROOT="$(cd .. && pwd)"
else
  PROJECT_ROOT="$(pwd)"
fi

echo "Project root: $PROJECT_ROOT"
echo ""

# --- Required: Slide Generation ---

# Node.js
if command -v node >/dev/null 2>&1; then
  echo -e "$PASS Node.js $(node --version)"
else
  echo -e "$FAIL Node.js — not installed (https://nodejs.org)"
  blockers=$((blockers + 1))
fi

# pptxgenjs
if node -e "require('pptxgenjs')" 2>/dev/null; then
  echo -e "$PASS pptxgenjs"
else
  echo -e "$FAIL pptxgenjs — not found. Run: cd \"$PROJECT_ROOT\" && npm install"
  blockers=$((blockers + 1))
fi

# react-icons + sharp
if node -e "require('react-icons/fa'); require('sharp')" 2>/dev/null; then
  echo -e "$PASS react-icons + sharp"
else
  echo -e "$FAIL react-icons/sharp — not found. Run: cd \"$PROJECT_ROOT\" && npm install"
  blockers=$((blockers + 1))
fi

echo ""

# --- Optional: QA Tools ---

# markitdown (try pip3 first, then pip)
PIP_CMD=""
if command -v pip3 >/dev/null 2>&1; then
  PIP_CMD="pip3"
elif command -v pip >/dev/null 2>&1; then
  PIP_CMD="pip"
fi

if python3 -c "import markitdown" 2>/dev/null || python -c "import markitdown" 2>/dev/null; then
  echo -e "$PASS markitdown"
else
  echo -e "$WARN markitdown — not installed. Run: ${PIP_CMD:-pip3} install \"markitdown[pptx]\" Pillow defusedxml"
  warnings=$((warnings + 1))
fi

# LibreOffice
if command -v soffice >/dev/null 2>&1; then
  echo -e "$PASS LibreOffice"
else
  echo -e "$WARN LibreOffice — not found. Run: brew install --cask libreoffice"
  warnings=$((warnings + 1))
fi

# Poppler (pdftoppm)
if command -v pdftoppm >/dev/null 2>&1; then
  echo -e "$PASS poppler (pdftoppm)"
else
  echo -e "$WARN poppler — not found. Run: brew install poppler"
  warnings=$((warnings + 1))
fi

# --- Summary ---
echo ""
if [ $blockers -gt 0 ]; then
  echo -e "$FAIL $blockers blocker(s) found. Fix required dependencies before proceeding."
  exit 1
elif [ $warnings -gt 0 ]; then
  echo -e "Result: Ready for slide generation. $warnings QA tool(s) missing (see warnings above)."
  exit 0
else
  echo -e "Result: All dependencies installed. Ready to go."
  exit 0
fi
