import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import iphoneLogo from '../assets/iphone_logo.jpg';
import './PublicLayout.css';

const PublicLayout = ({ children, onBack, backLabel = '← Back', backUrl = '/login' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
    <div className="pub-layout">
        {/* ── HEADER ── */}
        <header className="pub-header">
            <Link to="/" className="pub-logo-link">
                <img src={iphoneLogo} alt="Aura" className="pub-logo-img" style={{ borderRadius: '8px', objectFit: 'cover' }} />
                <div className="pub-logo-text">
                    <span className="pub-logo-name">Aura</span>
                    <span className="pub-logo-tag" style={{ display: 'none' }}>Your Campus Co-Pilot</span>
                </div>
            </Link>
            <nav className="pub-nav">
                <Link to="/architecture">Platform</Link>
                <Link to="/features/student-planner">Solutions</Link>
                <Link to="/security">Security</Link>
                <Link to="/publications/ednex">Publications</Link>
                <Link to="/about">Company</Link>
            </nav>
            <div className="pub-header-actions">
                <Link to={backUrl} className="pub-back-btn desktop-only" onClick={onBack}>
                    {backLabel}
                </Link>
                <Link to="/login" className="pub-cta-btn desktop-only">Sign In</Link>
                <button 
                    className="mobile-menu-toggle" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>

        {isMobileMenuOpen && (
            <div className="mobile-nav-overlay" style={{ background: 'white', padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/architecture" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Platform</Link>
                <Link to="/features/student-planner" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Solutions</Link>
                <Link to="/security" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Security</Link>
                <Link to="/publications/ednex" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Publications</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Company</Link>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
            </div>
        )}

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
                <Link to="/publications/ednex">Publications</Link>
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
};

export default PublicLayout;
