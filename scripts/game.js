/**
 * Game State & Logic Module
 * Core game loop, state management, and decision processing
 */

import { generateCase, buildCase, createNPCElement, evaluateVerdict, getRandomDirective, getEmotionFeedback, verdictLabel, activeAmendments } from './npc.js';
import { CRIMES, GENERAL_NOTES, AMENDMENTS, VERDICT_LABELS, LADDER } from './cases.js';
import { OFFERS, buildNewspaper, FINALE, FINAL_DIRECTIVE, INTRO, TUTORIAL, inspectorReport, journalistVisit } from './story.js';
import { saveGame, loadGame, savedDay, clearSave, loadSettings, saveSettings } from './save.js';
import * as ui from './ui.js';
import { audio } from './audio.js';

// Game configuration
const CONFIG = {
    casesPerDay: 5,
    questionsPerDay: 3,
    baseReward: 50,
    basePenalty: 30,
    startingMoney: 500,
    startingReputation: 75,
    startingConscience: 100,
    maxDays: 10,
    offerChance: 0.3,
    exposeChance: 0.35,
    threatRevengeChance: 0.4,
    offenderReturnChance: 0.35,
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
        finale: null,      // 'released' | 'correct' | 'wrong'
        endedEarly: false,

        currentCase: null,
        currentDirective: null,
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

// Endings based on final state (TURKISH)
const accuracy = (s) => s.correctTotal / Math.max(1, s.totalCases);

const ENDINGS = [
    {
        condition: (s) => s.endedEarly && s.money <= 0,
        title: 'Hazine Boşaldı',
        description: 'Mahkemenin kasası tamtakır. Bakanlık sizi on gün dolmadan görevden aldı; masanızdaki kanun kitabını bile geri istediler.',
    },
    {
        condition: (s) => s.endedEarly,
        title: 'Görevden Alındı',
        description: 'Halkın ve bakanlığın güvenini yitirdiniz. Cübbenizi çıkarıp adliyeden arka kapıdan ayrıldınız.',
    },
    {
        condition: (s) => s.bribesExposed >= 2,
        title: 'Rüşvet Skandalı',
        description: 'Zarflar birer birer gün yüzüne çıktı. Bir zamanlar hüküm verdiğiniz salonda bu kez sanık sandalyesinde oturuyorsunuz.',
    },
    {
        condition: (s) => s.finale === 'released',
        title: 'Bakanlığın Adamı',
        description: 'Bakanın oğlu serbest kaldı, siz terfi ettiniz. Yeni odanız daha büyük ama öğretmenin ailesinin bakışları her gece rüyanıza giriyor.',
    },
    {
        condition: (s) => s.finale === 'correct' && accuracy(s) >= 0.7 && s.reputation >= 60,
        title: 'Dokunulmaz Hakim',
        description: 'Bakanın oğluna bile kanunu uyguladınız. Bakanlık sizi sürmek istedi ama halk adliyenin önünü doldurdu. Adınız artık bağımsız yargının simgesi.',
    },
    {
        condition: (s) => s.conscience >= 80 && s.reputation >= 80,
        title: 'Adil Hakim',
        description: 'Adınız nesiller boyu hatırlanacak. Merhameti adaletle dengelediniz ve halk sizi bunun için seviyor.',
    },
    {
        condition: (s) => s.money >= 2000 && s.conscience < 40,
        title: 'Yozlaşmış Ruh',
        description: 'Zenginleştiniz, ama ne pahasına? Vicdanınız artık sadece bir fısıltı. Değdi mi?',
    },
    {
        condition: (s) => s.conscience < 20,
        title: 'Demir Yumruk',
        description: 'Size acımasız dediler. Cezaevleri mahkum ettiklerinizle dolup taşıyor. Masumlar bile bakışınızdan korkuyor.',
    },
    {
        condition: (s) => s.reputation >= 90 && s.conscience >= 60,
        title: 'Halkın Hakimi',
        description: 'Vatandaşlar sizi seviyor. İnançlarını kaybettikleri sisteme umut verdiniz.',
    },
    {
        condition: (s) => s.reputation < 20,
        title: 'Düşmüş',
        description: 'Görevden alındınız. Kariyeriniz utançla sona erdi. Yemin ettiğiniz halk size sırtını döndü.',
    },
    {
        condition: () => true,
        title: 'Hayatta Kalan',
        description: 'Atlattınız, ne aziz ne de günahkar. Her kararın ağırlığı hâlâ içinizde.',
    },
];

// Initialize game
export function initGame() {
    state = createInitialState();
    ui.initUI();
    audio.init();
    audio.setEnabled(settings.sound);
    ui.setSoundIcon(settings.sound);
    setupEventListeners();
    ui.showStartScreen();
    ui.setContinueOption(savedDay());
}

function setupEventListeners() {
    const elements = ui.getElements();

    elements.startBtn.addEventListener('click', () => {
        audio.resume();
        audio.playClick();
        startGame();
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
        audio.resume();
        audio.playClick();
        continueGame();
    });

    document.getElementById('sound-btn').addEventListener('click', () => {
        settings.sound = !settings.sound;
        saveSettings(settings);
        audio.resume();
        audio.setEnabled(settings.sound);
        ui.setSoundIcon(settings.sound);
        // Ambient drone only while a game is actually running
        if (settings.sound && state.currentDirective && !state.gameOver) audio.startAmbient();
    });

    elements.restartBtn.addEventListener('click', () => {
        audio.playClick();
        restartGame();
    });

    elements.nextDayBtn.addEventListener('click', () => {
        audio.playClick();
        ui.hideDailySummary();
        if (state.day > CONFIG.maxDays) {
            endGame();
        } else {
            startNewDay();
        }
    });

    elements.rulebookBtn.addEventListener('click', () => {
        audio.playClick();
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

async function startGame() {
    clearSave();
    state = createInitialState();
    ui.hideStartScreen();
    audio.startAmbient();
    await ui.showIntro(INTRO);
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
    clearSave();
    state = createInitialState();
    document.getElementById('game-over-screen').classList.add('hidden');
    audio.startAmbient();
    ui.updateStats(state);
    await ui.showIntro(INTRO);
    startNewDay();
}

function refreshRulebook() {
    ui.renderRulebook({
        crimes: CRIMES,
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
    state.questionsLeft = CONFIG.questionsPerDay;
    state.offerMadeToday = false;
    state.eventShownToday = false;
    state.dayLog = [];

    state.currentDirective = state.day === CONFIG.maxDays ? FINAL_DIRECTIVE : getRandomDirective();
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
    if (state.day === 4 || state.day === 8) {
        const report = inspectorReport(state.correctTotal / Math.max(1, state.totalCases));
        state.money += report.money;
        state.reputation = Math.max(0, Math.min(100, state.reputation + report.reputation));
        await ui.showEvent('inspector', report.title, report.text);
        ui.updateStats(state);
    }
    if (state.day === 6) {
        const visit = journalistVisit(state.reputation);
        if (visit) {
            state.reputation = Math.max(0, Math.min(100, state.reputation + visit.reputation));
            await ui.showEvent('media', visit.title, visit.text);
            ui.updateStats(state);
        }
    }

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

    if (state.dayCases >= CONFIG.casesPerDay) {
        endDay();
        return;
    }

    state.totalCases++;
    const isFinale = state.day === CONFIG.maxDays && state.dayCases === CONFIG.casesPerDay - 1;
    state.currentCase = isFinale
        ? buildCase(FINALE.crimeType, FINALE.statement, state.day, { name: FINALE.name, age: FINALE.age, finale: true })
        : generateCase(state.day, state.currentDirective, takeReturningOffender(), state.usedStatements);
    ui.updateCaseNumber(state.totalCases);

    audio.playDoor();
    await ui.openDoor();
    await ui.showNPC(createNPCElement(state.currentCase));
    audio.playDoorClose();
    await ui.closeDoor();

    ui.showEvidence(state.currentCase, state.questionsLeft);
    await ui.showSpeechBubble(state.currentCase.statement, state.currentCase.crime);

    if (!settings.tutorialDone) {
        await ui.runTutorial(TUTORIAL);
        settings.tutorialDone = true;
        saveSettings(settings);
    }

    const offer = pickOffer(state.currentCase);
    if (offer) {
        state.offerMadeToday = true;
        const accepted = await ui.showOffer(offer.view);
        if (accepted) {
            offer.onAccept();
            ui.updateStats(state);
            state.isProcessing = false;
            await processVerdict(offer.forcedVerdict, offer.type);
            return;
        }
        offer.onDecline();
        ui.updateStats(state);
    }

    state.isProcessing = false;
    ui.setSentencingEnabled(true);
}

// Decide whether this case comes with a bribe or a threat
function pickOffer(c) {
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
    if (Math.random() > CONFIG.offerChance) return null;

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
    await ui.typeIntoBubble(c.answer);
}

async function processVerdict(sentenceKey, viaOffer = null) {
    if (state.isProcessing || !state.currentCase) return;

    const c = state.currentCase;
    state.isProcessing = true;
    ui.setSentencingEnabled(false);

    audio.playGavel();
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
        state.finale = viaOffer === 'finale' ? 'released' : (result.correct ? 'correct' : 'wrong');
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

    const title = result.correct ? (result.partial ? 'Kanuna Yakın' : 'Adalet Yerini Buldu!') : 'Vicdan Ağır...';
    let message = getEmotionFeedback(c.emotion, result.correct);
    if (viaOffer === 'bribe') message = 'Zarf cebinizde. Sanık gülümseyerek salondan çıktı.';
    if (viaOffer === 'threat') message = 'Sesiniz titredi. Sanık arkasına bakmadan çıktı.';
    if (viaOffer === 'finale') message = 'Bakanın oğlu sırıtarak salondan çıktı. Telefonunuz çalıyor: "Tebrikler, Hakim Bey."';
    if (!result.correct || result.partial) message += ` Kanuna göre doğru karar: ${verdictLabel(c.correctVerdict)}.`;

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

    ui.hideNPC();
    ui.hideSpeechBubble();
    ui.hideEvidence();
    state.currentCase = null;

    await new Promise(resolve => setTimeout(resolve, 500));
    await presentNextCase();
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
    ui.updateStats(state);

    ui.showDailySummary({
        day: state.day,
        casesJudged: state.dayCases,
        correctVerdicts: state.dayCorrect,
        earnings: state.dayEarnings,
    }, buildNewspaper(state.dayLog));

    state.day++;
    if (state.day <= CONFIG.maxDays) saveGame(state);
}

function endGame() {
    state.gameOver = true;
    clearSave();
    audio.stopAmbient();

    const ending = ENDINGS.find(e => e.condition(state));
    const daysServed = Math.min(state.day, CONFIG.maxDays + 1) - 1;

    const statsHtml = `
        <p>Görev Süresi: ${daysServed} gün</p>
        <p>Görülen Davalar: ${state.totalCases}</p>
        <p>Kanuna Uygun Kararlar: ${state.correctTotal} (%${Math.round(accuracy(state) * 100)})</p>
        <p>Son Hazine: ₺${state.money}</p>
        <p>Son İtibar: %${state.reputation}</p>
        <p>Son Vicdan: %${state.conscience}</p>
    `;

    ui.showGameOver({ title: ending.title, description: ending.description, stats: statsHtml });
}

export function getState() {
    return { ...state };
}
