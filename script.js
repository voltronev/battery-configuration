// ===== State Management =====
let currentStep = 1;
let config = {
    cellType: '18650',
    cellVoltage: 3.7,
    cellCapacity: 3000,
    cellCount: 4,
    cellLength: 65,
    cellDiameter: 18,
    seriesCells: 2,
    parallelCells: 2,
    connectionType: 'series',
    bmsProtection: true,
    maxDischarge: 30,
    outputConnector: 'xt60',
    balanceConnector: 'jst-xh'
};

// ===== DOM Elements =====
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const generateBtn = document.getElementById('generate-btn');
const diagramCanvas = document.getElementById('diagram-canvas');

// ===== Step Navigation =====
function updateStep(newStep) {
    document.querySelectorAll('.config-section').forEach(section => {
        section.classList.remove('active');
    });

    const currentSection = document.querySelector(`[data-section="${newStep}"]`);
    if (currentSection) {
        currentSection.classList.add('active');
    }

    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum < newStep) {
            step.classList.add('completed');
        } else if (stepNum === newStep) {
            step.classList.add('active');
        }
    });

    document.querySelectorAll('.step-line').forEach((line, index) => {
        if (index < newStep - 1) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });

    prevBtn.style.display = newStep === 1 ? 'none' : 'inline-flex';
    nextBtn.style.display = newStep === 3 ? 'none' : 'inline-flex';
    generateBtn.style.display = newStep === 3 ? 'inline-flex' : 'none';

    currentStep = newStep;
}

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        updateStep(currentStep - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentStep < 3) {
        updateStep(currentStep + 1);
        updateCalculations();
    }
});

generateBtn.addEventListener('click', () => {
    generateDiagram();
    showNotification('Connection diagram generated successfully!', 'success');

    // Build the 3D viewer URL with current config
    const params = new URLSearchParams({
        s: config.seriesCells,
        p: config.parallelCells,
        type: config.cellType,
        d: config.cellDiameter || 18,
        l: config.cellLength || 65,
        bms: config.bmsProtection ? 1 : 0,
        voltage: config.cellVoltage,
        capacity: config.cellCapacity,
        maxA: config.maxDischarge,
        connector: config.outputConnector
    });
    const url3d = `3d-viewer.html?${params.toString()}`;

    // Inject glow keyframe once
    if (!document.getElementById('glow-style')) {
        const glowStyle = document.createElement('style');
        glowStyle.id = 'glow-style';
        glowStyle.textContent = `@keyframes glow3d{0%,100%{box-shadow:0 0 8px rgba(0,217,255,0.35)}50%{box-shadow:0 0 22px rgba(0,217,255,0.75)}}`;
        document.head.appendChild(glowStyle);
    }

    // Place button in dedicated container
    const container = document.getElementById('btn-3d-container');
    container.innerHTML = `
        <a href="${url3d}" style="
            display:flex; align-items:center; justify-content:center; gap:0.5rem;
            background:linear-gradient(135deg,rgba(0,217,255,0.15),rgba(123,97,255,0.15));
            border:1.5px solid #00D9FF; border-radius:12px;
            padding:0.65rem 1.2rem; color:#00D9FF;
            font-size:0.85rem; font-weight:700; text-decoration:none;
            animation:glow3d 2s ease-in-out infinite; width:100%;
            font-family:'Inter',sans-serif; letter-spacing:0.5px;
        ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            View Full 3D Wired Pack
        </a>`;
});

// ===== Form Input Handlers =====
document.getElementById('cell-type').addEventListener('change', (e) => {
    config.cellType = e.target.value;
    // Auto-update dimensions based on type
    switch (config.cellType) {
        case '18650':
            config.cellDiameter = 18;
            config.cellLength = 65;
            break;
        case '21700':
            config.cellDiameter = 21;
            config.cellLength = 70;
            break;
        case '26650':
            config.cellDiameter = 26;
            config.cellLength = 65;
            break;
        case '32650':
            config.cellDiameter = 32;
            config.cellLength = 65;
            break;
        case 'pouch':
            // defaults or keep previous
            break;
    }
    document.getElementById('cell-diameter').value = config.cellDiameter;
    document.getElementById('cell-length').value = config.cellLength;
    updateCalculations();
});

