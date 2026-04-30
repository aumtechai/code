import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, Target, ChevronRight, Award, Upload, Download, Search, CheckCircle, BarChart2, ChevronLeft, BellRing, Bell, ExternalLink, Zap, Calendar, MapPin, Users, MessageSquare, AlertTriangle, BookOpen, Star, TrendingUp, GraduationCap } from 'lucide-react';
import api from '../api';

// ─── Course Catalog (skill → course mapping) ───────────────────────────────
const COURSE_CATALOG = {
    'Python':                 { code: 'CS101', name: 'Intro to Python & Data Science',      credits: 3 },
    'Machine Learning':       { code: 'CS345', name: 'Machine Learning Fundamentals',        credits: 3 },
    'Data Analysis':          { code: 'STAT210', name: 'Applied Statistical Analysis',       credits: 3 },
    'SQL':                    { code: 'CS220', name: 'Database Systems & SQL',                credits: 3 },
    'Cloud Computing':        { code: 'CS410', name: 'Cloud Infrastructure & DevOps',        credits: 3 },
    'React':                  { code: 'CS330', name: 'Modern Web Development',                credits: 3 },
    'Java':                   { code: 'CS201', name: 'Object-Oriented Programming in Java',  credits: 3 },
    'System Design':          { code: 'CS450', name: 'Scalable Systems Architecture',        credits: 3 },
    'Statistics':             { code: 'STAT101', name: 'Intro to Statistics',                credits: 3 },
    'Deep Learning':          { code: 'CS460', name: 'Neural Networks & Deep Learning',      credits: 3 },
    'Data Visualization':     { code: 'CS315', name: 'Data Visualization & BI Tools',        credits: 3 },
    'Product Management':     { code: 'BUS320', name: 'Product Strategy & Roadmapping',      credits: 3 },
    'A/B Testing':            { code: 'MKT401', name: 'Digital Marketing Analytics',         credits: 3 },
    'User Research':          { code: 'DES210', name: 'UX Research Methods',                 credits: 3 },
    'Figma':                  { code: 'DES220', name: 'UI/UX Design with Figma',             credits: 3 },
    'Prototyping':            { code: 'DES230', name: 'Rapid Prototyping & Iteration',       credits: 3 },
    'Financial Modeling':     { code: 'FIN310', name: 'Corporate Financial Modeling',        credits: 3 },
    'Excel':                  { code: 'BUS101', name: 'Business Data Tools & Excel',         credits: 3 },
    'Valuation':              { code: 'FIN320', name: 'Business Valuation Methods',          credits: 3 },
    'Accounting':             { code: 'ACC201', name: 'Principles of Accounting',            credits: 3 },
    'Communication':          { code: 'ENG202', name: 'Professional Communication',          credits: 3 },
    'Leadership':             { code: 'MGT301', name: 'Organizational Leadership',           credits: 3 },
    'Project Management':     { code: 'MGT350', name: 'Agile Project Management',            credits: 3 },
    'Cybersecurity':          { code: 'CS440', name: 'Information Security & Ethics',        credits: 3 },
    'Networking':             { code: 'CS320', name: 'Computer Networks',                   credits: 3 },
    'Linux':                  { code: 'CS305', name: 'Operating Systems & Linux',            credits: 3 },
};

// ─── Alignment Warning Logic ────────────────────────────────────────────────
const STEM_ROLES    = ['software engineer','data scientist','machine learning','ml engineer','data analyst','devops','cloud engineer','backend','frontend','full stack','cybersecurity','systems engineer','ai engineer','computer vision','nlp engineer','robotics'];
const STEM_MAJORS   = ['computer science','software engineering','data science','mathematics','statistics','electrical engineering','computer engineering','information systems','information technology','physics','engineering'];
const NON_STEM_BRIDGE = {
    'Business Administration': ['BUS320', 'MKT401', 'CS220'],
    'Psychology':              ['PSY150', 'STAT101', 'BUS101'],
    'English':                 ['ENG202', 'CS101', 'MKT401'],
    'History':                 ['ENG202', 'CS101', 'MGT301'],
    'Political Science':       ['ENG202', 'MGT301', 'STAT101'],
    'Art':                     ['DES210', 'DES220', 'MKT401'],
    'Communications':          ['ENG202', 'MKT401', 'DES220'],
    'Sociology':               ['STAT101', 'PSY150', 'ENG202'],
    'default':                 ['CS101', 'STAT101', 'ENG202'],
};

