import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Shield, TrendingUp, DollarSign, Users } from 'lucide-react';

const QuoteGenerator = () => {
    const [students, setStudents] = useState(5000);
    const [tier, setTier] = useState('prism');
    const [integration, setIntegration] = useState('standard'); // 'standard' or 'enterprise'

    // Pricing Logic
    const config = {
        prism: {
            name: 'Aura Prism',
            basePricePerStudent: 1.50,
            cogsPerStudent: 0.45,
            setupFee: 5000,
            icon: Zap,
            color: '#6366f1'
        },
        vault: {
            name: 'Aura Vault',
            basePricePerStudent: 3.00,
            cogsPerStudent: 0.91,
            setupFee: 30000,
            icon: Shield,
            color: '#10b981'
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
        window.print();
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        padding: 40px;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .mobile-only { display: block !important; visibility: visible !important; }
                    .competitor-badge { display: block !important; }
                }
            `}</style>

            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calculator size={32} color="#4f46e5" />
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Institutional TCO & Proposal</h2>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    style={{
                        background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px',
                        borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                >
                    <FileText size={20} /> Download PDF Proposal
                </button>
            </div>

            <div className="print-area" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Inputs */}
                <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card-white" style={{ padding: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.8rem', color: '#64748b' }}>Aura Tier</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => setTier('prism')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: tier === 'prism' ? '2px solid #6366f1' : '1px solid #e2e8f0',
                                    background: tier === 'prism' ? '#f5f3ff' : 'white', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Prism
                            </button>
                            <button
                                onClick={() => setTier('vault')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: tier === 'vault' ? '2px solid #10b981' : '1px solid #e2e8f0',
                                    background: tier === 'vault' ? '#f0fdf4' : 'white', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Vault
                            </button>
                        </div>

                        <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.8rem', color: '#64748b' }}>EdNex Integration</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => setIntegration('standard')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: integration === 'standard' ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                                    background: integration === 'standard' ? '#eef2ff' : 'white', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                API Standard
                            </button>
                            <button
                                onClick={() => setIntegration('enterprise')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: integration === 'enterprise' ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                                    background: integration === 'enterprise' ? '#eef2ff' : 'white', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Legacy Master
                            </button>
                        </div>

                        <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', color: '#64748b' }}>Student Count: <b>{students.toLocaleString()}</b></label>
                        <input
                            type="range"
                            min="500"
                            max="30000"
                            step="500"
                            value={students}
                            onChange={(e) => setStudents(parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="card-white" style={{ padding: '1.5rem', background: '#f8fafc' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem' }}>Financial Breakdown</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Licensing Volume:</span>
                            <span style={{ fontWeight: '700' }}>${monthlyRevenue.toLocaleString()}/mo</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Integration Fee:</span>
                            <span style={{ fontWeight: '700' }}>${integrationFee.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: '700' }}>
                            <span>Aumtech Profit/Mo:</span>
                            <span>+${monthlyProfit.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Analysis */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div className="card-white" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>MONTHLY REVENUE</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>${monthlyRevenue.toLocaleString()}</div>
                        </div>
                        <div className="card-white" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>MONTHLY PROFIT</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>+${monthlyProfit.toLocaleString()}</div>
                        </div>
                        <div className="card-white" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>GROSS MARGIN</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6366f1' }}>{grossMargin.toFixed(1)}%</div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card-white"
                        style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0' }}
                    >
                        {/* Proposal Content */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: current.color, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Institutional Proposal</div>
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>Aura {tier === 'prism' ? 'Prism' : 'Vault'} Intelligence</h3>
                        </div>

                        <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            A customized academic intelligence deployment for an institution of <b>{students.toLocaleString()} students</b>.
                            This proposal includes {tier === 'prism' ? 'Hybrid Cloud Reasoning with Privacy Gateway' : 'Full On-Premise Sovereign Inference'} support.
                        </p>

                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>Annual License Fee</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>${(monthlyRevenue * 12).toLocaleString()} / yr</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>EdNex Setup & Integration</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>${(current.setupFee + integrationFee).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>One-time Platform Kicker</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>$0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>Total First Year TCO</span>
                                <span style={{ fontSize: '2.5rem', fontWeight: '900', color: current.color }}>${annualACV.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* 3-Year ROI Analysis */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TrendingUp size={18} color="#10b981" /> 3-Year Savings Projection
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                {[1, 2, 3].map(year => {
                                    const auraYearly = year === 1 ? annualACV : (monthlyRevenue * 12);
                                    const eabYearly = year === 1 ? eabTotalFirstYear : (eabEstimate.baseFee + (students * eabEstimate.perStudent));
                                    const savings = eabYearly - auraYearly;

                                    return (
                                        <div key={year} style={{ background: year === 3 ? '#f0fdf4' : 'white', border: year === 3 ? '1px solid #10b981' : '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>YEAR {year} SAVINGS</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: year === 3 ? '#14532d' : '#0f172a' }}>+${savings.toLocaleString()}</div>
                                            <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(100, (savings / (eabYearly || 1)) * 100)}%`, height: '100%', background: '#10b981' }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#0f172a', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: '600' }}>Cumulative 3-Year Institutional ROI</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#10b981' }}>
                                    +${((eabTotalFirstYear + (eabEstimate.baseFee + students * eabEstimate.perStudent) * 2) - (annualACV + (monthlyRevenue * 12) * 2)).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Market Comparison Card */}
                        <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                <AlertTriangle size={18} color="#f59e0b" />
                                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#9a3412', textTransform: 'uppercase' }}>Competitive Context</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9a3412', marginBottom: '4px' }}>EAB NAVIGATOR (EST.)</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#431407' }}>${eabTotalFirstYear.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#9a3412' }}>Includes membership & seat licenses</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>AURA {tier.toUpperCase()} SAVINGS</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#14532d' }}>${(eabTotalFirstYear - annualACV).toLocaleString()}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#166534' }}>~{((eabTotalFirstYear - annualACV) / eabTotalFirstYear * 100).toFixed(0)}% lower TCO</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={18} color={current.color} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>FERPA Compliant</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Zap size={18} color={current.color} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Real-time Sync</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calculator size={18} color={current.color} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Predictable Pricing</span>
                            </div>
                        </div>

                        {/* Signature area for print only */}
                        <div className="mobile-only" style={{ marginTop: '4rem', display: 'none', visibility: 'hidden' /* CSS will handle visibility in print */ }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '10px', fontSize: '0.8rem' }}>Institution Authorized Signature</div>
                                <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '10px', fontSize: '0.8rem' }}>Date</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default QuoteGenerator;
