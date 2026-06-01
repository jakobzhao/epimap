const data = window.EPIMAP_DATA;
const rows = data.places.rows;
const kingCensus = data.kingCensus;
const KING_FIPS = "53033";

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
    short: "用真实健康数据先做 King County 可行性探索",
    title: "King County 的环境健康选题可以如何落地？",
    subtitle: "当前版本使用 CDC PLACES 的真实县级健康指标；PM2.5、绿地、热暴露可作为下一步外部数据接入。",
    badge: "CDC PLACES 真实数据",
    outcomes: ["casthma_crudeprev", "copd_crudeprev", "chd_crudeprev"],
    exposures: ["csmoking_crudeprev", "lpa_crudeprev", "ghlth_crudeprev"],
    tags: ["King County", "WA counties", "生态分析", "环境数据待接入"],
    caveat: "这里的 X 是健康/行为代理变量，不是直接环境暴露；正式论文应接入 EPA/NOAA/绿地数据。",
    next: [
      "把 EPA PM2.5 或 NOAA heat days 加入县级表，替换当前代理变量。",
      "先写成 feasibility pilot：King County 在 WA 县中的疾病负担处于什么位置。",
      "加入 Seattle/King County 内部 census tract 数据后，可以转向更细尺度的空间不平等问题。"
    ]
  },
  {
    id: "svi",
    icon: "layers",
    name: "社会脆弱性与健康不平等",
    short: "未保险、贫困、教育与疾病差异",
    title: "King County 的健康不平等如何解释？",
    subtitle: "用未保险、贫困、教育和健康结果做第一版社会脆弱性解释，再接入正式 SVI。",
    badge: "适合开题",
    outcomes: ["diabetes_crudeprev", "ghlth_crudeprev", "phlth_crudeprev"],
    exposures: ["access2_crudeprev", "lpa_crudeprev", "disability_crudeprev"],
    tags: ["health equity", "CDC PLACES", "ACS", "SVI next"],
    caveat: "正式 SVI 是 CDC/ATSDR 单独数据集；当前页面先用可解释的 PLACES/ACS 指标搭研究框架。",
    next: [
      "把 CDC/ATSDR SVI county 或 tract 数据接入，检验 SVI 与健康结果的关系。",
      "对 King County 做 WA rank，再讨论它是否属于低风险但内部差异大的县。",
      "避免个体层面推断，论文中明确 ecological study limitation。"
    ]
  },
  {
    id: "heat",
    icon: "thermo",
    name: "极端高温与健康风险",
    short: "高温脆弱性、心血管、老年风险",
    title: "热健康风险能否用 King County 做 pilot？",
    subtitle: "用心血管、慢病和脆弱性指标先构建 heat-health vulnerability 的健康侧，再接入 NOAA 热暴露。",
    badge: "气候健康方向",
    outcomes: ["chd_crudeprev", "bphigh_crudeprev", "stroke_crudeprev"],
    exposures: ["disability_crudeprev", "ghlth_crudeprev", "phlth_crudeprev"],
    tags: ["climate health", "heat vulnerability", "NOAA next", "risk index"],
    caveat: "CDC PLACES 给的是健康脆弱性，不是温度暴露；热浪天数需要 NOAA 或 CDC Tracking Network。",
    next: [
      "建立 heat-health vulnerability index：热暴露 + 慢性病 + 老龄化/贫困。",
      "接入 NOAA daily maximum temperature，计算 summer extreme heat days。",
      "解释上连接 cooling centers、城市绿化和热预警。"
    ]
  },
  {
    id: "respiratory",
    icon: "network",
    name: "传染病/呼吸道疾病空间传播",
    short: "呼吸道脆弱性，而不是简单 COVID 复述",
    title: "King County 的呼吸道疾病脆弱性如何表达？",
    subtitle: "先用哮喘、COPD、吸烟、未保险构建 respiratory vulnerability，再视情况接入 flu/COVID/wastewater。",
    badge: "需要收窄",
    outcomes: ["casthma_crudeprev", "copd_crudeprev", "ghlth_crudeprev"],
    exposures: ["csmoking_crudeprev", "access2_crudeprev", "sleep_crudeprev"],
    tags: ["respiratory", "vulnerability", "CDC", "wastewater next"],
    caveat: "PLACES 不代表实时传播；当前页面适合做脆弱性，不适合声称传播路径。",
    next: [
      "把题目写成 post-pandemic respiratory vulnerability，而不是预测传播。",
      "加入 CDC respiratory illness 或 WA wastewater 数据作为外部时间序列。",
      "用人口密度、通勤或 household crowding 解释潜在接触机会。"
    ]
  },
  {
    id: "mental",
    icon: "pulse",
    name: "青少年心理健康地理差异",
    short: "心理健康、睡眠、运动不足",
    title: "King County 的心理健康方向能否成文？",
    subtitle: "用 frequent mental distress、depression、sleep、physical inactivity 做县级探索；青少年题目需再接 YRBS。",
    badge: "叙事贴近 Cindy",
    outcomes: ["mhlth_crudeprev", "depression_crudeprev", "sleep_crudeprev"],
    exposures: ["sleep_crudeprev", "lpa_crudeprev", "ghlth_crudeprev"],
    tags: ["mental health", "sleep", "behavioral health", "YRBS next"],
    caveat: "PLACES 是成年人县级估计；如果题目强调青少年，需要接 CDC YRBS 或地方学校数据。",
    next: [
      "把当前版本作为 adults/community mental health pilot。",
      "如果 Cindy 想写青少年，下一步改用 YRBS 指标并谨慎处理隐私与伦理表述。",
      "讨论睡眠、运动不足和心理健康之间的空间共现，而不是个体诊断。"
    ]
  }
];

