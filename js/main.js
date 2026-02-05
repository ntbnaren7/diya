// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate GSAP ScrollTrigger with Lenis
gsap.registerPlugin(ScrollTrigger);

// --- Mouse Tracking ---
const mouse = { x: -1000, y: -1000 }; // Start off-screen
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// --- Hero Animation "Chaos to Order" ---

const shapesContainer = document.getElementById("hero-shapes");
const colors = ["#00c237", "#9d95ff", "#1a1a1a", "#e5e5e5"]; // Green, Purple, Dark, Light
const shapesData = []; // Store physics state objects

function createShapes(count = 60) {
    for (let i = 0; i < count; i++) {
        const shape = document.createElement("div");
        shape.classList.add("shape");

        // Random Shape Type
        const type = Math.floor(Math.random() * 6);
        let svgContent = "";

        const color = colors[Math.floor(Math.random() * colors.length)];

        if (type === 0) { // Circle
            svgContent = `<svg width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="25" fill="${color}"/></svg>`;
        } else if (type === 1) { // Rect
            svgContent = `<svg width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="${color}"/></svg>`;
        } else if (type === 2) { // Triangle
            svgContent = `<svg width="50" height="50" viewBox="0 0 50 50"><polygon points="25,0 50,50 0,50" fill="${color}"/></svg>`;
        } else if (type === 3) { // LinkedIn
            svgContent = `<svg width="50" height="50" viewBox="0 0 24 24" fill="${color}"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
        } else if (type === 4) { // X (Twitter)
            svgContent = `<svg width="50" height="50" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
        } else { // Instagram
            svgContent = `<svg width="50" height="50" viewBox="0 0 24 24" fill="${color}"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
        }

        shape.innerHTML = svgContent;
        shapesContainer.appendChild(shape);

        // Initial setup for GSAP timeline
        const size = Math.random() * 40 + 10;
        gsap.set(shape, {
            width: size,
            height: size,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotation: Math.random() * 360,
            opacity: 0,
            scale: 0
        });

        // Store physics data
        shapesData.push({
            element: shape,
            originX: 0, // Will be set after intro anim
            originY: 0,
            x: 0, // Physics offset X
            y: 0, // Physics offset Y
            vx: 0, // Velocity X
            vy: 0, // Velocity Y
            floatOffset: Math.random() * 100, // For sine wave
            floatSpeed: Math.random() * 0.02 + 0.01
        });
    }
}

function startChaosAnimation() {
    createShapes(60);

    const tl = gsap.timeline({
        onComplete: enablePhysics // Start physics loop after intro
    });

    // 1. Shapes appear and converge to center chaotically
    tl.to(".shape", {
        duration: 1.5,
        opacity: 0.8,
        scale: "random(0.5, 1.5)",
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        rotation: "random(-720, 720)",
        ease: "power4.in",
        stagger: {
            amount: 0.5,
            from: "random"
        }
    })

        // 2. Explosion! Shapes fly out
        .to(".shape", {
            duration: 2,
            x: "random(-200, " + (window.innerWidth + 200) + ")",
            y: "random(-200, " + (window.innerHeight + 200) + ")",
            rotation: "random(-180, 180)",
            ease: "elastic.out(1, 0.3)",
            stagger: {
                amount: 0.2,
                from: "center"
            }
        });

    // 3. Text Reveal synced with explosion
    tl.from(".hero-title span", {
        duration: 1.5,
        y: 100,
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)"
    }, "-=1.8")

        .from(".hero-subtitle", {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power3.out"
        }, "-=1")

        .from(".hero-cta", {
            duration: 1,
            y: 20,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.8")

        .from(".header", {
            duration: 1,
            y: -100,
            opacity: 0,
            ease: "power3.out",
            onComplete: () => {
                // Failsafe: ensure header is visible
                gsap.set(".header", { opacity: 1, y: 0 });
            }
        }, "-=1");
}

function enablePhysics() {
    // Capture final positions from GSAP intro as our "Origins"
    // AND adjust them to account for the initial sine wave offset
    // This allows the physics to "catch" the shape exactly where it is visually

    const startTime = gsap.ticker.time;

    shapesData.forEach(data => {
        const currentX = gsap.getProperty(data.element, "x");
        const currentY = gsap.getProperty(data.element, "y");

        // Calculate what the "float" value IS right now
        const initialFloatX = Math.sin(startTime * data.floatSpeed + data.floatOffset) * 20;
        const initialFloatY = Math.cos(startTime * data.floatSpeed + data.floatOffset) * 20;

        // Set origin so that: Origin + InitialFloat = CurrentVisualPosition
        data.originX = currentX - initialFloatX;
        data.originY = currentY - initialFloatY;

        // Zero out velocity initially to prevent "kick"
        data.vx = 0;
        data.vy = 0;
    });

    // Start GSAP Ticker for 60fps Physics
    gsap.ticker.add(physicsLoop);
}

function physicsLoop(time, deltaTime, frame) {
    // Convert ms to s roughly, but ticker gives us good frames
    // Use fixed physics step or just raw delta

    const repulsionRadius = 300;
    const forceStrength = 2; // How hard they run away
    const friction = 0.92; // Air resistance
    const springStrength = 0.05; // Pull back to origin

    shapesData.forEach(data => {
        // 1. Continuous Floating (Sine Wave)
        const floatX = Math.sin(time * data.floatSpeed + data.floatOffset) * 20;
        const floatY = Math.cos(time * data.floatSpeed + data.floatOffset) * 20;

        // 2. Repulsion Logic
        // Calculate current absolute position (approx)
        const currentAbsX = data.originX + data.x + floatX;
        const currentAbsY = data.originY + data.y + floatY; // Ignoring page scroll for simplicity in hero

        const dx = mouse.x - currentAbsX;
        const dy = mouse.y - currentAbsY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (repulsionRadius - distance) / repulsionRadius; // 0 to 1
            const push = force * forceStrength;

            // Push AWAY from mouse
            data.vx -= Math.cos(angle) * push;
            data.vy -= Math.sin(angle) * push;
        }

        // 3. Spring back to origin (Elastic Tether)
        // Hooke's Law: F = -k * x
        // We want data.x/y to be 0 (at origin)
        data.vx += -data.x * springStrength;
        data.vy += -data.y * springStrength;

        // 4. Update Velocity & Position
        data.vx *= friction;
        data.vy *= friction;

        data.x += data.vx;
        data.y += data.vy;

        // 5. Apply Transform
        gsap.set(data.element, {
            x: data.originX + data.x + floatX,
            y: data.originY + data.y + floatY,
            rotation: "+=0.2" // Subtle constant rotation
        });
    });
}

// Preloader
function startLoader() {
    const tl = gsap.timeline();

    tl.to(".preloader", {
        duration: 0.8,
        opacity: 0,
        delay: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            document.querySelector(".preloader").style.display = "none";
            startChaosAnimation();
        }
    });
}

// --- Other Animations ---

function initMarquee() {
    gsap.to(".marquee-container", {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "linear"
    });
}

function initFeatures() {
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
}

function initFooter() {
    gsap.from(".footer-link", {
        scrollTrigger: {
            trigger: ".footer",
            start: "top 80%"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)"
    });

    const footerLink = document.querySelector(".footer-link");
    if (footerLink) {
        footerLink.addEventListener("mouseenter", () => {
            gsap.to(footerLink, { scale: 1.1, duration: 0.3, ease: "power2.out" });
        });
        footerLink.addEventListener("mouseleave", () => {
            gsap.to(footerLink, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
    }
}

// Navbar loaded via script tag in index.html

// Master Init
window.addEventListener("load", async () => {
    await loadNavbar();
    startLoader();
    initMarquee();
    initFeatures();
    initWhyDiya();
    initFooter();
});

function initWhyDiya() {
    gsap.registerPlugin(ScrollTrigger);

    // --- HORIZONTAL ANIMATION LOGIC ---

    // 1. Move the Main Track (Background Panels)
    const track = document.querySelector(".why-horizontal-track");
    const stream = document.querySelector(".horizontal-stream");

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".why-scroll-wrapper",
            pin: true,
            scrub: 1, // Smooth interaction
            start: "top top",
            end: "+=3500",
            snap: 1 / 2
        }
    });

    // Move Panel Track
    tl.to(track, {
        xPercent: -66.666,
        ease: "none"
    });

    // 2. Animate the Stream (Parallax Movement)
    // The stream moves faster than the panels to simulate a "long feed" scrolling by
    gsap.to(stream, {
        scrollTrigger: {
            trigger: ".why-scroll-wrapper",
            start: "top top",
            end: "+=3500",
            scrub: 1.5 // Slightly looser scrub for "drift" feel
        },
        x: -window.innerWidth * 1.5, // Move left significantly
        ease: "none"
    });

    // Parralax Rows for "Depth"
    gsap.to(".row-1", {
        scrollTrigger: {
            trigger: ".why-scroll-wrapper",
            start: "top top",
            end: "+=3500",
            scrub: 1
        },
        x: -100, // Top row moves slightly extra
        ease: "none"
    });

    gsap.to(".row-2", {
        scrollTrigger: {
            trigger: ".why-scroll-wrapper",
            start: "top top",
            end: "+=3500",
            scrub: 1
        },
        x: 100, // Bottom row resists slightly
        ease: "none"
    });

    // 3. Dashboard Integration (End State)
    const dashboardMockup = document.querySelector(".dashboard-mockup");

    gsap.from(dashboardMockup, {
        scrollTrigger: {
            trigger: ".why-scroll-wrapper",
            start: "2500px top", // Near end
            end: "3500px top",
            scrub: 1
        },
        scale: 0.9,
        opacity: 0,
        y: 100
    });
}

