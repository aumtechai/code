import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Send, BookOpen, CheckSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInterface = ({ mode }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    // Clear messages when switching modes (optional, but good for context switching)
    useEffect(() => {
        setMessages([]);
    }, [mode]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post(
                '/api/chat/query',
                null,
                { params: { query: userMsg.content } }
            );

            setMessages(prev => [...prev, { sender: 'ai', ...response.data }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', message_content: "Error connecting to Student Success." }]);
        } finally {
            setLoading(false);
        }
    };

    const getIntro = () => {
        if (mode === 'tutor') return { title: "Hello! I am The Tutor.", sub: "I can help you understand course material, review essays, and solve problems." };
        if (mode === 'admin') return { title: "Hello! I am The Admin.", sub: "Ask me about forms, deadlines, financial aid, and registration." };
        if (mode === 'coach') return { title: "Hello! I am The Coach.", sub: "I'm here to support your mental health and well-being." };
        return { title: "Hello! I am Student Success.", sub: "Ask me about your courses, grades, deadlines, or how you're feeling." };
    };
    const intro = getIntro();

    return (
        <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0, boxShadow: 'none' }}>
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', opacity: 0.5 }}>
                        <h3>{intro.title}</h3>
                        <p>{intro.sub}</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx}
                        style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}
                    >
                        <div style={{
                            background: msg.sender === 'user' ? 'var(--primary-color)' : 'var(--card-bg)',
                            padding: '1rem',
                            borderRadius: '12px',
                            borderTopRightRadius: msg.sender === 'user' ? '0' : '12px',
                            borderTopLeftRadius: msg.sender === 'ai' ? '0' : '12px'
                        }}>
                            {msg.sender === 'user' ? msg.content : (
                                <div>
                                    <p>{msg.message_content}</p>

                                    {msg.cited_sources && msg.cited_sources.length > 0 && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><BookOpen size={14} /> <strong>Sources:</strong></div>
                                            <ul>
                                                {msg.cited_sources.map((source, i) => <li key={i}>{source}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {msg.action_items && msg.action_items.length > 0 && (
                                        <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckSquare size={14} /> <strong>Action Items:</strong></div>
                                            {msg.action_items.map((item, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                                    <input type="checkbox" /> <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {loading && <div style={{ alignSelf: 'flex-start', padding: '1rem' }}>Thinking...</div>}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', background: 'white' }}>
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                    <input
                        style={{
                            flex: 1,
                            color: 'black',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            padding: '16px 20px',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            padding: 0
                        }}
                    >
                        <Send size={22} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
