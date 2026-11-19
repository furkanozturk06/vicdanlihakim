/**
 * The opening: when the game is opened, a gavel comes down on its block in the dark
 * courtroom, with the gavel's sound, and the start screen comes in after it.
 * About two seconds; a tap skips it. It plays when the game is opened, not when the game
 * reloads itself (a language change, back to the main menu).
 *
 * While the game is opening the phone is busy, and the page's own code can stall for most
 * of a second. So the whole movement is handed to the phone at once as animations (which
 * it runs by itself, stalled or not), and the sound is set on the sound card's clock for
 * the moment of the strike: picture and sound keep their time even when the page does not.
 */

const SKIP_KEY = 'hakim.noIntro';
const SOUND_WAIT = 700; // ms to wait at most for the gavel sound to be loaded

// the movement, in ms from its start
const LIFT = 220;               // lifted a little higher...
const STRIKE = LIFT + 340;      // ...and down onto the block
const BOUNCE = STRIKE + 170;    // a small bounce back
const GAVEL_OUT = STRIKE + 550; // the gavel fades...
const COVER_OUT = GAVEL_OUT + 250; // ...then the dark cover, showing the start screen
const END = COVER_OUT + 350;
// the screen shows a frame a little after it is drawn; the sound waits that long too
const SCREEN_LAG = 0.025;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// resolves once the screen has really been drawn (a frame shown, then the next one)
const painted = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const at = (ms) => ms / BOUNCE; // a moment of the swing, as a part of it

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
    if (skip) {
        el.remove();
        return;
    }

    let finished = false;
    // A tap: the cover fades away at once (the menu is already drawn behind it)
    const finish = () => {
        if (finished) return;
        finished = true;
        for (const a of el.getAnimations({ subtree: true })) a.cancel();
        el.classList.add('done');
        setTimeout(() => el.remove(), 400);
    };
    el.addEventListener('pointerdown', finish);

    // only once the opening is on screen, and with the gavel sound ready
    await Promise.all([painted(), Promise.race([audio.whenLoaded('gavel'), sleep(SOUND_WAIT)])]);
    if (finished) return;
    el.classList.add('ready'); // the gavel appears (until now the screen was just dark)
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
    // then the gavel goes, and after it the cover
    stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, delay: GAVEL_OUT, fill: 'forwards' });
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, delay: COVER_OUT, fill: 'forwards' });

    // the sound, set for the moment the gavel meets the block
    await swing.ready;
    if (finished) return;
    const started = document.timeline.currentTime - swing.startTime;
    audio.playGavel(Math.max(0, STRIKE - started) / 1000 + SCREEN_LAG);

    await sleep(Math.max(0, END - started));
    if (finished) return;
    finished = true;
    el.remove();
}
