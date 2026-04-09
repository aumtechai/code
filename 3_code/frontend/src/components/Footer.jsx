import React from 'react';
import { Link } from 'react-router-dom';
import logoAsset from '../assets/logo.png';

const Footer = ({ onNavigate }) => {
    return (
        <div style={{ backgroundColor: '#ffffff', padding: '3rem 2rem', borderTop: '1px solid #e2e8f0', marginTop: 'auto', textAlign: 'center' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={logoAsset} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #e2e8f0', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.02em' }}>Aura</span>
                </div>

                {/* Centralized Links */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
                    <Link to="/about" style={{ textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }} className="footer-link">About</Link>
                    <Link to="/team" style={{ textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }} className="footer-link">Team</Link>
                    <Link to="/careers" style={{ textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }} className="footer-link">Careers</Link>
                    <Link to="/blog" style={{ textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }} className="footer-link">Blog</Link>
                    <Link to="/privacy" style={{ textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }} className="footer-link">Privacy</Link>
                    <Link to="/msa" style={{ textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }} className="footer-link">MSA</Link>
                    <Link to="/sla" style={{ textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }} className="footer-link">SLA</Link>
                    <Link to="/support" style={{ textDecoration: 'none', color: '#64748b', transition: 'color 0.2s' }} className="footer-link">Support</Link>
                </div>

                {/* Copyright */}
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    © 2026 Aura | Academic Intelligence. All rights reserved.
                </div>
            </div>
            <style>{`
                .footer-link:hover { color: #0f172a !important; text-decoration: underline !important; }
            `}</style>
        </div>
    );
};

export default Footer;
