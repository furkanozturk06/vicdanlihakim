// Validates scripts/cases.js: every statement must point at an existing law,
// carry all fields, and only use known amendment tags. Run: npm run check
import { CRIMES, AMENDMENTS, LADDER } from '../scripts/cases.js';

const REQUIRED = ['text', 'emotion', 'law', 'detail', 'summary', 'evidence', 'question', 'answer'];
const EMOTIONS = ['remorseful', 'panicked', 'defiant', 'proud'];
const TAGS = AMENDMENTS.map(a => a.tag);

const errors = [];
const warnings = [];
let count = 0;

for (const [crimeKey, crime] of Object.entries(CRIMES)) {
    if (!crime.laws.base) errors.push(`${crimeKey}: no base law`);
    for (const [lawKey, law] of Object.entries(crime.laws)) {
        if (!LADDER.includes(law.verdict)) errors.push(`${crimeKey}.${lawKey}: unknown verdict ${law.verdict}`);
        if (lawKey !== 'base' && !law.text) errors.push(`${crimeKey}.${lawKey}: missing text`);
    }

    const usedLaws = new Set();
    crime.statements.forEach((s, i) => {
        count++;
        const where = `${crimeKey}[${i}] "${s.detail}"`;
        for (const f of REQUIRED) if (s[f] === undefined) errors.push(`${where}: missing ${f}`);
        if (typeof s.sympathy !== 'boolean') errors.push(`${where}: sympathy must be boolean`);
        if (!EMOTIONS.includes(s.emotion)) errors.push(`${where}: unknown emotion ${s.emotion}`);
        if (!crime.laws[s.law] && s.law !== 'innocent') errors.push(`${where}: unknown law ${s.law}`);
        if (s.law === 'innocent' && !s.delayed) errors.push(`${where}: innocence must be revealed by delayed evidence`);
        if (s.delayed && (!s.delayed.note || !s.delayed.evidence)) errors.push(`${where}: delayed needs note and evidence`);
        if (!Array.isArray(s.evidence) || s.evidence.length !== 2) errors.push(`${where}: evidence must have 2 items`);
        if (s.gender !== undefined && s.gender !== 'f' && s.gender !== 'm') errors.push(`${where}: gender must be 'f' or 'm'`);
        for (const t of s.tags || []) if (!TAGS.includes(t)) errors.push(`${where}: unknown tag ${t}`);
        if ((s.tags || []).includes('minor') && s.age !== undefined && s.age >= 18) errors.push(`${where}: minor tag but age ${s.age}`);
        if (!(s.tags || []).includes('minor') && s.age !== undefined && s.age < 18) errors.push(`${where}: age ${s.age} without minor tag`);
        usedLaws.add(s.law);
    });

    for (const lawKey of Object.keys(crime.laws)) {
        if (!usedLaws.has(lawKey)) warnings.push(`${crimeKey}.${lawKey}: no statement uses this law`);
    }
}

warnings.forEach(w => console.warn('warn:', w));
if (errors.length) {
    errors.forEach(e => console.error('error:', e));
    process.exit(1);
}
console.log(`OK: ${Object.keys(CRIMES).length} crimes, ${count} statements`);
