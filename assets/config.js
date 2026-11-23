/* ============================================================
   Castilliai site settings: edit this one file.
   ============================================================ */
window.CASTILLIAI_CONFIG = {
  // MTD Software Compare site. While this is "[MTD SITE LINK]" (or empty),
  // the MTD buttons show "Launching soon". Paste the full URL to switch them on,
  // e.g. "https://www.mtdsoftwarecompare.co.uk/"
  MTD_SITE_URL: "https://mtdsoftwarecompare.co.uk",

  // Contact email shown across the site (every link marked data-contact).
  CONTACT_EMAIL: "danwyatt398@gmail.com",

  // Compliance toolkit waitlist form. PLACEHOLDER: paste a form endpoint that
  // accepts a POST of form fields and returns 2xx, e.g. a Formspree form URL
  // like "https://formspree.io/f/xxxxxxx". While this is empty the form does not
  // send anything: it checks the answers and asks the visitor to use the
  // "Prefer email?" link instead. (It never opens a mailto.)
  WAITLIST_ENDPOINT: "",

  // Compliance toolkit "Buy" buttons. PLACEHOLDERS: paste each Stripe Payment
  // Link here when it exists (e.g. "https://buy.stripe.com/..."). While a value
  // is empty, its Buy button goes to the waitlist section (#waitlist).
  BUY_URL_FULL_TOOLKIT: "",   // Full toolkit: £120 early bird to 31 Jan 2027, then £199
  BUY_URL_LETTERS_PACK: ""    // Letters-only pack: £85
};

(function () {
  var C = window.CASTILLIAI_CONFIG;
  function ready(fn){ if(document.readyState!=='loading'){fn();} else {document.addEventListener('DOMContentLoaded',fn);} }
  ready(function () {
    // Mobile menu
    var btn = document.querySelector('.menu-btn'), links = document.querySelector('.nav-links');
    if (btn && links) btn.addEventListener('click', function(){ var o = links.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); btn.textContent = o ? 'Close' : 'Menu'; });
    // Contact email
    document.querySelectorAll('[data-contact]').forEach(function (a) {
      var subj = a.getAttribute('data-subject');
      a.href = 'mailto:' + C.CONTACT_EMAIL + (subj ? '?subject=' + encodeURIComponent(subj) : '');
      if (a.hasAttribute('data-show-email')) a.textContent = C.CONTACT_EMAIL;
    });
    // MTD link
    var live = C.MTD_SITE_URL && C.MTD_SITE_URL.indexOf('[') !== 0;
    document.querySelectorAll('[data-mtd-link]').forEach(function (a) {
      if (live) { a.href = C.MTD_SITE_URL; a.classList.remove('disabled'); a.removeAttribute('aria-disabled'); a.textContent = a.getAttribute('data-live-text') || 'Visit MTD Software Compare'; }
    });
    document.querySelectorAll('[data-mtd-status]').forEach(function (el) { if (live) el.textContent = 'Live now'; });
    // Toolkit Buy buttons (data-buy="full" | "letters")
    var buyUrls = { full: C.BUY_URL_FULL_TOOLKIT, letters: C.BUY_URL_LETTERS_PACK }, anyLive = false;
    document.querySelectorAll('[data-buy]').forEach(function (a) {
      var u = buyUrls[a.getAttribute('data-buy')];
      if (u && /^https:\/\//.test(u)) { anyLive = true; a.href = u; a.rel = 'noopener'; if (a.getAttribute('data-live-text')) a.textContent = a.getAttribute('data-live-text'); }
    });
    if (anyLive) document.querySelectorAll('[data-buy-pending]').forEach(function (el) { el.hidden = true; });
    // Waitlist form
    var form = document.getElementById('waitlist-form');
    if (!form) return;
    var status = document.getElementById('wl-status');
    function say(m, e) { status.textContent = m; status.className = 'form-status' + (e ? ' err' : ''); }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (form.website.value) return; // spam trap
      if (!form.checkValidity()) {
        say('Please fill in your name, firm, a valid work email, firm type and pack choice, and tick the consent box.', true);
        var bad = form.querySelector(':invalid'); if (bad) bad.focus(); return;
      }
      var data = new FormData(form); data.delete('website'); data.append('source', 'castilliai.com/compliance-toolkit');
      if (C.WAITLIST_ENDPOINT) {
        say('Sending…');
        fetch(C.WAITLIST_ENDPOINT, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); say('Thanks, you’re on the waitlist. We’ll email you when the toolkit is ready.'); })
          .catch(function () { say('Sorry, that didn’t go through. Please email ' + C.CONTACT_EMAIL + ' instead.', true); });
        return;
      }
      // No endpoint set yet: don't send anything (and never open a mailto).
      say('Online sign-up isn’t switched on yet, so your details haven’t been sent. Please use the “Prefer email?” link below to join the waitlist.', true);
    });
  });
})();
