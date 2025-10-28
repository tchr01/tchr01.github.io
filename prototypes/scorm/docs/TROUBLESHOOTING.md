# SCORM Learning Object Troubleshooting Guide

## Quick Diagnostic Steps

When something isn't working:

1. **Check browser console** (F12 → Console tab)
   - Look for red errors
   - Look for "[SCORM]" messages

2. **Test locally first** (open HTML file in browser)
   - Does it work outside the LMS?
   - If yes: LMS issue. If no: code issue.

3. **Check SCORM Cloud** (scorm.com/scorm-solved/scorm-cloud-features/scorm-cloud-sandbox/)
   - Upload to free SCORM Cloud testing environment
   - If works there but not your LMS: LMS-specific issue

4. **Review test checklist** (testing/test-checklist.md)
   - Ensure all tests passed

---

## Common Issues and Solutions

### Issue 1: Blank Screen After Launch

**Symptoms:**
- Content launches but shows only white/blank screen
- No content visible
- May show loading indicator forever

**Causes and Solutions:**

#### Cause A: Wrong Launch File Path

**How to diagnose:**
- Check browser console for 404 errors
- Look for "index.html not found" or similar

**Solution:**
```xml
<!-- In imsmanifest.xml, ensure path is correct: -->
<resource identifier="RESOURCE_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
  <!-- NOT href="src/index.html" or href="/index.html" -->
</resource>
```

**File structure should be:**
```
package.zip
├── imsmanifest.xml
├── index.html          ← Launch file at root
├── scorm-wrapper.js
├── styles/
└── images/
```

#### Cause B: JavaScript Error on Load

**How to diagnose:**
- Open browser console (F12)
- Look for red error messages
- Check what line is failing

**Solution:**
- Fix the JavaScript error
- Common errors:
  - Missing semicolons
  - Undefined variables
  - Typos in function names

#### Cause C: Missing Meta Viewport Tag

**How to diagnose:**
- Content loads on desktop but not mobile
- Mobile shows zoomed-out tiny version

**Solution:**
```html
<!-- Add to <head> section: -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### Cause D: LMS Blocking Content in iframe

**How to diagnose:**
- Check console for "X-Frame-Options" or "Content-Security-Policy" errors
- Works in SCORM Cloud but not your LMS

**Solution:**
- Contact LMS administrator
- May need to whitelist your content domain
- May need CSP headers adjusted

---

### Issue 2: SCORM Tracking Not Working

**Symptoms:**
- Content works fine
- Completion status never updates in LMS
- Scores don't appear in gradebook

**Causes and Solutions:**

#### Cause A: SCORM API Not Found

**How to diagnose:**
```javascript
// Check console for:
[SCORM] SCORM API not found. Running in standalone mode.
```

**Solution:**
1. Verify SCORM wrapper is loading:
   ```html
   <script src="scorm-wrapper.js"></script>
   ```

2. Check file path is correct (relative path!)

3. Verify LMS actually supports SCORM:
   - Try uploading a known-good SCORM package
   - Contact LMS administrator

#### Cause B: SCORM API Window Hierarchy Issue

**How to diagnose:**
- Console shows: "Maximum API search attempts reached"

**Solution:**
- This is rare - means LMS iframe structure is unusual
- Update scorm-wrapper.js `maxAttempts` value:
  ```javascript
  var maxAttempts = 1000;  // Increase from 500
  ```

#### Cause C: LMSCommit Not Called

**How to diagnose:**
- Data seems to save during session
- Data lost after closing
- No errors in console

**Solution:**
Ensure you're calling commit after setting values:
```javascript
SCORM.set('cmi.core.score.raw', 85);
SCORM.commit();  // ← Must call this!
```

Or use convenience methods that auto-commit:
```javascript
SCORM.setScore(85);  // Auto-commits
SCORM.setComplete();  // Auto-commits
```

#### Cause D: Wrong Data Model Element Names

**How to diagnose:**
- Console shows errors like "Invalid data model element"

**Solution:**
SCORM 1.2 uses specific element names:
```javascript
// CORRECT:
SCORM.set('cmi.core.lesson_status', 'completed');
SCORM.set('cmi.core.score.raw', 85);

