class GameNote {
    constructor() {
        this.currentPairing = null;
        this.pairingHistory = [];
        this.userPreferences = {
            likedPairings: [],
            dislikedPairings: [],
            preferredMoods: [],
            preferredGenres: { albums: [], games: [] }
        };
        
        this.initializeEventListeners();
        this.loadUserPreferences();
    }

    initializeEventListeners() {
        document.getElementById('getPairingBtn').addEventListener('click', () => this.generatePairing());
        document.getElementById('thumbsUp').addEventListener('click', () => this.ratePairing('up'));
        document.getElementById('thumbsDown').addEventListener('click', () => this.ratePairing('down'));
        document.getElementById('tryAnother').addEventListener('click', () => this.generatePairing());
    }

    generatePairing() {
        this.showLoading();
        
        setTimeout(() => {
            const mood = document.getElementById('mood').value;
            const pairing = this.createPairing(mood);
            this.displayPairing(pairing);
            this.hideLoading();
        }, 1000);
    }

    createPairing(mood = 'any') {
        const album = this.selectAlbum(mood);
        const game = this.selectGame(mood, album);
        const compatibility = this.calculateCompatibility(album, game);
        
        const pairing = {
            album,
            game,
            compatibility,
            sessionTime: this.estimateSessionTime(album, game),
            reasoning: this.generateReasoning(album, game, mood),
            mood,
            timestamp: new Date()
        };

        this.currentPairing = pairing;
        this.pairingHistory.push(pairing);
        
        return pairing;
    }

    selectAlbum(mood) {
        // First try to find albums that match the general mood intent
        let filteredAlbums = [...this.albums];
        
        if (mood !== 'any') {
            const moodThemes = {
                'energetic': ['adventure', 'destiny', 'technology'],
                'chill': ['solitude', 'consciousness', 'minimalism', 'zen'],
                'nostalgic': ['time travel', 'friendship', 'exploration'],
                'experimental': ['consciousness', 'artificial intelligence', 'transcendence']
            };
            
            const relevantThemes = moodThemes[mood] || [];
            if (relevantThemes.length > 0) {
                const themeMatches = filteredAlbums.filter(album => 
                    album.themes.some(theme => relevantThemes.includes(theme))
                );
                if (themeMatches.length > 0) {
                    filteredAlbums = themeMatches;
                }
            }
        }

        return filteredAlbums[Math.floor(Math.random() * filteredAlbums.length)];
    }

    selectGame(mood, album) {
        // Prioritize thematic compatibility over mood
        const compatibleGames = this.games.filter(game => {
            return this.areCompatible(album, game);
        });

        // If we have thematically compatible games, use those
        if (compatibleGames.length > 0) {
            return compatibleGames[Math.floor(Math.random() * compatibleGames.length)];
        }

        // Otherwise, try mood-based selection as fallback
        let filteredGames = [...this.games];
        if (mood !== 'any') {
            const moodThemes = {
                'energetic': ['adventure', 'destiny', 'survival'],
                'chill': ['zen', 'minimalism', 'consciousness'],
                'nostalgic': ['time travel', 'friendship', 'exploration'],
                'experimental': ['artificial intelligence', 'consciousness', 'psychological horror']
            };
            
            const relevantThemes = moodThemes[mood] || [];
            const themeMatches = filteredGames.filter(game => 
                game.themes.some(theme => relevantThemes.includes(theme))
            );
            if (themeMatches.length > 0) {
                filteredGames = themeMatches;
            }
        }

        return filteredGames[Math.floor(Math.random() * filteredGames.length)];
    }

    areCompatible(album, game) {
        // Thematic resonance is the primary compatibility factor
        const themeMatch = album.themes.some(theme => game.themes.includes(theme));
        
        // Cultural/historical context alignment
        const culturalResonance = this.checkCulturalResonance(album, game);
        
        // Narrative/atmospheric compatibility
        const atmosphericMatch = this.checkAtmosphericAlignment(album.atmosphere, game.atmosphere);
        
        // Era context (less important than themes)
        const eraMatch = Math.abs(album.year - game.year) <= 8;
        
        return themeMatch || culturalResonance || atmosphericMatch || eraMatch;
    }

