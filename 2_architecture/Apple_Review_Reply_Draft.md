Dear App Review Team,

Thank you for your feedback regarding our app, Aura (Submission ID: ee683933-0755-453a-a358-82f36a28a18b). We have addressed the outstanding issues as follows:

**Guideline 2.1(a) - Performance - App Completeness**
Regarding the registration error message observed on the iPhone 17 Pro Max (iOS 26.4), we have performed a thorough audit of our authentication flow. We identified that certain technical alerts and a sensitive "Self-Healing" schema logic were causing a poor user experience and potential failures under certain network conditions.
- **Fix:** We have refactored the registration process. The app now automatically logs the user in upon successful registration, eliminating the "Redirect/Manual Login" hurdle. We have also unified and simplified all error messaging to ensure users receive helpful, readable feedback rather than technical diagnostic alerts. These improvements ensure the registration flow is robust and completed without error messages.

**Guideline 3.1.1 - Business - Payments - In-App Purchase**
Regarding the access of digital content purchased outside the app, we have simplified our access model to align with our institutional licensing strategy.
- **Fix:** Aura is now officially an institutional-only/free-tier platform. We have removed all legacy logic related to "trial periods" and "expired subscriptions" that were previously mentioned or triggered in our backend. Every user is now granted full, active access immediately upon registration (via email or Google SSO). Because there is no longer any concept of a paid subscription or trial balance that can be managed outside the app, our model is consistent throughout and eliminates the need for In-App Purchases for digital content.

We believe these updates fully resolve the concerns raised. We appreciate your partnership in helping us provide a high-quality experience for students.

Best regards,

The Aura Development Team
