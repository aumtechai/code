import React from 'react';
import AumtechAnimation from './AumtechAnimation';
import './ArchitecturePage.css';

const ArchitecturePage = () => {
    return (
        <div className="architecture-page">
            <header className="arch-header">
                <h1>Aumtech.ai Architecture</h1>
                <p>Internal Preview of the AI Engine & Ecosystem</p>
                <button className="back-btn" onClick={() => window.history.back()}>← Back</button>
            </header>
            <main className="arch-main">
                <AumtechAnimation />
            </main>
            <footer className="arch-footer">
                <p>© 2026 Aumtech AI. Confidential Architecture Diagram.</p>
            </footer>
        </div>
    );
};

export default ArchitecturePage;
