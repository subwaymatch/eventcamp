/**
 * Verifies that every colour pair the themes rely on for text clears
 * WCAG 2.1 AA. Run with `npm run check:contrast`; CI fails on a regression.
 *
 * Accent colours are used two ways: as a display fill (large text, rules,
 * buttons) and as body-copy ink on a light surface. The original template
 * used one value for both, which put 2.1:1 text on white in two themes, so
 * each theme now declares a separate --ec-accent-ink for the text role.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const AA_TEXT = 4.5;
const AA_LARGE = 3;

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

export const parse = (hex) => {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

export const luminance = (hex) => {
  const [r, g, b] = parse(hex).map(srgb);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/** Pull `--name: value;` declarations out of a stylesheet. */
const readTokens = async (file) => {
  const css = await readFile(file, 'utf8');
  const tokens = {};
  for (const [, name, value] of css.matchAll(/(--ec-[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
};

const themesDir = 'templates';
const themes = (await readdir(themesDir, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let failures = 0;
const rows = [];

for (const theme of themes) {
  const tokens = await readTokens(join(themesDir, theme, 'css', 'theme.css'));

  const required = [
    '--ec-accent',
    '--ec-accent-ink',
    '--ec-accent-surface',
    '--ec-accent-contrast',
  ];
  const missing = required.filter((t) => !tokens[t]);
  if (missing.length) {
    console.error(`${theme}: theme.css is missing ${missing.join(', ')}`);
    failures += missing.length;
    continue;
  }

  const accent = tokens['--ec-accent'];
  const ink = tokens['--ec-accent-ink'];
  const surface = tokens['--ec-accent-surface'];
  const onSurface = tokens['--ec-accent-contrast'];
  // Optional per-theme override; defaults to the display accent.
  const onDark = tokens['--ec-accent-on-dark'] ?? accent;

  const checks = [
    // Accent text on the light surfaces uses the darkened ink.
    { what: 'ink on white', fg: ink, bg: '#ffffff', min: AA_TEXT },
    { what: 'ink on muted surface', fg: ink, bg: '#fafafa', min: AA_TEXT },
    // On dark sections the display accent is the text colour.
    { what: 'accent on dark', fg: onDark, bg: '#111111', min: AA_TEXT },
    { what: 'accent on dark-alt', fg: onDark, bg: '#161616', min: AA_TEXT },
    { what: 'accent on black', fg: onDark, bg: '#000000', min: AA_TEXT },
    // Nav underlines and rules are UI components, not text: 3:1 is enough.
    { what: 'accent rule on dark', fg: accent, bg: '#111111', min: AA_LARGE },
    // Anything sitting on an accent fill: buttons, chips, the accent band.
    {
      what: 'contrast on accent surface',
      fg: onSurface,
      bg: surface,
      min: AA_TEXT,
    },
    // Body copy on the light surfaces.
    { what: 'body ink on white', fg: '#333333', bg: '#ffffff', min: AA_TEXT },
    // Muted copy on the dark sections.
    { what: 'muted on dark', fg: '#999999', bg: '#111111', min: AA_LARGE },
  ];

  for (const { what, fg, bg, min } of checks) {
    const ratio = contrast(fg, bg);
    const ok = ratio >= min;
    if (!ok) failures++;
    rows.push(
      `${ok ? 'pass' : 'FAIL'}  ${theme.padEnd(7)} ${what.padEnd(26)} ` +
        `${fg.padEnd(8)} on ${bg.padEnd(8)} ${ratio.toFixed(2).padStart(5)}:1 (min ${min})`,
    );
  }
}

console.log(rows.join('\n'));
console.log(
  failures
    ? `\n${failures} contrast check(s) failed.`
    : `\nAll ${rows.length} contrast checks passed.`,
);
process.exit(failures ? 1 : 0);
