# Learning Pathway Builder

An interactive prototype for Learning Experience Designers to create personalized learning pathways tailored to specific learner personas.

## Overview

This tool helps LXDs:
- Define learner personas with key attributes (role, experience, skills, goals)
- Create custom learning pathways with varied modalities
- Import course outlines from CSV files created with SMEs
- Visualize pathways in both list and card views
- Generate AI-powered topic recommendations with rationales
- Track learning progress and completion

## Features

### 1. Learner Persona Management
- **4 Demo Personas**: Executive, Technical, Academic, Manager
- **Editable Fields**: Name, role, years of experience, skills, goals
- **Persistent Storage**: All changes saved to browser localStorage

### 2. Dual View System

#### List View
- Clean, scannable topic list
- Checkbox completion tracking
- Progress bar showing pathway completion percentage
- Modality badges color-coded by type
- Duration and difficulty indicators

#### Card View
- **Current Pathway Cards**: Large, prominent cards for enrolled topics
- **Recommended Cards**: AI-suggested topics with rationale
- Beautiful gradients representing different modalities
- Expandable detail modals with full learning outcomes

### 3. AI Recommendation Engine

The mock AI generates personalized recommendations based on:
- **Role-based preferences**: Executives favor case studies, technical roles prefer hands-on labs
- **Experience level**: Adjusts difficulty based on years of experience
- **Skill matching**: Considers learner's stated skills
- **Pathway complementarity**: Suggests topics that fill gaps or add variety
- **Intelligent rationales**: Each recommendation includes a personalized explanation

### 4. Learning Modalities

8 distinct modality types, each with unique visual styling:
- Interactive
- Video
- AI Simulation
- Case Study
- Assessment
- Reading
- Hands-on Lab
- Discussion

### 5. Advanced Filtering

- **Search**: Real-time search across topic titles and descriptions
- **Modality Filters**: Filter by one or multiple modalities
- **Smart UI**: Active filters visually indicated, easy to clear

### 6. CSV Import Feature

Import course outlines directly from CSV files:
- **Flexible Format**: Supports full format (Title, Description, Modality, Duration, Difficulty) or simple format (just Title, Description)
- **Smart Detection**: Automatically detects headers and guesses modalities from topic titles
- **Merge Options**: Choose to replace existing pathway or append imported topics
- **SME Collaboration**: Enables LXDs to import outlines created by Subject Matter Experts
- **Sample Files**: Includes `sample_course_outline.csv` and `simple_outline.csv`

### 7. Interactive Features

- **Import Outline**: Upload CSV files with course topics
- **Add to Pathway**: Click to add recommended topics
- **Remove from Pathway**: Remove unwanted topics
- **Expand Details**: Modal view with full learning outcomes
- **Progress Tracking**: Visual completion checkboxes and progress bar
- **Data Persistence**: All changes automatically saved

## Technical Stack

- **Vue.js 3**: Reactive framework (CDN-based, no build required)
- **Tailwind CSS**: Utility-first styling (CDN-based)
- **Vanilla CSS**: Custom animations and card layouts
- **LocalStorage API**: Client-side data persistence

## File Structure

```
learningpaths/
├── index.html      # Main application structure (24KB)
├── app.js          # Vue.js application logic (28KB)
├── styles.css      # Custom styles and animations (12KB)
└── README.md       # This file
```

## Getting Started

### Option 1: Open Directly
Simply open `index.html` in any modern web browser. No server required!