let state = {
  direction: directions[0],
  outcome: directions[0].outcomes[0],
  exposure: directions[0].exposures[0],
  selectedFips: KING_FIPS
};

const $ = (id) => document.getElementById(id);

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

function rankFor(items, key, fips) {
  const sorted = items.slice().sort((a, b) => b[key] - a[key]);
  return sorted.findIndex(r => r.countyfips === fips) + 1;
}

function selectedRow() {
  return rows.find(r => r.countyfips === state.selectedFips) || rows.find(r => r.countyfips === KING_FIPS);
}

function kingRow() {
  return rows.find(r => r.countyfips === KING_FIPS);
}

function fmt(value, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits) : "NA";
}

function renderNav() {
  $("directionList").innerHTML = directions.map(d => `
    <button class="direction ${d.id === state.direction.id ? "active" : ""}" data-id="${d.id}" type="button">
      ${icon(d.icon)}
      <span><strong>${d.name}</strong><span>${d.short}</span></span>
    </button>
  `).join("");
  document.querySelectorAll(".direction").forEach(btn => {
    btn.addEventListener("click", () => {
      const direction = directions.find(d => d.id === btn.dataset.id);
      state = {
        direction,
        outcome: direction.outcomes[0],
        exposure: direction.exposures[0],
        selectedFips: KING_FIPS
      };
      render();
    });
  });
}

function renderSelects() {
  $("outcomeSelect").innerHTML = state.direction.outcomes.map(key => `<option value="${key}" ${key === state.outcome ? "selected" : ""}>${measures[key]}</option>`).join("");
  $("exposureSelect").innerHTML = state.direction.exposures.map(key => `<option value="${key}" ${key === state.exposure ? "selected" : ""}>${measures[key]}</option>`).join("");
  $("outcomeSelect").onchange = (event) => { state.outcome = event.target.value; render(); };
  $("exposureSelect").onchange = (event) => { state.exposure = event.target.value; render(); };
}

