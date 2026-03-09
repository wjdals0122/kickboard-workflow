// ===== Arrow visibility rules per tab =====
// key: tabId → array of data-between values that should be VISIBLE
const ARROW_RULES = {
  all:    ['1-2', '2-3', '3-4', '4-5', '5-6'],
  flow:   [],
  design: ['3-4'],   // step4 is hidden, so this arrow visually bridges step3 → step5
  result: []
};

const tabBtns = document.querySelectorAll('.tab-btn');
const stepCards = document.querySelectorAll('.step-card');
const arrows = document.querySelectorAll('.step-arrow-down');

function applyTab(tabId) {
  // Update active tab button
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));

  // Show/hide cards via inline style
  stepCards.forEach(card => {
    const tabs = card.dataset.tabs ? card.dataset.tabs.split(' ') : [];
    const show = tabId === 'all' || tabs.includes(tabId);
    card.style.display = show ? '' : 'none';
  });

  // Show/hide arrows via inline style
  const allowed = ARROW_RULES[tabId] || [];
  arrows.forEach(a => {
    const between = a.dataset.between || '';
    a.style.display = allowed.includes(between) ? '' : 'none';
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
