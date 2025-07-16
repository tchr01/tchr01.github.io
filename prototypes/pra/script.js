// Portfolio Risk Analytics Training Platform
// Main JavaScript file for interactive functionality

// Portfolio Data Models
const portfolioData = {
    conservative: {
        name: "Conservative Portfolio",
        clientName: "Margaret Thompson",
        age: 65,
        experience: "Moderate",
        riskTolerance: "Conservative",
        objectives: "Income generation, capital preservation",
        totalValue: 850000,
        allocation: {
            bonds: 60,
            stocks: 25,
            cash: 10,
            alternatives: 5
        },
        metrics: {
            volatility: 8.2,
            var: -25400,
            sharpe: 1.45,
            beta: 0.62
        },
        performance: [
            { month: 'Jan', value: 100 },
            { month: 'Feb', value: 101.2 },
            { month: 'Mar', value: 99.8 },
            { month: 'Apr', value: 102.1 },
            { month: 'May', value: 101.5 },
            { month: 'Jun', value: 103.2 }
        ]
    },
    balanced: {
        name: "Balanced Portfolio",
        clientName: "Robert Chen",
        age: 45,
        experience: "High",
        riskTolerance: "Moderate",
        objectives: "Growth with income, long-term wealth building",
        totalValue: 1200000,
        allocation: {
            stocks: 60,
            bonds: 30,
            alternatives: 7,
            cash: 3
        },
        metrics: {
            volatility: 12.4,
            var: -45200,
            sharpe: 1.24,
            beta: 0.87
        },
        performance: [
            { month: 'Jan', value: 100 },
            { month: 'Feb', value: 103.1 },
            { month: 'Mar', value: 98.7 },
            { month: 'Apr', value: 106.2 },
            { month: 'May', value: 104.8 },
            { month: 'Jun', value: 108.4 }
        ]
    },
    aggressive: {
        name: "Growth Portfolio",
        clientName: "Sarah Martinez",
        age: 30,
        experience: "Low",
        riskTolerance: "High",
        objectives: "Maximum growth, long-term wealth accumulation",
        totalValue: 425000,
        allocation: {
            stocks: 80,
            alternatives: 15,
            bonds: 3,
            cash: 2
        },
        metrics: {
            volatility: 18.7,
            var: -68500,
            sharpe: 1.12,
            beta: 1.23
        },
        performance: [
            { month: 'Jan', value: 100 },
            { month: 'Feb', value: 108.2 },
            { month: 'Mar', value: 94.3 },
            { month: 'Apr', value: 112.5 },
            { month: 'May', value: 106.7 },
            { month: 'Jun', value: 115.8 }
        ]
    }
};

// Persona-specific recommendations
const personaRecommendations = {
    conservative: {
        primary: "basic",
        recommendations: [
            "Start with Basic Risk Discussion to build confidence in explaining conservative portfolio characteristics",
            "Focus on income generation and capital preservation themes that resonate with this client",
            "Emphasize the lower volatility and stability features of bond-heavy allocations",
            "Practice explaining how conservative allocations help protect retirement income"
        ],
        scenarioFocus: {
            "basic": "Focus: Risk education & retirement income protection",
            "stress": "Focus: Reassurance during market downturns",
            "rebalance": "Focus: Maintaining conservative allocation",
            "performance": "Focus: Income tracking & preservation"
        }
    },
    balanced: {
        primary: "rebalancing",
        recommendations: [
            "Rebalancing Discussion is ideal for balanced portfolios with multiple asset classes",
            "Practice explaining the benefits of diversification across stocks and bonds",
            "Focus on long-term wealth building strategies for mid-career professionals",
            "Emphasize how rebalancing maintains the intended risk/return profile"
        ],
        scenarioFocus: {
            "basic": "Focus: Risk education & diversification benefits",
            "stress": "Focus: Balanced approach during volatility",
            "rebalance": "Focus: Multi-asset portfolio management",
            "performance": "Focus: Growth with income tracking"
        }
    },
    aggressive: {
        primary: "market-stress",
        recommendations: [
            "Market Stress Scenario is crucial for high-growth portfolios with higher volatility",
            "Practice managing expectations about market fluctuations in growth-focused allocations",
            "Focus on long-term wealth accumulation themes for younger investors",
            "Emphasize the importance of staying invested during market turbulence"
        ],
        scenarioFocus: {
            "basic": "Focus: Risk education & growth potential",
            "stress": "Focus: Managing volatility expectations",
            "rebalance": "Focus: Growth-oriented rebalancing",
            "performance": "Focus: Long-term growth tracking"
        }
    }
};

