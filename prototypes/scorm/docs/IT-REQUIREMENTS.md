# IT Requirements Questionnaire

## Purpose
This document helps IT teams gather all necessary technical specifications before deploying custom SCORM learning objects. Complete this questionnaire and share with your Learning Design team to ensure smooth deployment.

---

## 1. LMS Platform Information

### 1.1 Basic Information
- **LMS Platform Name:** ________________________________
  - Examples: Moodle, Blackboard Learn, Canvas, D2L Brightspace, Cornerstone, Workday Learning, SuccessFactors, TalentLMS, etc.

- **LMS Version:** ________________________________
  - Include major and minor version (e.g., Moodle 4.1.2, Blackboard 3900.75.0)

- **Hosting Type:**
  - [ ] Cloud-hosted (SaaS)
  - [ ] On-premise
  - [ ] Hybrid
  - [ ] Other: ________________________________

- **LMS Vendor/Provider:** ________________________________

### 1.2 LMS URL
- **Production URL:** ________________________________
- **Staging/Test URL:** ________________________________
- **Can Learning Team access staging?** [ ] Yes [ ] No

---

## 2. SCORM Support

### 2.1 SCORM Version Support
**Which SCORM versions does your LMS support?** (Check all that apply)
- [ ] SCORM 1.2
- [ ] SCORM 2004 2nd Edition
- [ ] SCORM 2004 3rd Edition
- [ ] SCORM 2004 4th Edition
- [ ] xAPI/Tin Can
- [ ] AICC
- [ ] cmi5
- [ ] Other: ________________________________

**Note:** These templates are built for SCORM 1.2 (most compatible)

### 2.2 SCORM API Implementation
- **Is SCORM API properly implemented?** [ ] Yes [ ] No [ ] Unknown
- **Last tested:** ________________________________
- **Known SCORM issues in your LMS?**

  ________________________________

  ________________________________

---

## 3. Technical Constraints

### 3.1 File Size and Package Limits
- **Maximum SCORM package size:** _______ MB
- **Maximum unzipped package size:** _______ MB
- **Maximum individual file size:** _______ MB
- **Are there timeout limits for uploads?** [ ] Yes [ ] No
  - If yes, timeout duration: _______ minutes

### 3.2 File Type Restrictions
**Are any file types blocked or restricted?** (Check all that apply)
- [ ] JavaScript (.js) - **CRITICAL if blocked**
- [ ] HTML5 features (Canvas, SVG, etc.)
- [ ] External fonts (.woff, .woff2, .ttf)
- [ ] Video formats (.mp4, .webm, .ogv)
- [ ] Audio formats (.mp3, .ogg, .wav)
- [ ] Image formats (.svg, .webp)
- [ ] JSON files (.json)
- [ ] Other: ________________________________

**If JavaScript is restricted:**
- Can it be whitelisted for learning content? [ ] Yes [ ] No
- Are there Content Security Policy (CSP) restrictions? [ ] Yes [ ] No

### 3.3 JavaScript and API Restrictions
- **Are external JavaScript libraries allowed?** [ ] Yes [ ] No [ ] Some
  - If "Some", which are allowed? ________________________________

- **Are CDNs (Content Delivery Networks) accessible?** [ ] Yes [ ] No
  - Examples: cdn.tailwindcss.com, cdnjs.cloudflare.com
  - If No, must we bundle all libraries? [ ] Yes [ ] No

- **Are there JavaScript API restrictions?**
  - LocalStorage: [ ] Allowed [ ] Blocked [ ] Unknown
  - SessionStorage: [ ] Allowed [ ] Blocked [ ] Unknown
  - Cookies: [ ] Allowed [ ] Blocked [ ] Unknown
  - Console logging: [ ] Allowed [ ] Blocked [ ] Unknown

---

## 4. Browser Support

### 4.1 Required Browsers
**Which browsers must be supported?** (Check all that apply and note minimum version)

