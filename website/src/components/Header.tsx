import { Wifi, ArrowLeft } from 'lucide-react';

interface HeaderProps {
    currentView: string;
    navigateTo: (view: string) => void;
    scrollToSection: (id: string, e?: React.MouseEvent) => void;
}

export default function Header({ currentView, navigateTo, scrollToSection }: HeaderProps) {
    const isStandalone = currentView !== 'home';

    if (isStandalone) {
        return (
            <header className="header" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
                <div className="container header-content">
                    <a href="#home" className="logo cursor-pointer" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} style={{ textDecoration: 'none' }}>
                        <Wifi size={28} strokeWidth={2.5} />
                        <span>Wifi Guys</span>
                    </a>
                    <nav className="nav-links">
                        <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
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
        );
    }

    return (
        <header className="header">
            <div className="container header-content">
                <a href="#home" className="logo cursor-pointer" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} style={{ textDecoration: 'none' }}>
                    <Wifi size={28} strokeWidth={2.5} />
                    <span>Wifi Guys</span>
                </a>
                <nav className="nav-links">
                    <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
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
    );
}