// WRONG:
SCORM.set('cmi.completion_status', 'completed');  // SCORM 2004
SCORM.set('cmi.score', 85);  // Missing .core.score.raw
```

---

### Issue 3: Images Not Loading

**Symptoms:**
- Broken image icons
- Alt text shows but no image
- Works locally, breaks in LMS

**Causes and Solutions:**

#### Cause A: Absolute Paths Used

**How to diagnose:**
- Check HTML source:
  ```html
  <!-- WRONG: -->
  <img src="/images/photo.jpg">
  <img src="C:\Users\Desktop\images\photo.jpg">
  <img src="file:///Users/me/images/photo.jpg">
  ```

**Solution:**
Use relative paths:
```html
<!-- CORRECT: -->
<img src="images/photo.jpg">
<img src="./images/photo.jpg">
```

#### Cause B: Case Sensitivity

**How to diagnose:**
- Works on Windows, breaks on Linux LMS server
- Filename is "Photo.JPG" but code has "photo.jpg"

**Solution:**
- Make filenames and code match exactly
- Best practice: use lowercase for all filenames

```html
<!-- File: images/Photo.JPG -->
<img src="images/photo.jpg">  ❌ Won't work on Linux

<!-- File: images/photo.jpg -->
<img src="images/photo.jpg">  ✓ Works everywhere
```

#### Cause C: File Not in Package

**How to diagnose:**
- Unzip the SCORM package
- Check if image file actually exists

**Solution:**
- Add missing file to package
- Rebuild ZIP

#### Cause D: File Size Too Large

**How to diagnose:**
- Image loads slowly or times out
- Other images load fine

**Solution:**
- Optimize image (compress, resize)
- Target: < 500 KB per image
- Tools: TinyPNG, ImageOptim, Photoshop "Save for Web"

---

### Issue 4: Content Works Locally, Fails in LMS

**Symptoms:**
- Opens fine in browser from filesystem
- Breaks when uploaded to LMS

**Causes and Solutions:**

#### Cause A: Using localhost or External URLs

**How to diagnose:**
```html
<!-- Check your code for: -->
<script src="http://localhost:3000/app.js"></script>
<link href="https://external-site.com/style.css" rel="stylesheet">
```

**Solution:**
```html
<!-- Bundle everything locally: -->
<script src="app.js"></script>
<link href="style.css" rel="stylesheet">

<!-- OR use reliable CDN (if LMS allows): -->
<script src="https://cdn.tailwindcss.com"></script>
```

#### Cause B: Cross-Origin Resource Sharing (CORS)

**How to diagnose:**
- Console shows: "CORS policy blocked"
- External resources (fonts, APIs) not loading

**Solution:**
- Bundle all resources locally
- Or use CDNs that allow CORS (most major CDNs do)

#### Cause C: Mixed Content (HTTP in HTTPS)

**How to diagnose:**
- Console shows: "Mixed content warning"
- LMS uses HTTPS but content loads HTTP resources

**Solution:**
```html
<!-- WRONG: -->
<script src="http://example.com/script.js"></script>

<!-- CORRECT: -->
<script src="https://example.com/script.js"></script>

<!-- OR protocol-relative: -->
<script src="//example.com/script.js"></script>
```

---

### Issue 5: Touch/Mobile Not Working

**Symptoms:**
- Drag-and-drop works on desktop
- Doesn't work on iPad/tablet
- Buttons don't respond to touch

**Causes and Solutions:**

#### Cause A: Missing Touch Event Handlers

**How to diagnose:**
- Test on actual mobile device or mobile emulator
- Elements respond to mouse but not touch

**Solution:**
Add touch event handlers:
```javascript
element.addEventListener('mousedown', handleStart);
element.addEventListener('touchstart', handleStart);  // ← Add this

element.addEventListener('mousemove', handleMove);
element.addEventListener('touchmove', handleMove);  // ← Add this

