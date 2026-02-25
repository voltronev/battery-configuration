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
function generateDiagram() {
    const canvas = document.getElementById('diagram-canvas');
    canvas.innerHTML = '';

    const cellWidth = 45;
    const cellHeight = 80;
    const cellSpacingX = 15;
    const cellSpacingY = 12;
    const bmsWidth = 160;
    const bmsHeight = Math.max(200, config.seriesCells * 15 + 80);
    const margin = 60;

    const cellAreaWidth = config.seriesCells * cellWidth + (config.seriesCells - 1) * cellSpacingX;
    const cellAreaHeight = config.parallelCells * cellHeight + (config.parallelCells - 1) * cellSpacingY;

    const totalWidth = margin * 2 + cellAreaWidth + bmsWidth + 350;
    const totalHeight = Math.max(margin * 2 + cellAreaHeight + 120, bmsHeight + 150);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.display = 'block';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const cellGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    cellGradient.setAttribute('id', 'cellGradient');
    cellGradient.setAttribute('x1', '0%');
    cellGradient.setAttribute('y1', '0%');
    cellGradient.setAttribute('x2', '0%');
    cellGradient.setAttribute('y2', '100%');
    cellGradient.innerHTML = `
        <stop offset="0%" style="stop-color:#9E9E9E;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#757575;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#616161;stop-opacity:1" />
    `;
    defs.appendChild(cellGradient);
    svg.appendChild(defs);

    const startX = margin;
    const startY = margin + 40;
    const balanceTaps = [];

    // Draw cells in vertical columns
    for (let s = 0; s < config.seriesCells; s++) {
        const colX = startX + s * (cellWidth + cellSpacingX);

        for (let p = 0; p < config.parallelCells; p++) {
            const cellY = startY + p * (cellHeight + cellSpacingY);
            drawCylindricalCell(svg, colX, cellY, cellWidth, cellHeight, `${s + 1}S`);
        }

        const bottomY = startY + (config.parallelCells - 1) * (cellHeight + cellSpacingY) + cellHeight;
        balanceTaps.push({ x: colX + cellWidth / 2, y: bottomY + 5 });
    }

    balanceTaps.push({ x: startX + cellWidth / 2, y: startY - 5 });

    // Draw bus bars
    for (let s = 0; s < config.seriesCells; s++) {
        const x1 = startX + s * (cellWidth + cellSpacingX);
        const x2 = x1 + cellWidth;
        const topY = startY - 10;
        const bottomY = startY + (config.parallelCells - 1) * (cellHeight + cellSpacingY) + cellHeight + 10;

        // Top bus bar (B+)
        drawBusBar(svg, x1 + cellWidth / 2, startY, x1 + cellWidth / 2, topY, 'positive', 4);
        if (s < config.seriesCells - 1) {
            const nextX = startX + (s + 1) * (cellWidth + cellSpacingX);
            drawBusBar(svg, x2, topY, nextX, topY, 'positive', 4);
        }

        // Bottom bus bar (B-)
        drawBusBar(svg, x1 + cellWidth / 2, bottomY - 10, x1 + cellWidth / 2, bottomY, 'negative', 4);
        if (s < config.seriesCells - 1) {
            const nextX = startX + (s + 1) * (cellWidth + cellSpacingX);
            drawBusBar(svg, x2, bottomY, nextX, bottomY, 'negative', 4);
        }
    }

    const bNegX = startX + cellWidth / 2;
    const bNegY = startY + (config.parallelCells - 1) * (cellHeight + cellSpacingY) + cellHeight + 10;
    const bPosX = startX + (config.seriesCells - 1) * (cellWidth + cellSpacingX) + cellWidth / 2;
    const bPosY = startY - 10;

    if (config.bmsProtection) {
        const bmsX = startX + cellAreaWidth + 180;
        const bmsY = startY + cellAreaHeight / 2 - bmsHeight / 2;
        drawProfessionalBMS(svg, bmsX, bmsY, bmsWidth, bmsHeight, balanceTaps,
            { x: bNegX, y: bNegY }, { x: bPosX, y: bPosY });
    }

    addLabel(svg, totalWidth / 2, totalHeight - 20,
        `${config.seriesCells}S${config.parallelCells}P - ${config.cellType} - ${(config.cellVoltage * config.seriesCells).toFixed(1)}V ${config.cellCapacity * config.parallelCells}mAh`);

    canvas.appendChild(svg);
}

