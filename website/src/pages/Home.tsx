import { ChevronRight, CheckCircle2, PhoneCall } from 'lucide-react';

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
                <div className="container hero-content">

                    <h1>
                        Wifi Guys
                    </h1>
                    <p>
                        <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Never think about your wifi again</strong><br /><br />
                        We design, install, and manage flawless wireless networks so you can work, stream, and play without interruption. Say goodbye to dead zones and buffering.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-glow" onClick={() => navigateTo('contact')}>
                            Get in touch <ChevronRight size={18} />
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigateTo('process')}>
                            What to expect
                        </button>
                    </div>
                    <div className="animate-fade-in delay-300" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
                        <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                        <span>Backed by over a decade of tech experience</span>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="features" style={{ background: 'var(--bg-color)', paddingTop: '4rem', paddingBottom: '3rem' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Pricing</h2>
                        <p>No hidden fees. Just clean, professional installation and perfect coverage.</p>
                    </div>

                    <div className="features-grid" style={{ alignItems: 'center', marginTop: '1rem', paddingTop: '1rem' }}>
                        {/* Reliable Tier */}
                        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Reliable</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
                                    <span style={{ fontSize: '1rem', marginTop: '0.5rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>From</span>
                                    <span style={{ fontSize: '1.5rem', marginTop: '0.25rem', marginRight: '0.25rem' }}>$</span>650
                                </div>
                            </div>
                            <p style={{ flexGrow: 1 }}>Perfect for everyday browsing, streaming, and smart home essentials with rock-solid stability.</p>
                        </div>

                        {/* Futureproof Tier (Normal) */}
                        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Futureproof</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
                                    <span style={{ fontSize: '1rem', marginTop: '0.5rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>From</span>
                                    <span style={{ fontSize: '1.5rem', marginTop: '0.25rem', marginRight: '0.25rem' }}>$</span>1,100
                                </div>
                            </div>
                            <p style={{ flexGrow: 1 }}>High-capacity networking designed to handle heavy 4K streaming, gaming, and working from home seamlessly.</p>
                        </div>

                        {/* Premium Tier */}
                        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Premium</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
                                    <span style={{ fontSize: '1rem', marginTop: '0.5rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>From</span>
                                    <span style={{ fontSize: '1.5rem', marginTop: '0.25rem', marginRight: '0.25rem' }}>$</span>2,200
                                </div>
                            </div>
                            <p style={{ flexGrow: 1 }}>Ultimate performance for large estates. Enterprise-grade gear and zero dead zones.</p>
                        </div>
                    </div>

                    {/* Pricing Disclaimer & Value Prop */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
                        <div style={{ background: 'var(--bg-surface)', padding: '2rem 3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary)', maxWidth: '900px', width: '100%', boxShadow: '0 4px 20px -5px rgba(79, 70, 229, 0.15)' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                                Always included with every installation
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                {[
                                    'Premium Hardware',
                                    'Professional Installation',
                                    'Extensive Coverage Tests',
                                    'Ongoing Support',
                                    'Custom Consultation',
                                    'Security Best Practices'
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: 500 }}>
                                        <CheckCircle2 size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                <strong>Note:</strong> Pricing estimates are based on using 3 mesh routers, which usually cover a 2,500 sq. ft. home. Actual price may vary based on specific size, home materials, and layout.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button className="btn btn-primary btn-glow" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }} onClick={() => navigateTo('contact')}>
                            Get in touch <ChevronRight size={20} />
                        </button>
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
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Ongoing Support</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Follow up check-in after the first week to ensure perfection, and 3-months of Q&amp;A support included.</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button className="btn btn-secondary" onClick={() => navigateTo('coverage')}>
                                See an example coverage report <ChevronRight size={18} />
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