element.addEventListener('mouseup', handleEnd);
element.addEventListener('touchend', handleEnd);  // ← Add this
```

#### Cause B: Touch-Action CSS Property

**How to diagnose:**
- Touch starts drag but browser also scrolls
- Unwanted default touch behaviors

**Solution:**
```css
.draggable-item {
    touch-action: none;  /* Disable browser touch handling */
}
```

#### Cause C: Small Touch Targets

**How to diagnose:**
- Buttons hard to tap on mobile
- Users miss targets frequently

**Solution:**
Ensure touch targets are at least 44×44 pixels:
```css
button, .clickable {
    min-width: 44px;
    min-height: 44px;
    /* Add padding if needed */
}
```

---

### Issue 6: Accessibility Problems

**Symptoms:**
- Screen reader doesn't announce content
- Can't navigate with keyboard
- Fails WCAG compliance

**Causes and Solutions:**

#### Cause A: Missing Alt Text

**How to diagnose:**
- Screen reader says "image" with no description
- Accessibility audit tool flags images

**Solution:**
```html
<!-- WRONG: -->
<img src="chart.jpg">

<!-- CORRECT: -->
<img src="chart.jpg" alt="Bar chart showing 2023 sales data by quarter">

<!-- Decorative images: -->
<img src="decoration.jpg" alt="">
```

#### Cause B: No Keyboard Navigation

**How to diagnose:**
- Press Tab key
- Can't reach interactive elements
- Elements don't show focus

**Solution:**
```html
<!-- Add tabindex to custom elements: -->
<div class="button" tabindex="0" role="button" onclick="handleClick()">
    Click Me
</div>

<!-- Better: use real buttons -->
<button onclick="handleClick()">Click Me</button>
```

Add visible focus states:
```css
button:focus, .interactive:focus {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
}
```

#### Cause C: Missing ARIA Labels

**How to diagnose:**
- Screen reader can't identify element purpose
- Form fields not associated with labels

**Solution:**
```html
<!-- WRONG: -->
<div>Name</div>
<input type="text">

<!-- CORRECT: -->
<label for="name-input">Name</label>
<input type="text" id="name-input">

<!-- OR use aria-label: -->
<input type="text" aria-label="Enter your name">

<!-- For complex widgets: -->
<div role="region" aria-label="Quiz questions">
    <!-- content -->
</div>
```

#### Cause D: Color Contrast Too Low

**How to diagnose:**
- Text hard to read
- WebAIM contrast checker fails
- Tool: https://webaim.org/resources/contrastchecker/

**Solution:**
- Text on background: minimum 4.5:1 ratio
- Large text (18pt+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

```css
/* WRONG: */
.text {
    color: #999;  /* Light gray */
    background: #eee;  /* Almost white - low contrast! */
}

/* CORRECT: */
.text {
    color: #333;  /* Dark gray */
    background: #fff;  /* White - high contrast */
}
```

---

### Issue 7: Slow Loading

**Symptoms:**
- Content takes > 10 seconds to load
- Learner sees loading screen for long time
- Timeout errors

**Causes and Solutions:**

#### Cause A: Large File Sizes

**How to diagnose:**
- Open DevTools → Network tab
- Look for large files (> 1 MB)
- Check total package size

**Solution:**
- **Images:** Compress with TinyPNG, use WebP format
- **Videos:** Use external hosting (YouTube, Vimeo) instead of embedding
- **Fonts:** Use system fonts or limited font weights
- **JavaScript:** Minify code

Target package sizes:
- Simple interaction: < 5 MB
- Rich media: < 20 MB
- Complex simulation: < 50 MB

#### Cause B: Too Many HTTP Requests

**How to diagnose:**
- DevTools Network tab shows 50+ requests
- Many small files loading

**Solution:**
- Bundle CSS into one file
- Bundle JavaScript into one file
- Use CSS sprites for small icons
- Use inline SVG for icons

#### Cause C: Blocking Resources

**How to diagnose:**
- Page hangs waiting for external resource
- External CDN is slow or unreachable

**Solution:**
```html
<!-- Add async or defer to scripts: -->
<script src="analytics.js" async></script>
<script src="app.js" defer></script>

<!-- Load critical CSS inline: -->
<style>
    /* Critical above-the-fold styles */
</style>

<!-- Load full CSS asynchronously: -->
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

---

### Issue 8: Browser-Specific Bugs

