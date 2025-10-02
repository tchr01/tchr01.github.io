// MA Keno Live Results Viewer
// Auto-refreshes every 4 minutes to display latest draw results

class KenoViewer {
    constructor() {
        this.apiUrl = '/api/keno/current';
        this.refreshInterval = 3 * 60 * 1000; // 3 minutes
        this.countdownInterval = null;
        this.autoRefreshTimer = null;
        this.nextRefreshTime = null;
        this.currentBannerIndex = 0;
        this.bannerRotationTimer = null;
        this.takeoverShown = false;
        this.takeoverImages = [
            'images/takeovers/1.webp',
            'images/takeovers/DjsiBAbU8AASKQz.jpg'
        ];

        this.initializeBoard();
        this.startBannerRotation();
        this.startAutoRefresh();
    }

    initializeBoard() {
        const board = document.getElementById('kenoBoard');
        board.innerHTML = '';

        // Create 80 numbered squares
        for (let i = 1; i <= 80; i++) {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'keno-number';
            numberDiv.textContent = i;
            numberDiv.dataset.number = i;
            board.appendChild(numberDiv);
        }
    }

    async fetchResults() {
        this.updateStatus('loading', 'Fetching latest results...');

        try {
            const response = await fetch(this.apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success && result.data) {
                this.displayResults(result.data);
                this.updateStatus('connected',
                    `Connected • Last updated: ${new Date(result.fetchedAt).toLocaleTimeString()}`
                );
                return true;
            } else {
                throw new Error(result.message || 'Invalid data received');
            }
        } catch (error) {
            console.error('Error fetching results:', error);
            this.updateStatus('error', `Error: ${error.message}`);
            return false;
        }
    }

    displayResults(data) {
        // Clear previous results
        this.clearBoard();

        // Data is an array of draws, get the most recent one
        if (!Array.isArray(data) || data.length === 0) {
            this.showNoData();
            return;
        }

        // Get the latest game (last in array is most recent)
        const latestGame = data[data.length - 1];

        // Update game info
        this.updateGameInfo(latestGame);

        // Display winning numbers on board
        // API returns winningNumbers as an array
        if (latestGame.winningNumbers && Array.isArray(latestGame.winningNumbers)) {
            this.animateWinningNumbers(latestGame.winningNumbers);
        }
    }

    updateGameInfo(game) {
        // Update game number (drawNumber)
        const gameNumber = game.drawNumber || '--';
        document.getElementById('gameNumber').textContent = gameNumber;

        // Set draw time to current time (when we fetched the results)
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('drawTime').textContent = time;
    }

    formatDrawTime(timeString) {
        try {
            // Handle various time formats from the API
            if (timeString.includes('T')) {
                // ISO format
                const date = new Date(timeString);
                return date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            } else if (timeString.includes(':')) {
                // Already formatted as time
                return timeString;
            }
            return timeString;
        } catch (error) {
            return timeString;
        }
    }

    async animateWinningNumbers(numbers) {
        const drawnContainer = document.getElementById('drawnNumbers');
        drawnContainer.innerHTML = '';

        // Show "Game Closed" screen
        await this.showGameClosedScreen();

        // Animate each number with a delay
        for (let i = 0; i < numbers.length; i++) {
            const num = parseInt(numbers[i]);

            // Update board
            const boardNum = document.querySelector(`[data-number="${num}"]`);
            if (boardNum) {
                boardNum.classList.add('drawn');
            }

            // Add to drawn numbers grid
            const ball = document.createElement('div');
            ball.className = 'drawn-number';
            ball.textContent = num;
            drawnContainer.appendChild(ball);

            // Delay between numbers for dramatic animated reveal
            if (i < numbers.length - 1) {
                await this.delay(600);
            }
        }

        // After all numbers are revealed, hide non-winning numbers
        await this.delay(3500); // Wait longer to appreciate all numbers
        this.showOnlyWinningNumbers();
    }

    async showGameClosedScreen() {
        const mainContent = document.querySelector('.main-content');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'game-closed-overlay';
        overlay.innerHTML = `
            <div class="game-closed-message">
                <div class="game-closed-title"></div>
                <div class="game-closed-subtitle">Drawing Numbers...</div>
            </div>
        `;

        mainContent.appendChild(overlay);

        // Animate letters
        const titleElement = overlay.querySelector('.game-closed-title');
        const text = 'GAME CLOSED';

        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            titleElement.appendChild(span);

            // Delay and fade in each letter
            await this.delay(80);
            span.style.transition = 'opacity 0.3s ease-in';
            span.style.opacity = '1';
        }

        // Wait remaining time (5 seconds total minus animation time)
        const animationTime = text.length * 80;
        const remainingTime = 5000 - animationTime;
        await this.delay(remainingTime);