    checkCulturalResonance(album, game) {
        // Check for shared cultural movements or contexts
        const cyberpunkWorks = ['cyberpunk', 'dystopia', 'technology', 'surveillance'];
        const albumCyberpunk = album.themes.some(t => cyberpunkWorks.includes(t));
        const gameCyberpunk = game.themes.some(t => cyberpunkWorks.includes(t));
        
        const introspectiveWorks = ['isolation', 'solitude', 'consciousness', 'psychological horror'];
        const albumIntrospective = album.themes.some(t => introspectiveWorks.includes(t));
        const gameIntrospective = game.themes.some(t => introspectiveWorks.includes(t));
        
        const heroicJourney = ['adventure', 'friendship', 'destiny', 'sacrifice'];
        const albumHeroic = album.themes.some(t => heroicJourney.includes(t));
        const gameHeroic = game.themes.some(t => heroicJourney.includes(t));
        
        return (albumCyberpunk && gameCyberpunk) || 
               (albumIntrospective && gameIntrospective) ||
               (albumHeroic && gameHeroic);
    }

    checkAtmosphericAlignment(albumAtmo, gameAtmo) {
        const moodKeywords = {
            dark: ['paranoid', 'unsettling', 'haunting', 'nightmarish'],
            contemplative: ['meditative', 'introspective', 'ethereal', 'zen'],
            epic: ['sweeping', 'triumphant', 'emotional', 'beautiful'],
            urban: ['neon', 'urban', 'alienation', 'modern']
        };
        
        for (const [mood, keywords] of Object.entries(moodKeywords)) {
            const albumHasMood = keywords.some(keyword => albumAtmo.toLowerCase().includes(keyword));
            const gameHasMood = keywords.some(keyword => gameAtmo.toLowerCase().includes(keyword));
            if (albumHasMood && gameHasMood) return true;
        }
        
        return false;
    }

    calculateCompatibility(album, game) {
        let score = 0;
        
        // Thematic resonance (most important)
        const sharedThemes = album.themes.filter(theme => game.themes.includes(theme));
        score += sharedThemes.length * 25;
        
        // Cultural movement alignment
        if (this.checkCulturalResonance(album, game)) score += 30;
        
        // Atmospheric alignment
        if (this.checkAtmosphericAlignment(album.atmosphere, game.atmosphere)) score += 25;
        
        // Narrative complexity alignment
        const bothComplex = album.narrative.length > 80 && game.narrative.length > 80;
        const bothSimple = album.narrative.length <= 80 && game.narrative.length <= 80;
        if (bothComplex || bothSimple) score += 15;
        
        // Era context (less important)
        const yearDiff = Math.abs(album.year - game.year);
        if (yearDiff <= 5) score += 10;
        else if (yearDiff <= 10) score += 5;
        
        // Energy balance
        const energyDiff = Math.abs(album.energy - game.energy);
        score += Math.max(0, 10 - energyDiff * 2);
        
        return Math.min(100, Math.max(60, score));
    }

    estimateSessionTime(album, game) {
        const albumLength = album.duration;
        const gameSession = game.typicalSession;
        const avgTime = (albumLength + gameSession) / 2;
        
        return `${Math.round(avgTime)} minutes`;
    }

