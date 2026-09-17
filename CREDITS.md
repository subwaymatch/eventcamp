# Credits and third-party notices

Everything in this repository is redistributable. This file records what
comes from where, so you can ship it without guessing.

## The template

Originally designed and built by **Ye Joo Park**, released under the
[MIT License](LICENSE). Version 2.0 is a rewrite of the front-end code that
keeps the original visual design.

## Fonts

Bundled in every theme's `fonts/` directory, Latin subset only, converted to
WOFF2 by Google Fonts. Both are under the
[SIL Open Font License 1.1](https://scripts.sil.org/OFL); the full text ships
alongside them in `fonts/OFL.txt`, as the licence requires.

| Family                                                   | Copyright                                    |
| -------------------------------------------------------- | -------------------------------------------- |
| [Open Sans](https://fonts.google.com/specimen/Open+Sans) | Copyright 2020 The Open Sans Project Authors |
| [PT Serif](https://fonts.google.com/specimen/PT+Serif)   | Copyright (c) 2010, ParaType Ltd.            |

The OFL permits redistribution and modification, including commercially, but
the fonts may not be sold on their own and any modified version may not use a
Reserved Font Name.

## Icons

The interface icons — calendar, clock, map pin, download, the eight topic
marks in the red theme — are inline SVG written for this repository and
covered by its MIT licence. They replace the PNG icon sets that earlier
versions shipped.

The Facebook, X and YouTube glyphs in the footer are those companies'
trademarks, included so the social links are recognisable. Using them to link
to your own profiles is ordinary referential use; using them to suggest
endorsement is not, and each company publishes its own brand guidelines.

## Photographs and artwork

The photographs, logos and sponsor marks in `templates/*/images/` came with
the original template and are covered by this repository's MIT licence.

Two practical notes before you publish:

- **The photographs of people are stock placeholders.** Replace them with
  images of your actual speakers or performers. Shipping a real event page
  with placeholder faces is confusing at best.
- **The sponsor logos are invented brands** ("Sponsor United", "Evergreen",
  "Gold Diggers", "Redy") drawn for the template. They are not real
  companies.

## Maps

The map sections embed [OpenStreetMap](https://www.openstreetmap.org/), whose
data is © OpenStreetMap contributors, available under the
[Open Database License](https://www.openstreetmap.org/copyright). The embed
renders OSM's own attribution. If you swap in Google Maps — the alternative
URL is in a comment next to each iframe — their terms apply instead.

## What was removed

Earlier versions bundled third-party code that this version no longer needs:

| Removed                                           | Was used for                                | Replaced by                                     |
| ------------------------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| jQuery 3.7.1 (CDN)                                | DOM, events, Ajax                           | Platform APIs                                   |
| bootstrap-scrollspy.js (Apache-2.0, Twitter Inc.) | Highlighting the current nav item           | `IntersectionObserver`                          |
| selectnav.js (MIT, Łukasz Fiszer)                 | Turning the nav into a `<select>` on phones | A disclosure panel using the `hidden` attribute |
| Skeleton grid v1.1 (MIT, Dave Gamache)            | The 960px float grid                        | CSS Grid                                        |
| YUI CSS reset                                     | Normalising browser defaults                | A short modern reset                            |

The Photoshop source files (`.psd`) that earlier versions carried are no
longer in the working tree — they made up 93% of the repository. They remain
in the git history and in releases tagged before v2.0.0.
