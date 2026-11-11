// Checks that every Turkish text of the game has an English translation in
// scripts/i18n/en.js. Texts are collected from L('...') calls in scripts/*.js,
// from the data in scripts/cases.js and from index.html.
//   node tools/check-i18n.mjs            report missing and unused translations
//   node tools/check-i18n.mjs --missing  print the missing texts as JSON
import { parseAst } from 'rollup/parseAst';
import { readFileSync, readdirSync } from 'node:fs';
import EN from '../scripts/i18n/en.js';
import { CRIMES, AMENDMENTS, GENERAL_NOTES, VERDICT_LABELS } from '../scripts/cases.js';

const texts = new Set();

// 1. L('...') calls
for (const file of readdirSync('scripts').filter(f => f.endsWith('.js'))) {
    const walk = (n) => {
        if (!n || typeof n.type !== 'string') return;
        if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'L') {
            const arg = n.arguments[0];
            if (arg && arg.type === 'Literal' && typeof arg.value === 'string') texts.add(arg.value);
        }
        for (const [k, v] of Object.entries(n)) {
            if (k === 'start' || k === 'end') continue;
            if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') walk(v);
        }
    };
    walk(parseAst(readFileSync('scripts/' + file, 'utf8')));
}

// 2. Case data (codes such as law keys, tags and emotions are not texts)
const CODE_FIELDS = new Set(['law', 'emotion', 'verdict', 'tag', 'tags', 'crime', 'wants', 'gender']);
const collect = (node) => {
    for (const [key, value] of Object.entries(node)) {
        if (CODE_FIELDS.has(key)) continue;
        if (typeof value === 'string') { if (/\p{L}/u.test(value)) texts.add(value); }
        else if (value && typeof value === 'object') collect(value);
    }
};
[VERDICT_LABELS, GENERAL_NOTES, AMENDMENTS].forEach(collect);
for (const crime of Object.values(CRIMES)) {
    texts.add(crime.name);
    for (const law of Object.values(crime.laws)) if (law.text) texts.add(law.text);
    crime.statements.forEach(collect);
}

// 3. Fixed texts of the page
const html = readFileSync('index.html', 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
for (const m of html.matchAll(/>([^<>]+)</g)) {
    const t = m[1].trim();
    if (/\p{L}/u.test(t) && !/^&\w+;$/.test(t)) texts.add(t.replace(/\s+/g, ' '));
}
for (const m of html.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/g)) if (/\p{L}/u.test(m[1])) texts.add(m[1]);

const missing = [...texts].filter(t => EN[t] === undefined);
if (process.argv.includes('--missing')) {
    console.log(JSON.stringify(missing, null, 1));
    process.exit(0);
}
const unused = Object.keys(EN).filter(k => !texts.has(k));
const badSlots = Object.entries(EN).filter(([tr, en]) => {
    const slots = (s) => (s.match(/\{\d+\}/g) || []).sort().join();
    return slots(tr) !== slots(en);
});
for (const t of missing) console.log('Çevirisi yok:', t.slice(0, 90));
for (const [t] of badSlots) console.log('Değer yerleri ({0}...) uyuşmuyor:', t.slice(0, 90));
if (unused.length) console.log(`uyarı: ${unused.length} çeviri artık kullanılmıyor`);
console.log(`${texts.size} metin, ${missing.length} çevirisi eksik`);
process.exit(missing.length || badSlots.length ? 1 : 0);
