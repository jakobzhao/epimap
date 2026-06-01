const data = window.EPIMAP_TRACT_DATA;
const rows = data.places.rows;
const kingCensus = data.kingCensus;
const DEFAULT_TRACT = "53033000101";

const measures = {
  access2_crudeprev: "Uninsured adults 18-64 (%)",
  bphigh_crudeprev: "High blood pressure (%)",
  casthma_crudeprev: "Current asthma (%)",
  chd_crudeprev: "Coronary heart disease (%)",
  copd_crudeprev: "COPD (%)",
  csmoking_crudeprev: "Current smoking (%)",
  depression_crudeprev: "Diagnosed depression (%)",
  diabetes_crudeprev: "Diabetes (%)",
  ghlth_crudeprev: "Fair or poor health (%)",
  lpa_crudeprev: "No leisure-time physical activity (%)",
  mhlth_crudeprev: "Frequent mental distress (%)",
  obesity_crudeprev: "Obesity (%)",
  phlth_crudeprev: "Frequent physical distress (%)",
  sleep_crudeprev: "Short sleep duration (%)",
  stroke_crudeprev: "Stroke (%)",
  disability_crudeprev: "Any disability (%)"
};

const directions = [
  {
    id: "environment",
    icon: "air",
    name: "环境暴露与慢性病风险",
    short: "先用 tract 健康差异定位候选社区",
    title: "King County 哪些 tract 更适合做环境健康研究？",
    subtitle: "CDC PLACES tract 数据能先定位哮喘/COPD/心血管风险的空间差异，再接入 PM2.5、绿地、道路或热暴露。",
    badge: "tract-level pilot",
    outcomes: ["casthma_crudeprev", "copd_crudeprev", "chd_crudeprev"],
    exposures: ["csmoking_crudeprev", "lpa_crudeprev", "ghlth_crudeprev"],
    tags: ["census tract", "CDC PLACES", "MapLibre", "环境数据下一步"],
    caveat: "当前 X 是健康/行为代理变量，不是直接环境暴露；正式论文应接入 EPA、NOAA、道路、绿地或树冠覆盖等 tract/栅格数据。",
    next: [
      "把 PM2.5、NOAA heat days、tree canopy 或 major road proximity 加到 tract 表。",
      "寻找高哮喘或高 COPD 的 tract 集群，作为环境暴露假设的重点区域。",
      "Methods 里明确 PLACES tract values 是 small-area model-based estimates。"
    ]
  },
  {
    id: "svi",
    icon: "layers",
    name: "社会脆弱性与健康不平等",
    short: "King County 内部 tract 差异最适合这个方向",
    title: "King County 内部健康不平等是否存在 tract-level 空间差异？",
    subtitle: "用未保险、运动不足、残障、糖尿病、总体健康等指标，先构建 tract-level health inequity story。",
    badge: "最适合 tract",
    outcomes: ["diabetes_crudeprev", "ghlth_crudeprev", "phlth_crudeprev"],
    exposures: ["access2_crudeprev", "lpa_crudeprev", "disability_crudeprev"],
    tags: ["health equity", "tract rank", "ACS/SVI next", "生态研究"],
    caveat: "当前页面还没有接入 CDC/ATSDR SVI 或 ACS tract poverty/education；它先用 PLACES 内部变量建立研究问题。",
    next: [
      "接入 CDC/ATSDR SVI tract 数据，检验 SVI 与健康结果之间的空间关系。",
      "对高风险 tract 做分位数地图，说明 King County 并非内部均质。",
      "论文里强调 ecological fallacy，不能把 tract 差异解释为个体差异。"
    ]
  },
  {
    id: "heat",
    icon: "thermo",
    name: "极端高温与健康风险",
    short: "热暴露 + tract 慢病脆弱性",
    title: "King County 哪些 tract 可能更容易受到热健康风险影响？",
    subtitle: "先用心血管、血压、残障和总体健康指标描述健康脆弱性，再接 NOAA 或城市热岛数据。",
    badge: "气候健康方向",
    outcomes: ["chd_crudeprev", "bphigh_crudeprev", "stroke_crudeprev"],
    exposures: ["disability_crudeprev", "ghlth_crudeprev", "phlth_crudeprev"],
    tags: ["heat vulnerability", "chronic disease", "NOAA next", "risk index"],
    caveat: "PLACES 给的是健康脆弱性，不是温度暴露；热浪天数、地表温度或树冠覆盖要作为外部数据层接入。",
    next: [
      "构建 heat-health vulnerability index：慢病负担 + disability + old age/poverty + heat exposure。",
      "接入 NOAA daily maximum temperature 或 Landsat land surface temperature。",
      "解释上连接 cooling centers、城市绿化和热预警。"
    ]
  },
  {
    id: "respiratory",
    icon: "network",
    name: "传染病/呼吸道疾病空间传播",
    short: "做 respiratory vulnerability，而不是传播预测",
    title: "King County 内部 respiratory vulnerability 在哪些 tract 更高？",
    subtitle: "用哮喘、COPD、吸烟、未保险、睡眠不足等指标构建呼吸道疾病脆弱性图谱。",
    badge: "需要收窄",
    outcomes: ["casthma_crudeprev", "copd_crudeprev", "ghlth_crudeprev"],
    exposures: ["csmoking_crudeprev", "access2_crudeprev", "sleep_crudeprev"],
    tags: ["respiratory", "vulnerability", "tract map", "wastewater next"],
    caveat: "PLACES 不是实时感染监测数据；当前页面适合研究脆弱性，不适合声称疾病传播路径。",
    next: [
      "把题目写成 post-pandemic respiratory vulnerability，而不是 COVID spread prediction。",
      "如果要加入传播维度，可接 wastewater、flu/COVID surveillance 或通勤/人口密度。",
      "比较高哮喘和高未保险 tract，讨论医疗可及性。"
    ]
  },
  {
    id: "mental",
    icon: "pulse",
    name: "青少年心理健康地理差异",
    short: "当前 PLACES 是成人估计，YRBS 可作下一步",
    title: "King County 心理健康和睡眠不足是否有 tract-level 空间差异？",
    subtitle: "用 frequent mental distress、depression、short sleep 和运动不足先做社区心理健康探索。",
    badge: "叙事贴近",
    outcomes: ["mhlth_crudeprev", "depression_crudeprev", "sleep_crudeprev"],
    exposures: ["sleep_crudeprev", "lpa_crudeprev", "ghlth_crudeprev"],
    tags: ["mental health", "sleep", "behavioral health", "YRBS next"],
    caveat: "CDC PLACES tract 指标主要是成人 model-based estimates；如果题目坚持青少年，需要接 CDC YRBS 或本地学校/青少年调查数据。",
    next: [
      "先把题目表述为 community mental health geography。",
      "若研究题目想强调青少年，下一步查 YRBS 是否有可用的 King County 或 WA 子区域数据。",
      "讨论睡眠、运动不足和 mental distress 的空间共现，而不是做个体诊断。"
    ]
  }
];

