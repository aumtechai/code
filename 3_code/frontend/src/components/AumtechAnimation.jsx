import React from 'react';
import { motion } from 'framer-motion';
import { 
    School, 
    DollarSign, 
    FileText, 
    Database, 
    Cloud, 
    Settings, 
    Zap, 
    Brain, 
    Activity 
} from 'lucide-react';
import './AumtechAnimation.css';

const AumtechAnimation = () => {
    return (
        <div className="aumtech-arcadedb-theme">
            {/* 1. LEFT COLUMN: INSTITUTIONS */}
            <div className="arc-column institutions-col">
                <div className="col-header">Institutions</div>
                <div className="node-stack">
                    <motion.div className="arc-card blue-card">
                        <School className="card-icon" />
                        <div className="card-content">
                            <span className="card-title">SIS</span>
                            <span className="card-subtitle">Banner, Workday</span>
                        </div>
                    </motion.div>
                    <motion.div className="arc-card blue-card">
                        <DollarSign className="card-icon" />
                        <div className="card-content">
                            <span className="card-title">Finance</span>
                            <span className="card-subtitle">PeopleSoft</span>
                        </div>
                    </motion.div>
                    <motion.div className="arc-card blue-card">
                        <FileText className="card-icon" />
                        <div className="card-content">
                            <span className="card-title">Unstructured</span>
                            <span className="card-subtitle">Canvas, PDFs</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* FLOW ARROWS 1 -> 2 */}
            <div className="connector-block">
                <svg className="connector-svg">
                    <path d="M 0 100 L 100 100" />
                    <path d="M 0 200 L 100 200" />
                    <path d="M 0 300 L 100 300" />
                </svg>
            </div>

            {/* 2. CENTER COLUMN: EDNEX PLATFORM */}
            <div className="arc-column ednex-col">
                <div className="col-header">EdNex Platform</div>
                <div className="ednex-container">
                    <div className="sub-path">
                        <span className="path-label">Structured Data</span>
                        <div className="arc-card green-card wide-card">
                            <Database className="card-icon" />
                            <span className="card-title">PostgreSQL</span>
                        </div>
                    </div>
                    <div className="sub-path">
                        <span className="path-label">Unstructured Data</span>
                        <div className="horizontal-flow">
                            <div className="stack-node">
                                <Cloud className="node-icon" />
                                <span>S3 Storage</span>
                            </div>
                            <div className="arrow-node">→</div>
                            <div className="stack-node">
                                <Settings className="node-icon" />
                                <span>Parser</span>
                            </div>
                            <div className="arrow-node">→</div>
                            <div className="arc-card green-card">
                                <Activity className="card-icon" />
                                <span className="card-title">Vector DB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOW ARROWS 2 -> 3 */}
            <div className="connector-block">
                <svg className="connector-svg">
                    <path d="M 0 150 L 100 250" />
                    <path d="M 0 320 L 100 260" />
                </svg>
            </div>

            {/* 3. RIGHT COLUMN: INTELLIGENCE LAYER */}
            <div className="arc-column intelligence-col">
                <div className="col-header">Intelligence Layer</div>
                <div className="node-stack">
                    <motion.div className="arc-card purple-card gateway-card">
                        <Zap className="card-icon" />
                        <div className="card-content">
                            <span className="card-title">API Gateway</span>
                            <span className="card-subtitle">FastAPI Orchestration</span>
                        </div>
                    </motion.div>
                    <div className="v-arrow">↓</div>
                    <motion.div className="arc-card purple-card brain-card">
                        <Brain className="card-icon" />
                        <div className="card-content">
                            <span className="card-title">LLM Context Engine</span>
                            <span className="card-subtitle">AI Reasoning Layer</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* SVG OVERLAY FOR MOVING PULSES */}
            <svg className="pulse-svg">
                <circle r="4" fill="#3b82f6" className="pulse-dot">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 180 150 L 350 180" />
                </circle>
                <circle r="4" fill="#10b981" className="pulse-dot">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 680 200 L 850 250" />
                </circle>
            </svg>
        </div>
    );
};

export default AumtechAnimation;
