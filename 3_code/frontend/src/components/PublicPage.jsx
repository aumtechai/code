import React, { useEffect } from 'react';
import PublicLayout from './PublicLayout';
import logo from '../assets/logo.png';

const PublicPage = ({ title, eyebrow = 'Aura', subtitle, onBack }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
    <PublicLayout onBack={onBack || (() => window.history.back())}>
        <div style={{ background: '#faf7f2', flex: 1 }}>
            <div className="hero-full-bleed" style={{ alignItems: 'flex-start' }}>
                <div className="hero-full-bleed-spacer"></div>
                <div className="hero-full-bleed-content hero-full-bleed-content-1000" style={{ paddingTop: '1rem' }}>
                    <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>{eyebrow}</span>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: '1.1', color: '#0f172a', margin: '0 0 1rem 0' }}>{title}</h1>
                    {subtitle && <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.7', maxWidth: '560px', margin: 0 }}>{subtitle}</p>}
                </div>
                <div className="hero-full-bleed-logo-wrap">
                    <img src={logo} alt="Aumtech Logo" className="hero-full-bleed-logo" />
                </div>
            </div>
            <div style={{ maxWidth: '1000px', margin: '2rem auto 0', padding: '0 2.5rem 4rem' }}>
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '3rem 2.5rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>🔄</div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>Page Coming Soon</h2>
                    <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '0.95rem' }}>
                        We're working on the <strong>{title}</strong> page.<br />Please check back shortly.
                    </p>
                </div>
            </div>
        </div>
    </PublicLayout>
);

};

export default PublicPage;
