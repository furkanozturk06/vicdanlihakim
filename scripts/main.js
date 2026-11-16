/**
 * Main Entry Point
 * Justice & Conscience: The Judge's Chair
 */

import '@fontsource/special-elite';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/crimson-text/400.css';
import '@fontsource/crimson-text/600.css';
import '@fontsource/crimson-text/700.css';
import { initGame } from './game.js';

// The game is laid out for a phone screen. On a bigger screen (a tablet held
// upright) the whole game is scaled up evenly, so it fills the screen instead of
// leaving a large empty gap in the middle. Phones and wide screens stay as they are.
const DESIGN_WIDTH = 430;
const DESIGN_HEIGHT = 860;
const MAX_SCALE = 1.8;

function fitToScreen() {
    const game = document.getElementById('game-container');
    const body = getComputedStyle(document.body);
    const width = document.body.clientWidth - parseFloat(body.paddingLeft) - parseFloat(body.paddingRight);
    const height = document.body.clientHeight - parseFloat(body.paddingTop) - parseFloat(body.paddingBottom);
    const scale = Math.min(MAX_SCALE, width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
    if (scale <= 1) {
        game.style.zoom = game.style.width = game.style.height = game.style.maxWidth = game.style.maxHeight = '';
        return;
    }
    Object.assign(game.style, {
        zoom: scale,
        width: `${width / scale}px`,
        height: `${height / scale}px`,
        maxWidth: 'none',
        maxHeight: 'none',
    });
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fitToScreen();
    window.addEventListener('resize', fitToScreen);
    initGame();
});
