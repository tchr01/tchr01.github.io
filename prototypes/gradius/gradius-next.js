// GradiusNext - EDM Synth & Drums with MIDI Support
class GradiusNext {
    constructor() {
        // Audio Context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
        this.drumMixer.gain.value = 1.0;
        this.drumMixer.connect(this.analyser);

        this.synthMixer = this.audioContext.createGain();
        this.synthMixer.gain.value = 1.0;
        this.synthMixer.connect(this.analyser);

        // Separate effects chains
        this.drumDelay = { node: null, feedback: null, wet: null, dry: null };
        this.synthDelay = { node: null, feedback: null, wet: null, dry: null };
        this.drumDelaySavedMix = 0.3; // Save mix value when toggling off
        this.synthDelaySavedMix = 0.3; // Save mix value when toggling off
        this.setupDelayChains();

        // Synth settings
        this.currentOctave = 4;
        this.pitchBendValue = 0;
        this.waveformType = 'sawtooth'; // sine, sawtooth, square, triangle
        this.shapeValue = 1; // 0-4 (sine, saw, square, tri, pwm)

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

        // Sustain pedal
        this.sustainEnabled = false;
        this.sustainedNotes = new Set(); // Notes held by sustain

        // Active notes tracking
        this.activeNotes = new Map(); // MIDI note number -> {osc, gain}
        this.heldKeys = new Set(); // Track which keys are held

        // Drum samples
        this.drumBuffers = {};
        this.loadingDrums = false;

        // MIDI
        this.midiAccess = null;
        this.midiInputs = [];

        // Sequencer
        this.sequencerPlaying = false;
        this.currentStep = 0;
        this.bpm = 120;
        this.sequencerInterval = null;
        this.sequencerGrid = this.createEmptySequencer();

        // UI Mode
        this.currentMode = 'live'; // 'live' or 'sequencer'

        // Initialize
        this.init();
    }

    async init() {
        this.setupUI();
        await this.loadDrumSamples();
        await this.initMIDI();
        this.setupKeyboard();
        this.startVisualization();

        console.log('GradiusNext initialized!');
    }

    // ===== AUDIO SETUP =====
    setupDelayChains() {
        // Create DRUM delay chain
        this.drumDelay.node = this.audioContext.createDelay(2.0);
        this.drumDelay.node.delayTime.value = 0.3;

        this.drumDelay.feedback = this.audioContext.createGain();
        this.drumDelay.feedback.gain.value = 0.3;

        this.drumDelay.wet = this.audioContext.createGain();
        this.drumDelay.wet.gain.value = 0.0; // Off by default

        this.drumDelay.dry = this.audioContext.createGain();
        this.drumDelay.dry.gain.value = 1.0;

        // Connect drum delay chain
        this.drumDelay.node.connect(this.drumDelay.feedback);
        this.drumDelay.feedback.connect(this.drumDelay.node);
        this.drumDelay.node.connect(this.drumDelay.wet);
        this.drumDelay.wet.connect(this.drumMixer);
        this.drumDelay.dry.connect(this.drumMixer);

        // Create SYNTH delay chain
        this.synthDelay.node = this.audioContext.createDelay(2.0);
        this.synthDelay.node.delayTime.value = 0.3;

        this.synthDelay.feedback = this.audioContext.createGain();
        this.synthDelay.feedback.gain.value = 0.3;

        this.synthDelay.wet = this.audioContext.createGain();
        this.synthDelay.wet.gain.value = 0.3; // On by default

        this.synthDelay.dry = this.audioContext.createGain();
        this.synthDelay.dry.gain.value = 0.7;

        // Connect synth delay chain
        this.synthDelay.node.connect(this.synthDelay.feedback);
        this.synthDelay.feedback.connect(this.synthDelay.node);
        this.synthDelay.node.connect(this.synthDelay.wet);
        this.synthDelay.wet.connect(this.synthMixer);
        this.synthDelay.dry.connect(this.synthMixer);
    }

    getDrumDestination() {
        // Return drum audio destination
        return this.drumDelay.node;
    }