const getAlignmentWarning = (targetRole, userMajor) => {
    if (!targetRole || !userMajor) return null;
    const roleLC  = targetRole.toLowerCase();
    const majorLC = userMajor.toLowerCase();
    const isStemRole  = STEM_ROLES.some(r => roleLC.includes(r));
    const isStemMajor = STEM_MAJORS.some(m => majorLC.includes(m));
    if (isStemRole && !isStemMajor) {
        const bridgeCourses = NON_STEM_BRIDGE[userMajor] || NON_STEM_BRIDGE['default'];
        return { type: 'gap', major: userMajor, role: targetRole, bridgeCourses };
    }
    return null;
};

// ─── Alumni Success Stories data ────────────────────────────────────────────
const ALUMNI_STORIES = [
    { name: 'Priya Menon',    major: 'Computer Science',       role: 'Software Engineer',        company: 'Google',     salary: '$178k',  grad: '2023', avatar: 'PM', color: '#4285f4',  quote: 'Aura helped me map my coursework gaps before applying — I landed my offer with zero rejections.' },
    { name: 'Marcus Webb',    major: 'Business Administration', role: 'Product Manager',          company: 'Stripe',     salary: '$152k',  grad: '2024', avatar: 'MW', color: '#6772e5',  quote: 'The career pathways feature showed me exactly which PM skills I needed. Game changer.' },
    { name: 'Sofia Ramirez',  major: 'Data Science',           role: 'Data Scientist',           company: 'Microsoft',  salary: '$165k',  grad: '2023', avatar: 'SR', color: '#00a1f1',  quote: 'I used the Skill Gap Analyzer weekly. Every missing skill linked me to the right course.' },
    { name: 'Ethan Clarke',   major: 'Finance',                role: 'Investment Banking Analyst', company: 'Goldman Sachs', salary: '$160k', grad: '2024', avatar: 'EC', color: '#1a9c56', quote: 'The hiring events tab connected me to the JPMorgan workshop — that\'s where I got recruited.' },
    { name: 'Aisha Johnson',  major: 'Psychology',             role: 'UX Researcher',            company: 'Meta',       salary: '$138k',  grad: '2023', avatar: 'AJ', color: '#1877f2',  quote: 'I was a Psychology major pivoting to tech. The bridge courses Aura suggested got me here.' },
    { name: 'Ryan Xu',        major: 'Electrical Engineering', role: 'ML Engineer',              company: 'NVIDIA',     salary: '$195k',  grad: '2024', avatar: 'RX', color: '#76b900',  quote: 'From lab projects to GPU kernel dev — Aura\'s ML pathway was the exact roadmap I needed.' },
];

