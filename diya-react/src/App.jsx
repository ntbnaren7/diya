import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import BrandStatement from './components/BrandStatement'; // NEW: The "Why DIYA" typographic section
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

  return (
    <div className="app">

      <Navbar activeSection={activeSection} />
      <main>
        <section id="home"><Hero /></section>
        <Marquee />
        <BrandStatement /> {/* NEW: "Why DIYA" Statement */}
        <Manifesto />
        <WhyDiya />
        <footer id="connect"><Footer /></footer>
      </main>
    </div>
  );
}

export default App;
