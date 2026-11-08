/**
 * UI Module
 * Handles animations, transitions, and visual feedback
 */

// DOM Elements cache
let elements = {};

export function initUI() {
    elements = {
        // Main containers
        startScreen: document.getElementById('start-screen'),
        gameOverScreen: document.getElementById('game-over-screen'),
        courtroom: document.getElementById('courtroom'),

        // NPC area
        courtroomDoor: document.getElementById('courtroom-door'),
        npcContainer: document.getElementById('npc-container'),
        speechBubble: document.getElementById('speech-bubble'),
        bubbleText: document.getElementById('bubble-text'),
        crimeType: document.getElementById('crime-type'),

        // Evidence
        evidenceDesk: document.getElementById('evidence-desk'),
        evidenceContent: document.getElementById('evidence-content'),

        // Judge's desk
        gavel: document.getElementById('gavel'),
        caseNumValue: document.getElementById('case-num-value'),
        sentencingPanel: document.getElementById('sentencing-panel'),

        // Stats
        dayValue: document.getElementById('day-value'),
        moneyValue: document.getElementById('money-value'),
        reputationBar: document.getElementById('reputation-bar'),
        conscienceBar: document.getElementById('conscience-bar'),

        // Directive
        directiveBanner: document.getElementById('directive-banner'),
        directiveText: document.getElementById('directive-text'),

        // Feedback
        feedbackOverlay: document.getElementById('feedback-overlay'),
        feedbackContent: document.getElementById('feedback-content'),
        stampEffect: document.getElementById('stamp-effect'),
        feedbackTitle: document.getElementById('feedback-title'),
        feedbackMessage: document.getElementById('feedback-message'),
        feedbackStats: document.getElementById('feedback-stats'),

        // Summary modal
        summaryModal: document.getElementById('daily-summary-modal'),
        casesJudged: document.getElementById('cases-judged'),
        correctVerdicts: document.getElementById('correct-verdicts'),
        dayEarnings: document.getElementById('day-earnings'),
        nextDayBtn: document.getElementById('next-day-btn'),

        // Events
        eventOverlay: document.getElementById('event-overlay'),
        eventIcon: document.getElementById('event-icon'),
        eventTitle: document.getElementById('event-title'),
        eventDescription: document.getElementById('event-description'),

        // Game over
        endingTitle: document.getElementById('ending-title'),
        endingDescription: document.getElementById('ending-description'),
        finalStats: document.getElementById('final-stats'),
        restartBtn: document.getElementById('restart-btn'),

        // Buttons
        startBtn: document.getElementById('start-btn'),
    };

    return elements;
}

// Show start screen
export function showStartScreen() {
    elements.startScreen.classList.remove('hidden');
    elements.gameOverScreen.classList.add('hidden');
}

// Hide start screen with animation
export function hideStartScreen() {
    elements.startScreen.style.opacity = '0';
    elements.startScreen.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        elements.startScreen.classList.add('hidden');
        elements.startScreen.style.opacity = '';
    }, 500);
}

// Update stats display
export function updateStats(gameState) {
    elements.dayValue.textContent = gameState.day;
    elements.moneyValue.textContent = `₺${gameState.money}`;
    elements.reputationBar.style.width = `${gameState.reputation}%`;
    elements.conscienceBar.style.width = `${gameState.conscience}%`;

    // Update conscience bar color based on level
    if (gameState.conscience < 30) {
        elements.conscienceBar.style.background = '#8b2020';
    } else if (gameState.conscience < 60) {
        elements.conscienceBar.style.background = '#c9a227';
    } else {
        elements.conscienceBar.style.background = '#4a9c6d';
    }
}

// Update case number display
export function updateCaseNumber(num) {
    elements.caseNumValue.textContent = num.toString().padStart(3, '0');
}

// Show directive banner
export function showDirective(directive) {
    if (directive && directive.text) {
        elements.directiveText.textContent = directive.text;
        elements.directiveBanner.classList.remove('hidden');
    }
}

// Hide directive banner
export function hideDirective() {
    elements.directiveBanner.classList.add('hidden');
}

// Animate door opening
export function openDoor() {
    return new Promise(resolve => {
        elements.courtroomDoor.classList.add('open');
        setTimeout(resolve, 500);
    });
}

// Animate door closing
export function closeDoor() {
    return new Promise(resolve => {
        elements.courtroomDoor.classList.remove('open');
        setTimeout(resolve, 300);
    });
}

// Show NPC with entrance animation
export function showNPC(npcElement) {
    elements.npcContainer.innerHTML = '';
    npcElement.style.opacity = '0';
    npcElement.style.transform = 'translateY(50px)';
    elements.npcContainer.appendChild(npcElement);

    // Trigger animation
    requestAnimationFrame(() => {
        npcElement.style.transition = 'all 0.5s ease-out';
        npcElement.style.opacity = '1';
        npcElement.style.transform = 'translateY(0)';
    });

    return new Promise(resolve => setTimeout(resolve, 600));
}

