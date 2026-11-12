/**
 * Save Module
 * Stores progress at the end of each day and small settings in localStorage.
 * Storage can be unavailable (private mode, cleared data); every access is guarded
 * so the game keeps working without it.
 */

import { CRIMES } from './cases.js';

const SAVE_KEY = 'hakim.save.v1';
const SETTINGS_KEY = 'hakim.settings.v1';

function read(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // storage full or blocked: progress just isn't kept
    }
}

function remove(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        // ignore
    }
}

// Statements are objects; saves refer to them as "crimeType:index"
function statementKey(statement) {
    for (const [crimeType, crime] of Object.entries(CRIMES)) {
        const i = crime.statements.indexOf(statement);
        if (i >= 0) return `${crimeType}:${i}`;
    }
    return null;
}

function statementByKey(key) {
    const [crimeType, i] = key.split(':');
    return CRIMES[crimeType]?.statements[Number(i)] || null;
}

// Career fields carried between days; daily fields are reset by startNewDay
const CAREER_FIELDS = [
    'day', 'totalCases', 'money', 'reputation', 'conscience',
    'correctTotal', 'deathSentences', 'bribesTaken', 'bribesExposed', 'threatsObeyed',
    'pendingRevenge', 'offenders', 'finale',
    'appeals', 'postponed', 'family', 'flags', 'selin', 'trial',
    'branch', 'specials', 'bonusQuestions', 'scandal', 'mode',
];

export function saveGame(state) {
    const data = {};
    for (const f of CAREER_FIELDS) data[f] = state[f];
    data.usedStatements = [...state.usedStatements].map(statementKey).filter(Boolean);
    write(SAVE_KEY, data);
}

// Returns the saved career fields merged into `fresh`, or null when there is no usable save
export function loadGame(fresh) {
    const data = read(SAVE_KEY);
    if (!data || typeof data.day !== 'number') return null;
    const state = { ...fresh };
    for (const f of CAREER_FIELDS) if (data[f] !== undefined) state[f] = data[f];
    state.usedStatements = new Set((data.usedStatements || []).map(statementByKey).filter(Boolean));
    return state;
}

export function savedDay() {
    const data = read(SAVE_KEY);
    return data && typeof data.day === 'number' ? data.day : null;
}

export function savedMode() {
    const data = read(SAVE_KEY);
    return (data && data.mode) || 'story';
}

export function clearSave() {
    remove(SAVE_KEY);
}

export function loadSettings() {
    return {
        sound: true, volume: 0.5, textSize: 'normal', vibration: true,
        tutorialDone: false, endlessUnlocked: false, endlessBest: 0,
        ...(read(SETTINGS_KEY) || {}),
    };
}

export function saveSettings(settings) {
    write(SETTINGS_KEY, settings);
}