Desktop:
- [ ] Chrome (version _____ or higher)
- [ ] Firefox (version _____ or higher)
- [ ] Safari (version _____ or higher)
- [ ] Microsoft Edge (version _____ or higher)
- [ ] Internet Explorer 11 - **⚠️ REQUIRES POLYFILLS**

Mobile:
- [ ] iOS Safari (version _____ or higher)
- [ ] Android Chrome (version _____ or higher)
- [ ] Other mobile browsers: ________________________________

### 4.2 Device Support
- [ ] Desktop/Laptop only
- [ ] Tablet support required
- [ ] Mobile phone support required
- [ ] All devices

**Minimum screen resolution supported:** _______ x _______

---

## 5. Network and Security

### 5.1 Network Environment
- **Is content accessed behind a firewall?** [ ] Yes [ ] No
- **Is content accessed via VPN?** [ ] Yes [ ] No
- **Are there proxy servers?** [ ] Yes [ ] No

### 5.2 Security Policies
- **SSL/HTTPS required?** [ ] Yes [ ] No
  - If mixed content (HTTP in HTTPS), is it blocked? [ ] Yes [ ] No

- **Content Security Policy (CSP) in place?** [ ] Yes [ ] No [ ] Unknown
  - If Yes, please provide CSP headers:

  ________________________________

- **Cross-Origin Resource Sharing (CORS) restrictions?** [ ] Yes [ ] No [ ] Unknown

- **Are iframes allowed?** [ ] Yes [ ] No [ ] Restricted
  - If Restricted, describe: ________________________________

### 5.3 Authentication
- **Does LMS use Single Sign-On (SSO)?** [ ] Yes [ ] No
  - If Yes, type: [ ] SAML [ ] OAuth [ ] Other: ________________________________

- **Are there session timeout limits?** [ ] Yes [ ] No
  - If Yes, duration: _______ minutes
  - Does content activity extend session? [ ] Yes [ ] No

---

## 6. Accessibility Requirements

### 6.1 Compliance Standards
**Which accessibility standards must be met?** (Check all that apply)
- [ ] ADA (Americans with Disabilities Act)
- [ ] Section 508
- [ ] WCAG 2.0 Level A
- [ ] WCAG 2.0 Level AA
- [ ] WCAG 2.1 Level A
- [ ] WCAG 2.1 Level AA - **RECOMMENDED**
- [ ] WCAG 2.2 Level AA
- [ ] Other: ________________________________

### 6.2 Assistive Technology Support
**Which assistive technologies must be supported?**
- [ ] Screen readers (JAWS, NVDA, VoiceOver)
- [ ] Screen magnification software
- [ ] Alternative input devices (switch controls, voice control)
- [ ] Keyboard-only navigation
- [ ] High contrast modes
- [ ] Closed captioning (for video/audio)

### 6.3 Testing Process
- **Who is responsible for accessibility testing?**
  - [ ] IT Team
  - [ ] Learning Team
  - [ ] Third-party vendor
  - [ ] Accessibility office
  - Other: ________________________________

- **Are there automated testing tools in use?**
  - Tool name(s): ________________________________

---

## 7. Performance Requirements

### 7.1 Load Time Expectations
- **Maximum acceptable load time:** _______ seconds
- **Target load time:** _______ seconds

### 7.2 Concurrent Users
- **Expected peak concurrent users:** _______
- **Has LMS been load tested for this?** [ ] Yes [ ] No

### 7.3 Bandwidth Considerations
- **Minimum bandwidth for learners:** _______ Mbps
- **Are learners on low-bandwidth connections?** [ ] Yes [ ] No
- **Should content be optimized for low bandwidth?** [ ] Yes [ ] No

---

## 8. Data and Reporting

### 8.1 SCORM Data Tracking
**Which SCORM data elements are tracked/reported?** (Check all that apply)
- [ ] cmi.core.lesson_status (completion)
- [ ] cmi.core.score.raw (score)
- [ ] cmi.core.score.min / max
- [ ] cmi.core.session_time (time spent)
- [ ] cmi.core.total_time (cumulative time)
- [ ] cmi.suspend_data (custom data)
- [ ] cmi.core.lesson_location (bookmark)
- [ ] cmi.interactions.* (detailed interactions)
- [ ] cmi.objectives.* (learning objectives)

