// --- custom cursor (disabled on touch devices) ---
const cursor = document.getElementById('custom-cursor');

const isTouchDevice =
  window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
  ('ontouchstart' in window) ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

if (isTouchDevice) {
  document.documentElement.classList.add('is-touch');
  if (cursor) cursor.style.display = 'none';
} else if (cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

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

// --- tight masonry span calculation ---
function computeMasonrySpans() {
  const containers = document.querySelectorAll('.masonry, .masonry-video');
  containers.forEach((container) => {
    const styles = getComputedStyle(container);
    const rowHeight = parseFloat(styles.getPropertyValue('grid-auto-rows')) || 1;
    // gap can be single value or row/col; parse first number
    const gapValue = styles.getPropertyValue('gap') || styles.getPropertyValue('grid-row-gap') || '0';
    const gap = parseFloat(gapValue) || 0;

    container.querySelectorAll('.masonry-item').forEach((item) => {
      // reset so we measure natural height
      item.style.gridRowEnd = null;
      const itemHeight = item.getBoundingClientRect().height;
      // compute span: account for gaps between rows
      const span = Math.max(1, Math.ceil((itemHeight + gap) / (rowHeight + gap)));
      item.style.gridRowEnd = `span ${span}`;
    });
  });
}

function bindMasonryMedia() {
  // images
  document.querySelectorAll('.masonry-item img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', computeMasonrySpans, { once: true });
    img.addEventListener('error', computeMasonrySpans, { once: true });
  });

  // videos
  document.querySelectorAll('.masonry-item video').forEach((video) => {
    const ready = () => computeMasonrySpans();
    if (video.readyState >= 1) {
      // metadata loaded
      computeMasonrySpans();
    } else {
      video.addEventListener('loadedmetadata', ready, { once: true });
      video.addEventListener('loadeddata', ready, { once: true });
    }
  });
}

window.addEventListener('load', () => {
  computeMasonrySpans();
  bindMasonryMedia();
});
window.addEventListener('resize', () => {
  // debounce small resize bursts
  clearTimeout(window.__masonryResizeTimeout);
  window.__masonryResizeTimeout = setTimeout(computeMasonrySpans, 120);
});