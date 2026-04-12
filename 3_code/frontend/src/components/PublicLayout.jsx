import React from 'react';
import { Link } from 'react-router-dom';
import logoAsset from '../assets/logo.png';
import './PublicLayout.css';

const PublicLayout = ({ children, onBack, backLabel = '← Back' }) => (
    <div className="pub-layout">
        {/* ── HEADER ── */}
        <header className="pub-header">
            <Link to="/" className="pub-logo-link">
                <img src={logoAsset} alt="Aura" className="pub-logo-img" />
                <div className="pub-logo-text">
                    <span className="pub-logo-name">Aura</span>
                    <span className="pub-logo-tag">Your Campus Co-Pilot</span>
                </div>
            </Link>
            <nav className="pub-nav">
                <Link to="/architecture">Platform</Link>
                <Link to="/features/student-planner">Solutions</Link>
                <Link to="/privacy">Security</Link>
                <Link to="/about">Company</Link>
            </nav>
            <div className="pub-header-actions">
                <Link to="/login" className="pub-back-btn">
                    {backLabel}
                </Link>
                <Link to="/login" className="pub-cta-btn">Sign In</Link>
            </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="pub-main">
            {children}
        </main>

        {/* ── FOOTER ── */}
        <footer className="pub-footer">
            <div className="pub-footer-left">
                <span>© 2026 Aura Academic Intelligence</span>
                <div className="pub-footer-badges">
                    <span className="pub-footer-badge">SOC 2</span>
                    <span className="pub-footer-badge">FERPA</span>
                    <span className="pub-footer-badge">HIPAA</span>
                </div>
            </div>

            <nav className="pub-footer-nav">
                <Link to="/features/student-planner">Student Planner</Link>
                <Link to="/features/at-risk-prediction">At-Risk</Link>
                <Link to="/architecture">Platform</Link>
                <Link to="/about">Company</Link>
                <Link to="/careers">Careers</Link>
            </nav>

            <nav className="pub-footer-nav">
                <Link to="/support">Ethics Hotline</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/msa">MSA</Link>
                <Link to="/sla">SLA</Link>
            </nav>
        </footer>
    </div>
);

export default PublicLayout;
