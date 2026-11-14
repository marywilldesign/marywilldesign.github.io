# marywildesign.com

The portfolio of Mary G. Wilson, UX/UI designer: case studies, an about page and a CV.
Plain HTML, CSS and JavaScript, with no framework and no build step to edit it.

Live at **https://marywildesign.com**

## What's where

| Path | What it is |
| --- | --- |
| `index.html` | The home page: intro, project cards and the CV panel. Case studies open inside it on wide screens. |
| `about/` | The about page. |
| `ibm/`, `kogl/`, `modo/`, `telus/`, `telus-informing-customers/`, `vancouverartgallery/`, `liveopencall/`, `vj-controller/`, `collaborativesentence/` | One folder per case study. Each holds its `index.html`, every image and video it uses, and an `og.jpg` for link previews. |
| `style.css` | Every style on the site. |
| `script.js` | Everything interactive: the cursor, the clock, opening case studies beside the home page, the lightbox, videos. |
| `projects.js` | The project data: titles, years, roles, tags, the "at a glance" box, credits and the CV. Edit text here rather than in the pages where possible. |
| `fonts/` | Neue Montreal (the site's typeface) and the clock's hieroglyphs. Its own README covers how the files were cut. |
| `mary-wilson-resume.pdf` | The CV download. Keep this exact name: the site's links point at it. |
| `portrait-of-the-artist.jpg`, `mw.svg`, `og.jpg` | The portrait, the logo mark and the home page's link preview image. They sit here because more than one page uses them. |
| `404.html` | The "page not found" screen. |
| `CNAME`, `robots.txt`, `sitemap.xml` | The domain name, and the files search engines read. They have to stay at the top level. |
| `.github/` | The publish setup (see below). |

Not in the repo, on purpose (see `.gitignore`):

- `_originals/` holds the full-size source images, the CV source (`_originals/resume/index.html`) and the font masters. Files no page uses any more are parked in `_originals/<project>/unused-site-media/`.
- `archive/` holds ten older project pages, kept in case they are wanted again. Their tracked copies live on the `archive-projects` branch.

## How it goes live

Push to `main` and GitHub publishes it, usually within two minutes.

The repo keeps the readable, commented code. On each push, the workflow in `.github/workflows/publish.yml` builds a copy of the site, strips the comments and spaces out of the HTML, CSS and JavaScript (`.github/minify.mjs`), and puts that smaller copy live. README files are left out of the published copy. Check that a publish worked in the repo's Actions tab, or with `gh run list`.

The domain always ends up at `https://marywildesign.com`: `http://` and `www.` addresses redirect there.

## Previewing on your own computer

From this folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Hard refresh (Cmd+Shift+R) after changing a stylesheet or script.

## Adding a case study

1. Make a folder named after the project, with the images and videos in it. Keep full-size originals in `_originals/<project>/` and put web-sized `.webp` and `.webm` copies in the folder.
2. Copy an existing case study's `index.html` into it as a starting point, and update the title, the `canonical` link, the description and the link preview tags at the top.
3. Add the project to `projects.js` and give its page the same `id` in `<body data-project="...">`.
4. Add a card for it to `index.html`.
5. Make a 1200×630 `og.jpg` for link previews, and add the page to `sitemap.xml`.

## Writing conventions

- Keep every paragraph to four lines or fewer on a desktop screen. Split longer ones at a sentence break.
- Number figures in order down the page (Fig. 1, Fig. 2, ...), and give every image a description of what it actually shows.
- UK spelling.
- Commit messages: a plain-English title, then one to three sentences on what changed and why.

## Updating the CV

Edit `_originals/resume/index.html`, print it to PDF as `mary-wilson-resume.pdf`, check it is still one page, and copy it to the top of this folder.

## Licences

Neue Montreal is from Pangram Pangram Foundry, used under their free terms for portfolios. The clock uses Noto Sans Egyptian Hieroglyphs under the SIL Open Font License (`fonts/OFL.txt`). The case study work belongs to the clients and collaborators credited on each page.
