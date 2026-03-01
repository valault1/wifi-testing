import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const Process = lazy(() => import('./pages/Process'));
const Coverage = lazy(() => import('./pages/Coverage'));
const Faq = lazy(() => import('./pages/Faq'));
const About = lazy(() => import('./pages/About'));

function App() {
  // History API routing (Browser path instead of #hash)
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname.replace('/', '');
    return ['contact', 'process', 'coverage', 'faq', 'about'].includes(path) ? path : 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      setCurrentView(['contact', 'process', 'coverage', 'faq', 'about'].includes(path) ? path : 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    if (view === 'home') {
      window.history.pushState({}, '', '/');
      setCurrentView('home');
    } else {
      window.history.pushState({}, '', `/${view}`);
      setCurrentView(view);
    }
  };

  return (
    <div className="app bg-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header currentView={currentView} navigateTo={navigateTo} scrollToSection={scrollToSection} />

      <Suspense fallback={<div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>Loading...</div>}>
        {currentView === 'home' && <Home navigateTo={navigateTo} />}
        {currentView === 'contact' && <Contact navigateTo={navigateTo} />}
        {currentView === 'process' && <Process navigateTo={navigateTo} />}
        {currentView === 'coverage' && <Coverage navigateTo={navigateTo} />}
        {currentView === 'faq' && <Faq navigateTo={navigateTo} />}
        {currentView === 'about' && <About />}
      </Suspense>

      <Footer navigateTo={navigateTo} standalone={currentView !== 'home'} />
    </div>
  );
}

export default App;
