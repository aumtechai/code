import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Zap, Shield, TrendingUp, DollarSign, Users, FileText, AlertTriangle, ChevronRight, CheckCircle, Download } from 'lucide-react';

const QuoteGenerator = () => {
    const [students, setStudents] = useState(5000);
    const [tier, setTier] = useState('prism');
    const [integration, setIntegration] = useState('standard'); // 'standard' or 'enterprise'
    const [isGenerating, setIsGenerating] = useState(false);

    // Pricing Logic
    const config = {
        prism: {
            name: 'Aura Prism',
            basePricePerStudent: 1.50,
            cogsPerStudent: 0.45,
            setupFee: 5000,
            icon: Zap,
            color: '#6366f1',
            desc: 'Hybrid Cloud Reasoning with Privacy Gateway'
        },
        vault: {
            name: 'Aura Vault',
            basePricePerStudent: 3.00,
            cogsPerStudent: 0.91,
            setupFee: 30000,
            icon: Shield,
            color: '#10b981',
            desc: 'Full On-Premise Sovereign Inference'
        }
    };

    const integrationCosts = {
        standard: 15000, // Basic SIS/LMS API sync
        enterprise: 45000 // Custom ETL, Legacy Mainframe, On-Prem Middleware
    };

    // Competitor Data (EAB Navigator Estimates)
    const eabEstimate = {
        baseFee: 150000, // Membership fee
        perStudent: 5.00,
        integration: 60000
    };

    const current = config[tier];
    const integrationFee = integrationCosts[integration];
    const monthlyRevenue = students * current.basePricePerStudent;
    const monthlyCOGS = students * current.cogsPerStudent;
    const monthlyProfit = monthlyRevenue - monthlyCOGS;
    const grossMargin = (monthlyProfit / monthlyRevenue) * 100;
    const annualACV = (monthlyRevenue * 12) + current.setupFee + integrationFee;

    const eabTotalFirstYear = eabEstimate.baseFee + (students * eabEstimate.perStudent) + eabEstimate.integration;

    const handleDownloadPDF = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            window.print();
        }, 1200);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        padding: 60px;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .mobile-only { display: block !important; visibility: visible !important; }
                    .competitor-badge { display: block !important; }
                    .card-white { border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
                }

                .tier-btn {
                    flex: 1;
                    padding: 1.25rem;
                    border-radius: 16px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    background: white;
                    border: 2px solid #e2e8f0;
                    cursor: pointer;
                }

                .tier-btn.active.prism {
                    background: #f5f3ff;
                    border-color: #6366f1;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
                }

                .tier-btn.active.vault {
                    background: #f0fdf4;
                    border-color: #10b981;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
                }

                .integration-btn {
                    flex: 1;
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 600;
                    border: 2px solid #e2e8f0;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .integration-btn.active {
                    background: #eef2ff;
                    border-color: #4f46e5;
                    color: #4f46e5;
                }

                /* Custom Range Input */
                input[type=range] {
                    height: 8px;
                    -webkit-appearance: none;
                    margin: 10px 0;
                    width: 100%;
                    background: #e2e8f0;
                    border-radius: 4px;
                    outline: none;
                }

                input[type=range]::-webkit-slider-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #4f46e5;
                    cursor: pointer;
                    -webkit-appearance: none;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    border: 2px solid white;
                }
            `}</style>

            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#4f46e5', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)' }}>
                        <Calculator size={32} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>Institutional Proposal Builder</h2>
                        <p style={{ margin: 0, color: '#64748b', fontWeight: '500' }}>Configure and export professional TCO assessments for Aura deployment.</p>
                    </div>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    style={{
                        background: '#0f172a', color: 'white', border: 'none', padding: '14px 28px',
                        borderRadius: '14px', fontWeight: '700', cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex',
                        alignItems: 'center', gap: '10px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.2s',
                        opacity: isGenerating ? 0.7 : 1
                    }}
                >
                    {isGenerating ? (
                        <>
                            <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <Download size={20} /> Download PDF Proposal
                        </>
                    )}
                </button>
            </div>

            <div className="print-area" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2.5rem' }}>
                {/* Inputs Control Panel */}
                <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card-white" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                            <Zap size={20} color="#4f46e5" />
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Platform Configuration</h4>
                        </div>

                        <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Select Aura Tier</label>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => setTier('prism')}
                                className={`tier-btn ${tier === 'prism' ? 'active prism' : ''}`}
                            >
                                <Zap size={24} color={tier === 'prism' ? '#6366f1' : '#94a3b8'} />
                                <span style={{ fontWeight: '700' }}>Prism</span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Hybrid Cloud</span>
                            </button>
                            <button
                                onClick={() => setTier('vault')}
                                className={`tier-btn ${tier === 'vault' ? 'active vault' : ''}`}
                            >
                                <Shield size={24} color={tier === 'vault' ? '#10b981' : '#94a3b8'} />
                                <span style={{ fontWeight: '700' }}>Vault</span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Sovereign</span>
                            </button>
                        </div>

                        <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>EdNex Integration Level</label>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => setIntegration('standard')}
                                className={`integration-btn ${integration === 'standard' ? 'active' : ''}`}
                            >
                                API Standard
                            </button>
                            <button
                                onClick={() => setIntegration('enterprise')}
                                className={`integration-btn ${integration === 'enterprise' ? 'active' : ''}`}
                            >
                                Legacy Master
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Scale</label>
                            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#4f46e5' }}>{students.toLocaleString()} Students</span>
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="50000"
                            step="500"
                            value={students}
                            onChange={(e) => setStudents(parseInt(e.target.value))}
                            style={{ marginBottom: '1rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600' }}>
                            <span>500</span>
                            <span>50,000</span>
                        </div>
                    </div>

                    <div className="card-white" style={{ padding: '2rem', background: '#0f172a', color: 'white', border: 'none' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '1px' }}>Platform Financials</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>Monthly Licensing:</span>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>${monthlyRevenue.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>Integration Fee:</span>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>${integrationFee.toLocaleString()}</span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontWeight: '800' }}>
                                <span>Projected Profit/Mo:</span>
                                <span style={{ fontSize: '1.2rem' }}>+${monthlyProfit.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8', fontWeight: '800' }}>
                                <span>Gross Margin:</span>
                                <span style={{ fontSize: '1.2rem' }}>{grossMargin.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis/Proposal View */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div className="card-white" style={{ padding: '1.25rem', textAlign: 'center' }}>
                            <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '800', marginBottom: '4px' }}>EST. ACV</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>${(monthlyRevenue * 12).toLocaleString()}</div>
                        </div>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '1.25rem', textAlign: 'center' }}>
                            <div style={{ color: '#166534', fontSize: '0.75rem', fontWeight: '800', marginBottom: '4px' }}>MARGIN</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#14532d' }}>{grossMargin.toFixed(1)}%</div>
                        </div>
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', padding: '1.25rem', textAlign: 'center' }}>
                            <div style={{ color: '#1e40af', fontSize: '0.75rem', fontWeight: '800', marginBottom: '4px' }}>TCO SAVINGS</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e3a8a' }}>{((eabTotalFirstYear - annualACV) / eabTotalFirstYear * 100).toFixed(0)}%</div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tier}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="card-white"
                            style={{ padding: '3.5rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}
                        >
                        {/* Proposal Content */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: current.color, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Strategic Proposal</div>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#0f172a', letterSpacing: '-1px' }}>{current.name} Intelligence</h3>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <current.icon size={32} color={current.color} />
                            </div>
                        </div>

                        <p style={{ fontSize: '1.15rem', color: '#475569', marginBottom: '3rem', lineHeight: 1.7 }}>
                            Personalized academic intelligence deployment engineered for <b>{students.toLocaleString()} students</b>. 
                            Built on the Aura framework, this configuration provides <u>{current.desc}</u>.
                        </p>

                        <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>Annual License Fee</span>
                                <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>${(monthlyRevenue * 12).toLocaleString()} / yr</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>EdNex Setup & Cloud Integration</span>
                                <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>${(current.setupFee + integrationFee).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#64748b', fontWeight: '600' }}>Support & Maintenance</span>
                                    <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '800' }}>INCLUDED</div>
                                </div>
                                <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>$0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>Total First Year TCO</span>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Includes all licensing & setup fees</span>
                                </div>
                                <span style={{ fontSize: '3.2rem', fontWeight: '900', color: current.color, letterSpacing: '-2px' }}>${annualACV.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Market Comparison Card */}
                        <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '2rem', borderRadius: '20px', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <AlertTriangle size={20} color="#f59e0b" />
                                <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Competitive Analysis</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#9a3412', marginBottom: '8px' }}>EAB NAVIGATOR (EST.)</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#431407' }}>${eabTotalFirstYear.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#9a3412', opacity: 0.8, marginTop: '4px' }}>Legacy seat licenses & membership</div>
                                </div>
                                <div style={{ borderLeft: '1px solid #ffedd5', paddingLeft: '2.5rem' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#166534', marginBottom: '8px' }}>AURA {tier.toUpperCase()} YEAR 1 SAVINGS</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#14532d' }}>${(eabTotalFirstYear - annualACV).toLocaleString()}</div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', marginTop: '4px' }}>
                                        <TrendingUp size={12} /> {((eabTotalFirstYear - annualACV) / eabTotalFirstYear * 100).toFixed(0)}% Savings
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                <Shield size={20} color={current.color} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>FERPA / SOC2</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                <Zap size={20} color={current.color} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Real-time Insight</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                <CheckCircle size={20} color={current.color} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Full ROI Model</span>
                            </div>
                        </div>

                        {/* Signature area for print only */}
                        <div className="mobile-only" style={{ marginTop: '6rem', display: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    <div style={{ borderBottom: '1.5px solid #000', width: '250px' }}></div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Institution Representative Signature</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    <div style={{ borderBottom: '1.5px solid #000', width: '200px' }}></div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Date of Authorization</div>
                                </div>
                            </div>
                        </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default QuoteGenerator;
