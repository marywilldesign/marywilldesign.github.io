# fonts/

Two families live here, for two different reasons.

## Adobe Garamond Pro — the display serif

| file | what it is |
| --- | --- |
| `AGaramondPro-Regular.woff2` | the upright face, subset to Latin and compressed — 45 KB from 116 KB of OTF |
| `AGaramondPro-Italic.woff2` | the italic — 34 KB from 90 KB. Nothing uses it at the moment: the wordmark was changed to the upright face, and no rule sets `font-style: italic`, so it is never fetched |

The two masters these were cut from (`AGaramondPro-Regular.otf`,
`AGaramondPro-Italic.otf`) are not shipped with the site. They live in
`_originals/fonts/`, which is gitignored, since nothing loads them.

Set the wordmark, the case-study page titles and the home card titles. `style.css`
declares the pair as the family `AGaramondPro` rather than "Adobe Garamond Pro",
so a copy installed on a visitor's machine cannot be substituted for the file the
site serves — everyone gets the same spacing and the same drawings. The stack
falls back to Georgia, then Times, if the files fail to load.

### The fallback faces

`font-display: swap` means a local fallback is painted first, and both local
serifs are wider than Garamond at the same size: "Mary G. Wilson" measures
6.362x its font-size in Garamond, 6.927x in Georgia and 6.469x in Times. The
wordmark is sized to its column (15.6cqw), which only fits a face up to 6.41x —
so before the woff2 landed the wordmark took two lines, and the bio under it sat
30px lower until the swap pulled it back up.

`style.css` therefore declares two further `@font-face` rules, `Garamond-metric
Georgia` and `Garamond-metric Times`, which are those same local files with
`size-adjust` set to Garamond's proportions — 636.2 / 692.69 = 91.84% and
636.2 / 646.88 = 98.35%. `size-adjust` scales a face's advances and its metrics
together, so the fallback occupies exactly Garamond's width and the swap costs no
layout at all. Measured with the woff2 blocked: one line, 189.53px, and the bio
does not move. Liberation Serif is metrically a Times clone, so it takes the
Times figure.

The percentages are per-string, so they need redoing if the wordmark's text
ever changes — measure the string at 100px in each face and divide 636.2 by the
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
for F in Regular Italic; do
  /opt/miniconda3/bin/pyftsubset "_originals/fonts/AGaramondPro-$F.otf" \
    --output-file="fonts/AGaramondPro-$F.woff2" --flavor=woff2 \
    --unicodes="$LATIN" --layout-features='*' --no-hinting
done
```

Then check every character in a title is still covered — the subset is Latin
only, so a title using anything outside it would silently fall back to Georgia:

```sh
/opt/miniconda3/bin/python3 -c "
from fontTools.ttLib import TTFont
cmap = set(TTFont('fonts/AGaramondPro-Regular.woff2').getBestCmap())
missing = [c for c in set('Mary G. Wilson Telus: Enterprise IA Refresh') if ord(c) not in cmap]
print('missing:', missing or 'none')"
```

## To do: serve the serif from Adobe Fonts

Marked to pick up later. Adobe Garamond Pro is commercial, and the copies
installed on this machine are licensed for desktop use. Serving these files from
the published site — which is what `@font-face` does — is webfont use, and Adobe
licenses that through Adobe Fonts, its own hosted embed, rather than by shipping
the files. A Creative Cloud subscription includes it.

The plan is to add the family to an Adobe Fonts web project and swap the two
`@font-face` rules in `style.css` for the kit's stylesheet link, then delete the
woff2 files here. Nothing else about the type should need to change. Until that
happens, the self-hosted pair above is how the serif is served.

## Noto Sans Egyptian Hieroglyphs — the clock

Kept for a different reason: the clock in the topbar is set in Egyptian
hieroglyphs, which are not part of Inter and only exist on a machine whose
system fonts happen to cover that Unicode block. macOS does. A lot of Linux
installs do not, and those visitors would otherwise see empty boxes.

| file | what it is |
| --- | --- |
| `noto-sans-egyptian-hieroglyphs-subset.woff2` | Noto Sans Egyptian Hieroglyphs, cut down to the ten codepoints the clock uses — 6 KB instead of ~150 KB |
| `OFL.txt` | SIL Open Font License 1.1, which requires it ship alongside the font |

`style.css` refers to the woff2 in an `@font-face` whose `unicode-range` lists
those ten codepoints, so the file is only downloaded when one of them is
actually on the page — never on a narrow screen, where the clock is hidden.

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

   That needs `fontTools`, which may not be in the default interpreter — on this
   machine it lives with `pyftsubset` at `/opt/miniconda3/bin/python3`. Expect
   `0x20` plus the ten codepoints; a missing one means the `text=` list and the
   `unicode-range` disagree.

The `text=` parameter is what tells Google Fonts to return a subset instead of
the whole family. Without it you get all ~1,000 hieroglyphs.
