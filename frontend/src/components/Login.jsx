import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
        const payload = isRegistering
            ? { email, password_hash: password, full_name: fullName }
            : new URLSearchParams({ username: email, password: password });

        try {
            const config = isRegistering ? {} : { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
            const response = await api.post(endpoint, payload, config);

            if (!isRegistering) {
                localStorage.setItem('token', response.data.access_token);
                navigate('/dashboard');
            } else {
                alert("Registration successful! Please login.");
                setIsRegistering(false);
            }
        } catch (error) {
            alert("Authentication failed: " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="login-wrapper" style={{
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            {/* Left side – hero illustration and tagline */}
            <div className="login-hero" style={{
                flex: 1,
                maxWidth: '560px',
                marginRight: '2rem',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1.5rem'
            }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                }}>Student Success Navigator</h1>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6', opacity: 0.9 }}>
                    Your personal AI‑powered academic companion –
                    <br />
                    track grades, book tutoring, check‑in on wellness, and get instant AI advice.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                        Real‑time GPA & course tracker
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 21-9-4-9 4 9-21z" /></svg>
                        AI chat for instant academic help
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
                        Wellness check‑ins & personalized resources
                    </li>
                </ul>
            </div>

            {/* Right side – glass‑morphism login form */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{
                    padding: '3rem',
                    width: '100%',
                    maxWidth: '480px',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        boxShadow: '0 4px 20px rgba(83, 91, 242, 0.4)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {isRegistering ? 'Create your account' : 'Sign in'}
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                        {isRegistering ? 'Join the community' : 'Welcome back!'}
                    </p>
                </div>
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {isRegistering && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>Full Name</label>
                            <input
                                type="text"
                                placeholder="Alex Johnson"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required={isRegistering}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>University Email</label>
                        <input
                            type="email"
                            placeholder="student@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                        {isRegistering ? 'Get Started' : 'Sign In'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? (
                            <span>Already have an account? <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign in</span></span>
                        ) : (
                            <span>Don't have an account? <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign up</span></span>
                        )}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
