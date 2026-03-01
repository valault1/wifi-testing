import { useState, useEffect } from 'react';
import { Wifi, ChevronRight, PhoneCall, CheckCircle2, ArrowLeft, Mail, MessageSquare, Send, Map, Users, Cpu, Settings, MapPin, ThumbsUp, Calendar, Sparkles, Plus, Minus } from 'lucide-react';

function Version1() {
    // Hash routing for history support (Browser Back button works)
    const [currentView, setCurrentView] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        return ['contact', 'process', 'coverage', 'faq', 'about'].includes(hash) ? hash : 'home';
    });

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setCurrentView(['contact', 'process', 'coverage', 'faq', 'about'].includes(hash) ? hash : 'home');
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Local state for FAQ Accordion
    const [openFaqId, setOpenFaqId] = useState<number | null>(0);

    // Scroll to top when view changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentView]);

    const scrollToSection = (id: string, e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (currentView !== 'home') {
            navigateTo('home');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        } else {
            const el = document.getElementById(id);
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const navigateTo = (view: string) => {
        // Change the URL hash safely
        if (view === 'home') {
            window.history.pushState('', document.title, window.location.pathname + window.location.search);
            setCurrentView('home'); // Manually trigger update since hashchange won't fire for removing hash completely
        } else {
            window.location.hash = view;
        }
    };


    // --- CONTACT PAGE VIEW ---
    if (currentView === 'contact') {
        return (
            <div className="app bg-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <header className="header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
                    <div className="container header-content">
                        <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                            <Wifi size={28} strokeWidth={2.5} />
                            <span>Wifi Guys</span>
                        </div>
                        <button onClick={() => navigateTo('home')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                    </div>
                </header>

                <main style={{ flexGrow: 1, padding: '4rem 0' }}>
                    <div className="container" style={{ maxWidth: '1000px' }}>
                        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Let's talk about your network.</h1>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                                Reach out whichever way is easiest for you.
                                No pressure—just a quick chat to see how we can help.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                            {/* Left Column - Direct Contact Options */}
                            <div className="animate-fade-in delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Fast Text/Call Option */}
                                <a href="tel:+15551234567" style={{ textDecoration: 'none' }}>
                                    <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%' }}>
                                            <PhoneCall size={28} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Call or Text Us</h3>
                                            <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.25rem' }}>(555) 123-4567</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Available Mon-Fri, 9am - 6pm</p>
                                        </div>
                                    </div>
                                </a>

                                {/* iMessage / WhatsApp Option */}
                                <a href="sms:+15551234567" style={{ textDecoration: 'none' }}>
                                    <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s', cursor: 'pointer', color: 'white' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '1rem', borderRadius: '50%' }}>
                                            <MessageSquare size={28} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'white' }}>Prefer to Text?</h3>
                                            <p style={{ opacity: 0.9, fontSize: '0.95rem', margin: 0 }}>Tap here to shoot us a quick text. We usually reply within 15 minutes.</p>
                                        </div>
                                    </div>
                                </a>

                                {/* Email Option */}
                                <a href="mailto:hello@wifiguys.com" style={{ textDecoration: 'none' }}>
                                    <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%' }}>
                                            <Mail size={28} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Email Us</h3>
                                            <p style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>hello@wifiguys.com</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Send us over your floorplans or any custom questions.</p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            {/* Right Column - Submission Form */}
                            <div className="animate-fade-in delay-200">
                                <form style={{ background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }} onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); navigateTo('home'); }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Describe Your Project</h3>

                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Name <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" required placeholder="John Doe" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Phone Number <span style={{ color: 'red' }}>*</span></label>
                                            <input type="tel" required placeholder="(555) 000-0000" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Zip Code</label>
                                            <input type="text" placeholder="12345" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem' }} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>What issues are you experiencing?</label>
                                        <textarea rows={4} placeholder="e.g., Wifi doesn't reach the back patio, video calls keep dropping..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem', resize: 'vertical' }}></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }}>
                                        Send Message <Send size={18} />
                                    </button>
                                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', margin: '1rem 0 0 0' }}>
                                        We will never spam you or sell your data.
                                    </p>
                                </form>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // --- PROCESS PAGE VIEW ---
    if (currentView === 'process') {
        return (
            <div className="app bg-white" style={{ minHeight: '100vh' }}>
                <header className="header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
                    <div className="container header-content">
                        <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                            <Wifi size={28} strokeWidth={2.5} />
                            <span>Wifi Guys</span>
                        </div>
                        <button onClick={() => navigateTo('home')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                    </div>
                </header>

                <section className="hero" style={{ padding: '8rem 0 4rem', background: 'var(--bg-color)' }}>
                    <div className="container hero-content">
                        <div className="hero-badge animate-fade-in">
                            How It Works
                        </div>
                        <h1 className="animate-fade-in delay-100" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                            Your Journey to <span className="text-gradient">Perfect Wifi</span>
                        </h1>
                        <p className="animate-fade-in delay-200" style={{ fontSize: '1.2rem', maxWidth: '700px' }}>
                            We've refined our installation process down to a science. From the first speed test to the final check-in, here is exactly what you can expect when you work with us.
                        </p>
                    </div>
                </section>

                <section style={{ padding: '5rem 0 6rem' }}>
                    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '24px', top: '0', bottom: '0', width: '2px', background: 'linear-gradient(to bottom, var(--primary), var(--secondary))', opacity: 0.3, zIndex: 0 }}></div>

                            {/* Step 1 */}
                            <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
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
                            <div className="animate-fade-in delay-100" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
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
                            <div className="animate-fade-in delay-200" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
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
                            <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
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
                            <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
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
                            <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
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
                            <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                                <div style={{ minWidth: '50px', height: '50px', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 0 6px white' }}>
                                    <Calendar size={24} />
                                </div>
                                <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexGrow: 1 }}>
                                    <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 07</span>
                                    <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>The One-Week Check</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>After you've lived with your new network for a week, we'll give you a call to make sure you haven't run into any issues and to answer any follow-up questions you might have.</p>
                                </div>
                            </div>

                            {/* Step 8 */}
                            <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 1 }}>
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
                        <button className="btn btn-white" onClick={() => navigateTo('contact')}>
                            <PhoneCall size={18} /> Schedule Your Initial Coverage Test
                        </button>
                    </div>
                </section>

                {/* Footer for standalone pages */}
                <footer className="footer">
                    <div className="container">
                        <div className="footer-top">
                            <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                                <Wifi size={24} strokeWidth={2.5} />
                                <span>Wifi Guys</span>
                            </div>
                            <div className="footer-links">
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Support</a>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p>&copy; {new Date().getFullYear()} Wifi Guys. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    // --- COVERAGE REPORT VIEW ---
    if (currentView === 'coverage') {
        return (
            <div className="app bg-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <header className="header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
                    <div className="container header-content">
                        <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                            <Wifi size={28} strokeWidth={2.5} />
                            <span>Wifi Guys</span>
                        </div>
                        <button onClick={() => navigateTo('home')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                    </div>
                </header>

                <main style={{ flexGrow: 1, padding: '4rem 0', background: 'var(--bg-color)' }}>
                    <div className="container" style={{ maxWidth: '900px' }}>
                        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div className="hero-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Sample Report</div>
                            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Coverage Assessment</h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                                Here is an example of the kind of detailed coverage report we generate for your home during our initial assessment.
                            </p>
                        </div>

                        <div className="animate-fade-in delay-100" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
                            {/* Fake Report Header */}
                            <div style={{ padding: '2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Smith Residence</h2>
                                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tested on: October 24th • 3,200 sq. ft.</p>
                                </div>
                                <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'rgb(21, 128, 61)', padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle2 size={18} /> Coverage Optimal
                                </div>
                            </div>

                            {/* Fake Report Body */}
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Average Download</p>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>940 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Mbps</span></div>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Average Upload</p>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>820 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Mbps</span></div>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Dead Zones</p>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>0</div>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Room-by-Room Analysis</h3>
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <tr>
                                                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Location</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Signal Strength</th>
                                                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Speed Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>Living Room</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'end', height: '16px' }}>
                                                        <div style={{ width: '4px', height: '6px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '10px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '14px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '16px', background: 'var(--primary)' }}></div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Excellent</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>Master Bedroom</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'end', height: '16px' }}>
                                                        <div style={{ width: '4px', height: '6px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '10px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '14px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '16px', background: 'var(--primary)' }}></div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Excellent</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>Kitchen</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'end', height: '16px' }}>
                                                        <div style={{ width: '4px', height: '6px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '10px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '14px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '16px', background: '#cbd5e1' }}></div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>Good</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>Back Patio</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'end', height: '16px' }}>
                                                        <div style={{ width: '4px', height: '6px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '10px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '14px', background: 'var(--primary)' }}></div>
                                                        <div style={{ width: '4px', height: '16px', background: 'var(--primary)' }}></div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Excellent</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="animate-fade-in delay-200" style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button className="btn btn-primary" onClick={() => navigateTo('contact')}>
                                Schedule your free test <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="footer">
                    <div className="container">
                        <div className="footer-top">
                            <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                                <Wifi size={24} strokeWidth={2.5} />
                                <span>Wifi Guys</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    // --- FAQ VIEW ---
    if (currentView === 'faq') {
        const faqs = [
            {
                question: "What is Wifi 7?",
                answer: "Think of your home internet like a highway. Older wifi is like a two-lane road—it gets easily jammed up when everyone tries to use it at once. Wifi 7 is like suddenly upgrading to a massive 16-lane superhighway. It’s the newest, fastest generation of wireless technology, allowing all your phones, TVs, and smart home devices to run simultaneously without any buffering or \"traffic jams.\""
            },
            {
                question: "What routers are the best routers?",
                answer: "For most homes, we highly recommend Eero mesh routers. They are famous for being incredibly reliable, almost never needing to be rebooted, and looking sleek enough to leave out in the open. However, we also frequently recommend and install other top-tier brands like Asus ZenWiFi, TP-Link Deco, and Ubiquiti UniFi depending on your specific layout and needs."
            },
            {
                question: "What is a \"tri-band\" router?",
                answer: "Standard routers broadcast two \"bands\" (lanes) for your devices to use. A tri-band router adds a third. Imagine this third band as a dedicated VIP lane. The routers use this VIP lane solely to talk to each other at lightning speed, keeping the other two lanes completely clear and open for your phones and laptops to use. This results in significantly faster, stabler speeds across your entire home."
            },
            {
                question: "What are some things to consider when placing my routers around the house?",
                answer: "Placement is everything! A router is essentially a radio tower. You want it placed centrally, out in the open, and elevated (like on a shelf or table). You should never hide routers inside closets, behind TVs, or next to large metal appliances like refrigerators, as these materials block and absorb the signal."
            },
            {
                question: "What is a mesh router?",
                answer: "In the past, people tried to use one single, super-powerful router to blast a signal through their entire house—which usually left the furthest bedrooms with terrible coverage. A mesh system fixes this by using two or three sleek, connected router \"nodes\" placed evenly throughout your home. They work seamlessly together to blanket your entire house in strong, perfect wifi, so your phone automatically connects to the nearest one as you walk around."
            },
            {
                question: "Do I need to run cable between my mesh routers?",
                answer: "No, you don't have to! Modern mesh routers are designed to connect to each other wirelessly, which makes them perfect for older homes. However, if your home is already pre-wired with ethernet cables inside the walls, we can physically plug the nodes into those wall ports. Doing so provides the absolute \"ultimate\" performance, as they don't have to rely on wireless signals to communicate back to the main modem."
            }
        ];

        return (
            <div className="app bg-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <header className="header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
                    <div className="container header-content">
                        <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                            <Wifi size={28} strokeWidth={2.5} />
                            <span>Wifi Guys</span>
                        </div>
                        <button onClick={() => navigateTo('home')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                    </div>
                </header>

                <main style={{ flexGrow: 1, padding: '4rem 0', background: 'var(--bg-color)' }}>
                    <div className="container" style={{ maxWidth: '800px' }}>
                        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Frequently Asked Questions</h1>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                                Networking terminology can be confusing. We speak plain English.
                                Here are the answers to the questions we get asked the most.
                            </p>
                        </div>

                        <div className="animate-fade-in delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {faqs.map((faq, index) => {
                                const isOpen = openFaqId === index;
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            background: 'var(--bg-surface)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: `1px solid ${isOpen ? 'var(--primary)' : '#e2e8f0'}`,
                                            boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                            overflow: 'hidden',
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        <button
                                            onClick={() => setOpenFaqId(isOpen ? null : index)}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1.5rem 2rem',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <h3 style={{ fontSize: '1.15rem', margin: 0, color: isOpen ? 'var(--primary)' : 'var(--text-main)', fontWeight: 600, paddingRight: '1rem' }}>
                                                {faq.question}
                                            </h3>
                                            <div style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                                            </div>
                                        </button>

                                        <div style={{
                                            maxHeight: isOpen ? '500px' : '0',
                                            opacity: isOpen ? 1 : 0,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease-in-out',
                                            padding: isOpen ? '0 2rem 1.5rem 2rem' : '0 2rem 0 2rem'
                                        }}>
                                            <div style={{ width: '100%', height: '1px', background: '#e2e8f0', marginBottom: '1.5rem', opacity: 0.5 }}></div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="animate-fade-in delay-200" style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Still have questions?</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>We'd love to chat. Reach out and tell us about your specific home setup.</p>
                            <button className="btn btn-primary" onClick={() => navigateTo('contact')}>
                                <PhoneCall size={18} /> Schedule a free call
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="footer">
                    <div className="container">
                        <div className="footer-top">
                            <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                                <Wifi size={24} strokeWidth={2.5} />
                                <span>Wifi Guys</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    // --- ABOUT VIEW ---
    if (currentView === 'about') {
        return (
            <div className="app bg-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <header className="header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
                    <div className="container header-content">
                        <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                            <Wifi size={28} strokeWidth={2.5} />
                            <span>Wifi Guys</span>
                        </div>
                        <nav className="nav-links">
                            <a href="#pricing" className="nav-link" onClick={(e) => scrollToSection('pricing', e)}>Pricing</a>
                            <a href="#how-it-works" className="nav-link" onClick={(e) => scrollToSection('how-it-works', e)}>How it Works</a>
                            <a href="#faq" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('faq'); }}>FAQ</a>
                            <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About us</a>
                        </nav>
                        <button onClick={() => navigateTo('home')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                    </div>
                </header>

                <main style={{ flexGrow: 1, padding: '4rem 0', background: 'var(--bg-color)' }}>
                    <div className="container" style={{ maxWidth: '800px' }}>
                        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <div className="hero-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Who we are</div>
                            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Hi, we are the Wifi Guys.</h1>
                        </div>

                        <div className="animate-fade-in delay-100" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)', padding: '3rem', fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
                            <p style={{ marginBottom: '1.5rem' }}>We're two brothers who grew up right here in Memphis. Call us geeks, but we've always loved tinkering with technology, pulling apart computers, and figuring out how things work.</p>
                            <p style={{ marginBottom: '1.5rem' }}>Over the years, we became the go-to guys for friends and family whenever their internet acted up. What we quickly realized is that <strong>almost everyone</strong> struggles with bad wifi, and it makes people miserable. Dropped Zoom calls, buffering movies, dead zones in the kitchen—it's incredibly frustrating.</p>
                            <p style={{ marginBottom: '1.5rem' }}>But we also know how amazing and peaceful it feels to <em>never have to worry about your wifi</em>. Once it's set up correctly, it just works, blending invisibly into the background of your life.</p>
                            <p style={{ marginBottom: '1.5rem' }}>We started Wifi Guys because we wanted to bring that exact feeling to people in our community. We genuinely love this job because it allows us to meet our neighbors, solve their frustrating tech problems, answer their questions, and make absolutely sure they are taken care of.</p>
                            <p style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '2rem' }}>- The Brothers</p>
                        </div>
                    </div>
                </main>

                <footer className="footer">
                    <div className="container">
                        <div className="footer-top">
                            <div className="logo cursor-pointer" onClick={() => navigateTo('home')}>
                                <Wifi size={24} strokeWidth={2.5} />
                                <span>Wifi Guys</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    // --- MAIN LANDING PAGE VIEW ---
    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="container header-content">
                    <div className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
                        <Wifi size={28} strokeWidth={2.5} />
                        <span>Wifi Guys</span>
                    </div>
                    <nav className="nav-links">
                        <a href="#pricing" className="nav-link" onClick={(e) => scrollToSection('pricing', e)}>Pricing</a>
                        <a href="#how-it-works" className="nav-link" onClick={(e) => scrollToSection('how-it-works', e)}>How it Works</a>
                        <a href="#faq" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('faq'); }}>FAQ</a>
                        <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About us</a>
                    </nav>
                    <button className="btn btn-primary hidden md-inline-flex" onClick={() => navigateTo('contact')}>
                        Contact us
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <div className="hero-bg-accent"></div>
                <div className="hero-bg-accent-2"></div>
                <div className="container hero-content">
                    <h1 className="animate-fade-in delay-100">
                        Wifi Guys
                    </h1>
                    <p className="animate-fade-in delay-200">
                        <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Never think about your wifi again</strong><br /><br />
                        We design, install, and manage flawless wireless networks so you can work, stream, and play without interruption. Say goodbye to dead zones and buffering.
                    </p>
                    <div className="hero-actions animate-fade-in delay-300">
                        <button className="btn btn-primary" onClick={() => navigateTo('contact')}>
                            Get in touch <ChevronRight size={18} />
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigateTo('process')}>
                            What to expect
                        </button>
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
                        <div className="feature-card animate-fade-in delay-100" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Reliable</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
                                    <span style={{ fontSize: '1rem', marginTop: '0.5rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>From</span>
                                    <span style={{ fontSize: '1.5rem', marginTop: '0.25rem', marginRight: '0.25rem' }}>$</span>650
                                </div>
                            </div>
                            <p style={{ flexGrow: 1 }}>Perfect for everyday browsing, streaming, and smart home essentials with rock-solid stability.</p>
                        </div>

                        {/* Futureproof Tier (Highlighted) */}
                        <div className="feature-card animate-fade-in delay-200" style={{ display: 'flex', flexDirection: 'column', borderColor: 'var(--primary)', transform: 'scale(1.05)', boxShadow: 'var(--shadow-lg)', overflow: 'visible', position: 'relative', height: '100%', zIndex: 1 }}>
                            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', padding: '0.4rem 1.25rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)' }}>
                                Most Popular
                            </div>
                            <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Futureproof</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
                                    <span style={{ fontSize: '1rem', marginTop: '0.5rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>From</span>
                                    <span style={{ fontSize: '1.5rem', marginTop: '0.25rem', marginRight: '0.25rem' }}>$</span>1,100
                                </div>
                            </div>
                            <p style={{ flexGrow: 1 }}>High-capacity networking designed to handle heavy 4K streaming, gaming, and working from home seamlessly.</p>
                        </div>

                        {/* Premium Tier */}
                        <div className="feature-card animate-fade-in delay-300" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Premium</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
                                    <span style={{ fontSize: '1rem', marginTop: '0.5rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>From</span>
                                    <span style={{ fontSize: '1.5rem', marginTop: '0.25rem', marginRight: '0.25rem' }}>$</span>2,200
                                </div>
                            </div>
                            <p style={{ flexGrow: 1 }}>Ultimate performance for large estates. Enterprise-grade gear, zero dead zones, and priority proactive monitoring.</p>
                        </div>
                    </div>

                    {/* Pricing Disclaimer & Value Prop */}
                    <div className="animate-fade-in delay-100" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
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
                                    'Custom Consultation'
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
                        <button className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }} onClick={() => navigateTo('contact')}>
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

                    <div className="process-graphic animate-fade-in delay-100" style={{ position: 'relative', marginTop: '4rem', marginBottom: '2rem' }}>
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
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Proactive network monitoring and a scheduled verification check-in to ensure absolute perfection.</p>
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
                    <button className="btn btn-white" onClick={() => navigateTo('contact')}>
                        <PhoneCall size={18} /> Schedule Your Call
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
                            <Wifi size={24} strokeWidth={2.5} />
                            <span>Wifi Guys</span>
                        </div>
                        <div className="footer-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Support</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Wifi Guys. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Version1;
