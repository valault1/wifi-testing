export default function About() {
    return (
        <main style={{ flexGrow: 1, padding: '4rem 0', background: 'var(--bg-color)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div className="hero-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Who we are</div>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Hi, we are the Wifi Guys.</h1>
                </div>

                <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-lg)', padding: '3rem', fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
                    <p style={{ marginBottom: '1.5rem' }}>We're two brothers who grew up right here in Memphis. Call us geeks, but we've always loved tinkering with technology, pulling apart computers, and figuring out how things work.</p>
                    <p style={{ marginBottom: '1.5rem' }}>Over the years, we became the go-to guys for friends and family whenever their internet acted up. What we quickly realized is that setting up wifi is sometimes intimidating, because there are so many routers and so many features to look into. Plus, you have to figure out your provider, and then sometimes it still just doesn't work! We want to help make it easy for people.</p>
                    <p style={{ marginBottom: '1.5rem' }}>But we also know how amazing and peaceful it feels to <em>never have to worry about your wifi</em>. Once it's set up correctly, it just works, blending invisibly into the background of your life.</p>
                    <p style={{ marginBottom: '1.5rem' }}>We started Wifi Guys because we wanted to bring that exact feeling to people in our community. We genuinely love this job because it allows us to meet our neighbors, solve their frustrating tech problems, answer their questions, and make absolutely sure they are taken care of.</p>
                    <p style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '2rem' }}>- The Brothers</p>
                </div>
            </div>
        </main>
    );
}
