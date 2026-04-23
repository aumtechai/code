import React from 'react';
import PublicLayout from '../PublicLayout';
import logo from '../../assets/logo.png';

const LegalPage = ({ title, onBack, children }) => (
    <PublicLayout onBack={onBack || (() => window.history.back())}>
        <div style={{ background: '#faf7f2', flex: 1 }}>
            <div className="hero-full-bleed" style={{ marginBottom: '2rem', alignItems: 'flex-start' }}>
                <div className="hero-full-bleed-spacer"></div>
                <div className="hero-full-bleed-content hero-full-bleed-content-1000" style={{ paddingTop: '1rem' }}>
                    <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4f46e5', marginBottom: '0.6rem' }}>Aura · Legal</span>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.04em', color: '#0f172a', margin: 0 }}>{title}</h1>
                </div>
                <div className="hero-full-bleed-logo-wrap">
                    <img src={logo} alt="Aumtech Logo" className="hero-full-bleed-logo" />
                </div>
            </div>
            
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2.5rem', paddingBottom: '3rem' }}>
                <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2.5rem', lineHeight: '1.8', color: '#334155', fontSize: '0.95rem' }}>
                    {children}
                </div>
            </div>
        </div>
    </PublicLayout>
);

export default LegalPage;
