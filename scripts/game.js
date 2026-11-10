/**
 * Game State & Logic Module
 * Core game loop, state management, and decision processing
 */

import { generateCase, buildCase, createNPCElement, evaluateVerdict, getRandomDirective, verdictFeedback, verdictLabel, activeAmendments } from './npc.js';
import { CRIMES, GENERAL_NOTES, AMENDMENTS, VERDICT_LABELS, LADDER } from './cases.js';
import {
    OFFERS, buildNewspaper, FINALE, FINAL_DIRECTIVE, INTRO, TUTORIAL, ENDLESS_INTRO, HOW_TO_PLAY, inspectorReport,
    SELIN_NOTE, SELIN_DIRECTIVE, SELIN_CASE, selinAftermath, kayaVisit, finaleRumor, appealText,
} from './story.js';
import { createFamily, familyStatus, eveningScene, familyEpilogue, HOUSEHOLD_COST } from './family.js';
import { ACT_LENGTH, TOTAL_DAYS, ACT2_CASES_PER_DAY, BRANCHES, branchFor } from './acts.js';
import { saveGame, loadGame, savedDay, savedMode, clearSave, loadSettings, saveSettings } from './save.js';
import * as ui from './ui.js';
import { audio } from './audio.js';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Game configuration
const CONFIG = {
    casesPerDay: 5,
    questionsPerDay: 3,
    baseReward: 50,
    basePenalty: 30,
    startingMoney: 500,
    startingReputation: 75,
    startingConscience: 100,
    offerChance: 0.3,
    exposeChance: 0.35,
    threatRevengeChance: 0.4,
    offenderReturnChance: 0.35,
    appealChance: 0.5,
};

let state = createInitialState();
let settings = loadSettings();

function createInitialState() {
    return {
        day: 1,
        totalCases: 0,
        money: CONFIG.startingMoney,
        reputation: CONFIG.startingReputation,
        conscience: CONFIG.startingConscience,

        // Daily
        dayCases: 0,
        dayCorrect: 0,
        dayEarnings: 0,
        questionsLeft: CONFIG.questionsPerDay,
        offerMadeToday: false,
        eventShownToday: false,
        dayLog: [],

        // Career
        correctTotal: 0,
        deathSentences: 0,
        bribesTaken: 0,
        bribesExposed: 0,
        threatsObeyed: 0,
        pendingRevenge: false,
        offenders: [],
        usedStatements: new Set(),
        finale: null,      // 'released' | 'correct' | 'wrong' (too light) | 'harsh'
        endedEarly: false,
        appeals: [],       // wrong verdicts that come back from the high court
        appealsToday: [],
        postponed: [],     // multi-stage cases waiting for their report
        family: createFamily(),
        flags: {},
        selin: null,       // 'death' | 'release' | 'correct' | 'harsh'
        branch: null,      // act 2: 'surgun' | 'borc'
        specials: {},      // outcomes of act-2 story cases, by key
        bonusQuestions: 0, // extra interrogations earned the evening before
        scandal: false,    // two exposed bribes end the career
        mode: 'story',     // 'story' (30 days) | 'endless'

        currentCase: null,
        currentDirective: null,
        pendingOffer: null, // an offer set aside on the desk until the judge decides
        isProcessing: false,
        gameOver: false,
    };
}

// Event triggers (TURKISH)
const EVENTS = {
    media: {
        check: (s) => s.reputation >= 90,
        chance: 0.2,
        title: 'Medya İlgisi!',
        description: 'Adil kararlarınız basının dikkatini çekti. Milletin gözleri sizin üzerinizde.',
    },
    protest: {
        check: (s) => s.conscience <= 30,
        chance: 0.3,
        title: 'Halk Protestosu!',
        description: 'Vatandaşlar dışarıda toplanıyor, sert cezalarınıza öfkeliler. İtibarınız zarar gördü.',
        apply: (s) => { s.reputation = Math.max(0, s.reputation - 10); },
    },
    praise: {
        check: (s) => s.reputation >= 95 && s.conscience >= 80,
        chance: 0.15,
        title: 'Resmi Takdir',
        description: 'Adalet Bakanı dengeli yaklaşımınızı övdü. ₺100 prim kazandınız.',
        apply: (s) => { s.money += 100; },
    },
    warning: {
        check: (s) => s.reputation <= 25,
        chance: 0.4,
        title: 'Resmi Uyarı',
        description: 'Bakanlık performansınızdan endişe duyuyor. Gelişin, yoksa sonuçlarına katlanın.',
    },
};

// Endings (TURKISH). The story mode ends on day 30 with the act-2 branch ending;
// a career can also end early.
const accuracy = (s) => s.correctTotal / Math.max(1, s.totalCases);

