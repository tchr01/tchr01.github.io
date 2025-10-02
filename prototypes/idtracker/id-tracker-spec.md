# Instructional Design Content Tracker - Web App Specification

## 1. Overview

A high-level web application for tracking instructional design content creation projects, designed for visibility across instructional designers, stakeholders, and sales teams. Enables transparency into what content is being developed, when it will be ready, and who is responsible for delivery. Includes detailed release notes to empower sales teams with customer-facing information about new content.

## 2. Core Features

### 2.1 Project Management
- Create, edit, and archive content streams
- Each stream represents a distinct deliverable (course, training program, module, or update)
- Categorize streams by type: Training Program, Course, Content Update, or Custom
- Assign priority levels: High, Medium, Low
- Add business context and objectives visible to stakeholders
- Link streams to client accounts or sales opportunities

### 2.2 Dual Assignment Model
Each content stream requires **two assigned roles**:

**Primary Owner** (Instructional Designer)
- Responsible for content creation and delivery
- Updates workflow status and progress
- Main point of contact for execution
- Authors release notes

**Business Lead** (Stakeholder/Sales Representative)
- Represents business need or client relationship
- Monitors progress for client/stakeholder updates
- Provides context and requirements
- Reviews and approves release notes
- May be sales team member, project manager, or internal stakeholder

### 2.3 Workflow States
Each content stream progresses through five stages:
1. **Planning** - Requirements gathering, scoping, resource allocation
2. **Drafting** - Initial content creation, outlining, script writing
3. **Building** - Full development, multimedia production, interaction development, technical implementation
4. **Finalizing** - Review, quality assurance, client feedback incorporation, final polish
5. **Ready to Ship** - Approved and ready for delivery/deployment with complete release notes

Visual progress indicators show stage advancement clearly for non-technical viewers.

### 2.4 Release Notes System

Each content stream includes comprehensive release notes that are:
- **Customer-facing**: Written for sales teams to share with prospects and clients
- **Version-controlled**: Track changes and updates over time
- **Searchable**: Sales can quickly find relevant content features
- **Exportable**: Generate sales sheets and pitch materials

**Release Notes Components**:

**What's New** (Required)
- High-level summary of the content (2-3 sentences)
- Key features and learning outcomes
- Target audience and use cases
- Unique selling points

**Key Features** (Required)
- Bulleted list of main content features
- Interactive elements and engagement tools
- Assessment types included
- Multimedia components (video, simulation, etc.)
- Duration/length information

**Learning Objectives** (Required)
- What learners will be able to do after completion
- Skills and knowledge gained
- Certifications or credentials (if applicable)

**Technical Specifications** (Required)
- Platform compatibility (LMS, web, mobile, etc.)
- Language availability
- Accessibility features (WCAG compliance, etc.)
- System requirements
- Integration capabilities

**Business Value** (Required)
- ROI potential and business impact
- Problems solved or needs addressed
- Competitive differentiators
- Industry applications
- Compliance or regulatory alignment

**What Changed** (For Updates Only)
- Detailed changelog for content updates
- Bug fixes or improvements
- New sections or modules added
- Deprecated or removed content

**Sales Positioning** (Optional)
- Elevator pitch (30 seconds)
- Ideal customer profile
- Common objections and responses
- Pricing tier or package recommendations
- Complementary content to bundle

**Customer Success Stories** (Optional)
- Case studies or testimonials (when available)
- Usage metrics or success rates
- Client quotes

### 2.5 Timeline & Due Dates
- Set launch/delivery date (when content goes live or delivers to client)
- Optional: Milestone dates for each workflow stage
- Visual status indicators:
  - **On Track** (green) - More than 14 days until due
  - **Approaching** (yellow) - 7-14 days until due
  - **Urgent** (orange) - Less than 7 days until due
  - **Overdue** (red) - Past due date
- Projected completion date based on current progress
- Calendar view showing all delivery dates
- Build stage completion estimate

### 2.6 Stakeholder & Sales Visibility
- Public roadmap view (optional read-only access without login)
- Client-facing status dashboard
- Upcoming releases timeline
- Sales pipeline integration showing content tied to deals
- Export presentation-ready reports for stakeholder meetings
- **Sales Content Library**: Searchable repository of all release notes

## 3. User Interface Components

### 3.1 Executive Dashboard
High-level summary for stakeholders and leadership:
- **Key Metrics Cards**:
  - Total active projects
  - Projects shipping this month
  - Projects shipping next month
  - At-risk projects (overdue or urgent)
  - Projects in Build stage (production pipeline)
