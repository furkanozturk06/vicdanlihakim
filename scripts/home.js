// The family at the dinner table, shown at the top of the evening screen. We
// look across the table from the judge's own seat: Saniye on the left, Deniz in
// the middle, Ece on the right. While Deniz has left, her chair and Ece's stay
// empty but their plates are still laid. Saniye wears a shawl when she is ill, and looks pale when she is very ill.
// Their faces follow the family's mood. Drawn on a 400 x 140 grid.
import { makePortrait } from './portrait.js';

// Their looks use hair styles and colours no defendant ever gets (wavy hair with
// a flower, ribboned bunches and freckles, a curly perm and pearls), so nobody in court looks like them.
const DENIZ = {
    gender: 'f', skin: '#f0c8b0', hair: '#d4a24c', hairStyle: 'wavy', clip: '#f6f0e6', facialHair: 'none',
    earrings: 'silver', glasses: false, age: '', clothing: '#6b3550', outfit: 'sweater',
};
const ECE = {
    gender: 'f', skin: '#f0c8b0', hair: '#d4a24c', hairStyle: 'pigtails', ribbon: '#c0392b', freckles: true,
    facialHair: 'none', earrings: false, glasses: false, age: '', clothing: '#e0a030', outfit: 'kidTop',
};
const SANIYE = {
    gender: 'f', skin: '#e3b496', hair: '#ececec', hairStyle: 'perm', necklace: true, facialHair: 'none',
    earrings: true, glasses: true, age: 'elderly', clothing: '#2f5a5a', outfit: 'sweater',
};

// Faces: the portrait's own emotions (no emotion = a calm, slight smile)
function spouseFace(h) { return h >= 60 ? 'calm' : h >= 30 ? 'defiant' : 'remorseful'; }
function childFace(h) { return h >= 60 ? 'relieved' : h >= 30 ? 'defiant' : 'panicked'; }
function motherFace(health) { return health >= 2 ? 'calm' : 'remorseful'; }

// Places at the table: centre x, portrait width
const SEATS = { mother: { x: 118, w: 70 }, spouse: { x: 200, w: 74 }, child: { x: 282, w: 60 } };
const TABLE = 100; // top edge of the table; everyone is hidden below it
// The part of the 400-wide drawing that is shown: close in on the family
const VIEW_X = 70, VIEW_W = 260;
const VIEW_BOX = `${VIEW_X} 0 ${VIEW_W} 140`;

// Wall, window with the moon, a clock, the lamp over the table and the chair backs
function room() {
    const chair = ({ x, w }) => `
    <rect x="${x - w * 0.42}" y="38" width="${w * 0.84}" height="70" rx="8" fill="#4a2f20"/>
    <rect x="${x - w * 0.34}" y="44" width="${w * 0.68}" height="60" rx="6" fill="#5c3a28"/>`;
    return `
<svg class="home-room" viewBox="${VIEW_BOX}" preserveAspectRatio="none" aria-hidden="true">
    <defs>
        <linearGradient id="home-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#3a2a1e"/><stop offset="1" stop-color="#2a1e15"/>
        </linearGradient>
        <linearGradient id="home-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0d1630"/><stop offset="1" stop-color="#1f2b4a"/>
        </linearGradient>
        <radialGradient id="home-lamp-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="#ffd890" stop-opacity="0.5"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/>
        </radialGradient>
    </defs>
    <rect width="400" height="140" fill="url(#home-wall)"/>
    <!-- window -->
    <rect x="240" y="6" width="64" height="44" rx="2" fill="#5c4030"/>
    <rect x="244" y="10" width="56" height="36" fill="url(#home-night)"/>
    <circle cx="288" cy="20" r="5.5" fill="#f3ead2"/>
    <circle cx="290.6" cy="18.4" r="4.6" fill="#1a2440"/>
    <circle class="home-star" cx="252" cy="17" r="0.9" fill="#fff"/>
    <circle class="home-star s2" cx="266" cy="36" r="0.8" fill="#fff"/>
    <circle class="home-star s3" cx="294" cy="40" r="0.7" fill="#fff"/>
    <rect x="270.8" y="10" width="2.4" height="36" fill="#5c4030"/>
    <rect x="244" y="27" width="56" height="2.4" fill="#5c4030"/>
    <path d="M236 4 L250 4 L248 56 L238 56 Z" fill="#6b2d2d" opacity="0.9"/>
    <path d="M294 4 L308 4 L306 56 L296 56 Z" fill="#6b2d2d" opacity="0.9"/>
    <!-- a clock on the wall between the window and the lamp -->
    <circle cx="146" cy="20" r="9" fill="#8b6a3e"/><circle cx="146" cy="20" r="7.4" fill="#efe6cf"/>
    <path d="M146 13.6 L146 14.8 M152.4 20 L151.2 20 M146 26.4 L146 25.2 M139.6 20 L140.8 20" stroke="#8b6a3e" stroke-width="0.8"/>
    <!-- eight o'clock in the evening: hour hand on 8, minute hand on 12 -->
    <path d="M146 20 L142.9 21.8 M146 20 L146 14.4" stroke="#2a1d14" stroke-width="1.1" stroke-linecap="round"/>
    <circle cx="146" cy="20" r="0.8" fill="#2a1d14"/>
    <!-- lamp hanging over the table -->
    <circle class="home-glow" cx="200" cy="20" r="90" fill="url(#home-lamp-glow)"/>
    <rect x="199.3" y="0" width="1.4" height="9.5" fill="#2a1d14"/>
    <path d="M189 14 Q200 2 211 14 Z" fill="#c9a25a"/>
    <ellipse cx="200" cy="14.4" rx="11" ry="1.8" fill="#ffe2a8"/>
    ${Object.values(SEATS).map(chair).join('')}
</svg>`;
}

