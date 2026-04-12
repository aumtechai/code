import React from 'react';
import AumtechAnimation from './AumtechAnimation';
import PublicLayout from './PublicLayout';
import './ArchitecturePage.css';

const ArchitecturePage = () => (
    <PublicLayout onBack={() => window.history.back()}>
        <div className="arch-content">
            <div className="arch-page-header">
                <span className="arch-eyebrow">Platform</span>
                <h1>Aumtech.ai Architecture</h1>
                <p>Internal preview of the AI engine &amp; institutional data ecosystem</p>
            </div>
            <div className="arch-diagram-wrapper">
                <AumtechAnimation />
            </div>
        </div>
    </PublicLayout>
);

export default ArchitecturePage;
