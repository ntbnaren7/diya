// Navbar Component (Inlined for local file access)
window.loadNavbar = function () {
    console.log("loadNavbar called");
    const navbarHTML = `
        <div class="container">
            <nav class="nav">
                <a href="#" class="logo-link">
                    <img src="assets/logo.png" alt="DIYA Logo" class="nav-logo">
                </a>
                <ul class="nav-links">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how-it-works">How it Works</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                </ul>
                <button class="cta-button small">Get Started</button>
            </nav>
        </div>
    `;

    const header = document.querySelector('.header');
    if (header) {
        header.innerHTML = navbarHTML;
        console.log("Navbar loaded successfully, content length:", header.innerHTML.length);
    } else {
        console.error("Critical: .header element not found!");
    }
    return Promise.resolve(); // Keep Promise API for main.js compatibility
};
