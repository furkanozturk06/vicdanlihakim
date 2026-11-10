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
        rulebookBtn: document.getElementById('rulebook-btn'),
        rulebookModal: document.getElementById('rulebook-modal'),
        rulebookClose: document.getElementById('rulebook-close'),
        rulebookBody: document.getElementById('rulebook-body'),

        // Offer
        offerModal: document.getElementById('offer-modal'),
        offerIcon: document.getElementById('offer-icon'),
        offerTitle: document.getElementById('offer-title'),
        offerText: document.getElementById('offer-text'),
        offerAccept: document.getElementById('offer-accept'),
        offerDecline: document.getElementById('offer-decline'),

        // Newspaper
        paperDate: document.getElementById('paper-date'),
        paperHeadline: document.getElementById('paper-headline'),
        paperSide: document.getElementById('paper-side'),
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
export function showSpeechBubble(text, crimeType, onSyllable) {
    elements.speechBubble.classList.remove('hidden');
    elements.bubbleText.textContent = '';

    // Set crime type if available
    if (elements.crimeType && crimeType) {
        elements.crimeType.textContent = crimeType;
    }

    return typeIntoBubble(text, onSyllable);
}

// Typewriter effect into the speech bubble; a new call cancels the previous one.
// onSyllable is called every few letters while typing (the speaking sound).
let typeInterval = null;
let finishTyping = null;
export function typeIntoBubble(text, onSyllable) {
    clearInterval(typeInterval);
    if (finishTyping) finishTyping();
    elements.bubbleText.textContent = '';
    return new Promise(resolve => {
        let i = 0;
        let letters = 0;
        finishTyping = () => {
            clearInterval(typeInterval);
            elements.bubbleText.textContent = text;
            finishTyping = null;
            resolve();
        };
        typeInterval = setInterval(() => {
            if (i < text.length) {
                elements.bubbleText.textContent += text[i];
                if (/\p{L}/u.test(text[i])) {
                    if (onSyllable && letters % 3 === 0) onSyllable();
                    letters++;
                } else {
                    letters = 0;
                }
                i++;
            } else {
                finishTyping();
            }
        }, 30);
    });
}

// A tap on the bubble or the defendant shows the whole sentence at once
export function skipTyping() {
    if (finishTyping) finishTyping();
}

// Hide speech bubble
export function hideSpeechBubble() {
    elements.speechBubble.classList.add('hidden');
}

const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};

// Show the case file. The second evidence item stays hidden until the defendant is questioned.
export function showEvidence(caseData, questionsLeft) {
    const header = el('p', 'case-defendant', `Sanık: ${caseData.name}, ${caseData.age} yaşında`);
    const summary = el('p', 'case-summary', caseData.summary);

    const list = el('ul', 'case-evidence');
    list.appendChild(el('li', '', caseData.evidence[0]));
    if (caseData.asked) {
        list.appendChild(el('li', 'revealed', caseData.evidence[1]));
    }

    // Multi-stage case: the pending report, or the new evidence once it arrived
    let pending = null;
    if (caseData.delayed && caseData.revealed) {
        list.appendChild(el('li', 'new-evidence', `Yeni delil: ${caseData.delayed.evidence}`));
    } else if (caseData.delayed) {
        pending = el('div', 'case-pending');
        pending.appendChild(el('p', '', `⏳ ${caseData.delayed.note}.`));
        if (caseData.canPostpone) {
            const btn = el('button', 'postpone-btn', 'Davayı ertele · rapor gelince yarın görülür');
            btn.type = 'button';
            pending.appendChild(btn);
        }
    }

    const interrogation = el('div', 'case-interrogation');
    if (caseData.asked) {
        interrogation.appendChild(el('p', 'interrogation-answer', `Sorgu: "${caseData.answer}"`));
    } else {
        const btn = el('button', 'interrogate-btn');
        btn.type = 'button';
        btn.disabled = questionsLeft <= 0;
        btn.appendChild(el('span', 'interrogate-q', `🔎 "${caseData.question}"`));
        btn.appendChild(el('span', 'interrogate-left', questionsLeft > 0 ? `Sorgula · kalan hak: ${questionsLeft}` : 'Bugünkü sorgu hakkın bitti'));
        interrogation.appendChild(btn);
    }

    elements.evidenceContent.replaceChildren(...[header, summary, list, pending, interrogation].filter(Boolean));
    elements.evidenceDesk.classList.remove('hidden');
}

// Hide evidence
export function hideEvidence() {
    elements.evidenceDesk.classList.add('hidden');
}

