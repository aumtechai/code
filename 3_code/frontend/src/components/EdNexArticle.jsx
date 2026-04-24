import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import { BookOpen, Briefcase, Bell, BarChart2, User, Calendar } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import logo from '../assets/logo.png';
import './EdNexArticle.css';

const EdNexArticle = () => {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <div className="ednex-article-container">
                <h2 className="sr-only" style={{ position:"absolute", width:"1px", height:"1px", overflow:"hidden", clip:"rect(0,0,0,0)" }}>EdNex platform by aumtech.ai – About page describing student success modules for academic and career outcomes</h2>
                
                <div className="hero-full-bleed" style={{ marginBottom: '1rem' }}>
                    <div className="hero-full-bleed-spacer"></div>
                    <div className="hero-full-bleed-content hero-full-bleed-content-1000">
                        <p className="hero-eyebrow" style={{ textAlign: 'left', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>AUMTECH.AI &nbsp;·&nbsp; EDNEX PLATFORM</p>
                        <h1 className="hero-title" style={{ textAlign: 'left', marginLeft: 0, fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: '1.1', color: '#0f172a', marginBottom: '1rem' }}>The intelligence layer for <span>student success</span></h1>
                        <p className="hero-sub" style={{ textAlign: 'left', marginLeft: 0 }}>EdNex unifies academic advising, career readiness, early intervention, and institutional analytics into a single platform — purpose-built for every student, every program, and every institution.</p>
                        <div className="hero-badges" style={{ justifyContent: 'flex-start' }}>
                            <span className="badge highlight">Academic Success</span>
                            <span className="badge">Career Readiness</span>
                            <span className="badge">Early Alert & Retention</span>
                            <span className="badge">Institutional Analytics</span>
                            <span className="badge">All Programs & Disciplines</span>
                        </div>
                    </div>
                    <div className="hero-full-bleed-logo-wrap">
                        <img src={logo} alt="Aumtech Logo" className="hero-full-bleed-logo" />
                    </div>
                </div>

                <div className="ednex-section">
                    <p className="section-label">The problem we solve</p>
                    <h2 className="section-title">Student success is fragmented. EdNex connects it.</h2>
                    <p className="section-desc">Across universities, advising teams, career centers, faculty, and student affairs operate in silos. Students fall through the cracks not because of a lack of resources, but because those resources can't see or communicate with each other. EdNex changes that.</p>

                    <div className="stat-row">
                        <div className="stat-card"><div className="stat-num">40%</div><div className="stat-label">of students who struggle never connect with an advisor</div></div>
                        <div className="stat-card"><div className="stat-num">67%</div><div className="stat-label">of employers say graduates lack career readiness skills</div></div>
                        <div className="stat-card"><div className="stat-num">1 in 3</div><div className="stat-label">students do not complete their degree within 6 years</div></div>
                        <div className="stat-card"><div className="stat-num">5+</div><div className="stat-label">disconnected systems the average advising team uses daily</div></div>
                    </div>

                    <div className="quote-block">
                        <p className="quote-text">"EdNex gives every advisor, career counselor, and faculty member a unified, real-time picture of every student — so no one is invisible, and no opportunity is missed."</p>
                        <p className="quote-attr">— EdNex platform philosophy</p>
                    </div>
                </div>

                <div className="ednex-section" style={{ paddingTop: 0 }}>
                    <p className="section-label">Platform modules</p>
                    <h2 className="section-title">Everything student success requires, in one platform</h2>
                    <p className="section-desc">EdNex is built around four interconnected modules that share a single student record, a unified workflow engine, and institution-wide analytics.</p>

                    <div className="module-grid">
                        <div className="module-card">
                            <div className="module-icon"><BookOpen size={20} /></div>
                            <div className="module-title">Academic Advising Hub</div>
                            <div className="module-desc">Degree audit, course planning, what-if analysis, graduation roadmaps, and advisor caseload management across all majors and programs.</div>
                        </div>
                        <div className="module-card">
                            <div className="module-icon"><Briefcase size={20} /></div>
                            <div className="module-title">Career Success Studio</div>
                            <div className="module-desc">Career exploration, résumé builder, employer matching, internship and co-op tracking, interview prep, and alumni mentorship networks.</div>
                        </div>
                        <div className="module-card">
                            <div className="module-icon"><Bell size={20} /></div>
                            <div className="module-title">Early Alert & Intervention</div>
                            <div className="module-desc">Predictive risk scoring, attendance and grade-flag triggers, coordinated care teams, progress reports, and automated outreach workflows.</div>
                        </div>
                        <div className="module-card">
                            <div className="module-icon"><BarChart2 size={20} /></div>
                            <div className="module-title">Institutional Intelligence</div>
                            <div className="module-desc">Enrollment trends, retention dashboards, equity gap analytics, program-level outcomes, accreditation reporting, and executive scorecards.</div>
                        </div>
                        <div className="module-card">
                            <div className="module-icon"><User size={20} /></div>
                            <div className="module-title">Holistic Student Profile</div>
                            <div className="module-desc">A unified 360° view of every student: academics, extracurriculars, financial aid flags, wellness indicators, and engagement history.</div>
                        </div>
                        <div className="module-card">
                            <div className="module-icon"><Calendar size={20} /></div>
                            <div className="module-title">Engagement & Appointments</div>
                            <div className="module-desc">Self-service scheduling, walk-in queuing, virtual advising, group campaigns, nudge messaging, and service utilization tracking.</div>
                        </div>
                    </div>
                </div>

                <div className="ednex-section" style={{ paddingTop: 0 }}>
                    <p className="section-label">Academic success features</p>
                    <h2 className="section-title">Built for every discipline — from pre-med to architecture</h2>
                    <p className="section-desc">EdNex supports institutions with complex multi-disciplinary catalogs including engineering, STEM, fine arts, architecture, law, medicine, dentistry, and all professional programs.</p>

                    <div className="feature-row">
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">Degree planning</span>
                            </div>
                            <ul className="feature-list">
                                <li>Multi-year graduation roadmaps by major</li>
                                <li>What-if major/minor exploration</li>
                                <li>Real-time degree audit with credit mapping</li>
                                <li>Transfer credit equivalency engine</li>
                                <li>Professional licensure requirement tracking</li>
                            </ul>
                        </div>
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">Risk & retention</span>
                            </div>
                            <ul className="feature-list">
                                <li>Predictive success scoring updated weekly</li>
                                <li>Grade and attendance flag automation</li>
                                <li>Faculty-initiated progress reports</li>
                                <li>Coordinated care team case management</li>
                                <li>First-generation and equity-gap dashboards</li>
                            </ul>
                        </div>
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">Advising workflows</span>
                            </div>
                            <ul className="feature-list">
                                <li>Caseload assignment and balancing tools</li>
                                <li>Appointment notes with structured templates</li>
                                <li>Automated pre-registration checklists</li>
                                <li>Integrated messaging and nudge campaigns</li>
                                <li>Advisor performance and activity reports</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="ednex-section" style={{ paddingTop: 0 }}>
                    <p className="section-label">Career success features</p>
                    <h2 className="section-title">From classroom to career — every step connected</h2>
                    <p className="section-desc">EdNex bridges the gap between academic milestones and career outcomes, making career development a continuous thread through every semester.</p>

                    <div className="feature-row">
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">Career exploration</span>
                            </div>
                            <ul className="feature-list">
                                <li>Major-to-career pathway mapping</li>
                                <li>Occupational outlook and salary data</li>
                                <li>Skills gap assessment and learning plans</li>
                                <li>Interest and strength profiling tools</li>
                                <li>Alumni career outcome comparisons</li>
                            </ul>
                        </div>
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">Employer & opportunity hub</span>
                            </div>
                            <ul className="feature-list">
                                <li>Job, internship, and co-op board</li>
                                <li>Employer relationship management</li>
                                <li>On-campus recruiting coordination</li>
                                <li>Research, fellowship, and grant postings</li>
                                <li>Outcome tracking and placement reporting</li>
                            </ul>
                        </div>
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">Readiness development</span>
                            </div>
                            <ul className="feature-list">
                                <li>AI-assisted résumé and cover letter builder</li>
                                <li>Mock interview scheduling and feedback</li>
                                <li>Professional milestone badge tracking</li>
                                <li>Mentorship matching with alumni network</li>
                                <li>Graduate and professional school prep</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="ednex-section" style={{ paddingTop: 0 }}>
                    <p className="section-label">Student journey</p>
                    <h2 className="section-title">Supporting students from day one through graduation and beyond</h2>
                    <p className="section-desc">EdNex meets students at every critical moment in their academic journey with the right intervention, resource, or opportunity.</p>

                    <div className="journey-steps">
                        <div className="journey-step">
                            <div className="step-line-wrap">
                                <div className="step-circle">1</div>
                                <div className="step-connector"></div>
                            </div>
                            <div className="step-content">
                                <div className="step-title">Enrollment & orientation</div>
                                <div className="step-desc">Pre-enrollment advising, placement assessment integration, first-semester roadmap generation, and orientation task completion tracking.</div>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-line-wrap">
                                <div className="step-circle">2</div>
                                <div className="step-connector"></div>
                            </div>
                            <div className="step-content">
                                <div className="step-title">Early academic milestones</div>
                                <div className="step-desc">Proactive outreach for at-risk students, major declaration workflows, financial aid progress flags, and learning community coordination.</div>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-line-wrap">
                                <div className="step-circle">3</div>
                                <div className="step-connector"></div>
                            </div>
                            <div className="step-content">
                                <div className="step-title">Mid-program development</div>
                                <div className="step-desc">Internship and research opportunity matching, skills portfolio building, academic standing review, and graduate school exploration.</div>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-line-wrap">
                                <div className="step-circle">4</div>
                                <div className="step-connector"></div>
                            </div>
                            <div className="step-content">
                                <div className="step-title">Pre-graduation & career launch</div>
                                <div className="step-desc">Graduation application workflows, licensure exam prep tracking, employer recruiting, job offer logging, and outcomes survey automation.</div>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-line-wrap">
                                <div className="step-circle">5</div>
                            </div>
                            <div className="step-content">
                                <div className="step-title">Alumni & institutional outcomes</div>
                                <div className="step-desc">Alumni mentorship network activation, placement rate reporting, program accreditation data exports, and longitudinal outcome analytics.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ednex-section" style={{ paddingTop: 0 }}>
                    <p className="section-label">Who EdNex serves</p>
                    <h2 className="section-title">Designed for every institution</h2>
                    <p className="section-desc">Whether you lead a flagship research university or a regional community college, EdNex scales to your mission, your structure, and your students.</p>

                    <div className="inst-grid">
                        <div className="inst-card">
                            <div className="inst-label">Research universities</div>
                            <div className="inst-sub">Multi-college complexity, professional programs, graduate schools</div>
                        </div>
                        <div className="inst-card">
                            <div className="inst-label">State colleges</div>
                            <div className="inst-sub">Regional access, workforce alignment, transfer pathways</div>
                        </div>
                        <div className="inst-card">
                            <div className="inst-label">Community colleges</div>
                            <div className="inst-sub">Two-year programs, dual enrollment, continuing education</div>
                        </div>
                        <div className="inst-card">
                            <div className="inst-label">Technical schools</div>
                            <div className="inst-sub">CTE programs, certifications, industry credentialing</div>
                        </div>
                        <div className="inst-card">
                            <div className="inst-label">Professional schools</div>
                            <div className="inst-sub">Law, medicine, dental, pharmacy, and allied health</div>
                        </div>
                    </div>
                </div>

                <div className="ednex-section" style={{ paddingTop: 0 }}>
                    <p className="section-label">Technology & integration</p>
                    <h2 className="section-title">Built to connect — not replace — your existing stack</h2>
                    <p className="section-desc">EdNex integrates natively with leading SIS, LMS, financial aid, and HR systems so your teams work in one place without rebuilding what already works.</p>

                    <div className="feature-row">
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">SIS & LMS connectors</span>
                            </div>
                            <ul className="feature-list">
                                <li>Banner, PeopleSoft, Workday Student</li>
                                <li>Canvas, Blackboard, Moodle, D2L</li>
                                <li>Real-time grade and enrollment sync</li>
                                <li>FERPA-compliant data handling</li>
                            </ul>
                        </div>
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">AI & data engine</span>
                            </div>
                            <ul className="feature-list">
                                <li>Predictive risk models trained per institution</li>
                                <li>Natural language advisor note summaries</li>
                                <li>Intelligent appointment routing</li>
                                <li>Equity-aware algorithmic design</li>
                            </ul>
                        </div>
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-dot"></div>
                                <span className="feature-title">Security & compliance</span>
                            </div>
                            <ul className="feature-list">
                                <li>FERPA, SOC 2 Type II, WCAG 2.1 AA</li>
                                <li>SSO via SAML 2.0 and OAuth</li>
                                <li>Role-based access and audit trails</li>
                                <li>Cloud-native with 99.9% SLA uptime</li>
                            </ul>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2 className="cta-title">Ready to transform student success at your institution?</h2>
                        <p className="cta-sub">Join leading universities and colleges already using EdNex to close equity gaps, improve retention, and launch students into meaningful careers.</p>
                        <div className="cta-buttons">
                            {!Capacitor.isNativePlatform() && (
                                <>
                                    <button className="btn-primary" onClick={() => navigate("/request-demo")}>Request a demo ↗</button>
                                    <button className="btn-secondary" onClick={() => navigate("/request-quote")}>Explore pricing & implementation ↗</button>
                                </>
                            )}
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "1.5rem" }}>EdNex is a product of aumtech.ai &nbsp;·&nbsp; Built for higher education &nbsp;·&nbsp; Trusted by institutions nationwide</p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default EdNexArticle;
