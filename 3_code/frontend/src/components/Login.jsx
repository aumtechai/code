import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import logoAsset from '../assets/logo.png';
import Footer from './Footer';

import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const response = await api.post('/api/auth/google', {
                credential: credentialResponse.credential
            });
            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (error) {
            console.error("Google Auth Error:", error);
            alert("Google Sign-In failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
        const payload = isRegistering
            ? { email, password_hash: password, full_name: fullName }
            : new URLSearchParams({ username: email, password: password });

        setLoading(true);
        try {
            const config = isRegistering ? {} : { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
            const response = await api.post(endpoint, payload, config);

            if (isRegistering) {
                // Auto-login after registration
                const loginPayload = new URLSearchParams({ username: email, password: password });
                const loginResponse = await api.post('/api/auth/login', loginPayload, { 
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
                });
                localStorage.setItem('token', loginResponse.data.access_token);
                navigate('/dashboard');
            } else {
                localStorage.setItem('token', response.data.access_token);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Auth Error:", error);
            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string' ? detail : "Authentication failed. Please check your credentials.";
            
            // User-friendly error message
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(to bottom, #fffaf0 0%, #ffffff 40%)' }}>
            
            {/* Transparent Fixed Header */}
            <header className="landing-header">
                <a href="/" className="logo-wrapper">
                    <img src={logoAsset} alt="Aura Logo" style={{ width: '32px', height: '32px' }} />
                    Aura
                </a>
                <nav>
                    <a href="/architecture">Platform</a>
                    <a href="/features/student-planner">Solutions</a>
                    <a href="/privacy">Security</a>
                    <a href="/about">Company</a>
                </nav>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <a href="#" style={{ textDecoration: 'none', color: '#111827', fontWeight: '600', fontSize: '0.95rem' }} onClick={(e) => e.preventDefault()}>Log In</a>
                    <button className="header-btn">Get Started</button>
                </div>
            </header>

            <div className="login-wrapper">
                {/* Ambient glow in background */}
                <div className="ambient-glow"></div>

                {/* Left side – hero illustration and tagline */}
                <div className="login-hero">
                    <h1 style={{
                        fontSize: '4.5rem',
                        fontWeight: '800',
                        color: '#111827',
                        lineHeight: '1.1',
                        letterSpacing: '-0.04em',
                        margin: 0
                    }}>Aura</h1>
                    <h2 style={{ 
                        fontSize: '2rem', 
                        background: 'linear-gradient(90deg, #4f46e5, #fbbf24)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginTop: '0.5rem', 
                        marginBottom: '1.5rem', 
                        fontWeight: '700' 
                    }}>
                        Your Campus Co-Pilot
                    </h2>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#4b5563', marginBottom: '3.5rem', maxWidth: '650px' }}>
                        Unify structured SIS data and unstructured academic content into a single sovereign knowledge graph. Aura empowers students, faculty, and administrators with proactive, compliant AI workflows.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', color: '#1f2937', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                                <span style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', color: '#4f46e5' }}>S</span> Student Companion
                            </h3>
                            <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>Track real-time GPAs across courses, automate tutoring requests, and receive contextual guidance fueled by EdNex.</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', color: '#1f2937', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                                <span style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', color: '#4f46e5' }}>A</span> Admin Hub
                            </h3>
                            <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>Analyze university-wide trends while guaranteeing air-gapped FERPA and HIPAA compliance seamlessly.</p>
                        </div>
                    </div>
                </div>

                {/* Right side – login form */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="glass-panel"
                    >
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem auto',
                        position: 'relative'
                    }}>
                        {/* Soft glow behind logo */}
                        <div style={{ 
                            position: 'absolute', 
                            width: '140px', 
                            height: '140px', 
                            background: 'rgba(99, 102, 241, 0.3)', 
                            filter: 'blur(40px)', 
                            borderRadius: '50%',
                            zIndex: -1 
                        }}></div>
                        
                        <img 
                            src={logoAsset} 
                            alt="Logo" 
                            className="logo-img"
                            style={{ 
                                width: '240px', 
                                height: 'auto',
                                filter: 'drop-shadow(0px 12px 24px rgba(0,0,0,0.5))', 
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }} 
                        />
                    </div>

                    <h1 style={{ 
                        fontSize: '2.25rem', 
                        fontWeight: '800', 
                        margin: '0', 
                        letterSpacing: '-0.03em',
                        background: 'linear-gradient(to bottom, #fff 30%, #94a3b8 100%)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent' 
                    }}>
                        {isRegistering ? 'Create Account' : 'Sign In'}
                    </h1>
                    <p style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '1rem', marginTop: '0.5rem', fontWeight: '500' }}>
                        {isRegistering ? 'Join Aura' : 'Welcome back to Aura'}
                    </p>
                </div>
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {isRegistering && (
                        <div>
                            <label htmlFor="fullName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>Full Name</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Alex Johnson"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required={isRegistering}
                                autoComplete="name"
                                className="login-input"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>University Email</label>
                        <input
                            id="email"
                            name="username"
                            type="email"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="off"
                            className="login-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="off"
                            className="login-input"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? "Processing..." : (isRegistering ? "Create Account" : "Sign In")}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log('Login Failed');
                                alert("Google Login Failed");
                            }}
                            useOneTap
                            theme="filled_blue"
                            shape="pill"
                            width="100%"
                        />
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }} onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? (
                            <span>Already have an account? <span style={{ color: '#6366f1', fontWeight: '700' }}>Sign in</span></span>
                        ) : (
                            <span>Don't have an account? <span style={{ color: '#6366f1', fontWeight: '700' }}>Sign up</span></span>
                        )}
                    </p>
                </div>
            </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
