# 🛠️ Aura Development Checklist

> **MANDATORY**: This checklist must be reviewed and followed before writing or deploying any code.

---

## 1. Git & GitHub
- [ ] Always use GitHub account **`gudivada-r`** for checking in code
- [ ] Commit with a descriptive message before every deployment
- [ ] Confirm `git push` succeeds and shows the correct remote (`https://github.com/gudivada-r/code.git`)

## 2. Build Before Deploy
- [ ] Run `npm run build` inside `3_code/frontend/` before every deployment
- [ ] Copy `3_code/frontend/dist/*` into the project root (`c:\Projects\AA\at\`) so Vercel serves fresh bundles
- [ ] Confirm `index.html` at the root references the **new** asset hashes (e.g., `index-pzvxm8xK.js`), NOT stale ones

## 3. Deployment Target
- [ ] Always deploy to **aumtech.ai** (production Vercel), NOT localhost
- [ ] Run `npx vercel --prod --yes` from the project root
- [ ] Wait for the output: `Aliased: https://www.aumtech.ai` before considering the deploy complete

## 4. Design & Branding Standards
- [ ] Product name: **Aura** | Tagline: **Your Campus Co-Pilot**
- [ ] Use the approved logo: `C:\Projects\AA\at\logo.png`
- [ ] Ensure color contrast meets accessibility standards (WCAG AA minimum)
- [ ] Use professional, high-quality visualizations — no placeholders
- [ ] Design must be polished and premium (not a minimum viable product)

## 5. Browser Security
- [ ] When opening the browser for testing, start Chrome with **password saving disabled**

## 6. Link Validation
- [ ] Every footer link, nav link, and CTA button must resolve to a valid route or public page
- [ ] Broken links (`404`) are a blocker — fix before deploying

---

*Last updated: 2026-04-11*