    getSynthDestination() {
        // Return synth audio destination
        return this.synthDelay.node;
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

    playDrum(drumName) {
        if (!this.drumBuffers[drumName]) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = this.drumBuffers[drumName];

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

        // Connect audio chain - route through synth delay
        osc.connect(gain);
        gain.connect(this.synthDelay.node);
        gain.connect(this.synthDelay.dry);

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
        // If sustain is enabled and not forcing stop, sustain the note
        if (this.sustainEnabled && !forceStop) {
            this.sustainedNotes.add(midiNote);
            return; // Don't actually stop the note
        }

        const note = this.activeNotes.get(midiNote);
        if (!note) return;

        const { osc, gain, voice } = note;
        const now = this.audioContext.currentTime;
        const releaseTime = voice ? voice.release : 0.1;

        // Release envelope
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + releaseTime);

        osc.stop(now + releaseTime);

        this.activeNotes.delete(midiNote);
        this.sustainedNotes.delete(midiNote);
        this.highlightKey(midiNote, false);
    }

    releaseSustainedNotes() {
        // Stop all sustained notes
        const notesToRelease = Array.from(this.sustainedNotes);
        for (const midiNote of notesToRelease) {
            this.stopNote(midiNote, true); // Force stop
        }
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
        this.arpNotes = Array.from(this.heldKeys).sort((a, b) => a - b);

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

        switch (command) {
            case 9: // Note On
                if (velocity > 0) {
                    this.heldKeys.add(note);
                    if (this.arpEnabled) {
                        this.updateArpNotes();
                    } else {
                        this.playNote(note);
                    }
                } else {
                    // Velocity 0 is Note Off
                    this.heldKeys.delete(note);
                    if (this.arpEnabled) {
                        this.updateArpNotes();
                    } else {
                        this.stopNote(note);
                    }
                }
                break;

            case 8: // Note Off
                this.heldKeys.delete(note);
                if (this.arpEnabled) {
                    this.updateArpNotes();
                } else {
                    this.stopNote(note);
                }
                break;

            case 11: // Control Change
                if (note === 1) {
                    // Mod wheel (CC1) controls shape
                    this.shapeValue = (velocity / 127) * 4;
                    document.getElementById('shapeSlider').value = this.shapeValue;
                    this.updateWaveformDisplay();
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
        // 8 tracks: all drum instruments
        const drumTracks = [
            { steps: Array(16).fill(false), isDrum: true, drumSound: 'kick', label: 'KICK', color: '#ff0066' },
            { steps: Array(16).fill(false), isDrum: true, drumSound: 'snare', label: 'SNARE', color: '#ffaa00' },
            { steps: Array(16).fill(false), isDrum: true, drumSound: 'hihat-closed', label: 'HI-HAT', color: '#00ccff' },
            { steps: Array(16).fill(false), isDrum: true, drumSound: 'hihat-open', label: 'HAT OPEN', color: '#00ddff' },
            { steps: Array(16).fill(false), isDrum: true, drumSound: 'clap', label: 'CLAP', color: '#ff00ff' },
            { steps: Array(16).fill(false), isDrum: true, drumSound: 'tom', label: 'TOM', color: '#00ff88' },
            { steps: Array(16).fill(false), isDrum: true, drumSound: 'crash', label: 'CRASH', color: '#ffff00' },
            { steps: Array(16).fill(false), isDrum: true, drumSound: 'rim', label: 'RIMSHOT', color: '#ff6600' }
        ];

        return drumTracks;
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

        // Update UI in both modes
        document.getElementById('seqPlay').classList.add('active');
        document.getElementById('beatPlay').classList.add('active');
        document.getElementById('beatPlay').textContent = '⏸ PAUSE';
        document.getElementById('beatStatus').classList.add('playing');
    }

    stopSequencer() {
        if (!this.sequencerPlaying) return;

        this.sequencerPlaying = false;

        if (this.sequencerInterval) {
            clearInterval(this.sequencerInterval);
            this.sequencerInterval = null;
        }

        this.stopAllNotes();

        // Update UI in both modes
        document.getElementById('seqPlay').classList.remove('active');
        document.getElementById('beatPlay').classList.remove('active');
        document.getElementById('beatPlay').textContent = '▶ PLAY BEAT';
        document.getElementById('beatStatus').classList.remove('playing');
    }

    playSequencerStep() {
        this.sequencerGrid.forEach((track, trackIndex) => {
            if (track.steps[this.currentStep]) {
                if (track.isDrum) {
                    this.playDrum(track.drumSound);
                } else {
                    this.playNote(track.note);
                    setTimeout(() => this.stopNote(track.note), 50);
                }
            }
        });

        // Update visual
        this.highlightSequencerStep(this.currentStep);
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
        this.sequencerGrid = this.createEmptySequencer();
        this.renderSequencerGrid();
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

                // Click handler
                cell.addEventListener('click', () => {
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

    // ===== UI SETUP =====
    setupUI() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
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

        // Octave buttons
        document.querySelectorAll('.octave-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.octave-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentOctave = parseInt(e.target.dataset.octave);
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

        // Sustain toggle
        document.getElementById('sustainToggle').addEventListener('click', (e) => {
            this.sustainEnabled = !this.sustainEnabled;
            e.target.classList.toggle('active');
            e.target.textContent = this.sustainEnabled ? 'ON' : 'OFF';

            // If turning off sustain, release all sustained notes
            if (!this.sustainEnabled) {
                this.releaseSustainedNotes();
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

        // Arp speed
        document.getElementById('arpSpeed').addEventListener('input', (e) => {
            this.arpSpeed = parseInt(e.target.value);
            document.getElementById('arpSpeedValue').textContent = this.arpSpeed + 'ms';
            if (this.arpInterval) {
                this.stopArpeggiator();
                this.startArpeggiator();
            }
        });

        // SYNTH Delay toggle
        document.getElementById('synthDelayToggle').addEventListener('click', (e) => {
            const isActive = e.target.classList.toggle('active');
            e.target.textContent = isActive ? 'ON' : 'OFF';

            if (isActive) {
                // Turn ON - restore saved mix value
                this.synthDelay.wet.gain.value = this.synthDelaySavedMix;
                this.synthDelay.dry.gain.value = 1 - this.synthDelaySavedMix;
            } else {
                // Turn OFF - save current mix and set to 0
                this.synthDelaySavedMix = this.synthDelay.wet.gain.value;
                this.synthDelay.wet.gain.value = 0;
                this.synthDelay.dry.gain.value = 1;
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

        // DRUM Delay toggle
        document.getElementById('drumDelayToggle').addEventListener('click', (e) => {
            const isActive = e.target.classList.toggle('active');
            e.target.textContent = isActive ? 'ON' : 'OFF';

            if (isActive) {
                // Turn ON - restore saved mix value
                this.drumDelay.wet.gain.value = this.drumDelaySavedMix;
                this.drumDelay.dry.gain.value = 1 - this.drumDelaySavedMix;
            } else {
                // Turn OFF - save current mix and set to 0
                this.drumDelaySavedMix = this.drumDelay.wet.gain.value;
                this.drumDelay.wet.gain.value = 0;
                this.drumDelay.dry.gain.value = 1;
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

        // Drum pads
        document.querySelectorAll('.drum-pad').forEach(pad => {
            pad.addEventListener('click', (e) => {
                const sound = e.currentTarget.dataset.sound;
                this.playDrum(sound);
            });
        });

        // Beat sequencer controls in Live Mode
        document.getElementById('beatPlay').addEventListener('click', () => {
            if (this.sequencerPlaying) {
                this.stopSequencer();
            } else {
                this.startSequencer();
            }
        });

        document.getElementById('beatStop').addEventListener('click', () => {
            this.stopSequencer();
        });

        document.getElementById('beatEdit').addEventListener('click', () => {
            // Switch to sequencer mode for editing
            this.switchMode('sequencer');
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
        this.setupKeyboard(); // Rebuild keyboard with new octave
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
