/* mary wil design - portfolio scripts */

/* ------------------------------------------------------------------
   shared helpers - used by the home page AND every project page
------------------------------------------------------------------ */

// Site root = the folder script.js itself was loaded from. Every link
// below is built from this, so pages behave the same no matter how deep
// they are or which folder Live Server / your host treats as its root.
const SITE_ROOT = (function () {
  const src = document.currentScript && document.currentScript.src;
  return new URL('.', src || window.location.href);
})();

// 'kogl/' or '/kogl/'  ->  absolute URL under the site root
function siteUrl(path) {
  return new URL(String(path).replace(/^\//, ''), SITE_ROOT).href;
}

// Run once the DOM is ready AND deferred scripts (projects.js) have run,
// even if a page loads script.js at the end of <body> without `defer`.
function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

// The clock and the breadcrumb share one row on every project view, so the
// page's own <span class="breadcrumb"> is moved into the topbar. The home
// slide-in builds its breadcrumb inside the topbar already
// (see addBreadcrumbToCaseView); this covers the standalone project pages.
function placeBreadcrumbInTopbar(root) {
  const scope = root || document;
  const topbar = scope.querySelector('.topbar');
  const crumb = scope.querySelector('.breadcrumb');
  if (!topbar || !crumb || topbar.contains(crumb)) return;
  const clock = topbar.querySelector('.clock');
  if (clock) {
    topbar.insertBefore(crumb, clock);
  } else {
    topbar.appendChild(crumb);
  }
}

// Tags live in projects.js so a project's home card and its case study header
// always show the same set. Fills every .tags wrapper inside `root`.
function renderProjectTags(root, tags) {
  if (!root || !tags || !tags.length) return;
  root.querySelectorAll('.tags').forEach((wrap) => {
    wrap.innerHTML = '';
    tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      wrap.appendChild(span);
    });
  });
}

// The snapshot bar (year / role / credits / links) comes from projects.js too,
// so every project page shows the same groups in the same order. A group with
// nothing in it is left out rather than rendered empty.
function renderProjectMeta(root, meta) {
  if (!root || !meta) return;
  root.querySelectorAll('.snapshot-box').forEach((box) => {
    box.innerHTML = '';
    const groups = [
      ['Year', meta.year ? [meta.year] : []],
      ['Role', meta.role ? [meta.role] : []],
      ['Credits', meta.credits || []],
      ['Links', meta.links || []]
    ];
    groups.forEach((entry) => {
      const label = entry[0];
      const values = entry[1];
      if (!values.length) return;

      const group = document.createElement('div');
      group.className = 'snapshot-group';

      const heading = document.createElement('h4');
      heading.textContent = label;
      group.appendChild(heading);

      values.forEach((value) => {
        const line = document.createElement('p');
        if (typeof value === 'string') {
          line.textContent = value;
        } else {
          const link = document.createElement('a');
          link.href = value.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = value.label;
          line.appendChild(link);
        }
        group.appendChild(line);
      });

      box.appendChild(group);
    });
  });
}

// The tag row wraps in line with the heading: the title's text width is
// measured and the tags are capped to it, so they break near where the title
// ends instead of running the full column width. The title is set in a
// fixed-size display face, so the measurement holds at any viewport width.
function syncTagRowWidth(root) {
  (root || document).querySelectorAll('.case-header-text').forEach((block) => {
    const heading = block.querySelector('h2');
    const tags = block.querySelector('.tags');
    if (!heading || !tags) return;
    const range = document.createRange();
    range.selectNodeContents(heading);
    const width = Math.ceil(range.getBoundingClientRect().width);
    if (width > 0) tags.style.maxWidth = width + 'px';
  });
}

// Which project is this page? <body data-project="kogl"> is the source of
// truth; falls back to matching the folder name in the URL path.
function getCurrentProject() {
  const projects = window.portfolioProjects || [];
  const id = document.body && document.body.dataset.project;
  if (id) return projects.find((p) => p.id === id) || null;
  const segments = window.location.pathname.split('/').filter(Boolean);
  return projects.find((p) => segments.includes(p.href.replace(/^\/|\/$/g, ''))) || null;
}