- **Pipeline View**: Streams organized by expected ship date
- **Team Capacity**: Overview of workload by designer
- **Recent Completions**: Last 10 shipped items with quick access to release notes
- Quick filters: By business lead, by type, by quarter

### 3.2 Board View (Primary Interface)
Kanban-style board for operational management:
- Five columns representing workflow stages (Planning, Drafting, Building, Finalizing, Ready to Ship)
- Drag-and-drop to update stage
- Each card displays:
  - Stream title
  - Content type badge
  - Primary owner (designer) with avatar
  - Business lead with avatar
  - Ship date with color-coded status
  - Priority flag
  - Client/account name (if applicable)
  - Last update timestamp
  - Release notes status indicator (draft/complete/approved)

### 3.3 Timeline View (Stakeholder-Friendly)
Horizontal timeline showing content delivery schedule:
- Streams plotted by expected ship date
- Grouped by month/quarter
- Color-coded by stage
- Build stage items highlighted as "in production"
- Filterable by business lead, designer, or client
- Shows dependencies between related streams
- Ideal for stakeholder presentations and planning meetings

### 3.4 List View
Comprehensive table with sortable columns:
- Title
- Content type
- Current stage
- Primary owner (designer)
- Business lead
- Client/account
- Ship date
- Status indicator
- Last updated
- Priority
- Release notes status
- Quick actions menu (view release notes, export, share)

### 3.5 Sales Pipeline Integration View
For sales team visibility:
- Content streams linked to sales opportunities
- Grouped by deal stage or client
- Shows what content is available to support sales
- Alerts when content dependencies might affect deals
- "Coming Soon" content roadmap for sales positioning
- Quick access to release notes for active content
- **New Content Highlights**: Recently shipped content with key selling points

### 3.6 Sales Content Library
Dedicated view for sales teams:
- **Search & Filter**:
  - By content type
  - By target audience/industry
  - By learning objectives
  - By technical requirements
  - By business value/use case
  - Full-text search across all release notes

- **Content Cards** display:
  - Content title and thumbnail
  - Quick summary (1-2 lines)
  - Key features at a glance
  - Duration and format
  - Release date
  - "View Full Release Notes" button
  - "Export for Pitch" button

- **Curated Collections**:
  - New this quarter
  - Most popular with prospects
  - By industry vertical
  - By job role/function
  - Compliance-focused content

- **Export Options**:
  - Single content sales sheet (PDF)
  - Multi-content catalog
  - Custom pitch deck with selected content
  - Email-ready summaries

### 3.7 Stream Detail Page
- **Header Section**:
  - Title and type
  - Primary owner and business lead (both prominent)
  - Ship date and status
  - Priority level
  - Client/account information
  - Current workflow stage with visual indicator
  
- **Business Context**:
  - Objectives and success criteria
  - Target audience
  - Business value/impact
  - Related sales opportunities
  
- **Progress Section**:
  - Current workflow stage with visual indicator
  - Stage-specific indicators:
    - Planning: Requirements complete (%)
    - Drafting: Script/outline complete (%)
    - **Building: Production progress (%)** - visual breakdown of build tasks
    - Finalizing: Review rounds complete
    - Ready to Ship: Release notes approved
  - Milestone dates and completion status
  - Overall percentage complete
  - Blockers or risks flagged
  
- **Release Notes Section** (Tabbed Interface):
  - **Edit Tab** (Designers & Business Leads):
    - Rich text editor for all release note fields
    - Auto-save functionality
    - Preview mode
    - Approval workflow status
    - Version history
    
  - **Preview Tab** (All Users):
    - Customer-facing formatted view
    - Print-ready layout
    - Share link generator
    
  - **Export Tab** (Sales & Stakeholders):
    - Download as PDF (branded template)
    - Copy to clipboard (formatted text)
    - Generate sales email template
    - Export to CRM
  
- **Updates Feed**:
  - Status updates for stakeholder communication
  - Release notes milestones (drafted, reviewed, approved)
  - Comments and discussion
  - Change history
  
- **Deliverables**:
  - Expected outputs
  - Preview links or demo access
  - Attachments and supporting materials
  - Related streams/dependencies