### Option 2: Local Server
For best experience with a local development server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000/learningpaths/`

## Demo Workflow

### For Executive Presentation

1. **Show Persona Selection**
   - Select "Sarah Chen - Executive" persona
   - Highlight her 15 years experience and strategic goals

2. **Display Current Pathway**
   - Switch to Card View
   - Show the "AI Leadership for Executives" course
   - Point out variety of modalities (8 topics total)
   - Show progress tracking (2 completed, 6 remaining)

3. **Generate Recommendations**
   - Click "Generate AI Recommendations"
   - Explain the AI rationale for each suggestion
   - Highlight how recommendations are personalized for executives

4. **Add a Topic**
   - Click "Add to Pathway" on a recommended topic
   - Show smooth animation as it joins the pathway
   - Point out the recommendation disappears (avoiding duplication)

5. **Demonstrate Filtering**
   - Click filter icon
   - Select "Case Study" modality
   - Show how pathway filters in real-time

6. **Expand Details**
   - Click "View Details" on any card
   - Show learning outcomes, duration, difficulty
   - Highlight professional presentation quality

7. **Switch to List View**
   - Toggle to List View
   - Show how same data appears in different format
   - Check off a topic to show completion tracking
   - Point out the progress bar updating

8. **Test Different Persona**
   - Switch to "Marcus Rodriguez - Technical"
   - Generate new recommendations
   - Show how recommendations change (more labs/simulations)

### For Product Manager Presentation

Focus on:
- **Feature completeness**: All requested features implemented
- **Data model**: Flexible structure supports various content types
- **Scalability**: Easy to add more modalities, personas, topics
- **User flows**: Intuitive navigation, clear CTAs
- **Edge cases**: Empty states, search with no results, etc.

### For Engineering Team Presentation

Highlight:
- **Clean architecture**: Separation of concerns (HTML/CSS/JS)
- **Vue.js patterns**: Computed properties, reactive data, lifecycle hooks
- **Performance**: Efficient filtering, no unnecessary re-renders
- **Storage strategy**: localStorage with fallback to defaults
- **Extensibility**: Easy to add API integration, database backend
- **Mobile responsive**: Works on tablet and desktop

## CSV Import Usage

### Creating Course Outline CSV Files

The import feature supports flexible CSV formats for collaboration with SMEs:

#### Full Format (Recommended)
```csv
Title,Description,Modality,Duration,Difficulty
Introduction to AI,Overview of artificial intelligence concepts,Video,45 minutes,Beginner
ML Workshop,Hands-on machine learning exercises,Interactive,2 hours,Intermediate
```

#### Simple Format
```csv
Title,Description
Data Privacy Basics,Understanding GDPR and regulations
Security Best Practices,Learn security fundamentals
```

#### Minimal Format
```csv
Cloud Computing Fundamentals
DevOps Introduction
Agile Methodology
```

### CSV Import Features

- **Auto-Detection**: Automatically detects if first row is a header
- **Smart Guessing**: If modality not provided, guesses from title keywords:
  - "video" → Video
  - "lab", "hands-on" → Hands-on Lab
  - "simulation" → AI Simulation
  - "case study" → Case Study
  - "quiz", "test" → Assessment
  - Default: Interactive
- **Validation**: Validates modalities and difficulty levels against supported values
- **Merge or Replace**: Choose to replace existing pathway or add to it

### How to Import

1. Click "Import Outline" button in Course Outline section
2. Select your CSV file
3. Choose to replace or append to existing pathway
4. Topics are automatically added with appropriate defaults

### Sample Files Included

- `sample_course_outline.csv` - Full format with all fields (Cloud Computing course)
- `simple_outline.csv` - Simple format with title and description (Privacy course)

## Customization

### Adding New Demo Personas

Edit the `demoPersonas` array in `app.js`:

```javascript
{
    name: 'Your Name',
    role: 'Your Role',
    yearsExperience: 10,
    skills: 'Skill 1, Skill 2, Skill 3',
    goals: 'Your learning goals here'
}
```

### Adding New Topics

Edit the `demoTopics` or `recommendationPool` arrays in `app.js`:

```javascript
{
    id: 99,
    title: 'Your Topic Title',
    description: 'Topic description here',
    modality: 'Interactive', // Must match modalityTypes
    duration: '2 hours',
    difficulty: 'Intermediate',
    completed: false,
    outcomes: [
        'Learning outcome 1',
        'Learning outcome 2',
        'Learning outcome 3'
    ]
}
```

### Customizing Modality Colors

Edit the `modalityGradient()` function in `app.js` to change card header gradients.

### Adjusting AI Recommendation Logic

Modify these functions in `app.js`:
- `getRoleModifiers()`: Adjust modality preferences by role
- `getExperienceModifier()`: Change difficulty recommendations by experience
- `getPathwayComplementScore()`: Tune pathway complement scoring
- `generateRationale()`: Customize rationale templates

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires: ES6+ JavaScript support, CSS Grid, Flexbox

## Data Persistence

All data is stored in browser localStorage under the key `learningPathwayData`:
- Current persona selection
- Persona edits
- Pathway topics (including completion status)
- Generated recommendations

**Note**: Data persists across sessions but is browser-specific. Clearing browser data will reset to defaults.

## Future Enhancements

Potential additions for production version:
1. **Backend API**: Store data server-side, enable multi-user access
2. **Visual Connections**: SVG lines showing prerequisite relationships
3. **Drag & Drop**: Reorder pathway topics
4. **Export**: PDF or JSON export of pathways
5. **Collaboration**: Share pathways via URL
6. **Analytics**: Track time spent, completion rates
7. **LMS Integration**: SCORM/xAPI support
8. **Real AI**: Integration with GPT-4 for smarter recommendations
9. **Content Library**: Searchable catalog of learning resources
10. **Templates**: Pre-built pathways for common roles/skills

## Presentation Tips

1. **Start with the problem**: LXDs struggle to create personalized pathways at scale
2. **Show the solution**: This tool makes it fast and intelligent
3. **Live demo**: Don't just talk, interact with the prototype
4. **Handle objections**: "This is just a prototype" → "Imagine this with real content and AI"
5. **End with vision**: This is day one, what could we build together?

## Support

For questions or issues, contact the development team.

## License

Internal prototype - All rights reserved

---

**Built for demonstration purposes** | Created: October 2025