const CareerPathfinder = ({ onBack, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('jobs'); // 'resume', 'jobs', 'skills'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Resume State
    const [resumeContent, setResumeContent] = useState('');
    const [isGeneratingResume, setIsGeneratingResume] = useState(false);

    // Jobs State
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pushEnabled, setPushEnabled] = useState(false);

    // Skills State
    const [targetRole, setTargetRole] = useState('');
    const [skillAnalysis, setSkillAnalysis] = useState(null);
    const [alignmentWarning, setAlignmentWarning] = useState(null);
    const [userMajor, setUserMajor] = useState('');

    // Pull user major from localStorage/profile on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('aura_userdata');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.major) setUserMajor(parsed.major);
            }
        } catch (_) {}
        // Also try the API
        api.get('/api/users/me').then(res => {
            if (res.data?.major) setUserMajor(res.data.major);
        }).catch(() => {});
    }, []);

    // Pathways State
    const [pathways, setPathways] = useState([]);

    useEffect(() => {
        if (activeTab === 'jobs' && jobs.length === 0) {
            fetchJobs();
        }
        if (activeTab === 'pathways' && pathways.length === 0) {
            fetchPathways();
        }
    }, [activeTab]);

    const fetchPathways = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/career/pathways');
            setPathways(res.data.pathways || []);
        } catch (err) {
            console.error("Failed to fetch pathways", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/career/jobs');
            setJobs(res.data.jobs);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateResume = async () => {
        setIsGeneratingResume(true);
        try {
            const res = await api.post('/api/career/generate-resume');
            setResumeContent(res.data.resume);
        } catch (err) {
            console.error("Resume Gen Failed", err);
            setError("Failed to generate resume.");
        } finally {
            setIsGeneratingResume(false);
        }
    };

    const handleAnalyzeSkills = async () => {
        if (!targetRole) return;
        setLoading(true);
        setAlignmentWarning(null);
        try {
            const res = await api.post('/api/career/skill-gap', { target_role: targetRole });
            setSkillAnalysis(res.data);
            // Check major-vs-role alignment
            const warning = getAlignmentWarning(targetRole, userMajor);
            setAlignmentWarning(warning);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div style={{ padding: '0 1rem 2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {onBack && (
                    <button 
                        onClick={onBack} 
                        style={{ 
                            background: 'white', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '12px', 
                            padding: '8px 16px',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            cursor: 'pointer', 
                            color: '#475569',
                            fontWeight: '700',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            flexShrink: 0,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseOut={e => e.currentTarget.style.background = 'white'}
                    >
                        <ChevronLeft size={20} strokeWidth={3} /> Back
                    </button>
                )}
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                        Career Pathfinder
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>
                        Bridge the gap between your degree and your dream career.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { id: 'jobs', label: 'Internship Matcher', icon: Search },
                    { id: 'resume', label: 'AI Resume Builder', icon: FileText },
                    { id: 'skills', label: 'Skill Gap Analysis', icon: Target },
                    { id: 'pathways', label: 'AI Career Pathways', icon: BarChart2 },
                    { id: 'events', label: 'Hiring Events', icon: Calendar },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0',
                            background: activeTab === tab.id ? 'var(--primary-color)' : '#f8fafc',
                            color: activeTab === tab.id ? '#fff' : '#475569',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(99, 102, 241, 0.4)' : '0 1px 3px rgba(0,0,0,0.04)'
                        }}
                        onMouseOver={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; } }}
                        onMouseOut={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; } }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'jobs' && (
                    <motion.div key="jobs" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                        {/* Proactive Push Notification Toggle */}
                        <div style={{ background: 'linear-gradient(to right, #4f46e5, #ec4899)', padding: '1px', borderRadius: '16px', marginBottom: '2rem' }}>
                            <div style={{ background: '#ffffff', borderRadius: '15px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: pushEnabled ? '#ecfdf5' : '#f1f5f9', color: pushEnabled ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                        {pushEnabled ? <BellRing size={20} /> : <Bell size={20} />}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Proactive AI Match Engine</h3>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
                                            Automatically scans Handshake, LinkedIn, and Indeed matching your degree pathway.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPushEnabled(!pushEnabled)}
                                    style={{
                                        background: pushEnabled ? '#10b981' : '#f8fafc',
                                        border: `1px solid ${pushEnabled ? '#10b981' : '#cbd5e1'}`,
                                        color: pushEnabled ? 'white' : '#475569',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: pushEnabled ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                                    }}
                                >
                                    {pushEnabled ? 'Push Notifications: ON' : 'Enable Push Alerts'}
                                </button>
                            </div>
                        </div>

                        {loading && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#6366f1', fontWeight: '600', fontSize: '0.95rem' }}>
                                <Search size={32} style={{ opacity: 0.5, marginBottom: '1rem' }} /><br />Scanning Handshake, LinkedIn &amp; Indeed...
                            </div>
                        )}
                        {!loading && jobs.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <div style={{ width: '64px', height: '64px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                                    <Briefcase size={32} color="#6366f1" />
                                </div>
                                <h4 style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>No Matches Found Yet</h4>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>Complete your profile and add courses so Aura can match you with internships and jobs tailored to your degree.</p>
                                <button onClick={fetchJobs} style={{ padding: '0.6rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    Retry Search
                                </button>
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            {jobs.slice((currentPage - 1) * 10, currentPage * 10).map((job) => (
                                <div key={job.id} className="card-white" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid #e2e8f0', position: 'relative' }}>
                                    {job.proactive_matched && (
                                        <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'linear-gradient(to right, #f59e0b, #ec4899)', padding: '2px 10px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Zap size={10} fill="white" /> AI MATCH
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginTop: job.proactive_matched ? '10px' : '0' }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>{job.title}</h3>
                                            <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem', fontWeight: '500' }}>{job.company} • {job.location}</p>
                                        </div>
                                        <div style={{
                                            background: job.match_score > 90 ? '#ecfdf5' : '#fffbeb',
                                            color: job.match_score > 90 ? '#059669' : '#d97706',
                                            border: `1px solid ${job.match_score > 90 ? '#a7f3d0' : '#fde68a'}`,
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '700'
                                        }}>
                                            {job.match_score}% Match
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
                                        <Briefcase size={12} /> Live Source: <span style={{ color: job.source === 'LinkedIn' ? '#0a66c2' : job.source === 'Handshake' ? '#ef4444' : '#2563eb' }}>{job.source || 'Aggregator API'}</span>
                                    </div>

                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#475569' }}>
                                        This role aligns perfectly with your major and recent coursework in related subjects.
                                    </p>
                                    <button style={{
                                        marginTop: 'auto',
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        background: '#f8fafc',
                                        color: '#4f46e5',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                    >
                                        Apply via {job.source || 'External API'} <ExternalLink size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {jobs.length > 10 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', paddingBottom: '2rem' }}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: currentPage === 1 ? '#f1f5f9' : 'white',
                                        color: currentPage === 1 ? '#94a3b8' : '#475569',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Previous
                                </button>
                                <span style={{ color: '#475569', fontWeight: '600' }}>
                                    Page {currentPage} of {Math.ceil(jobs.length / 10)}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(jobs.length / 10)))}
                                    disabled={currentPage === Math.ceil(jobs.length / 10)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: currentPage === Math.ceil(jobs.length / 10) ? '#f1f5f9' : 'white',
                                        color: currentPage === Math.ceil(jobs.length / 10) ? '#94a3b8' : '#475569',
                                        cursor: currentPage === Math.ceil(jobs.length / 10) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'resume' && (
                    <motion.div key="resume" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="card-white" style={{ padding: '3rem', maxWidth: '850px', margin: '0 auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        {!resumeContent ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                    <FileText size={40} style={{ color: '#4f46e5' }} />
                                </div>
                                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#1e293b', fontWeight: '800' }}>Build Your Professional Resume</h3>
                                <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 2.5rem auto', lineHeight: '1.6', fontSize: '1.05rem' }}>
                                    Our AI analyzes your transcript, major, and background to create a tailored, ATS-friendly resume highlighting your academic achievements.
                                </p>
                                <button
                                    onClick={handleGenerateResume}
                                    disabled={isGeneratingResume}
                                    style={{
                                        padding: '1rem 2.5rem',
                                        background: 'linear-gradient(to right, #4f46e5, #6366f1)',
                                        borderRadius: '50px',
                                        border: 'none',
                                        color: '#fff',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        cursor: isGeneratingResume ? 'wait' : 'pointer',
                                        opacity: isGeneratingResume ? 0.9 : 1,
                                        boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                                    }}
                                >
                                    {isGeneratingResume ? 'Analyzing Coursework...' : 'Generate Resume Now'}
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>Generated Preview</h3>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Editable Markdown Format</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button onClick={() => setResumeContent('')} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '8px', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>Reset</button>
                                        <button style={{
                                            padding: '0.5rem 1.25rem',
                                            background: '#4f46e5',
                                            borderRadius: '8px',
                                            border: 'none',
                                            color: '#fff',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer'
                                        }}>
                                            <Download size={18} /> Download
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={resumeContent}
                                    onChange={(e) => setResumeContent(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '600px',
                                        background: '#ffffff',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '4px',
                                        padding: '2rem',
                                        color: '#334155',
                                        fontFamily: "'Courier New', Courier, monospace",
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6',
                                        resize: 'vertical',
                                        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'skills' && (
                    <motion.div key="skills" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="card-white" style={{ padding: '3rem', maxWidth: '850px', margin: '0 auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ width: '60px', height: '60px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Target size={32} style={{ color: '#4f46e5' }} />
                            </div>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#1e293b', fontWeight: '800' }}>Skill Gap Analysis</h3>
                            <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
                                Discover what skills you're missing for your dream job and get personalized course recommendations.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                            <input
                                type="text"
                                placeholder="Enter your dream job title (e.g. Data Scientist, UX Designer)"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '1rem 1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    background: '#fff',
                                    color: '#1e293b',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            />
                            <button
                                onClick={handleAnalyzeSkills}
                                disabled={loading || !targetRole}
                                style={{
                                    padding: '0 2.5rem',
                                    background: 'linear-gradient(to right, #4f46e5, #6366f1)',
                                    borderRadius: '12px',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: (loading || !targetRole) ? 'default' : 'pointer',
                                    opacity: (loading || !targetRole) ? 0.7 : 1,
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                                }}
                            >
                                {loading ? 'Analyzing...' : 'Analyze Gap'}
                            </button>
                        </div>

                        {skillAnalysis && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                                {/* ── Alignment Warning ───────────────────── */}
                                {alignmentWarning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            background: 'linear-gradient(135deg, #fffbeb, #fff7ed)',
                                            border: '2px solid #f59e0b',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <div style={{ background: '#f59e0b', color: 'white', padding: '10px', borderRadius: '12px', flexShrink: 0 }}>
                                            <AlertTriangle size={22} strokeWidth={2.5} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 0.4rem 0', color: '#92400e', fontSize: '1rem', fontWeight: '800' }}>
                                                Major–Career Alignment Gap Detected
                                            </h4>
                                            <p style={{ margin: '0 0 1rem 0', color: '#78350f', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                                Your declared major (<strong>{alignmentWarning.major}</strong>) diverges significantly from the technical requirements of <strong>{alignmentWarning.role}</strong>. This is absolutely bridgeable — many students successfully pivot with the right preparation. Start with these foundational courses:
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {alignmentWarning.bridgeCourses.map((code, i) => {
                                                    const course = Object.values(COURSE_CATALOG).find(c => c.code === code);
                                                    return (
                                                        <a
                                                            key={i}
                                                            href={`/dashboard?tab=courses&search=${code}`}
                                                            onClick={e => { e.preventDefault(); }}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                background: 'white',
                                                                border: '1.5px solid #f59e0b',
                                                                color: '#92400e',
                                                                padding: '6px 12px',
                                                                borderRadius: '20px',
                                                                fontSize: '0.82rem',
                                                                fontWeight: '700',
                                                                textDecoration: 'none',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseOver={e => { e.currentTarget.style.background = '#fffbeb'; }}
                                                            onMouseOut={e => { e.currentTarget.style.background = 'white'; }}
                                                        >
                                                            <BookOpen size={13} />
                                                            {code}{course ? ` — ${course.name}` : ''}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Skills Grid ─────────────────────────── */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                            <CheckCircle size={20} /> Skills You Have
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {skillAnalysis.acquired_skills?.map((skill, i) => (
                                                <span key={i} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
                                                    {skill}
                                                </span>
                                            ))}
                                            {(!skillAnalysis.acquired_skills || skillAnalysis.acquired_skills.length === 0) && (
                                                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No matching skills found yet.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                            <Target size={20} /> Skills You Need
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {skillAnalysis.missing_skills?.map((skill, i) => {
                                                const course = COURSE_CATALOG[skill];
                                                return course ? (
                                                    <motion.a
                                                        key={i}
                                                        whileHover={{ scale: 1.04 }}
                                                        href={`#course-${course.code}`}
                                                        onClick={e => e.preventDefault()}
                                                        title={`Take ${course.code}: ${course.name} to build this skill`}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            background: 'linear-gradient(135deg, #fff1f2, #fef2f2)',
                                                            border: '1.5px solid #fecdd3',
                                                            color: '#e11d48',
                                                            padding: '0.4rem 0.9rem',
                                                            borderRadius: '20px',
                                                            fontSize: '0.88rem',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            boxShadow: '0 2px 6px rgba(225,29,72,0.12)'
                                                        }}
                                                    >
                                                        <BookOpen size={13} />
                                                        {skill}
                                                        <span style={{ background: '#fecdd3', color: '#9f1239', padding: '1px 7px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '800', marginLeft: '2px' }}>
                                                            {course.code}
                                                        </span>
                                                    </motion.a>
                                                ) : (
                                                    <span key={i} style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
                                                        {skill}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* ── Course Recommendations ──────────── */}
                                    {skillAnalysis.missing_skills?.some(s => COURSE_CATALOG[s]) && (
                                        <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: '16px', border: '1px solid #bae6fd' }}>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', marginBottom: '1.25rem', fontSize: '1rem', fontWeight: '800' }}>
                                                <GraduationCap size={18} /> Suggested Courses from University Catalog
                                            </h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                                                {skillAnalysis.missing_skills
                                                    .filter(s => COURSE_CATALOG[s])
                                                    .map((skill, i) => {
                                                        const c = COURSE_CATALOG[skill];
                                                        return (
                                                            <motion.div
                                                                key={i}
                                                                whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(3,105,161,0.15)' }}
                                                                style={{
                                                                    background: 'white',
                                                                    borderRadius: '12px',
                                                                    padding: '1rem 1.25rem',
                                                                    border: '1px solid #bae6fd',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '12px',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                            >
                                                                <div style={{ background: '#0369a1', color: 'white', padding: '8px', borderRadius: '10px', flexShrink: 0 }}>
                                                                    <BookOpen size={16} />
                                                                </div>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{ fontWeight: '800', color: '#0c4a6e', fontSize: '0.82rem', fontFamily: 'monospace' }}>{c.code}</div>
                                                                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                                                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{c.credits} credit hours · Builds: <strong style={{ color: '#0369a1' }}>{skill}</strong></div>
                                                                </div>
                                                                <ExternalLink size={14} color="#94a3b8" />
                                                            </motion.div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Recommended Actions ─────────────── */}
                                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem', padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '700' }}>
                                            <Award size={20} color="#4f46e5" /> Recommended Actions
                                        </h4>
                                        <ul style={{ paddingLeft: '1.5rem', color: '#475569', lineHeight: '1.8', margin: 0 }}>
                                            {skillAnalysis.recommended_actions?.map((action, i) => (
                                                <li key={i} style={{ marginBottom: '0.5rem' }}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'pathways' && (
                    <motion.div key="pathways" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="card-white" style={{ padding: '3rem', maxWidth: '850px', margin: '0 auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ width: '60px', height: '60px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <BarChart2 size={32} style={{ color: '#4f46e5' }} />
                            </div>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#1e293b', fontWeight: '800' }}>AI-Powered Career Mapping</h3>
                            <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
                                See step-by-step career pathways built by our AI based on Labor Market Data (O*NET) matched to your current credits.
                            </p>
                        </div>

                        {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Labor Market Data...</div>}

                        {!loading && pathways.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {pathways.map(path => (
                                    <div key={path.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>{path.role}</h4>
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                                                    <span>💰 {path.salary_range}</span>
                                                    <span>📈 Demand: <strong style={{ color: '#10b981' }}>{path.demand}</strong></span>
                                                </div>
                                            </div>
                                            <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem' }}>
                                                {path.match}% Match
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem', background: 'white' }}>
                                            <h5 style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '1rem' }}>Your Pathway Milestones:</h5>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {path.milestones.map((milestone, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>
                                                            {idx + 1}
                                                        </div>
                                                        <div style={{ color: '#475569', lineHeight: '1.5' }}>
                                                            {milestone}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#4f46e5', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                                Explore Role <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!loading && pathways.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                                <div style={{ width: '64px', height: '64px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                                    <BarChart2 size={32} color="#6366f1" />
                                </div>
                                <h4 style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>No Career Pathways Yet</h4>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>Add courses to your profile so Aura can map AI-powered career pathways tailored to your degree.</p>
                            </div>
                        )}

                        {/* ── Alumni Success Stories ───────────────────────── */}
                        <div style={{ marginTop: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', padding: '10px', borderRadius: '14px', color: 'white' }}>
                                    <Star size={20} strokeWidth={2.5} fill="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>Alumni Success Stories</h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Real students, real outcomes — top placements from our campus</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                                {ALUMNI_STORIES.map((alum, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}
                                        style={{
                                            background: 'white',
                                            borderRadius: '20px',
                                            border: '1px solid #e2e8f0',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem',
                                            transition: 'all 0.2s',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Gradient accent bar */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(to right, ${alum.color}, ${alum.color}80)` }} />

                                        {/* Header row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '0.25rem' }}>
                                            <div style={{
                                                width: '48px', height: '48px',
                                                borderRadius: '14px',
                                                background: `${alum.color}18`,
                                                border: `2px solid ${alum.color}40`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: '900', color: alum.color, fontSize: '0.85rem',
                                                flexShrink: 0
                                            }}>
                                                {alum.avatar}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{alum.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {alum.major} · Class of {alum.grad}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Role + company + salary */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ background: `${alum.color}18`, color: alum.color, padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '800' }}>
                                                    {alum.company}
                                                </div>
                                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                                                    {alum.role}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                background: '#ecfdf5', border: '1px solid #a7f3d0',
                                                color: '#059669', padding: '4px 10px', borderRadius: '20px',
                                                fontWeight: '800', fontSize: '0.85rem'
                                            }}>
                                                <TrendingUp size={13} />
                                                {alum.salary} starting
                                            </div>
                                        </div>

                                        {/* Quote */}
                                        <div style={{
                                            background: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            borderLeft: `3px solid ${alum.color}`,
                                            fontSize: '0.85rem',
                                            color: '#475569',
                                            lineHeight: '1.6',
                                            fontStyle: 'italic'
                                        }}>
                                            "{alum.quote}"
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'events' && (
                    <motion.div key="events" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                        {/* Header Banner */}
                        <div style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '700', opacity: 0.9, marginBottom: '0.5rem' }}>
                                <Calendar size={16} /> UPCOMING EVENTS
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '900' }}>Upcoming Hiring Events</h2>
                            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.85 }}>Campus career fairs, company info sessions, and virtual networking events matched to your degree.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { id: 1, company: 'Google', type: 'Info Session', title: 'Google Campus Recruiting — SWE & PM Roles', date: 'May 6, 2026', time: '2:00 PM – 4:00 PM', format: 'In-Person', location: 'Engineering Hall, Room 201', spots: 45, logo: 'G', color: '#4285f4', tags: ['Software Engineering', 'Product Management', 'Data Science'] },
                                { id: 2, company: 'Deloitte', type: 'Career Fair', title: 'Big 4 Accounting & Consulting Recruitment Drive', date: 'May 9, 2026', time: '10:00 AM – 3:00 PM', format: 'In-Person', location: 'Student Union Ballroom', spots: 200, logo: 'D', color: '#86bc25', tags: ['Consulting', 'Finance', 'Business Analytics'] },
                                { id: 3, company: 'Amazon', type: 'Virtual', title: 'Amazon SDE Intern Info & Interview Prep', date: 'May 12, 2026', time: '6:00 PM – 7:30 PM', format: 'Virtual (Zoom)', location: 'Online', spots: 300, logo: 'A', color: '#ff9900', tags: ['Software Engineering', 'Cloud Computing', 'Operations'] },
                                { id: 4, company: 'Texas Health Resources', type: 'Hiring Fair', title: 'Healthcare & Pre-Med Networking Fair', date: 'May 15, 2026', time: '11:00 AM – 2:00 PM', format: 'In-Person', location: 'Health Sciences Building', spots: 80, logo: 'TX', color: '#e11d48', tags: ['Nursing', 'Pre-Med', 'Public Health', 'Lab Research'] },
                                { id: 5, company: 'JPMorgan Chase', type: 'Workshop', title: 'Finance & Investment Banking Career Workshop', date: 'May 19, 2026', time: '3:00 PM – 5:00 PM', format: 'Hybrid', location: 'Business School + Zoom', spots: 60, logo: 'JP', color: '#003087', tags: ['Finance', 'Banking', 'Economics'] },
                                { id: 6, company: 'General Mills', type: 'Info Session', title: 'FMCG & Supply Chain Leadership Program', date: 'May 22, 2026', time: '1:00 PM – 2:30 PM', format: 'Virtual', location: 'Online', spots: 120, logo: 'GM', color: '#0070c0', tags: ['Supply Chain', 'Marketing', 'Operations'] },
                            ].map(event => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ y: -2 }}
                                    style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex' }}
                                >
                                    {/* Color sidebar */}
                                    <div style={{ width: '6px', background: event.color, flexShrink: 0 }} />

                                    <div style={{ flex: 1, padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        {/* Logo */}
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: event.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '0.9rem', flexShrink: 0 }}>
                                            {event.logo}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                        <span style={{ background: `${event.color}18`, color: event.color, padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{event.type}</span>
                                                        <span style={{ background: event.format === 'Virtual' || event.format === 'Hybrid' ? '#f0fdf4' : '#eff6ff', color: event.format === 'Virtual' || event.format === 'Hybrid' ? '#16a34a' : '#2563eb', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}>{event.format}</span>
                                                    </div>
                                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>{event.title}</h3>
                                                </div>
                                                <button
                                                    style={{ background: event.color, color: 'white', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit', transition: 'opacity 0.2s' }}
                                                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                                                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                                                >
                                                    RSVP Now
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: '#475569', marginTop: '6px', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={13} color="#6366f1" /> {event.date}, {event.time}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={13} color="#ec4899" /> {event.location}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Users size={13} color="#10b981" /> {event.spots} spots
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                                                {event.tags.map(tag => (
                                                    <span key={tag} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600' }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Career Success Advisor button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate && onNavigate('chat', 'career-advisor')}
                style={{
                    position: 'fixed',
                    bottom: 'min(1.5rem, calc(1.5rem + env(safe-area-inset-bottom)))',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '0.85rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 25px rgba(99,102,241,0.45)',
                    cursor: 'pointer',
                    fontWeight: '800',
                    zIndex: 500,
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap'
                }}
            >
                <MessageSquare size={18} strokeWidth={2.5} />
                Chat with Career Success Advisor
            </motion.button>
        </div>
    );
};

export default CareerPathfinder;
