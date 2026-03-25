# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

APE (AsciiDoc Presentation Engine) converts AsciiDoc (.adoc) documents into reveal.js HTML5 presentations. Built on Node.js with asciidoctor and @asciidoctor/reveal.js.

## Commands

```bash
# Install dependencies (also runs postinstall to create reveal.js symlinks and copy plugins)
npm ci

# Build all root .adoc files to HTML
npm run build

# Build all presentations including subdirectories
npm run build *.adoc */*.adoc

# Start dev server with live reload (builds first, then watches .adoc files)
npm start

# Start with a specific presentation
npm start ./example/index.adoc

# Export a presentation to PDF
npm run pdf ./path/index.html ./path/output.pdf
```

## Architecture

**Build pipeline:** AsciiDoc (.adoc) → asciidoctor + @asciidoctor/reveal.js → HTML5 presentation → optional PDF via decktape

**Key files:**
- `server.js` — Development server: watches .adoc files, runs asciidoctor conversion, live-reloads via browser-sync
- `scripts/postinstall.sh` — Post-install setup: symlinks reveal.js into `javascripts/`, copies plugins (copycode, menu, mermaid)
- `stylesheets/nix.css` — Custom reveal.js theme (Inter, Roboto Mono, Space Grotesk fonts)
- `common/docinfo*.html` — Shared HTML header/footer templates injected via AsciiDoc's `:docinfo: shared` attribute

**Presentation structure pattern:**
```
presentation-name/
├── .settings.adoc      # reveal.js configuration attributes
├── index.adoc          # Main file (includes settings and content)
├── includes/           # Modular slide sections
└── images/             # Presentation-specific images
```

**Shared resources:** `common/`, `stylesheets/`, `images/`, `javascripts/reveal.js` (symlink)

## Deployment

- **GitHub Pages:** `.github/workflows/pages.yml` — Node 22, builds and deploys HTML + assets
- **GitLab CI:** `.gitlab-ci.yml` — Node 18, three stages (build → deploy → export with PDF generation)

## Notes

- HTML and PDF files are gitignored (generated artifacts)
- The `javascripts/reveal.js` directory is a symlink created by postinstall, not checked in
- reveal.js plugins (copycode, menu, mermaid) are copied into `javascripts/reveal.js/plugin/` by postinstall