# fonts/

One font, kept for one reason: the clock in the topbar is set in Egyptian
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

## Regenerating

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
