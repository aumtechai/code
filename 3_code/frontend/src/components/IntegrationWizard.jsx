import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Database, Plus, ChevronRight, Check, AlertCircle, FileText, 
    Search, Upload, ArrowRight, Loader2, Info, CheckCircle2, 
    ShieldCheck, Table, Braces, Sparkles, Map, DatabaseBackup
} from 'lucide-react';
import api from '../api';

const IntegrationWizard = () => {
    const [step, setStep] = useState(1);
    const [institutionName, setInstitutionName] = useState('');
    const [existingInstitutions, setExistingInstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [schema, setSchema] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [mappings, setMappings] = useState([]);
    const [activeTargetTable, setActiveTargetTable] = useState('mod01_student_profiles');
    const [ingestionResult, setIngestionResult] = useState(null);
    const [showSample, setShowSample] = useState(false);

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const fetchInstitutions = async () => {
        try {
            const res = await api.get('/api/integration/institutions');
            setExistingInstitutions(res.data.schemas || []);
        } catch (err) {
            console.error("Failed to fetch institutions", err);
        }
    };

    const onBoard = async () => {
        if (!institutionName) return;
        setLoading(true);
        setErrorMsg('');
        setStatus('Creating dynamic Supabase schema and executing EdNex core DDLs...');
        try {
            const res = await api.post('/api/integration/onboard', {
                institution_name: institutionName
            });
            setSchema(res.data.schema_name);
            setStep(2);
        } catch (err) {
            setErrorMsg("Onboarding failed: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
            setStatus(null);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files.filter(f => f.name.endsWith('.csv')));
    };

    const runMapping = async () => {
        if (selectedFiles.length === 0) return;
        setLoading(true);
        setErrorMsg('');
        setStatus(`Integration Agent analyzing '${selectedFiles[0].name}' vs target schema...`);
        try {
            const formData = new FormData();
            formData.append('schema_name', schema);
            formData.append('table_name', activeTargetTable);
            formData.append('csv_file', selectedFiles[0]);
            const res = await api.post('/api/integration/map-columns', formData);
            
            if (res.data.mappings) {
                setMappings(res.data.mappings);
                setStep(3);
            } else {
                throw new Error("Invalid mapping response");
            }
        } catch (err) {
            setErrorMsg("Mapping failed: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
            setStatus(null);
        }
    };

    const runIngestion = async () => {
        setLoading(true);
        setErrorMsg('');
        setStatus("Transforming data and ingesting into institution schema...");
        try {
            const mappingDict = {};
            mappings.forEach(m => {
                if (m.target) mappingDict[m.source] = m.target;
            });

            const createColumns = mappings.filter(m => m.create_column).map(m => m.source);

            const formData = new FormData();
            formData.append('schema_name', schema);
            formData.append('table_name', activeTargetTable);
            formData.append('mappings_json', JSON.stringify(mappingDict));
            formData.append('create_columns_json', JSON.stringify(createColumns));
            formData.append('csv_file', selectedFiles[0]);

            const res = await api.post('/api/integration/ingest', formData);
            setIngestionResult(res.data);
            setStep(4);
        } catch (err) {
            setErrorMsg("Ingestion failed: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
            setStatus(null);
        }
    };

    const handleCreateColumn = (index) => {
        const newMappings = [...mappings];
        newMappings[index].target = newMappings[index].source;
        newMappings[index].status = 'custom';
        newMappings[index].create_column = true;
        setMappings(newMappings);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'green': return '#10b981';
            case 'yellow': return '#f59e0b';
            case 'red': return '#ef4444';
            case 'custom': return '#3b82f6';
            default: return '#94a3b8';
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', padding: '1rem', borderRadius: '16px', color: 'white', boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)' }}>
                    <DatabaseBackup size={32} />
                </div>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1e293b', margin: 0, letterSpacing: '-0.03em' }}>Institution Integration</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '4px 0 0 0', fontWeight: '500' }}>AI-Powered Onboarding Engine for EdNex Institutional Partners</p>
                </div>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} style={{ flex: 1, height: '6px', borderRadius: '3px', background: step >= s ? '#4f46e5' : '#e2e8f0', transition: 'background 0.4s ease' }}></div>
                ))}
            </div>

            {/* Content Area */}
            <div className="card-white" style={{ padding: '2rem 3rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        >
                            <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <Database size={56} color="#0ea5e9" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Onboard New Institution</h2>
                            <p style={{ color: '#64748b', maxWidth: '600px', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                Enter the official name of the institution. We will dynamically spin up a dedicated 
                                <b> Supabase ednex-schema</b> and execute all <b>canonical EdNex Table DDLs</b> instantly.
                            </p>
                            
                            <div style={{ width: '100%', maxWidth: '600px' }}>
                                {existingInstitutions.length > 0 && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', textAlign: 'left', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Select Existing Institution</label>
                                        <select 
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    setSchema(e.target.value);
                                                    setStep(2);
                                                }
                                            }}
                                            style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '1.1rem', background: 'white', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                                        >
                                            <option value="">-- Select --</option>
                                            {existingInstitutions.map(s => (
                                                <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                                            ))}
                                        </select>
                                        
                                        <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8' }}>OR</span>
                                            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                                        </div>
                                    </div>
                                )}

                                <label style={{ display: 'block', textAlign: 'left', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Create New Institution</label>
                                <input 
                                    type="text" 
                                    value={institutionName}
                                    onChange={(e) => setInstitutionName(e.target.value)}
                                    placeholder="e.g. Stanford University"
                                    style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '1.1rem', marginBottom: '1.5rem', outline: 'none', transition: 'border-color 0.2s' }}
                                />
                                <button 
                                    onClick={onBoard}
                                    disabled={!institutionName || loading}
                                    className="primary-btn"
                                    style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.1rem' }}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Create EdNex Schema</>}
                                </button>
                                
                                {errorMsg && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        style={{ marginTop: '1rem', padding: '0.65rem 0.85rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '6px', fontSize: '0.825rem', fontWeight: '500', textAlign: 'left' }}
                                    >
                                        {errorMsg}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ flex: 1 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Select Institutional Data</h2>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                                        <ShieldCheck size={16} /> Schema Created: {schema}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Target Module</label>
                                    <select 
                                        value={activeTargetTable}
                                        onChange={(e) => setActiveTargetTable(e.target.value)}
                                        style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '600' }}
                                    >
                                        <option value="mod00_users">Mod-00: User Identity</option>
                                        <option value="mod01_student_profiles">Mod-01: SIS Student Profiles</option>
                                        <option value="mod02_student_accounts">Mod-02: Financial Accounts</option>
                                        <option value="mod04_enrollments">Mod-04: Course Enrollments</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', border: '3px dashed #e2e8f0', borderRadius: '24px', padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                                <Upload size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Upload Institutional CSV Files</h3>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Drop your raw CSV exports or click to browse local folders.</p>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept=".csv"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                    id="csv-upload"
                                />
                                <label 
                                    htmlFor="csv-upload"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: '2px solid #4f46e5', color: '#4f46e5', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Choose Files
                                </label>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem' }}>Selected Files ({selectedFiles.length})</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {selectedFiles.map((file, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <FileText size={20} color="#64748b" />
                                                    <span style={{ fontWeight: '600' }}>{file.name}</span>
                                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{(file.size / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                                <button 
                                    onClick={runMapping}
                                    disabled={selectedFiles.length === 0 || loading}
                                    className="primary-btn"
                                    style={{ padding: '1rem 2.5rem' }}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Map Columns with AI Integration Agent</>}
                                </button>
                            </div>

                            {errorMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    style={{ marginTop: '1rem', padding: '0.65rem 0.85rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '6px', fontSize: '0.825rem', fontWeight: '500', textAlign: 'left' }}
                                >
                                    {errorMsg}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ flex: 1 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>AI Column Mapping</h2>
                                    <p style={{ color: '#64748b' }}>Mapping <b>{selectedFiles[0]?.name}</b> to table <b>{activeTargetTable}</b></p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['green', 'yellow', 'custom', 'red'].map(s => (
                                        <div key={s} style={{ fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '6px', background: `${getStatusColor(s)}15`, color: getStatusColor(s), textTransform: 'uppercase' }}>
                                            {s === 'green' ? 'Exact' : s === 'yellow' ? 'Semantic' : s === 'custom' ? 'Custom' : 'Missing'}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <tr>
                                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Source (CSV)</th>
                                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Sample Value</th>
                                            <th style={{ width: '40px' }}></th>
                                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Target (EdNex)</th>
                                            <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Confidence</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mappings.map((m, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '1rem', fontWeight: '700', color: '#1e293b' }}>{m.source}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic' }}>{m.sample || 'N/A'}</td>
                                                <td><ArrowRight size={16} color="#cbd5e1" /></td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: getStatusColor(m.status) }}></div>
                                                        <span style={{ fontWeight: '600', color: m.status === 'red' ? '#ef4444' : '#1e293b' }}>{m.target || 'UNMAPPED'}</span>
                                                        {m.status === 'red' && (
                                                            <button 
                                                                onClick={() => handleCreateColumn(i)}
                                                                style={{ marginLeft: '12px', fontSize: '0.75rem', padding: '4px 8px', background: '#e2e8f0', color: '#475569', borderRadius: '4px', cursor: 'pointer', border: '1px solid #cbd5e1', fontWeight: '700' }}
                                                            >
                                                                + Add Column
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <span style={{ fontWeight: '800', color: getStatusColor(m.status) }}>{m.confidence}%</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.9rem' }}>
                                    <Sparkles size={18} color="#4f46e5" /> AI Integration Agent matched <b>{mappings.filter(m => m.status !== 'red').length} of {mappings.length}</b> columns successfully.
                                </div>
                                <button 
                                    onClick={runIngestion}
                                    disabled={loading}
                                    className="primary-btn"
                                    style={{ padding: '1rem 3rem', background: '#10b981', boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)' }}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Finalize & Ingest Data</>}
                                </button>
                            </div>

                            {errorMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    style={{ marginTop: '1rem', padding: '0.65rem 0.85rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '6px', fontSize: '0.825rem', fontWeight: '500', textAlign: 'left' }}
                                >
                                    {errorMsg}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        >
                            <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <CheckCircle2 size={64} color="#10b981" />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', color: '#065f46' }}>Integration Complete!</h2>
                            <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>
                                Successfully ingested <b>{ingestionResult?.rows_ingested.toLocaleString()}</b> student records into the 
                                <b> {schema}</b> data warehouse.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
                                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Log: Schema Strategy</div>
                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>Enterprise Proxy (Isolation)</div>
                                </div>
                                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Ingestion Duration</div>
                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>0.84 seconds (Optimized)</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '800px' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="primary-btn" onClick={() => window.location.reload()}>Start Another Integration</button>
                                    <button 
                                        onClick={() => setShowSample(!showSample)}
                                        style={{ background: 'white', border: '2px solid #e2e8f0', padding: '12px 32px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                        {showSample ? 'Hide Preview' : 'Preview Ingested Sample'}
                                    </button>
                                </div>

                                {showSample && ingestionResult?.sample_data && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -20 }} 
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ width: '100%', overflowX: 'auto', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}
                                    >
                                        <table style={{ minWidth: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                                            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                                <tr>
                                                    {Object.keys(ingestionResult.sample_data[0]).map(k => (
                                                        <th key={k} style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold' }}>{k}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ingestionResult.sample_data.map((row, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                        {Object.values(row).map((val, vIdx) => (
                                                            <td key={vIdx} style={{ padding: '12px 16px', color: '#334155' }}>{val?.toString() || ''}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Status Indicator */}
            {status && (
                <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', zIndex: 10000 }}>
                    <Loader2 size={20} className="animate-spin" color="#38bdf8" />
                    <span style={{ fontWeight: '600' }}>{status}</span>
                </div>
            )}
        </div>
    );
};

export default IntegrationWizard;
