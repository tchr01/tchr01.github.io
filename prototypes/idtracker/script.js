// Mock Data
const mockStreams = [
    {
        id: 1,
        title: "Leadership Essentials Course",
        type: "Course",
        description: "Comprehensive leadership training for mid-level managers",
        businessContext: "Supporting Q4 sales push for management training packages",
        primaryOwner: { name: "Sarah Designer", avatar: "SD" },
        businessLead: { name: "Mike Sales", avatar: "MS" },
        currentStage: "building",
        priority: "high",
        shipDate: "2025-10-15",
        clientAccount: "TechCorp Inc",
        percentComplete: 65,
        contentOutline: [
            { module: "Module 1", title: "Introduction to Leadership", duration: "30 min" },
            { module: "Module 2", title: "Communication Fundamentals", duration: "45 min" },
            { module: "Module 3", title: "Building High-Performing Teams", duration: "60 min" },
            { module: "Module 4", title: "Decision-Making & Problem Solving", duration: "45 min" },
            { module: "Module 5", title: "Conflict Resolution", duration: "45 min" },
            { module: "Module 6", title: "Performance Management", duration: "60 min" },
            { module: "Module 7", title: "Change Leadership", duration: "45 min" },
            { module: "Module 8", title: "Strategic Thinking", duration: "50 min" }
        ],
        releaseNotes: {
            status: "draft",
            whatsNew: "A comprehensive 8-module leadership training program designed for emerging leaders and mid-level managers.",
            keyFeatures: ["Interactive case studies", "Self-assessment tools", "Video lessons from industry experts", "Downloadable templates"],
            learningObjectives: ["Lead effective team meetings", "Provide constructive feedback", "Manage conflict professionally"],
            businessValue: "Reduces management turnover by 30% and improves team productivity scores.",
            duration: "6 hours",
            format: "SCORM 1.2"
        }
    },
    {
        id: 2,
        title: "Cybersecurity Awareness Update",
        type: "Content Update",
        description: "Annual update with new threat scenarios",
        businessContext: "Compliance requirement for financial sector clients",
        primaryOwner: { name: "Tom Designer", avatar: "TD" },
        businessLead: { name: "Lisa Stakeholder", avatar: "LS" },
        currentStage: "finalizing",
        priority: "high",
        shipDate: "2025-10-08",
        clientAccount: "SecureBank",
        percentComplete: 90,
        contentOutline: [
            { module: "Section 1", title: "2025 Threat Landscape", duration: "10 min" },
            { module: "Section 2", title: "Phishing & Social Engineering", duration: "15 min" },
            { module: "Section 3", title: "Ransomware Defense", duration: "10 min" },
            { module: "Section 4", title: "Incident Response Procedures", duration: "10 min" }
        ],
        releaseNotes: {
            status: "approved",
            whatsNew: "Updated cybersecurity training with 2025 threat scenarios and latest compliance requirements.",
            keyFeatures: ["New phishing simulation exercises", "Ransomware response protocols", "Updated compliance checkpoints"],
            learningObjectives: ["Identify modern phishing attempts", "Follow incident response procedures", "Maintain compliance standards"],
            businessValue: "Meets SOC 2 and ISO 27001 requirements. Reduces security incidents by up to 60%.",
            duration: "45 minutes",
            format: "Web-based"
        }
    },
    {
        id: 3,
        title: "Sales Onboarding Program",
        type: "Training Program",
        description: "Complete onboarding curriculum for new sales reps",
        businessContext: "Supporting rapid sales team expansion",
        primaryOwner: { name: "Sarah Designer", avatar: "SD" },
        businessLead: { name: "Mike Sales", avatar: "MS" },
        currentStage: "planning",
        priority: "medium",
        shipDate: "2025-11-30",
        clientAccount: null,
        percentComplete: 15,
        contentOutline: [
            { module: "Week 1", title: "Product Knowledge Fundamentals", duration: "2 days" },
            { module: "Week 2", title: "Sales Process & Methodology", duration: "3 days" },
            { module: "Week 3", title: "CRM & Tools Training", duration: "2 days" },
            { module: "Week 4", title: "Objection Handling & Closing", duration: "2 days" },
            { module: "Week 5", title: "Territory Management", duration: "1 day" }
        ],
        releaseNotes: {
            status: "not-started",
            whatsNew: "",
            keyFeatures: [],
            learningObjectives: [],
            businessValue: "",
            duration: "",
            format: ""
        }
    },
    {
        id: 4,
        title: "Customer Service Excellence",
        type: "Course",
        description: "Advanced customer service techniques and de-escalation",
        businessContext: "Retail client renewal opportunity",
        primaryOwner: { name: "Emma Designer", avatar: "ED" },
        businessLead: { name: "Lisa Stakeholder", avatar: "LS" },
        currentStage: "ready",
        priority: "medium",
        shipDate: "2025-10-05",
        clientAccount: "RetailCo",
        percentComplete: 100,
        contentOutline: [
            { module: "Module 1", title: "Customer Service Mindset", duration: "30 min" },
            { module: "Module 2", title: "Active Listening Skills", duration: "45 min" },
            { module: "Module 3", title: "Empathy & Rapport Building", duration: "40 min" },
            { module: "Module 4", title: "Handling Difficult Customers", duration: "60 min" },
            { module: "Module 5", title: "De-escalation Techniques", duration: "45 min" },
            { module: "Module 6", title: "Problem Resolution Strategies", duration: "40 min" }
        ],
        releaseNotes: {
            status: "approved",
            whatsNew: "Master the art of exceptional customer service with proven techniques and real-world scenarios.",
            keyFeatures: ["Role-play simulations", "De-escalation strategies", "Communication frameworks", "Customer psychology insights"],
            learningObjectives: ["Handle difficult customers professionally", "Apply active listening techniques", "Resolve complaints effectively"],
            businessValue: "Improves customer satisfaction scores by an average of 25% and reduces escalations.",
            duration: "4 hours",
            format: "SCORM 2004"
        }
    },
    {
        id: 5,
        title: "Project Management Fundamentals",
        type: "Course",
        description: "Introduction to PM methodologies and tools",
        businessContext: "Cross-sell opportunity with existing clients",
        primaryOwner: { name: "Tom Designer", avatar: "TD" },
        businessLead: { name: "Mike Sales", avatar: "MS" },
        currentStage: "building",
        priority: "medium",
        shipDate: "2025-10-28",
        clientAccount: null,
        percentComplete: 55,
        contentOutline: [
            { module: "Module 1", title: "Project Management Foundations", duration: "45 min" },
            { module: "Module 2", title: "Project Planning & Scope", duration: "60 min" },
            { module: "Module 3", title: "Scheduling & Timeline Management", duration: "50 min" },
            { module: "Module 4", title: "Risk Management", duration: "40 min" },
            { module: "Module 5", title: "Stakeholder Communication", duration: "45 min" },
            { module: "Module 6", title: "Agile Methodologies", duration: "40 min" }
        ],
        releaseNotes: {
            status: "draft",
            whatsNew: "Learn essential project management skills using industry-standard methodologies and tools.",
            keyFeatures: ["Gantt chart tutorials", "Risk management templates", "Stakeholder communication guides", "Agile vs Waterfall comparison"],
            learningObjectives: ["Create project plans", "Manage project risks", "Track project progress"],
            businessValue: "Increases project success rates and on-time delivery by 40%.",
            duration: "5 hours",
            format: "Web-based"
        }
    },
    {
        id: 6,
        title: "Diversity & Inclusion Training",
        type: "Course",
        description: "Workplace diversity and unconscious bias training",
        businessContext: "Enterprise client requirement",
        primaryOwner: { name: "Emma Designer", avatar: "ED" },
        businessLead: { name: "Lisa Stakeholder", avatar: "LS" },
        currentStage: "drafting",
        priority: "high",
        shipDate: "2025-10-20",
        clientAccount: "GlobalTech",
        percentComplete: 40,
        contentOutline: [
            { module: "Module 1", title: "Understanding Diversity & Inclusion", duration: "30 min" },
            { module: "Module 2", title: "Unconscious Bias Awareness", duration: "45 min" },
            { module: "Module 3", title: "Inclusive Communication", duration: "40 min" },
            { module: "Module 4", title: "Creating Inclusive Teams", duration: "35 min" },
            { module: "Module 5", title: "Action Planning", duration: "30 min" }
        ],
        releaseNotes: {
            status: "draft",
            whatsNew: "Create an inclusive workplace through awareness and actionable strategies.",
            keyFeatures: ["Unconscious bias assessments", "Inclusive language guides", "Real workplace scenarios", "Action planning tools"],
            learningObjectives: ["Recognize unconscious biases", "Practice inclusive behaviors", "Support diverse teams"],
            businessValue: "Improves employee engagement scores and reduces turnover in diverse teams.",
            duration: "3 hours",
            format: "SCORM 1.2"
        }
    },
    {
        id: 7,
        title: "Data Privacy Compliance",
        type: "Course",
        description: "GDPR and data protection best practices",
        businessContext: "EU market expansion support",
        primaryOwner: { name: "Sarah Designer", avatar: "SD" },
        businessLead: { name: "Mike Sales", avatar: "MS" },
        currentStage: "ready",
        priority: "low",
        shipDate: "2025-10-01",
        clientAccount: null,
        percentComplete: 100,
        contentOutline: [
            { module: "Module 1", title: "Introduction to GDPR", duration: "20 min" },
            { module: "Module 2", title: "Data Protection Principles", duration: "30 min" },
            { module: "Module 3", title: "Data Subject Rights", duration: "25 min" },
            { module: "Module 4", title: "Breach Response & Reporting", duration: "25 min" },
            { module: "Module 5", title: "Compliance Best Practices", duration: "20 min" }
        ],
        releaseNotes: {
            status: "approved",
            whatsNew: "Comprehensive GDPR training ensuring compliance with EU data protection regulations.",
            keyFeatures: ["GDPR requirement checklist", "Data breach response protocols", "Privacy impact assessments", "Consent management"],
            learningObjectives: ["Understand GDPR requirements", "Handle personal data correctly", "Respond to data subject requests"],
            businessValue: "Ensures regulatory compliance and avoids penalties up to €20M or 4% of revenue.",
            duration: "2 hours",
            format: "Web-based"
        }
    },
    {
        id: 8,
        title: "Time Management Mastery",
        type: "Course",
        description: "Productivity techniques and prioritization strategies",
        businessContext: "Professional development catalog expansion",
        primaryOwner: { name: "Tom Designer", avatar: "TD" },
        businessLead: { name: "Lisa Stakeholder", avatar: "LS" },
        currentStage: "building",
        priority: "low",
        shipDate: "2025-11-15",
        clientAccount: null,
        percentComplete: 30,
        contentOutline: [
            { module: "Module 1", title: "Time Management Foundations", duration: "30 min" },
            { module: "Module 2", title: "Priority Matrix & Goal Setting", duration: "45 min" },
            { module: "Module 3", title: "Defeating Procrastination", duration: "40 min" },
            { module: "Module 4", title: "Energy Management", duration: "35 min" },
            { module: "Module 5", title: "Digital Productivity Tools", duration: "30 min" }
        ],
        releaseNotes: {
            status: "not-started",
            whatsNew: "",
            keyFeatures: [],
            learningObjectives: [],
            businessValue: "",
            duration: "",
            format: ""
        }
    }
];

