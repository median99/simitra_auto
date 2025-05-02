import axios from 'axios';
import blessed from 'blessed';
import contrib from 'blessed-contrib';

// Enhanced Cyberpunk color palette with more neon colors
const colors = {
  primary: '#00ff9d',
  secondary: '#00b8ff',
  error: '#ff2a6d',
  warning: '#ff9a00',
  background: '#0d0221',
  text: '#ffffff',
  highlight: '#f6019d',
  neonPink: '#ff00ff',
  neonBlue: '#00ffff',
  neonPurple: '#9d00ff'
};

// Session token
function session() {
    return 'Bearer eyJxxxxxxxxxxxxxxxxxxxx';
}

// Common headers configuration
const headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': session(),
    'connection': 'keep-alive',
    'host': 'mitra-api.bps.go.id',
    'origin': 'https://mitra.bps.go.id',
    'referer': 'https://mitra.bps.go.id/',
    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
};

// Create screen with cyberpunk theme
const screen = blessed.screen({
    smartCSR: true,
    title: 'BPS MITRA CYBER AUTOMATION',
    fullUnicode: true,
    dockBorders: true,
    ignoreDockContrast: true,
    bg: colors.background
});

// Create layout grid
const grid = new contrib.grid({ 
    rows: 12, 
    cols: 12, 
    screen: screen,
    style: {
        bg: colors.background
    }
});

// Initialize all elements with proper style objects
const header = grid.set(0, 0, 2, 12, blessed.box, {
    content: `{bold}{${colors.primary}-fg}▓▓▓ BPS SIMITRA AUTOMATION ▓▓▓{/}\n{${colors.secondary}-fg}▓▓▓ BY EVOS99 ▓▓▓{/}{/bold}`,
    tags: true,
    padding: { top: 1 },
    style: {
        fg: colors.text,
        bg: colors.background,
        border: { 
            fg: colors.primary,
            bg: colors.background
        },
        label: { 
            fg: colors.primary,
            bg: colors.background
        },
        bold: true
    },
    border: {
        type: 'line',
        fg: colors.primary
    }
});

const statusBox = grid.set(2, 0, 2, 12, blessed.box, {
    label: ' {bold}SYSTEM STATUS{/bold} ',
    tags: true,
    padding: 1,
    style: {
        fg: colors.text,
        bg: colors.background,
        border: { 
            fg: colors.secondary,
            bg: colors.background
        },
        label: { 
            fg: colors.primary,
            bg: colors.background
        }
    },
    border: {
        type: 'line',
        fg: colors.secondary
    }
});

const offersTable = grid.set(4, 0, 4, 8, contrib.table, {
    keys: true,
    label: ' {bold}OFFER DATASTREAM{/bold} ',
    columnSpacing: 2,
    columnWidth: [5, 15, 25, 15, 15],
    style: {
        header: { 
            fg: colors.primary, 
            bg: colors.background,
            bold: true 
        },
        cell: { 
            fg: colors.text,
            bg: colors.background
        },
        border: {
            fg: colors.secondary,
            bg: colors.background
        },
        label: {
            fg: colors.primary,
            bg: colors.background
        }
    },
    border: {
        type: 'line',
        fg: colors.secondary
    }
});

const logBox = grid.set(8, 0, 4, 8, blessed.log, {
    label: ' {bold}SYSTEM LOG{/bold} ',
    tags: true,
    padding: 1,
    scrollable: true,
    scrollbar: {
        ch: ' ',
        style: {
            bg: colors.highlight
        }
    },
    style: {
        fg: colors.text,
        bg: colors.background,
        border: { 
            fg: colors.primary,
            bg: colors.background
        },
        label: { 
            fg: colors.primary,
            bg: colors.background
        }
    },
    border: {
        type: 'line',
        fg: colors.primary
    }
});

const statsBox = grid.set(4, 8, 4, 4, blessed.box, {
    label: ' {bold}STATS{/bold} ',
    tags: true,
    padding: 1,
    style: {
        fg: colors.text,
        bg: colors.background,
        border: { 
            fg: colors.highlight,
            bg: colors.background
        },
        label: { 
            fg: colors.highlight,
            bg: colors.background
        }
    },
    border: {
        type: 'line',
        fg: colors.highlight
    }
});

const progressBar = grid.set(10, 8, 2, 4, contrib.gauge, {
    label: ' {bold}PROGRESS{/bold} ',
    tags: true,
    stroke: colors.primary,
    fill: colors.background,
    showLabel: true,
    style: {
        label: { 
            fg: colors.primary,
            bg: colors.background
        },
        stroke: colors.primary,
        border: { 
            fg: colors.primary,
            bg: colors.background
        }
    },
    border: {
        type: 'line',
        fg: colors.primary
    }
});

