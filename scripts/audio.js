/**
 * Audio Module
 * Handles sound effects (Web Audio API based)
 */

// Vowel resonances (formants, Hz) of Turkish vowels for a man's voice
const VOWEL_FORMANTS = {
    a: [730, 1090, 2440], e: [530, 1840, 2480], 'ı': [400, 1400, 2500], i: [270, 2290, 3010],
    o: [570, 840, 2410], 'ö': [450, 1550, 2400], u: [300, 870, 2240], 'ü': [280, 1750, 2200],
};
const VOICE_LEVEL = 0.35;

// Recorded sounds in public/audio (licences in AUDIO_CREDITS.md)
const SAMPLE_FILES = ['gavel', 'page', 'book', 'door', 'chime', 'sting', 'gasp', 'hall', 'court'];
const AMBIENT_LEVEL = 1;
// The courtroom murmur is two recordings looped together: a seated crowd waiting in
// a large hall (3 minutes; the door closing at its end is left out of the loop) and,
// much quieter underneath, the movement of a courtroom. Their lengths differ, so the
// mix rarely repeats.
const AMBIENT_LAYERS = [
    { name: 'hall', level: 0.3, loopStart: 2, loopEnd: 168 },
    { name: 'court', level: 0.1, loopStart: 0.5, loopEnd: 78.5 },
];

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.5;
        this.samples = {};
        // The courtroom murmur has its own switch and level, apart from the effects
        this.ambienceOn = true;
        this.ambienceVolume = 0.5;
        this.ambienceWanted = false; // the courtroom is open, so the murmur should play
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
            return;
        }
        this.loadSamples();
    }

    // Recorded sounds in /audio (see AUDIO_CREDITS.md). Until they are
    // loaded, or if one fails, the synthesized sounds below are used instead.
    async loadSamples() {
        await Promise.all(SAMPLE_FILES.map(async (name) => {
            try {
                const response = await fetch(new URL(`audio/${name}.mp3`, document.baseURI));
                if (!response.ok) return;
                this.samples[name] = await this.audioContext.decodeAudioData(await response.arrayBuffer());
            } catch {
                // keep the synthesized fallback
            }
        }));
        // The recorded murmur replaces the drone if the courtroom is already open
        if (this.ambientOscillator) {
            this.stopAmbientSound();
            this.startAmbient();
        }
    }

    // Plays part of a recorded sound; false when it is not loaded (use the fallback)
    playSample(name, { offset = 0, duration, gain = 1 } = {}) {
        const buffer = this.samples[name];
        if (!buffer) return false;
        if (!this.enabled || !this.audioContext) return true; // sound is off: nothing to play
        const ctx = this.audioContext;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const level = ctx.createGain();
        const length = duration ?? buffer.duration - offset;
        const now = ctx.currentTime;
        level.gain.setValueAtTime(this.volume * gain, now);
        level.gain.setValueAtTime(this.volume * gain, now + Math.max(0, length - 0.08));
        level.gain.linearRampToValueAtTime(0.0001, now + length);
        source.connect(level);
        level.connect(ctx.destination);
        source.start(now, offset, length);
        return true;
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
        if (this.playSample('gavel', { duration: 0.9, gain: 0.9 })) return; // first of the two strikes

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
        if (this.playSample('chime', { gain: 1.4 })) return;

        setTimeout(() => this.playTone(523.25, 0.1, 'sine'), 0);    // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 100);  // E5
        setTimeout(() => this.playTone(783.99, 0.15, 'sine'), 200); // G5
    }

    // Negative feedback sound
    playFailure() {
        if (!this.enabled) return;
        if (this.playSample('sting', { gain: 0.6 })) return;

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
    // Opening the law book: a heavy cover opens and the pages settle. The recording
    // opens and closes a large book several times; this is one opening (14.1 s).
    playBookOpen() {
        if (this.playSample('book', { offset: 13.85, duration: 1.1, gain: 0.8 })) return;
        this.playPageTurn();
    }

    playPageTurn() {
        if (this.playSample('page', { gain: 0.7 })) return;
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
        if (this.playSample('door', { duration: 1.6, gain: 0.7 })) return; // latch and creak
        if (!this.enabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        this.playNoise(now, 0.03, 'highpass', 2500, this.volume * 0.35);
        this.playNoise(now + 0.05, 0.025, 'highpass', 3200, this.volume * 0.2);
    }

    // Door closing: the soft wooden thud, a low tone dropping in pitch plus muffled noise
    playDoorClose() {
        // The recording slams shut at 3.82 s (0.62 s in, with the animation's hit) and
        // bangs again at 5.7 s; it is cut before that second bang
        if (this.playSample('door', { offset: 3.2, duration: 1.2, gain: 0.7 })) return;
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
    // A gasp from the gallery (death sentences)
    playGasp() {
        this.playSample('gasp', { gain: 0.5 });
    }

    startAmbient() {
        this.ambienceWanted = true;
        if (!this.enabled || !this.ambienceOn || !this.audioContext || this.ambientOscillator) return;

        // Recorded courtroom murmur: the layers loop together and fade in
        const layers = AMBIENT_LAYERS.filter(l => this.samples[l.name]);
        if (layers.length) {
            const ctx = this.audioContext;
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.ambienceVolume * AMBIENT_LEVEL, ctx.currentTime + 2);
            gainNode.connect(ctx.destination);
            const sources = layers.map(l => {
                const source = ctx.createBufferSource();
                source.buffer = this.samples[l.name];
                source.loop = true;
                source.loopStart = l.loopStart;
                source.loopEnd = Math.min(l.loopEnd, source.buffer.duration);
                const level = ctx.createGain();
                level.gain.value = l.level;
                source.connect(level);
                level.connect(gainNode);
                // start somewhere inside the loop, so it does not always begin the same way
                source.start(0, l.loopStart + Math.random() * (source.loopEnd - l.loopStart));
                return source;
            });
            this.ambientOscillator = { stop: () => sources.forEach(s => s.stop()) };
            this.ambientGain = gainNode;
            return;
        }

        // Very subtle ambient drone
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = 60;
        gainNode.gain.value = this.ambienceVolume * 0.02;
        oscillator.droneOnly = true;

        oscillator.start();

        this.ambientOscillator = oscillator;
        this.ambientGain = gainNode;
    }

    stopAmbient() {
        this.ambienceWanted = false;
        this.stopAmbientSound();
    }

    stopAmbientSound() {
        if (this.ambientOscillator) {
            this.ambientOscillator.stop();
            this.ambientOscillator = null;
        }
    }

    // Courtroom murmur switch and level (Settings)
    setAmbience(on, volume) {
        this.ambienceOn = Boolean(on);
        this.ambienceVolume = Math.max(0, Math.min(1, volume));
        if (this.ambientGain && this.ambientOscillator) {
            this.ambientGain.gain.value = this.ambienceVolume * (this.ambientOscillator.droneOnly ? 0.02 : AMBIENT_LEVEL);
        }
        if (!this.ambienceOn) this.stopAmbientSound();
        else if (this.ambienceWanted) this.startAmbient();
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    // Defendant's murmur: called for every letter as the statement is typed (30 ms
    // apart). Each vowel becomes a muffled syllable shaped like that vowel, so the
    // babble follows the sentence; lower voice for men, higher for women, and a
    // child's voice for defendants under 18.
    speakLetter(text, index, gender, age) {
        if (!this.enabled || !this.audioContext) return;
        const lower = text.toLocaleLowerCase('tr');
        const formants = VOWEL_FORMANTS[lower[index]];
        if (!formants) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const female = gender === 'f';
        const child = age < 18;
        let next = index + 1;
        while (next < lower.length && !VOWEL_FORMANTS[lower[next]]) next++;
        const length = Math.min(0.14, Math.max(0.07, (next - index) * 0.03));
        const endOfWord = !/\p{L}/u.test(lower[index + 1] || ' ');
        const progress = index / Math.max(1, lower.length - 1);

        // Sentence melody: slowly falling, rising at the end of a question
        const basePitch = child ? (female ? 300 : 265) : (female ? 215 : 112);
        let pitch = basePitch * (1.08 - 0.16 * progress) * (0.95 + Math.random() * 0.1);
        if (lower.trim().endsWith('?') && progress > 0.85) pitch *= 1.25;

        if (!this.voiceWave) {
            const real = new Float32Array(40);
            const imag = new Float32Array(40);
            for (let k = 1; k < 40; k++) imag[k] = 1 / Math.pow(k, 1.5);
            this.voiceWave = ctx.createPeriodicWave(real, imag);
        }
        const osc = ctx.createOscillator();
        osc.setPeriodicWave(this.voiceWave);
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.linearRampToValueAtTime(pitch * (endOfWord ? 0.9 : 1.02), now + length);

        const envelope = ctx.createGain();
        envelope.gain.setValueAtTime(0.0001, now);
        envelope.gain.exponentialRampToValueAtTime(1, now + 0.015);
        envelope.gain.setValueAtTime(1, now + length * 0.6);
        envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
        osc.connect(envelope);

        // Mouth shape: three vowel resonances, then muffled as if through a wall
        const muffle = ctx.createBiquadFilter();
        muffle.type = 'lowpass';
        muffle.frequency.value = 1300;
        muffle.Q.value = 0.5;
        const scale = child ? 1.3 : female ? 1.17 : 1;
        [[0, 1, 80], [1, 0.5, 100], [2, 0.25, 140]].forEach(([n, level, width]) => {
            const f = formants[n] * scale;
            const band = ctx.createBiquadFilter();
            band.type = 'bandpass';
            band.frequency.value = f;
            band.Q.value = f / width;
            const gain = ctx.createGain();
            gain.gain.value = level * (f / width) * 0.35;
            envelope.connect(band);
            band.connect(gain);
            gain.connect(muffle);
        });

        const out = ctx.createGain();
        out.gain.value = this.volume * VOICE_LEVEL;
        muffle.connect(out);
        out.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + length + 0.02);
    }

    // A slow, low bell for a death sentence
    playToll() {
        if (!this.enabled || !this.audioContext) return;
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        [[98, 1], [196, 0.45], [293.7, 0.25], [415, 0.12]].forEach(([freq, level]) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(this.volume * 0.35 * level, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 3.3);
        });
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