// Render the rulebook from law data. Amendments introduced today are marked YENİ.
export function renderRulebook({ crimes, generalNotes, amendments, day, labels }) {
    const nodes = [];

    const general = el('ul', 'law-general');
    generalNotes.forEach(n => general.appendChild(el('li', '', n)));
    nodes.push(general);

    if (amendments.length > 0) {
        const section = el('section', 'law law-amendments');
        section.appendChild(el('h3', '', 'Ek Maddeler'));
        const ul = el('ul');
        amendments.forEach(a => {
            const li = el('li', '', `${a.title}: ${a.text}`);
            if (a.day === day) li.appendChild(el('span', 'law-new', 'YENİ'));
            ul.appendChild(li);
        });
        section.appendChild(ul);
        nodes.push(section);
    }

    for (const crime of Object.values(crimes)) {
        const section = el('section', 'law');
        section.appendChild(el('h3', '', crime.name));
        const base = crime.laws.base;
        const baseCond = base.text ? ` (${base.text})` : '';
        section.appendChild(el('p', 'law-base', `Olağan ceza${baseCond}: ${labels[base.verdict]}`));

        const ul = el('ul');
        for (const [key, law] of Object.entries(crime.laws)) {
            if (key === 'base') continue;
            ul.appendChild(el('li', '', `${law.text}: ${labels[law.verdict]}`));
        }
        (crime.notes || []).forEach(n => ul.appendChild(el('li', '', n)));
        section.appendChild(ul);
        nodes.push(section);
    }

    elements.rulebookBody.replaceChildren(...nodes);
}

// Step-by-step tutorial. Each step highlights `target` and waits for "İleri".
// Resolves when finished or skipped.
export function runTutorial(steps) {
    const box = document.getElementById('tutorial');
    const next = document.getElementById('tutorial-next');
    const skip = document.getElementById('tutorial-skip');
    let i = 0;
    let focused = null;

    return new Promise(resolve => {
        const finish = () => {
            if (focused) focused.classList.remove('tutorial-focus');
            box.classList.add('hidden');
            next.onclick = null;
            skip.onclick = null;
            resolve();
        };

        const show = () => {
            const step = steps[i];
            if (focused) focused.classList.remove('tutorial-focus');
            focused = document.querySelector(step.target);
            if (focused) {
                focused.classList.add('tutorial-focus');
                focused.scrollIntoView?.({ block: 'nearest' });
            }

            // Keep the card away from what it points at
            const rect = focused ? focused.getBoundingClientRect() : null;
            const targetInLowerHalf = rect && rect.top + rect.height / 2 > window.innerHeight / 2;
            box.classList.toggle('at-top', Boolean(targetInLowerHalf));

            document.getElementById('tutorial-step').textContent = `${i + 1} / ${steps.length}`;
            document.getElementById('tutorial-title').textContent = step.title;
            document.getElementById('tutorial-text').textContent = step.text;
            next.textContent = i === steps.length - 1 ? 'Başla' : 'İleri';
            box.classList.remove('hidden');
        };

        next.onclick = () => {
            i++;
            if (i >= steps.length) finish();
            else show();
        };
        skip.onclick = finish;
        show();
    });
}

// Start screen: offer "continue" when a save exists
export function setContinueOption(day, mode = 'story') {
    const btn = document.getElementById('continue-btn');
    if (day) {
        btn.textContent = mode === 'endless' ? `Devam Et (Sonsuz · ${day}. Gün)` : `Devam Et (${day}. Gün)`;
        btn.classList.remove('hidden');
        elements.startBtn.textContent = 'Yeni Oyun';
    } else {
        btn.classList.add('hidden');
        elements.startBtn.textContent = 'Koltuğa Otur';
    }
}

// Start screen: endless mode button and best record, once the story is finished
// The button is always visible; until the story is finished it is locked and explains why
export function setEndlessOption(unlocked, best) {
    const btn = document.getElementById('endless-btn');
    btn.classList.toggle('locked', !unlocked);
    btn.setAttribute('aria-disabled', String(!unlocked));
    btn.title = unlocked ? '' : '30 gün boyunca koltukta kaldıktan sonra Sonsuz Mod\'u açabilirsin.';
    const record = document.getElementById('endless-record');
    record.classList.toggle('hidden', !unlocked || !best);
    record.textContent = best ? `Sonsuz mod rekoru: ${best} gün` : '';
}

