// --- enforce custom cursor globally ---
document.documentElement.style.cursor = 'none';

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
const originalOrder = Array.from(caseCards);

const filterOrders = {
  'all': [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
  'ux': [4,13,14,8,2,1],
  'graphic-design': [6,10,7,0,3,2,4,13,14,5,9,11,12,15],
  'web-dev': [13,4,14],
  'print': [12,15,5,9,11],
  'exhibits': [11,0,3]
};

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    caseCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      card.style.display =
        filter === 'all' || categories.includes(filter) ? 'block' : 'none';
    });

    const container = document.querySelector('.cards');
    const indices = filterOrders[filter] || Array.from({length: 16}, (_, i) => i);
    const visibleSet = new Set(indices);

    const orderedVisibleCards = indices.map(idx => originalOrder[idx]);
    const hiddenCards = originalOrder.filter((_, idx) => !visibleSet.has(idx));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    hiddenCards.forEach((card) => container.appendChild(card));
    orderedVisibleCards.forEach((card) => container.appendChild(card));
  });
});

// --- case study detail view (overlay) ---
const overlay = document.getElementById('overlay');
const overlayImage = document.getElementById('overlay-image');
const overlayTitle = document.getElementById('overlay-title');
const overlayTags = document.getElementById('overlay-tags');
const overlayDesc = document.getElementById('overlay-desc');
const overlayClose = document.getElementById('close-overlay');

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

document.querySelectorAll('.view-btn, .view-cs').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const card = e.currentTarget.closest('.case-card');
    if (!card) return;
    openOverlayFromCard(card);
  });
});

if (overlayClose) {
  overlayClose.addEventListener('click', () => {
    if (!overlay) return;
    overlay.style.display = 'none';
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  });
}

// --- mobile menu toggle + close ---
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
    const gapValue = styles.getPropertyValue('gap') || styles.getPropertyValue('grid-row-gap') || '0';
    const gap = parseFloat(gapValue) || 0;

    container.querySelectorAll('.masonry-item').forEach((item) => {
      item.style.gridRowEnd = null;
      const itemHeight = item.getBoundingClientRect().height;
      const span = Math.max(1, Math.ceil((itemHeight + gap) / (rowHeight + gap)));
      item.style.gridRowEnd = `span ${span}`;
    });
  });
}

function bindMasonryMedia() {
  document.querySelectorAll('.masonry-item img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', computeMasonrySpans, { once: true });
    img.addEventListener('error', computeMasonrySpans, { once: true });
  });

  document.querySelectorAll('.masonry-item video').forEach((video) => {
    const ready = () => computeMasonrySpans();
    if (video.readyState >= 1) {
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
  clearTimeout(window.__masonryResizeTimeout);
  window.__masonryResizeTimeout = setTimeout(computeMasonrySpans, 120);
});

// --- global lightbox for all .masonry images ---
(function() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightboxImg = lightbox.querySelector('img');

  function bindLightbox() {
    document.querySelectorAll('.masonry img').forEach((img) => {
      if (img.dataset.lightboxBound) return;
      img.dataset.lightboxBound = true;

      img.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default cursor effect
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      });
    });
  }

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  });

  window.addEventListener('load', bindLightbox);
  window.addEventListener('resize', bindLightbox);
})();