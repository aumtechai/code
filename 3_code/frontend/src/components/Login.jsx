import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoAsset from '../assets/logo.png';
import iphoneLogo from '../assets/iphone_logo.jpg';

import './Login.css';

const CheckIcon = () => (
    <svg className="feature-check" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="10" fill="rgba(99,102,241,0.18)"/>
        <path d="M6 10.5L8.5 13L14 7.5" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="8" cy="11" r="1" fill="currentColor"/>
    </svg>
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

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

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const response = await api.post('/api/auth/change-password', {
                email,
                old_password: oldPassword,
                new_password: newPassword
            });
            setSuccessMsg(response.data.message);
            // Reset fields
            setOldPassword('');
            setNewPassword('');
            setTimeout(() => setIsChangingPassword(false), 3000);
        } catch (error) {
            const detail = error.response?.data?.detail;
            setErrorMsg(typeof detail === 'string' ? detail : "Password change failed.");
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
        setErrorMsg('');
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
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">

            {/* === HEADER === */}
            <header className="landing-header">
                <a href="/" className="header-logo-link">
                    <img src={iphoneLogo} alt="Aura" style={{ borderRadius: '8px', objectFit: 'cover' }} />
                    Aura
                </a>
                <nav className="desktop-nav">
                    <Link to="/architecture">Platform</Link>
                    <Link to="/features/student-planner">Solutions</Link>
                    <Link to="/privacy">Security</Link>
                    <Link to="/publications/ednex">Publications</Link>
                    <Link to="/about">Company</Link>
                </nav>
                <div className="header-actions">
                    <button className="header-login-link desktop-only" onClick={() => {}}>Log In</button>
                    <button className="header-btn desktop-only">Get Started</button>
                    <button 
                        className="mobile-menu-toggle" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', alignItems: 'center', color: '#334155' }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div className="mobile-nav-overlay" style={{ background: 'white', padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 100 }}>
                    <Link to="/architecture" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Platform</Link>
                    <Link to="/features/student-planner" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Solutions</Link>
                    <Link to="/privacy" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Security</Link>
                    <Link to="/publications/ednex" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Publications</Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Company</Link>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />
                    <button onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600, background: 'none', border: 'none', textAlign: 'left', padding: 0, font: 'inherit', cursor: 'pointer' }}>Sign In</button>
                </div>
            )}

            {/* === MAIN SPLIT LAYOUT === */}
            <div className="login-main">

                {/* LEFT - Hero content */}
                <div className="login-hero">

                    {/* Brand block */}
                    <div className="hero-brand">
                        <div className="hero-brand-mark">
                            <img src={logoAsset} alt="Aura Logo" className="hero-brand-logo" />
                        </div>
                        <div className="hero-brand-content">
                            <div className="hero-brand-text">
                                <span className="hero-brand-eyebrow">Aura</span>
                                <span className="hero-brand-name">Your Campus Co-Pilot</span>
                            </div>
                            <p className="hero-description">
                                Unify structured SIS data and unstructured academic content into a single sovereign knowledge graph. Aura empowers students, faculty, and administrators with proactive, compliant AI workflows.
                            </p>
                        </div>
                    </div>

                    {/* 2×2 Feature Card Grid */}
                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-card-header">
                                <span className="feature-badge">S</span>
                                <h4>Student Companion</h4>
                            </div>
                            <p>Track real-time GPAs across courses, automate tutoring requests, access instant lecture voice note transcriptions, and receive contextual guidance fueled by EdNex and Canvas data logs.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-card-header">
                                <span className="feature-badge">F</span>
                                <h4>Faculty Toolkit</h4>
                            </div>
                            <p>Focus on teaching rather than administrative overhead. Identify falling engagement patterns natively, parse syllabi into structured timelines, and curate specialized interventions.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-card-header">
                                <span className="feature-badge">A</span>
                                <h4>Administrative Hub</h4>
                            </div>
                            <p>Analyze university-wide trends while guaranteeing air-gapped FERPA and HIPAA compliance. Seamless tracking mechanism to gauge retention and intervene predictively.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-card-header">
                                <span className="feature-badge">P</span>
                                <h4>Secure Architecture</h4>
                            </div>
                            <p>With Aura Vault &amp; Prism layers, sensitive PII scrubbing is natively handled on local infrastructures before executing complex cloud inferences, preserving total data sovereignty.</p>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="trust-row">
                        <span className="trust-badge">🔒 SOC 2 Compliant</span>
                        <span className="trust-badge">🛡️ FERPA</span>
                        <span className="trust-badge">🏥 HIPAA</span>
                        <span className="trust-badge">✓ EdNex Certified</span>
                    </div>
                </div>

                {/* RIGHT - Login panel, flush to right edge */}
                <div className="login-panel-container">
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="glass-panel"
                    >
                        {/* Mobile-only brand strip */}
                        <div className="mobile-brand-strip">
                            <div className="mobile-brand-mark">
                                <img src={logoAsset} alt="Aura" className="mobile-brand-logo" />
                            </div>
                            <div className="mobile-brand-text">
                                <span className="mobile-brand-eyebrow">Aura</span>
                                <span className="mobile-brand-tagline">Your Campus Co-Pilot</span>
                            </div>
                        </div>

                        <div className="login-header-block">
                            <h2>{isChangingPassword ? 'Update Password' : (isRegistering ? 'Create Account' : 'Secure Portal')}</h2>
                            <p>{isChangingPassword ? 'Securely refresh your campus credentials' : 'Access your unified academic dashboard'}</p>
                        </div>

                        {!isChangingPassword ? (
                            <form onSubmit={handleAuth}>
                                {isRegistering && (
                                    <div className="form-field">
                                        <label className="form-label" htmlFor="fullName">Full Name</label>
                                        <input
                                            id="fullName"
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

                                <div className="form-field">
                                    <label className="form-label" htmlFor="email">Institutional Email</label>
                                    <input
                                        id="email"
                                        name="username"
                                        type="email"
                                        placeholder=""
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        className="login-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.45rem' }}>
                                        <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                                        <div 
                                            className="forgot-password-link" 
                                            onClick={() => setIsChangingPassword(true)}
                                            style={{ margin: 0, color: 'var(--indigo-600)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Forgot password?
                                        </div>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder=""
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        className="login-input"
                                    />
                                </div>

                                <button type="submit" disabled={loading} className="login-button">
                                    {loading ? "Authenticating…" : "Authenticate →"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleChangePassword}>
                                <div className="form-field">
                                    <label className="form-label" htmlFor="reset-email">Institutional Email</label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="login-input"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label" htmlFor="old-pass">Current Password</label>
                                    <input
                                        id="old-pass"
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                        className="login-input"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label" htmlFor="new-pass">New Password</label>
                                    <input
                                        id="new-pass"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="login-input"
                                    />
                                </div>

                                <button type="submit" disabled={loading} className="login-button">
                                    {loading ? "Updating…" : "Update Password"}
                                </button>
                                
                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <span 
                                        className="forgot-password-link" 
                                        onClick={() => setIsChangingPassword(false)}
                                    >
                                        &larr; Back to Login
                                    </span>
                                </div>
                            </form>
                        )}

                        {errorMsg && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="login-error-container"
                            >
                                <div className="login-error-msg">{errorMsg}</div>
                                {!isRegistering && !isChangingPassword && (
                                    <button 
                                        type="button" 
                                        className="inline-reset-btn"
                                        onClick={() => setIsChangingPassword(true)}
                                    >
                                        Forgot or Change Password?
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {successMsg && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="login-success-msg"
                            >
                                {successMsg}
                            </motion.div>
                        )}

                        <div className="signup-toggle" onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering
                                ? <>Already have an account? <span>Sign in</span></>
                                : <>Don't have an account? <span>Sign up free</span></>
                            }
                        </div>

                        <div className="login-security-note">
                            <LockIcon />
                            256-bit TLS &nbsp;·&nbsp; FERPA-compliant &nbsp;·&nbsp; SOC 2 certified
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* === COMPACT FOOTER === */}
            <footer className="landing-footer">
                <div className="footer-left">
                    <span>© 2026 Aura Academic Intelligence</span>
                    <div className="footer-badges">
                        <span className="footer-badge">SOC 2</span>
                        <span className="footer-badge">FERPA</span>
                        <span className="footer-badge">HIPAA</span>
                    </div>
                </div>

                <nav className="footer-nav">
                    <Link to="/features/student-planner">Student Planner</Link>
                    <Link to="/features/at-risk-prediction">At-Risk</Link>
                    <Link to="/architecture">Platform</Link>
                    <Link to="/publications/ednex">Publications</Link>
                    <Link to="/about">Company</Link>
                    <Link to="/careers">Careers</Link>
                </nav>

                <nav className="footer-nav">
                    <Link to="/support">Ethics Hotline</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/msa">MSA</Link>
                    <Link to="/sla">SLA</Link>
                </nav>
            </footer>

        </div>
    );
};

export default Login;
