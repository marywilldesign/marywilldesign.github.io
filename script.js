/* ========================================
   Mary Wil Design – Portfolio Scripts
   ======================================== */

// ─── Custom Cursor ───
(function () {
  const cursor = document.getElementById('custom-cursor');
  const isTouch =
    window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;

  if (isTouch) {
    document.documentElement.classList.add('is-touch');
    if (cursor) cursor.style.display = 'none';
  } else if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }
})();

// ─── Clock ───
(function () {
  const el = document.getElementById('clock');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
})();

// ─── Card click → navigate ───
document.addEventListener('click', (e) => {
  const card = e.target.closest('.case-card[data-href]');
  if (!card) return;

  if (e.target.closest('a, button')) return;

  const url = card.dataset.href;
  if (url) window.location.href = url;
});

// ─── Filtering ───
(function () {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.case-card');
  if (!buttons.length || !cards.length) return;

  // Preferred display-order per filter (by data-id).
  // Cards not listed keep their natural order after the listed ones.
  const sortOrders = {
    ux: ['telus', 'modo', 'twotruths', 'ibm', 'creepers', 'blackbox', 'collaborative'],
    'graphic-design': [
      'postertriennial', 'subtext', 'risograph', 'speleo', 'friendsfest',
      'modo', 'twotruths', 'blackbox', 'collaborative', 'papercut',
      'wellflip', 'scannerartly', 'glyphscorrupted',
    ],
    'web-dev': ['twotruths', 'blackbox', 'collaborative'],
    print: ['risograph', 'friendsfest', 'wellflip', 'scannerartly', 'glyphscorrupted'],
    exhibits: ['postertriennial', 'risograph', 'creepers'],
    'personal-project': [
      'twotruths', 'blackbox', 'collaborative',
      'papercut', 'wellflip', 'scannerartly', 'glyphscorrupted',
    ],
  };

  function applyFilter(filter) {
    const order = sortOrders[filter] || null;
    let overflow = order ? order.length : 0;

    cards.forEach((card) => {
      const cats = card.dataset.category ? card.dataset.category.split(' ') : [];
      const visible = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !visible);

      if (visible) {
        // Determine visual order
        if (order) {
          const idx = order.indexOf(card.dataset.id);
          card.style.order = idx >= 0 ? idx : overflow++;
        } else {
          card.style.order = '';
        }

        // Trigger entrance animation
        card.classList.remove('card-animate');
        void card.offsetWidth; // force reflow
        card.classList.add('card-animate');
      }
    });

    // Stagger delays based on visual order
    const visible = Array.from(cards)
      .filter((c) => !c.classList.contains('hidden'))
      .sort((a, b) => (parseInt(a.style.order) || 0) - (parseInt(b.style.order) || 0));
    visible.forEach((card, i) => {
      card.style.animationDelay = `${i * 40}ms`;
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
})();

// ─── Mobile Menu ───
(function () {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const close = document.getElementById('sidebar-close');
  const backdrop = document.getElementById('menu-backdrop');
  if (!toggle || !sidebar) return;

  function openMenu() {
    sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('visible');
    document.documentElement.classList.add('no-scroll');
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
    document.documentElement.classList.remove('no-scroll');
  }

  toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
  });
})();

// ─── Masonry Span Calculation ───
function computeMasonrySpans() {
  document.querySelectorAll('.masonry').forEach((container) => {
    const styles = getComputedStyle(container);
    const rowH = parseFloat(styles.getPropertyValue('grid-auto-rows')) || 1;
    const gap =
      parseFloat(
        styles.getPropertyValue('gap') ||
          styles.getPropertyValue('grid-row-gap') ||
          '0'
      ) || 0;

    container.querySelectorAll('.masonry-item').forEach((item) => {
      item.style.gridRowEnd = '';
      const h = item.getBoundingClientRect().height;
      const span = Math.max(1, Math.ceil((h + gap) / (rowH + gap)));
      item.style.gridRowEnd = `span ${span}`;
    });
  });
}

function bindMasonryMedia() {
  document.querySelectorAll('.masonry-item img').forEach((img) => {
    if (!img.complete) {
      img.addEventListener('load', computeMasonrySpans, { once: true });
      img.addEventListener('error', computeMasonrySpans, { once: true });
    }
  });
  document.querySelectorAll('.masonry-item video').forEach((vid) => {
    if (vid.readyState >= 1) computeMasonrySpans();
    else vid.addEventListener('loadedmetadata', computeMasonrySpans, { once: true });
  });
}

window.addEventListener('load', () => {
  computeMasonrySpans();
  bindMasonryMedia();
});

let _masonryTimer;
window.addEventListener('resize', () => {
  clearTimeout(_masonryTimer);
  _masonryTimer = setTimeout(computeMasonrySpans, 150);
});

// ─── MEDIA LIGHTBOX (IMAGES + VIDEOS + CAROUSEL) ───
(function () {
  const lightbox = document.getElementById('media-lightbox');
  const content = document.getElementById('lightbox-content');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  const btnClose = document.getElementById('lightbox-close');

  if (!lightbox || !content) return;

  let items = [];
  let index = 0;

  function getItems() {
    return Array.from(document.querySelectorAll('.js-lightbox-item'));
  }

  function render() {
    const el = items[index];

    content.innerHTML = '';

    if (!el) return;

    if (el.tagName === 'IMG') {
      const img = document.createElement('img');
      img.src = el.src;
      content.appendChild(img);
    }

    if (el.tagName === 'VIDEO') {
      const vid = document.createElement('video');
      vid.src = el.src;
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      content.appendChild(vid);
    }
  }

  function open(i) {
    items = getItems();
    index = i;

    render();
    lightbox.classList.add('active');
  }

  function close() {
    lightbox.classList.remove('active');
    content.innerHTML = '';
  }

  function next() {
    if (!items.length) return;
    index = (index + 1) % items.length;
    render();
  }

  function prev() {
    if (!items.length) return;
    index = (index - 1 + items.length) % items.length;
    render();
  }

  // bind click
  function bind() {
    getItems().forEach((el, i) => {
      if (el.dataset.lbBound) return;
      el.dataset.lbBound = 'true';

      el.addEventListener('click', () => open(i));
    });
  }

  // nav
  btnNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    next();
  });

  btnPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    prev();
  });

  btnClose?.addEventListener('click', close);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  window.addEventListener('load', bind);
})();