# Demo Script: Learning Pathway Builder

## Quick Start (30 seconds)
1. Open `index.html` in browser
2. You'll see 4 demo personas pre-loaded
3. Sarah Chen (Executive) is selected by default
4. 8 learning topics are in her pathway (2 already completed)

---

## 5-Minute Executive Demo

### Opening (30 sec)
> "I'd like to show you a prototype that solves a critical challenge for our Learning Experience Designers: creating personalized learning pathways at scale."

### Part 1: The Problem (1 min)
> "Currently, our LXDs manually create learning paths for different roles and experience levels. It's time-consuming and hard to keep personalized."

**Action**: Show the persona selector
- Point out 4 different personas (Executive, Technical, Academic, Manager)
- Highlight Sarah Chen's profile: 15 years experience, Executive role, strategic goals

### Part 2: Current Pathway View (1.5 min)
> "Here's Sarah's current pathway: 'AI Leadership for Executives' with 8 topics."

**Action**: Switch to Card View (if not already there)
- Scroll through the pathway cards
- Point out the different modalities (Video, Interactive, AI Simulation, Case Study, etc.)
- Show the progress bar (25% complete - 2 of 8 topics done)
- Click on a card to expand details
  - Show learning outcomes
  - Point out duration and difficulty level
  - Close modal

### Part 3: AI Recommendations (1.5 min)
> "Now watch what happens when we generate AI recommendations..."

**Action**: Click "Generate AI Recommendations"
- Wait for recommendations to appear (instant)
- Pick 2-3 to highlight:
  - Read the AI rationale aloud
  - Explain how it's personalized for Sarah's role
  - Point out the variety of modalities

**Action**: Add a topic to pathway
- Click "Add to Pathway" button
- Show smooth animation
- Point out it now appears in her pathway

### Part 4: Different Persona (1 min)
> "Let's see how this changes for a different learner..."

**Action**: Change persona to Marcus Rodriguez (Technical)
- Point out: 8 years experience, technical role
- Click "Generate AI Recommendations" again
- Compare recommendations:
  - More Hands-on Labs
  - More AI Simulations
  - Different rationales focused on technical depth

### Closing (30 sec)
> "This is just a prototype, but imagine this with our full content library and real AI. LXDs could create personalized pathways in minutes instead of hours."

**Ask**: "What questions do you have?"

---

## 10-Minute Product/Engineering Demo

### Part 1: User Flow (3 min)
Start with executive demo above, then add:

**Action**: Show filtering
- Click filter button
- Select "Case Study"
- Show how pathway filters in real-time
- Clear filter

**Action**: Show search
- Type "AI" in search box
- Show real-time filtering
- Clear search

**Action**: Toggle List View
- Switch between Card and List views
- Show how data appears differently
- Check off a topic to mark complete
- Show progress bar update

### Part 2: Data Persistence (2 min)
**Action**: Make changes
- Edit Sarah's name to "Sarah Chen-Williams"
- Add a recommended topic
- Remove a pathway topic

**Action**: Refresh the page
- Show that all changes persist
- Explain localStorage usage

### Part 3: Technical Features (3 min)

**For Product Managers**:
- Show all modality types (8 total)
- Demonstrate edge cases:
  - Search with no results
  - Empty recommendations state
  - All filters applied
- Explain recommendation algorithm:
  - Role-based preferences
  - Experience-level matching
  - Pathway complementarity scoring

**For Engineers**:
- Explain tech stack (Vue 3 CDN, Tailwind CSS, Vanilla CSS)
- Point out no build process needed
- Show responsive design (resize browser)
- Discuss extension points:
  - Easy to add API integration
  - Database backend would be straightforward
  - Real AI could replace mock algorithm

### Part 4: Customization Demo (2 min)
Open `app.js` in code editor:
- Show `demoPersonas` array (line ~29)
- Show `demoTopics` array (line ~104)
- Show `modalityTypes` array (line ~101)
- Explain how easy it is to add more

