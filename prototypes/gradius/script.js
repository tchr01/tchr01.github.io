class NESSequencer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentStep = 0;
        this.tempo = 120;
        this.stepInterval = null;
        
        this.channels = {
            pulse1: {
                notes: [523.25, 440, 349.23, 261.63],
                sequence: Array(4).fill().map(() => Array(16).fill(false)),
                type: 'square',
                sustain: false,
                sustainedOscillator: null,
                sustainedGain: null,
                currentNote: null
            },
            pulse2: {
                notes: [1046.5, 659.25, 523.25, 392],
                sequence: Array(4).fill().map(() => Array(16).fill(false)),
                type: 'sawtooth',
                sustain: false,
                sustainedOscillator: null,
                sustainedGain: null,
                currentNote: null
            },
            triangle: {
                notes: [130.81, 98, 73.42, 65.41, 49, 36.71],
                sequence: Array(6).fill().map(() => Array(16).fill(false)),
                type: 'triangle',
                sustain: false,
                sustainedOscillator: null,
                sustainedGain: null,
                currentNote: null
            },
            noise: {
                notes: [0, 1],
                sequence: Array(2).fill().map(() => Array(16).fill(false)),
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
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stopBtn.addEventListener('click', () => this.stop());
        
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
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            }
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
        this.playBtn.textContent = 'STOP';
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
        this.playBtn.textContent = 'PLAY';
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
        
        if (type === 0) {
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.2;
            }
        } else {
            let lastValue = 0;
            for (let i = 0; i < bufferSize; i++) {
                if (i % 93 === 0) {
                    lastValue = Math.random() * 2 - 1;
                }
                data[i] = lastValue * 0.15;
            }
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
}

document.addEventListener('DOMContentLoaded', () => {
    new NESSequencer();
});