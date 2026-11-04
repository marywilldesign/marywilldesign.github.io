/* mary wil design portfolio scripts */

// shared helpers for the home page and project pages

// site root, taken from where script.js loaded
const SITE_ROOT = (function () {
  const src = document.currentScript && document.currentScript.src;
  return new URL('.', src || window.location.href);
})();

// turn a site path into a full url
function siteUrl(path) {
  return new URL(String(path).replace(/^\//, ''), SITE_ROOT).href;
}

// swap a broken video for its poster image
function fallBackToStill(media) {
  const poster = media.getAttribute('poster');
  if (!poster) return null;

  const still = document.createElement('img');
  still.src = poster;
  still.alt = media.getAttribute('alt') || '';
  if (media.className) still.className = media.className;

  // remove the still if it fails too
  still.addEventListener('error', () => still.remove(), { once: true });

  media.replaceWith(still);
  // tell the lightbox to bind the new still
  document.dispatchEvent(new CustomEvent('media-fallback', { detail: still }));
  return still;
}

// resume file name
const RESUME_FILE = 'mary-wilson-resume.pdf';

function buildDownloadLink() {
  const link = document.createElement('a');
  link.className = 'download-link';
  link.href = siteUrl(RESUME_FILE);
  // set the file name for the download
  link.download = RESUME_FILE;
  link.append('download resume.pdf ');
  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  link.appendChild(arrow);
  return link;
}

// run fn once the dom is ready
function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

// check if the visitor is on ios
function isIOS() {
  return /iP(hone|ad|od)/.test(navigator.userAgent) ||
    // ipads that report as a mac
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}

// fetch the resume once and reuse it
let resumeRequest = null;
function fetchedResume() {
  if (!resumeRequest) {
    resumeRequest = fetch(siteUrl(RESUME_FILE))
      .then((res) => {
        if (!res.ok) throw new Error('resume: HTTP ' + res.status);
        return res.blob();
      })
      .catch((err) => {
        // clear the cache so the next tap retries
        resumeRequest = null;
        throw err;
      });
  }
  return resumeRequest;
}

function saveResumeToFile(event) {
  event.preventDefault();
  fetchedResume().then((blob) => {
    const objectUrl = URL.createObjectURL(blob);
    const saver = document.createElement('a');
    saver.href = objectUrl;
    saver.download = RESUME_FILE;
    document.body.appendChild(saver);
    saver.click();
    saver.remove();
    // revoke the blob url after a minute
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  }).catch(() => {
    // on failure, just open the resume link
    window.location.href = siteUrl(RESUME_FILE);
  });
}

// save the resume as a file on ios
onReady(function () {
  if (!isIOS()) return;
  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('.download-link');
    if (link) saveResumeToFile(event);
  }, true);
});

// move the breadcrumb into the topbar
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

// fill the tag rows from projects.js
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

// combine a project's tags and tool names
function projectTagList(project) {
  const tools = (project.tools || []).map((tool) => tool.name.toLowerCase());
  return (project.tags || []).concat(tools);
}

// build the tools list on a project page
function renderProjectTools(root, tools) {
  if (!root || !tools || !tools.length) return;
  root.querySelectorAll('.case-tools').forEach((box) => {
    box.innerHTML = '';
    const list = document.createElement('dl');
    list.className = 'tool-list';
    tools.forEach((tool) => {
      const row = document.createElement('div');
      row.className = 'tool-row';
      const name = document.createElement('dt');
      name.textContent = tool.name;
      const use = document.createElement('dd');
      use.textContent = tool.use;
      row.append(name, use);
      list.appendChild(row);
    });
    box.appendChild(list);
  });
}

// build the snapshot bar from projects.js
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

// cap the tag row to the title width
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

// find which project this page is
function getCurrentProject() {
  const projects = window.portfolioProjects || [];
  const id = document.body && document.body.dataset.project;
  if (id) return projects.find((p) => p.id === id) || null;
  const segments = window.location.pathname.split('/').filter(Boolean);
  return projects.find((p) => segments.includes(p.href.replace(/^\/|\/$/g, ''))) || null;
}

