# SCORM Package Testing Checklist

## Purpose
This checklist ensures SCORM packages function correctly before deployment to production. Use this for every new package or update.

---

## Pre-Upload Testing

### 1. Package Structure Validation

- [ ] **ZIP file created properly**
  - File extension is `.zip`
  - No nested ZIP files
  - No hidden files (like `.DS_Store` on Mac)

- [ ] **imsmanifest.xml present**
  - Located at root of ZIP (not in subfolder)
  - Valid XML (no syntax errors)
  - Correct SCORM 1.2 schema references

- [ ] **Launch file path correct**
  - File referenced in manifest actually exists
  - Path matches exactly (case-sensitive!)
  - No spaces in filename (use hyphens or underscores)

- [ ] **All resource files included**
  - HTML files
  - JavaScript files (including scorm-wrapper.js)
  - CSS files
  - Images
  - Fonts (if not using CDN)

### 2. File Size Check

- [ ] **Package size within limits**
  - Total ZIP size: _______ MB (check against LMS limit)
  - Largest individual file: _______ MB
  - No unnecessarily large files

- [ ] **Image optimization**
  - Images compressed appropriately
  - No RAW or unoptimized formats
  - Reasonable dimensions (no 5000px images)

### 3. Local Testing (Before Upload)

- [ ] **Open launch file in browser**
  - File loads without errors
  - No missing images or broken links
  - Console shows no critical errors
  - SCORM wrapper loads (check console for "[SCORM]" messages)

- [ ] **Test all interactions**
  - Buttons clickable
  - Drag-and-drop works (if applicable)
  - Forms submit properly
  - Feedback displays correctly

---

## Upload and Import Testing

### 4. Package Import

- [ ] **Upload to LMS staging environment**
  - Package imports without errors
  - No timeout during upload
  - No error messages

- [ ] **Package appears in course list**
  - Title displays correctly
  - Description shows (if provided)
  - Thumbnail/icon displays (if applicable)

### 5. Launch Testing

- [ ] **Content launches**
  - Click launch button/link
  - Content loads (not blank screen)
  - Loads within acceptable time (< 10 seconds)
  - No browser security warnings

- [ ] **SCORM API connection**
  - Open browser console (F12)
  - Look for "[SCORM] SCORM initialized successfully" message
  - If API not found, content should still display (preview mode)

### 6. SCORM Tracking Verification

- [ ] **Initialization**
  ```
  Check console for:
  [SCORM] Initializing SCORM connection...
  [SCORM] SCORM API found in window
  [SCORM] SCORM initialized successfully
  ```

- [ ] **Lesson status updates**
  - Complete an interaction
  - Check LMS gradebook/progress
  - Status should change from "Not Started" to "Incomplete"

- [ ] **Score tracking**
  - Complete activity with a score
  - Check LMS gradebook
  - Score appears correctly (0-100 scale)
  - Score: Expected ______ / Actual ______

- [ ] **Session time tracked**
  - Stay in content for known duration (e.g., 5 minutes)
  - Close/exit content
  - Check LMS for time spent
  - Time: Expected ~5 min / Actual ______

- [ ] **Data persistence (suspend_data)**
  - Make progress in content
  - Close without completing
  - Reopen content
  - Progress should be restored
  - Test: ________________________________

---

## Cross-Browser Testing

### 7. Desktop Browsers

Test in ALL browsers used by your learners:

**Chrome:**
- [ ] Version: _______
- [ ] Content loads
- [ ] Interactions work
- [ ] SCORM tracking works
- [ ] No console errors
- Issues: ________________________________

**Firefox:**
- [ ] Version: _______
- [ ] Content loads
- [ ] Interactions work
- [ ] SCORM tracking works
- [ ] No console errors
- Issues: ________________________________

**Safari (Mac):**
- [ ] Version: _______
- [ ] Content loads
- [ ] Interactions work
- [ ] SCORM tracking works
- [ ] No console errors
- Issues: ________________________________

**Microsoft Edge:**
- [ ] Version: _______
- [ ] Content loads
- [ ] Interactions work
- [ ] SCORM tracking works
- [ ] No console errors
- Issues: ________________________________

**Internet Explorer 11** (if required - note: deprecated):
- [ ] Version: 11
- [ ] Content loads (may need polyfills)
- [ ] Interactions work
- [ ] SCORM tracking works
- Issues: ________________________________

### 8. Mobile Testing

If mobile support required:

**iOS Safari (iPhone):**
- [ ] iOS version: _______
- [ ] Content loads
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] SCORM tracking works
- [ ] Orientation works (portrait & landscape)
- Issues: ________________________________

**iOS Safari (iPad):**
- [ ] iOS version: _______
- [ ] Content loads
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] SCORM tracking works
- Issues: ________________________________

