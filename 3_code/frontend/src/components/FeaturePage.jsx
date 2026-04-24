import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, BookOpen, Clock, Bot, ArrowRight, BrainCircuit } from 'lucide-react';
import PublicLayout from './PublicLayout';
import logo from '../assets/logo.png';

const featureData = {
    'syllabus-scanner': {
        title: "AI Syllabus Scanner & Academic Planner",
        subtitle: "Instantly convert unstructured PDF syllabi into an organized, trackable schedule.",
        heroText: "Stop manually entering due dates. Aura extracts reading assignments, exam dates, and grading weights directly from your syllabus.",
        icon: <BookOpen size={36} color="#4f46e5" />,
        benefits: ["Automated Deadline Tracking", "Grade Weight Calculation", "Calendar Export"]
    },
    'wellness-check': {
        title: "Student Wellness & Burnout Prevention AI",
        subtitle: "Your mental health matters just as much as your GPA.",
        heroText: "Our Wellness Check AI analyzes your workload density and study habits, prompting you when it's time to take a break or access campus counseling.",
        icon: <ShieldCheck size={36} color="#10b981" />,
        benefits: ["Burnout Forecasting", "Guided Breathing", "Campus Resource Linking"]
    },
    'ai-tutor': {
        title: "24/7 AI Tutor & Concept Explainer",
        subtitle: "Never get stuck on an assignment at 2 AM again.",
        heroText: "The Student Success Navigator includes a context-aware AI tutor. Whether it's Calculus or Psychology, get step-by-step explanations.",
        icon: <Bot size={36} color="#f59e0b" />,
        benefits: ["Socratic Questioning", "Upload Class Notes", "Homework Help"]
    },
    'gpa-predictor': {
        title: "GPA Tracker & Academic Forecasting",
        subtitle: "Know exactly what you need on the final to get an A.",
        heroText: "Our GPA forecasting tool runs simulations based on your current grades, showing precisely what scores you need to hit your target GPA.",
        icon: <BrainCircuit size={36} color="#ec4899" />,
        benefits: ["What-If Scenarios", "Cumulative GPA Tracking", "Goal Setting"]
    }
};

const FeaturePage = () => {
    const { featureId } = useParams();
    const feature = featureData[featureId] || {
        title: "Get Aura | Intelligence for Higher Ed",
        subtitle: "AI-powered tools to optimize your college experience.",
        heroText: "Aura provides a full suite of autonomous tools to help you study smarter, not harder.",
        icon: <Clock size={36} color="#4f46e5" />,
        benefits: ["Time Management", "Academic Planning", "Focus Tracking"]
    };

    useEffect(() => {
        document.title = `${feature.title} | Aura`;
    }, [feature]);

    return (
        <PublicLayout onBack={() => window.history.back()}>
            <div style={{ background: '#faf7f2', flex: 1 }}>
                <div className="hero-full-bleed">
                    <div className="hero-full-bleed-spacer"></div>
                    
                    <div className="hero-full-bleed-content hero-full-bleed-content-1000">
                        {/* Hero Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'left' }}
                        >
                            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Solutions</span>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.04em', lineHeight: '1.1', color: '#0f172a' }}>
                                {feature.title}
                            </h1>
                            <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.7', maxWidth: '580px' }}>
                                {feature.subtitle}
                            </p>
                            <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '2.5rem', lineHeight: '1.7', maxWidth: '540px' }}>
                                {feature.heroText}
                            </p>
                            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '0.85rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
                                Access Dashboard <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>

                    <div className="hero-full-bleed-logo-wrap">
                        <img src={logo} alt="Aumtech Logo" className="hero-full-bleed-logo" />
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 2.5rem 4rem' }}>
                    {/* Benefit Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {feature.benefits.map((benefit, idx) => (
                            <div key={idx} style={{ background: 'white', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
                                    <div style={{ width: '12px', height: '12px', background: '#4f46e5', borderRadius: '50%' }} />
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{benefit}</h3>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginLeft: '1.6rem' }}>
                                    Powerful algorithms tuned for {benefit.toLowerCase()}, letting you focus purely on learning.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default FeaturePage;