// build the project sidebar
function renderProjectSidebar(sidebar, currentId, onNavigate) {
  const projects = window.portfolioProjects || [];
  const name = (window.siteProfile && window.siteProfile.name) || 'Mary G. Wilson';

  const nav = document.createElement('nav');
  nav.className = 'project-view-links';
  nav.setAttribute('aria-label', 'Projects');

  projects.forEach((project) => {
    const link = document.createElement('a');
    link.href = siteUrl(project.href);
    // use the short title if there is one
    link.textContent = project.shortTitle || project.title;
    const isCurrent = project.id === currentId;
    link.className = isCurrent ? 'active' : '';
    if (isCurrent) link.setAttribute('aria-current', 'page');
    if (onNavigate) {
      link.addEventListener('click', (e) => {
        // let modified clicks open normally
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
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
  // link home to the site root
  homeLink.href = siteUrl('./');
  homeLink.className = 'project-view-home-link';
  homeLink.textContent = name;
  profile.append(homeLink);

  const header = document.createElement('div');
  header.className = 'project-view-header';
  header.append(closeButton, profile);

  sidebar.innerHTML = '';
  sidebar.append(header, nav);
}

// screens wide enough for the two-panel layout (desktop and tablet)
const WIDE_QUERY = '(min-width: 768px)';
const HOME_TITLE = 'Mary Wilson Portfolio';
const ABOUT_TITLE = 'About – Mary G. Wilson';

// send an event to umami if it has loaded
function trackEvent(name, data) {
  if (window.umami && typeof window.umami.track === 'function') {
    window.umami.track(name, data);
  }
}

// make relative src, href and poster links absolute against base
function absolutizeUrls(root, base) {
  root.querySelectorAll('[src], [href], [poster]').forEach((el) => {
    ['src', 'href', 'poster'].forEach((attr) => {
      const value = el.getAttribute(attr);
      if (!value || /^(#|mailto:|tel:|data:|javascript:)/i.test(value)) return;
      try {
        el.setAttribute(attr, new URL(value, base).href);
      } catch (err) {
        /* leave a link we cannot parse as it is */
      }
    });
  });
}

// swap a standalone page's body for the home page's, keeping the url
async function swapInHomeShell() {
  const homeUrl = siteUrl('./');
  const res = await fetch(homeUrl);
  if (!res.ok) throw new Error('home: HTTP ' + res.status);
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
  if (!doc.getElementById('grid-view')) throw new Error('home page has no grid view');
  doc.body.querySelectorAll('script').forEach((script) => script.remove());
  absolutizeUrls(doc.body, homeUrl);
  document.body.className = doc.body.className;
  delete document.body.dataset.project;
  document.body.innerHTML = doc.body.innerHTML;
}

// on wide screens, a direct visit to a case study or about opens it on the home layout
async function boot() {
  const body = document.body;
  const standalone = body.classList.contains('case-page') || body.classList.contains('about-page');
  let initial = null;

  if (standalone && window.matchMedia(WIDE_QUERY).matches) {
    const project = body.classList.contains('case-page') ? getCurrentProject() : null;
    const wanted = body.classList.contains('about-page') ? { about: true }
      : (project ? { project: project.id } : null);
    if (wanted) {
      try {
        await swapInHomeShell();
        initial = wanted;
      } catch (err) {
        console.warn('[portfolio] Could not load the home layout, showing this page on its own.', err);
      }
    }
  } else if (!standalone && window.location.hash === '#about') {
    // old #about links
    initial = { about: true, fromHash: true };
  }

  const opened = startSite(initial);
  const reveal = () => document.documentElement.classList.remove('boot-home');
  Promise.resolve(opened).then(reveal, reveal);
}

// everything that touches the page, run once the right body is in place
function startSite(initial) {
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
    // move the cursor dot with the mouse
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }
})();

// clock showing oslo time
const CLOCK_TZ = 'Europe/Oslo';
const clockTimeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: CLOCK_TZ,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
});
const clockDayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: CLOCK_TZ, weekday: 'short' });

// status glyphs for each part of the day
const DAYPARTS = [
  { at: 0, glyph: '\u{1303F}', status: 'recharging' },
  { at: 8 * 60 + 30, glyph: '\u{13029}', status: 'coffee' },
  { at: 9 * 60 + 30, glyph: '\u{13028}', status: 'deep work' },
  { at: 12 * 60, glyph: '\u{13007}', status: 'lunch' },
  { at: 13 * 60, glyph: '\u{13005}', status: 'in the zone' },
  { at: 17 * 60, glyph: '\u{13009}', status: 'chilling' }
];

// weekend glyphs and status
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
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
  const el = document.getElementById('clock');
  if (!el) return;

  if (!el.firstChild) {
    el.innerHTML =
      '<span class="clock-glyph" aria-hidden="true"></span>' +
      '<span class="clock-time"></span>' +
      '<span class="clock-status"></span>';
  }
  const glyphEl = el.querySelector('.clock-glyph');
  const timeEl = el.querySelector('.clock-time');
  const statusEl = el.querySelector('.clock-status');

  // only update text when it changes
  const set = (node, text) => { if (node.textContent !== text) node.textContent = text; };

  el.title = "Mary's local time in Oslo, not yours";

  const tick = () => {
    const now = new Date();
    const time = clockTimeFmt.format(now); // hh:mm
    const weekday = clockDayFmt.format(now); // weekday

    // update only when the minute changes
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

// home: a card opens its case study in the left panel on wide screens,
// or in place of the grid on phones
function initHome(initial) {
  const layout = document.querySelector('.layout');
  const content = document.getElementById('content');
  const gridView = document.getElementById('grid-view');
  const panelView = document.getElementById('panel-view');
  const panelProjects = document.getElementById('panel-projects');
  const sidebar = document.getElementById('sidebar');
  const pill = document.getElementById('view-pill');
  const aboutTemplate = document.getElementById('about-template');
  if (!layout || !content || !gridView || !panelView || !sidebar) return null;

  const wide = window.matchMedia(WIDE_QUERY);
  const isTouch = () => document.documentElement.classList.contains('is-touch');
  const projects = window.portfolioProjects || [];
  const findProject = (id) => projects.find((p) => p.id === id) || null;
  const modified = (e) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

  const cvColumn = document.getElementById('sidebar-right');
  let view = null;      // the open case study or about view
  let gridScroll = 0;   // grid scroll position to come back to
  let loadToken = 0;    // ignore a fetch that a newer click overtook

  // pin relative links to this page before the url starts changing,
  // so lazy images and the favicon still resolve once it reads /telus/
  absolutizeUrls(document.body, document.baseURI);
  document.querySelectorAll('link[rel~="icon"]').forEach((link) => { link.href = link.href; });

  // fill card titles, links and tags from projects.js
  projects.forEach((project) => {
    const card = gridView.querySelector(`.case-card[data-id="${project.id}"]`);
    if (!card) return;
    const titleLink = card.querySelector('.card-title a');
    if (titleLink) {
      titleLink.textContent = project.shortTitle || project.title;
      titleLink.href = siteUrl(project.href);
    }
    card.dataset.href = siteUrl(project.href);
    card.dataset.category = project.category;
    renderProjectTags(card, projectTagList(project));
  });

  // project list for the phone menu while a case study is open
  if (panelProjects) {
    projects.forEach((project) => {
      const link = document.createElement('a');
      link.href = siteUrl(project.href);
      link.dataset.id = project.id;
      link.textContent = project.shortTitle || project.title;
      link.addEventListener('click', (e) => {
        if (modified(e)) return;
        e.preventDefault();
        openProject(project);
      });
      panelProjects.appendChild(link);
    });
  }

  function markProjectNav(id) {
    if (!panelProjects) return;
    panelProjects.querySelectorAll('a').forEach((link) => {
      const on = link.dataset.id === id;
      link.classList.toggle('active', on);
      if (on) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function setUrl(path, state, replace) {
    try {
      if (replace) history.replaceState(state, '', path);
      else history.pushState(state, '', path);
    } catch (err) {
      /* no history api, skip the url change */
    }
  }

  function host() {
    return wide.matches ? panelView : content;
  }

  function scroller() {
    return wide.matches ? sidebar : null;
  }

  // keep classes, the view's position and the pill in step with the screen size
  function sync() {
    const open = !!view;
    layout.classList.toggle('view-open', open);
    if (view && view.parentNode !== host()) host().appendChild(view);
    gridView.hidden = open && !wide.matches;
    if (open && wide.matches && isTouch()) {
      showPillAt(null);
    } else if (!open || !wide.matches) {
      hidePill();
    }
  }

  function mount(wrapper) {
    if (!view) gridScroll = wide.matches ? content.scrollTop : window.scrollY;
    if (view) view.remove();
    view = wrapper;
    host().appendChild(view);
    sync();
    const pane = scroller();
    if (pane) pane.scrollTop = 0;
    if (!wide.matches) window.scrollTo(0, 0);
    if (window.closeMobileMenu) window.closeMobileMenu();
    // the pointer is usually already over the blurred side
    if (lastPoint) updatePill(lastPoint);
    document.dispatchEvent(new CustomEvent('view-mounted', { detail: wrapper }));
  }

  function closeView(opts) {
    loadToken++;
    if (!view) return;
    view.remove();
    view = null;
    sync();
    sidebar.scrollTop = 0;
    if (wide.matches) content.scrollTop = gridScroll;
    else window.scrollTo(0, gridScroll);
    markProjectNav(null);
    document.title = HOME_TITLE;
    if (!opts || opts.push !== false) setUrl(siteUrl('./'), { project: null });
  }

  // breadcrumb in the view's topbar, with projects closing the view
  function addBreadcrumb(wrapper, title) {
    wrapper.querySelectorAll('.breadcrumb').forEach((el) => el.remove());
    const crumb = document.createElement('span');
    crumb.className = 'breadcrumb';

    const back = document.createElement('a');
    back.href = siteUrl('./');
    back.textContent = 'projects';
    back.addEventListener('click', (e) => {
      if (modified(e)) return;
      e.preventDefault();
      closeView();
    });

    const current = document.createElement('span');
    current.className = 'breadcrumb-current';
    current.textContent = title;
    crumb.append(back, document.createTextNode(' / '), current);

    let topbar = wrapper.querySelector('.topbar');
    if (!topbar) {
      topbar = document.createElement('div');
      topbar.className = 'topbar';
      wrapper.prepend(topbar);
    }
    const clock = topbar.querySelector('.clock');
    topbar.insertBefore(crumb, clock || null);

    // phone back button
    const projectsBtn = document.createElement('button');
    projectsBtn.className = 'topbar-back';
    projectsBtn.type = 'button';
    projectsBtn.textContent = 'projects';
    projectsBtn.addEventListener('click', () => closeView());
    topbar.appendChild(projectsBtn);
  }

  async function openProject(project, opts) {
    const token = ++loadToken;
    const url = siteUrl(project.href);
    let caseContent;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      caseContent = doc.querySelector('.content');
      if (!caseContent) throw new Error('no .content in ' + url);
    } catch (err) {
      // on failure, go to the page directly
      window.location.href = url;
      return;
    }
    if (token !== loadToken) return;

    absolutizeUrls(caseContent, url);
    const wrapper = document.createElement('div');
    wrapper.className = 'case-study-view';
    wrapper.dataset.project = project.id;
    wrapper.innerHTML = caseContent.innerHTML;
    wrapper.querySelectorAll('.case-header-text h2').forEach((h) => { h.textContent = project.title; });

    addBreadcrumb(wrapper, project.title);
    renderProjectTags(wrapper, projectTagList(project));
    renderProjectMeta(wrapper, project.meta);
    renderProjectTools(wrapper, project.tools);
    initProjectFooterNav(wrapper, project.id, (next) => openProject(next));

    mount(wrapper);
    markProjectNav(project.id);
    document.title = project.title;
    if (!opts || opts.push !== false) setUrl(url, { project: project.id }, opts && opts.replace);

    syncTagRowWidth(wrapper);
    document.fonts.ready.then(() => syncTagRowWidth(wrapper));
  }

  function openAbout(opts) {
    if (!aboutTemplate) {
      console.error('[portfolio] About view template is missing.');
      return;
    }
    loadToken++;
    const wrapper = document.createElement('div');
    wrapper.className = 'case-study-view about-view';
    wrapper.innerHTML = aboutTemplate.innerHTML;
    const portrait = wrapper.querySelector('.about-portrait');
    if (portrait) portrait.src = siteUrl('portrait-of-the-artist.jpg');
    const resume = wrapper.querySelector('.about-facts .download-link');
    if (resume) {
      resume.href = siteUrl(RESUME_FILE);
      resume.download = RESUME_FILE;
    }
    addBreadcrumb(wrapper, 'About');
    // home sits where the about link was, top right
    const topbar = wrapper.querySelector('.topbar');
    if (topbar) {
      const home = document.createElement('a');
      home.className = 'view-home-link';
      home.href = siteUrl('./');
      home.textContent = 'home';
      home.addEventListener('click', (e) => {
        if (modified(e)) return;
        e.preventDefault();
        closeView();
      });
      topbar.appendChild(home);
    }

    mount(wrapper);
    markProjectNav(null);
    document.title = ABOUT_TITLE;
    if (!opts || opts.push !== false) setUrl(siteUrl('about/'), { about: true }, opts && opts.replace);
  }

  // about link in the left panel
  sidebar.addEventListener('click', (e) => {
    const link = e.target.closest('.js-open-about');
    if (!link || modified(e)) return;
    e.preventDefault();
    openAbout();
  });

  // clicks on the grid while nothing covers it
  gridView.addEventListener('click', (e) => {
    if (view && wide.matches) return;
    const aboutLink = e.target.closest('#about-link');
    if (aboutLink) {
      if (modified(e)) return;
      e.preventDefault();
      openAbout();
      return;
    }
    const card = e.target.closest('.case-card[data-href]');
    if (!card) return;
    const link = e.target.closest('a');
    if (link && !link.classList.contains('card-link')) return;   // view site links
    if (link && modified(e)) return;
    if (!link && e.target.closest('button')) return;
    e.preventDefault();
    const project = findProject(card.dataset.id);
    if (project) openProject(project);
  });

  // the cv under the scrim: a click anywhere on it closes the view
  function inBlurredZone(target) {
    if (!view || !wide.matches || !target || !target.closest) return false;
    return !!target.closest('#sidebar-right');
  }

  window.addEventListener('click', (e) => {
    if (!inBlurredZone(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    closeView();
  }, true);

  // close pill that follows the pointer over the cv
  let lastPoint = null;

  function hidePill() {
    if (!pill) return;
    pill.classList.remove('is-visible', 'is-fixed');
    document.documentElement.classList.remove('pill-active');
  }

  // with a point, follow the pointer; without one, sit at the top of the cv (touch)
  function showPillAt(point) {
    if (!pill) return;
    if (point) {
      pill.style.left = point.x + 'px';
      pill.style.top = point.y + 'px';
      pill.classList.remove('is-fixed');
      document.documentElement.classList.add('pill-active');
    } else {
      const rect = (cvColumn || content).getBoundingClientRect();
      pill.style.left = (rect.left + rect.width / 2) + 'px';
      pill.style.top = (rect.top + 48) + 'px';
      pill.classList.add('is-fixed');
    }
    pill.textContent = 'close';
    pill.classList.add('is-visible');
  }

  function updatePill(point) {
    lastPoint = point;
    if (isTouch()) return;
    const target = document.elementFromPoint(point.x, point.y);
    if (!inBlurredZone(target)) {
      hidePill();
      return;
    }
    showPillAt(point);
  }

  window.addEventListener('mousemove', (e) => updatePill({ x: e.clientX, y: e.clientY }), { passive: true });
  document.documentElement.addEventListener('mouseleave', hidePill);

  if (pill) pill.addEventListener('click', () => closeView());

  window.addEventListener('resize', () => { if (view && wide.matches && isTouch()) showPillAt(null); });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !view) return;
    if (document.querySelector('.media-lightbox.active')) return;
    if (sidebar.classList.contains('open')) return;
    closeView();
  });

  if (wide.addEventListener) wide.addEventListener('change', sync);
  else if (wide.addListener) wide.addListener(sync);

  // browser back and forward
  window.addEventListener('popstate', (e) => {
    const state = e.state || {};
    if (state.about) {
      openAbout({ push: false });
      return;
    }
    const project = state.project ? findProject(state.project) : null;
    if (project) {
      openProject(project, { push: false });
      return;
    }
    closeView({ push: false });
  });

  // open what the url asked for
  if (initial && initial.about) {
    openAbout({ replace: true });
  } else if (initial && initial.project) {
    const project = findProject(initial.project);
    if (project) return openProject(project, { replace: true });
  }
  return null;
}

const opened = initHome(initial);

// set up a standalone project page
onReady(function () {
  if (!document.body.classList.contains('case-page')) return;

  const project = getCurrentProject();
  if (!project) {
    console.warn('[portfolio] Could not tell which project this page is. ' +
      'Add data-project="<id>" to <body> (ids are listed in projects.js).');
    return;
  }

  const sidebar = document.getElementById('sidebar');
  if (sidebar) renderProjectSidebar(sidebar, project.id);   // plain links

  document.title = project.title;
  document.querySelectorAll('.case-header-text h2').forEach((heading) => {
    heading.textContent = project.title;
  });
  document.querySelectorAll('.breadcrumb-current').forEach((current) => {
    current.textContent = project.title;
  });

  renderProjectTags(document, projectTagList(project));
  renderProjectMeta(document, project.meta);
  renderProjectTools(document, project.tools);
  syncTagRowWidth(document);
  // resync once fonts load
  document.fonts.ready.then(() => syncTagRowWidth(document));

  // move the breadcrumb next to the clock
  placeBreadcrumbInTopbar(document);

});

// build an empty cv section with a heading
function buildListSection(title) {
  const wrap = document.createElement('div');
  wrap.className = 'cv-section';
  const heading = document.createElement('h4');
  heading.textContent = title;
  wrap.appendChild(heading);
  return wrap;
}

// build the tools section of the cv
function buildToolsSection(tools) {
  if (!tools || !tools.length) return null;
  const wrap = buildListSection('Tools');
  // one cv item per group, laid out like the experience entries
  tools.forEach((group) => {
    const item = document.createElement('div');
    item.className = 'cv-item';
    const label = document.createElement('span');
    label.className = 'cv-role';
    label.textContent = group.group;
    const list = document.createElement('span');
    list.className = 'cv-org cv-tool-items';
    list.textContent = group.items.join(', ');
    item.append(label, list);
    wrap.appendChild(item);
  });
  return wrap;
}

// build the cv sections from projects.js
function buildCvSections(cv) {
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

      if (entry.location) {
        const location = document.createElement('span');
        location.className = 'cv-location';
        location.textContent = entry.location;
        item.appendChild(location);
      }

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

  return [
    buildSection('Experience', cv.experience),
    buildSection('Education', cv.education),
    buildSection('Exhibits', cv.exhibits),
    buildToolsSection(cv.tools)
  ].filter(Boolean);
}

onReady(function () {
  const cv = window.siteProfile && window.siteProfile.cv;
  if (!cv) {
    console.warn('[portfolio] window.siteProfile.cv is missing - is projects.js loading?');
    return;
  }

  const column = document.getElementById('sidebar-right');
  if (column) {
    // add the resume download button
    const actions = document.createElement('div');
    actions.className = 'cv-actions';
    actions.appendChild(buildDownloadLink());

    column.innerHTML = '';
    column.appendChild(actions);
    buildCvSections(cv).forEach((section) => column.appendChild(section));
  }

  // tools list for the about view
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
      // show the card if it matches the filter
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);

      if (show) {
        visible.push(card);
      }
    });

    // shuffle the visible cards
    const container = document.querySelector('.cards');
    if (!container) return;
    shuffle(visible);
    visible.forEach((card) => {
      container.appendChild(card);
    });

    // replay the entrance animation
    visible.forEach((card) => {
      card.classList.remove('card-animate');
      void card.offsetWidth;
      card.classList.add('card-animate');
    });

    // stagger the animation delays
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

  // show all on load
  applyFilter('all');
})();

