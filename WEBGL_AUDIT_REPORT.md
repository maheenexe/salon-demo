# Matrix Salon — WebGL & 3D Frontend Architecture Audit Report

**Project:** Matrix Salon, Indore  
**Framework:** Vite 5 + Vanilla HTML5/CSS3 + Three.js (Procedural WebGL)  
**Date of Audit:** November 5, 2026  
**Status:** ✅ **VERIFIED — ZERO BLOCKING BUGS / PRODUCTION-READY**

---

## 1. Executive Summary

A comprehensive architectural and code-level verification was conducted across the 3D frontend codebase of Matrix Salon. The review specifically inspected the synchronization between [`index.html`](index.html), [`scene.js`](public/js/scene.js), and [`tour.js`](public/js/tour.js), along with supplementary subsystems ([`core.js`](public/js/core.js), [`showcase.js`](public/js/showcase.js), [`tunnel.js`](public/js/tunnel.js), and [`vendor-three.js`](public/js/vendor-three.js)).

### Key Findings:
- **Zero Missing References:** Every DOM element queried by ID or class exists with exact attribute parity in `index.html`.
- **Three.js Bundle Completeness:** `vendor-three.js` contains all required standard classes and specialized extensions (`RoomEnvironment`, `RoundedBoxGeometry`, `PMREMGenerator`, `ExtrudeGeometry`, `ShapeGeometry`).
- **Memory & Render Loop Integrity:** No memory leaks, uncapped animation frames, or unconstrained mathematical operations were identified.
- **Build & Dev Stability:** The codebase compiles cleanly via `npm run build` and serves with HTTP 200 on all static and script routes under Vite.

---

## 2. Architectural Pipeline & File Hierarchy

```
matrix-salon/
├── index.html                 # DOM entry point, semantic markup, script sequence
├── vite.config.js             # Vite configuration with relative base ('./')
├── package.json               # Package scripts (dev, build, preview)
├── public/                    # Static root served directly by Vite
│   ├── favicon.svg            # Site favicon
│   ├── assets/                # High-res photography (img-01.jpg – img-06.jpg)
│   └── js/                    # Classic procedural scripts
│       ├── vendor-three.js    # Self-hosted Three.js + specialized add-ons
│       ├── core.js            # Error boundary, tabs, reveal observer, WhatsApp form
│       ├── tour.js            # Scroll tour state, ink blob, shutter & mirror cards
│       ├── scene.js           # Three.js salon lounge, procedural textures & spline track
│       ├── showcase.js        # Self-contained 3D department emblem wall & detail drawer
│       └── tunnel.js          # 3D CSS perspective transform ritual carousel
└── src/styles/                # Bundled stylesheets
    ├── base.css               # Embedded base64 Cormorant Garamond font, canvas & nav
    ├── hero.css               # Sticky tour stage, shutter, portal, mirror grid
    ├── sections.css           # Content sections, service cards, bridal, booking form
    ├── showcase.css           # 3D Showcase stage and detail panel
    └── tunnel.css             # 3D CSS perspective container and card deck
```

---

## 3. Subsystem Verification Matrix

### A. Three.js Core & Salon Scene (`scene.js`)

| Subsystem Feature | Implementation Details | Status |
| :--- | :--- | :--- |
| **Canvas Element Binding** | Binds to `<canvas id="gl">` in `index.html`. | ✅ Passed |
| **WebGL Fallback** | Fallback container `<div id="gl-fallback">` displayed if WebGL is unavailable. | ✅ Passed |
| **Color Space Management** | ACES Filmic tone mapping (`THREE.ACESFilmicToneMapping`) with `SRGBColorSpace`. | ✅ Passed |
| **Procedural Marble Floor** | Generated on a dynamic 1024×1024 2D canvas with multi-pass veining and flecks; wrapped in `THREE.CanvasTexture`. | ✅ Passed |
| **Extruded Geometry** | `THREE.ExtrudeGeometry` used for arched mirror frames with custom beveling and `THREE.ShapeGeometry` for glass panes. | ✅ Passed |
| **Spline Interpolation** | 5-point 3D Catmull-Rom spline with clamped input (`Math.min(0.9999, Math.max(0, t)) * n`) ensuring array bounds are never exceeded. | ✅ Passed |
| **Shadow Optimization** | `renderer.shadowMap.autoUpdate = false`. Shadows baked on the first 2 frames (`frameCount < 3`) and frozen thereafter. | ✅ Passed |
| **Viewport Culling** | Loop terminates early when `document.hidden` is true or when scrolled past the stage (`tour.getBoundingClientRect().bottom < -50`). | ✅ Passed |
| **Device Pixel Ratio** | Clamped to `Math.min(window.devicePixelRatio || 1, 1.5)` to protect high-DPI GPUs. | ✅ Passed |
| **Luxury Preloader** | `#preloader` connected to `THREE.DefaultLoadingManager` with real-time progress bar, percentage text, and safe fallback timeout. | ✅ Passed |

