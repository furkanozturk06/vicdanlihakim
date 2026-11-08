/**
 * Audio Module
 * Handles sound effects (Web Audio API based)
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.5;
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Resume audio context (needed after user interaction)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Generate a simple tone
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Gavel strike sound
    playGavel() {
        if (!this.enabled || !this.audioContext) return;

        // Create noise for impact
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(this.volume * 0.8, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        noise.start();

        // Add a low thump
        this.playTone(100, 0.1, 'sine');
    }

    // Positive feedback sound
    playSuccess() {
        if (!this.enabled) return;

        setTimeout(() => this.playTone(523.25, 0.1, 'sine'), 0);    // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 100);  // E5
        setTimeout(() => this.playTone(783.99, 0.15, 'sine'), 200); // G5
    }

    // Negative feedback sound
    playFailure() {
        if (!this.enabled) return;

        setTimeout(() => this.playTone(311.13, 0.15, 'sine'), 0);   // Eb4
        setTimeout(() => this.playTone(233.08, 0.2, 'sine'), 150);  // Bb3
    }

    // Door creak
    playDoor() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 0.3);

        gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Button click
    playClick() {
        this.playTone(800, 0.05, 'square');
    }

    // Ambient courtroom (low drone)
    startAmbient() {
        if (!this.enabled || !this.audioContext) return;

        // Very subtle ambient drone
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = 60;
        gainNode.gain.value = this.volume * 0.02;

        oscillator.start();

        this.ambientOscillator = oscillator;
        this.ambientGain = gainNode;
    }

    stopAmbient() {
        if (this.ambientOscillator) {
            this.ambientOscillator.stop();
            this.ambientOscillator = null;
        }
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.ambientGain) {
            this.ambientGain.gain.value = this.volume * 0.02;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopAmbient();
        }
        return this.enabled;
    }
}

export const audio = new AudioManager();