    generateReasoning(album, game, mood) {
        const reasons = [];
        
        // Thematic resonance (primary focus)
        const sharedThemes = album.themes.filter(theme => game.themes.includes(theme));
        if (sharedThemes.length > 0) {
            const themeDescriptions = {
                'cyberpunk': 'Both explore cyberpunk dystopia and the intersection of humanity and technology',
                'dystopia': 'Both examine dystopian futures and oppressive systems',
                'solitude': 'Both capture the profound experience of isolation and introspection',
                'technology': 'Both grapple with technology\'s impact on human experience',
                'surveillance': 'Both explore themes of control and being watched',
                'exploration': 'Both celebrate the wonder and danger of discovering unknown worlds',
                'alien worlds': 'Both transport you to strange and beautiful alien landscapes',
                'time travel': 'Both play with the concept of time and causality',
                'friendship': 'Both emphasize the power of human connection and loyalty',
                'destiny': 'Both explore how individuals shape their fate',
                'isolation': 'Both dive deep into the psychology of being alone',
                'consciousness': 'Both question the nature of perception and reality',
                'artificial intelligence': 'Both examine the relationship between humans and AI',
                'guilt': 'Both confront the weight of past actions and moral responsibility',
                'trauma': 'Both explore how painful experiences shape identity'
            };
            
            for (const theme of sharedThemes) {
                if (themeDescriptions[theme]) {
                    reasons.push(themeDescriptions[theme]);
                    break; // Just use the first shared theme for now
                }
            }
        }

        // Cultural movement alignment
        if (this.checkCulturalResonance(album, game)) {
            const cyberpunkWorks = ['cyberpunk', 'dystopia', 'technology', 'surveillance'];
            const introspectiveWorks = ['isolation', 'solitude', 'consciousness', 'psychological horror'];
            const heroicJourney = ['adventure', 'friendship', 'destiny', 'sacrifice'];
            
            if (album.themes.some(t => cyberpunkWorks.includes(t)) && 
                game.themes.some(t => cyberpunkWorks.includes(t))) {
                reasons.push('Both are landmarks of cyberpunk culture, sharing concerns about technology and human agency');
            } else if (album.themes.some(t => introspectiveWorks.includes(t)) && 
                       game.themes.some(t => introspectiveWorks.includes(t))) {
                reasons.push('Both are deeply introspective works that explore inner psychological landscapes');
            } else if (album.themes.some(t => heroicJourney.includes(t)) && 
                       game.themes.some(t => heroicJourney.includes(t))) {
                reasons.push('Both follow the classic hero\'s journey of growth through adventure and sacrifice');
            }
        }

        // Atmospheric and narrative depth alignment
        if (this.checkAtmosphericAlignment(album.atmosphere, game.atmosphere)) {
            if (album.atmosphere.includes('haunting') && game.atmosphere.includes('haunting')) {
                reasons.push('Both create haunting atmospheres that linger in memory long after the experience ends');
            } else if (album.atmosphere.includes('meditative') || game.atmosphere.includes('meditative')) {
                reasons.push('Both offer meditative experiences that invite deep contemplation');
            } else if (album.atmosphere.includes('paranoid')) {
                reasons.push('Both capture a sense of paranoia and unease about modern existence');
            }
        }

        // Cultural impact and artistic significance
        if (album.culturalContext && game.culturalImpact) {
            if (album.culturalContext.includes('elevated') || game.culturalImpact.includes('elevated')) {
                reasons.push('Both elevated their respective mediums to new artistic heights');
            } else if (album.culturalContext.includes('predicted') || game.culturalImpact.includes('predicted')) {
                reasons.push('Both were prophetic works that anticipated future cultural developments');
            }
        }

        // Narrative complexity match
        const bothComplex = album.narrative.length > 80 && game.narrative.length > 80;
        if (bothComplex && reasons.length < 2) {
            reasons.push('Both offer rich, complex narratives that reward deep engagement and analysis');
        }

        // Default thematic fallback
        if (reasons.length === 0) {
            reasons.push('This pairing creates fascinating thematic dialogue between two artistic visions');
        }

        // Return the most compelling reasons (max 2)
        return reasons.slice(0, 2).join('. ') + '.';
    }

    displayPairing(pairing) {
        const container = document.getElementById('pairingContainer');
        
        document.getElementById('albumArt').src = pairing.album.cover;
        document.getElementById('albumTitle').textContent = pairing.album.title;
        document.getElementById('albumArtist').textContent = pairing.album.artist;
        document.getElementById('albumGenre').textContent = pairing.album.genres.join(', ');
        document.getElementById('albumYear').textContent = pairing.album.year;
        
        document.getElementById('gameImage').src = pairing.game.image;
        document.getElementById('gameTitle').textContent = pairing.game.title;
        document.getElementById('gamePlatform').textContent = pairing.game.platform;
        document.getElementById('gameGenre').textContent = pairing.game.genres.join(', ');
        document.getElementById('gameYear').textContent = pairing.game.year;
        
        document.getElementById('sessionTime').querySelector('span').textContent = pairing.sessionTime;
        document.getElementById('compatibility').querySelector('span').textContent = `${pairing.compatibility}%`;
        document.getElementById('reasoningText').textContent = pairing.reasoning;
        
        container.classList.remove('hidden');
    }

    ratePairing(rating) {
        if (!this.currentPairing) return;
        
        this.currentPairing.rating = rating;
        
        if (rating === 'up') {
            this.userPreferences.likedPairings.push(this.currentPairing);
            this.learnFromPositiveFeedback(this.currentPairing);
        } else {
            this.userPreferences.dislikedPairings.push(this.currentPairing);
        }
        
        this.saveUserPreferences();
        this.showFeedback(rating);
    }

