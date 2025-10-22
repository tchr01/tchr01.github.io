const { createApp } = Vue;

createApp({
    data() {
        return {
            // View state
            currentView: 'cards',
            showFilters: false,
            searchQuery: '',
            activeFilters: [],
            expandedCard: null,

            // Persona data
            selectedPersonaIndex: 0,
            currentPersona: {},
            demoPersonas: [
                {
                    name: 'Sarah Chen',
                    role: 'Executive',
                    yearsExperience: 15,
                    skills: 'Strategic Planning, Team Leadership, Digital Transformation',
                    goals: 'Lead AI adoption across the organization and make informed strategic decisions about AI investments'
                },
                {
                    name: 'Marcus Rodriguez',
                    role: 'Technical',
                    yearsExperience: 8,
                    skills: 'Python, Machine Learning, Data Analysis, Cloud Architecture',
                    goals: 'Deepen technical AI expertise and architect scalable ML solutions for enterprise applications'
                },
                {
                    name: 'Dr. Amara Okonkwo',
                    role: 'Academic',
                    yearsExperience: 12,
                    skills: 'Research Methodology, Statistics, Pedagogy, Curriculum Design',
                    goals: 'Integrate AI concepts into curriculum and conduct research on AI applications in education'
                },
                {
                    name: 'Jennifer Park',
                    role: 'Manager',
                    yearsExperience: 6,
                    skills: 'Project Management, Team Coordination, Process Optimization',
                    goals: 'Understand AI capabilities to better manage technical teams and drive product innovation'
                }
            ],

            // Course data
            courseName: 'AI Leadership for Executives',
            pathway: [],
            recommendations: [],

            // Modality types
            modalityTypes: ['Interactive', 'Video', 'AI Simulation', 'Case Study', 'Assessment', 'Reading', 'Hands-on Lab', 'Discussion'],

            // Demo pathway topics
            demoTopics: [
                {
                    id: 1,
                    title: 'Introduction to AI Fundamentals',
                    description: 'Understand the core concepts of artificial intelligence, machine learning, and their business applications.',
                    modality: 'Video',
                    duration: '45 minutes',
                    difficulty: 'Beginner',
                    outcomes: [
                        'Define AI, ML, and deep learning',
                        'Identify key AI technologies and their use cases',
                        'Understand the AI landscape and major players'
                    ]
                },
                {
                    id: 2,
                    title: 'AI Strategy Workshop',
                    description: 'Interactive workshop to develop an AI strategy aligned with organizational goals and capabilities.',
                    modality: 'Interactive',
                    duration: '2 hours',
                    difficulty: 'Intermediate',
                    outcomes: [
                        'Assess organization\'s AI readiness',
                        'Identify high-value AI use cases',
                        'Create an AI implementation roadmap'
                    ]
                },
                {
                    id: 3,
                    title: 'AI Ethics and Governance',
                    description: 'Explore ethical considerations, bias mitigation, and governance frameworks for responsible AI deployment.',
                    modality: 'Case Study',
                    duration: '1.5 hours',
                    difficulty: 'Intermediate',
                    outcomes: [
                        'Recognize ethical AI principles',
                        'Implement bias detection and mitigation strategies',
                        'Establish AI governance frameworks'
                    ]
                },
                {
                    id: 4,
                    title: 'AI Business Case Simulation',
                    description: 'Realistic simulation for evaluating AI investment opportunities and presenting recommendations to stakeholders.',
                    modality: 'AI Simulation',
                    duration: '3 hours',
                    difficulty: 'Advanced',
                    outcomes: [
                        'Evaluate AI ROI and business value',
                        'Present AI proposals to executive stakeholders',
                        'Navigate organizational change management'
                    ]
                },
                {
                    id: 5,
                    title: 'Data Strategy for AI Success',
                    description: 'Learn how to build the data foundation necessary for successful AI implementation.',
                    modality: 'Reading',
                    duration: '1 hour',
                    difficulty: 'Intermediate',
                    outcomes: [
                        'Design data collection and management strategies',
                        'Understand data quality requirements for AI',
                        'Implement data governance policies'
                    ]
                },
                {
                    id: 6,
                    title: 'Leading AI Teams',
                    description: 'Practical guidance on building, managing, and empowering AI teams within organizations.',
                    modality: 'Video',
                    duration: '1 hour',
                    difficulty: 'Intermediate',
                    outcomes: [
                        'Recruit and retain AI talent',
                        'Foster collaboration between technical and business teams',
                        'Create a culture of AI innovation'
                    ]
                },
                {
                    id: 7,
                    title: 'AI Implementation Case Studies',
                    description: 'Analyze real-world examples of successful (and failed) AI implementations across various industries.',
                    modality: 'Case Study',
                    duration: '2 hours',
                    difficulty: 'Advanced',
                    outcomes: [
                        'Learn from industry AI successes and failures',
                        'Apply lessons to specific contexts',
                        'Avoid common AI pitfalls'
                    ]
                },
                {
                    id: 8,
                    title: 'AI Leadership Assessment',
                    description: 'Comprehensive assessment to evaluate AI leadership knowledge and readiness.',
                    modality: 'Assessment',
                    duration: '1 hour',
                    difficulty: 'All Levels',
                    outcomes: [
                        'Measure AI leadership competencies',
                        'Identify areas for further development',
                        'Earn AI Leadership Certificate'
                    ]
                }
            ],

            // Recommendation pool
            recommendationPool: [
                {
                    title: 'Generative AI for Business Leaders',
                    description: 'Deep dive into GPT, DALL-E, and other generative AI technologies transforming business operations.',
                    modality: 'Interactive',
                    duration: '2 hours',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'AI-Powered Decision Making',
                    description: 'Learn to leverage AI tools for data-driven decision making and predictive analytics.',
                    modality: 'AI Simulation',
                    duration: '2.5 hours',
                    difficulty: 'Advanced'
                },
                {
                    title: 'Natural Language Processing Applications',
                    description: 'Understand how NLP is revolutionizing customer service, content creation, and communication.',
                    modality: 'Video',
                    duration: '1.5 hours',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'Computer Vision in Enterprise',
                    description: 'Explore practical applications of computer vision across manufacturing, retail, and healthcare.',
                    modality: 'Case Study',
                    duration: '1.5 hours',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'AI Vendor Selection Workshop',
                    description: 'Hands-on workshop for evaluating and selecting AI vendors and platforms for organizations.',
                    modality: 'Interactive',
                    duration: '2 hours',
                    difficulty: 'Advanced'
                },
                {
                    title: 'MLOps and AI Operations',
                    description: 'Technical overview of deploying, monitoring, and maintaining AI systems at scale.',
                    modality: 'Hands-on Lab',
                    duration: '3 hours',
                    difficulty: 'Advanced'
                },
                {
                    title: 'AI in Customer Experience',
                    description: 'Learn how leading companies use AI to personalize and enhance customer experiences.',
                    modality: 'Case Study',
                    duration: '1 hour',
                    difficulty: 'Beginner'
                },
                {
                    title: 'AI Security and Privacy',
                    description: 'Critical training on protecting AI systems from attacks and ensuring data privacy compliance.',
                    modality: 'Reading',
                    duration: '1.5 hours',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'Change Management for AI Adoption',
                    description: 'Strategies for leading organizational change and overcoming resistance to AI initiatives.',
                    modality: 'Interactive',
                    duration: '2 hours',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'AI Financial Modeling',
                    description: 'Build financial models to justify AI investments and track ROI throughout implementation.',
                    modality: 'Hands-on Lab',
                    duration: '2.5 hours',
                    difficulty: 'Advanced'
                },
                {
                    title: 'Conversational AI Design',
                    description: 'Design and deploy chatbots and virtual assistants that deliver real business value.',
                    modality: 'Interactive',
                    duration: '2 hours',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'AI Regulation and Compliance',
                    description: 'Navigate the evolving landscape of AI regulations, from GDPR to AI-specific legislation.',
                    modality: 'Reading',
                    duration: '1 hour',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'Predictive Analytics Workshop',
                    description: 'Hands-on experience building and interpreting predictive models for business forecasting.',
                    modality: 'Hands-on Lab',
                    duration: '3 hours',
                    difficulty: 'Advanced'
                },
                {
                    title: 'AI Storytelling for Executives',
                    description: 'Master the art of communicating AI concepts and results to non-technical stakeholders.',
                    modality: 'Video',
                    duration: '1 hour',
                    difficulty: 'Beginner'
                },
                {
                    title: 'Edge AI and IoT Applications',
                    description: 'Explore how AI at the edge is enabling new capabilities in IoT and real-time applications.',
                    modality: 'Case Study',
                    duration: '1.5 hours',
                    difficulty: 'Advanced'
                }
            ]
        };
    },

    computed: {
        filteredPathway() {
            return this.filterTopics(this.pathway);
        },

        filteredRecommendations() {
            return this.filterTopics(this.recommendations);
        },

        pathwayObjectives() {
            if (this.pathway.length === 0) return [];

            // Analyze pathway content to generate relevant objectives
            const modalities = [...new Set(this.pathway.map(t => t.modality))];
            const difficulties = [...new Set(this.pathway.map(t => t.difficulty))];
            const hasAdvanced = difficulties.includes('Advanced');
            const hasBeginner = difficulties.includes('Beginner');

            // Extract key themes from topic titles
            const titles = this.pathway.map(t => t.title.toLowerCase()).join(' ');

            const objectives = [];

            // Core objective based on primary topic themes
            if (titles.includes('ai') || titles.includes('artificial intelligence')) {
                if (titles.includes('leadership') || titles.includes('strategy')) {
                    objectives.push('Develop strategic AI leadership capabilities to drive organizational transformation');
                } else if (titles.includes('ethics') || titles.includes('governance')) {
                    objectives.push('Establish frameworks for ethical AI implementation and governance');
                } else if (titles.includes('data') || titles.includes('ml') || titles.includes('machine learning')) {
                    objectives.push('Build foundational AI and machine learning competencies for practical application');
                } else {
                    objectives.push('Gain comprehensive understanding of AI technologies and their business applications');
                }
            } else if (titles.includes('cloud') || titles.includes('aws') || titles.includes('azure')) {
                objectives.push('Master cloud computing concepts and deployment strategies');
            } else if (titles.includes('data') || titles.includes('analytics')) {
                objectives.push('Develop data literacy and analytical skills for informed decision-making');
            } else if (titles.includes('security') || titles.includes('privacy')) {
                objectives.push('Implement comprehensive security and privacy best practices');
            } else if (titles.includes('leadership') || titles.includes('management')) {
                objectives.push('Strengthen leadership and management capabilities in technical environments');
            } else {
                // Generic objective based on course name
                const courseWords = this.courseName.split(' ');
                if (courseWords.length > 0) {
                    objectives.push(`Develop ${courseWords[0].toLowerCase()} competencies through structured learning`);
                } else {
                    objectives.push('Build comprehensive knowledge and practical skills in the subject area');
                }
            }

            // Modality-based objective
            if (modalities.includes('Hands-on Lab') || modalities.includes('Interactive') || modalities.includes('AI Simulation')) {
                objectives.push('Apply theoretical concepts through hands-on practice and interactive exercises');
            } else if (modalities.includes('Case Study')) {
                objectives.push('Analyze real-world scenarios to develop critical thinking and problem-solving skills');
            } else if (modalities.includes('Video') && modalities.includes('Reading')) {
                objectives.push('Synthesize knowledge from multiple learning formats and resources');
            }

            // Difficulty-based objective
            if (hasAdvanced && hasBeginner) {
                objectives.push('Progress from foundational concepts to advanced implementation strategies');
            } else if (hasAdvanced) {
                objectives.push('Master advanced techniques and lead complex implementations');
            } else if (hasBeginner) {
                objectives.push('Establish strong foundational knowledge for continued growth');
            }

            // Role-specific objective based on persona
            const role = this.currentPersona.role;
            if (role === 'Executive') {
                objectives.push('Make informed strategic decisions and drive organizational adoption');
            } else if (role === 'Technical') {
                objectives.push('Design and implement scalable technical solutions');
            } else if (role === 'Manager') {
                objectives.push('Lead teams effectively and optimize operational processes');
            } else if (role === 'Academic') {
                objectives.push('Integrate research insights into educational practice');
            } else if (role === 'Administrator') {
                objectives.push('Optimize administrative processes and ensure compliance');
            }

            // Return 3-4 objectives (remove duplicates and limit)
            return [...new Set(objectives)].slice(0, 4);
        }
    },

    methods: {
        loadPersona() {
            this.currentPersona = { ...this.demoPersonas[this.selectedPersonaIndex] };
            this.saveToStorage();
        },

        filterTopics(topics) {
            let filtered = topics;

            // Apply search filter
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(t =>
                    t.title.toLowerCase().includes(query) ||
                    t.description.toLowerCase().includes(query)
                );
            }

            // Apply modality filters
            if (this.activeFilters.length > 0) {
                filtered = filtered.filter(t => this.activeFilters.includes(t.modality));
            }

            return filtered;
        },

        toggleModalityFilter(modality) {
            const index = this.activeFilters.indexOf(modality);
            if (index > -1) {
                this.activeFilters.splice(index, 1);
            } else {
                this.activeFilters.push(modality);
            }
        },

        modalityColorClass(modality) {
            const colors = {
                'Interactive': 'bg-blue-100 text-blue-800',
                'Video': 'bg-purple-100 text-purple-800',
                'AI Simulation': 'bg-pink-100 text-pink-800',
                'Case Study': 'bg-green-100 text-green-800',
                'Assessment': 'bg-yellow-100 text-yellow-800',
                'Reading': 'bg-indigo-100 text-indigo-800',
                'Hands-on Lab': 'bg-red-100 text-red-800',
                'Discussion': 'bg-teal-100 text-teal-800'
            };
            return colors[modality] || 'bg-gray-100 text-gray-800';
        },

        modalityGradient(modality) {
            const gradients = {
                'Interactive': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'Video': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'AI Simulation': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'Case Study': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'Assessment': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'Reading': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                'Hands-on Lab': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                'Discussion': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
            };
            return gradients[modality] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        },

        removeFromPathway(index) {
            if (confirm('Remove this topic from the pathway?')) {
                this.pathway.splice(index, 1);
                this.saveToStorage();
            }
        },

        addToPathway(recommendation) {
            // Create a new topic from recommendation
            const newTopic = {
                id: Date.now(),
                title: recommendation.title,
                description: recommendation.description,
                modality: recommendation.modality,
                duration: recommendation.duration,
                difficulty: recommendation.difficulty,
                outcomes: recommendation.outcomes || [
                    'Master key concepts and principles',
                    'Apply knowledge to real-world scenarios',
                    'Demonstrate practical competency'
                ]
            };

            this.pathway.push(newTopic);

            // Remove from recommendations
            const index = this.recommendations.findIndex(r => r.id === recommendation.id);
            if (index > -1) {
                this.recommendations.splice(index, 1);
            }

            this.saveToStorage();

            // Show success feedback
            this.showNotification('Topic added to pathway!');
        },

        expandCard(topic) {
            this.expandedCard = { ...topic };
        },

        generateRecommendations() {
            // Clear existing recommendations
            this.recommendations = [];

            // Get persona-based score modifiers
            const roleModifiers = this.getRoleModifiers();
            const experienceModifier = this.getExperienceModifier();

            // Score each recommendation
            const scoredRecs = this.recommendationPool.map(rec => {
                let score = 50; // Base score

                // Role-based scoring
                score += roleModifiers[rec.modality] || 0;

                // Experience-based scoring
                if (rec.difficulty === 'Beginner') {
                    score += experienceModifier.beginner;
                } else if (rec.difficulty === 'Intermediate') {
                    score += experienceModifier.intermediate;
                } else if (rec.difficulty === 'Advanced') {
                    score += experienceModifier.advanced;
                }

                // Skills-based scoring
                const skills = this.currentPersona.skills.toLowerCase();
                if (rec.title.toLowerCase().includes('technical') && skills.includes('technical')) {
                    score += 15;
                }
                if (rec.title.toLowerCase().includes('leader') && skills.includes('leader')) {
                    score += 15;
                }

                // Pathway complement scoring
                score += this.getPathwayComplementScore(rec);

                // Add some randomness for variety
                score += Math.random() * 10;

                return { ...rec, score };
            });

            // Sort by score and take top 6
            const topRecs = scoredRecs
                .sort((a, b) => b.score - a.score)
                .slice(0, 6)
                .map((rec, index) => ({
                    id: Date.now() + index,
                    title: rec.title,
                    description: rec.description,
                    modality: rec.modality,
                    duration: rec.duration,
                    difficulty: rec.difficulty,
                    rationale: this.generateRationale(rec),
                    outcomes: this.generateOutcomes(rec)
                }));

            this.recommendations = topRecs;
            this.saveToStorage();
            this.showNotification('Generated ' + topRecs.length + ' personalized recommendations!');
        },

        getRoleModifiers() {
            const role = this.currentPersona.role;
            const modifiers = {
                'Executive': {
                    'Case Study': 20,
                    'Interactive': 15,
                    'Video': 10,
                    'AI Simulation': 15,
                    'Reading': 5
                },
                'Technical': {
                    'Hands-on Lab': 25,
                    'AI Simulation': 20,
                    'Interactive': 15,
                    'Reading': 10
                },
                'Academic': {
                    'Reading': 20,
                    'Case Study': 15,
                    'Discussion': 15,
                    'Interactive': 10
                },
                'Manager': {
                    'Interactive': 20,
                    'Case Study': 15,
                    'Video': 10,
                    'AI Simulation': 10
                },
                'Administrator': {
                    'Reading': 15,
                    'Video': 15,
                    'Interactive': 10,
                    'Case Study': 10
                }
            };
            return modifiers[role] || {};
        },

        getExperienceModifier() {
            const years = this.currentPersona.yearsExperience;
            if (years < 3) {
                return { beginner: 20, intermediate: 10, advanced: -10 };
            } else if (years < 8) {
                return { beginner: 5, intermediate: 15, advanced: 5 };
            } else {
                return { beginner: -5, intermediate: 10, advanced: 20 };
            }
        },

        getPathwayComplementScore(rec) {
            let score = 0;

            // Check for modality diversity
            const pathwayModalities = this.pathway.map(t => t.modality);
            if (!pathwayModalities.includes(rec.modality)) {
                score += 10; // Bonus for adding variety
            }

            // Check for difficulty progression
            const pathwayDifficulties = this.pathway.map(t => t.difficulty);
            const hasAdvanced = pathwayDifficulties.includes('Advanced');
            if (!hasAdvanced && rec.difficulty === 'Advanced') {
                score += 15; // Encourage progression
            }

            // Content relevance (simple keyword matching)
            const pathwayKeywords = this.pathway.map(t => t.title.toLowerCase()).join(' ');
            const recKeywords = rec.title.toLowerCase().split(' ');

            recKeywords.forEach(keyword => {
                if (pathwayKeywords.includes(keyword)) {
                    score += 5; // Related content bonus
                }
            });

            return score;
        },

        generateRationale(rec) {
            const role = this.currentPersona.role;
            const years = this.currentPersona.yearsExperience;
            const name = this.currentPersona.name.split(' ')[0];

            const templates = [
                `Based on the ${role} role with ${years} years of experience, this ${rec.modality.toLowerCase()} will help ${this.getActionVerb()} ${this.getSkillArea(rec)}.`,
                `Given ${name}'s background in ${this.getRelevantSkill()}, this topic complements the current pathway by ${this.getComplement(rec)}.`,
                `${role}s with this experience level typically benefit from ${rec.modality.toLowerCase()} learning. This topic will enhance ${this.getEnhancement(rec)}.`,
                `This ${rec.difficulty.toLowerCase()}-level ${rec.modality.toLowerCase()} aligns with the goal to ${this.getGoalAlignment()} and fills a gap in the current pathway.`
            ];

            return templates[Math.floor(Math.random() * templates.length)];
        },

        getActionVerb() {
            const verbs = ['master', 'develop', 'strengthen', 'advance', 'deepen', 'build'];
            return verbs[Math.floor(Math.random() * verbs.length)];
        },

        getSkillArea(rec) {
            if (rec.title.toLowerCase().includes('ai')) return 'AI leadership capabilities';
            if (rec.title.toLowerCase().includes('data')) return 'data strategy skills';
            if (rec.title.toLowerCase().includes('team')) return 'team management expertise';
            if (rec.title.toLowerCase().includes('business')) return 'business acumen';
            return 'professional competencies';
        },

        getRelevantSkill() {
            const skills = this.currentPersona.skills.split(',');
            return skills[Math.floor(Math.random() * skills.length)].trim();
        },

        getComplement(rec) {
            const complements = [
                'providing practical application opportunities',
                'adding strategic perspective',
                'offering hands-on experience',
                'deepening theoretical understanding',
                'expanding the skill set'
            ];
            return complements[Math.floor(Math.random() * complements.length)];
        },

        getEnhancement(rec) {
            const enhancements = [
                'decision-making capabilities',
                'technical understanding',
                'strategic thinking',
                'leadership effectiveness',
                'practical implementation skills'
            ];
            return enhancements[Math.floor(Math.random() * enhancements.length)];
        },

        getGoalAlignment() {
            const goals = this.currentPersona.goals.toLowerCase();
            if (goals.includes('lead')) return 'lead AI initiatives';
            if (goals.includes('technical')) return 'build technical expertise';
            if (goals.includes('research')) return 'advance research capabilities';
            return 'achieve learning objectives';
        },

        generateOutcomes(rec) {
            const outcomes = [
                'Understand key concepts and principles',
                'Apply knowledge to real-world scenarios',
                'Develop practical skills and competencies',
                'Make informed strategic decisions',
                'Lead successful implementations'
            ];

            // Pick 3 random outcomes
            const shuffled = outcomes.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 3);
        },

        showNotification(message) {
            // Simple notification (could be enhanced with a proper notification component)
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },

        saveToStorage() {
            const data = {
                currentPersona: this.currentPersona,
                selectedPersonaIndex: this.selectedPersonaIndex,
                courseName: this.courseName,
                pathway: this.pathway,
                recommendations: this.recommendations
            };
            localStorage.setItem('learningPathwayData', JSON.stringify(data));
        },

        loadFromStorage() {
            const saved = localStorage.getItem('learningPathwayData');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    this.currentPersona = data.currentPersona || this.demoPersonas[0];
                    this.selectedPersonaIndex = data.selectedPersonaIndex || 0;
                    this.courseName = data.courseName || this.courseName;
                    // Load pathway from storage, or use demo topics if empty
                    this.pathway = (data.pathway && data.pathway.length > 0) ? data.pathway : [...this.demoTopics];
                    // Always start with empty recommendations for dramatic reveal
                    this.recommendations = [];
                } catch (e) {
                    console.error('Failed to load saved data:', e);
                    this.loadDefaults();
                }
            } else {
                this.loadDefaults();
            }
        },

        loadDefaults() {
            this.loadPersona();
            this.pathway = [...this.demoTopics];
        },

        triggerImport() {
            // Trigger the hidden file input
            this.$refs.csvFileInput.click();
        },

        handleCSVImport(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvContent = e.target.result;
                    this.parseCSV(csvContent);
                    this.showNotification('Outline imported successfully!');
                } catch (error) {
                    console.error('CSV import error:', error);
                    this.showNotification('Error importing outline. Please check the file format.');
                }
            };
            reader.readAsText(file);

            // Reset the input so the same file can be uploaded again
            event.target.value = '';
        },

        parseCSV(csvContent) {
            // Parse CSV content
            const lines = csvContent.split('\n').filter(line => line.trim());

            if (lines.length === 0) {
                throw new Error('Empty CSV file');
            }

            // Detect if first line is a header
            const firstLine = lines[0].toLowerCase();
            const hasHeader = firstLine.includes('title') || firstLine.includes('topic') || firstLine.includes('name');

            const dataLines = hasHeader ? lines.slice(1) : lines;
            const newTopics = [];

            dataLines.forEach((line, index) => {
                // Split by comma, but respect quoted strings
                const columns = this.parseCSVLine(line);

                if (columns.length === 0 || !columns[0]) return;

                // Expected CSV format:
                // Title, Description, Modality, Duration, Difficulty
                // Or simpler: Title, Description
                // Or simplest: Title

                const title = columns[0].trim();
                const description = columns[1] ? columns[1].trim() : 'Imported topic from course outline';
                const modality = columns[2] ? columns[2].trim() : this.guessModality(title);
                const duration = columns[3] ? columns[3].trim() : '1 hour';
                const difficulty = columns[4] ? columns[4].trim() : 'Intermediate';

                newTopics.push({
                    id: Date.now() + index,
                    title: title,
                    description: description,
                    modality: this.validateModality(modality),
                    duration: duration,
                    difficulty: this.validateDifficulty(difficulty),
                    outcomes: [
                        'Understand key concepts and principles',
                        'Apply knowledge to practical scenarios',
                        'Demonstrate competency in the topic area'
                    ]
                });
            });

            if (newTopics.length > 0) {
                // Ask if they want to replace or append
                if (this.pathway.length > 0) {
                    const replace = confirm(
                        `The pathway currently has ${this.pathway.length} topics.\n\n` +
                        `Click OK to REPLACE them with ${newTopics.length} imported topics.\n` +
                        `Click Cancel to ADD the imported topics to the existing pathway.`
                    );

                    if (replace) {
                        this.pathway = newTopics;
                    } else {
                        this.pathway = [...this.pathway, ...newTopics];
                    }
                } else {
                    this.pathway = newTopics;
                }

                this.saveToStorage();
            }
        },

        parseCSVLine(line) {
            // Simple CSV parser that handles quoted strings
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }

            result.push(current);
            return result.map(item => item.trim().replace(/^"|"$/g, ''));
        },

        guessModality(title) {
            const titleLower = title.toLowerCase();

            if (titleLower.includes('video') || titleLower.includes('watch')) return 'Video';
            if (titleLower.includes('lab') || titleLower.includes('hands-on') || titleLower.includes('practice')) return 'Hands-on Lab';
            if (titleLower.includes('simulation') || titleLower.includes('sim')) return 'AI Simulation';
            if (titleLower.includes('case study') || titleLower.includes('case')) return 'Case Study';
            if (titleLower.includes('assessment') || titleLower.includes('test') || titleLower.includes('quiz')) return 'Assessment';
            if (titleLower.includes('read') || titleLower.includes('article')) return 'Reading';
            if (titleLower.includes('discuss') || titleLower.includes('forum')) return 'Discussion';
            if (titleLower.includes('workshop') || titleLower.includes('interactive')) return 'Interactive';

            return 'Interactive'; // Default
        },

        validateModality(modality) {
            // Check if the provided modality is valid
            const normalizedModality = modality.charAt(0).toUpperCase() + modality.slice(1).toLowerCase();

            // Try to match with existing modality types
            const match = this.modalityTypes.find(m =>
                m.toLowerCase() === normalizedModality.toLowerCase()
            );

            return match || 'Interactive'; // Default if not found
        },

        validateDifficulty(difficulty) {
            const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
            const normalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

            const match = validDifficulties.find(d =>
                d.toLowerCase() === normalizedDifficulty.toLowerCase()
            );

            return match || 'Intermediate'; // Default if not found
        },

        getTopicWhy(topic) {
            // Generate a real-world outcome statement for each topic
            const title = topic.title.toLowerCase();
            const modality = topic.modality;
            const role = this.currentPersona.role;

            // Role-specific action verbs
            const roleActions = {
                'Executive': ['make strategic decisions', 'lead initiatives', 'drive transformation', 'secure buy-in'],
                'Technical': ['build solutions', 'implement systems', 'solve problems', 'architect platforms'],
                'Manager': ['guide teams', 'optimize processes', 'deliver results', 'coordinate efforts'],
                'Academic': ['teach concepts', 'design curricula', 'conduct research', 'assess learning'],
                'Administrator': ['ensure compliance', 'streamline operations', 'manage resources', 'maintain standards']
            };

            const actions = roleActions[role] || ['apply knowledge', 'solve problems', 'deliver value', 'drive results'];

            // Generate contextual "why" based on topic content
            if (title.includes('fundamental') || title.includes('introduction') || title.includes('basics')) {
                return `Establishes the foundational knowledge needed to ${actions[0]} with confidence in real-world scenarios.`;
            }

            if (title.includes('strategy') || title.includes('planning')) {
                return `Enables the learner to ${actions[0]} about organizational direction and resource allocation.`;
            }

            if (title.includes('workshop') || title.includes('interactive')) {
                return `Provides hands-on experience that directly translates to ${actions[2]} in the workplace.`;
            }

            if (title.includes('ethics') || title.includes('governance') || title.includes('compliance')) {
                return `Prepares the learner to navigate complex ethical considerations and ${actions[3]} from stakeholders.`;
            }

            if (title.includes('simulation') || title.includes('case')) {
                return `Develops critical thinking skills through realistic scenarios that mirror actual workplace challenges.`;
            }

            if (title.includes('data') || title.includes('analytics')) {
                return `Equips the learner to make data-informed decisions that ${actions[2]} for the organization.`;
            }

            if (title.includes('assessment') || title.includes('evaluation')) {
                return `Validates competency and identifies areas for growth, ensuring readiness for real-world application.`;
            }

            if (title.includes('leadership') || title.includes('leading') || title.includes('managing')) {
                return `Builds the leadership capabilities needed to ${actions[1]} and inspire teams toward common goals.`;
            }

            if (title.includes('implementation') || title.includes('deploy')) {
                return `Prepares the learner to successfully ${actions[1]} from concept to production environment.`;
            }

            if (title.includes('security') || title.includes('privacy')) {
                return `Ensures the learner can protect organizational assets and ${actions[3]} in security-critical situations.`;
            }

            if (title.includes('team') || title.includes('collaboration')) {
                return `Develops the interpersonal skills necessary to ${actions[1]} and foster productive collaboration.`;
            }

            if (title.includes('best practice') || title.includes('optimization')) {
                return `Provides proven strategies that the learner can immediately apply to ${actions[2]} efficiently.`;
            }

            // Modality-based fallbacks
            if (modality === 'Hands-on Lab') {
                return `Provides practical experience that builds confidence to ${actions[1]} independently in real scenarios.`;
            }

            if (modality === 'Case Study') {
                return `Analyzes real-world examples to develop judgment skills critical for ${actions[0]} effectively.`;
            }

            if (modality === 'AI Simulation') {
                return `Creates a safe environment to practice complex decisions before applying them in high-stakes situations.`;
            }

            if (modality === 'Assessment') {
                return `Measures readiness and identifies growth opportunities to ensure the learner can ${actions[2]} confidently.`;
            }

            if (modality === 'Video' || modality === 'Reading') {
                return `Builds conceptual understanding that forms the foundation for the learner to ${actions[2]} in practice.`;
            }

            // Generic fallback
            return `Equips the learner with practical skills to ${actions[0]} and ${actions[2]} in professional contexts.`;
        },

        getTopicObjective(topic) {
            // Map each topic to one of the pathway learning objectives
            const objectives = this.pathwayObjectives;
            if (objectives.length === 0) return 'Build knowledge and skills in this topic area';

            const title = topic.title.toLowerCase();
            const description = topic.description.toLowerCase();
            const modality = topic.modality;
            const difficulty = topic.difficulty;

            // Try to match based on topic content
            for (let i = 0; i < objectives.length; i++) {
                const obj = objectives[i].toLowerCase();

                // Match AI/strategy topics to leadership objective
                if ((title.includes('ai') || title.includes('strategy') || title.includes('leadership')) &&
                    (obj.includes('strategic') || obj.includes('leadership') || obj.includes('decision'))) {
                    return objectives[i];
                }

                // Match ethics/governance topics
                if ((title.includes('ethics') || title.includes('governance') || title.includes('compliance')) &&
                    (obj.includes('ethical') || obj.includes('governance') || obj.includes('compliance'))) {
                    return objectives[i];
                }

                // Match technical/implementation topics
                if ((title.includes('implementation') || title.includes('deploy') || title.includes('technical') ||
                     title.includes('ml') || title.includes('data')) &&
                    (obj.includes('technical') || obj.includes('implement') || obj.includes('foundational'))) {
                    return objectives[i];
                }

                // Match hands-on/practical topics to practice objective
                if ((modality === 'Hands-on Lab' || modality === 'Interactive' || modality === 'AI Simulation') &&
                    obj.includes('hands-on')) {
                    return objectives[i];
                }

                // Match case study topics to analysis objective
                if (modality === 'Case Study' && obj.includes('analyze')) {
                    return objectives[i];
                }

                // Match assessment topics to measurement
                if (modality === 'Assessment' && obj.includes('measure')) {
                    return objectives[i];
                }
            }

            // Match based on difficulty
            if (difficulty === 'Advanced') {
                const advObj = objectives.find(obj =>
                    obj.toLowerCase().includes('advanced') ||
                    obj.toLowerCase().includes('master') ||
                    obj.toLowerCase().includes('lead')
                );
                if (advObj) return advObj;
            } else if (difficulty === 'Beginner') {
                const begObj = objectives.find(obj =>
                    obj.toLowerCase().includes('foundational') ||
                    obj.toLowerCase().includes('establish')
                );
                if (begObj) return begObj;
            }

            // Default: cycle through objectives based on topic index in pathway
            const topicIndex = this.pathway.findIndex(t => t.id === topic.id);
            return objectives[topicIndex % objectives.length];
        }
    },

    mounted() {
        this.loadFromStorage();
    }
}).mount('#app');
