import { PhoneCall, Map, Users, Cpu, Settings, MapPin, ThumbsUp, Calendar, Sparkles } from 'lucide-react';

interface Props {
    navigateTo: (view: string) => void;
}

export default function Process({ navigateTo }: Props) {
    return (
        <main style={{ flexGrow: 1, padding: '0 0 6rem 0' }}>
            <section className="hero" style={{ padding: '4rem 0 4rem', background: 'var(--bg-color)' }}>
                <div className="container hero-content">
                    <div className="hero-badge">
                        How It Works
                    </div>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                        Your Journey to <span className="text-gradient">Perfect Wifi</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        We've refined our installation process down to a science. From the first speed test to the final check-in, here is exactly what you can expect when you work with us.
                    </p>
                </div>
            </section>

            <section style={{ padding: '5rem 0 6rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '24px', top: '0', bottom: '0', width: '2px', background: 'linear-gradient(to bottom, var(--primary), var(--secondary))', opacity: 0.3, zIndex: 0 }}></div>

                        {/* Step 1 */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ minWidth: '50px', height: '50px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                <Map size={24} />
                            </div>
                            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 01</span>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Initial Coverage Map</h3>
                                <p style={{ color: 'var(--text-muted)' }}>We start by mapping the current wifi strength in every single room of your house to identify existing dead zones and interference.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ minWidth: '50px', height: '50px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                <Users size={24} />
                            </div>
                            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 02</span>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Consultation</h3>
                                <p style={{ color: 'var(--text-muted)' }}>We sit down with you to discuss your specific needs: how many people live here, what kind of devices you use, your current internet plan, and your heaviest bandwidth activities.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ minWidth: '50px', height: '50px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                <Cpu size={24} />
                            </div>
                            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 03</span>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Hardware Selection</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Based on your needs, we select the perfect hardware. We recommend Eero mesh routers for most homes due to their reliability, but we happily offer and configure other options if you prefer.</p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ minWidth: '50px', height: '50px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                <Settings size={24} />
                            </div>
                            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 04</span>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Clean Installation</h3>
                                <p style={{ color: 'var(--text-muted)' }}>We handle all the technical details. We'll set up a custom wifi name for you, and walk you through settings you might care about—like creating guest networks or scheduling internet off-times for the kids.</p>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ minWidth: '50px', height: '50px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                <MapPin size={24} />
                            </div>
                            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 05</span>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Coverage Test & Re-positioning</h3>
                                <p style={{ color: 'var(--text-muted)' }}>We don't just guess. We re-run our comprehensive coverage test across your entire home and reposition the mesh nodes if necessary to guarantee wall-to-wall signal strength.</p>
                            </div>
                        </div>

                        {/* Step 6 */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ minWidth: '50px', height: '50px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                <ThumbsUp size={24} />
                            </div>
                            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 06</span>
                                <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Verification Check-in</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Before we leave, we verify with you directly to make sure all your main devices are connected and everything is working exactly as expected.</p>
                            </div>
                        </div>

                        {/* Step 7 */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ minWidth: '50px', height: '50px', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                <Calendar size={24} />
                            </div>
                            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                                <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 07</span>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Ongoing Support</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Follow up check-in after the first week to ensure perfection, and 3-months of Q&amp;A support included.</p>
                            </div>
                        </div>

                        {/* Step 8 */}
                        <div style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ minWidth: '50px', height: '50px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                <Sparkles size={24} />
                            </div>
                            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--primary)', boxShadow: 'var(--shadow-md)', flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Enjoy Worry-Free Wifi</h3>
                                <p style={{ color: 'var(--text-main)', fontWeight: 500 }}>Sit back, relax, and never think about your wifi again. You're set for years to come.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta">
                <div className="container cta-content">
                    <h2>Ready to get started?</h2>
                    <p>Let's map out your home and build the perfect network.</p>
                    <button className="btn btn-white btn-glow" onClick={() => navigateTo('contact')}>
                        <PhoneCall size={18} /> Schedule Your Initial Coverage Test
                    </button>
                </div>
            </section>
        </main>
    );
}
