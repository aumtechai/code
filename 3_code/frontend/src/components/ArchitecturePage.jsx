import React from 'react';
import AumtechAnimation from './AumtechAnimation';
import PublicLayout from './PublicLayout';
import logo from '../assets/logo.png';
import './ArchitecturePage.css';

const ArchitecturePage = () => (
    <PublicLayout onBack={() => window.history.back()}>
        <div className="arch-content">
            <div className="hero-full-bleed" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
                <div className="hero-full-bleed-spacer"></div>
                <div className="hero-full-bleed-content hero-full-bleed-content-1000" style={{ textAlign: 'left', paddingTop: '1rem' }}>
                    <span className="arch-eyebrow" style={{ display: 'block', textAlign: 'left', marginBottom: '0.75rem', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform</span>
                    <h1 style={{ textAlign: 'left', margin: '0 0 1rem 0', fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: '1.1', color: '#0f172a' }}>Aumtech.ai Architecture</h1>
                    <p style={{ textAlign: 'left', margin: 0, fontSize: '1.15rem', color: '#475569', lineHeight: '1.7', maxWidth: '560px' }}>Internal preview of the AI engine &amp; institutional data ecosystem</p>
                </div>
                <div className="hero-full-bleed-logo-wrap">
                    <img src={logo} alt="Aumtech Logo" className="hero-full-bleed-logo" />
                </div>
            </div>
            <div className="arch-diagram-wrapper">
                <AumtechAnimation />
            </div>
        </div>
    </PublicLayout>
);

export default ArchitecturePage;
