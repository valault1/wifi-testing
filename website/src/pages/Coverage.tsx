import { CheckCircle2, ChevronRight } from 'lucide-react';

interface Props {
    navigateTo: (view: string) => void;
}

export default function Coverage({ navigateTo }: Props) {
    return (
        <main style={{ flexGrow: 1, padding: '4rem 0', background: 'var(--bg-color)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="hero-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Sample Report</div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Coverage Assessment</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Here is an example of the kind of detailed coverage report we generate for your home during our initial assessment.
                    </p>
                </div>

                <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)' }}>
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

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button className="btn btn-primary btn-glow" onClick={() => navigateTo('contact')}>
                        Schedule your free test <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </main>
    );
}