### 8.2 Reporting Requirements
- **Where is SCORM data visible?**
  - [ ] LMS gradebook
  - [ ] Learning records/transcript
  - [ ] Completion certificates
  - [ ] Custom reports
  - [ ] Analytics dashboards
  - Other: ________________________________

- **Who needs access to this data?**
  - [ ] Instructors/Faculty
  - [ ] Learners
  - [ ] Administrators
  - [ ] Department heads
  - [ ] Compliance officers
  - Other: ________________________________

### 8.3 Data Persistence
- **How long is SCORM data retained?** _______ years/months
- **Can learners reset their progress?** [ ] Yes [ ] No
- **Are multiple attempts allowed?** [ ] Yes [ ] No
  - If Yes, how many? [ ] Unlimited [ ] Limited to: _______
  - Which attempt is recorded? [ ] First [ ] Last [ ] Highest [ ] Average

---

## 9. Content Deployment Process

### 9.1 Upload and Import
- **Who uploads SCORM packages to LMS?**
  - [ ] IT Team
  - [ ] Learning Design Team
  - [ ] Instructional Designers
  - [ ] Faculty/Instructors
  - Other: ________________________________

- **What is the upload process?**
  1. ________________________________
  2. ________________________________
  3. ________________________________

- **Average time from handoff to deployment:** _______ days/hours

### 9.2 Testing Environment
- **Is there a staging/sandbox environment?** [ ] Yes [ ] No
  - If Yes, URL: ________________________________
  - Who has access? ________________________________

- **Testing protocol before production:**
  - [ ] Functional testing (interactions work)
  - [ ] SCORM tracking testing (data saves correctly)
  - [ ] Cross-browser testing
  - [ ] Accessibility testing
  - [ ] Load testing
  - [ ] User acceptance testing (UAT)
  - Other: ________________________________

### 9.3 Version Control
- **How are content updates managed?**
  - [ ] New upload replaces old version
  - [ ] Versioning system tracks changes
  - [ ] Archive old versions
  - [ ] Other: ________________________________

- **What happens to learner data when content is updated?**
  - [ ] Data preserved
  - [ ] Data reset
  - [ ] Varies by update type
  - [ ] Unknown

---

## 10. Support and Troubleshooting

### 10.1 Support Contacts
- **IT Support Contact:**
  - Name: ________________________________
  - Email: ________________________________
  - Phone: ________________________________

- **LMS Administrator:**
  - Name: ________________________________
  - Email: ________________________________

- **Escalation Contact (for critical issues):**
  - Name: ________________________________
  - Email: ________________________________

### 10.2 Issue Reporting
- **How should technical issues be reported?**
  - [ ] Help desk ticket system
  - [ ] Email
  - [ ] Slack/Teams channel
  - [ ] Other: ________________________________

- **Response time SLA:** _______ hours/days

### 10.3 Known Issues
**Are there any known issues with your LMS that we should be aware of?**

________________________________

________________________________

________________________________

---

## 11. Integration with Other Systems

### 11.1 External Integrations
- **Does LMS integrate with other systems?**
  - [ ] Student Information System (SIS)
  - [ ] HR Management System (HRMS)
  - [ ] Content Management System (CMS)
  - [ ] Analytics platform
  - [ ] Other: ________________________________

### 11.2 API Access
- **Is LMS API available for custom integrations?** [ ] Yes [ ] No
- **API Documentation:** ________________________________

---

## 12. Mobile and Offline Support

### 12.1 Mobile App
- **Does LMS have a mobile app?** [ ] Yes [ ] No
  - App name: ________________________________
  - Platforms: [ ] iOS [ ] Android [ ] Both