document.getElementById('cell-length').addEventListener('input', (e) => {
    config.cellLength = parseFloat(e.target.value) || 65;
    updateCalculations();
});

document.getElementById('cell-diameter').addEventListener('input', (e) => {
    config.cellDiameter = parseFloat(e.target.value) || 18;
    updateCalculations();
});

document.getElementById('cell-voltage').addEventListener('input', (e) => {
    config.cellVoltage = parseFloat(e.target.value) || 3.7;
    updateCalculations();
});

document.getElementById('cell-capacity').addEventListener('input', (e) => {
    config.cellCapacity = parseInt(e.target.value) || 3000;
    updateCalculations();
});

document.getElementById('cell-count').addEventListener('input', (e) => {
    config.cellCount = parseInt(e.target.value) || 4;
    updateCalculations();
});

document.getElementById('series-cells').addEventListener('input', (e) => {
    config.seriesCells = parseInt(e.target.value) || 1;
    updatePackConfig();
    updateCalculations();
});

document.getElementById('parallel-cells').addEventListener('input', (e) => {
    config.parallelCells = parseInt(e.target.value) || 1;
    updatePackConfig();
    updateCalculations();
});

document.querySelectorAll('input[name="connection-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        config.connectionType = e.target.value;
        updateCalculations();
    });
});

document.getElementById('bms-protection').addEventListener('change', (e) => {
    config.bmsProtection = e.target.checked;
});

document.getElementById('max-discharge').addEventListener('input', (e) => {
    config.maxDischarge = parseInt(e.target.value) || 30;
    updateCalculations();
});

document.getElementById('output-connector').addEventListener('change', (e) => {
    config.outputConnector = e.target.value;
});

document.getElementById('balance-connector').addEventListener('change', (e) => {
    config.balanceConnector = e.target.value;
});

// ===== Calculations =====
function updatePackConfig() {
    const packConfig = `${config.seriesCells}S${config.parallelCells}P`;
    const totalCells = config.seriesCells * config.parallelCells;

    document.getElementById('pack-config').textContent = packConfig;
    document.getElementById('total-cells').textContent = totalCells;
}

function updateCalculations() {
    const packVoltage = (config.cellVoltage * config.seriesCells).toFixed(1);
    const maxVoltage = (4.2 * config.seriesCells).toFixed(1);
    const minVoltage = (3.0 * config.seriesCells).toFixed(1);
    const packCapacity = config.cellCapacity * config.parallelCells;
    const totalEnergy = (packVoltage * packCapacity / 1000).toFixed(1);
    const maxPower = (packVoltage * config.maxDischarge).toFixed(0);
    const packConfig = `${config.seriesCells}S${config.parallelCells}P`;

    // Calculate Pack Dimensions (Vertical orientation)
    // Width = Series Cells * (Diameter + 1mm spacing)
    // Depth = Parallel Cells * (Diameter + 1mm spacing)
    // Height = Cell Length + 2mm (busbars)
    const spacing = 1; // mm spacing between cells
    const packWidth = (config.seriesCells * (config.cellDiameter + spacing)).toFixed(1);
    const packDepth = (config.parallelCells * (config.cellDiameter + spacing)).toFixed(1);
    const packHeight = (config.cellLength + 2).toFixed(1);

    const packVolume = ((packWidth * packDepth * packHeight) / 1000).toFixed(0); // in cm³

    document.getElementById('stat-voltage').textContent = `${packVoltage}V`;
    document.getElementById('stat-capacity').textContent = `${packCapacity}mAh`;
    document.getElementById('stat-energy').textContent = `${totalEnergy}Wh`;
    document.getElementById('stat-power').textContent = `${maxPower}W`;

    document.getElementById('spec-config').textContent = packConfig;
    document.getElementById('spec-nominal').textContent = `${packVoltage}V`;
    document.getElementById('spec-max-voltage').textContent = `${maxVoltage}V`;
    document.getElementById('spec-min-voltage').textContent = `${minVoltage}V`;
    document.getElementById('spec-capacity').textContent = `${packCapacity}mAh`;
    document.getElementById('spec-discharge').textContent = `${config.maxDischarge}A`;

    // Update new dimension specs
    const dimensionsEl = document.getElementById('spec-dimensions');
    const volumeEl = document.getElementById('spec-volume');
    if (dimensionsEl) dimensionsEl.textContent = `${packWidth} × ${packDepth} × ${packHeight} mm`;
    if (volumeEl) volumeEl.textContent = `${packVolume} cm³`;
}

