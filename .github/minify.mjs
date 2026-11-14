// shrinks the built site before it goes live: html, css and js lose comments and whitespace,
// and js local names are shortened (mangled) so the published code is hard to read.
// the repo keeps the readable, commented source; only the published copy is changed.
// usage: node minify.mjs <folder>
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as minifyJs } from "terser";
import CleanCSS from "clean-css";

const root = process.argv[2];
// js settings: compress and rename local variables, but keep global names
// (pages call functions from onclick="..." attributes, so those must not change)
const jsOptions = { compress: true, mangle: true, toplevel: false, format: { comments: false } };
const css = new CleanCSS({ level: 1 });

// every file under the folder, skipping hidden folders like .git
async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

let done = 0, saved = 0;
for await (const path of files(root)) {
  const ext = extname(path).toLowerCase();
  if (![".html", ".htm", ".js", ".mjs", ".css"].includes(ext)) continue;
  if (/\.min\.(js|css)$/.test(path)) continue;          // already minified by someone else
  const before = await readFile(path, "utf8");
  let after;
  if (ext === ".css") after = css.minify(before).styles;
  else if (ext === ".js" || ext === ".mjs") after = (await minifyJs(before, { ...jsOptions, module: ext === ".mjs" })).code;
  else after = await minifyHtml(before, {
    collapseWhitespace: true, conservativeCollapse: true,   // keep one space where spacing could matter
    removeComments: true, minifyCSS: true, minifyJS: jsOptions,
    keepClosingSlash: true, decodeEntities: false,
  });
  if (after && after.length < before.length) {
    await writeFile(path, after);
    done++; saved += before.length - after.length;
  }
}
console.log(`minified ${done} files, ${Math.round(saved / 1024)} KB smaller`);