// THE project-view sidebar (name header + project list). Used by the
// home page slide-in AND by standalone project pages, so both are identical.
//   onNavigate(project) -> optional; intercepts clicks (home-page slide-in)
//                          leave undefined for normal page navigation
function renderProjectSidebar(sidebar, currentId, onNavigate) {
  const projects = window.portfolioProjects || [];
  const name = (window.siteProfile && window.siteProfile.name) || 'Mary G. Wilson';

  const nav = document.createElement('nav');
  nav.className = 'project-view-links';
  nav.setAttribute('aria-label', 'Projects');

  projects.forEach((project) => {
    const link = document.createElement('a');
    link.href = siteUrl(project.href);
    link.textContent = project.title;
    const isCurrent = project.id === currentId;
    link.className = isCurrent ? 'active' : '';
    if (isCurrent) link.setAttribute('aria-current', 'page');
    if (onNavigate) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        onNavigate(project);
      });
    }
    nav.appendChild(link);
  });

  const closeButton = document.createElement('button');
  closeButton.className = 'sidebar-close';
  closeButton.id = 'sidebar-close';
  closeButton.setAttribute('aria-label', 'Close menu');
  closeButton.textContent = '✕';

  const profile = document.createElement('div');
  profile.className = 'sidebar-top';
  const homeLink = document.createElement('a');
  homeLink.href = siteUrl('index.html');
  homeLink.className = 'project-view-home-link';
  homeLink.textContent = name;
  profile.append(homeLink);

  const header = document.createElement('div');
  header.className = 'project-view-header';
  header.append(closeButton, profile);

  sidebar.innerHTML = '';
  sidebar.append(header, nav);
}

// declared up here (not next to bindMobileMenu) so onReady callbacks that
// call bindMobileMenu() can never hit a "used before initialised" error
let menuBound = false;

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
    // the dot is the site blue, which reads on the white page and on the white
    // panel alike, so it is placed and left alone. It used to flip colour over
    // the left panel, which was blue until 2026-09-22; that panel is white
    // again, so the flip, its cached panel rect and the .on-panel class are all
    // gone. (The rect was cached rather than measured per move, because reading
    // a rect forces layout.)
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }
})();

// clock - always Mary's time in Oslo, never the visitor's. The zone
// abbreviation beside the time is the conventional way to say whose clock
// this is, and the daypart adds a little character.
const CLOCK_TZ = 'Europe/Oslo';
const clockTimeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: CLOCK_TZ,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
});
const clockDayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: CLOCK_TZ, weekday: 'short' });

// each entry starts at that minute of the Oslo day; the last one runs through
// midnight and the 0 entry picks up again after it. Every glyph is an Egyptian
// hieroglyph (U+13000 block) - figures at work, at rest and at play.
const DAYPARTS = [
  { at: 0, glyph: '\u{1303F}', status: 'recharging' },
  { at: 8 * 60 + 30, glyph: '\u{13029}', status: 'coffee' },
  { at: 9 * 60 + 30, glyph: '\u{13028}', status: 'deep work' },
  { at: 12 * 60, glyph: '\u{13007}', status: 'lunch' },
  { at: 13 * 60, glyph: '\u{13005}', status: 'in the zone' },
  { at: 17 * 60, glyph: '\u{13009}', status: 'chilling' }
];

// from Friday 17:00 until Monday 08:30 the week pattern doesn't apply at all.
// Four poses to choose between, picked once when the weekend starts rather
// than once a minute, which would flicker.
const AFK_GLYPHS = ['\u{13024}', '\u{13022}', '\u{13020}', '\u{13021}'];
const AFK_STATUS = 'off the clock';
let afkGlyph = '';

function isWeekend(weekday, minutes) {
  if (weekday === 'Sat' || weekday === 'Sun') return true;
  if (weekday === 'Fri') return minutes >= 17 * 60;
  if (weekday === 'Mon') return minutes < 8 * 60 + 30;
  return false;
}

