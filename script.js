/* mary wil design — portfolio scripts */

// custom cursor
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

// clock
let clockInterval = null;
function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  if (clockInterval) clearInterval(clockInterval);
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  };
  tick();
  clockInterval = setInterval(tick, 1000);
}
initClock();

// card click → slide-in case study
(function () {
  const content = document.getElementById('content');
  if (!content) return;

  // save original grid content for restoration
  let gridContent = null;
  let scrollPos = 0;

  function saveGrid() {
    if (!gridContent) {
      gridContent = content.innerHTML;
    }
    scrollPos = window.scrollY;
  }

  function showGrid() {
    if (!gridContent) return;
    content.innerHTML = gridContent;
    gridContent = null;
    window.scrollTo(0, scrollPos);
    // remove dynamic breadcrumb added by slide-in
    const db = document.getElementById('dynamic-breadcrumb');
    if (db) db.remove();
    bindCards();
    initClock();
    removeBackButtons();
    bindMobileMenu();
    if (window.rebindFilters) window.rebindFilters();
  }

  function getFilterDisplay(filter) {
    const map = {
      'all': 'all',
      'ux': 'ux',
      'graphic-design': 'graphic design',
      'web-dev': 'web dev',
      'print': 'print',
      'exhibits': 'exhibits',
      'personal-project': 'personal projects'
    };
    return map[filter] || filter;
  }

  function addBreadcrumbToCaseView(category, title, activeFilter) {
    // remove any existing breadcrumb from wrapper (fixes duplicate)
    const wrapper = document.querySelector('.case-study-view');
    if (!wrapper) return;
    wrapper.querySelectorAll('.breadcrumb').forEach(function(el) {
      if (el.id === 'dynamic-breadcrumb' || !el.closest('.sidebar')) {
        el.remove();
      }
    });

    const filterDisplay = getFilterDisplay(activeFilter);

    // build: <span class="breadcrumb">...</span>
    // links use showGrid() so the active filter is preserved on return
    const container = document.createElement('span');
    container.id = 'dynamic-breadcrumb';
    container.className = 'breadcrumb';

    const link1 = document.createElement('a');
    link1.href = '#';
    link1.textContent = 'projects';
    link1.addEventListener('click', function(e) {
      e.preventDefault();
      showGrid();
    });

    const link2 = document.createElement('a');
    link2.href = '#';
    link2.textContent = filterDisplay;
    link2.addEventListener('click', function(e) {
      e.preventDefault();
      showGrid();
    });

    const current = document.createElement('span');
    current.className = 'breadcrumb-current';
    current.textContent = title;

    container.appendChild(link1);
    container.appendChild(document.createTextNode(' / '));
    container.appendChild(link2);
    container.appendChild(document.createTextNode(' / '));
    container.appendChild(current);

    // insert right before the case-header-grid
    const header = wrapper.querySelector('.case-header-grid');
    if (header) {
      wrapper.insertBefore(container, header);
    } else {
      wrapper.prepend(container);
    }
  }

  async function loadCaseStudy(url, cardTitle, cardCategory, activeFilter) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const caseContent = doc.querySelector('.content');
      if (!caseContent) return;

      saveGrid();

      const wrapper = document.createElement('div');
      wrapper.className = 'case-study-view';
      wrapper.innerHTML = caseContent.innerHTML;

      content.innerHTML = '';
      content.appendChild(wrapper);
      content.scrollTop = 0;
      window.scrollTo(0, 0);

      // desktop breadcrumb above case header
      if (cardTitle) {
        addBreadcrumbToCaseView(cardCategory, cardTitle, activeFilter);
      }

      // mobile "projects" button in topbar (right side)
      document.querySelectorAll('.topbar-back').forEach(el => el.remove());
      const topbar = wrapper.querySelector('.topbar');
      if (topbar) {
        const projectsBtn = document.createElement('button');
        projectsBtn.className = 'topbar-back';
        projectsBtn.textContent = 'projects';
        projectsBtn.addEventListener('click', showGrid);
        topbar.appendChild(projectsBtn);
      }

      // mobile reorder: title → tags → snapshot → paragraph
      if (window.innerWidth <= 768) {
        const headerGrid = wrapper.querySelector('.case-header-grid');
        if (headerGrid) {
          const headerText = headerGrid.querySelector('.case-header-text');
          const snapshot = headerGrid.querySelector('.snapshot-box');
          const p = headerText ? headerText.querySelector('p:last-of-type') : null;
          if (headerText && snapshot && p) {
            // move snapshot right after header-text (which holds h2 + tags)
            headerGrid.insertBefore(snapshot, headerText.nextSibling);
            // move paragraph after snapshot
            headerGrid.insertBefore(p, snapshot.nextSibling);
          }
        }
      }

      // re-init clock + menu
      initClock();
      bindMobileMenu();
    } catch (e) {
      // fallback: navigate directly
      window.location.href = url;
    }
  }

  function removeBackButtons() {
    document.querySelectorAll('.topbar-back').forEach(el => el.remove());
  }

  function bindCards() {
    document.querySelectorAll('.case-card[data-href]').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button, .ext-link')) return;
        e.preventDefault();
        const titleEl = card.querySelector('.card-title');
        const title = titleEl ? titleEl.textContent.trim() : '';
        // capture the active filter before content is cleared
        const activeBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';
        loadCaseStudy(card.dataset.href, title, card.dataset.category, activeFilter);
      });
    });
  }

  bindCards();
})();

