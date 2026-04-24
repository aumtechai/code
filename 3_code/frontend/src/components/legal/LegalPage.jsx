import React, { useEffect } from 'react';
import PublicLayout from '../PublicLayout';
import logo from '../../assets/logo.png';

const LegalPage = ({ title, subtitle, eyebrow = 'Aura · Legal', onBack, children }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <PublicLayout onBack={onBack || (() => window.history.back())}>
            <div style={{ background: '#faf7f2', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* ── Two-column layout: left = branding, right = content ── */}
                <div style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.6fr',
                    gap: 0,
                    maxWidth: '1400px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '2.5rem 2.5rem 2rem',
                    alignItems: 'start',
                    boxSizing: 'border-box',
                }}>

                    {/* LEFT: hero branding */}
                    <div style={{ paddingRight: '3rem', position: 'sticky', top: '1.5rem' }}>
                        <span style={{
                            display: 'block', fontSize: '1.1rem', fontWeight: 800,
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            background: 'linear-gradient(135deg, #4f46e5, #ec4899)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            marginBottom: '1rem'
                        }}>{eyebrow}</span>

                        <h1 style={{
                            fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em',
                            lineHeight: '1.1', color: '#0f172a', margin: '0 0 1rem 0'
                        }}>{title}</h1>

                        {subtitle && (
                            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.7', margin: '0 0 2rem 0' }}>
                                {subtitle}
                            </p>
                        )}

                        {/* Logo */}
                        <img src={logo} alt="Aumtech Logo" style={{
                            maxWidth: '180px', width: '100%', height: 'auto',
                            borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            display: 'block'
                        }} />
                    </div>

                    {/* RIGHT: legal content, scrollable internally if needed */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        padding: '2rem 2.5rem',
                        lineHeight: '1.8',
                        color: '#334155',
                        fontSize: '0.93rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        maxHeight: 'calc(100vh - 140px)',
                        overflowY: 'auto',
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default LegalPage;