function dayPart(minutes) {
  return DAYPARTS.reduce((found, part) => (minutes >= part.at ? part : found), DAYPARTS[0]);
}

let clockInterval = null;
function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  if (clockInterval) clearInterval(clockInterval);

  if (!el.firstChild) {
    el.innerHTML =
      '<span class="clock-glyph" aria-hidden="true"></span>' +
      '<span class="clock-time"></span>' +
      '<span class="clock-status"></span>';
  }
  const glyphEl = el.querySelector('.clock-glyph');
  const timeEl = el.querySelector('.clock-time');
  const statusEl = el.querySelector('.clock-status');

  // only write when the text actually changes: the clock shares its row with
  // the breadcrumb, so pointless writes shuffle the layout about
  const set = (node, text) => { if (node.textContent !== text) node.textContent = text; };

  el.title = "Mary's local time in Oslo, not yours";

  const tick = () => {
    const now = new Date();
    const time = clockTimeFmt.format(now); // HH:MM, Oslo
    const weekday = clockDayFmt.format(now); // Mon…Sun, Oslo

    // nothing changes inside a minute, so only touch the DOM when it does
    const key = weekday + ' ' + time;
    if (el.dataset.key !== key) {
      el.dataset.key = key;
      set(timeEl, time);

      const [hours, minutes] = time.split(':').map(Number);
      const mins = hours * 60 + minutes;
      if (isWeekend(weekday, mins)) {
        if (!afkGlyph) afkGlyph = AFK_GLYPHS[Math.floor(Math.random() * AFK_GLYPHS.length)];
        set(glyphEl, afkGlyph);
        set(statusEl, AFK_STATUS);
      } else {
        afkGlyph = '';
        const part = dayPart(mins);
        set(glyphEl, part.glyph);
        set(statusEl, part.status);
      }
    }
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
  let lastActiveFilter = 'all';
  const sidebar = document.getElementById('sidebar');
  const originalSidebarContent = sidebar ? sidebar.innerHTML : '';
  const projects = window.portfolioProjects || [];
  const projectTitles = Object.fromEntries(projects.map((project) => [project.id, project.title]));

  projects.forEach((project) => {
    const card = document.querySelector(`.case-card[data-id="${project.id}"]`);
    if (!card) return;
    const title = card.querySelector('.card-title');
    if (title) title.textContent = project.title;
    card.dataset.href = siteUrl(project.href);
    card.dataset.category = project.category;
    renderProjectTags(card, project.tags);
  });

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
    if (sidebar) sidebar.innerHTML = originalSidebarContent;
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

  function showProjectNav(currentId) {
    if (!sidebar) return;
    // same sidebar every project page builds for itself; here, clicks slide in
    renderProjectSidebar(sidebar, currentId, (project) => {
      loadCaseStudy(siteUrl(project.href), project.title, project.category, lastActiveFilter, project.id);
    });
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

    // build: <span class="breadcrumb">All / Project</span>
    const container = document.createElement('span');
    container.id = 'dynamic-breadcrumb';
    container.className = 'breadcrumb';

    const link1 = document.createElement('a');
    link1.href = '#';
    link1.textContent = 'All';
    link1.addEventListener('click', function(e) {
      e.preventDefault();
      showGrid();
    });

    const current = document.createElement('span');
    current.className = 'breadcrumb-current';
    current.textContent = title;

    container.appendChild(link1);
    container.appendChild(document.createTextNode(' / '));
    container.appendChild(current);

    // share the clock's row so the breadcrumb lines up with it
    const topbar = wrapper.querySelector('.topbar');
    const clock = topbar ? topbar.querySelector('.clock') : null;
    if (topbar && clock) {
      topbar.insertBefore(container, clock);
    } else if (topbar) {
      topbar.appendChild(container);
    } else {
      const header = wrapper.querySelector('.case-header-grid');
      if (header) {
        wrapper.insertBefore(container, header);
      } else {
        wrapper.prepend(container);
      }
    }
  }

  async function loadCaseStudy(url, cardTitle, cardCategory, activeFilter, cardId) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const caseContent = doc.querySelector('.content');
      if (!caseContent) return;

      saveGrid();
      showProjectNav(cardId);

      const wrapper = document.createElement('div');
      wrapper.className = 'case-study-view';
      wrapper.innerHTML = caseContent.innerHTML;
      const loadedTitle = wrapper.querySelector('.case-header-text h2');
      if (loadedTitle && projectTitles[cardId]) {
        loadedTitle.textContent = projectTitles[cardId];
      }

      content.innerHTML = '';
      content.appendChild(wrapper);
      content.scrollTop = 0;
      window.scrollTo(0, 0);

      // prev/next + back to top at the base of the slid-in project: same
      // markup as a standalone page, but it slides between projects
      initProjectFooterNav(wrapper, cardId, (nextProject) => {
        loadCaseStudy(siteUrl(nextProject.href), nextProject.title, nextProject.category, lastActiveFilter, nextProject.id);
      });

      // breadcrumb, placed on the clock's row inside the topbar
      if (cardTitle) {
        addBreadcrumbToCaseView(cardCategory, cardTitle, activeFilter);
      }

      // tags for the slid-in project, from projects.js
      const loadedProject = projects.find((p) => p.id === cardId);
      if (loadedProject) {
        renderProjectTags(wrapper, loadedProject.tags);
        renderProjectMeta(wrapper, loadedProject.meta);
      }
      syncTagRowWidth(wrapper);
      document.fonts.ready.then(() => syncTagRowWidth(wrapper));

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
        lastActiveFilter = activeFilter;
        loadCaseStudy(card.dataset.href, title, card.dataset.category, activeFilter, card.dataset.id);
      });
    });
  }

  bindCards();
})();

