# ASSETS_TODO — Lumen Grove

Style brief for every generated image: *photoreal architectural visualization, golden-hour,
soft diffused light, lush greenery integrated into a modern facade with canopy-like organic
patterns, no text, no logos, no people's faces.*

## Already generated (this build)
| File | Used for | Prompt summary |
|---|---|---|
| `public/assets/hero-leaves.jpg` | Home hero leaf layers (3 clipped layers) | Dense layered foliage canopy, golden light through leaves |
| `public/assets/building-exterior.jpg` | Teasers, installment, footer front, Business wings, About | Premium complex, tree-canopy facade, planted terraces |
| `public/assets/residence-interior.jpg` | Residences hero/teaser, Your roots, galleries | Elegant apartment interior, green view, sand + gold |
| `public/assets/business-office.jpg` | Business + Retail heroes, galleries | Sophisticated green office interior |
| `public/assets/panorama-aerial.jpg` | "View from above" panorama + LG text mask, Business panorama | Wide aerial over green city at golden hour |
| `public/assets/amenities-rooftop.jpg` | Amenities bg, Your roots 2, About | Rooftop park + café terrace |
| `public/assets/location-street.jpg` | Location section, Contact cover | Tree-lined premium street, market & cafés |

## Still to produce for a client launch
| Slot | Target size | Prompt / notes |
|---|---|---|
| `hero/leaves-1..3.png` (transparent) | 2400×1600 each | Isolated leaf clusters on transparency for true layered parallax (currently one photo is clip-path layered) |
| `home/horizontal-panorama` (wider) | 6000×1800 | Ultra-wide stitched panorama for the horizontal section |
| `clouds-1/2/3.png` (transparent) | 1600×900 | Puffy cumulus cutouts (currently inline SVG clouds) |
| `home/tree-left.png`, `tree-right.png` (transparent) | 1200×1800 | Full tree cutouts for the scenic footer (currently inline SVG trees) |
| `home/footer-front` | 2200×1400 | Straight-on building elevation for the footer arch |
| `business/windows` | 2400×1600 | Abstract architectural window pattern for the Connectivity pin |
| `business/spaces-options` | 2600×1600 | One elevation where Wings A / B / V + retail band are clearly separable for SVG polygons (adjust `poly` points in `Business.tsx`) |
| `about/slide-1..6` | 2000×1400 each | One hero per past project (currently reused site imagery) |
| `about/desk` | 2000×1400 | Developer's studio desk detail |
| `og-image.jpg` | 1200×630 | Building exterior crop (currently reuses `building-exterior.jpg`) |
| Mobile variants of all heroes | 1200×1600 WebP/AVIF | Generate + wire via `<picture>` when final art lands |
| `public/assets/video/promo.mp4` + poster | 1920×1080, <30 MB | Client promo film; the modal component already accepts `src`/`poster` props |
| `model.glb` (Draco) | <15 MB | Real complex model to replace the procedural 3D wings (`useGLTF` + `THREE.DefaultLoadingManager` hook already reports progress) |
| Building-permit + brochure PDFs | PDF | Currently generated as placeholder text downloads |
| Floor-plan PDFs | PDF | Plans are generated as inline SVG (`PlanSVG`); export per-unit PDFs from CAD |

## Floor plans
Generated programmatically per unit by `PlanSVG` in `src/anim.tsx` (deterministic from
each unit's `planSeed` in `src/data.ts`). Swap with real CAD exports per unit slug when available.
