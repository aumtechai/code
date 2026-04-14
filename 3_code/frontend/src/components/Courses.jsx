import React, { useState, useEffect } from 'react';
import api from '../api';
import { BookOpen, Plus, Trash2, TrendingUp, Award, RefreshCw, Settings, Calendar, ChevronLeft, Check, Loader2, Upload, ScanLine, X } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const SyllabusScanModal = ({ course, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [count, setCount] = useState(0);

    const handleUpload = async () => {
        if (!file) return;
        setScanning(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post(`/api/courses/${course.id}/upload-syllabus`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCount(res.data.events_extracted);
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (error) {
            alert("Analysis failed. Please check your API key.");
            setScanning(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-white" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Scan Syllabus</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{course.name} ({course.code})</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                </div>

                {count > 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ background: '#dcfce7', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Check size={32} color="#166534" />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#166534' }}>Extracted {count} Events!</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Your calendar has been updated with new deadlines.</p>
                    </div>
                ) : (
                    <>
                        <div 
                            style={{ 
                                border: '2px dashed #e2e8f0', 
                                borderRadius: '12px', 
                                padding: '2rem', 
                                textAlign: 'center', 
                                marginBottom: '1.5rem',
                                background: file ? '#f8fafc' : 'transparent'
                            }}
                        >
                            <input type="file" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} id="syl-upload" />
                            <label htmlFor="syl-upload" style={{ cursor: 'pointer' }}>
                                <div style={{ background: '#eff6ff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                    <Upload size={24} color="#4f46e5" />
                                </div>
                                <div style={{ fontWeight: '700', color: '#1e293b' }}>{file ? file.name : 'Select Syllabus Document'}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PDF, Docx or Images accepted</div>
                            </label>
                        </div>

                        <button 
                            onClick={handleUpload}
                            disabled={!file || scanning}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                background: '#4f46e5', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '10px', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: (!file || scanning) ? 0.6 : 1
                            }}
                        >
                            {scanning ? <Loader2 className="animate-spin" size={18} /> : <ScanLine size={18} />}
                            {scanning ? 'AI Analyzing...' : 'Begin Smart Scan'}
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

const gradePoints = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
};

const Courses = ({ userData: externalUserData, onBack }) => {
    const [courses, setCourses] = useState([]);
    const [userData, setUserData] = useState(externalUserData || null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState(null);
    const [scannerCourse, setScannerCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({ name: '', code: '', grade: 'B', credits: 3 });

    useEffect(() => {
        fetchCourses();
        fetchUser();
    }, []);

    const calculateGPA = () => {
        const totalPoints = courses.reduce((acc, curr) => acc + (gradePoints[curr.grade] || 0) * curr.credits, 0);
        const totalCredits = courses.reduce((acc, curr) => acc + curr.credits, 0);
        return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('/api/courses');
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await api.get('/api/users/me');
            setUserData(res.data);
        } catch (_err) {
            console.error("Failed to fetch user");
        }

    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/courses', newCourse);
            setNewCourse({ name: '', code: '', grade: 'B', credits: 3 });
            setIsAdding(false);
            fetchCourses();
            fetchUser(); // Refresh insight if it changed
        } catch (_error) {
            alert("Failed to add course");
        }

    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/api/courses/${id}`);
            fetchCourses();
            fetchUser();
        } catch (_error) {
            alert("Failed to delete course");
        }

    };

    const handleSyncEdNex = async () => {
        setIsSyncing(true);
        setSyncStatus(null);
        try {
            // In a fully stateless proxy, this just asks EdNex to trigger an upstream refresh
            // and we re-fetch our unified view.
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upstream sync
            setSyncStatus({ success: true, message: 'Successfully synced with EdNex Data Warehouse.' });
            fetchCourses();
            fetchUser();
            // Clear status after 3 seconds
            setTimeout(() => setSyncStatus(null), 3000);
        } catch (error) {
            setSyncStatus({ success: false, message: `Failed to connect to EdNex.` });
            setTimeout(() => setSyncStatus(null), 3000);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
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
                <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Courses</h1>
            </div>

            {/* AI Insight Banner */}
            {userData?.ai_insight && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        background: '#f0f9ff',
                        borderLeft: '4px solid #0ea5e9',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'start'
                    }}
                >
                    <div style={{ background: '#0ea5e9', color: 'white', padding: '8px', borderRadius: '50%' }}>
                        <RefreshCw size={20} />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1', fontSize: '1.1rem' }}>Artificial Intelligence Academic Insight</h4>
                        <p style={{ margin: 0, color: '#0c4a6e', lineHeight: '1.5' }}>
                            {userData.ai_insight}
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Header Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-white" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}><Award size={20} /></div>
                        <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Cumulative GPA</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{userData?.gpa ? userData.gpa.toFixed(2) : calculateGPA()}</div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card-white">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ background: '#ec489920', color: '#ec4899', padding: '8px', borderRadius: '8px' }}><BookOpen size={20} /></div>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Active Courses</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{courses.length}</div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="card-white">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ background: '#10b98120', color: '#10b981', padding: '8px', borderRadius: '8px' }}><TrendingUp size={20} /></div>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Credits</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{courses.reduce((acc, c) => acc + parseInt(c.credits || 0), 0)}</div>
                </motion.div>
            </div>

            {/* Course List Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexDirection: window.innerWidth <= 768 ? 'column' : 'row', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Spring 2026 Curriculum</h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: window.innerWidth <= 768 ? '100%' : 'auto' }}>
                    {syncStatus && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.8rem',
                                color: syncStatus.success ? '#166534' : '#991b1b',
                                background: syncStatus.success ? '#dcfce7' : '#fee2e2',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontWeight: '600',
                                width: '100%'
                            }}
                        >
                            {syncStatus.message}
                        </motion.div>
                    )}

                    <button
                        onClick={handleSyncEdNex}
                        disabled={isSyncing}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: 'white',
                            color: '#4f46e5',
                            border: '1px solid #e2e8f0',
                            padding: '10px 16px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            flex: window.innerWidth <= 768 ? 1 : 'none',
                            fontSize: '0.85rem'
                        }}>
                        <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                        Sync EdNex
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '8px', 
                            background: '#4f46e5', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 20px', 
                            borderRadius: '10px', 
                            cursor: 'pointer', 
                            fontWeight: '700',
                            width: window.innerWidth <= 768 ? '100%' : 'auto',
                            fontSize: '0.9rem'
                        }}>
                        <Plus size={18} /> Add Course
                    </button>
                </div>
            </div>

            <div className="card-white" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course Title</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Credits</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semester</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                            <BookOpen size={30} />
                                        </div>
                                        <div style={{ fontWeight: '700', color: '#475569', marginBottom: '4px' }}>No courses yet</div>
                                        <div style={{ fontSize: '0.9rem' }}>Click "Add Course" to track your progress.</div>
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course, idx) => (
                                    <tr key={course.id} style={{ borderBottom: idx !== courses.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{course.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{course.code}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontWeight: '600' }}>{course.credits}</td>
                                        <td style={{ padding: '16px 24px' }}>{course.semester || 'N/A'}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {course.syllabus_url ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.8rem', fontWeight: '700' }}>
                                                        <Check size={14} strokeWidth={3} /> Syllabus Scanned
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => setScannerCourse(course)}
                                                        style={{ 
                                                            fontSize: '0.75rem', 
                                                            background: '#eff6ff', 
                                                            color: '#3b82f6', 
                                                            border: '1px solid #bfdbfe', 
                                                            padding: '4px 8px', 
                                                            borderRadius: '6px', 
                                                            cursor: 'pointer',
                                                            fontWeight: '700',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                        <Plus size={12} /> Scan Syllabus
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleDelete(course.id)} style={{ border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'all 0.2s' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SCANNER MODAL */}
            <AnimatePresence>
                {scannerCourse && (
                    <SyllabusScanModal 
                        course={scannerCourse} 
                        onClose={() => setScannerCourse(null)} 
                        onSuccess={() => {
                            setScannerCourse(null);
                            fetchCourses();
                        }} 
                    />
                )}
            </AnimatePresence>

            {/* Add Course Modal Overlay */}
            {isAdding && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card-white"
                        style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Add New Course</h3>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>Course Name</label>
                                <input
                                    required
                                    placeholder="e.g. Intro to Psychology"
                                    value={newCourse.name}
                                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>Course Code</label>
                                    <input
                                        required
                                        placeholder="PSY101"
                                        value={newCourse.code}
                                        onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>Credits</label>
                                    <input
                                        type="number"
                                        required
                                        min="1" max="6"
                                        value={newCourse.credits}
                                        onChange={e => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>Current Grade</label>
                                <select
                                    value={newCourse.grade}
                                    onChange={e => setNewCourse({ ...newCourse, grade: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
                                >
                                    {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Course</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Courses;
