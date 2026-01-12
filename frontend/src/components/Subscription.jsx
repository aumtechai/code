import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, CreditCard } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { getRevenueCatOfferings, purchaseRevenueCatPackage } from '../iap';
import api from '../api';

const Subscription = ({ userData, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [debugOfferings, setDebugOfferings] = useState(null);
    const [debugError, setDebugError] = useState(null);

    // Improved Platform Detection
    const [platform, setPlatform] = useState('unknown');
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        // Determine platform safely on mount
        const p = Capacitor.getPlatform();
        const native = Capacitor.isNativePlatform();
        setPlatform(p);
        setIsNative(native);

        console.log(`Platform detected: ${p}, Native: ${native}`);

        const loadOfferings = async () => {
            if (native) {
                try {
                    const offerings = await getRevenueCatOfferings();
                    setDebugOfferings(offerings);

                    if (offerings && offerings.current && offerings.current.availablePackages.length > 0) {
                        setPackages(offerings.current.availablePackages);
                    } else {
                        setDebugError("Offerings fetched but empty or malformed. " + JSON.stringify(offerings));
                    }
                } catch (e) {
                    console.error("Error fetching RevenueCat offerings", e);
                    setDebugError(e.message || JSON.stringify(e));
                }
            }
        };
        loadOfferings();
    }, []);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            if (isNative) {
                // iOS / Android Native IAP
                if (packages.length > 0) {
                    try {
                        const { customerInfo } = await purchaseRevenueCatPackage(packages[0]);
                        if (customerInfo.entitlements.active['premium']) {
                            alert("Upgrade Successful! Welcome to Premium.");
                        }
                    } catch (purchaseError) {
                        alert("Purchase Error: " + purchaseError.message);
                        if (purchaseError.userCancelled) return;
                    }
                } else {
                    alert(`No available products. Packages: ${packages.length}. Debug Info: ${JSON.stringify(debugOfferings)}`);
                }
            } else {
                // Web Stripe Payment
                try {
                    const res = await api.post('/api/payments/create-checkout-session', { price_id: 'price_premium_monthly' });
                    if (res.data.url) {
                        window.location.href = res.data.url;
                    }
                } catch (webErr) {
                    alert("Web Payment Failed: " + (webErr.response?.status || webErr.message));
                }
            }
        } catch (err) {
            console.error("Payment/Purchase failed", err);
            alert("Error: " + (err.message || JSON.stringify(err)));
        } finally {
            setLoading(false);
        }
    };

    const subInfo = userData?.subscription_info || {};
    const isSubscribed = subInfo.status === 'active';
    const isTrial = subInfo.status === 'trialing';
    const isExpired = subInfo.status === 'expired';

    // Pricing Display Logic
    const displayPrice = (isNative && packages.length > 0) ? packages[0].product.priceString : "$9.99";

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>

            {/* DEBUG PANEL - TEMPORARY */}
            <div style={{ background: '#333', color: '#0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all' }}>
                <strong>IAP DEBUGGER v2</strong><br />
                Detected Platform: {platform}<br />
                Is Native: {isNative ? 'YES' : 'NO'}<br />
                Packages Found: {packages.length}<br />
                Status: {debugError ? <span style={{ color: 'red' }}>{debugError}</span> : 'OK'}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'inline-flex', padding: '8px 16px', background: '#e0e7ff', color: '#4338ca', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem' }}
                >
                    PREMIUM PLANS
                </motion.div>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Elevate Your Academic Journey
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                    Get unlimited access to the full AI suite and stay ahead of your academic goals.
                </p>
            </div>

            {isTrial && (
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '1.25rem', borderRadius: '16px', marginBottom: '2.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ background: '#3b82f6', color: 'white', padding: '6px', borderRadius: '50%' }}><Zap size={16} /></div>
                    <span style={{ color: '#0369a1', fontWeight: '700', fontSize: '1.1rem' }}>
                        Free Trial Active: {subInfo.days_left} days remaining. Upgrade now to avoid interruption!
                    </span>
                </div>
            )}

            {isExpired && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1.25rem', borderRadius: '16px', marginBottom: '2.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ background: '#ef4444', color: 'white', padding: '6px', borderRadius: '50%' }}><Shield size={16} /></div>
                    <span style={{ color: '#991b1b', fontWeight: '700', fontSize: '1.1rem' }}>
                        Your free trial has expired. Upgrade to Premium to continue using AI features.
                    </span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {/* Basic / Free */}
                <motion.div
                    whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    className="card-white"
                    style={{ position: 'relative', overflow: 'hidden', border: isTrial ? '2px solid #3b82f6' : '1px solid #e2e8f0' }}
                >
                    {isTrial && (
                        <div style={{ position: 'absolute', top: '12px', right: '-35px', background: '#3b82f6', color: 'white', padding: '4px 40px', transform: 'rotate(45deg)', fontSize: '0.75rem', fontWeight: '800' }}>
                            CURRENT
                        </div>
                    )}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1e293b' }}>Explorer</h3>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Perfect for tracking your courses and basics.</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '3rem', fontWeight: '800', color: '#1e293b' }}>$0</span>
                            <span style={{ color: '#64748b', fontWeight: '600' }}>/ 7 days</span>
                        </div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#475569' }}><Check size={20} color="#10b981" /> Course Tracking</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#475569' }}><Check size={20} color="#10b981" /> Basic Study Tools</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#475569' }}><Check size={20} color="#10b981" /> Community Access</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#94a3b8' }}><Check size={20} color="#e2e8f0" /> Limited AI Navigator</li>
                    </ul>
                    <button disabled style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', fontWeight: '700', fontSize: '1.1rem' }}>
                        {isTrial ? 'Trial in Progress' : 'Trial Ended'}
                    </button>
                </motion.div>

                {/* Premium */}
                <motion.div
                    whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
                    className="card-white"
                    style={{ border: '2px solid #4f46e5', position: 'relative', background: 'white' }}
                >
                    <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(to right, #4f46e5, #9333ea)', color: 'white', padding: '6px 20px', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '700', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)' }}>
                        MOST POPULAR
                    </div>
                    {isSubscribed && (
                        <div style={{ position: 'absolute', top: '12px', right: '-35px', background: '#10b981', color: 'white', padding: '4px 40px', transform: 'rotate(45deg)', fontSize: '0.75rem', fontWeight: '800' }}>
                            ACTIVE
                        </div>
                    )}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1e293b' }}>Success Pass</h3>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Unlock the full power of Academic AI.</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '3.5rem', fontWeight: '800', color: '#1e293b' }}>{displayPrice}</span>
                            <span style={{ color: '#64748b', fontWeight: '600' }}>/ month</span>
                        </div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', fontWeight: '600', color: '#1e293b' }}><Star size={20} fill="#f59e0b" color="#f59e0b" /> Unlimited AI Navigator</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', fontWeight: '600', color: '#1e293b' }}><Star size={20} fill="#f59e0b" color="#f59e0b" /> Unlimited Syllabus Parsing</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#475569' }}><Check size={20} color="#4f46e5" /> Priority Tutoring Matching</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#475569' }}><Check size={20} color="#4f46e5" /> Advanced Career Pathfinder</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#475569' }}><Check size={20} color="#4f46e5" /> Ad-Free Experience</li>
                    </ul>

                    <button
                        onClick={handleSubscribe}
                        disabled={loading || isSubscribed}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            transition: 'all 0.2s',
                            opacity: loading || isSubscribed ? 0.7 : 1
                        }}
                    >
                        {loading ? (isNative ? 'Processing...' : 'Opening Stripe...') : isSubscribed ? 'Membership Active' : 'Upgrade to Premium'} <CreditCard size={20} />
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>Cancel anytime. No hidden fees.</p>
                </motion.div>
            </div>

            <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#4f46e5', display: 'inline-flex', padding: '12px', background: '#eef2ff', borderRadius: '16px', marginBottom: '1rem' }}><Zap size={28} /></div>
                    <h4 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Smart Automation</h4>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5' }}>Let AI handle your schedule and notes so you can focus on learning.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#4f46e5', display: 'inline-flex', padding: '12px', background: '#eef2ff', borderRadius: '16px', marginBottom: '1rem' }}><Shield size={28} /></div>
                    <h4 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Privacy First</h4>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5' }}>Your academic data is encrypted and never sold. You own your data.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#4f46e5', display: 'inline-flex', padding: '12px', background: '#eef2ff', borderRadius: '16px', marginBottom: '1rem' }}><CreditCard size={28} /></div>
                    <h4 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>University Partners</h4>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5' }}>Trusted by students at over 500 institutions worldwide.</p>
                </div>
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                    <span style={{ borderBottom: '1px solid #cbd5e1' }}>Continue with limited access</span>
                </button>
            </div>
        </div >
    );
};


export default Subscription;