// State
let currentView = 'dashboard';
let currentStream = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    renderDashboard();
    renderBoard();
    renderTimeline();
    renderList();
    renderSalesLibrary();
    initializeSearch();
});

// Navigation
function initializeNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
            switchView(view);
        });
    });
}

function switchView(view) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Update active view
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${view}-view`).classList.add('active');

    currentView = view;
}

// Dashboard
function renderDashboard() {
    const recentCompletions = mockStreams.filter(s => s.currentStage === 'ready').slice(0, 5);
    const upcomingDeliveries = mockStreams
        .filter(s => s.currentStage !== 'ready')
        .sort((a, b) => new Date(a.shipDate) - new Date(b.shipDate))
        .slice(0, 5);

    const completionsContainer = document.getElementById('recent-completions');
    completionsContainer.innerHTML = recentCompletions.map(stream => `
        <div class="completion-item">
            <h4>${stream.title}</h4>
            <p>${stream.primaryOwner.name} • ${formatDate(stream.shipDate)}</p>
        </div>
    `).join('');

    const pipelineContainer = document.getElementById('pipeline-preview');
    pipelineContainer.innerHTML = upcomingDeliveries.map(stream => `
        <div class="pipeline-item">
            <h4>${stream.title}</h4>
            <p>${getStageLabel(stream.currentStage)} • Due ${formatDate(stream.shipDate)}</p>
        </div>
    `).join('');
}

// Board View
function renderBoard() {
    const stages = ['planning', 'drafting', 'building', 'finalizing', 'ready'];

    stages.forEach(stage => {
        const container = document.querySelector(`.cards-container[data-stage="${stage}"]`);
        const streams = mockStreams.filter(s => s.currentStage === stage);

        // Update count
        const countElement = document.querySelector(`.board-column[data-stage="${stage}"] .count`);
        countElement.textContent = streams.length;

        container.innerHTML = streams.map(stream => createStreamCard(stream)).join('');

        // Add click handlers
        container.querySelectorAll('.stream-card').forEach(card => {
            card.addEventListener('click', () => {
                const streamId = parseInt(card.dataset.id);
                openStreamModal(streamId);
            });
        });
    });
}

function createStreamCard(stream) {
    const statusClass = getStatusClass(stream.shipDate);
    const priorityClass = `priority-${stream.priority}`;

    return `
        <div class="stream-card ${priorityClass}" data-id="${stream.id}">
            <div class="card-header">
                <div class="card-title">${stream.title}</div>
                <span class="card-type">${stream.type}</span>
            </div>
            <div class="card-owners">
                <div class="owner-info">
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">Designer</div>
                    <div class="owner-name">${stream.primaryOwner.name}</div>
                </div>
            </div>
            <div class="card-owners">
                <div class="owner-info">
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">Lead</div>
                    <div class="owner-name">${stream.businessLead.name}</div>
                </div>
            </div>
            <div class="card-footer">
                <span class="ship-date ${statusClass}">${formatDate(stream.shipDate)}</span>
                <span class="release-notes-badge ${stream.releaseNotes.status === 'approved' ? 'approved' : ''}">${getReleaseNotesLabel(stream.releaseNotes.status)}</span>
            </div>
        </div>
    `;
}

// Timeline View
function renderTimeline() {
    const container = document.getElementById('timeline-container');
    const streamsByMonth = groupByMonth(mockStreams);

    container.innerHTML = Object.entries(streamsByMonth).map(([month, streams]) => `
        <div class="timeline-month">
            <div class="month-header">${month}</div>
            ${streams.map(stream => `
                <div class="timeline-item" onclick="openStreamModal(${stream.id})">
                    <div class="timeline-date">${formatDate(stream.shipDate)}</div>
                    <div class="timeline-content">
                        <div class="timeline-title">${stream.title}</div>
                        <div class="timeline-meta">
                            ${getStageLabel(stream.currentStage)} • ${stream.primaryOwner.name}
                            ${stream.clientAccount ? ` • ${stream.clientAccount}` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// List View
function renderList() {
    const tbody = document.getElementById('projects-table-body');
    tbody.innerHTML = mockStreams.map(stream => `
        <tr>
            <td><strong>${stream.title}</strong></td>
            <td>${stream.type}</td>
            <td><span class="stage-badge stage-${stream.currentStage}">${getStageLabel(stream.currentStage)}</span></td>
            <td>${stream.primaryOwner.name}</td>
            <td>${stream.businessLead.name}</td>
            <td>${formatDate(stream.shipDate)}</td>
            <td><span class="ship-date ${getStatusClass(stream.shipDate)}">${getStatusLabel(stream.shipDate)}</span></td>
            <td><button class="action-btn" onclick="openStreamModal(${stream.id})">View Details</button></td>
        </tr>
    `).join('');
}

// Sales Library View
function renderSalesLibrary() {
    const approvedStreams = mockStreams.filter(s => s.releaseNotes.status === 'approved');
    const grid = document.getElementById('sales-grid');

    grid.innerHTML = approvedStreams.map((stream, index) => {
        const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706'];
        const color = colors[index % colors.length];

        return `
            <div class="sales-card" onclick="openStreamModal(${stream.id})">
                <div class="sales-card-image" style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);">
                    ${stream.title.substring(0, 2).toUpperCase()}
                </div>
                <div class="sales-card-content">
                    <div class="sales-card-title">${stream.title}</div>
                    <div class="sales-card-summary">${stream.releaseNotes.whatsNew}</div>
                    <div class="sales-card-meta">
                        <span>${stream.releaseNotes.duration}</span>
                        <span>${stream.releaseNotes.format}</span>
                    </div>
                    <div class="sales-card-actions">
                        <button class="sales-btn" onclick="event.stopPropagation(); alert('Release notes exported!')">Export PDF</button>
                        <button class="sales-btn" onclick="event.stopPropagation(); alert('Link copied to clipboard!')">Share</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Modal
function openStreamModal(id) {
    const stream = mockStreams.find(s => s.id === id);
    if (!stream) return;

    currentStream = stream;
    const modal = document.getElementById('stream-modal');
    document.getElementById('modal-title').textContent = stream.title;

    // Initialize with overview tab
    switchModalTab('overview');

    modal.classList.add('active');

    // Setup tab switching
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchModalTab(tab.dataset.tab);
        });
    });
}