const EARLY_ENDINGS = [
    {
        condition: (s) => s.scandal,
        title: 'Rüşvet Skandalı',
        description: 'Zarflar birer birer gün yüzüne çıktı. Bir zamanlar hüküm verdiğiniz salonda bu kez sanık sandalyesinde oturuyorsunuz.',
    },
    {
        condition: (s) => s.money <= 0,
        title: 'Hazine Boşaldı',
        description: 'Kasanız tamtakır. Bakanlık sizi görev süreniz dolmadan görevden aldı; masanızdaki kanun kitabını bile geri istediler.',
    },
    {
        condition: () => true,
        title: 'Görevden Alındı',
        description: 'Halkın ve bakanlığın güvenini yitirdiniz. Cübbenizi çıkarıp adliyeden arka kapıdan ayrıldınız.',
    },
];

function pickEnding() {
    if (state.day > TOTAL_DAYS && state.branch && !state.scandal) {
        const branch = BRANCHES[state.branch];
        return branch.favored(state) ? branch.endings.favored : branch.endings.honest;
    }
    return EARLY_ENDINGS.find(e => e.condition(state));
}

const isEndless = () => state.mode === 'endless';
const isAct2 = () => !isEndless() && state.day > ACT_LENGTH;
const casesToday = () => (isAct2() ? ACT2_CASES_PER_DAY : CONFIG.casesPerDay);

// Endless mode gets harder every 10 days: one interrogation fewer, more offers
const endlessTier = () => (isEndless() ? Math.floor((state.day - 1) / 10) : 0);

// Initialize game
export function initGame() {
    state = createInitialState();
    ui.initUI();
    audio.init();
    applySettings();
    // Filled in by Vite (vite.config.js); guarded for pages that load the game without it
    document.getElementById('app-version').textContent = typeof __APP_VERSION__ === 'undefined' ? '' : `v${__APP_VERSION__}`;
    setupEventListeners();
    ui.showStartScreen();
    ui.setContinueOption(savedDay(), savedMode());
    ui.setEndlessOption(settings.endlessUnlocked, settings.endlessBest);
}

function setupEventListeners() {
    const elements = ui.getElements();

    elements.startBtn.addEventListener('click', async () => {
        audio.resume();
        audio.playClick();
        if (!(await confirmOverwrite())) return;
        startGame();
    });

    document.getElementById('settings-btn').addEventListener('click', () => {
        audio.resume();
        audio.playClick();
        openSettings();
    });
    document.getElementById('pause-settings-btn').addEventListener('click', () => {
        audio.playClick();
        openSettings();
    });

    document.getElementById('howto-btn').addEventListener('click', async () => {
        audio.resume();
        audio.playClick();
        const choice = await ui.showStory(HOW_TO_PLAY);
        if (choice === 'replay') {
            settings.tutorialDone = false;
            saveSettings(settings);
        }
    });

    document.getElementById('endless-btn').addEventListener('click', async () => {
        audio.resume();
        if (!settings.endlessUnlocked) {
            ui.showEndlessHint();
            return;
        }
        audio.playClick();
        if (!(await confirmOverwrite())) return;
        startEndless();
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
        audio.resume();
        audio.playClick();
        continueGame();
    });

    document.getElementById('pending-offer').addEventListener('click', () => reopenPendingOffer());

    // Tap the bubble or the defendant to show the whole sentence at once
    document.getElementById('npc-stage').addEventListener('click', () => ui.skipTyping());

    // Pause menu: back to the game or out to the start screen
    const pauseModal = document.getElementById('pause-modal');

    document.getElementById('menu-btn').addEventListener('click', () => {
        audio.playClick();
        const day = savedDay();
        document.getElementById('pause-note').textContent = day
            ? `Oyun her günün sonunda kaydedilir. Şimdi çıkarsan bugünkü davalar kaybolur; "Devam Et" ile ${day}. günün başından sürersin.`
            : 'Henüz kayıt yok; oyun ilk günün sonunda kaydedilir. Şimdi çıkarsan bu oyun kaybolur.';
        pauseModal.classList.remove('hidden');
    });
    document.getElementById('resume-btn').addEventListener('click', () => {
        audio.playClick();
        pauseModal.classList.add('hidden');
    });
    document.getElementById('main-menu-btn').addEventListener('click', () => {
        // A fresh page load stops every running animation, timer and pending choice,
        // and the start screen offers "Devam Et" from the last save
        audio.stopAmbient();
        location.reload();
    });

    document.getElementById('sound-btn').addEventListener('click', () => {
        settings.sound = !settings.sound;
        saveSettings(settings);
        audio.resume();
        applySettings();
        // Ambient drone only while a game is actually running
        if (settings.sound && state.currentDirective && !state.gameOver) audio.startAmbient();
    });

    elements.restartBtn.addEventListener('click', () => {
        audio.playClick();
        restartGame();
    });

    elements.nextDayBtn.addEventListener('click', async () => {
        audio.playClick();
        ui.hideDailySummary();
        if (state.scandal || (!isEndless() && state.day > TOTAL_DAYS)) {
            endGame();
            return;
        }
        if (!isEndless()) {
            await runEvening(state.day - 1);
            if (state.day === ACT_LENGTH + 1) {
                await ui.showIntro(BRANCHES[state.branch].intro);
            }
        }
        saveGame(state);
        startNewDay();
    });

    elements.rulebookBtn.addEventListener('click', () => {
        audio.resume();
        audio.playPageTurn();
        ui.openRulebook();
    });
    elements.rulebookClose.addEventListener('click', () => ui.closeRulebook());
    elements.rulebookModal.addEventListener('click', (e) => {
        if (e.target === elements.rulebookModal) ui.closeRulebook();
    });

    // On short screens the directive is cut to one line; tap to read it all
    elements.directiveBanner.addEventListener('click', () => {
        elements.directiveBanner.classList.toggle('expanded');
    });

    // Interrogation button lives inside the case file, which is re-rendered per case
    elements.evidenceContent.addEventListener('click', (e) => {
        if (e.target.closest('.interrogate-btn')) interrogate();
        if (e.target.closest('.postpone-btn')) postponeCase();
    });

    document.querySelectorAll('.verdict-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.isProcessing || !state.currentCase) return;
            audio.playClick();
            const key = btn.dataset.level ? `${btn.dataset.sentence}-${btn.dataset.level}` : btn.dataset.sentence;
            processVerdict(key);
        });
    });
}