// Dinner on a plate: rice, beans in tomato sauce and a slice of green pepper
function food(x) {
    const y = TABLE + 7;
    return `
    <path d="M${x - 1} ${y + 0.6} Q${x + 5} ${y - 6} ${x + 11} ${y + 0.6} Z" fill="#f7f2e4"/>
    <path d="M${x + 2} ${y - 1} l1 0 M${x + 5} ${y - 2.6} l1 0 M${x + 7.5} ${y - 1.2} l1 0" stroke="#ded5bf" stroke-width="0.8"/>
    <ellipse cx="${x - 5}" cy="${y - 0.4}" rx="7.5" ry="2.8" fill="#a8461c"/>
    <circle cx="${x - 8}" cy="${y - 0.8}" r="1" fill="#f1e6cf"/><circle cx="${x - 5}" cy="${y - 1.6}" r="1" fill="#f1e6cf"/>
    <circle cx="${x - 2.6}" cy="${y - 0.2}" r="1" fill="#f1e6cf"/><circle cx="${x - 6}" cy="${y + 0.8}" r="1" fill="#f1e6cf"/>
    <path d="M${x - 14} ${y + 1.2} Q${x - 12} ${y - 1.6} ${x - 9.5} ${y + 1.8}" stroke="#4f8a2e" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
}

// The table in front of everyone, laid for dinner: a plate with a spoon on its
// left and a glass of tea at each place. Plates and glasses of family members who are away stay empty.
function table(ill, home) {
    const place = ([key, { x }]) => `
    <ellipse cx="${x}" cy="${TABLE + 7}" rx="17" ry="4.2" fill="#f2ede2"/>
    <ellipse cx="${x}" cy="${TABLE + 7}" rx="11" ry="2.6" fill="#e3dccb"/>
    ${home.includes(key) ? food(x) : ''}
    <path d="M${x - 20.6} ${TABLE + 1.5} L${x - 20.9} ${TABLE + 8}" stroke="#c9ccd1" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse cx="${x - 21}" cy="${TABLE + 9.8}" rx="1.6" ry="2.3" fill="#dfe2e6" stroke="#b5b9bf" stroke-width="0.4"/>
    <g transform="translate(${x + 30} ${TABLE + 10}) scale(0.74) translate(${-(x + 30)} ${-(TABLE + 10)})">
    <ellipse cx="${x + 30}" cy="${TABLE + 10}" rx="6" ry="1.6" fill="#ece6d8" stroke="#c8bea6" stroke-width="0.4"/>
    <path d="M${x + 26.4} ${TABLE - 2} L${x + 33.6} ${TABLE - 2} L${x + 31.8} ${TABLE + 3.5} L${x + 33.4} ${TABLE + 9.6} L${x + 26.6} ${TABLE + 9.6} L${x + 28.2} ${TABLE + 3.5} Z" fill="rgba(235,240,245,0.22)" stroke="#e8edf2" stroke-width="0.6"/>
    ${home.includes(key) ? `<path d="M${x + 26.9} ${TABLE - 0.6} L${x + 33.1} ${TABLE - 0.6} L${x + 31.6} ${TABLE + 3.5} L${x + 33} ${TABLE + 9.2} L${x + 27} ${TABLE + 9.2} L${x + 28.4} ${TABLE + 3.5} Z" fill="#b5481c" opacity="0.85"/>
    <ellipse cx="${x + 30}" cy="${TABLE - 0.6}" rx="3.1" ry="0.6" fill="#d9773a"/>` : ''}
    <path d="M${x + 27.6} ${TABLE + 0.6} L${x + 28.6} ${TABLE + 3}" stroke="#fff" stroke-width="0.6" opacity="0.7"/>
    </g>`;
    const m = SEATS.mother;
    return `
<svg class="home-front" viewBox="${VIEW_BOX}" preserveAspectRatio="none" aria-hidden="true">
    ${ill ? `
    <path d="M${m.x - m.w * 0.44} ${TABLE} Q${m.x - m.w * 0.42} 82 ${m.x - m.w * 0.2} 80 Q${m.x} 92 ${m.x + m.w * 0.2} 80 Q${m.x + m.w * 0.42} 82 ${m.x + m.w * 0.44} ${TABLE} Z" fill="#8b3a2e"/>
    <path d="M${m.x - m.w * 0.3} 84 L${m.x - m.w * 0.34} ${TABLE} M${m.x + m.w * 0.3} 84 L${m.x + m.w * 0.34} ${TABLE}" stroke="#c9a25a" stroke-width="1.4" opacity="0.6"/>` : ''}
    <rect x="0" y="${TABLE}" width="400" height="16" fill="#6e4a30"/>
    <rect x="0" y="${TABLE}" width="400" height="2" fill="#8a6040"/>
    ${Object.entries(SEATS).map(place).join('')}
    <!-- bread basket: slices of bread standing in a woven basket -->
    <path d="M157 ${TABLE + 1} Q160 ${TABLE - 9} 163 ${TABLE + 1} Z M161.5 ${TABLE + 1} Q166 ${TABLE - 11} 170.5 ${TABLE + 1} Z M168.5 ${TABLE + 1} Q172 ${TABLE - 8} 175.5 ${TABLE + 1} Z" fill="#f3e3bc" stroke="#c98a3c" stroke-width="1"/>
    <path d="M155 ${TABLE} L178 ${TABLE} L175.5 ${TABLE + 10} L157.5 ${TABLE + 10} Z" fill="#9a6a34"/>
    <path d="M155.8 ${TABLE + 3.3} L177.2 ${TABLE + 3.3} M156.6 ${TABLE + 6.7} L176.4 ${TABLE + 6.7}" stroke="#6e4720" stroke-width="0.7"/>
    <path d="M159.5 ${TABLE} L160.3 ${TABLE + 10} M164 ${TABLE} L164.4 ${TABLE + 10} M168.5 ${TABLE} L168.5 ${TABLE + 10} M173 ${TABLE} L172.6 ${TABLE + 10}" stroke="#6e4720" stroke-width="0.5" opacity="0.7"/>
    <!-- salad bowl between Deniz's tea and Ece's spoon: lettuce, tomato, cucumber, carrot -->
    <ellipse cx="247" cy="${TABLE + 1.5}" rx="10" ry="2.6" fill="#5e9a38"/>
    <circle cx="241" cy="${TABLE - 0.5}" r="3" fill="#6fb043"/><circle cx="246" cy="${TABLE - 2}" r="3.4" fill="#7cbd4c"/><circle cx="252" cy="${TABLE - 0.8}" r="3" fill="#6fb043"/>
    <circle cx="243.5" cy="${TABLE - 1.4}" r="1.8" fill="#d6372b"/><circle cx="250.5" cy="${TABLE - 2.2}" r="1.7" fill="#d6372b"/>
    <circle cx="247.5" cy="${TABLE + 0.2}" r="1.6" fill="#dfeec5" stroke="#5e9a38" stroke-width="0.5"/>
    <path d="M239.5 ${TABLE + 0.5} l2.5 -1.2 M253 ${TABLE + 0.3} l2.4 -1" stroke="#e8892a" stroke-width="0.9" stroke-linecap="round"/>
    <path d="M236.6 ${TABLE + 1.4} Q237.5 ${TABLE + 9.8} 247 ${TABLE + 9.8} Q256.5 ${TABLE + 9.8} 257.4 ${TABLE + 1.4} Z" fill="#f4f0e6" stroke="#cfc6b2" stroke-width="0.5"/>
    <path d="M238.5 ${TABLE + 4.5} Q247 ${TABLE + 6.4} 255.5 ${TABLE + 4.5}" stroke="#4f7fa8" stroke-width="0.7" fill="none"/>
    <path d="M0 ${TABLE + 16} L400 ${TABLE + 16} L400 140 L0 140 Z" fill="#e8e0cc"/>
    <path d="M0 ${TABLE + 16} L400 ${TABLE + 16}" stroke="#b03030" stroke-width="2" stroke-dasharray="6 6"/>
    <path d="M0 ${TABLE + 20} L400 ${TABLE + 20}" stroke="#c8bea6" stroke-width="1"/>
</svg>`;
}

function person(key, appearance, face) {
    const { x, w } = SEATS[key];
    // the portrait's lower edge sits just below the table top, hidden by it
    const bottom = 140 - TABLE - 6;
    const pct = v => (v / VIEW_W) * 100;
    return `<div class="home-person home-${key}" style="left:${pct(x - w / 2 - VIEW_X)}%;width:${pct(w)}%;bottom:${bottom / 1.4}%">${makePortrait(appearance, face)}</div>`;
}

// family = state.family ({ harmony, motherHealth, spouseLeft })
export function homeScene(family) {
    const h = family.harmony;
    const home = family.spouseLeft ? ['mother'] : ['mother', 'spouse', 'child'];
    // very ill: a sallow, yellowish face with tired eyes
    const mother = family.motherHealth === 0 ? { ...SANIYE, skin: '#dcc68e', sick: true } : SANIYE;
    let people = person('mother', mother, motherFace(family.motherHealth));
    if (!family.spouseLeft) {
        people += person('spouse', DENIZ, spouseFace(h));
        people += person('child', ECE, childFace(h));
    }
    return room() + people + table(family.motherHealth <= 1, home);
}