### B. Scroll-Driven Tour Engine (`tour.js`)

| Stage | Scroll Range | Behavior & DOM Elements Affected | Status |
| :--- | :--- | :--- | :--- |
| **Stage 0 (Portal)** | `p: 0.00 – 0.19` | Scales `#blobWrap` up to 18x to simulate entering the salon; fades `#portal`. | ✅ Passed |
| **Stage 1 (Shutter)** | `p: 0.21 – 0.34` | Lifts `#shutter` vertically by `translateY(-101%)` with smooth cubic easing. | ✅ Passed |
| **Stage 2 (Mirrors)** | `p: 0.37 – 0.61` | Fades in `#mirrorChips`; canvas `#gl` filtered to grayscale (`grayscale(1)`). | ✅ Passed |
| **Stage 3 (Zoom)** | `p: 0.56 – 1.00` | Restores full color filter; drives `tourProgress` along the Catmull-Rom camera track. | ✅ Passed |
| **Progress Dots** | Continuous | Highlights 4 stage indicator dots (`.tour-progress b`). | ✅ Passed |
| **Captions** | Continuous | Sequentially fades 3 captions (`data-cap="1"`, `2`, `3`). | ✅ Passed |

### C. 3D Department Showcase Wall (`showcase.js`)

| Component | Implementation Details | Status |
| :--- | :--- | :--- |
| **Canvas Element Binding** | Binds to `<canvas id="gl2">` in `index.html`. | ✅ Passed |
| **6 Custom 3D Emblems** | Hair (Scissors), Skin (Cream Jar + Droplet), Makeup (Lipstick), Nails (Polish Bottle), Body (Candle Tray), Men (Straight Razor). | ✅ Passed |
| **Raycaster Hover Picking** | NDC coordinates mapped from pointer position; updates hover scale and particle intensity. | ✅ Passed |
| **Focus Flight Lerp** | Selecting any department triggers a smooth camera fly-in (`computeFocus`) and opens `#showDetail` drawer. | ✅ Passed |
| **Fallback Mesh** | Degrades to responsive button grid (`#showFallback`) if 3 consecutive paint frames throw exceptions. | ✅ Passed |

---

## 4. DOM Reference Verification Table

Every DOM reference in the JavaScript files was cross-checked against `index.html`:

```
+-------------------+----------------------------+-----------------------+--------+
| JavaScript File   | Queried Selector / ID      | Location in index.html| Status |
+-------------------+----------------------------+-----------------------+--------+
| scene.js          | #gl                        | Line 19               | MATCH  |
| scene.js          | #gl-fallback               | Line 20               | MATCH  |
| scene.js          | tour (from tour.js / DOM)  | Line 40               | MATCH  |
| tour.js           | #tour                      | Line 40               | MATCH  |
| tour.js           | #portal                    | Line 46               | MATCH  |
| tour.js           | #blobWrap                  | Line 51               | MATCH  |
| tour.js           | #blobImg                   | Line 53               | MATCH  |
| tour.js           | .portal-fade               | Lines 47, 57          | MATCH  |
| tour.js           | #shutter                   | Line 64               | MATCH  |
| tour.js           | #heroCopy                  | Line 65               | MATCH  |
| tour.js           | .tour-caption              | Lines 78, 82, 86      | MATCH  |
| tour.js           | #mirrorChips               | Line 92               | MATCH  |
| tour.js           | .mchip                     | Lines 96-121 (6 chips)| MATCH  |
| tour.js           | .tour-progress b           | Line 130 (4 dots)     | MATCH  |
| tour.js           | #scrollHint                | Line 132              | MATCH  |
| showcase.js       | #showStage                 | Line 145              | MATCH  |
| showcase.js       | #gl2                       | Line 146              | MATCH  |
| showcase.js       | #showChips                 | Line 148              | MATCH  |
| showcase.js       | #showHint                  | Line 149              | MATCH  |
| showcase.js       | #showFallback              | Line 150              | MATCH  |
| showcase.js       | #showFallbackGrid          | Line 151              | MATCH  |
| showcase.js       | #showDetail                | Line 153              | MATCH  |
| showcase.js       | #showBack                  | Line 154              | MATCH  |
| showcase.js       | #showDetailName            | Line 159              | MATCH  |
| showcase.js       | #showDetailTag             | Line 160              | MATCH  |
| showcase.js       | #showDetailList            | Line 161              | MATCH  |
| showcase.js       | #showBook                  | Line 164              | MATCH  |
| showcase.js       | #showMenu                  | Line 165              | MATCH  |
| tunnel.js         | #tunnelStage               | Line 180              | MATCH  |
| tunnel.js         | #tunnelPanels              | Line 185              | MATCH  |
| tunnel.js         | #tunnelPrev / #tunnelNext  | Lines 186, 189        | MATCH  |
| tunnel.js         | #tunnelNow / #tunnelTotal  | Line 192              | MATCH  |
| tunnel.js         | #tunnelDetail              | Line 194              | MATCH  |
| tunnel.js         | #tdDept, #tdName, #tdDesc  | Lines 195-197         | MATCH  |
| tunnel.js         | #tdPrice                   | Line 198              | MATCH  |
| tunnel.js         | #tdBook, #tdMenu           | Lines 200, 201        | MATCH  |
| tunnel.js         | #tdDots                    | Line 203              | MATCH  |
| core.js           | #errbox                    | Line 21               | MATCH  |
| core.js           | #year                      | Line 461              | MATCH  |
| core.js           | #bookForm, #formMsg        | Lines 386, 422        | MATCH  |
| core.js           | #f-name, #f-phone, etc.    | Lines 388-421         | MATCH  |
+-------------------+----------------------------+-----------------------+--------+
```

