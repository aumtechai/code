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
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            
            {/* Transparent Fixed Header */}
            <header className="landing-header">
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', fontSize: '1.5rem', color: '#111827', textDecoration: 'none' }}>
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

            <div className="login-main">
                {/* Left side – hero illustration and tagline */}
                <div className="login-hero">
                    <img src={logoAsset} alt="Aura Logo Large" className="hero-logo" />

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
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4b5563', marginBottom: '2.5rem' }}>
                        Unify structured SIS data and unstructured academic content into a single sovereign knowledge graph. Aura empowers students, faculty, and administrators with proactive, compliant AI workflows.
                    </p>
                    
                    {/* Bullet List for features */}
                    <ul className="bullet-list">
                        <li className="bullet-item">
                            <div className="bullet-icon">S</div>
                            <div className="bullet-content">
                                <h3>Student Companion</h3>
                                <p>Track real-time GPAs across courses, automate tutoring requests, and receive contextual guidance fueled by EdNex and Canvas data logs.</p>
                            </div>
                        </li>
                        <li className="bullet-item">
                            <div className="bullet-icon">F</div>
                            <div className="bullet-content">
                                <h3>Faculty Toolkit</h3>
                                <p>Identify falling engagement natively, parse syllabi into structured timelines, and curate specialized interventions.</p>
                            </div>
                        </li>
                        <li className="bullet-item">
                            <div className="bullet-icon">A</div>
                            <div className="bullet-content">
                                <h3>Administrative Hub</h3>
                                <p>Analyze university-wide trends while guaranteeing air-gapped FERPA and HIPAA compliance seamlessly.</p>
                            </div>
                        </li>
                        <li className="bullet-item">
                            <div className="bullet-icon">P</div>
                            <div className="bullet-content">
                                <h3>Secure Architecture</h3>
                                <p>PII scrubbing is handled natively on local infrastructures before cloud inferences, preserving total sovereignty.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Right side – login form */}
                <div className="login-panel-container">
                    <div className="ambient-glow"></div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="glass-panel"
                    >
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <h1 style={{ 
                                fontSize: '1.75rem', 
                                fontWeight: '800', 
                                margin: '0', 
                                color: '#111827' 
                            }}>
                                {isRegistering ? 'Create Account' : 'Secure Portal'}
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: '500' }}>
                                Access your unified academic dashboard
                            </p>
                        </div>

                        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {isRegistering && (
                                <div>
                                    <label htmlFor="fullName" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>Full Name</label>
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
                                <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>Institutional Email</label>
                                <input
                                    id="email"
                                    name="username"
                                    type="email"
                                    placeholder="admin@aumtech.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="off"
                                    className="login-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="off"
                                    className="login-input"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="login-button">
                                {loading ? "Processing..." : (isRegistering ? "Create Account" : "Authenticate")}
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>or continue with</span>
                                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        console.log('Login Failed');
                                        alert("Google Login Failed");
                                    }}
                                    useOneTap
                                    theme="outline"
                                    text="continue_with"
                                    shape="rectangular"
                                    width="100%"
                                />
                            </div>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500', margin: 0 }} onClick={() => setIsRegistering(!isRegistering)}>
                                {isRegistering ? (
                                    <span>Already have an account? <span style={{ color: '#4f46e5', fontWeight: '700' }}>Sign in</span></span>
                                ) : (
                                    <span>Don't have an account? <span style={{ color: '#4f46e5', fontWeight: '700' }}>Sign up</span></span>
                                )}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
