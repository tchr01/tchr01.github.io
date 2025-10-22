# CSV Import Guide

## Quick Start

The Learning Pathway Builder allows you to import course outlines from CSV files, perfect for collaborating with Subject Matter Experts (SMEs).

## CSV Format Options

### Option 1: Full Format (Most Control)

Include all fields for complete control over each topic:

```csv
Title,Description,Modality,Duration,Difficulty
Introduction to Cloud Computing,"Overview of cloud services and deployment models",Video,45 minutes,Beginner
AWS Hands-on Lab,"Practical experience with AWS Console",Hands-on Lab,2 hours,Intermediate
Cloud Security Best Practices,"Security principles in cloud environments",Reading,1 hour,Advanced
```

**Fields:**
- **Title** (required): Topic name
- **Description** (required): Brief description of the topic
- **Modality** (optional): One of: Interactive, Video, AI Simulation, Case Study, Assessment, Reading, Hands-on Lab, Discussion
- **Duration** (optional): e.g., "1 hour", "45 minutes", "2.5 hours"
- **Difficulty** (optional): Beginner, Intermediate, or Advanced

### Option 2: Simple Format (Title + Description)

Perfect for SMEs to quickly outline topics:

```csv
Title,Description
Data Privacy Fundamentals,Understanding GDPR and data protection
Encryption Technologies,Overview of encryption methods
Privacy by Design,Implementing privacy in development
```

**Auto-generated:**
- Modality: Guessed from title keywords (see Smart Guessing below)
- Duration: Defaults to "1 hour"
- Difficulty: Defaults to "Intermediate"

### Option 3: Minimal Format (Title Only)

Simplest option - just list topic names:

```csv
Title
Cloud Computing Basics
Containerization with Docker
Kubernetes Fundamentals
DevOps Best Practices
```

Or even simpler (no header):

```csv
Cloud Computing Basics
Containerization with Docker
Kubernetes Fundamentals
DevOps Best Practices
```

**Auto-generated:**
- Description: "Imported topic from course outline"
- Modality: Guessed from title
- Duration: "1 hour"
- Difficulty: "Intermediate"

## Smart Modality Guessing

When modality isn't provided, the system looks for keywords in the title:

| Keywords in Title | Assigned Modality |
|------------------|------------------|
| "video", "watch" | Video |
| "lab", "hands-on", "practice" | Hands-on Lab |
| "simulation", "sim" | AI Simulation |
| "case study", "case" | Case Study |
| "assessment", "test", "quiz" | Assessment |
| "read", "article" | Reading |
| "discuss", "forum" | Discussion |
| "workshop", "interactive" | Interactive |
| (default) | Interactive |

**Examples:**
- "Watch Introduction to AI" → Video
- "Hands-on Docker Lab" → Hands-on Lab
- "Cloud Security Case Study" → Case Study
- "AI Ethics Quiz" → Assessment

## Import Process

### Step 1: Click "Import Outline"
In the Course Outline section, click the "Import Outline" button next to the topic count.

### Step 2: Select Your CSV File
Choose your `.csv` or `.txt` file from your computer.

### Step 3: Choose Merge Option

If you already have topics in your pathway, you'll see a dialog:

**Option A - Replace (OK):**
- Clears existing pathway
- Adds only the imported topics
- Use when starting fresh

**Option B - Append (Cancel):**
- Keeps existing topics
- Adds imported topics to the end
- Use when expanding an existing pathway

### Step 4: Review Imported Topics
Topics appear immediately in the pathway list with:
- ✅ Completion checkbox (unchecked by default)
- 📋 Auto-assigned modality (or your specified one)
- ⏱️ Duration information
- 📊 Difficulty level
- 📝 Default learning outcomes

## Tips for SMEs

### Creating CSV Files

**Using Excel/Google Sheets:**
1. Create your outline in spreadsheet
2. Add headers: Title, Description, Modality, Duration, Difficulty
3. Fill in at minimum Title and Description
4. File → Save As → CSV format

**Using Text Editor:**
1. Open Notepad/TextEdit
2. Type each line with commas separating fields
3. Save with `.csv` extension

**Using Google Forms:**
1. Create form with fields for Title, Description, etc.
2. Collect responses from multiple SMEs
3. Download responses as CSV
4. Import into Learning Pathway Builder

