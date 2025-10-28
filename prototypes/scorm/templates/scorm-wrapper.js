/**
 * SCORM 1.2 API Wrapper
 *
 * Battle-tested wrapper for SCORM 1.2 LMS communication
 * Handles all the quirks of different LMS implementations
 *
 * Based on pipwerks SCORM wrapper with enhancements
 *
 * USAGE:
 * 1. Include this file in your learning object HTML
 * 2. Call SCORM.init() when page loads
 * 3. Use SCORM.set() to save data
 * 4. Call SCORM.finish() when learner exits
 *
 * EXAMPLE:
 *   SCORM.init();
 *   SCORM.set('cmi.core.lesson_status', 'completed');
 *   SCORM.set('cmi.core.score.raw', 85);
 *   SCORM.finish();
 */

var SCORM = (function() {
    'use strict';

    // ==================== PRIVATE VARIABLES ====================

    var API = null;  // Will hold reference to SCORM API
    var isInitialized = false;
    var isFinished = false;
    var connectionAttempts = 0;
    var maxAttempts = 500;  // Try up to 500 parent windows

    // Debug mode - set to true to see console logs
    var debug = true;

    // ==================== PRIVATE FUNCTIONS ====================

    /**
     * Logs debug messages if debug mode is enabled
     */
    function log(message, data) {
        if (debug && console && console.log) {
            console.log('[SCORM] ' + message, data || '');
        }
    }

    /**
     * Logs error messages
     */
    function error(message, data) {
        if (console && console.error) {
            console.error('[SCORM ERROR] ' + message, data || '');
        }
    }

    /**
     * Finds the SCORM API in the window hierarchy
     * LMS wraps content in iframes, so we need to search parent windows
     *
     * This is the most critical function - it MUST work across all LMS platforms
     */
    function findAPI(win) {
        connectionAttempts++;

        // Prevent infinite loops
        if (connectionAttempts > maxAttempts) {
            error('Maximum API search attempts reached (' + maxAttempts + ')');
            return null;
        }

        // Check current window for API
        if (win.API) {
            log('SCORM API found in window', connectionAttempts);
            return win.API;
        }

        // Check if we can access parent window
        if (win.parent && win.parent != win) {
            return findAPI(win.parent);
        }

        // Check opener window (for popups)
        if (win.opener) {
            return findAPI(win.opener);
        }

        // API not found
        log('SCORM API not found after ' + connectionAttempts + ' attempts');
        return null;
    }

    /**
     * Gets last error code from SCORM API
     */
    function getLastError() {
        if (!API) return '301';  // General error

        var errorCode = API.LMSGetLastError();
        log('Last error code: ' + errorCode);
        return errorCode;
    }

    /**
     * Gets error description for an error code
     */
    function getErrorString(errorCode) {
        if (!API) return 'API not initialized';

        var errorString = API.LMSGetErrorString(errorCode);
        log('Error string: ' + errorString);
        return errorString;
    }

    /**
     * Gets diagnostic info about an error
     */
    function getDiagnostic(errorCode) {
        if (!API) return 'API not initialized';

        var diagnostic = API.LMSGetDiagnostic(errorCode);
        log('Diagnostic: ' + diagnostic);
        return diagnostic;
    }

    /**
     * Converts seconds to SCORM time format (HH:MM:SS)
     */
    function convertToSCORMTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var secs = Math.floor(seconds % 60);

        // Pad with zeros
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        secs = (secs < 10) ? '0' + secs : secs;

        return hours + ':' + minutes + ':' + secs;
    }

    // ==================== PUBLIC API ====================

    return {
        /**
         * Initialize connection to SCORM API
         * Call this when your page loads
         *
         * @returns {boolean} True if initialized successfully
         */
        init: function() {
            if (isInitialized) {
                log('Already initialized');
                return true;
            }

            log('Initializing SCORM connection...');

            // Find the API
            API = findAPI(window);

            if (!API) {
                error('SCORM API not found. Running in standalone mode.');
                // Return true so content still works outside LMS
                return false;
            }

            // Initialize the API
            var result = API.LMSInitialize('');

            if (result === 'true' || result === true) {
                isInitialized = true;
                log('SCORM initialized successfully');

                // Set lesson status to incomplete if not already set
                var status = this.get('cmi.core.lesson_status');
                if (status === 'not attempted' || !status) {
                    this.set('cmi.core.lesson_status', 'incomplete');
                }

                return true;
            } else {
                error('LMSInitialize failed');
                error('Error code: ' + getLastError());
                error('Error string: ' + getErrorString(getLastError()));
                return false;
            }
        },

        /**
         * Get a value from the LMS
         *
         * @param {string} parameter - SCORM data model element (e.g., 'cmi.core.lesson_status')
         * @returns {string} The value, or empty string if error
         */
        get: function(parameter) {
            if (!isInitialized) {
                error('Cannot get value - not initialized');
                return '';
            }

            if (!API) {
                error('API not available');
                return '';
            }

            var value = API.LMSGetValue(parameter);
            var errorCode = getLastError();

            if (errorCode !== '0') {
                error('Error getting ' + parameter);
                error('Error: ' + getErrorString(errorCode));
            } else {
                log('Get ' + parameter + ' = ' + value);
            }

            return value;
        },

        /**
         * Set a value in the LMS
         *
         * @param {string} parameter - SCORM data model element
         * @param {string} value - Value to set
         * @returns {boolean} True if successful
         */
        set: function(parameter, value) {
            if (!isInitialized) {
                error('Cannot set value - not initialized');
                return false;
            }

            if (!API) {
                error('API not available');
                return false;
            }

            // Convert value to string
            value = String(value);

            var result = API.LMSSetValue(parameter, value);
            var errorCode = getLastError();

            if (result === 'true' || result === true) {
                log('Set ' + parameter + ' = ' + value);

                // Commit immediately for critical values
                if (parameter === 'cmi.core.lesson_status' ||
                    parameter === 'cmi.core.score.raw' ||
                    parameter.indexOf('suspend_data') !== -1) {
                    this.commit();
                }

                return true;
            } else {
                error('Error setting ' + parameter + ' = ' + value);
                error('Error: ' + getErrorString(errorCode));
                return false;
            }
        },

        /**
         * Commit (save) data to LMS
         * Important: Some LMS require explicit commits
         *
         * @returns {boolean} True if successful
         */
        commit: function() {
            if (!isInitialized) {
                error('Cannot commit - not initialized');
                return false;
            }

            if (!API) {
                error('API not available');
                return false;
            }

            var result = API.LMSCommit('');

            if (result === 'true' || result === true) {
                log('Data committed successfully');
                return true;
            } else {
                error('Commit failed');
                error('Error: ' + getErrorString(getLastError()));
                return false;
            }
        },

        /**
         * Finish the session and close connection to LMS
         * CRITICAL: Must be called when learner exits
         *
         * @returns {boolean} True if successful
         */
        finish: function() {
            if (!isInitialized) {
                log('Not initialized, nothing to finish');
                return true;
            }

            if (isFinished) {
                log('Already finished');
                return true;
            }

            if (!API) {
                error('API not available');
                return false;
            }

            log('Finishing SCORM session...');

            // Commit any pending data
            this.commit();

            // Terminate the session
            var result = API.LMSFinish('');

            if (result === 'true' || result === true) {
                isFinished = true;
                isInitialized = false;
                log('SCORM session finished successfully');
                return true;
            } else {
                error('LMSFinish failed');
                error('Error: ' + getErrorString(getLastError()));
                return false;
            }
        },

        /**
         * Check if SCORM is initialized and working
         *
         * @returns {boolean} True if initialized
         */
        isConnected: function() {
            return isInitialized && API !== null;
        },

        // ==================== CONVENIENCE METHODS ====================

        /**
         * Mark lesson as completed
         */
        setComplete: function() {
            return this.set('cmi.core.lesson_status', 'completed');
        },

        /**
         * Mark lesson as incomplete
         */
        setIncomplete: function() {
            return this.set('cmi.core.lesson_status', 'incomplete');
        },

        /**
         * Mark lesson as passed
         */
        setPassed: function() {
            return this.set('cmi.core.lesson_status', 'passed');
        },

        /**
         * Mark lesson as failed
         */
        setFailed: function() {
            return this.set('cmi.core.lesson_status', 'failed');
        },

        /**
         * Set the score (0-100)
         * Also sets min and max automatically
         *
         * @param {number} score - Score value (0-100)
         */
        setScore: function(score) {
            score = Math.round(score);  // Ensure integer
            score = Math.max(0, Math.min(100, score));  // Clamp 0-100

            this.set('cmi.core.score.raw', score);
            this.set('cmi.core.score.min', 0);
            this.set('cmi.core.score.max', 100);

            log('Score set to ' + score);
            return true;
        },

        /**
         * Get current score
         *
         * @returns {number} Score value
         */
        getScore: function() {
            var score = this.get('cmi.core.score.raw');
            return score ? parseInt(score, 10) : 0;
        },

        /**
         * Get current lesson status
         *
         * @returns {string} Status (not attempted, incomplete, completed, passed, failed)
         */
        getStatus: function() {
            return this.get('cmi.core.lesson_status');
        },

        /**
         * Save custom data (up to 4096 characters in SCORM 1.2)
         * Use this to save learner progress, answers, etc.
         *
         * @param {string|object} data - Data to save (will be JSON stringified if object)
         */
        saveSuspendData: function(data) {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }

            // Check size limit (SCORM 1.2 = 4096 chars)
            if (data.length > 4096) {
                error('Suspend data too large: ' + data.length + ' chars (max 4096)');
                // Truncate to fit
                data = data.substring(0, 4096);
            }

            return this.set('cmi.suspend_data', data);
        },

        /**
         * Load custom data
         *
         * @param {boolean} parseJSON - If true, parse as JSON
         * @returns {string|object} The saved data
         */
        loadSuspendData: function(parseJSON) {
            var data = this.get('cmi.suspend_data');

            if (parseJSON && data) {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    error('Error parsing suspend data as JSON', e);
                    return null;
                }
            }

            return data;
        },

        /**
         * Set session time (call this when learner exits)
         *
         * @param {number} seconds - Time spent in seconds
         */
        setSessionTime: function(seconds) {
            var scormTime = convertToSCORMTime(seconds);
            return this.set('cmi.core.session_time', scormTime);
        },

        /**
         * Enable or disable debug logging
         *
         * @param {boolean} enabled - True to enable debug logs
         */
        setDebug: function(enabled) {
            debug = enabled;
            log('Debug mode: ' + (enabled ? 'ON' : 'OFF'));
        },

        /**
         * Get detailed error information
         * Useful for troubleshooting
         *
         * @returns {object} Error details
         */
        getDebugInfo: function() {
            return {
                initialized: isInitialized,
                finished: isFinished,
                apiFound: API !== null,
                connectionAttempts: connectionAttempts,
                lastError: getLastError(),
                lastErrorString: getErrorString(getLastError()),
                status: this.getStatus(),
                score: this.getScore()
            };
        }
    };
})();

