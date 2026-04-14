import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Filter, AlertCircle, CheckCircle, Clock4 } from 'lucide-react';
import api from '../api';

const WeeklySchedule = ({ onBack }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/api/calendar/events');
            setEvents(res.data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const classes = [
        { day: 'Monday', start: '09:00 AM', end: '10:15 AM', name: 'Intro to Computer Science', code: 'CS101', room: 'Gates Hall 302', tutor: 'Dr. Sarah Chen', color: '#6366f1' },
        { day: 'Wednesday', start: '09:00 AM', end: '10:15 AM', name: 'Intro to Computer Science', code: 'CS101', room: 'Gates Hall 302', tutor: 'Dr. Sarah Chen', color: '#6366f1' },
        { day: 'Monday', start: '01:00 PM', end: '02:30 PM', name: 'Business Ethics', code: 'BUS210', room: 'Business West 104', tutor: 'Prof. Mark Thompson', color: '#ec4899' },
        { day: 'Wednesday', start: '01:00 PM', end: '02:30 PM', name: 'Business Ethics', code: 'BUS210', room: 'Business West 104', tutor: 'Prof. Mark Thompson', color: '#ec4899' },
        { day: 'Tuesday', start: '10:30 AM', end: '12:00 PM', name: 'Calculus II', code: 'MATH202', room: 'Science Annex 20', tutor: 'Dr. James Wilson', color: '#10b981' },
        { day: 'Thursday', start: '10:30 AM', end: '12:00 PM', name: 'Calculus II', code: 'MATH202', room: 'Science Annex 20', tutor: 'Dr. James Wilson', color: '#10b981' },
        { day: 'Friday', start: '09:00 AM', end: '11:00 AM', name: 'Chemistry Lab', code: 'CHEM101', room: 'Lab Hall 5', tutor: 'Dr. Robert Fox', color: '#6366f1' },
    ];

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                        onClick={onBack} 
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569', fontWeight: '700' }}
                    >
                        <ChevronLeft size={20} strokeWidth={3} /> Back
                    </button>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Academic Master Schedule</h2>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1000 ? '1fr 350px' : '1fr', gap: '2rem' }}>
                
                {/* Main Schedule */}
                <div className="card-white" style={{ padding: '0', overflowX: 'auto', border: '1px solid #e2e8f0' }}>
                    <div style={{ minWidth: '800px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ padding: '1rem' }}></div>
                            {days.map(day => (
                                <div key={day} style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1e293b', borderLeft: '1px solid #e2e8f0' }}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div style={{ position: 'relative' }}>
                            {timeSlots.map((time, idx) => (
                                <div key={time} style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', height: '100px', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textAlign: 'right', borderRight: '1px solid #f1f5f9' }}>
                                        {time}
                                    </div>
                                    {days.map(day => {
                                        const classInfo = classes.find(c => c.day === day && c.start === time);
                                        return (
                                            <div key={day} style={{ position: 'relative', borderLeft: '1px solid #f1f5f9' }}>
                                                {classInfo && (
                                                    <div style={{ position: 'absolute', inset: '4px', background: `${classInfo.color}15`, borderLeft: `4px solid ${classInfo.color}`, borderRadius: '8px', padding: '8px', zIndex: 5 }}>
                                                        <div style={{ fontWeight: '800', fontSize: '0.8rem', color: classInfo.color }}>{classInfo.code}</div>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1e293b' }}>{classInfo.name}</div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Extracted Deadlines Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card-white" style={{ background: '#fefce8', border: '1px solid #fde047' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: '800', margin: '0 0 1rem 0', color: '#854d0e' }}>
                            <AlertCircle size={20} /> AI Syllabus Deadlines
                        </h3>
                        {events.length === 0 ? (
                            <p style={{ fontSize: '0.9rem', color: '#a16207' }}>No deadlines found. Scan a syllabus in the Courses tab to populate this list.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {events.slice(0, 10).map(ev => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={ev.id} 
                                        style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #fef08a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: ev.event_type === 'exam' ? '#fee2e2' : '#dcfce7', color: ev.event_type === 'exam' ? '#991b1b' : '#166534' }}>
                                                {ev.event_type?.toUpperCase()}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>
                                                {new Date(ev.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{ev.title}</div>
                                        {ev.description && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{ev.description}</div>}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card-white" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', border: 'none' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '800' }}>Smart Prep Suggestion</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                            Based on your upcoming {events[0]?.title || 'assignments'}, Aura recommends starting a study session for Chapter 4 this evening.
                        </p>
                        <button style={{ marginTop: '1rem', width: '100%', padding: '10px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                            Plan Study Session
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WeeklySchedule;