// ---------- Settings ----------
// Text size scales reading text only (file, bubble, books, stories); buttons keep their size

function applySettings() {
    audio.setEnabled(settings.sound);
    audio.setVolume(settings.volume ?? 0.5);
    ui.setSoundIcon(settings.sound);
    const root = document.documentElement;
    root.classList.toggle('text-large', settings.textSize === 'large');
    root.classList.toggle('text-xlarge', settings.textSize === 'xlarge');
}

function openSettings() {
    ui.showSettings(settings, {
        onChange(key, value) {
            settings[key] = value;
            saveSettings(settings);
            applySettings();
            if (key === 'sound' && value && state.currentDirective && !state.gameOver) audio.startAmbient();
            if (key === 'vibration' && value) vibrate();
        },
        async onReset() {
            const ok = await ui.showStory({
                icon: '⚠️',
                title: 'İlerlemeyi Sıfırla',
                text: 'Kayıtlı oyunun, Sonsuz Mod kilidi, rekorun ve öğretici bilgisi silinecek. Bu işlem geri alınamaz.',
                choices: [{ label: 'Evet, hepsini sıfırla', value: true }, { label: 'Vazgeç', value: false }],
            });
            if (!ok) return;
            clearSave();
            Object.assign(settings, { endlessUnlocked: false, endlessBest: 0, tutorialDone: false });
            saveSettings(settings);
            location.reload();
        },
    });
}

// A short buzz when the gavel falls (native haptics on phones, vibration API on the web)
function vibrate() {
    if (!settings.vibration) return;
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
}

// Starting a new game replaces the saved one: ask first
async function confirmOverwrite() {
    const day = savedDay();
    if (!day) return true;
    const mode = savedMode() === 'endless' ? 'Sonsuz Mod' : 'Hikâye';
    return ui.showStory({
        icon: '⚠️',
        title: 'Kayıtlı Oyun Silinecek',
        text: `${mode} kaydın (${day}. gün) silinecek ve yeni bir oyun başlayacak. Emin misin?`,
        choices: [{ label: 'Evet, yeni oyuna başla', value: true }, { label: 'Vazgeç', value: false }],
    });
}

async function startGame() {
    clearSave();
    state = createInitialState();
    ui.hideStartScreen();
    audio.startAmbient();
    await ui.showIntro(INTRO);
    startNewDay();
}

// Endless mode: random cases until the career ends
async function startEndless() {
    clearSave();
    state = createInitialState();
    state.mode = 'endless';
    state.branch = 'all';
    ui.hideStartScreen();
    audio.startAmbient();
    ui.updateStats(state);
    await ui.showIntro(ENDLESS_INTRO);
    startNewDay();
}

// Pick up at the start of the day after the last completed one
function continueGame() {
    const loaded = loadGame(createInitialState());
    if (!loaded) {
        startGame();
        return;
    }
    state = loaded;
    ui.hideStartScreen();
    audio.startAmbient();
    ui.updateStats(state);
    startNewDay();
}

async function restartGame() {
    if (isEndless()) {
        document.getElementById('game-over-screen').classList.add('hidden');
        startEndless();
        return;
    }
    clearSave();
    state = createInitialState();
    document.getElementById('game-over-screen').classList.add('hidden');
    audio.startAmbient();
    ui.updateStats(state);
    await ui.showIntro(INTRO);
    startNewDay();
}

function refreshRulebook() {
    const crimes = Object.fromEntries(Object.entries(CRIMES).filter(([, c]) => state.branch === 'all' || !c.branch || c.branch === state.branch));
    ui.renderRulebook({
        crimes,
        generalNotes: GENERAL_NOTES,
        amendments: activeAmendments(state.day),
        day: state.day,
        labels: VERDICT_LABELS,
    });
}

