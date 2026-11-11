/**
 * Languages
 *
 * The game is written in Turkish. Every player-facing Turkish text goes through
 * L(), which returns the English text from i18n/en.js when the game runs in
 * English. Texts with values in them use numbered slots:
 *   L('{0}. Gün', day)  ->  'Day {0}'  ->  'Day 7'
 *
 * The language is fixed when the game loads; switching it saves the choice and
 * reloads the page. `npm run check` lists Turkish texts without a translation.
 */

import EN from './i18n/en.js';

const SETTINGS_KEY = 'hakim.settings.v1';

function detectLanguage() {
    if (typeof document === 'undefined') return 'tr'; // tools under Node read the Turkish texts
    try {
        const forced = new URLSearchParams(location.search).get('lang');
        if (forced === 'tr' || forced === 'en') return forced;
    } catch { /* not in a browser */ }
    try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}').lang;
        if (saved === 'tr' || saved === 'en') return saved;
    } catch { /* storage blocked */ }
    try {
        return navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';
    } catch {
        return 'tr';
    }
}

export const LANG = detectLanguage();

// Turkish texts that had no English translation this session (shown in Turkish)
export const missing = new Set();

export function L(text, ...values) {
    let out = text;
    if (LANG === 'en') {
        const english = EN[text];
        if (english === undefined) missing.add(text);
        else out = english;
    }
    return values.length ? out.replace(/\{(\d+)\}/g, (m, i) => values[i]) : out;
}

// English case texts mark the defendant's pronouns ({he}, {his}, ...); this fills
// them in for the defendant's gender. Turkish texts have no such marks.
const PRONOUNS = {
    m: { he: 'he', He: 'He', him: 'him', his: 'his', His: 'His', himself: 'himself' },
    f: { he: 'she', He: 'She', him: 'her', his: 'her', His: 'Her', himself: 'herself' },
};
export function withPronouns(text, gender) {
    if (typeof text !== 'string') return text;
    const set = PRONOUNS[gender === 'f' ? 'f' : 'm'];
    return text.replace(/\{(he|He|him|his|His|himself)\}/g, (m, word) => set[word]);
}

// Translates every text inside a data object (objects and arrays, in place)
export function translateTree(node) {
    if (LANG === 'tr' || !node || typeof node !== 'object') return node;
    for (const key of Object.keys(node)) {
        const value = node[key];
        if (typeof value === 'string') {
            if (EN[value] !== undefined) node[key] = EN[value];
        } else if (value && typeof value === 'object') {
            translateTree(value);
        }
    }
    return node;
}

// Translates the fixed texts of the page (text nodes and a few attributes)
export function translatePage(root = document.body) {
    document.documentElement.lang = LANG;
    if (LANG === 'tr') return;
    document.title = L(document.title);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.nodeValue.trim();
        if (text && /\p{L}/u.test(text) && EN[text] !== undefined) n.nodeValue = n.nodeValue.replace(text, EN[text]);
    }
    root.querySelectorAll('[aria-label], [title], [placeholder]').forEach(el => {
        for (const attr of ['aria-label', 'title', 'placeholder']) {
            const v = el.getAttribute(attr);
            if (v && EN[v] !== undefined) el.setAttribute(attr, EN[v]);
        }
    });
}
