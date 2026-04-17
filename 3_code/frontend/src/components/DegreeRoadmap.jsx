import React, { useState, useEffect } from 'react';
import { Book, CheckCircle, Circle, AlertCircle, Calendar, ChevronRight, Wand2, Download, Trash2, Plus, ChevronLeft, RefreshCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const SubstitutionModal = ({ course, onClose, onSubstitute }) => {
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            if (course.type === 'Major') {
                setSuggestions([
                    { code: `${course.code.split(' ')[0]} 299`, name: 'Special Topics in ' + course.code.split(' ')[0], credits: course.credits },
                    { code: `${course.code.split(' ')[0]} 490`, name: 'Independent Study', credits: course.credits }
                ]);
            } else {
                setSuggestions([
                    { code: 'PHIL 101', name: 'Intro to Philosophy', credits: 3 },
                    { code: 'SOC 101', name: 'Intro to Sociology', credits: 3 },
                    { code: 'ENG 202', name: 'Advanced Composition', credits: 3 }
                ]);
            }
            setLoading(false);
        }, 800);
    }, [course]);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-white" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Course Substitution</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Substitute options for {course.code}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                </div>
                
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: '#6366f1' }}>
                        <RefreshCcw size={24} className="animate-spin" />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {suggestions.map((s, i) => (
                            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{s.code}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.name}</div>
                                </div>
                                <button 
                                    onClick={() => onSubstitute(course, s)}
                                    style={{ background: '#4f46e5', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                >
                                    Select
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const DegreeRoadmap = ({ onBack }) => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [substitutingCourse, setSubstitutingCourse] = useState(null);
    const [audit, setAudit] = useState([
        { id: 'cs101', code: 'CS 101', name: 'Intro to Programming', credits: 4, type: 'Major', status: 'pending' },
        { id: 'math101', code: 'MATH 101', name: 'Calculus I', credits: 4, type: 'Core', status: 'pending' },
        { id: 'eng101', code: 'ENG 101', name: 'College Writing', credits: 3, type: 'GenEd', status: 'pending' },
        { id: 'cs102', code: 'CS 102', name: 'Data Structures', credits: 4, type: 'Major', status: 'pending' },
        { id: 'math102', code: 'MATH 102', name: 'Calculus II', credits: 4, type: 'Core', status: 'pending' },
        { id: 'phys101', code: 'PHYS 101', name: 'Physics I', credits: 4, type: 'GenEd', status: 'pending' },
        { id: 'cs201', code: 'CS 201', name: 'Algorithms', credits: 3, type: 'Major', status: 'pending', prereq: 'cs102' },
        { id: 'cs202', code: 'CS 202', name: 'Computer Org', credits: 3, type: 'Major', status: 'pending' },
        { id: 'hist101', code: 'HIST 101', name: 'World History', credits: 3, type: 'GenEd', status: 'pending' },
        { id: 'art101', code: 'ART 101', name: 'Art Appreciation', credits: 3, type: 'Elective', status: 'pending' },
    ]);

    const [plan, setPlan] = useState({
        'Fall 2024': [],
        'Spring 2025': [],
        'Fall 2025': [],
        'Spring 2026': [],
        'Fall 2026': [],
        'Spring 2027': [],
    });

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await api.get('/api/courses');
                const userCourses = res.data;
                const newPlan = { ...plan };
                
                setAudit(prev => {
                    const nextAudit = [...prev];
                    userCourses.forEach(uc => {
                        const reqIndex = nextAudit.findIndex(r => r.code === uc.code || r.name === uc.name);
                        let cid = `user_${uc.id}`;
                        if (reqIndex >= 0) {
                            nextAudit[reqIndex].status = 'completed';
                            cid = nextAudit[reqIndex].id;
                        } else {
                            nextAudit.push({
                                id: cid, code: uc.code, name: uc.name, credits: uc.credits, type: 'Elective', status: 'completed'
                            });
                        }
                        
                        // Place course into plan
                        const targetSem = uc.semester && newPlan[uc.semester] ? uc.semester : Object.keys(newPlan)[0];
                        if (!newPlan[targetSem].includes(cid)) {
                            newPlan[targetSem].push(cid);
                        }
                    });
                    setPlan(newPlan);
                    return nextAudit;
                });
            } catch(e) {
                console.error("Failed to fetch SIS enrollments", e);
            }
        };
        fetchEnrollments();
    }, []);

    // Helpers
    const getCourse = (id) => audit.find(c => c.id === id);
    const getSemesterCredits = (sem) => plan[sem].map(id => getCourse(id).credits).reduce((a, b) => a + b, 0);

    const handleAutoPlan = () => {
        setIsGenerating(true);
        // Simulate AI thinking
        setTimeout(() => {
            setPlan({
                'Fall 2024': ['cs101', 'math101', 'eng101'],
                'Spring 2025': ['cs102', 'math102', 'phys101', 'hist101'],
                'Fall 2025': ['cs201', 'cs202', 'art101'],
                'Spring 2026': [],
                'Fall 2026': [],
                'Spring 2027': [],
            });
            setIsGenerating(false);
        }, 1500);
    };

    const moveCourse = (courseId, targetSemester) => {
        // Remove from current pos (if any)
        const newPlan = { ...plan };
        Object.keys(newPlan).forEach(sem => {
            newPlan[sem] = newPlan[sem].filter(id => id !== courseId);
        });

        // Add to new pos
        if (targetSemester) {
            newPlan[targetSemester].push(courseId);
        }
        setPlan(newPlan);
        setSelectedCourse(null);
    };

    const handleSubstitute = (oldCourse, newCourseData) => {
        setAudit(prev => prev.map(c => 
            c.id === oldCourse.id ? { ...c, code: newCourseData.code, name: newCourseData.name } : c
        ));
        setSubstitutingCourse(null);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', margin: 0 }}>Degree Roadmap</h1>
                        <p style={{ color: '#64748b', margin: 0 }}>Visualize your path to graduation. Drag and drop courses to plan your semesters.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleAutoPlan}
                        disabled={isGenerating}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {isGenerating ? 'AI Generating...' : <><Wand2 size={18} /> AI Auto-Plan</>}
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' }}
                    >
                        <Download size={18} /> Export PDF
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', height: '100%', minHeight: '600px' }}>
                {/* Sidebar: Degree Requirements */}
                <div style={{ flex: '0 0 300px', background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Book size={20} className="text-primary" /> Requirements
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
                        {['Core', 'Major', 'GenEd', 'Elective'].map(type => (
                            <div key={type}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{type}</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {audit.filter(c => c.type === type).map(course => {
                                        const isPlanned = Object.values(plan).flat().includes(course.id);
                                        return (
                                            <div
                                                key={course.id}
                                                onClick={() => !isPlanned && setSelectedCourse(course)}
                                                style={{
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid',
                                                    borderColor: isPlanned ? '#e2e8f0' : (selectedCourse?.id === course.id ? '#6366f1' : '#e2e8f0'),
                                                    background: isPlanned ? '#f8fafc' : 'white',
                                                    opacity: isPlanned ? 0.6 : 1,
                                                    cursor: isPlanned ? 'default' : 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{course.code}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{course.name}</div>
                                                    </div>
                                                    {isPlanned ? <CheckCircle size={16} color="#10b981" /> : 
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>{course.credits} Cr</div>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setSubstitutingCourse(course); }}
                                                            style={{ padding: '2px 6px', fontSize: '0.7rem', background: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}
                                                        >Sub</button>
                                                    </div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main: Semester Grid */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', alignContent: 'start', overflowY: 'auto' }}>
                    {Object.entries(plan).map(([semester, courseIds]) => (
                        <div
                            key={semester}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{semester}</h3>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: getSemesterCredits(semester) > 18 ? '#ef4444' : '#64748b' }}>
                                    {getSemesterCredits(semester)} Credits
                                </span>
                            </div>

                            {/* Course List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '100px' }}>
                                {courseIds.map(id => {
                                    const c = getCourse(id);
                                    return (
                                        <div key={id} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>{c.code}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.name}</div>
                                            </div>
                                            <button
                                                onClick={() => moveCourse(id, null)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                                            >
                                                <XIcon size={14} />
                                            </button>
                                        </div>
                                    )
                                })}

                                {courseIds.length === 0 && (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
                                        Empty
                                    </div>
                                )}
                            </div>

                            {/* Drop Zone Action */}
                            {selectedCourse && (
                                <button
                                    onClick={() => moveCourse(selectedCourse.id, semester)}
                                    style={{
                                        marginTop: 'auto',
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '2px dashed #6366f1',
                                        background: '#e0e7ff',
                                        color: '#4f46e5',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Plus size={16} /> Add {selectedCourse.code}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <AnimatePresence>
                {substitutingCourse && (
                    <SubstitutionModal 
                        course={substitutingCourse} 
                        onClose={() => setSubstitutingCourse(null)} 
                        onSubstitute={handleSubstitute} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const XIcon = ({ size = 24, color = "currentColor" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default DegreeRoadmap;
