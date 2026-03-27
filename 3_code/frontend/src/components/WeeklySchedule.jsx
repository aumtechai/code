import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const WeeklySchedule = ({ onBack }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

    const classes = [
        { day: 'Monday', start: '09:00 AM', end: '10:15 AM', name: 'Intro to Computer Science', code: 'CS101', room: 'Gates Hall 302', tutor: 'Dr. Sarah Chen', color: '#6366f1' },
        { day: 'Wednesday', start: '09:00 AM', end: '10:15 AM', name: 'Intro to Computer Science', code: 'CS101', room: 'Gates Hall 302', tutor: 'Dr. Sarah Chen', color: '#6366f1' },
        { day: 'Monday', start: '01:00 PM', end: '02:30 PM', name: 'Business Ethics', code: 'BUS210', room: 'Business West 104', tutor: 'Prof. Mark Thompson', color: '#ec4899' },
        { day: 'Wednesday', start: '01:00 PM', end: '02:30 PM', name: 'Business Ethics', code: 'BUS210', room: 'Business West 104', tutor: 'Prof. Mark Thompson', color: '#ec4899' },
        { day: 'Tuesday', start: '10:30 AM', end: '12:00 PM', name: 'Calculus II', code: 'MATH202', room: 'Science Annex 20', tutor: 'Dr. James Wilson', color: '#10b981' },
        { day: 'Thursday', start: '10:30 AM', end: '12:00 PM', name: 'Calculus II', code: 'MATH202', room: 'Science Annex 20', tutor: 'Dr. James Wilson', color: '#10b981' },
        { day: 'Friday', start: '11:00 AM', end: '12:00 PM', name: 'University Seminar', code: 'UNIV101', room: 'Student Union 205', tutor: 'Dean Garrett', color: '#f59e0b' },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Weekly Schedule</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', color: '#64748b' }}>
                        <Filter size={18} /> Filters
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}>
                        <Calendar size={18} /> sync to Calendar
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="card-white" style={{ padding: '0', overflowX: 'auto', border: '1px solid #e2e8f0' }}>
                <div style={{ minWidth: '800px' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ padding: '1rem' }}></div>
                        {days.map(day => (
                            <div key={day} style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#1e293b', borderLeft: '1px solid #e2e8f0' }}>
                                {day}
                                <div style={{ fontWeight: '400', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Oct 24</div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline */}
                    <div style={{ position: 'relative' }}>
                        {timeSlots.map((time, idx) => (
                            <div key={time} style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', height: '80px', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textAlign: 'right', borderRight: '1px solid #f1f5f9' }}>
                                    {time}
                                </div>
                                {days.map(day => {
                                    const classInfo = classes.find(c => c.day === day && c.start === time);
                                    return (
                                        <div key={day} style={{ position: 'relative', borderLeft: '1px solid #f1f5f9' }}>
                                            {classInfo && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '4px',
                                                        left: '4px',
                                                        right: '4px',
                                                        height: '150px', // Spans multiple hours usually
                                                        background: `${classInfo.color}15`,
                                                        borderLeft: `4px solid ${classInfo.color}`,
                                                        borderRadius: '8px',
                                                        padding: '12px',
                                                        zIndex: 10,
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                    }}
                                                >
                                                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: classInfo.color, marginBottom: '4px' }}>{classInfo.name}</div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>{classInfo.code}</div>
                                                    
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#64748b' }}>
                                                            <Clock size={12} /> {classInfo.start} - {classInfo.end}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#64748b' }}>
                                                            <MapPin size={12} /> {classInfo.room}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#64748b' }}>
                                                            <User size={12} /> {classInfo.tutor}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend / Info */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#6366f1', borderRadius: '3px' }}></div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Science & Tech</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#ec4899', borderRadius: '3px' }}></div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Business & Arts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }}></div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Mathematics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px' }}></div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Student Life</span>
                </div>
            </div>
        </div>
    );
};

export default WeeklySchedule;