async function startNewDay() {
    state.dayCases = 0;
    state.dayCorrect = 0;
    state.dayEarnings = 0;
    state.questionsLeft = Math.max(1, CONFIG.questionsPerDay - endlessTier()) + (state.bonusQuestions || 0);
    state.bonusQuestions = 0;
    state.offerMadeToday = false;
    state.eventShownToday = false;
    state.dayLog = [];

    state.appealsToday = [];
    state.currentDirective = pickDirective();
    ui.showDirective(state.currentDirective);
    refreshRulebook();
    ui.updateStats(state);

    // Revenge for an ignored threat
    if (state.pendingRevenge) {
        state.pendingRevenge = false;
        if (Math.random() < CONFIG.threatRevengeChance) {
            state.money = Math.max(0, state.money - 150);
            await ui.showEvent('warning', 'Gece Yarısı Saldırı', 'Tehdidi ciddiye almadınız. Arabanız kundaklandı: ₺150 zarar.');
            ui.updateStats(state);
        }
    }

    // New amendments
    for (const a of AMENDMENTS.filter(a => a.day === state.day)) {
        await ui.showEvent('law', `Kanunda Değişiklik: ${a.title}`, `${a.text} Ayrıntılar kanun kitabında.`);
    }

    // Recurring characters
    if (!isEndless() && (state.day === 5 || state.day === 12)) {
        const report = inspectorReport(state.correctTotal / Math.max(1, state.totalCases));
        state.money += report.money;
        state.reputation = Math.max(0, Math.min(100, state.reputation + report.reputation));
        await ui.showEvent('inspector', report.title, report.text);
        ui.updateStats(state);
    }
    if (!isEndless()) await morningStory();
    await deliverAppeals();

    await presentNextCase();
}

// Pick a released offender to bring back, if any is due
function takeReturningOffender() {
    const due = state.offenders.filter(o => o.day <= state.day - 2);
    if (due.length === 0 || Math.random() > CONFIG.offenderReturnChance) return null;
    const offender = due[Math.floor(Math.random() * due.length)];
    state.offenders = state.offenders.filter(o => o !== offender);
    return offender;
}

async function presentNextCase() {
    if (state.gameOver) return;

    state.isProcessing = true;
    ui.setSentencingEnabled(false);

    if (state.dayCases >= casesToday()) {
        endDay();
        return;
    }

    state.totalCases++;
    state.currentCase = nextCase();
    state.currentCase.canPostpone = Boolean(state.currentCase.delayed) && !state.currentCase.revealed
        && (isEndless() || (state.day !== ACT_LENGTH && state.day < TOTAL_DAYS));
    ui.updateCaseNumber(state.totalCases);

    audio.playDoor();
    await ui.openDoor();
    await ui.showNPC(createNPCElement(state.currentCase));
    audio.playDoorClose();
    await ui.closeDoor();

    ui.showEvidence(state.currentCase, state.questionsLeft);
    await ui.showSpeechBubble(state.currentCase.statement, state.currentCase.crime, (text, i) => audio.speakLetter(text, i, state.currentCase.gender));

    if (!settings.tutorialDone) {
        await ui.runTutorial(TUTORIAL);
        settings.tutorialDone = true;
        saveSettings(settings);
    }

    const offer = pickOffer(state.currentCase);
    if (offer) {
        state.offerMadeToday = true;
        const choice = await ui.showOffer(offer.view, 'Davayı inceledikten sonra karar ver');
        if (choice === 'accept') {
            await acceptOffer(offer);
            return;
        }
        if (choice === 'decline') {
            offer.onDecline();
            ui.updateStats(state);
        } else {
            state.pendingOffer = offer;
            ui.showPendingOffer(offer.view.icon);
        }
    }

    state.isProcessing = false;
    ui.setSentencingEnabled(true);
}

// Which case walks in next: Selin's trial, a postponed case whose report arrived,
// the finale, or a random one
function nextCase() {
    if (isEndless()) {
        const due = state.postponed.findIndex(p => p.day < state.day);
        if (due >= 0) {
            const p = state.postponed.splice(due, 1)[0];
            return buildCase(p.crimeType, CRIMES[p.crimeType].statements[p.index], state.day, { name: p.name, age: p.age, appearance: p.appearance, revealed: true });
        }
        return generateCase(state.day, state.currentDirective, takeReturningOffender(), state.usedStatements, 'all');
    }
    const special = specialCaseNow();
    if (special) {
        return buildCase(special.crimeType, special.statement, state.day, {
            name: special.name, age: special.age, gender: special.gender, specialKey: special.key,
        });
    }
    if (state.day === 7 && state.dayCases === 0 && !state.selin) {
        return buildCase(SELIN_CASE.crimeType, SELIN_CASE.statement, state.day, { name: SELIN_CASE.name, age: SELIN_CASE.age, gender: SELIN_CASE.gender, selinCase: true });
    }
    const dueIndex = state.postponed.findIndex(p => p.day < state.day);
    if (dueIndex >= 0) {
        const p = state.postponed.splice(dueIndex, 1)[0];
        const statement = CRIMES[p.crimeType].statements[p.index];
        return buildCase(p.crimeType, statement, state.day, { name: p.name, age: p.age, appearance: p.appearance, revealed: true });
    }
    if (state.day === ACT_LENGTH && state.dayCases === casesToday() - 1) {
        return buildCase(FINALE.crimeType, FINALE.statement, state.day, { name: FINALE.name, age: FINALE.age, gender: FINALE.gender, finale: true });
    }
    return generateCase(state.day, state.currentDirective, takeReturningOffender(), state.usedStatements, state.branch);
}

