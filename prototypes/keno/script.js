// Massachusetts Keno Simulator
// Implements true cryptographic randomness and authentic game mechanics

class KenoGame {
    constructor() {
        this.selectedNumbers = new Set();
        this.drawnNumbers = [];
        this.maxSelection = 12;
        this.minSelection = 1;
        this.isPlaying = false;
        this.currentGame = 1;

        this.initializeBoard();
        this.attachEventListeners();
        this.updateTotalCost();
    }

    initializeBoard() {
        const board = document.getElementById('kenoBoard');
        board.innerHTML = '';

        // Create 80 numbered squares (8 rows x 10 columns)
        for (let i = 1; i <= 80; i++) {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'keno-number';
            numberDiv.textContent = i;
            numberDiv.dataset.number = i;

            numberDiv.addEventListener('click', () => this.toggleNumber(i));

            board.appendChild(numberDiv);
        }
    }

    attachEventListeners() {
        document.getElementById('clearBtn').addEventListener('click', () => this.clearSelection());
        document.getElementById('quickPickBtn').addEventListener('click', () => this.quickPick());
        document.getElementById('playBtn').addEventListener('click', () => this.play());
        document.getElementById('numGames').addEventListener('input', () => this.updateTotalCost());
        document.getElementById('wagerAmount').addEventListener('change', () => this.updateTotalCost());
    }

    toggleNumber(num) {
        if (this.isPlaying) return;

        if (this.selectedNumbers.has(num)) {
            this.selectedNumbers.delete(num);
            this.updateNumberDisplay(num, false);
        } else {
            if (this.selectedNumbers.size >= this.maxSelection) {
                this.showMessage('Maximum 12 numbers can be selected');
                return;
            }
            this.selectedNumbers.add(num);
            this.updateNumberDisplay(num, true);
        }

        this.updateSelectedNumbersDisplay();
    }

    updateNumberDisplay(num, selected) {
        const numberDiv = document.querySelector(`[data-number="${num}"]`);
        if (selected) {
            numberDiv.classList.add('selected');
        } else {
            numberDiv.classList.remove('selected');
        }
    }

    updateSelectedNumbersDisplay() {
        const container = document.getElementById('selectedNumbers');

        if (this.selectedNumbers.size === 0) {
            container.innerHTML = '<div class="no-selection">Select 1-12 numbers</div>';
        } else {
            const sorted = Array.from(this.selectedNumbers).sort((a, b) => a - b);
            container.innerHTML = sorted.map(num =>
                `<div class="selected-number-badge">${num}</div>`
            ).join('');
        }
    }

    clearSelection() {
        if (this.isPlaying) return;

        this.selectedNumbers.forEach(num => {
            this.updateNumberDisplay(num, false);
        });
        this.selectedNumbers.clear();
        this.updateSelectedNumbersDisplay();
        this.hideResults();

        // Clear all drawn numbers and visual states
        document.getElementById('drawnNumbers').innerHTML = '';
        document.querySelectorAll('.keno-number').forEach(el => {
            el.classList.remove('drawn', 'matched');
        });
        this.drawnNumbers = [];
    }

    quickPick() {
        if (this.isPlaying) return;

        this.clearSelection();

        // Pick random number of spots (between 4 and 10 is common)
        const numPicks = Math.floor(Math.random() * 7) + 4; // 4-10 numbers

        const available = Array.from({length: 80}, (_, i) => i + 1);

        for (let i = 0; i < numPicks; i++) {
            const randomIndex = Math.floor(this.getSecureRandom() * available.length);
            const number = available[randomIndex];
            available.splice(randomIndex, 1);

            this.selectedNumbers.add(number);
            this.updateNumberDisplay(number, true);
        }

        this.updateSelectedNumbersDisplay();
    }

    updateTotalCost() {
        const numGames = parseInt(document.getElementById('numGames').value) || 1;
        const wager = parseInt(document.getElementById('wagerAmount').value) || 1;
        const total = numGames * wager;
        document.getElementById('totalCost').textContent = total;
    }

