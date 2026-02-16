import React, { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../css/brand-persona.css';
import AppHeader from './ui/AppHeader';
import ActionDock from './ui/ActionDock';
import PersonaBackground from './PersonaBackground';
import HeaderAnnotations from './HeaderAnnotations';
import ModernButton from './ui/ModernButton';

export default function BrandPersona() {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Helper to split text for character animations
    const splitText = (text) => text.split('').map((char, i) => (
        <span key={i} className="char" style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
            {char}
        </span>
    ));

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // --- 0. Initial States (Hidden) ---
            // Elements are hidden in CSS (opacity: 0) to prevent FOUC.
            // We set starting transform positions here.
            gsap.set('.persona-header h2 .char', { y: 40, skewY: 10 });
            gsap.set('.header-meta', { y: 20 });
            gsap.set('.app-header', { y: -20, opacity: 0 }); // Animate AppHeader
            gsap.set('.glass-card', { y: 60, scale: 0.95 });
            gsap.set('.persona-background', { opacity: 0 });

            // Box Animation Init
            gsap.set('.brand-highlight-box', {
                width: 'auto',
                scaleX: 0,
                transformOrigin: 'left center',
                padding: '0 0.3em',
                opacity: 1 // Make visible so scaleX can work
            });
            gsap.set('.brand-highlight-box span', { opacity: 0 });

            const tl = gsap.timeline();

            // --- 1. Header Text Reveal (MEET YOUR ... PERSONA) ---
            tl.to('.persona-header h2 .char', {
                y: 0,
                opacity: 1,
                skewY: 0,
                duration: 1,
                stagger: 0.04,
                ease: "power3.out",
                willChange: "transform, opacity"
            })
                // --- 1.5. THE SICK BOX REVEAL ---
                .to('.brand-highlight-box', {
                    scaleX: 1,
                    duration: 0.6,
                    ease: "expo.out"
                }, "-=0.6")
                .to('.brand-highlight-box span', {
                    opacity: 1,
                    duration: 0.2
                }, "-=0.2")

                // --- 2. Sub-header & Nav Fade In ---
                .to(['.header-meta', '.app-header'], {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out"
                }, "-=0.2")

                // --- 3. Background Slow Fade ---
                .to('.persona-background', {
                    opacity: 1,
                    duration: 2,
                    ease: "power1.inOut"
                }, "-=1")

                // --- 4. Grid Waterfall (Staggered Cards) ---
                .to('.glass-card', {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power2.out",
                    clearProps: "transform,scale"
                }, "-=1.5");

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
    };

    return (
        <div className="persona-page" ref={containerRef} style={{ paddingTop: '80px' }}>
            <PersonaBackground />

            <AppHeader />

            <div className="persona-header">
                <HeaderAnnotations />
                <h2>
                    {splitText("MEET YOUR")}
                    <div className="brand-highlight-box">
                        <span>BRAND</span>
                    </div>
                    {splitText("PERSONA")}
                </h2>
                <div className="header-meta">Here's how DIYA sees your brand</div>
            </div>

            <div className="bento-grid">
                {/* 1. IDENTITY CARD (Hero) */}
                <div className="glass-card card-identity">
                    <div className="card-label">Brand Identity</div>
                    <h1 className="card-title">Diya.ai</h1>
                    <p className="card-subtitle">
                        Modern, Scientific, & Approachable.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: '#111', borderRadius: '50%' }}></div>
                    </div>
                </div>

                {/* 2. COLORS CARD */}
                <div className="glass-card card-colors">
                    <div className="swatch-container">
                        <div className="color-swatch" style={{ backgroundColor: '#111111' }} onClick={() => copyToClipboard('#111111')}>
                            <span>#111111</span>
                        </div>
                        <div className="color-swatch" style={{ backgroundColor: '#00c237' }} onClick={() => copyToClipboard('#00c237')}>
                            <span>#00c237</span>
                        </div>
                        <div className="color-swatch" style={{ backgroundColor: '#f9f9f9', color: '#333', border: '1px solid #eee' }} onClick={() => copyToClipboard('#f9f9f9')}>
                            <span>#f9f9f9</span>
                        </div>
                    </div>
                </div>

                {/* 3. TYPOGRAPHY CARD */}
                <div className="glass-card card-typography">
                    <div className="card-label">Typography</div>
                    <div className="type-preview">Aa</div>
                    <div className="font-name">Inter</div>
                    <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Variable Sans</p>
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.6, fontSize: '0.8rem' }}>
                        <span>Regular 400</span>
                        <span>Medium 500</span>
                        <span style={{ fontWeight: 700 }}>Bold 700</span>
                    </div>
                </div>

                {/* 4. BRAND VOICE CARD */}
                <div className="glass-card card-voice">
                    <div className="card-label">Brand Voice</div>
                    <div className="voice-tags">
                        <span className="voice-tag">Professional</span>
                        <span className="voice-tag">Clean</span>
                        <span className="voice-tag">Innovative</span>
                        <span className="voice-tag">Trustworthy</span>
                        <span className="voice-tag">Minimal</span>
                    </div>
                    <div style={{ marginTop: 'auto', fontSize: '0.9rem', lineHeight: '1.5', color: '#555' }}>
                        "Communicates with precision and clarity, avoiding jargon while maintaining a friendly, expert tone."
                    </div>
                </div>

                {/* 5. VISUAL STYLE */}
                <div className="glass-card card-visual">
                    <div className="card-label">Visual Direction</div>
                    <div style={{
                        width: '100%', height: '100px',
                        background: 'linear-gradient(90deg, #f9f9f9 0%, #eee 50%, #f9f9f9 100%)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#999',
                        letterSpacing: '1px'
                    }}>
                        GLASSMORPHISM & GRIDS
                    </div>
                </div>

                {/* ACTION DOCK */}
                <div style={{ position: 'relative', zIndex: 100 }}>
                    <ActionDock
                        onBack={() => navigate('/brand-builder')}
                        backLabel="Edit Identity"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                className="crystal-btn"
                                onClick={() => console.log('Exporting...')}
                                style={{
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    background: 'rgba(255,255,255,0.5)',
                                    padding: '0 1.5rem',
                                    height: '50px',
                                    borderRadius: '999px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: '#555'
                                }}
                            >
                                ↓ Download Assets
                            </button>
                            <ModernButton onClick={() => navigate('/content-direction')}>
                                Proceed to Strategy
                            </ModernButton>
                        </div>
                    </ActionDock>
                </div>

            </div>
        </div>
    );
}
