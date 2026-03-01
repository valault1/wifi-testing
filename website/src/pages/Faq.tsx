import { useState } from 'react';
import { PhoneCall, Plus, Minus } from 'lucide-react';

interface Props {
    navigateTo: (view: string) => void;
}

export default function Faq({ navigateTo }: Props) {
    const [openFaqId, setOpenFaqId] = useState<number | null>(0);

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
        <main style={{ flexGrow: 1, padding: '4rem 0', background: 'var(--bg-color)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Frequently Asked Questions</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Networking terminology can be confusing. We speak plain English.
                        Here are the answers to the questions we get asked the most.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Still have questions?</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>We'd love to chat. Reach out and tell us about your specific home setup.</p>
                    <button className="btn btn-primary btn-glow" onClick={() => navigateTo('contact')}>
                        <PhoneCall size={18} /> Schedule a free call
                    </button>
                </div>
            </div>
        </main>
    );
}
