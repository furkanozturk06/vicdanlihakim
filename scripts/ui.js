/**
 * UI Module
 * Handles animations, transitions, and visual feedback
 */

import { L } from './i18n.js';


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
// The (unseen) bailiff calls the next defendant in by name
let bailiffTimer = null;
export function bailiffCall(name) {
    const call = document.getElementById('bailiff-call');
    call.textContent = L('Sanık {0}!', name);
    call.classList.add('visible');
    clearTimeout(bailiffTimer);
    bailiffTimer = setTimeout(() => call.classList.remove('visible'), 1700);
}

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
export function showSpeechBubble(text, crimeType, onLetter) {
    elements.speechBubble.classList.remove('hidden');
    elements.bubbleText.textContent = '';

    // Set crime type if available
    if (elements.crimeType && crimeType) {
        elements.crimeType.textContent = crimeType;
    }

    return typeIntoBubble(text, onLetter);
}

// Typewriter effect into the speech bubble; a new call cancels the previous one.
// onLetter(text, index) is called for every letter typed (the speaking sound).
let typeInterval = null;
let finishTyping = null;
export function typeIntoBubble(text, onLetter) {
    clearInterval(typeInterval);
    if (finishTyping) finishTyping();
    elements.bubbleText.textContent = '';
    return new Promise(resolve => {
        let i = 0;
        finishTyping = () => {
            clearInterval(typeInterval);
            elements.bubbleText.textContent = text;
            finishTyping = null;
            resolve();
        };
        typeInterval = setInterval(() => {
            if (i < text.length) {
                elements.bubbleText.textContent += text[i];
                if (onLetter) onLetter(text, i);
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
// A new case opens its file at the top; redrawing the same case (after a question)
// keeps the reader where they were
let shownCase = null;
export function showEvidence(caseData, questionsLeft) {
    if (caseData !== shownCase) {
        shownCase = caseData;
        document.querySelector('.case-file').scrollTop = 0;
    }
    const header = el('p', 'case-defendant', L('Sanık: {0}, {1} yaşında', caseData.name, caseData.age));
    const summary = el('p', 'case-summary', caseData.summary);

    const list = el('ul', 'case-evidence');
    list.appendChild(el('li', '', caseData.evidence[0]));
    if (caseData.asked) {
        list.appendChild(el('li', 'revealed', caseData.evidence[1]));
    }

    // Multi-stage case: the pending report, or the new evidence once it arrived
    let pending = null;
    if (caseData.delayed && caseData.revealed) {
        list.appendChild(el('li', 'new-evidence', L('Yeni delil: {0}', caseData.delayed.evidence)));
    } else if (caseData.delayed) {
        pending = el('div', 'case-pending');
        pending.appendChild(el('p', '', `⏳ ${caseData.delayed.note}.`));
        if (caseData.canPostpone) {
            const btn = el('button', 'postpone-btn', L('Davayı ertele · rapor gelince yarın görülür'));
            btn.type = 'button';
            pending.appendChild(btn);
        }
    }

    const interrogation = el('div', 'case-interrogation');
    if (caseData.asked) {
        interrogation.appendChild(el('p', 'interrogation-answer', L('Sorgu: "{0}"', caseData.answer)));
    } else {
        const btn = el('button', 'interrogate-btn');
        btn.type = 'button';
        btn.disabled = questionsLeft <= 0;
        btn.appendChild(el('span', 'interrogate-q', `🔎 "${caseData.question}"`));
        btn.appendChild(el('span', 'interrogate-left', questionsLeft > 0 ? L('Sorgula · kalan hak: {0}', questionsLeft) : L('Bugünkü sorgu hakkın bitti')));
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
// The law book: a contents page (general rules, amendments, chapter list), then one
// page per chapter. Pages turn with the arrows or a swipe; `onTurn` plays the sound.
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const book = { pages: [], index: 0, onTurn: null, header: null };

export function renderRulebook({ crimes, chapters, generalNotes, amendments, day, labels, onTurn }) {
    book.onTurn = onTurn;

    // Contents page: title and scale from the page, general rules, amendments, chapters
    const contents = el('div', 'book-page book-contents');
    if (!book.header) book.header = [document.querySelector('.rulebook-content h2'), document.querySelector('.rulebook-scale')];
    contents.append(...book.header);
    const general = el('ul', 'law-general');
    generalNotes.forEach(n => general.appendChild(el('li', '', n)));
    contents.appendChild(general);

    if (amendments.length > 0) {
        const section = el('section', 'law law-amendments');
        section.appendChild(el('h3', '', L('Ek Maddeler')));
        const ul = el('ul');
        amendments.forEach(a => {
            const li = el('li', '', `${a.title}: ${a.text}`);
            if (a.day === day) li.appendChild(el('span', 'law-new', L('YENİ')));
            ul.appendChild(li);
        });
        section.appendChild(ul);
        contents.appendChild(section);
    }

    const toc = el('ol', 'book-toc');
    contents.append(el('h3', 'book-toc-title', L('İçindekiler')), toc);
    const pages = [contents];

    chapters.forEach(chapter => {
        const list = chapter.crimes.filter(key => crimes[key]);
        if (!list.length) return;
        const number = ROMAN[pages.length - 1];
        const page = el('div', 'book-page');
        page.append(el('p', 'book-chapter-number', L('Bölüm {0}', number)), el('h3', 'book-chapter-title', chapter.title));

        for (const key of list) {
            const crime = crimes[key];
            const section = el('section', 'law');
            section.appendChild(el('h3', '', crime.name));
            const base = crime.laws.base;
            const baseCond = base.text ? ` (${base.text})` : '';
            section.appendChild(el('p', 'law-base', L('Olağan ceza{0}: {1}', baseCond, labels[base.verdict])));
            const ul = el('ul');
            for (const [lawKey, law] of Object.entries(crime.laws)) {
                if (lawKey === 'base') continue;
                ul.appendChild(el('li', '', `${law.text}: ${labels[law.verdict]}`));
            }
            (crime.notes || []).forEach(n => ul.appendChild(el('li', '', n)));
            section.appendChild(ul);
            page.appendChild(section);
        }

        const target = pages.length;
        const item = el('li');
        const link = el('button', 'book-toc-link');
        link.type = 'button';
        link.append(el('span', 'book-toc-name', `${number}. ${chapter.title}`), el('span', 'book-toc-page', String(target + 1)));
        link.addEventListener('click', () => turnTo(target));
        item.appendChild(link);
        toc.appendChild(item);
        pages.push(page);
    });

    book.pages = pages;
    book.index = Math.min(book.index, pages.length - 1);
    showBookPage();
}

function showBookPage() {
    const page = book.pages[book.index];
    clearTurnStyles(page);
    elements.rulebookBody.classList.remove('turning');
    elements.rulebookBody.replaceChildren(page);
    document.getElementById('book-page-number').textContent = `${book.index + 1} / ${book.pages.length}`;
    document.getElementById('book-prev').disabled = book.index === 0;
    document.getElementById('book-next').disabled = book.index === book.pages.length - 1;
    document.getElementById('book-home').classList.toggle('away', book.index === 0);
    document.querySelector('.rulebook-content').scrollTop = 0;
}

function clearTurnStyles(page) {
    page.style.transition = page.style.transform = page.style.filter = '';
}

// Turning a page, as in a real book. Forward: the current page lifts at its outer
// edge and swings over the spine (left edge) to the left, uncovering the next page
// underneath. Backward: the previous page swings back from the left and lands on
// top of the current one. Both pages share one grid cell; `turn.progress` 0..1.
let turn = null;
const rulebookPanel = document.querySelector('.rulebook-content');

function startTurn(target) {
    if (turn || target < 0 || target >= book.pages.length || target === book.index) return null;
    const forward = target > book.index;
    const current = book.pages[book.index];
    const other = book.pages[target];
    const scroll = rulebookPanel.scrollTop;
    [current, other].forEach(clearTurnStyles);
    // The page coming into view starts at its top, level with what is on screen now
    other.style.transform = `translateY(${scroll}px)`;
    const body = elements.rulebookBody;
    body.style.perspectiveOrigin = `50% ${scroll + rulebookPanel.clientHeight / 2}px`;
    body.classList.add('turning');
    // Forward: next page below, current on top. Backward: current below, previous on top.
    body.replaceChildren(...(forward ? [other, current] : [current, other]));
    turn = { target, forward, current, other, scroll, progress: 0 };
    setTurnProgress(0);
    return turn;
}

function setTurnProgress(p) {
    turn.progress = p;
    const { forward, current, other, scroll } = turn;
    if (forward) {
        current.style.transform = `rotateY(${-180 * p}deg)`;
        current.style.filter = `brightness(${1 - 0.55 * p})`;
        other.style.filter = `brightness(${0.6 + 0.4 * p})`;
    } else {
        other.style.transform = `translateY(${scroll}px) rotateY(${-180 * (1 - p)}deg)`;
        other.style.filter = `brightness(${0.45 + 0.55 * p})`;
        current.style.filter = `brightness(${1 - 0.4 * p})`;
    }
}

function finishTurn(commit) {
    const t = turn;
    const ms = Math.round(380 * (commit ? 1 - t.progress : t.progress)) + 60;
    [t.current, t.other].forEach(page => {
        page.style.transition = `transform ${ms}ms ease-out, filter ${ms}ms ease-out`;
    });
    if (commit && book.onTurn) book.onTurn();
    setTurnProgress(commit ? 1 : 0);
    setTimeout(() => {
        turn = null;
        if (commit) {
            book.index = t.target;
            showBookPage();
        } else {
            [t.current, t.other].forEach(clearTurnStyles);
            elements.rulebookBody.classList.remove('turning');
            elements.rulebookBody.replaceChildren(t.current);
        }
    }, ms + 20);
}

// Arrows and the contents page turn the page by themselves
function turnTo(index) {
    if (!startTurn(index)) return;
    void elements.rulebookBody.offsetWidth; // start from the resting position
    finishTurn(true);
}

document.getElementById('book-prev')?.addEventListener('click', () => turnTo(book.index - 1));
document.getElementById('book-home')?.addEventListener('click', () => turnTo(0));
document.getElementById('book-next')?.addEventListener('click', () => turnTo(book.index + 1));

// Turning by finger: the page follows the finger; let go past a quarter of the width
// (or with a quick flick) and it turns, otherwise it falls back. Vertical scrolling
// is left to the browser.
let drag = null;

rulebookPanel?.addEventListener('touchstart', e => {
    if (turn || e.touches.length !== 1 || e.target.closest('.book-nav')) return;
    drag = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now(), active: false, done: false };
}, { passive: true });

rulebookPanel?.addEventListener('touchmove', e => {
    if (!drag || drag.done) return;
    const dx = e.touches[0].clientX - drag.x;
    const dy = e.touches[0].clientY - drag.y;
    if (!drag.active) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { drag.done = true; return; } // a scroll
        if (Math.abs(dx) < 10) return;
        if (!startTurn(book.index + (dx < 0 ? 1 : -1))) { drag.done = true; return; } // first or last page
        drag.active = true;
        drag.forward = dx < 0;
    }
    e.preventDefault();
    const along = drag.forward ? -dx : dx;
    drag.dx = dx;
    setTurnProgress(Math.max(0, Math.min(1, along / rulebookPanel.clientWidth)));
}, { passive: false });

rulebookPanel?.addEventListener('touchend', () => {
    if (!drag || !drag.active) { drag = null; return; }
    const quickFlick = Date.now() - drag.time < 250 && Math.abs(drag.dx || 0) > 30;
    drag = null;
    finishTurn(turn.progress > 0.25 || quickFlick);
});

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
            next.textContent = i === steps.length - 1 ? L('Başla') : L('İleri');
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
        btn.textContent = mode === 'endless' ? L('Devam Et (Sonsuz · {0}. Gün)', day) : L('Devam Et ({0}. Gün)', day);
        btn.classList.remove('hidden');
        elements.startBtn.textContent = L('Yeni Oyun');
    } else {
        btn.classList.add('hidden');
        elements.startBtn.textContent = L('Koltuğa Otur');
    }
}

// Start screen: endless mode button and best record, once the story is finished
// The button is always visible; until the story is finished it is locked and explains why
export function setEndlessOption(unlocked, best) {
    const btn = document.getElementById('endless-btn');
    btn.classList.toggle('locked', !unlocked);
    btn.setAttribute('aria-disabled', String(!unlocked));
    btn.title = unlocked ? '' : L('30 gün boyunca koltukta kaldıktan sonra Sonsuz Mod\'u açabilirsin.');
    const record = document.getElementById('endless-record');
    record.classList.toggle('hidden', !unlocked || !best);
    record.textContent = best ? L('Sonsuz mod rekoru: {0} gün', best) : '';
}

// Settings window. `onChange(key, value)` saves each change right away.
export function showSettings(settings, { onChange, onReset }) {
    const modal = document.getElementById('settings-modal');
    const render = () => {
        modal.querySelectorAll('.setting-toggle').forEach(btn => {
            const on = Boolean(settings[btn.dataset.setting]);
            btn.textContent = on ? L('Açık') : L('Kapalı');
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
    btn.setAttribute('aria-label', on ? L('Sesi kapat') : L('Sesi aç'));
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
    document.getElementById('evening-day').textContent = L('{0}. Gün · Akşam', day);
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
        const b = el('button', 'typewriter-btn', L('Sabah oldu'));
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
    const floating = rulebookContent.scrollTop > 8;
    document.getElementById('rulebook-close').classList.toggle('floating', floating);
    document.getElementById('book-home').classList.toggle('floating', floating);
}, { passive: true });

export function closeRulebook() {
    elements.rulebookModal.classList.add('hidden');
}

// Show feedback overlay
// outcome: true (lawful, green), 'partial' (close to the law, yellow) or false (red)
export function showFeedback(outcome, title, message, stats, stampLabel = '') {
    const tone = outcome === 'partial' ? 'partial' : outcome ? 'justice' : 'negative';
    elements.feedbackTitle.textContent = title;
    elements.feedbackTitle.className = tone === 'justice' ? '' : tone;
    elements.feedbackMessage.textContent = message;
    elements.feedbackStats.innerHTML = stats;

    elements.stampEffect.className = tone === 'negative' ? '' : tone;
    elements.stampEffect.textContent = stampLabel;
    elements.feedbackOverlay.classList.remove('hidden');

    // Stays until the player taps anywhere (not in the first moment, so a stray
    // second tap on the verdict button does not skip it unread)
    return new Promise(resolve => {
        let ready = false;
        setTimeout(() => { ready = true; }, 400);
        elements.feedbackOverlay.onclick = () => {
            if (!ready) return;
            elements.feedbackOverlay.onclick = null;
            elements.feedbackOverlay.classList.add('hidden');
            resolve();
        };
    });
}

// Show the end-of-day newspaper
export function showDailySummary(dayStats, paper) {
    elements.paperDate.textContent = L('{0}. Gün', dayStats.day);
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
