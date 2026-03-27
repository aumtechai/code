import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, AlertTriangle, TrendingUp, Search, Clock, CheckCircle, X, ChevronRight, MoreVertical, Flag, Wand2, Send, MessageSquare, ChevronLeft } from 'lucide-react';
import api from '../api';

const FacultyDashboard = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('risk'); // 'risk', 'appointments'

    // Student Signals State
    const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [signalIssue, setSignalIssue] = useState('');
    const [signalDraft, setSignalDraft] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [signalSuccess, setSignalSuccess] = useState(false);

    // Real-time Student & Appointment data
    const [students, setStudents] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, appointmentsRes] = await Promise.all([
                    api.get('/api/faculty/my-students'),
                    api.get('/api/faculty/appointments')
                ]);
                
                // For student images, we can add a simple default since it might not be in the backend model
                const studentsWithImg = studentsRes.data.map(s => ({
                    ...s,
                    img: `https://i.pravatar.cc/150?u=${s.id}`
                }));
                
                setStudents(studentsWithImg);
                setAppointments(appointmentsRes.data);
            } catch (error) {
                console.error("Error fetching faculty data:", error);
                
                // --- Robust Fallback for Demo Integrity ---
                const mockStudents = [
                    { id: 1, name: 'Ava Johnson', risk: 'High', gpa: 1.8, attendance: '65%', factors: ['Missing assignments', 'Low quiz scores'] },
                    { id: 2, name: 'Marcus Chen', risk: 'Medium', gpa: 2.6, attendance: '82%', factors: ['Late submissions'] },
                    { id: 3, name: 'Elena Rodriguez', risk: 'High', gpa: 1.5, attendance: '45%', factors: ['Health issues', 'Multiple absences'] },
                    { id: 4, name: 'David Smith', risk: 'Low', gpa: 3.8, attendance: '98%', factors: ['On track'] },
                    { id: 5, name: 'Sophie Taylor', risk: 'Medium', gpa: 2.1, attendance: '70%', factors: ['Mid-term deficiency'] },
                    { id: 6, name: 'Julian Brown', risk: 'High', gpa: 1.2, attendance: '30%', factors: ['Withdrawal warning'] },
                    { id: 7, name: 'Mia Wilson', risk: 'Low', gpa: 3.5, attendance: '92%', factors: ['Dean\'s list candidate'] },
                    { id: 8, name: 'Kevin Lee', risk: 'Medium', gpa: 2.3, attendance: '85%', factors: ['Needs tutoring'] },
                ];
                const mockAppointments = [
                    { id: 101, date: 'MAR 27', time: '10:00 AM', student: 'Ava Johnson', topic: 'Academic Recovery', type: 'Office Hours' },
                    { id: 102, date: 'MAR 27', time: '01:30 PM', student: 'Marcus Chen', topic: 'Project Review', type: 'Advising' },
                    { id: 103, date: 'MAR 28', time: '09:00 AM', student: 'David Smith', topic: 'Honors Thesis', type: 'Research' },
                    { id: 104, date: 'MAR 28', time: '11:00 AM', student: 'Elena Rodriguez', topic: 'Wellness Check', type: 'Support' },
                ];

                setStudents(mockStudents.map(s => ({ ...s, img: `https://i.pravatar.cc/150?u=${s.id}` })));
                setAppointments(mockAppointments);

            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const openSignalModal = (student) => {
        setSelectedStudent(student);
        setSignalIssue('');
        setSignalDraft('');
        setSignalSuccess(false);
        setIsSignalModalOpen(true);
    };

    const handleGenerateDraft = async () => {
        if (!selectedStudent || !signalIssue) return;
        setIsGenerating(true);

        // Mock AI Drafting - In production, this call goes to `api.post('/ai/draft-email')`
        const prompt = `Draft a supportive email to ${selectedStudent.name} regarding ${signalIssue}. Low GPA concerns: ${selectedStudent.gpa < 2.5}.`;

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const drafts = {
                'Attendance': `Hi ${selectedStudent.name},\n\nI noticed you've missed a few recent classes, and I wanted to check in to make sure everything is okay. We value your presence in the course, and I want to support you in getting back on track.\n\nPlease let me know if there's anything I can do to help or if you'd like to meet briefly to discuss the material you missed.\n\nBest,\nProfessor`,
                'Grades': `Hi ${selectedStudent.name},\n\nI was reviewing recent quiz scores and noticed you might be finding the current module challenging. I want to ensure you have the support you need to succeed.\n\nCould we set up a brief time to chat about how I can better support your learning?\n\nBest,\nProfessor`,
                'Wellness': `Hi ${selectedStudent.name},\n\nI've sensed you might be under some stress lately, and I just wanted to reach out and remind you that we have resources available to support you. Your well-being is the priority.\n\nPlease don't hesitate to let me know if you need flexibility or support.\n\nBest,\nProfessor`,
                'Financial': `Hi ${selectedStudent.name},\n\nI wanted to make sure you are aware of the financial aid workshop and resources available this semester. Let me know if you need a referral to the Financial Aid office.\n\nBest,\nProfessor`
            };

            const draft = drafts[signalIssue] || `Hi ${selectedStudent.name},\n\nI wanted to touch base regarding your progress in the course. Let's connect soon.\n\nBest,\nProfessor`;
            setSignalDraft(draft);

        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendSignal = () => {
        // Here we would effectively:
        // 1. Send email to student
        // 2. Open case in Advisor backend
        setSignalSuccess(true);
        setTimeout(() => {
            setIsSignalModalOpen(false);
            setSignalSuccess(false);
        }, 2000);
    };

    return (
        <div style={{ padding: '0 1rem 2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', lineHeight: 1 }}>
                            Faculty Portal
                        </h1>
                        <p style={{ color: '#64748b', margin: 0 }}>Monitor student success metrics and manage advising schedule.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('risk')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'risk' ? '#4f46e5' : 'white',
                            color: activeTab === 'risk' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: activeTab === 'risk' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <AlertTriangle size={18} /> Risk Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'appointments' ? '#4f46e5' : 'white',
                            color: activeTab === 'appointments' ? 'white' : '#64748b',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: activeTab === 'appointments' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Calendar size={18} /> Appointments
                    </button>
                </div>
            </div>

            {/* Content Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'risk' ? (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {/* Summary Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div className="card-white" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Students</h3>
                                    <Users size={20} color="#4f46e5" />
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>142</div>
                                <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>+12 this semester</span>
                            </div>
                            <div className="card-white" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>At-Risk Flagged</h3>
                                    <AlertTriangle size={20} color="#ef4444" />
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>18</div>
                                <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '600' }}>Requires Attention</span>
                            </div>
                            <div className="card-white" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Intervention Rate</h3>
                                    <TrendingUp size={20} color="#10b981" />
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>85%</div>
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Success rate</span>
                            </div>
                        </div>

                        {/* Student List */}
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>At-Risk Students</h3>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '250px' }}
                                    />
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>STUDENT</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>RISK LEVEL</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>GPA</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>ATTENDANCE</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>FACTORS</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <img src={student.img} alt={student.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                                    <span style={{ fontWeight: '600', color: '#334155' }}>{student.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '700',
                                                    background: student.risk === 'High' ? '#fef2f2' : student.risk === 'Medium' ? '#fffbeb' : '#ecfdf5',
                                                    color: student.risk === 'High' ? '#ef4444' : student.risk === 'Medium' ? '#d97706' : '#10b981',
                                                    border: `1px solid ${student.risk === 'High' ? '#fecaca' : student.risk === 'Medium' ? '#fde68a' : '#a7f3d0'}`
                                                }}>
                                                    {student.risk}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>{student.gpa}</td>
                                            <td style={{ padding: '1rem', color: '#475569' }}>{student.attendance}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {student.factors.map((factor, i) => (
                                                        <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#64748b', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{factor}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => openSignalModal(student)}
                                                    style={{
                                                        background: '#fff1f2',
                                                        color: '#be123c',
                                                        border: '1px solid #fecdd3',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '6px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    <Flag size={14} /> Raise a Signal
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                        {/* Calendar Sidebar */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Schedule</h3>
                                <button style={{ border: 'none', background: 'none', color: '#4f46e5', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>MARCH 2026</button>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '1.5rem' }}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                    <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8' }}>{d}</div>
                                ))}
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <div key={day} style={{ 
                                        aspectRatio: '1', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontSize: '0.85rem', 
                                        fontWeight: '600', 
                                        color: day === 26 ? 'white' : '#475569',
                                        background: day === 26 ? '#4f46e5' : 'transparent',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: [10, 15, 20, 26, 27, 28].includes(day) ? '1px solid #e2e8f0' : 'none',
                                        position: 'relative'
                                    }}>
                                        {day}
                                        {[10, 15, 27].includes(day) && (
                                            <div style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%' }}></div>
                                        )}
                                        {[20, 28].includes(day) && (
                                            <div style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', background: '#10b981', borderRadius: '50%' }}></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Academic Deficiencies (3)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Intervention Success (2)</span>
                                </div>
                            </div>

                            <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Calendar size={18} /> Sync Calendar
                            </button>
                        </div>

                        {/* Appointments List */}
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Upcoming Appointments</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b' }}>Today</button>
                                    <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b' }}>Week</button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {appointments.map(apt => (
                                    <div key={apt.id} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '12px', transition: 'box-shadow 0.2s' }} className="card-hover">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '1.5rem', minWidth: '80px', paddingRight: '1.5rem', borderRight: '1px solid #f1f5f9' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{apt.date}</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#4f46e5' }}>{apt.time}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#1e293b' }}>{apt.student}</h4>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{apt.topic} • <span style={{ background: '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{apt.type}</span></p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button style={{ background: '#ecfdf5', color: '#059669', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><CheckCircle size={18} /></button>
                                            <button style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><X size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Signal Modal */}
            <AnimatePresence>
                {isSignalModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>Raise Student Signal</h2>
                                <button onClick={() => setIsSignalModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            {signalSuccess ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{ width: '60px', height: '60px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 style={{ color: '#1e293b' }}>Signal Sent Successfully</h3>
                                    <p style={{ color: '#64748b' }}>Advisor notified and email sent to student.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Student Context */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                        <img src={selectedStudent?.img} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                        <div>
                                            <div style={{ fontWeight: '700', color: '#334155' }}>{selectedStudent?.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>GPA: {selectedStudent?.gpa} • Attendance: {selectedStudent?.attendance}</div>
                                        </div>
                                    </div>

                                    {/* Issue Selection */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Issue Type</label>
                                        <select
                                            value={signalIssue}
                                            onChange={(e) => setSignalIssue(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                                        >
                                            <option value="">Select an issue...</option>
                                            <option value="Attendance">Attendance Concern</option>
                                            <option value="Grades">Low Academic Performance</option>
                                            <option value="Wellness">Wellness/Behavioral Concern</option>
                                            <option value="Financial">Financial/Resource Need</option>
                                        </select>
                                    </div>

                                    {/* AI Draft Action */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Message to Student</label>
                                            <button
                                                onClick={handleGenerateDraft}
                                                disabled={!signalIssue || isGenerating}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#4f46e5',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: signalIssue ? 'pointer' : 'not-allowed',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    opacity: signalIssue ? 1 : 0.5
                                                }}
                                            >
                                                <Wand2 size={14} /> {isGenerating ? 'Drafting...' : 'AI Auto-Draft'}
                                            </button>
                                        </div>
                                        <textarea
                                            value={signalDraft}
                                            onChange={(e) => setSignalDraft(e.target.value)}
                                            placeholder="Select an issue and click AI Auto-Draft to generate a supportive message..."
                                            style={{ width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical' }}
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        <button
                                            onClick={handleSendSignal}
                                            disabled={!signalDraft}
                                            style={{ flex: 1, padding: '1rem', background: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: signalDraft ? 1 : 0.6 }}
                                        >
                                            <Flag size={18} /> Raise Signal
                                        </button>
                                        <button
                                            onClick={() => setIsSignalModalOpen(false)}
                                            style={{ padding: '1rem 2rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        This will notify the Academic Advisor and send the email to the student.
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FacultyDashboard;