### 3.8 Release Notes Detail View
Full-page or modal view optimized for reading and sharing:
- Clean, professional layout suitable for client presentation
- All release note sections displayed
- Print-friendly formatting
- Share functionality (email, link, export)
- "Last updated" timestamp
- Approval status badge
- Quick actions: Export, Email, Add to Pitch

## 4. Data Structure

### 4.1 Content Stream Object
```json
{
  "id": "unique identifier",
  "title": "string",
  "type": "enum (Training Program, Course, Content Update, Custom)",
  "description": "rich text (internal)",
  "businessContext": "rich text (stakeholder-facing)",
  
  "primaryOwner": "user reference (designer)",
  "businessLead": "user reference (stakeholder/sales)",
  
  "currentStage": "enum (Planning, Drafting, Building, Finalizing, Ready to Ship)",
  "priority": "enum (High, Medium, Low)",
  
  "buildProgress": {
    "tasksTotal": "integer",
    "tasksCompleted": "integer",
    "productionNotes": "string",
    "technicalSpecs": "object"
  },
  
  "shipDate": "date (final delivery date)",
  "stageMilestones": {
    "planning": "date (optional)",
    "drafting": "date (optional)",
    "building": "date (optional)",
    "finalizing": "date (optional)"
  },
  "projectedCompletion": "date (calculated)",
  "createdDate": "timestamp",
  "lastModified": "timestamp",
  "completedDate": "timestamp (if shipped)",
  
  "clientAccount": "string (optional)",
  "salesOpportunityId": "string (optional)",
  "targetAudience": "string",
  "businessValue": "string",
  
  "percentComplete": "integer (0-100, optional)",
  "blockers": "array of strings",
  "riskLevel": "enum (None, Low, Medium, High)",
  
  "releaseNotes": {
    "status": "enum (Not Started, Draft, In Review, Approved)",
    "version": "string",
    "lastUpdated": "timestamp",
    "approvedBy": "user reference (optional)",
    "approvedDate": "timestamp (optional)",
    
    "whatsNew": "rich text",
    "keyFeatures": "array of strings",
    "learningObjectives": "array of strings",
    "technicalSpecs": {
      "platforms": "array of strings",
      "languages": "array of strings",
      "accessibility": "array of strings",
      "systemRequirements": "string",
      "integrations": "array of strings"
    },
    "businessValue": "rich text",
    "whatChanged": "rich text (for updates only)",
    "salesPositioning": {
      "elevatorPitch": "string",
      "idealCustomer": "string",
      "objectionHandling": "array of objects",
      "pricingRecommendations": "string",
      "bundleOpportunities": "array of stream references"
    },
    "customerSuccessStories": "array of objects",
    "duration": "string",
    "format": "string",
    "thumbnailUrl": "string",
    "demoUrl": "string (optional)"
  },
  
  "watchers": "array of user references",
  "statusUpdates": "array of update objects",
  "comments": "array of comment objects",
  "attachments": "array of file references",
  "tags": "array of strings",
  "archived": "boolean",
  "visibility": "enum (Internal, Stakeholder, Public)"
}
```

### 4.2 User Object
```json
{
  "id": "unique identifier",
  "name": "string",
  "email": "string",
  "avatar": "image URL",
  "role": "enum (Designer, Stakeholder, Sales, Manager, Executive)",
  "department": "string",
  "notificationPreferences": "object",
  "salesTerritory": "string (for sales users)",
  "canApproveReleaseNotes": "boolean"
}
```

### 4.3 Status Update Object
```json
{
  "id": "unique identifier",
  "streamId": "reference",
  "author": "user reference",
  "timestamp": "timestamp",
  "updateType": "enum (Progress, Milestone, Blocker, Completion, Release Notes)",
  "message": "rich text",
  "visibility": "enum (Internal, Stakeholder)",
  "stage": "enum (Planning, Drafting, Building, Finalizing, Ready to Ship)"
}
```

### 4.4 Release Notes Version Object
```json
{
  "id": "unique identifier",
  "streamId": "reference",
  "versionNumber": "string",
  "createdDate": "timestamp",
  "createdBy": "user reference",
  "releaseNotesSnapshot": "object (full release notes at this version)",
  "changeLog": "string"
}
```

## 5. Key Functionality

### 5.1 Role-Based Views

**Instructional Designer View**:
- Focus on operational execution
- My assigned streams
- Stage management and progress updates
- Build stage task tracking
- Release notes authoring
- Collaboration with business leads

