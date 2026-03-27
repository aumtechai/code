import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => (
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
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Privacy Policy</h1>
        </div>
        <div className="card-white" style={{ lineHeight: '1.6', color: '#334155' }}>
            <p><strong>Effective Date:</strong> January 1, 2026</p>
            <p>At Aura, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>1. Information We Collect</h3>
            <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem' }}>
                <li><strong>Account Information:</strong> Name, email address, and student ID.</li>
                <li><strong>Academic Data:</strong> Courses, grades, and assignments securely provided via your institution's EdNex Data Warehouse.</li>
                <li><strong>Usage Data:</strong> Interactions with our AI features and chat logs.</li>
            </ul>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>2. How We Use Your Information</h3>
            <p>We use your data to:</p>
            <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Provide personalized academic insights and reminders.</li>
                <li>Facilitate tutoring and scheduling services.</li>
                <li>Improve our AI models and user experience.</li>
            </ul>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>3. Data Protection</h3>
            <p>We implement industry-standard security measures to encrypt and protect your data. We do not sell your personal information to third parties.</p>

            <h3 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>4. Contact Us</h3>
            <p>If you have questions about this policy, please contact support@aumtech.ai.</p>
        </div>
    </div>
);

export default PrivacyPolicy;
