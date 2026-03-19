// Mock Firebase Backend and Subscription Engine
export const TIERS = {
  STARTER: { id: 'starter', price: 29, name: 'Starter', features: ['AI Academic Roadmap', 'Progress Tracker'] },
  GUIDED: { id: 'guided', price: 59, name: 'Guided', features: ['Virtual Coaching', 'Extracurricular Matching'] },
  PREMIUM: { id: 'premium', price: 119, name: 'Premium', features: ['1-on-1 In-Person Counseling', 'App Polish'] }
};

export class SubscriptionService {
  constructor() {
    // Simulated Firestore document
    this.currentUser = {
      uid: "user_mock_123",
      tier: TIERS.PREMIUM.id,
      activityLedger: []
    };
  }

  getCurrentTier() {
    return TIERS[this.currentUser.tier.toUpperCase()];
  }

  logActivity(activity) {
    this.currentUser.activityLedger.push({
      ...activity,
      timestamp: new Date().toISOString(),
      verified: false 
    });
    return this.currentUser.activityLedger;
  }
}

export const subscriptionService = new SubscriptionService();
