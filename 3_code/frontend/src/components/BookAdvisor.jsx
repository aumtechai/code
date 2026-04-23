import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

const DIVISION_CONFIG = {
    tutor: {
        title: 'Academic Tutoring Appointment',
        subtitle: 'Connect with a subject-matter tutor for 1-on-1 academic support.',
        defaultReason: 'I need help understanding course material and would like a 1-on-1 tutoring session.',
        badge: '🎓',
        color: '#8b5cf6'
    },
    admin: {
        title: 'Registrar Office Appointment',
        subtitle: 'Schedule a session with the Registrar for forms, enrollment, or records questions.',
        defaultReason: 'I have a question about registration, enrollment, or official records.',
        badge: '🏛️',
        color: '#0369a1'
    },
    fafsa: {
        title: 'Financial Aid Office Appointment',
        subtitle: 'Meet with a financial aid specialist for FAFSA, scholarships, or loan guidance.',
        defaultReason: 'I need assistance with my financial aid application or funding questions.',
        badge: '💰',
        color: '#b45309'
    },
    coach: {
        title: 'Wellness Counseling Appointment',
        subtitle: 'Schedule a confidential session with a licensed wellness counselor.',
        defaultReason: 'I would like to speak with a counselor about my mental health and well-being.',
        badge: '🧠',
        color: '#16a34a'
    },
    strategist: {
        title: 'Academic Advisor Appointment',
        subtitle: 'Get strategic guidance on grade recovery, retake options, and degree planning.',
        defaultReason: 'I want to discuss grade recovery options and academic planning strategies.',
        badge: '📊',
        color: '#dc2626'
    },
    'career-advisor': {
        title: 'Career Counseling Appointment',
        subtitle: 'Meet your Career Counselor for job search strategy, resume review, or internship guidance.',
        defaultReason: 'I need help with my career planning, job search strategy, or internship applications.',
        badge: '💼',
        color: '#6366f1'
    },
};

const BookAdvisor = ({ onBack, advisorDivision }) => {
    const [advisorList, setAdvisorList] = useState([]);
    const [loadingAdvisors, setLoadingAdvisors] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const divisionCfg = advisorDivision && DIVISION_CONFIG[advisorDivision] ? DIVISION_CONFIG[advisorDivision] : null;

    const [formData, setFormData] = useState({
        advisor_name: '',
        date: '',
        time: '',
        reason: divisionCfg ? divisionCfg.defaultReason : ''
    });
    const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
    const [responseMsg, setResponseMsg] = useState('');

    useEffect(() => {
        const fetchAdvisors = async () => {
            setLoadingAdvisors(true);
            try {
                const response = await api.get('/api/advisors');
                setAdvisorList(response.data);
                setFetchError(null);
            } catch (error) {
                console.error("Failed to fetch advisors", error);
                setFetchError("Unable to load advisors at this time.");
            } finally {
                setLoadingAdvisors(false);
            }
        };
        fetchAdvisors();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdvisorSelect = (name) => {
        setFormData(prev => ({ ...prev, advisor_name: name }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await api.post('/api/schedule/book', formData);

            setStatus('success');
            setResponseMsg(response.data.details || 'Appointment Confirmed!');
        } catch (error) {
            setStatus('error');
            setResponseMsg(error.response?.data?.detail || 'Failed to book appointment.');
        }
    };

    if (status === 'success') {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ background: '#dcfce7', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <CheckCircle size={64} color="#16a34a" />
                </motion.div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Booking Confirmed!</h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2rem' }}>
                    {responseMsg}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => { setStatus(null); setFormData({ advisor_name: '', date: '', time: '', reason: '' }); }}

                        style={{ padding: '12px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                        Book Another
                    </button>
                    <button
                        onClick={onBack}
                        style={{ padding: '12px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                <div>
                    {divisionCfg && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: `${divisionCfg.color}15`,
                            color: divisionCfg.color,
                            border: `1px solid ${divisionCfg.color}30`,
                            borderRadius: '20px', padding: '3px 12px',
                            fontSize: '0.75rem', fontWeight: '800',
                            marginBottom: '6px'
                        }}>
                            {divisionCfg.badge} {divisionCfg.title.split(' ')[0]} Division
                        </div>
                    )}
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>
                        {divisionCfg ? divisionCfg.title : 'Advisor Booking'}
                    </h2>
                    <p style={{ color: '#64748b', margin: 0 }}>
                        {divisionCfg ? divisionCfg.subtitle : 'Schedule a session with your academic advisor.'}
                    </p>
                </div>
            </div>

            <div className="card-white">

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>

                        {/* Advisor Selection */}
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#1e293b' }}>Select Advisor</label>

                            {loadingAdvisors && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading advisors...</div>
                            )}

                            {fetchError && (
                                <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem' }}>
                                    {fetchError}
                                </div>
                            )}

                            {!loadingAdvisors && !fetchError && advisorList.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
                                    No advisors are currently available.
                                </div>
                            )}

                            {!loadingAdvisors && advisorList.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {advisorList.map(advisor => (
                                        <div
                                            key={advisor.id}
                                            onClick={() => handleAdvisorSelect(advisor.name)}
                                            style={{
                                                padding: '1rem',
                                                border: `2px solid ${formData.advisor_name === advisor.name ? '#4f46e5' : '#e2e8f0'}`,
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                background: formData.advisor_name === advisor.name ? '#eef2ff' : 'white',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ fontWeight: '600' }}>{advisor.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{advisor.availability}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#4f46e5', marginTop: '4px' }}>{advisor.specialty}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Date and Time */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#1e293b' }}>Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#1e293b' }}>Time</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#1e293b' }}>Reason for Meeting</label>
                            <textarea
                                name="reason"
                                rows="3"
                                placeholder="e.g., Discussing course options for next semester..."
                                value={formData.reason}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit' }}
                            />
                        </div>

                        {/* Submit */}
                        <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="submit"
                                disabled={status === 'loading' || !formData.advisor_name}
                                style={{
                                    background: '#4f46e5',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: formData.advisor_name ? 'pointer' : 'not-allowed',
                                    opacity: formData.advisor_name ? 1 : 0.6
                                }}>
                                {status === 'loading' ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                        </div>

                    </div>
                    {status === 'error' && (
                        <div style={{ marginTop: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={18} /> {responseMsg}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BookAdvisor;
