/**
 * The opening: when the game is opened, a gavel comes down on its block in the dark
 * courtroom, with the gavel's sound, and the start screen comes in after it.
 * About a second; a tap skips it. It plays when the game is opened, not when the game
 * reloads itself (a language change, back to the main menu).
 *
 * The sound and the flash follow the gavel's own movement (not a timer): on a slow
 * phone the animation may start late, and the sound must still come with the strike.
 */

const SKIP_KEY = 'hakim.noIntro';
const SOUND_WAIT = 700; // ms to wait at most for the gavel sound to be loaded
const DOWN = 'rotate(0deg)';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// resolves once the screen has really been drawn (a frame shown, then the next one)
const painted = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

// Turns the gavel from `from` to `to` degrees in `ms`, speeding up like a real swing
function swing(gavel, from, to, ms) {
    return new Promise(resolve => {
        const t0 = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - t0) / ms);
            gavel.style.transform = `rotate(${from + (to - from) * t * t}deg)`;
            if (t < 1) requestAnimationFrame(step);
            else resolve();
        };
        requestAnimationFrame(step);
    });
}

// Before the game reloads itself: the next page load opens without the gavel
export function skipNextIntro() {
    try { sessionStorage.setItem(SKIP_KEY, '1'); } catch { /* storage blocked */ }
}

// `audio` is the game's audio manager
export async function playIntro(audio) {
    const el = document.getElementById('intro-gavel');
    const start = document.getElementById('start-screen');
    if (!el) return;

    let skip = false;
    try {
        skip = sessionStorage.getItem(SKIP_KEY) === '1';
        sessionStorage.removeItem(SKIP_KEY);
    } catch { /* storage blocked */ }

    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        start.classList.remove('intro-playing'); // the menu comes in as it always does
        el.classList.add('done');
        setTimeout(() => el.remove(), 400);
    };
    if (skip) {
        el.remove();
        start.classList.remove('intro-playing');
        return;
    }
    el.addEventListener('pointerdown', finish);

    // only once the opening is on screen, and with the gavel sound ready
    await Promise.all([painted(), Promise.race([audio.whenLoaded('gavel'), sleep(SOUND_WAIT)])]);
    if (finished) return;
    el.classList.add('ready'); // the gavel appears (until now the screen was just dark)
    await sleep(250); // the raised gavel, a moment
    if (finished) return;
    audio.resume();

    // The swing is drawn frame by frame by this code, so the frame where the gavel meets
    // the block and the sound are always the same moment (an animation left to the browser
    // ends on its own clock, and the sound followed it late on a busy phone).
    const gavel = el.querySelector('.ig-swing');
    await swing(gavel, 48, 0, 300);
    if (finished) return;
    // the strike: sound, flash and a small shake together, then a little bounce
    audio.playGavel();
    el.classList.add('hit');
    gavel.animate([{ transform: DOWN }, { transform: 'rotate(7deg)' }, { transform: DOWN }],
        { duration: 170, easing: 'ease-out', fill: 'forwards' });
    await sleep(600);
    finish();
}
