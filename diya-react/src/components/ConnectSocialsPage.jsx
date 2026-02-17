import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import AppHeader from './ui/AppHeader';
import NoiseOverlay from './NoiseOverlay';
import MouseSpotlight from './MouseSpotlight';
import { LinkedInIcon, InstagramIcon, XIcon, FacebookIcon } from './ui/PlatformIcons';
import '../css/connect-socials.css';

gsap.registerPlugin(TextPlugin);

// --- Platform Config ---
const PLATFORMS = [
    {
        id: 'linkedin',
        name: 'LinkedIn',
        color: '#0A66C2',
        icon: LinkedInIcon,
        desc: 'Publish posts directly to your LinkedIn profile or company page.'
    },
    {
        id: 'instagram',
        name: 'Instagram',
        color: '#E4405F',
        icon: InstagramIcon,
        desc: 'Schedule and share visual content to your Instagram business account.'
    },
    {
        id: 'x',
        name: 'X (Twitter)',
        color: '#000000',
        icon: XIcon,
        desc: 'Post updates and threads directly to your X profile.'
    },
    {
        id: 'facebook',
        name: 'Facebook',
        color: '#1877F2',
        icon: FacebookIcon,
        desc: 'Share content to your Facebook page or business profile.'
    },
];

// --- OAuth Simulation Steps ---
const OAUTH_STEPS = [
    'Opening secure connection...',
    'Verifying your identity...',
    'Fetching account details...',
    'Granting permissions...',
    'Almost there...',
];

// --- Scramble Text Characters (for text scramble effect) ---
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

// --- Floating Shapes Component ---
function FloatingShapes() {
    const shapesRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const shapes = gsap.utils.toArray('.cs-float-shape');
            shapes.forEach((shape, i) => {
                // Gentle floating drift
                gsap.to(shape, {
                    y: `random(-15, 15)`,
                    x: `random(-10, 10)`,
                    rotation: `random(-8, 8)`,
                    duration: `random(4, 7)`,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.4,
                });
                // Fade in
                gsap.fromTo(shape,
                    { opacity: 0 },
                    { opacity: 1, duration: 1.2, delay: 0.5 + i * 0.15, ease: 'power2.out' }
                );
            });
        }, shapesRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="cs-shapes-layer" ref={shapesRef}>
            <div className="cs-float-shape circle-lg" />
            <div className="cs-float-shape circle-md" />
            <div className="cs-float-shape circle-sm" />
            <div className="cs-float-shape square-glass" />
            <div className="cs-float-shape square-glass-sm" />
            <div className="cs-float-shape dot-cluster" />
            <div className="cs-float-shape dot-cluster-2" />
        </div>
    );
}

// --- Handwritten Decor Component ---
function HandwrittenDecor() {
    const layerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Draw SVG paths
            const paths = gsap.utils.toArray('.cs-hw-path');
            paths.forEach((path, i) => {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: 1.2,
                    ease: 'power2.out',
                    delay: 1.5 + i * 0.3,
                });
            });

            // Fade in texts
            gsap.to('.cs-hw-text', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out',
                delay: 2.0,
            });
        }, layerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="cs-handwritten-layer" ref={layerRef}>
            {/* "Secure & simple" text */}
            <div className="cs-hw-text trust" style={{ transform: 'translateY(8px) rotate(-6deg)' }}>
                secure & simple ✦
            </div>

            {/* "one click away" text */}
            <div className="cs-hw-text easy" style={{ transform: 'translateY(8px) rotate(4deg)' }}>
                one click away →
            </div>

            {/* Scribble arrow near CTA */}
            <svg className="cs-hw-arrow cta-arrow" width="120" height="80" viewBox="0 0 120 80" style={{ overflow: 'visible' }}>
                <path
                    className="cs-hw-path"
                    d="M 100,5 C 60,10 30,35 15,60"
                    fill="none"
                    stroke="rgba(0,0,0,0.12)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    className="cs-hw-path"
                    d="M 20,50 L 15,60 L 28,58"
                    fill="none"
                    stroke="rgba(0,0,0,0.12)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Sizzle star near header */}
            <svg style={{ position: 'absolute', top: '12%', right: '14%', overflow: 'visible' }} width="30" height="30" viewBox="0 0 30 30">
                <path
                    className="cs-hw-path"
                    d="M 15,0 L 15,30 M 0,15 L 30,15 M 5,5 L 25,25 M 25,5 L 5,25"
                    fill="none"
                    stroke="rgba(0,0,0,0.08)"
                    strokeWidth="1"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

