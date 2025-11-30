// --- custom cursor ---
const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
  if (!cursor) return;
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// --- clock (desktop only) ---
function startClock() {
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour12: false });
    const desktopClock = document.getElementById('clock');
    if (desktopClock) desktopClock.textContent = time;
  }
  updateClock();
  setInterval(updateClock, 1000);
}
startClock();

// --- filtering case cards ---
const filterButtons = document.querySelectorAll('.filter-btn');
const caseCards = document.querySelectorAll('.case-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // remove active state from all
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    caseCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      card.style.display =
        filter === 'all' || categories.includes(filter) ? 'block' : 'none';
    });
  });
});

// --- case study detail view (overlay) ---
const overlay = document.getElementById('overlay');
const overlayImage = document.getElementById('overlay-image');
const overlayTitle = document.getElementById('overlay-title');
const overlayTags = document.getElementById('overlay-tags');
const overlayDesc = document.getElementById('overlay-desc');
const overlayClose = document.getElementById('close-overlay');

// Open overlay from a card (support .view-btn and .view-cs)
function openOverlayFromCard(card) {
  const img = card.querySelector('img');
  const captionP = card.querySelector('.caption > p');
  const tagsEl = card.querySelector('.tags');
  const descEl = card.querySelector('.desc');

  if (img && overlayImage) overlayImage.src = img.src;
  if (captionP && overlayTitle) overlayTitle.textContent = captionP.textContent;
  if (tagsEl && overlayTags) overlayTags.textContent = tagsEl.textContent;
  if (descEl && overlayDesc) overlayDesc.textContent = descEl.textContent;

  if (overlay) {
    overlay.style.display = 'flex';
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
  }
}

// Attach to possible trigger buttons (view-btn, view-cs)
document.querySelectorAll('.view-btn, .view-cs').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const card = e.currentTarget.closest('.case-card');
    if (!card) return;
    openOverlayFromCard(card);
  });
});

// Close overlay
if (overlayClose) {
  overlayClose.addEventListener('click', () => {
    if (!overlay) return;
    overlay.style.display = 'none';
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  });
}

// --- mobile menu toggle + close (left-aligned, same position/size) ---
const menuToggle = document.querySelector('.mobile-menu-toggle');
const leftSidebar = document.querySelector('.sidebar');
const closeMenuButton = document.querySelector('.close-menu');

function setMenuOpen(open) {
  if (!leftSidebar || !menuToggle) return;
  leftSidebar.classList.toggle('menu-open', open);
  document.documentElement.classList.toggle('no-scroll', open);
  document.body.classList.toggle('no-scroll', open);
  menuToggle.textContent = open ? '✕' : '↦';
}

if (menuToggle && leftSidebar) {
  menuToggle.addEventListener('click', () => {
    const isOpen = leftSidebar.classList.contains('menu-open');
    setMenuOpen(!isOpen);
  });
}

if (closeMenuButton) {
  closeMenuButton.addEventListener('click', () => {
    setMenuOpen(false);
  });
}