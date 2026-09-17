/* -------------------------------------------------------------------------
   Turns the landing page's screenshots into live previews.

   Each card holds a screenshot and a data-preview pointing at a theme. Once
   a card comes near the viewport its theme is loaded into an iframe sized to
   a 1280px desktop viewport and scaled down over the screenshot, so the card
   shows the template running rather than a picture of it. Loading is
   deferred because each preview is a whole page — fonts, hero image and all.

   Everything here is an enhancement: with scripting off, or on a browser
   without IntersectionObserver, the screenshots stay and the cards still
   link to /preview/<theme>/, which needs no JavaScript at all.
   ------------------------------------------------------------------------- */

// The viewport width each preview renders at. The card crops to 8:5, which
// is the aspect ratio of the screenshots underneath.
const VIEWPORT = 1280;
const HEIGHT = VIEWPORT * 0.625;

const shots = document.querySelectorAll('[data-preview]');

if (shots.length && 'IntersectionObserver' in window) {
  // A scale rather than a narrow iframe: the point of the card is to show
  // the desktop layout, and 1280px of it has to fit in ~20rem.
  const fit = (shot) => {
    const scale = shot.clientWidth / VIEWPORT;
    if (scale > 0) shot.style.setProperty('--preview-scale', String(scale));
  };

  const resizes =
    'ResizeObserver' in window
      ? new ResizeObserver((entries) => {
          for (const entry of entries) fit(entry.target);
        })
      : null;

  const load = (shot) => {
    const frame = document.createElement('iframe');

    // The card is a picture, not a place to interact: the whole card is
    // already a link to the preview page. inert keeps the frame's contents
    // out of the tab order and away from assistive technology, and the
    // sandbox blocks form submission, downloads and any navigation of the
    // page around it. allow-same-origin stays because the fonts are fetched
    // with CORS: an opaque origin fails them and the preview falls back to
    // system faces, which is the one thing a preview must not do.
    const theme = shot.dataset.preview.replace(/\/$/, '');

    frame.src = shot.dataset.preview;
    frame.title = `Preview of the ${theme} theme`;
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('inert', '');
    frame.setAttribute('tabindex', '-1');
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    frame.setAttribute('scrolling', 'no');
    // Sized here rather than in the stylesheet so that the width the scale
    // is computed from and the width the frame renders at cannot drift.
    frame.width = VIEWPORT;
    frame.height = HEIGHT;
    frame.addEventListener('load', () => shot.classList.add('is-live'), {
      once: true,
    });

    fit(shot);
    resizes?.observe(shot);
    shot.append(frame);
  };

  // 400px of margin: start fetching a card just before it is scrolled to.
  const viewport = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        load(entry.target);
      }
    },
    { rootMargin: '400px' },
  );

  for (const shot of shots) viewport.observe(shot);
}