// standalone project pages (direct load, refresh, Live Server on a subpage)
// Builds the SAME sidebar the home-page slide-in shows, from projects.js.
onReady(function () {
  if (!document.body.classList.contains('case-page')) return;

  const project = getCurrentProject();
  if (!project) {
    console.warn('[portfolio] Could not tell which project this page is. ' +
      'Add data-project="<id>" to <body> (ids are listed in projects.js).');
    return;
  }

  const sidebar = document.getElementById('sidebar');
  if (sidebar) renderProjectSidebar(sidebar, project.id);   // plain links, normal navigation

  document.title = project.title;
  document.querySelectorAll('.case-header-text h2').forEach((heading) => {
    heading.textContent = project.title;
  });
  document.querySelectorAll('.breadcrumb-current').forEach((current) => {
    current.textContent = project.title;
  });

  renderProjectTags(document, project.tags);
  renderProjectMeta(document, project.meta);
  syncTagRowWidth(document);
  // the display face may still be swapping in, which changes the title width
  document.fonts.ready.then(() => syncTagRowWidth(document));

  // line the breadcrumb up with the clock
  placeBreadcrumbInTopbar(document);

  bindMobileMenu();   // the close button was just rebuilt
});

// sidebar-right (CV) - single source of truth: window.siteProfile.cv in
// projects.js. Fills <aside id="sidebar-right"> on the home page and on
// every project page, so the CV is only ever edited in one place.
onReady(function () {
  const el = document.getElementById('sidebar-right');
  if (!el) return;
  const cv = window.siteProfile && window.siteProfile.cv;
  if (!cv) {
    console.warn('[portfolio] window.siteProfile.cv is missing - is projects.js loading?');
    return;
  }

  function buildSection(title, items) {
    const wrap = document.createElement('div');
    wrap.className = 'cv-section';

    const heading = document.createElement('h4');
    heading.textContent = title;
    wrap.appendChild(heading);

    items.forEach((entry) => {
      const item = document.createElement('div');
      item.className = 'cv-item' + (entry.sub ? ' cv-subitem' : '');

      if (entry.role) {
        const role = document.createElement('span');
        role.className = 'cv-role';
        role.textContent = entry.role;
        item.appendChild(role);
      }

      const org = document.createElement('span');
      org.className = 'cv-org';
      org.textContent = entry.org;
      item.appendChild(org);

      if (entry.date) {
        const date = document.createElement('span');
        date.className = 'cv-date';
        date.textContent = entry.date;
        item.appendChild(date);
      }

      wrap.appendChild(item);
    });

    return wrap;
  }

  el.innerHTML = '';
  el.appendChild(buildSection('Experience', cv.experience));
  el.appendChild(buildSection('Education', cv.education));
  el.appendChild(buildSection('Exhibits', cv.exhibits));
});

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
      // 'all' keeps every project in the grid
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

  // default to ALL on load (matches the active button in the HTML)
  applyFilter('all');

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
      // carry the still across, so the full-size view opens on the poster rather
      // than on a black box while the video itself is still arriving
      if (el.poster) vid.poster = el.poster;
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

  // bind click - runs immediately if lightbox exists, otherwise on load
  if (document.getElementById('media-lightbox')) {
    bind();
  } else {
    window.addEventListener('load', bind);
  }
})();

