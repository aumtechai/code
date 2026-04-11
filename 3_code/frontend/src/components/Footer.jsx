import React from 'react';
import { Link } from 'react-router-dom';
import logoAsset from '../assets/logo.png';

const Footer = ({ onNavigate }) => {
    return (
        <footer style={{ backgroundColor: '#ffffff', padding: '4rem 2rem 2rem 2rem', borderTop: '1px solid #e5e7eb', fontFamily: "'Inter', sans-serif", color: '#4b5563', width: '100%' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    
                    {/* Brand Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                            <img src={logoAsset} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #e2e8f0', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} />
                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>Aura</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#374151', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                🔒 SOC 2 Compliant
                            </span>
                            <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#374151', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                🛡️ FERPA
                            </span>
                            <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '4px', border: '1px solid #c7d2fe', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                🏥 HIPAA
                            </span>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>Solutions</h4>
                        <Link to="/features/student-planner" className="footer-nav-link">Student Planner</Link>
                        <Link to="/features/at-risk-prediction" className="footer-nav-link">At-Risk Prediction</Link>
                        <Link to="/features/syllabus-ai" className="footer-nav-link">Syllabus AI</Link>
                        <Link to="/features/progress-tracker" className="footer-nav-link">Progress Tracker</Link>
                        <Link to="/features/career-pathfinder" className="footer-nav-link">Career Pathfinder</Link>
                        <Link to="/features/financial-aid" className="footer-nav-link">Financial Aid Nexus</Link>
                    </div>

                    {/* Platform */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>Aura Platform</h4>
                        <Link to="/architecture" className="footer-nav-link">Aura Vault Strategy</Link>
                        <Link to="/architecture" className="footer-nav-link">Aura Prism Network</Link>
                        <Link to="/architecture" className="footer-nav-link">EdNex Data Lake</Link>
                        <Link to="/features/secure-llm" className="footer-nav-link">Secure LLM Proxy</Link>
                        <Link to="/features/data-sovereignty" className="footer-nav-link">Data Sovereignty</Link>
                        <Link to="/features/hipaa-ferpa" className="footer-nav-link">FERPA / HIPAA Compliant</Link>
                    </div>

                    {/* Company */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>Company</h4>
                        <Link to="/about" className="footer-nav-link">About</Link>
                        <Link to="/team" className="footer-nav-link">Partners</Link>
                        <Link to="/blog" className="footer-nav-link">News</Link>
                        <Link to="/blog" className="footer-nav-link">Awards</Link>
                        <Link to="/support" className="footer-nav-link">Contact</Link>
                        <Link to="/careers" className="footer-nav-link">Careers</Link>
                    </div>
                </div>

                {/* Divider & Bottom Row */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                        &copy; 2026 Aura Academic Intelligence. All rights reserved.
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem' }}>
                        <Link to="/support" className="footer-nav-link-bottom">Ethics Hotline</Link>
                        <Link to="/privacy" className="footer-nav-link-bottom">Privacy Policy</Link>
                        <Link to="/msa" className="footer-nav-link-bottom">MSA</Link>
                        <Link to="/sla" className="footer-nav-link-bottom">SLA</Link>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-nav-link {
                    text-decoration: none;
                    color: #64748b;
                    font-size: 0.95rem;
                    transition: color 0.15s ease-in-out;
                }
                .footer-nav-link:hover {
                    color: #4f46e5;
                    text-decoration: underline;
                }
                .footer-nav-link-bottom {
                    text-decoration: none;
                    color: #9ca3af;
                    font-weight: 500;
                    transition: color 0.15s ease-in-out;
                }
                .footer-nav-link-bottom:hover {
                    color: #4b5563;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
