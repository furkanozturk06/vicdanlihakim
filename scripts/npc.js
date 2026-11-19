/**
 * NPC & Case Module
 * Case generation, verdict rules, NPC rendering
 */

import { CRIMES, LADDER, VERDICT_LABELS, AMENDMENTS } from './cases.js';
import { DIRECTIVES, randomName, randomGender } from './story.js';
import { makePortrait } from './portrait.js';
import { L, withPronouns } from './i18n.js';

// NPC appearance options
const NPC_APPEARANCES = {
    skinTones: ['#f5d0c5', '#e8beac', '#d4a574', '#c68642', '#8d5524', '#5c3811'],
    // No hair colour may match a skin tone, or the defendant looks bald
    hairColors: ['#1a1a1a', '#4a3728', '#8b6914', '#a8742a', '#2c1810', '#6b2d12'],
    grayHair: ['#b8b8b8', '#d9d9d9', '#8f8f8f'],
    clothingColors: ['#2d3748', '#4a5568', '#553c2e', '#1a365d', '#2f4858', '#4a3728', '#5c4033', '#5a2a2a', '#2f4a32'],
    whiteHair: ['#ececec', '#f5f5f5'],
    // Women always get clearly long hair, a bun or a shoulder-length bob
    hairStyles: { f: ['long', 'bun', 'bob', 'long'], m: ['short', 'side', 'curly', 'short'] },
    oldHairStyles: { f: ['bun', 'bob'], m: ['short', 'side'] },
    outfits: { f: ['shirt', 'hoodie', 'sweater'], m: ['suit', 'shirt', 'hoodie', 'sweater'] },
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const chance = (p) => Math.random() < p;

// Hair colour by age: graying starts in the fifties, always gray from 60, white from 70
function hairColorFor(age) {
    if (age >= 70) return pick(NPC_APPEARANCES.whiteHair);
    if (age >= 60) return pick(NPC_APPEARANCES.grayHair);
    if (age >= 50 && chance(0.4)) return pick(NPC_APPEARANCES.grayHair);
    return pick(NPC_APPEARANCES.hairColors);
}

// Look of a defendant (or a witness), matching their gender and age
export function generateNPCAppearance(age, gender) {
    const female = gender === 'f';
    const old = age >= 60;
    const middle = age >= 40;
    const baldChance = age >= 60 ? 0.45 : age >= 40 ? 0.15 : 0;
    const bald = !female && chance(baldChance);
    const styles = old ? NPC_APPEARANCES.oldHairStyles : NPC_APPEARANCES.hairStyles;
    return {
        gender,
        skin: pick(NPC_APPEARANCES.skinTones),
        hair: hairColorFor(age),
        hairStyle: bald ? 'bald' : pick(styles[female ? 'f' : 'm']),
        facialHair: !female && age >= 18 && chance(0.4) ? pick(['mustache', 'beard']) : 'none',
        earrings: female && chance(0.5),
        glasses: chance(old ? 0.6 : middle ? 0.35 : 0.15),
        age: age >= 70 ? 'elderly' : old ? 'old' : '',
        clothing: pick(NPC_APPEARANCES.clothingColors),
        outfit: pick(NPC_APPEARANCES.outfits[female ? 'f' : 'm']),
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
    // Proven innocence overrides everything
    if (statement.law === 'innocent') return 'release';

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
export function generateCase(day, directive = null, offender = null, used = new Set(), branch = null) {
    // Act-2 crimes only appear in their own branch
    // Act-2 crimes only appear in their own branch; endless mode ('all') uses every crime
    const all = Object.keys(CRIMES).filter(c => branch === 'all' || !CRIMES[c].branch || CRIMES[c].branch === branch);
    let pool = all;

    if (offender) {
        pool = pool.filter(c => CRIMES[c].severity >= 3);
    } else if (day < 3) {
        pool = pool.filter(c => CRIMES[c].severity <= 3);
    } else if (day >= 5 && day <= 15 && branch !== 'all') {
        pool = pool.filter(c => CRIMES[c].severity >= 3);
    }

    // The directive tilts the day towards its crimes without taking it over
    let directed = null;
    if (!offender && directive && directive.crimeFilter && Math.random() < 0.6) {
        const filtered = pool.filter(c => directive.crimeFilter.includes(c));
        if (filtered.length > 0) directed = filtered;
    }
    // In act 2, half of the cases come from the branch's own crimes
    if (!offender && !directed && branch && branch !== 'all' && Math.random() < 0.5) {
        const own = pool.filter(c => CRIMES[c].branch === branch);
        if (own.length > 0) directed = own;
    }

    const statementsOf = (crimes) => {
        let list = crimes.flatMap(crimeType => CRIMES[crimeType].statements.map(statement => ({ crimeType, statement })));
        if (offender) {
            // Adults with an unsympathetic story; fixed-age and minor statements would contradict the offender's age
            const offenderGender = offender.appearance && offender.appearance.gender;
            const fitting = list.filter(c => !c.statement.sympathy && !c.statement.age && !(c.statement.tags || []).includes('minor')
                && (!c.statement.gender || !offenderGender || c.statement.gender === offenderGender));
            if (fitting.length > 0) list = fitting;
        }
        return list;
    };

    // Prefer cases the player has not seen: first from the directive's crimes, then the
    // day's pool, then any crime. Repeat only when every case has been seen.
    let candidates = null;
    for (const crimes of [directed, pool, all]) {
        if (!crimes) continue;
        const fresh = statementsOf(crimes).filter(c => !used.has(c.statement));
        if (fresh.length > 0) {
            candidates = fresh;
            break;
        }
    }
    if (!candidates) {
        // Every case has been seen: start a new cycle
        used.clear();
        candidates = statementsOf(directed || pool);
    }

    const { crimeType, statement } = pick(candidates);
    used.add(statement);

    if (!offender) return buildCase(crimeType, statement, day);

    const c = buildCase(crimeType, statement, day, {
        name: offender.name,
        age: offender.age,
        appearance: offender.appearance,
        returning: true,
        extraTags: offender.verdict === 'release' ? [] : ['repeat'],
    });
    c.evidence[0] = offender.crime
        ? L('Sanık {0}. gün "{1}" davasında mahkemenizden "{2}" kararıyla ayrılmıştı; şimdi yeni bir suçla karşınızda. {3}', offender.day, offender.crime, verdictLabel(offender.verdict), c.evidence[0])
        : L('Sanık {0}. gün mahkemenizden "{1}" kararıyla ayrılmıştı. {2}', offender.day, verdictLabel(offender.verdict), c.evidence[0]);
    return c;
}

// A statement with tags the case adds (a returning defendant's 'repeat')
const withTags = (statement, extra) => (extra && extra.length ? { ...statement, tags: [...(statement.tags || []), ...extra] } : statement);

// The amendment a wrong verdict left out: the verdict is what the law gives without it
export function missedAmendment(c, verdict, day) {
    const st = c.statementRef;
    if (!st || st.law === 'innocent' || verdict === c.correctVerdict) return null;
    const tagged = withTags(st, c.extraTags);
    const tags = tagged.tags || [];
    return activeAmendments(day).find(a => tags.includes(a.tag)
        && getCorrectVerdict(c.crimeType, { ...tagged, tags: tags.filter(t => t !== a.tag) }, day) === verdict) || null;
}

// Turn a statement into a playable case. `overrides` can fix name, age, appearance and flags.
export function buildCase(crimeType, statement, day, overrides = {}) {
    const crime = CRIMES[crimeType];
    const isMinor = statement.tags && statement.tags.includes('minor');
    const age = statement.age || (isMinor ? 15 + Math.floor(Math.random() * 3) : 21 + Math.floor(Math.random() * 45));
    // Gender: fixed by the story (e.g. a stepfather), carried by a returning defendant, or random
    const gender = overrides.gender || statement.gender || overrides.appearance?.gender || randomGender();

    return {
        id: Date.now(),
        crimeType,
        statementRef: statement,
        crime: crime.name,
        detail: statement.detail,
        severity: crime.severity,
        name: randomName(gender),
        gender,
        age,
        statement: statement.text,
        emotion: statement.emotion,
        sympathy: statement.sympathy,
        summary: withPronouns(statement.summary, gender),
        evidence: statement.evidence.map(e => withPronouns(e, gender)),
        question: statement.question,
        answer: statement.answer,
        correctVerdict: getCorrectVerdict(crimeType, withTags(statement, overrides.extraTags), day),
        appearance: generateNPCAppearance(overrides.age ?? age, gender),
        returning: false,
        asked: false,
        // Multi-stage cases: a report is pending; postponing brings the case back with it
        delayed: statement.delayed
            ? { ...statement.delayed, note: withPronouns(statement.delayed.note, gender), evidence: withPronouns(statement.delayed.evidence, gender) }
            : null,
        revealed: false,
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

// Create NPC element: an illustrated portrait; the wrapper carries the emotion animation
export function createNPCElement(caseData) {
    const { appearance, emotion } = caseData;
    const a = { ...appearance };
    // Saves from before the age styles only had a "wrinkles" flag
    if (!a.age && a.wrinkles) a.age = 'old';

    const npc = document.createElement('div');
    npc.className = `npc ${emotion}`;
    npc.innerHTML = makePortrait(a, emotion);
    return npc;
}

export function getRandomDirective() {
    return pick(DIRECTIVES);
}

// What the verdict means for the defendant: freedom, a light penalty, prison or death
function verdictWeight(verdict) {
    if (verdict === 'release') return 'release';
    if (verdict === 'death') return 'death';
    if (verdict.startsWith('jail')) return 'heavy';
    return 'light';
}

// An objection after the judge picks a verdict, before the gavel falls. It comes
// just as often after a right verdict as after a wrong one, and it can be right or
// wrong either way: after a wrong verdict half of the objections point at the lawful
// verdict and half at another wrong one; after a right verdict it always tries to
// lead the judge astray with another law of the same crime. So an objection never
// tells the judge whether they were right. The defence asks for lighter sentences,
// the prosecution for harsher ones. Story cases and cases still waiting for a report
// never get one.
// -> { side: 'defence'|'prosecution', verdict, text } or null
const OBJECTION_CHANCE = 0.15;

export function pickObjection(c, verdict) {
    if (c.finale || c.selinCase || c.specialKey || !c.statementRef) return null;
    if (c.delayed && !c.revealed) return null;
    const crime = CRIMES[c.crimeType];
    const reasonFor = (lawKey) => (lawKey === 'innocent' ? L('sanığın suçu işlemediği kanıtlandı')
        : lawKey === 'base' ? L('olağan ceza uygulanmalı')
            : crime.laws[lawKey].text);

    if (Math.random() >= OBJECTION_CHANCE) return null;
    let proposed;
    let reason;
    if (verdict !== c.correctVerdict && Math.random() < 0.5) {
        proposed = c.correctVerdict;
        reason = reasonFor(c.statementRef.law);
    } else {
        // a misleading objection: another law of the crime, neither the judge's verdict nor the lawful one
        const others = Object.entries(crime.laws).filter(([key, law]) => key !== c.statementRef.law
            && law.verdict !== verdict && law.verdict !== c.correctVerdict && law.verdict !== 'death');
        if (!others.length) return null;
        const [key, law] = pick(others);
        proposed = law.verdict;
        reason = reasonFor(key);
    }
    const lighter = LADDER.indexOf(proposed) < LADDER.indexOf(verdict);
    const label = verdictLabel(proposed);
    return {
        side: lighter ? 'defence' : 'prosecution',
        verdict: proposed,
        text: lighter
            ? L('Avukat ayağa kalktı: "İtiraz ediyorum, sayın hakim! Kanuna göre: {0}. Müvekkilime {1} verilmeli."', reason, label)
            : L('Savcı ayağa kalktı: "İtiraz ediyorum, sayın hakim! Kanuna göre: {0}. Sanığa {1} verilmeli."', reason, label),
    };
}

// Face, movement and way out after the verdict (what happened to them, not
// whether it was lawful). exit: 'free' walks out, 'taken' is led down, 'quiet' steps back.
const VISIBLE_REACTIONS = {
    release: { remorseful: 'relieved', panicked: 'relieved', defiant: 'proud', proud: 'proud' },
    light: { remorseful: 'remorseful', panicked: 'relieved', defiant: 'defiant', proud: 'proud' },
    heavy: { remorseful: 'crying', panicked: 'panicked', defiant: 'angry', proud: 'remorseful' },
    death: { remorseful: 'crying', panicked: 'panicked', defiant: 'angry', proud: 'remorseful' },
};
// A fine or a prison term judged against what the law asks for: someone who got off
// lighter than they expected does not get angry, and someone punished harder does not smile
const LUCKY = { remorseful: 'relieved', panicked: 'relieved', defiant: 'proud', proud: 'proud' };
const WRONGED = { remorseful: 'crying', panicked: 'panicked', defiant: 'angry', proud: 'angry' };
const MOTION = { relieved: 'react-hop', proud: 'react-nod', crying: 'react-sink', panicked: 'react-shock', angry: 'react-shake', remorseful: 'react-sink', defiant: 'react-shake' };

// -1: lighter than the law asks, 1: harsher, 0: as the law asks (release and death keep their own reactions)
function verdictShift(verdict, lawful) {
    const weight = verdictWeight(verdict);
    if (!lawful || weight === 'release' || weight === 'death') return 0;
    return Math.sign(LADDER.indexOf(verdict) - LADDER.indexOf(lawful));
}

export function verdictReaction(verdict, emotion, lawful) {
    const weight = verdictWeight(verdict);
    const shift = verdictShift(verdict, lawful);
    const faces = shift < 0 ? LUCKY : shift > 0 ? WRONGED : VISIBLE_REACTIONS[weight];
    const face = faces[emotion] || emotion;
    return { face, motion: MOTION[face] || 'react-nod', exit: weight === 'release' ? 'free' : weight === 'light' ? 'quiet' : 'taken', death: weight === 'death' };
}

// The defendant reacts to what happened to them, not to whether the judge was right
const DEFENDANT_REACTIONS = {
    release: {
        remorseful: L('Sanık gözyaşları içinde size teşekkür etti.'),
        panicked: L('Sanık rahatlamayla dizlerinin üstüne çöktü.'),
        defiant: L('Sanık sırıtarak salondan çıktı.'),
        proud: L('Sanık "Biliyordum" der gibi başını salladı ve kibirle çıktı.'),
    },
    light: {
        remorseful: L('Sanık başını eğip kararı kabul etti.'),
        panicked: L('Sanık derin bir nefes aldı; beklediğinden hafif çıkmıştı.'),
        defiant: L('Sanık homurdandı ama sesini çıkarmadı.'),
        proud: L('Sanık omuz silkti; bu cezayı umursamıyor gibiydi.'),
    },
    heavy: {
        remorseful: L('Sanık sessizce ağladı; görevliler kolundan tuttu.'),
        panicked: L('Sanık "Hayır, hayır!" diye haykırdı.'),
        defiant: L('Sanık öfkeyle masaya vurdu; görevliler zor tuttu.'),
        proud: L('Sanığın kibri bir anda söndü.'),
    },
    // a fine or prison term lighter than the law asks
    lucky: {
        remorseful: L('Sanık şaşkınlıkla başını kaldırdı; beklediğinden hafif çıkmıştı. Sessizce teşekkür etti.'),
        panicked: L('Sanık derin bir nefes aldı; beklediğinden çok hafif çıkmıştı.'),
        defiant: L('Sanık bıyık altından gülerek kararı dinledi.'),
        proud: L('Sanık "Biliyordum" der gibi gülümsedi.'),
    },
    // a fine or prison term harsher than the law asks
    wronged: {
        remorseful: L('Sanık kararı duyunca yıkıldı; bu kadarını beklemiyordu.'),
        panicked: L('Sanık "Bu haksızlık!" diye haykırdı.'),
        defiant: L('Sanık öfkeyle masaya vurdu: "Bu ceza fazla!"'),
        proud: L('Sanığın kibri bir anda söndü; cezanın ağırlığına inanamadı.'),
    },
    death: {
        remorseful: L('Sanık bembeyaz kesildi, tek kelime edemedi.'),
        panicked: L('Sanık bayıldı; görevliler kucaklayarak çıkardı.'),
        defiant: L('Sanık size lanetler yağdırarak götürüldü.'),
        proud: L('Sanık son kez size baktı, yüzünde hiçbir ifade yoktu.'),
    },
};

/**
 * Feedback after a verdict: a title about the judge's decision, the defendant's reaction
 * to their own fate, and the courtroom's reaction when the verdict strays from the law.
 */
export function verdictFeedback(caseData, result, verdict, day) {
    let title = L('Adalet Yerini Buldu!');
    if (result.partial) title = L('Kanuna Yakın');
    else if (result.tooLenient) title = L('Fazla Hafif Karar');
    else if (result.tooHarsh) title = L('Fazla Ağır Karar');

    const shift = verdictShift(verdict, caseData.correctVerdict);
    const mood = shift < 0 ? 'lucky' : shift > 0 ? 'wronged' : verdictWeight(verdict);
    const parts = [DEFENDANT_REACTIONS[mood][caseData.emotion]];

    if (result.tooLenient) {
        parts.push(caseData.sympathy
            ? L('Salonda şaşkın mırıltılar yükseldi.')
            : L('Mağdur yakınları öfkeyle salonu terk etti.'));
    } else if (result.tooHarsh) {
        parts.push(caseData.sympathy
            ? L('Sanığın ailesi feryat etti; avukat temyize gideceğini açıkladı.')
            : L('Sanığın avukatı temyize gideceğini açıkladı.'));
    }

    if (!result.correct || result.partial) {
        parts.push(L('Kanuna göre doğru karar: {0}.', verdictLabel(caseData.correctVerdict)));
        const missed = day ? missedAmendment(caseData, verdict, day) : null;
        if (missed) parts.push(L('{0} uygulanmadı: {1}', missed.title, missed.text));
    }

    return { title, message: parts.join(' ') };
}