function renderCountyList() {
  const sorted = rows.slice().sort((a, b) => b[state.outcome] - a[state.outcome]);
  const max = Math.max(...sorted.map(r => r[state.outcome]));
  const min = Math.min(...sorted.map(r => r[state.outcome]));
  $("countyList").innerHTML = sorted.map(row => {
    const pct = ((row[state.outcome] - min) / (max - min || 1)) * 100;
    const active = row.countyfips === state.selectedFips ? "selected" : "";
    return `
      <button class="county-row ${active}" type="button" data-fips="${row.countyfips}">
        <strong>${row.countyname}</strong>
        <span class="bar"><span style="width:${pct}%"></span></span>
        <span class="value">${fmt(row[state.outcome])}</span>
      </button>
    `;
  }).join("");
  document.querySelectorAll(".county-row").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedFips = btn.dataset.fips;
      render();
    });
  });
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
  const king = kingRow();
  const points = rows.map(row => {
    const isSelected = row.countyfips === state.selectedFips;
    const isKing = row.countyfips === KING_FIPS;
    const fill = isSelected ? "#d99116" : isKing ? "#ba5656" : "#0f766e";
    const radius = isSelected ? 6 : isKing ? 5 : 4;
    return `<circle cx="${x(row[state.exposure]).toFixed(1)}" cy="${y(row[state.outcome]).toFixed(1)}" r="${radius}" fill="${fill}" opacity="${isSelected || isKing ? 1 : .68}"><title>${row.countyname}</title></circle>`;
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
    <text x="${x(selected[state.exposure]) + 9}" y="${y(selected[state.outcome]) - 8}" fill="#122528" font-size="12" font-weight="800">${selected.countyname}</text>
    ${state.selectedFips !== KING_FIPS ? `<text x="${x(king[state.exposure]) + 9}" y="${y(king[state.outcome]) + 16}" fill="#ba5656" font-size="12" font-weight="800">King</text>` : ""}
  `;
  $("scatterTitle").textContent = `${measures[state.exposure]} vs. ${measures[state.outcome]}`;
}

function renderMetrics() {
  const selected = selectedRow();
  const king = kingRow();
  const rank = rankFor(rows, state.outcome, KING_FIPS);
  const r = pearson(rows, state.exposure, state.outcome);
  $("kingMetric").textContent = `${fmt(king[state.outcome])}%`;
  $("rankMetric").textContent = `${rank}/39`;
  $("corrMetric").textContent = r.toFixed(2);
  $("popMetric").textContent = kingCensus.population.toLocaleString();
  $("povertyMetric").textContent = `${kingCensus.poverty_pct}%`;
  $("educationMetric").textContent = `${kingCensus.less_than_high_school_pct}%`;
  $("retrieved").textContent = `Retrieved ${data.places.retrieved_at}`;
  $("detail").innerHTML = `
    <div class="detail-line"><span>当前对比县</span><strong>${selected.countyname}, WA</strong></div>
    <div class="detail-line"><span>${measures[state.exposure]}</span><strong>${fmt(selected[state.exposure])}%</strong></div>
    <div class="detail-line"><span>${measures[state.outcome]}</span><strong>${fmt(selected[state.outcome])}%</strong></div>
    <div class="detail-line"><span>King County FIPS</span><strong>53033</strong></div>
    <div class="detail-line"><span>King 45+ min commute</span><strong>${kingCensus.commute_45min_plus_pct}%</strong></div>
  `;
}

function renderInterpretation() {
  const king = kingRow();
  const rank = rankFor(rows, state.outcome, KING_FIPS);
  const r = pearson(rows, state.exposure, state.outcome);
  const direction = state.direction;
  $("interpretation").value =
`${direction.name}

研究对象：King County, Washington。对比样本为 Washington 州 39 个县，健康指标来自 CDC PLACES 2025 county release。

研究问题：在 WA 县级尺度上，${measures[state.exposure]} 是否与 ${measures[state.outcome]} 相关？King County 在这个关系中处于什么位置？

初步发现：King County 的 ${measures[state.outcome]} 为 ${fmt(king[state.outcome])}%，在 WA 39 个县中按高到低排名第 ${rank}。在全州县级横截面中，${measures[state.exposure]} 与 ${measures[state.outcome]} 的 Pearson r 约为 ${r.toFixed(2)}。

解释方式：这说明该方向适合作为 ecological, county-level pilot。它可以帮助 Cindy 先建立研究问题、变量表和图表解释，但不能直接推出个体层面的因果关系。${direction.caveat}`;
  $("nextSteps").innerHTML = direction.next.map(step => `<li>${step}</li>`).join("");
}

function renderSources() {
  $("sources").innerHTML = `
    <li><a href="https://data.cdc.gov/resource/i46a-9kgh" target="_blank" rel="noreferrer">CDC PLACES: County Data, 2025 release</a><div class="small">本项目缓存了 Washington 39 个县的 county-level health estimates。</div></li>
    <li><a href="https://api.censusreporter.org/" target="_blank" rel="noreferrer">Census Reporter API</a><div class="small">King County population, poverty, education, commute snapshot from latest ACS 5-year tables。</div></li>
    <li><a href="./data/places-wa-counties-2025.json">本地 CDC 数据缓存</a><div class="small">适合 GitHub 同步和离线演示。</div></li>
    <li><a href="./data/king-county-census.json">本地 King County ACS 缓存</a><div class="small">用于页面顶部快照与解释面板。</div></li>
  `;
}

function render() {
  renderNav();
  renderSelects();
  $("title").textContent = state.direction.title;
  $("subtitle").textContent = state.direction.subtitle;
  $("dataBadge").textContent = state.direction.badge;
  $("hypothesis").textContent = `假设：在 Washington 县级尺度上，${measures[state.exposure]} 较高的县，可能也会出现较高的 ${measures[state.outcome]}。King County 可作为重点案例解释。`;
  $("tags").innerHTML = state.direction.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
  renderCountyList();
  renderScatter();
  renderMetrics();
  renderInterpretation();
  renderSources();
}

$("resetBtn").addEventListener("click", () => {
  state.outcome = state.direction.outcomes[0];
  state.exposure = state.direction.exposures[0];
  state.selectedFips = KING_FIPS;
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

render();
