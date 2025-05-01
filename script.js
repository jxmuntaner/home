document.addEventListener('DOMContentLoaded', function() {

    // --- Smooth Scrolling ---
    const scrollLinks = document.querySelectorAll('.header-nav a[href^="#"], a.btn[href^="#"]'); // Target new nav links + buttons

    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Calculate offset - header is not fixed, so usually 0 or small value
                const headerOffset = 20; // Small offset so content isn't right at the top edge
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
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
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('is-visible');
        });
        console.log("IntersectionObserver not supported, animations shown by default.");
    }

    // --- Contact Form Submission Logic ---
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
                    if (formStatus) formStatus.textContent = result.message || 'Message sent successfully!';
                    if (formStatus) formStatus.style.color = 'green';
                    contactForm.reset(); // Clear the form
                } else {
                    // Handle errors reported by the serverless function
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

}); // End DOMContentLoaded