import React from 'react';
import PublicLayout from './PublicLayout';

const PublicPage = ({ title, onBack }) => (
    <PublicLayout onBack={onBack || (() => window.history.back())}>
        <div style={{ background: '#faf7f2', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '540px', width: '100%', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4f46e5', marginBottom: '1rem' }}>Aura</span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.04em', color: '#0f172a', marginBottom: '1rem' }}>{title}</h1>
                <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '3rem 2.5rem', marginTop: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>🔄</div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>Page Coming Soon</h2>
                    <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '0.95rem' }}>
                        We're working on the <strong>{title}</strong> page.<br />Please check back shortly.
                    </p>
                </div>
            </div>
        </div>
    </PublicLayout>
);

export default PublicPage;
