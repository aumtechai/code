import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import logoAsset from '../assets/logo.png';


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
        <div className="login-wrapper">
            {/* Left side – hero illustration and tagline */}
            <div className="login-hero">
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                }}>Aura | Student Success AI</h1>
                <h2 style={{ color: '#a5b4fc', fontSize: '1.5rem', marginTop: '-0.5rem', marginBottom: '1.5rem', fontWeight: '600' }}>
                    Powered by AI Agents
                </h2>
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
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        AI chat for instant academic help
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                        Wellness check‑ins & personalized resources
                    </li>
                </ul>
            </div>

            {/* Right side – glass‑morphism login form */}
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
                        {isRegistering ? 'Join the Student Success AI community' : 'Welcome back to Aura'}
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
    );
};

export default Login;
