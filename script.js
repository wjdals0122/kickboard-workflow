// ===== Arrow visibility rules per tab =====
// key: tabId, value: array of 'between' values to SHOW (others hidden)
const ARROW_RULES = {
  all:    ['1-2', '2-3', '3-4', '4-5', '5-6'],  // show all
  flow:   [],                                      // no arrows
  design: ['3-5'],                                 // only between 3 and 5 — but 3→4→5 so we use 4-5
  result: []                                       // no arrows
};

// For "design" tab: cards 3 and 5 are shown, but arrow between them is "4-5"
// because arrow 3-4 is between step3 and step4, and step4 is hidden in design tab
// So we need to show arrow "4-5" which sits between step4(hidden) and step5
// Actually we want to show an arrow BETWEEN step3 and step5 visually.
// The arrow "3-4" sits right after step3, so we show that one.
// Let's re-examine: design tab shows step3 and step5.
// Arrow "3-4" is right after step3 → show this
// Arrow "4-5" is right after step4 (which is hidden) → this will be visible between step3 and step5 visually
// So for design tab, show both "3-4" and "4-5"? No — step4 card is hidden so arrow "4-5" appears floating.
// Best approach: show only "3-4" (right after step3, before the hidden step4)
// But step4 is hidden, so "3-4" arrow → hidden step4 → "4-5" arrow → step5
// This means two arrows appear. We should only show "3-4".

const ARROW_RULES_FIXED = {
  all:    ['1-2', '2-3', '3-4', '4-5', '5-6'],
  flow:   [],
  design: ['3-4'],   // arrow right after step3; step4 is hidden so it visually connects to step5
  result: []
};

const tabBtns = document.querySelectorAll('.tab-btn');
const stepCards = document.querySelectorAll('.step-card');
const arrows = document.querySelectorAll('.step-arrow-down');

function applyTab(tabId) {
  // Update active tab button
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));

  // Show/hide cards
  stepCards.forEach(card => {
    const tabs = card.dataset.tabs ? card.dataset.tabs.split(' ') : [];
    const show = tabId === 'all' || tabs.includes(tabId);
    card.classList.toggle('hidden', !show);
  });

  // Apply arrow rules
  const allowed = ARROW_RULES_FIXED[tabId] || [];
  arrows.forEach(a => {
    const between = a.dataset.between || '';
    if (allowed.includes(between)) {
      a.classList.remove('hidden');
    } else {
      a.classList.add('hidden');
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
