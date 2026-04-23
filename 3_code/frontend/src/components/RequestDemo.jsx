import React from 'react';
import PublicLayout from './PublicLayout';

const RequestDemo = () => {
    return (
        <PublicLayout backLabel="← Back to EdNex" backUrl="/publications/ednex">
            <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>See EdNex in Action</p>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.2 }}>Request a Live Demo</h1>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>Discover how Aura's EdNex platform can unify your student success data and empower your advising teams.</p>
                </div>
                
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Demo request submitted successfully! Our team will contact you shortly.'); window.history.back(); }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>First Name</label>
                                <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Last Name</label>
                                <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Work Email</label>
                            <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Institution / University</label>
                            <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Job Title / Role</label>
                            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: 'white' }}>
                                <option>Select a role...</option>
                                <option>Provost / VPAA</option>
                                <option>Dean / Department Chair</option>
                                <option>Director of Advising</option>
                                <option>Career Services Leadership</option>
                                <option>IT / Systems Administrator</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseOver={(e) => e.target.style.background = '#4338ca'}
                            onMouseOut={(e) => e.target.style.background = '#4f46e5'}>
                            Schedule My Demo
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
};

export default RequestDemo;