// Settings window. `onChange(key, value)` saves each change right away.
export function showSettings(settings, { onChange, onReset }) {
    const modal = document.getElementById('settings-modal');
    const render = () => {
        modal.querySelectorAll('.setting-toggle').forEach(btn => {
            const on = Boolean(settings[btn.dataset.setting]);
            btn.textContent = on ? 'Açık' : 'Kapalı';
            btn.classList.toggle('on', on);
        });
        document.getElementById('setting-volume').value = Math.round((settings.volume ?? 0.5) * 100);
        document.querySelectorAll('#setting-textsize button').forEach(b => {
            b.classList.toggle('selected', b.dataset.size === (settings.textSize || 'normal'));
        });
    };

    modal.querySelectorAll('.setting-toggle').forEach(btn => {
        btn.onclick = () => { onChange(btn.dataset.setting, !settings[btn.dataset.setting]); render(); };
    });
    document.getElementById('setting-volume').oninput = (e) => onChange('volume', Number(e.target.value) / 100);
    document.querySelectorAll('#setting-textsize button').forEach(b => {
        b.onclick = () => { onChange('textSize', b.dataset.size); render(); };
    });
    document.getElementById('settings-reset').onclick = () => onReset();
    document.getElementById('settings-close').onclick = () => modal.classList.add('hidden');

    render();
    modal.classList.remove('hidden');
}

// Phones have no hover: a tap on the locked button shows the hint for a few seconds
let hintTimer = null;
export function showEndlessHint() {
    const hint = document.getElementById('endless-hint');
    const hide = () => hint.classList.remove('visible');
    hint.classList.add('visible');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(hide, 3500);
    // A tap anywhere closes it
    document.addEventListener('pointerdown', hide, { once: true });
}

export function setSoundIcon(on) {
    const btn = document.getElementById('sound-btn');
    btn.textContent = on ? '🔊' : '🔇';
    btn.setAttribute('aria-label', on ? 'Sesi kapat' : 'Sesi aç');
}

// Story moment with one or more choices. Resolves to the chosen value.
export function showStory({ icon, title, text, choices }) {
    const modal = document.getElementById('story-modal');
    document.getElementById('story-icon').textContent = icon || '';
    document.getElementById('story-title').textContent = title;
    document.getElementById('story-text').textContent = text;
    const box = document.getElementById('story-choices');

    return new Promise(resolve => {
        box.replaceChildren(...choices.map(c => {
            const b = el('button', 'typewriter-btn', c.label);
            b.type = 'button';
            b.disabled = Boolean(c.disabled);
            b.onclick = () => {
                modal.classList.add('hidden');
                resolve(c.value);
            };
            return b;
        }));
        modal.classList.remove('hidden');
    });
}

// Evening at home: family status, bills and a scene. Resolves to the chosen index.
export function showEvening({ day, family, harmony, bills, text, choices }) {
    const modal = document.getElementById('evening-modal');
    document.getElementById('evening-day').textContent = `${day}. Gün · Akşam`;
    document.getElementById('evening-family').replaceChildren(...family.map(m => {
        const li = el('li');
        li.appendChild(el('span', 'member', `${m.name} `));
        li.appendChild(el('span', 'role', `(${m.role})`));
        li.appendChild(el('span', 'state', m.status));
        return li;
    }));
    setHarmony(harmony);
    document.getElementById('evening-bills').textContent = bills;
    document.getElementById('evening-text').textContent = text;
    const box = document.getElementById('evening-choices');

    return new Promise(resolve => {
        box.replaceChildren(...choices.map((c, i) => {
            const b = el('button', 'typewriter-btn', c.label);
            b.type = 'button';
            b.disabled = Boolean(c.disabled);
            b.onclick = () => resolve(i);
            return b;
        }));
        modal.classList.remove('hidden');
    });
}

function setHarmony(value) {
    const bar = document.getElementById('evening-harmony-bar');
    bar.style.width = `${value}%`;
    bar.style.background = value < 30 ? '#8b2020' : value < 60 ? '#c9a227' : '#4a9c6d';
}

// After the evening choice: show what happened, then wait for the next morning
export function showEveningResult(text, harmony) {
    setHarmony(harmony);
    document.getElementById('evening-text').textContent = text;
    const box = document.getElementById('evening-choices');
    return new Promise(resolve => {
        const b = el('button', 'typewriter-btn', 'Sabah oldu');
        b.type = 'button';
        b.onclick = () => {
            document.getElementById('evening-modal').classList.add('hidden');
            resolve();
        };
        box.replaceChildren(b);
    });
}