**Stakeholder/Business Lead View**:
- High-level status of assigned content
- Timeline of expected deliveries
- Business impact and client readiness
- Release notes review and approval
- Simplified interface focusing on dates and status

**Sales Team View**:
- Content availability roadmap
- What's coming soon for pitches
- **Sales Content Library** with searchable release notes
- Content tied to their opportunities/accounts
- Quick reference for "what can we deliver when"
- Export tools for customer presentations
- New content alerts and highlights

**Executive View**:
- Portfolio overview
- Resource capacity
- Risk dashboard
- Quarterly planning view
- Content ROI and business impact metrics

### 5.2 Release Notes Workflow

**Creation Process**:
1. Designer drafts release notes during Building or Finalizing stage
2. System validates all required fields are complete
3. Designer marks as "Ready for Review"
4. Business Lead receives notification to review
5. Business Lead can:
   - Request changes (sends back to Draft)
   - Approve (marks as Approved)
6. Once approved, release notes are:
   - Published to Sales Content Library
   - Made available for export
   - Included in automated sales notifications
7. Version history tracks all changes

**Templates**:
- Pre-built release notes templates by content type
- Organization-specific branding and formatting
- Suggested content for common fields
- Example release notes for reference

**Approval Gates**:
- Content cannot move to "Ready to Ship" without approved release notes
- Configurable: require release notes at specific stages
- Override capability for urgent situations (with audit trail)

### 5.3 Sales Team Tools

**Content Discovery**:
- Natural language search across release notes
- Filter by multiple criteria simultaneously
- Save searches for repeated use
- "Related content" suggestions based on viewing history

**Export & Sharing**:
- **One-pager PDF**: Branded single-page summary
- **Detailed Sales Sheet**: Multi-page comprehensive guide
- **Pitch Deck Slides**: PowerPoint-ready slides
- **Email Template**: Pre-written customer email with key points
- **CRM Integration**: Push content details to opportunity records
- **Custom Bundles**: Create multi-content sales packages

**Sales Notifications**:
- Weekly "New Content Available" digest
- Alerts when content in their territory ships
- Notifications for content updates relevant to their accounts
- Upcoming content reminders (30/60/90 days out)

**Competitive Intelligence**:
- Tag content with competitive differentiators
- Quick comparison views
- "Why us vs. competitor X" talking points

### 5.4 Stakeholder Communication
- **Status Update Posts**: Regular updates visible to watchers
- **Email Digests**: Configurable summaries for stakeholders
- **Automated Notifications**:
  - When content moves to Building stage
  - When content moves to "Ready to Ship"
  - When ship dates change
  - When blockers are identified
  - When release notes are approved
  - Weekly summary of assigned streams
- **Presentation Mode**: One-click export of roadmap for meetings
- **Client Portal**: Optional external view for client visibility

### 5.5 Build Stage Tracking

**Production Management**:
- Break down build tasks (video production, graphics, programming, etc.)
- Assign sub-tasks to team members
- Track completion percentage
- Flag technical blockers
- Estimate time remaining in build
- Resource allocation visibility

**Build Checklist Template**:
- Common build tasks by content type
- Quality checkpoints
- Technical review requirements
- Asset delivery tracking

### 5.6 Reporting & Analytics

**Standard Reports**:
- Content delivery forecast (next 30/60/90 days)
- Completed projects by month/quarter
- Average time in each workflow stage (including Build)
- Build stage bottleneck analysis
- Workload by designer and business lead
- At-risk projects report
- On-time delivery rate
- Release notes completion rate

**Sales-Focused Reports**:
- Content availability by account
- Pipeline support readiness
- Content gaps analysis
- Most-searched content in Sales Library
- Sales team engagement with release notes
- Content usage in won deals

**Executive Dashboards**:
- Portfolio health score
- Resource utilization
- Strategic initiative progress
- Quarterly objectives tracking
- Build capacity planning
- Content ROI metrics

### 5.7 Search & Filter

**Multi-Criteria Filtering**:
- By primary owner (designer)
- By business lead (stakeholder/sales)
- By workflow stage (including Build)
- By ship date range
- By client/account
- By content type and priority
- By risk level
- By release notes status
- By technical specifications
- By learning objectives
- By business value indicators

**Saved Views**:
- Personal dashboards
- Team views
- Executive summaries
- Sales roadmaps
- Build pipeline
- Content library collections

