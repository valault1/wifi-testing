import { PhoneCall, MessageSquare, Mail, Send } from 'lucide-react';

interface Props {
    navigateTo: (view: string) => void;
}

export default function Contact({ navigateTo }: Props) {
    return (
        <main style={{ flexGrow: 1, padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Let's talk about your network.</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Reach out whichever way is easiest for you.
                        No pressure—just a quick chat to see how we can help.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Left Column - Direct Contact Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Fast Text/Call Option */}
                        <a href="tel:+15551234567" style={{ textDecoration: 'none' }}>
                            <div className="contact-card" style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
                            <div className="contact-card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s', cursor: 'pointer', color: 'white' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
                            <div className="contact-card" style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
                    <div>
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

                            <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }}>
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
    );
}