export default function ConnectSocialsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const previousState = location.state || {};
    const containerRef = useRef(null);
    const subtitleRef = useRef(null);

    // Connection states: 'not_connected' | 'connected' | 'warning'
    const [connections, setConnections] = useState(() => {
        const initial = {};
        PLATFORMS.forEach(p => { initial[p.id] = 'not_connected'; });
        return initial;
    });

    // Publishing toggles
    const [autoSchedule, setAutoSchedule] = useState(true);
    const [manualReview, setManualReview] = useState(false);

    // OAuth Modal
    const [oauthTarget, setOauthTarget] = useState(null);
    const [oauthPhase, setOauthPhase] = useState('idle');
    const [oauthProgress, setOauthProgress] = useState(0);
    const [oauthStep, setOauthStep] = useState('');
    const oauthOverlayRef = useRef(null);
    const oauthModalRef = useRef(null);

    const connectedCount = Object.values(connections).filter(s => s === 'connected').length;

    // --- 3D Tilt Effect on Cards ---
    const handleCardMouseMove = useCallback((e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        // Update CSS variables for glow
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 800,
        });
    }, []);

    const handleCardMouseLeave = useCallback((e) => {
        gsap.to(e.currentTarget, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
        });
    }, []);

    // --- Entrance Animation ---
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Pre-set states
            gsap.set('.connect-title .title-word', { y: 40, opacity: 0, filter: 'blur(12px)' });
            gsap.set('.connect-subtitle', { opacity: 0 });
            gsap.set('.connect-counter', { scale: 0.8, opacity: 0 });
            gsap.set('.platform-card', { y: 50, opacity: 0, scale: 0.92 });
            gsap.set('.security-block', { opacity: 0, y: 15 });
            gsap.set('.publishing-section', { opacity: 0, y: 15 });
            gsap.set('.connect-footer', { y: 20, opacity: 0 });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // 1. Title words blur-slide in (Elegant Reveal)
            tl.to('.connect-title .title-word', {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1,
                stagger: 0.12,
                ease: 'power3.out',
            })
                // 2. Subtitle scramble reveal (Slower & Deliberate)
                .call(() => {
                    if (subtitleRef.current) {
                        const finalText = 'DIYA will publish and schedule content directly to these platforms.';
                        const el = subtitleRef.current;
                        el.style.opacity = '1';
                        let iteration = 0;
                        // Slower interval: 50ms (was 30ms)
                        const interval = setInterval(() => {
                            el.textContent = finalText.split('').map((char, i) => {
                                if (i < iteration) return finalText[i];
                                if (char === ' ') return ' ';
                                return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                            }).join('');
                            // Smaller increment: 0.5 (was 2) for longer duration
                            iteration += 0.5;
                            if (iteration > finalText.length) {
                                el.textContent = finalText;
                                clearInterval(interval);
                            }
                        }, 50);
                    }
                }, null, '-=0.4')
                // 3. Counter pill pops in
                .to('.connect-counter', {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'back.out(2)',
                }, '-=0.5')
                // 4. Cards elastic pop
                .to('.platform-card', {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.2)',
                }, '-=0.3')
                // 5. Remaining sections
                .to('.security-block', { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
                .to('.publishing-section', { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
                .to('.connect-footer', { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');

        }, containerRef);
        return () => ctx.revert();
    }, []);

    // --- OAuth Simulation ---
    const startOAuth = (platform) => {
        setOauthTarget(platform);
        setOauthPhase('progress');
        setOauthProgress(0);
        setOauthStep(OAUTH_STEPS[0]);

        // Animate overlay in with blur ramp
        setTimeout(() => {
            if (oauthOverlayRef.current && oauthModalRef.current) {
                gsap.to(oauthOverlayRef.current, {
                    opacity: 1,
                    duration: 0.35,
                    ease: 'power2.out',
                });
                // Animate backdrop blur
                gsap.fromTo(oauthOverlayRef.current,
                    { backdropFilter: 'blur(0px)', webkitBackdropFilter: 'blur(0px)' },
                    { backdropFilter: 'blur(12px)', webkitBackdropFilter: 'blur(12px)', duration: 0.5, ease: 'power2.out' }
                );
                gsap.to(oauthModalRef.current, {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                });
            }
        }, 50);

        // Simulate progress
        let progress = 0;
        let stepIndex = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setOauthProgress(100);
                setOauthStep('Connection established!');
                setTimeout(() => setOauthPhase('success'), 400);
                return;
            }
            const newStepIndex = Math.min(Math.floor((progress / 100) * OAUTH_STEPS.length), OAUTH_STEPS.length - 1);
            if (newStepIndex !== stepIndex) {
                stepIndex = newStepIndex;
                setOauthStep(OAUTH_STEPS[stepIndex]);
            }
            setOauthProgress(progress);
        }, 350);
    };

    const completeOAuth = () => {
        if (oauthTarget) {
            setConnections(prev => ({ ...prev, [oauthTarget.id]: 'connected' }));

            // Animate card success with ring pulse
            const cardEl = document.querySelector(`[data-platform="${oauthTarget.id}"]`);
            if (cardEl) {
                gsap.fromTo(cardEl,
                    { boxShadow: '0 0 0 0 rgba(0,194,55,0)' },
                    {
                        boxShadow: '0 0 0 8px rgba(0,194,55,0.15)',
                        duration: 0.4,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.out',
                    }
                );
                // Logo bounce
                const logo = cardEl.querySelector('.platform-logo');
                if (logo) {
                    gsap.fromTo(logo, { scale: 1 }, { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' });
                }
            }
        }
        closeOAuth();
    };

    const closeOAuth = () => {
        if (oauthOverlayRef.current && oauthModalRef.current) {
            gsap.to(oauthModalRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.25, ease: 'power2.in' });
            gsap.to(oauthOverlayRef.current, {
                opacity: 0,
                backdropFilter: 'blur(0px)',
                webkitBackdropFilter: 'blur(0px)',
                duration: 0.3,
                onComplete: () => {
                    setOauthTarget(null);
                    setOauthPhase('idle');
                    setOauthProgress(0);
                }
            });
        } else {
            setOauthTarget(null);
            setOauthPhase('idle');
            setOauthProgress(0);
        }
    };

    const handleDisconnect = (platformId) => {
        setConnections(prev => ({ ...prev, [platformId]: 'not_connected' }));
        const cardEl = document.querySelector(`[data-platform="${platformId}"]`);
        if (cardEl) {
            gsap.fromTo(cardEl, { scale: 1 }, { scale: 0.97, duration: 0.15, yoyo: true, repeat: 1 });
        }
    };

    const handleContinue = () => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => navigate('/brand-calendar', { state: { ...previousState, connections } })
            });
            tl.to('.platform-card', {
                opacity: 0, y: -20, scale: 0.95, duration: 0.3,
                stagger: 0.04, ease: 'power2.in'
            })
                .to(['.connect-header', '.connect-footer', '.security-block', '.publishing-section'],
                    { opacity: 0, y: -15, duration: 0.3, ease: 'power2.in' }, '-=0.15')
                .to('.cs-shapes-layer', { opacity: 0, duration: 0.3 }, '-=0.2')
                .to('.cs-handwritten-layer', { opacity: 0, duration: 0.2 }, '-=0.3');
        }, containerRef);
    };

    const handleBack = () => {
        navigate('/gallery-preview', { state: previousState });
    };

    // Split title into individual words for staggered animation
    const titleWords = 'Connect your social accounts'.split(' ');

    // --- Render ---
    return (
        <div className="connect-socials-page" ref={containerRef}>
            <NoiseOverlay />
            <MouseSpotlight />
            <FloatingShapes />
            <HandwrittenDecor />
            <AppHeader />

            {/* Header */}
            <div className="connect-header">
                <h1 className="connect-title">
                    {titleWords.map((word, i) => (
                        <span key={i} className="title-word">
                            {word}{i < titleWords.length - 1 ? '\u00A0' : ''}
                        </span>
                    ))}
                </h1>
                <p className="connect-subtitle" ref={subtitleRef}>
                    DIYA will publish and schedule content directly to these platforms.
                </p>
                <div className={`connect-counter ${connectedCount > 0 ? 'has-connections' : ''}`}>
                    <span className="counter-dot" />
                    {connectedCount} of {PLATFORMS.length} connected
                </div>
            </div>

            {/* Platform Grid */}
            <div className="platform-grid">
                {PLATFORMS.map(platform => {
                    const status = connections[platform.id];
                    const Icon = platform.icon;
                    return (
                        <div
                            key={platform.id}
                            className={`platform-card ${status}`}
                            data-platform={platform.id}
                            onMouseMove={handleCardMouseMove}
                            onMouseLeave={handleCardMouseLeave}
                        >
                            <div className="platform-card-top">
                                <div className="platform-logo" style={{ background: platform.color }}>
                                    <Icon size={22} />
                                </div>
                                <span className={`status-badge ${status.replace('_', '-')}`}>
                                    <span className={`status-dot ${status.replace('_', '-')}`} />
                                    {status === 'connected' ? 'Connected'
                                        : status === 'warning' ? 'Reconnect'
                                            : 'Not Connected'}
                                </span>
                            </div>

                            <h3 className="platform-name">{platform.name}</h3>
                            <p className="platform-desc">{platform.desc}</p>

                            {status === 'not_connected' && (
                                <button className="platform-action-btn connect" onClick={() => startOAuth(platform)}>
                                    Connect
                                </button>
                            )}
                            {status === 'connected' && (
                                <button className="platform-action-btn disconnect" onClick={() => handleDisconnect(platform.id)}>
                                    Disconnect
                                </button>
                            )}
                            {status === 'warning' && (
                                <button className="platform-action-btn reconnect" onClick={() => startOAuth(platform)}>
                                    Reconnect
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Security Reassurance */}
            <div className="security-block">
                <div className="security-inner">
                    <span className="security-icon">🔒</span>
                    <span className="security-text">
                        DIYA uses secure authentication. We never store your passwords.
                    </span>
                </div>
            </div>

            {/* Publishing Behavior */}
            <div className="publishing-section">
                <h4 className="publishing-title">Default publishing behavior</h4>
                <div className="publishing-option">
                    <span className="publishing-label">Auto-schedule approved posts</span>
                    <button
                        className={`toggle-switch ${autoSchedule ? 'active' : ''}`}
                        onClick={() => setAutoSchedule(!autoSchedule)}
                        aria-label="Toggle auto-schedule"
                    >
                        <span className="toggle-knob" />
                    </button>
                </div>
                <div className="publishing-option">
                    <span className="publishing-label">Require manual review before publishing</span>
                    <button
                        className={`toggle-switch ${manualReview ? 'active' : ''}`}
                        onClick={() => setManualReview(!manualReview)}
                        aria-label="Toggle manual review"
                    >
                        <span className="toggle-knob" />
                    </button>
                </div>
            </div>

            {/* Notice */}
            {connectedCount === 0 && (
                <p className="connect-notice">
                    You'll need to connect at least one account before publishing.
                </p>
            )}

            {/* Footer */}
            <div className="connect-footer">
                <button className="connect-footer-btn secondary" onClick={handleBack}>
                    ← Back to Gallery
                </button>
                <button className="connect-footer-btn primary" onClick={handleContinue}>
                    Continue to Calendar →
                </button>
            </div>

            {/* OAuth Simulation Modal */}
            {oauthTarget && (
                <div className="oauth-overlay" ref={oauthOverlayRef} onClick={oauthPhase === 'success' ? completeOAuth : undefined}>
                    <div className="oauth-modal" ref={oauthModalRef} onClick={(e) => e.stopPropagation()}>
                        {oauthPhase === 'progress' && (
                            <>
                                <div className="oauth-platform-icon" style={{ background: oauthTarget.color }}>
                                    <oauthTarget.icon size={28} />
                                </div>
                                <h3 className="oauth-title">Connecting to {oauthTarget.name}</h3>
                                <p className="oauth-desc">
                                    Please wait while we securely connect your account...
                                </p>
                                <div className="oauth-progress">
                                    <div className="oauth-progress-bar" style={{ width: `${oauthProgress}%` }} />
                                </div>
                                <p className="oauth-status-text">{oauthStep}</p>
                            </>
                        )}
                        {oauthPhase === 'success' && (
                            <>
                                <div className="oauth-success-icon">✓</div>
                                <h3 className="oauth-title">{oauthTarget.name} Connected!</h3>
                                <p className="oauth-desc">
                                    Your account has been successfully linked. You're all set to publish.
                                </p>
                                <button className="oauth-done-btn" onClick={completeOAuth}>Done</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