let state = {
  direction: directions[0],
  outcome: directions[0].outcomes[0],
  exposure: directions[0].exposures[0],
  selectedTract: DEFAULT_TRACT
};

const $ = (id) => document.getElementById(id);
let map;
let mapLoaded = false;
let popup;
let bordersVisible = true;

function icon(type) {
  const common = 'stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const paths = {
    air: `<path ${common} d="M4 9h10a3 3 0 1 0-3-3"/><path ${common} d="M4 15h13a3 3 0 1 1-3 3"/><path ${common} d="M4 12h16"/>`,
    layers: `<path ${common} d="m12 3 9 5-9 5-9-5 9-5Z"/><path ${common} d="m3 12 9 5 9-5"/><path ${common} d="m3 16 9 5 9-5"/>`,
    thermo: `<path ${common} d="M14 14.76V5a4 4 0 0 0-8 0v9.76a6 6 0 1 0 8 0Z"/><path ${common} d="M10 9v8"/>`,
    network: `<circle cx="6" cy="6" r="2" ${common}/><circle cx="18" cy="6" r="2" ${common}/><circle cx="12" cy="18" r="2" ${common}/><path ${common} d="m8 7 3 8m5-8-3 8M8 6h8"/>`,
    pulse: `<path ${common} d="M3 12h4l2-5 4 10 2-5h6"/>`
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[type]}</svg>`;
}

function fmt(value, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits) : "NA";
}

function tractLabel(rowOrFips) {
  const fips = typeof rowOrFips === "string" ? rowOrFips : rowOrFips.tractfips;
  const feature = window.KING_TRACTS_GEOJSON.features.find(item => item.properties.GEOID === fips);
  return feature ? feature.properties.NAMELSAD : `Tract ${fips.slice(-6)}`;
}

function pearson(items, xKey, yKey) {
  const pairs = items.map(r => [r[xKey], r[yKey]]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  const n = pairs.length;
  const sx = pairs.reduce((a, [x]) => a + x, 0);
  const sy = pairs.reduce((a, [, y]) => a + y, 0);
  const mx = sx / n;
  const my = sy / n;
  const num = pairs.reduce((a, [x, y]) => a + (x - mx) * (y - my), 0);
  const denX = Math.sqrt(pairs.reduce((a, [x]) => a + (x - mx) ** 2, 0));
  const denY = Math.sqrt(pairs.reduce((a, [, y]) => a + (y - my) ** 2, 0));
  return num / (denX * denY);
}

function avg(key) {
  const vals = rows.map(row => row[key]).filter(Number.isFinite);
  return vals.reduce((sum, value) => sum + value, 0) / vals.length;
}

function rankFor(key, tractFips) {
  const sorted = rows.slice().sort((a, b) => b[key] - a[key]);
  return sorted.findIndex(row => row.tractfips === tractFips) + 1;
}

function quantileRank(key, tractFips) {
  const rank = rankFor(key, tractFips);
  return Math.ceil(rank / rows.length * 100);
}

function selectedRow() {
  return rows.find(row => row.tractfips === state.selectedTract) || rows.find(row => row.tractfips === DEFAULT_TRACT) || rows[0];
}

function topTract(key) {
  return rows.slice().sort((a, b) => b[key] - a[key])[0];
}

function geoBounds(geojson) {
  const bounds = new maplibregl.LngLatBounds();
  const extendCoords = coords => {
    if (typeof coords[0] === "number") {
      bounds.extend(coords);
      return;
    }
    coords.forEach(extendCoords);
  };
  geojson.features.forEach(feature => extendCoords(feature.geometry.coordinates));
  return bounds;
}

function renderNav() {
  $("directionList").innerHTML = directions.map(d => `
    <button class="direction ${d.id === state.direction.id ? "active" : ""}" data-id="${d.id}" type="button" aria-pressed="${d.id === state.direction.id}">
      ${icon(d.icon)}
      <span><strong>${d.name}</strong><span>${d.short}</span></span>
    </button>
  `).join("");
  document.querySelectorAll(".direction").forEach(btn => {
    btn.addEventListener("click", () => {
      const direction = directions.find(d => d.id === btn.dataset.id);
      const firstHigh = topTract(direction.outcomes[0]);
      state = {
        direction,
        outcome: direction.outcomes[0],
        exposure: direction.exposures[0],
        selectedTract: firstHigh.tractfips
      };
      render();
    });
  });
}

function renderSelects() {
  $("outcomeSelect").innerHTML = state.direction.outcomes.map(key => `<option value="${key}" ${key === state.outcome ? "selected" : ""}>${measures[key]}</option>`).join("");
  $("exposureSelect").innerHTML = state.direction.exposures.map(key => `<option value="${key}" ${key === state.exposure ? "selected" : ""}>${measures[key]}</option>`).join("");
  $("outcomeSelect").onchange = event => {
    state.outcome = event.target.value;
    state.selectedTract = topTract(state.outcome).tractfips;
    render();
  };
  $("exposureSelect").onchange = event => {
    state.exposure = event.target.value;
    render();
  };
}

function mapData() {
  const byTract = new Map(rows.map(row => [row.tractfips, row]));
  return {
    ...window.KING_TRACTS_GEOJSON,
    features: window.KING_TRACTS_GEOJSON.features.map(feature => {
      const row = byTract.get(feature.properties.GEOID);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          value: row ? row[state.outcome] : null,
          exposure: row ? row[state.exposure] : null,
          selected: feature.properties.GEOID === state.selectedTract
        }
      };
    })
  };
}

function initMap() {
  if (map || !window.maplibregl) return;
  map = new maplibregl.Map({
    container: "map",
    style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    center: [-122.19, 47.48],
    zoom: 8.2,
    minZoom: 7,
    maxZoom: 12,
    cooperativeGestures: true
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
  map.on("load", () => {
    mapLoaded = true;
    const firstLabelLayer = map.getStyle().layers.find(layer => layer.type === "symbol")?.id;
    map.addSource("king-tracts", { type: "geojson", data: mapData() });
    map.addLayer({
      id: "tract-fill",
      type: "fill",
      source: "king-tracts",
      paint: {
        "fill-color": "#0f766e",
        "fill-opacity": ["case", ["==", ["get", "selected"], true], 0.82, 0.5]
      }
    }, firstLabelLayer);
    map.addLayer({
      id: "tract-line",
      type: "line",
      source: "king-tracts",
      paint: {
        "line-color": ["case", ["==", ["get", "selected"], true], "#7b5c3d", "rgba(255,255,255,0.8)"],
        "line-width": ["case", ["==", ["get", "selected"], true], 2.2, 0.5]
      }
    }, firstLabelLayer);
    map.fitBounds(geoBounds(window.KING_TRACTS_GEOJSON), { padding: 44, duration: 0 });
    map.on("mousemove", "tract-fill", event => {
      map.getCanvas().style.cursor = "pointer";
      const feature = event.features && event.features[0];
      if (!feature) return;
      popup
        .setLngLat(event.lngLat)
        .setHTML(`<strong>${feature.properties.NAMELSAD}</strong><br>${measures[state.outcome]}: ${fmt(Number(feature.properties.value))}%<br>${measures[state.exposure]}: ${fmt(Number(feature.properties.exposure))}%`)
        .addTo(map);
    });
    map.on("mouseleave", "tract-fill", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
    map.on("click", "tract-fill", event => {
      const feature = event.features && event.features[0];
      if (feature) {
        state.selectedTract = feature.properties.GEOID;
        render();
      }
    });
    updateMap();
  });
}

function updateMap() {
  const values = rows.map(row => row[state.outcome]).filter(Number.isFinite);
  const min = Math.min(...values);
  const max = Math.max(...values);
  $("legendTitle").textContent = measures[state.outcome];
  $("legendMin").textContent = `${fmt(min)}%`;
  $("legendMax").textContent = `${fmt(max)}%`;
  if (!mapLoaded) return;
  map.getSource("king-tracts").setData(mapData());
  map.setPaintProperty("tract-fill", "fill-color", ["case",
    ["==", ["get", "selected"], true], "#b9781f",
    ["interpolate", ["linear"], ["get", "value"],
      min, "#dcefed",
      (min + max) / 2, "#5f989a",
      max, "#275f68"
    ]
  ]);
}

function renderScatter() {
  const svg = $("scatter");
  const width = 540;
  const height = 332;
  const pad = { left: 58, right: 20, top: 38, bottom: 52 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const xVals = rows.map(r => r[state.exposure]);
  const yVals = rows.map(r => r[state.outcome]);
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const yMin = Math.min(...yVals);
  const yMax = Math.max(...yVals);
  const x = v => pad.left + ((v - xMin) / (xMax - xMin || 1)) * plotW;
  const y = v => pad.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;
  const r = pearson(rows, state.exposure, state.outcome);
  const xMean = xVals.reduce((a, v) => a + v, 0) / xVals.length;
  const yMean = yVals.reduce((a, v) => a + v, 0) / yVals.length;
  const slope = r * (Math.sqrt(yVals.reduce((a, v) => a + (v - yMean) ** 2, 0)) / Math.sqrt(xVals.reduce((a, v) => a + (v - xMean) ** 2, 0)));
  const intercept = yMean - slope * xMean;
  const lineY1 = intercept + slope * xMin;
  const lineY2 = intercept + slope * xMax;
  const selected = selectedRow();
  const points = rows.map(row => {
    const active = row.tractfips === state.selectedTract;
    return `<circle cx="${x(row[state.exposure]).toFixed(1)}" cy="${y(row[state.outcome]).toFixed(1)}" r="${active ? 6 : 3.2}" fill="${active ? "#d99116" : "#0f766e"}" opacity="${active ? 1 : .55}"><title>${tractLabel(row)}</title></circle>`;
  }).join("");
  svg.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="transparent"/>
    <g stroke="#d9e4e2" stroke-width="1">
      ${[0, .25, .5, .75, 1].map(t => {
        const gx = pad.left + t * plotW;
        const gy = pad.top + t * plotH;
        return `<line x1="${gx}" x2="${gx}" y1="${pad.top}" y2="${height - pad.bottom}"/><line x1="${pad.left}" x2="${width - pad.right}" y1="${gy}" y2="${gy}"/>`;
      }).join("")}
    </g>
    <line x1="${x(xMin)}" y1="${y(lineY1)}" x2="${x(xMax)}" y2="${y(lineY2)}" stroke="#3f6f9f" stroke-width="3" opacity=".75"/>
    ${points}
    <text x="${pad.left}" y="${height - 16}" fill="#617174" font-size="12">${measures[state.exposure]}</text>
    <text x="15" y="${pad.top + 10}" fill="#617174" font-size="12" transform="rotate(-90 15 ${pad.top + 10})">${measures[state.outcome]}</text>
    <text x="${Math.min(width - 115, x(selected[state.exposure]) + 9)}" y="${Math.max(18, y(selected[state.outcome]) - 8)}" fill="#122528" font-size="12" font-weight="800">${tractLabel(selected).replace("Census ", "")}</text>
  `;
  $("scatterTitle").textContent = `${measures[state.exposure]} vs. ${measures[state.outcome]}`;
}

function renderMetrics() {
  const selected = selectedRow();
  const rank = rankFor(state.outcome, selected.tractfips);
  const r = pearson(rows, state.exposure, state.outcome);
  $("kingMetric").textContent = `${fmt(selected[state.outcome])}%`;
  $("rankMetric").textContent = `${rank}/494`;
  $("corrMetric").textContent = r.toFixed(2);
  $("popMetric").textContent = kingCensus.population.toLocaleString();
  $("povertyMetric").textContent = `${kingCensus.poverty_pct}%`;
  $("educationMetric").textContent = `${kingCensus.less_than_high_school_pct}%`;
  $("retrieved").textContent = `Retrieved ${data.places.retrieved_at}`;
  $("detail").innerHTML = `
    <div class="detail-line"><span>当前 tract</span><strong>${tractLabel(selected)}</strong></div>
    <div class="detail-line"><span>${measures[state.exposure]}</span><strong>${fmt(selected[state.exposure])}%</strong></div>
    <div class="detail-line"><span>${measures[state.outcome]}</span><strong>${fmt(selected[state.outcome])}%</strong></div>
    <div class="detail-line"><span>King County average</span><strong>${fmt(avg(state.outcome))}%</strong></div>
    <div class="detail-line"><span>Outcome percentile</span><strong>Top ${quantileRank(state.outcome, selected.tractfips)}%</strong></div>
  `;
}

function renderInterpretation() {
  const selected = selectedRow();
  const rank = rankFor(state.outcome, selected.tractfips);
  const r = pearson(rows, state.exposure, state.outcome);
  const direction = state.direction;
  $("interpretation").value =
`${direction.name}

