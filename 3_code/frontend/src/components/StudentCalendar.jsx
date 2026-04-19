import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
    Plus, Clock, MapPin, Tag, X, Filter, Bell,
    CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const StudentCalendar = ({ onBack }) => {
    const [view, setView] = useState('month'); // 'day', 'week', 'month'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/calendar/events');
            setEvents(res.data);
        } catch (err) {
            console.error("Failed to fetch events", err);
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderHeader = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} style={navBtnStyle}><ChevronLeft size={20} /></button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', width: '200px', textAlign: 'center' }}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} style={navBtnStyle}><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                    {['day', 'week', 'month'].map(v => (
                        <button 
                            key={v}
                            onClick={() => setView(v)}
                            style={{
                                border: 'none',
                                background: view === v ? 'white' : 'transparent',
                                color: view === v ? '#4f46e5' : '#64748b',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                boxShadow: view === v ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => setShowAddModal(true)}
                    style={{
                        background: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
                    }}
                >
                    <Plus size={20} /> Add Event
                </button>
            </div>
        );
    };

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const numDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} style={dayBoxStyleEmpty}></div>);
        }

        // Days of the month
        for (let d = 1; d <= numDays; d++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.event_date.startsWith(dateStr));
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

            days.push(
                <div key={d} style={{ ...dayBoxStyle, borderTop: isToday ? '3px solid #4f46e5' : '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '800', color: isToday ? '#4f46e5' : '#1e293b', fontSize: '0.9rem' }}>{d}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                        {dayEvents.map((evt, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedEvent(evt)}
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    background: getEventColor(evt.event_type),
                                    color: 'white',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {evt.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} style={{ background: '#f8fafc', padding: '12px', textAlign: 'center', fontWeight: '800', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{d}</div>
                ))}
                {days}
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>Student Life Calendar</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>Sync your academic deadlines, study groups, and campus events.</p>
            </div>

            <div className="card-white" style={{ padding: '2rem' }}>
                {renderHeader()}
                {view === 'month' ? renderMonthView() : (
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                        <div style={{ textAlign: 'center' }}>
                            <CalendarIcon size={48} color="#94a3b8" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontWeight: '700', color: '#64748b' }}>{view.charAt(0).toUpperCase() + view.slice(1)} view coming soon</h3>
                        </div>
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <div style={modalOverlayStyle} onClick={() => setSelectedEvent(null)}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card-white" 
                            style={{ width: '400px', padding: '2rem', borderRadius: '24px' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: getEventColor(selectedEvent.event_type), padding: '8px 16px', borderRadius: '20px', color: 'white', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                    {selectedEvent.event_type}
                                </div>
                                <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24} /></button>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>{selectedEvent.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#475569' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Clock size={20} color="#6366f1" /> {new Date(selectedEvent.event_date).toLocaleDateString()}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MapPin size={20} color="#6366f1" /> Campus Center / Mixed</div>
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#64748b', marginTop: '0.5rem' }}>
                                    {selectedEvent.description || "No specific details provided for this event. Check EdNex for syllabus links or room numbers."}
                                </div>
                            </div>
                            <button style={{ width: '100%', marginTop: '2rem', padding: '14px', borderRadius: '12px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '700', cursor: 'pointer' }}>Edit Event</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const getEventColor = (type) => {
    switch (type) {
        case 'exam': return '#ef4444';
        case 'assignment': return '#f59e0b';
        case 'quiz': return '#6366f1';
        case 'holiday': return '#10b981';
        default: return '#64748b';
    }
};

const navBtnStyle = {
    background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', width: '36px', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b'
};

const dayBoxStyle = {
    background: 'white', height: '120px', padding: '12px', display: 'flex', flexDirection: 'column'
};

const dayBoxStyleEmpty = {
    background: '#f8fafc', height: '120px'
};

const modalOverlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

export default StudentCalendar;
