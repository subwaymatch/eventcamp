/**
 * Copies the shared stylesheet, script and fonts into every theme.
 *
 * Each theme folder has to be self-contained — you copy one of them onto a
 * server and it works, no build step, no shared parent directory. That means
 * the common files genuinely are duplicated on disk. They are edited once,
 * in shared/, and this script propagates them.
 *
 *   npm run sync         write the copies
 *   npm run sync:check   fail if any copy is out of date (used by CI)
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const SHARED = 'shared';
const THEMES_DIR = 'templates';

/** [source, destination-relative-to-theme] */
const FILES = [
  ['css/eventcamp.css', 'css/eventcamp.css'],
  ['js/eventcamp.js', 'js/eventcamp.js'],
];

const FONT_DIR = 'fonts';

const check = process.argv.includes('--check');

const themes = (await readdir(THEMES_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

if (!themes.length) {
  console.error(`No theme directories found in ${THEMES_DIR}/`);
  process.exit(1);
}

const stale = [];
let written = 0;

async function place(sourcePath, destPath) {
  const source = await readFile(sourcePath);
  let current = null;
  try {
    current = await readFile(destPath);
  } catch {
    /* not there yet */
  }

  if (current && current.equals(source)) return;

  if (check) {
    stale.push(destPath);
    return;
  }

  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, source);
  written++;
}

for (const theme of themes) {
  for (const [from, to] of FILES) {
    await place(join(SHARED, from), join(THEMES_DIR, theme, to));
  }

  const fonts = await readdir(join(SHARED, FONT_DIR));
  for (const font of fonts) {
    await place(
      join(SHARED, FONT_DIR, font),
      join(THEMES_DIR, theme, FONT_DIR, font),
    );
  }
}

if (check) {
  if (stale.length) {
    console.error(
      'These copies are out of date with shared/. Run `npm run sync`:\n' +
        stale.map((f) => `  ${f}`).join('\n'),
    );
    process.exit(1);
  }
  console.log(`All theme copies are in sync with ${SHARED}/.`);
} else {
  console.log(
    written
      ? `Synced ${written} file(s) into ${themes.length} theme(s).`
      : `Already up to date across ${themes.length} theme(s).`,
  );
}
