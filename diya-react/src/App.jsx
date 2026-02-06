import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Manifesto from './components/Manifesto';
import WhyDiya from './components/WhyDiya';
import Footer from './components/Footer';
import './index.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // ScrollSpy Logic
  const [activeSection, setActiveSection] = React.useState('home');

  useEffect(() => {
    const sections = document.querySelectorAll('section, footer');
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Active when element is in center of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      if (section.id) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll Reset Logic (Always Start at Top)
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, null, ' ');
    }
  }, []);

  // Background Fade-In Logic (REMOVED: User requested background throughout)
  useEffect(() => {
    // Determine opacity: user requested "throughout", so we set it visible immediately.
    // Logic: Force opacity 1 instantly.
    gsap.set(".ambient-background", { opacity: 1 });
  }, []);

  return (
    <div className="app">
      <div className="ambient-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      <Navbar activeSection={activeSection} />
      <main>
        <section id="home"><Hero /></section>
        <Marquee />
        <Manifesto />
        <WhyDiya />
        <footer id="connect"><Footer /></footer>
      </main>
    </div>
  );
}

export default App;
