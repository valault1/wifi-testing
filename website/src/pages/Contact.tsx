import { useState } from 'react';
import { PhoneCall, MessageSquare, Mail, Send, Copy, Check } from 'lucide-react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzAO8lJrPF5Vd_CavwJ6bgrY9AyQD5ajQylGGVTeMCGXoHy5bLNa7B8aTEhb9ZPDs75/exec';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!SCRIPT_URL) {
            alert('Form submission is not configured yet (missing URL).');
            return;
        }

        setIsSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            setShowSuccess(true);
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was a problem sending your message. Please try again or call us.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main style={{ flexGrow: 1, padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Let's talk about your network.</h1>

                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Left Column - Direct Contact Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Fast Text/Call Option */}
                        <div className="contact-card" style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%' }}>
                                <PhoneCall size={28} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Call or text us</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                    <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.5rem', margin: 0 }}>(901) 308-6783</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText('(901) 308-6783');
                                            setCopiedId('phone');
                                            setTimeout(() => setCopiedId(null), 2000);
                                        }}
                                        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                                        title="Copy phone number"
                                    >
                                        {copiedId === 'phone' ? <Check size={18} color="green" /> : <Copy size={18} />}
                                        {copiedId === 'phone' && (
                                            <span style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '0.5rem', padding: '0.25rem 0.6rem', background: '#22c55e', color: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', zIndex: 10 }}>
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Available Mon-Fri, 10am - 5pm</p>
                            </div>
                        </div>

                        {/* Email Option */}
                        <div className="contact-card" style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%' }}>
                                <Mail size={28} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Email us</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                    <p style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>wifiguysmemphis@gmail.com</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText('wifiguysmemphis@gmail.com');
                                            setCopiedId('email');
                                            setTimeout(() => setCopiedId(null), 2000);
                                        }}
                                        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                                        title="Copy email address"
                                    >
                                        {copiedId === 'email' ? <Check size={18} color="green" /> : <Copy size={18} />}
                                        {copiedId === 'email' && (
                                            <span style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '0.5rem', padding: '0.25rem 0.6rem', background: '#22c55e', color: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', zIndex: 10 }}>
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Send us any questions you have!</p>
                            </div>
                        </div>

                        {/* iMessage / WhatsApp Option */}
                        <a href="sms:+19013086783" style={{ textDecoration: 'none' }}>
                            <div className="contact-card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s', cursor: 'pointer', color: 'white' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '1rem', borderRadius: '50%' }}>
                                    <MessageSquare size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'white' }}>Prefer to Text?</h3>
                                    <p style={{ opacity: 0.9, fontSize: '0.95rem', margin: 0 }}>Tap here to shoot us a quick text. We usually reply within a few hours.</p>
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Right Column - Submission Form */}
                    <div>
                        {showSuccess ? (
                            <div style={{ background: 'var(--bg-surface)', padding: '3rem 2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-flex' }}>
                                    <Send size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>We'll reach out soon!</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Your message has been sent successfully.</p>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSuccess(false)}>Send another message</button>
                            </div>
                        ) : (
                            <form style={{ background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }} onSubmit={handleSubmit}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Tell us about your project</h3>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Name <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" name="name" required placeholder="John Doe" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem' }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Phone Number <span style={{ color: 'red' }}>*</span></label>
                                        <input type="tel" name="phone" required placeholder="(555) 000-0000" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Zip Code</label>
                                        <input type="text" name="zip" placeholder="12345" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem' }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>What do you need help with?</label>
                                    <textarea name="issues" rows={4} placeholder="e.g., general wifi setup, wifi doesn't reach the back patio, video calls keep dropping..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', fontSize: '1rem', resize: 'vertical' }}></textarea>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-glow" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                                    {isSubmitting ? 'Sending...' : <>Submit</>}
                                </button>

                            </form>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
