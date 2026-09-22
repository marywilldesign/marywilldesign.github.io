# fonts/

Two families live here: the one the whole site is set in, and the clock's glyphs.

## Neue Montreal Medium - the site's typeface

| file | what it is |
| --- | --- |
| `NeueMontreal-Medium.woff2` | the only face the site uses, subset to Latin-1, General Punctuation and the whole Arrows block - 14 KB from 41 KB of OTF, 215 glyphs |

It sets everything: the wordmark, the case-study page titles, the home card
titles, the section labels and the body copy. Until September 2026 that was
split between a self-hosted Adobe Garamond Pro and Inter; Neue Montreal replaced
both, and Inter stays in the stack as the fallback, so `style.css` has a single
`--font-sans` for the whole site.

The family is declared as `NeueMontreal` rather than "Neue Montreal", so a copy
installed on a visitor's machine cannot be substituted for the file the site
serves - everyone gets the same spacing and the same drawings.

**Licence.** Pangram Pangram Foundry's free terms cover exactly this use. Their
FAQ says the fonts are "free to try for personal use as long as it is not used
in a commercial project", and then names the case: "You can use them in your
portfolio (PDF, print or web!)". A commercial project would need a licence from
them (from $40 a style, and web use is its own tier). The credit sits under the
sidebar bio on the home page.

Only the Medium weight is in the file, so 400 and 500 both render as Medium and
600 upwards is synthesised bold. The wordmark's hover draws its own weight with
`-webkit-text-stroke` partly for that reason.

The master is not shipped with the site. `NeueMontreal-Medium.otf` (v1.000,
2018) lives in `_originals/fonts/`, which is gitignored, since nothing loads it.
To regenerate the shipped woff2:

```sh
LATIN='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-21FF,U+2212'
/opt/miniconda3/bin/pyftsubset _originals/fonts/NeueMontreal-Medium.otf \
  --output-file=fonts/NeueMontreal-Medium.woff2 --flavor=woff2 \
  --unicodes="$LATIN" --layout-features='*' --no-hinting
```

`↗` is U+2197, which is why the cut takes the whole Arrows block rather than
U+2190-2193: the site sets ↗ in its links, ↑ on the back-to-top pill, and ‹ › in
the lightbox. `✕` (U+2715, the lightbox close button) is not in the family at
all, so it comes from the system face either way. Then check nothing the copy
uses has fallen out of the cut:

```sh
/opt/miniconda3/bin/python3 -c "
from fontTools.ttLib import TTFont
cmap = set(TTFont('fonts/NeueMontreal-Medium.woff2').getBestCmap())
missing = [c for c in set('design and dev by yours truly – … ‹ › ← ↑ → ↗') if ord(c) not in cmap]
print('missing:', missing or 'none')"
```

### The fallback faces

`--font-sans` is `'NeueMontreal', 'Inter', 'NeueMontreal-metric Arial',
system-ui, ...`. Inter sits second because the site used to be set in it and it
is a wanted safety net. The metric-matched local face sits behind Inter because
Inter is remote, so it is not there for the very first paint either, and the
first paint is exactly where the wordmark is fragile: it is sized to fill its
column by measurement, and it only fits a face up to 6.52x the font size.

Measured at font-size 100px, "Mary G. Wilson" is 649.0 wide in Neue Montreal
Medium, 683.4 in Arial and 720.4 in Inter. So both fallbacks are wider than the
wordmark's limit, which is why Arial is declared as its own family with
`size-adjust` set to Neue Montreal's proportions - 649.0 / 683.4 = 94.97%.
`size-adjust` scales a face's advances and its metrics together, so the local
fallback occupies exactly Neue Montreal's width and the swap costs no layout at
all. Verified with the woff2 blocked: one line, 191.0px in a 191px column, and
the bio does not move. Liberation Sans is metrically an Arial clone, so it takes
the same figure. Remove Arial from a machine and the stack falls through to
`system-ui`, which is narrower than Neue Montreal and so cannot overrun the
column either.

