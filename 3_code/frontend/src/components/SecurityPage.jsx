import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Server, CheckCircle, Database } from 'lucide-react';
import PublicLayout from './PublicLayout';
import logo from '../assets/logo.png';

const SecurityPage = () => {
    useEffect(() => {
        document.title = "Security & Privacy | Aura";
        window.scrollTo(0, 0);
    }, []);

    return (
        <PublicLayout onBack={() => window.history.back()}>
            <div style={{ background: '#faf7f2', flex: 1 }}>
                
                {/* Hero Section */}
                <div className="hero-full-bleed">
                    <div className="hero-full-bleed-spacer"></div>
                    <div className="hero-full-bleed-content hero-full-bleed-content-1000">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'left' }}
                        >
                            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Security First</span>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.04em', lineHeight: '1.1', color: '#0f172a' }}>
                                Enterprise-Grade Security &amp; Privacy
                            </h1>
                            <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.7', maxWidth: '580px' }}>
                                Student data is sacred. Aura is built from the ground up to ensure absolute sovereignty, privacy, and regulatory compliance.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: '#e2e8f0', color: '#475569', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>SOC 2 Certified</div>
                                <div style={{ background: '#e2e8f0', color: '#475569', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>FERPA Compliant</div>
                                <div style={{ background: '#e2e8f0', color: '#475569', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>HIPAA Compliant</div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="hero-full-bleed-logo-wrap">
                        <img src={logo} alt="Aumtech Logo" className="hero-full-bleed-logo" />
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 2.5rem 6rem' }}>
                    
                    {/* Aura Intelligence Tiers */}
                    <div style={{ marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Aura Intelligence Tiers</h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                            To support varying security requirements, Aura offers two distinct intelligence deployment plans. Whether you prefer the scale of the cloud or the absolute privacy of an on-premise vault, your data remains secure.
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                            {/* Tier 1: Prism */}
                            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ padding: '12px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', color: '#4f46e5' }}>
                                        <Server size={28} />
                                    </div>
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Aura Prism</h3>
                                </div>
                                <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                    Cloud Intelligence powered by the Aura Privacy Gateway. Every request is stripped of Personally Identifiable Information (PII) before leaving the university perimeter.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                                        <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        Tokenized Data Processing (PII is stripped and replaced with temporary IDs)
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                                        <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        High-performance cloud LLM reasoning
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                                        <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        Zero PII leakage to LLM providers
                                    </li>
                                </ul>
                            </div>

                            {/* Tier 2: Vault */}
                            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
                                        <Lock size={28} />
                                    </div>
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Aura Vault</h3>
                                </div>
                                <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                    Private Academic Intelligence. Uses an in-house LLM hosted locally within the University VPC. Ultimate security for highly sensitive departments.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                                        <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        100% Data Sovereignty
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                                        <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        Real student data never leaves the campus network
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                                        <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        100% FERPA & HIPAA compliant by design
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Data Governance */}
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Data Governance & Architecture</h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                            Aura utilizes a hybrid data architecture engineered to protect student records. Our central staging platform (EdNex) is a multi-tenant cloud environment with strict boundaries.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ marginBottom: '1rem' }}><Shield size={24} color="#4f46e5" /></div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>Row-Level Security (RLS)</h4>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    Each institution's data is securely isolated via Tenant IDs and robust Row-Level Security inside our PostgreSQL structured database.
                                </p>
                            </div>
                            
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ marginBottom: '1rem' }}><Database size={24} color="#f59e0b" /></div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>End-to-End Encryption</h4>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    Data is fully encrypted in transit via 256-bit TLS and at rest within our Object Storage and Vector Databases.
                                </p>
                            </div>

                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ marginBottom: '1rem' }}><Lock size={24} color="#ec4899" /></div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>The Privacy Gateway</h4>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    Our proprietary gateway actively intercepts outbound LLM requests, masking identifiable markers with temporary identifiers.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
};

export default SecurityPage;