// Training Scenarios Data
const trainingScenarios = {
    basic: {
        title: "Basic Risk Discussion",
        description: "Practice explaining portfolio risk characteristics to a client",
        objectives: [
            "Master compliant language for discussing portfolio volatility",
            "Learn to reference historical data appropriately",
            "Practice connecting risk metrics to client objectives"
        ],
        completionInstructions: "Complete this scenario by selecting the most compliant response when the client asks about portfolio volatility. Focus on using appropriate disclaimers and historical references.",
        practicalApplication: {
            title: "How to apply this in your next client call",
            content: [
                "Start risk discussions by acknowledging the client's concerns with empathy",
                "Always reference 'historical data' when discussing past performance patterns",
                "Include the disclaimer 'past performance doesn't guarantee future results' in risk conversations",
                "Connect risk characteristics to the client's specific investment objectives and time horizon",
                "Use phrases like 'based on historical analysis' rather than making predictive statements"
            ],
            tips: [
                "Keep a compliance phrase reference sheet handy during client calls",
                "Practice transitioning from concern acknowledgment to educational explanation",
                "Use portfolio allocation percentages to explain expected volatility ranges"
            ]
        },
        conversations: [
            {
                speaker: "client",
                message: "I'm concerned about the recent volatility in my portfolio. Can you explain what this means for my investments?"
            }
        ],
        responses: [
            {
                text: "Based on historical data, your portfolio has shown a volatility of 12.4%, which is typical for a balanced allocation. This means we can expect normal fluctuations, but past performance doesn't guarantee future results.",
                compliance: "good",
                feedback: "Excellent! You used compliant language and referenced historical data appropriately."
            },
            {
                text: "Don't worry, your portfolio will definitely recover. The market always goes up in the long run.",
                compliance: "poor",
                feedback: "Avoid guarantees and predictions. Use phrases like 'historically' and include disclaimers."
            },
            {
                text: "Your portfolio is experiencing normal market volatility. Let me show you the risk characteristics based on your asset allocation.",
                compliance: "good",
                feedback: "Good approach focusing on risk characteristics rather than predictions."
            }
        ]
    },
    "market-stress": {
        title: "Market Stress Scenario", 
        description: "Handle client concerns during market downturns",
        objectives: [
            "Learn to provide reassurance without making guarantees",
            "Practice crisis communication techniques",
            "Master the art of refocusing clients on long-term objectives"
        ],
        completionInstructions: "Navigate this challenging scenario by addressing the client's emotional concerns while maintaining compliance. Avoid making predictions about market recovery and focus on historical context and risk management principles.",
        practicalApplication: {
            title: "How to apply this in your next client call",
            content: [
                "Acknowledge the client's emotions first - 'I understand your concern' shows empathy",
                "Redirect to historical market patterns without predicting future outcomes",
                "Review the client's original investment timeline and objectives during stress periods",
                "Use phrases like 'historically, markets have recovered from downturns' rather than 'the market will recover'",
                "Discuss the risk management features already built into their portfolio allocation"
            ],
            tips: [
                "Have historical market recovery data readily available for reference",
                "Practice staying calm and measured when clients express panic",
                "Prepare compliant talking points for major market events in advance"
            ]
        },
        conversations: [
            {
                speaker: "client",
                message: "The market is down 15% this month and I'm worried about losing my retirement savings. Should I sell everything and move to cash?"
            }
        ],
        responses: [
            {
                text: "I understand your concern. Let's review your portfolio's risk characteristics and how it has historically performed during similar market conditions. Remember, market volatility is normal.",
                compliance: "good",
                feedback: "Excellent empathy and focus on historical performance with appropriate disclaimers."
            },
            {
                text: "No, you should definitely stay invested. The market will bounce back quickly.",
                compliance: "poor",
                feedback: "Avoid giving direct investment advice. Focus on education and risk analysis."
            },
            {
                text: "Market timing is challenging. Let's analyze your current allocation against your long-term objectives and risk tolerance to see if any adjustments might be appropriate.",
                compliance: "good",
                feedback: "Good approach focusing on suitability analysis rather than market predictions."
            }
        ]
    },
    rebalancing: {
        title: "Rebalancing Discussion",
        description: "Explain portfolio rebalancing concepts and benefits",
        objectives: [
            "Explain rebalancing benefits without guaranteeing outcomes",
            "Connect rebalancing to original investment strategy",
            "Address client concerns about 'selling winners'"
        ],
        completionInstructions: "Help the client understand why rebalancing maintains their intended risk profile. Focus on the original investment strategy and risk management rather than predicting which assets will perform better.",
        practicalApplication: {
            title: "How to apply this in your next client call",
            content: [
                "Reference the client's original investment policy statement and target allocation",
                "Explain rebalancing as 'maintaining your intended risk level' rather than 'improving returns'",
                "Use the analogy of 'staying on course' toward their financial goals",
                "Emphasize that rebalancing is systematic, not market timing",
                "Discuss how asset class performance naturally causes drift from target allocations"
            ],
            tips: [
                "Show the client their current vs. target allocation visually",
                "Have examples of how rebalancing has historically managed risk",
                "Prepare to explain why 'selling high and buying low' is prudent risk management"
            ]
        },
        conversations: [
            {
                speaker: "client",
                message: "My stocks have done really well this year. Why are you suggesting we sell some of them to buy bonds?"
            }
        ],
        responses: [
            {
                text: "Rebalancing helps maintain your target allocation and risk profile. When one asset class outperforms, it can increase your portfolio's overall risk beyond your comfort level.",
                compliance: "good",
                feedback: "Clear explanation of rebalancing benefits focusing on risk management."
            },
            {
                text: "We need to sell your winners and buy losers to guarantee better performance going forward.",
                compliance: "poor",
                feedback: "Avoid guarantees. Focus on risk management and maintaining target allocation."
            },
            {
                text: "Based on your original investment objectives, we designed a specific allocation. Rebalancing helps maintain that intended risk level regardless of market performance.",
                compliance: "good",
                feedback: "Excellent connection to original objectives and risk management principles."
            }
        ]
    },
    "performance-review": {
        title: "Performance Review",
        description: "Conduct a comprehensive portfolio performance review",
        objectives: [
            "Present performance data using compliant language",
            "Connect performance to client objectives and risk tolerance",
            "Avoid making future performance predictions"
        ],
        completionInstructions: "Guide the client through their portfolio performance while focusing on objective alignment and risk-adjusted returns. Avoid suggesting the performance will continue or making market predictions.",
        practicalApplication: {
            title: "How to apply this in your next client call",
            content: [
                "Begin performance discussions by reviewing the client's original objectives",
                "Present returns in context of the client's risk tolerance and time horizon",
                "Use risk-adjusted metrics like Sharpe ratio to show performance quality",
                "Compare performance to appropriate benchmarks, not just market indices",
                "Discuss attribution - which asset classes or sectors contributed to performance"
            ],
            tips: [
                "Prepare performance reports that show both absolute and risk-adjusted returns",
                "Have appropriate benchmark comparisons ready for the client's allocation",
                "Practice explaining why risk-adjusted returns matter more than raw returns"
            ]
        },
        conversations: [
            {
                speaker: "client",
                message: "I'd like to understand how my portfolio has performed this year compared to my expectations and the market."
            }
        ],
        responses: [
            {
                text: "Let's review your portfolio's performance based on historical data. Your portfolio returned 8.2% this year, which aligns with your conservative risk profile and income-focused objectives.",
                compliance: "good",
                feedback: "Excellent focus on historical performance and alignment with client objectives."
            },
            {
                text: "Your portfolio definitely outperformed the market and will continue to do so because of our superior strategy.",
                compliance: "poor",
                feedback: "Avoid guarantees about future performance. Focus on risk-adjusted returns and objectives alignment."
            },
            {
                text: "Based on your investment objectives and risk tolerance, let's analyze how each asset class contributed to your overall performance this period.",
                compliance: "good",
                feedback: "Good approach focusing on attribution analysis and objective alignment."
            }
        ]
    }
};

