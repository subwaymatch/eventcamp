# Credits and third-party notices

Everything in this repository is redistributable. This file records what
comes from where, so you can ship it without guessing.

## The template

Originally designed and built by **Ye Joo Park**, released under the
[MIT License](LICENSE). Version 2.0 is a rewrite of the front-end code that
keeps the original visual design.

## Fonts

Bundled in every theme's `fonts/` directory, Latin subset only. Inter is the
variable WOFF2 build distributed by [Fontsource](https://fontsource.org/);
PT Serif was converted to WOFF2 by Google Fonts. Both are under the
[SIL Open Font License 1.1](https://scripts.sil.org/OFL); the full text ships
alongside them in `fonts/OFL.txt`, as the licence requires.

| Family                                                 | Copyright                                |
| ------------------------------------------------------ | ---------------------------------------- |
| [Inter](https://github.com/rsms/inter)                 | Copyright 2016 The Inter Project Authors |
| [PT Serif](https://fonts.google.com/specimen/PT+Serif) | Copyright (c) 2010, ParaType Ltd.        |

The OFL permits redistribution and modification, including commercially, but
the fonts may not be sold on their own and any modified version may not use a
Reserved Font Name.

## Icons

The interface icons — calendar, clock, map pin, download, the topic marks in
the red theme — are [Lucide](https://lucide.dev/) icons, inlined into each
theme's SVG sprite rather than loaded from a package, so a theme folder stays
self-contained. Lucide is under the
[ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE),
Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part
of Feather (MIT), and all other copyright (c) for Lucide are held by Lucide
Contributors 2022.

They are drawn on Lucide's 24×24 grid and stroked with `currentColor` at
1.5, set once in `eventcamp.css` — so recolouring or reweighting them is a
CSS change, and swapping one is a matter of pasting a different icon's paths
into the `<symbol>`.

The Facebook, X and YouTube glyphs in the footer are not Lucide's — it does
not ship brand marks — and remain hand-drawn paths. They are those companies'
trademarks, included so the social links are recognisable. Using them to link
to your own profiles is ordinary referential use; using them to suggest
endorsement is not, and each company publishes its own brand guidelines.

## Photographs and artwork

The images in `templates/*/images/` are covered by this repository's MIT
licence. They come from two places:

- **The photographs are generated**, with OpenAI's `gpt-image-2.5`, and
  replaced the original template's stock photography. They were regenerated
  because the originals fought the layout: the hero image was a 3:1 panorama
  in a 2:1 frame, so most of it was cropped away, and the portraits and
  thumbnails had no resolution to spare on a high-density screen. Each new
  file is composed for the crop it sits in and is two to three times the size
  it is drawn at.
- **The wordmarks, the loop mark and the sponsor marks are the original
  artwork**, kept as they are. They carry lettering and brand geometry, which
  is the one thing an image model reliably mangles.

Three practical notes before you publish:

- **Nobody in these photographs exists.** They are plausible faces attached
  to invented names and invented biographies. Replace them with images of
  your actual speakers or performers — shipping a real event page with
  synthetic people is misleading, not merely untidy.
- **The copy is invented too.** The prices, dates, quotes, attributed
  statements and news items read as though they were real, and none of them
  are.
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
