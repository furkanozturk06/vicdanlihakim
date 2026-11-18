/**
 * UI Module
 * Handles animations, transitions, and visual feedback
 */

import { homeScene } from './home.js';
import { audio } from './audio.js';
import { L, formatMoney } from './i18n.js';


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
// True while the start screen fades out: a second tap on its buttons is ignored
export function startScreenClosing() {
    return elements.startScreen.style.opacity === '0';
}

export function hideStartScreen() {
    elements.startScreen.style.opacity = '0';
    elements.startScreen.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        elements.startScreen.classList.add('hidden');
        elements.startScreen.style.opacity = '';
    }, 500);
}

// Update stats display
let currentDay = 1; // for the date on news pages
export function updateStats(gameState) {
    currentDay = gameState.eveningDay ?? gameState.day;
    elements.dayValue.textContent = currentDay;
    elements.moneyValue.textContent = `₺${formatMoney(gameState.money)}`;
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
    elements.caseNumValue.textContent = num === null ? '—' : num.toString().padStart(3, '0');
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

// The call sits right beside the door frame and grows to the left. It never runs
// off the screen: a long name gets smaller letters, and if even the smallest
// readable size is too wide, the name moves whole to a second line (made smaller
// too if the name alone is still too wide)
const MIN_CALL_FONT = 7.5;
const CALL_EDGE = 6; // margin from the screen edge
function fitBailiffCall(call, name) {
    const scene = call.parentElement;
    const area = scene.getBoundingClientRect();
    if (!area.width) return;
    const ratio = area.width / scene.offsetWidth; // on-screen px per layout px (tablets scale the game up)
    const box = call.getBoundingClientRect();
    const over = (area.left - box.left) / ratio + CALL_EDGE;
    if (over <= 0) return;
    const style = getComputedStyle(call);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const text = box.width / ratio - padding;
    const fitted = parseFloat(style.fontSize) * (text - over) / text;
    if (fitted >= MIN_CALL_FONT) {
        call.style.fontSize = `${Math.floor(fitted * 10) / 10}px`;
        return;
    }
    call.textContent = L('Sanık {0}!', name.replace(/ /g, ' '));
    call.style.whiteSpace = 'normal';
    call.style.maxWidth = `${(box.right - area.left) / ratio - CALL_EDGE}px`;
    const room = call.clientWidth - padding;
    const need = call.scrollWidth - padding;
    if (need > room) call.style.fontSize = `${Math.floor(parseFloat(style.fontSize) * room / need * 10) / 10}px`;
}

export function bailiffCall(name) {
    const call = document.getElementById('bailiff-call');
    call.style.fontSize = '';
    call.style.whiteSpace = '';
    call.style.maxWidth = '';
    call.textContent = L('Sanık {0}!', name);
    fitBailiffCall(call, name);
    call.classList.add('visible');
    clearTimeout(bailiffTimer);
    bailiffTimer = setTimeout(() => call.classList.remove('visible'), 1700);
}

// The door swings open slowly into the room and light from the corridor falls in
export function openDoor() {
    return new Promise(resolve => {
        elements.courtroomDoor.classList.remove('closing');
        elements.courtroomDoor.classList.add('open');
        document.getElementById('door-scene').classList.add('lit');
        setTimeout(resolve, 950);
    });
}

// Animate door closing
// It swings shut, hits the frame, bounces a little and settles
export function closeDoor() {
    return new Promise(resolve => {
        const door = elements.courtroomDoor;
        door.classList.remove('open');
        door.classList.add('closing');
        document.getElementById('door-scene').classList.remove('lit');
        setTimeout(() => {
            door.classList.remove('closing');
            resolve();
        }, 800);
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

// The verdict lands: the defendant's face changes and they move (hop, sink, shake...).
// A death sentence darkens the courtroom for a moment.
export function npcReact(npcElement, { motion, death }) {
    npcElement.classList.add(motion);
    elements.npcContainer.replaceChildren(npcElement);
    if (death) {
        const room = document.getElementById('courtroom');
        room.classList.remove('verdict-death');
        void room.offsetWidth;
        room.classList.add('verdict-death');
        setTimeout(() => room.classList.remove('verdict-death'), 3200);
    }
    // The verdict screen comes up as soon as the face has changed; the movement goes on behind it
    return new Promise(resolve => setTimeout(resolve, 450));
}

// Hide NPC with exit animation: 'free' walks out to the side, 'taken' is led down
// behind the rail, anything else steps back
// A new game starts with an empty courtroom: nothing left over from the last one
export function clearCourtroom() {
    elements.npcContainer.innerHTML = '';
    hideSpeechBubble();
    hideEvidence();
    hidePendingOffer();
    updateCaseNumber(0);
    elements.courtroomDoor.className = 'closed';
    document.getElementById('door-scene').classList.remove('lit');
}

export function hideNPC(exit = 'quiet') {
    const npc = elements.npcContainer.querySelector('.npc');
    if (npc) {
        npc.className = `npc exit-${exit}`;
        npc.style.transition = '';
        setTimeout(() => {
            elements.npcContainer.innerHTML = '';
        }, 700);
    }
}

// Show speech bubble with typewriter effect
// `label`: what the bubble header says before crimeType ("Suç:" for a defendant,
// "Tanık:", "Avukat:"... at a hearing)
export function showSpeechBubble(text, crimeType, onLetter, label = L('Suç:')) {
    elements.speechBubble.classList.remove('hidden');
    elements.bubbleText.textContent = '';
    document.querySelector('#speech-bubble .crime-label').textContent = label;

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

// The case file at a story hearing: what the hearing is about
export function showHearingFile(title, text, who = null) {
    shownCase = null;
    document.querySelector('.case-file').scrollTop = 0;
    elements.evidenceContent.replaceChildren(...[el('p', 'case-defendant', title), who && el('p', 'case-defendant', who), el('p', 'case-summary hearing-text', text)].filter(Boolean));
    elements.evidenceDesk.classList.remove('hidden');
}

// A hearing's decision, on a card over the verdict buttons. Resolves to the chosen value.
export function showHearingChoice(choices) {
    const card = document.getElementById('hearing-choice');
    const box = document.getElementById('hearing-choice-buttons');
    // the verdict buttons are not part of this decision: hidden while the card is up
    const panel = document.getElementById('sentencing-panel');
    audio.playNotice();
    return new Promise(resolve => {
        box.replaceChildren(...choices.map(c => {
            const b = el('button', 'typewriter-btn', c.label);
            b.type = 'button';
            b.onclick = () => {
                audio.playClick();
                card.classList.add('hidden');
                panel.classList.remove('behind-hearing');
                resolve(c.value);
            };
            return b;
        }));
        panel.classList.add('behind-hearing');
        card.classList.remove('hidden');
    });
}

// Switch one verdict button off (e.g. the death penalty at a custody hearing)
export function setVerdictAvailable(sentence, available) {
    document.querySelectorAll(`.verdict-btn[data-sentence="${sentence}"]`).forEach(btn => {
        btn.disabled = !available;
        btn.style.opacity = available ? '' : '0.35';
        btn.style.pointerEvents = available ? '' : 'none';
    });
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
    page.style.transition = page.style.transform = page.style.filter = page.style.transformOrigin = '';
}

// Turning a page. The page you are going to swings in over the current one and lands
// on top of it: going back it comes from the left edge, going forward from the right
// edge (mirror images). Both pages share one grid cell; `turn.progress` 0..1.
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
    // The current page stays below; the page coming into view is on top
    body.replaceChildren(current, other);
    turn = { target, forward, current, other, scroll, progress: 0 };
    setTurnProgress(0);
    return turn;
}

function setTurnProgress(p) {
    turn.progress = p;
    const { forward, current, other, scroll } = turn;
    other.style.transformOrigin = forward ? 'right center' : 'left center';
    other.style.transform = `translateY(${scroll}px) rotateY(${(forward ? 180 : -180) * (1 - p)}deg)`;
    other.style.filter = `brightness(${0.45 + 0.55 * p})`;
    current.style.filter = `brightness(${1 - 0.4 * p})`;
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
    // on-screen width (a scaled-up game on a tablet is wider than its layout width)
    setTurnProgress(Math.max(0, Math.min(1, along / rulebookPanel.getBoundingClientRect().width)));
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
            audio.playClick();
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
        document.getElementById('setting-ambience-volume').value = Math.round((settings.ambienceVolume ?? 0.5) * 100);
        document.querySelectorAll('#setting-textsize button').forEach(b => {
            b.classList.toggle('selected', b.dataset.size === (settings.textSize || 'normal'));
        });
    };

    modal.querySelectorAll('.setting-toggle').forEach(btn => {
        btn.onclick = () => { audio.playClick(); onChange(btn.dataset.setting, !settings[btn.dataset.setting]); render(); };
    });
    document.getElementById('setting-volume').oninput = (e) => onChange('volume', Number(e.target.value) / 100);
    document.getElementById('setting-ambience-volume').oninput = (e) => onChange('ambienceVolume', Number(e.target.value) / 100);
    document.querySelectorAll('#setting-textsize button').forEach(b => {
        b.onclick = () => { audio.playClick(); onChange('textSize', b.dataset.size); render(); };
    });
    document.getElementById('settings-reset').onclick = () => { audio.playClick(); onReset(); };
    document.getElementById('settings-close').onclick = () => { audio.playClick(); modal.classList.add('hidden'); };

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
export function showStory({ icon, title, text, choices, silent = false }) {
    const modal = document.getElementById('story-modal');
    // News (📰 / 🗞️) is shown as a newspaper page: masthead, date, headline, column
    const news = icon === '📰' || icon === '🗞️';
    modal.querySelector('.story-content').classList.toggle('as-paper', news);
    if (news) audio.playNewspaper();
    else audio.playNotice();
    document.getElementById('story-paper-date').textContent = L('{0}. Gün', currentDay);
    document.getElementById('story-icon').textContent = icon || '';
    document.getElementById('story-title').textContent = title;
    const body = document.getElementById('story-text');
    body.textContent = text;
    // Lines naming a case ("3. gün · Ahmet Y. · ...") are set in bold
    body.replaceChildren(...text.split('\n').flatMap((line, i) => {
        const caseLine = /^(\d+\. gün|Day \d+) · /.test(line);
        return [...(i ? ['\n'] : []), caseLine ? el('strong', '', line) : line];
    }));
    const box = document.getElementById('story-choices');

    return new Promise(resolve => {
        box.replaceChildren(...choices.map(c => {
            const b = el('button', 'typewriter-btn', c.label);
            b.type = 'button';
            b.disabled = Boolean(c.disabled);
            b.onclick = () => {
                if (!silent) audio.playClick();
                modal.classList.add('hidden');
                resolve(c.value);
            };
            return b;
        }));
        modal.classList.remove('hidden');
    });
}

// Evening at home: family status, bills and a scene. Resolves to the chosen index.
export function showEvening({ day, home, moment, family, harmony, bills, balance, text, choices }) {
    const modal = document.getElementById('evening-modal');
    document.getElementById('evening-day').textContent = L('{0}. Gün · Akşam', day);
    setFamily(home, family, moment);
    setHarmony(harmony);
    document.getElementById('evening-bills').textContent = bills;
    setBalance(balance);
    document.getElementById('evening-text').textContent = text;
    const box = document.getElementById('evening-choices');

    return new Promise(resolve => {
        box.replaceChildren(...choices.map((c, i) => {
            const b = el('button', 'typewriter-btn', c.label);
            b.type = 'button';
            b.disabled = Boolean(c.disabled);
            b.onclick = () => { audio.playClick(); resolve(i); };
            return b;
        }));
        modal.classList.remove('hidden');
    });
}

// The living room picture and the list of who is home and how they are
function setFamily(home, family, moment) {
    document.getElementById('evening-home').innerHTML = homeScene(home, moment);
    document.getElementById('evening-family').replaceChildren(...family.map(m => {
        const li = el('li');
        li.appendChild(el('span', 'member', `${m.name} `));
        li.appendChild(el('span', 'role', `(${m.role})`));
        li.appendChild(el('span', 'state', m.status));
        return li;
    }));
}

function setBalance(money) {
    const el = document.getElementById('evening-balance');
    el.textContent = `₺${formatMoney(money)}`;
    el.classList.toggle('low', money < 10000);
}

function setHarmony(value) {
    const bar = document.getElementById('evening-harmony-bar');
    bar.style.width = `${value}%`;
    bar.style.background = value < 30 ? '#8b2020' : value < 60 ? '#c9a227' : '#4a9c6d';
}

// After the evening choice: show what happened, then wait for the next morning
export function showEveningResult(text, harmony, balance, home, family, moment) {
    // the choice may have changed who is home (someone left, someone came back)
    if (home) setFamily(home, family, moment);
    setHarmony(harmony);
    if (balance !== undefined) setBalance(balance);
    document.getElementById('evening-text').textContent = text;
    const box = document.getElementById('evening-choices');
    return new Promise(resolve => {
        const b = el('button', 'typewriter-btn', L('Sabah oldu'));
        b.type = 'button';
        b.onclick = () => {
            audio.playClick();
            document.getElementById('evening-modal').classList.add('hidden');
            resolve();
        };
        box.replaceChildren(b);
        // the sound of the house follows the choice: calm when the family is at peace after it
        if (home) audio.playHome(!home.spouseLeft && harmony >= 60);
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
            audio.playClick();
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
    // the bribe: an envelope slid onto the desk
    if (icon === '✉️') audio.playEnvelope();
    else audio.playNotice();
    elements.offerTitle.textContent = title;
    elements.offerText.textContent = text;
    elements.offerAccept.textContent = accept;
    elements.offerDecline.textContent = decline;
    deferBtn.textContent = deferLabel || '';
    deferBtn.classList.toggle('hidden', !deferLabel);
    elements.offerModal.classList.remove('hidden');

    return new Promise(resolve => {
        const done = (choice) => {
            audio.playClick();
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

// Career screen: title, progress to the next title, achievements
export function setCareer({ rank, lawful, next, achievements }) {
    document.getElementById('career-rank').textContent = rank;
    document.getElementById('career-title').textContent = L('{0} · {1} kanuna uygun karar', rank, lawful);
    const bar = document.getElementById('career-progress-bar');
    if (next) {
        bar.style.width = `${Math.round(((lawful - next.from) / (next.at - next.from)) * 100)}%`;
        document.getElementById('career-next').textContent = L('Sonraki unvan: {0} ({1} karar)', next.title, next.at);
    } else {
        bar.style.width = '100%';
        document.getElementById('career-next').textContent = L('En yüksek unvana ulaştın.');
    }
    const done = achievements.filter(a => a.done).length;
    document.getElementById('career-count').textContent = `${done} / ${achievements.length}`;
    document.getElementById('achievement-list').replaceChildren(...achievements.map(a => {
        const li = el('li', a.done ? 'done' : 'locked');
        li.append(el('span', 'achievement-icon', a.done ? a.icon : '🔒'), el('span', 'achievement-title', a.title), el('span', 'achievement-text', a.text));
        return li;
    }));
}

export function openCareer() {
    const modal = document.getElementById('career-modal');
    modal.classList.remove('hidden');
    document.getElementById('career-close').onclick = () => { audio.playClick(); modal.classList.add('hidden'); };
    modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };
}

// A short notice at the top of the screen; several queue up
const toastQueue = [];
let toastBusy = false;
export function toast(text) {
    toastQueue.push(text);
    if (toastBusy) return;
    const next = () => {
        const t = toastQueue.shift();
        if (!t) { toastBusy = false; return; }
        toastBusy = true;
        const box = document.getElementById('toast');
        box.textContent = t;
        box.classList.add('visible');
        setTimeout(() => { box.classList.remove('visible'); setTimeout(next, 350); }, 2600);
    };
    next();
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
    audio.playNewspaper();
    elements.paperDate.textContent = L('{0}. Gün', dayStats.day);
    elements.paperHeadline.textContent = paper.main.text;
    const lede = document.getElementById('paper-lede');
    lede.textContent = paper.main.note;
    lede.hidden = !paper.main.note;
    elements.paperSide.replaceChildren(...paper.side.map(n => {
        const li = el('li');
        li.appendChild(el('strong', '', n.text));
        if (n.note) li.appendChild(el('span', 'paper-note', n.note));
        return li;
    }));

    elements.casesJudged.textContent = dayStats.casesJudged;
    elements.correctVerdicts.textContent = dayStats.correctVerdicts;
    elements.dayEarnings.textContent = `₺${dayStats.earnings >= 0 ? '+' : ''}${formatMoney(dayStats.earnings)}`;
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
    if (type === 'media') audio.playNewspaper();
    else audio.playNotice();
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
