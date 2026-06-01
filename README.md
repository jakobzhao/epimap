# EpiMap

King County, WA census tract epidemiology direction explorer for research planning.

## What it does

- Uses real CDC PLACES 2025 census tract-level health estimates for 494 King County census tracts.
- Uses a King County ACS snapshot from Census Reporter.
- Uses MapLibre GL JS with Census cartographic tract boundaries for the King County map.
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

- `places-king-tracts-2025.json`: CDC PLACES census tract data, 2025 release.
- `king-county-census.json`: King County ACS snapshot via Census Reporter.
- `king-tracts-2023.geojson`: King County census tract boundaries from the U.S. Census Bureau 2023 cartographic boundary KML.
- `king-tract-data.js`: browser-friendly tract data bundle for direct `file://` opening.
- `king-tracts-2023.js`: browser-friendly geometry bundle for direct `file://` opening.

## GitHub Pages

This is a static app. After pushing to GitHub, enable GitHub Pages from the repository root and serve from the `main` branch.
