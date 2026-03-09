// Scroll fade-in animation
document.addEventListener('DOMContentLoaded', function () {
  const targets = document.querySelectorAll(
    '.overview-card, .stat-card, .feature-card, .screen-card, .effect-card, .flow-section, .issue-item'
  );

  targets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
});
