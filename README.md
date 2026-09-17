# Eventcamp

Three free website templates for events and conferences — a charity run, a
one-day conference and a concert night. Pick a theme, edit the HTML, put the
folder on a server. There is no build step, no framework and nothing to
install.

| Green                                          | Red                                        | Yellow                                           |
| ---------------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| ![The green theme](docs/screenshots/green.png) | ![The red theme](docs/screenshots/red.png) | ![The yellow theme](docs/screenshots/yellow.png) |

Live previews, each the template itself running at a width you pick:
[green](https://subwaymatch.github.io/eventcamp/preview/green/) ·
[red](https://subwaymatch.github.io/eventcamp/preview/red/) ·
[yellow](https://subwaymatch.github.io/eventcamp/preview/yellow/).

- **No dependencies.** No jQuery, no CSS framework, no npm packages at
  runtime. About 250 lines of plain JavaScript, all of it optional.
- **No third-party requests.** Fonts are self-hosted and the map is an
  OpenStreetMap embed, so a visitor's browser talks only to your server.
- **Accessible.** Semantic landmarks, a skip link, visible focus states,
  keyboard navigation and a form built on native constraint validation.
  Every colour pair is checked against WCAG AA in CI.
- **Responsive.** CSS Grid and fluid type, from a 320px phone up.
- **MIT licensed.** Use it commercially, modify it, redistribute it.

## Quick start

1. Download a theme from the
   [Releases](https://github.com/subwaymatch/eventcamp/releases) page, or
   copy a folder out of `templates/`.
2. Open `index.html` and replace the text, images and event details.
3. Upload the folder to any static host.

Each theme folder is self-contained — HTML, CSS, JavaScript, fonts and
images — so nothing else needs to travel with it.

```
templates/green/
├── index.html
├── css/
│   ├── eventcamp.css   shared stylesheet (identical in every theme)
│   └── theme.css       this theme's colours and hero image
├── js/eventcamp.js     shared script (identical in every theme)
├── fonts/              Open Sans and PT Serif, Latin subset, WOFF2
└── images/
```

## Connecting the form

The templates ship without a backend, so the registration and contact forms
are inert: submitting one reports that nothing was sent. To collect real
submissions, edit the `<form>` in `index.html`:

```html
<!-- before -->
<form
  class="ec-form"
  method="post"
  action="#"
  data-ec-form
  data-ec-demo
  novalidate
>
  <!-- after -->
  <form
    class="ec-form"
    method="post"
    action="https://example.com/your-handler"
    data-ec-form
    novalidate
  ></form>
</form>
```

Point `action` at whatever you run — a hosted form service, a serverless
function, your own endpoint — and delete `data-ec-demo`. The form posts
ordinary `application/x-www-form-urlencoded` fields, so anything that accepts
a normal HTML form submission will work.

Validation, the honeypot field and the error summary keep working either way,
and the form still submits with JavaScript turned off.

> The template previously shipped a PHP `mail()` handler and an arithmetic
> captcha whose answer sat in a hidden field beside the question. Both are
> gone: the captcha stopped nothing, and a static template should not require
> PHP. A honeypot field replaces it.

## Customising a theme

A theme is a short list of CSS custom properties. `css/theme.css` is the only
stylesheet that differs between the three — `css/eventcamp.css` is
byte-identical everywhere.

```css
:root {
  --ec-accent: #77aa44; /* the display hue: rules, borders, large headings */
  --ec-accent-ink: #4f7629; /* accent text on light backgrounds */
  --ec-accent-surface: #4f7629; /* accent used as a background behind text */
  --ec-accent-contrast: #fff; /* text sitting on that background */
  --ec-hero-image: url('../images/bg_eventcamp.jpg');
}
```

Four accent roles rather than one, because a single hex cannot both read as
body text on white and look like the brand. `npm run check:contrast` asserts
every pairing against WCAG AA, so a colour change that breaks readability
fails the build rather than shipping.

Sections pick a surface with one class — `ec-section--light`,
`--muted`, `--accent`, `--dark`, `--darker` or `--spotlight` — and everything
inside inherits sensible colours from it. Layout helpers are `ec-grid` plus
`ec-cols-2`, `ec-cols-3`, `ec-cols-4` or `ec-split`.

The whole page respects `prefers-color-scheme`, so the light sections darken
automatically for readers who ask for a dark interface.

## Deploying

Both targets serve the same `_site/` directory. Every URL in the templates is
relative, so the output works at a domain root _and_ under a
`/<repo>/` path without changes.

```bash
npm install
npm run build     # writes _site/
npm run dev       # writes _site/ and serves it on http://localhost:8787
```

`_site/` is the theme list at `/`, each theme verbatim at `/<theme>/`, and a
preview page at `/preview/<theme>/` that loads the theme in a frame you can
narrow to tablet or phone. Narrowing the frame narrows the template's
viewport, so the layout reflows exactly as it would on a device rather than
being a scaled picture of a wide page. The preview pages need no JavaScript;
the theme list uses a little to swap its screenshots for running templates,
and keeps the screenshots without it.

### GitHub Pages

The included workflow builds and publishes on every push to `main`. Enable it
once:

1. **Settings → Pages → Build and deployment → Source** → **GitHub Actions**.
2. Push to `main`.

The site lands at `https://<user>.github.io/<repo>/`.

> If what you get there is this README, rendered, rather than the theme
> list, the source is still **Deploy from a branch**: GitHub is running
> Jekyll over the repository and serving that instead of the workflow's
> output. The workflow still reports a green deploy in that state, so the
> setting is the thing to check — a built page answers at
> `/<repo>/green/`, a Jekyll one 404s there and answers at
> `/<repo>/templates/green/`.

### Cloudflare Workers

`wrangler.jsonc` configures an assets-only Worker: there is no Worker script,
so Cloudflare serves the files straight from its edge and nothing runs per
request.

```bash
npx wrangler login
npm run build
npx wrangler deploy
```

The site lands at `https://eventcamp.<your-subdomain>.workers.dev`. Change
`name` in `wrangler.jsonc` to rename it, or attach a custom domain from the
Cloudflare dashboard.

To deploy from CI instead, add a `CLOUDFLARE_API_TOKEN` secret and run
`wrangler deploy` in a workflow step.

### Anywhere else

`_site/` is plain static files. Netlify, Vercel, S3, nginx, a USB stick — all
fine. So is a single theme folder on its own.

## Working on the templates

```bash
npm install
npm test          # sync check, HTML validation, contrast, formatting
npm run format    # apply Prettier
npm run sync      # copy shared/ into each theme
```

`shared/` holds the single source of truth for the common stylesheet, script
and fonts; `npm run sync` copies them into each theme so that each folder
stays independently usable. CI fails if a copy has drifted, so edit
`shared/`, never `templates/*/css/eventcamp.css`.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari. The CSS uses custom
properties, Grid, `clamp()` and logical properties; the JavaScript uses
`IntersectionObserver` and the Constraint Validation API. There is no
transpilation and no polyfill, and every enhancement degrades: with
JavaScript off, the navigation still links, the FAQ still opens and the form
still submits.

## Licence

[MIT](LICENSE). The bundled fonts are under the SIL Open Font License —
see [CREDITS.md](CREDITS.md) for the full attribution of everything that
ships in this repository.
