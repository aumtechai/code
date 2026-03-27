import { ChevronLeft } from 'lucide-react';

const MSA = ({ onBack }) => (
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
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Master Services Agreement (MSA)</h1>
        </div>
        <div className="card-white" style={{ lineHeight: '1.6', color: '#334155' }}>
            <p><strong>Last Updated:</strong> January 1, 2026</p>
            <p>This Master Services Agreement ("Agreement") governs your use of the Get Aura platform.</p>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>1. Services</h3>
            <p>We agree to provide the access to the Get Aura platform, including its AI-driven insights, dashboard, and scheduling tools, subject to the terms of this Agreement.</p>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>2. User Obligations</h3>
            <p>You agree to:</p>
            <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Provide accurate information during registration.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Use the services only for lawful academic purposes.</li>
            </ul>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>3. Intellectual Property</h3>
            <p>All rights, title, and interest in the platform and its content (excluding your user data) remain with Aura AI.</p>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>4. Termination</h3>
            <p>We reserve the right to suspend or terminate your access to the services if you violate any terms of this Agreement.</p>
        </div>
    </div>
);

export default MSA;
