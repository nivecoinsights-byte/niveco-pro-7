# NIVECO Insights Flutter

This is a clean Flutter rebuild kept separate from the old web/PWA code.

## Phase 1
- Native Flutter UI shell
- NIVECO branding
- Gujarati / English toggle
- IPO list shell
- Saved IPOs
- IPO investment calculator
- No Firebase, Vercel, service worker or web splash dependency

## Build approach
GitHub Actions creates a fresh Android Flutter project, copies this source into it, adds the existing NIVECO eye asset from the repository root, then builds an APK.

Live IPO data will be connected only after the Android shell builds and opens reliably.
