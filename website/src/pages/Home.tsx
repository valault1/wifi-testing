import { ChevronRight, PhoneCall } from 'lucide-react';

interface Props {
    navigateTo: (view: string) => void;
}

export default function Home({ navigateTo }: Props) {
    return (
        <main>
            {/* Hero Section */}
            <section className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <div className="hero-bg-accent"></div>
                <div className="hero-bg-accent-2"></div>
                <div className="container hero-split">
                    <div className="hero-text-content">
                        {/* <div className="hero-badge">Expert Installation & Support</div> */}
                        <h1>
                            Wifi Guys
                        </h1>
                        <p className="hero-description">
                            Sit back, relax. We'll take care of your wifi for you.
                        </p>

                        <div className="hero-cta-box">
                            <div className="contact-primary">
                                <PhoneCall size={28} style={{ color: 'var(--primary)' }} />
                                <a href="tel:9013086783" className="phone-number">(901) 308-6783</a>
                            </div>
                            <p className="contact-sub">Call or text us anytime for a free consultation.<br />Full network setup starting at just $99.</p>
                            <button className="btn btn-primary btn-glow btn-lg" onClick={() => navigateTo('contact')}>
                                Get in touch <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="trust-badges">
                            <span className="trust-text" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>We set up wifi for all Memphis Internet providers</span>

                            <div className="feature-tags" style={{ marginTop: '0.5rem' }}>
                                <span className="tag" style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--text-main)', fontSize: '0.9rem' }}>Xfinity</span>
                                <span className="tag" style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--text-main)', fontSize: '0.9rem' }}>AT&T</span>
                                <span className="tag" style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--text-main)', fontSize: '0.9rem' }}>T-Mobile</span>
                                <span className="tag" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', color: 'var(--text-muted)', fontSize: '0.9rem' }}>+ More</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="glass-panel main-panel floating">
                            <div className="panel-header">
                                <div className="dot red"></div>
                                <div className="dot yellow"></div>
                                <div className="dot green"></div>
                                <span className="panel-title">Network Optimization</span>
                            </div>
                            <div className="panel-body">
                                <div className="speed-metrics">
                                    <div className="metric">
                                        <span className="metric-label">Download</span>
                                        <span className="metric-value text-gradient">940 <span className="metric-unit">Mbps</span></span>
                                    </div>
                                    <div className="metric-divider"></div>
                                    <div className="metric">
                                        <span className="metric-label">Upload</span>
                                        <span className="metric-value">820 <span className="metric-unit">Mbps</span></span>
                                    </div>
                                </div>
                                <div className="network-nodes">
                                    <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1, top: 0, left: 0 }}>
                                        <line x1="25%" y1="35%" x2="50%" y2="50%" stroke="var(--primary)" strokeWidth="3" strokeDasharray="5,5" opacity="0.4" />
                                        <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="var(--primary)" strokeWidth="3" strokeDasharray="5,5" opacity="0.4" />
                                    </svg>
                                    <div className="node master pulsing" style={{ zIndex: 2 }}>
                                        <span className="node-icon">Router</span>
                                    </div>
                                    <div className="node satellite-1" style={{ top: '15%', left: '10%', zIndex: 2 }}>
                                        <span className="node-icon">Office</span>
                                    </div>
                                    <div className="node satellite-2" style={{ bottom: '15%', right: '10%', zIndex: 2 }}>
                                        <span className="node-icon">Patio</span>
                                    </div>
                                </div>
                                <div className="status-bar">
                                    <div className="status-indicator online"></div>
                                    <span>Status: Perfect Coverage</span>
                                </div>
                            </div>
                        </div>

                        <div className="visual-ring ring-1"></div>
                    </div>
                </div>
            </section>



            {/* Process Section Preview */}
            <section id="how-it-works" className="process">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Simple Process</h2>
                        <p>Getting perfect wifi shouldn't be complicated. We handle everything from the initial design to the final speed test.</p>
                    </div>

                    <div className="process-graphic" style={{ position: 'relative', marginTop: '4rem', marginBottom: '2rem' }}>
                        {/* Background Connecting Line - Hidden on Mobile */}
                        <div className="hidden md-block" style={{ position: 'absolute', top: '24px', left: '15%', right: '15%', height: '3px', background: 'linear-gradient(to right, var(--primary), var(--secondary))', zIndex: 0, opacity: 0.3, borderRadius: '2px' }}></div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', position: 'relative', zIndex: 1 }}>
                            {/* Step 1 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.25rem', boxShadow: '0 0 0 4px white, 0 4px 10px rgba(0,0,0,0.1)', marginTop: '-3rem' }}>
                                    1
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Site Assessment</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>We map out your home to understand your bandwidth needs and eliminate current dead zones.</p>
                            </div>

                            {/* Step 2 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.25rem', boxShadow: '0 0 0 4px white, 0 4px 10px rgba(0,0,0,0.1)', marginTop: '-3rem' }}>
                                    2
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Installation</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Clean, professional setup and configuration of enterprise-grade mesh networks with zero mess.</p>
                            </div>

                            {/* Step 3 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.25rem', boxShadow: '0 0 0 4px white, 0 4px 10px rgba(0,0,0,0.1)', marginTop: '-3rem' }}>
                                    3
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Support</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Follow up check-in after the first week to ensure perfection, and a month of Q&amp;A support included.</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button className="btn btn-secondary" onClick={() => navigateTo('coverage')}>
                                See an example home coverage report <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="cta">
                <div className="container cta-content">
                    <h2>Ready for flawless connectivity?</h2>
                    <p>Stop fighting with your router and let the experts handle it. Contact us today for a free phone consultation.</p>
                    <button className="btn btn-white btn-glow" onClick={() => navigateTo('contact')}>
                        <PhoneCall size={18} /> Schedule Your Call
                    </button>
                </div>
            </section>
        </main>
    );
}
