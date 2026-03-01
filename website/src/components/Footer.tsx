import { Wifi } from 'lucide-react';

interface FooterProps {
    navigateTo: (view: string) => void;
    standalone?: boolean;
}

export default function Footer({ navigateTo, standalone = false }: FooterProps) {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <a href="#home" className="logo cursor-pointer" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} style={{ textDecoration: 'none' }}>
                        <Wifi size={24} strokeWidth={2.5} />
                        <span>Wifi Guys</span>
                    </a>
                    {!standalone && (
                        <div className="footer-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Support</a>
                        </div>
                    )}
                </div>
                {!standalone && (
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Wifi Guys. All rights reserved.</p>
                    </div>
                )}
            </div>
        </footer>
    );
}