// Compliance Keywords and Phrases
const complianceChecker = {
    prohibited: [
        'guarantee', 'guaranteed', 'will definitely', 'promise', 'certain',
        'always goes up', 'never fails', 'risk-free', 'can\'t lose'
    ],
    recommended: [
        'based on historical data', 'past performance doesn\'t guarantee',
        'may', 'could', 'historically', 'typically', 'generally',
        'risk characteristics', 'based on your objectives'
    ],
    check: function(text) {
        const lowercaseText = text.toLowerCase();
        const issues = [];
        const goodPhrases = [];
        
        this.prohibited.forEach(phrase => {
            if (lowercaseText.includes(phrase.toLowerCase())) {
                issues.push(phrase);
            }
        });
        
        this.recommended.forEach(phrase => {
            if (lowercaseText.includes(phrase.toLowerCase())) {
                goodPhrases.push(phrase);
            }
        });
        
        let score = 100;
        score -= issues.length * 15;
        score += goodPhrases.length * 5;
        score = Math.max(0, Math.min(100, score));
        
        return {
            score: score,
            issues: issues,
            goodPhrases: goodPhrases,
            status: score >= 85 ? 'good' : score >= 70 ? 'warning' : 'error'
        };
    }
};

// Application State
let currentPortfolio = 'conservative'; // Match the HTML active selection
let currentView = 'dashboard';
let currentScenario = null;
let conversationHistory = [];
let complianceScore = 92;
let charts = {};

// Progress Tracking System
let progressData = {
    totalTimeSpent: 0, // in minutes
    sessionsCompleted: 0,
    averageComplianceScore: 0,
    scenarioProgress: {
        'basic': { completed: false, score: null, timeSpent: 0, attempts: 0, lastCompleted: null },
        'market-stress': { completed: false, score: null, timeSpent: 0, attempts: 0, lastCompleted: null },
        'rebalancing': { completed: false, score: null, timeSpent: 0, attempts: 0, lastCompleted: null },
        'performance-review': { completed: false, score: null, timeSpent: 0, attempts: 0, lastCompleted: null }
    },
    personaProgress: {
        'conservative': { scenariosCompleted: 0, averageScore: 0, timeSpent: 0 },
        'balanced': { scenariosCompleted: 0, averageScore: 0, timeSpent: 0 },
        'aggressive': { scenariosCompleted: 0, averageScore: 0, timeSpent: 0 }
    },
    complianceHistory: [],
    sessionStartTime: null
};

// DOM Elements
const elements = {
    views: {
        dashboard: document.getElementById('dashboard-view'),
        scenarios: document.getElementById('scenarios-view'),
        progress: document.getElementById('progress-view')
    },
    navButtons: document.querySelectorAll('.nav-btn'),
    portfolioCards: document.querySelectorAll('.portfolio-card'),
    scenarioButtons: document.querySelectorAll('.start-scenario'),
    exitScenario: document.getElementById('exit-scenario')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateDashboard();
});

function initializeApp() {
    // Load saved progress
    loadProgress();
    
    // Add debug function to global scope for testing
    window.clearProgress = clearProgress;
    window.progressData = progressData;
    
    // Set initial view
    showView('dashboard');
    
    // Initialize charts
    initializeCharts();
    
    // Update portfolio display
    updatePortfolioDisplay();
    
    // Initialize persona display
    updatePersonaDisplay();
    
    // Initialize training selection
    updateTrainingSelection();
    
    // Initialize progress view
    updateProgressView();
    
    console.log('Risk Analytics Training Platform initialized');
    console.log('Debug: Current progress data:', progressData);
}

function setupEventListeners() {
    // Navigation
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            showView(view);
            updateNavigation(e.currentTarget);
            
            // Update training selection when scenarios tab is clicked
            if (view === 'scenarios') {
                updateTrainingSelection();
            }
        });
    });
    
    // Portfolio selection
    elements.portfolioCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const portfolio = e.currentTarget.dataset.portfolio;
            selectPortfolio(portfolio);
            updatePortfolioCards(e.currentTarget);
        });
    });
    
    // Scenario buttons (dashboard)
    elements.scenarioButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const scenario = e.currentTarget.dataset.scenario;
            startScenario(scenario);
        });
    });
    
    // Persona switcher
    setupPersonaSwitcher();
    
    // Training selection scenario buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.scenario-start-btn')) {
            const scenario = e.target.dataset.scenario;
            startScenario(scenario);
        }
        
        // Progress page start training buttons
        if (e.target.matches('.start-training-btn')) {
            const portfolio = e.target.dataset.portfolio;
            selectPortfolio(portfolio);
            showView('scenarios');
        }
    });
    
    // Exit scenario
    if (elements.exitScenario) {
        elements.exitScenario.addEventListener('click', () => {
            exitScenario();
        });
    }
    
    // Scenario switching buttons
    setupScenarioSwitching();
    
    // Custom input functionality
    setupCustomInput();
}

function showView(viewName) {
    // Hide all views
    Object.values(elements.views).forEach(view => {
        if (view) view.classList.remove('active');
    });
    
    // Show selected view
    if (elements.views[viewName]) {
        elements.views[viewName].classList.add('active');
        currentView = viewName;
        
        // Update progress view when it's shown
        if (viewName === 'progress') {
            updateProgressView();
        }
    }
}

function updateNavigation(activeBtn) {
    elements.navButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function selectPortfolio(portfolioKey) {
    currentPortfolio = portfolioKey;
    updateDashboard();
    updatePersonaDisplay();
    
    // Update training selection if scenarios view is active
    if (currentView === 'scenarios' && !currentScenario) {
        updateTrainingSelection();
    }
}

function updatePortfolioCards(activeCard) {
    // Remove active class from all cards and add to the clicked one
    elements.portfolioCards.forEach(card => card.classList.remove('active'));
    activeCard.classList.add('active');
    
    // Also update the persona switcher state to keep everything in sync
    updatePersonaSwitcherState();
}

function updateDashboard() {
    const portfolio = portfolioData[currentPortfolio];
    
    // Update risk metrics
    updateRiskMetrics(portfolio.metrics);
    
    // Update charts
    updateCharts(portfolio);
    
    // Update compliance score display
    updateComplianceDisplay();
}

function updateRiskMetrics(metrics) {
    const elements = {
        volatility: document.getElementById('volatility'),
        var: document.getElementById('var'),
        sharpe: document.getElementById('sharpe'),
        beta: document.getElementById('beta')
    };
    
    if (elements.volatility) elements.volatility.textContent = `${metrics.volatility}%`;
    if (elements.var) elements.var.textContent = `$${metrics.var.toLocaleString()}`;
    if (elements.sharpe) elements.sharpe.textContent = metrics.sharpe.toFixed(2);
    if (elements.beta) elements.beta.textContent = metrics.beta.toFixed(2);
}

function updateComplianceDisplay() {
    const scoreElements = document.querySelectorAll('.score-value');
    scoreElements.forEach(el => {
        el.textContent = `${complianceScore}%`;
    });
}

function setupPersonaSwitcher() {
    const switcher = document.getElementById('persona-switcher');
    const selector = document.getElementById('persona-selector');
    const dropdown = document.getElementById('persona-dropdown');
    
    if (!switcher || !selector || !dropdown) return;
    
    // Toggle dropdown
    selector.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePersonaDropdown();
    });
    
    // Persona option clicks
    dropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.persona-option');
        if (option) {
            const portfolio = option.dataset.portfolio;
            selectPortfolioFromSwitcher(portfolio);
            closePersonaDropdown();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) {
            closePersonaDropdown();
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePersonaDropdown();
        }
    });
}

