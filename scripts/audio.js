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
    playTone(frequency, duration, type = 'sine', level = 0.3) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume * level, this.audioContext.currentTime);
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

    // Short burst of filtered noise; used for the latch click and the body of the thud
    playNoise(startAt, duration, filterType, frequency, gain) {
        const ctx = this.audioContext;
        const length = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = frequency;
        const g = ctx.createGain();
        g.gain.value = gain;

        source.connect(filter);
        filter.connect(g);
        g.connect(ctx.destination);
        source.start(startAt);
    }

    // Page turn: two soft paper swishes, a band of noise sweeping upwards
    playPageTurn() {
        if (!this.enabled || !this.audioContext) return;

        const ctx = this.audioContext;
        const swish = (startAt, duration, from, to, level) => {
            const length = Math.floor(ctx.sampleRate * duration);
            const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < length; i++) {
                // quick rise, slower fall: the paper lifts, then settles
                const t = i / length;
                const envelope = Math.min(1, t * 6) * Math.pow(1 - t, 2);
                data[i] = (Math.random() * 2 - 1) * envelope;
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.value = 0.8;
            filter.frequency.setValueAtTime(from, startAt);
            filter.frequency.exponentialRampToValueAtTime(to, startAt + duration);
            const g = ctx.createGain();
            g.gain.value = level;
            source.connect(filter);
            filter.connect(g);
            g.connect(ctx.destination);
            source.start(startAt);
        };

        const now = ctx.currentTime;
        swish(now, 0.22, 900, 3500, this.volume * 1.0);
        swish(now + 0.16, 0.18, 1400, 4500, this.volume * 0.6);
    }

    // Door opening: a metal latch click
    playDoor() {
        if (!this.enabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        this.playNoise(now, 0.03, 'highpass', 2500, this.volume * 0.35);
        this.playNoise(now + 0.05, 0.025, 'highpass', 3200, this.volume * 0.2);
    }

    // Door closing: the soft wooden thud, a low tone dropping in pitch plus muffled noise
    playDoorClose() {
        if (!this.enabled || !this.audioContext) return;

        const ctx = this.audioContext;
        const thudAt = ctx.currentTime + 0.25;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, thudAt);
        osc.frequency.exponentialRampToValueAtTime(55, thudAt + 0.18);
        g.gain.setValueAtTime(0.0001, thudAt);
        g.gain.exponentialRampToValueAtTime(this.volume * 0.5, thudAt + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, thudAt + 0.25);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(thudAt);
        osc.stop(thudAt + 0.3);

        this.playNoise(thudAt, 0.12, 'lowpass', 400, this.volume * 0.5);
    }

    // Button click
    playClick() {
        this.playTone(800, 0.05, 'square', 0.12);
    }

    // Ambient courtroom (low drone)
    startAmbient() {
        if (!this.enabled || !this.audioContext || this.ambientOscillator) return;

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

    // Turn all sound on or off (the setting the player chose)
    setEnabled(on) {
        this.enabled = Boolean(on) && Boolean(this.audioContext);
        if (!this.enabled) this.stopAmbient();
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
