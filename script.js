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
