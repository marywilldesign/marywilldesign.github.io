/* ------------------------------------------------------------------
   projects.js — the ONE place project + profile data lives.
   Edit here; the home page, every project page, the sidebars, the
   CV panel and the prev/next footer all read from this file.

   hrefs are relative to the site root (no leading slash needed).
   `id` is what you put in <body data-project="…"> on each project page.
------------------------------------------------------------------ */

window.portfolioProjects = [
  {
    id: 'telus',
    title: 'Telus: Enterprise IA Refresh',
    href: 'telus/',
    category: 'ux',
    tags: ['design system', 'enterprise', 'a/b testing', 'analytics', 'workshop facilitation', 'user research', 'IA']
  },
  {
    id: 'telus-informing-customers',
    title: 'Telus: Informing Customers',
    href: 'telus-informing-customers/',
    category: 'ux',
    tags: ['design system', 'enterprise', 'a/b testing', 'analytics', 'workshop facilitation', 'user research', 'IA']
  },
  {
    id: 'creepers',
    title: 'Van Art Gallery: AI Installation',
    href: 'vancouverartgallery/',
    category: 'ux',
    tags: ['experience design', 'design system', 'installation', 'project management', 'scrum master']
  },
  {
    id: 'ibm',
    title: 'IBM: Login Flow',
    href: 'ibm/',
    category: 'ux',
    tags: ['design system', 'enterprise', 'login flow']
  },
  {
    id: 'modo',
    title: 'Modo: B2C Site Redesign',
    href: 'modo/',
    category: 'ux',
    tags: ['site refresh', 'IA', 'card design', 'navigation design']
  },
  {
    id: 'kogl',
    title: 'Kogl: Establishing Digital Presence',
    href: 'kogl/',
    category: 'ux',
    tags: ['creative direction', 'end-to-end', 'animation']
  },
  {
    id: 'liveopencall',
    title: 'Live Open Call: Mobile Submissions',
    href: 'liveopencall/',
    category: 'code',
    tags: ['backend dev', 'graphic design', 'print', 'installation', 'systems architecture']
  },
  {
    id: 'blackbox',
    title: 'VJ Controller: MA Thesis',
    href: 'blackbox/',
    category: 'code',
    tags: ['graphic design', 'installation', '3D design + printing', 'single board computing', 'electronics']
  }
];

window.siteProfile = {
  name: 'Mary G. Wilson',

  // rendered into <aside id="sidebar-right"> on every page
  // sub: true  -> indented client under the entry above it
  cv: {
    experience: [
      { role: 'Lead UX Designer',             org: 'KHiO Research Project',          date: 'July 2026 – Present' },
      { role: 'UX & Graphic Designer',        org: 'KOGL',                           date: 'Jan 2026 – April 2026' },
      { role: 'Snr. UX Designer (contract)',  org: 'All Purpose Creative',           date: '2021 – Present' },
      { sub: true, org: 'Modo',                                                       date: 'Feb 2022 – 2025' },
      { sub: true, org: 'IBM',                                                        date: 'July 2024 – Jan 2025' },
      { sub: true, org: 'Telus',                                                      date: 'Sept 2021 – Dec 2024' },
      { sub: true, org: 'Vancouver Board of Trade',                                   date: 'Jan 2023 – July 2023' },
      { role: 'UX Designer',                  org: 'Van Art Gallery – Installation', date: 'Jan 2020 – Sept 2021' },
      { role: 'UX Designer',                  org: 'JIBC',                           date: 'Sept 2020 – Jan 2020' },
      { role: 'UX Designer',                  org: 'Virtro',                         date: 'Jan 2017 – July 2020' }
    ],
    education: [
      { role: 'MA Graphic Design', org: 'KHiO, Oslo' },
      { role: 'MDM UX Design',     org: 'UBC, Vancouver' },
      { role: 'BBM Advertising',   org: 'UQ, Brisbane' }
    ],
    exhibits: [
      { org: 'Oslo Art Weekend',              date: 'June 2026' },
      { org: 'Torpedo Books & Publishing',    date: 'Dec 2025' },
      { org: 'Grafia, Helsinki',              date: 'July – Sept 2025' },
      { org: 'Kunstnernes Hus',               date: 'June 2025' },
      { org: 'White Box Gallery, KHiO',       date: 'Nov 2024' },
      { org: 'Van Art Gallery – Installation', date: 'March – Oct 2022' }
    ]
  }
};