研究对象：King County, Washington 的 494 个 census tracts。健康指标来自 CDC PLACES 2025 census tract GIS-friendly release。

研究问题：在 King County 内部，${measures[state.exposure]} 是否与 ${measures[state.outcome]} 的 tract-level 空间差异相关？哪些 tract 可以作为高风险或高脆弱性社区的候选案例？

初步发现：当前选中的 ${tractLabel(selected)} 的 ${measures[state.outcome]} 为 ${fmt(selected[state.outcome])}%，在 494 个 King County tracts 中按高到低排名第 ${rank}。King County tract 平均值约为 ${fmt(avg(state.outcome))}%。在 tract-level 横截面中，${measures[state.exposure]} 与 ${measures[state.outcome]} 的 Pearson r 约为 ${r.toFixed(2)}。

解释方式：这比县级分析更适合 tract-level 公共健康研究，因为它能展示 King County 内部的空间不平等。${direction.caveat}`;
  $("nextSteps").innerHTML = direction.next.map(step => `<li>${step}</li>`).join("");
}

function renderSources() {
  $("sources").innerHTML = `
    <li><a href="https://data.cdc.gov/resource/yjkw-uj5s" target="_blank" rel="noreferrer">CDC PLACES: Census Tract Data, 2025 release</a><div class="small">本项目缓存了 King County 494 个 census tracts 的 tract-level health estimates。</div></li>
    <li><a href="https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.2023.html" target="_blank" rel="noreferrer">U.S. Census 2023 Cartographic Boundary Files</a><div class="small">Washington census tract KML，页面只保留 King County tracts。</div></li>
    <li><a href="./data/places-king-tracts-2025.json">本地 CDC tract 数据缓存</a><div class="small">适合 GitHub 同步和离线演示。</div></li>
    <li><a href="./data/king-tracts-2023.geojson">本地 King County tract GeoJSON</a><div class="small">MapLibre 使用的真实 tract 边界。</div></li>
  `;
}

function render() {
  renderNav();
  renderSelects();
  $("title").textContent = state.direction.title;
  $("subtitle").textContent = state.direction.subtitle;
  $("dataBadge").textContent = state.direction.badge;
  $("hypothesis").textContent = `假设：在 King County 的 census tract 尺度上，${measures[state.exposure]} 较高的 tract，可能也会出现较高的 ${measures[state.outcome]}。`;
  $("tags").innerHTML = state.direction.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
  initMap();
  updateMap();
  renderScatter();
  renderMetrics();
  renderInterpretation();
  renderSources();
}

$("resetBtn").addEventListener("click", () => {
  state.outcome = state.direction.outcomes[0];
  state.exposure = state.direction.exposures[0];
  state.selectedTract = topTract(state.outcome).tractfips;
  render();
});

$("copyBtn").addEventListener("click", async () => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText($("interpretation").value);
  } else {
    $("interpretation").focus();
    $("interpretation").select();
    document.execCommand("copy");
  }
  $("toast").classList.add("show");
  window.setTimeout(() => $("toast").classList.remove("show"), 1400);
});

$("resetView").addEventListener("click", () => {
  if (!mapLoaded) return;
  map.fitBounds(geoBounds(window.KING_TRACTS_GEOJSON), { padding: 44, duration: 450 });
});

$("toggleBorders").addEventListener("click", event => {
  if (!mapLoaded) return;
  bordersVisible = !bordersVisible;
  map.setLayoutProperty("tract-line", "visibility", bordersVisible ? "visible" : "none");
  event.currentTarget.setAttribute("aria-pressed", String(bordersVisible));
});

$("welcomeClose").addEventListener("click", () => {
  $("welcomePanel").hidden = true;
  $("welcomeBackdrop").hidden = true;
});

$("welcomeBtn").addEventListener("click", () => {
  $("welcomePanel").hidden = false;
  $("welcomeBackdrop").hidden = false;
});

$("welcomeBackdrop").addEventListener("click", () => {
  $("welcomePanel").hidden = true;
  $("welcomeBackdrop").hidden = true;
});

state.selectedTract = topTract(state.outcome).tractfips;
render();
