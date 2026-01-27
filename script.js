// Smooth scrolling for in-page anchor links
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const el = document.querySelector(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', targetId);
    }
  });
});
