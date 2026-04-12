import React from 'react';
import PublicLayout from '../PublicLayout';

const LegalPage = ({ title, onBack, children }) => (
    <PublicLayout onBack={onBack || (() => window.history.back())}>
        <div style={{ background: '#faf7f2', flex: 1, padding: '3rem 2rem' }}>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4f46e5', marginBottom: '0.6rem' }}>Aura · Legal</span>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.04em', color: '#0f172a', marginBottom: '2rem' }}>{title}</h1>
                <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2.5rem', lineHeight: '1.8', color: '#334155', fontSize: '0.95rem' }}>
                    {children}
                </div>
            </div>
        </div>
    </PublicLayout>
);

export default LegalPage;
