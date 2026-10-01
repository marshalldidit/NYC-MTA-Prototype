const boroughs = { M: 'Manhattan', Bk: 'Brooklyn', Q: 'Queens', Bx: 'The Bronx', SI: 'Staten Island' };
const ada = { '0': 'Not accessible', '1': 'Fully accessible', '2': 'Partially accessible' };
const division = { BMT: 'Brooklyn-Manhattan Transit Corporation (BMT)', IRT: 'Interborough Rapid Transit (IRT)', IND: 'Independent Subway System (IND)', SIR: 'Staten Island Railway (SIR)' };
const structures = {
    'Subway':     { img: 'subway-color.png',     phrase: 'An underground' },
    'Elevated':   { img: 'elevated-color.png',   phrase: 'An elevated' },
    'At Grade':   { img: 'at_grade-color.png',   phrase: 'A street-level' },
    'Open Cut':   { img: 'open_cut-color.png',   phrase: 'An open-cut' },
    'Embankment': { img: 'embankment-color.png', phrase: 'An embankment' },
    'Viaduct':    { img: 'viaduct-color.png',    phrase: 'A viaduct' }
};

let stations = [];
const chime = new Audio('chime.mp3');

function randomStation() {
    return stations[Math.floor(Math.random() * stations.length)];
}

function showStation(pick) {
    // Name + route circles
    const routes = pick.daytime_routes
        .split(' ')
        .map(route => `<span class="route" data-route="${route}">${route}</span>`)
        .join('');

    document.getElementById('stationName').innerHTML = `
        <span class="name">${pick.stop_name} Station</span>
        <span class="trains">${routes}</span>
    `;

    // Illustration
    const structure = structures[pick.structure];
    const img = document.getElementById('structureImg');
    img.src = structure.img;
    img.alt = `Illustration of ${pick.structure.toLowerCase()} station`;

    // Borough
    document.getElementById('borough').textContent = boroughs[pick.borough];

    // Accessibility
    const accessEl = document.getElementById('accessibility');
    if (pick.ada === '1' || pick.ada === '2') {
        const iconClass = pick.ada === '2' ? 'adaIcon partial' : 'adaIcon';
        accessEl.innerHTML = `<img src="ada.png" alt="" class="${iconClass}">${ada[pick.ada]}`;
        accessEl.style.display = 'flex';
    } else {
        accessEl.innerHTML = '';
        accessEl.style.display = 'none';
    }

    // Blurb
    document.getElementById('blurb').textContent =
        `${structure.phrase} station on the ${pick.line} line, originally part of the ${division[pick.division]}.`;
}

// ---------- Doors ----------
let doorState = 'open';     // open | closing | closed | opening
let doorProgress = 0;       // 0 = fully open, 1 = fully closed
const DOOR_SPEED = 0.025;   // higher = faster doors

const DOOR_COLOR   = '#A9A9A9';   // panel
const WINDOW_COLOR = '#ADD8E6';   // glass
const LINE_COLOR   = '#36454F';   // outlines
const SEAL_COLOR   = '#121212';   // rubber edge

const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function drawDoors(p, e) {
    const w = p.width;
    const h = p.height;
    const doorW = w / 2;
    const leftX = -doorW + doorW * e;
    const rightX = w - doorW * e;

    [leftX, rightX].forEach((x, i) => {
        // door panel
        p.fill(DOOR_COLOR);
        p.stroke(LINE_COLOR);
        p.strokeWeight(4);
        p.rect(x, 0, doorW, h);

        // window
        p.fill(WINDOW_COLOR)
        p.rect(x + doorW * 0.2, h * 0.15, doorW * 0.6, h * 0.35, 4);

        // rubber seal where the doors meet
        p.noStroke();
        p.fill(SEAL_COLOR);
        const sealX = i === 0 ? x + doorW - 6 : x;
        p.rect(sealX, 0, 6, h);
    });
}

function onDoorsClosed() {
    showStation(randomStation());
    // brief pause while the new station loads behind the doors
    setTimeout(() => {
        resizeDoors();
        doorState = 'opening';
    }, 600);
}

new p5(p => {
    let card;

    p.setup = () => {
        card = document.querySelector('.context');
        const canvas = p.createCanvas(card.offsetWidth, card.offsetHeight);
        canvas.parent(card);
        canvas.id('doorsCanvas');
    };

    p.draw = () => {
        p.clear();

        if (doorState === 'closing') {
            doorProgress = Math.min(doorProgress + DOOR_SPEED, 1);
            if (doorProgress === 1) {
                doorState = 'closed';
                onDoorsClosed();
            }
        } else if (doorState === 'opening') {
            doorProgress = Math.max(doorProgress - DOOR_SPEED, 0);
            if (doorProgress === 0) doorState = 'open';
        }

        if (doorProgress > 0) drawDoors(p, easeInOut(doorProgress));
    };

    window.resizeDoors = () => p.resizeCanvas(card.offsetWidth, card.offsetHeight);
});

window.addEventListener('load', function() {
    fetch('https://data.ny.gov/resource/39hk-dx4f.json')
        .then(response => response.json())
        .then(data => {
            stations = data;
            showStation(randomStation());
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    document.querySelector('.CTA').addEventListener('click', function() {
        if (doorState !== 'open' || !stations.length) return;   // ignore clicks mid-animation
        chime.currentTime = 0;
        chime.play();
        resizeDoors();          // match the card's current size
        doorState = 'closing';
    });
});