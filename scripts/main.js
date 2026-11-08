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

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