**Optional**: Make a live edit
- Add a new demo persona
- Refresh and show it works

---

## 15-Minute Comprehensive Demo

Combine both demos above, plus:

### Deep Dive: AI Recommendation Engine (3 min)

Open `app.js` and navigate to recommendation functions:

**1. Role-based Scoring** (line ~522)
```javascript
'Executive': {
    'Case Study': 20,
    'Interactive': 15,
    'Video': 10,
    'AI Simulation': 15,
    'Reading': 5
}
```
> "Executives get bonus points for Case Studies and Interactive content."

**2. Experience Modifiers** (line ~550)
> "Beginners see easier content, experts see advanced topics."

**3. Pathway Complement** (line ~562)
> "The AI looks for modality diversity and progressive difficulty."

**4. Rationale Generation** (line ~588)
> "Each recommendation gets a personalized explanation template."

### Live Customization (2 min)

**Action**: Add a new modality
1. Add "Workshop" to `modalityTypes`
2. Add a topic with modality "Workshop"
3. Add color for "Workshop" in `modalityColorClass()`
4. Add gradient for "Workshop" in `modalityGradient()`
5. Refresh and show it works

### Future Vision (2 min)

Show README.md "Future Enhancements":
- Backend API for multi-user
- Visual prerequisite connections
- Drag & drop reordering
- Export to PDF/LMS
- Real GPT-4 integration
- Analytics dashboard

---

## Common Questions & Answers

### Q: "Can we integrate this with our LMS?"
**A**: "Yes! We'd need to add an API layer and implement SCORM/xAPI standards. The front-end is ready."

### Q: "How accurate are the AI recommendations?"
**A**: "This is a mock algorithm for the prototype. In production, we'd use GPT-4 or a custom ML model trained on our content and learner data."

### Q: "Can learners access this directly?"
**A**: "This prototype is designed for LXDs. For learners, we'd create a simplified view focused on their assigned pathway."

### Q: "What about mobile?"
**A**: "The UI is responsive and works on tablets. For phones, we'd optimize the card layout further."

### Q: "How long to build the production version?"
**A**: "Depends on scope. Basic MVP with API backend: 6-8 weeks. Full-featured with real AI: 3-4 months."

### Q: "Can we add more personas?"
**A**: "Absolutely! It's just a data array. We could even let LXDs create custom personas."

### Q: "What if a topic is a prerequisite for another?"
**A**: "Great question! We'd add a 'prerequisites' field and enforce sequencing. Future enhancement."

---

## Troubleshooting

### Browser shows blank page
- Check JavaScript console for errors
- Ensure you're using a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Styles look broken
- Check that Tailwind CSS CDN loaded
- Check network tab for failed requests
- Try opening in incognito mode

### Changes not persisting
- Check if localStorage is enabled
- Try different browser
- Check browser storage quota

### Recommendations not generating
- Open JavaScript console
- Check for errors in `generateRecommendations()` function
- Verify `recommendationPool` array has data

---

## Tips for a Great Demo

1. **Practice first**: Run through the demo 2-3 times before presenting
2. **Check your setup**: Open the app in a fresh browser window before the meeting
3. **Have a backup**: Keep a second browser tab open in case of issues
4. **Engage the audience**: Ask "What would you add?" or "What role would you test?"
5. **Be honest**: It's a prototype - don't oversell, but paint the vision
6. **Take notes**: Write down feedback and questions for later
7. **Follow up**: Send the README after the meeting

---

## Post-Demo Actions

### If they love it:
1. Schedule technical planning session
2. Identify content sources and data requirements
3. Discuss timeline and resources
4. Create product requirements document
5. Begin API design

### If they have concerns:
1. Document all objections
2. Address each in a follow-up email
3. Offer to create additional prototypes
4. Schedule 1-on-1s to understand concerns

### Either way:
1. Send thank you email with demo link
2. Share README and this script
3. Collect written feedback
4. Update prototype based on feedback

---

**Good luck with your demo! 🚀**