**What Inter can and cannot do, measured.** Inter is wider still at 7.204x, and
being served by Google Fonts it cannot be rescaled the way Arial above can. So
the interesting question is which of the two the browser actually reaches for
when the woff2 is missing. Blocking `fonts/NeueMontreal-Medium.woff2` at the
network layer answered it: the browser used the local metric face, not Inter,
and the wordmark stayed on one line at 191.0px with no overflow. Inter takes
over only if it is already cached from an earlier page, and in that case the
wordmark takes two lines for that moment. Deleting `'Inter'` from `--font-sans`
removes even that, if it is ever seen. Naming Inter therefore costs nothing in
the normal case: a page load fetches no Inter file at all, only the 14 KB woff2.

The percentage is per-string, so it needs redoing if the wordmark's text ever
changes - measure the string at 100px in each face and divide 649.0 by the
result:

```js
// in the page console; Arial gives ~683.4
const s = document.createElement('span');
s.textContent = 'Mary G. Wilson';
s.style.cssText = 'position:absolute;top:0;font:100px Georgia;white-space:nowrap';
document.body.append(s); console.log(s.getBoundingClientRect().width); s.remove();
```

## Adobe Garamond Pro - retired September 2026

Nothing references it any more: `style.css` no longer declares an `AGaramondPro`
face, so no browser fetches the woff2. **The file is kept on purpose**, in case
the design goes back to it - nothing loads it, so it costs the repo 45 KB and
nothing else. Deleting it is a one-line change if that ever stops being true.
The masters (`AGaramondPro-Regular.otf`, `AGaramondPro-Italic.otf`) are still in
`_originals/fonts/`. What follows describes it as it was.

| file | what it is |
| --- | --- |
| `AGaramondPro-Regular.woff2` | the upright face, subset to Latin and compressed - 45 KB from 116 KB of OTF |

The master this was cut from (`AGaramondPro-Regular.otf`) is not shipped with
the site. It lives in `_originals/fonts/`, which is gitignored, since nothing
loads it.

The italic was served from here too, as `AGaramondPro-Italic.woff2`, until the
wordmark was changed to the upright face and no rule set `font-style: italic` -
at which point it was a file no browser would ever fetch, so it was deleted. The
master is still in `_originals/fonts/`: bringing it back is the command below
with `Italic` in place of `Regular`, plus a second `@font-face` block with
`font-style: italic`.

Set the wordmark, the case-study page titles and the home card titles. `style.css`
declares the pair as the family `AGaramondPro` rather than "Adobe Garamond Pro",
so a copy installed on a visitor's machine cannot be substituted for the file the
site serves - everyone gets the same spacing and the same drawings. The stack
falls back to Georgia, then Times, if the files fail to load.

### The fallback faces

`font-display: swap` means a local fallback is painted first, and both local
serifs are wider than Garamond at the same size: "Mary G. Wilson" measures
6.362x its font-size in Garamond, 6.927x in Georgia and 6.469x in Times. The
wordmark is sized to its column (15.6cqw), which only fits a face up to 6.41x -
so before the woff2 landed the wordmark took two lines, and the bio under it sat
30px lower until the swap pulled it back up.

`style.css` therefore declares two further `@font-face` rules, `Garamond-metric
Georgia` and `Garamond-metric Times`, which are those same local files with
`size-adjust` set to Garamond's proportions - 636.2 / 692.69 = 91.84% and
636.2 / 646.88 = 98.35%. `size-adjust` scales a face's advances and its metrics
together, so the fallback occupies exactly Garamond's width and the swap costs no
layout at all. Measured with the woff2 blocked: one line, 189.53px, and the bio
does not move. Liberation Serif is metrically a Times clone, so it takes the
Times figure.

The percentages are per-string, so they need redoing if the wordmark's text
ever changes - measure the string at 100px in each face and divide 636.2 by the
result:

```js
// in the page console; Georgia gives ~692.7 and Times New Roman ~646.9
const s = document.createElement('span');
s.textContent = 'Mary G. Wilson';
s.style.cssText = 'position:absolute;top:0;font:100px Georgia;white-space:nowrap';
document.body.append(s); console.log(s.getBoundingClientRect().width); s.remove();
```

To regenerate after editing a master in `_originals/fonts/`:

```sh
LATIN='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2212,U+FEFF,U+FFFD'
for F in Regular; do
  /opt/miniconda3/bin/pyftsubset "_originals/fonts/AGaramondPro-$F.otf" \
    --output-file="fonts/AGaramondPro-$F.woff2" --flavor=woff2 \
    --unicodes="$LATIN" --layout-features='*' --no-hinting
done
```

