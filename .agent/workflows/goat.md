---
description: Push code to GitHub and deploy to Vercel (The GOAT Command)
---
1. Run `git add .` to stage all changes.
2. Run `git commit -m "chore: automated deployment update"`
3. Run `git push` to push to origin main.
// turbo
4. Run `npx vercel --prod --yes` in the `3_code/frontend` directory to deploy to production.
