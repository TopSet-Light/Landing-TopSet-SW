import { useEffect } from 'react';
import SiteFooter from '../components/layout/SiteFooter.jsx';
import HeroSection from '../sections/HeroSection.jsx';
import ProjectsSection from '../sections/ProjectsSection.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import ContactSection from '../sections/ContactSection.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import '../styles/home.css';

export default function Home() {
  useScrollReveal();
  useEffect(() => {
    const heading = document.querySelector('.home-page h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    const destination = document.getElementById(location.hash.slice(1));
    if (destination) destination.scrollIntoView();
  }, []);
  return (
    <div className="home-page bg-surface font-body-md text-on-surface antialiased">
      <main>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}

import '../components/ui/DepthButton.css';
import '../components/projects/projects.css';