// mobile menu, bound once and delegated so swapped-in topbars work too
function initMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('menu-backdrop');
  if (!sidebar) return;

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

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target || !target.closest) return;
    if (target.closest('.topbar-menu')) {
      openMenu();
    } else if (target.closest('.sidebar-close') || target === backdrop) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
  });

  window.closeMobileMenu = closeMenu;
}

initMobileMenu();

// media lightbox
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
      // use the same poster
      if (el.poster) vid.poster = el.poster;
      // keep the mirrored flip
      if (el.classList.contains('is-mirrored')) vid.classList.add('is-mirrored');
      // fall back to the still on error
      vid.addEventListener('error', () => fallBackToStill(vid), { once: true });
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

  // bind clicks on lightbox items
  function bind() {
    getItems().forEach((el, i) => {
      if (el.dataset.lbBound) return;
      el.dataset.lbBound = 'true';

      el.addEventListener('click', () => open(i));
    });
  }

  // bind fallback stills too
  document.addEventListener('media-fallback', bind);
  // and media in a case study opened on the home page
  document.addEventListener('view-mounted', bind);

  // prev and next buttons
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

  // bind items now or on load
  if (document.getElementById('media-lightbox')) {
    bind();
  } else {
    window.addEventListener('load', bind);
  }
})();

