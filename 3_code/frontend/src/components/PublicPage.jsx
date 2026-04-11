import React from 'react';
import { ChevronLeft } from 'lucide-react';

const PublicPage = ({ title, onBack }) => (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
                onClick={onBack || (() => window.history.back())} 
                style={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    padding: '8px 16px',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer', 
                    color: '#475569',
                    fontWeight: '700',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    flexShrink: 0,
                    transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={e => e.currentTarget.style.background = 'white'}
            >
                <ChevronLeft size={20} strokeWidth={3} /> Back
            </button>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{title}</h1>
        </div>
        <div className="card-white" style={{ lineHeight: '1.6', color: '#334155', textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Page Coming Soon</h2>
            <p>We are currently working on the <strong>{title}</strong> page. Please check back later!</p>
        </div>
    </div>
);

export default PublicPage;