const footer = grid.set(11, 0, 1, 12, blessed.box, {
    content: `{right}{${colors.secondary}-fg}▓▓▓ v2.3.7 | © 2025 Evos99 ▓▓▓{/}{/right}`,
    tags: true,
    style: {
        fg: colors.secondary,
        bg: colors.background
    }
});

const decor1 = grid.set(2, 11, 1, 1, blessed.box, {
    content: '◈',
    style: {
        fg: colors.highlight,
        bg: colors.background,
        bold: true
    }
});

const decor2 = grid.set(5, 11, 1, 1, blessed.box, {
    content: '⬢',
    style: {
        fg: colors.primary,
        bg: colors.background,
        bold: true
    }
});

// Animation intervals
let animationIntervals = [];

// Safe interval creator that checks for element existence
function createSafeInterval(callback, delay) {
    const interval = setInterval(() => {
        try {
            if (screen && screen.children && screen.children.length > 0) {
                callback();
            } else {
                clearInterval(interval);
            }
        } catch (e) {
            clearInterval(interval);
        }
    }, delay);
    animationIntervals.push(interval);
    return interval;
}

// Initialize animations
function initAnimations() {
    // Clear any existing intervals
    animationIntervals.forEach(clearInterval);
    animationIntervals = [];

    // Header blink animation
    createSafeInterval(() => {
        if (header && header.style && header.style.border) {
            header.style.border.fg = header.style.border.fg === colors.primary ? colors.highlight : colors.primary;
            header.style.label.fg = header.style.label.fg === colors.primary ? colors.highlight : colors.primary;
            screen.render();
        }
    }, 800);

    // Status box pulse animation
    createSafeInterval(() => {
        if (statusBox && statusBox.style && statusBox.style.border) {
            statusBox.style.border.fg = statusBox.style.border.fg === colors.secondary ? colors.neonBlue : colors.secondary;
            screen.render();
        }
    }, 1200);

    // Progress bar pulse animation
    createSafeInterval(() => {
        if (progressBar && progressBar.style) {
            progressBar.style.stroke = progressBar.style.stroke === colors.primary ? colors.neonPink : colors.primary;
            screen.render();
        }
    }, 1500);

    // Footer ticker animation
    const newsItems = [
        "SYSTEM ONLINE | ",
        "DATA STREAM ACTIVE | ",
        "CONNECTION SECURE | ",
        "AUTO-APPROVAL ENGAGED | ",
        "CYBER PROTOCOLS INITIALIZED | "
    ];
    let tickerPos = 0;
    createSafeInterval(() => {
        if (footer) {
            const tickerContent = newsItems.join('').repeat(2);
            const displayContent = tickerContent.substr(tickerPos, 50);
            footer.content = `{${colors.neonPurple}-fg}${displayContent}{/} {right}{${colors.secondary}-fg}▓▓▓ v2.3.7 | © 2025 Evos99 ▓▓▓{/}{/right}`;
            tickerPos = (tickerPos + 1) % tickerContent.length;
            screen.render();
        }
    }, 200);

    // Decor animation
    createSafeInterval(() => {
        const shapes = ['◈', '⬢', '⬡', '⬣', '⬠', '⯐'];
        if (decor1) decor1.content = shapes[Math.floor(Math.random() * shapes.length)];
        if (decor2) decor2.content = shapes[Math.floor(Math.random() * shapes.length)];
        screen.render();
    }, 1000);
}

// Matrix effect for table
function startMatrixEffect() {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const interval = createSafeInterval(() => {
        try {
            if (offersTable && offersTable.rows && offersTable.rows.data) {
                const data = offersTable.rows.data;
                if (data.length > 0) {
                    const randomRow = Math.floor(Math.random() * data.length);
                    const randomCol = Math.floor(Math.random() * data[randomRow].length);
                    const originalText = data[randomRow][randomCol];
                    
                    if (randomRow > 0 && !originalText.includes('{bold}')) {
                        const randomChar = chars[Math.floor(Math.random() * chars.length)];
                        data[randomRow][randomCol] = `{${colors.neonBlue}-fg}${randomChar}{/}`;
                        offersTable.setData({ headers: offersTable.rows.headers, data });
                        screen.render();
                        
                        setTimeout(() => {
                            if (offersTable && offersTable.rows && offersTable.rows.data) {
                                data[randomRow][randomCol] = originalText;
                                offersTable.setData({ headers: offersTable.rows.headers, data });
                                screen.render();
                            }
                        }, 200);
                    }
                }
            }
        } catch (e) {
            clearInterval(interval);
        }
    }, 100);
    return interval;
}