// Act-2 story case scheduled for this slot, if any
function specialCaseNow() {
    if (!BRANCHES[state.branch]) return null;
    const last = state.dayCases === casesToday() - 1;
    return BRANCHES[state.branch].specials.find(sp => sp.day === state.day && !state.specials[sp.key]
        && ((sp.position === 'first' && state.dayCases === 0) || (sp.position === 'last' && last))) || null;
}

function specialDef(key) {
    return state.branch ? BRANCHES[state.branch].specials.find(sp => sp.key === key) : null;
}

// Today's directive: the ministry in act 1, the town or the party in act 2
function pickDirective() {
    if (isEndless()) return getRandomDirective();
    if (state.day === ACT_LENGTH) return FINAL_DIRECTIVE;
    if (state.day === 7) return SELIN_DIRECTIVE;
    if (isAct2()) {
        const branch = BRANCHES[state.branch];
        if (state.day === TOTAL_DAYS) return branch.finalDirective;
        return branch.directives[Math.floor(Math.random() * branch.directives.length)];
    }
    return getRandomDirective();
}

async function acceptOffer(offer) {
    offer.onAccept();
    ui.updateStats(state);
    state.isProcessing = false;
    await processVerdict(offer.forcedVerdict, offer.type);
}

// The judge opens the set-aside offer again from the desk
async function reopenPendingOffer() {
    const offer = state.pendingOffer;
    if (!offer || state.isProcessing) return;
    audio.playClick();
    ui.setSentencingEnabled(false);
    const choice = await ui.showOffer(offer.view, 'İncelemeye devam et');
    if (choice === 'defer') {
        ui.setSentencingEnabled(true);
        return;
    }
    state.pendingOffer = null;
    ui.hidePendingOffer();
    if (choice === 'accept') {
        await acceptOffer(offer);
        return;
    }
    offer.onDecline();
    ui.updateStats(state);
    ui.setSentencingEnabled(true);
}

// Deciding the case without touching the set-aside offer means turning it down
function settlePendingOffer() {
    if (!state.pendingOffer) return;
    state.pendingOffer.onDecline();
    state.pendingOffer = null;
    ui.hidePendingOffer();
}

// Decide whether this case comes with a bribe or a threat
function pickOffer(c) {
    if (c.specialKey) {
        const def = specialDef(c.specialKey);
        if (!def || !def.offer) return null;
        const o = def.offer;
        return {
            type: 'special',
            forcedVerdict: o.forcedVerdict,
            view: o,
            onAccept: () => {
                state.money += o.amount;
                state.conscience = Math.max(0, state.conscience - 20);
            },
            onDecline: () => {
                state.conscience = Math.min(100, state.conscience + 3);
            },
        };
    }
    if (c.selinCase) {
        const o = SELIN_CASE.offer;
        return {
            type: 'selin',
            forcedVerdict: 'death',
            view: o,
            onAccept: () => {
                state.money += o.amount;
                state.conscience = Math.max(0, state.conscience - 30);
            },
            onDecline: () => {},
        };
    }
    if (c.finale) {
        const o = FINALE.offer;
        return {
            type: 'finale',
            forcedVerdict: 'release',
            view: o,
            onAccept: () => {
                state.money += o.amount;
                state.conscience = Math.max(0, state.conscience - 30);
            },
            onDecline: () => {},
        };
    }
    if (state.day < 2 || state.offerMadeToday) return null;
    if (c.severity < 3 || LADDER.indexOf(c.correctVerdict) < LADDER.indexOf('house-arrest')) return null;
    if (Math.random() > Math.min(0.6, CONFIG.offerChance + 0.1 * endlessTier())) return null;

    const type = state.day >= 4 && Math.random() < 0.4 ? 'threat' : 'bribe';
    const def = OFFERS[type];

    if (type === 'bribe') {
        const amount = 300 + c.severity * 100;
        return {
            type,
            forcedVerdict: def.forcedVerdict,
            view: { ...def, text: def.text(amount) },
            onAccept: () => {
                state.money += amount;
                state.conscience = Math.max(0, state.conscience - 15);
                state.bribesTaken++;
                c.bribed = true;
            },
            onDecline: () => {
                state.conscience = Math.min(100, state.conscience + 3);
            },
        };
    }

    return {
        type,
        forcedVerdict: def.forcedVerdict,
        view: { ...def, text: def.text() },
        onAccept: () => {
            state.conscience = Math.max(0, state.conscience - 10);
            state.threatsObeyed++;
        },
        onDecline: () => {
            state.pendingRevenge = true;
            state.flags.threatIgnored = true;
        },
    };
}

