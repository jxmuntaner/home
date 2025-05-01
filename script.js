document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.getElementById('navbar');
    const navLinksContainer = document.getElementById('nav-links'); // Target the UL
    const hamburgerButton = document.getElementById('hamburger-button');
    const navLinks = document.querySelectorAll('#nav-links li a'); // Select links inside the UL

    // --- Navbar Scroll Effect ---
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Hamburger Menu Toggle ---
    if (hamburgerButton && navLinksContainer) {
        hamburgerButton.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            hamburgerButton.classList.toggle('is-active'); // Toggle hamburger animation class

            // Toggle aria-expanded attribute for accessibility
            const isExpanded = navLinksContainer.classList.contains('nav-active');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- Smooth Scrolling & Close Mobile Nav ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav if it's open after clicking a link
                if (navLinksContainer.classList.contains('nav-active')) {
                    navLinksContainer.classList.remove('nav-active');
                    hamburgerButton.classList.remove('is-active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // --- Dynamic Year in Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
            // rootMargin: "-50px 0px -50px 0px" // Optional: adjust viewport bounds
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        // Make elements visible immediately or use a simpler scroll listener (less performant)
        animatedElements.forEach(element => {
            element.classList.add('is-visible');
        });
        console.log("IntersectionObserver not supported, animations shown by default.");
    }

}); // End DOMContentLoaded