    // Cryptographically secure random number generator
    getSecureRandom() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] / (0xFFFFFFFF + 1);
    }

    // Draw 20 numbers using true randomness
    drawNumbers() {
        const numbers = Array.from({length: 80}, (_, i) => i + 1);
        const drawn = [];

        // Fisher-Yates shuffle with cryptographic randomness
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(this.getSecureRandom() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        // Take first 20 numbers
        return numbers.slice(0, 20).sort((a, b) => a - b);
    }

    async play() {
        if (this.isPlaying) return;

        if (this.selectedNumbers.size < this.minSelection) {
            this.showMessage('Please select at least 1 number');
            return;
        }

        this.isPlaying = true;
        document.getElementById('playBtn').disabled = true;
        this.hideResults();

        // Clear previous drawn numbers display
        document.getElementById('drawnNumbers').innerHTML = '';

        // Clear previous visual states
        document.querySelectorAll('.keno-number').forEach(el => {
            el.classList.remove('drawn', 'matched');
        });

        const numGames = parseInt(document.getElementById('numGames').value) || 1;
        let totalWinnings = 0;
        let totalMatches = 0;

        for (let game = 1; game <= numGames; game++) {
            document.getElementById('gameNumber').textContent = game;

            // Draw 20 numbers
            this.drawnNumbers = this.drawNumbers();

            // Animate the drawing
            await this.animateDrawing();

            // Calculate matches and winnings
            const matches = this.calculateMatches();
            totalMatches += matches;

            const wager = parseInt(document.getElementById('wagerAmount').value) || 1;
            const winnings = this.calculateWinnings(this.selectedNumbers.size, matches, wager);
            totalWinnings += winnings;

            // Show results for this game
            this.showResults(matches, winnings);

            // Wait before next game
            if (game < numGames) {
                await this.delay(2000);
                // Clear drawn state for next game
                document.querySelectorAll('.keno-number').forEach(el => {
                    el.classList.remove('drawn', 'matched');
                    if (this.selectedNumbers.has(parseInt(el.dataset.number))) {
                        el.classList.add('selected');
                    }
                });
                document.getElementById('drawnNumbers').innerHTML = '';
            }
        }

        // Show final totals if multiple games
        if (numGames > 1) {
            this.showResults(totalMatches, totalWinnings, true);
        }

        this.isPlaying = false;
        document.getElementById('playBtn').disabled = false;
    }

    async animateDrawing() {
        const drawnContainer = document.getElementById('drawnNumbers');
        const delay = 150; // milliseconds between each number reveal

        for (let i = 0; i < this.drawnNumbers.length; i++) {
            const num = this.drawnNumbers[i];

            // Add to drawn numbers display
            const ball = document.createElement('div');
            ball.className = 'drawn-number';
            ball.textContent = num;

            const isMatch = this.selectedNumbers.has(num);
            if (isMatch) {
                ball.classList.add('match');
            }

            drawnContainer.appendChild(ball);

            // Update board
            const boardNum = document.querySelector(`[data-number="${num}"]`);
            boardNum.classList.add('drawn');

            if (isMatch) {
                boardNum.classList.add('matched');
            }

            await this.delay(delay);
        }
    }

    calculateMatches() {
        let matches = 0;
        for (const num of this.drawnNumbers) {
            if (this.selectedNumbers.has(num)) {
                matches++;
            }
        }
        return matches;
    }

    calculateWinnings(spots, matches, wager) {
        // Massachusetts Keno payout table (simplified)
        const payoutTable = {
            1: {1: 2.50},
            2: {2: 11},
            3: {2: 1, 3: 25},
            4: {2: 1, 3: 4, 4: 75},
            5: {3: 1, 4: 12, 5: 450},
            6: {3: 1, 4: 4, 5: 70, 6: 1600},
            7: {4: 1, 5: 17, 6: 180, 7: 7000},
            8: {5: 8, 6: 70, 7: 1500, 8: 15000},
            9: {5: 3, 6: 25, 7: 200, 8: 3000, 9: 25000},
            10: {5: 2, 6: 15, 7: 100, 8: 500, 9: 5000, 10: 50000},
            11: {6: 12, 7: 80, 8: 350, 9: 1500, 10: 7500, 11: 50000},
            12: {6: 7, 7: 50, 8: 150, 9: 600, 10: 2500, 11: 12500, 12: 50000}
        };

        if (!payoutTable[spots] || !payoutTable[spots][matches]) {
            return 0;
        }

        return payoutTable[spots][matches] * wager;
    }

    showResults(matches, winnings, isFinal = false) {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';

        const prefix = isFinal ? 'Total ' : '';
        document.getElementById('matchCount').textContent = matches;
        document.getElementById('winAmount').textContent = winnings.toFixed(2);
    }

    hideResults() {
        document.getElementById('resultsSection').style.display = 'none';
    }

    showMessage(msg) {
        // Simple alert for now - could be enhanced with a custom modal
        alert(msg);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new KenoGame();
});
