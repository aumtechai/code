import React, { useState } from 'react';
import { Target, Search, FileText, CheckCircle, TrendingUp, AlertCircle, Calendar, Bot, Zap, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketIntelligence = () => {
    const [activeTab, setActiveTab] = useState('competitors'); // 'competitors' | 'grants'

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.5rem 0' }}>Strategic Intelligence</h1>
                <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>Market competition tracking and EdTech grant opportunities.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('competitors')}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeTab === 'competitors' ? '#4f46e5' : 'white',
                        color: activeTab === 'competitors' ? 'white' : '#64748b',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: activeTab === 'competitors' ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : '0 1px 2px 0 rgba(0,0,0,0.05)',
                    }}
                >
                    <Target size={18} /> Competitor Intel (EAB/Navigate)
                </button>
                <button
                    onClick={() => setActiveTab('grants')}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeTab === 'grants' ? '#10b981' : 'white',
                        color: activeTab === 'grants' ? 'white' : '#64748b',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: activeTab === 'grants' ? '0 4px 6px -1px rgba(16, 185, 129, 0.2)' : '0 1px 2px 0 rgba(0,0,0,0.05)',
                    }}
                >
                    <FileText size={18} /> EdTech Grants Explorer
                </button>
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'competitors' ? <CompetitorTracker /> : <GrantsExplorer />}
            </motion.div>
        </div>
    );
};

const CompetitorTracker = () => {
    const targets = [
        { id: 1, name: 'Midwest State University', currentVendor: 'EAB Navigate', contractEnd: '2026-08', dissatisfaction: 'High - Complaints about rigid UI and poor student adoption.', size: '15,000' },
        { id: 2, name: 'Coastal Tech', currentVendor: 'Starfish', contractEnd: '2026-12', dissatisfaction: 'Medium - Looking for more AI-driven analytics.', size: '8,500' },
        { id: 3, name: 'Northern Liberal Arts', currentVendor: 'EAB Navigate', contractEnd: '2027-05', dissatisfaction: 'High - Price increases beyond budget limits.', size: '4,200' },
        { id: 4, name: 'Southern Research Uni', currentVendor: 'Homegrown / Ellucian', contractEnd: '2026-06', dissatisfaction: 'Low - Apathetic, but system is outdated.', size: '22,000' }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Search size={20} color="#4f46e5" /> Target Institutions
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Institutions nearing the end of 3-to-5 year legacy contracts.</p>
                    </div>
                    <button style={{ padding: '8px 16px', background: '#eff6ff', color: '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={16} /> Deploy Marketing Campaign
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Institution</th>
                            <th style={{ padding: '1rem' }}>Current Vendor</th>
                            <th style={{ padding: '1rem' }}>Contract Expiry</th>
                            <th style={{ padding: '1rem' }}>Signal Intelligence</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {targets.map(t => {
                            const isUrgent = t.contractEnd.startsWith('2026');
                            const isHighDissatisfaction = t.dissatisfaction.startsWith('High');
                            return (
                                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.size} Students</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', background: '#f1f5f9', color: '#475569' }}>
                                            {t.currentVendor}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isUrgent ? '#ef4444' : '#1e293b', fontWeight: isUrgent ? '600' : '400' }}>
                                            <Calendar size={14} /> {t.contractEnd}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: isHighDissatisfaction ? '#b91c1c' : '#475569' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {isHighDissatisfaction && <AlertCircle size={14} />} {t.dissatisfaction}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '700' }}>Competitive Positioning vs EAB</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <CheckCircle size={18} color="#10b981" style={{ marginTop: '2px' }} />
                            <div><strong style={{ color: '#1e293b' }}>Student-Centric UX:</strong> Aura boasts a 4x higher daily engagement rate by focusing on student utility (timers, flashcards) rather than just faculty flagging.</div>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <CheckCircle size={18} color="#10b981" style={{ marginTop: '2px' }} />
                            <div><strong style={{ color: '#1e293b' }}>AI-Native Architecture:</strong> Not retrofitted. The Aura AI Agent inherently understands contextual degree planning, which legacy vendors lack.</div>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <CheckCircle size={18} color="#10b981" style={{ marginTop: '2px' }} />
                            <div><strong style={{ color: '#1e293b' }}>Transparent Customization:</strong> Universities control modular components directly without excessive professional services fees.</div>
                        </li>
                    </ul>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '700' }}>Marketing Playbook</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>Automated outreach sequence for expiring contracts.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #4f46e5', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Phase 1: Awareness (T-12 Months)</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Target Provosts with case studies on student engagement metrics vs legacy systems.</div>
                        </div>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Phase 2: Evaluation (T-8 Months)</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Offer custom "Data Sandbox" demos using the Quote Generator and Integration Wizard.</div>
                        </div>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #10b981', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Phase 3: Proposal (T-6 Months)</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Submit competitive pricing models undercutting legacy renewal bumps.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GrantsExplorer = () => {
    const [generating, setGenerating] = useState(false);

    const grants = [
        { id: 1, title: 'Federal EdTech Innovation Grant', amount: '$500,000', deadline: 'Oct 15, 2026', focus: 'AI in higher education, retention, accessibility.', match: 95 },
        { id: 2, title: 'State Student Success Initiative', amount: '$250,000', deadline: 'Nov 30, 2026', focus: 'First-generation student support tools.', match: 88 },
        { id: 3, title: 'NextGen Campus Technology Fund', amount: '$100,000', deadline: 'Rolling', focus: 'Mental health and wellness tech integration.', match: 75 }
    ];

    const handleGenerate = (e) => {
        e.preventDefault();
        setGenerating(true);
        setTimeout(() => setGenerating(false), 2000);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Active Opportunities</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {grants.map(g => (
                        <div key={g.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{g.title}</h3>
                                    <span style={{ padding: '2px 8px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', fontSize: '0.75rem', fontWeight: '700' }}>
                                        {g.match}% Match
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}><strong>Focus:</strong> {g.focus}</div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>
                                    <span>💰 {g.amount}</span>
                                    <span>⏳ Due: {g.deadline}</span>
                                </div>
                            </div>
                            <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                Select
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={20} color="#10b981" /> AI Grant Proposal Drafter
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                    Generate tailored grant applications highlighting Aura's unique capabilities to secure funding.
                </p>

                <form onSubmit={handleGenerate}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Target Grant</label>
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option>Federal EdTech Innovation Grant</option>
                            <option>State Student Success Initiative</option>
                        </select>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Key Narrative Angle</label>
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option>Improving First-Gen Retention via AI Nudging</option>
                            <option>Democratizing Mental Health Access</option>
                            <option>Career Pathway Alignment</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Additional Context</label>
                        <textarea 
                            rows={3} 
                            placeholder="e.g., We intend to partner with State University for the pilot program..."
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={generating}
                        style={{ width: '100%', padding: '12px', background: generating ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {generating ? 'Drafting Proposal...' : <><FileText size={18} /> Draft Proposal via AI</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MarketIntelligence;