// Hide NPC with exit animation
export function hideNPC() {
    const npc = elements.npcContainer.querySelector('.npc');
    if (npc) {
        npc.style.opacity = '0';
        npc.style.transform = 'translateY(-30px)';
        setTimeout(() => {
            elements.npcContainer.innerHTML = '';
        }, 300);
    }
}

// Show speech bubble with typewriter effect
export function showSpeechBubble(text, emotion, crimeType) {
    elements.speechBubble.classList.remove('hidden', 'trembling');
    elements.bubbleText.textContent = '';

    // Set crime type if available
    if (elements.crimeType && crimeType) {
        elements.crimeType.textContent = crimeType;
    }

    // Add emotion-specific animation
    if (emotion === 'panicked') {
        elements.speechBubble.classList.add('trembling');
    }

    // Typewriter effect
    return new Promise(resolve => {
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                elements.bubbleText.textContent += text[i];
                i++;
            } else {
                clearInterval(typeInterval);
                resolve();
            }
        }, 30);
    });
}

// Hide speech bubble
export function hideSpeechBubble() {
    elements.speechBubble.classList.add('hidden');
}

// Show evidence
export function showEvidence(summary, evidenceList) {
    const summaryEl = document.createElement('p');
    summaryEl.className = 'case-summary';
    summaryEl.textContent = summary;

    const listEl = document.createElement('ul');
    listEl.className = 'case-evidence';
    evidenceList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listEl.appendChild(li);
    });

    elements.evidenceContent.replaceChildren(summaryEl, listEl);
    elements.evidenceDesk.classList.remove('hidden');
    elements.evidenceDesk.style.animation = 'fade-in 0.3s ease';
}

// Hide evidence
export function hideEvidence() {
    elements.evidenceDesk.classList.add('hidden');
}

// Animate gavel strike
export function strikeGavel() {
    return new Promise(resolve => {
        elements.gavel.classList.add('striking');

        // Play sound effect would go here

        setTimeout(() => {
            elements.gavel.classList.remove('striking');
            resolve();
        }, 300);
    });
}

// Show feedback overlay
export function showFeedback(isCorrect, title, message, stats) {
    elements.feedbackTitle.textContent = title;
    elements.feedbackTitle.className = isCorrect ? '' : 'negative';
    elements.feedbackMessage.textContent = message;
    elements.feedbackStats.innerHTML = stats;

    elements.stampEffect.className = isCorrect ? 'justice' : '';
    elements.feedbackOverlay.classList.remove('hidden');

    return new Promise(resolve => {
        setTimeout(() => {
            elements.feedbackOverlay.classList.add('hidden');
            resolve();
        }, 2000);
    });
}

// Show daily summary modal
export function showDailySummary(dayStats) {
    elements.casesJudged.textContent = dayStats.casesJudged;
    elements.correctVerdicts.textContent = dayStats.correctVerdicts;
    elements.dayEarnings.textContent = `₺${dayStats.earnings >= 0 ? '+' : ''}${dayStats.earnings}`;
    elements.dayEarnings.style.color = dayStats.earnings >= 0 ? '#4a9c6d' : '#8b2020';

    elements.summaryModal.classList.remove('hidden');
}

// Hide daily summary modal
export function hideDailySummary() {
    elements.summaryModal.classList.add('hidden');
}

// Show special event overlay
export function showEvent(type, title, description) {
    const icons = {
        media: '📰',
        protest: '✊',
        praise: '🏆',
        warning: '⚠️'
    };

    elements.eventIcon.textContent = icons[type] || '📢';
    elements.eventTitle.textContent = title;
    elements.eventDescription.textContent = description;
    elements.eventOverlay.classList.remove('hidden');

    return new Promise(resolve => {
        setTimeout(() => {
            elements.eventOverlay.classList.add('hidden');
            resolve();
        }, 3000);
    });
}

// Show game over screen
export function showGameOver(ending) {
    elements.endingTitle.textContent = ending.title;
    elements.endingDescription.textContent = ending.description;
    elements.finalStats.innerHTML = ending.stats;

    elements.gameOverScreen.classList.remove('hidden');
}

// Enable/disable sentencing buttons
export function setSentencingEnabled(enabled) {
    const buttons = document.querySelectorAll('.verdict-btn');
    buttons.forEach(btn => {
        btn.disabled = !enabled;
        btn.style.opacity = enabled ? '1' : '0.5';
        btn.style.pointerEvents = enabled ? 'auto' : 'none';
    });
}

// Toggle sub-options for fine/jail buttons
export function toggleSubOptions(button, show) {
    const subOptions = button.querySelector('.sub-options');
    if (subOptions) {
        if (show) {
            subOptions.classList.remove('hidden');
        } else {
            subOptions.classList.add('hidden');
        }
    }
}

// Close all sub-options
export function closeAllSubOptions() {
    document.querySelectorAll('.sub-options').forEach(el => {
        el.classList.add('hidden');
    });
}

// Get elements reference
export function getElements() {
    return elements;
}