// project navigation (prev/next) + back to top.
// order comes from projects.js - no second list to keep in sync.
// `scope` is the document on a standalone project page, or the injected
// .case-study-view wrapper when a project is opened from the home grid.
// onNavigate(project) intercepts prev/next (home slide-in); leave it
// undefined for normal page navigation.
function initProjectFooterNav(scope, projectId, onNavigate) {
  const nav = (scope || document).querySelector('#project-nav');
  if (!nav || !projectId) return;

  const projects = window.portfolioProjects || [];
  const current = projects.findIndex((p) => p.id === projectId);
  if (current === -1) return;

  // label each link with the project name - the part before the colon
  const name = (p) => p.title.split(':')[0].trim();
  nav.style.display = '';

  const prev = nav.querySelector('.nav-prev');
  const next = nav.querySelector('.nav-next');
  const top = nav.querySelector('.back-to-top');

  function bindLink(el, project, label) {
    if (!el) return;
    el.href = siteUrl(project.href);
    el.textContent = label;
    if (onNavigate) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        onNavigate(project);
      });
    }
  }

  // wrap around at both ends, so every project links to two others and the
  // prev/next loop never dead-ends
  const prevProject = projects[(current - 1 + projects.length) % projects.length];
  const nextProject = projects[(current + 1) % projects.length];
  bindLink(prev, prevProject, '← ' + name(prevProject));
  bindLink(next, nextProject, name(nextProject) + ' →');

  if (top) {
    top.addEventListener('click', () => {
      // desktop scrolls inside <main class="content">, mobile scrolls the window
      const scroller = nav.closest('.content') || document.getElementById('content');
      [scroller, document.scrollingElement].forEach((el) => {
        if (!el || el.scrollTop === 0) return;
        const from = el.scrollTop;
        el.scrollTo({ top: 0, behavior: 'smooth' });
        // some engines ignore smooth scrolling on a nested scroll container,
        // so make sure we actually land at the top
        setTimeout(() => {
          if (el.scrollTop === from) el.scrollTop = 0;
        }, 300);
      });
    });
  }
}

// standalone project pages (direct load / refresh)
onReady(function () {
  const project = getCurrentProject();
  if (project) initProjectFooterNav(document, project.id);
});

