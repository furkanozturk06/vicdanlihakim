/**
 * NPC & Case Module
 * Case generation, verdict rules, NPC rendering
 */

import { CRIMES, LADDER, VERDICT_LABELS, AMENDMENTS } from './cases.js';
import { DIRECTIVES, randomName } from './story.js';

// NPC appearance options
const NPC_APPEARANCES = {
    skinTones: ['#f5d0c5', '#e8beac', '#d4a574', '#c68642', '#8d5524', '#5c3811'],
    hairColors: ['#1a1a1a', '#4a3728', '#8b6914', '#d4a574', '#c9c9c9', '#2c1810'],
    clothingColors: ['#2d3748', '#4a5568', '#553c2e', '#1a365d', '#2f4858', '#4a3728', '#5c4033'],
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];

function generateNPCAppearance() {
    return {
        skin: pick(NPC_APPEARANCES.skinTones),
        hair: pick(NPC_APPEARANCES.hairColors),
        clothing: pick(NPC_APPEARANCES.clothingColors),
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
        const unsympathetic = candidates.filter(c => !c.statement.sympathy);
        if (unsympathetic.length > 0) candidates = unsympathetic;
    }
    const fresh = candidates.filter(c => !used.has(c.statement));
    if (fresh.length > 0) candidates = fresh;

    const { crimeType, statement } = pick(candidates);
    const crime = CRIMES[crimeType];
    used.add(statement);

    const isMinor = statement.tags && statement.tags.includes('minor');
    const age = statement.age || (isMinor ? 15 + Math.floor(Math.random() * 3) : 21 + Math.floor(Math.random() * 45));

    const evidence = [...statement.evidence];
    if (offender) {
        evidence[0] = `Sanık ${offender.day}. gün mahkemenizden "${verdictLabel(offender.verdict)}" kararıyla ayrılmıştı. ${evidence[0]}`;
    }

    return {
        id: Date.now(),
        crimeType,
        statementRef: statement,
        crime: `${crime.name} – ${statement.detail}`,
        detail: statement.detail,
        severity: crime.severity,
        name: offender ? offender.name : randomName(),
        age: offender ? offender.age + 1 : age,
        statement: statement.text,
        emotion: statement.emotion,
        sympathy: statement.sympathy,
        summary: statement.summary,
        evidence,
        question: statement.question,
        answer: statement.answer,
        correctVerdict: getCorrectVerdict(crimeType, statement, day),
        appearance: offender ? offender.appearance : generateNPCAppearance(),
        returning: Boolean(offender),
        asked: false,
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

    const npc = document.createElement('div');
    npc.className = `npc ${emotion}`;
    npc.innerHTML = `
        <div class="npc-head" style="background: ${appearance.skin}">
            <div class="npc-hair" style="background: ${appearance.hair}"></div>
            <div class="npc-face">
                <div class="npc-eyes">
                    <div class="npc-eye"></div>
                    <div class="npc-eye"></div>
                </div>
                <div class="npc-mouth"></div>
            </div>
        </div>
        <div class="npc-body" style="background: ${appearance.clothing}"></div>
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
