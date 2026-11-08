/**
 * NPC & Case Module
 * Case generation, verdict rules, NPC rendering
 */

import { CRIMES, LADDER, VERDICT_LABELS, AMENDMENTS } from './cases.js';
import { DIRECTIVES, randomName } from './story.js';

// NPC appearance options
const NPC_APPEARANCES = {
    skinTones: ['#f5d0c5', '#e8beac', '#d4a574', '#c68642', '#8d5524', '#5c3811'],
    hairColors: ['#1a1a1a', '#4a3728', '#8b6914', '#d4a574', '#2c1810', '#6b2d12'],
    grayHair: ['#b8b8b8', '#d9d9d9', '#8f8f8f'],
    clothingColors: ['#2d3748', '#4a5568', '#553c2e', '#1a365d', '#2f4858', '#4a3728', '#5c4033', '#5a2a2a', '#2f4a32'],
    hairStyles: ['short', 'long', 'curly', 'bun', 'side'],
    outfits: ['suit', 'shirt', 'hoodie', 'sweater'],
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const chance = (p) => Math.random() < p;

// Look of a defendant; older people go gray or bald more often
function generateNPCAppearance(age) {
    const old = age >= 55;
    const middle = age >= 38;
    const bald = middle && chance(old ? 0.35 : 0.15);
    return {
        skin: pick(NPC_APPEARANCES.skinTones),
        hair: old && chance(0.75) ? pick(NPC_APPEARANCES.grayHair) : pick(NPC_APPEARANCES.hairColors),
        hairStyle: bald ? 'bald' : pick(NPC_APPEARANCES.hairStyles),
        facialHair: age >= 18 && chance(0.35) ? pick(['mustache', 'beard']) : 'none',
        glasses: chance(middle ? 0.35 : 0.15),
        wrinkles: old,
        clothing: pick(NPC_APPEARANCES.clothingColors),
        outfit: pick(NPC_APPEARANCES.outfits),
    };
}

export function verdictLabel(key) {
    return VERDICT_LABELS[key] || key;
}

// Amendments in force on a given day
export function activeAmendments(day) {
    return AMENDMENTS.filter(a => a.day <= day);
}

// Correct verdict for a statement on a given day (law + amendments)
export function getCorrectVerdict(crimeType, statement, day) {
    const base = CRIMES[crimeType].laws[statement.law].verdict;
    if (base === 'death') return base;

    let idx = LADDER.indexOf(base);
    for (const a of activeAmendments(day)) {
        if (statement.tags && statement.tags.includes(a.tag)) {
            idx += a.shift;
        }
    }
    const maxIdx = LADDER.indexOf('jail-long');
    return LADDER[Math.max(0, Math.min(maxIdx, idx))];
}

/**
 * Generate a random case.
 * `offender` (optional) is a previously released defendant who comes back
 * with a heavier crime, keeping their name and appearance.
 */
export function generateCase(day, directive = null, offender = null, used = new Set()) {
    let pool = Object.keys(CRIMES);

    if (offender) {
        pool = pool.filter(c => CRIMES[c].severity >= 3);
    } else if (day < 3) {
        pool = pool.filter(c => CRIMES[c].severity <= 3);
    } else if (day >= 5) {
        pool = pool.filter(c => CRIMES[c].severity >= 3);
    }

    // The directive tilts the day towards its crimes without taking it over
    if (!offender && directive && directive.crimeFilter && Math.random() < 0.6) {
        const filtered = pool.filter(c => directive.crimeFilter.includes(c));
        if (filtered.length > 0) pool = filtered;
    }

    // Candidate statements, preferring ones the player has not seen yet
    let candidates = pool.flatMap(crimeType => CRIMES[crimeType].statements.map(statement => ({ crimeType, statement })));
    if (offender) {
        // Adults with an unsympathetic story; fixed-age and minor statements would contradict the offender's age
        const fitting = candidates.filter(c => !c.statement.sympathy && !c.statement.age && !(c.statement.tags || []).includes('minor'));
        if (fitting.length > 0) candidates = fitting;
    }
    const fresh = candidates.filter(c => !used.has(c.statement));
    if (fresh.length > 0) candidates = fresh;

    const { crimeType, statement } = pick(candidates);
    used.add(statement);

    if (!offender) return buildCase(crimeType, statement, day);

    const c = buildCase(crimeType, statement, day, {
        name: offender.name,
        age: offender.age,
        appearance: offender.appearance,
        returning: true,
    });
    c.evidence[0] = `Sanık ${offender.day}. gün mahkemenizden "${verdictLabel(offender.verdict)}" kararıyla ayrılmıştı. ${c.evidence[0]}`;
    return c;
}

// Turn a statement into a playable case. `overrides` can fix name, age, appearance and flags.
export function buildCase(crimeType, statement, day, overrides = {}) {
    const crime = CRIMES[crimeType];
    const isMinor = statement.tags && statement.tags.includes('minor');
    const age = statement.age || (isMinor ? 15 + Math.floor(Math.random() * 3) : 21 + Math.floor(Math.random() * 45));

    return {
        id: Date.now(),
        crimeType,
        statementRef: statement,
        crime: crime.name,
        detail: statement.detail,
        severity: crime.severity,
        name: randomName(),
        age,
        statement: statement.text,
        emotion: statement.emotion,
        sympathy: statement.sympathy,
        summary: statement.summary,
        evidence: [...statement.evidence],
        question: statement.question,
        answer: statement.answer,
        correctVerdict: getCorrectVerdict(crimeType, statement, day),
        appearance: generateNPCAppearance(overrides.age ?? age),
        returning: false,
        asked: false,
        ...overrides,
    };
}

/**
 * Compare the player's verdict with the correct one.
 * Same type, one step off (e.g. Hafif vs Orta para cezası) counts as partially correct.
 */
export function evaluateVerdict(correct, player) {
    const diff = LADDER.indexOf(player) - LADDER.indexOf(correct);
    if (diff === 0) {
        return { correct: true, partial: false, diff, severity: 0 };
    }

    const sameType = correct.split('-')[0] === player.split('-')[0];
    if (sameType && Math.abs(diff) === 1) {
        return { correct: true, partial: true, diff, severity: 1 };
    }

    return {
        correct: false,
        partial: false,
        diff,
        severity: Math.abs(diff),
        tooHarsh: diff > 0,
        tooLenient: diff < 0,
    };
}

// Create NPC HTML element
export function createNPCElement(caseData) {
    const { appearance, emotion } = caseData;

    const a = appearance;

    const npc = document.createElement('div');
    npc.className = [
        'npc', emotion,
        `hair-${a.hairStyle || 'short'}`,
        `outfit-${a.outfit || 'shirt'}`,
        a.wrinkles ? 'old' : '',
    ].join(' ');
    npc.style.setProperty('--skin', a.skin);
    npc.style.setProperty('--hair', a.hair);
    npc.style.setProperty('--cloth', a.clothing);

    const facial = a.facialHair && a.facialHair !== 'none' ? `<div class="npc-${a.facialHair}"></div>` : '';
    npc.innerHTML = `
        <div class="npc-body"><div class="npc-collar"></div></div>
        <div class="npc-neck"></div>
        <div class="npc-head">
            <div class="npc-ear left"></div>
            <div class="npc-ear right"></div>
            <div class="npc-hair"></div>
            <div class="npc-face">
                <div class="npc-brows"><span></span><span></span></div>
                <div class="npc-eyes"><div class="npc-eye"></div><div class="npc-eye"></div></div>
                ${a.glasses ? '<div class="npc-glasses"></div>' : ''}
                ${facial}
                <div class="npc-mouth"></div>
            </div>
        </div>
    `;

    return npc;
}

export function getRandomDirective() {
    return pick(DIRECTIVES);
}

// Get emotion-based feedback messages (TURKISH)
export function getEmotionFeedback(emotion, isCorrect) {
    if (isCorrect) {
        const reactions = {
            'remorseful': 'Sanık kaderini kabullenip başını eğdi.',
            'panicked': 'Sanığın yüzünde rahatlama belirdi.',
            'defiant': 'Sanık homurdandı ama kararı kabul etti.',
            'proud': 'Sanığın gururu bir anlığına sarsıldı.',
        };
        return reactions[emotion] || 'Sanık kararı kabul etti.';
    }
    const reactions = {
        'remorseful': 'Sanığın gözlerinden yaşlar süzüldü...',
        'panicked': 'Sanık umutsuzluk içinde yığıldı.',
        'defiant': 'Sanık öfkeyle bağırdı!',
        'proud': 'Sanığın gözleri öfkeyle parladı.',
    };
    return reactions[emotion] || 'Sanık karara tepki verdi.';
}
