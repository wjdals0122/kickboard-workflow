// ===== Tab filtering =====
const tabBtns = document.querySelectorAll('.tab-btn');
const stepCards = document.querySelectorAll('.step-card');
const arrows = document.querySelectorAll('.step-arrow-down');

// Tabs where arrows should NEVER appear (single-card or no-arrow tabs)
const NO_ARROW_TABS = ['flow', 'result'];
// Tabs where arrows appear only between specific step numbers
// key: tabId, value: array of [fromStep, toStep] pairs (step number = data-step attr)
const SPECIFIC_ARROW_TABS = {
  design: [[3, 5]]  // only between step 3 and step 5
};

function applyTab(tabId) {
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));

  // Show/hide cards
  stepCards.forEach(card => {
    const tabs = card.dataset.tabs ? card.dataset.tabs.split(' ') : [];
    const show = tabId === 'all' || tabs.includes(tabId);
    card.classList.toggle('hidden', !show);
  });

  // Hide all arrows first
  arrows.forEach(a => a.classList.add('hidden'));

  // No arrows for these tabs
  if (NO_ARROW_TABS.includes(tabId)) return;

  const visibleCards = [...stepCards].filter(c => !c.classList.contains('hidden'));

  if (tabId === 'all') {
    // Show arrows between all consecutive visible cards
    visibleCards.forEach((card, i) => {
      if (i < visibleCards.length - 1) {
        const next = card.nextElementSibling;
        if (next && next.classList.contains('step-arrow-down')) {
          next.classList.remove('hidden');
        }
      }
    });
  } else if (SPECIFIC_ARROW_TABS[tabId]) {
    // Show arrows only between specified step pairs
    const pairs = SPECIFIC_ARROW_TABS[tabId];
    visibleCards.forEach((card, i) => {
      if (i < visibleCards.length - 1) {
        const fromStep = parseInt(card.dataset.step);
        const toStep = parseInt(visibleCards[i + 1].dataset.step);
        const shouldShow = pairs.some(([a, b]) => a === fromStep && b === toStep);
        if (shouldShow) {
          const next = card.nextElementSibling;
          if (next && next.classList.contains('step-arrow-down')) {
            next.classList.remove('hidden');
          }
        }
      }
    });
  }
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
