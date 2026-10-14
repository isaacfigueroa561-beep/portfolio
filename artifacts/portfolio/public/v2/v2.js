/* Isaac Figueroa portfolio, v2: page behavior + scroll motion.
   Ported from the Reframe 2027 motion system. Content stays visible without JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = function () { return window.matchMedia('(min-width: 901px)').matches; };
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;

  /* ---------- Header: scrolled state, progress bar, mobile menu ---------- */
  var header = $('.site-header');
  var ticking = false;
  function updateChrome() {
    ticking = false;
    var max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--page-progress', max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : 0);
    if (header) header.setAttribute('data-scrolled', String(window.scrollY > window.innerHeight * 0.6));
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(updateChrome); } }, { passive: true });
  window.addEventListener('resize', updateChrome, { passive: true });
  updateChrome();

  var toggle = $('.menu-toggle');
  var nav = $('#nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    nav.setAttribute('data-open', String(open));
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
  }

  /* ---------- Videos ---------- */
  // Older iOS Safari can't play WebM: swap in the poster (or reveal the fallback panel behind it).
  var probe = document.createElement('video');
  if (!probe.canPlayType || !probe.canPlayType('video/webm; codecs="vp9"') && !probe.canPlayType('video/webm')) {
    $$('video[src$=".webm"]').forEach(function (v) {
      if (v.poster) {
        var img = document.createElement('img');
        img.src = v.poster; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
        v.parentNode.replaceChild(img, v);
      } else v.remove();
    });
  }

  // Footage stays still for visitors who ask for reduced motion, except the dim hero loop.
  var paused = reduceMotion;
  var playIfAllowed = function (v) { if (paused && !v.classList.contains('hero-video')) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
  var visibleVideos = new Set();
  $$('video[autoplay]:not(.hero-video)').forEach(function (v) { v.removeAttribute('autoplay'); });

  // Load videos when they get close, and play them only while on screen.
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          visibleVideos.add(v);
          if (v.hasAttribute('data-lazy')) { v.preload = 'metadata'; v.removeAttribute('data-lazy'); }
          playIfAllowed(v);
        } else { visibleVideos.delete(v); if (!v.paused) v.pause(); }
      });
    }, { rootMargin: '200px 0px' });
    $$('video').forEach(function (v) { vio.observe(v); });
  }
  // iOS Low Power Mode blocks autoplay: start the hero loop on the first touch instead.
  var heroVideo = $('.hero-video');
  if (heroVideo) {
    var kick = function () { if (heroVideo.paused && visibleVideos.has(heroVideo)) playIfAllowed(heroVideo); };
    ['touchstart', 'pointerdown', 'scroll'].forEach(function (ev) { window.addEventListener(ev, kick, { once: true, passive: true }); });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) $$('video').forEach(function (v) { v.pause(); });
    else visibleVideos.forEach(playIfAllowed);
  });

  /* ---------- Players: auto-advancing slides (guide deck, portal devices) ---------- */
  // Advances only while on screen; hovering or focusing pauses it, and the buttons give manual control.
  function initPlayer(el) {
    if (el.hasAttribute('data-player-ready')) return;
    el.setAttribute('data-player-ready', '');
    var groups = [];
    $$('.pl-slide', el).forEach(function (sl) {
      var g = groups.filter(function (x) { return x.parent === sl.parentNode; })[0];
      if (!g) { g = { parent: sl.parentNode, slides: [] }; groups.push(g); }
      g.slides.push(sl);
    });
    var count = groups[0] ? groups[0].slides.length : 0;
    if (count < 2) return;
    var interval = +el.getAttribute('data-interval') || 3000;
    var i = 0, timer = null, visible = false, hold = false;
    var countEl = $('.deck-count b', el), titleEl = $('.deck-title', el), bar = $('.deck-progress i', el), dots = $$('.pl-dot', el);
    function show(n) {
      i = (n + count) % count;
      groups.forEach(function (g) { g.slides.forEach(function (sl, k) { sl.classList.toggle('is-active', k === i); }); });
      if (countEl) countEl.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
      if (titleEl) titleEl.textContent = groups[0].slides[i].getAttribute('data-title') || '';
      dots.forEach(function (d) { var r = d.getAttribute('data-range').split('-'); if (i >= +r[0] && i <= +r[1]) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      // warm the next image so the swap never flashes
      groups.forEach(function (g) { var nx = g.slides[(i + 1) % count]; var im = nx.tagName === 'IMG' ? nx : $('img', nx); if (im) im.loading = 'eager'; });
      restartBar();
    }
    function restartBar() {
      if (!bar) return;
      bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)';
      if (!running()) return;
      void bar.offsetWidth;
      bar.style.transition = 'transform ' + interval + 'ms linear'; bar.style.transform = 'scaleX(1)';
    }
    function running() { return visible && !hold && !reduceMotion; }
    function schedule() { clearInterval(timer); timer = null; if (running()) timer = setInterval(function () { show(i + 1); }, interval); restartBar(); }
    var prev = $('.pl-prev', el), next = $('.pl-next', el);
    if (prev) prev.addEventListener('click', function () { show(i - 1); schedule(); });
    if (next) next.addEventListener('click', function () { show(i + 1); schedule(); });
    dots.forEach(function (d) { d.addEventListener('click', function () { show(+d.getAttribute('data-range').split('-')[0]); schedule(); }); });
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hold = true; schedule(); } });
    el.addEventListener('pointerleave', function () { hold = false; schedule(); });
    el.addEventListener('focusin', function () { hold = true; schedule(); });
    el.addEventListener('focusout', function () { hold = false; schedule(); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { show(i + 1); schedule(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { show(i - 1); schedule(); e.preventDefault(); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(el);
    }
    show(0);
  }
  $$('[data-player]').forEach(initPlayer);

  /* ---------- Scrolling site captures: scroll distance = image height minus the screen ---------- */
  function fitScroll(im) {
    var go = function () { var v = im.parentNode; if (v && v.clientHeight) im.style.setProperty('--view-h', v.clientHeight + 'px'); };
    if (im.complete) go(); else im.addEventListener('load', go);
    if ('ResizeObserver' in window) new ResizeObserver(go).observe(im.parentNode);
  }
  $$('.site-scroll').forEach(fitScroll);

  /* ---------- Project popups ---------- */
  var W = '/work/';
  var imgs = function (list, alt) { return list.map(function (src, i) { return { src: src, alt: alt + ' ' + (i + 1) }; }); };
  var range = function (pre, n, ext) { var a = []; for (var i = 1; i <= n; i++) a.push(pre + i + (ext || '.webp')); return a; };
  var PORTAL_STEPS = ['Client dashboard', 'Recent requests and capacity', 'Choosing a project type', 'Picking deliverables', 'Project details', 'Choosing a creative direction', 'Reviewing the request', 'Request received'];
  var HOURALY_STEPS = ['Dashboard', 'Daily hours and recent logs', 'Live timer', 'Clients', 'Projects', 'Invoices', 'Invoice ready to share'];
  // Short case studies shown at the top of a project's popup.
  var CASES = {
    littlepilot: [
      ['The brief', 'Little Pilot runs paid media, email and SMS, influencer, and creative for 20+ food, beverage, and personal care brands sold in major retailers. The old site didn&rsquo;t show any of that. It needed to make a lean team read as a proven growth partner.'],
      ['The approach', 'Lead with proof. Results sit right under the hero, followed by the retailers their brands are on shelf at, then a full-funnel services grid, case studies, and a &ldquo;smaller on purpose&rdquo; section that turns team size into a selling point.'],
      ['What I delivered', '<ul><li>Site design and build, desktop to phone</li><li>Scroll motion and a case study carousel</li><li>One clear path to &ldquo;Reach out&rdquo; and &ldquo;Book a call&rdquo;</li></ul>']
    ],
    houraly: [
      ['The problem', 'Freelancing meant hours in one app, clients in a spreadsheet, and invoices in another. Billable time slipped through the cracks, and invoicing took an evening every month.'],
      ['The approach', 'One calm workspace where tracked time becomes the invoice. The timer is always one tap away, and every client can be billed hourly, by flat fee, or on a monthly retainer.'],
      ['What I built', '<ul><li>Product design, front end, API, and database</li><li>Live timer, clients, projects, and invoicing</li><li>PDF invoices and sharing to Slack</li><li>Installable on a phone, used every week</li></ul>']
    ]
  };
  var PROJECTS = {
    crtvly: [{ items: [
      { src: W + 'crtvly-guide-cover.webp', alt: 'CRTVLY brand guidelines cover', wide: true },
      { src: W + 'crtvly-guide-logo.webp', alt: 'CRTVLY logo and asterisk mark' },
      { src: W + 'crtvly-guide-colors.webp', alt: 'CRTVLY color palette' },
      { src: W + 'crtvly-guide-type.webp', alt: 'CRTVLY typography' },
      { src: W + 'crtvly-guide-backgrounds.webp', alt: 'CRTVLY backgrounds and textures' },
      { src: W + 'crtvly-guide-stationery.webp', alt: 'CRTVLY stationery' },
      { src: W + 'crtvly-guide-merch.webp', alt: 'CRTVLY crewneck, cap, and tote' },
      { src: W + 'crtvly-guide-web.webp', alt: 'CRTVLY website' },
      { src: W + 'crtvly-guide-mobile.webp', alt: 'CRTVLY mobile app' }
    ] }],
    portal: [
      { items: [{ clone: '.showcase' }] },
      { title: 'Key screens', cols: 3, ar: '16 / 10', items: [
        { src: '/work/portal/d1.webp', alt: 'Client dashboard with recent requests' },
        { src: '/work/portal/d4.webp', alt: 'Picking deliverables' },
        { src: '/work/portal/d7.webp', alt: 'Reviewing the request before sending' }
      ] }
    ],
    reframe: [
      { items: [
        { showcase: '/work/reframe/flow', label: 'The Reframe 2027 website scrolling on a laptop and a phone', statusBg: '#1c1a14', statusFg: '#f3e9d6' },
        { src: W + 'reframe-keyart.webp', alt: 'Reframe 2027 key art: a woman reaching toward floating books, titled It Is Written', wide: true }
      ] },
      { title: 'Registration rollout', cols: 3, ar: '4 / 5', items: [
        { src: W + 'reframe-reg-1.webp', alt: 'Registration now open post' },
        { src: W + 'reframe-reg-2.webp', alt: 'Registration opens October 11 post' },
        { src: W + 'reframe-reg-3.webp', alt: 'Registration opens tomorrow post' },
        { src: W + 'reframe-reg-4.webp', alt: 'Your next chapter starts here post' },
        { src: W + 'reframe-reg-5.webp', alt: 'A new chapter is coming post' },
        { src: W + 'reframe-post.webp', alt: 'It Is Written social post' }
      ] },
      { title: 'Merch · Women of the Word', cols: 3, ar: '4 / 5', items: [
        { src: W + 'vc-jacket.webp', alt: 'Burgundy varsity jacket with a Women of the Word crest on the back' },
        { src: W + 'vc-hoodie.webp', alt: 'Burgundy hoodie with Woman of the Word lettering' },
        { src: W + 'vc-hat.webp', alt: 'Cream cap embroidered with It Is Written' },
        { src: W + 'vc-jacket-front.webp', alt: 'Varsity jacket, front' },
        { src: W + 'vc-tote.webp', alt: 'Canvas tote with a Victory Church crest' },
        { src: W + 'vc-tumbler.webp', alt: 'Branded tumbler' }
      ] }
    ],
    littlepilot: [{ items: [{ clone: '.devices' }] }],
    houraly: [
      { items: [{ clone: '.showcase' }] },
      { title: 'Key screens', cols: 3, ar: '16 / 10', items: [
        { src: '/work/houraly/d1.webp', alt: 'Dashboard with a running timer and weekly earnings' },
        { src: '/work/houraly/d3.webp', alt: 'Live timer' },
        { src: '/work/houraly/d7.webp', alt: 'Invoice ready to share' }
      ] }
    ],
    spark: [{ items: [{ src: '/spark-showcase-1.webp', alt: 'Spark Pro Services brand applications', wide: true }].concat(imgs(range('/spark-', 8), 'Spark Pro Services brand guide page')) }],
    billy: [{ cols: 3, items: imgs(range('/billy-new-', 9), 'Billy Brunch NYC design') }],
    chino: [{ cols: 3, items: imgs(range('/chino-new-', 12), 'Chino Club design') }]
  };

  var modal = $('.project-modal');
  var lastTrigger = null;
  function buildMedia(it, card) {
    var el;
    if (it.clone) {
      el = $(it.clone, card).cloneNode(true);
      el.classList.remove('parallax');
      el.removeAttribute('data-player-ready');
      $$('img', el).forEach(function (im) { im.removeAttribute('loading'); im.sizes = '(max-width: 900px) 92vw, 1100px'; });
      $$('video', el).forEach(function (v) { v.removeAttribute('data-lazy'); v.preload = 'auto'; });
      el.classList.add('pm-wide');
      $$('.site-scroll', el).forEach(fitScroll);
      return el;
    }
    if (it.showcase) {
      el = document.createElement('div');
      el.className = 'card-media showcase pm-wide';
      el.setAttribute('role', 'img'); el.setAttribute('aria-label', it.label);
      el.innerHTML = '<div class="mbp"><div class="mbp-lid"><div class="mbp-screen"><video muted loop playsinline aria-hidden="true"></video></div></div><div class="mbp-base"></div></div><div class="iph"><div class="iph-screen"><div class="iph-status" aria-hidden="true"><span>9:41</span><i></i></div><video muted loop playsinline aria-hidden="true"></video></div></div>';
      if (it.statusBg) { $('.iph', el).style.setProperty('--status-bg', it.statusBg); $('.iph', el).style.setProperty('--status-fg', it.statusFg); }
      var vs = $$('video', el);
      vs[0].poster = it.showcase + '-d.webp'; vs[0].src = it.showcase + '-d.mp4';
      vs[1].poster = it.showcase + '-m.webp'; vs[1].src = it.showcase + '-m.mp4';
      return el;
    }
    if (it.sites) {
      el = document.createElement('div');
      el.className = 'card-media devices devices--site';
      el.setAttribute('role', 'img'); el.setAttribute('aria-label', it.label);
      el.innerHTML = '<div class="devices-stage"><div class="laptop"><div class="laptop-lid"><div class="laptop-screen"><img class="site-scroll" alt="" decoding="async" /></div></div><div class="laptop-base"></div></div><div class="phone"><div class="phone-screen"><img class="site-scroll site-scroll--late" alt="" decoding="async" /></div></div></div>';
      var ims = $$('.site-scroll', el); ims[0].src = it.sites[0]; ims[1].src = it.sites[1];
      ims.forEach(fitScroll);
      if (it.wide) el.classList.add('pm-wide');
      return el;
    }
    if (it.site) {
      el = document.createElement('figure');
      el.className = 'site-clip';
      el.innerHTML = '<div class="site-clip-bar" aria-hidden="true"><i></i><i></i><i></i><span></span></div><div class="site-clip-view"><img alt="" decoding="async" /></div>';
      $('span', el).textContent = it.url;
      var im = $('img', el); im.src = it.site; im.alt = it.label;
      var fit = function () { var v = $('.site-clip-view', el); im.style.setProperty('--view-h', v.clientHeight + 'px'); };
      im.addEventListener('load', fit);
      if ('ResizeObserver' in window) new ResizeObserver(fit).observe(el);
      if (it.wide) el.classList.add('pm-wide');
      return el;
    }
    if (it.video) {
      el = document.createElement('video');
      el.src = it.video; el.muted = true; el.loop = true; el.playsInline = true; el.controls = true;
      el.setAttribute('playsinline', ''); el.setAttribute('aria-label', it.label || '');
      if (it.poster) el.poster = it.poster;
      if (!reduceMotion) el.autoplay = true;
    } else {
      el = document.createElement('img');
      el.src = it.src; el.alt = it.alt || ''; el.loading = 'lazy'; el.decoding = 'async';
    }
    if (it.wide) el.className = 'pm-wide';
    return el;
  }
  function openProject(card, trigger) {
    var data = PROJECTS[card.getAttribute('data-project')];
    if (!modal || !data || typeof modal.showModal !== 'function') return;
    var cs = getComputedStyle(card);
    modal.style.setProperty('--pm-bg', cs.getPropertyValue('--bg'));
    modal.style.setProperty('--pm-fg', cs.getPropertyValue('--fg'));
    modal.style.setProperty('--pm-accent', cs.getPropertyValue('--accent'));
    $('.pm-cat', modal).textContent = $('.card-cat', card).textContent;
    $('#pm-title', modal).textContent = $('h3', card).textContent;
    $('.pm-desc', modal).innerHTML = $('.card-desc', card).innerHTML;
    var statBox = $('.pm-stats', modal), stats = $('.card-stats', card);
    statBox.innerHTML = '';
    if (stats) statBox.appendChild(stats.cloneNode(true));
    var linkBox = $('.pm-link', modal), link = $('.card-link', card);
    linkBox.innerHTML = '';
    if (link) linkBox.appendChild(link.cloneNode(true));
    var body = $('.pm-body', modal);
    body.innerHTML = '';
    var cs2 = CASES[card.getAttribute('data-project')];
    if (cs2) {
      var box = document.createElement('div');
      box.className = 'pm-case';
      box.innerHTML = cs2.map(function (c) { return '<div><h3>' + c[0] + '</h3>' + (c[1].charAt(0) === '<' ? c[1] : '<p>' + c[1] + '</p>') + '</div>'; }).join('');
      body.appendChild(box);
    }
    data.forEach(function (group) {
      if (group.title) { var h = document.createElement('h3'); h.textContent = group.title; body.appendChild(h); }
      var g = document.createElement('div');
      g.className = 'pm-group';
      g.style.setProperty('--cols', group.cols || 2);
      if (group.ar) { g.classList.add('pm-group--even'); g.style.setProperty('--ar', group.ar); }
      group.items.forEach(function (it) { g.appendChild(buildMedia(it, card)); });
      body.appendChild(g);
    });
    $$('[data-player]', body).forEach(initPlayer);
    $$('video', body).forEach(function (v) { v.muted = true; if (!reduceMotion) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } });
    lastTrigger = trigger || $('.card-open', card);
    root.classList.add('modal-open');
    modal.showModal();
    $('.pm-inner', modal).scrollTop = 0;
    $('.pm-close', modal).focus();
  }
  if (modal) {
    $('.pm-close', modal).addEventListener('click', function () { modal.close(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
    modal.addEventListener('close', function () {
      if (modal.open) return; // reopened before this event fired
      $$('video', modal).forEach(function (v) { v.pause(); });
      root.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    });
    $$('.card[data-project]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a') || (e.target.closest('button') && !e.target.closest('.card-open'))) return;
        openProject(card, e.target.closest('.card-open'));
      });
    });
  }

  /* Ministry designs open full size, with arrows and keyboard navigation */
  var lb = $('.lightbox');
  var gImgs = $$('.g-open img');
  if (lb && gImgs.length && typeof lb.showModal === 'function') {
    var lbImg = $('.lb-img', lb), lbCount = $('.lb-count', lb), lbIndex = 0, lbTrigger = null;
    var showAt = function (i) {
      lbIndex = (i + gImgs.length) % gImgs.length;
      lbImg.src = gImgs[lbIndex].currentSrc || gImgs[lbIndex].src;
      lbImg.alt = gImgs[lbIndex].alt;
      lbCount.textContent = (lbIndex + 1) + ' / ' + gImgs.length;
    };
    $$('.g-open').forEach(function (b, i) {
      b.addEventListener('click', function () { lbTrigger = b; showAt(i); root.classList.add('modal-open'); lb.showModal(); });
    });
    $('.lb-prev', lb).addEventListener('click', function () { showAt(lbIndex - 1); });
    $('.lb-next', lb).addEventListener('click', function () { showAt(lbIndex + 1); });
    $('.lb-close', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showAt(lbIndex - 1);
      if (e.key === 'ArrowRight') showAt(lbIndex + 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 40) showAt(lbIndex + (dx < 0 ? 1 : -1));
    });
    lb.addEventListener('close', function () { root.classList.remove('modal-open'); if (lbTrigger) lbTrigger.focus({ preventScroll: true }); });
  }

  /* Contact form: opens inside the contact card, sends through Web3Forms */
  var cform = $('#contact-form');
  var cformToggle = $('[aria-controls="contact-form"]');
  if (cform && cformToggle) {
    cformToggle.addEventListener('click', function () {
      var open = cform.hidden;
      cform.hidden = !open;
      cformToggle.setAttribute('aria-expanded', String(open));
      if (open) $('input[name="name"]', cform).focus();
    });
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.cf-status', cform), send = $('.cf-send', cform);
      var f = cform.elements;
      if (f.botcheck.checked) return;
      var bad = ['name', 'email', 'message'].filter(function (n) { return !f[n].checkValidity() || !f[n].value.trim(); });
      $$('.cf-field', cform).forEach(function (l) { l.classList.remove('is-bad'); });
      if (bad.length) {
        bad.forEach(function (n) { f[n].closest('.cf-field').classList.add('is-bad'); });
        status.textContent = bad.indexOf('email') > -1 && f.email.value ? 'Please check your email address.' : 'Please fill in every field.';
        f[bad[0]].focus();
        return;
      }
      send.disabled = true;
      status.textContent = 'Sending…';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: cform.getAttribute('data-key'),
          name: f.name.value.trim(),
          email: f.email.value.trim(),
          subject: 'Portfolio inquiry from ' + f.name.value.trim(),
          message: f.message.value.trim()
        })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d.success) throw new Error(d.message || 'Submission failed');
        cform.reset();
        cform.classList.add('is-sent');
        status.textContent = 'Message received. I’ll get back to you within 24 hours.';
        if (window.dataLayer) window.dataLayer.push({ event: 'contact_form_submit' });
      }).catch(function () {
        status.innerHTML = 'Something went wrong. Please email me at <a href="mailto:figgycrtv@gmail.com">figgycrtv@gmail.com</a>.';
      }).then(function () { send.disabled = false; });
    });
  }

  /* ---------- Word-by-word statement ---------- */
  var wordBlocks = $$('.words');
  if (!reduceMotion) {
    wordBlocks.forEach(function (block) {
      var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement('span');
          s.className = 'word';
          s.textContent = part;
          frag.appendChild(s);
        });
        node.parentNode.replaceChild(frag, node);
      });
      block.classList.add('is-split');
      block._words = $$('.word', block);
    });
  }

  if (reduceMotion) return;

  /* ---------- Reveal on scroll (staggered) ---------- */
  if ('IntersectionObserver' in window) {
    root.classList.add('motion');
    $$('.reveal-group').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
    });
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.classList.contains('reveal')) e.target.style.setProperty('--i', Math.min(batch++, 5));
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal, .reveal-group').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Stat counters ---------- */
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, target = +el.dataset.count, sup = el.querySelector('sup'), start = null;
        var step = function (t) {
          if (!start) start = t;
          var p = Math.min(1, (t - start) / 1600), eased = 1 - Math.pow(1 - p, 4);
          el.firstChild.nodeValue = Math.round(target * eased).toLocaleString('en-US');
          if (p < 1) requestAnimationFrame(step);
        };
        if (sup) requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  if (!hasGsap) {
    wordBlocks.forEach(function (b) { (b._words || []).forEach(function (w) { w.style.setProperty('--lit', 1); }); });
    return;
  }

  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });

  /* Hero: content lifts + fades, footage pushes in, as the page slides over it */
  var sheet = $('.sheet');
  if (sheet) {
    gsap.to('.hero-content', { opacity: 0, y: -80, ease: 'none',
      scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top 35%', scrub: true } });
    gsap.to('.hero-media', { scale: 1.06, ease: 'none',
      scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top top', scrub: true } });
    gsap.to('.scroll-cue', { opacity: 0, ease: 'none',
      scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top 80%', scrub: true } });

    /* Sheet grows to full width as it rises (desktop only). Transform is
       cleared at rest so it never traps sticky children. */
    // Every trigger measures layout during refresh, so the sheet must stay
    // unscaled until all of them are done or later positions come out wrong.
    var refreshing = false;
    var clearGrow = function () { sheet.style.transform = ''; };
    var grow = function (p) {
      if (refreshing || !isDesktop() || p >= 0.999) { clearGrow(); return; }
      sheet.style.transform = 'scale(' + (0.9 + 0.1 * p).toFixed(4) + ')';
    };
    var growTrigger = ST.create({ trigger: sheet, start: 'top bottom', end: 'top 12%', scrub: true,
      onUpdate: function (self) { grow(self.progress); }, onLeave: clearGrow, onLeaveBack: function () { grow(0); } });
    ST.addEventListener('refreshInit', function () { refreshing = true; clearGrow(); });
    ST.addEventListener('refresh', function () { refreshing = false; grow(growTrigger.progress); });
  }

  /* Statement lights up word by word */
  wordBlocks.forEach(function (block) {
    var ws = block._words || [];
    if (!ws.length) return;
    ST.create({ trigger: block, start: 'top 85%', end: 'bottom 45%', scrub: true,
      onUpdate: function (self) {
        var span = self.progress * (ws.length + 2);
        ws.forEach(function (w, i) { w.style.setProperty('--lit', Math.max(0, Math.min(1, span - i)).toFixed(3)); });
      } });
  });

  /* Light sweeps across dark panels */
  $$('.light').forEach(function (el) {
    gsap.fromTo(el, { xPercent: 8, yPercent: -4 }, { xPercent: -8, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Marquee drifts sideways with scroll */
  $$('.marquee').forEach(function (band) {
    var text = $('.marquee-text', band);
    if (!text) return;
    var track = document.createElement('div');
    track.className = 'marquee-track';
    for (var i = 0; i < 4; i++) { var s = document.createElement('span'); s.innerHTML = text.innerHTML; track.appendChild(s); }
    text.style.display = 'none';
    band.appendChild(track);
    gsap.fromTo(track, { xPercent: 0 }, { xPercent: -25, ease: 'none',
      scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  });

  /* Project cards stack like a deck: each sits a little lower than the last, so the
     edge of every earlier card stays in view as the next one slides over it */
  ST.matchMedia({
    '(min-width: 901px)': function () {
      var cards = $$('.stack > .card');
      cards.forEach(function (card, i) {
        card.style.top = 'calc(var(--header-h) + 1.25rem + ' + (i * 10) + 'px)';
        var next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(card, { scale: 1 }, { scale: 0.96, ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top ' + (parseInt(getComputedStyle(next).top, 10) || 90) + 'px', scrub: true } });
      });
      return function () { cards.forEach(function (c) { c.style.top = ''; }); };
    }
  });

  /* Media drifts inside its frame */
  $$('.parallax').forEach(function (el) {
    var inner = el.querySelectorAll('img, video');
    gsap.fromTo(inner, { yPercent: -5 }, { yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Galleries: pin and scroll sideways (desktop), swipeable on phones */
  ST.matchMedia({
    '(min-width: 901px)': function () {
      $$('.gallery-pin').forEach(function (pin) {
        var track = $('.gallery-track', pin);
        if (!track) return;
        var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
        var end = function () { return '+=' + distance(); };
        gsap.to(track, { x: function () { return -distance(); }, ease: 'none',
          scrollTrigger: { trigger: pin, start: 'top top', end: end, pin: true, scrub: 0.6, invalidateOnRefresh: true } });
        gsap.fromTo($$('li', track), { rotation: function (i) { return i % 2 ? 2 : -2; } }, { rotation: 0, ease: 'none',
          scrollTrigger: { trigger: pin, start: 'top top', end: end, scrub: true } });
      });
    }
  });

  /* Experience rail draws down */
  $$('.timeline').forEach(function (ol) {
    ol.style.setProperty('--draw', 0);
    ST.create({ trigger: ol, start: 'top 80%', end: 'bottom 60%', scrub: true,
      onUpdate: function (self) { ol.style.setProperty('--draw', self.progress.toFixed(3)); } });
  });

  /* Contact card scales up into place */
  $$('.grow').forEach(function (el) {
    gsap.fromTo(el, { scale: 0.88, borderRadius: '4rem' }, { scale: 1, borderRadius: '2rem', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: true } });
  });

  window.addEventListener('load', function () { ST.refresh(); });
})();
