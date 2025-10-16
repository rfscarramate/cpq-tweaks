# CPQ Tweaks - Modular OTA userscripts

This repository contains modular userscripts and a lightweight loader intended to be served via GitHub Pages.
The Android WebView app (Signify CPQ) will fetch `loader.js` and the loader will orchestrate loading modules.

## Structure
- `loader.js` - orchestrator (loads logic core, route-specific logic, and UI on mobile)
- `logic/`
  - `core.js` - utilities and common logic
  - `quotes.js` - logic tweaks for /quotes/
- `ui/`
  - `core.js` - base responsive CSS and helpers (mobile)
  - `quotes.js` - UI tweaks for /quotes/
- `manifest.json` - metadata
- `README.md` - this file

## Publishing (quick)
1. Create repository `cpq-tweaks` on GitHub under `rfscarramate`.
2. Push these files to the `main` branch.
3. In repository Settings → Pages, select `main` branch and `/ (root)` folder -> Save.
4. After ~1–2 minutes, the files will be available at:
   `https://rfscarramate.github.io/cpq-tweaks/loader.js`
   `https://rfscarramate.github.io/cpq-tweaks/logic/core.js`, etc.

## Notes
- Loader is tolerant: on network failure it will continue without throwing visible errors.
- Logic modules load before UI modules (UI loads on mobile only).
- Feel free to edit modules independently; keep exports minimal and avoid polluting global scope unnecessarily.