// media that waits to be looked at
// --------------------------------
// Two halves of the same idea: don't spend bytes on media nobody has looked at
// yet.
//
// Videos carry data-autoplay rather than the autoplay attribute, so the file is
// not fetched at load. They still start on their own, with nothing to click -
// just on coming into view instead of all at once. (autoplay + preload="none"
// would not help: autoplay forces the download regardless of the hint.)
//
// Images that have not decoded yet are held at zero opacity and faded in, so a
// slow one settles into place rather than appearing mid-layout. Only elements
// still loading are touched, so with JS off nothing is ever hidden - and an
// error reveals too, rather than leaving a hole where something is missing.
//
// Both are re-applied to anything injected later, since opening a project from
// the home grid swaps in new content.
(function () {
  const FADE = '.hero-image img, .sbs-item img,' +
               '.case-image img, .case-image-wide img';

  const play = (v) => {
    const started = v.play();
    if (started && started.catch) started.catch(() => {});   // autoplay refusal
  };

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) play(entry.target);
          else entry.target.pause();
        });
      }, { rootMargin: '150px 0px' })   // start just before it scrolls in
    : null;

  function apply(root) {
    root.querySelectorAll('video[data-autoplay]').forEach((video) => {
      if (video.dataset.mediaBound) return;
      video.dataset.mediaBound = 'true';
      observer ? observer.observe(video) : play(video);
    });

    root.querySelectorAll(FADE).forEach((img) => {
      if (img.dataset.mediaBound) return;
      img.dataset.mediaBound = 'true';
      if (img.complete) return;
      img.style.opacity = '0';
      const reveal = () => { img.style.opacity = ''; };
      img.addEventListener('load', reveal, { once: true });
      img.addEventListener('error', reveal, { once: true });
    });
  }

  function init() {
    apply(document);
    if (!('MutationObserver' in window)) return;
    new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) apply(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  onReady(init);
})();