Then check every character in a title is still covered - the subset is Latin
only, so a title using anything outside it would silently fall back to Georgia:

```sh
/opt/miniconda3/bin/python3 -c "
from fontTools.ttLib import TTFont
cmap = set(TTFont('fonts/AGaramondPro-Regular.woff2').getBestCmap())
missing = [c for c in set('Mary G. Wilson Telus: Enterprise IA Refresh') if ord(c) not in cmap]
print('missing:', missing or 'none')"
```

## To do: serve the serif from Adobe Fonts

**Moot as of September 2026:** the site no longer ships a serif, so there is
nothing to move to Adobe Fonts unless Garamond comes back. Kept for that case.

Marked to pick up later. Adobe Garamond Pro is commercial, and the copies
installed on this machine are licensed for desktop use. Serving these files from
the published site - which is what `@font-face` does - is webfont use, and Adobe
licenses that through Adobe Fonts, its own hosted embed, rather than by shipping
the files. A Creative Cloud subscription includes it.

The plan is to add the family to an Adobe Fonts web project and swap the
`@font-face` rule in `style.css` for the kit's stylesheet link, then delete the
woff2 file here. Nothing else about the type should need to change. Until that
happens, the self-hosted pair above is how the serif is served.

## Noto Sans Egyptian Hieroglyphs - the clock

Kept for a different reason: the clock in the topbar is set in Egyptian
hieroglyphs, which are not part of Inter and only exist on a machine whose
system fonts happen to cover that Unicode block. macOS does. A lot of Linux
installs do not, and those visitors would otherwise see empty boxes.

| file | what it is |
| --- | --- |
| `noto-sans-egyptian-hieroglyphs-subset.woff2` | Noto Sans Egyptian Hieroglyphs, cut down to the ten codepoints the clock uses - 6 KB instead of ~150 KB |
| `OFL.txt` | SIL Open Font License 1.1, which requires it ship alongside the font |

`style.css` refers to the woff2 in an `@font-face` whose `unicode-range` lists
those ten codepoints, so the file is only downloaded when one of them is
actually on the page - never on a narrow screen, where the clock is hidden.

## Regenerating the hieroglyphs

Only needed if a glyph in `DAYPARTS` or `AFK_GLYPHS` in `script.js` changes.

1. Edit the `cps` list below to match those two arrays.
2. Run the script:

```sh
python3 - <<'PY'
import re, urllib.parse, urllib.request
cps = [0x13005, 0x13007, 0x13009, 0x13020, 0x13021,
       0x13022, 0x13024, 0x13028, 0x13029, 0x1303F]
ua  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' \
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36'
get = lambda u: urllib.request.urlopen(
    urllib.request.Request(u, headers={'User-Agent': ua}), timeout=30).read()

css = get('https://fonts.googleapis.com/css2?family=Noto+Sans+Egyptian+Hieroglyphs'
          '&text=' + urllib.parse.quote(''.join(map(chr, cps))) + '&display=swap').decode()
open('fonts/noto-sans-egyptian-hieroglyphs-subset.woff2', 'wb').write(
    get(re.search(r'url\((https://[^)]+)\)', css).group(1)))

print('unicode-range:', re.search(r'unicode-range: ([^;]+);', css).group(1))
PY
```

3. Copy the `unicode-range` it prints over the one in the `@font-face` rule in
   `style.css`, so the browser still knows which characters the file is for.
4. Confirm the new file really does contain everything, rather than trusting the
   download:

```sh
python3 -c "
from fontTools.ttLib import TTFont
print([hex(c) for c in sorted(TTFont('fonts/noto-sans-egyptian-hieroglyphs-subset.woff2').getBestCmap())])"
```

   That needs `fontTools`, which may not be in the default interpreter - on this
   machine it lives with `pyftsubset` at `/opt/miniconda3/bin/python3`. Expect
   `0x20` plus the ten codepoints; a missing one means the `text=` list and the
   `unicode-range` disagree.

The `text=` parameter is what tells Google Fonts to return a subset instead of
the whole family. Without it you get all ~1,000 hieroglyphs.