// Intro letter. Resolves when the player starts.
export function showIntro({ title, text, button }) {
    const modal = document.getElementById('intro-modal');
    const btn = document.getElementById('intro-btn');
    document.getElementById('intro-title').textContent = title;
    document.getElementById('intro-text').textContent = text;
    btn.textContent = button;
    modal.classList.remove('hidden');

    return new Promise(resolve => {
        btn.onclick = () => {
            btn.onclick = null;
            modal.classList.add('hidden');
            resolve();
        };
    });
}

// Bribe / threat offer. Resolves to 'accept', 'decline' or 'defer'.
// `deferLabel` adds a third option that puts the offer aside to read the case first.
export function showOffer({ icon, title, text, accept, decline }, deferLabel = null) {
    const deferBtn = document.getElementById('offer-defer');
    elements.offerIcon.textContent = icon;
    elements.offerTitle.textContent = title;
    elements.offerText.textContent = text;
    elements.offerAccept.textContent = accept;
    elements.offerDecline.textContent = decline;
    deferBtn.textContent = deferLabel || '';
    deferBtn.classList.toggle('hidden', !deferLabel);
    elements.offerModal.classList.remove('hidden');

    return new Promise(resolve => {
        const done = (choice) => {
            elements.offerAccept.onclick = null;
            elements.offerDecline.onclick = null;
            deferBtn.onclick = null;
            elements.offerModal.classList.add('hidden');
            resolve(choice);
        };
        elements.offerAccept.onclick = () => done('accept');
        elements.offerDecline.onclick = () => done('decline');
        deferBtn.onclick = () => done('defer');
    });
}

// The set-aside offer waits on the desk, between the rulebook and the case number
export function showPendingOffer(icon) {
    document.getElementById('pending-offer-icon').textContent = icon;
    document.getElementById('pending-offer').classList.remove('hidden');
}

export function hidePendingOffer() {
    document.getElementById('pending-offer').classList.add('hidden');
}

// Rulebook modal
export function openRulebook() {
    elements.rulebookModal.classList.remove('hidden');
}

// The close button fades into a floating corner button once the book is scrolled
const rulebookContent = document.querySelector('.rulebook-content');
rulebookContent?.addEventListener('scroll', () => {
    document.getElementById('rulebook-close').classList.toggle('floating', rulebookContent.scrollTop > 8);
}, { passive: true });

export function closeRulebook() {
    elements.rulebookModal.classList.add('hidden');
}

// Show feedback overlay
export function showFeedback(isCorrect, title, message, stats, stampLabel = '') {
    elements.feedbackTitle.textContent = title;
    elements.feedbackTitle.className = isCorrect ? '' : 'negative';
    elements.feedbackMessage.textContent = message;
    elements.feedbackStats.innerHTML = stats;

    elements.stampEffect.className = isCorrect ? 'justice' : '';
    elements.stampEffect.textContent = stampLabel;
    elements.feedbackOverlay.classList.remove('hidden');

    // Closes by itself, or on a tap once it has been up long enough to be seen
    const shownAt = Date.now();
    return new Promise(resolve => {
        let done = false;
        const close = () => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            elements.feedbackOverlay.onclick = null;
            elements.feedbackOverlay.classList.add('hidden');
            resolve();
        };
        const timer = setTimeout(close, 2600);
        elements.feedbackOverlay.onclick = () => {
            if (Date.now() - shownAt > 400) close();
        };
    });
}

// Show the end-of-day newspaper
export function showDailySummary(dayStats, paper) {
    elements.paperDate.textContent = `${dayStats.day}. Gün`;
    elements.paperHeadline.textContent = paper.main;
    elements.paperSide.replaceChildren(...paper.side.map(t => el('li', '', t)));

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
        warning: '⚠️',
        law: '⚖️',
        inspector: '🕵️'
    };

    elements.eventIcon.textContent = icons[type] || '📢';
    elements.eventTitle.textContent = title;
    elements.eventDescription.textContent = description;
    elements.eventOverlay.classList.remove('hidden');

    // Longer texts (e.g. law amendments) stay up longer; a tap anywhere closes it right away
    const duration = Math.max(3000, (title.length + description.length) * 55);
    return new Promise(resolve => {
        let done = false;
        const close = () => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            elements.eventOverlay.onclick = null;
            elements.eventOverlay.classList.add('hidden');
            resolve();
        };
        const timer = setTimeout(close, duration);
        elements.eventOverlay.onclick = close;
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