    learnFromPositiveFeedback(pairing) {
        if (!this.userPreferences.preferredMoods.includes(pairing.mood)) {
            this.userPreferences.preferredMoods.push(pairing.mood);
        }
        
        pairing.album.genres.forEach(genre => {
            if (!this.userPreferences.preferredGenres.albums.includes(genre)) {
                this.userPreferences.preferredGenres.albums.push(genre);
            }
        });
        
        pairing.game.genres.forEach(genre => {
            if (!this.userPreferences.preferredGenres.games.includes(genre)) {
                this.userPreferences.preferredGenres.games.push(genre);
            }
        });
    }

    showFeedback(rating) {
        const button = document.getElementById(rating === 'up' ? 'thumbsUp' : 'thumbsDown');
        const originalText = button.innerHTML;
        
        button.innerHTML = rating === 'up' ? '✓' : '✗';
        button.style.background = rating === 'up' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 1500);
    }

    showLoading() {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('pairingContainer').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loadingState').classList.add('hidden');
    }

    saveUserPreferences() {
        localStorage.setItem('gamenote-preferences', JSON.stringify(this.userPreferences));
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('gamenote-preferences');
        if (saved) {
            this.userPreferences = { ...this.userPreferences, ...JSON.parse(saved) };
        }
    }

    get albums() {
        return [
            {
                title: "Blade Runner Soundtrack",
                artist: "Vangelis",
                year: 1982,
                genres: ["Electronic", "Ambient", "Cinematic"],
                themes: ["cyberpunk", "dystopia", "solitude", "technology"],
                narrative: "Explores themes of humanity vs artificial intelligence in a neon-lit future",
                atmosphere: "Moody synthesizers create a sense of urban alienation and wonder",
                culturalContext: "Defined the sonic identity of cyberpunk culture",
                energy: 4,
                duration: 45,
                cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop"
            },
            {
                title: "The Wall",
                artist: "Pink Floyd", 
                year: 1979,
                genres: ["Progressive Rock", "Concept Album"],
                themes: ["isolation", "mental breakdown", "authority", "war"],
                narrative: "A rock opera about a man's psychological breakdown and retreat from society",
                atmosphere: "Dark, introspective journey through trauma and recovery",
                culturalContext: "Commentary on education systems, war trauma, and social conformity",
                energy: 6,
                duration: 81,
                cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop"
            },
            {
                title: "Chrono Trigger OST",
                artist: "Yasunori Mitsuda",
                year: 1995,
                genres: ["Video Game Music", "Orchestral", "Folk"],
                themes: ["time travel", "friendship", "destiny", "adventure"],
                narrative: "Epic journey across different time periods to save the world",
                atmosphere: "Sweeping melodies that evoke wonder, loss, and triumph",
                culturalContext: "Pioneered emotional storytelling through video game music",
                energy: 7,
                duration: 74,
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
            },
            {
                title: "Selected Ambient Works",
                artist: "Aphex Twin",
                year: 1992,
                genres: ["Electronic", "Ambient", "IDM"],
                themes: ["consciousness", "dreams", "isolation", "transcendence"],
                narrative: "Abstract sonic landscapes that explore the boundaries of perception",
                atmosphere: "Ethereal and unsettling, like drifting through digital dreams",
                culturalContext: "Redefined electronic music as art and emotional expression",
                energy: 3,
                duration: 74,
                cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop"
            },
            {
                title: "Super Metroid OST",
                artist: "Kenji Yamamoto",
                year: 1994,
                genres: ["Video Game Music", "Electronic", "Atmospheric"],
                themes: ["exploration", "solitude", "alien worlds", "survival"],
                narrative: "Lone bounty hunter exploring hostile alien planet",
                atmosphere: "Haunting melodies that capture the loneliness of space exploration",
                culturalContext: "Elevated video game music to cinematic storytelling",
                energy: 5,
                duration: 50,
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
            },
            {
                title: "OK Computer",
                artist: "Radiohead",
                year: 1997,
                genres: ["Alternative Rock", "Art Rock"],
                themes: ["technology anxiety", "alienation", "modern life", "surveillance"],
                narrative: "Examination of how technology and capitalism affect human connection",
                atmosphere: "Paranoid and beautiful, capturing millennial anxiety",
                culturalContext: "Prophetic critique of digital age isolation and corporate control",
                energy: 6,
                duration: 53,
                cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop"
            }
        ];
    }

    get games() {
        return [
            {
                title: "Deus Ex",
                platform: "PC",
                year: 2000,
                genres: ["RPG", "Stealth", "Cyberpunk"],
                themes: ["cyberpunk", "conspiracy", "transhumanism", "surveillance"],
                narrative: "Augmented agent uncovers global conspiracy while questioning human enhancement",
                gameplayFocus: "Player choice in stealth vs combat, moral decisions shape the story",
                culturalImpact: "Predicted modern surveillance state and tech dystopia",
                atmosphere: "Paranoid cyberpunk thriller with philosophical depth",
                energy: 6,
                typicalSession: 90,
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop"
            },
            {
                title: "Super Metroid",
                platform: "SNES",
                year: 1994,
                genres: ["Metroidvania", "Action", "Exploration"],
                themes: ["solitude", "exploration", "alien worlds", "survival"],
                narrative: "Lone bounty hunter explores hostile alien planet to rescue the last Metroid",
                gameplayFocus: "Non-linear exploration and gradual power progression",
                culturalImpact: "Defined the Metroidvania genre and environmental storytelling",
                atmosphere: "Haunting isolation on a beautiful but deadly alien world",
                energy: 5,
                typicalSession: 45,
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop"
            },
            {
                title: "Chrono Trigger",
                platform: "SNES",
                year: 1995,
                genres: ["RPG", "Time Travel", "Adventure"],
                themes: ["time travel", "friendship", "destiny", "sacrifice"],
                narrative: "Group of friends travel through time to prevent the apocalypse",
                gameplayFocus: "Character-driven story with multiple endings and time periods",
                culturalImpact: "Set the gold standard for narrative RPGs and time travel stories",
                atmosphere: "Epic and emotional journey across beautifully crafted eras",
                energy: 7,
                typicalSession: 120,
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
            },
            {
                title: "Tetris",
                platform: "Game Boy",
                year: 1989,
                genres: ["Puzzle", "Abstract"],
                themes: ["order from chaos", "minimalism", "endless struggle", "zen"],
                narrative: "Pure abstract challenge - creating order from falling geometric chaos",
                gameplayFocus: "Meditative pattern recognition and spatial reasoning",
                culturalImpact: "Proved games could be art through pure mechanics",
                atmosphere: "Hypnotic and meditative, like digital zen",
                energy: 3,
                typicalSession: 30,
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop"
            },
            {
                title: "Silent Hill 2",
                platform: "PS2",
                year: 2001,
                genres: ["Survival Horror", "Psychological"],
                themes: ["guilt", "trauma", "psychological horror", "redemption"],
                narrative: "Man confronts his repressed guilt and trauma in a nightmarish town",
                gameplayFocus: "Psychological exploration over action, symbolism drives narrative",
                culturalImpact: "Elevated horror games to psychological art form",
                atmosphere: "Deeply unsettling exploration of human psychology and guilt",
                energy: 4,
                typicalSession: 60,
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop"
            },
            {
                title: "Portal",
                platform: "PC",
                year: 2007,
                genres: ["Puzzle", "Sci-Fi", "Dark Comedy"],
                themes: ["artificial intelligence", "isolation", "corporate dystopia", "freedom"],
                narrative: "Test subject must escape AI-controlled facility using portal technology",
                gameplayFocus: "Spatial puzzle-solving with increasingly complex portal mechanics",
                culturalImpact: "Redefined puzzle games and AI storytelling in games",
                atmosphere: "Darkly humorous isolation with sinister undertones",
                energy: 5,
                typicalSession: 45,
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop"
            }
        ];
    }

    get genreCompatibility() {
        return {
            "Electronic": ["Puzzle", "Action", "Platformer"],
            "Disco": ["Beat 'em up", "Action", "Platformer"],
            "Funk": ["Beat 'em up", "Action", "Platformer"],
            "Alternative Rock": ["Adventure", "RPG", "Action"],
            "Art Rock": ["Adventure", "RPG", "Puzzle"],
            "Pop": ["Platformer", "Action", "Beat 'em up"],
            "Rock": ["Action", "Beat 'em up", "Adventure"],
            "Progressive Rock": ["RPG", "Adventure", "Puzzle"],
            "Psychedelic": ["Adventure", "RPG", "Puzzle"],
            "House": ["Action", "Platformer", "Beat 'em up"],
            "Art Pop": ["Adventure", "Puzzle", "RPG"]
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameNote();
});