// ===== Professional Diagram Generation =====
function mkSVG(tag, attrs, parent) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (parent) parent.appendChild(el);
    return el;
}
function svTxt(parent, x, y, text, col, size, weight, anchor) {
    const t = mkSVG('text', { x, y, fill: col || '#fff', 'font-size': size || 11, 'font-weight': weight || '600', 'font-family': 'Inter,sans-serif', 'text-anchor': anchor || 'middle', 'dominant-baseline': 'middle' }, parent);
    t.textContent = text; return t;
}
function wLine(parent, x1, y1, x2, y2, col, w, dash) {
    return mkSVG('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': w || 3, 'stroke-linecap': 'round', 'stroke-dasharray': dash || '' }, parent);
}
function wPath(parent, d, col, w, dash) {
    return mkSVG('path', { d, stroke: col, 'stroke-width': w || 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': dash || '' }, parent);
}

function generateDiagram() {
    const canvas = document.getElementById('diagram-canvas');
    canvas.innerHTML = '';
    const S = config.seriesCells, P = config.parallelCells, hasBMS = config.bmsProtection;
    const CW = 54, CH = 88, CRX = 10, CGAP = 18, RGAP = 10, PAD = 55, TPAD = 65;
    const packW = S * CW + (S - 1) * CGAP, packH = P * CH + (P - 1) * RGAP;
    const packX = PAD + 55, packY = TPAD + 28;
    const BW = 155, BH = Math.max(160, packH * 0.9);
    const BX = packX + packW + 130, BY = packY + packH / 2 - BH / 2;
    const LX = BX + BW + 65, LW = 95, LH = 52, LY = BY + 20, CY2 = LY + LH + 28;
    const TW = LX + LW + PAD + 10, TH = packY + packH + 110;

    const svg = mkSVG('svg', { width: '100%', height: '100%', viewBox: `0 0 ${TW} ${TH}`, preserveAspectRatio: 'xMidYMid meet', style: 'display:block' }, canvas);
    const defs = mkSVG('defs', {}, svg);

    // Gradients
    const cg = mkSVG('linearGradient', { id: 'cg', x1: '0%', y1: '0%', x2: '100%', y2: '0%' }, defs);
    [['0%', '#2d5a2d'], ['35%', '#4CAF50'], ['65%', '#4CAF50'], ['100%', '#2d5a2d']].forEach(([o, c]) => { const s = mkSVG('stop', { offset: o }, cg); s.style.stopColor = c; });
    const bg2 = mkSVG('linearGradient', { id: 'bg2', x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, defs);
    [['0%', '#c0392b'], ['50%', '#e74c3c'], ['100%', '#922b21']].forEach(([o, c]) => { const s = mkSVG('stop', { offset: o }, bg2); s.style.stopColor = c; });
    const ng = mkSVG('linearGradient', { id: 'ng', x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, defs);
    [['0%', '#CDAA00'], ['50%', '#B8860B'], ['100%', '#7B5800']].forEach(([o, c]) => { const s = mkSVG('stop', { offset: o }, ng); s.style.stopColor = c; });
    const flt = mkSVG('filter', { id: 'sh', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs);
    mkSVG('feDropShadow', { dx: 1, dy: 2, stdDeviation: 3, 'flood-color': 'rgba(0,0,0,0.7)' }, flt);

    // BG
    mkSVG('rect', { x: 0, y: 0, width: TW, height: TH, fill: '#0d1117' }, svg);
    const pat = mkSVG('pattern', { id: 'grd', width: 22, height: 22, patternUnits: 'userSpaceOnUse' }, defs);
    mkSVG('path', { d: 'M 22 0 L 0 0 0 22', fill: 'none', stroke: '#161d2e', 'stroke-width': 0.6 }, pat);
    mkSVG('rect', { x: 0, y: 0, width: TW, height: TH, fill: 'url(#grd)' }, svg);

    // Title
    mkSVG('rect', { x: PAD, y: 12, width: TW - PAD * 2, height: 28, rx: 6, fill: 'rgba(0,217,255,0.05)', stroke: 'rgba(0,217,255,0.18)', 'stroke-width': 1 }, svg);
    svTxt(svg, TW / 2, 26, `${S}S${P}P · ${config.cellType} · ${(config.cellVoltage * S).toFixed(1)}V · ${config.cellCapacity * P}mAh`, '#00D9FF', 12, '700');

    // Pack boundary
    const BP = 22;
    mkSVG('rect', { x: packX - BP, y: packY - BP, width: packW + BP * 2, height: packH + BP * 2, rx: 10, fill: 'rgba(21,101,192,0.05)', stroke: '#1565C0', 'stroke-width': 1.8, 'stroke-dasharray': '6 3' }, svg);
    svTxt(svg, packX - BP, packY - BP - 10, 'Battery Pack', '#5C85D6', 10, '600', 'start');

    // Bus bars
    const topY = packY - 14, botY = packY + packH + 14;
    mkSVG('rect', { x: packX - 2, y: topY - 5, width: packW + 4, height: 10, rx: 3, fill: '#c0392b', filter: 'url(#sh)' }, svg);
    mkSVG('rect', { x: packX - 2, y: botY - 5, width: packW + 4, height: 10, rx: 3, fill: '#2c2c2c', stroke: '#555', 'stroke-width': 1, filter: 'url(#sh)' }, svg);
    svTxt(svg, packX - BP - 10, topY, 'B+', '#e74c3c', 10, '800');
    svTxt(svg, packX - BP - 10, botY, 'B−', '#888', 10, '800');

    // Nickel strips between columns
    for (let s = 0; s < S - 1; s++) {
        const x1 = packX + s * (CW + CGAP) + CW;
        mkSVG('rect', { x: x1, y: topY - 9, width: CGAP, height: 18, rx: 2, fill: 'url(#ng)' }, svg);
        mkSVG('rect', { x: x1, y: botY - 7, width: CGAP, height: 14, rx: 2, fill: '#555' }, svg);
        wLine(svg, x1 + CGAP / 2, topY, x1 + CGAP / 2, botY, '#B8860B', 1.5, '5 3');
    }

    // Cells
    const tapDots = [];
    tapDots.push({ x: packX + CW / 2, y: botY + 5, lbl: 'B-' });
    for (let s = 0; s < S - 1; s++) tapDots.push({ x: packX + s * (CW + CGAP) + CW + CGAP / 2, y: topY - 9, lbl: `${s + 1}` });
    tapDots.push({ x: packX + (S - 1) * (CW + CGAP) + CW / 2, y: topY - 9, lbl: 'B+' });

    for (let s = 0; s < S; s++) {
        const cx = packX + s * (CW + CGAP);
        for (let p = 0; p < P; p++) {
            const cy = packY + p * (CH + RGAP);
            const g = mkSVG('g', {}, svg);
            mkSVG('rect', { x: cx, y: cy, width: CW, height: CH, rx: CRX, fill: 'url(#cg)', stroke: '#2E7D32', 'stroke-width': 1.5, filter: 'url(#sh)' }, g);
            mkSVG('rect', { x: cx + CW / 2 - 10, y: cy - 5, width: 20, height: 10, rx: 3, fill: '#b71c1c', stroke: '#7f1010', 'stroke-width': 1 }, g);
            mkSVG('rect', { x: cx + 4, y: cy + 7, width: 8, height: CH - 14, rx: 3, fill: 'rgba(255,255,255,0.1)' }, g);
            mkSVG('rect', { x: cx + CW / 2 - 2, y: cy + 6, width: 4, height: 14, rx: 1, fill: 'rgba(0,0,0,0.25)' }, g);
            svTxt(g, cx + CW / 2, cy + 10, '+', '#ffcdd2', 11, '800');
            svTxt(g, cx + CW / 2, cy + CH - 10, '−', '#aaa', 13, '800');
            svTxt(g, cx + CW / 2, cy + CH / 2, `${s + 1}S`, 'rgba(255,255,255,0.9)', 13, '700');
            if (P > 1) svTxt(g, cx + CW / 2, cy + CH / 2 + 16, `P${p + 1}`, 'rgba(255,255,255,0.4)', 9, '500');
        }
    }

    // BMS
    if (hasBMS) {
        const bg = mkSVG('g', {}, svg);
        mkSVG('rect', { x: BX, y: BY, width: BW, height: BH, rx: 10, fill: 'url(#bg2)', stroke: '#ff6b6b', 'stroke-width': 2, filter: 'url(#sh)' }, bg);
        mkSVG('rect', { x: BX + 7, y: BY + 7, width: BW - 14, height: BH - 14, rx: 7, fill: 'rgba(0,0,0,0.28)', stroke: 'rgba(255,255,255,0.06)', 'stroke-width': 1 }, bg);
        mkSVG('circle', { cx: BX + BW / 2, cy: BY + 42, r: 25, fill: 'rgba(0,0,0,0.45)', stroke: '#ff6b6b', 'stroke-width': 1.5 }, bg);
        svTxt(bg, BX + BW / 2, BY + 38, 'DALY', '#fff', 11, '800');
        svTxt(bg, BX + BW / 2, BY + 52, 'BMS', '#fff', 7, '600');
        svTxt(bg, BX + BW / 2, BY + 76, 'Smart BMS', '#ffcccc', 13, '800');
        mkSVG('circle', { cx: BX + 35, cy: BY + BH - 22, r: 9, fill: 'rgba(0,0,0,0.4)', stroke: 'rgba(255,255,255,0.2)', 'stroke-width': 1 }, bg);

        const ports = [{ lbl: 'B−', c: '#444' }, { lbl: 'P−', c: '#1565C0' }, { lbl: 'PC−', c: '#1a7a1a' }, { lbl: 'B+', c: '#c0392b' }];
        const ps = BH / (ports.length + 1);
        const portY = ports.map((_, i) => BY + ps * (i + 1));
        ports.forEach((pt, i) => {
            const py = portY[i];
            mkSVG('rect', { x: BX - 20, y: py - 9, width: 20, height: 18, rx: 3, fill: pt.c, stroke: 'rgba(255,255,255,0.15)', 'stroke-width': 1 }, svg);
            mkSVG('circle', { cx: BX - 20, cy: py, r: 2.5, fill: 'rgba(255,255,255,0.5)' }, svg);
            svTxt(svg, BX - 10, py, pt.lbl, '#eee', 7, '700');
        });
        // GRN sampling port right
        mkSVG('rect', { x: BX + BW, y: BY + BH / 2 - 28, width: 18, height: 56, rx: 4, fill: '#1B5E20', stroke: '#4CAF50', 'stroke-width': 1.5 }, svg);
        svTxt(svg, BX + BW + 9, BY + BH / 2, 'BAL', '#4CAF50', 7, '700');
        svTxt(svg, BX + BW / 2, BY - 12, 'Sampling / Balance Port', '#4CAF50', 9, '600');

        // Main power wires
        const wrX = BX - 90;
        wPath(svg, `M ${packX} ${botY} L ${wrX} ${botY} L ${wrX} ${portY[0]} L ${BX} ${portY[0]}`, '#333', 5);
        wPath(svg, `M ${packX} ${botY} L ${wrX} ${botY} L ${wrX} ${portY[0]} L ${BX} ${portY[0]}`, '#555', 2);
        const bpx = packX + (S - 1) * (CW + CGAP) + CW / 2;
        wPath(svg, `M ${bpx} ${topY} L ${bpx} ${topY - 30} L ${wrX + 18} ${topY - 30} L ${wrX + 18} ${portY[3]} L ${BX} ${portY[3]}`, '#c0392b', 5);
        svTxt(svg, bpx + 18, topY - 30, 'B+', '#e74c3c', 9, '700', 'start');
        svTxt(svg, wrX - 12, botY, 'B−', '#777', 9, '700');

        // Balance sampling cable
        const bcx = BX - 55;
        mkSVG('rect', { x: bcx - 28, y: packY - BP - 8, width: 56, height: packH + BP * 2 + 8, rx: 4, fill: 'rgba(76,175,80,0.04)', stroke: '#4CAF50', 'stroke-width': 1, 'stroke-dasharray': '4 2' }, svg);
        svTxt(svg, bcx, packY - BP - 6, 'Sampling', '#4CAF50', 8, '600');
        tapDots.forEach((tap, i) => {
            const ty = BY + 16 + i * ((BH - 32) / Math.max(tapDots.length - 1, 1));
            wPath(svg, `M ${tap.x} ${tap.y} L ${tap.x} ${packY - BP - 20} L ${bcx} ${packY - BP - 20} L ${bcx} ${ty} L ${BX + BW} ${ty}`, '#4CAF50', 1, '3 2');
            mkSVG('circle', { cx: tap.x, cy: tap.y, r: 4, fill: '#4CAF50', stroke: '#2E7D32', 'stroke-width': 1 }, svg);
            svTxt(svg, tap.x, tap.y - 9, tap.lbl, '#4CAF50', 7, '700');
        });
        mkSVG('circle', { cx: BX + BW, cy: BY + BH / 2, r: 3, fill: '#4CAF50' }, svg);

        // Load box
        const lg = mkSVG('g', {}, svg);
        mkSVG('rect', { x: LX, y: LY, width: LW, height: LH, rx: 8, fill: '#0a1a2e', stroke: '#2196F3', 'stroke-width': 2 }, lg);
        svTxt(lg, LX + LW / 2, LY + 16, '⚡ Motor', '#64B5F6', 10, '700');
        svTxt(lg, LX + LW / 2, LY + LH - 14, '/ Load', '#2196F3', 10, '600');
        wPath(svg, `M ${BX} ${portY[1]} L ${BX - 28} ${portY[1]} L ${BX - 28} ${LY + LH + 12} L ${LX} ${LY + LH + 12} L ${LX} ${LY + LH - 5}`, '#1565C0', 3);
        wPath(svg, `M ${BX} ${portY[3]} L ${BX - 10} ${portY[3]} L ${BX - 10} ${LY + 6} L ${LX} ${LY + 6}`, '#c0392b', 3);

        // Charger box
        const cg2 = mkSVG('g', {}, svg);
        mkSVG('rect', { x: LX, y: CY2, width: LW, height: LH, rx: 8, fill: '#1a0d00', stroke: '#FF9800', 'stroke-width': 2 }, cg2);
        svTxt(cg2, LX + LW / 2, CY2 + 16, '🔌 Charger', '#FFB74D', 10, '700');
        svTxt(cg2, LX + LW / 2, CY2 + LH - 14, 'Input', '#FF9800', 10, '600');
        wPath(svg, `M ${BX} ${portY[2]} L ${BX - 48} ${portY[2]} L ${BX - 48} ${CY2 + LH - 5} L ${LX} ${CY2 + LH - 5}`, '#1a7a1a', 3);
        wPath(svg, `M ${BX - 10} ${portY[3]} L ${BX - 10} ${CY2 + 6} L ${LX} ${CY2 + 6}`, '#c0392b', 3);
    } else {
        const tx = packX + packW + 40;
        mkSVG('rect', { x: tx, y: topY - 14, width: 70, height: 28, rx: 6, fill: 'rgba(192,57,43,0.2)', stroke: '#c0392b', 'stroke-width': 1.5 }, svg);
        svTxt(svg, tx + 35, topY, 'B+ Out', '#e74c3c', 10, '700');
        wLine(svg, packX + packW, topY, tx, topY, '#c0392b', 3);
        mkSVG('rect', { x: tx, y: botY - 14, width: 70, height: 28, rx: 6, fill: 'rgba(40,40,40,0.8)', stroke: '#555', 'stroke-width': 1.5 }, svg);
        svTxt(svg, tx + 35, botY, 'B− Out', '#aaa', 10, '700');
        wLine(svg, packX + packW, botY, tx, botY, '#444', 3);
    }

    // Legend
    const leg = [{ c: '#c0392b', l: 'Positive (B+)' }, { c: '#333', l: 'Negative (B−)' }, { c: '#4CAF50', l: 'Balance/Sampling' }, { c: '#2196F3', l: 'Load' }, { c: '#FF9800', l: 'Charger' }];
    leg.forEach((it, i) => {
        const ox = PAD + i * 140;
        wLine(svg, ox, TH - 20, ox + 20, TH - 20, it.c, 3);
        svTxt(svg, ox + 28, TH - 20, it.l, 'rgba(255,255,255,0.45)', 9, '500', 'start');
    });
}
function addLabel() { }



// ===== Zoom Controls =====
let zoomLevel = 1;

document.getElementById('zoom-in').addEventListener('click', () => {
    zoomLevel = Math.min(zoomLevel + 0.2, 2);
    applyZoom();
});

document.getElementById('zoom-out').addEventListener('click', () => {
    zoomLevel = Math.max(zoomLevel - 0.2, 0.5);
    applyZoom();
});

document.getElementById('reset-view').addEventListener('click', () => {
    zoomLevel = 1;
    applyZoom();
});

function applyZoom() {
    const svg = diagramCanvas.querySelector('svg');
    if (svg) {
        svg.style.transform = `scale(${zoomLevel})`;
        svg.style.transformOrigin = 'center center';
    }
}

// ===== Save & Export =====
document.getElementById('save-config').addEventListener('click', () => {
    // Save as PDF (Print View)
    window.print();
});

document.getElementById('export-config').addEventListener('click', () => {
    // Export as Image (PNG)
    const svg = diagramCanvas.querySelector('svg');
    if (!svg) {
        showNotification('Please generate a diagram first!', 'warning');
        return;
    }

    // Create a canvas to render the SVG
    const canvas = document.createElement('canvas');
    const bbox = svg.getBoundingClientRect();

    // Set higher resolution (2x) for better quality
    const scale = 2;
    canvas.width = bbox.width * scale;
    canvas.height = bbox.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Create image from SVG data
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
        // Draw dark background (since SVG has transparent/no background usually)
        ctx.fillStyle = '#1A202C';
        ctx.fillRect(0, 0, bbox.width, bbox.height);

        // Draw the SVG image
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        // Convert to PNG and download
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `battery-diagram-${config.seriesCells}S${config.parallelCells}P.png`;
        a.click();
        showNotification('Diagram saved as PNG image!', 'success');
    };
    img.src = url;
});

// ===== Notifications =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(0, 230, 118, 0.2)' : type === 'warning' ? 'rgba(255, 214, 0, 0.2)' : 'rgba(0, 217, 255, 0.2)'};
        border: 1px solid ${type === 'success' ? '#00E676' : type === 'warning' ? '#FFD600' : '#00D9FF'};
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(20px);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== Initialize =====
updateCalculations();
updatePackConfig();
updateStep(1);