// Ask the defendant the case question: reveals the hidden evidence
async function interrogate() {
    const c = state.currentCase;
    if (!c || c.asked || state.isProcessing || state.questionsLeft <= 0) return;

    audio.playClick();
    c.asked = true;
    state.questionsLeft--;
    ui.showEvidence(c, state.questionsLeft);
    await ui.typeIntoBubble(c.answer, (text, i) => audio.speakLetter(text, i, c.gender));
}

// Send a multi-stage case back until its report arrives; it returns tomorrow
async function postponeCase() {
    const c = state.currentCase;
    if (!c || !c.canPostpone || state.isProcessing) return;

    state.isProcessing = true;
    ui.setSentencingEnabled(false);
    audio.playClick();
    settlePendingOffer();

    state.postponed.push({
        day: state.day,
        crimeType: c.crimeType,
        index: CRIMES[c.crimeType].statements.indexOf(c.statementRef),
        name: c.name,
        age: c.age,
        appearance: c.appearance,
    });
    state.dayCases++;
    state.totalCases--; // it is counted again when it returns with the report

    await ui.showFeedback(true, 'Dava Ertelendi', `${c.name} tutukevine geri gönderildi. Rapor gelince dosya yarın yeniden önünüze gelecek.`, '', 'Ertelendi');
    await finishCase();
}

async function processVerdict(sentenceKey, viaOffer = null) {
    if (state.isProcessing || !state.currentCase) return;

    const c = state.currentCase;
    state.isProcessing = true;
    ui.setSentencingEnabled(false);
    if (!viaOffer) settlePendingOffer();

    audio.playGavel();
    vibrate();
    await new Promise(resolve => setTimeout(resolve, 300));

    const result = evaluateVerdict(c.correctVerdict, sentenceKey);
    const sentenceBase = sentenceKey.split('-')[0];

    let moneyChange = 0;
    let conscienceChange = 0;
    let reputationChange = 0;

    if (result.correct) {
        state.dayCorrect++;
        state.correctTotal++;
        moneyChange = CONFIG.baseReward;
        if (state.currentDirective && state.currentDirective.bonus === sentenceBase) {
            moneyChange = Math.floor(moneyChange * state.currentDirective.bonusAmount);
        }
        if (result.partial) moneyChange = Math.floor(moneyChange * 0.7);
        reputationChange = 2;
        audio.playSuccess();
    } else {
        moneyChange = -CONFIG.basePenalty * result.severity;
        if (result.tooHarsh) {
            conscienceChange = -5 * result.severity;
            reputationChange = -3;
        } else {
            reputationChange = -5;
        }
        audio.playFailure();
    }

    if (sentenceKey === 'death') {
        state.deathSentences++;
        conscienceChange -= 10;
        if (!result.correct) {
            conscienceChange -= 20;
            reputationChange -= 10;
        }
    }

    // Returning offender: the public remembers who let them go
    if (c.returning) reputationChange -= 5;

    state.money = Math.max(0, state.money + moneyChange);
    state.conscience = Math.max(0, Math.min(100, state.conscience + conscienceChange));
    state.reputation = Math.max(0, Math.min(100, state.reputation + reputationChange));
    state.dayEarnings += moneyChange;
    state.dayCases++;

    if (c.finale) {
        state.finale = viaOffer === 'finale' ? 'released'
            : result.correct ? 'correct'
                : result.diff > 0 ? 'harsh' : 'wrong';
    }
    if (c.selinCase) {
        state.selin = sentenceKey === 'death' ? 'death'
            : result.correct ? 'correct'
                : result.diff < 0 ? 'release' : 'harsh';
    }

    // Act-2 story cases: did the verdict go the way the power behind them wanted?
    if (c.specialKey) {
        const def = specialDef(c.specialKey);
        const favored = viaOffer === 'special'
            || (def.wants === 'lighter' && result.diff < 0)
            || (def.wants === 'harsher' && result.diff > 0);
        state.specials[c.specialKey] = { verdict: sentenceKey, diff: result.diff, favored };
    }

    // Some wrong verdicts are appealed and come back from the high court two days later
    if (!result.correct && !viaOffer && !c.finale && !c.selinCase && !c.specialKey && Math.random() < CONFIG.appealChance) {
        state.appeals.push({
            day: state.day + 2,
            detail: c.detail,
            verdictLabel: verdictLabel(sentenceKey),
            correctLabel: verdictLabel(c.correctVerdict),
            tooHarsh: Boolean(result.tooHarsh),
        });
    }

    // Unsympathetic defendants let off lighter than the law demands may come back
    if (!c.sympathy && c.age >= 18 && result.diff < 0 && !c.returning && !c.finale) {
        state.offenders.push({ name: c.name, age: c.age, appearance: c.appearance, day: state.day, verdict: sentenceKey });
    }

    state.dayLog.push({
        detail: c.detail,
        name: c.name,
        verdict: sentenceKey,
        correct: result.correct,
        diff: result.diff,
        sympathy: c.sympathy,
        bribed: Boolean(c.bribed),
        returning: c.returning,
    });

    let { title, message } = verdictFeedback(c, result, sentenceKey);
    const lawNote = !result.correct || result.partial ? ` Kanuna göre doğru karar: ${verdictLabel(c.correctVerdict)}.` : '';
    if (viaOffer === 'bribe') message = 'Zarf cebinizde. Sanık gülümseyerek salondan çıktı.' + lawNote;
    if (viaOffer === 'threat') message = 'Sesiniz titredi. Sanık arkasına bakmadan çıktı.' + lawNote;
    if (viaOffer === 'finale') message = 'Bakanın oğlu sırıtarak salondan çıktı. Telefonunuz çalıyor: "Tebrikler, Hakim Bey."' + lawNote;
    if (viaOffer === 'selin') message = 'Selin Aydın size son kez baktı: "Demek siz de onlardansınız." Görevliler onu götürdü.' + lawNote;
    if (viaOffer === 'special') message = 'Telefonu kapattığınızda salonda çıt çıkmıyordu. Herkes kimin kazandığını biliyordu.' + lawNote;

    const statsHtml = `
        <div style="margin-top: 1rem;">
            <span style="color: ${moneyChange >= 0 ? '#4a9c6d' : '#8b2020'}">
                ${moneyChange >= 0 ? '+' : ''}₺${moneyChange}
            </span>
        </div>
    `;

    await ui.showFeedback(result.correct, title, message, statsHtml, verdictLabel(sentenceKey));
    ui.updateStats(state);

    await checkForEvents();

    if (state.money <= 0 || state.reputation <= 0) {
        state.endedEarly = true;
        endGame();
        return;
    }

    await finishCase();
}

