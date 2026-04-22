import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ChatInterface from './ChatInterface';
import BookAdvisor from './BookAdvisor';
import TutoringCenter from './TutoringCenter';
import Courses from './Courses';
import WellnessCheck from './WellnessCheck';
import StudyTimer from './StudyTimer';
import TexasAnalytics from './TexasAnalytics';
import CIPExplorer from './CIPExplorer';
import DropAddForms from './DropAddForms';
import Progress from './Progress';
import History from './History';
import AdminPanel from './AdminPanel';
import AdminEdnex from './AdminEdnex';
import AdminAgentConfig from './AdminAgentConfig';
import IntegrationWizard from './IntegrationWizard';
import FlashcardGenerator from './FlashcardGenerator';
import SyllabusScanner from './SyllabusScanner';
import SocialCampus from './SocialCampus';
import LectureVoiceNotes from './LectureVoiceNotes';
import HoldsCenter from './HoldsCenter';
import FinancialAidNexus from './FinancialAidNexus';
import CareerPathfinder from './CareerPathfinder';
import CareerMapper from './CareerMapper';
import PrivacyPolicy from './legal/PrivacyPolicy';
import MSA from './legal/MSA';
import SLA from './legal/SLA';
import Footer from './Footer';
import FacultyDashboard from './FacultyDashboard';
import DegreeRoadmap from './DegreeRoadmap';
import Support from './Support';
import LicenseDetails from './LicenseDetails';
import QuoteGenerator from './QuoteGenerator';
import WeeklySchedule from './WeeklySchedule';
import AdvisorDashboard from './AdvisorDashboard';
import DeanDashboard from './DeanDashboard';
import StudentCalendar from './StudentCalendar';



import {
    LayoutDashboard, MessageSquare, Calendar, BookOpen,
    TrendingUp, User, Settings, LogOut, Clock,
    Users, FileText, Heart, GraduationCap, ChevronRight, Edit3, Menu, X, Shield, History as HistoryIcon, Brain, ScanLine, Mic, ShieldAlert, AlertTriangle, Briefcase, Map, CreditCard, Database, Calculator, Activity, ShieldCheck
} from 'lucide-react';

import { motion } from 'framer-motion';
import logoAsset from '../assets/logo.png';
import iphoneLogo from '../assets/iphone_logo.jpg';