function closeModal() {
    document.getElementById('stream-modal').classList.remove('active');
    currentStream = null;
}

function switchModalTab(tab) {
    // Update active tab
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Render content
    const contentArea = document.getElementById('modal-content-area');

    if (tab === 'overview') {
        contentArea.innerHTML = renderOverviewTab(currentStream);
    } else if (tab === 'release-notes') {
        contentArea.innerHTML = renderReleaseNotesTab(currentStream);
    } else if (tab === 'updates') {
        contentArea.innerHTML = renderUpdatesTab(currentStream);
    }
}

function renderOverviewTab(stream) {
    return `
        <div class="overview-container">
            <div class="overview-left">
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Content Type</div>
                        <div class="detail-value">${stream.type}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Priority</div>
                        <div class="detail-value" style="text-transform: capitalize;">${stream.priority}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Primary Owner</div>
                        <div class="detail-value">${stream.primaryOwner.name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Business Lead</div>
                        <div class="detail-value">${stream.businessLead.name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Ship Date</div>
                        <div class="detail-value">${formatDate(stream.shipDate)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Current Stage</div>
                        <div class="detail-value">${getStageLabel(stream.currentStage)}</div>
                    </div>
                </div>

                <div class="detail-section">
                    <h3>Business Context</h3>
                    <p>${stream.businessContext}</p>
                </div>

                <div class="detail-section">
                    <h3>Description</h3>
                    <p>${stream.description}</p>
                </div>

                ${stream.clientAccount ? `
                <div class="detail-section">
                    <h3>Client Account</h3>
                    <p>${stream.clientAccount}</p>
                </div>
                ` : ''}

                <div class="detail-section">
                    <h3>Progress</h3>
                    <div style="background: var(--bg-light); border-radius: 8px; overflow: hidden; height: 24px;">
                        <div style="background: var(--primary); height: 100%; width: ${stream.percentComplete}%; transition: width 0.3s;"></div>
                    </div>
                    <p style="margin-top: 0.5rem;">${stream.percentComplete}% Complete</p>
                </div>
            </div>

            <div class="overview-right">
                <div class="detail-section">
                    <h3>Content Outline</h3>
                    <div class="content-outline">
                        ${stream.contentOutline.map(item => `
                            <div class="outline-item">
                                <div class="outline-module">${item.module}</div>
                                <div class="outline-title">${item.title}</div>
                                <div class="outline-duration">${item.duration}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderReleaseNotesTab(stream) {
    const notes = stream.releaseNotes;

    if (notes.status === 'not-started') {
        return `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p>Release notes have not been started yet.</p>
            </div>
        `;
    }

    return `
        <div class="detail-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Release Notes</h3>
                <span class="stage-badge stage-${notes.status === 'approved' ? 'ready' : 'drafting'}">${getReleaseNotesLabel(notes.status)}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>What's New</h3>
            <p>${notes.whatsNew}</p>
        </div>

        ${notes.keyFeatures.length > 0 ? `
        <div class="detail-section">
            <h3>Key Features</h3>
            <ul class="feature-list">
                ${notes.keyFeatures.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        ${notes.learningObjectives.length > 0 ? `
        <div class="detail-section">
            <h3>Learning Objectives</h3>
            <ul class="feature-list">
                ${notes.learningObjectives.map(o => `<li>${o}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        ${notes.businessValue ? `
        <div class="detail-section">
            <h3>Business Value</h3>
            <p>${notes.businessValue}</p>
        </div>
        ` : ''}

        ${notes.duration && notes.format ? `
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${notes.duration}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Format</div>
                <div class="detail-value">${notes.format}</div>
            </div>
        </div>
        ` : ''}
    `;
}

function renderUpdatesTab(stream) {
    return `
        <div class="detail-section">
            <h3>Activity Feed</h3>
            <div style="padding: 2rem; text-align: center; color: var(--text-secondary); background: var(--bg-light); border-radius: 8px;">
                <p>No updates yet. Status updates and comments will appear here.</p>
            </div>
        </div>
    `;
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const salesSearch = document.getElementById('sales-search');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterList(e.target.value);
        });
    }

    if (salesSearch) {
        salesSearch.addEventListener('input', (e) => {
            filterSalesLibrary(e.target.value);
        });
    }
}

function filterList(query) {
    const tbody = document.getElementById('projects-table-body');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterSalesLibrary(query) {
    const cards = document.querySelectorAll('.sales-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getStageLabel(stage) {
    const labels = {
        planning: 'Planning',
        drafting: 'Drafting',
        building: 'Building',
        finalizing: 'Finalizing',
        ready: 'Ready to Ship'
    };
    return labels[stage] || stage;
}

function getStatusClass(shipDate) {
    const date = new Date(shipDate);
    const today = new Date();
    const daysUntil = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return 'status-overdue';
    if (daysUntil < 7) return 'status-urgent';
    if (daysUntil < 14) return 'status-approaching';
    return 'status-on-track';
}

function getStatusLabel(shipDate) {
    const date = new Date(shipDate);
    const today = new Date();
    const daysUntil = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return 'Overdue';
    if (daysUntil < 7) return 'Urgent';
    if (daysUntil < 14) return 'Approaching';
    return 'On Track';
}

function getReleaseNotesLabel(status) {
    const labels = {
        'not-started': 'Not Started',
        'draft': 'Draft',
        'in-review': 'In Review',
        'approved': 'Approved'
    };
    return labels[status] || status;
}

function groupByMonth(streams) {
    const groups = {};

    streams.forEach(stream => {
        const date = new Date(stream.shipDate);
        const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(stream);
    });

    // Sort streams within each month
    Object.keys(groups).forEach(month => {
        groups[month].sort((a, b) => new Date(a.shipDate) - new Date(b.shipDate));
    });

    return groups;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('stream-modal');
    if (e.target === modal) {
        closeModal();
    }
});
