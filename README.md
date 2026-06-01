# EpiMap

King County, WA epidemiology direction explorer for Cindy Zhou's research planning.

## What it does

- Uses real CDC PLACES 2025 county-level health estimates for all 39 Washington counties.
- Uses a King County ACS snapshot from Census Reporter.
- Uses MapLibre GL JS with Census cartographic county boundaries for the Washington county map.
- Helps compare five epidemiology directions:
  - Environmental exposure and chronic disease risk
  - Social vulnerability and health inequity
  - Extreme heat and health risk
  - Respiratory vulnerability
  - Mental health geography
- Generates a short interpretation draft that can be rewritten into a proposal or paper outline.

## Run locally

Open `index.html` directly in a browser, or run a tiny static server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Data

Cached data files live in `data/`:

- `places-wa-counties-2025.json`: CDC PLACES county data, 2025 release.
- `king-county-census.json`: King County ACS snapshot via Census Reporter.
- `wa-counties-2023.geojson`: Washington county boundaries from the U.S. Census Bureau 2023 cartographic boundary KML.
- `king-wa-data.js`: browser-friendly data bundle for direct `file://` opening.
- `wa-counties-2023.js`: browser-friendly geometry bundle for direct `file://` opening.

## GitHub Pages

This is a static app. After pushing to GitHub, enable GitHub Pages from the repository root and serve from the `main` branch.