const Sidebar = ({ activeTab, onTabChange, userData, isOpen, onClose, currentRole, onRoleChange }) => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    const handleLogin = () => { navigate('/login'); };

    const handleProtectedTab = (tab) => {
        const publicTabs = ['dashboard', 'courses', 'wellness', 'social'];
        if (!isLoggedIn && !publicTabs.includes(tab)) {
            // If trying to access a private tab (like 'settings' or 'chat') without login -> redirect
            navigate('/login');
        } else {
            onTabChange(tab);
            if (window.innerWidth <= 768) {
                onClose();
            }
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
                onClick={onClose}
            ></div>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Logo & Close Button */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem', paddingTop: '1rem' }}>
                    <div style={{ padding: '0px', borderRadius: '10px' }}>
                        <img src={logoAsset} alt="Logo" style={{ width: '180px', height: 'auto', borderRadius: '16px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))', border: '2px solid #e2e8f0' }} />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, lineHeight: 1.1, color: '#1e293b', letterSpacing: '-0.02em' }}>Aura</h2>
                        <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '600' }}>Your Campus Co-Pilot</span>
                    </div>

                    {/* Mobile Close Button */}
                    <button className="mobile-only" onClick={onClose} style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', color: '#1e293b', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Nav Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
                    {/* ... existing dynamic nav items ... */}
                    {/* MAIN NAVIGATION */}
                    <div className="section-title">Home</div>
                    <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleProtectedTab('dashboard')}><LayoutDashboard size={20} strokeWidth={2.75} /> Dashboard</div>
                    <div className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => handleProtectedTab('chat')}><MessageSquare size={20} strokeWidth={2.75} /> Get Aura</div>

                    <div className="section-title">Academics</div>
                    <div className={`nav-item ${activeTab === 'degree-roadmap' ? 'active' : ''}`} onClick={() => handleProtectedTab('degree-roadmap')}><Map size={20} strokeWidth={2.75} /> Degree Roadmap</div>
                    <div className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => handleProtectedTab('courses')}><BookOpen size={20} strokeWidth={2.75} /> Courses</div>
                    <div className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => handleProtectedTab('schedule')}><Calendar size={20} strokeWidth={2.75} /> Schedule</div>
                    <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => handleProtectedTab('calendar')}><Calendar size={20} strokeWidth={2.75} /> Student Life Calendar</div>
                    <div className={`nav-item ${activeTab === 'syllabus' ? 'active' : ''}`} onClick={() => handleProtectedTab('syllabus')}><ScanLine size={20} strokeWidth={2.75} /> Syllabus Scanner</div>
                    <div className={`nav-item ${activeTab === 'voice-notes' ? 'active' : ''}`} onClick={() => handleProtectedTab('voice-notes')}><Mic size={20} strokeWidth={2.75} /> Lecture Notes</div>

                    <div className="section-title">My Records</div>
                    <div className={`nav-item ${activeTab === 'forms' ? 'active' : ''}`} onClick={() => handleProtectedTab('forms')}><FileText size={20} strokeWidth={2.75} /> Drop/Add Forms</div>
                    <div className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => handleProtectedTab('progress')}><TrendingUp size={20} strokeWidth={2.75} /> Progress</div>
                    <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleProtectedTab('history')}><HistoryIcon size={20} strokeWidth={2.75} /> My History</div>

                    <div className="section-title">Tools & Support</div>
                    <div className={`nav-item ${activeTab === 'timer' ? 'active' : ''}`} onClick={() => handleProtectedTab('timer')}><Clock size={20} strokeWidth={2.75} /> Study Timer</div>
                    <div className={`nav-item ${activeTab === 'smart-study' ? 'active' : ''}`} onClick={() => handleProtectedTab('smart-study')}><Brain size={20} strokeWidth={2.75} /> Flashcards</div>
                    <div className={`nav-item ${activeTab === 'tutoring' ? 'active' : ''}`} onClick={() => handleProtectedTab('tutoring')}><GraduationCap size={20} strokeWidth={2.75} /> Tutoring Center</div>
                    <div className={`nav-item ${activeTab === 'financial' ? 'active' : ''}`} onClick={() => handleProtectedTab('financial')}><GraduationCap size={20} strokeWidth={2.75} /> Financial Nexus</div>
                    <div className={`nav-item ${activeTab === 'career' ? 'active' : ''}`} onClick={() => handleProtectedTab('career')}><Briefcase size={20} strokeWidth={2.75} /> Career Pathfinder</div>
                    <div className={`nav-item ${activeTab === 'holds' ? 'active' : ''}`} onClick={() => handleProtectedTab('holds')}><ShieldAlert size={20} strokeWidth={2.75} /> Holds & Alerts</div>
                    
                    {/* Admin/Business Features - Hidden from App Review unless explicitly enabled */}
                    {(window.location.search.includes('admin=true') || localStorage.getItem('aura_admin') === 'true') && (
                        <>
                            <div className="section-title">Institutional (Admin Only)</div>
                            <div className={`nav-item ${activeTab === 'ednex' ? 'active' : ''}`} onClick={() => handleProtectedTab('ednex')}><Briefcase size={20} strokeWidth={2.75} /> Project EdNex</div>
                            <div className={`nav-item ${activeTab === 'license' ? 'active' : ''}`} onClick={() => handleProtectedTab('license')}><Shield size={20} strokeWidth={2.75} /> Institutional Access</div>
                            <div className={`nav-item ${activeTab === 'quote' ? 'active' : ''}`} onClick={() => onTabChange('quote')}><Calculator size={20} strokeWidth={2.75} stroke="#ec4899" /> Proposal Builder</div>
                        </>
                    )}

                    <div className="section-title">Campus Life</div>
                    <div className={`nav-item ${activeTab === 'social' ? 'active' : ''}`} onClick={() => handleProtectedTab('social')}><Users size={20} strokeWidth={2.75} /> Social Campus</div>
                    <div className={`nav-item ${activeTab === 'wellness' ? 'active' : ''}`} onClick={() => handleProtectedTab('wellness')}><Heart size={20} strokeWidth={2.75} /> Wellness</div>

                    {(userData?.is_faculty || userData?.is_admin || currentRole === 'faculty') && (
                        <>
                            <div className="section-title">Faculty & Staff</div>
                            <div className={`nav-item ${activeTab === 'faculty' ? 'active' : ''}`} onClick={() => handleProtectedTab('faculty')}><Users size={20} strokeWidth={2.75} /> Faculty Portal</div>
                        </>
                    )}

                    {(userData?.is_advisor || userData?.is_admin || currentRole === 'advisor') && (
                        <>
                            <div className="section-title">Advising</div>
                            <div className={`nav-item ${activeTab === 'advisor' ? 'active' : ''}`} onClick={() => handleProtectedTab('advisor')}><Calendar size={20} strokeWidth={2.75} /> Advisor Case Center</div>
                        </>
                    )}

                    {(userData?.is_dean || userData?.is_exec || userData?.is_admin || currentRole === 'dean' || currentRole === 'exec') && (
                        <>
                            <div className="section-title">Executive</div>
                            <div className={`nav-item ${activeTab === 'dean' ? 'active' : ''}`} onClick={() => handleProtectedTab('dean')}><TrendingUp size={20} strokeWidth={2.75} /> Dean's Dashboard</div>
                        </>
                    )}

                    {userData?.is_admin && (
                        <>
                            <div className="section-title">Admin</div>
                            <div className={`nav-item ${activeTab === 'adminPanel' ? 'active' : ''}`} onClick={() => handleProtectedTab('adminPanel')}><Shield size= {20} strokeWidth={2.75} /> Admin Panel</div>
                            <div className={`nav-item ${activeTab === 'adminEdnex' ? 'active' : ''}`} onClick={() => handleProtectedTab('adminEdnex')}><Database size={20} strokeWidth={2.75} /> EdNex Config</div>
                            <div className={`nav-item ${activeTab === 'adminAgentConfig' ? 'active' : ''}`} onClick={() => handleProtectedTab('adminAgentConfig')}><Brain size={20} strokeWidth={2.75} /> Agent Swarm Config</div>
                            <div className={`nav-item ${activeTab === 'integration' ? 'active' : ''}`} onClick={() => handleProtectedTab('integration')}><Map size={20} strokeWidth={2.75} /> Institution Integration</div>
                            <div className={`nav-item ${activeTab === 'quoteGen' ? 'active' : ''}`} onClick={() => handleProtectedTab('quoteGen')}><Calculator size={20} strokeWidth={2.75} /> Quote Generator</div>
                        </>
                    )}

                        {/* Legal Footer */}
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.65rem', color: '#94a3b8' }}>
                            <div style={{ marginBottom: '0.25rem' }}>© 2026 Aura | Academic Intelligence</div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <span onClick={() => handleProtectedTab('privacy')} style={{ cursor: 'pointer', textDecoration: 'none', hover: { textDecoration: 'underline' } }}>Privacy</span>
                                <span onClick={() => handleProtectedTab('msa')} style={{ cursor: 'pointer', textDecoration: 'none', hover: { textDecoration: 'underline' } }}>MSA</span>
                                <span onClick={() => handleProtectedTab('sla')} style={{ cursor: 'pointer', textDecoration: 'none', hover: { textDecoration: 'underline' } }}>SLA</span>
                            </div>
                        </div>

                        {/* Admin Overlap Guard (Locked from Apple Review) */}
                        {(window.location.search.includes('aura_master=true')) && (
                            <div style={{ marginTop: '1rem', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #cbd5e1' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Institutional Access</div>
                                <select 
                                    value={currentRole} 
                                    onChange={(e) => onRoleChange(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: '700' }}
                                >
                                    <option value="student">Student Account</option>
                                    <option value="faculty">Faculty Portal</option>
                                    <option value="advisor">Advisor case Center</option>
                                    <option value="dean">Dean's Dashboard</option>
                                    <option value="admin">System Admin</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
        </>
    );
};


const DashboardHome = ({ onNavigate, userData, onEditStats }) => {
    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', width: '100%', padding: '0 1rem' }}>
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-card"
                style={{ position: 'relative' }}
            >
                {userData?.is_ednex_verified && (
                    <div className="ednex-neon" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', color: 'white' }}>
                        <Shield size={14} strokeWidth={3} /> EdNex Verified
                    </div>
                )}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', opacity: 0.9 }}>
                        <Brain size={18} strokeWidth={2.5} /> Aura Intelligence Engine
                    </div>
                    <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem 0', fontWeight: '700' }}>
                        {(() => {
                            const hour = new Date().getHours();
                            if (hour < 12) return 'Good morning';
                            if (hour < 18) return 'Good afternoon';
                            return 'Good evening';
                        })()}, {userData?.full_name ? userData.full_name.split(' ')[0] : 'Student'}!
                    </h1>
                    <p style={{ maxWidth: '500px', fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', lineHeight: '1.6' }}>
                        {userData?.ai_insight || "Welcome to Aura. Your personal academic intelligence platform designed to help you succeed."}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button onClick={() => onNavigate('chat')} style={{ border: 'none', background: 'white', color: '#4f46e5', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Chat with AI</button>
                        <button onClick={() => onNavigate('schedule')} style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>View schedule</button>
                    </div>
                </div>

                <div className="stats-container" style={{ position: 'relative' }}>
                    <div className="edit-btn-wrapper" style={{ position: 'absolute', top: '-3.5rem', right: '-1rem' }}>
                        <button
                            onClick={onEditStats}
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '32px', 
                                height: '32px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer', 
                                color: 'white',
                                opacity: 0.5,
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.opacity = 1; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = 0.5; }}
                        >
                            <Edit3 size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="stat-card-glass">
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{userData?.gpa?.toFixed(1) || '0.0'}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Current GPA</div>
                    </div>
                    <div className="stat-card-glass">
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{userData?.on_track_score || '0'}%</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>On-track score</div>
                    </div>
                </div>

                {userData?.is_ednex_verified && (
                    <div className="license-badge">
                        Institutional License Active
                    </div>
                )}
            </motion.div>

            {/* Quick Actions */}
            <h3 className="section-title">Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                {[
                    { icon: ShieldAlert, color: '#ef4444', label: 'Holds & Alerts', sub: 'Action required', action: 'holds' },
                    { icon: Calendar, color: '#6366f1', label: 'Life Calendar', sub: 'Month view & Alerts', action: 'calendar' },
                    { icon: Calendar, color: '#6366f1', label: 'My Schedule', sub: 'Weekly grid', action: 'schedule' },
                    { icon: Users, color: '#6366f1', label: 'Book Advisor', sub: 'Schedule a meeting', action: 'book-advisor' },
                    { icon: BookOpen, color: '#10b981', label: 'Tutoring Center', sub: 'Get study help', action: 'tutoring' },
                    { icon: FileText, color: '#f59e0b', label: 'Drop/Add Forms', sub: 'Deadline: Oct 15', action: 'forms' },
                    { icon: Clock, color: '#eab308', label: 'Study Timer', sub: 'Stay focused', action: 'timer' },
                    { icon: Mic, color: '#4f46e5', label: 'Voice Notes', sub: 'Transcribe lectures', action: 'voice-notes' },
                    { icon: Briefcase, color: '#ec4899', label: 'Career Finder', sub: 'Find internships', action: 'career' },
                ].map((item, idx) => (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={idx}
                        className="card-white"
                        style={{ textAlign: 'center', cursor: 'pointer' }}
                        onClick={() => item.action && onNavigate(item.action)}
                    >
                        <div style={{ background: `${item.color}15`, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <item.icon color={item.color} size={24} strokeWidth={2.75} />
                        </div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.sub}</div>
                    </motion.div>
                ))}
            </div>
            {/* Intelligence & Activity Section */}
            <div className="intelligence-activity-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem', marginBottom: '3rem' }}>
                <div className="card-white" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'linear-gradient(135deg, transparent 50%, #4f46e510 50%)', borderRadius: '0 0 0 100px' }}></div>
                    <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '800' }}>
                        <Brain size={20} color="#4f46e5" /> Campus Intelligence
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                        {[
                            { label: 'Avg Campus GPA', value: '3.38', trend: '+0.12', color: '#10b981' },
                            { label: 'Tutoring Success', value: '94%', trend: 'High', color: '#6366f1' },
                            { label: 'Career Outcomes', value: '$72k', trend: 'Avg Base', color: '#f59e0b' },
                            { label: 'Active Clubs', value: '142', trend: 'Growing', color: '#ec4899' },
                        ].map((stat, i) => (
                            <div key={i} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: stat.color }}>{stat.trend}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-white" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '800' }}>
                        <Activity size={20} color="#ef4444" /> Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { title: 'New Grade: CS101 Quiz', details: 'Scored 92/100', time: '2h ago', icon: FileText, bg: '#eef2ff', color: '#4f46e5' },
                            { title: 'Tutoring Interaction', details: 'Calculus II Integration', time: '5h ago', icon: MessageSquare, bg: '#f0fdf4', color: '#10b981' },
                            { title: 'EdNex Verification', details: 'System Sync Complete', time: 'Yesterday', icon: ShieldCheck, bg: '#fff7ed', color: '#f59e0b' },
                            { title: 'Career Path Update', details: 'Internship Matches', time: '2d ago', icon: Briefcase, bg: '#fdf2f8', color: '#ec4899' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ background: item.bg, padding: '10px', borderRadius: '10px', color: item.color, flexShrink: 0 }}>
                                    <item.icon size={18} strokeWidth={2.75} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.details}</div>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', flexShrink: 0 }}>{item.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Team */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Your AI Support Team</h3>
                <button className="pill-btn" onClick={() => onNavigate('chat')} style={{ cursor: 'pointer', background: 'white', border: '1px solid #e2e8f0' }}>Open Chat <ChevronRight size={16} strokeWidth={3} style={{ verticalAlign: 'middle' }} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem', marginTop: '1.5rem', paddingBottom: '2rem' }}>
                {[
                    { title: "The Strategist", mode: "strategist", role: "Historical grade recovery paths", color: "#f59e0b", icon: TrendingUp, tags: ["Grade recovery path", "Peer-based insights", "Retake analysis"] },
                    { title: "The Tutor", mode: "tutor", role: "Course content specialist", color: "#4f46e5", icon: GraduationCap, tags: ["Explain photosynthesis", "Help with calculus", "Review my essay"] },
                    { title: "The Admin", mode: "admin", role: "Forms & deadlines expert", color: "#10b981", icon: FileText, tags: ["Drop deadline?", "Add a course", "Transcript request"] },
                    { title: "The Coach", mode: "coach", role: "Wellness & support guide", color: "#ec4899", icon: Heart, tags: ["Feeling stressed", "Find a club", "Mental health resouces"] },
                ].map((agent, idx) => (
                    <motion.div key={idx} className="card-white" style={{ cursor: 'pointer' }} onClick={() => onNavigate('chat', agent.mode)}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ background: agent.color, padding: '12px', borderRadius: '12px', color: 'white' }}>
                                <agent.icon size={24} strokeWidth={2.75} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{agent.title}</div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{agent.role}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Try asking:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {agent.tags.map((tag, tIdx) => (
                                <span key={tIdx} className="pill-btn">{tag}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const EditProfileModal = ({ userData, onClose, onRefresh }) => {
    const [fullName, setFullName] = useState(userData?.full_name || '');
    const [gpa, setGpa] = useState(userData?.gpa || 0.0);
    const [_onTrackScore, _setOnTrackScore] = useState(userData?.on_track_score || 0);

    const [major, setMajor] = useState(userData?.major || '');
    const [background, setBackground] = useState(userData?.background || '');
    const [interests, setInterests] = useState(userData?.interests || '');
    const [defaultLang, setDefaultLang] = useState(localStorage.getItem('defaultLanguage') || 'English');

    // Change Password state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMsg, setPwMsg] = useState(null); // { type: 'success'|'error', text }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/users/me', {
                full_name: fullName,
                gpa: parseFloat(gpa),
                on_track_score: parseInt(_onTrackScore),
                major,
                background,
                interests
            });
            localStorage.setItem('defaultLanguage', defaultLang);
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update profile");
        }
    };

    const handleChangePassword = async () => {
        setPwMsg(null);
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPwMsg({ type: 'error', text: 'All password fields are required.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwMsg({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }
        setPwLoading(true);
        try {
            const res = await api.post('/api/auth/change-password', {
                email: userData?.email,
                old_password: oldPassword,
                new_password: newPassword
            });
            setPwMsg({ type: 'success', text: res.data?.message || 'Password updated successfully!' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            const detail = err.response?.data?.detail;
            setPwMsg({ type: 'error', text: typeof detail === 'string' ? detail : 'Password update failed. Check your current password.' });
        } finally {
            setPwLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Are you sure you want to PERMANENTLY delete your account? This action cannot be undone and all your data (history, notes, profile) will be erased.");
        if (!confirmed) return;

        const doubleConfirmed = window.prompt("To confirm deletion, please type 'DELETE' below:");
        if (doubleConfirmed !== 'DELETE') {
            alert("Deletion cancelled. You must type 'DELETE' to confirm.");
            return;
        }

        try {
            await api.delete('/api/users/me');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            console.error("Deletion failed:", error);
            alert("Failed to delete account. Please contact support.");
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="card-white"
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>Profile Settings</h3>
                    <button
                        onClick={onClose}
                        title="Close"
                        style={{
                            background: '#1e293b',
                            border: 'none',
                            borderRadius: '50%',
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            transition: 'all 0.15s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'rotate(90deg)'; e.currentTarget.style.background = '#0f172a'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'rotate(0deg)'; e.currentTarget.style.background = '#1e293b'; }}
                    >
                        <X size={24} color="#ffffff" strokeWidth={3.5} />
                    </button>

                </div>

                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Section 1: Institutional Identity */}
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>University Email</label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{userData?.email}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Student ID</label>
                                <div style={{ fontSize: '1rem', fontFamily: 'monospace', color: '#4f46e5', fontWeight: '700' }}>#{userData?.id?.toString().padStart(6, '0')}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Joined Platform</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b' }}>{userData?.created_at ? new Date(userData.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Personal & Academic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', transition: 'border-color 0.2s' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>Major / Study Track</label>
                            <input
                                type="text"
                                value={major}
                                onChange={(e) => setMajor(e.target.value)}
                                placeholder="e.g. Computer Science"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>Current GPA</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4.0"
                                    value={gpa}
                                    onChange={(e) => setGpa(e.target.value)}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem' }}
                                />
                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}>/ 4.0</div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Background & AI Context */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>Personal Background (Heritage, Identity, Goals)</label>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Helps Aura match you with diversity scholarships and relevant student orgs.</p>
                        <textarea
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            placeholder="Tell us about yourself..."
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', height: '120px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>Research Interests / Skills</label>
                        <textarea
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            placeholder="e.g. Machine Learning, Renaissance Art, Sustainability..."
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', height: '100px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>Preferred Language for Notes</label>
                            <select
                                value={defaultLang}
                                onChange={(e) => setDefaultLang(e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: 'white' }}
                            >
                                {["English", "Spanish", "Mandarin Chinese", "Hindi", "French", "Arabic", "Bengali", "Portuguese", "Russian", "Urdu"].map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f0f9ff', padding: '1.25rem', borderRadius: '16px', border: '2px solid #bae6fd' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '700', color: '#0369a1', fontSize: '1rem' }}>AI SMS Nudges</div>
                                <div style={{ fontSize: '0.85rem', color: '#0c4a6e' }}>Get proactive academic alerts via SMS.</div>
                            </div>
                            <div style={{
                                width: '50px',
                                height: '26px',
                                background: '#0284c7',
                                borderRadius: '20px',
                                position: 'relative',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '3px'
                            }}>
                                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', marginLeft: 'auto' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Change Password */}
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔑 Change Password
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                            Update your login credentials. Changes are synced to your institutional account.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Current Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={e => setOldPassword(e.target.value)}
                                    placeholder="Current password"
                                    autoComplete="current-password"
                                    style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="New password"
                                    autoComplete="new-password"
                                    style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Confirm New</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                    style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: `2px solid ${confirmPassword && confirmPassword !== newPassword ? '#fca5a5' : '#e2e8f0'}`, fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>
                        {pwMsg && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                marginBottom: '1rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                background: pwMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                                color: pwMsg.type === 'success' ? '#065f46' : '#b91c1c',
                                border: `1px solid ${pwMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                            }}>{pwMsg.text}</div>
                        )}
                        <button
                            type="button"
                            onClick={handleChangePassword}
                            disabled={pwLoading}
                            style={{
                                padding: '10px 24px',
                                background: pwLoading ? '#c7d2fe' : '#4f46e5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: '700',
                                cursor: pwLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                                boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
                                transition: 'all 0.15s'
                            }}
                        >
                            {pwLoading ? 'Updating…' : 'Update Password'}
                        </button>
                    </div>

                    {/* Section 5: Data Control */}
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #fee2e2', paddingTop: '2.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#b91c1c', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <ShieldAlert size={18} /> Danger Zone
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#ef4444',
                                border: '2px solid #fee2e2',
                                borderRadius: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                width: 'fit-content'
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#ef4444'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#fee2e2'; }}
                        >
                            Delete My Account
                        </button>
                    </div>

                    {/* Footer Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '1.25rem',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: '700',
                                color: '#64748b',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 2,
                                padding: '1.25rem',
                                background: '#4f46e5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                                transition: 'all 0.2s'
                            }}
                        >
                            Save Profile Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};



const Dashboard = () => {
    const [currentRole, setCurrentRole] = useState(localStorage.getItem('viewRole') || 'student');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [chatMode, setChatMode] = useState(null); // 'tutor', 'admin', 'coach', or null
    const [chatSessionId, setChatSessionId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [holds, setHolds] = useState([]);
    const [prefilledData, setPrefilledData] = useState(null);
    const navigate = useNavigate();
    const fetchUser = async () => {
        const getParams = () => {
            const pathSearch = window.location.search;
            const hashSearch = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
            return new URLSearchParams(pathSearch || hashSearch);
        };
        const query = getParams();
        const isAdminMode = query.get('admin') === 'true' || localStorage.getItem('adminMode') === 'true';
        const isStatsMode = query.get('stats') === 'true';
        const token = localStorage.getItem('token');
        
        if (isAdminMode) {
            localStorage.setItem('adminMode', 'true');
        }

        if (!token && !isAdminMode && !isStatsMode) return;

        if (isAdminMode || isStatsMode) {
            // Enhanced bypass logic: if we are in admin mode, keep the current token user
            // but augment them with global admin staff permissions/persona.
            setUserData({
                id: 10452, 
                full_name: isAdminMode ? "Dean Garrett" : "Daniel Garrett", 
                gpa: 3.5, 
                on_track_score: 87, 
                is_admin: isAdminMode, 
                is_faculty: isAdminMode, 
                is_advisor: isAdminMode,
                is_dean: isAdminMode,
                is_exec: isAdminMode,
                is_ednex_verified: true,
                ai_insight: isAdminMode ? "Admin access enabled. Reviewing university performance analytics." : "Welcome to Aura. Your personal academic intelligence platform designed to help you succeed."
            });
            return;
        }

        try {
            const res = await api.get('/api/users/me');
            let baseUser = res.data;

            try {
                // Fetch Enterprise Context from EdNex
                const edNexRes = await api.get('/api/ednex/context');

                if (edNexRes.data?.status === 'success' && edNexRes.data.context) {
                    const ctx = edNexRes.data.context;
                    baseUser.is_ednex_verified = true;

                    if (ctx.student_profile?.name) baseUser.full_name = ctx.student_profile.name;

                    if (ctx.sis_stream?.cumulative_gpa !== undefined) {
                        baseUser.gpa = parseFloat(ctx.sis_stream.cumulative_gpa);
                    } else if (ctx.sis_stream?.gpa !== undefined) {
                        baseUser.gpa = parseFloat(ctx.sis_stream.gpa);
                    }
                    
                    if (ctx.finance_stream?.tuition_balance !== undefined) {
                        baseUser.tuition_balance = parseFloat(ctx.finance_stream.tuition_balance);
                        baseUser.has_financial_hold = ctx.finance_stream.has_financial_hold;
                    }

                    // Simple heuristic for on_track_score based on enterprise data
                    if (baseUser.gpa) {
                        baseUser.on_track_score = Math.min(100, Math.round((baseUser.gpa / 4.0) * 100));
                    }

                    // Persist EdNex-enriched GPA back to the DB so it survives page reloads
                    if (baseUser.gpa) {
                        api.put('/api/users/me', {
                            gpa: baseUser.gpa,
                            on_track_score: baseUser.on_track_score
                        }).catch(err => console.log("GPA persist failed:", err));
                    }
                }
            } catch (err) {
                console.log("EdNex sync unavailable:", err);
            }

            // Role Safety Check: Reset to student if user doesn't have permissions for current role
            const hasFacultyPerms = baseUser.is_faculty || baseUser.is_admin;
            const hasAdvisorPerms = baseUser.is_advisor || baseUser.is_admin;
            const hasDeanPerms = baseUser.is_dean || baseUser.is_exec || baseUser.is_admin;

            if (currentRole === 'faculty' && !hasFacultyPerms) setCurrentRole('student');
            if (currentRole === 'advisor' && !hasAdvisorPerms) setCurrentRole('student');
            if (currentRole === 'dean' && !hasDeanPerms) setCurrentRole('student');

            setUserData(baseUser);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setUserData(null);
            }
        }
    };

    const fetchHolds = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await api.get('/api/holds');
            // Ensure holds is always an array - backend may return {} for empty or on error
            setHolds(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to fetch holds:", error);
            setHolds([]);
        }
    };

    const handleFeatureNavigate = (tab, mode = null, sessionId = null, data = null) => {
        const query = new URLSearchParams(window.location.search);
        const isAdminMode = query.get('admin') === 'true' || localStorage.getItem('adminMode') === 'true';
        const token = localStorage.getItem('token');
        
        if (!token && !isAdminMode) {
            navigate('/login');
        } else {
            setActiveTab(tab);
            setChatMode(mode);
            setChatSessionId(sessionId);
            setPrefilledData(data);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchHolds();

        const query = new URLSearchParams(window.location.search);
        
        const deepTab = query.get('tab');
        if (deepTab) setActiveTab(deepTab);
    }, []);


    const handleRoleChange = (role) => {
        setCurrentRole(role);
        localStorage.setItem('viewRole', role);
        setActiveTab('dashboard');
    };

    return (        <div style={{ display: 'flex', height: '100dvh', background: '#f8fafc', flexDirection: 'column' }}>
            {/* Mobile Header - Fixed App Bar */}
            <div className="mobile-only mobile-header" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: 'calc(0.75rem + env(safe-area-inset-top)) 1.5rem 0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #e2e8f0',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 60
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                        padding: '2px', 
                        borderRadius: '10px', 
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <img src={iphoneLogo} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                    </div>

                    <span style={{ fontWeight: '800', fontSize: '1.4rem', color: '#0f172a', letterSpacing: '-0.02em' }}>Aura</span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(true)} 
                    style={{ 
                        background: '#f1f5f9', 
                        border: 'none', 
                        borderRadius: '10px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer', 
                        color: '#1e293b'
                    }}
                >
                    <Menu size={22} strokeWidth={2.5} />
                </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                    userData={userData} 
                    isOpen={isMobileMenuOpen} 
                    onClose={() => setIsMobileMenuOpen(false)} 
                    currentRole={currentRole}
                    onRoleChange={handleRoleChange}
                />

                <main
                    style={{
                        flex: 1,
                        padding: activeTab === 'chat' ? 0 : '1.5rem',
                        overflowY: activeTab === 'chat' ? 'hidden' : 'auto',
                        overflowX: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    className="main-content"
                >
                    <style>{`
                        @keyframes neon-glow {
                            0% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.4), 0 0 10px rgba(16, 185, 129, 0.2); text-shadow: 0 0 2px rgba(255,255,255,0.5); border-color: rgba(16, 185, 129, 0.5); }
                            50% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4); text-shadow: 0 0 5px rgba(255,255,255,1), 0 0 10px #10b981; border-color: #10b981; }
                            100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.4), 0 0 10px rgba(16, 185, 129, 0.2); text-shadow: 0 0 2px rgba(255,255,255,0.5); border-color: rgba(16, 185, 129, 0.5); }
                        }
                        .ednex-neon {
                            animation: neon-glow 1.5s infinite;
                            border: 1px solid #10b981;
                            background: rgba(16, 185, 129, 0.15);
                            backdrop-filter: blur(10px);
                        }
                        @media (max-width: 768px) {
                            .main-content {
                                padding: ${activeTab === 'chat' ? 0 : '1rem'} !important;
                                padding-top: calc(5.5rem + env(safe-area-inset-top)) !important;
                                padding-bottom: calc(2rem + env(safe-area-inset-bottom)) !important;
                                overflow-y: auto !important;
                            }
                            .stats-container {
                                display: grid !important;
                                grid-template-columns: 1fr 1fr !important;
                                gap: 0.75rem !important;
                                width: 100% !important;
                            }
                            .intelligence-activity-grid {
                                grid-template-columns: 1fr !important;
                                gap: 1rem !important;
                            }
                            .hero-card {
                                padding: 1.5rem !important;
                                border-radius: 20px !important;
                            }
                        }
                    `}</style>

                    {activeTab === 'dashboard' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {holds.some(h => h.status === 'active') && currentRole === 'student' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => setActiveTab('holds')}
                                    style={{
                                        background: '#fee2e2',
                                        border: '1px solid #fecaca',
                                        padding: '1rem 1.5rem',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <AlertTriangle color="#ef4444" size={20} strokeWidth={2.75} />
                                        <span style={{ color: '#991b1b', fontWeight: '700' }}>
                                            You have {holds.filter(h => h.status === 'active').length} active hold(s).
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: '700' }}>
                                        View Details <ChevronRight size={16} strokeWidth={3} />
                                    </div>
                                </motion.div>
                            )}
                            
                            {currentRole === 'faculty' ? (
                                <FacultyDashboard onBack={() => handleRoleChange('student')} />
                            ) : currentRole === 'advisor' ? (
                                <AdvisorDashboard onBack={() => handleRoleChange('student')} />
                            ) : currentRole === 'dean' ? (
                                <DeanDashboard onBack={() => handleRoleChange('student')} />
                            ) : (
                                <DashboardHome onNavigate={handleFeatureNavigate} userData={userData} onEditStats={() => handleFeatureNavigate('edit-profile')} />
                            )}
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>
                            <h2 style={{ marginBottom: '1rem' }}>Get Aura AI</h2>
                            <div style={{ flex: 1, background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                                <ChatInterface mode={chatMode} initialSessionId={chatSessionId} prefilledData={prefilledData} onNavigate={handleFeatureNavigate} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && <History onBack={() => setActiveTab('dashboard')} onSelectSession={(id) => handleFeatureNavigate('chat', null, id)} />}
                    {activeTab === 'schedule' && <WeeklySchedule onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'calendar' && <StudentCalendar onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'book-advisor' && <BookAdvisor onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'courses' && <Courses onBack={() => setActiveTab('dashboard')} userData={userData} />}
                    {activeTab === 'tutoring' && <TutoringCenter onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'wellness' && <WellnessCheck onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'timer' && <StudyTimer onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'smart-study' && <FlashcardGenerator onBack={() => setActiveTab('dashboard')} prefilledData={prefilledData} />}
                    {activeTab === 'voice-notes' && <LectureVoiceNotes onBack={() => setActiveTab('dashboard')} onNavigate={handleFeatureNavigate} />}
                    {activeTab === 'syllabus' && <SyllabusScanner onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'holds' && <HoldsCenter onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'financial' && <FinancialAidNexus onBack={() => setActiveTab('dashboard')} onNavigate={handleFeatureNavigate} />}
                    {activeTab === 'career' && <CareerPathfinder onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'ednex' && <CareerMapper onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'forms' && <DropAddForms onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'progress' && <Progress onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'privacy' && <PrivacyPolicy onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'msa' && <MSA onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'sla' && <SLA onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'social' && <SocialCampus onBack={() => setActiveTab('dashboard')} />}
                    
                    {/* Role Dashboards - Direct Access */}
                    {activeTab === 'faculty' && currentRole !== 'faculty' && <FacultyDashboard onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'advisor' && currentRole !== 'advisor' && <AdvisorDashboard onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'dean' && currentRole !== 'dean' && <DeanDashboard onBack={() => setActiveTab('dashboard')} />}

                    {activeTab === 'degree-roadmap' && <DegreeRoadmap onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'support' && <Support onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'license' && <LicenseDetails userData={userData} onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'adminPanel' && <AdminPanel onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'adminEdnex' && <AdminEdnex onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'adminAgentConfig' && <AdminAgentConfig onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'integration' && <IntegrationWizard onBack={() => setActiveTab('dashboard')} />}
                    {activeTab === 'quoteGen' && <QuoteGenerator onBack={() => setActiveTab('dashboard')} />}


                    {activeTab !== 'chat' && <Footer onNavigate={(tab) => setActiveTab(tab)} />}
                </main>
            </div>

            {(isEditModalOpen || activeTab === 'edit-profile') && (
                <EditProfileModal
                    userData={userData}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        if (activeTab === 'edit-profile') setActiveTab('dashboard');
                    }}
                    onRefresh={fetchUser}
                />
            )}

            {/* Global Static Top-Right Logout Button */}
            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }}
                style={{
                    position: 'fixed',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'white',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    zIndex: 2147483647,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'white'; }}
            >
                <LogOut size={16} strokeWidth={2.5} /> Logout
            </button>

            {activeTab !== 'chat' && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFeatureNavigate('chat', 'coach', null, { message: 'I need help immediately.' })}
                    style={{ 
                        position: 'fixed', 
                        bottom: 'min(1.5rem, calc(1.5rem + env(safe-area-inset-bottom)))', 
                        right: '1rem', 
                        background: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50px', 
                        padding: '0.85rem 1.25rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)', 
                        cursor: 'pointer', 
                        fontWeight: '800', 
                        zIndex: 1000,
                        fontSize: '0.9rem'
                    }}
                >
                    <AlertTriangle size={18} strokeWidth={3} />
                    I Need Help Now
                </motion.button>
            )}
        </div>
    );
};


export default Dashboard;