// Clear the courtroom and call the next defendant
async function finishCase() {
    ui.hideNPC();
    ui.hideSpeechBubble();
    ui.hideEvidence();
    state.currentCase = null;

    await new Promise(resolve => setTimeout(resolve, 500));
    await presentNextCase();
}

// Morning story beats with Selin Aydın and Müfettiş Kaya
async function morningStory() {
    const apply = (r) => {
        state.reputation = Math.max(0, Math.min(100, state.reputation + (r.reputation || 0)));
        state.conscience = Math.max(0, Math.min(100, state.conscience + (r.conscience || 0)));
        ui.updateStats(state);
    };
    const ok = (beat) => ui.showStory({ icon: beat.icon, title: beat.title, text: beat.text, choices: [{ label: 'Devam', value: true }] });

    if (isAct2()) {
        const make = BRANCHES[state.branch].beats[state.day];
        if (!make) return;
        const beat = make(state);
        const value = await ui.showStory({ icon: beat.icon, title: beat.title, text: beat.text, choices: beat.choices });
        if (beat.onChoice) beat.onChoice(state, value);
        if (beat.apply) {
            state.family.harmony = Math.max(0, Math.min(100, state.family.harmony + (beat.apply.harmony || 0)));
            apply(beat.apply);
        }
        ui.updateStats(state);
        return;
    }
    if (state.day === 3) {
        state.flags.selinNote = await ui.showStory(SELIN_NOTE);
    }
    if (state.day === 8 && state.selin) {
        const beat = selinAftermath(state.selin);
        await ok(beat);
        apply(beat);
    }
    if (state.day === 11) {
        const beat = kayaVisit(accuracy(state));
        state.flags.kayaAlly = beat.ally;
        await ok(beat);
    }
    if (state.day === 14) {
        const beat = finaleRumor(state.selin);
        await ok(beat);
        apply(beat);
    }
}

// High court decisions on earlier verdicts
async function deliverAppeals() {
    const due = state.appeals.filter(a => a.day <= state.day);
    state.appeals = state.appeals.filter(a => a.day > state.day);
    for (const a of due) {
        state.reputation = Math.max(0, state.reputation - 4);
        if (a.tooHarsh) state.conscience = Math.max(0, state.conscience - 3);
        state.appealsToday.push(a);
        await ui.showStory({ icon: '⚖️', title: 'Yargıtay Kararı', text: appealText(a) + ' İtibar -4.', choices: [{ label: 'Anlaşıldı', value: true }] });
        ui.updateStats(state);
    }
}

