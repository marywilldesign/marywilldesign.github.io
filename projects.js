/* ------------------------------------------------------------------
   projects.js - the ONE place project + profile data lives.
   Edit here; the home page, every project page, the sidebars, the
   CV panel and the prev/next footer all read from this file.

   hrefs are relative to the site root (no leading slash needed).
   `id` is what you put in <body data-project="…"> on each project page.
   `tools` feeds two places: the names join the tag row on the cards and the
   case headers, and each project page lists the same tools with what they
   were used for.
------------------------------------------------------------------ */

window.portfolioProjects = [
  {
    id: 'telus',
    title: 'Telus: Enterprise IA Refresh',
    href: 'telus/',
    category: 'ux',
    // IA leads, since it is what the project is about, and starting with the
    // shortest tag is also what lets these seven pack into three rows on a card
    // instead of four. Identical to the list on telus-informing-customers below.
    tags: ['IA', 'allium design system', 'enterprise', 'a/b testing', 'analytics', 'user research', 'workshop facilitation'],
    tools: [
      { name: 'Figma', use: 'Specced each menu tier as wireframes, then built the hi-fi menu states for desktop and mobile.' },
      { name: 'Decibel', use: 'Tracked click-through on every menu item to find where the old IA lost people, and to measure the change after launch.' },
      { name: 'FigJam', use: 'Held the card sorting and the label workshop with the client and sales team on one board, through the audit and into the redesign.' }
    ],
    meta: {
      year: '2022 - 2024',
      role: 'UX/UI Design Lead, User Research & Workshop Facilitation',
      credits: [
        'UX Design: Chris Samuel (previous: Marie Louka)',
        'Project Management: Thelma Wiegert (previous: Sarah Bain)',
        'User Research: Rebecca Harrington',
        'Content Strategy: Mike MacKinnon'
      ],
      links: [
        { label: 'view site ↗', href: 'https://www.telus.com/en/internet' }
      ]
    }
  },
  {
    id: 'telus-informing-customers',
    title: 'Telus: Informing Customers',
    href: 'telus-informing-customers/',
    category: 'ux',
    tags: ['IA', 'allium design system', 'enterprise', 'a/b testing', 'analytics', 'user research', 'workshop facilitation'],
    tools: [
      { name: 'Figma', use: 'Wireframed the three card options, then designed the final cards and the plan page states.' },
      { name: 'Decibel', use: 'Read the funnel data to see where people stalled on the plans page, and set the measures for the A/B test.' },
      { name: 'FigJam', use: 'Mapped each behavioural segment and its journey before design, so the cards answered the objections that came up most.' }
    ],
    meta: {
      year: '2022 - 2024',
      role: 'UX/UI Design Lead, User Research & Workshop Facilitation',
      credits: [
        'UX Design: Chris Samuel (previous: Marie Louka)',
        'Project Management: Thelma Wiegert (previous: Sarah Bain)',
        'User Research: Rebecca Harrington',
        'Content Strategy: Mike MacKinnon'
      ],
      links: [
        { label: 'view site ↗', href: 'https://www.telus.com/en/shop/home-services/internet/plans/' }
      ]
    }
  },
  {
    id: 'creepers',
    title: 'Van Art Gallery: AI Installation',
    href: 'vancouverartgallery/',
    category: 'ux',
    tags: ['service design', 'design system creation', 'installation', 'project management', 'scrum master'],
    tools: [
      { name: 'Figma', use: "Drew the audience spectrum, both personas and the visitor journey, then the room plan and the wall mockup. The rules for the drawing were written in this file before anything was built." }
    ],
    meta: {
      year: '2021',
      role: 'Service Designer, User Research, Project Manager',
      credits: [
        'Lead Programmer, Artist, UI Designer: Cindy Shi',
        'Concept Artist: Yuri Wu',
        'Project Management, UX Support: Shruti Sharma'
      ],
      links: [
        { label: 'view press ↗', href: 'https://preview-art.com/feature/the-imitation-game-visual-culture-in-the-age-of-artificial-intelligence/' }
      ]
    }
  },
  {
    id: 'ibm',
    title: 'IBM: Benevity Platform Flow',
    href: 'ibm/',
    category: 'ux',
    tags: ['carbon design system', 'enterprise', 'benevity platform flow'],
    tools: [
      { name: 'Figma', use: "Built the flows from lo-fi to hi-fi on IBM's Carbon grid, extending existing components where the consent steps needed them. Layers and names stayed tidy so their team could pick the file up without me." }
    ],
    meta: {
      year: '2024',
      role: 'UX/UI Design',
      credits: ['Collaborator: Wendi Ma'],
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
    tools: [
      { name: 'Figma', use: "Wireframed the rebuilt site page by page, then designed the hi-fi navigation, fleet selection and booking screens inside Modo's existing brand." },
      { name: 'FigJam', use: 'Ran the interest-holder workshops and kept the competitive analysis and the franken-site audit on one board, so the team could see what was going and what was staying.' }
    ],
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
        { label: 'view site ↗', href: 'https://www.modo.coop/' }
      ]
    }
  },
  {
    id: 'kogl',
    title: 'Kogl: Establishing Web Presence',
    href: 'kogl/',
    category: 'ux',
    tags: ['creative direction', 'end-to-end', 'animation'],
    tools: [
      { name: 'Figma', use: 'Set the type, grid and spacing, then designed the cards, index and studio pages. Both card options came out of this file.' },
      { name: 'FigJam', use: 'Collected the competitive review and the first card explorations, with a note on what each reference site actually does well.' },
      { name: 'p5.js', use: 'Made the phonetic animation that plays before the site opens, so visitors hear how to say KOGL before they read anything.' }
    ],
    meta: {
      year: '2026',
      role: 'Strategy, UX & Graphic Design',
      credits: ['Front-end Build: Maria Tan'],
      links: [
        { label: 'view live site ↗', href: 'https://kogl.no' }
      ]
    }
  },
  {
    id: 'liveopencall',
    title: 'Live Open Call: Installation',
    href: 'liveopencall/',
    category: 'code',
    tags: ['backend dev', 'graphic design', 'print', 'installation', 'systems architecture'],
    tools: [
      { name: 'Figma', use: 'Designed the phone submission screen, the archive layout and the receipt template.' },
      { name: 'Copilot', use: 'Came after the interaction was settled: the QR hand-off, the single text field and the receipt as the record were decided first, then Copilot built the backend and archive page to that flow.' }
    ],
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
    // Not "blackbox/": GitHub Pages reserves that path for the separate
    // `blackbox` repo, whose blackboxvj.me custom domain 301s everything under
    // it away from marywildesign.com - page, video and posters alike.
    href: 'vj-controller/',
    category: 'code',
    // electronics sits directly after 3D design + printing so the two making tags
    // land side by side on the same row of the card. Three rows either way, but the
    // rows come out more even this way round.
    tags: ['graphic design', 'installation', '3D design + printing', 'electronics', 'single board computing'],
    tools: [
      { name: 'Figma', use: 'Designed the browser controller and labelled its on-screen controls. The physical controller stayed unlabelled on purpose.' },
      { name: 'Copilot', use: 'Came after the control logic and the unlabelled-controller decision were settled, then wrote the front end and the Python bridge that read the switches and knobs into the visuals.' },
      { name: 'Fusion 360', use: 'Modelled the enclosure around the single-board computer and wiring, within what the print bed could take.' }
    ],
    meta: {
      year: '2025 - 2026',
      role: 'Design (UX/UI, 3D) & Build (Electronics, Development)',
      links: [
        { label: 'view site ↗', href: 'https://blackboxvj.me' }
      ]
    }
  },
  {
    id: 'collaborativesentence',
    title: 'First Collaborative Sentence: Remixed',
    // Compact form for the two places with no room: the 191px panel column, and
    // the home card title, which has to hold one line. "Remixed" stays at case
    // study level only, in the <h2>, the breadcrumb and document.title.
    shortTitle: 'First Collaborative Sentence',
    // The footer's prev/next cell is only about half the pane, and on the narrow
    // layout that is 113px at 320px wide and 140px at 375px, against the 179px
    // this name needs - so the footer gets a shorter form again below 640px.
    // "Long Sentence →" measures 102px, which is one line at every width down to
    // 320px; anything longer (the 150px "Collaborative Sentence") wraps there.
    navShortTitle: 'Long Sentence',
    href: 'collaborativesentence/',
    category: 'code',
    // the card-info set, which carries "front-end dev" that the case-study tag
    // line left off. One list feeds both places, so both now show these five.
    tags: ['web scraping', 'graphic design', 'typography', 'front-end dev', 'creative development'],
    tools: [
      { name: 'Python', use: 'Wrote the scraper that pulled the million-word sentence out of the archive and prepared it for the banned-word pass.' },
      { name: 'Figma', use: 'Set the type and the blur treatment for banned words, and worked out the colophon and credits panel.' },
      { name: 'Copilot', use: 'Came last. The banned-word list, the blur instead of deletion, the single typeface and the autoscroll were all decided first; Copilot built the site to those decisions.' }
    ],
    meta: {
      year: '2025',
      role: 'Design (Typography, UI) & Build (Web Scraping, Front-end Development)',
      links: [
        // the artwork lives on its own Pages repo under the marywilsondesign
        // account, not under marywildesign.com like the rest of the site
        { label: 'view site ↗', href: 'https://marywilsondesign.github.io/lcsremixed/' }
      ]
    }
  }
];