// Digital rain effect for stats
function startDigitalRain() {
    return createSafeInterval(() => {
        try {
            if (statsBox && statsBox.content) {
                const lines = statsBox.content.split('\n');
                if (lines.length > 2) {
                    const randomLine = 2 + Math.floor(Math.random() * (lines.length - 2));
                    const line = lines[randomLine];
                    const parts = line.split(':');
                    if (parts.length === 2) {
                        const rainChars = '0123456789ABCDEF';
                        const randomChar = rainChars[Math.floor(Math.random() * rainChars.length)];
                        lines[randomLine] = parts[0] + ': ' + randomChar;
                        statsBox.setContent(lines.join('\n'));
                        screen.render();
                        
                        setTimeout(() => {
                            if (statsBox && statsBox.content) {
                                const currentLines = statsBox.content.split('\n');
                                if (currentLines[randomLine] === lines[randomLine]) {
                                    currentLines[randomLine] = line;
                                    statsBox.setContent(currentLines.join('\n'));
                                    screen.render();
                                }
                            }
                        }, 100);
                    }
                }
            }
        } catch (e) {
            // Ignore errors
        }
    }, 300);
}

// Get offering data
async function get_penawaran() {
    logBox.add(`{${colors.primary}-fg}>>> INITIATING DATA FETCH...{/}`);
    screen.render();
    
    const loadingChars = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
    let loadingPos = 0;
    const loadingInterval = setInterval(() => {
        if (statusBox) {
            statusBox.setContent(`{center}{${colors.primary}-fg}▓ FETCHING DATA ${loadingChars[loadingPos]} ▓{/}{/center}`);
            loadingPos = (loadingPos + 1) % loadingChars.length;
            screen.render();
        }
    }, 100);
    
    try {
        const response = await axios.get('https://mitra-api.bps.go.id/api/mitra/offering/sm/151602', { headers });
        const data = response.data;
        const offers = [];

        if (Array.isArray(data.smds) && data.smds.length > 0) {
            data.smds.forEach(v => {
                if (v.status === '99') {
                    offers.push({
                        id: v.id_ms,
                        name: v.nama_sm || 'N/A',
                        date: v.tgl_penawaran || 'N/A',
                        status: 'PENDING'
                    });
                }
            });
            
            for (let i = 1; i <= offers.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 50));
                if (logBox) {
                    logBox.add(`{${colors.primary}-fg}>>> DATA ACQUIRED: {bold}${i}{/} OFFERS FOUND{/}`);
                    screen.render();
                }
            }
        } else {
            if (logBox) {
                logBox.add(`{${colors.warning}-fg}>>> NO OFFERS DETECTED{/}`);
            }
        }
        
        clearInterval(loadingInterval);
        return offers;
    } catch (err) {
        clearInterval(loadingInterval);
        if (logBox) {
            logBox.add(`{${colors.error}-fg}>>> SYSTEM ERROR: ${err.message}{/}`);
        }
        return [];
    }
}

// Approve offering
async function approve(id) {
    try {
        if (logBox) {
            logBox.add(`{${colors.secondary}-fg}>>> PROCESSING OFFER ID: {bold}${id}{/}{/}`);
            screen.render();
        }
        
        if (statusBox) {
            statusBox.setContent(`{center}{${colors.secondary}-fg}▓ PROCESSING ID ${id} ▓{/}{/center}`);
            screen.render();
        }
        
        const response = await axios.post(
            `https://mitra-api.bps.go.id/api/mitra/offering/confirm/${id}`,
            { id_mitra: '151602', reject_reason: '', status: '1' },
            { headers: { ...headers, 'content-type': 'application/json;charset=UTF-8' } }
        );
        
        if (statusBox && statusBox.style && statusBox.style.border) {
            statusBox.style.border.fg = colors.primary;
            statusBox.style.label.fg = colors.primary;
            screen.render();
            await new Promise(resolve => setTimeout(resolve, 300));
            statusBox.style.border.fg = colors.secondary;
            statusBox.style.label.fg = colors.primary;
            screen.render();
        }
        
        if (logBox) {
            logBox.add(`{${colors.primary}-fg}>>> SUCCESS: ID {bold}${id}{/} APPROVED{/}`);
        }
        return { success: true, message: 'APPROVED' };
    } catch (err) {
        if (statusBox && statusBox.style && statusBox.style.border) {
            statusBox.style.border.fg = colors.error;
            statusBox.style.label.fg = colors.error;
            screen.render();
            await new Promise(resolve => setTimeout(resolve, 300));
            statusBox.style.border.fg = colors.secondary;
            statusBox.style.label.fg = colors.primary;
            screen.render();
        }
        
        if (logBox) {
            logBox.add(`{${colors.error}-fg}>>> FAILURE: ID {bold}${id}{/} - ${err.message}{/}`);
        }
        return { success: false, message: err.message };
    }
}