// Evening at home after `day`: pay the bills, then one family scene
async function runEvening(day) {
    let bills;
    if (state.money >= HOUSEHOLD_COST) {
        state.money -= HOUSEHOLD_COST;
        bills = `Kira, faturalar ve mutfak: -₺${HOUSEHOLD_COST}`;
    } else {
        state.family.harmony = Math.max(0, state.family.harmony - 10);
        bills = 'Bu akşam kira ve faturalar ödenemedi. Aile huzuru -10.';
    }
    ui.updateStats(state);

    let scene;
    if (day === ACT_LENGTH) {
        state.branch = branchFor(state.finale);
        scene = BRANCHES[state.branch].transition;
    } else if (day > ACT_LENGTH) {
        const branch = BRANCHES[state.branch];
        scene = (branch.evenings[day] || branch.quietEvening)(state);
    } else {
        scene = eveningScene(state, day);
    }
    const pick = await ui.showEvening({
        day,
        family: familyStatus(state.family),
        harmony: state.family.harmony,
        bills,
        text: scene.text,
        choices: scene.choices.map(c => ({
            label: c.label,
            disabled: c.cost > state.money,
        })),
    });
    const result = scene.choices[pick].apply(state);
    ui.updateStats(state);
    await ui.showEveningResult(result, state.family.harmony);
}

// At most one random event per day so they stay meaningful
async function checkForEvents() {
    if (state.eventShownToday) return;
    for (const [type, event] of Object.entries(EVENTS)) {
        if (event.check(state) && Math.random() < event.chance) {
            state.eventShownToday = true;
            if (event.apply) event.apply(state);
            await ui.showEvent(type, event.title, event.description);
            ui.updateStats(state);
            break;
        }
    }
}

function endDay() {
    ui.hideDirective();

    // Bribes taken today may leak to the press
    for (const entry of state.dayLog) {
        if (entry.bribed && Math.random() < CONFIG.exposeChance) {
            entry.exposed = true;
            state.bribesExposed++;
            state.reputation = Math.max(0, state.reputation - 20);
        }
    }
    if (state.bribesExposed >= 2) state.scandal = true;
    ui.updateStats(state);

    ui.showDailySummary({
        day: state.day,
        casesJudged: state.dayCases,
        correctVerdicts: state.dayCorrect,
        earnings: state.dayEarnings,
    }, buildNewspaper(state.dayLog, state.appealsToday));

    // Saved after the evening scene, when the next day is about to start
    state.day++;
}

function endGame() {
    state.gameOver = true;
    clearSave();
    audio.stopAmbient();

    const ending = pickEnding();
    const daysServed = isEndless() ? state.day - 1 : Math.min(state.day, TOTAL_DAYS + 1) - 1;

    // Finishing the story unlocks endless mode; endless mode keeps a record
    let modeNote = '';
    if (isEndless()) {
        const isRecord = daysServed > (settings.endlessBest || 0);
        if (isRecord) settings.endlessBest = daysServed;
        saveSettings(settings);
        modeNote = `<p class="ending-epilogue">Sonsuz modda ${daysServed} gün dayandın. ${isRecord ? 'Yeni rekor!' : `Rekor: ${settings.endlessBest} gün.`}</p>`;
    } else if (state.day > TOTAL_DAYS && state.branch) {
        const firstTime = !settings.endlessUnlocked;
        settings.endlessUnlocked = true;
        saveSettings(settings);
        if (firstTime) modeNote = '<p class="ending-epilogue">Sonsuz Mod açıldı! Giriş ekranından oynayabilirsin.</p>';
    }

    const statsHtml = `
        <p>Görev Süresi: ${daysServed} gün</p>
        <p>Görülen Davalar: ${state.totalCases}</p>
        <p>Kanuna Uygun Kararlar: ${state.correctTotal} (%${Math.round(accuracy(state) * 100)})</p>
        <p>Son Hazine: ₺${state.money}</p>
        <p>Son İtibar: %${state.reputation}</p>
        <p>Son Vicdan: %${state.conscience}</p>
    `;

    const selinLine = {
        death: "Selin Aydın'ın adı yıllar sonra bir sokağa verildi. Sizin adınız ise hiçbir yere.",
        correct: 'Selin Aydın cezasını tamamlayıp çıktığında ilk röportajını size ayırdı.',
        release: 'Selin Aydın hâlâ yazıyor; köşesinde ara sıra sizden söz ediyor.',
        harsh: "Selin Aydın'ın davası Yargıtay'da bozuldu. Kararınız hukuk fakültelerinde \"baskı altında yargı\" örneği olarak okutuluyor.",
    }[state.selin];
    // The execution ending gets its own family line; a warm family table would contradict it
    const executed = state.branch === 'borc' && ending === BRANCHES.borc.endings.favored;
    const familyLine = executed
        ? 'Son duruşmada Deniz, Ece ve annen en arka sırada oturdu. Ece başını hiç kaldırmadı.'
        : familyEpilogue(state);
    const epilogue = [familyLine, selinLine].filter(Boolean).map(t => `<p class="ending-epilogue">${t}</p>`).join('');

    ui.showGameOver({ title: ending.title, description: ending.description, stats: modeNote + (isEndless() ? '' : epilogue) + statsHtml });
    ui.setEndlessOption(settings.endlessUnlocked, settings.endlessBest);
}

export function getState() {
    return { ...state };
}
