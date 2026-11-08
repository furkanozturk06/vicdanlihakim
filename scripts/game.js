/**
 * Game State & Logic Module
 * Core game loop, state management, and decision processing
 */

import { generateCase, createNPCElement, validateVerdict, getRandomDirective, getEmotionFeedback } from './npc.js';
import * as ui from './ui.js';
import { audio } from './audio.js';

// Game configuration
const CONFIG = {
    casesPerDay: 5,
    baseReward: 50,
    basePenalty: 30,
    startingMoney: 500,
    startingReputation: 75,
    startingConscience: 100,
    maxDays: 10,
};

// Game state
let state = {
    day: 1,
    caseNumber: 0,
    totalCases: 0,
    money: CONFIG.startingMoney,
    reputation: CONFIG.startingReputation,
    conscience: CONFIG.startingConscience,

    // Daily stats
    dayCases: 0,
    dayCorrect: 0,
    dayEarnings: 0,

    // Current case
    currentCase: null,
    currentDirective: null,

    // Flags
    isProcessing: false,
    gameOver: false,
};

// Event triggers (TURKISH)
const EVENTS = {
    media: {
        threshold: { reputation: 90 },
        chance: 0.2,
        title: "Medya İlgisi!",
        description: "Adil kararlarınız basının dikkatini çekti. Milletin gözleri sizin üzerinizde."
    },
    protest: {
        threshold: { conscience: 30 },
        chance: 0.3,
        title: "Halk Protestosu!",
        description: "Vatandaşlar dışarıda toplanıyor, sert cezalarınıza öfkeliler. İtibarınız zarar gördü."
    },
    praise: {
        threshold: { reputation: 95, conscience: 80 },
        chance: 0.15,
        title: "Resmi Takdir",
        description: "Adalet Bakanı dengeli yaklaşımınızı övdü. Bir prim kazandınız."
    },
    warning: {
        threshold: { reputation: 25 },
        chance: 0.4,
        title: "Resmi Uyarı",
        description: "Bakanlık performansınızdan endişe duyuyor. Gelişin, yoksa sonuçlarına katlanın."
    }
};

// Endings based on final state (TURKISH)
const ENDINGS = {
    perfect: {
        condition: (s) => s.conscience >= 80 && s.reputation >= 80,
        title: "Adil Hakim",
        description: "Adınız nesiller boyu hatırlanacak. Merhameti adaletle dengellediniz ve halk sizi bunun için seviyor. Tarih kitapları bilgeliğinizi anlatacak."
    },
    corrupt: {
        condition: (s) => s.money >= 2000 && s.conscience < 40,
        title: "Yozlaşmış Ruh",
        description: "Zenginleştiniz, ama ne pahasına? Vicdanınız artık sadece bir fısıltı. Suçlular serbest geziyor, masumlar acı çekiyor. Değdi mi?"
    },
    harsh: {
        condition: (s) => s.conscience < 20,
        title: "Demir Yumruk",
        description: "Size acımasız dediler. Cezaevleri mahkum ettiklerinizle dolup taşıyor. Masumlar bile bakışınızdan korkuyor. Siz merhametsiz adalet oldunuz."
    },
    beloved: {
        condition: (s) => s.reputation >= 90 && s.conscience >= 60,
        title: "Halkın Hakimi",
        description: "Vatandaşlar sizi seviyor. Yüzünüz duvarlarda, adınız şarkılarda. İnançlarını kaybettikleri sisteme umut verdiniz."
    },
    fallen: {
        condition: (s) => s.reputation < 20,
        title: "Düşmüş",
        description: "Azledildiniz. Görevden alındınız. Kariyeriniz utançla sona erdi. Yemin ettiğiniz halk size sırtını döndü."
    },
    survivor: {
        condition: (s) => true, // Default ending
        title: "Hayatta Kalan",
        description: "Atlattınız, ne aziz ne de günahkar. Bazı günler diğerlerinden daha zordu. Her kararın ağırlığı hâlâ içinizde."
    }
};

// Initialize game
export function initGame() {
    resetState();
    ui.initUI();
    audio.init();
    setupEventListeners();
    ui.showStartScreen();
}

