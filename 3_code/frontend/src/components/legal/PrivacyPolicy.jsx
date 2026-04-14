import React from 'react';
import LegalPage from './LegalPage';

const PrivacyPolicy = ({ onBack }) => (
    <LegalPage title="Privacy Policy" onBack={onBack}>
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <p style={{ marginTop: '1rem' }}>At Aura, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>1. Information We Collect</h3>
        <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
            <li><strong>Account Information:</strong> Name, email address, and student ID.</li>
            <li><strong>Academic Data:</strong> Courses, grades, and assignments securely provided via your institution's EdNex Data Warehouse.</li>
            <li><strong>Usage Data:</strong> Interactions with our AI features and chat logs.</li>
        </ul>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>2. How We Use Your Information</h3>
        <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
            <li>Provide personalized academic insights and reminders.</li>
            <li>Facilitate tutoring and scheduling services.</li>
            <li>Improve our AI models and user experience.</li>
        </ul>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>3. Data Protection</h3>
        <p>We implement industry-standard security measures to encrypt and protect your data. We do not sell your personal information to third parties.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>4. Third-Party AI Services</h3>
        <p>Aura utilizes <strong>Google Gemini AI</strong> to provide real-time academic guidance and data analysis. When you interact with our AI agents, your chat queries and relevant academic context (such as your course list) are transmitted securely to Google. Google processes this information solely to generate responses for you and adheres to high standards of data protection and security. We do not use your data to train public AI models.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>5. Contact Us</h3>
        <p>If you have questions about this policy, please contact <a href="mailto:support@aumtech.ai" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>support@aumtech.ai</a>.</p>
    </LegalPage>
);

export default PrivacyPolicy;