// project footer nav and back to top
function initProjectFooterNav(scope, projectId, onNavigate) {
  const nav = (scope || document).querySelector('#project-nav');
  if (!nav || !projectId) return;

  const projects = window.portfolioProjects || [];
  const current = projects.findIndex((p) => p.id === projectId);
  if (current === -1) return;

  // project name before the colon
  const name = (p) => p.title.split(':')[0].trim();
  // short footer label
  const shortName = (p) => p.navShortTitle || name(p);
  nav.style.display = '';

  const prev = nav.querySelector('.nav-prev');
  const next = nav.querySelector('.nav-next');
  const top = nav.querySelector('.back-to-top');

  function labelSpan(className, text) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    return span;
  }

  function bindLink(el, project, label, shortLabel) {
    if (!el) return;
    el.href = siteUrl(project.href);
    // add full and short labels
    el.replaceChildren(
      labelSpan('nav-label-full', label),
      labelSpan('nav-label-short', shortLabel)
    );
    if (onNavigate) {
      el.addEventListener('click', (e) => {
        // let modified clicks open normally
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onNavigate(project);
      });
    }
  }

  // wrap around at both ends
  const prevProject = projects[(current - 1 + projects.length) % projects.length];
  const nextProject = projects[(current + 1) % projects.length];
  bindLink(prev, prevProject, '← ' + name(prevProject), '← ' + shortName(prevProject));
  bindLink(next, nextProject, name(nextProject) + ' →', shortName(nextProject) + ' →');

  if (top) {
    top.addEventListener('click', () => {
      // find the scrolling element
      const scroller = nav.closest('.sidebar, .content') || document.getElementById('content');
      [scroller, document.scrollingElement].forEach((el) => {
        if (!el || el.scrollTop === 0) return;
        const from = el.scrollTop;
        el.scrollTo({ top: 0, behavior: 'smooth' });
        // force the jump if smooth scroll did nothing
        setTimeout(() => {
          if (el.scrollTop === from) el.scrollTop = 0;
        }, 300);
      });
    });
  }
}

