// ===== Tab filtering =====
const tabBtns = document.querySelectorAll('.tab-btn');
const stepCards = document.querySelectorAll('.step-card');
const arrows = document.querySelectorAll('.step-arrow-down');

function applyTab(tabId) {
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));

  stepCards.forEach(card => {
    const tabs = card.dataset.tabs ? card.dataset.tabs.split(' ') : [];
    const show = tabId === 'all' || tabs.includes(tabId);
    card.classList.toggle('hidden', !show);
  });

  // Manage arrows: hide all first, then show only between visible cards
  arrows.forEach(a => a.classList.add('hidden'));
  const visibleCards = [...stepCards].filter(c => !c.classList.contains('hidden'));
  visibleCards.forEach((card, i) => {
    if (i < visibleCards.length - 1) {
      let next = card.nextElementSibling;
      if (next && next.classList.contains('step-arrow-down')) {
        next.classList.remove('hidden');
      }
    }
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => applyTab(btn.dataset.tab));
});

// ===== Scroll animation =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.06 });

stepCards.forEach(card => observer.observe(card));

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  applyTab('all');
  setTimeout(() => {
    stepCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight) card.classList.add('visible');
    });
  }, 120);
});
