# marywildesign.com

The portfolio of Mary G. Wilson, UX/UI designer: case studies, an about page and a CV.
Plain HTML, CSS and JavaScript, with no framework.

Live at **https://marywildesign.com**

## What's where

```
index.html        the home page: intro, project cards and the CV panel
404.html          the "page not found" screen
robots.txt        points search engines at the sitemap
sitemap.xml       every page on the site, for search engines

core/             the code every page shares
  style.css         every style on the site
  script.js         everything interactive: cursor, clock, opening case studies, lightbox, videos
  projects.js       the project data: titles, years, roles, tags, "at a glance", credits and the CV

assets/           files every page shares
  mw.svg            the logo mark (also the browser tab icon)
  portrait-of-the-artist.jpg
  og.jpg            the home page's link preview image
  mary-wilson-resume.pdf
  fonts/            Neue Montreal and the clock's hieroglyphs, with notes on how they were cut

pages/
  about/            the about page

projects/         one folder per case study, each with its page, images, videos and og.jpg
  collaborativesentence/  ibm/  kogl/  liveopencall/  modo/
  telus/  telus-informing-customers/  vancouverartgallery/  vj-controller/

.github/          publishing: the workflow, the minifier and the preview helper
```

`index.html`, `404.html`, `robots.txt` and `sitemap.xml` stay at the top because browsers and search engines look for them there. `.gitignore` and `.gitattributes` stay at the top because git reads them there.

Not in the repo, on purpose (see `.gitignore`):

- `_originals/` holds the full-size source images, the CV source (`_originals/resume/index.html`) and the font masters. Files no page uses any more are parked in `_originals/<project>/unused-site-media/`.
- `archive/` holds ten older project pages, kept in case they are wanted again. Their tracked copies live on the `archive-projects` branch.

## Web addresses

The folders above don't change the site's addresses. Case studies and the about page live in `projects/` and `pages/` here, but online they sit at the top level, as they always have:

- `projects/telus/` is **marywildesign.com/telus/**
- `pages/about/` is **marywildesign.com/about/**
- the CV is at **marywildesign.com/assets/mary-wilson-resume.pdf**, with a copy kept at the old address, marywildesign.com/mary-wilson-resume.pdf, for links in past applications

Inside a page, write paths as they'll be online. From a case study, `../core/style.css` reaches the stylesheet and `../telus/cover.webp` reaches its own image.

## How it goes live

Push to `main` and GitHub publishes it, usually within two minutes.

The repo keeps the readable, commented code. On each push, `.github/workflows/publish.yml`:

1. builds a copy of the site,
2. leaves out README notes,
3. moves `pages/` and `projects/` up to their web addresses and adds the CV's old-address copy,
4. strips comments and spaces from the HTML, CSS and JavaScript (`.github/minify.mjs`),
5. puts that copy live.

Check that a publish worked in the repo's Actions tab, or with `gh run list`. The domain always ends up at `https://marywildesign.com`: `http://` and `www.` addresses redirect there. The domain itself is set in the repo's Pages settings, so there's no CNAME file.

## Previewing on your own computer

From this folder:

```sh
python3 .github/preview.py
```

Then open http://localhost:8000. The helper serves the site at the same addresses it has online. Hard refresh (Cmd+Shift+R) after changing a stylesheet or script.

## Adding a case study

1. Make a folder in `projects/`, named the way the address should read (`projects/acme/` becomes marywildesign.com/acme/). Keep full-size originals in `_originals/acme/`, and put web-sized `.webp` and `.webm` copies in the folder.
2. Copy an existing case study's `index.html` into it as a starting point, and update the title, the `canonical` link, the description and the link preview tags at the top.
3. Add the project to `core/projects.js`, and give its page the same `id` in `<body data-project="...">`.
4. Add a card for it to `index.html`.
5. Make a 1200×630 `og.jpg` for link previews, and add the page to `sitemap.xml`.

A folder in `projects/` can't share a name with anything at the top of the site (such as `core` or `assets`). The publish step stops if it does.

## Writing conventions

- Keep every paragraph to four lines or fewer on a desktop screen. Split longer ones at a sentence break.
- Number figures in order down the page (Fig. 1, Fig. 2, ...), and give every image a description of what it actually shows.
- UK spelling.
- Commit messages: a plain-English title, then one to three sentences on what changed and why.

## Updating the CV

Edit `_originals/resume/index.html`, print it to PDF as `mary-wilson-resume.pdf`, check it is still one page, and copy it to `assets/`.

## Licences

Neue Montreal is from Pangram Pangram Foundry, used under their free terms for portfolios. The clock uses Noto Sans Egyptian Hieroglyphs under the SIL Open Font License (`assets/fonts/OFL.txt`). The case study work belongs to the clients and collaborators credited on each page.
