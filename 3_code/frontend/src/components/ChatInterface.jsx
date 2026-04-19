import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Send, BookOpen, CheckSquare, Paperclip, X, Brain, Shield, User, Zap, Activity, Info, ChevronRight, Search, FileSearch, Database, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AiConsentModal from './AiConsentModal';

const ChatInterface = ({ mode, initialSessionId = null, prefilledData = null, onNavigate }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasConsented, setHasConsented] = useState(localStorage.getItem('aura_ai_consent') === 'true');
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [thinkingStep, setThinkingStep] = useState(0); // 0: Idle, 1: Querying EdNex, 2: Context Retrieval, 3: Syllabi Scan
    const [activeSessionId, setActiveSessionId] = useState(initialSessionId);
    const [attachment, setAttachment] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const suggestons = [
        { label: "Check my GPA", query: "What is my current cumulative GPA?" },
        { label: "Holds & Alerts", query: "Do I have any administrative holds or academic alerts?" },
        { label: "Next Deadline", query: "When is my next major assignment or form deadline?" },
        { label: "Analyze Syllabus", query: "Analyze my uploaded syllabi for key dates." },
        { label: "Degree Path", query: "How many courses do I need for my degree?" }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (initialSessionId) {
            setActiveSessionId(initialSessionId);
            loadHistory(initialSessionId);
        } else {
            setActiveSessionId(null);
            setMessages([]);
        }
    }, [initialSessionId, mode]);

    useEffect(() => {
        if (prefilledData && prefilledData.message) {
            setInput(prefilledData.message);
        }
    }, [prefilledData]);

    const loadHistory = async (id) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/chat/history/${id}`);
            const formatted = res.data.map(msg => {
                let content = msg.content;
                if (msg.sender === 'ai' && typeof content === 'string') {
                    try { content = JSON.parse(content); } catch (_e) { /* ignore parse error */ }
                }

                if (msg.sender === 'ai' && typeof content === 'object') {
                    return { sender: 'ai', ...content };
                }
                return { sender: msg.sender, content: content };
            });
            setMessages(formatted);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!hasConsented) {
            setShowConsentModal(true);
            return;
        }

        if (!input.trim() && !attachment) return;

        // Optimistic Update
        let displayContent = input;
        if (attachment) displayContent += `\n[Attached: ${attachment.name}]`;

        const userMsg = { sender: 'user', content: displayContent };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setShowSuggestions(false);

        const currentAttachment = attachment;
        setAttachment(null); // Clear early
        setLoading(true);
        setThinkingStep(1);

        try {
            // Visualize background agent work
            setTimeout(() => setThinkingStep(2), 1200);
            setTimeout(() => setThinkingStep(3), 2400);

            // Upload File first if exists
            let fileId = null;
            if (currentAttachment) {
                const formData = new FormData();
                formData.append('file', currentAttachment);
                const uploadRes = await api.post('/api/chat/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                fileId = uploadRes.data.filename;
            }

            // Send Query
            const payload = {
                query: input || "Analyze the attached document.", // Fallback if only file sent
                session_id: activeSessionId,
                file_id: fileId
            };

            const response = await api.post('/api/chat/query', payload);

            if (response.data.session_id) {
                setActiveSessionId(response.data.session_id);
            }

            setMessages(prev => [...prev, { sender: 'ai', ...response.data }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', message_content: `[DEBUG] Request failed: ${error.message} (Status: ${error.response?.status})` }]);
        } finally {
            setLoading(false);
            setThinkingStep(0);
        }
    };

    const handleConsent = () => {
        setHasConsented(true);
        setShowConsentModal(false);
        if (input.trim() || attachment) {
            sendMessage({ preventDefault: () => {} });
        }
    };

    const runSuggestion = (query) => {
        setInput(query);
        sendMessage({ preventDefault: () => {} });
    };

    const getIntro = () => {
        if (activeSessionId) return null;
        if (mode === 'tutor') return { title: "Hello! I am The Tutor.", sub: "I can help you understand course material, review essays, and solve problems." };
        if (mode === 'admin') return { title: "Hello! I am The Admin.", sub: "Ask me about forms, deadlines, financial aid, and registration." };
        if (mode === 'fafsa') return { title: "Hello! I am your FAFSA Expert.", sub: "I can guide you through the FAFSA application, explain financial terms, and help with tax data questions." };
        if (mode === 'coach') return { title: "Hello! I am The Coach.", sub: "I'm here to support your mental health and well-being." };
        if (mode === 'strategist') return { title: "Hello! I am The Strategist.", sub: "I can query anonymized historical student outcomes to provide peer-based grade recovery pathways and retake analysis." };
        return { title: "Hello! I am Student Success.", sub: "Ask me about your courses, grades, deadlines, or how you're feeling." };
    };
    const intro = getIntro();

    return (
        <div className="chat-container glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0, boxShadow: 'none', border: 'none', background: '#fcfdff' }}>
            
            {/* NOVEL AGENT STATUS BAR */}
            <div style={{ 
                padding: '0.75rem 1.5rem', 
                background: '#ffffff', 
                borderBottom: '1px solid #f1f5f9', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#64748b'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1' }}>
                        <Zap size={14} fill="#6366f1" /> SYSTEM ONLINE v3.1-DEBUG
                    </div>
                    <div style={{ width: '1px', height: '12px', background: '#e2e8f0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Activity size={14} /> EDNEX SYNCED
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#94a3b8' }}>3 AGENTS ACTIVE</span>
                    <div style={{ display: 'flex', gap: '-4px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#4f46e5', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><User size={12} /></div>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', border: '2px solid white', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Shield size={12} /></div>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ec4899', border: '2px solid white', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Zap size={12} /></div>
                    </div>
                    <button 
                        onClick={() => onNavigate && onNavigate('book-advisor')}
                        style={{ marginLeft: '12px', padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)' }}
                    >
                        <ShieldAlert size={14} /> Escalate to L2 Human
                    </button>
                </div>
            </div>

            <div style={{ 
                flex: 1, 
                padding: window.innerWidth <= 768 ? '1rem' : '2rem', 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem' 
            }}>
                {messages.length === 0 && intro && (
                    <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto' }}
                        >
                            <div style={{ width: '70px', height: '70px', background: 'var(--hero-gradient)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'white' }}>
                                <Brain size={36} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', color: '#1e293b' }}>{intro.title}</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6' }}>{intro.sub}</p>
                        </motion.div>

                        {/* SUGGESTION CHIPS */}
                        <AnimatePresence>
                            {showSuggestions && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', maxWidth: '700px', margin: '2.5rem auto 0 auto' }}
                                >
                                    {suggestons.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => runSuggestion(s.query)}
                                            style={{
                                                padding: '10px 20px',
                                                background: '#ffffff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '30px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                color: '#1e293b',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#f5f7ff'; }}
                                            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
                                        >
                                            <Search size={14} color="#6366f1" /> {s.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', width: 'auto' }}
                    >
                        <div style={{
                            background: msg.sender === 'user' ? 'var(--hero-gradient)' : '#ffffff',
                            color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                            padding: '1.25rem 1.5rem',
                            borderRadius: '24px',
                            borderTopRightRadius: msg.sender === 'user' ? '4px' : '24px',
                            borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '24px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
                            border: msg.sender === 'ai' ? '1px solid #e2e8f0' : 'none',
                            position: 'relative'
                        }}>
                            {/* AGENT PERSONA BADGE */}
                            {msg.sender === 'ai' && (
                                <div style={{ position: 'absolute', top: '-10px', left: '16px', background: '#6366f1', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}>
                                    AURA-AGENT
                                </div>
                            )}

                            {msg.sender === 'user' ? <div style={{ whiteSpace: 'pre-wrap', fontWeight: '500' }}>{msg.content}</div> : (
                                <div>
                                    <div style={{ lineHeight: '1.7', fontSize: '0.975rem' }}>
                                        {msg.message_content || msg.content}
                                    </div>

                                    {msg.cited_sources && msg.cited_sources.length > 0 && (
                                        <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', marginBottom: '0.6rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                <BookOpen size={14} /> Intelligence Sources
                                            </div>
                                            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {msg.cited_sources.map((source, i) => <li key={i}>{source}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {msg.action_items && msg.action_items.length > 0 && (
                                        <div style={{ marginTop: '1.25rem', background: '#fdf4ff', padding: '1rem', borderRadius: '16px', border: '1px solid #fae8ff' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', marginBottom: '0.75rem', color: '#a21caf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                <CheckSquare size={16} /> Recommended Actions
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {msg.action_items.map((item, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#4a044e', fontSize: '0.9rem', fontWeight: '600' }}>
                                                        <div style={{ marginTop: '4px', width: '18px', height: '18px', background: 'white', border: '2px solid #d946ef', borderRadius: '4px' }} />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* DEBUG / SWARM INSIGHT SECTION */}
                                    {msg.routing_reason && (
                                         <div style={{ marginTop: '1.25rem', padding: '12px', background: '#f0f9ff', borderRadius: '12px', border: '2px solid #bae6fd', fontSize: '0.75rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)' }}>
                                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', marginBottom: '6px', color: '#0369a1', textTransform: 'uppercase' }}>
                                                 <Brain size={12} /> Aura Swarm Intelligence Insight
                                             </div>
                                             <div style={{ color: '#075985', fontStyle: 'italic', marginBottom: '8px', fontSize: '0.8rem' }}>
                                                 Orchestrator Decision: "{msg.routing_reason}"
                                             </div>
                                             {msg.processing_seconds && (
                                                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0ea5e9', fontWeight: '700' }}>
                                                     <Zap size={10} fill="#0ea5e9" /> Swarm Processed in {parseFloat(msg.processing_seconds).toFixed(2)}s
                                                 </div>
                                             )}
                                         </div>
                                     )}

                                     <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                         <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Still need help?</span>
                                         <button 
                                             onClick={() => onNavigate && onNavigate('book-advisor')}
                                             style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                                             onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                                             onMouseOut={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                                         >
                                             <User size={14} /> Escalate to Human Advisor (L2)
                                         </button>
                                     </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}
                    >
                        <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6366f1' }}>
                                {thinkingStep === 1 && <><Database size={18} className="animate-pulse" /> <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Querying EdNex Platform...</span></>}
                                {thinkingStep === 2 && <><Search size={18} className="animate-pulse" /> <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Retrieving Academic Context...</span></>}
                                {thinkingStep === 3 && <><FileSearch size={18} className="animate-pulse" /> <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Finalizing AI Reasoning...</span></>}
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ 
                padding: window.innerWidth <= 768 ? '1.25rem' : '1.75rem', 
                paddingBottom: window.innerWidth <= 768 ? 'calc(1.25rem + env(safe-area-inset-bottom))' : '1.75rem',
                borderTop: '1px solid #f1f5f9', 
                background: '#ffffff',
                boxShadow: '0 -10px 15px -3px rgba(0,0,0,0.02)'
            }}>
                {attachment && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', fontSize: '0.85rem', background: '#f5f7ff', padding: '6px 12px', borderRadius: '10px', width: 'fit-content', border: '1px solid #e0e7ff', color: '#4f46e5', fontWeight: '600' }}>
                        <Paperclip size={14} /> {attachment.name}
                        <X size={14} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setAttachment(null)} />
                    </div>
                )}
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem', position: 'relative', alignItems: 'center' }}>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ 
                            background: '#4f46e5', 
                            border: 'none', 
                            cursor: 'pointer', 
                            width: '46px',
                            minWidth: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(79,70,229,0.35)'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#4338ca'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.5)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(79,70,229,0.35)'; }}
                        title="Attach Document"
                    >
                        <Paperclip size={20} color="white" strokeWidth={2.5} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />

                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            style={{
                                width: '100%',
                                color: '#1e293b',
                                border: '2px solid #f1f5f9',
                                background: '#f8fafc',
                                padding: '16px 24px',
                                borderRadius: '16px',
                                fontSize: '1rem',
                                outline: 'none',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#6366f1';
                                e.target.style.background = '#ffffff';
                                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#f1f5f9';
                                e.target.style.background = '#f8fafc';
                                e.target.style.boxShadow = 'none';
                            }}
                            placeholder="Ask Aura anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowConsentModal(true)}
                        style={{ 
                            background: '#0f172a', 
                            border: 'none', 
                            cursor: 'pointer', 
                            width: '46px',
                            minWidth: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(15,23,42,0.25)'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.35)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.25)'; }}
                        title="AI Privacy Info"
                    >
                        <Info size={20} color="white" strokeWidth={2.5} />
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '52px',
                            minWidth: '52px',
                            height: '52px',
                            borderRadius: '16px',
                            padding: 0,
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
                            opacity: (loading || (!input.trim() && !attachment)) ? 0.5 : 1,
                            cursor: (loading || (!input.trim() && !attachment)) ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0
                        }}
                        onMouseOver={e => { if (!loading && (input.trim() || attachment)) e.currentTarget.style.boxShadow = '0 6px 16px rgba(79,70,229,0.5)'; }}
                        onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.4)'; }}
                    >
                        <Send size={22} color="white" />
                    </button>
                </form>
                <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.02em' }}>
                    Aura AI is powered by Google Gemini. Data shared for academic processing.
                </div>
            </div>
            {/* PRIVACY CONSENT MODAL (Apple Compliance) */}
            <AiConsentModal 
                isOpen={showConsentModal} 
                onClose={() => setShowConsentModal(false)}
                onConsent={handleConsent}
            />
        </div>
    );
};

export default ChatInterface;
