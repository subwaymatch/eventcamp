/*!
 * Eventcamp — progressive enhancement
 *
 * Replaces jQuery 3.x, bootstrap-scrollspy.js and selectnav.js with
 * dependency-free code against platform APIs. Everything here is an
 * enhancement: with JavaScript disabled the navigation still links, the
 * FAQ still opens (native <details>) and the form still submits.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
   * Mobile navigation
   *
   * The same <ul> serves every viewport. On small screens it becomes a
   * disclosure panel driven by the `hidden` attribute, so assistive tech
   * and the keyboard get the open/closed state for free.
   * ------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('[data-ec-nav-toggle]');
    var list = document.querySelector('[data-ec-nav-list]');
    if (!toggle || !list) return;

    var mobile = window.matchMedia('(max-width: 47.99em)');

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      list.hidden = !open;
    }

    // Only collapse where the panel layout actually applies; on wide
    // screens the list is always visible and the toggle is hidden.
    function sync() {
      if (mobile.matches) {
        setOpen(false);
      } else {
        list.hidden = false;
        toggle.setAttribute('aria-expanded', 'false');
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    list.addEventListener('click', function (event) {
      if (event.target.closest('a') && mobile.matches) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false);
      toggle.focus();
    });

    document.addEventListener('click', function (event) {
      if (!mobile.matches) return;
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.target.closest('[data-ec-nav-list], [data-ec-nav-toggle]'))
        return;
      setOpen(false);
    });

    mobile.addEventListener('change', sync);
    sync();
  }

  /* ---------------------------------------------------------------------
   * Scrollspy
   *
   * IntersectionObserver instead of scroll-handler maths: the browser
   * reports which sections are on screen and we mark the highest one.
   * ------------------------------------------------------------------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('[data-ec-nav-list] a[href^="#"]'),
    );
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var targets = [];

    links.forEach(function (link) {
      var id = decodeURIComponent(link.hash.slice(1));
      var section = id && document.getElementById(id);
      if (!section) return;
      byId[id] = link;
      targets.push(section);
    });
    if (!targets.length) return;

    var visible = new Set();

    function highlight() {
      var best = null;
      var bestTop = Infinity;

      visible.forEach(function (section) {
        var top = section.getBoundingClientRect().top;
        if (top < bestTop) {
          bestTop = top;
          best = section;
        }
      });

      links.forEach(function (link) {
        if (best && byId[best.id] === link) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.add(entry.target);
          } else {
            visible.delete(entry.target);
          }
        });
        highlight();
      },
      // Discount the fixed header so a section counts as "current" only
      // once it is actually under it.
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );

    targets.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------------------------------------------------------------------
   * Move focus with the viewport
   *
   * Native CSS smooth scrolling handles the movement; a same-page jump
   * should also move keyboard focus, which browsers skip for non-focusable
   * targets.
   * ------------------------------------------------------------------- */
  function initAnchorFocus() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link || link.hash === '#' || link.hasAttribute('data-ec-no-focus'))
        return;
      if (link.origin !== window.location.origin) return;
      if (link.pathname !== window.location.pathname) return;

      var target = document.getElementById(
        decodeURIComponent(link.hash.slice(1)),
      );
      if (!target) return;

      // Let the browser do the scrolling, then hand over focus.
      window.requestAnimationFrame(function () {
        if (!target.hasAttribute('tabindex'))
          target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Form validation
   *
   * Built on the Constraint Validation API, so the rules live in the HTML
   * (`required`, `type="email"`, `pattern`) and stay enforced when
   * JavaScript is unavailable.
   * ------------------------------------------------------------------- */
  function initForms() {
    var forms = document.querySelectorAll('[data-ec-form]');

    Array.prototype.forEach.call(forms, function (form) {
      var status = form.querySelector('[data-ec-form-status]');
      var fields = Array.prototype.slice.call(
        form.querySelectorAll('.ec-field__control'),
      );

      function messageFor(field) {
        if (field.validity.valueMissing) {
          return field.dataset.ecRequiredMessage || 'This field is required.';
        }
        if (field.validity.typeMismatch && field.type === 'email') {
          return 'Enter an email address, for example name@example.com.';
        }
        if (field.validity.tooShort) {
          return 'Use at least ' + field.minLength + ' characters.';
        }
        return field.validationMessage;
      }

      function showError(field) {
        var slot = form.querySelector('#' + field.id + '-error');
        if (field.checkValidity()) {
          field.removeAttribute('aria-invalid');
          if (slot) slot.textContent = '';
          return true;
        }
        field.setAttribute('aria-invalid', 'true');
        if (slot) slot.textContent = messageFor(field);
        return false;
      }

      fields.forEach(function (field) {
        // Validate on the way out, then live once it has been flagged, so
        // nobody is told they are wrong mid-word.
        field.addEventListener('blur', function () {
          showError(field);
        });
        field.addEventListener('input', function () {
          if (field.hasAttribute('aria-invalid')) showError(field);
        });
      });

      function setStatus(kind, html) {
        if (!status) return;
        status.className = 'ec-form__status ec-form__status--' + kind;
        status.innerHTML = html;
      }

      form.addEventListener('submit', function (event) {
        var invalid = fields.filter(function (field) {
          return !showError(field);
        });

        if (invalid.length) {
          event.preventDefault();
          setStatus(
            'error',
            'Please check the highlighted ' +
              (invalid.length === 1 ? 'field' : 'fields') +
              '.',
          );
          invalid[0].focus();
          return;
        }

        if (status) {
          status.className = 'ec-form__status';
          status.textContent = '';
        }

        // No endpoint wired up yet: say so rather than silently doing
        // nothing. Set the form's action to remove this branch.
        if (form.hasAttribute('data-ec-demo')) {
          event.preventDefault();
          setStatus(
            'success',
            '<strong>Looks good — but nothing was sent.</strong> ' +
              'This demo form has no endpoint behind it. Point the form’s ' +
              '<code>action</code> at your own form handler to start ' +
              'receiving registrations.',
          );
          form.reset();
          status.setAttribute('tabindex', '-1');
          status.focus();
        }
      });
    });
  }

  function init() {
    initNav();
    initScrollSpy();
    initAnchorFocus();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
