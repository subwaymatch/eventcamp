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
  tighter — `-0.011em` on body text, `-0.021em` on headings and `-0.03em` on
  display sizes (section titles, prices, the event name), set as tokens so a
  theme can override them. Inter sets wide by default at screen sizes. Form
  controls now inherit the tracking too; the UA stylesheet resets
  `letter-spacing` on them, and `font: inherit` does not cover it.
- Nothing is set in capitals any more. The navigation, section titles,
  buttons, fact labels, FAQ group titles, timetable headings and contact
  headings were all `text-transform: uppercase` with up to `0.2em` of
  tracking to compensate; they are sentence case now, at the same tight
  tracking as everything else, with sizes and weights adjusted to hold the
  hierarchy without the capitals.
- The event names in the heroes are live text, not PNGs of text: "Loopathon"
  in Inter 200 beside the loop mark, "Eventcamp" in Inter 800 under a
  "Web developers' conference" kicker, and "The Trio" in bold PT Serif
  under an italic strapline. A theme sets the face, weight and size with
  `--ec-hero-font`, `--ec-hero-weight` and `--ec-hero-size`. Changing the
  name is now an edit to `index.html` rather than to an image, and the text
  scales without blurring, translates and can be found by search.
- The loop mark is Lucide's `infinity` icon in the sprite, replacing
  `loop.png`.
- Each sponsor is a mark plus its name as text. The marks are four low-poly
  gems regenerated with `gpt-image-2.5-sunburst` on a transparent
  background; the names are set in four type treatments (`--bold`,
  `--light`, `--serif`, `--black`) so the row still reads as four
  companies. The sponsor row is a single line on wide screens and a
  two-column grid on narrow ones.
- Section titles carry a short accent rule, the same mark the navigation
  uses for the current section.
- Price cards are outlined, carry an accent top rule, and pin their buttons
  to the bottom so a row of them lines up.
- The red theme's topics stack the icon above the text. Side by side, each
  description was about twenty characters a line.
- The timetable's time column shrinks to fit its contents. It took a third
  of the table's width and pushed every session away from its time.
- News thumbnails float beside the text on phones too, instead of stacking
  as lone squares between paragraphs.
- The download link is one outlined button with a single label, replacing
  two stacked white boxes.
- The yellow theme's tickets use the spotlight surface. They followed the
  concert programme on the same `--dark` surface, so the two sections ran
  together, and the price cards, also `#111`, disappeared into both.
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
  times the size they are drawn at.

### Fixed

- Event details were out of line in every hero. The fact bar's row is as
  tall as its tallest fact, and the shorter facts spread the extra height
  between label and value, so "Saturday, 16 May 2026" sat 11px below
  "Lakeshore". The red theme's testimonials had the same fault, which put
  the two attributions and bubbles at different heights.
- The testimonial bubbles pointed away from the people quoted: the
  attribution was above the bubble and the tail pointed down at nothing.
  The quote now comes first and the tail points at the avatar.
- In dark mode the testimonial bubbles vanished: `#121212` on a `#111`
  section. They use a new `--ec-surface-raised` token, `#222` in dark mode.
- In dark mode the light sections' accent text switched to the raw display
  accent rather than the on-dark one, which put the red theme's section
  leads and timetable headings at 4.10:1. It now uses
  `--ec-accent-on-dark` (5.46:1), and `npm run check:contrast` asserts the
  accent against both dark-mode surfaces.
- The "Sponsors" heading was `#333` on `#111`, 1.49:1. It is now `#999`,
  6.63:1.
- The REDY sponsor mark had its name baked in dark grey and was illegible
  on the sponsor band. The name is now text.
- The map heading sat bare on the map tiles, which are light and busy, so
  in dark mode it was white on pale grey. It sits on a plate in the
  page's surface colour.
- Button hover put accent ink on white. In dark mode that is the light
  accent, 2.76:1 in green and 2.12:1 in yellow. Hover is now near-black on
  white in every scheme.
- The FAQ chevron overhung the rule beneath it by a couple of pixels.
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
