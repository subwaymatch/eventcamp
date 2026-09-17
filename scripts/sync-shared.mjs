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
import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
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
const orphans = [];
let written = 0;
let removed = 0;

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

/**
 * Deletes anything in a theme's fonts/ that shared/fonts/ no longer has.
 * Without this, dropping a face leaves every theme carrying the old file —
 * still shipped, still in the release archives, and invisible to the check
 * above, which only compares the files shared/ does have.
 */
async function prune(dir, keep) {
  let present;
  try {
    present = await readdir(dir);
  } catch {
    return; // the theme has no fonts/ yet
  }

  for (const name of present) {
    if (keep.has(name)) continue;
    const path = join(dir, name);
    if (check) {
      orphans.push(path);
      continue;
    }
    await rm(path);
    removed++;
  }
}

const fonts = await readdir(join(SHARED, FONT_DIR));

for (const theme of themes) {
  for (const [from, to] of FILES) {
    await place(join(SHARED, from), join(THEMES_DIR, theme, to));
  }

  for (const font of fonts) {
    await place(
      join(SHARED, FONT_DIR, font),
      join(THEMES_DIR, theme, FONT_DIR, font),
    );
  }

  await prune(join(THEMES_DIR, theme, FONT_DIR), new Set(fonts));
}

if (check) {
  if (stale.length || orphans.length) {
    const lines = [];
    if (stale.length) {
      lines.push(
        'These copies are out of date with shared/:',
        ...stale.map((f) => `  ${f}`),
      );
    }
    if (orphans.length) {
      lines.push(
        'These files are no longer in shared/ and should go:',
        ...orphans.map((f) => `  ${f}`),
      );
    }
    lines.push('Run `npm run sync`.');
    console.error(lines.join('\n'));
    process.exit(1);
  }
  console.log(`All theme copies are in sync with ${SHARED}/.`);
} else {
  const changes = [
    written && `synced ${written} file(s)`,
    removed && `removed ${removed} stale file(s)`,
  ].filter(Boolean);

  console.log(
    changes.length
      ? `${changes.join(', ')} across ${themes.length} theme(s).`
      : `Already up to date across ${themes.length} theme(s).`,
  );
}
