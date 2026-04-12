import React from 'react';
import LegalPage from './LegalPage';

const MSA = ({ onBack }) => (
    <LegalPage title="Master Services Agreement" onBack={onBack}>
        <p><strong>Last Updated:</strong> January 1, 2026</p>
        <p style={{ marginTop: '1rem' }}>This Master Services Agreement ("Agreement") governs your use of the Aura platform.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>1. Services</h3>
        <p>We agree to provide access to the Aura platform, including its AI-driven insights, dashboard, and scheduling tools, subject to the terms of this Agreement.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>2. User Obligations</h3>
        <p>You agree to:</p>
        <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
            <li>Provide accurate information during registration.</li>
            <li>Maintain the confidentiality of your account credentials.</li>
            <li>Use the services only for lawful academic purposes.</li>
        </ul>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>3. Intellectual Property</h3>
        <p>All rights, title, and interest in the platform and its content (excluding your user data) remain with Aura Academic Intelligence.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>4. Termination</h3>
        <p>We reserve the right to suspend or terminate your access to the services if you violate any terms of this Agreement.</p>
    </LegalPage>
);

export default MSA;
