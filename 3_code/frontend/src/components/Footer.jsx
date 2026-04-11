import React from 'react';
import { Link } from 'react-router-dom';
import logoAsset from '../assets/logo.png';

const Footer = () => {
    return (
        <footer style={{ 
            backgroundColor: 'transparent', 
            padding: '1rem 4rem', 
            borderTop: '1px solid rgba(0,0,0,0.05)', 
            fontFamily: "'Inter', sans-serif", 
            color: '#6b7280', 
            width: '100%', 
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: '600', color: '#111827' }}>© 2026 Aura</span>
                <span style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e5e7eb', fontWeight: '600' }}>🔒 SOC 2</span>
                    <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e5e7eb', fontWeight: '600' }}>🛡️ FERPA</span>
                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', border: '1px solid #c7d2fe', fontWeight: '600' }}>🏥 HIPAA</span>
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/features/student-planner" className="footer-nav-link-bottom">Student Planner</Link>
                <Link to="/features/at-risk-prediction" className="footer-nav-link-bottom">At-Risk</Link>
                <Link to="/architecture" className="footer-nav-link-bottom">Platform</Link>
                <Link to="/about" className="footer-nav-link-bottom">Company</Link>
                <Link to="/careers" className="footer-nav-link-bottom">Careers</Link>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Link to="/support" className="footer-nav-link-bottom">Ethics Hotline</Link>
                <Link to="/privacy" className="footer-nav-link-bottom">Privacy Policy</Link>
                <Link to="/msa" className="footer-nav-link-bottom">MSA</Link>
                <Link to="/sla" className="footer-nav-link-bottom">SLA</Link>
            </div>

            <style>{`
                .footer-nav-link-bottom {
                    text-decoration: none;
                    color: #6b7280;
                    font-weight: 500;
                    transition: color 0.15s ease-in-out;
                }
                .footer-nav-link-bottom:hover {
                    color: #111827;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