// footer nav on standalone project pages
onReady(function () {
  if (!document.body.classList.contains('case-page')) return;
  const project = getCurrentProject();
  if (project) initProjectFooterNav(document, project.id);
});

// lazy autoplay videos and fade-in images
(function () {
  const FADE = '.hero-image img, .sbs-item img,' +
               '.case-image img, .case-image-wide img';

  const play = (v) => {
    const started = v.play();
    if (started && started.catch) started.catch(() => {});   // ignore autoplay refusal
  };

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) play(entry.target);
          else entry.target.pause();
        });
      }, { rootMargin: '150px 0px' })   // start just before it scrolls in
    : null;

  // bind a before/after slider
  function bindBeforeAfter(slider) {
    if (slider.dataset.beforeAfterBound) return;
    const range = slider.querySelector('.ba-range');
    if (!range) return;
    slider.dataset.beforeAfterBound = 'true';
    const set = () => slider.style.setProperty('--ba-split', range.value + '%');
    range.addEventListener('input', set);
    set();
  }

  // hide the cursor in the embed and track it
  const cursor = document.getElementById('custom-cursor');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
                      !window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  function trackCursor(frame) {
    if (!cursor || !finePointer) return;
    const doc = frame.contentDocument;
    if (!doc || !doc.head) return;

    const style = doc.createElement('style');
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    doc.head.appendChild(style);

    // cache the frame position
    let rect = frame.getBoundingClientRect();
    const measure = () => { rect = frame.getBoundingClientRect(); };
    window.addEventListener('scroll', measure, { passive: true, capture: true });
    window.addEventListener('resize', measure);

    doc.addEventListener('mousemove', (event) => {
      cursor.style.left = (rect.left + event.clientX) + 'px';
      cursor.style.top = (rect.top + event.clientY) + 'px';
    });
  }

  function bindEmbed(box) {
    if (box.dataset.embedBound) return;
    const frame = box.querySelector('iframe');
    if (!frame) return;
    box.dataset.embedBound = 'true';

    frame.addEventListener('load', () => trackCursor(frame));
    trackCursor(frame);   // frame may already be loaded
  }

  function apply(root) {
    root.querySelectorAll('video[data-autoplay]').forEach((video) => {
      if (video.dataset.mediaBound) return;
      video.dataset.mediaBound = 'true';
      // fall back now if the video already failed
      if (video.error) { fallBackToStill(video); return; }
      video.addEventListener('error', () => fallBackToStill(video), { once: true });
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

    root.querySelectorAll('[data-before-after]').forEach(bindBeforeAfter);
    root.querySelectorAll('.case-embed').forEach(bindEmbed);
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

// back to top button on the home grid
(function () {
  const button = document.getElementById('to-top');
  if (!button) return;

  const pane = document.querySelector('.content') || document.getElementById('content');

  // check which element scrolls
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
// umami analytics
(function () {
  const projects = () => window.portfolioProjects || [];

  const track = trackEvent;

  const baseName = (path) => String(path || '').split('/').pop().split('?')[0];
  const tidy = (text) => String(text || '').replace(/[\u2190\u2192]/g, '').trim().slice(0, 40);

  // find a project from its href
  function projectFromHref(href) {
    if (!href) return null;
    return projects().find((p) => {
      const slug = p.href.replace(/^\/|\/$/g, '');
      return slug && href.indexOf(slug) !== -1;
    }) || null;
  }

  // track clicks
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || !target.closest) return;

    // outbound links
    const outbound = target.closest('a.ext-link, .snapshot-box a');
    if (outbound && outbound.href) {
      let host = '';
      try { host = new URL(outbound.href, location.href).hostname; } catch (err) { host = ''; }
      track('outbound', { label: tidy(outbound.textContent), to: host });
      return;
    }

    // lightbox open and step
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

    // home filter
    const filter = target.closest('.filter-btn');
    if (filter) {
      track('filter', { category: filter.dataset.filter || '' });
      return;
    }

    // prev / next project
    const nav = target.closest('#project-nav .nav-prev, #project-nav .nav-next');
    if (nav) {
      track('project-nav', {
        direction: nav.classList.contains('nav-prev') ? 'previous' : 'next',
        to: tidy(nav.textContent)
      });
      return;
    }

    // project opened from the home page
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

  // track time on page and scroll depth
  const DEPTHS = [25, 50, 75, 100];
  const MARKS = [30, 120];

  let view = '';
  let elapsed = 0;
  let depthSent = [];
  let markSent = {};

  function viewKey() {
    const heading = document.querySelector('.case-study-view .case-header-text h2');
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

  // the open view scrolls in the left panel on wide screens
  function readingPane() {
    const panelView = document.querySelector('.layout.view-open #panel-view .case-study-view');
    return panelView ? document.getElementById('sidebar') : document.querySelector('.content');
  }

  function percentRead() {
    const pane = readingPane();
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

  // listen for scroll on the pane and window
  [window, document.querySelector('.content'), document.getElementById('sidebar')].forEach((target) => {
    if (target) target.addEventListener('scroll', onScroll, { passive: true });
  });

  // count seconds while the tab is visible
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
return opened;
}

onReady(boot);
