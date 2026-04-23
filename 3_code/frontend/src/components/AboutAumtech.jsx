import React from 'react';
import PublicLayout from './PublicLayout';
import { Layers, Briefcase, UserPlus, FileText, BarChart2, Monitor, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import './AboutAumtech.css';

const AboutAumtech = () => {
    return (
        <PublicLayout>
            <div className="about-aumtech">
                {/* 1. Hero Section */}
                <div className="hero-full-bleed">
                    <div className="hero-full-bleed-spacer"></div>
                    <div className="hero-full-bleed-content hero-full-bleed-content-1000">
                        <p className="about-eyebrow" style={{ textAlign: 'left', fontSize: '1rem', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '1rem' }}>BUILT BY PRACTITIONERS</p>
                        <h1 className="about-title" style={{ textAlign: 'left', fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                            50+ years of combined higher education experience
                        </h1>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#475569', fontSize: '1.15rem', lineHeight: '1.6' }}>
                                <div style={{ minWidth: '8px', height: '8px', background: '#4f46e5', borderRadius: '50%', marginTop: '10px' }} />
                                Designed by senior leaders, advisors, and faculty from top AAU and flagship US universities.
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#475569', fontSize: '1.15rem', lineHeight: '1.6' }}>
                                <div style={{ minWidth: '8px', height: '8px', background: '#ec4899', borderRadius: '50%', marginTop: '10px' }} />
                                Built from decades of on-the-ground experience in student success and career counseling.
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#475569', fontSize: '1.15rem', lineHeight: '1.6' }}>
                                <div style={{ minWidth: '8px', height: '8px', background: '#10b981', borderRadius: '50%', marginTop: '10px' }} />
                                Every workflow channels real-world lessons learned into an actionable, proactive platform.
                            </li>
                        </ul>
                    </div>
                    <div className="hero-full-bleed-logo-wrap">
                        <img src={logo} alt="Aumtech Logo" className="hero-full-bleed-logo" />
                    </div>
                </div>

                <section className="about-section" style={{ paddingTop: 0 }}>
                    <div className="hero-stats-box">
                        <div className="hero-stats-row">
                            <div className="hero-stat-item">
                                <div className="hero-stat-number">50+</div>
                                <div className="hero-stat-label">Combined years in higher<br/>education</div>
                            </div>
                            <div className="hero-stat-item">
                                <div className="hero-stat-number">AAU</div>
                                <div className="hero-stat-label">Experience at top<br/>research universities</div>
                            </div>
                            <div className="hero-stat-item">
                                <div className="hero-stat-number">Multi</div>
                                <div className="hero-stat-label">Leadership & academic<br/>positions held</div>
                            </div>
                        </div>
                        <div className="hero-stat-bottom">
                            <div className="hero-stat-number">All</div>
                            <div className="hero-stat-label">Areas of higher education represented</div>
                        </div>
                    </div>

                    <div className="about-text-blocks" style={{ marginTop: '2rem' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#475569', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                <CheckCircle size={22} color="#4f46e5" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <strong style={{ color: '#0f172a' }}>Comprehensive Leadership:</strong> Experience spanning student services, academic affairs, financial aid, and career success.
                                </div>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#475569', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                <CheckCircle size={22} color="#4f46e5" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <strong style={{ color: '#0f172a' }}>Hands-On Advising:</strong> Personally guided thousands of students through critical academic transitions and early interventions.
                                </div>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#475569', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                <CheckCircle size={22} color="#4f46e5" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <strong style={{ color: '#0f172a' }}>Practitioner-Designed:</strong> Built by professionals who managed advisor caseloads under pressure—not just engineers who read about it.
                                </div>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#475569', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                <CheckCircle size={22} color="#4f46e5" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <strong style={{ color: '#0f172a' }}>ROI Focused:</strong> Designed with the understanding that a single timely intervention is often the difference between graduating and dropping out.
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 2. Expertise Domains */}
                <section className="about-section" style={{ paddingTop: '0' }}>
                    <p className="about-eyebrow">TEAM EXPERTISE DOMAINS</p>
                    <h2 className="about-title">Every module reflects real institutional experience</h2>
                    <p className="about-lead">
                        Each core area of EdNex was shaped by team members with direct, hands-on experience in that domain at major US universities.
                    </p>

                    <div className="expertise-grid">
                        <div className="expertise-card">
                            <div className="expertise-icon-wrap">
                                <Layers size={22} />
                            </div>
                            <h3 className="expertise-title">Academic advising</h3>
                            <p className="expertise-desc">
                                Team members who directed advising centers, trained advisor cohorts, and built early alert systems.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <div className="expertise-icon-wrap">
                                <Briefcase size={22} />
                            </div>
                            <h3 className="expertise-title">Career services</h3>
                            <p className="expertise-desc">
                                Professionals who managed career centers, coordinated campus recruiting, and built industry partnerships.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <div className="expertise-icon-wrap">
                                <UserPlus size={22} />
                            </div>
                            <h3 className="expertise-title">Student affairs</h3>
                            <p className="expertise-desc">
                                Leaders who designed and ran retention programs, wellness coordination, and first-generation student support.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <div className="expertise-icon-wrap">
                                <FileText size={22} />
                            </div>
                            <h3 className="expertise-title">Financial aid</h3>
                            <p className="expertise-desc">
                                Senior administrators who navigated aid packaging, satisfactory academic progress, and enrollment strategy.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <div className="expertise-icon-wrap">
                                <BarChart2 size={22} />
                            </div>
                            <h3 className="expertise-title">Academic administration</h3>
                            <p className="expertise-desc">
                                VPs and deans with institutional research backgrounds who understand accreditation data and program analytics.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <div className="expertise-icon-wrap">
                                <Monitor size={22} />
                            </div>
                            <h3 className="expertise-title">Product development</h3>
                            <p className="expertise-desc">
                                Engineers and product leaders who translated decades of practitioner knowledge into intuitive software.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. Student ROI Section */}
                <section className="about-section" style={{ paddingTop: '0' }}>
                    <p className="about-eyebrow">DESIGNED AROUND STUDENT ROI</p>
                    <h2 className="about-title">Students invest in their education. EdNex protects that investment.</h2>
                    <p className="about-lead">
                        The team built EdNex with a single north star: every student who enrolls deserves to finish what they started — and land where they aimed.
                    </p>

                    <div className="roi-grid">
                        <div className="roi-card roi-card-blue">
                            <h3 className="roi-title">Graduation outcomes</h3>
                            <ul className="roi-list">
                                <li>On-time degree completion tracking</li>
                                <li>Credit efficiency and overload alerts</li>
                                <li>At-risk cohort intervention playbooks</li>
                                <li>Semester-by-semester progress reviews</li>
                            </ul>
                        </div>
                        <div className="roi-card roi-card-green">
                            <h3 className="roi-title">Career return on investment</h3>
                            <ul className="roi-list">
                                <li>Internship and co-op placement rates</li>
                                <li>Starting salary benchmarks by major</li>
                                <li>Graduate school placement tracking</li>
                                <li>Alumni outcome longitudinal reports</li>
                            </ul>
                        </div>
                        <div className="roi-card roi-card-purple">
                            <h3 className="roi-title">Institutional resource allocation</h3>
                            <ul className="roi-list">
                                <li>Advisor caseload and workload analytics</li>
                                <li>Course demand forecasting</li>
                                <li>Dean and chair program-level dashboards</li>
                                <li>Provost and CAO executive scorecards</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. University Ranking Impact */}
                <section className="about-section" style={{ paddingTop: '0' }}>
                    <div className="ranking-container">
                        <p className="about-eyebrow">UNIVERSITY RANKING IMPACT</p>
                        <h3 className="ranking-header">Metrics that move university rankings — built in by design</h3>
                        <div className="ranking-grid">
                            <div className="ranking-card">
                                <div className="ranking-title">Graduation & retention rates</div>
                                <div className="ranking-desc">4-year, 6-year completion; first-year and sophomore retention</div>
                            </div>
                            <div className="ranking-card">
                                <div className="ranking-title">Student-to-faculty ratio</div>
                                <div className="ranking-desc">Advising load data supports staffing decisions</div>
                            </div>
                            <div className="ranking-card">
                                <div className="ranking-title">Career placement outcomes</div>
                                <div className="ranking-desc">Employment rates, salary benchmarks, employer quality</div>
                            </div>
                            <div className="ranking-card">
                                <div className="ranking-title">Peer & reputation assessment</div>
                                <div className="ranking-desc">Demonstrated student success strengthens peer perception</div>
                            </div>
                            <div className="ranking-card">
                                <div className="ranking-title">Financial resources per student</div>
                                <div className="ranking-desc">Resource allocation efficiency through analytics</div>
                            </div>
                            <div className="ranking-card">
                                <div className="ranking-title">Social mobility index</div>
                                <div className="ranking-desc">Equity-gap dashboards track Pell-eligible student outcomes</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
};

export default AboutAumtech;