function drawCylindricalCell(svg, x, y, width, height, label) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('rx', 6);
    rect.setAttribute('fill', 'url(#cellGradient)');
    rect.setAttribute('stroke', '#424242');
    rect.setAttribute('stroke-width', 1.5);
    group.appendChild(rect);

    const posTerminal = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    posTerminal.setAttribute('x', x + width / 2 - 8);
    posTerminal.setAttribute('y', y - 4);
    posTerminal.setAttribute('width', 16);
    posTerminal.setAttribute('height', 8);
    posTerminal.setAttribute('rx', 2);
    posTerminal.setAttribute('fill', '#D32F2F');
    group.appendChild(posTerminal);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + width / 2);
    text.setAttribute('y', y + height / 2 + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#FFFFFF');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', 'bold');
    text.textContent = label;
    group.appendChild(text);

    svg.appendChild(group);
}

function drawBusBar(svg, x1, y1, x2, y2, type, width) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', type === 'positive' ? '#D32F2F' : '#212121');
    line.setAttribute('stroke-width', width);
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
}

function drawProfessionalBMS(svg, x, y, width, height, balanceTaps, negTerminal, posTerminal) {
    // BMS box
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x - width / 2);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('rx', 8);
    rect.setAttribute('fill', '#757575');
    rect.setAttribute('stroke', '#00E676');
    rect.setAttribute('stroke-width', 3);
    svg.appendChild(rect);

    // BMS label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 30);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#FFEB3B');
    text.setAttribute('font-size', '20');
    text.setAttribute('font-weight', 'bold');
    text.textContent = 'BMS';
    svg.appendChild(text);

    // Balance port
    const balPortX = x - width / 2 - 10;
    const balPortY = y + 60;
    const balPortHeight = Math.min(balanceTaps.length * 8, height - 80);

    const balPort = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    balPort.setAttribute('x', balPortX - 12);
    balPort.setAttribute('y', balPortY);
    balPort.setAttribute('width', 12);
    balPort.setAttribute('height', balPortHeight);
    balPort.setAttribute('fill', '#4CAF50');
    balPort.setAttribute('stroke', '#2E7D32');
    balPort.setAttribute('stroke-width', 1.5);
    svg.appendChild(balPort);

    const balLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    balLabel.setAttribute('x', balPortX - 30);
    balLabel.setAttribute('y', balPortY + balPortHeight / 2 + 4);
    balLabel.setAttribute('text-anchor', 'end');
    balLabel.setAttribute('fill', '#4CAF50');
    balLabel.setAttribute('font-size', '10');
    balLabel.setAttribute('font-weight', 'bold');
    balLabel.textContent = 'Balancing Port';
    svg.appendChild(balLabel);

    // Balance wires
    balanceTaps.forEach((tap, index) => {
        const targetY = balPortY + (index / (balanceTaps.length - 1)) * balPortHeight;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midX = (tap.x + balPortX) / 2;
        path.setAttribute('d', `M ${tap.x} ${tap.y} Q ${midX} ${tap.y}, ${midX} ${targetY} T ${balPortX} ${targetY}`);
        path.setAttribute('stroke', index === 0 || index === balanceTaps.length - 1 ? '#2196F3' : '#4CAF50');
        path.setAttribute('stroke-width', 1.5);
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.7');
        svg.appendChild(path);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', tap.x);
        circle.setAttribute('cy', tap.y);
        circle.setAttribute('r', 3);
        circle.setAttribute('fill', '#4CAF50');
        svg.appendChild(circle);
    });

    // Bottom terminals
    const termY = y + height;
    const bNegX = x - width / 2 + 30;
    const pNegX = x - 20;
    const pcNegX = x + 20;
    const bPosX = x + width / 2 - 30;

    // B- terminal
    drawTerminalPin(svg, bNegX, termY, 'B-', '#212121');
    drawBusBar(svg, negTerminal.x, negTerminal.y, bNegX, negTerminal.y, 'negative', 4);
    drawBusBar(svg, bNegX, negTerminal.y, bNegX, termY, 'negative', 4);

    // P- terminal
    drawTerminalPin(svg, pNegX, termY, 'P-', '#212121');

    // PC- terminal
    drawTerminalPin(svg, pcNegX, termY, 'PC-', '#212121');

    // B+ terminal (connect from top bus bar)
    drawTerminalPin(svg, bPosX, termY, 'B+', '#D32F2F');
    drawBusBar(svg, posTerminal.x, posTerminal.y, bPosX, posTerminal.y, 'positive', 4);
    drawBusBar(svg, bPosX, posTerminal.y, bPosX, termY, 'positive', 4);

    // Load and Charger connections
    const loadX = x + width / 2 + 80;
    const chargerX = x + width / 2 + 80;

    // Load connection
    drawBusBar(svg, pNegX, termY, pNegX, termY + 20, 'negative', 3);
    drawBusBar(svg, pNegX, termY + 20, loadX, termY + 20, 'negative', 3);
    drawBusBar(svg, bPosX, termY, bPosX, termY + 30, 'positive', 3);
    drawBusBar(svg, bPosX, termY + 30, loadX, termY + 30, 'positive', 3);

    const loadBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    loadBox.setAttribute('x', loadX);
    loadBox.setAttribute('y', termY + 15);
    loadBox.setAttribute('width', 50);
    loadBox.setAttribute('height', 25);
    loadBox.setAttribute('fill', 'none');
    loadBox.setAttribute('stroke', '#2196F3');
    loadBox.setAttribute('stroke-width', 2);
    svg.appendChild(loadBox);

    const loadText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    loadText.setAttribute('x', loadX + 25);
    loadText.setAttribute('y', termY + 30);
    loadText.setAttribute('text-anchor', 'middle');
    loadText.setAttribute('fill', '#2196F3');
    loadText.setAttribute('font-size', '12');
    loadText.setAttribute('font-weight', 'bold');
    loadText.textContent = 'Load';
    svg.appendChild(loadText);

    // Charger connection
    drawBusBar(svg, pcNegX, termY, pcNegX, termY + 50, 'negative', 3);
    drawBusBar(svg, pcNegX, termY + 50, chargerX, termY + 50, 'negative', 3);
    drawBusBar(svg, bPosX, termY + 30, bPosX, termY + 60, 'positive', 3);
    drawBusBar(svg, bPosX, termY + 60, chargerX, termY + 60, 'positive', 3);

    const chargerBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    chargerBox.setAttribute('x', chargerX);
    chargerBox.setAttribute('y', termY + 45);
    chargerBox.setAttribute('width', 50);
    chargerBox.setAttribute('height', 25);
    chargerBox.setAttribute('fill', 'none');
    chargerBox.setAttribute('stroke', '#FF9800');
    chargerBox.setAttribute('stroke-width', 2);
    svg.appendChild(chargerBox);

    const chargerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    chargerText.setAttribute('x', chargerX + 25);
    chargerText.setAttribute('y', termY + 60);
    chargerText.setAttribute('text-anchor', 'middle');
    chargerText.setAttribute('fill', '#FF9800');
    chargerText.setAttribute('font-size', '12');
    chargerText.setAttribute('font-weight', 'bold');
    chargerText.textContent = 'Charger';
    svg.appendChild(chargerText);
}

function drawTerminalPin(svg, x, y, label, color) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 6);
    circle.setAttribute('fill', color);
    circle.setAttribute('stroke', '#00E676');
    circle.setAttribute('stroke-width', 2);
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 18);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#FFFFFF');
    text.setAttribute('font-size', '10');
    text.setAttribute('font-weight', 'bold');
    text.textContent = label;
    svg.appendChild(text);
}

function addLabel(svg, x, y, text) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#A0AEC0');
    label.setAttribute('font-size', '12');
    label.setAttribute('font-weight', '600');
    label.textContent = text;
    svg.appendChild(label);
}

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
