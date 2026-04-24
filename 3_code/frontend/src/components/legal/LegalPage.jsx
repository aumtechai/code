import React, { useEffect } from 'react';
import PublicLayout from '../PublicLayout';
import logo from '../../assets/logo.png';

const LegalPage = ({ title, subtitle, eyebrow = 'Aura · Legal', onBack, children }) => {
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
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2.5rem', lineHeight: '1.8', color: '#334155', fontSize: '0.95rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    {children}
                </div>
            </div>
        </div>
    </PublicLayout>
);

};

export default LegalPage;