// filtering
(function () {
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function applyFilter(filter) {
    const cards = document.querySelectorAll('.case-card');
    const visible = [];

    cards.forEach((card) => {
      const cats = card.dataset.category ? card.dataset.category.split(' ') : [];
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);

      if (show) {
        visible.push(card);
      }
    });

    // randomize order - physically reorder DOM nodes
    const container = document.querySelector('.cards');
    if (!container) return;
    shuffle(visible);
    visible.forEach((card) => {
      container.appendChild(card);
    });

    // trigger entrance animation
    visible.forEach((card) => {
      card.classList.remove('card-animate');
      void card.offsetWidth;
      card.classList.add('card-animate');
    });

    // stagger delays
    visible.forEach((card, i) => {
      card.style.animationDelay = `${i * 40}ms`;
    });
  }

  function bindFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });
  }

  bindFilterButtons();

  // default to UX filter on load (matches active button in HTML)
  applyFilter('ux');

  // expose so showGrid() can re-bind and re-apply after restoring the DOM
  window.rebindFilters = function () {
    bindFilterButtons();
    // apply the filter matching the currently active button
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
      applyFilter(activeBtn.dataset.filter);
    }
  };
})();

// mobile menu
let menuBound = false;
function bindMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const close = document.getElementById('sidebar-close');
  const backdrop = document.getElementById('menu-backdrop');
  if (!toggle || !sidebar) return;

  // remove old listeners by cloning
  if (menuBound) {
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
  }

  const t = document.getElementById('menu-toggle');
  const s = document.getElementById('sidebar');
  const c = document.getElementById('sidebar-close');
  const b = document.getElementById('menu-backdrop');
  if (!t || !s) return;

  function openMenu() {
    s.classList.add('open');
    if (b) b.classList.add('visible');
    document.documentElement.classList.add('no-scroll');
  }

  function closeMenu() {
    s.classList.remove('open');
    if (b) b.classList.remove('visible');
    document.documentElement.classList.remove('no-scroll');
  }

  t.addEventListener('click', openMenu);
  if (c) c.addEventListener('click', closeMenu);
  if (b) b.addEventListener('click', closeMenu);
  menuBound = true;
}

document.addEventListener('keydown', (e) => {
  const sidebar = document.getElementById('sidebar');
  if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    const backdrop = document.getElementById('menu-backdrop');
    if (backdrop) backdrop.classList.remove('visible');
    document.documentElement.classList.remove('no-scroll');
  }
});

bindMobileMenu();

// masonry span calculation
(function () {
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

  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(computeMasonrySpans, 150);
  });
})();

// media lightbox (images + videos + carousel)
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
    } else if (el.tagName === 'VIDEO') {
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

  // bind click on lightbox items
  function bind() {
    getItems().forEach((el, i) => {
      if (el.dataset.lbBound) return;
      el.dataset.lbBound = 'true';

      el.addEventListener('click', () => open(i));
    });
  }

  // nav buttons
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

  // bind click — runs immediately if lightbox exists, otherwise on load
  if (document.getElementById('media-lightbox')) {
    bind();
  } else {
    window.addEventListener('load', bind);
  }
})();

// project navigation (prev/next) + back to top
(function () {
  const projectOrder = [
    'kogl', 'telus', 'modo', 'twotruths', 'postertriennial',
    'vancouverartgallery', 'ibm', 'subtext', 'risographposters',
    'friendsfest', 'speleo', 'blackbox', 'collaborativesentence',
    'papercut', 'wellflip', 'liveopencall', 'glyphscorrupted'
  ];

  const path = window.location.pathname.replace(/\/$/, '');
  const current = projectOrder.findIndex(p => path.endsWith('/' + p));

  if (current >= 0) {
    const nav = document.getElementById('project-nav');
    if (!nav) return;
    nav.style.display = 'flex';

    const prev = nav.querySelector('.nav-prev');
    const next = nav.querySelector('.nav-next');
    const top = nav.querySelector('.back-to-top');

    if (current > 0) {
      prev.href = '/' + projectOrder[current - 1] + '/';
      prev.textContent = '← ' + projectOrder[current - 1];
    } else {
      prev.style.visibility = 'hidden';
    }

    if (current < projectOrder.length - 1) {
      next.href = '/' + projectOrder[current + 1] + '/';
      next.textContent = projectOrder[current + 1] + ' →';
    } else {
      next.style.visibility = 'hidden';
    }

    top.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();