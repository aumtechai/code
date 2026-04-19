import React, { useState, useEffect } from 'react';
import { ChevronLeft, Target, TrendingUp, DollarSign, Briefcase, Zap, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const CareerMapper = ({ onBack }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockData = [
            {
                "id": 1,
                "code": "CS101",
                "name": "Intro to Data Science",
                "description": "Foundations of data analysis, python programming, and statistical modeling for enterprise scale.",
                "skills": ["Python", "Data Analysis", "Machine Learning"],
                "real_world_value": {
                    "job_titles": ["Junior Data Scientist", "Data Analyst", "Machine Learning Intern"],
                    "salary_range": "$65k - $95k",
                    "demand": "High"
                }
            },
            {
                "id": 2,
                "code": "ENG202",
                "name": "Modern Rhetoric",
                "description": "Analysis of persuasive communication in digital media and public discourse.",
                "skills": ["Public Relations", "Content Strategy", "Digital Marketing"],
                "real_world_value": {
                    "job_titles": ["Communications Specialist", "Digital Content Strategist", "PR Assistant"],
                    "salary_range": "$45k - $70k",
                    "demand": "Medium"
                }
            },
            {
                "id": 3,
                "code": "BIO305",
                "name": "Molecular Biology",
                "description": "Study of biological activity at the molecular level, including DNA/RNA synthesis.",
                "skills": ["Biotechnology", "Lab Research", "Genetics"],
                "real_world_value": {
                    "job_titles": ["Lab Technician", "Biotech Researcher", "QC Associate"],
                    "salary_range": "$50k - $80k",
                    "demand": "Moderate"
                }
            },
            {
                "id": 4,
                "code": "MKT401",
                "name": "Digital Marketing Analytics",
                "description": "Using data to drive marketing decisions and measure global campaign performance.",
                "skills": ["Google Analytics", "SQL", "Market Research"],
                "real_world_value": {
                    "job_titles": ["Marketing Analyst", "Growth Hacker", "SEO Executive"],
                    "salary_range": "$55k - $85k",
                    "demand": "Very High"
                }
            },
            {
                "id": 5,
                "code": "PSY150",
                "name": "Organizational Psychology",
                "description": "Applying psychological principles to workplace productivity and well-being.",
                "skills": ["Human Resources", "Conflict Resolution", "Training"],
                "real_world_value": {
                    "job_titles": ["HR Coordinator", "Talent Specialist", "Consultant"],
                    "salary_range": "$50k - $75k",
                    "demand": "High"
                }
            }
        ];

        setCourses(mockData);
        setLoading(false);
    }, []);

    const getDemandColor = (demand) => {
        if (demand.includes('Very High')) return { bg: '#ecfdf5', text: '#059669', border: '#10b981' };
        if (demand.includes('High')) return { bg: '#eff6ff', text: '#2563eb', border: '#3b82f6' };
        return { bg: '#f8fafc', text: '#64748b', border: '#cbd5e1' };
    };

    if (loading) return <div style={{ padding: '2rem', color: '#64748b' }}>Mapping market outcomes...</div>;

    return (
        <div style={{ padding: '1rem', minHeight: '100%', background: '#f8fafc' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {onBack && (
                    <button 
                        onClick={onBack} 
                        style={{ 
                            background: 'white', 
                            border: '1.5px solid #e2e8f0', 
                            borderRadius: '12px', 
                            width: '40px',
                            height: '40px',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'pointer', 
                            color: '#1e293b',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.border = '1.5px solid #4f46e5'}
                        onMouseOut={e => e.currentTarget.style.border = '1.5px solid #e2e8f0'}
                    >
                        <ChevronLeft size={20} strokeWidth={3} />
                    </button>
                )}
                <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                        <Target size={14} /> Intelligence Engine
                    </div>
                    <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Career Mapper
                    </h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>Translating course achievement into economic outcomes.</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {courses.map(course => {
                    const d = getDemandColor(course.real_world_value.demand);
                    return (
                        <motion.div 
                            key={course.id} 
                            whileHover={{ y: -5 }}
                            style={{ 
                                background: 'white',
                                borderRadius: '24px',
                                border: '1px solid #e2e8f0',
                                padding: '1.75rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.25rem'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', fontFamily: 'monospace', border: '1px solid #e2e8f0' }}>
                                    {course.code}
                                </div>
                                <div style={{ 
                                    background: d.bg, 
                                    color: d.text, 
                                    border: `1px solid ${d.border}`,
                                    padding: '4px 10px', 
                                    borderRadius: '20px', 
                                    fontSize: '0.7rem', 
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <TrendingUp size={12} /> {course.real_world_value.demand} Demand
                                </div>
                            </div>

                            <div>
                                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{course.name}</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>{course.description}</p>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {course.skills.map(skill => (
                                    <span key={skill} style={{ background: '#f8fafc', color: '#444', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px dashed #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Real-World Value</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center' }}>
                                            <DollarSign size={20} className="text-emerald-500" /> {course.real_world_value.salary_range}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>Projected Entry Salary</div>
                                    </div>
                                    <div style={{ background: '#4f46e5', color: 'white', padding: '8px', borderRadius: '12px' }}>
                                        <Briefcase size={20} />
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <ShieldCheck size={12} /> Target Roles
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {course.real_world_value.job_titles.map(title => (
                                            <div key={title} style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                                                {title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default CareerMapper;

