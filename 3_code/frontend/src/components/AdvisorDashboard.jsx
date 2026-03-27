import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Calendar, AlertTriangle, CheckCircle, 
    Search, Clock, MessageSquare, ChevronRight, 
    Plus, Filter, Mail, Phone, MapPin, ChevronLeft
} from 'lucide-react';
import api from '../api';

const AdvisorDashboard = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('students'); // 'students', 'appointments', 'cases'
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdvisorData = async () => {
            setLoading(true);
            try {
                const [studRes, apptRes] = await Promise.all([
                    api.get('/api/advisor/students'),
                    api.get('/api/advisor/appointments')
                ]);
                setStudents(studRes.data);
                setAppointments(apptRes.data);
            } catch (err) {
                console.error("Advisor Data Fetch Failed:", err);
                
                // Fallback for Demo Integrity
                const mockStuds = [
                    { id: 101, name: 'Jordan Miller', major: 'CompSci', gpa: 3.2, risk: 'low', last_met: "2w ago" },
                    { id: 102, name: 'Sarah Thompson', major: 'Nursing', gpa: 2.4, risk: 'medium', last_met: "Never" },
                    { id: 103, name: 'Alex Rivera', major: 'Business', gpa: 1.8, risk: 'high', last_met: "1mo ago" }
                ];
                const mockAppts = [
                    { time: "10:00 AM", student: "Jordan Miller", type: "Planning", status: "Ready" },
                    { time: "11:15 AM", student: "Alex Rivera", type: "Academy Recovery", status: "Critical" }
                ];
                setStudents(mockStuds);
                setAppointments(mockAppts);

            } finally {
                setIsLoading(false);
            }
        };
        fetchAdvisorData();
    }, []);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', margin: 0, letterSpacing: '-0.025em' }}>Advisor Case Center</h1>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: '0.25rem 0 0 0' }}>Managing success for 142 assigned students.</p>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
                        <Plus size={18} /> New Appointment
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <QuickStat label="Today's Meetings" value={appointments.length} icon={Calendar} color="#4f46e5" />
                <QuickStat label="At-Risk Alerts" value="12" icon={AlertTriangle} color="#ef4444" />
                <QuickStat label="Cases Resolved" value="48" icon={CheckCircle} color="#10b981" />
                <QuickStat label="Pending Graduation" value="18" icon={Users} color="#f59e0b" />
            </div>

            {/* Main Tabs */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '2px solid #f1f5f9' }}>
                <Tab active={activeTab === 'students'} onClick={() => setActiveTab('students')} label="My Students" count={students.length} />
                <Tab active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} label="Schedule" count={appointments.length} />
                <Tab active={activeTab === 'cases'} onClick={() => setActiveTab('cases')} label="Open Cases" count="4" />
            </div>

            {/* Tab Content */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {activeTab === 'students' && (
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '400px' }}>
                                <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} size={20} />
                                <input 
                                    placeholder="Search by name, ID, or major..." 
                                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '500', fontSize: '0.95rem' }} 
                                />
                            </div>
                            <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                        
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Major</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Academic Health</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Touchpoint</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#fcfdff'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '800', color: '#1e293b' }}>{student.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {student.id}934</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#475569' }}>{student.major}</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: student.risk === 'low' ? '#10b981' : student.risk === 'medium' ? '#f59e0b' : '#ef4444' }}></div>
                                                <span style={{ fontWeight: '700', color: student.risk === 'low' ? '#059669' : student.risk === 'medium' ? '#d97706' : '#dc2626' }}>
                                                    {student.gpa.toFixed(1)} GPA
                                                </span>
                                                {student.alert && (
                                                    <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>{student.alert}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>{student.last_met}</td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <button style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: '700', color: '#64748b', cursor: 'pointer' }}>Manage Case</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                        <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Daily Schedule</h3>
                                <span style={{ fontWeight: '700', color: '#64748b' }}>Thursday, March 26, 2026</span>
                             </div>
                             
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {appointments.map((app, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', position: 'relative' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px', borderRight: '1px solid #e2e8f0', paddingRight: '1rem' }}>
                                            <span style={{ fontWeight: '900', color: '#1e293b' }}>{app.time.split(' ')[0]}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8' }}>{app.time.split(' ')[1]}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '800', color: '#1e293b' }}>{app.student}</span>
                                                <span style={{ fontSize: '0.7rem', background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>{app.status.toUpperCase()}</span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>{app.type}</div>
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '12px' }}>
                                                 <button style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>Launch Meeting</button>
                                                 <button style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>View Profile</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                             <div style={{ background: '#0f172a', borderRadius: '24px', padding: '2rem', color: 'white' }}>
                                <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.7 }}>Aura Insight</h4>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.6, fontWeight: '500' }}>
                                    3 students you haven't seen this semester are currently in the "High Risk" category due to mid-term exam signals.
                                </p>
                                <button style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: '#4f46e5', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                                    Batch Notify via Aura
                                </button>
                             </div>

                             <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', flex: 1 }}>
                                <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: '800', color: '#1e293b' }}>Upcoming Deadlines</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <DeadlineItem date="Mar 28" title="Mid-term Deficiency Submissions" desc="All D/F signals must be entered for freshman." />
                                    <DeadlineItem date="Apr 02" title="Graduation Application Deadline" desc="Final check for Spring candidates." />
                                    <DeadlineItem date="Apr 15" title="Fall Course Catalog Review" desc="Submit section requests to Dean's office." />
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const QuickStat = ({ label, value, icon: Icon, color }) => (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ background: `${color}15`, width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={28} />
        </div>
        <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>{label}</div>
        </div>
    </div>
);

const Tab = ({ active, onClick, label, count }) => (
    <button 
        onClick={onClick}
        style={{ 
            background: 'none', 
            border: 'none', 
            padding: '1rem 0.5rem', 
            fontSize: '1.1rem', 
            fontWeight: active ? '800' : '600', 
            color: active ? '#4f46e5' : '#94a3b8', 
            cursor: 'pointer', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
        {label}
        {count && <span style={{ fontSize: '0.75rem', background: active ? '#eef2ff' : '#f8fafc', color: active ? '#4f46e5' : '#94a3b8', padding: '2px 8px', borderRadius: '10px', border: active ? '1px solid #4f46e530' : '1px solid #e2e8f0' }}>{count}</span>}
        {active && <motion.div layoutId="activeTab" style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '4px', background: '#4f46e5', borderRadius: '2px' }} />}
    </button>
);

const DeadlineItem = ({ date, title, desc }) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#4f46e5' }}>{date.split(' ')[1]}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{date.split(' ')[0]}</div>
        </div>
        <div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b', marginBottom: '2px' }}>{title}</div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>{desc}</p>
        </div>
    </div>
);

export default AdvisorDashboard;