// Reset state to initial values
function resetState() {
    state = {
        day: 1,
        caseNumber: 0,
        totalCases: 0,
        money: CONFIG.startingMoney,
        reputation: CONFIG.startingReputation,
        conscience: CONFIG.startingConscience,
        dayCases: 0,
        dayCorrect: 0,
        dayEarnings: 0,
        currentCase: null,
        currentDirective: null,
        isProcessing: false,
        gameOver: false,
    };
}

// Setup event listeners
function setupEventListeners() {
    const elements = ui.getElements();

    // Start button
    elements.startBtn.addEventListener('click', () => {
        audio.resume();
        audio.playClick();
        startGame();
    });

    // Restart button
    elements.restartBtn.addEventListener('click', () => {
        audio.playClick();
        restartGame();
    });

    // Next day button
    elements.nextDayBtn.addEventListener('click', () => {
        audio.playClick();
        ui.hideDailySummary();
        startNewDay();
    });

    // Rulebook
    elements.rulebookBtn.addEventListener('click', () => {
        audio.playClick();
        ui.openRulebook();
    });
    elements.rulebookClose.addEventListener('click', () => ui.closeRulebook());
    elements.rulebookModal.addEventListener('click', (e) => {
        if (e.target === elements.rulebookModal) ui.closeRulebook();
    });

    // All verdict buttons (new structure)
    document.querySelectorAll('.verdict-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleVerdictClick(e, btn));
    });
}

// Handle verdict button click
function handleVerdictClick(e, btn) {
    if (state.isProcessing || !state.currentCase) return;

    audio.playClick();

    const sentence = btn.dataset.sentence;
    const level = btn.dataset.level || null;

    processVerdict(sentence, level);
}

// Start the game
function startGame() {
    ui.hideStartScreen();
    audio.startAmbient();
    startNewDay();
}

// Restart the game
function restartGame() {
    resetState();
    document.getElementById('game-over-screen').classList.add('hidden');
    ui.updateStats(state);
    startNewDay();
}

// Start a new day
async function startNewDay() {
    // Reset daily stats
    state.dayCases = 0;
    state.dayCorrect = 0;
    state.dayEarnings = 0;

    // Get new directive
    state.currentDirective = getRandomDirective();
    ui.showDirective(state.currentDirective);

    ui.updateStats(state);

    // Start first case
    await presentNextCase();
}

// Present the next case
async function presentNextCase() {
    if (state.gameOver) return;

    state.isProcessing = true;
    ui.setSentencingEnabled(false);

    // Check if day is complete
    if (state.dayCases >= CONFIG.casesPerDay) {
        endDay();
        return;
    }

    // Generate new case
    state.caseNumber++;
    state.totalCases++;
    state.currentCase = generateCase(state.day, state.currentDirective);

    ui.updateCaseNumber(state.totalCases);

    // Animate NPC entrance
    audio.playDoor();
    await ui.openDoor();

    const npcElement = createNPCElement(state.currentCase);
    await ui.showNPC(npcElement);

    await ui.closeDoor();

    // Show speech bubble with crime type
    await ui.showSpeechBubble(state.currentCase.statement, state.currentCase.crime);

    // Show case file
    ui.showEvidence(state.currentCase.summary, state.currentCase.evidence);

    // Enable sentencing
    state.isProcessing = false;
    ui.setSentencingEnabled(true);
}

