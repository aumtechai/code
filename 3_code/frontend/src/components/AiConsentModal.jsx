import React from 'react';
import { Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiConsentModal = ({ isOpen, onClose, onConsent }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', maxWidth: '500px', width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                    >
                        <div style={{ width: '60px', height: '60px', background: '#eef2ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Shield size={32} color="#4f46e5" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>AI Privacy Disclosure</h2>
                        <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            To provide academic guidance and features such as scanning and summarization, Aura processes your data using <strong style={{color: '#111827'}}>Google Gemini</strong>, a third-party AI service.
                        </p>
                        
                        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>What data is shared?</div>
                            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Your chat queries and conversations</li>
                                <li>Uploaded documents (syllabi, voice notes, coursework)</li>
                                <li>Relevant academic context (GPA, course list)</li>
                            </ul>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '2rem' }}>
                            Your data is sent securely to Google for processing only. By clicking "I Consent", you agree to this data sharing for AI features.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button 
                                onClick={onClose}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', color: '#4b5563', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.setItem('aura_ai_consent', 'true');
                                    onConsent();
                                }}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(to right, #4f46e5, #ec4899)', fontWeight: '700', color: 'white', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)' }}
                            >
                                I Consent
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AiConsentModal;
