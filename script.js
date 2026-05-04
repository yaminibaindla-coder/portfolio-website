const nav = document.getElementById('site-nav');
const toggle = document.querySelector('.nav-toggle');
const sections = document.querySelectorAll('.section');

toggle.addEventListener('click', () => {
  nav.classList.toggle('nav-open');
  toggle.textContent = nav.classList.contains('nav-open') ? 'Close' : 'Menu';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
});

sections.forEach((section) => observer.observe(section));

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('full-name');
    const email = formData.get('email-address');
    const message = formData.get('message');

    // Create thank you message
    const thankYouMessage = document.createElement('div');
    thankYouMessage.className = 'thank-you-message';
    thankYouMessage.innerHTML = `
      <div class="thank-you-content">
        <h3>Thank you, ${name}!</h3>
        <p>Your message has been sent successfully. I'll get back to you at <strong>${email}</strong> as soon as possible.</p>
        <button class="button primary close-thank-you">Close</button>
      </div>
    `;

    // Add to page
    document.body.appendChild(thankYouMessage);

    // Show with animation
    setTimeout(() => {
      thankYouMessage.classList.add('show');
    }, 100);

    // Handle close button
    const closeBtn = thankYouMessage.querySelector('.close-thank-you');
    closeBtn.addEventListener('click', () => {
      thankYouMessage.classList.remove('show');
      setTimeout(() => {
        thankYouMessage.remove();
      }, 300);
    });

    // Reset form
    contactForm.reset();
  });
}
