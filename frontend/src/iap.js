import { Capacitor } from '@capacitor/core';

let Purchases = null;

const loadRevenueCat = async () => {
    if (Capacitor.getPlatform() !== 'ios') return null;
    if (Purchases) return Purchases;

    try {
        const module = await import('@revenuecat/purchases-capacitor');
        Purchases = module.Purchases;
        return Purchases;
    } catch (e) {
        console.error("Error loading RevenueCat SDK", e);
        return null;
    }
};

export const initializeIAP = async () => {
    const p = await loadRevenueCat();
    if (p) {
        try {
            await p.configure({ apiKey: "appl_uhitnXmAVGjaBgGgeolgvaTNffP" });
            console.log("RevenueCat configured successfully");
        } catch (e) {
            console.error("RevenueCat configuration failed", e);
        }
    }
};

export const getRevenueCatOfferings = async () => {
    const p = await loadRevenueCat();
    if (p) {
        try {
            return await p.getOfferings();
        } catch (e) {
            console.error("Error getting offerings", e);
        }
    }
    return null;
};

export const purchaseRevenueCatPackage = async (pkg) => {
    const p = await loadRevenueCat();
    if (p) {
        return await p.purchasePackage(pkg);
    }
    throw new Error("RevenueCat not initialized or not supported");
};
