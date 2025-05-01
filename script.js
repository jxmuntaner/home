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

    const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitButton = document.getElementById('submit-button');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default browser submission

        // Show loading state
        if (submitButton) submitButton.disabled = true;
        if (formStatus) formStatus.textContent = 'Sending...';
        if (formStatus) formStatus.style.color = 'inherit'; // Reset color

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries()); // Convert FormData to plain object

        try {
            // Send data to the Vercel serverless function
            const response = await fetch('/api/submit-form', { // Endpoint matches the file name in /api
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Parse the JSON response from the function
            const result = await response.json();

            if (response.ok) { // Check if response status is 2xx
                if (formStatus) formStatus.textContent = result.message;
                if (formStatus) formStatus.style.color = 'green';
                contactForm.reset(); // Clear the form
            } else {
                // Handle errors reported by the serverless function (e.g., validation, email sending fail)
                if (formStatus) formStatus.textContent = `Error: ${result.message || 'Something went wrong.'}`;
                if (formStatus) formStatus.style.color = 'red';
            }

        } catch (error) {
            // Handle network errors or issues reaching the function
            console.error('Form submission error:', error);
            if (formStatus) formStatus.textContent = 'Network error. Please try again.';
            if (formStatus) formStatus.style.color = 'red';
        } finally {
             // Re-enable submit button
            if (submitButton) submitButton.disabled = false;
        }
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