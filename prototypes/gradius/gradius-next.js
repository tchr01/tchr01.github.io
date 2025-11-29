// GradiusNext - EDM Synth & Drums with MIDI Support
class GradiusNext {
    constructor() {
        // Audio Context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Ensure audio context is resumed (required for mobile web)
        const resumeAudio = () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('AudioContext resumed');
                });
            }
            // Remove listeners after first resume
            document.removeEventListener('touchstart', resumeAudio);
            document.removeEventListener('click', resumeAudio);
        };
        document.addEventListener('touchstart', resumeAudio, { once: true });
        document.addEventListener('click', resumeAudio, { once: true });

        // Audio nodes
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.7;
        this.masterGain.connect(this.audioContext.destination);

        // Analyser for visualization
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.connect(this.masterGain);

        // Mixer - separate channels for drums and synth
        this.drumMixer = this.audioContext.createGain();
        this.drumMixer.gain.value = 0.5; // Default 50% drums
        this.drumMixer.connect(this.analyser);

        this.synthMixer = this.audioContext.createGain();
        this.synthMixer.gain.value = 0.3; // Default 30% synth
        this.synthMixer.connect(this.analyser);

        // Lead voice volume control (independent gain stage for LEAD voice notes)
        this.leadVolumeGain = this.audioContext.createGain();
        this.leadVolumeGain.gain.value = 0.49; // Match initial 70% slider with exponential curve: 0.7^2 ≈ 0.49

        // Separate effects chains
        this.drumDelay = { node: null, feedback: null, wet: null, dry: null };
        this.synthDelay = { node: null, feedback: null, wet: null, dry: null };
        this.drumDelaySavedMix = 0.3; // Save mix value when toggling on
        this.synthDelaySavedMix = 0.5; // Save mix value when toggling on

        // Phaser effect
        this.phaser = {
            delay: null,        // DelayNode for phaser effect
            lfo: null,          // OscillatorNode for LFO
            lfoGain: null,      // GainNode to control LFO depth
            feedback: null,     // GainNode for feedback
            wet: null,          // GainNode for wet signal
            dry: null           // GainNode for dry signal
        };
        this.phaserSpeed = 0; // 0-10 Hz LFO speed (0 = OFF, default OFF)

        // Master reverb (affects entire mix)
        this.masterReverb = {
            convolver: null,    // ConvolverNode for reverb
            wet: null,          // GainNode for wet signal
            dry: null           // GainNode for dry signal
        };

        this.setupDelayChains();

        // Synth settings
        this.currentOctave = 4;
        this.pitchBendValue = 0;
        this.waveformType = 'triangle'; // sine, sawtooth, square, triangle (pwm uses special handling)
        this.shapeValue = 4; // 0-4 (sine, saw, square, tri, pwm) - default to PWM

        // Synth voice presets
        this.synthVoices = {
            'lead': {
                name: 'LEAD',
                waveform: 'sawtooth',
                attack: 0.01,
                decay: 0.1,
                sustain: 0.7,
                release: 0.2,
                volume: 0.3,
                icon: '🎸'
            },
            'bass': {
                name: 'BASS',
                waveform: 'sawtooth',
                attack: 0.01,
                decay: 0.15,
                sustain: 0.5,
                release: 0.1,
                volume: 0.4,
                icon: '🔊'
            },
            'pad': {
                name: 'PAD',
                waveform: 'triangle',
                attack: 0.3,
                decay: 0.2,
                sustain: 0.8,
                release: 0.5,
                volume: 0.2,
                icon: '☁️'
            },
            'pluck': {
                name: 'PLUCK',
                waveform: 'square',
                attack: 0.001,
                decay: 0.3,
                sustain: 0.0,
                release: 0.1,
                volume: 0.35,
                icon: '🎹'
            },
            'organ': {
                name: 'ORGAN',
                waveform: 'sine',
                attack: 0.02,
                decay: 0.05,
                sustain: 0.9,
                release: 0.1,
                volume: 0.25,
                icon: '🎺'
            },
            'bell': {
                name: 'BELL',
                waveform: 'sine',
                attack: 0.001,
                decay: 0.5,
                sustain: 0.2,
                release: 0.8,
                volume: 0.3,
                icon: '🔔'
            }
        };
        this.currentVoice = 'lead';

        // Arpeggiator settings
        this.arpEnabled = false;
        this.arpPattern = 'up'; // up, down, updown, random
        this.arpSpeed = 150; // ms between notes
        this.arpNotes = [];
        this.arpInterval = null;
        this.arpIndex = 0;
        this.arpScale = 'major-pent'; // major-pent, minor-pent, minor-triad

        // Arpeggio scale patterns (semitone intervals from root) - 4 notes
        this.arpScales = {
            'major-pent': [0, 4, 7, 12],      // Major pentatonic: bright, uplifting
            'minor-pent': [0, 3, 5, 10],      // Minor pentatonic: dark, moody
            'minor-triad': [0, 3, 7, 12]      // Minor triad: deep, hypnotic
        };

        // Sustain amount
        this.sustainAmount = 0; // 0-100% - extends release time

        // Active notes tracking
        this.activeNotes = new Map(); // MIDI note number -> {osc, gain}
        this.heldKeys = new Set(); // Track which keys are held

        // Drum samples
        this.drumBuffers = {};
        this.trapDrumBuffers = {};
        this.currentDrumSet = 'edm'; // 'edm' or 'trap'
        this.loadingDrums = false;

        // Sound effects mode
        this.sfxMode = false; // false = synth, true = sound effects
        this.sfxBuffers = {};

        // CC button tracking
        this.lastModValue = 0; // Track last CC1 value for button press detection
        this.lastCC64Value = 0; // Track last CC64 value for octave switching

        // MIDI
        this.midiAccess = null;
        this.midiInputs = [];

        // Sequencer
        this.sequencerPlaying = false;
        this.currentStep = 0;
        this.bpm = 147;
        this.sequencerInterval = null;
        this.sequencerGrid = this.createEmptySequencer();

        // Secondary synth sequencer settings
        this.synthSeqDelay = 0.3;
        this.synthSeqSustain = 50; // 0-100%
        this.synthSeqShape = 4; // 0-4 (same as main synth) - default PWM

        // UI Mode
        this.currentMode = 'live'; // 'live' or 'sequencer'

        // Initialize
        this.init();
    }

    async init() {
        this.setupUI();
        await this.loadDrumSamples();
        await this.loadTrapDrumSamples();
        await this.loadSoundEffects();
        await this.initMIDI();
        this.setupKeyboard();
        this.startVisualization();

        console.log('GradiusNext initialized!');
    }

    // ===== AUDIO SETUP =====
    setupDelayChains() {
        // Create DRUM delay chain
        this.drumDelay.node = this.audioContext.createDelay(2.0);
        this.drumDelay.node.delayTime.value = 0.3; // 300ms

        this.drumDelay.feedback = this.audioContext.createGain();
        this.drumDelay.feedback.gain.value = 0.5; // 50% feedback

        this.drumDelay.wet = this.audioContext.createGain();
        this.drumDelay.wet.gain.value = 0; // OFF by default

        this.drumDelay.dry = this.audioContext.createGain();
        this.drumDelay.dry.gain.value = 1; // 100% dry when delay is off

        // Connect drum delay chain
        this.drumDelay.node.connect(this.drumDelay.feedback);
        this.drumDelay.feedback.connect(this.drumDelay.node);
        this.drumDelay.node.connect(this.drumDelay.wet);
        this.drumDelay.wet.connect(this.drumMixer);
        this.drumDelay.dry.connect(this.drumMixer);

        // Create SYNTH delay chain
        this.synthDelay.node = this.audioContext.createDelay(2.0);
        this.synthDelay.node.delayTime.value = 0.35; // 350ms default

        this.synthDelay.feedback = this.audioContext.createGain();
        this.synthDelay.feedback.gain.value = 0.65; // 65% feedback default

        this.synthDelay.wet = this.audioContext.createGain();
        this.synthDelay.wet.gain.value = 0; // OFF by default

        this.synthDelay.dry = this.audioContext.createGain();
        this.synthDelay.dry.gain.value = 1; // 100% dry when delay is off

        // Connect synth delay chain
        this.synthDelay.node.connect(this.synthDelay.feedback);
        this.synthDelay.feedback.connect(this.synthDelay.node);
        this.synthDelay.node.connect(this.synthDelay.wet);
        this.synthDelay.wet.connect(this.synthMixer);
        this.synthDelay.dry.connect(this.synthMixer);

        // Create PHASER chain (DRAMATIC SWEEPING)
        this.phaser.delay = this.audioContext.createDelay(0.04); // 40ms max delay for wider sweeps
        this.phaser.delay.delayTime.value = 0.008; // 8ms base delay

        this.phaser.lfo = this.audioContext.createOscillator();
        this.phaser.lfo.frequency.value = 0.5; // 0.5 Hz default LFO rate

        this.phaser.lfoGain = this.audioContext.createGain();
        this.phaser.lfoGain.gain.value = 0.015; // 15ms depth (dramatic sweeping effect)

        this.phaser.feedback = this.audioContext.createGain();
        this.phaser.feedback.gain.value = 0.7; // 70% feedback for strong resonance

        this.phaser.wet = this.audioContext.createGain();
        this.phaser.wet.gain.value = 0; // OFF by default

        this.phaser.dry = this.audioContext.createGain();
        this.phaser.dry.gain.value = 1.0; // 100% dry (OFF by default)

        // Connect phaser chain
        this.phaser.lfo.connect(this.phaser.lfoGain);
        this.phaser.lfoGain.connect(this.phaser.delay.delayTime);
        this.phaser.delay.connect(this.phaser.feedback);
        this.phaser.feedback.connect(this.phaser.delay);

        // Connect phaser output to existing delay chain
        this.phaser.delay.connect(this.phaser.wet);
        this.phaser.wet.connect(this.synthDelay.node);
        this.phaser.wet.connect(this.synthDelay.dry);
        this.phaser.dry.connect(this.synthDelay.node);
        this.phaser.dry.connect(this.synthDelay.dry);

        // Create pre-effects routing stage for proper signal flow
        this.synthPreEffects = this.audioContext.createGain();
        this.synthPreEffects.gain.value = 1.0;

        // Connect pre-effects to phaser input
        this.synthPreEffects.connect(this.phaser.delay);
        this.synthPreEffects.connect(this.phaser.dry);

        // Connect leadVolumeGain to pre-effects stage (so LEAD volume comes before effects)
        this.leadVolumeGain.connect(this.synthPreEffects);

        // Create MASTER REVERB - affects entire mix
        this.masterReverb.convolver = this.audioContext.createConvolver();
        this.masterReverb.wet = this.audioContext.createGain();
        this.masterReverb.dry = this.audioContext.createGain();

        // Generate room reverb impulse response (2 second decay room)
        const reverbLength = this.audioContext.sampleRate * 2; // 2 seconds
        const impulse = this.audioContext.createBuffer(2, reverbLength, this.audioContext.sampleRate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);

        for (let i = 0; i < reverbLength; i++) {
            const decay = Math.pow(1 - i / reverbLength, 3); // Exponential decay curve
            impulseL[i] = (Math.random() * 2 - 1) * decay;
            impulseR[i] = (Math.random() * 2 - 1) * decay;
        }

        this.masterReverb.convolver.buffer = impulse;

        // Default: 30% wet reverb, 70% dry signal
        this.masterReverb.wet.gain.value = 0.3;
        this.masterReverb.dry.gain.value = 0.7;

        // Reroute analyser output through master reverb
        this.analyser.disconnect(); // Disconnect from masterGain
        this.analyser.connect(this.masterReverb.convolver);
        this.analyser.connect(this.masterReverb.dry);
        this.masterReverb.convolver.connect(this.masterReverb.wet);
        this.masterReverb.wet.connect(this.masterGain);
        this.masterReverb.dry.connect(this.masterGain);

        // Start LFO
        this.phaser.lfo.start();
    }

    getDrumDestination() {
        // Return drum audio destination
        return this.drumDelay.node;
    }

    getSynthDestination() {
        // Return synth audio destination (routes through phaser first, then delay)
        return this.phaser.delay;
    }

    // ===== DRUM SAMPLES =====
    async loadDrumSamples() {
        this.loadingDrums = true;

        // Generate synthetic EDM drum sounds using Web Audio API
        // This avoids needing external sample files

        const sampleRate = this.audioContext.sampleRate;

        // KICK: Deep 808-style kick
        this.drumBuffers.kick = this.generateKick(sampleRate);

        // SNARE: Punchy snare with noise
        this.drumBuffers.snare = this.generateSnare(sampleRate);

        // HI-HAT CLOSED: Short metallic sound
        this.drumBuffers['hihat-closed'] = this.generateHiHat(sampleRate, false);

        // HI-HAT OPEN: Longer metallic sound
        this.drumBuffers['hihat-open'] = this.generateHiHat(sampleRate, true);

        // CLAP: Hand clap sound
        this.drumBuffers.clap = this.generateClap(sampleRate);

        // TOM: Mid-frequency tom
        this.drumBuffers.tom = this.generateTom(sampleRate);

        // CRASH: Long cymbal crash
        this.drumBuffers.crash = this.generateCrash(sampleRate);

        // RIM: Rimshot
        this.drumBuffers.rim = this.generateRim(sampleRate);

        this.loadingDrums = false;
        console.log('Drum samples loaded!');
    }

    generateKick(sampleRate) {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Frequency sweep from 150Hz to 40Hz
            const freq = 150 * Math.exp(-t * 8);
            // Exponential decay
            const env = Math.exp(-t * 6);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env;
        }

        return buffer;
    }

    generateSnare(sampleRate) {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Sine component (body)
            const body = Math.sin(2 * Math.PI * 180 * t) * 0.3;
            // Noise component (snare)
            const noise = (Math.random() * 2 - 1) * 0.7;
            // Exponential decay
            const env = Math.exp(-t * 15);
            data[i] = (body + noise) * env;
        }

        return buffer;
    }

    generateHiHat(sampleRate, open) {
        const duration = open ? 0.3 : 0.05;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // High-frequency filtered noise
            const noise = (Math.random() * 2 - 1);
            // Bandpass filter simulation
            const filtered = noise * Math.sin(2 * Math.PI * 8000 * t);
            // Exponential decay
            const env = Math.exp(-t * (open ? 8 : 50));
            data[i] = filtered * env * 0.4;
        }

        return buffer;
    }

    generateClap(sampleRate) {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Multiple short bursts for clap effect
        const claps = [0, 0.01, 0.02, 0.03];

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let signal = 0;

            claps.forEach(clapTime => {
                if (t >= clapTime) {
                    const localT = t - clapTime;
                    const noise = (Math.random() * 2 - 1);
                    const env = Math.exp(-localT * 40);
                    signal += noise * env;
                }
            });

            data[i] = signal * 0.5;
        }

        return buffer;
    }

    generateTom(sampleRate) {
        const duration = 0.4;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Frequency sweep
            const freq = 200 * Math.exp(-t * 5);
            const env = Math.exp(-t * 8);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env;
        }

        return buffer;
    }

    generateCrash(sampleRate) {
        const duration = 1.5;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // High-frequency complex noise
            const noise = (Math.random() * 2 - 1);
            const filtered = noise * (Math.sin(2 * Math.PI * 5000 * t) + Math.sin(2 * Math.PI * 7000 * t)) * 0.5;
            const env = Math.exp(-t * 2);
            data[i] = filtered * env * 0.3;
        }

        return buffer;
    }

    generateRim(sampleRate) {
        const duration = 0.1;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Short, sharp click
            const click = Math.sin(2 * Math.PI * 1000 * t);
            const env = Math.exp(-t * 80);
            data[i] = click * env;
        }

        return buffer;
    }

    // ===== TRAP DRUM SOUNDS =====
    async loadTrapDrumSamples() {
        const sampleRate = this.audioContext.sampleRate;

        // TRAP KICK: Punchy, shorter attack
        this.trapDrumBuffers.kick = this.generateTrapKick(sampleRate);

        // TRAP SNARE: Crispy, higher pitched
        this.trapDrumBuffers.snare = this.generateTrapSnare(sampleRate);

        // TRAP HI-HAT CLOSED: Tighter, faster decay
        this.trapDrumBuffers['hihat-closed'] = this.generateTrapHiHat(sampleRate, false);

        // TRAP HI-HAT OPEN: Medium duration
        this.trapDrumBuffers['hihat-open'] = this.generateTrapHiHat(sampleRate, true);

        // TRAP CLAP: Sharper clap
        this.trapDrumBuffers.clap = this.generateTrapClap(sampleRate);

        // TRAP TOM: Higher pitch tom
        this.trapDrumBuffers.tom = this.generateTrapTom(sampleRate);

        // TRAP CRASH: Similar crash
        this.trapDrumBuffers.crash = this.generateTrapCrash(sampleRate);

        // TRAP RIM: Sharper, more defined
        this.trapDrumBuffers.rim = this.generateTrapRim(sampleRate);

        console.log('Trap drum samples loaded!');
    }

    generateTrapKick(sampleRate) {
        const duration = 0.22; // Much shorter - punchy trap style
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Much higher pitch sweep from 220Hz to 35Hz - bright attack
            const freq = 220 * Math.exp(-t * 18);
            // Very fast decay for punch
            const env = Math.exp(-t * 14);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 1.2;
        }

        return buffer;
    }

    generateTrapSnare(sampleRate) {
        const duration = 0.14; // Shorter and crisper
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Much higher pitched sine (trap snares are VERY bright)
            const body = Math.sin(2 * Math.PI * 300 * t) * 0.3;
            // Heavy noise component for sharp, crispy sound
            const noise = (Math.random() * 2 - 1) * 0.9;
            // Very fast decay for sharpness
            const env = Math.exp(-t * 25);
            data[i] = (body + noise) * env * 1.15;
        }

        return buffer;
    }

    generateTrapHiHat(sampleRate, open) {
        const duration = open ? 0.2 : 0.025; // Much tighter closed hat, shorter open
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Very high-frequency noise for brightness
            const noise = (Math.random() * 2 - 1);
            // Much brighter filter frequency
            const filtered = noise * Math.sin(2 * Math.PI * 12000 * t);
            // Extremely fast decay - trap hats are tight
            const env = Math.exp(-t * (open ? 18 : 100));
            data[i] = filtered * env * 0.5;
        }

        return buffer;
    }

    generateTrapClap(sampleRate) {
        const duration = 0.1; // Shorter trap clap
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // More aggressive, tighter claps with sharper decay
        const claps = [0, 0.005, 0.01, 0.015];

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let signal = 0;

            claps.forEach(clapTime => {
                if (t >= clapTime) {
                    const localT = t - clapTime;
                    const noise = (Math.random() * 2 - 1);
                    const env = Math.exp(-localT * 65); // Sharper decay
                    signal += noise * env;
                }
            });

            data[i] = signal * 0.7;
        }

        return buffer;
    }

    generateTrapTom(sampleRate) {
        const duration = 0.28; // Shorter for trap tempo
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Much higher frequency sweep for trap - bright and punchy
            const freq = 320 * Math.exp(-t * 10);
            const env = Math.exp(-t * 12);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 1.15;
        }

        return buffer;
    }

    generateTrapCrash(sampleRate) {
        const duration = 1.0; // Shorter crash for trap
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Much brighter, higher frequencies for trap brightness
            const noise = (Math.random() * 2 - 1);
            const filtered = noise * (Math.sin(2 * Math.PI * 8000 * t) + Math.sin(2 * Math.PI * 10000 * t)) * 0.5;
            const env = Math.exp(-t * 3);
            data[i] = filtered * env * 0.4;
        }

        return buffer;
    }

    generateTrapRim(sampleRate) {
        const duration = 0.06; // Shorter, snappier
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Much higher pitched, sharper click
            const click = Math.sin(2 * Math.PI * 1600 * t);
            const env = Math.exp(-t * 130);
            data[i] = click * env * 1.3;
        }

        return buffer;
    }

    playDrum(drumName) {
        // Select buffer from current drum set
        const buffers = this.currentDrumSet === 'trap' ? this.trapDrumBuffers : this.drumBuffers;
        if (!buffers[drumName]) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = buffers[drumName];

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.8;

        source.connect(gain);

        // Route through drum delay chain
        gain.connect(this.drumDelay.node);
        gain.connect(this.drumDelay.dry);

        source.start(0);

        // Visual feedback
        const pad = document.querySelector(`[data-sound="${drumName}"]`);
        if (pad) {
            pad.classList.add('playing');
            setTimeout(() => pad.classList.remove('playing'), 150);
        }
    }

    // ===== SOUND EFFECTS =====
    async loadSoundEffects() {
        const sampleRate = this.audioContext.sampleRate;

        // Map MIDI notes to SFX (24 keys = 2 octaves)
        this.sfxBuffers[48] = this.generateLaser(sampleRate);      // C3
        this.sfxBuffers[49] = this.generateLaserDown(sampleRate);  // C#3
        this.sfxBuffers[50] = this.generateExplosion(sampleRate);  // D3
        this.sfxBuffers[51] = this.generateExplosion2(sampleRate); // D#3
        this.sfxBuffers[52] = this.generatePowerUp(sampleRate);    // E3
        this.sfxBuffers[53] = this.generatePowerDown(sampleRate);  // F3
        this.sfxBuffers[54] = this.generateRobot(sampleRate);      // F#3
        this.sfxBuffers[55] = this.generateRobot2(sampleRate);     // G3
        this.sfxBuffers[56] = this.generateSiren(sampleRate);      // G#3
        this.sfxBuffers[57] = this.generateAlarm(sampleRate);      // A3
        this.sfxBuffers[58] = this.generateJump(sampleRate);       // A#3
        this.sfxBuffers[59] = this.generateCoin(sampleRate);       // B3
        // Octave 4
        this.sfxBuffers[60] = this.generateBlip(sampleRate);       // C4
        this.sfxBuffers[61] = this.generateBloop(sampleRate);      // C#4
        this.sfxBuffers[62] = this.generateZap(sampleRate);        // D4
        this.sfxBuffers[63] = this.generateBeep(sampleRate);       // D#4
        this.sfxBuffers[64] = this.generateWhoosh(sampleRate);     // E4
        this.sfxBuffers[65] = this.generateHit(sampleRate);        // F4
        this.sfxBuffers[66] = this.generateShield(sampleRate);     // F#4
        this.sfxBuffers[67] = this.generateTeleport(sampleRate);   // G4
        this.sfxBuffers[68] = this.generateGlitch(sampleRate);     // G#4
        this.sfxBuffers[69] = this.generatePulse(sampleRate);      // A4
        this.sfxBuffers[70] = this.generateChirp(sampleRate);      // A#4
        this.sfxBuffers[71] = this.generateBuzz(sampleRate);       // B4

        // Octave 5 - DJ Effects
        this.sfxBuffers[72] = this.generateAirHorn(sampleRate);         // C5
        this.sfxBuffers[73] = this.generateBassDrop(sampleRate);        // C#5
        this.sfxBuffers[74] = this.generateImpactHit(sampleRate);       // D5
        this.sfxBuffers[75] = this.generateReverseCymbal(sampleRate);   // D#5
        this.sfxBuffers[76] = this.generateVocalHey(sampleRate);        // E5
        this.sfxBuffers[77] = this.generateVocalOh(sampleRate);         // F5
        this.sfxBuffers[78] = this.generateVocalYeah(sampleRate);       // F#5
        this.sfxBuffers[79] = this.generateVocalChop(sampleRate);       // G5
        this.sfxBuffers[80] = this.generateScratchForward(sampleRate);  // G#5
        this.sfxBuffers[81] = this.generateScratchBackward(sampleRate); // A5
        this.sfxBuffers[82] = this.generateTransformerScratch(sampleRate); // A#5
        this.sfxBuffers[83] = this.generateRiser(sampleRate);           // B5

        console.log('Sound effects loaded (36 total: 24 classic + 12 DJ effects)!');
    }

    // SFX Generators (Casio-style classic keyboard sounds)
    generateLaser(sampleRate) {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 1200 - t * 3000;
            const env = Math.exp(-t * 8);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env;
        }
        return buffer;
    }

    generateLaserDown(sampleRate) {
        const duration = 0.4;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 400 + t * 800;
            const env = Math.exp(-t * 5);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env;
        }
        return buffer;
    }

    generateExplosion(sampleRate) {
        const duration = 0.8;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const noise = (Math.random() * 2 - 1);
            const rumble = Math.sin(2 * Math.PI * 40 * t);
            const env = Math.exp(-t * 3);
            data[i] = (noise * 0.7 + rumble * 0.3) * env;
        }
        return buffer;
    }

    generateExplosion2(sampleRate) {
        const duration = 0.6;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 200 * Math.exp(-t * 10);
            const noise = (Math.random() * 2 - 1) * 0.5;
            const tone = Math.sin(2 * Math.PI * freq * t) * 0.5;
            const env = Math.exp(-t * 4);
            data[i] = (noise + tone) * env;
        }
        return buffer;
    }

    generatePowerUp(sampleRate) {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 200 + t * 800;
            const env = 1 - t * 2;
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.5;
        }
        return buffer;
    }

    generatePowerDown(sampleRate) {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 800 - t * 600;
            const env = 1 - t * 2;
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.5;
        }
        return buffer;
    }

    generateRobot(sampleRate) {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 300 + Math.sin(t * 50) * 100;
            const env = Math.exp(-t * 10);
            data[i] = (Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1) * env * 0.3;
        }
        return buffer;
    }

    generateRobot2(sampleRate) {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 400;
            const env = Math.exp(-t * 15);
            data[i] = (Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1) * env * 0.3;
        }
        return buffer;
    }

    generateSiren(sampleRate) {
        const duration = 1.0;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 400 + Math.sin(t * Math.PI * 4) * 200;
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3;
        }
        return buffer;
    }

    generateAlarm(sampleRate) {
        const duration = 0.8;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = (Math.floor(t * 10) % 2 === 0) ? 800 : 600;
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3;
        }
        return buffer;
    }

    generateJump(sampleRate) {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 400 + Math.sin(t * Math.PI * 4) * 400;
            const env = Math.exp(-t * 8);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
        }
        return buffer;
    }

    generateCoin(sampleRate) {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq1 = 988;
            const freq2 = 1319;
            const env = Math.exp(-t * 12);
            data[i] = (Math.sin(2 * Math.PI * freq1 * t) + Math.sin(2 * Math.PI * freq2 * (t - 0.1))) * env * 0.3;
        }
        return buffer;
    }

    generateBlip(sampleRate) {
        const duration = 0.05;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 1000 * t) * 0.3;
        }
        return buffer;
    }

    generateBloop(sampleRate) {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 600 - t * 400;
            const env = Math.exp(-t * 10);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.3;
        }
        return buffer;
    }

    generateZap(sampleRate) {
        const duration = 0.1;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const noise = (Math.random() * 2 - 1);
            const freq = 2000 - t * 8000;
            const env = Math.exp(-t * 30);
            data[i] = (noise * 0.5 + Math.sin(2 * Math.PI * freq * t) * 0.5) * env;
        }
        return buffer;
    }

    generateBeep(sampleRate) {
        const duration = 0.1;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 800 * t) * 0.3;
        }
        return buffer;
    }

    generateWhoosh(sampleRate) {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const noise = (Math.random() * 2 - 1);
            const env = Math.sin(t * Math.PI * 2);
            data[i] = noise * env * 0.2;
        }
        return buffer;
    }

    generateHit(sampleRate) {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const noise = (Math.random() * 2 - 1);
            const freq = 200;
            const env = Math.exp(-t * 20);
            data[i] = (noise * 0.7 + Math.sin(2 * Math.PI * freq * t) * 0.3) * env;
        }
        return buffer;
    }

    generateShield(sampleRate) {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 600 + Math.sin(t * 40) * 200;
            const env = Math.exp(-t * 6);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.25;
        }
        return buffer;
    }

    generateTeleport(sampleRate) {
        const duration = 0.6;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 300 + Math.sin(t * 100) * 500;
            const env = t < 0.3 ? t / 0.3 : (0.6 - t) / 0.3;
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.3;
        }
        return buffer;
    }

    generateGlitch(sampleRate) {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = Math.floor(Math.random() * 1000) + 200;
            data[i] = (Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1) * 0.3;
        }
        return buffer;
    }

    generatePulse(sampleRate) {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 440;
            const pulse = Math.sin(t * Math.PI * 20);
            const env = Math.exp(-t * 6);
            data[i] = Math.sin(2 * Math.PI * freq * t) * pulse * env * 0.3;
        }
        return buffer;
    }

    generateChirp(sampleRate) {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 800 + t * 1200;
            const env = Math.exp(-t * 15);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.3;
        }
        return buffer;
    }

    generateBuzz(sampleRate) {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 100;
            data[i] = (Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1) * 0.3;
        }
        return buffer;
    }

    // === DJ Sound Effects ===

    generateAirHorn(sampleRate) {
        const duration = 0.4;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const env = Math.max(0, 1 - t * 2.5);
            // Layered square waves for air horn timbre
            const sig1 = Math.sin(2 * Math.PI * 185 * t);
            const sig2 = Math.sin(2 * Math.PI * 220 * t) * 0.8;
            const sig3 = Math.sin(2 * Math.PI * 277 * t) * 0.6;
            data[i] = (sig1 + sig2 + sig3) * env * 0.4;
        }
        return buffer;
    }

    generateBassDrop(sampleRate) {
        const duration = 0.8;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 40 + (60 * Math.exp(-t * 8)); // Drop from 100Hz to 40Hz
            const env = Math.exp(-t * 2);
            data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.8;
        }
        return buffer;
    }

    generateImpactHit(sampleRate) {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const env = Math.exp(-t * 25);
            const noise = (Math.random() - 0.5) * 2;
            const bass = Math.sin(2 * Math.PI * 80 * t);
            data[i] = (noise * 0.5 + bass * 0.5) * env * 0.6;
        }
        return buffer;
    }

    generateReverseCymbal(sampleRate) {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const env = t / duration; // Reverse envelope (quiet to loud)
            const noise = (Math.random() - 0.5) * 2;
            // High-pass filter simulation
            const filtered = noise * (1 - Math.exp(-t * 20));
            data[i] = filtered * env * 0.3;
        }
        return buffer;
    }

    generateVocalHey(sampleRate) {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const env = Math.exp(-t * 12);
            // Formant synthesis for "hey" (H-EH-Y)
            const f1 = Math.sin(2 * Math.PI * 400 * t); // First formant
            const f2 = Math.sin(2 * Math.PI * 2000 * t) * 0.5; // Second formant
            const f3 = Math.sin(2 * Math.PI * 3000 * t) * 0.3; // Third formant
            data[i] = (f1 + f2 + f3) * env * 0.4;
        }
        return buffer;
    }

    generateVocalOh(sampleRate) {
        const duration = 0.25;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const env = Math.exp(-t * 10);
            // Formant synthesis for "oh" sound
            const f1 = Math.sin(2 * Math.PI * 300 * t);
            const f2 = Math.sin(2 * Math.PI * 870 * t) * 0.6;
            const f3 = Math.sin(2 * Math.PI * 2250 * t) * 0.4;
            data[i] = (f1 + f2 + f3) * env * 0.4;
        }
        return buffer;
    }

    generateVocalYeah(sampleRate) {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const env = Math.exp(-t * 8);
            // Formant synthesis for "yeah"
            const f1 = Math.sin(2 * Math.PI * 500 * t);
            const f2 = Math.sin(2 * Math.PI * 1700 * t) * 0.6;
            const f3 = Math.sin(2 * Math.PI * 2600 * t) * 0.4;
            data[i] = (f1 + f2 + f3) * env * 0.4;
        }
        return buffer;
    }

    generateVocalChop(sampleRate) {
        const duration = 0.4;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const env = Math.exp(-t * 6);
            // Stuttered gate effect (16th notes at 120bpm = 0.125s intervals)
            const gate = Math.floor(t / 0.05) % 2 === 0 ? 1 : 0;
            const f1 = Math.sin(2 * Math.PI * 450 * t);
            const f2 = Math.sin(2 * Math.PI * 1800 * t) * 0.5;
            data[i] = (f1 + f2) * env * gate * 0.4;
        }
        return buffer;
    }

    generateScratchForward(sampleRate) {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 200 + t * 1500; // Pitch up
            const env = 0.6;
            const noise = (Math.random() - 0.5) * 0.3;
            const tone = Math.sin(2 * Math.PI * freq * t);
            data[i] = (tone * 0.7 + noise * 0.3) * env;
        }
        return buffer;
    }

    generateScratchBackward(sampleRate) {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const freq = 1700 - t * 1500; // Pitch down
            const env = 0.6;
            const noise = (Math.random() - 0.5) * 0.3;
            const tone = Math.sin(2 * Math.PI * freq * t);
            data[i] = (tone * 0.7 + noise * 0.3) * env;
        }
        return buffer;
    }

    generateTransformerScratch(sampleRate) {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Rapid staccato gating (transformer effect)
            const gate = Math.sin(2 * Math.PI * 40 * t) > 0 ? 1 : 0;
            const freq = 400 + Math.sin(2 * Math.PI * 8 * t) * 300;
            const noise = (Math.random() - 0.5) * 0.3;
            const tone = Math.sin(2 * Math.PI * freq * t);
            data[i] = (tone * 0.7 + noise * 0.3) * gate * 0.5;
        }
        return buffer;
    }

    generateRiser(sampleRate) {
        const duration = 1.0;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const env = t / duration; // Linear fade in
            const noise = (Math.random() - 0.5) * 2;
            // High-pass filter that increases with time
            const cutoff = 200 + t * 8000;
            const filtered = noise * Math.min(1, cutoff / 1000);
            data[i] = filtered * env * 0.4;
        }
        return buffer;
    }

    playSoundEffect(midiNote) {
        if (!this.sfxBuffers[midiNote]) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = this.sfxBuffers[midiNote];

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.6;

        source.connect(gain);
        gain.connect(this.phaser.delay);
        gain.connect(this.phaser.dry);

        source.start(0);

        // Visual feedback
        this.highlightKey(midiNote, true);
        setTimeout(() => this.highlightKey(midiNote, false), 100);
    }

    // ===== SYNTH ENGINE =====
    noteToFrequency(note) {
        // MIDI note number to frequency
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    getWaveformType() {
        // Map shape value to waveform type
        const shape = this.shapeValue;
        if (shape < 0.8) return 'sine';
        if (shape < 1.8) return 'sawtooth';
        if (shape < 2.8) return 'square';
        if (shape < 3.8) return 'triangle';
        return 'sawtooth'; // PWM approximation
    }

    playNote(midiNote) {
        // If in SFX mode, play sound effect instead
        if (this.sfxMode) {
            this.playSoundEffect(midiNote);
            return;
        }

        // Don't play if already playing
        if (this.activeNotes.has(midiNote)) return;

        const frequency = this.noteToFrequency(midiNote);
        const bendedFrequency = frequency * Math.pow(2, this.pitchBendValue / 1200); // cents

        // Get current voice settings
        const voice = this.synthVoices[this.currentVoice];

        // Create oscillator
        const osc = this.audioContext.createOscillator();
        // Use shape slider or voice waveform
        osc.type = this.getWaveformType();
        osc.frequency.value = bendedFrequency;

        // Create gain envelope
        const gain = this.audioContext.createGain();
        gain.gain.value = 0;

        // Connect audio chain - route through effects (phaser, delay)
        osc.connect(gain);

        // For LEAD voice, route through leadVolumeGain for real-time volume control
        // leadVolumeGain is connected to synthPreEffects in setupDelayChains()
        if (this.currentVoice === 'lead') {
            gain.connect(this.leadVolumeGain);
        } else {
            // Other voices route directly to pre-effects stage
            gain.connect(this.synthPreEffects);
        }

        // ADSR envelope from voice preset
        const now = this.audioContext.currentTime;
        const attackTime = now + voice.attack;
        const decayTime = attackTime + voice.decay;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(voice.volume, attackTime); // Attack
        gain.gain.linearRampToValueAtTime(voice.volume * voice.sustain, decayTime); // Decay to sustain

        osc.start(now);

        // Store active note with voice info
        this.activeNotes.set(midiNote, { osc, gain, frequency, voice });

        // Update UI
        this.highlightKey(midiNote, true);
    }

    stopNote(midiNote, forceStop = false) {
        const note = this.activeNotes.get(midiNote);
        if (!note) return;

        const { osc, gain, voice } = note;
        const now = this.audioContext.currentTime;
        const baseReleaseTime = voice ? voice.release : 0.1;

        // Apply sustain amount - extends release time (0-100% adds 0-5 seconds)
        const sustainExtension = (this.sustainAmount / 100) * 5;
        const releaseTime = baseReleaseTime + sustainExtension;

        // Release envelope
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + releaseTime);

        osc.stop(now + releaseTime);

        this.activeNotes.delete(midiNote);
        this.highlightKey(midiNote, false);
    }

    stopAllNotes() {
        for (const [midiNote] of this.activeNotes) {
            this.stopNote(midiNote);
        }
    }

    updatePitchBend() {
        // Update frequency of all active notes
        for (const [midiNote, note] of this.activeNotes) {
            const bendedFrequency = note.frequency * Math.pow(2, this.pitchBendValue / 1200);
            note.osc.frequency.setValueAtTime(bendedFrequency, this.audioContext.currentTime);
        }
    }

    // ===== ARPEGGIATOR =====
    startArpeggiator() {
        if (this.arpInterval) {
            clearInterval(this.arpInterval);
        }

        this.arpIndex = 0;
        this.arpInterval = setInterval(() => {
            this.arpStep();
        }, this.arpSpeed);
    }

    stopArpeggiator() {
        if (this.arpInterval) {
            clearInterval(this.arpInterval);
            this.arpInterval = null;
        }
        this.stopAllNotes();
    }

    arpStep() {
        if (this.arpNotes.length === 0) return;

        // Stop all currently playing notes from arp
        for (const [midiNote] of this.activeNotes) {
            this.stopNote(midiNote);
        }

        // Get next note based on pattern
        let nextNote;
        const numNotes = this.arpNotes.length;

        switch (this.arpPattern) {
            case 'up':
                nextNote = this.arpNotes[this.arpIndex % numNotes];
                break;
            case 'down':
                nextNote = this.arpNotes[numNotes - 1 - (this.arpIndex % numNotes)];
                break;
            case 'updown':
                if (numNotes === 1) {
                    nextNote = this.arpNotes[0];
                } else {
                    const updownLength = numNotes * 2 - 2;
                    const updownIndex = this.arpIndex % updownLength;
                    if (updownIndex < numNotes) {
                        nextNote = this.arpNotes[updownIndex];
                    } else {
                        nextNote = this.arpNotes[updownLength - updownIndex];
                    }
                }
                break;
            case 'random':
                nextNote = this.arpNotes[Math.floor(Math.random() * numNotes)];
                break;
        }

        // Increment index for next step
        this.arpIndex++;

        // Play the note
        if (nextNote !== undefined) {
            this.playNote(nextNote);
        }
    }

    updateArpNotes() {
        // Update list of notes for arpeggiator based on held keys
        const oldNotes = [...this.arpNotes];

        // Generate 5-note chord from the lowest held key using selected scale pattern
        if (this.heldKeys.size > 0) {
            const rootNote = Math.min(...Array.from(this.heldKeys));
            const pattern = this.arpScales[this.arpScale]; // Get selected scale pattern

            // Build chord from pattern intervals
            this.arpNotes = pattern.map(interval => rootNote + interval);
        } else {
            this.arpNotes = [];
        }

        // Check if notes changed
        const notesChanged = oldNotes.length !== this.arpNotes.length ||
                            oldNotes.some((note, i) => note !== this.arpNotes[i]);

        if (this.arpEnabled && this.arpNotes.length > 0) {
            if (!this.arpInterval) {
                this.startArpeggiator();
            } else if (notesChanged) {
                // Reset index when notes change during playback
                this.arpIndex = 0;
            }
        } else if (this.arpInterval) {
            this.stopArpeggiator();
        }
    }

    // ===== MIDI SUPPORT =====
    async initMIDI() {
        if (!navigator.requestMIDIAccess) {
            console.warn('Web MIDI API not supported');
            this.updateMIDIStatus(false, 'Web MIDI not supported');
            return;
        }

        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            console.log('MIDI Access granted');

            // Listen for MIDI inputs
            this.midiAccess.onstatechange = (e) => this.handleMIDIStateChange(e);

            // Setup existing inputs
            this.setupMIDIInputs();

        } catch (err) {
            console.error('MIDI Access denied:', err);
            this.updateMIDIStatus(false, 'MIDI access denied');
        }
    }

    setupMIDIInputs() {
        const inputs = this.midiAccess.inputs.values();
        let hasInputs = false;

        for (let input of inputs) {
            hasInputs = true;
            console.log('MIDI Input:', input.name);
            input.onmidimessage = (msg) => this.handleMIDIMessage(msg);
        }

        this.updateMIDIStatus(hasInputs, hasInputs ? 'MIDI: Connected' : 'MIDI: No devices');
    }

    handleMIDIStateChange(e) {
        console.log('MIDI State Change:', e.port.name, e.port.state);
        this.setupMIDIInputs();
    }

    handleMIDIMessage(message) {
        const [status, note, velocity] = message.data;
        const command = status >> 4;
        const channel = status & 0x0f;

        // === COMPREHENSIVE MIDI LOGGING ===
        const commandNames = {
            8: 'Note Off',
            9: 'Note On',
            10: 'Poly Aftertouch',
            11: 'Control Change',
            12: 'Program Change',
            13: 'Channel Aftertouch',
            14: 'Pitch Bend'
        };

        const commandName = commandNames[command] || 'Unknown';

        if (command === 11) {
            // Control Change - show CC number and value
            console.log(`🎛️ MIDI: ${commandName} | Ch:${channel + 1} | CC#:${note} | Value:${velocity}`);
        } else if (command === 14) {
            // Pitch Bend
            const bendValue = ((velocity << 7) | note) - 8192;
            console.log(`🎵 MIDI: ${commandName} | Ch:${channel + 1} | Value:${bendValue}`);
        } else if (command === 9 || command === 8) {
            // Note On/Off
            console.log(`🎹 MIDI: ${commandName} | Ch:${channel + 1} | Note:${note} | Velocity:${velocity}`);
        } else {
            // Other messages
            console.log(`📡 MIDI: ${commandName} | Ch:${channel + 1} | Data1:${note} | Data2:${velocity}`);
        }
        // === END MIDI LOGGING ===

        switch (command) {
            case 9: // Note On
                if (velocity > 0) {
                    // Apply octave transposition to MIDI input
                    // Controller starts at C3 (note 48), map to virtual keyboard range
                    const controllerStartNote = 48; // C3 - where 32-key controllers typically start
                    const virtualStartNote = this.currentOctave * 12; // C of selected octave
                    const octaveOffset = virtualStartNote - controllerStartNote;
                    const transposedNote = note + octaveOffset;

                    this.heldKeys.add(transposedNote); // Store transposed note for consistent arpeggiator behavior
                    if (this.arpEnabled) {
                        this.updateArpNotes();
                    } else {
                        this.playNote(transposedNote); // Play transposed note
                    }
                } else {
                    // Velocity 0 is Note Off
                    const controllerStartNote = 48; // C3
                    const virtualStartNote = this.currentOctave * 12;
                    const octaveOffset = virtualStartNote - controllerStartNote;
                    const transposedNote = note + octaveOffset;

                    this.heldKeys.delete(transposedNote); // Delete transposed note
                    if (this.arpEnabled) {
                        this.updateArpNotes();
                    } else {
                        this.stopNote(transposedNote); // Stop transposed note
                    }
                }
                break;

            case 8: // Note Off
                // Apply octave transposition to MIDI input
                const controllerStartNoteOff = 48; // C3
                const virtualStartNoteOff = this.currentOctave * 12;
                const octaveOffsetNoteOff = virtualStartNoteOff - controllerStartNoteOff;
                const transposedNoteOff = note + octaveOffsetNoteOff;

                this.heldKeys.delete(transposedNoteOff); // Delete transposed note
                if (this.arpEnabled) {
                    this.updateArpNotes();
                } else {
                    this.stopNote(transposedNoteOff); // Stop transposed note
                }
                break;

            case 11: // Control Change
                if (note === 1) {
                    // CC1 Button - advance shape on initial press (0 → non-zero)
                    // Button sends decreasing values while held (11→10→9...→0)
                    if (velocity > 0 && this.lastModValue === 0) {
                        // Button just pressed! Advance to next shape
                        this.shapeValue = (this.shapeValue + 1) % 5; // 0-4, wraps around
                        document.getElementById('shapeSlider').value = this.shapeValue;
                        this.updateWaveformDisplay();

                        const shapeNames = ['SINE', 'SAW', 'SQUARE', 'TRIANGLE', 'PWM'];
                        console.log(`🌊 Shape changed to: ${shapeNames[this.shapeValue]} (${this.shapeValue})`);
                    }
                    this.lastModValue = velocity;
                } else if (note === 64) {
                    // CC64 Button - cycle through octaves on ANY state change
                    // Button toggles between 127 and 0, trigger on BOTH edges
                    const wasLow = this.lastCC64Value < 64;
                    const nowHigh = velocity >= 64;

                    // Trigger if state changed (low→high OR high→low)
                    if ((wasLow && nowHigh) || (!wasLow && !nowHigh && this.lastCC64Value !== velocity)) {
                        // Button state changed! Advance to next octave
                        // Cycle through 2, 3, 4, 5, 6, then back to 2
                        this.currentOctave = ((this.currentOctave - 2 + 1) % 5) + 2;
                        this.updateOctaveUI();
                        this.updatePitchDisplay();

                        console.log(`🎹 Octave changed to: ${this.currentOctave}`);
                    }
                    this.lastCC64Value = velocity;
                } else if (note === 7) {
                    // CC7 Volume Knob - Phaser Speed (0-127)
                    const speed = (velocity / 127) * 10; // Map to 0-10 Hz (0 = OFF)
                    this.phaserSpeed = speed;

                    if (speed === 0 || velocity === 0) {
                        // Turn OFF phaser
                        this.phaser.wet.gain.value = 0;
                        this.phaser.dry.gain.value = 1.0;
                        document.getElementById('phaserSpeed').value = 0;
                        document.getElementById('phaserSpeedValue').textContent = 'OFF';
                        console.log(`🌊 Phaser: OFF`);
                    } else {
                        // Turn ON phaser with speed
                        this.phaser.lfo.frequency.value = speed;
                        this.phaser.wet.gain.value = 0.75;
                        this.phaser.dry.gain.value = 0.5;
                        document.getElementById('phaserSpeed').value = speed;
                        document.getElementById('phaserSpeedValue').textContent = speed.toFixed(1) + ' Hz';
                        console.log(`🌊 Phaser speed: ${speed.toFixed(1)} Hz`);
                    }
                } else if (note === 102 && velocity > 0) {
                    // CC102: Octave Up (M-Audio convention - if controller sends it)
                    if (this.currentOctave < 6) {
                        this.currentOctave++;
                        this.updateOctaveUI();
                        this.updatePitchDisplay();
                    }
                } else if (note === 103 && velocity > 0) {
                    // CC103: Octave Down (M-Audio convention - if controller sends it)
                    if (this.currentOctave > 2) {
                        this.currentOctave--;
                        this.updateOctaveUI();
                        this.updatePitchDisplay();
                    }
                }
                break;

            case 14: // Pitch Bend
                const bendValue = ((velocity << 7) | note) - 8192;
                this.pitchBendValue = (bendValue / 8192) * 200; // ±200 cents
                document.getElementById('pitchBend').value = this.pitchBendValue;
                this.updatePitchBend();
                break;
        }
    }

    updateMIDIStatus(connected, message) {
        const statusEl = document.getElementById('midiStatus');
        if (connected) {
            statusEl.classList.add('connected');
        } else {
            statusEl.classList.remove('connected');
        }
        statusEl.querySelector('.status-text').textContent = message;
    }

    // ===== SEQUENCER =====
    createEmptySequencer() {
        // 8 drum tracks + 4 synth tracks = 12 tracks total
        // C major pentatonic scale: C, D, E, G, A (in octave 2)

        // Helper function to create step array with specific steps enabled
        const createSteps = (enabledSteps = []) => {
            const steps = Array(16).fill(false);
            enabledSteps.forEach(step => steps[step] = true);
            return steps;
        };

        const drumTracks = [
            { steps: createSteps([0, 3, 4, 8, 11]), isDrum: true, drumSound: 'kick', label: 'KICK', color: '#ff0066' },
            { steps: createSteps(), isDrum: true, drumSound: 'snare', label: 'SNARE', color: '#ffaa00' },
            { steps: createSteps([4, 12]), isDrum: true, drumSound: 'hihat-closed', label: 'HI-HAT', color: '#00ccff' },
            { steps: createSteps(), isDrum: true, drumSound: 'hihat-open', label: 'HAT OPEN', color: '#00ddff' },
            { steps: createSteps(), isDrum: true, drumSound: 'clap', label: 'CLAP', color: '#ff00ff' },
            { steps: createSteps([0, 4, 8, 12]), isDrum: true, drumSound: 'tom', label: 'TOM', color: '#00ff88' },
            { steps: createSteps(), isDrum: true, drumSound: 'crash', label: 'CRASH', color: '#ffff00' },
            { steps: createSteps(), isDrum: true, drumSound: 'rim', label: 'RIMSHOT', color: '#ff6600' }
        ];

        const synthTracks = [
            { steps: createSteps([0]), isDrum: false, note: 36, label: 'C2', color: '#9d4edd', isSynthSeq: true }, // C2
            { steps: createSteps(), isDrum: false, note: 45, label: 'A2', color: '#7b2cbf', isSynthSeq: true }, // A2
            { steps: createSteps([6]), isDrum: false, note: 43, label: 'G2', color: '#5a189a', isSynthSeq: true }, // G2
            { steps: createSteps(), isDrum: false, note: 40, label: 'E2', color: '#3c096c', isSynthSeq: true }  // E2
        ];

        return [...drumTracks, ...synthTracks];
    }

    startSequencer() {
        if (this.sequencerPlaying) return;

        this.sequencerPlaying = true;
        this.currentStep = 0;

        const stepDuration = (60 / this.bpm) * 1000 / 4; // 16th notes

        this.sequencerInterval = setInterval(() => {
            this.playSequencerStep();
            this.currentStep = (this.currentStep + 1) % 16;
        }, stepDuration);

        // Update UI
        document.getElementById('seqPlay').classList.add('active');
    }

    stopSequencer() {
        if (!this.sequencerPlaying) return;

        this.sequencerPlaying = false;

        if (this.sequencerInterval) {
            clearInterval(this.sequencerInterval);
            this.sequencerInterval = null;
        }

        this.stopAllNotes();

        // Update UI
        document.getElementById('seqPlay').classList.remove('active');
    }

    playSequencerStep() {
        this.sequencerGrid.forEach((track, trackIndex) => {
            if (track.steps[this.currentStep]) {
                if (track.isDrum) {
                    this.playDrum(track.drumSound);
                } else if (track.isSynthSeq) {
                    // Play synth sequencer note with its own settings
                    this.playSynthSeqNote(track.note);
                } else {
                    this.playNote(track.note);
                    setTimeout(() => this.stopNote(track.note), 50);
                }
            }
        });

        // Update visual
        this.highlightSequencerStep(this.currentStep);
    }

    playSynthSeqNote(midiNote) {
        // Play note with synth sequencer settings (independent from main keyboard)
        const frequency = this.noteToFrequency(midiNote);

        // Get waveform from synthSeqShape
        let waveformType = 'sine';
        if (this.synthSeqShape < 0.8) waveformType = 'sine';
        else if (this.synthSeqShape < 1.8) waveformType = 'sawtooth';
        else if (this.synthSeqShape < 2.8) waveformType = 'square';
        else if (this.synthSeqShape < 3.8) waveformType = 'triangle';
        else waveformType = 'sawtooth';

        // Create oscillator
        const osc = this.audioContext.createOscillator();
        osc.type = waveformType;
        osc.frequency.value = frequency;

        // Create gain envelope
        const gain = this.audioContext.createGain();
        gain.gain.value = 0;

        // Create delay for synth seq
        const delay = this.audioContext.createDelay(2.0);
        delay.delayTime.value = this.synthSeqDelay;

        const delayFeedback = this.audioContext.createGain();
        delayFeedback.gain.value = 0.3;

        const delayWet = this.audioContext.createGain();
        delayWet.gain.value = 0.5;

        const delayDry = this.audioContext.createGain();
        delayDry.gain.value = 0.5;

        // Connect delay chain
        delay.connect(delayFeedback);
        delayFeedback.connect(delay);
        delay.connect(delayWet);

        // Connect audio chain
        osc.connect(gain);
        gain.connect(delay);
        gain.connect(delayDry);
        delayWet.connect(this.synthMixer);
        delayDry.connect(this.synthMixer);

        // ADSR envelope - short note for sequencer
        const now = this.audioContext.currentTime;
        const attack = 0.01;
        const decay = 0.05;
        const sustain = 0.7;
        const sustainExtension = (this.synthSeqSustain / 100) * 0.5; // 0-0.5 seconds (less sensitive)
        const release = 0.1 + sustainExtension;
        const noteDuration = 0.05 + sustainExtension;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + attack);
        gain.gain.linearRampToValueAtTime(0.3 * sustain, now + attack + decay);
        gain.gain.setValueAtTime(0.3 * sustain, now + noteDuration);
        gain.gain.linearRampToValueAtTime(0, now + noteDuration + release);

        osc.start(now);
        osc.stop(now + noteDuration + release);
    }

    highlightSequencerStep(step) {
        // Remove previous highlights
        document.querySelectorAll('.step-header').forEach((header, index) => {
            if (index === step) {
                header.style.color = '#00ff88';
                header.style.textShadow = '0 0 15px #00ff88';
                header.style.transform = 'scale(1.3)';
            } else {
                header.style.color = '#888';
                header.style.textShadow = 'none';
                header.style.transform = 'scale(1)';
            }
        });

        // Highlight cells in current step
        document.querySelectorAll(`.seq-cell[data-step="${step}"]`).forEach(cell => {
            cell.style.transform = 'scale(1.1)';
            setTimeout(() => {
                cell.style.transform = 'scale(1)';
            }, 100);
        });
    }

    clearSequencer() {
        // Stop playback if running
        if (this.sequencerPlaying) {
            this.stopSequencer();
        }

        // Create a completely empty sequencer (no default notes)
        const createSteps = (enabledSteps = []) => {
            const steps = Array(16).fill(false);
            enabledSteps.forEach(step => steps[step] = true);
            return steps;
        };

        const drumTracks = [
            { steps: createSteps(), isDrum: true, drumSound: 'kick', label: 'KICK', color: '#ff0066' },
            { steps: createSteps(), isDrum: true, drumSound: 'snare', label: 'SNARE', color: '#ffaa00' },
            { steps: createSteps(), isDrum: true, drumSound: 'hihat-closed', label: 'HI-HAT', color: '#00ccff' },
            { steps: createSteps(), isDrum: true, drumSound: 'hihat-open', label: 'HAT OPEN', color: '#00ddff' },
            { steps: createSteps(), isDrum: true, drumSound: 'clap', label: 'CLAP', color: '#ff00ff' },
            { steps: createSteps(), isDrum: true, drumSound: 'tom', label: 'TOM', color: '#00ff88' },
            { steps: createSteps(), isDrum: true, drumSound: 'crash', label: 'CRASH', color: '#ffff00' },
            { steps: createSteps(), isDrum: true, drumSound: 'rim', label: 'RIMSHOT', color: '#ff6600' }
        ];

        const synthTracks = [
            { steps: createSteps(), isDrum: false, note: 36, label: 'C2', color: '#9d4edd', isSynthSeq: true },
            { steps: createSteps(), isDrum: false, note: 45, label: 'A2', color: '#7b2cbf', isSynthSeq: true },
            { steps: createSteps(), isDrum: false, note: 43, label: 'G2', color: '#5a189a', isSynthSeq: true },
            { steps: createSteps(), isDrum: false, note: 40, label: 'E2', color: '#3c096c', isSynthSeq: true }
        ];

        this.sequencerGrid = [...drumTracks, ...synthTracks];
        this.renderSequencerGrid();
    }

    generateRandomPattern() {
        // Array of preset patterns
        const patterns = [
            // Original patterns
            { name: 'Fast & Aggressive', bpm: 150, pattern: 'aggressive', tempo: 'fast' },
            { name: 'Slow & Melodic', bpm: 90, pattern: 'melodic', tempo: 'slow' },
            { name: 'Mid Tempo Groove', bpm: 120, pattern: 'groove', tempo: 'mid' },
            { name: 'Energetic Dance', bpm: 140, pattern: 'dance', tempo: 'fast' },
            { name: 'Chill Ambient', bpm: 80, pattern: 'ambient', tempo: 'slow' },
            { name: 'Breakbeat', bpm: 165, pattern: 'breakbeat', tempo: 'fast' },
            // New patterns
            { name: 'Techno Pumper', bpm: 147, pattern: 'techno', tempo: 'fast' },
            { name: 'Half-Time Trap', bpm: 140, pattern: 'halftime', tempo: 'fast' },
            { name: 'Minimal Deep House', bpm: 125, pattern: 'minimal', tempo: 'mid' },
            { name: 'Jungle Madness', bpm: 170, pattern: 'jungle', tempo: 'fast' },
            { name: 'Industrial Glitch', bpm: 135, pattern: 'glitch', tempo: 'mid' },
            { name: 'Retro Synthwave', bpm: 110, pattern: 'synthwave', tempo: 'slow' },
            { name: 'Downtempo Chill', bpm: 95, pattern: 'downtempo', tempo: 'slow' },
            { name: 'Hardstyle Kick', bpm: 150, pattern: 'hardstyle', tempo: 'fast' },
            { name: 'Dubstep Wobble', bpm: 140, pattern: 'dubstep', tempo: 'fast' },
            { name: 'Progressive Trance', bpm: 138, pattern: 'progtrance', tempo: 'mid' }
        ];

        // Pick random pattern
        const preset = patterns[Math.floor(Math.random() * patterns.length)];
        console.log('Generating pattern:', preset.name);

        // Set BPM
        this.bpm = preset.bpm;
        document.getElementById('bpmSlider').value = this.bpm;
        document.getElementById('bpmValue').textContent = this.bpm;

        // Randomize drum delay settings for variation
        const delayTime = 0.05 + Math.random() * 0.45; // 50-500ms
        const delayFeedback = Math.random() * 0.6; // 0-60%
        const delayMix = Math.random() * 0.5; // 0-50%

        // Apply to drum delay
        this.drumDelay.node.delayTime.value = delayTime;
        this.drumDelay.feedback.gain.value = delayFeedback;
        this.drumDelay.wet.gain.value = delayMix;
        this.drumDelay.dry.gain.value = 1 - delayMix;

        // Update UI sliders
        document.getElementById('drumDelayTime').value = delayTime;
        document.getElementById('drumDelayTimeValue').textContent = Math.round(delayTime * 1000) + 'ms';
        document.getElementById('drumDelayFeedback').value = delayFeedback;
        document.getElementById('drumDelayFeedbackValue').textContent = Math.round(delayFeedback * 100) + '%';
        document.getElementById('drumDelayMix').value = delayMix;
        document.getElementById('drumDelayMixValue').textContent = Math.round(delayMix * 100) + '%';

        // Clear existing pattern
        this.sequencerGrid = this.createEmptySequencer();

        // Generate drum pattern based on type
        switch (preset.pattern) {
            case 'aggressive':
                this.generateAggressivePattern();
                break;
            case 'melodic':
                this.generateMelodicPattern();
                break;
            case 'groove':
                this.generateGroovePattern();
                break;
            case 'dance':
                this.generateDancePattern();
                break;
            case 'ambient':
                this.generateAmbientPattern();
                break;
            case 'breakbeat':
                this.generateBreakbeatPattern();
                break;
            case 'techno':
                this.generateTechnoPumperPattern();
                break;
            case 'halftime':
                this.generateHalfTimeTrapPattern();
                break;
            case 'minimal':
                this.generateMinimalDeepHousePattern();
                break;
            case 'jungle':
                this.generateJungleMadnessPattern();
                break;
            case 'glitch':
                this.generateIndustrialGlitchPattern();
                break;
            case 'synthwave':
                this.generateRetroSynthwavePattern();
                break;
            case 'downtempo':
                this.generateDowntempoChillPattern();
                break;
            case 'hardstyle':
                this.generateHardstyleKickPattern();
                break;
            case 'dubstep':
                this.generateDubstepWobblePattern();
                break;
            case 'progtrance':
                this.generateProgressiveTrancePattern();
                break;
        }

        // Render and auto-play
        this.renderSequencerGrid();
        if (!this.sequencerPlaying) {
            this.startSequencer();
        }
    }

    generateAggressivePattern() {
        // Kick on 1, 5, 9, 13
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[4] = true;
        this.sequencerGrid[0].steps[8] = true;
        this.sequencerGrid[0].steps[12] = true;

        // Snare on 4, 12
        this.sequencerGrid[1].steps[4] = true;
        this.sequencerGrid[1].steps[12] = true;

        // Hi-hat every other step
        for (let i = 0; i < 16; i += 2) {
            this.sequencerGrid[2].steps[i] = true;
        }

        // Clap on 6, 14
        this.sequencerGrid[4].steps[6] = true;
        this.sequencerGrid[4].steps[14] = true;

        // Crash on 1
        this.sequencerGrid[6].steps[0] = true;

        // Synth notes - aggressive stabs
        this.sequencerGrid[8].steps[0] = true;  // C5
        this.sequencerGrid[8].steps[8] = true;
        this.sequencerGrid[10].steps[4] = true; // G4
        this.sequencerGrid[10].steps[12] = true;

        // Randomize synth seq shape - aggressive prefers SAW/SQUARE
        const aggressiveShapes = [1, 2, 2]; // SAW, SQUARE (weighted)
        this.synthSeqShape = aggressiveShapes[Math.floor(Math.random() * aggressiveShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateMelodicPattern() {
        // Kick on 1, 9
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[8] = true;

        // Snare on 5, 13
        this.sequencerGrid[1].steps[4] = true;
        this.sequencerGrid[1].steps[12] = true;

        // Hi-hat sparse
        this.sequencerGrid[2].steps[2] = true;
        this.sequencerGrid[2].steps[6] = true;
        this.sequencerGrid[2].steps[10] = true;
        this.sequencerGrid[2].steps[14] = true;

        // Synth melody - pentatonic scale
        this.sequencerGrid[8].steps[0] = true;  // C5
        this.sequencerGrid[9].steps[2] = true;  // A4
        this.sequencerGrid[10].steps[4] = true; // G4
        this.sequencerGrid[11].steps[6] = true; // E4
        this.sequencerGrid[10].steps[8] = true; // G4
        this.sequencerGrid[9].steps[10] = true; // A4
        this.sequencerGrid[8].steps[12] = true; // C5
        this.sequencerGrid[9].steps[14] = true; // A4

        // Randomize synth seq shape - melodic prefers SINE/TRIANGLE
        const melodicShapes = [0, 0, 3]; // SINE (weighted), TRIANGLE
        this.synthSeqShape = melodicShapes[Math.floor(Math.random() * melodicShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateGroovePattern() {
        // Four on the floor kick
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[4] = true;
        this.sequencerGrid[0].steps[8] = true;
        this.sequencerGrid[0].steps[12] = true;

        // Snare on 2 and 4
        this.sequencerGrid[1].steps[4] = true;
        this.sequencerGrid[1].steps[12] = true;

        // Hi-hat 8ths
        for (let i = 0; i < 16; i += 2) {
            this.sequencerGrid[2].steps[i] = true;
        }

        // Open hi-hat accents
        this.sequencerGrid[3].steps[6] = true;
        this.sequencerGrid[3].steps[14] = true;

        // Synth bass line
        this.sequencerGrid[11].steps[0] = true;  // E4
        this.sequencerGrid[11].steps[4] = true;
        this.sequencerGrid[11].steps[8] = true;
        this.sequencerGrid[11].steps[12] = true;

        // Randomize synth seq shape - groove prefers SAW/SQUARE
        const grooveShapes = [1, 2]; // SAW, SQUARE
        this.synthSeqShape = grooveShapes[Math.floor(Math.random() * grooveShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateDancePattern() {
        // Four on the floor
        for (let i = 0; i < 16; i += 4) {
            this.sequencerGrid[0].steps[i] = true;
        }

        // Clap on 2 and 4
        this.sequencerGrid[4].steps[4] = true;
        this.sequencerGrid[4].steps[12] = true;

        // Hi-hat 16ths
        for (let i = 0; i < 16; i++) {
            this.sequencerGrid[2].steps[i] = true;
        }

        // Open hat every 4
        this.sequencerGrid[3].steps[3] = true;
        this.sequencerGrid[3].steps[7] = true;
        this.sequencerGrid[3].steps[11] = true;
        this.sequencerGrid[3].steps[15] = true;

        // Synth stabs
        this.sequencerGrid[8].steps[0] = true;
        this.sequencerGrid[8].steps[6] = true;
        this.sequencerGrid[10].steps[8] = true;
        this.sequencerGrid[10].steps[14] = true;

        // Randomize synth seq shape - dance prefers SAW/SQUARE/PWM
        const danceShapes = [1, 2, 4]; // SAW, SQUARE, PWM
        this.synthSeqShape = danceShapes[Math.floor(Math.random() * danceShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateAmbientPattern() {
        // Sparse kick
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[12] = true;

        // Hi-hat sparse
        this.sequencerGrid[2].steps[4] = true;
        this.sequencerGrid[2].steps[8] = true;

        // Synth pads - sustained notes
        this.sequencerGrid[8].steps[0] = true;
        this.sequencerGrid[9].steps[4] = true;
        this.sequencerGrid[10].steps[8] = true;
        this.sequencerGrid[11].steps[12] = true;

        // Increase synth seq sustain for ambient
        this.synthSeqSustain = 80;
        document.getElementById('synthSeqSustain').value = 80;
        document.getElementById('synthSeqSustainValue').textContent = '80%';

        // Randomize synth seq shape - ambient prefers SINE/TRIANGLE
        const ambientShapes = [0, 0, 0, 3]; // SINE (heavily weighted), TRIANGLE
        this.synthSeqShape = ambientShapes[Math.floor(Math.random() * ambientShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateBreakbeatPattern() {
        // Syncopated kick
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[3] = true;
        this.sequencerGrid[0].steps[8] = true;
        this.sequencerGrid[0].steps[11] = true;

        // Snare variations
        this.sequencerGrid[1].steps[4] = true;
        this.sequencerGrid[1].steps[10] = true;
        this.sequencerGrid[1].steps[12] = true;

        // Complex hi-hat pattern
        for (let i = 0; i < 16; i++) {
            if (i % 3 === 0 || i % 5 === 0) {
                this.sequencerGrid[2].steps[i] = true;
            }
        }

        // Tom fills
        this.sequencerGrid[5].steps[6] = true;
        this.sequencerGrid[5].steps[7] = true;
        this.sequencerGrid[5].steps[14] = true;
        this.sequencerGrid[5].steps[15] = true;

        // Synth rhythm
        this.sequencerGrid[10].steps[2] = true;
        this.sequencerGrid[9].steps[6] = true;
        this.sequencerGrid[10].steps[10] = true;
        this.sequencerGrid[9].steps[13] = true;

        // Randomize synth seq shape - breakbeat can be anything
        const breakbeatShapes = [0, 1, 2, 3, 4]; // All shapes equally
        this.synthSeqShape = breakbeatShapes[Math.floor(Math.random() * breakbeatShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateTechnoPumperPattern() {
        // Four-on-the-floor kick
        for (let i = 0; i < 16; i += 4) {
            this.sequencerGrid[0].steps[i] = true;
        }
        // Offbeat claps
        this.sequencerGrid[4].steps[2] = true;
        this.sequencerGrid[4].steps[6] = true;
        this.sequencerGrid[4].steps[10] = true;
        this.sequencerGrid[4].steps[14] = true;
        // Hi-hat 8ths
        for (let i = 0; i < 16; i += 2) {
            this.sequencerGrid[2].steps[i] = true;
        }
        // Driving bass line
        this.sequencerGrid[11].steps[0] = true;
        this.sequencerGrid[11].steps[2] = true;
        this.sequencerGrid[11].steps[4] = true;
        this.sequencerGrid[11].steps[6] = true;
        this.sequencerGrid[11].steps[8] = true;
        this.sequencerGrid[11].steps[10] = true;
        this.sequencerGrid[11].steps[12] = true;
        this.sequencerGrid[11].steps[14] = true;

        const technoShapes = [1, 2, 4]; // SAW, SQUARE, PWM
        this.synthSeqShape = technoShapes[Math.floor(Math.random() * technoShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateHalfTimeTrapPattern() {
        // Sparse kicks
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[8] = true;
        // Snare on 3
        this.sequencerGrid[1].steps[6] = true;
        this.sequencerGrid[1].steps[14] = true;
        // Rolling hi-hats
        this.sequencerGrid[2].steps[1] = true;
        this.sequencerGrid[2].steps[3] = true;
        this.sequencerGrid[2].steps[5] = true;
        this.sequencerGrid[2].steps[7] = true;
        this.sequencerGrid[2].steps[9] = true;
        this.sequencerGrid[2].steps[11] = true;
        this.sequencerGrid[2].steps[13] = true;
        this.sequencerGrid[2].steps[15] = true;
        // Heavy sub bass
        this.sequencerGrid[11].steps[0] = true;
        this.sequencerGrid[11].steps[6] = true;
        this.sequencerGrid[11].steps[12] = true;

        const trapShapes = [1, 4]; // SAW, PWM
        this.synthSeqShape = trapShapes[Math.floor(Math.random() * trapShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateMinimalDeepHousePattern() {
        // Minimal kick pattern
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[4] = true;
        this.sequencerGrid[0].steps[8] = true;
        this.sequencerGrid[0].steps[12] = true;
        // Atmospheric snare
        this.sequencerGrid[1].steps[6] = true;
        // Subtle hi-hats
        this.sequencerGrid[2].steps[2] = true;
        this.sequencerGrid[2].steps[6] = true;
        this.sequencerGrid[2].steps[10] = true;
        this.sequencerGrid[2].steps[14] = true;
        // Atmospheric pads
        this.sequencerGrid[8].steps[0] = true;
        this.sequencerGrid[9].steps[4] = true;
        this.sequencerGrid[10].steps[8] = true;
        this.sequencerGrid[11].steps[12] = true;

        this.synthSeqSustain = 85;
        document.getElementById('synthSeqSustain').value = 85;
        document.getElementById('synthSeqSustainValue').textContent = '85%';

        const minimalShapes = [0, 3]; // SINE, TRIANGLE
        this.synthSeqShape = minimalShapes[Math.floor(Math.random() * minimalShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateJungleMadnessPattern() {
        // Rapid kick pattern
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[2] = true;
        this.sequencerGrid[0].steps[4] = true;
        this.sequencerGrid[0].steps[6] = true;
        this.sequencerGrid[0].steps[8] = true;
        this.sequencerGrid[0].steps[10] = true;
        this.sequencerGrid[0].steps[12] = true;
        this.sequencerGrid[0].steps[14] = true;
        // Snare breakbeat
        this.sequencerGrid[1].steps[3] = true;
        this.sequencerGrid[1].steps[7] = true;
        this.sequencerGrid[1].steps[11] = true;
        // Rapid hi-hat
        for (let i = 0; i < 16; i++) {
            this.sequencerGrid[2].steps[i] = true;
        }
        // Chopped synth
        this.sequencerGrid[8].steps[1] = true;
        this.sequencerGrid[9].steps[3] = true;
        this.sequencerGrid[10].steps[5] = true;
        this.sequencerGrid[9].steps[7] = true;
        this.sequencerGrid[8].steps[9] = true;
        this.sequencerGrid[10].steps[11] = true;

        const jungleShapes = [1, 2]; // SAW, SQUARE
        this.synthSeqShape = jungleShapes[Math.floor(Math.random() * jungleShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateIndustrialGlitchPattern() {
        // Irregular kick pattern
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[2] = true;
        this.sequencerGrid[0].steps[5] = true;
        this.sequencerGrid[0].steps[9] = true;
        this.sequencerGrid[0].steps[11] = true;
        this.sequencerGrid[0].steps[14] = true;
        // Glitchy snare
        this.sequencerGrid[1].steps[1] = true;
        this.sequencerGrid[1].steps[4] = true;
        this.sequencerGrid[1].steps[8] = true;
        this.sequencerGrid[1].steps[13] = true;
        // Sparse hi-hat
        this.sequencerGrid[2].steps[3] = true;
        this.sequencerGrid[2].steps[7] = true;
        this.sequencerGrid[2].steps[12] = true;
        // Experimental synth
        this.sequencerGrid[8].steps[2] = true;
        this.sequencerGrid[10].steps[5] = true;
        this.sequencerGrid[9].steps[9] = true;
        this.sequencerGrid[11].steps[13] = true;

        const glitchShapes = [2, 4]; // SQUARE, PWM
        this.synthSeqShape = glitchShapes[Math.floor(Math.random() * glitchShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateRetroSynthwavePattern() {
        // 80s-style kick
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[8] = true;
        // Gated reverb snare
        this.sequencerGrid[1].steps[4] = true;
        this.sequencerGrid[1].steps[12] = true;
        // Sparse hi-hat
        this.sequencerGrid[2].steps[2] = true;
        this.sequencerGrid[2].steps[6] = true;
        this.sequencerGrid[2].steps[10] = true;
        this.sequencerGrid[2].steps[14] = true;
        // Melodic arpeggio synth
        this.sequencerGrid[8].steps[0] = true;
        this.sequencerGrid[9].steps[2] = true;
        this.sequencerGrid[10].steps[4] = true;
        this.sequencerGrid[11].steps[6] = true;
        this.sequencerGrid[10].steps[8] = true;
        this.sequencerGrid[9].steps[10] = true;
        this.sequencerGrid[8].steps[12] = true;
        this.sequencerGrid[9].steps[14] = true;

        this.synthSeqSustain = 70;
        document.getElementById('synthSeqSustain').value = 70;
        document.getElementById('synthSeqSustainValue').textContent = '70%';

        const synthwaveShapes = [0, 3]; // SINE, TRIANGLE
        this.synthSeqShape = synthwaveShapes[Math.floor(Math.random() * synthwaveShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateDowntempoChillPattern() {
        // Laid-back kick
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[6] = true;
        // Snare on 2 and 4
        this.sequencerGrid[1].steps[4] = true;
        this.sequencerGrid[1].steps[12] = true;
        // Jazzy hi-hat
        this.sequencerGrid[2].steps[1] = true;
        this.sequencerGrid[2].steps[5] = true;
        this.sequencerGrid[2].steps[9] = true;
        this.sequencerGrid[2].steps[13] = true;
        // Warm pads
        this.sequencerGrid[9].steps[0] = true;
        this.sequencerGrid[10].steps[4] = true;
        this.sequencerGrid[11].steps[8] = true;
        this.sequencerGrid[9].steps[12] = true;

        this.synthSeqSustain = 90;
        document.getElementById('synthSeqSustain').value = 90;
        document.getElementById('synthSeqSustainValue').textContent = '90%';

        const chillShapes = [0, 0, 3]; // SINE (weighted), TRIANGLE
        this.synthSeqShape = chillShapes[Math.floor(Math.random() * chillShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateHardstyleKickPattern() {
        // Distorted kicks
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[4] = true;
        this.sequencerGrid[0].steps[8] = true;
        this.sequencerGrid[0].steps[12] = true;
        // Reverse bass
        this.sequencerGrid[11].steps[2] = true;
        this.sequencerGrid[11].steps[6] = true;
        this.sequencerGrid[11].steps[10] = true;
        this.sequencerGrid[11].steps[14] = true;
        // Epic snare
        this.sequencerGrid[1].steps[6] = true;
        // Driving hi-hat
        for (let i = 0; i < 16; i += 2) {
            this.sequencerGrid[2].steps[i] = true;
        }
        // Epic synth stabs
        this.sequencerGrid[8].steps[0] = true;
        this.sequencerGrid[8].steps[8] = true;

        const hardstyleShapes = [1, 2]; // SAW, SQUARE
        this.synthSeqShape = hardstyleShapes[Math.floor(Math.random() * hardstyleShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateDubstepWobblePattern() {
        // Half-time kick
        this.sequencerGrid[0].steps[0] = true;
        this.sequencerGrid[0].steps[8] = true;
        // Wobbly bass pattern
        this.sequencerGrid[11].steps[0] = true;
        this.sequencerGrid[11].steps[2] = true;
        this.sequencerGrid[11].steps[4] = true;
        this.sequencerGrid[11].steps[6] = true;
        this.sequencerGrid[11].steps[8] = true;
        this.sequencerGrid[11].steps[10] = true;
        this.sequencerGrid[11].steps[12] = true;
        this.sequencerGrid[11].steps[14] = true;
        // Snare with reverb
        this.sequencerGrid[1].steps[6] = true;
        // Sparse hi-hat
        this.sequencerGrid[2].steps[4] = true;
        this.sequencerGrid[2].steps[12] = true;

        const dubstepShapes = [4]; // PWM (wobble)
        this.synthSeqShape = dubstepShapes[Math.floor(Math.random() * dubstepShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    generateProgressiveTrancePattern() {
        // Driving kick
        for (let i = 0; i < 16; i += 4) {
            this.sequencerGrid[0].steps[i] = true;
        }
        // Rolling snare
        this.sequencerGrid[1].steps[4] = true;
        this.sequencerGrid[1].steps[12] = true;
        // Hi-hat 8ths
        for (let i = 0; i < 16; i += 2) {
            this.sequencerGrid[2].steps[i] = true;
        }
        // Uplifting bass line
        this.sequencerGrid[11].steps[0] = true;
        this.sequencerGrid[11].steps[2] = true;
        this.sequencerGrid[11].steps[4] = true;
        this.sequencerGrid[11].steps[6] = true;
        this.sequencerGrid[11].steps[8] = true;
        this.sequencerGrid[11].steps[10] = true;
        this.sequencerGrid[11].steps[12] = true;
        this.sequencerGrid[11].steps[14] = true;
        // Uplifting synth melody
        this.sequencerGrid[8].steps[0] = true;
        this.sequencerGrid[9].steps[2] = true;
        this.sequencerGrid[10].steps[4] = true;
        this.sequencerGrid[11].steps[6] = true;

        const progtShapes = [1, 3]; // SAW, TRIANGLE
        this.synthSeqShape = progtShapes[Math.floor(Math.random() * progtShapes.length)];
        document.getElementById('synthSeqShape').value = this.synthSeqShape;
    }

    renderSequencerGrid() {
        const grid = document.getElementById('sequencerGrid');
        grid.innerHTML = '';

        // Create grid container
        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'auto repeat(16, 1fr)';
        gridContainer.style.gap = '3px';
        gridContainer.style.alignItems = 'center';

        // Add "DRUM SEQUENCER" header at the very top
        const drumHeader = document.createElement('div');
        drumHeader.style.gridColumn = '1 / -1';
        drumHeader.style.textAlign = 'center';
        drumHeader.style.fontSize = '0.9rem';
        drumHeader.style.fontWeight = 'bold';
        drumHeader.style.color = '#ff0066';
        drumHeader.style.textShadow = '0 0 10px #ff0066';
        drumHeader.style.marginBottom = '10px';
        drumHeader.style.marginTop = '5px';
        drumHeader.textContent = '🥁 DRUM SEQUENCER 🥁';
        gridContainer.appendChild(drumHeader);

        // Header row with step numbers
        const cornerCell = document.createElement('div');
        cornerCell.style.padding = '10px';
        cornerCell.style.fontSize = '0.8rem';
        cornerCell.style.color = '#888';
        cornerCell.textContent = 'TRACK';
        gridContainer.appendChild(cornerCell);

        for (let step = 0; step < 16; step++) {
            const stepHeader = document.createElement('div');
            stepHeader.className = 'step-header';
            stepHeader.textContent = step + 1;
            stepHeader.style.textAlign = 'center';
            stepHeader.style.fontSize = '0.9rem';
            stepHeader.style.color = '#888';
            stepHeader.style.padding = '5px';
            gridContainer.appendChild(stepHeader);
        }

        // Create rows for each track
        this.sequencerGrid.forEach((track, trackIndex) => {
            // Add visual separator between drums (0-7) and synth (8-11)
            if (trackIndex === 8) {
                // Add a full-width separator row
                const separator = document.createElement('div');
                separator.style.gridColumn = '1 / -1';
                separator.style.height = '2px';
                separator.style.background = 'linear-gradient(90deg, transparent, #9d4edd, transparent)';
                separator.style.margin = '10px 0';
                gridContainer.appendChild(separator);

                // Add "SYNTH SEQUENCER" label
                const synthHeader = document.createElement('div');
                synthHeader.style.gridColumn = '1 / -1';
                synthHeader.style.textAlign = 'center';
                synthHeader.style.fontSize = '0.9rem';
                synthHeader.style.fontWeight = 'bold';
                synthHeader.style.color = '#9d4edd';
                synthHeader.style.textShadow = '0 0 10px #9d4edd';
                synthHeader.style.marginBottom = '5px';
                synthHeader.textContent = '♪ SYNTH SEQUENCER ♪';
                gridContainer.appendChild(synthHeader);
            }

            // Track label
            const label = document.createElement('div');
            label.className = 'track-label';
            label.textContent = track.label;
            label.style.padding = '10px';
            label.style.fontSize = '1rem';
            label.style.fontWeight = 'bold';
            label.style.color = track.color;
            label.style.textShadow = `0 0 10px ${track.color}`;
            label.style.whiteSpace = 'nowrap';
            gridContainer.appendChild(label);

            // Step cells
            for (let step = 0; step < 16; step++) {
                const cell = document.createElement('button');
                cell.className = 'seq-cell';
                cell.dataset.track = trackIndex;
                cell.dataset.step = step;

                // Styling
                cell.style.aspectRatio = '1';
                cell.style.border = `2px solid ${track.color}40`;
                cell.style.borderRadius = '5px';
                cell.style.background = track.steps[step] ? track.color : 'rgba(255, 255, 255, 0.05)';
                cell.style.cursor = 'pointer';
                cell.style.transition = 'all 0.2s';
                cell.style.minHeight = '40px';

                if (track.steps[step]) {
                    cell.style.boxShadow = `0 0 15px ${track.color}80`;
                    cell.classList.add('active');
                }

                // Click/touch handler for instant response
                this.addTouchClickListener(cell, () => {
                    this.toggleSequencerCell(trackIndex, step);
                });

                // Hover effect
                cell.addEventListener('mouseenter', () => {
                    if (!track.steps[step]) {
                        cell.style.background = `${track.color}40`;
                    }
                });

                cell.addEventListener('mouseleave', () => {
                    if (!track.steps[step]) {
                        cell.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                });

                gridContainer.appendChild(cell);
            }
        });

        grid.appendChild(gridContainer);
    }

    toggleSequencerCell(trackIndex, step) {
        const track = this.sequencerGrid[trackIndex];
        track.steps[step] = !track.steps[step];

        // Update visual
        const cell = document.querySelector(`[data-track="${trackIndex}"][data-step="${step}"]`);
        if (cell) {
            if (track.steps[step]) {
                cell.style.background = track.color;
                cell.style.boxShadow = `0 0 15px ${track.color}80`;
                cell.classList.add('active');

                // Preview sound
                if (track.isDrum) {
                    this.playDrum(track.drumSound);
                } else if (track.isSynthSeq) {
                    this.playSynthSeqNote(track.note);
                } else {
                    this.playNote(track.note);
                    setTimeout(() => this.stopNote(track.note), 100);
                }
            } else {
                cell.style.background = 'rgba(255, 255, 255, 0.05)';
                cell.style.boxShadow = 'none';
                cell.classList.remove('active');
            }
        }
    }

    // ===== TOUCH/CLICK HELPER =====
    addTouchClickListener(element, callback) {
        // Use touchstart for instant response on mobile, click as fallback
        let isTouch = false;

        element.addEventListener('touchstart', (e) => {
            isTouch = true;
            e.preventDefault(); // Prevent 300ms click delay
            callback(e);
        });

        element.addEventListener('click', (e) => {
            // Only fire click if it wasn't from touch
            if (!isTouch) {
                callback(e);
            }
            isTouch = false;
        });
    }

    // ===== UI SETUP =====
    setupUI() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });

        // SFX Mode Toggle
        document.querySelectorAll('.sfx-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.sfx-mode-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.sfxMode = e.currentTarget.dataset.sfx === 'true';
                console.log('SFX Mode:', this.sfxMode ? 'ON' : 'OFF');
            });
        });

        // Drum Set Selector (EDM / TRAP)
        document.querySelectorAll('.drum-set-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.drum-set-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentDrumSet = e.currentTarget.dataset.set;
                console.log('Drum Set:', this.currentDrumSet.toUpperCase());
            });
        });

        // Voice selector
        document.querySelectorAll('.voice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active from all buttons
                document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
                // Set active on clicked button
                e.currentTarget.classList.add('active');
                // Update current voice
                this.currentVoice = e.currentTarget.dataset.voice;
                console.log('Voice changed to:', this.currentVoice);
            });
        });

        // Shape control
        const shapeSlider = document.getElementById('shapeSlider');
        shapeSlider.addEventListener('input', (e) => {
            this.shapeValue = parseFloat(e.target.value);
            this.updateWaveformDisplay();
        });

        // Sustain amount control
        document.getElementById('sustainAmount').addEventListener('input', (e) => {
            this.sustainAmount = parseInt(e.target.value);
            document.getElementById('sustainAmountDisplay').textContent = this.sustainAmount + '%';
        });

        // Octave buttons
        document.querySelectorAll('.octave-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.octave-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentOctave = parseInt(e.target.dataset.octave);
                console.log(`🖱️ On-screen octave button clicked: ${this.currentOctave}`);
                this.updatePitchDisplay();
            });
        });

        // Pitch bend
        const pitchBend = document.getElementById('pitchBend');
        pitchBend.addEventListener('input', (e) => {
            this.pitchBendValue = parseFloat(e.target.value);
            this.updatePitchBend();
            // Update display
            const cents = Math.round(this.pitchBendValue);
            document.getElementById('pitchDisplay').textContent = cents > 0 ? `+${cents}` : cents;
        });
        pitchBend.addEventListener('mouseup', () => {
            // Auto-return to center
            pitchBend.value = 0;
            this.pitchBendValue = 0;
            this.updatePitchBend();
            document.getElementById('pitchDisplay').textContent = '0';
        });

        // Arpeggiator toggle
        document.getElementById('arpToggle').addEventListener('click', (e) => {
            this.arpEnabled = !this.arpEnabled;
            e.target.classList.toggle('active');
            e.target.textContent = this.arpEnabled ? 'ON' : 'OFF';

            if (this.arpEnabled) {
                this.updateArpNotes();
            } else {
                this.stopArpeggiator();
            }
        });

        // Arp pattern buttons
        document.querySelectorAll('.arp-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.arp-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.arpPattern = e.target.dataset.pattern;
            });
        });

        // Arp scale selector buttons
        document.querySelectorAll('.arp-scale-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.arp-scale-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.arpScale = e.target.dataset.scale;
                this.updateArpNotes(); // Regenerate notes with new scale
            });
        });

        // Arp speed
        document.getElementById('arpSpeed').addEventListener('input', (e) => {
            this.arpSpeed = parseInt(e.target.value);
            document.getElementById('arpSpeedValue').textContent = this.arpSpeed + 'ms';
            if (this.arpInterval) {
                this.stopArpeggiator();
                this.startArpeggiator();
            }
        });

        // SYNTH Delay controls
        document.getElementById('synthDelayTime').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.synthDelay.node.delayTime.value = value;
            document.getElementById('synthDelayTimeValue').textContent = Math.round(value * 1000) + 'ms';
        });

        document.getElementById('synthDelayFeedback').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.synthDelay.feedback.gain.value = value;
            document.getElementById('synthDelayFeedbackValue').textContent = Math.round(value * 100) + '%';
        });

        document.getElementById('synthDelayMix').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.synthDelaySavedMix = value; // Update saved value
            this.synthDelay.wet.gain.value = value;
            this.synthDelay.dry.gain.value = 1 - value;
            document.getElementById('synthDelayMixValue').textContent = Math.round(value * 100) + '%';
        });

        // PHASER Speed control
        document.getElementById('phaserSpeed').addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.phaserSpeed = speed;

            if (speed === 0) {
                // Turn OFF phaser
                this.phaser.wet.gain.value = 0;
                this.phaser.dry.gain.value = 1.0;
                document.getElementById('phaserSpeedValue').textContent = 'OFF';
            } else {
                // Turn ON phaser with speed
                this.phaser.lfo.frequency.value = speed;
                this.phaser.wet.gain.value = 0.75; // 75% wet
                this.phaser.dry.gain.value = 0.5; // 50% dry
                document.getElementById('phaserSpeedValue').textContent = speed.toFixed(1) + ' Hz';
            }
        });

        // DRUM Delay controls
        document.getElementById('drumDelayTime').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.drumDelay.node.delayTime.value = value;
            document.getElementById('drumDelayTimeValue').textContent = Math.round(value * 1000) + 'ms';
        });

        document.getElementById('drumDelayFeedback').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.drumDelay.feedback.gain.value = value;
            document.getElementById('drumDelayFeedbackValue').textContent = Math.round(value * 100) + '%';
        });

        document.getElementById('drumDelayMix').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.drumDelaySavedMix = value; // Update saved value
            this.drumDelay.wet.gain.value = value;
            this.drumDelay.dry.gain.value = 1 - value;
            document.getElementById('drumDelayMixValue').textContent = Math.round(value * 100) + '%';
        });

        // Mixer volume controls
        document.getElementById('drumVolume').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.drumMixer.gain.value = value;
            document.getElementById('drumVolumeValue').textContent = Math.round(value * 100) + '%';
        });

        document.getElementById('synthVolume').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.synthMixer.gain.value = value;
            document.getElementById('synthVolumeValue').textContent = Math.round(value * 100) + '%';
        });

        // Master reverb mix control
        document.getElementById('masterReverbMix').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.masterReverb.wet.gain.value = value;
            this.masterReverb.dry.gain.value = 1 - value;
            document.getElementById('masterReverbMixValue').textContent = Math.round(value * 100) + '%';
        });

        // Lead volume control with exponential curve for real-time volume adjustment
        document.getElementById('leadVolume').addEventListener('input', (e) => {
            const sliderValue = parseFloat(e.target.value) / 100; // Convert 0-100 to 0-1
            // Apply exponential curve: value^2 for smoother, more natural volume change
            const curvedVolume = Math.pow(sliderValue, 2);
            // Control the LEAD voice gain stage in real-time
            this.leadVolumeGain.gain.value = curvedVolume;
            document.getElementById('leadVolumeValue').textContent = Math.round(sliderValue * 100) + '%';
        });

        // Drum pads - use touch for instant response
        document.querySelectorAll('.drum-pad').forEach(pad => {
            this.addTouchClickListener(pad, (e) => {
                const sound = e.currentTarget.dataset.sound;
                this.playDrum(sound);
            });
        });

        // Sequencer controls
        document.getElementById('seqPlay').addEventListener('click', () => {
            if (this.sequencerPlaying) {
                this.stopSequencer();
            } else {
                this.startSequencer();
            }
        });

        document.getElementById('seqStop').addEventListener('click', () => {
            this.stopSequencer();
        });

        document.getElementById('seqClear').addEventListener('click', () => {
            this.clearSequencer();
        });

        document.getElementById('bpmSlider').addEventListener('input', (e) => {
            this.bpm = parseInt(e.target.value);
            document.getElementById('bpmValue').textContent = this.bpm;
            if (this.sequencerPlaying) {
                this.stopSequencer();
                this.startSequencer();
            }
        });

        // Synth Sequencer Controls
        document.getElementById('synthSeqDelay').addEventListener('input', (e) => {
            this.synthSeqDelay = parseFloat(e.target.value);
            document.getElementById('synthSeqDelayValue').textContent = Math.round(this.synthSeqDelay * 1000) + 'ms';
        });

        document.getElementById('synthSeqSustain').addEventListener('input', (e) => {
            this.synthSeqSustain = parseInt(e.target.value);
            document.getElementById('synthSeqSustainValue').textContent = this.synthSeqSustain + '%';
        });

        document.getElementById('synthSeqShape').addEventListener('change', (e) => {
            this.synthSeqShape = parseInt(e.target.value);
        });

        // Random pattern button
        document.getElementById('seqRandom').addEventListener('click', () => {
            this.generateRandomPattern();
        });

        // Initial updates
        this.updateWaveformDisplay();
        this.updatePitchDisplay();
        this.renderSequencerGrid();
    }

    switchMode(mode) {
        this.currentMode = mode;

        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show/hide panels
        if (mode === 'live') {
            document.getElementById('liveMode').classList.add('active');
            document.getElementById('sequencerMode').classList.remove('active');
            this.stopSequencer();
        } else {
            document.getElementById('liveMode').classList.remove('active');
            document.getElementById('sequencerMode').classList.add('active');
        }
    }

    setupKeyboard() {
        const keyboard = document.getElementById('keyboard');
        keyboard.innerHTML = '';

        // Create 2 octaves of keys (C to C)
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const startNote = this.currentOctave * 12; // C of current octave

        console.log(`⌨️ setupKeyboard: Building keyboard from MIDI note ${startNote} to ${startNote + 24} (octave ${this.currentOctave})`);

        for (let i = 0; i < 25; i++) { // 2 octaves
            const midiNote = startNote + i;
            const noteName = notes[i % 12];
            const isBlack = noteName.includes('#');

            const key = document.createElement('div');
            key.className = `key ${isBlack ? 'black' : 'white'}`;
            key.dataset.note = midiNote;

            if (!isBlack) {
                const label = document.createElement('span');
                label.className = 'key-label';
                label.textContent = noteName;
                key.appendChild(label);
            }

            // Mouse events
            key.addEventListener('mousedown', () => {
                console.log(`🖱️ Mouse clicked key: MIDI note ${midiNote} (${noteName})`);
                this.heldKeys.add(midiNote);
                if (this.arpEnabled) {
                    this.updateArpNotes();
                } else {
                    this.playNote(midiNote);
                }
            });

            key.addEventListener('mouseup', () => {
                this.heldKeys.delete(midiNote);
                if (this.arpEnabled) {
                    this.updateArpNotes();
                } else {
                    this.stopNote(midiNote);
                }
            });

            key.addEventListener('mouseleave', () => {
                if (this.heldKeys.has(midiNote)) {
                    this.heldKeys.delete(midiNote);
                    if (this.arpEnabled) {
                        this.updateArpNotes();
                    } else {
                        this.stopNote(midiNote);
                    }
                }
            });

            keyboard.appendChild(key);
        }
    }

    highlightKey(midiNote, active) {
        const key = document.querySelector(`.key[data-note="${midiNote}"]`);
        if (key) {
            if (active) {
                key.classList.add('active');
            } else {
                key.classList.remove('active');
            }
        }
    }

    updateWaveformDisplay() {
        const display = document.getElementById('waveformDisplay');
        const canvas = document.createElement('canvas');
        canvas.width = display.offsetWidth;
        canvas.height = display.offsetHeight;
        display.innerHTML = '';
        display.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const waveType = this.getWaveformType();

        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 2;
            let y;

            switch (waveType) {
                case 'sine':
                    y = Math.sin(t);
                    break;
                case 'sawtooth':
                    y = (t / Math.PI) % 2 - 1;
                    break;
                case 'square':
                    y = Math.sin(t) > 0 ? 1 : -1;
                    break;
                case 'triangle':
                    y = Math.abs((t / Math.PI) % 2 - 1) * 2 - 1;
                    break;
            }

            const py = height / 2 - (y * height / 2) * 0.8;

            if (x === 0) {
                ctx.moveTo(x, py);
            } else {
                ctx.lineTo(x, py);
            }
        }

        ctx.stroke();
    }

    updatePitchDisplay() {
        console.log(`🔄 updatePitchDisplay called - rebuilding keyboard for octave ${this.currentOctave}`);
        this.setupKeyboard(); // Rebuild keyboard with new octave
    }

    updateOctaveUI() {
        // Update octave button visual state
        document.querySelectorAll('.octave-btn').forEach(btn => {
            if (parseInt(btn.dataset.octave) === this.currentOctave) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // ===== VISUALIZATION =====
    startVisualization() {
        const canvas = document.getElementById('visualizer');
        const ctx = canvas.getContext('2d');

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestAnimationFrame(draw);

            this.analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 3;
            ctx.strokeStyle = '#00ff88';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff88';

            ctx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();

            // Frequency bars
            this.analyser.getByteFrequencyData(dataArray);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barX = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

                const hue = (i / bufferLength) * 360;
                ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.6)`;

                ctx.fillRect(barX, canvas.height - barHeight, barWidth, barHeight);

                barX += barWidth + 1;
            }
        };

        draw();
    }
}

// Initialize when page loads
let gradiusNext;

window.addEventListener('DOMContentLoaded', () => {
    gradiusNext = new GradiusNext();
});