### Best Practices

✅ **DO:**
- Use quotes around descriptions with commas ("Learn about VMs, storage, and networking")
- Keep titles concise (under 60 characters)
- Make descriptions informative (1-2 sentences)
- Include keywords that hint at modality ("Lab", "Video", etc.)
- Review imported topics after import

❌ **DON'T:**
- Use line breaks within descriptions (keep each topic on one line)
- Include special characters that might break CSV format
- Leave title field empty
- Mix different number of columns in same file

## Example Workflows

### Workflow 1: Solo LXD
1. Interview SME, take notes
2. Create CSV in spreadsheet
3. Import to Learning Pathway Builder
4. Review and adjust modalities
5. Generate AI recommendations
6. Finalize pathway

### Workflow 2: SME Collaboration
1. Share CSV template with SME
2. SME fills in Title and Description
3. SME emails CSV back
4. LXD imports to tool
5. LXD assigns optimal modalities
6. Generate recommendations
7. Review with SME

### Workflow 3: Team Brainstorm
1. Team Google Sheet with columns
2. Multiple people add topics
3. Export as CSV
4. Import to Learning Pathway Builder
5. Deduplicate and organize
6. Assign modalities
7. Share final pathway

## Troubleshooting

### Problem: "Error importing outline"
**Causes:**
- Empty file
- Wrong file format (not CSV/TXT)
- Corrupted file

**Solutions:**
- Check file has content
- Save as CSV format (not XLSX)
- Try opening in text editor to verify

### Problem: Topics missing after import
**Causes:**
- Empty rows in CSV
- Missing titles

**Solutions:**
- Remove blank rows from CSV
- Ensure every row has a title

### Problem: Modality not what I expected
**Causes:**
- Keyword matching didn't find expected term
- Generic title

**Solutions:**
- Edit CSV to specify modality explicitly
- Or manually change modality after import

### Problem: Special characters appear as symbols
**Causes:**
- Character encoding issue

**Solutions:**
- Save CSV as UTF-8 encoding
- Avoid special characters

## Sample CSVs Included

Try these sample files to see the import feature in action:

### `sample_course_outline.csv`
- **Topic**: Cloud Computing Fundamentals
- **Format**: Full (all 5 columns)
- **Topics**: 10 comprehensive cloud topics
- **Best for**: Seeing all features

### `simple_outline.csv`
- **Topic**: Data Privacy
- **Format**: Simple (Title + Description)
- **Topics**: 5 privacy topics
- **Best for**: Quick SME collaboration

## Advanced: Programmatic Generation

You can also generate CSV files programmatically:

**Python:**
```python
import csv

topics = [
    ["Introduction to AI", "Overview of AI concepts", "Video", "45 min", "Beginner"],
    ["ML Workshop", "Hands-on ML exercises", "Interactive", "2 hours", "Intermediate"]
]

with open('course.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["Title", "Description", "Modality", "Duration", "Difficulty"])
    writer.writerows(topics)
```

**JavaScript:**
```javascript
const topics = [
    ["Introduction to AI", "Overview of AI concepts", "Video", "45 min", "Beginner"],
    ["ML Workshop", "Hands-on ML exercises", "Interactive", "2 hours", "Intermediate"]
];

const csv = [
    "Title,Description,Modality,Duration,Difficulty",
    ...topics.map(row => row.join(','))
].join('\n');

// Download or use csv string
```

## Integration Ideas

The CSV import enables several workflows:

1. **LMS Export**: Export course outlines from existing LMS → Import to builder
2. **AI Generation**: Use ChatGPT to generate course outlines → Export as CSV → Import
3. **Survey Results**: Collect learning needs via survey → Export responses → Import
4. **Content Audit**: Inventory existing content → Create CSV → Import and organize
5. **Curriculum Planning**: Plan semester courses → Export → Import → Visualize

## Need Help?

- Check sample CSV files for correct format
- Open CSV in text editor to verify structure
- Start with simple format (Title only) to test
- Contact your team lead if issues persist

---

**Pro Tip**: Keep a master CSV file for each course area. Update it over time, then re-import to refresh the pathway as content evolves.
