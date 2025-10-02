# Massachusetts Keno Results Viewer

Live results viewer that fetches real-time Keno draw data from the Massachusetts State Lottery and auto-refreshes every 4 minutes.

## Features

- **Live Results**: Fetches latest Keno draw results from MA Lottery API
- **Auto-Refresh**: Updates every 4 minutes automatically
- **Real-Time Countdown**: Shows time until next update
- **Animated Display**: Smooth animations for winning numbers
- **Authentic Styling**: Matches MA Keno board appearance
- **Caching**: Server-side caching to minimize API requests

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Server

**Production mode:**
```bash
npm start
```

**Development mode (with auto-restart):**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Usage

1. Start the server
2. Open your browser to: `http://localhost:3000/viewer`
3. The viewer will automatically fetch and display the latest Keno results
4. Results refresh every 4 minutes

## API Endpoints

- **`GET /api/keno/current`** - Get latest Keno results
- **`GET /api/health`** - Server health check
- **`GET /viewer`** - Results viewer page

## Project Structure

```
keno/
├── server.js           # Express server with API endpoints
├── viewer.html         # Results viewer HTML
├── viewer-styles.css   # Viewer styling
├── viewer-script.js    # Viewer logic with auto-refresh
├── package.json        # Dependencies
└── README.md          # This file
```

## How It Works

1. **Backend Server** (`server.js`):
   - Fetches data from MA Lottery API: `https://www.masslottery.com/data/json/search/dailygames/todays/keno.json`
   - Caches results for 4 minutes to reduce API load
   - Serves data via REST API to frontend

2. **Frontend Viewer** (`viewer.html`, `viewer-script.js`):
   - Displays 80-number Keno board
   - Highlights winning numbers with animations
   - Auto-refreshes every 4 minutes
   - Shows countdown timer until next update

## Configuration

To change the refresh interval, edit these values:

**In `server.js`:**
```javascript
const CACHE_DURATION = 4 * 60 * 1000; // 4 minutes
```

**In `viewer-script.js`:**
```javascript
this.refreshInterval = 4 * 60 * 1000; // 4 minutes
```

## Notes

- The server respects MA Lottery's API with caching to avoid excessive requests
- CORS is enabled for local development
- The viewer works in any modern browser
- Server automatically handles connection errors and serves cached data when API is unavailable

## Environment Variables

- `PORT` - Server port (default: 3000)

Example:
```bash
PORT=8080 npm start
```