**Android Chrome:**
- [ ] Android version: _______
- [ ] Content loads
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] SCORM tracking works
- Issues: ________________________________

### 9. Screen Size Testing

- [ ] **Desktop (1920×1080)**
  - Layout looks good
  - No horizontal scroll
  - Text readable

- [ ] **Laptop (1366×768)**
  - Layout looks good
  - No horizontal scroll
  - Text readable

- [ ] **Tablet (768×1024)**
  - Responsive design activates
  - Touch-friendly buttons
  - Readable text size

- [ ] **Mobile (375×667)**
  - Single column layout
  - Large touch targets
  - No pinch-zoom required for reading

---

## Accessibility Testing

### 10. Keyboard Navigation

- [ ] **Tab key navigates through elements**
  - All interactive elements reachable
  - Tab order is logical
  - Focus indicators visible

- [ ] **Keyboard shortcuts work**
  - Enter/Space activates buttons
  - Arrow keys work (if applicable)
  - Escape closes modals (if applicable)

- [ ] **No keyboard traps**
  - Can tab out of all components
  - Can exit modals with keyboard

### 11. Screen Reader Testing

Test with at least one screen reader:

**NVDA (Windows - Free):**
- [ ] Screen reader detects content
- [ ] Headings announced correctly
- [ ] Buttons/links labeled properly
- [ ] Form fields have labels
- [ ] ARIA labels working
- Issues: ________________________________

**VoiceOver (Mac/iOS - Built-in):**
- [ ] Screen reader detects content
- [ ] Headings announced correctly
- [ ] Buttons/links labeled properly
- [ ] Form fields have labels
- [ ] ARIA labels working
- Issues: ________________________________

**JAWS (Windows - Paid):**
- [ ] Screen reader detects content
- [ ] Headings announced correctly
- [ ] Buttons/links labeled properly
- [ ] Form fields have labels
- [ ] ARIA labels working
- Issues: ________________________________

### 12. Visual Accessibility

- [ ] **Color contrast sufficient**
  - Text on background meets WCAG AA (4.5:1)
  - Interactive elements meet WCAG AA (3:1)
  - Use WebAIM contrast checker: https://webaim.org/resources/contrastchecker/

- [ ] **Text resizable**
  - Zoom browser to 200%
  - Text remains readable
  - Layout doesn't break
  - No text truncation

- [ ] **Does not rely on color alone**
  - Correct/incorrect indicated by icons + color
  - Links distinguishable without color

- [ ] **No flashing content**
  - Nothing flashes more than 3 times per second
  - Animations can be paused

---

## Functional Testing

### 13. Learning Interactions

Test every interaction type in the module:

**Multiple Choice:**
- [ ] Questions display
- [ ] Radio buttons/checkboxes work
- [ ] Submit button works
- [ ] Feedback displays
- [ ] Score calculated correctly

**Drag and Drop:**
- [ ] Items draggable (mouse)
- [ ] Items draggable (touch on mobile)
- [ ] Drop zones accept items
- [ ] Snap-to-grid works (if applicable)
- [ ] Reset button works
- [ ] Check answer works
- [ ] Feedback displays

**Matching:**
- [ ] Items connect correctly
- [ ] Visual feedback works
- [ ] Check answer works
- [ ] Scoring correct

**Text Input:**
- [ ] Input fields accept text
- [ ] Validation works
- [ ] Submit button works
- [ ] Feedback displays

**Hotspot:**
- [ ] Image loads
- [ ] Clickable areas work
- [ ] Hover states work (desktop)
- [ ] Feedback displays
- [ ] All hotspots accessible

### 14. Navigation

- [ ] **Internal navigation**
  - Next/previous buttons work
  - Menu navigation works (if applicable)
  - Breadcrumbs work (if applicable)

- [ ] **External links**
  - Links open in new tab (best practice)
  - Links work correctly
  - No broken links

- [ ] **Exit behavior**
  - Close button works (if applicable)
  - Browser back button doesn't break content
  - Exit saves progress

### 15. Multimedia

**Images:**
- [ ] All images load
- [ ] No broken image icons
- [ ] Alt text present (check HTML)
- [ ] Appropriate file sizes

**Video (if applicable):**
- [ ] Video player loads
- [ ] Video plays
- [ ] Controls work (play, pause, volume, fullscreen)
- [ ] Captions available (if required)
- [ ] Mobile playback works

**Audio (if applicable):**
- [ ] Audio player loads
- [ ] Audio plays
- [ ] Controls work
- [ ] Transcript available (if required)
- [ ] Mobile playback works

---

## Edge Cases and Error Handling

### 16. Stress Testing

- [ ] **Rapid clicking**
  - Click buttons quickly/repeatedly
  - No JavaScript errors
  - No duplicate submissions