// back to top on the home grid
// ----------------------------
// The case pages carry one in their footer nav; the home page is a long grid
// with no footer of its own to hold one. On a desktop the page scrolls inside
// <main class="content"> rather than the window, so both have to be watched or
// the button never appears.
(function () {
  const button = document.getElementById('to-top');
  if (!button) return;

  const pane = document.querySelector('.content') || document.getElementById('content');

  // Which element scrolls depends on the layout: on a desktop the page scrolls
  // inside <main class="content">, on a phone the window scrolls. Ask the pane
  // whether it actually overflows rather than testing the width, so this stays
  // in step with the stylesheet instead of duplicating its breakpoints.
  // (Using whichever is taller would be wrong: in the phone layout the pane is
  // the full height of its content, which would put the button a screen and a
  // half down the page.)
  const paneScrolls = () => !!pane && pane.scrollHeight > pane.clientHeight + 1;
  const scrolled = () => (paneScrolls() ? pane.scrollTop : window.scrollY || 0);
  const viewport = () => (paneScrolls() ? pane.clientHeight : window.innerHeight);

  const update = () => button.classList.toggle('is-visible', scrolled() > viewport() * 0.6);

  [window, pane].forEach((target) => {
    if (target) target.addEventListener('scroll', update, { passive: true });
  });
  window.addEventListener('resize', update);
  update();

  button.addEventListener('click', () => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = calm ? 'auto' : 'smooth';
    if (pane) pane.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
  });
})();
// analytics (Umami)
// Observation only. Nothing here changes an existing handler, and none of it sends
// anything unless the tracker itself loaded, which only happens on the live domain
// (see the data-domains attribute on the tag in each page head). So it is inert
// during local work.
//
// The events that matter most are the ones a pageview cannot see. The home page opens
// a project by fetching it and swapping the content in, with no navigation, so no
// pageview is recorded for it: case-study-open is the only trace of that.
(function () {
  const projects = () => window.portfolioProjects || [];

  function track(name, data) {
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track(name, data);
    }
  }

  const baseName = (path) => String(path || '').split('/').pop().split('?')[0];
  const tidy = (text) => String(text || '').replace(/[\u2190\u2192]/g, '').trim().slice(0, 40);

  // sidebar links carry a project href, cards carry data-id; match either back to
  // projects.js so the event names the project the way the site does
  function projectFromHref(href) {
    if (!href) return null;
    return projects().find((p) => {
      const slug = p.href.replace(/^\/|\/$/g, '');
      return slug && href.indexOf(slug) !== -1;
    }) || null;
  }

  // clicks are captured, so an event is still recorded when a handler stops
  // propagation or prevents the default
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || !target.closest) return;

    // leaving the site: the card links, the snapshot links, the press link
    const outbound = target.closest('a.ext-link, .snapshot-box a');
    if (outbound && outbound.href) {
      let host = '';
      try { host = new URL(outbound.href, location.href).hostname; } catch (err) { host = ''; }
      track('outbound', { label: tidy(outbound.textContent), to: host });
      return;
    }

    // one piece of media, and stepping through the lightbox
    const media = target.closest('.js-lightbox-item');
    if (media) {
      track('lightbox-open', {
        media: baseName(media.getAttribute('src') || media.getAttribute('poster'))
      });
      return;
    }
    const step = target.closest('#lightbox-prev, #lightbox-next');
    if (step) {
      track('lightbox-step', { direction: step.id === 'lightbox-next' ? 'next' : 'previous' });
      return;
    }

    // the home-page filter
    const filter = target.closest('.filter-btn');
    if (filter) {
      track('filter', { category: filter.dataset.filter || '' });
      return;
    }

    // prev / next at the foot of a project
    const nav = target.closest('#project-nav .nav-prev, #project-nav .nav-next');
    if (nav) {
      track('project-nav', {
        direction: nav.classList.contains('nav-prev') ? 'previous' : 'next',
        to: tidy(nav.textContent)
      });
      return;
    }

    // opening a project. Only the home page swaps content in place; on a project
    // page the same link is a real navigation and the pageview already covers it,
    // so firing here would double count.
    if (document.body && !document.body.classList.contains('case-page')) {
      const card = target.closest('.case-card');
      const sidebarLink = target.closest('#sidebar .project-view-links a');
      if (!card && !sidebarLink) return;
      const project = card
        ? projects().find((p) => p.id === card.dataset.id)
        : projectFromHref(sidebarLink.getAttribute('href'));
      track('case-study-open', {
        project: project ? project.title : 'unknown',
        from: card ? 'grid' : 'sidebar'
      });
    }
  }, true);

  // Time on page and scroll depth, counted per view. The home page changes view
  // without changing the URL, so a view is identified by the URL plus the project
  // heading rather than by a navigation event. That covers sliding into a project,
  // sliding on to another, and coming back to the grid, with nothing hooked.
  const DEPTHS = [25, 50, 75, 100];
  const MARKS = [30, 120];

  let view = '';
  let elapsed = 0;
  let depthSent = [];
  let markSent = {};

  function viewKey() {
    const heading = document.querySelector('.content .case-header-text h2');
    return location.pathname + '|' + (heading ? heading.textContent.trim() : 'grid');
  }

  function syncView() {
    const key = viewKey();
    if (key === view) return;
    view = key;
    elapsed = 0;
    depthSent = DEPTHS.map(() => false);
    markSent = {};
  }

  function percentRead() {
    const pane = document.querySelector('.content');
    if (pane && pane.scrollHeight > pane.clientHeight + 2) {
      return ((pane.scrollTop + pane.clientHeight) / pane.scrollHeight) * 100;
    }
    const doc = document.scrollingElement || document.documentElement;
    const total = Math.max(doc.scrollHeight, document.body.scrollHeight);
    return total ? ((window.scrollY + window.innerHeight) / total) * 100 : 100;
  }

  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      syncView();
      const read = percentRead();
      DEPTHS.forEach((depth, i) => {
        if (read >= depth && !depthSent[i]) {
          depthSent[i] = true;
          track('scroll-depth', { depth: depth });
        }
      });
    });
  }

  // desktop scrolls inside <main class="content">, phones scroll the window
  const pane = document.querySelector('.content');
  [window, pane].forEach((target) => {
    if (target) target.addEventListener('scroll', onScroll, { passive: true });
  });

  // a second counts only while the tab is actually being looked at
  syncView();
  const ticker = window.setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    syncView();
    elapsed += 1;
    MARKS.forEach((seconds) => {
      if (elapsed >= seconds && !markSent[seconds]) {
        markSent[seconds] = true;
        track('engaged', { seconds: seconds });
      }
    });
    if (MARKS.every((seconds) => markSent[seconds])) window.clearInterval(ticker);
  }, 1000);
})();