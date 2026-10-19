# Lumen Grove — "A living canopy in the city"

Award-style, scroll-driven marketing site for a premium residential + business complex.
Client mockup: all names, copy, data and imagery are original placeholders.

**Stack:** Vite + React 18 + TypeScript · React Router v6 (route-level `React.lazy`) ·
GSAP 3 + ScrollTrigger + Flip · Lenis (synced to ScrollTrigger via `gsap.ticker`) ·
Three.js via @react-three/fiber + drei · Zustand · react-hook-form + zod ·
react-i18next (EN + ES, `/en` `/es` route prefixes) · react-helmet-async ·
plain CSS design tokens (`src/styles.css`).

## Run

```bash
npm install
npm run dev      # http://localhost:5173  → redirects to /en
npm run build    # type-safe production build (verify with: npx tsc --noEmit)
npm run preview
```

## Routes

`/en` Home · `/en/3d` 3D explorer · `/en/residences` + `/:unitId` · `/en/business` ·
`/en/retail-spaces` + `/:unitId` · `/en/contact?tab=business` · `/en/about-the-investor` ·
`/en/privacy-policy` · anchors `/en#Around`, `/en#Amenities`. Replace `en` with `es` for the
second locale; the language switcher (menu overlay) preserves the current route.

## Swapping client content

| What | Where |
|---|---|
| Brand, phone | `src/store.ts` (`BRAND`, `PHONE`) + `index.html` meta |
| All UI copy | `src/i18n.ts` (EN/ES dictionaries); long-form copy lives in page components under `src/pages/` |
| Units data | `src/data.ts` — deterministic generators producing **208 residences** + **49 retail/office units**; replace generators with real inventory/CRM data keeping the exported types |
| Images | `public/assets/*` (7 AI-generated photos included) — see `ASSETS_TODO.md` for every slot + generation prompt |
| 3D model | `src/pages/ThreeD.tsx` builds wings A/B/V procedurally; drop in a Draco GLB with drei `useGLTF` (loading % already wired to `THREE.DefaultLoadingManager`) and map meshes to unit ids |
| Promo video | Save film to `public/assets/video/promo.mp4` (component: `VideoModal` in `Business.tsx`, accepts `src`/`poster`) |
| Forms → CRM | `onSubmit` handlers in `src/App.tsx` (newsletter) and `src/pages/Contact.tsx` currently mock `POST /api/inquiry` |
| Permit / brochure / plan PDFs | Placeholder text downloads; point the download helpers at real PDFs |

## Animation system

Reusable primitives in `src/anim.tsx`: `SplitReveal` (masked line reveals), `FadeUp`,
`ParallaxImage`, `RevealImage` (clip-path + scale), `CountUp`, `Magnetic`, `DualRange`,
`PlanSVG` (programmatic floor plans). Every page scopes GSAP work in `gsap.context()` and
reverts on unmount. `prefers-reduced-motion` collapses choreography to instant states;
catalog grids animate with FLIP-style stagger on filter/load-more.

Highlights: preloader with real image-preload % + wipe · hide-on-scroll blurred header ·
full-screen menu with masked links · pinned leaf-parting hero with 01/02/03 statements ·
location accordion with map pins · "Your roots" pinned sequence · horizontal
"View from above" with panorama-filled LG monogram + drifting clouds · payment-plan
count-ups · swaying parallax footer trees · 3D fly-to camera, filter dimming, hotspots,
day/evening toggle, idle auto-orbit, WebGL fallback.

## Placeholders still needing client content

Real GLB model, promo film, permit/brochure/plan PDFs, per-project About photography,
counsel-approved privacy text, CRM endpoint, and final inventory data — full list in
`ASSETS_TODO.md`.

## Project layout

```
src/App.tsx        router, preloader, header/menu, cursor, footer, page transitions
src/anim.tsx       animation utilities + dual-range + SVG floor-plan generator
src/data.ts        seed data (residences, retail, POIs, projects, milestones)
src/i18n.ts        EN/ES dictionaries
src/store.ts       Zustand UI store + brand config
src/styles.css     design tokens + all component styles
src/pages/         Home, Catalogs (residences+retail+details), Business, Contact(+Privacy), About, ThreeD
public/assets/     generated imagery (+ video/ slot)
```