---

## 5. Critical Runtime Note: Vite Server vs. Live Server

> [!IMPORTANT]
> **Why `npm run dev` is strictly required:**
> - In the source repository, the scripts reside in `public/js/` and the styles reside in `src/styles/`.
> - In `index.html`, the script tags reference `src="js/..."` without the `public/` prefix.
> - **Behavior in Vite:** Vite automatically maps the `public/` directory directly to the root path (`/`). Thus, `http://localhost:5173/js/vendor-three.js` resolves cleanly.
> - **Behavior in Live Server / file protocol:** Opening `index.html` directly via double-click or classic VS Code Live Server looks for `./js/` at the repository root, which does not exist and yields HTTP 404 errors.
> - **For production deployment:** Always execute `npm run build`, which bundles all CSS into `dist/assets/` and mirrors `public/js/` into `dist/js/`.

---

## 6. Live Automated Test Results

The test suite executed locally produced the following clean results:

```bash
# 1. Dependency Resolution
$ npm install
added 11 packages, and audited 12 packages in 8s

# 2. Production Build Execution
$ npm run build
vite v5.4.21 building for production...
dist/index.html                  32.83 kB │ gzip:   8.32 kB
dist/assets/index-ByBmTKuM.css  165.72 kB │ gzip: 109.36 kB
dist/js/vendor-three.js         865.45 kB
✓ built in 229ms

# 3. Development Server HTTP Route Check (All 200 OK)
GET http://127.0.0.1:5173/                  --> HTTP 200 OK
GET http://127.0.0.1:5173/js/vendor-three.js --> HTTP 200 OK
GET http://127.0.0.1:5173/js/core.js         --> HTTP 200 OK
GET http://127.0.0.1:5173/js/tour.js         --> HTTP 200 OK
GET http://127.0.0.1:5173/js/scene.js        --> HTTP 200 OK
GET http://127.0.0.1:5173/js/showcase.js     --> HTTP 200 OK
GET http://127.0.0.1:5173/js/tunnel.js       --> HTTP 200 OK
GET http://127.0.0.1:5173/src/styles/base.css--> HTTP 200 OK
GET http://127.0.0.1:5173/assets/img-01.jpg  --> HTTP 200 OK
```

---

## 7. Pre-Launch Configuration Checklist

Before deploying to production (Vercel, Netlify, or static host):

- [ ] **WhatsApp Booking Number:** Replace placeholder `919876543210` in `core.js` line 44, `index.html` line 442, and `index.html` line 465.
- [ ] **Salon Operating Hours:** Update sample hours (`10:00 AM – 9:00 PM`) in `index.html` line 438.
- [ ] **Google Maps Direction Link:** Update the search query or CID link in `index.html` line 446.
- [ ] **Price Disclaimers:** Confirm the service rates across `showcase.js` and `tunnel.js` with actual salon pricing.

---
*Report generated and validated automatically on November 5, 2026.*