**Symptoms:**
- Works in Chrome, breaks in Safari
- Works in Firefox, breaks in Edge
- Works everywhere except IE11

**Causes and Solutions:**

#### Cause A: Modern JavaScript Not Supported

**How to diagnose:**
- Check console in problematic browser
- Error like "Promise is not defined" or "async not recognized"

**Solution:**
Use polyfills or transpile code:
```html
<!-- Add polyfill for older browsers: -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
```

Or avoid modern syntax:
```javascript
// MODERN (may not work in older browsers):
const items = [...array];
const result = await fetchData();

// COMPATIBLE:
var items = array.slice();
fetchData().then(function(result) {
    // handle result
});
```

#### Cause B: CSS Grid/Flexbox Not Supported

**How to diagnose:**
- Layout broken in IE11
- Elements overlapping or misaligned

**Solution:**
```css
/* Provide fallback: */
.container {
    display: block;  /* Fallback */
    display: grid;  /* Modern browsers */
}

/* OR use Flexbox (better IE11 support): */
.container {
    display: flex;
}
```

#### Cause C: Safari-Specific Issues

**How to diagnose:**
- Dates not parsing: `new Date('2023-10-28')` returns Invalid Date
- LocalStorage not working in iframe

**Solution:**
```javascript
// Safari date parsing:
// WRONG:
new Date('2023-10-28');  // Fails in Safari

// CORRECT:
new Date('2023/10/28');  // Works everywhere
// OR:
new Date(2023, 9, 28);  // Month is 0-indexed!

// Safari LocalStorage in iframe:
// May be blocked - check first:
try {
    localStorage.setItem('test', 'value');
    // Works
} catch (e) {
    // Blocked - use alternative (SCORM suspend_data)
    SCORM.saveSuspendData({ test: 'value' });
}
```

---

### Issue 9: Manifest/Package Structure Errors

**Symptoms:**
- LMS rejects package on upload
- "Invalid package" error
- "Manifest error" message

**Causes and Solutions:**

#### Cause A: imsmanifest.xml Syntax Error

**How to diagnose:**
- Open imsmanifest.xml in browser
- If XML is invalid, browser will show error

**Solution:**
Validate XML structure:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST_1" version="1.0"
    xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                        http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                        http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
    <!-- Content here -->
</manifest>
```

Common errors:
- Missing closing tags
- Unescaped & characters (use `&amp;`)
- Unescaped < > characters (use `&lt;` `&gt;`)

#### Cause B: Wrong Folder Structure

**How to diagnose:**
- Unzip package
- Check if imsmanifest.xml is at root level

**Solution:**
```
CORRECT:
package.zip
├── imsmanifest.xml  ← Must be at root!
├── index.html
└── ...

WRONG:
package.zip
└── my-module/
    ├── imsmanifest.xml  ← Too nested!
    └── ...
```

#### Cause C: Missing Required Metadata

**How to diagnose:**
- LMS import partially works but missing title/description

**Solution:**
Ensure manifest has required elements:
```xml
<manifest>
    <metadata>
        <schema>ADL SCORM</schema>
        <schemaversion>1.2</schemaversion>
    </metadata>

    <organizations default="ORG_1">
        <organization identifier="ORG_1">
            <title>Module Title Here</title>  ← Required!
            <item identifier="ITEM_1" identifierref="RESOURCE_1">
                <title>SCO Title</title>  ← Required!
            </item>
        </organization>
    </organizations>

    <resources>
        <resource identifier="RESOURCE_1" type="webcontent"
                  adlcp:scormtype="sco" href="index.html">
            <file href="index.html"/>
            <!-- List all files -->
        </resource>
    </resources>
</manifest>
```

---

### Issue 10: Data Not Persisting

**Symptoms:**
- Learner makes progress
- Closes and reopens
- Progress lost

**Causes and Solutions:**

#### Cause A: Not Using suspend_data

**How to diagnose:**
- Check if code saves to suspend_data
- Look for `SCORM.saveSuspendData()` calls

**Solution:**
```javascript
// Save progress before exit:
window.addEventListener('beforeunload', function() {
    var progressData = {
        currentQuestion: 5,
        answers: ['A', 'B', 'C', 'D', 'A'],
        score: 80,
        completedSections: [1, 2, 3]
    };

    SCORM.saveSuspendData(progressData);
});