function togglePersonaDropdown() {
    const switcher = document.getElementById('persona-switcher');
    if (switcher) {
        switcher.classList.toggle('open');
    }
}

function closePersonaDropdown() {
    const switcher = document.getElementById('persona-switcher');
    if (switcher) {
        switcher.classList.remove('open');
    }
}

function selectPortfolioFromSwitcher(portfolioKey) {
    // Update the current portfolio
    selectPortfolio(portfolioKey);
    
    // Update the dropdown active state
    updatePersonaSwitcherState();
    
    // Update dashboard portfolio cards if on dashboard
    if (currentView === 'dashboard') {
        updatePortfolioCardsActive();
    }
    
    // Show a brief confirmation
    showPersonaSwitchConfirmation(portfolioData[portfolioKey]);
}

function updatePortfolioCardsActive() {
    // Update the active state of portfolio cards to match the current portfolio
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        const isActive = card.dataset.portfolio === currentPortfolio;
        card.classList.toggle('active', isActive);
    });
}

function updatePersonaSwitcherState() {
    const options = document.querySelectorAll('.persona-option');
    options.forEach(option => {
        const isActive = option.dataset.portfolio === currentPortfolio;
        option.classList.toggle('active', isActive);
        
        const status = option.querySelector('.option-status i');
        if (status) {
            status.className = isActive ? 'fas fa-check-circle' : 'fas fa-circle';
        }
    });
}

function showPersonaSwitchConfirmation(portfolio) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'persona-switch-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Switched to ${portfolio.clientName}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
}

function updatePersonaDisplay() {
    const portfolio = portfolioData[currentPortfolio];
    
    // Update header persona indicator
    updateHeaderPersona(portfolio);
    
    // Update scenario view persona card
    updateScenarioPersonaCard(portfolio);
    
    // Update any other persona references
    updateAllPersonaReferences(portfolio);
    
    // Update switcher state
    updatePersonaSwitcherState();
    
    // Update dashboard portfolio cards if on dashboard
    if (currentView === 'dashboard') {
        updatePortfolioCardsActive();
    }
}

function updateHeaderPersona(portfolio) {
    const personaName = document.getElementById('persona-name');
    const personaType = document.getElementById('persona-type');
    const personaAvatar = document.querySelector('.persona-avatar');
    
    if (personaName) personaName.textContent = portfolio.clientName;
    if (personaType) personaType.textContent = portfolio.name;
    
    if (personaAvatar) {
        // Remove existing classes
        personaAvatar.classList.remove('conservative', 'balanced', 'aggressive');
        // Add current portfolio class
        personaAvatar.classList.add(currentPortfolio);
    }
}

function updateScenarioPersonaCard(portfolio) {
    // Update persona card in scenarios view
    const elements = {
        name: document.getElementById('persona-card-name'),
        type: document.getElementById('persona-card-type'),
        age: document.getElementById('persona-card-age'),
        experience: document.getElementById('persona-card-experience'),
        risk: document.getElementById('persona-card-risk'),
        value: document.getElementById('persona-card-value'),
        objectives: document.getElementById('persona-card-objectives'),
        avatar: document.getElementById('persona-card-avatar')
    };
    
    if (elements.name) elements.name.textContent = portfolio.clientName;
    if (elements.type) elements.type.textContent = `${portfolio.name} Training`;
    if (elements.age) elements.age.textContent = portfolio.age;
    if (elements.experience) elements.experience.textContent = portfolio.experience;
    if (elements.risk) elements.risk.textContent = portfolio.riskTolerance;
    if (elements.value) elements.value.textContent = formatCurrency(portfolio.totalValue);
    if (elements.objectives) elements.objectives.textContent = portfolio.objectives;
    
    if (elements.avatar) {
        // Remove existing classes
        elements.avatar.classList.remove('conservative', 'balanced', 'aggressive');
        // Add current portfolio class
        elements.avatar.classList.add(currentPortfolio);
    }
}

function updateAllPersonaReferences(portfolio) {
    // Update any other client name references
    const clientNameElements = document.querySelectorAll('#client-name');
    clientNameElements.forEach(el => {
        el.textContent = portfolio.clientName;
    });
    
    // Update any other portfolio-specific elements
    const clientAgeElements = document.querySelectorAll('#client-age');
    clientAgeElements.forEach(el => {
        el.textContent = portfolio.age;
    });
    
    const clientExperienceElements = document.querySelectorAll('#client-experience');
    clientExperienceElements.forEach(el => {
        el.textContent = portfolio.experience;
    });
    
    const clientRiskElements = document.querySelectorAll('#client-risk');
    clientRiskElements.forEach(el => {
        el.textContent = portfolio.riskTolerance;
    });
    
    const clientObjectivesElements = document.querySelectorAll('#client-objectives');
    clientObjectivesElements.forEach(el => {
        el.textContent = portfolio.objectives;
    });
}

function initializeCharts() {
    // Asset Allocation Chart
    const allocationCtx = document.getElementById('allocationChart');
    if (allocationCtx) {
        charts.allocation = new Chart(allocationCtx, {
            type: 'doughnut',
            data: {
                labels: ['Bonds', 'Stocks', 'Cash', 'Alternatives'],
                datasets: [{
                    data: [60, 25, 10, 5],
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#f39c12',
                        '#9b59b6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: '#f1f3f4'
                        }
                    }
                }
            }
        });
    }
    
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        charts.performance = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Portfolio Performance',
                    data: [100, 101.2, 99.8, 102.1, 101.5, 103.2],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#d1d5db'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#d1d5db'
                        }
                    }
                }
            }
        });
    }
}

