import React, { useState, useEffect } from 'react';
import api from '../api';
import { Save, Plus, Trash2, BrainCircuit, RefreshCw, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAgentConfig = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/admin/agents');
            setConfig(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch agent configurations.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setSuccessMessage('');
            await api.post('/api/admin/agents', config);
            setSuccessMessage('Configurations saved successfully to the Swarm!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to save configurations.');
        } finally {
            setSaving(false);
        }
    };

    const handleMasterChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            master: {
                ...prev.master,
                [field]: value
            }
        }));
    };

    const handleAgentChange = (key, field, value) => {
        setConfig(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    const handleModulesChange = (key, valueStr) => {
        // Convert comma separated string to array
        const modules = valueStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
        setConfig(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                allowed_modules: modules
            }
        }));
    };

    const addAgent = () => {
        const newKey = `new_agent_${Date.now()}`;
        setConfig(prev => ({
            ...prev,
            [newKey]: {
                name: "New_Specialist_Agent",
                prompt: "You are a new specialist. Be brief.",
                allowed_modules: [],
                model: "gemini-flash-latest"
            }
        }));
    };

    const removeAgent = (key) => {
        if (window.confirm(`Are you sure you want to remove ${key}?`)) {
            const newConfig = { ...config };
            delete newConfig[key];
            setConfig(newConfig);
        }
    };

    const handleKeyChange = (oldKey, newKey) => {
        // Renaming a key requires rebuilding the object
        if (oldKey === newKey || newKey.trim() === '' || newKey === 'master') return;
        
        setConfig(prev => {
            const nextConfig = {};
            for (let k in prev) {
                if (k === oldKey) {
                    nextConfig[newKey] = prev[oldKey];
                } else {
                    nextConfig[k] = prev[k];
                }
            }
            return nextConfig;
        });
    }


    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Agent DNA...</div>;
    if (error && !config) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

    const specialistKeys = Object.keys(config).filter(k => k !== 'master');

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 0 0.5rem 0' }}>
                        <BrainCircuit size={32} color="#6366f1" />
                        AI Swarm Topology
                    </h1>
                    <p style={{ color: '#64748b', margin: 0 }}>Configure the Orchestrator and Specialized Agents dictating Aura's brain.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={fetchConfig}
                        style={{ padding: '0.75rem 1rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}
                    >
                        <RefreshCw size={18} /> Reload
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
                    >
                        <Save size={18} /> {saving ? 'Saving...' : 'Deploy Configuration'}
                    </button>
                </div>
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
            {successMessage && <div style={{ background: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{successMessage}</div>}

            {/* MASTER ORCHESTRATOR */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '3rem', border: '1px solid #e0e7ff', borderLeft: '6px solid #6366f1' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', margin: '0 0 1.5rem 0', color: '#312e81' }}>
                    <Server size={24} /> Master Orchestrator
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Agent Key</label>
                        <input value="master" disabled style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#94a3b8' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Display Name</label>
                        <input 
                            value={config.master.name || ''} 
                            onChange={(e) => handleMasterChange('name', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Target Model</label>
                        <input 
                            value={config.master.model || ''} 
                            onChange={(e) => handleMasterChange('model', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Core Routing Prompt (Context)</label>
                    <textarea 
                        value={config.master.prompt || ''} 
                        onChange={(e) => handleMasterChange('prompt', e.target.value)}
                        style={{ width: '100%', height: '120px', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem' }} 
                    />
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Ensure this prompt commands the Master to output JSON mapping to the sub-agent keys below.</p>
                </div>
            </motion.div>


            {/* SPECIALIST AGENTS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', margin: 0 }}>Specialist Agents</h2>
                <button 
                    onClick={addAgent}
                    style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}
                >
                    <Plus size={18} /> Spawn Agent
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
                {specialistKeys.map((key, idx) => {
                    const agent = config[key];
                    return (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} key={key} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', position: 'relative' }}>
                            <button onClick={() => removeAgent(key)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
                                <Trash2 size={20} />
                            </button>

                            <div style={{ marginBottom: '1rem', paddingRight: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Internal Key</label>
                                <input 
                                    defaultValue={key}
                                    onBlur={(e) => handleKeyChange(key, e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', border: 'none', borderBottom: '2px solid #e2e8f0', fontWeight: '700', fontSize: '1.1rem', color: '#0f172a', outline: 'none', background: 'transparent' }} 
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem' }}>Display Name</label>
                                    <input 
                                        value={agent.name || ''} 
                                        onChange={(e) => handleAgentChange(key, 'name', e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem' }}>Target Model</label>
                                    <input 
                                        value={agent.model || ''} 
                                        onChange={(e) => handleAgentChange(key, 'model', e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} 
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem' }}>Database Modules (CSV)</label>
                                <input 
                                    value={(agent.allowed_modules || []).join(', ')} 
                                    onChange={(e) => handleModulesChange(key, e.target.value)}
                                    placeholder="mod01_student_profiles, mod02_..."
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem' }}>System Prompt / Context</label>
                                <textarea 
                                    value={agent.prompt || ''} 
                                    onChange={(e) => handleAgentChange(key, 'prompt', e.target.value)}
                                    style={{ width: '100%', height: '100px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', resize: 'vertical', fontSize: '0.85rem' }} 
                                />
                            </div>

                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
};

export default AdminAgentConfig;
