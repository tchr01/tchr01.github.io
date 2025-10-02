const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from current directory
app.use(express.static(__dirname));

// Cache for Keno data
let cachedData = null;
let lastFetch = null;
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds

// Massachusetts Lottery Keno data endpoint
function getKenoApiUrl() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `https://www.masslottery.com/rest/keno/getDrawsByDateRange?startDate=${today}&endDate=${today}`;
}

// Fetch Keno data from MA Lottery
async function fetchKenoData() {
    try {
        const apiUrl = getKenoApiUrl();
        console.log(`[${new Date().toISOString()}] Fetching Keno data from MA Lottery...`);

        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        if (response.data && response.data.draws && Array.isArray(response.data.draws) && response.data.draws.length > 0) {
            cachedData = response.data.draws;
            lastFetch = Date.now();
            console.log(`[${new Date().toISOString()}] Successfully fetched ${response.data.draws.length} Keno draws`);
            return { success: true, data: response.data.draws };
        } else {
            throw new Error('No data received from MA Lottery');
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error fetching Keno data:`, error.message);

        // Return cached data if available
        if (cachedData) {
            console.log(`[${new Date().toISOString()}] Returning cached data due to fetch error`);
            return { success: true, data: cachedData, fromCache: true };
        }

        return {
            success: false,
            error: error.message,
            message: 'Unable to fetch current Keno data'
        };
    }
}

// API endpoint to get current Keno data
app.get('/api/keno/current', async (req, res) => {
    try {
        // Check if we have fresh cached data
        if (cachedData && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
            console.log(`[${new Date().toISOString()}] Serving cached data (age: ${Math.floor((Date.now() - lastFetch) / 1000)}s)`);
            return res.json({
                success: true,
                data: cachedData,
                cached: true,
                fetchedAt: new Date(lastFetch).toISOString()
            });
        }

        // Fetch fresh data
        const result = await fetchKenoData();

        if (result.success) {
            res.json({
                success: true,
                data: result.data,
                cached: result.fromCache || false,
                fetchedAt: new Date(lastFetch).toISOString()
            });
        } else {
            res.status(503).json(result);
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Server error:`, error.message);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        cacheAge: lastFetch ? Math.floor((Date.now() - lastFetch) / 1000) : null
    });
});

// Serve the results viewer HTML
app.get('/viewer', (req, res) => {
    res.sendFile(path.join(__dirname, 'viewer.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`MA Keno Results Server running on port ${PORT}`);
    console.log(`=================================================`);
    console.log(`API endpoint: http://localhost:${PORT}/api/keno/current`);
    console.log(`Viewer URL:   http://localhost:${PORT}/viewer`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);

    // Fetch initial data
    fetchKenoData().then(result => {
        if (result.success) {
            console.log('Initial Keno data loaded successfully');
        } else {
            console.log('Failed to load initial data, will retry on first request');
        }
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    process.exit(0);
});