function updateCharts(portfolio) {
    // Update allocation chart
    if (charts.allocation) {
        const allocation = portfolio.allocation;
        charts.allocation.data.datasets[0].data = [
            allocation.bonds || 0,
            allocation.stocks || 0,
            allocation.cash || 0,
            allocation.alternatives || 0
        ];
        charts.allocation.update();
    }
    
    // Update performance chart
    if (charts.performance) {
        const performance = portfolio.performance;
        charts.performance.data.labels = performance.map(p => p.month);
        charts.performance.data.datasets[0].data = performance.map(p => p.value);
        charts.performance.update();
    }
}

function startScenario(scenarioKey) {
    currentScenario = scenarioKey;
    const scenario = trainingScenarios[scenarioKey];
    const portfolio = portfolioData[currentPortfolio];
    
    // Start tracking session time
    progressData.sessionStartTime = new Date();
    progressData.scenarioProgress[scenarioKey].attempts++;
    
    // Hide training selection and show active training
    document.getElementById('training-selection').style.display = 'none';
    document.getElementById('active-training').style.display = 'block';
    
    // Update scenario view
    updateScenarioView(scenario, portfolio);
    
    // Update scenario switch buttons
    updateScenarioSwitchButtons(scenarioKey);
    
    // Show scenario view if not already showing
    if (currentView !== 'scenarios') {
        showView('scenarios');
    }
    
    // Initialize conversation
    conversationHistory = [];
    displayConversation(scenario);
}

function exitScenario() {
    currentScenario = null;
    
    // Show training selection and hide active training
    document.getElementById('training-selection').style.display = 'block';
    document.getElementById('active-training').style.display = 'none';
    
    // Update training selection to reflect current persona
    updateTrainingSelection();
    
    // Clear conversation history
    conversationHistory = [];
}

function updateTrainingSelection() {
    const portfolio = portfolioData[currentPortfolio];
    const recommendations = personaRecommendations[currentPortfolio];
    
    // Update persona summary in selection view
    updateTrainingSelectionPersona(portfolio);
    
    // Update scenario focus descriptions
    updateScenarioFocus(recommendations);
    
    // Update persona recommendations
    updatePersonaRecommendationsDisplay(portfolio, recommendations);
    
    // Highlight recommended scenario
    highlightRecommendedScenario(recommendations.primary);
}

function updateTrainingSelectionPersona(portfolio) {
    const elements = {
        avatar: document.getElementById('selection-persona-avatar'),
        name: document.getElementById('selection-persona-name'),
        type: document.getElementById('selection-persona-type'),
        age: document.getElementById('selection-persona-age'),
        risk: document.getElementById('selection-persona-risk'),
        value: document.getElementById('selection-persona-value')
    };
    
    if (elements.name) elements.name.textContent = portfolio.clientName;
    if (elements.type) elements.type.textContent = portfolio.name;
    if (elements.age) elements.age.textContent = portfolio.age;
    if (elements.risk) elements.risk.textContent = portfolio.riskTolerance;
    if (elements.value) elements.value.textContent = formatCurrency(portfolio.totalValue);
    
    if (elements.avatar) {
        elements.avatar.classList.remove('conservative', 'balanced', 'aggressive');
        elements.avatar.classList.add(currentPortfolio);
    }
}

function updateScenarioFocus(recommendations) {
    const focusElements = {
        'basic': document.getElementById('basic-focus'),
        'stress': document.getElementById('stress-focus'),
        'rebalance': document.getElementById('rebalance-focus'),
        'performance': document.getElementById('performance-focus')
    };
    
    Object.keys(focusElements).forEach(key => {
        const element = focusElements[key];
        if (element && recommendations.scenarioFocus[key]) {
            element.textContent = recommendations.scenarioFocus[key];
        }
    });
}

function updatePersonaRecommendationsDisplay(portfolio, recommendations) {
    const nameElement = document.getElementById('recommendations-persona-name');
    const contentElement = document.getElementById('persona-recommendations');
    
    if (nameElement) {
        nameElement.textContent = portfolio.clientName;
    }
    
    if (contentElement) {
        contentElement.innerHTML = recommendations.recommendations.map(rec => 
            `<div class="recommendation-item">${rec}</div>`
        ).join('');
    }
}

function highlightRecommendedScenario(primaryScenario) {
    // Remove existing recommended classes
    document.querySelectorAll('.scenario-option').forEach(option => {
        option.classList.remove('recommended');
        const badge = option.querySelector('.scenario-badge.recommended');
        if (badge) badge.style.display = 'none';
    });
    
    // Add recommended class to primary scenario
    const primaryOption = document.querySelector(`[data-scenario="${primaryScenario}"]`);
    if (primaryOption) {
        primaryOption.classList.add('recommended');
        const badge = primaryOption.querySelector('.scenario-badge.recommended');
        if (badge) badge.style.display = 'block';
    }
}

function updateScenarioView(scenario, portfolio) {
    // Update scenario title
    const titleElement = document.getElementById('scenario-title');
    if (titleElement) {
        titleElement.textContent = scenario.title;
    }
    
    // Update client details
    updateClientProfile(portfolio);
    
    // Update portfolio context
    updatePortfolioContext(portfolio);
    
    // Update coaching panel
    updateCoachingPanel();
    
    // Update training guidance
    updateTrainingGuidance(scenario);
    
    // Setup collapsible toggle for training guidance
    setupTrainingGuidanceToggle();
}

