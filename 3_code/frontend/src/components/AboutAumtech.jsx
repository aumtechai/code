import React from 'react';
import PublicLayout from './PublicLayout';
import { Layers, Briefcase, UserPlus, FileText, BarChart2, Monitor } from 'lucide-react';
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
                        <p className="about-eyebrow" style={{ textAlign: 'left' }}>BUILT BY PRACTITIONERS</p>
                        <h1 className="about-title" style={{ textAlign: 'left' }}>
                            50+ years of combined higher education experience
                        </h1>
                        <p className="about-lead" style={{ textAlign: 'left', marginLeft: 0 }}>
                            EdNex was not designed in a vacuum. It was built by a team of senior leaders, advisors, career counselors, faculty, and administrators who spent their careers in the trenches of student success at top AAU and flagship US universities — and then channeled every lesson learned into this platform.
                        </p>
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

                    <div className="about-text-blocks">
                        <p>
                            The EdNex founding team has held multiple leadership and academic positions at flagship US universities — including roles in student services, academic affairs, financial aid, career success, and research administration. They have personally advised thousands of students, led teams of advisors, coordinated early intervention programs, and guided students through some of the most challenging transitions in their academic and career journeys.
                        </p>
                        <p>
                            This is not a product built by engineers who read about advising. Every workflow, every alert, every dashboard view was designed by people who sat across the table from struggling students, who managed advisor caseloads under resource pressure, and who understood that the difference between a student who graduates and one who drops out often comes down to a single timely intervention.
                        </p>
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