### 5.8 Integration Capabilities
- **CRM Integration**: Link to Salesforce, HubSpot opportunities; push release notes
- **Calendar Sync**: Push ship dates to Google/Outlook calendars
- **Slack/Teams**: Status notifications and release note alerts in team channels
- **Email Marketing**: Export content announcements to marketing platforms
- **LMS Integration**: Link to deployed content locations
- **SSO**: Enterprise authentication
- **API**: For custom integrations and data exports

## 6. Access Control & Permissions

### 6.1 User Roles & Permissions

**Designer**:
- Create and edit own streams
- Update workflow status
- Post internal and stakeholder updates
- Author and edit release notes
- View all streams and release notes

**Business Lead/Stakeholder**:
- View assigned streams
- Comment and request updates
- Review and approve release notes
- Cannot change workflow status
- Access to stakeholder dashboards

**Sales Team**:
- View all streams (read-only)
- Full access to Sales Content Library
- Access all approved release notes
- Export and share capabilities
- Subscribe to content notifications
- Cannot edit streams or release notes

**Manager/Executive**:
- Full visibility across all streams
- Access to analytics and reporting
- Can reassign owners and leads
- Approve release notes (if configured)
- Portfolio management
- Build pipeline oversight

**Guest/Client** (optional):
- Limited view of specific streams
- Access to approved release notes only
- Cannot see internal comments
- Read-only access

### 6.2 Release Notes Permissions
- **Draft Stage**: Visible only to primary owner and business lead
- **In Review**: Visible to reviewers and approvers
- **Approved**: Visible to all users based on stream visibility settings
- **Public**: Can be shared externally via link (if configured)

## 7. Technical Considerations

### 7.1 Technology Stack Recommendations
- **Frontend**: React with dashboard component library
- **Backend**: Node.js/Express or Python/Django
- **Database**: PostgreSQL for relational data
- **Search**: Elasticsearch for fast, full-text search of release notes
- **Real-time**: WebSocket for live updates
- **File Storage**: AWS S3 for attachments and generated PDFs
- **PDF Generation**: Puppeteer or similar for export functionality
- **Authentication**: SSO with role-based access control

### 7.2 Performance Requirements
- Dashboard loads in under 2 seconds
- Support 1000+ active streams
- Real-time status updates across users
- Release notes search returns results in under 1 second
- Mobile-responsive for stakeholder and sales mobile access
- Offline capability for field sales teams with cached release notes
- PDF generation completes in under 5 seconds

### 7.3 Key Design Principles
- **Clarity over complexity**: High-level tracking, not detailed project management
- **Stakeholder-first**: Information presented for non-technical audiences
- **Sales enablement**: Release notes empower sales conversations
- **Transparency**: Sales and stakeholders see realistic timelines
- **Dual accountability**: Both designer and business lead are visible owners
- **Build visibility**: Production stage clearly tracked
- **Content discoverability**: Sales can easily find what they need
- **Professional presentation**: Release notes are customer-ready

## 8. Success Metrics
- Stakeholder satisfaction with content visibility
- Reduction in "when will it be ready?" inquiries
- Sales team confidence in content roadmap accuracy
- **Sales team usage of release notes** (views, exports, shares)
- **Time saved in pitch preparation** (measured via survey)
- On-time delivery rate improvement
- Time saved in status meeting preparation
- Cross-team alignment on priorities
- Build stage efficiency (time in stage vs. estimate)
- **Content attachment rate to sales opportunities**
- **Win rate improvement when content is available**

## 9. Future Enhancements (Phase 2)
- AI-powered release notes generation from content analysis
- Automatic translation of release notes for global sales teams
- Interactive demo embedding in release notes
- Competitive comparison matrix generator
- Customer testimonial request workflow
- A/B testing of release notes messaging
- Analytics on which content features drive sales
- Dependency mapping between streams
- Resource capacity planning and forecasting
- Budget tracking per stream with ROI calculation
- AI-powered completion date predictions
- Custom workflow stages per content type
- Mobile app for on-the-go updates and sales access
- Content performance metrics post-launch
- Integration with content repositories and asset management
- Automated stakeholder report generation
- Video thumbnails and previews in release notes
- Content recommendation engine for sales based on prospect data

---

**Document Version**: 1.0  
**Last Updated**: October 2, 2025  
**Status**: Draft Specification

This specification creates a comprehensive tracking tool that serves operational needs (instructional designers), strategic visibility (stakeholders), and sales enablement (sales teams), with the added Build stage providing clarity on production progress and robust release notes empowering sales conversations with prospects and customers.