/**
 * The opening: when the game is opened, a gavel comes down on its block in the dark
 * courtroom, with the gavel's sound, and the start screen comes in after it.
 * A tap skips it. It plays when the game is opened, not when the game reloads itself
 * (a language change, back to the main menu).
 *
 * Just after the game is opened the phone draws slowly, at times a frame a second. So:
 * - the start screen is not drawn while the gavel comes down (drawing it for the first time
 *   is the costly part); it is drawn behind the dark cover once the gavel lies still,
 * - the gavel waits until the phone draws smoothly before it moves,
 * - the swing is handed to the phone whole, as an animation it runs by itself, and the sound
 *   is set on the sound card's clock for the moment of the strike.
 */

const SKIP_KEY = 'hakim.noIntro';
const SOUND_WAIT = 700; // ms to wait at most for the gavel sound to be loaded

// the swing, in ms from its start
const LIFT = 220;            // lifted a little higher...
const STRIKE = LIFT + 340;   // ...and down onto the block
const BOUNCE = STRIKE + 170; // a small bounce back
// the screen shows a frame a little after it is drawn; the sound waits that long too
const SCREEN_LAG = 0.025;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
const at = (ms) => ms / BOUNCE; // a moment of the swing, as a part of it

// Resolves once the phone draws a few frames in a row each within `frameMs` (or after
// `maxMs` at most)
async function smooth(maxMs, frameMs = 34) {
    const start = performance.now();
    let last = await nextFrame();
    let good = 0;
    while (good < 5 && last - start < maxMs) {
        const now = await nextFrame();
        good = now - last < frameMs ? good + 1 : 0;
        last = now;
    }
}

// Before the game reloads itself: the next page load opens without the gavel
export function skipNextIntro() {
    try { sessionStorage.setItem(SKIP_KEY, '1'); } catch { /* storage blocked */ }
}

// `audio` is the game's audio manager
export async function playIntro(audio) {
    const el = document.getElementById('intro-gavel');
    const menu = document.getElementById('start-screen');
    const showMenu = () => menu.classList.remove('behind-intro');
    if (!el) {
        showMenu();
        return;
    }

    let skip = false;
    try {
        skip = sessionStorage.getItem(SKIP_KEY) === '1';
        sessionStorage.removeItem(SKIP_KEY);
    } catch { /* storage blocked */ }
    if (skip) {
        showMenu();
        el.remove();
        return;
    }

    let finished = false;
    // A tap: the start screen at once, the cover fading away over it
    const finish = () => {
        if (finished) return;
        finished = true;
        showMenu();
        for (const a of el.getAnimations({ subtree: true })) a.cancel();
        el.classList.add('done');
        setTimeout(() => el.remove(), 400);
    };
    el.addEventListener('pointerdown', finish);

    // the dark cover is up; the gavel appears once the phone draws smoothly, sound ready
    await Promise.all([smooth(3000), Promise.race([audio.whenLoaded('gavel'), sleep(SOUND_WAIT)])]);
    if (finished) return;
    el.classList.add('ready');
    await sleep(400); // the raised gavel, a moment
    if (finished) return;
    audio.resume();

    const stage = el.querySelector('.ig-stage');
    const swing = el.querySelector('.ig-swing').animate([
        { transform: 'rotate(48deg)', easing: 'ease-out' },
        { transform: 'rotate(64deg)', offset: at(LIFT), easing: 'cubic-bezier(0.4, 0, 0.9, 0.3)' },
        { transform: 'rotate(0deg)', offset: at(STRIKE), easing: 'ease-out' },
        { transform: 'rotate(7deg)', offset: at(STRIKE + 70), easing: 'ease-in' },
        { transform: 'rotate(0deg)' },
    ], { duration: BOUNCE, fill: 'forwards' });
    // the strike: a flash on the block and a small shake
    el.querySelector('.ig-flash').animate([{ opacity: 0.95 }, { opacity: 0 }],
        { duration: 500, delay: STRIKE, easing: 'ease-out' });
    stage.animate([
        { transform: 'translate(0, 0)' },
        { transform: 'translate(-4px, 3px)', offset: 0.2 },
        { transform: 'translate(3px, -2px)', offset: 0.45 },
        { transform: 'translate(-2px, 1px)', offset: 0.7 },
        { transform: 'translate(0, 0)' },
    ], { duration: 280, delay: STRIKE, easing: 'ease-out' });

    // the sound, set for the moment the gavel meets the block
    await swing.ready;
    if (finished) return;
    audio.playGavel(Math.max(0, STRIKE - (document.timeline.currentTime - swing.startTime)) / 1000 + SCREEN_LAG);

    // once the flash is over, the start screen is drawn behind the cover (the gavel lies
    // still meanwhile, so a slow frame does not show), then the gavel and the cover go
    await swing.finished;
    await sleep(350);
    if (finished) return;
    showMenu();
    await smooth(2000, 70); // the menu's first seconds are drawn at about 30 frames a second
    if (finished) return;
    await stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' }).finished;
    if (finished) return;
    await el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' }).finished;
    finished = true;
    el.remove();
}
