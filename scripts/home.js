// The family at the dinner table, shown at the top of the evening screen. We
// look across the table from the judge's own seat: Saniye on the left, Deniz in
// the middle, Ece on the right. While Deniz has left, her chair and Ece's stay
// empty but their plates are still laid. Saniye wears a shawl when she is ill.
// Their faces follow the family's mood. Drawn on a 400 x 140 grid.
import { makePortrait } from './portrait.js';

// Their looks use hair styles and colours no defendant ever gets (wavy hair with
// a clip, ribboned braids and freckles, a white tülbent), so nobody in court looks like them.
const DENIZ = {
    gender: 'f', skin: '#f0c8b0', hair: '#8a3d1c', hairStyle: 'wavy', clip: '#f6f0e6', facialHair: 'none',
    earrings: true, glasses: false, age: '', clothing: '#6b3550', outfit: 'sweater',
};
const ECE = {
    gender: 'f', skin: '#f0c8b0', hair: '#8a3d1c', hairStyle: 'pigtails', ribbon: '#c0392b', freckles: true,
    facialHair: 'none', earrings: false, glasses: false, age: '', clothing: '#e0a030', outfit: 'hoodie',
};
const SANIYE = {
    gender: 'f', skin: '#e3b496', hair: '#ececec', hairStyle: 'headscarf', scarf: '#f4f1e8', facialHair: 'none',
    earrings: false, glasses: true, age: 'elderly', clothing: '#2f5a5a', outfit: 'sweater',
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
    <rect x="199.3" y="0" width="1.4" height="5" fill="#2a1d14"/>
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

// The table in front of everyone, laid for dinner: a plate and a glass of tea at
// each place. Plates of family members who are away stay empty.
function table(ill, home) {
    const place = ([key, { x }]) => `
    <ellipse cx="${x}" cy="${TABLE + 7}" rx="17" ry="4.2" fill="#f2ede2"/>
    <ellipse cx="${x}" cy="${TABLE + 7}" rx="11" ry="2.6" fill="#e3dccb"/>
    ${home.includes(key) ? food(x) : ''}
    <path d="M${x + 24} ${TABLE + 1} L${x + 30} ${TABLE + 1} L${x + 28.6} ${TABLE + 5} L${x + 30} ${TABLE + 9} L${x + 24} ${TABLE + 9} L${x + 25.4} ${TABLE + 5} Z" fill="#a8401c" opacity="0.92"/>
    <ellipse cx="${x + 27}" cy="${TABLE + 9.6}" rx="5" ry="1.3" fill="#d8d0bf"/>`;
    const m = SEATS.mother;
    return `
<svg class="home-front" viewBox="${VIEW_BOX}" preserveAspectRatio="none" aria-hidden="true">
    ${ill ? `
    <path d="M${m.x - m.w * 0.44} ${TABLE} Q${m.x - m.w * 0.42} 82 ${m.x - m.w * 0.2} 80 Q${m.x} 92 ${m.x + m.w * 0.2} 80 Q${m.x + m.w * 0.42} 82 ${m.x + m.w * 0.44} ${TABLE} Z" fill="#8b3a2e"/>
    <path d="M${m.x - m.w * 0.3} 84 L${m.x - m.w * 0.34} ${TABLE} M${m.x + m.w * 0.3} 84 L${m.x + m.w * 0.34} ${TABLE}" stroke="#c9a25a" stroke-width="1.4" opacity="0.6"/>` : ''}
    <rect x="0" y="${TABLE}" width="400" height="16" fill="#6e4a30"/>
    <rect x="0" y="${TABLE}" width="400" height="2" fill="#8a6040"/>
    ${Object.entries(SEATS).map(place).join('')}
    <ellipse cx="163" cy="${TABLE + 8}" rx="9" ry="3.4" fill="#8b5a2b"/>
    <ellipse cx="163" cy="${TABLE + 6.4}" rx="6.4" ry="2.2" fill="#d9a55c"/>
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
    let people = person('mother', SANIYE, motherFace(family.motherHealth));
    if (!family.spouseLeft) {
        people += person('spouse', DENIZ, spouseFace(h));
        people += person('child', ECE, childFace(h));
    }
    return room() + people + table(family.motherHealth <= 1, home);
}