- **Do SCORM packages work in the mobile app?** [ ] Yes [ ] No [ ] Partial [ ] Unknown

### 12.2 Offline Access
- **Is offline access required?** [ ] Yes [ ] No
  - If Yes, describe requirements: ________________________________

---

## 13. Compliance and Legal

### 13.1 Data Privacy
- **Which data privacy regulations apply?** (Check all that apply)
  - [ ] FERPA (Family Educational Rights and Privacy Act)
  - [ ] GDPR (General Data Protection Regulation)
  - [ ] COPPA (Children's Online Privacy Protection Act)
  - [ ] HIPAA (if health-related content)
  - [ ] Other: ________________________________

### 13.2 Content Policies
- **Are there institutional content policies?** [ ] Yes [ ] No
  - If Yes, link to policies: ________________________________

- **Branding requirements:**
  - Logo usage: [ ] Required [ ] Optional [ ] Prohibited
  - Color scheme: [ ] Required [ ] Recommended [ ] Flexible
  - Font requirements: [ ] Specified fonts [ ] Institution fonts [ ] Any

---

## 14. Budget and Resources

### 14.1 Licensing
- **Are there per-user/per-seat licensing restrictions?** [ ] Yes [ ] No
- **Are there content hosting fees?** [ ] Yes [ ] No

### 14.2 Development Resources
- **Who will maintain/update content after initial deployment?**
  - [ ] IT Team
  - [ ] Learning Design Team
  - [ ] External vendor
  - [ ] Other: ________________________________

---

## 15. Success Criteria

### 15.1 Definition of Success
**How will we measure if deployment is successful?**

- [ ] Package imports without errors
- [ ] Content displays correctly in all browsers
- [ ] SCORM tracking works (completion/scores appear in gradebook)
- [ ] No user-reported issues within _______ days
- [ ] Meets accessibility standards
- [ ] Learner satisfaction score > _______
- [ ] Other: ________________________________

### 15.2 Pilot Testing
- **Will there be a pilot test before full rollout?** [ ] Yes [ ] No
  - If Yes, with how many users? _______
  - Duration: _______ days/weeks

---

## 16. Additional Information

### 16.1 Special Considerations
**Anything else we should know?**

________________________________

________________________________

________________________________

### 16.2 Priority and Timeline
- **Project Priority:** [ ] Critical [ ] High [ ] Medium [ ] Low
- **Target deployment date:** ________________________________
- **Hard deadline (if any):** ________________________________

---

## Completion

**Form completed by:**
- Name: ________________________________
- Role: ________________________________
- Department: ________________________________
- Date: ________________________________

**Reviewed by:**
- Name: ________________________________
- Role: ________________________________
- Date: ________________________________

---

## Next Steps

After completing this questionnaire:

1. **Share with Learning Design Team** - Ensure they understand technical constraints
2. **Schedule kickoff meeting** - Review requirements together
3. **Set up test environment** - Provision staging access for Learning Team
4. **Establish communication channels** - Set up Slack/Teams/email for coordination
5. **Create test SCORM package** - Deploy a simple test to validate all settings
6. **Document workarounds** - If any limitations exist, document solutions

---

## Appendix: Testing Template

Use this template for initial SCORM validation:

```
SCORM Package Test Report

Package Name: ________________________________
Version: ________________________________
Tester: ________________________________
Date: ________________________________

✓ = Pass | ✗ = Fail | ~ = Partial/Issues

[ ] Package uploads successfully
[ ] Package appears in course list
[ ] Launch button/link present
[ ] Content loads (no blank screen)
[ ] Content displays correctly
[ ] All interactions functional
[ ] SCORM API found (check console)
[ ] Completion status updates
[ ] Score recorded correctly
[ ] Time tracking works
[ ] Data persists after close/reopen
[ ] Mobile compatibility
[ ] Accessibility features work
[ ] No console errors

Issues Found:
________________________________
________________________________
________________________________

Resolution:
________________________________
________________________________
________________________________
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-28
**Maintained by:** Learning Technology Team
