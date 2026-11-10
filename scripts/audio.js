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

    // Page turn: the crinkle of paper lifting, a short swoosh through the air,
    // and the soft flap of the page landing
    playPageTurn() {
        if (!this.enabled || !this.audioContext) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Plays a noise buffer shaped by `sample(t)` (t: 0..1) through a chain of filters
        const layer = (startAt, duration, sample, filters, level) => {
            const length = Math.floor(ctx.sampleRate * duration);
            const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < length; i++) data[i] = sample(i / length);

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            let node = source;
            for (const [type, frequency, q = 0.7] of filters) {
                const f = ctx.createBiquadFilter();
                f.type = type;
                f.frequency.value = frequency;
                f.Q.value = q;
                node.connect(f);
                node = f;
            }
            const g = ctx.createGain();
            g.gain.value = level;
            node.connect(g);
            g.connect(ctx.destination);
            source.start(startAt);
        };
        const noise = () => Math.random() * 2 - 1;

        // 1. Crinkle: grainy bursts, strongest as the page lifts
        layer(now, 0.26, (t) => {
            const envelope = Math.min(1, t * 8) * Math.pow(1 - t, 1.5);
            const grain = Math.random() < 0.12 ? 1 : 0.18;
            return noise() * grain * envelope;
        }, [['highpass', 2200], ['lowpass', 9000]], this.volume * 0.55);

        // 2. Swoosh: smooth air as the page turns over
        layer(now + 0.05, 0.22, (t) => noise() * Math.sin(Math.PI * t), [['bandpass', 3000, 0.6]], this.volume * 0.25);

        // 3. Flap: the page settles on the others
        layer(now + 0.27, 0.06, (t) => noise() * Math.pow(1 - t, 3), [['lowpass', 900]], this.volume * 0.5);
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

    // One "bıdı" syllable of a speaking defendant: a short voiced blip through a
    // vowel-like filter, higher for women, lower for men
    playBlip(gender) {
        if (!this.enabled || !this.audioContext) return;
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const female = gender === 'f';
        const pitch = (female ? 240 : 115) * (0.88 + Math.random() * 0.28);
        const length = 0.055 + Math.random() * 0.035;

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.linearRampToValueAtTime(pitch * (0.9 + Math.random() * 0.2), now + length);

        const formant = ctx.createBiquadFilter();
        formant.type = 'bandpass';
        formant.frequency.value = (female ? 900 : 650) + Math.random() * 600;
        formant.Q.value = 2.5;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(this.volume * 0.55, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + length);

        osc.connect(formant);
        formant.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + length + 0.02);
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