// ==================== AUTO-INITIALIZE ====================

// Automatically initialize when page loads
// And automatically finish when page unloads
(function() {
    'use strict';

    var startTime = new Date();

    // Initialize on page load
    window.addEventListener('load', function() {
        SCORM.init();
    });

    // Finish on page unload
    window.addEventListener('beforeunload', function() {
        // Calculate session time
        var endTime = new Date();
        var sessionTime = Math.round((endTime - startTime) / 1000);  // Convert to seconds

        SCORM.setSessionTime(sessionTime);
        SCORM.finish();
    });

    // Also finish on visibility change (mobile browsers)
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            var endTime = new Date();
            var sessionTime = Math.round((endTime - startTime) / 1000);
            SCORM.setSessionTime(sessionTime);
            SCORM.commit();  // Commit but don't finish (might come back)
        }
    });
})();

// ==================== USAGE EXAMPLES ====================

/*

// BASIC USAGE:
// Just include this file - it auto-initializes!

// Mark as complete when learner finishes
SCORM.setComplete();

// Set a score
SCORM.setScore(85);

// Save custom data
SCORM.saveSuspendData({
    currentQuestion: 5,
    answers: ['A', 'B', 'C'],
    lastVisit: new Date()
});

// Load custom data
var savedData = SCORM.loadSuspendData(true);  // true = parse as JSON
if (savedData) {
    console.log('Resuming from question', savedData.currentQuestion);
}

// ADVANCED: Check if running in LMS
if (SCORM.isConnected()) {
    console.log('Running in LMS');
} else {
    console.log('Standalone mode (preview)');
}

// DEBUGGING:
console.log(SCORM.getDebugInfo());

*/
