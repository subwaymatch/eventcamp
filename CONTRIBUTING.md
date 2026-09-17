# Contributing

Thanks for taking a look. Bug reports, theme fixes and accessibility
improvements are all welcome.

## Getting set up

```bash
npm install
npm run dev     # builds _site/ and serves it on http://localhost:8787
```

## The one rule that will bite you

**Edit `shared/`, never `templates/*/css/eventcamp.css` or
`templates/*/js/eventcamp.js`.**

Each theme folder carries its own copy of the shared stylesheet, script and
fonts, because a theme has to work when you copy that one folder onto a
server. Those copies are generated:

```bash
npm run sync          # copy shared/ into every theme
npm run sync:check    # fail if a copy has drifted (this is what CI runs)
```

A change made directly in a theme copy will be overwritten the next time
anyone runs `npm run sync`.

`templates/*/css/theme.css` is the exception — it is genuinely per-theme and
is edited in place.

## Before you open a pull request

```bash
npm test
```

That runs four checks:

| Check            | What it catches                                              |
| ---------------- | ------------------------------------------------------------ |
| `sync:check`     | A theme copy that has drifted from `shared/`                 |
| `check:html`     | Invalid or inaccessible markup (`html-validate`)             |
| `check:contrast` | A colour pair that falls below WCAG AA                       |
| `check:format`   | Anything Prettier would reformat — `npm run format` fixes it |

## Things worth knowing

- **No dependencies at runtime.** Adding a library to the templates is
  almost certainly the wrong fix; the point of the project is that a theme is
  a folder of static files.
- **Everything degrades.** If you add behaviour, make the page work without
  it. The navigation links, the FAQ opens and the form submits with
  JavaScript disabled — keep it that way.
- **Colours go through the tokens.** A new colour belongs in `theme.css` as a
  custom property, and if text sits on it, add it to
  `scripts/check-contrast.mjs`.
- **Keep the three themes structurally parallel.** They differ in content and
  which sections they use, not in how a section is built.

## Adding a theme

1. Copy an existing folder in `templates/`.
2. Edit `css/theme.css` — accent roles and hero image.
3. Replace `images/` and the content in `index.html`.
4. `npm run sync && npm test`.

`scripts/` discovers themes by listing `templates/`, so a new folder is
picked up by the contrast check, the build and the release archives with no
further wiring.