// Load progress on init:
window.addEventListener('load', function() {
    var savedData = SCORM.loadSuspendData(true);  // true = parse JSON

    if (savedData) {
        // Restore progress
        currentQuestion = savedData.currentQuestion;
        answers = savedData.answers;
        // etc.
    }
});
```

#### Cause B: Exceed 4096 Character Limit

**How to diagnose:**
- Console shows: "Suspend data too large"
- Data truncated

**Solution:**
Compress data:
```javascript
// Instead of saving verbose data:
{
    question1: "answer",
    question2: "answer",
    question3: "answer"
}

// Use compact format:
{
    q: ["answer1", "answer2", "answer3"]
}

// Or use compression library (LZ-String)
```

SCORM 1.2 limit: 4,096 characters
SCORM 2004 limit: 64,000 characters (consider upgrading if needed)

#### Cause C: Not Calling LMSCommit

**Solution:**
```javascript
// After saving suspend data:
SCORM.saveSuspendData(progressData);
SCORM.commit();  // ← Must call this!
```

The scorm-wrapper.js in this framework auto-commits for you, but if using custom code, ensure commit is called.

---

## Diagnostic Tools

### Browser Developer Tools

**Chrome DevTools (F12):**
- **Console:** View errors and SCORM logs
- **Network:** Check file loading and sizes
- **Application:** View LocalStorage, SessionStorage
- **Sources:** Debug JavaScript

**Firefox Developer Tools:**
- Similar to Chrome
- Better CSS grid inspector

### SCORM Cloud Sandbox

**Free testing environment:**
- URL: https://cloud.scorm.com/sc/guest/SignUpForm
- Upload and test packages
- View detailed SCORM logs
- If works here but not your LMS → LMS issue

### Accessibility Checkers

**Browser Extensions:**
- WAVE (WebAIM)
- axe DevTools
- Lighthouse (built into Chrome)

**Run audit:**
1. Open DevTools
2. Go to Lighthouse tab
3. Check "Accessibility"
4. Generate report

### Validation Tools

**HTML Validator:**
- https://validator.w3.org/
- Upload or paste HTML
- Checks for syntax errors

**XML Validator:**
- Open imsmanifest.xml in browser
- Browser will show errors if invalid

**SCORM Manifest Validator:**
- Some LMS platforms provide this
- Or use: https://github.com/adlnet/SCORM-to-xAPI-Wrapper

---

## Getting Help

### Information to Provide

When asking for help, include:

1. **Package information:**
   - Name and version
   - File size
   - How it was created

2. **Environment:**
   - LMS name and version
   - Browser name and version
   - Operating system

3. **Symptoms:**
   - Exact error messages
   - Screenshots
   - Console logs (copy full text)

4. **What you've tried:**
   - Troubleshooting steps already taken
   - Changes made

5. **Reproducibility:**
   - Does it happen every time?
   - Does it affect all users or just some?

### Support Channels

**Internal:**
- IT Help Desk: [your ticket system]
- Learning Technology Team: [your contact]
- LMS Administrator: [your contact]

**External:**
- SCORM.com community forums
- LMS vendor support
- Stack Overflow (tag: scorm)

---

## Prevention Best Practices

### Development Checklist

Before deploying to production:

- [ ] Test locally in browser
- [ ] Test in SCORM Cloud
- [ ] Test in LMS staging environment
- [ ] Test in 3+ browsers
- [ ] Test on mobile device
- [ ] Run accessibility audit
- [ ] Review console for errors
- [ ] Check all image paths
- [ ] Verify SCORM tracking
- [ ] Document any workarounds

### Code Quality

- Use relative paths (never absolute)
- Validate HTML and XML
- Test with SCORM wrapper debug mode on
- Add error handling
- Include console logging for debugging
- Comment complex code

### Documentation

- Maintain changelog
- Document known issues
- Keep testing notes
- Update metadata in manifest

---

**Document Version:** 1.0
**Last Updated:** 2025-10-28
**For Questions:** Contact Learning Technology Team
