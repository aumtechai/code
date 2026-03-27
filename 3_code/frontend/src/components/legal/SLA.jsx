import { ChevronLeft } from 'lucide-react';

const SLA = ({ onBack }) => (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {onBack && (
                <button 
                    onClick={onBack} 
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
            )}
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Service Level Agreement (SLA)</h1>
        </div>
        <div className="card-white" style={{ lineHeight: '1.6', color: '#334155' }}>
            <p><strong>Effective Date:</strong> January 1, 2026</p>
            <p>This Service Level Agreement defines the expected level of service for the Get Aura platform.</p>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>1. Uptime Commitment</h3>
            <p>We commit to maintaining a Service Availability of at least 99.5% during each calendar month, excluding scheduled maintenance.</p>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>2. Support Response Times</h3>
            <p>Our support team aims to respond to critical issues within 4 hours and non-critical inquiries within 24 hours during business days.</p>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>3. Scheduled Maintenance</h3>
            <p>We will provide at least 48 hours notice for any scheduled maintenance that may impact service availability. Maintenance will typically be performed during off-peak hours.</p>
        </div>
    </div>
);

export default SLA;
