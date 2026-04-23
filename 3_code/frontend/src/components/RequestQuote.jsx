import React from 'react';
import PublicLayout from './PublicLayout';

const RequestQuote = () => {
    return (
        <PublicLayout backLabel="← Back to EdNex" backUrl="/publications/ednex">
            <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Implementation & Pricing</p>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.2 }}>Explore Pricing</h1>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>Get a tailored quote based on your institution's size, technical infrastructure, and specific module requirements.</p>
                </div>
                
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Quote request submitted successfully! An account executive will be in touch with pricing details.'); window.history.back(); }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Full Name</label>
                            <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Work Email</label>
                            <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Institution Name</label>
                            <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Student Population</label>
                                <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: 'white' }}>
                                    <option>Under 5,000</option>
                                    <option>5,000 - 15,000</option>
                                    <option>15,000 - 30,000</option>
                                    <option>30,000+</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Current SIS Platform</label>
                                <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: 'white' }}>
                                    <option>Ellucian Banner</option>
                                    <option>Workday Student</option>
                                    <option>Oracle PeopleSoft</option>
                                    <option>Other / Custom</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseOver={(e) => e.target.style.background = '#4338ca'}
                            onMouseOut={(e) => e.target.style.background = '#4f46e5'}>
                            Request Custom Quote
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
};

export default RequestQuote;
