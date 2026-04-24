import React, { useEffect } from 'react';
import PublicLayout from './PublicLayout';
import logo from '../assets/logo.png';

const CareersPage = ({ onBack }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <PublicLayout onBack={onBack || (() => window.history.back())}>
            <div style={{ background: '#faf7f2', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Two-column layout matching legal pages */}
                <div style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.6fr',
                    gap: 0,
                    maxWidth: '1400px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '2.5rem 2.5rem 2rem',
                    alignItems: 'start',
                    boxSizing: 'border-box',
                }}>

                    {/* LEFT: Sticky hero branding */}
                    <div style={{ paddingRight: '3rem', position: 'sticky', top: '1.5rem' }}>
                        <span style={{
                            display: 'block', fontSize: '1.1rem', fontWeight: 800,
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            background: 'linear-gradient(135deg, #4f46e5, #ec4899)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            marginBottom: '1rem'
                        }}>Aura · Careers</span>

                        <h1 style={{
                            fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em',
                            lineHeight: '1.1', color: '#0f172a', margin: '0 0 1rem 0'
                        }}>Join Our Team</h1>

                        <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.7', margin: '0 0 2rem 0' }}>
                            We're building the intelligence layer for student success. Come help us shape the future of higher education.
                        </p>

                        <img src={logo} alt="Aumtech Logo" style={{
                            maxWidth: '180px', width: '100%', height: 'auto',
                            borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            display: 'block'
                        }} />
                    </div>

                    {/* RIGHT: Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* No open positions banner */}
                        <div style={{
                            background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
                            padding: '2.5rem', textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #e0e7ff, #fce7f3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.25rem', fontSize: '1.75rem'
                            }}>💼</div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                                No Open Positions Right Now
                            </h2>
                            <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto' }}>
                                We're not actively hiring at the moment, but we're always growing. Check back soon — exciting roles are on the horizon.
                            </p>
                        </div>

                        {/* Why join us — 2x2 grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                { icon: '🎓', title: 'Mission-Driven', desc: 'Every line of code helps a student succeed, graduate on time, or find their career path.' },
                                { icon: '🤖', title: 'AI-First Culture', desc: 'We build with Gemini AI, vector databases, and modern LLM pipelines — cutting-edge every day.' },
                                { icon: '🏛️', title: 'EdTech Impact', desc: 'We work with higher education institutions and impact tens of thousands of students.' },
                                { icon: '🚀', title: 'Early-Stage Energy', desc: 'Join at the ground level, own your work, and grow fast with a tight-knit expert team.' },
                            ].map(({ icon, title, desc }) => (
                                <div key={title} style={{
                                    background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0',
                                    padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{icon}</div>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>{title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Stay in touch CTA */}
                        <div style={{
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            borderRadius: '16px', padding: '1.75rem 2rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'
                        }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: '0 0 0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stay Connected</p>
                                <p style={{ color: 'white', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                                    Send your résumé to <a href="mailto:careers@aumtech.ai" style={{ color: '#c4b5fd', textDecoration: 'none' }}>careers@aumtech.ai</a>
                                </p>
                            </div>
                            <a href="mailto:careers@aumtech.ai" style={{
                                background: 'white', color: '#4f46e5', padding: '0.6rem 1.25rem',
                                borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
                                textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0
                            }}>Get in Touch</a>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default CareersPage;
