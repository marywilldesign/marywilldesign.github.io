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
    tags: ['allium design system', 'enterprise', 'a/b testing', 'analytics', 'workshop facilitation', 'user research', 'IA'],
    meta: {
      year: '2022 - 2024',
      role: 'UX/UI Design, User Testing Support',
      credits: [
        'UX Design: Chris Samuel (previous: Marie Louka)',
        'Project Management: Thelma Wiegert (previous: Sarah Bain)',
        'User Research: Rebecca Harrington',
        'Content Strategy: Mike MacKinnon'
      ],
      links: [
        { label: 'view site ↗', href: 'https://www.telus.com/en/internet' },
        { label: 'full case study (pdf) →', href: 'https://drive.google.com/file/d/154rOSybpMvjC_LpU055DL15ylRA56IEj/view?usp=sharing' }
      ]
    }
  },
  {
    id: 'telus-informing-customers',
    title: 'Telus: Informing Customers',
    href: 'telus-informing-customers/',
    category: 'ux',
    tags: ['allium design system', 'enterprise', 'a/b testing', 'analytics', 'workshop facilitation', 'user research', 'IA'],
    meta: {
      year: '2022 - 2024',
      role: 'UX/UI Design, User Testing Support',
      credits: [
        'UX Design: Chris Samuel (previous: Marie Louka)',
        'Project Management: Thelma Wiegert (previous: Sarah Bain)',
        'User Research: Rebecca Harrington',
        'Content Strategy: Mike MacKinnon'
      ],
      links: [
        { label: 'view site ↗', href: 'https://www.telus.com/en/shop/home-services/internet/plans/' },
        { label: 'full case study (pdf) →', href: 'https://drive.google.com/file/d/154rOSybpMvjC_LpU055DL15ylRA56IEj/view?usp=sharing' }
      ]
    }
  },
  {
    id: 'creepers',
    title: 'Van Art Gallery: AI Installation',
    href: 'vancouverartgallery/',
    category: 'ux',
    tags: ['experience design', 'design system creation', 'installation', 'project management', 'scrum master'],
    meta: {
      year: '2021',
      role: 'UX/UI Designer, User Research, Project Manager',
      credits: [
        'Lead Programmer, Artist, UI Designer: Cindy Shi',
        'Concept Artist: Yuri Wu',
        'Project Management, UX Support: Shruti Sharma'
      ],
      links: [
        { label: 'view press ↗', href: 'https://preview-art.com/feature/the-imitation-game-visual-culture-in-the-age-of-artificial-intelligence/' },
        { label: 'full case study (pdf) →', href: 'https://drive.google.com/file/d/154rOSybpMvjC_LpU055DL15ylRA56IEj/view?usp=sharing' }
      ]
    }
  },
  {
    id: 'ibm',
    title: 'IBM: Login Flow',
    href: 'ibm/',
    category: 'ux',
    tags: ['carbon design system', 'enterprise', 'login flow'],
    meta: {
      year: '2024',
      role: 'UX/UI Design',
      credits: ['Previous: Wendi Ma'],
      links: [
        { label: 'view live page ↗', href: 'https://www.ibm.com/responsibility/programs/volunteerism-giving' }
      ]
    }
  },
  {
    id: 'modo',
    title: 'Modo: B2C Site Redesign',
    href: 'modo/',
    category: 'ux',
    tags: ['site refresh', 'IA', 'card design', 'navigation design'],
    meta: {
      year: '2022 - ongoing',
      role: 'UX/UI Design Lead, User Testing Support',
      credits: [
        'Project Management: Thelma Wiegert (previous: Sarah Bain)',
        'UI Design and Animation: Sonia Yao (previous: Chris Samuel)',
        'User Research: Rebecca Harrington',
        'Content Strategy: Mike MacKinnon',
        'Web Development: Jason Landry'
      ],
      links: [
        { label: 'view site ↗', href: 'https://www.modo.coop/' },
        { label: 'full case study (pdf) →', href: 'https://drive.google.com/file/d/154rOSybpMvjC_LpU055DL15ylRA56IEj/view?usp=sharing' }
      ]
    }
  },
  {
    id: 'kogl',
    title: 'Kogl: Establishing Digital Presence',
    href: 'kogl/',
    category: 'ux',
    tags: ['creative direction', 'end-to-end', 'animation'],
    meta: {
      year: '2026',
      role: 'Strategy, UX & Graphic Design',
      credits: ['Front-end Build: Maria Tan'],
      links: [
        { label: 'view live site ↗', href: 'https://kogl.no' },
        { label: 'full case study (pdf) →', href: 'https://drive.google.com/file/d/154rOSybpMvjC_LpU055DL15ylRA56IEj/view?usp=sharing' }
      ]
    }
  },
  {
    id: 'liveopencall',
    title: 'Live Open Call: Mobile Submissions',
    href: 'liveopencall/',
    category: 'code',
    tags: ['backend dev', 'graphic design', 'print', 'installation', 'systems architecture'],
    meta: {
      year: '2025',
      role: 'Design & Development',
      links: [
        { label: 'view site ↗', href: 'https://art-kive.github.io/art-kive/' }
      ]
    }
  },
  {
    id: 'blackbox',
    title: 'VJ Controller: MA Thesis',
    href: 'blackbox/',
    category: 'code',
    tags: ['graphic design', 'installation', '3D design + printing', 'single board computing', 'electronics'],
    meta: {
      year: '2025 - 2026',
      role: 'Design (UX/UI, 3D) & Build (Electronics, Development)',
      links: [
        { label: 'view site ↗', href: 'https://blackboxvj.me' }
      ]
    }
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