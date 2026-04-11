# ✅ Aura Testing Checklist

> **MANDATORY**: This checklist must be reviewed and followed before considering any feature complete.

---

## 1. Test Environment
- [ ] Always test against **https://www.aumtech.ai** (production), NOT localhost
- [ ] Do NOT mark any feature done until verified on the live production URL

## 2. Browser Setup
- [ ] Start Chrome with **password saving disabled**
- [ ] Clear cache / hard-refresh (`Ctrl+Shift+R`) before testing to avoid serving stale assets

## 3. Verify the Landing Page First
- [ ] Before testing any other functionality, confirm the landing page UI shows the **latest design**
- [ ] If the landing page looks unchanged, STOP — the build/deploy has likely failed. Debug the root cause before proceeding.

## 4. Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@aumtech.ai` | (stored securely) |
| Student | `daniel.garrett12@txu.edu` | `pasword123` |

## 5. Login Flow
- [ ] Test login with **student credentials** (`daniel.garrett12@txu.edu`)
- [ ] Test login with **admin credentials** (`admin@aumtech.ai`)
- [ ] Confirm redirect to dashboard after successful login
- [ ] Confirm meaningful error message on failed login

## 6. Post-Login Functionality (Student View)
- [ ] Dashboard loads without errors
- [ ] GPA Tracker displays
- [ ] Degree Roadmap / Planner loads
- [ ] AI Chat is accessible
- [ ] Scholarship Matcher is accessible

## 7. Post-Login Functionality (Admin View)
- [ ] Admin dashboard loads
- [ ] Texas Analytics / institutional reports visible
- [ ] License Details page accessible

## 8. GitHub Credentials for Check-in
- [ ] Always use GitHub account **`gudivada-r`** for committing and pushing

---

*Last updated: 2026-04-11*