function updateTrainingGuidance(scenario) {
    // Update learning objectives
    const objectivesElement = document.getElementById('scenario-objectives');
    if (objectivesElement && scenario.objectives) {
        objectivesElement.innerHTML = scenario.objectives.map(objective => 
            `<li>${objective}</li>`
        ).join('');
    }
    
    // Update completion instructions
    const instructionsElement = document.getElementById('completion-instructions');
    if (instructionsElement && scenario.completionInstructions) {
        instructionsElement.textContent = scenario.completionInstructions;
    }
    
    // Update practical application - compact format
    const applicationElement = document.getElementById('practical-application');
    if (applicationElement && scenario.practicalApplication) {
        const app = scenario.practicalApplication;
        applicationElement.innerHTML = `
            <div class="application-content-compact">
                ${app.content.map(item => `<div style="margin-bottom: 0.5rem;">• ${item}</div>`).join('')}
                ${app.tips && app.tips.length > 0 ? `
                    <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #d4edda;">
                        <strong>💡 Pro Tips:</strong>
                        ${app.tips.map(tip => `<div style="margin-top: 0.25rem;">• ${tip}</div>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Setup collapsible training guidance
function setupTrainingGuidanceToggle() {
    const guidanceToggle = document.getElementById('guidance-toggle');
    const guidanceContent = document.getElementById('guidance-content');
    
    if (guidanceToggle && guidanceContent) {
        // Set initial state (expanded)
        guidanceContent.style.maxHeight = guidanceContent.scrollHeight + 'px';
        
        guidanceToggle.addEventListener('click', function() {
            const isCollapsed = guidanceContent.classList.contains('collapsed');
            
            if (isCollapsed) {
                // Expand
                guidanceContent.classList.remove('collapsed');
                guidanceToggle.classList.remove('collapsed');
                guidanceContent.style.maxHeight = guidanceContent.scrollHeight + 'px';
            } else {
                // Collapse
                guidanceContent.classList.add('collapsed');
                guidanceToggle.classList.add('collapsed');
                guidanceContent.style.maxHeight = '0px';
            }
        });
    }
}

// Setup scenario switching functionality
function setupScenarioSwitching() {
    const scenarioSwitchBtns = document.querySelectorAll('.scenario-switch-btn');
    
    // Remove existing listeners to avoid duplicates
    scenarioSwitchBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Re-query buttons after replacing them
    const newScenarioSwitchBtns = document.querySelectorAll('.scenario-switch-btn');
    
    newScenarioSwitchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const scenarioKey = this.dataset.scenario;
            
            // Don't switch if already active
            if (this.classList.contains('active')) {
                return;
            }
            
            // Update active button
            updateScenarioSwitchButtons(scenarioKey);
            
            // Switch to the new scenario
            startScenario(scenarioKey);
        });
    });
    
    // Update completion indicators
    updateScenarioCompletionIndicators();
}

// Update active state of scenario switch buttons
function updateScenarioSwitchButtons(activeScenario) {
    const scenarioSwitchBtns = document.querySelectorAll('.scenario-switch-btn');
    
    scenarioSwitchBtns.forEach(btn => {
        if (btn.dataset.scenario === activeScenario) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update completion indicators
    updateScenarioCompletionIndicators();
}

// Update completion indicators for scenario switch buttons
function updateScenarioCompletionIndicators() {
    const scenarioSwitchBtns = document.querySelectorAll('.scenario-switch-btn');
    
    scenarioSwitchBtns.forEach(btn => {
        const scenarioKey = btn.dataset.scenario;
        const completionIndicator = btn.querySelector('.completion-indicator');
        const isCompleted = progressData.scenarioProgress[scenarioKey]?.completed;
        
        if (isCompleted) {
            btn.classList.add('completed');
            if (completionIndicator) {
                completionIndicator.classList.add('show');
            }
        } else {
            btn.classList.remove('completed');
            if (completionIndicator) {
                completionIndicator.classList.remove('show');
            }
        }
    });
}

function updateClientProfile(portfolio) {
    const elements = {
        name: document.getElementById('client-name'),
        age: document.getElementById('client-age'),
        experience: document.getElementById('client-experience'),
        risk: document.getElementById('client-risk'),
        objectives: document.getElementById('client-objectives')
    };
    
    if (elements.name) elements.name.textContent = portfolio.clientName;
    if (elements.age) elements.age.textContent = portfolio.age;
    if (elements.experience) elements.experience.textContent = portfolio.experience;
    if (elements.risk) elements.risk.textContent = portfolio.riskTolerance;
    if (elements.objectives) elements.objectives.textContent = portfolio.objectives;
}

function updatePortfolioContext(portfolio) {
    const contextElement = document.getElementById('context-metrics');
    if (contextElement) {
        contextElement.innerHTML = `
            <div class="context-metric">
                <strong>Portfolio Value:</strong> $${portfolio.totalValue.toLocaleString()}
            </div>
            <div class="context-metric">
                <strong>Risk Level:</strong> ${portfolio.riskTolerance}
            </div>
            <div class="context-metric">
                <strong>Primary Objective:</strong> ${portfolio.objectives}
            </div>
            <div class="context-metric">
                <strong>Current Volatility:</strong> ${portfolio.metrics.volatility}%
            </div>
        `;
    }
}

function updateCoachingPanel() {
    const coachingElement = document.getElementById('coaching-content');
    if (coachingElement) {
        coachingElement.innerHTML = `
            <div class="coaching-tip">
                <i class="fas fa-info-circle"></i>
                <p>Remember to focus on risk characteristics rather than making predictions about future performance.</p>
            </div>
            <div class="coaching-tip">
                <i class="fas fa-lightbulb"></i>
                <p>Use phrases like "based on historical data" and always include appropriate disclaimers.</p>
            </div>
        `;
    }
}

function displayConversation(scenario) {
    const historyElement = document.getElementById('conversation-history');
    const optionsElement = document.getElementById('response-options');
    
    if (!historyElement || !optionsElement) {
        console.error('Missing conversation elements');
        return;
    }
    
    // Clear previous conversation
    historyElement.innerHTML = '';
    
    // Add initial message
    if (scenario.conversations && scenario.conversations.length > 0) {
        const initialMessage = scenario.conversations[0];
        addMessageToHistory(initialMessage.speaker, initialMessage.message);
    }
    
    // Display response options
    if (scenario.responses && scenario.responses.length > 0) {
        displayResponseOptions(scenario.responses);
    }
}

function addMessageToHistory(speaker, message) {
    const historyElement = document.getElementById('conversation-history');
    if (!historyElement) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${speaker}`;
    messageDiv.innerHTML = `
        <strong>${speaker === 'client' ? 'Client' : 'You'}:</strong>
        <p>${message}</p>
    `;
    
    historyElement.appendChild(messageDiv);
    historyElement.scrollTop = historyElement.scrollHeight;
}


function selectResponse(response, index) {
    // Add response to conversation
    addMessageToHistory('advisor', response.text);
    
    // Check compliance
    const complianceResult = complianceChecker.check(response.text);
    updateComplianceStatus(complianceResult);
    
    // Show feedback
    showResponseFeedback(response, complianceResult);
    
    // Update compliance score
    updateSessionScore(complianceResult.score);
    
    // Track response in compliance history
    progressData.complianceHistory.push({
        scenario: currentScenario,
        persona: currentPortfolio,
        score: complianceResult.score,
        timestamp: new Date(),
        response: response.text
    });
    
    // Complete the scenario after response
    setTimeout(() => {
        completeScenario(complianceResult.score);
    }, 3000);
}

function updateComplianceStatus(result) {
    const statusElement = document.getElementById('compliance-status');
    if (!statusElement) return;
    
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('span:last-child');
    
    if (indicator) {
        indicator.className = `status-indicator ${result.status}`;
    }
    
    if (text) {
        const messages = {
            good: 'Compliant language detected',
            warning: 'Review language for compliance',
            error: 'Non-compliant language detected'
        };
        text.textContent = messages[result.status] || 'Language analyzed';
    }
}

function showResponseFeedback(response, complianceResult) {
    // Add system message with feedback
    const feedbackMessage = `
        <div class="feedback-section">
            <p><strong>Feedback:</strong> ${response.feedback}</p>
            <p><strong>Compliance Score:</strong> ${complianceResult.score}%</p>
            ${complianceResult.issues.length > 0 ? 
                `<p><strong>Issues:</strong> ${complianceResult.issues.join(', ')}</p>` : 
                ''}
            ${complianceResult.goodPhrases.length > 0 ? 
                `<p><strong>Good phrases:</strong> ${complianceResult.goodPhrases.join(', ')}</p>` : 
                ''}
        </div>
    `;
    
    const historyElement = document.getElementById('conversation-history');
    if (historyElement) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'message system';
        feedbackDiv.innerHTML = feedbackMessage;
        historyElement.appendChild(feedbackDiv);
        historyElement.scrollTop = historyElement.scrollHeight;
    }
    
    // Clear response options after selection
    const optionsElement = document.getElementById('response-options');
    if (optionsElement) {
        setTimeout(() => {
            optionsElement.innerHTML = `
                <button class="btn btn-primary" onclick="showView('dashboard')">
                    <i class="fas fa-arrow-left"></i>
                    Return to Dashboard
                </button>
            `;
        }, 3000);
    }
}

function updateSessionScore(newScore) {
    // Update running average
    complianceScore = Math.round((complianceScore + newScore) / 2);
    updateComplianceDisplay();
}

function completeScenario(finalScore) {
    if (!currentScenario) return;
    
    // Calculate session time
    const sessionTime = progressData.sessionStartTime ? 
        Math.round((new Date() - progressData.sessionStartTime) / 60000) : 0; // minutes
    
    // Update scenario progress
    const scenarioData = progressData.scenarioProgress[currentScenario];
    scenarioData.completed = true;
    scenarioData.score = finalScore;
    scenarioData.timeSpent += sessionTime;
    scenarioData.lastCompleted = new Date();
    
    // Update persona progress
    const personaData = progressData.personaProgress[currentPortfolio];
    personaData.scenariosCompleted++;
    personaData.timeSpent += sessionTime;
    personaData.averageScore = Math.round(
        (personaData.averageScore * (personaData.scenariosCompleted - 1) + finalScore) / 
        personaData.scenariosCompleted
    );
    
    // Update overall progress
    progressData.totalTimeSpent += sessionTime;
    progressData.sessionsCompleted++;
    
    // Calculate new average compliance score
    const allScores = progressData.complianceHistory.map(h => h.score);
    progressData.averageComplianceScore = allScores.length > 0 ? 
        Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    
    // Save progress (in a real app, this would save to a database)
    saveProgress();
    
    // Update completion indicators on scenario switch buttons
    updateScenarioCompletionIndicators();
    
    // Show completion notification
    showScenarioCompletionNotification(finalScore, sessionTime);
}

function showScenarioCompletionNotification(score, timeSpent) {
    const scenarioTitle = trainingScenarios[currentScenario].title;
    const feedbackMessage = `
        <div class="completion-notification">
            <h4><i class="fas fa-check-circle"></i> Scenario Complete!</h4>
            <p><strong>${scenarioTitle}</strong> has been completed.</p>
            <div class="completion-stats">
                <div class="stat"><strong>Score:</strong> ${score}%</div>
                <div class="stat"><strong>Time:</strong> ${timeSpent} minutes</div>
                <div class="stat"><strong>Persona:</strong> ${portfolioData[currentPortfolio].name}</div>
            </div>
            <p><em>Your progress has been saved. You can now try another scenario or review your progress.</em></p>
        </div>
    `;
    
    const historyElement = document.getElementById('conversation-history');
    if (historyElement) {
        const completionDiv = document.createElement('div');
        completionDiv.className = 'message system completion';
        completionDiv.innerHTML = feedbackMessage;
        historyElement.appendChild(completionDiv);
        historyElement.scrollTop = historyElement.scrollHeight;
    }
}

function saveProgress() {
    // Save to localStorage for persistence across sessions
    try {
        localStorage.setItem('portfolioRiskTraining_progress', JSON.stringify(progressData));
    } catch (e) {
        console.warn('Could not save progress to localStorage:', e);
    }
}

function loadProgress() {
    // Load from localStorage
    try {
        const saved = localStorage.getItem('portfolioRiskTraining_progress');
        if (saved) {
            const loadedData = JSON.parse(saved);
            // Merge with defaults to handle new properties
            Object.assign(progressData, loadedData);
        }
    } catch (e) {
        console.warn('Could not load progress from localStorage:', e);
    }
}

function updateProgressView() {
    const hasCompletedScenarios = Object.values(progressData.scenarioProgress)
        .some(s => s.completed);
    
    // Show appropriate view based on progress
    const emptyState = document.getElementById('progress-empty-state');
    const progressContent = document.getElementById('progress-content');
    
    if (hasCompletedScenarios) {
        if (emptyState) emptyState.style.display = 'none';
        if (progressContent) progressContent.style.display = 'block';
        updateOverallProgress();
        updateScenarioProgressList();
        updatePersonaProgressStats();
    } else {
        if (emptyState) emptyState.style.display = 'block';
        if (progressContent) progressContent.style.display = 'none';
    }
}

function updateOverallProgress() {
    const totalScenarios = Object.keys(progressData.scenarioProgress).length;
    const completedScenarios = Object.values(progressData.scenarioProgress)
        .filter(s => s.completed).length;
    const completionPercentage = Math.round((completedScenarios / totalScenarios) * 100);
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${completionPercentage}%`;
    }
    
    // Update progress text
    const progressText = document.querySelector('.progress-card p');
    if (progressText) {
        progressText.textContent = `${completionPercentage}% Complete (${completedScenarios} of ${totalScenarios} scenarios)`;
    }
    
    // Update compliance score
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `${progressData.averageComplianceScore || 0}%`;
    }
    
    // Update time spent
    const timeDisplay = document.querySelector('.time-display');
    if (timeDisplay) {
        const hours = Math.floor(progressData.totalTimeSpent / 60);
        const minutes = progressData.totalTimeSpent % 60;
        timeDisplay.textContent = hours > 0 ? `${hours}.${Math.round(minutes/6)}h` : `${minutes}min`;
    }
}

function updateScenarioProgressList() {
    const scenarioList = document.querySelector('.scenario-list');
    if (!scenarioList) return;
    
    const scenarioNames = {
        'basic': 'Basic Risk Discussion',
        'market-stress': 'Market Stress Scenario', 
        'rebalancing': 'Rebalancing Discussion',
        'performance-review': 'Performance Review'
    };
    
    scenarioList.innerHTML = '';
    
    Object.entries(progressData.scenarioProgress).forEach(([key, data]) => {
        const div = document.createElement('div');
        div.className = `scenario-item ${data.completed ? 'completed' : 'pending'}`;
        
        const icon = data.completed ? 'fas fa-check-circle' : 'fas fa-circle';
        const score = data.completed ? `${data.score}%` : 'Not Started';
        
        div.innerHTML = `
            <i class="${icon}"></i>
            <span>${scenarioNames[key]}</span>
            <span class="score">${score}</span>
        `;
        
        scenarioList.appendChild(div);
    });
}

function updatePersonaProgressStats() {
    // Add persona-specific statistics if needed
    // This could be expanded to show progress by persona type
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
}

// Clear progress function for testing
function clearProgress() {
    localStorage.removeItem('portfolioRiskTraining_progress');
    // Reset progress data to defaults
    progressData = {
        totalTimeSpent: 0,
        sessionsCompleted: 0,
        averageComplianceScore: 0,
        scenarioProgress: {
            'basic': { completed: false, score: null, timeSpent: 0, attempts: 0, lastCompleted: null },
            'market-stress': { completed: false, score: null, timeSpent: 0, attempts: 0, lastCompleted: null },
            'rebalancing': { completed: false, score: null, timeSpent: 0, attempts: 0, lastCompleted: null },
            'performance-review': { completed: false, score: null, timeSpent: 0, attempts: 0, lastCompleted: null }
        },
        personaProgress: {
            'conservative': { scenariosCompleted: 0, averageScore: 0, timeSpent: 0 },
            'balanced': { scenariosCompleted: 0, averageScore: 0, timeSpent: 0 },
            'aggressive': { scenariosCompleted: 0, averageScore: 0, timeSpent: 0 }
        },
        complianceHistory: [],
        sessionStartTime: null
    };
    updateProgressView();
    updateScenarioCompletionIndicators();
    console.log('Progress cleared and indicators updated.');
}

// Export functions for global access
window.showView = showView;
window.startScenario = startScenario;
window.selectPortfolio = selectPortfolio;
window.complianceChecker = complianceChecker;
window.clearProgress = clearProgress; // For testing

// Initialize portfolio display on load
function updatePortfolioDisplay() {
    // This function updates the portfolio cards with current data
    elements.portfolioCards.forEach(card => {
        const portfolioKey = card.dataset.portfolio;
        const portfolio = portfolioData[portfolioKey];
        
        if (portfolio) {
            const valueElement = card.querySelector('.portfolio-value');
            if (valueElement) {
                valueElement.textContent = formatCurrency(portfolio.totalValue);
            }
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Responsive chart resizing
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
});

// Custom Input Functionality for Chatbot Interface
function setupCustomInput() {
    const toggleBtn = document.getElementById('toggle-custom-input');
    const customInputArea = document.getElementById('custom-input-area');
    const cancelBtn = document.getElementById('cancel-custom');
    const sendBtn = document.getElementById('send-custom');
    const textarea = document.getElementById('custom-response-input');
    
    if (!toggleBtn || !customInputArea || !cancelBtn || !sendBtn || !textarea) return;
    
    // Toggle custom input area
    toggleBtn.addEventListener('click', function() {
        const isVisible = customInputArea.style.display !== 'none';
        
        if (isVisible) {
            customInputArea.style.display = 'none';
            toggleBtn.innerHTML = `
                <i class="fas fa-keyboard"></i>
                Type Custom Response
            `;
        } else {
            customInputArea.style.display = 'block';
            toggleBtn.innerHTML = `
                <i class="fas fa-times"></i>
                Hide Custom Input
            `;
            textarea.focus();
        }
    });
    
    // Cancel custom input
    cancelBtn.addEventListener('click', function() {
        customInputArea.style.display = 'none';
        toggleBtn.innerHTML = `
            <i class="fas fa-keyboard"></i>
            Type Custom Response
        `;
        textarea.value = '';
    });
    
    // Send custom response
    sendBtn.addEventListener('click', function() {
        const customText = textarea.value.trim();
        
        if (!customText) {
            alert('Please enter a response before sending.');
            return;
        }
        
        // Create a custom response object
        const customResponse = {
            text: customText,
            compliance: 'pending',
            feedback: 'Custom response submitted for analysis.'
        };
        
        // Process the custom response
        selectResponse(customResponse, -1); // -1 indicates custom response
        
        // Clear and hide input area
        textarea.value = '';
        customInputArea.style.display = 'none';
        toggleBtn.innerHTML = `
            <i class="fas fa-keyboard"></i>
            Type Custom Response
        `;
    });
    
    // Enable Enter to send (Shift+Enter for new line)
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });
}

// Enhanced response button styling
function displayResponseOptions(responses) {
    const optionsElement = document.getElementById('response-options');
    if (!optionsElement) return;
    
    optionsElement.innerHTML = '';
    
    responses.forEach((response, index) => {
        const button = document.createElement('button');
        button.className = 'enhanced-response-btn';
        
        // Add compliance indicator
        const complianceIcon = response.compliance === 'good' ? 
            '<i class="fas fa-check-circle" style="color: #27ae60;"></i>' :
            response.compliance === 'poor' ? 
            '<i class="fas fa-exclamation-triangle" style="color: #e74c3c;"></i>' :
            '<i class="fas fa-question-circle" style="color: #f39c12;"></i>';
        
        button.innerHTML = `
            <div class="response-content">
                <div class="response-text">${response.text}</div>
                <div class="response-meta">
                    ${complianceIcon}
                    <span class="compliance-hint">${response.compliance === 'good' ? 'Compliant' : response.compliance === 'poor' ? 'Review needed' : 'Analyze'}</span>
                </div>
            </div>
        `;
        
        button.addEventListener('click', () => selectResponse(response, index));
        optionsElement.appendChild(button);
    });
}

console.log('Risk Analytics Training Platform loaded successfully');