        // Remove overlay
        overlay.style.opacity = '0';
        await this.delay(500);
        overlay.remove();
    }

    showOnlyWinningNumbers() {
        const boardSection = document.querySelector('.board-section');
        const kenoBoard = document.querySelector('.keno-board');
        const mainContent = document.querySelector('.main-content');

        // Switch to final background
        mainContent.classList.add('final-state');

        // Get all winning numbers and sort them
        const winningNumbers = Array.from(document.querySelectorAll('.keno-number.drawn'))
            .map(el => ({
                element: el,
                number: parseInt(el.textContent)
            }))
            .sort((a, b) => a.number - b.number);

        // Change board to winning numbers layout
        kenoBoard.style.gridTemplateColumns = 'repeat(5, 1fr)';
        kenoBoard.style.gap = '25px';
        kenoBoard.style.maxWidth = '900px';
        kenoBoard.style.margin = '0 auto';

        // Clear the board
        kenoBoard.innerHTML = '';

        // Add winning numbers back in sorted order with larger size
        winningNumbers.forEach(({element}) => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            element.style.fontSize = '5.5em';
            element.style.borderWidth = '5px';
            element.style.boxShadow = '0 0 40px rgba(231, 76, 60, 0.8), 0 0 80px rgba(231, 76, 60, 0.4), inset 0 3px 15px rgba(255, 255, 255, 0.3), inset 0 -3px 15px rgba(0, 0, 0, 0.4), inset 0 8px 20px rgba(0, 0, 0, 0.5)';
            element.classList.add('final-display');
            kenoBoard.appendChild(element);
        });
    }

    clearBoard() {
        const kenoBoard = document.querySelector('.keno-board');
        const mainContent = document.querySelector('.main-content');

        // Remove final background state
        mainContent.classList.remove('final-state');

        // Reset board layout
        kenoBoard.style.gridTemplateColumns = 'repeat(10, 1fr)';
        kenoBoard.style.gap = '10px';
        kenoBoard.style.maxWidth = '1200px';
        kenoBoard.style.margin = '0';

        // Reset all numbers
        document.querySelectorAll('.keno-number').forEach(el => {
            el.classList.remove('drawn', 'final-display');
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
        });

        // Rebuild the board in original order
        kenoBoard.innerHTML = '';
        for (let i = 1; i <= 80; i++) {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'keno-number';
            numberDiv.textContent = i;
            numberDiv.dataset.number = i;
            kenoBoard.appendChild(numberDiv);
        }

        document.getElementById('drawnNumbers').innerHTML = '';
    }

    showNoData() {
        const drawnContainer = document.getElementById('drawnNumbers');
        drawnContainer.innerHTML = '<div class="loading-message">No recent draws available</div>';
        document.getElementById('gameNumber').textContent = '--';
        document.getElementById('drawTime').textContent = '--:--:--';
    }

    updateStatus(status, message) {
        const statusBar = document.getElementById('statusBar');
        const statusText = document.getElementById('statusText');

        statusBar.className = 'status-bar ' + status;
        statusText.textContent = message;
    }

    startBannerRotation() {
        const banners = document.querySelectorAll('.banner-image');
        if (banners.length === 0) return;

        // Rotate banners every 8 seconds
        this.bannerRotationTimer = setInterval(() => {
            // Remove active class from current banner
            banners[this.currentBannerIndex].classList.remove('active');

            // Move to next banner
            this.currentBannerIndex = (this.currentBannerIndex + 1) % banners.length;

            // Add active class to new banner
            banners[this.currentBannerIndex].classList.add('active');
        }, 8000);
    }

    startAutoRefresh() {
        // Initial fetch
        this.fetchResults();

        // Set up countdown
        this.nextRefreshTime = Date.now() + this.refreshInterval;
        this.startCountdown();

        // Set up auto-refresh
        this.autoRefreshTimer = setInterval(() => {
            this.fetchResults();
            this.nextRefreshTime = Date.now() + this.refreshInterval;
            this.takeoverShown = false; // Reset for next cycle
        }, this.refreshInterval);
    }

    startCountdown() {
        // Clear existing countdown
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        this.countdownInterval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, this.nextRefreshTime - now);

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);

            const countdownText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('countdown').textContent = countdownText;

            // Check if we're at the 2-minute mark
            if (minutes === 2 && seconds === 0 && !this.takeoverShown) {
                this.takeoverShown = true;
                this.showTakeovers();
            }

            if (remaining === 0) {
                document.getElementById('countdown').textContent = 'Updating...';
            }
        }, 1000);
    }

    async showTakeovers() {
        const container = document.querySelector('.container');

        // Show each takeover image for 5 seconds
        for (let i = 0; i < this.takeoverImages.length; i++) {
            const takeover = document.createElement('div');
            takeover.className = 'takeover-screen';
            takeover.style.backgroundImage = `url('${this.takeoverImages[i]}')`;
            takeover.style.opacity = '1';
            container.appendChild(takeover);

            // Wait 5 seconds
            await this.delay(5000);

            // Cut immediately to next
            takeover.remove();
        }

        // Reset for next cycle
        this.takeoverShown = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Cleanup method
    destroy() {
        if (this.autoRefreshTimer) {
            clearInterval(this.autoRefreshTimer);
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        if (this.bannerRotationTimer) {
            clearInterval(this.bannerRotationTimer);
        }
    }
}

// Initialize viewer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.kenoViewer = new KenoViewer();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.kenoViewer) {
        window.kenoViewer.destroy();
    }
});