// Process the player's verdict
async function processVerdict(sentence, subOption = null) {
    if (state.isProcessing || !state.currentCase) return;

    state.isProcessing = true;
    ui.setSentencingEnabled(false);
    ui.closeAllSubOptions();

    // Gavel sound
    audio.playGavel();
    await new Promise(resolve => setTimeout(resolve, 300));

    // Validate verdict
    const result = validateVerdict(state.currentCase, sentence, subOption);

    // Calculate rewards/penalties
    let moneyChange = 0;
    let conscienceChange = 0;
    let reputationChange = 0;

    if (result.correct) {
        // Correct verdict
        state.dayCorrect++;
        moneyChange = CONFIG.baseReward;

        // Apply directive bonus
        if (state.currentDirective && state.currentDirective.bonus === sentence) {
            moneyChange = Math.floor(moneyChange * state.currentDirective.bonusAmount);
        }

        if (result.partial) {
            moneyChange = Math.floor(moneyChange * 0.7);
        }

        reputationChange = 2;

        audio.playSuccess();
    } else {
        // Incorrect verdict
        moneyChange = -CONFIG.basePenalty * result.severity;

        if (result.tooHarsh) {
            conscienceChange = -5 * result.severity;
            reputationChange = -3;
        } else if (result.tooLenient) {
            reputationChange = -5;
        }

        audio.playFailure();
    }

    // Apply death penalty conscience hit
    if (sentence === 'death') {
        conscienceChange -= 10;
        if (!result.correct) {
            conscienceChange -= 20;
            reputationChange -= 10;
        }
    }

    // Update state
    state.money = Math.max(0, state.money + moneyChange);
    state.conscience = Math.max(0, Math.min(100, state.conscience + conscienceChange));
    state.reputation = Math.max(0, Math.min(100, state.reputation + reputationChange));
    state.dayEarnings += moneyChange;
    state.dayCases++;

    // Show feedback (TURKISH)
    const feedbackTitle = result.correct ? "Adalet Yerini Buldu!" : "Vicdan Ağır...";
    const feedbackMsg = getEmotionFeedback(state.currentCase.emotion, sentence, result.correct);
    const statsHtml = `
        <div style="margin-top: 1rem;">
            <span style="color: ${moneyChange >= 0 ? '#4a9c6d' : '#8b2020'}">
                ${moneyChange >= 0 ? '+' : ''}₺${moneyChange}
            </span>
        </div>
    `;

    await ui.showFeedback(result.correct, feedbackTitle, feedbackMsg, statsHtml);

    // Update UI
    ui.updateStats(state);

    // Check for events
    await checkForEvents();

    // Check for game over
    if (checkGameOver()) {
        endGame();
        return;
    }

    // Clear current case
    ui.hideNPC();
    ui.hideSpeechBubble();
    ui.hideEvidence();
    state.currentCase = null;

    // Small delay before next case
    await new Promise(resolve => setTimeout(resolve, 500));

    // Present next case
    await presentNextCase();
}

// Check for random events
async function checkForEvents() {
    for (const [type, event] of Object.entries(EVENTS)) {
        let triggered = true;

        // Check thresholds
        if (event.threshold.reputation !== undefined) {
            if (type === 'media' || type === 'praise') {
                triggered = triggered && state.reputation >= event.threshold.reputation;
            } else {
                triggered = triggered && state.reputation <= event.threshold.reputation;
            }
        }

        if (event.threshold.conscience !== undefined) {
            if (type === 'protest') {
                triggered = triggered && state.conscience <= event.threshold.conscience;
            } else {
                triggered = triggered && state.conscience >= event.threshold.conscience;
            }
        }

        // Random chance
        if (triggered && Math.random() < event.chance) {
            await ui.showEvent(type, event.title, event.description);

            // Apply event effects
            if (type === 'protest') {
                state.reputation = Math.max(0, state.reputation - 10);
            } else if (type === 'praise') {
                state.money += 100;
            } else if (type === 'warning') {
                // Just a warning, no immediate effect
            }

            ui.updateStats(state);
            break; // Only one event per case
        }
    }
}

// End the current day
function endDay() {
    ui.hideDirective();

    ui.showDailySummary({
        casesJudged: state.dayCases,
        correctVerdicts: state.dayCorrect,
        earnings: state.dayEarnings
    });

    state.day++;

    // Check if game should end
    if (state.day > CONFIG.maxDays) {
        state.gameOver = true;
    }
}

// Check if game over conditions are met
function checkGameOver() {
    // Out of money
    if (state.money <= 0) return true;

    // Reputation too low
    if (state.reputation <= 0) return true;

    // Days exceeded
    if (state.day > CONFIG.maxDays) return true;

    return false;
}

// End the game (TURKISH stats)
function endGame() {
    state.gameOver = true;
    audio.stopAmbient();

    // Determine ending
    let ending = ENDINGS.survivor; // Default

    for (const [key, endingData] of Object.entries(ENDINGS)) {
        if (key !== 'survivor' && endingData.condition(state)) {
            ending = endingData;
            break;
        }
    }

    const statsHtml = `
        <p>Görev Süresi: ${state.day - 1} gün</p>
        <p>Görülen Davalar: ${state.totalCases}</p>
        <p>Son Hazine: ₺${state.money}</p>
        <p>Son İtibar: %${state.reputation}</p>
        <p>Son Vicdan: %${state.conscience}</p>
    `;

    ui.showGameOver({
        title: ending.title,
        description: ending.description,
        stats: statsHtml
    });
}

// Export for debugging
export function getState() {
    return { ...state };
}