window.siteProfile = {
  name: 'Mary G. Wilson',

  // rendered into <aside id="sidebar-right"> on every page
  // sub: true  -> indented client under the entry above it
  // location   -> own line under org; institution and city are separate fields
  //               on education entries, where the city carries its country
  // skills/tools -> the About facts table stays short; the panel lists tools
  cv: {
    experience: [
      { role: 'Lead UX Designer',             org: 'KHiO Research Project',          date: 'July 2026 – Present' },
      { role: 'Strategy, UX & Graphic Design', org: 'KOGL',                          date: 'Jan 2026 – April 2026' },
      { role: 'Snr. UX Designer (contract)',  org: 'All Purpose Creative',           date: '2021 – Present' },
      { sub: true, org: 'Modo',                                                       date: 'Feb 2022 – 2025' },
      { sub: true, org: 'IBM',                                                        date: 'July 2024 – Jan 2025' },
      { sub: true, org: 'Telus',                                                      date: 'Sept 2021 – Dec 2024' },
      { sub: true, org: 'Vancouver Board of Trade',                                   date: 'Jan 2023 – July 2023' },
      { role: 'Service Designer',             org: 'Van Art Gallery (Installation)', date: 'Jan 2020 – Sept 2021' },
      { role: 'UX Designer',                  org: 'JIBC',                           date: 'Sept 2020 – Jan 2021' },
      { role: 'UX Designer',                  org: 'Virtro',                         date: 'Jan 2017 – July 2020' }
    ],
    education: [
      { role: 'MA in Graphic Design',    org: 'National Academy of the Arts', location: 'Oslo, Norway',       date: 'Sept 2024 – June 2026' },
      { role: 'Master of Digital Media', org: 'University of British Columbia', location: 'Vancouver, Canada',  date: 'Sept 2020 – Sept 2021' },
      { role: 'Bachelor of Business Mgmt.', org: 'University of Queensland', location: 'Brisbane, Australia', date: 'Mar 2013 – July 2016' }
    ],
    exhibits: [
      { org: 'Oslo Art Weekend',              date: 'June 2026' },
      { org: 'Torpedo Books & Publishing',    date: 'Dec 2025' },
      { org: 'Grafia, Helsinki',              date: 'July – Sept 2025' },
      { org: 'Kunstnernes Hus',               date: 'June 2025' },
      { org: 'White Box Gallery, KHiO',       date: 'Nov 2024' },
      { org: 'Van Art Gallery (Installation)', date: 'March – Oct 2022' }
    ],
    // Tools only, grouped by what they are for; the panel lists them and the
    // About view repeats the same list on narrow screens, where the panel is
    // hidden.
    tools: [
      { group: 'design', items: ['Figma', 'FigJam', 'Figma Make', 'Adobe CC', 'Canva', 'Framer'] },
      { group: 'research', items: ['Miro', 'Maze', 'UserTesting', 'Optimal Workshop', 'Dovetail', 'Typeform'] },
      { group: 'data', items: ['Decibel', 'Google Analytics', 'Hotjar'] },
      { group: 'delivery', items: ['Notion', 'Jira', 'Slack'] },
      { group: 'build & AI', items: ['VS Code', 'Cursor', 'Copilot', 'ChatGPT', 'Claude', 'GitHub', 'HTML/CSS'] },
      { group: 'web', items: ['Webflow', 'WordPress', 'Squarespace', 'Readymag'] },
      { group: 'code & 3D', items: ['p5.js', 'Python', 'Fusion 360'] }
    ]
  }
};