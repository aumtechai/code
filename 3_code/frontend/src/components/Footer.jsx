import React from 'react';
import { Link } from 'react-router-dom';
import './PublicLayout.css';

const Footer = () => {
    return (
        <footer className="pub-footer" style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', background: 'transparent' }}>
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
    );
};

export default Footer;
