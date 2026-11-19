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

const easeIn = t => t * t * t;            // speeds up: the strike
const easeOut = t => 1 - (1 - t) * (1 - t); // slows down: lifting before the strike

// Turns the gavel from `from` to `to` degrees in `ms`
function swing(gavel, from, to, ms, ease) {
    return new Promise(resolve => {
        const t0 = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - t0) / ms);
            gavel.style.transform = `rotate(${from + (to - from) * ease(t)}deg)`;
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
    if (!el) return;

    let skip = false;
    try {
        skip = sessionStorage.getItem(SKIP_KEY) === '1';
        sessionStorage.removeItem(SKIP_KEY);
    } catch { /* storage blocked */ }

    let finished = false;
    // The menu is already drawn behind the dark cover (drawing it for the first time is the
    // costly part); at the end the cover only fades away, which a phone does smoothly.
    const finish = () => {
        if (finished) return;
        finished = true;
        el.classList.add('done');
        setTimeout(() => el.remove(), 400);
    };
    if (skip) {
        el.remove();
        return;
    }
    el.addEventListener('pointerdown', finish);

    // only once the opening is on screen, and with the gavel sound ready
    await Promise.all([painted(), Promise.race([audio.whenLoaded('gavel'), sleep(SOUND_WAIT)])]);
    if (finished) return;
    el.classList.add('ready'); // the gavel appears (until now the screen was just dark)
    await sleep(400); // the raised gavel, a moment
    if (finished) return;
    audio.resume();

    // The swing is drawn frame by frame by this code, so the frame where the gavel meets
    // the block and the sound are always the same moment (an animation left to the browser
    // ends on its own clock, and the sound followed it late on a busy phone).
    const gavel = el.querySelector('.ig-swing');
    await swing(gavel, 48, 64, 220, easeOut); // lifted a little higher...
    if (finished) return;
    await swing(gavel, 64, 0, 340, easeIn);   // ...and down onto the block
    // the frame where the gavel meets the block reaches the screen first; the sound comes
    // with the next one (played at once, it was heard before the gavel was seen to land)
    await painted();
    if (finished) return;
    // the strike: sound, flash and a small shake together, then a little bounce
    audio.playGavel();
    el.classList.add('hit');
    gavel.animate([{ transform: DOWN }, { transform: 'rotate(7deg)' }, { transform: DOWN }],
        { duration: 170, easing: 'ease-out', fill: 'forwards' });
    await sleep(750);
    finish();
}