- [ ] **Invalid inputs**
  - Enter unexpected data in forms
  - Leave required fields empty
  - Enter very long text
  - Validation handles gracefully

- [ ] **Multiple attempts**
  - Complete activity multiple times
  - Scores update correctly
  - No data corruption

### 17. Connection Issues

- [ ] **Slow connection simulation**
  - Throttle network in browser DevTools
  - Content still loads (may be slow)
  - No broken functionality

- [ ] **Connection interruption**
  - Disconnect network mid-session
  - Reconnect
  - Data saved correctly (check suspend_data)

### 18. Browser Refresh

- [ ] **F5 refresh during activity**
  - Data preserved (if suspend_data implemented)
  - OR activity restarts gracefully
  - No errors

---

## Performance Testing

### 19. Load Time

- [ ] **Initial load time**
  - Clear cache
  - Load content
  - Time to interactive: _______ seconds
  - Target: < 5 seconds on standard connection

- [ ] **Resource loading**
  - Check Network tab in DevTools
  - No 404 errors (missing files)
  - No excessively large files
  - Images lazy-load (if applicable)

### 20. Memory Usage

- [ ] **Memory leaks**
  - Open content
  - Interact extensively
  - Check Task Manager / Activity Monitor
  - Memory usage stable (not constantly increasing)

---

## Security Testing

### 21. Security Checks

- [ ] **No console warnings**
  - No mixed content warnings (HTTP in HTTPS)
  - No security warnings

- [ ] **Input sanitization**
  - Try XSS attack in text inputs: `<script>alert('test')</script>`
  - Input should be sanitized (not executed)

- [ ] **No sensitive data exposed**
  - Check browser DevTools > Sources
  - No API keys visible
  - No credentials in code

---

## Completion Testing

### 22. Completion Scenarios

**Scenario 1: Full completion**
- [ ] Complete all activities
- [ ] Check answer and get 100%
- [ ] Status in LMS: "Completed"
- [ ] Score in LMS: 100

**Scenario 2: Partial completion**
- [ ] Complete some activities
- [ ] Exit without finishing
- [ ] Status in LMS: "Incomplete"
- [ ] Progress saved (if applicable)

**Scenario 3: Failed attempt**
- [ ] Intentionally get wrong answers
- [ ] Status in LMS: Updates appropriately
- [ ] Low score recorded

**Scenario 4: Multiple attempts**
- [ ] Complete activity (attempt 1)
- [ ] Relaunch and complete again (attempt 2)
- [ ] Verify which attempt LMS records
- [ ] LMS records: [ ] First [ ] Last [ ] Highest [ ] Other

---

## Documentation Check

### 23. User-Facing Documentation

- [ ] **Instructions clear**
  - Learner knows what to do
  - No jargon or unclear terms

- [ ] **Feedback messages helpful**
  - Correct/incorrect feedback clear
  - Hints useful (if applicable)

- [ ] **Error messages user-friendly**
  - No technical jargon
  - Tells user what to do next

### 24. Technical Documentation

- [ ] **Module metadata complete**
  - Title correct in manifest
  - Description present
  - Duration estimate accurate

- [ ] **Known issues documented**
  - Any workarounds noted
  - Limitations explained

---

## Sign-Off

### Testing Complete

**Package Name:** ________________________________

**Version:** ________________________________

**Tested By:** ________________________________

**Date:** ________________________________

**Environment:**
- LMS: ________________________________
- LMS Version: ________________________________
- Browsers Tested: ________________________________

### Results Summary

**Total Tests:** _______
**Passed:** _______
**Failed:** _______
**Needs Fix:** _______

### Critical Issues Found

1. ________________________________
   - Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   - Action: ________________________________

2. ________________________________
   - Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   - Action: ________________________________

3. ________________________________
   - Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   - Action: ________________________________

### Recommendation

- [ ] **Approve for production** - No critical issues
- [ ] **Approve with minor fixes** - Non-blocking issues to address
- [ ] **Reject - needs fixes** - Critical issues must be resolved

**Approver Signature:** ________________________________

**Date:** ________________________________

---

## Quick Reference: Common Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Blank screen after launch | Wrong launch file path | Check manifest, verify file path |
| SCORM API not found | LMS iframe issue | Verify SCORM wrapper code |
| Score not saving | LMSCommit not called | Check SCORM wrapper calls |
| Content doesn't fit screen | Missing viewport meta tag | Add `<meta name="viewport" ...>` |
| Images not loading | Wrong file path | Use relative paths, check case |
| Works locally, fails in LMS | Absolute paths used | Change to relative paths |
| Mobile touch not working | Missing touch event handlers | Add touch events to code |
| Console errors | JavaScript bugs | Debug in browser DevTools |

---

**Document Version:** 1.0
**Last Updated:** 2025-10-28
**For Questions:** Contact IT Support or Learning Technology Team
