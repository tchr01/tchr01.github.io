class NESSequencer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentStep = 0;
        this.tempo = 80;
        this.stepInterval = null;
        
        this.channels = {
            pulse1: {
                notes: [523.25, 440, 349.23, 293.66, 261.63, 220],
                sequence: [
                    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], // C5 - beat pattern
                    [false, false, true, false, false, false, true, false, false, false, true, false, false, false, false, false], // A4 - accent
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // F4
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // D4
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // C4
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] // A3
                ],
                type: 'square',
                sustain: false,
                sustainedOscillator: null,
                sustainedGain: null,
                currentNote: null
            },
            pulse2: {
                notes: [1046.5, 659.25, 523.25, 392, 329.63, 293.66],
                sequence: [
                    [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // C6 - arpeggio start
                    [false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // E5
                    [false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false], // C5
                    [false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false], // G4
                    [false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false], // E4
                    [false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false] // D4 - arpeggio end
                ],
                type: 'sawtooth',
                sustain: true,
                sustainedOscillator: null,
                sustainedGain: null,
                currentNote: null
            },
            triangle: {
                notes: [130.81, 98, 73.42, 65.41, 49, 36.71],
                sequence: [
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // C3
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // G2
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // D2
                    [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false], // C2 - bass
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // G1
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] // D1
                ],
                type: 'triangle',
                sustain: false,
                sustainedOscillator: null,
                sustainedGain: null,
                currentNote: null
            },
            noise: {
                notes: [0, 1, 2, 3, 4, 5],
                sequence: [
                    [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false], // HI - snare
                    [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false], // LO - hat
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // MID1
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // MID2
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], // CRASH
                    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] // KICK
                ],
                type: 'noise',
                sustain: false,
                sustainedSource: null,
                sustainedGain: null,
                currentNote: null
            }
        };
        
        this.effects = {
            delay: {
                enabled: true,
                time: 0.3,
                feedback: 0.3,
                mix: 0.2,
                delayNode: null,
                feedbackNode: null,
                mixNode: null,
                wetGain: null,
                dryGain: null
            },
            reverb: {
                enabled: true,
                size: 3.6,
                decay: 3.0,
                mix: 0.6,
                convolver: null,
                wetGain: null,
                dryGain: null
            }
        };
        
        this.masterGain = null;
        this.effectsChain = null;
        
        this.initAudio();
        this.initUI();
        this.bindEvents();
        this.updateUIFromSequence();
    }
    
    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupEffects();
        } catch (error) {
            console.error('Web Audio API not supported:', error);
        }
    }
    
    setupEffects() {
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        
        this.setupDelay();
        this.setupReverb();
    }
    
    setupDelay() {
        const delay = this.effects.delay;
        delay.delayNode = this.audioContext.createDelay(1.0);
        delay.feedbackNode = this.audioContext.createGain();
        delay.wetGain = this.audioContext.createGain();
        delay.dryGain = this.audioContext.createGain();
        delay.mixNode = this.audioContext.createGain();
        
        delay.delayNode.delayTime.setValueAtTime(delay.time, this.audioContext.currentTime);
        delay.feedbackNode.gain.setValueAtTime(delay.feedback, this.audioContext.currentTime);
        delay.wetGain.gain.setValueAtTime(delay.mix, this.audioContext.currentTime);
        delay.dryGain.gain.setValueAtTime(1 - delay.mix, this.audioContext.currentTime);
        
        delay.delayNode.connect(delay.feedbackNode);
        delay.feedbackNode.connect(delay.delayNode);
        delay.delayNode.connect(delay.wetGain);
        
        delay.wetGain.connect(delay.mixNode);
        delay.dryGain.connect(delay.mixNode);
        delay.mixNode.connect(this.masterGain);
    }
    
    setupReverb() {
        const reverb = this.effects.reverb;
        reverb.convolver = this.audioContext.createConvolver();
        reverb.wetGain = this.audioContext.createGain();
        reverb.dryGain = this.audioContext.createGain();
        
        reverb.wetGain.gain.setValueAtTime(reverb.mix, this.audioContext.currentTime);
        reverb.dryGain.gain.setValueAtTime(1 - reverb.mix, this.audioContext.currentTime);
        
        this.createReverbImpulse(reverb.size, reverb.decay);
        
        reverb.convolver.connect(reverb.wetGain);
        reverb.wetGain.connect(this.masterGain);
        reverb.dryGain.connect(this.masterGain);
    }
    
    createReverbImpulse(roomSize, decay) {
        const length = this.audioContext.sampleRate * roomSize;
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const n = length - i;
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
            }
        }
        
        this.effects.reverb.convolver.buffer = impulse;
    }
    
    initUI() {
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.tempoSlider = document.getElementById('tempoSlider');
        this.tempoValue = document.getElementById('tempoValue');
        this.steps = document.querySelectorAll('.step');
        
        this.delayToggle = document.getElementById('delayToggle');
        this.delayTime = document.getElementById('delayTime');
        this.delayTimeValue = document.getElementById('delayTimeValue');
        this.delayFeedback = document.getElementById('delayFeedback');
        this.delayFeedbackValue = document.getElementById('delayFeedbackValue');
        this.delayMix = document.getElementById('delayMix');
        this.delayMixValue = document.getElementById('delayMixValue');
        
        this.reverbToggle = document.getElementById('reverbToggle');
        this.reverbSize = document.getElementById('reverbSize');
        this.reverbSizeValue = document.getElementById('reverbSizeValue');
        this.reverbDecay = document.getElementById('reverbDecay');
        this.reverbDecayValue = document.getElementById('reverbDecayValue');
        this.reverbMix = document.getElementById('reverbMix');
        this.reverbMixValue = document.getElementById('reverbMixValue');
        
        this.pulse1Sustain = document.getElementById('pulse1Sustain');
        this.pulse2Sustain = document.getElementById('pulse2Sustain');
        this.triangleSustain = document.getElementById('triangleSustain');
        this.noiseSustain = document.getElementById('noiseSustain');
        
        this.exportLoops = document.getElementById('exportLoops');
        this.exportLoopsLabel = document.getElementById('exportLoopsLabel');
        this.exportBtn = document.getElementById('exportBtn');
        this.exportStatus = document.getElementById('exportStatus');
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        this.tempoSlider.addEventListener('input', (e) => {
            this.tempo = parseInt(e.target.value);
            this.tempoValue.textContent = this.tempo;
            if (this.isPlaying) {
                this.stop();
                this.play();
            }
        });
        
        this.steps.forEach(step => {
            step.addEventListener('click', (e) => {
                const stepIndex = parseInt(e.target.dataset.step);
                const noteIndex = parseInt(e.target.dataset.note);
                const channel = e.target.dataset.channel;
                this.toggleStep(stepIndex, noteIndex, channel);
                this.previewNote(noteIndex, channel);
            });
        });
        
        this.delayToggle.addEventListener('click', () => this.toggleDelay());
        this.delayTime.addEventListener('input', (e) => this.updateDelayTime(parseFloat(e.target.value)));
        this.delayFeedback.addEventListener('input', (e) => this.updateDelayFeedback(parseFloat(e.target.value)));
        this.delayMix.addEventListener('input', (e) => this.updateDelayMix(parseFloat(e.target.value)));
        
        this.reverbToggle.addEventListener('click', () => this.toggleReverb());
        this.reverbSize.addEventListener('input', (e) => this.updateReverbSize(parseFloat(e.target.value)));
        this.reverbDecay.addEventListener('input', (e) => this.updateReverbDecay(parseFloat(e.target.value)));
        this.reverbMix.addEventListener('input', (e) => this.updateReverbMix(parseFloat(e.target.value)));
        
        this.pulse1Sustain.addEventListener('click', () => this.toggleSustain('pulse1'));
        this.pulse2Sustain.addEventListener('click', () => this.toggleSustain('pulse2'));
        this.triangleSustain.addEventListener('click', () => this.toggleSustain('triangle'));
        this.noiseSustain.addEventListener('click', () => this.toggleSustain('noise'));
        
        this.exportLoops.addEventListener('input', (e) => this.updateExportLoops(parseInt(e.target.value)));
        this.exportBtn.addEventListener('click', () => this.exportWAV());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            }
        });
    }
    
    clearAll() {
        this.stop();
        
        Object.keys(this.channels).forEach(channelName => {
            const channel = this.channels[channelName];
            for (let noteIndex = 0; noteIndex < channel.sequence.length; noteIndex++) {
                for (let stepIndex = 0; stepIndex < 16; stepIndex++) {
                    channel.sequence[noteIndex][stepIndex] = false;
                }
            }
        });
        
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
    }
    
    toggleDelay() {
        this.effects.delay.enabled = !this.effects.delay.enabled;
        this.delayToggle.textContent = this.effects.delay.enabled ? 'ON' : 'OFF';
        this.delayToggle.classList.toggle('active', this.effects.delay.enabled);
    }
    
    updateDelayTime(value) {
        this.effects.delay.time = value;
        this.delayTimeValue.textContent = value.toFixed(2) + 's';
        if (this.effects.delay.delayNode) {
            this.effects.delay.delayNode.delayTime.setValueAtTime(value, this.audioContext.currentTime);
        }
    }
    
    updateDelayFeedback(value) {
        this.effects.delay.feedback = value;
        this.delayFeedbackValue.textContent = Math.round(value * 100) + '%';
        if (this.effects.delay.feedbackNode) {
            this.effects.delay.feedbackNode.gain.setValueAtTime(value, this.audioContext.currentTime);
        }
    }
    
    updateDelayMix(value) {
        this.effects.delay.mix = value;
        this.delayMixValue.textContent = Math.round(value * 100) + '%';
        if (this.effects.delay.wetGain && this.effects.delay.dryGain) {
            this.effects.delay.wetGain.gain.setValueAtTime(value, this.audioContext.currentTime);
            this.effects.delay.dryGain.gain.setValueAtTime(1 - value, this.audioContext.currentTime);
        }
    }
    
    toggleReverb() {
        this.effects.reverb.enabled = !this.effects.reverb.enabled;
        this.reverbToggle.textContent = this.effects.reverb.enabled ? 'ON' : 'OFF';
        this.reverbToggle.classList.toggle('active', this.effects.reverb.enabled);
    }
    
    updateReverbSize(value) {
        this.effects.reverb.size = value;
        this.reverbSizeValue.textContent = value.toFixed(1);
        this.createReverbImpulse(value, this.effects.reverb.decay);
    }
    
    updateReverbDecay(value) {
        this.effects.reverb.decay = value;
        this.reverbDecayValue.textContent = value.toFixed(1);
        this.createReverbImpulse(this.effects.reverb.size, value);
    }
    
    updateReverbMix(value) {
        this.effects.reverb.mix = value;
        this.reverbMixValue.textContent = Math.round(value * 100) + '%';
        if (this.effects.reverb.wetGain && this.effects.reverb.dryGain) {
            this.effects.reverb.wetGain.gain.setValueAtTime(value, this.audioContext.currentTime);
            this.effects.reverb.dryGain.gain.setValueAtTime(1 - value, this.audioContext.currentTime);
        }
    }
    
    toggleSustain(channelName) {
        const channel = this.channels[channelName];
        channel.sustain = !channel.sustain;
        
        const button = document.getElementById(`${channelName}Sustain`);
        button.textContent = `SUSTAIN: ${channel.sustain ? 'ON' : 'OFF'}`;
        button.classList.toggle('active', channel.sustain);
        
        if (!channel.sustain) {
            this.stopSustainedNote(channelName);
        }
    }
    
    stopSustainedNote(channelName) {
        const channel = this.channels[channelName];
        
        if (channelName === 'noise') {
            if (channel.sustainedSource) {
                try {
                    channel.sustainedSource.stop();
                } catch (e) {}
                channel.sustainedSource = null;
            }
        } else {
            if (channel.sustainedOscillator) {
                try {
                    channel.sustainedOscillator.stop();
                } catch (e) {}
                channel.sustainedOscillator = null;
            }
        }
        
        if (channel.sustainedGain) {
            channel.sustainedGain.disconnect();
            channel.sustainedGain = null;
        }
        
        channel.currentNote = null;
    }
    
    toggleStep(stepIndex, noteIndex, channel) {
        this.channels[channel].sequence[noteIndex][stepIndex] = !this.channels[channel].sequence[noteIndex][stepIndex];
        const step = document.querySelector(`[data-step="${stepIndex}"][data-note="${noteIndex}"][data-channel="${channel}"]`);
        step.classList.toggle('active', this.channels[channel].sequence[noteIndex][stepIndex]);
    }
    
    async previewNote(noteIndex, channel) {
        if (!this.audioContext) {
            await this.initAudio();
        }
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        const channelData = this.channels[channel];
        
        if (channel === 'noise') {
            this.playNoise(noteIndex, 0.2);
        } else {
            this.playNote(channelData.notes[noteIndex], 0.2, channelData.type);
        }
    }
    
    async togglePlay() {
        if (!this.audioContext) {
            await this.initAudio();
        }
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }
    
    play() {
        this.isPlaying = true;
        this.playBtn.classList.add('playing');
        
        const stepDuration = (60 / this.tempo / 4) * 1000;
        
        this.stepInterval = setInterval(() => {
            this.playStep();
            this.updateStepIndicator();
            this.currentStep = (this.currentStep + 1) % 16;
        }, stepDuration);
    }
    
    stop() {
        this.isPlaying = false;
        this.playBtn.classList.remove('playing');
        
        if (this.stepInterval) {
            clearInterval(this.stepInterval);
            this.stepInterval = null;
        }
        
        Object.keys(this.channels).forEach(channelName => {
            this.stopSustainedNote(channelName);
        });
        
        this.currentStep = 0;
        this.clearStepIndicators();
    }
    
    playStep() {
        Object.keys(this.channels).forEach(channelName => {
            const channel = this.channels[channelName];
            let noteToPlay = null;
            
            for (let noteIndex = 0; noteIndex < channel.sequence.length; noteIndex++) {
                if (channel.sequence[noteIndex][this.currentStep]) {
                    noteToPlay = noteIndex;
                    break;
                }
            }
            
            if (channel.sustain) {
                if (noteToPlay !== null && noteToPlay !== channel.currentNote) {
                    this.stopSustainedNote(channelName);
                    this.playSustainedNote(channelName, noteToPlay);
                    channel.currentNote = noteToPlay;
                }
            } else {
                if (noteToPlay !== null) {
                    if (channelName === 'noise') {
                        this.playNoise(noteToPlay, 0.1);
                    } else {
                        this.playNote(channel.notes[noteToPlay], 0.1, channel.type);
                    }
                }
            }
        });
    }
    
    playSustainedNote(channelName, noteIndex) {
        if (!this.audioContext) return;
        
        const channel = this.channels[channelName];
        
        if (channelName === 'noise') {
            this.playSustainedNoise(channelName, noteIndex);
        } else {
            const frequency = channel.notes[noteIndex];
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = channel.type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            let volume = 0.25;
            if (channel.type === 'triangle') volume = 0.4;
            if (channel.type === 'sawtooth') volume = 0.2;
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            
            oscillator.connect(gainNode);
            this.connectToEffects(gainNode);
            
            channel.sustainedOscillator = oscillator;
            channel.sustainedGain = gainNode;
            
            oscillator.start(this.audioContext.currentTime);
        }
    }
    
    playSustainedNoise(channelName, type) {
        if (!this.audioContext) return;
        
        const channel = this.channels[channelName];
        const bufferSize = this.audioContext.sampleRate * 10;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        let lastValue = 0;
        
        switch(type) {
            case 0: // HI - white noise
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.2;
                }
                break;
            case 1: // LO - periodic noise
                for (let i = 0; i < bufferSize; i++) {
                    if (i % 93 === 0) {
                        lastValue = Math.random() * 2 - 1;
                    }
                    data[i] = lastValue * 0.15;
                }
                break;
            case 2: // MID1 - medium freq noise
                for (let i = 0; i < bufferSize; i++) {
                    if (i % 47 === 0) {
                        lastValue = Math.random() * 2 - 1;
                    }
                    data[i] = lastValue * 0.18;
                }
                break;
            case 3: // MID2 - different medium freq
                for (let i = 0; i < bufferSize; i++) {
                    if (i % 31 === 0) {
                        lastValue = Math.random() * 2 - 1;
                    }
                    data[i] = lastValue * 0.18;
                }
                break;
            case 4: // CRASH - harsh noise
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.25;
                }
                break;
            case 5: // KICK - low freq thump
                for (let i = 0; i < bufferSize; i++) {
                    if (i % 186 === 0) {
                        lastValue = Math.random() * 2 - 1;
                    }
                    data[i] = lastValue * 0.22;
                }
                break;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = true;
        gainNode.gain.setValueAtTime(0.6, this.audioContext.currentTime);
        
        source.connect(gainNode);
        this.connectToEffects(gainNode);
        
        channel.sustainedSource = source;
        channel.sustainedGain = gainNode;
        
        source.start(this.audioContext.currentTime);
    }
    
    playNote(frequency, duration, waveType = 'square') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        let volume = 0.3;
        if (waveType === 'triangle') volume = 0.5;
        if (waveType === 'sawtooth') volume = 0.25;
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        this.connectToEffects(gainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playNoise(type, duration) {
        if (!this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        let lastValue = 0;
        
        switch(type) {
            case 0: // HI - white noise
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.3;
                }
                break;
            case 1: // LO - periodic noise
                for (let i = 0; i < bufferSize; i++) {
                    if (i % 93 === 0) {
                        lastValue = Math.random() * 2 - 1;
                    }
                    data[i] = lastValue * 0.2;
                }
                break;
            case 2: // MID1 - medium freq noise
                for (let i = 0; i < bufferSize; i++) {
                    if (i % 47 === 0) {
                        lastValue = Math.random() * 2 - 1;
                    }
                    data[i] = lastValue * 0.25;
                }
                break;
            case 3: // MID2 - different medium freq
                for (let i = 0; i < bufferSize; i++) {
                    if (i % 31 === 0) {
                        lastValue = Math.random() * 2 - 1;
                    }
                    data[i] = lastValue * 0.25;
                }
                break;
            case 4: // CRASH - harsh noise
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.4;
                }
                break;
            case 5: // KICK - low freq thump
                for (let i = 0; i < bufferSize; i++) {
                    if (i % 186 === 0) {
                        lastValue = Math.random() * 2 - 1;
                    }
                    data[i] = lastValue * 0.35;
                }
                break;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        source.connect(gainNode);
        this.connectToEffects(gainNode);
        
        source.start(this.audioContext.currentTime);
    }
    
    connectToEffects(sourceNode) {
        let currentNode = sourceNode;
        
        if (this.effects.delay.enabled && this.effects.delay.delayNode) {
            currentNode.connect(this.effects.delay.delayNode);
            currentNode.connect(this.effects.delay.dryGain);
            currentNode = this.effects.delay.mixNode;
        }
        
        if (this.effects.reverb.enabled && this.effects.reverb.convolver) {
            currentNode.connect(this.effects.reverb.convolver);
            currentNode.connect(this.effects.reverb.dryGain);
        } else {
            currentNode.connect(this.masterGain);
        }
    }
    
    updateStepIndicator() {
        this.clearStepIndicators();
        
        Object.keys(this.channels).forEach(channelName => {
            const channel = this.channels[channelName];
            for (let noteIndex = 0; noteIndex < channel.sequence.length; noteIndex++) {
                const step = document.querySelector(`[data-step="${this.currentStep}"][data-note="${noteIndex}"][data-channel="${channelName}"]`);
                if (step) {
                    step.classList.add('playing');
                    
                    setTimeout(() => {
                        step.classList.remove('playing');
                    }, 100);
                }
            }
        });
        
        const stepNumber = document.querySelectorAll('.step-number')[this.currentStep + 1];
        if (stepNumber) {
            stepNumber.style.background = '#ff6600';
            stepNumber.style.color = '#000';
            setTimeout(() => {
                stepNumber.style.background = '#003300';
                stepNumber.style.color = '#00ff00';
            }, 100);
        }
    }
    
    clearStepIndicators() {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('playing');
        });
        
        document.querySelectorAll('.step-number').forEach(stepNumber => {
            stepNumber.style.background = '#003300';
            stepNumber.style.color = '#00ff00';
        });
    }
    
    updateUIFromSequence() {
        Object.keys(this.channels).forEach(channelName => {
            const channel = this.channels[channelName];
            for (let noteIndex = 0; noteIndex < channel.sequence.length; noteIndex++) {
                for (let stepIndex = 0; stepIndex < 16; stepIndex++) {
                    if (channel.sequence[noteIndex][stepIndex]) {
                        const step = document.querySelector(`[data-step="${stepIndex}"][data-note="${noteIndex}"][data-channel="${channelName}"]`);
                        if (step) {
                            step.classList.add('active');
                        }
                    }
                }
            }
        });
    }
    
    updateExportLoops(value) {
        this.exportLoopsLabel.textContent = `x${value}`;
    }
    
    async exportWAV() {
        if (!this.audioContext) {
            await this.initAudio();
        }
        
        this.exportBtn.disabled = true;
        this.exportStatus.textContent = 'Rendering...';
        
        const loops = parseInt(this.exportLoops.value);
        const stepDuration = (60 / this.tempo / 4);
        const totalDuration = stepDuration * 16 * loops;
        const sampleRate = this.audioContext.sampleRate;
        const totalSamples = Math.floor(totalDuration * sampleRate);
        
        // Create offline context for rendering
        const offlineContext = new OfflineAudioContext(2, totalSamples, sampleRate);
        
        // Set up effects chain in offline context
        const offlineMasterGain = offlineContext.createGain();
        offlineMasterGain.connect(offlineContext.destination);
        
        // Render the sequence
        let currentTime = 0;
        const stepDurationSec = stepDuration;
        
        for (let loop = 0; loop < loops; loop++) {
            for (let step = 0; step < 16; step++) {
                this.renderStep(offlineContext, offlineMasterGain, step, currentTime);
                currentTime += stepDurationSec;
            }
        }
        
        try {
            const renderedBuffer = await offlineContext.startRendering();
            this.downloadWAV(renderedBuffer);
            this.exportStatus.textContent = 'Export complete!';
            setTimeout(() => {
                this.exportStatus.textContent = '';
            }, 3000);
        } catch (error) {
            this.exportStatus.textContent = 'Export failed!';
            console.error('Export error:', error);
        }
        
        this.exportBtn.disabled = false;
    }
    
    renderStep(offlineContext, masterGain, stepIndex, startTime) {
        Object.keys(this.channels).forEach(channelName => {
            const channel = this.channels[channelName];
            let noteToPlay = null;
            
            for (let noteIndex = 0; noteIndex < channel.sequence.length; noteIndex++) {
                if (channel.sequence[noteIndex][stepIndex]) {
                    noteToPlay = noteIndex;
                    break;
                }
            }
            
            if (noteToPlay !== null) {
                if (channelName === 'noise') {
                    this.renderNoise(offlineContext, masterGain, noteToPlay, startTime, 0.1);
                } else {
                    this.renderNote(offlineContext, masterGain, channel.notes[noteToPlay], startTime, 0.1, channel.type);
                }
            }
        });
    }
    
    renderNote(offlineContext, masterGain, frequency, startTime, duration, waveType) {
        const oscillator = offlineContext.createOscillator();
        const gainNode = offlineContext.createGain();
        
        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        
        let volume = 0.3;
        if (waveType === 'triangle') volume = 0.5;
        if (waveType === 'sawtooth') volume = 0.25;
        
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(masterGain);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    renderNoise(offlineContext, masterGain, type, startTime, duration) {
        const bufferSize = Math.floor(offlineContext.sampleRate * duration);
        const buffer = offlineContext.createBuffer(1, bufferSize, offlineContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        if (type === 0) {
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.3;
            }
        } else {
            let lastValue = 0;
            for (let i = 0; i < bufferSize; i++) {
                if (i % 93 === 0) {
                    lastValue = Math.random() * 2 - 1;
                }
                data[i] = lastValue * 0.2;
            }
        }
        
        const source = offlineContext.createBufferSource();
        const gainNode = offlineContext.createGain();
        
        source.buffer = buffer;
        gainNode.gain.setValueAtTime(0.8, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        source.connect(gainNode);
        gainNode.connect(masterGain);
        
        source.start(startTime);
    }
    
    downloadWAV(audioBuffer) {
        const wav = this.audioBufferToWav(audioBuffer);
        const blob = new Blob([wav], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `gradius-sequence-${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    audioBufferToWav(buffer) {
        const length = buffer.length;
        const numberOfChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
        const view = new DataView(arrayBuffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * numberOfChannels * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numberOfChannels * 2, true);
        view.setUint16(32, numberOfChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * numberOfChannels * 2, true);
        
        // Convert audio data
        let offset = 44;
        for (let i = 0; i < length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
                view.setInt16(offset, sample * 0x7FFF, true);
                offset += 2;
            }
        }
        
        return arrayBuffer;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NESSequencer();
});