// Update UI
function updateUI(offers) {
    if (!offersTable || !statsBox || !progressBar) return;

    // Update offers table
    offersTable.setData({
        headers: ['NO', 'ID', 'NAME', 'DATE', 'STATUS'],
        data: offers.map((offer, index) => [
            index + 1,
            offer.id,
            offer.name,
            offer.date,
            offer.status === 'APPROVED' ? `{${colors.primary}-fg}{bold}${offer.status}{/}{/}` : 
                 offer.status === 'FAILED' ? `{${colors.error}-fg}{bold}${offer.status}{/}{/}` : 
                 `{${colors.warning}-fg}{bold}PENDING{/}{/}`
        ])
    });

    // Update stats
    const total = offers.length;
    const approved = offers.filter(o => o.status === 'APPROVED').length;
    const failed = offers.filter(o => o.status === 'FAILED').length;
    const pending = offers.filter(o => o.status === 'PENDING').length;

    statsBox.setContent(
        `{bold}▓ SYSTEM STATS ▓{/}\n\n` +
        `{${colors.primary}-fg}TOTAL: {bold}${total}{/}{/}\n` +
        `{${colors.primary}-fg}APPROVED: {bold}${approved}{/}{/}\n` +
        `{${colors.error}-fg}FAILED: {bold}${failed}{/}{/}\n` +
        `{${colors.warning}-fg}PENDING: {bold}${pending}{/}{/}\n\n` +
        `{bold}▓ LAST UPDATE ▓{/}\n` +
        `${new Date().toLocaleTimeString()}`
    );

    // Update progress
    if (total > 0 && progressBar) {
        const targetPercent = Math.round((approved + failed) / total * 100);
        let currentPercent = progressBar.percent || 0;
        
        const progressInterval = setInterval(() => {
            if (currentPercent < targetPercent) {
                currentPercent++;
                progressBar.setPercent(currentPercent);
                screen.render();
            } else {
                clearInterval(progressInterval);
            }
        }, 50);
    }

    screen.render();
}

// Main function
async function main() {
    // Initialize animations
    initAnimations();

    // Boot sequence
    const bootMessages = [
        "INITIALIZING CYBER SYSTEMS...",
        "LOADING NEURAL INTERFACE...",
        "CONNECTING TO BPS DATABASE...",
        "AUTHENTICATING USER CREDENTIALS...",
        "ESTABLISHING SECURE LINK...",
        "SYSTEM READY"
    ];
    
    for (const msg of bootMessages) {
        if (logBox) {
            logBox.add(`{${colors.secondary}-fg}>>> ${msg}{/}`);
            await new Promise(resolve => setTimeout(resolve, 500));
            screen.render();
        }
    }
    
    if (statusBox) {
        statusBox.setContent(`{center}{${colors.primary}-fg}▓ SYSTEM INITIALIZATION COMPLETE ▓{/}{/center}`);
        screen.render();
    }

    let offers = await get_penawaran();
    updateUI(offers);

    if (offers.length > 0) {
        if (statusBox) {
            statusBox.setContent(`{center}{${colors.secondary}-fg}▓ PROCESSING ${offers.length} OFFERS ▓{/}{/center}`);
            screen.render();
        }

        for (let i = 0; i < offers.length; i++) {
            const result = await approve(offers[i].id);
            offers[i].status = result.success ? 'APPROVED' : 'FAILED';
            updateUI(offers);
            
            if (progressBar) {
                const progress = Math.round(((i + 1) / offers.length) * 100);
                progressBar.setPercent(progress);
                screen.render();
            }
        }

        if (statusBox) {
            statusBox.setContent(`{center}{${colors.primary}-fg}▓ PROCESS COMPLETE - ${offers.filter(o => o.status === 'APPROVED').length}/${offers.length} APPROVED ▓{/}{/center}`);
            screen.render();
        }
    }
}

// Clean exit handler
function cleanExit() {
    animationIntervals.forEach(clearInterval);
    process.exit(0);
}

// Event handlers
screen.key(['escape', 'q', 'C-c'], cleanExit);
process.on('SIGINT', cleanExit);

// Run the script
main().catch(err => {
    if (logBox) {
        logBox.add(`{${colors.error}-fg}>>> FATAL SYSTEM ERROR: ${err.message}{/}`);
    }
    if (statusBox) {
        statusBox.setContent(`{center}{${colors.error}-fg}▓ SYSTEM FAILURE ▓{/}{/center}`);
    }
    screen.render();
    cleanExit();
});

// Initial render
screen.render();