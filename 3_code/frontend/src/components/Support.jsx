import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import PublicLayout from './PublicLayout';
import logo from '../assets/logo.png';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid #e2e8f0', padding: '1.5rem 0' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
            >
                <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>{question}</span>
                {isOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
            </button>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    style={{ overflow: 'hidden', marginTop: '1rem', color: '#64748b', lineHeight: '1.6' }}
                >
                    {answer}
                </motion.div>
            )}
        </div>
    );
};

const Support = ({ onBack }) => {
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <PublicLayout onBack={onBack || (() => window.history.back())}>
        <div style={{ background: '#faf7f2', flex: 1 }}>

            {/* Standardized Hero */}
            <div className="hero-full-bleed" style={{ alignItems: 'flex-start' }}>
                <div className="hero-full-bleed-spacer"></div>
                <div className="hero-full-bleed-content hero-full-bleed-content-1000" style={{ paddingTop: '1rem' }}>
                    <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Aura · Support</span>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: '1.1', color: '#0f172a', margin: '0 0 1rem 0' }}>Support Center</h1>
                    <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.7', maxWidth: '560px', margin: 0 }}>We're here to support your academic journey. Browse FAQs or reach our team directly.</p>
                </div>
                <div className="hero-full-bleed-logo-wrap">
                    <img src={logo} alt="Aumtech Logo" className="hero-full-bleed-logo" />
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '2rem auto 0', padding: '0 2rem 4rem' }}>

                {/* How can we help */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' }}>How can we help you?</h2>
                </div>

                {/* Contact Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ background: '#eef2ff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Mail size={24} color="#4f46e5" />
                        </div>
                        <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Email Support</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>Get a response within 24 hours.</p>
                        <a href="mailto:support@aumtech.ai" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>support@aumtech.ai</a>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ background: '#f0fdf4', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <MessageCircle size={24} color="#10b981" />
                        </div>
                        <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Chat with AI</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>Instant answers from Aura.</p>
                        <button onClick={() => window.location.href = '/dashboard'} style={{ border: 'none', background: 'none', color: '#10b981', fontWeight: '600', cursor: 'pointer' }}>Open Get Aura</button>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ background: '#fff7ed', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Phone size={24} color="#f59e0b" />
                        </div>
                        <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Office Hours</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>Phone support coming soon.</p>
                        <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem' }}>Aura Voice AI Integration in Progress</span>
                    </div>
                </div>

                {/* FAQ Section */}
                <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '4rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HelpCircle color="#4f46e5" /> Frequently Asked Questions
                    </h3>
                    <FAQItem
                        question="How does Aura help me?"
                        answer="Aura uses Academic Intelligence to analyze your academic profile, syllabi, and goals. It can suggest study plans, explain complex concepts, and guide you through administrative processes."
                    />
                    <FAQItem
                        question="Is my academic data secure?"
                        answer="Absolutely. We use enterprise-grade encryption to protect all your data. Your academic records are only used to provide you with personalized recommendations."
                    />
                    <FAQItem
                        question="How is my course data updated?"
                        answer="Your academic data, including courses and grades, is securely synchronized directly from your institution's EdNex Data Warehouse. You can click 'Refresh EdNex Data' in your Courses view to fetch the latest updates."
                    />
                    <FAQItem
                        question="How do I resolve a hold on my account?"
                        answer="Navigate to the 'Holds & Alerts' section. There you'll find a detailed explanation of each hold and specific actions you can take to resolve them."
                    />
                </div>

                {/* Contact Form */}
                <div style={{ background: '#1e293b', padding: '3rem', borderRadius: '24px', color: 'white' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ background: '#10b981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <MessageCircle size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Message Sent!</h3>
                            <p style={{ color: '#94a3b8' }}>Thank you for reaching out. A student success specialist will contact you shortly.</p>
                            <button onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Send another message</button>
                        </div>
                    ) : (
                        <>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>Send us a message</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#94a3b8' }}>Name</label>
                                        <input required type="text" placeholder="Your name" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#94a3b8' }}>Email</label>
                                        <input required type="email" placeholder="Your email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#94a3b8' }}>Subject</label>
                                    <select style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                                        <option>Technical Issue</option>
                                        <option>Academic Advice</option>
                                        <option>Financial Aid Question</option>
                                        <option>Feedback</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#94a3b8' }}>Message</label>
                                    <textarea required rows="4" placeholder="How can we help you today?" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'none' }}></textarea>
                                </div>
                                <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Send Message</button>
                            </form>
                        </>
                    )}
                </div>

                {/* Footer Disclaimer */}
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <p>© 2026 Aura | Academic Intelligence. All rights reserved.</p>
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                        <a href="https://www.aumtech.ai/support" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>Official Support URL: https://www.aumtech.ai/support</a>
                    </div>
                </div>
            </div>
        </div>
        </PublicLayout>
    );
};

export default Support;
