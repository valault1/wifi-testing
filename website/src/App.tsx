
import { Wifi, ShieldCheck, Zap, Server, ChevronRight, PhoneCall } from 'lucide-react';

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <Wifi size={28} strokeWidth={2.5} />
            <span>Wifi Guys</span>
          </div>
          <nav className="nav-links">
            <a href="#services" className="nav-link">Services</a>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
          <button className="btn btn-primary hidden md-inline-flex">
            Get an Estimate
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-accent"></div>
        <div className="hero-bg-accent-2"></div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            Premium Home & Business Networking
          </div>
          <h1 className="animate-fade-in delay-100">
            Never Think About<br />
            <span className="text-gradient">Your Wifi Again.</span>
          </h1>
          <p className="animate-fade-in delay-200">
            We design, install, and manage flawless wireless networks so you can work, stream, and play without interruption. Say goodbye to dead zones and buffering.
          </p>
          <div className="hero-actions animate-fade-in delay-300">
            <button className="btn btn-primary">
              Schedule a Consultation <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary">
              View Our Services
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Wifi Guys</h2>
            <p>We don't just plug in routers. We engineer custom networking solutions tailored to your unique space and demands.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={28} strokeWidth={2} />
              </div>
              <h3>Enterprise Security</h3>
              <p>Advanced firewalls and isolated guest networks to keep your personal data and smart home devices completely secure from outside threats.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={28} strokeWidth={2} />
              </div>
              <h3>Guaranteed Coverage</h3>
              <p>We perform professional site assessments to guarantee wall-to-wall coverage. No more dropping calls when you walk to the kitchen or backyard.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Server size={28} strokeWidth={2} />
              </div>
              <h3>Proactive Monitoring</h3>
              <p>Our remote management tools allow us to detect and fix network issues before you even notice your internet is running slow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="process">
        <div className="container">
          <div className="section-header">
            <h2>Our Simple Process</h2>
            <p>Getting perfect wifi shouldn't be complicated. We handle everything from the initial design to the final speed test.</p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Site Assessment</h3>
                <p>We visit your property to map out the structure, identify interference sources, and understand your bandwidth requirements.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Custom Design</h3>
                <p>Our engineers create a detailed network topology using commercial-grade access points strategically placed for optimal performance.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Clean Installation</h3>
                <p>Our technicians cleanly run cables, mount access points discretely, and configure your network with zero mess left behind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta">
        <div className="container cta-content">
          <h2>Ready for flawless connectivity?</h2>
          <p>Stop fighting with your router and let the experts handle it. Contact us today for a free phone consultation.</p>
          <button className="btn btn-white">
            <PhoneCall size={18} /> Call us at (555) 123-4567
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="logo">
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

export default App;
