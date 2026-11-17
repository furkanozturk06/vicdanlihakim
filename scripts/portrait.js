// Illustrated SVG portraits of defendants.
// makePortrait(appearance, emotion) -> SVG string, 120 x 150. Every portrait gets
// its own gradient ids so several can be on screen at once.

const shade = (hex, amount) => {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * amount)));
    const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

let uid = 0;

export function makePortrait(a, emotion) {
    const id = `p${uid++}`;
    const skin = a.skin, skinDark = shade(a.skin, -0.12), skinLight = shade(a.skin, 0.08);
    const hair = a.hair, hairDark = shade(a.hair, -0.12);
    const cloth = a.clothing, clothDark = shade(a.clothing, -0.12), clothLight = shade(a.clothing, 0.08);
    const old = a.age === 'old' || a.age === 'elderly';
    const female = a.gender === 'f';

    // ---- hair behind the head (long styles) ----
    let hairBack = '';
    if (a.hairStyle === 'long') {
        hairBack = `<path d="M28 60 C25 30 44 17 60 17 C77 17 96 30 92 60 L95 112 C90 118 82 116 79 106 L41 106 C38 116 30 118 25 112 Z" fill="${hairDark}"/>`;
    } else if (a.hairStyle === 'bob') {
        hairBack = `<path d="M28 60 C25 30 44 17 60 17 C77 17 96 30 92 60 L93 92 C88 98 82 96 80 90 L40 90 C38 96 32 98 27 92 Z" fill="${hairDark}"/>`;
    } else if (a.hairStyle === 'bun') {
        hairBack = `<circle cx="60" cy="16" r="11" fill="${hairDark}"/>`;
    }
    // The styles below are only for the judge's family (home.js); defendants never
    // get them, so no defendant looks like Deniz, Ece or Saniye.
    else if (a.hairStyle === 'wavy') {
        hairBack = `<path d="M27 60 C24 28 44 17 60 17 C77 17 97 28 93 60 C97 72 92 80 96 92 C99 102 92 110 96 118 C88 122 82 116 80 108 L40 108 C38 116 32 122 24 118 C28 110 21 102 24 92 C28 80 23 72 27 60 Z" fill="${hairDark}"/>`;
    } else if (a.hairStyle === 'pigtails') {
        // two bunches tied high on each side of the head, falling to the shoulders
        hairBack = [-1, 1].map(side => {
            const x = v => 60 + side * v;
            return `<path d="M${x(26)} 42 C${x(44)} 44 ${x(46)} 64 ${x(42)} 80 C${x(40)} 92 ${x(44)} 100 ${x(40)} 106 C${x(34)} 98 ${x(32)} 86 ${x(31)} 72 C${x(30)} 60 ${x(26)} 52 ${x(26)} 42 Z" fill="${hairDark}"/>
                <path d="M${x(36)} 58 C${x(40)} 70 ${x(38)} 84 ${x(39)} 96" stroke="${hair}" stroke-width="1.2" fill="none" opacity="0.7"/>`;
        }).join('');
    } else if (a.hairStyle === 'perm') {
        // short, tightly curled grandmother's perm
        hairBack = [[30, 48, 10], [90, 48, 10], [28, 62, 8], [92, 62, 8], [36, 34, 11], [84, 34, 11], [48, 24, 12], [72, 24, 12], [60, 21, 12]]
            .map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${hairDark}"/>`).join('');
    }

    // ---- clothing ----
    const shoulders = `<path d="M8 150 C9 120 28 106 60 106 C92 106 111 120 112 150 Z" fill="url(#${id}c)"/>`;
    let collar = '';
    if (a.outfit === 'suit') {
        collar = `
            <path d="M48 106 L60 128 L72 106 Z" fill="#ece6d8"/>
            <path d="M56 110 L60 106 L64 110 L62 140 L60 144 L58 140 Z" fill="#7a1f1f"/>
            <path d="M38 108 L52 106 L60 132 L46 150 L36 150 Z" fill="${clothDark}"/>
            <path d="M82 108 L68 106 L60 132 L74 150 L84 150 Z" fill="${clothDark}"/>`;
    } else if (a.outfit === 'kidTop') {
        // Ece's top (family only): a round neckline and a small heart on the chest
        collar = `
            <path d="M49 101 Q60 109 71 101 L73 108 Q60 117 47 108 Z" fill="${cloth}"/>
            <path d="M49 101 Q60 109 71 101" stroke="${clothDark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
            <path d="M77 124 C77 121 81 120.5 82 123.2 C83 120.5 87 121 87 124 C87 127 82 130 82 130 C82 130 77 127 77 124 Z" fill="#e85a6b"/>`;
    } else if (a.outfit === 'hoodie') {
        collar = `
            <path d="M34 112 C40 100 80 100 86 112 C78 118 42 118 34 112 Z" fill="${clothDark}"/>
            <line x1="54" y1="116" x2="53" y2="136" stroke="#e8e2d4" stroke-width="2" stroke-linecap="round"/>
            <line x1="66" y1="116" x2="67" y2="136" stroke="#e8e2d4" stroke-width="2" stroke-linecap="round"/>`;
    } else if (a.outfit === 'sweater') {
        collar = `<path d="M44 106 C48 116 72 116 76 106 C70 112 50 112 44 106 Z" fill="${clothDark}"/>`;
    } else {
        collar = `
            <path d="M47 106 L60 124 L73 106 Z" fill="#ece6d8"/>
            <path d="M47 106 L54 120 L60 112 Z" fill="#d8d0bf"/><path d="M73 106 L66 120 L60 112 Z" fill="#d8d0bf"/>`;
    }

    // ---- hair in front ----
    let hairFront = '';
    switch (a.hairStyle) {
        case 'short':
            hairFront = `<path d="M31 60 C27 32 44 21 61 21 C79 21 93 33 89 60 C86 48 79 40 70 38 C62 44 46 44 38 42 C34 46 32 52 31 60 Z" fill="${hair}"/>`;
            break;
        case 'side':
            hairFront = `<path d="M31 62 C27 32 44 20 62 20 C80 21 93 34 89 58 C84 44 74 37 64 36 C56 42 44 44 36 46 C33 51 32 56 31 62 Z" fill="${hair}"/>`;
            break;
        case 'curly':
            hairFront = [[38, 40, 11], [50, 30, 12], [64, 28, 12], [77, 34, 11], [85, 46, 9], [33, 52, 8]]
                .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hair}"/>`).join('');
            break;
        case 'bald':
            hairFront = `<path d="M30 60 C30 52 33 48 36 47 L37 64 Z" fill="${hair}"/><path d="M90 60 C90 52 87 48 84 47 L83 64 Z" fill="${hair}"/>`;
            break;
        case 'wavy': // side-swept waves, with a small flower pinned in the hair
            hairFront = `<path d="M30 64 C26 30 46 18 64 19 C82 20 95 34 90 62 C88 48 80 38 70 35 C60 34 50 38 44 44 C38 50 33 56 30 64 Z" fill="${hair}"/>
                ${[0, 72, 144, 216, 288].map(r => `<ellipse cx="80" cy="25.5" rx="2.6" ry="4" fill="${a.clip}" transform="rotate(${r} 80 30)"/>`).join('')}
                <circle cx="80" cy="30" r="2.4" fill="#e8b830"/>`;
            break;
        case 'perm':
            hairFront = [[38, 36, 7], [48, 30, 7.5], [60, 28, 8], [72, 30, 7.5], [82, 36, 7], [33, 46, 5.5], [87, 46, 5.5]]
                .map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${hair}"/><path d="M${cx - r * 0.5} ${cy} q${r * 0.5} ${-r * 0.5} ${r} 0" stroke="${hairDark}" stroke-width="1" fill="none"/>`).join('');
            break;
        case 'pigtails': // a fringe and a ribbon where each bunch is tied
            hairFront = `<path d="M30 62 C27 32 44 19 61 19 C79 19 94 32 90 62 C88 50 82 40 72 36 C66 42 50 44 40 40 C34 46 31 54 30 62 Z" fill="${hair}"/>
                ${[-1, 1].map(side => `<path d="M${60 + side * 30} 42 L${60 + side * 38} 36 L${60 + side * 37} 47 Z M${60 + side * 30} 42 L${60 + side * 23} 34 L${60 + side * 25} 46 Z" fill="${a.ribbon}"/><circle cx="${60 + side * 30}" cy="42" r="2.4" fill="${a.ribbon}"/>`).join('')}`;
            break;
        default: // long, bob, bun: a soft fringe
            hairFront = `<path d="M30 62 C27 32 44 19 61 19 C79 19 94 32 90 62 C88 50 82 40 72 36 C66 42 50 44 40 40 C34 46 31 54 30 62 Z" fill="${hair}"/>`;
    }

    // ---- face by emotion ----
    const brows = {
        remorseful: ['M41 52 L52 49', 'M68 49 L79 52'],
        panicked: ['M41 47 Q46 44 52 46', 'M68 46 Q74 44 79 47'],
        defiant: ['M41 48 L52 52', 'M68 52 L79 48'],
        proud: ['M41 50 Q46 48 52 50', 'M68 47 Q74 44 79 47'],
        relieved: ['M41 48 Q46 45 52 48', 'M68 48 Q74 45 79 48'],
        crying: ['M41 53 L52 48', 'M68 48 L79 53'],
        angry: ['M40 47 L53 54', 'M67 54 L80 47'],
    }[emotion] || ['M41 50 L52 50', 'M68 50 L79 50'];
    const browColor = old ? '#e6e6e6' : shade(a.hair, -0.25);

    const eyeOpen = emotion === 'panicked' ? 5 : emotion === 'proud' ? 2.2 : emotion === 'crying' ? 2.4 : emotion === 'angry' ? 3 : 3.8;
    // Relieved: eyes shut in a smile. Crying: tears run down from both eyes.
    const eyes = [46.5, 73.5].map(x => (emotion === 'relieved'
        ? `<path d="M${x - 5.5} 61 Q${x} 55 ${x + 5.5} 61" stroke="#2a1d14" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
        : `
        <ellipse cx="${x}" cy="60" rx="5.5" ry="${eyeOpen}" fill="#fbf8f2"/>
        <circle cx="${x}" cy="60.5" r="${Math.min(2.6, eyeOpen)}" fill="#2a1d14"/>
        ${emotion === 'remorseful' || emotion === 'crying' ? `<path d="M${x - 6} 57 Q${x} 55 ${x + 6} 57" stroke="${skinDark}" stroke-width="1.5" fill="none"/>` : ''}
        ${emotion === 'crying' ? `<path d="M${x + 2} 64 Q${x + 4.5} 70 ${x + 2.5} 74 Q${x} 70 ${x + 2} 64 Z" fill="#9fd3f0" opacity="0.9"/>` : ''}`)).join('');

    const mouth = {
        remorseful: '<path d="M52 84 Q60 79 68 84" stroke="#5a2a20" stroke-width="2" fill="none" stroke-linecap="round"/>',
        panicked: '<ellipse cx="60" cy="83" rx="4" ry="5" fill="#5a2a20"/>',
        defiant: '<path d="M52 82 L68 82" stroke="#5a2a20" stroke-width="2.2" stroke-linecap="round"/>',
        proud: '<path d="M52 81 Q61 87 70 79" stroke="#5a2a20" stroke-width="2" fill="none" stroke-linecap="round"/>',
        relieved: '<path d="M50 79 Q60 92 70 79 Z" fill="#5a2a20"/><path d="M53 80 Q60 83 67 80" stroke="#f4efe6" stroke-width="2" fill="none"/>',
        crying: '<path d="M51 87 Q55 81 60 84 Q65 81 69 87" stroke="#5a2a20" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
        angry: '<path d="M50 85 Q60 78 70 85 Z" fill="#5a2a20"/><path d="M53 83 L67 83" stroke="#f4efe6" stroke-width="1.6"/>',
    }[emotion] || '<path d="M53 81 Q60 86 67 81" stroke="#5a2a20" stroke-width="2" fill="none" stroke-linecap="round"/>';

    const nose = `<path d="M60 62 Q57 72 60 74 Q62 75 64 73" stroke="${skinDark}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    const freckles = a.freckles ? [[40, 70], [44, 73], [37, 74], [80, 70], [76, 73], [83, 74]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" fill="#a0603c" opacity="0.7"/>`).join('') : '';
    const blush = female ? `<ellipse cx="42" cy="72" rx="5" ry="3" fill="#e08a7a" opacity="0.25"/><ellipse cx="78" cy="72" rx="5" ry="3" fill="#e08a7a" opacity="0.25"/>` : '';

    const ageLines = old ? `
        <path d="M44 41 Q60 38 76 41" stroke="${skinDark}" stroke-width="1" fill="none" opacity="${a.hairStyle === 'bald' ? 0.9 : 0}"/>
        <path d="M41 67 Q44 69 47 68" stroke="${skinDark}" stroke-width="1" fill="none"/>
        <path d="M73 68 Q76 69 79 67" stroke="${skinDark}" stroke-width="1" fill="none"/>
        <path d="M49 74 Q47 81 51 87" stroke="${skinDark}" stroke-width="1.2" fill="none"/>
        <path d="M71 74 Q73 81 69 87" stroke="${skinDark}" stroke-width="1.2" fill="none"/>` : '';

    let facial = '';
    if (a.facialHair === 'mustache') {
        facial = `<path d="M49 79 Q55 74 60 77 Q65 74 71 79 Q66 80 60 79 Q54 80 49 79 Z" fill="${hair}"/>`;
    } else if (a.facialHair === 'beard') {
        facial = `<path d="M32 66 C33 86 44 100 60 100 C76 100 87 86 88 66 C84 78 78 86 70 88 Q60 84 50 88 C42 86 36 78 32 66 Z" fill="${hair}"/>
                  <path d="M49 79 Q55 75 60 77 Q65 75 71 79 Q65 81 60 80 Q55 81 49 79 Z" fill="${hair}"/>`;
    }

    const glasses = a.glasses ? `
        <rect x="38" y="53" width="18" height="14" rx="4" fill="rgba(200,220,255,0.18)" stroke="#2b2b2b" stroke-width="2"/>
        <rect x="64" y="53" width="18" height="14" rx="4" fill="rgba(200,220,255,0.18)" stroke="#2b2b2b" stroke-width="2"/>
        <path d="M56 59 Q60 56 64 59" stroke="#2b2b2b" stroke-width="2" fill="none"/>` : '';
    // a fever thermometer held in the corner of the mouth (Saniye when she is ill)
    const thermometer = a.thermometer ? `
        <path d="M62 83 L89 94" stroke="#f4f6f8" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M66 84.7 L85 92.4" stroke="#d6372b" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M62 83 L89 94" stroke="#9aa3ad" stroke-width="0.5" stroke-linecap="round" fill="none" opacity="0.6"/>` : '';
    const necklace = a.necklace ? [-12, -8, -4, 0, 4, 8, 12]
        .map(d => `<circle cx="${60 + d}" cy="${108 + (144 - d * d) / 24}" r="1.8" fill="#f4efe2" stroke="#cfc6b2" stroke-width="0.4"/>`).join('') : '';
    // gold studs; 'silver' gives small silver drops (Deniz)
    const earrings = a.earrings === 'silver'
        ? [30, 90].map(x => `<circle cx="${x}" cy="74" r="1.6" fill="#d8dce2"/><path d="M${x} 75.5 L${x} 79" stroke="#c4c9d1" stroke-width="1"/><path d="M${x} 78.5 C${x - 3} 82 ${x - 2} 85.5 ${x} 85.5 C${x + 2} 85.5 ${x + 3} 82 ${x} 78.5 Z" fill="#e3e7ec" stroke="#a9b0ba" stroke-width="0.5"/>`).join('')
        : a.earrings ? `<circle cx="30" cy="75" r="2.4" fill="#d9b440"/><circle cx="90" cy="75" r="2.4" fill="#d9b440"/>` : '';

    return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="${id}s" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="${skinLight}"/><stop offset="1" stop-color="${skinDark}"/></radialGradient>
            <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${clothLight}"/><stop offset="1" stop-color="${clothDark}"/></linearGradient>
        </defs>
        ${hairBack}
        ${shoulders}
        <path d="M50 86 L50 108 Q60 114 70 108 L70 86 Z" fill="${skinDark}"/>
        ${collar}
        ${necklace}
        <ellipse cx="31" cy="66" rx="5" ry="8" fill="${skinDark}"/><ellipse cx="89" cy="66" rx="5" ry="8" fill="${skinDark}"/>
        <path d="M60 26 C81 26 90 44 89 63 C88 84 76 99 60 99 C44 99 32 84 31 63 C30 44 39 26 60 26 Z" fill="url(#${id}s)"/>
        ${blush}
        ${freckles}
        ${ageLines}
        ${hairFront}
        <path d="${brows[0]}" stroke="${browColor}" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="${brows[1]}" stroke="${browColor}" stroke-width="3" stroke-linecap="round" fill="none"/>
        ${eyes}
        ${nose}
        ${facial}
        ${mouth}
        ${thermometer}
        ${glasses}
        ${earrings}
    </svg>`;
}
