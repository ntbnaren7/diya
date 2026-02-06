import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WhyDiya() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const cardsRef = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const track = trackRef.current;
            const cards = cardsRef.current;

            // Total width of track (cards * width + gaps)
            // We want to scroll enough to see the last card
            const totalWidth = track.scrollWidth;
            const viewportWidth = window.innerWidth;

            // ScrollTrigger for horizontal movement
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: "+=3000", // Length of scroll
                    snap: 1 / (cards.length - 1) // Snap to cards
                }
            });

            // Move Track Left
            tl.to(track, {
                x: -(totalWidth - viewportWidth),
                ease: "none",
                duration: 1
            });

            // Spotlight Effect (Scale Up Center Card)
            // REMOVED COMPLEX ANIMATION temporarily to fix visibility.
            // We just ensure they are all visible.

            cards.forEach((card, i) => {
                gsap.set(card, { opacity: 1, scale: 1, filter: "blur(0px)" });

                /* 
                gsap.fromTo(card, 
                    { scale: 0.85, opacity: 0.5, filter: "blur(5px)" },
                    {
                        scale: 1.1,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: tl, // Linked to the horizontal tween
                            start: "center right",
                            end: "center left",
                            scrub: true,
                            toggleActions: "play reverse play reverse" 
                        }
                    }
                );
                */
            });

            // Alternative Spotlight: calculate offset based on index in the main timeline
            // Normalize progress 0 -> 1. 0 = Card 0 centered?
            // Not exactly.

            // Simplest visual: CSS + Viewport Observer? No, we need sync.
            // Let's rely on GSAP's horizontal ScrollTrigger calculation.
            // We'll iterate cards and add specific tweens to the main TL? No.

            // Use `onUpdate` to check proximity to center?
            // Efficient enough for 3 cards.

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Cards Data
    const cardsData = [
        {
            title: "Understand",
            desc: "Diya analyzes your brand voice, aesthetics, and audience to build a deep understanding of your identity.",
            icon: "🧠"
        },
        {
            title: "Create",
            desc: "It builds a unique digital profile, crafting a bespoke strategy tailored specifically for your goals.",
            icon: "✍️"
        },
        {
            title: "Generate",
            desc: "Finally, it generates high-quality, ready-to-post social media content that yields real results.",
            icon: "✨"
        }
    ];

    return (
        <section id="features" ref={sectionRef} className="why-diya-section">
            <div className="why-track" ref={trackRef}>
                {/* Intro Spacer to center first card initially? OR just start with first card? */}
                {/* User wants "cards shud already be there... no need to scroll for it to come"
                    So first card should be center-ish or visible immediately.
                    We'll add padding-left to track.
                */}
                <div className="track-spacer" style={{ minWidth: '35vw' }}></div>

                {cardsData.map((card, i) => (
                    <div
                        key={i}
                        className="why-card glass-panel"
                        ref={el => cardsRef.current[i] = el}
                    >
                        <div className="card-icon-large">{card.icon}</div>
                        <h3 className="card-title">{card.title}</h3>
                        <p className="card-desc">{card.desc}</p>

                        {/* Shimmer/Glow Effect */}
                        <div className="card-glow"></div>
                    </div>
                ))}

                <div className="track-spacer" style={{ minWidth: '35vw' }}></div>
            </div>
        </section>
    );
}
