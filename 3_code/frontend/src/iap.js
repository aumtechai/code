// IAP functionality removed - App is strictly University Licensed / Free.
export const initializeIAP = async () => {
    return true;
};

export const getRevenueCatOfferings = async () => {
    return { current: { availablePackages: [] } };
};

export const purchaseRevenueCatPackage = async (pkg) => {
    return { customerInfo: { entitlements: { active: {} } } };
};

export const restorePurchases = async () => {
    return { customerInfo: { entitlements: { active: {} } } };
};
