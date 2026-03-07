import React, { useState, useEffect } from 'react';
import api from '../api';
import { Network, Database, UserSearch, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminEdnex = () => {
    const [activeTab, setActiveTab] = useState('config'); // config, status, lookup
    const [loading, setLoading] = useState(false);

    // Config state
    const [supabaseUrl, setSupabaseUrl] = useState('');
    const [supabaseKey, setSupabaseKey] = useState('');
    const [configStatus, setConfigStatus] = useState(null);

    // Status state
    const [healthData, setHealthData] = useState(null);

    // Lookup state
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useState(null);
    const [lookupError, setLookupError] = useState('');

    useEffect(() => {
        if (activeTab === 'config') checkConfig();
        if (activeTab === 'status') fetchHealth();
    }, [activeTab]);

    const checkConfig = async () => {
        try {
            const res = await api.get('/api/ednex/config');
            setConfigStatus(res.data);
        } catch (e) {
            console.error("Failed to check config", e);
        }
    };

    const handleSaveConfig = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/ednex/config', { url: supabaseUrl, key: supabaseKey });
            setConfigStatus({ configured: true, source: 'db' });
            setSupabaseUrl('');
            setSupabaseKey('');
            alert("Configuration saved successfully.");
        } catch (e) {
            alert("Failed to save configuration.");
        } finally {
            setLoading(false);
        }
    };

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/ednex/health');
            setHealthData(res.data.modules);
        } catch (e) {
            console.error("Health check failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleLookup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLookupError('');
        setUserData(null);
        try {
            const res = await api.get(`/api/ednex/user/search/${encodeURIComponent(searchQuery)}`);
            setUserData(res.data);
        } catch (e) {
            setLookupError(e.response?.data?.detail || "No matching students found or error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Network color="#4f46e5" /> EdNex Integration Hub
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Configure and monitor the connection to the core EdNex Data Warehouse (Supabase).</p>

            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('config')}
                    style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '1rem', fontWeight: activeTab === 'config' ? 'bold' : 'normal', color: activeTab === 'config' ? '#4f46e5' : '#64748b', borderBottom: activeTab === 'config' ? '2px solid #4f46e5' : 'none', cursor: 'pointer' }}
                >
                    <Database size={16} style={{ marginBottom: '-2px', marginRight: '5px' }} /> Connection Setup
                </button>
                <button
                    onClick={() => setActiveTab('status')}
                    style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '1rem', fontWeight: activeTab === 'status' ? 'bold' : 'normal', color: activeTab === 'status' ? '#4f46e5' : '#64748b', borderBottom: activeTab === 'status' ? '2px solid #4f46e5' : 'none', cursor: 'pointer' }}
                >
                    <RefreshCw size={16} style={{ marginBottom: '-2px', marginRight: '5px' }} /> Module Status
                </button>
                <button
                    onClick={() => setActiveTab('lookup')}
                    style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '1rem', fontWeight: activeTab === 'lookup' ? 'bold' : 'normal', color: activeTab === 'lookup' ? '#4f46e5' : '#64748b', borderBottom: activeTab === 'lookup' ? '2px solid #4f46e5' : 'none', cursor: 'pointer' }}
                >
                    <UserSearch size={16} style={{ marginBottom: '-2px', marginRight: '5px' }} /> User Lookup
                </button>
            </div>

            {/* TAB: CONFIG */}
            {activeTab === 'config' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                        <h3>Connection Status</h3>
                        {configStatus === null ? <p>Checking...</p> : configStatus.configured ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a', marginTop: '1rem', fontWeight: 'bold' }}>
                                <CheckCircle2 /> Connected to EdNex (Source: {configStatus.source})
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', marginTop: '1rem', fontWeight: 'bold' }}>
                                <AlertCircle /> Disconnected
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Update Credentials</h3>
                        <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Supabase URL</label>
                                <input
                                    type="text"
                                    value={supabaseUrl}
                                    onChange={(e) => setSupabaseUrl(e.target.value)}
                                    placeholder="https://xxxx.supabase.co"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Supabase Service Key (or Anon Key)</label>
                                <input
                                    type="password"
                                    value={supabaseKey}
                                    onChange={(e) => setSupabaseKey(e.target.value)}
                                    placeholder="eyJh..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} style={{ background: '#4f46e5', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}>
                                {loading ? 'Saving...' : <><Save size={18} /> Save & Connect</>}
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}

            {/* TAB: STATUS */}
            {activeTab === 'status' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>EdNex Module Health</h3>
                        <button onClick={fetchHealth} disabled={loading} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>

                    {loading && !healthData ? <p>Loading system health...</p> : null}

                    {healthData && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {Object.entries(healthData).map(([moduleName, info]) => (
                                <div key={moduleName} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>{moduleName}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#64748b' }}>Records:</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{info.count}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#64748b' }}>Status:</span>
                                        <span style={{
                                            color: info.status.includes('Operational') ? '#16a34a' : '#dc2626',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: info.status.includes('Operational') ? '#dcfce7' : '#fee2e2'
                                        }}>
                                            {info.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* TAB: LOOKUP */}
            {activeTab === 'lookup' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Cross-Module Student Lookup</h3>
                        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email, or department..."
                                style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                required
                            />
                            <button type="submit" disabled={loading} style={{ background: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                {loading ? 'Searching...' : 'Lookup'}
                            </button>
                        </form>
                        {lookupError && <p style={{ color: '#dc2626', marginTop: '1rem' }}>{lookupError}</p>}
                    </div>

                    {userData && userData.results && userData.results.map((student, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
                                <h3 style={{ margin: 0, color: '#334155' }}>
                                    {student.name} <span style={{ fontWeight: 'normal', color: '#64748b', fontSize: '1rem' }}>({student.email})</span>
                                </h3>
                                <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>EdNex Student ID: {student.ednex_student_id}</p>
                            </div>

                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h4>Identity & Core</h4>
                                <pre style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
                                    {JSON.stringify(student.modules.mod00_users, null, 2)}
                                </pre>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h4>SIS Profile (Mod 01)</h4>
                                <pre style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
                                    {JSON.stringify(student.modules.mod01_student_profiles, null, 2)}
                                </pre>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h4>Financial Account (Mod 02)</h4>
                                <pre style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
                                    {JSON.stringify(student.modules.mod02_student_accounts, null, 2)}
                                </pre>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h4>Appointments (Mod 03)</h4>
                                    <pre style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
                                        {JSON.stringify(student.modules.mod03_advising_appointments, null, 2)}
                                    </pre>
                                </div>
                                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h4>Enrollments (Mod 04)</h4>
                                    <pre style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem', maxHeight: '300px' }}>
                                        {JSON.stringify(student.modules.mod04_enrollments, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default AdminEdnex;
