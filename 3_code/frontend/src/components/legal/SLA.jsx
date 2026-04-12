import React from 'react';
import LegalPage from './LegalPage';

const SLA = ({ onBack }) => (
    <LegalPage title="Service Level Agreement" onBack={onBack}>
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <p style={{ marginTop: '1rem' }}>This Service Level Agreement defines the expected level of service for the Aura platform.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>1. Uptime Commitment</h3>
        <p>We commit to maintaining a Service Availability of at least 99.5% during each calendar month, excluding scheduled maintenance.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>2. Support Response Times</h3>
        <p>Our support team aims to respond to critical issues within 4 hours and non-critical inquiries within 24 hours during business days.</p>

        <h3 style={{ marginTop: '1.75rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>3. Scheduled Maintenance</h3>
        <p>We will provide at least 48 hours notice for any scheduled maintenance that may impact service availability. Maintenance will typically be performed during off-peak hours.</p>
    </LegalPage>
);

export default SLA;
