# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A live preview page per theme at `/preview/<theme>/` on the demo site. The
  preview is the template itself in a frame, and the width switcher resizes
  that frame, so choosing Tablet or Phone reflows the layout the way a
  device would rather than scaling a picture of a wide page. The switcher is
  three radio buttons and a sibling selector, so it works with JavaScript
  disabled.
- The theme list now shows each template running, scaled into its card,
  loaded only as a card nears the viewport. Without JavaScript the
  screenshots stay and the cards still link to the preview pages.

### Changed

- `npm run check:html` validates every page under `site/`, not only the ones
  at its top level.

- Inter replaces Open Sans as the body and heading face, tracked slightly
  tighter — `-0.011em` on body text and `-0.021em` on headings, set as
  tokens so a theme can override them. Inter sets wide by default at screen
  sizes; the letterspaced uppercase labels keep their own positive tracking.
- The interface icons are now [Lucide](https://lucide.dev/), inlined into
  each theme's sprite on the same 24×24 grid and the same `currentColor`
  stroke the old hand-drawn set used, so no CSS changed. This also fixes the
  "atom" mark in the red theme, which had lost its orbits and was rendering
  as a bare dot.
- Every placeholder passage is now real copy. The lorem ipsum is gone from
  all three themes, along with the placeholder people ("Namq", "Atom Husky"
  of "Boring CSS"), the aphorisms standing in for attendee testimonials, and
  the "John Doe / (123) 456-7890" contact block. Phone numbers now sit in
  the 555-01xx range and mail stays on example.com — both reserved for
  fiction, so a template cannot route a reader's registration to a real
  person.
- The photography is regenerated with OpenAI's `gpt-image-2.5` and composed
  for the crops it sits in. The hero was a 3:1 panorama in a roughly 2:1
  frame, so a third of it was being cropped away and what was left was
  upscaled; it is now 2:1 and dark through the middle where the wordmark
  sits. The speaker, performer, news and testimonial images had no
  resolution to spare on a high-density screen and are now two to three
  times the size they are drawn at. The wordmarks, the loop mark and the
  sponsor marks are untouched — they carry lettering, which is what an image
  model mangles.

### Fixed

- `npm run sync` now removes files from a theme's `fonts/` that `shared/`
  no longer has, and `npm run sync:check` fails on them. Dropping a face
  previously left every theme carrying the old file, still shipped in the
  release archives and invisible to the check, which only compared the files
  shared/ did have.

## [2.0.0] — 2026-09-17

A rewrite of the front-end code that keeps the original visual design. The
template is now dependency-free, accessible and deployable to Cloudflare
Workers or GitHub Pages out of the box.

### Fixed

- **The page's JavaScript never ran.** `$('a[href*=#]:not([href=#])')` is not
  a valid selector under jQuery 3, which throws
  `Syntax error, unrecognized expression` rather than tolerating it. The
  error aborted the `ready` handler on its first line, so smooth scrolling,
  the scrollspy nav highlight, the mobile navigation and all form validation
  were dead in every theme. Reproduced in Chromium before the rewrite.
- Accent colours failed WCAG AA as text: green was 2.76:1 on white and gold
  2.12:1, where body text needs 4.5:1. Each theme now declares separate
  display, ink, surface and on-dark accent roles, all asserted in CI.
- Event dates contradicted themselves — a page headed "2013" advertised
  "March 27th, 2012" and, further down, "27 March 2013".

### Removed

- The PHP templates (`templates-php/`), which duplicated the HTML ones in
  full and existed only to carry a `mail()` handler.
- The arithmetic captcha, whose answer shipped in a hidden input beside the
  question. A honeypot field replaces it.
- jQuery, bootstrap-scrollspy.js, selectnav.js, the Skeleton float grid and
  the YUI reset.
- 322 single-purpose transparent PNGs per theme, used to fake alpha
  backgrounds before `rgba()`.
- The Photoshop source files, 93% of the repository by size. They remain in
  the git history.
- The `documentation/` folder, which demonstrated the grid and alpha classes
  that no longer exist and whose images were already missing.

### Added

- `prefers-color-scheme` support, so light sections darken for readers who
  ask for a dark interface.
- `prefers-reduced-motion` support.
- A print stylesheet.
- Self-hosted WOFF2 fonts, replacing the Google Fonts request. The SIL Open
  Font License ships beside them.
- Open Graph and Twitter Card metadata.
- `scripts/check-contrast.mjs`, `scripts/sync-shared.mjs` and
  `scripts/build-site.mjs`, wired to `npm test`.
- GitHub Actions workflows for CI, GitHub Pages and releases.
- `wrangler.jsonc` for an assets-only Cloudflare Worker.
- A landing page for the demo deployment.
- `CONTRIBUTING.md` and `CREDITS.md`.

### Changed

- Markup is now semantic: `<header>`, `<nav>`, `<main>`, `<section>`,
  `<footer>`, `<article>`, `<time>`, `<address>` and `<table>` in place of
  nested `<div id="section-…">`. The FAQ is `<details>`/`<summary>`, the
  concert programme a `<dl>`, the timetable a real table with scoped headers.
- Layout uses CSS Grid and fluid `clamp()` type; the 960px float grid and its
  `<div class="clear">` spacers are gone.
- Navigation is a disclosure panel with `aria-expanded`, Escape-to-close and
  click-outside, instead of a JavaScript-generated `<select>`.
- Scrollspy uses `IntersectionObserver` and marks the current link with
  `aria-current`.
- Icons are inline SVG inheriting `currentColor`, replacing PNG sprites.
- Maps embed OpenStreetMap — no API key, no tracking cookies.
- Images carry intrinsic `width`/`height` to reserve space, and below-the-fold
  images are lazily loaded.
- `templates-html/` is now `templates/`, and the shared stylesheet, script and
  fonts live in `shared/`, synced into each theme by `npm run sync`.
- Release archives are per theme, plus one combined archive.

## [1.x] — 2020 and earlier

The original template: a responsive event page in three themes, built on
jQuery, the Skeleton grid and PHP contact forms.
