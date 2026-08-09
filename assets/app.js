  // CURSOR
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
  function animRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a,button,input,textarea,select,video').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; });
  });

  // ─── ROUTING ───
  // Fiecare secțiune are un URL real, servit ca fișier static propriu
  // (/despre/index.html etc). Tranzițiile rămân client-side; se schimbă
  // doar adresa din bara browserului, prin History API.
  const PAGE_PATHS = {
    'home':             '/',
    'despre':           '/despre/',
    'servicii':         '/servicii/',
    'portofoliu':       '/portofoliu/',
    'preturi':          '/pachete/',
    'colaboram':        '/colaboram/',
    'colaboram-custom': '/colaboram-custom/',
    'contact':          '/contact/'
  };
  const PATH_PAGES = Object.keys(PAGE_PATHS).reduce(function (map, page) {
    map[PAGE_PATHS[page]] = page;
    return map;
  }, {});

  function pathFor(page) {
    return PAGE_PATHS[page] || '/';
  }

  function pageFromPath(pathname) {
    var p = String(pathname || '/').replace(/index\.html$/, '');
    if (p.charAt(p.length - 1) !== '/') p += '/';
    return PATH_PAGES[p] || 'home';
  }

  // NAVIGATION
  let currentPage = pageFromPath(window.location.pathname);
  let isTransitioning = false;

  const panel = document.getElementById('tPanel');
  const tLogo = document.getElementById('tLogo');

  // History stack for back/forward navigation
  let navHistory = ['home'];
  let navFuture = [];

  function goBack() {
    if (navHistory.length > 1) {
      navFuture.push(navHistory.pop());
      const prev = navHistory[navHistory.length - 1];
      navigateTo(prev, true);
    }
  }

  function goForward() {
    if (navFuture.length > 0) {
      const next = navFuture.pop();
      navHistory.push(next);
      navigateTo(next, true);
    }
  }

  // Stop all videos on page
  function stopAllVideos() {
    document.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0; });
  }

  // Detectează dacă suntem în modul "telefon" (scroll continuu)
  function isMobileNav() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  // Sincronizează link-urile active din meniu (desktop nav + drawer mobil)
  function setActivePage(page) {
    currentPage = page;
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navA = document.getElementById('nav-' + page);
    if (navA) navA.classList.add('active');
    document.querySelectorAll('.mobile-drawer-links a').forEach(a => a.classList.remove('active'));
    const mobA = document.getElementById('mob-' + page);
    if (mobA) mobA.classList.add('active');
    try { sessionStorage.setItem('uslmedia_page', page); } catch (e) {}
  }

  // Pe telefon nu mai comutăm pagini — facem scroll lin către secțiune
  function scrollToPageMobile(page) {
    const targetEl = document.getElementById('page-' + page);
    if (!targetEl) return;
    stopAllVideos();
    const navBar = document.querySelector('nav');
    const offset = navBar ? navBar.offsetHeight : 72;
    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset + 1;
    window.scrollTo({ top: top, behavior: 'smooth' });
    setActivePage(page);
  }

  // "Hai să colaborăm" și "Colaborare custom" nu fac parte din scroll-ul
  // continuu de pe telefon — se deschid ca fereastră separată, la click.
  function isMobileFormPage(page) {
    return page === 'colaboram' || page === 'colaboram-custom';
  }

  function mobileFormNavigate(page, isBack) {
    stopAllVideos();
    if (!isBack) {
      // Scroll-ul liber de pe telefon nu împinge nimic în navHistory, așa
      // că secțiunea reală în care era userul (ex: Pachete) se pierde dacă
      // n-o salvăm acum, înainte de a intra în formular.
      if (!isMobileFormPage(currentPage) && navHistory[navHistory.length - 1] !== currentPage) {
        navHistory.push(currentPage);
      }
      navHistory.push(page);
      navFuture = [];
      window.history.pushState({ page }, '', pathFor(page));
    }
    if (isMobileFormPage(currentPage)) {
      document.getElementById('page-' + currentPage).classList.remove('mobile-form-open');
    }
    if (isMobileFormPage(page)) {
      const el = document.getElementById('page-' + page);
      el.classList.add('mobile-form-open');
      el.scrollTop = 0;
      document.body.classList.add('mobile-form-lock');
      setActivePage(page);
    } else {
      document.body.classList.remove('mobile-form-lock');
      scrollToPageMobile(page);
    }
    currentPage = page;
  }

  function navigateTo(page, isBack = false) {
    if (isMobileNav()) {
      if (isMobileFormPage(page) || isMobileFormPage(currentPage)) {
        mobileFormNavigate(page, isBack);
        return;
      }
      // Chiar dacă pe telefon doar scrollăm, adresa trebuie să reflecte
      // secțiunea — altfel un link copiat din bara de adrese duce pe Home.
      if (!isBack && page !== currentPage) {
        navHistory.push(page);
        navFuture = [];
        window.history.pushState({ page }, '', pathFor(page));
      }
      scrollToPageMobile(page);
      return;
    }
    if (page === currentPage || isTransitioning) return;
    isTransitioning = true;

    stopAllVideos();

    if (!isBack) {
      navHistory.push(page);
      navFuture = [];
      window.history.pushState({ page }, '', pathFor(page));
    }

    panel.style.transition = 'transform 0.45s cubic-bezier(0.76,0,0.24,1)';
    panel.style.transformOrigin = 'bottom';
    panel.style.transform = 'scaleY(1)';

    setTimeout(() => {
      tLogo.style.transition = 'opacity 0.2s';
      tLogo.style.opacity = '1';

      document.getElementById('page-' + currentPage).classList.remove('active');
      document.getElementById('page-' + page).classList.add('active');
      document.getElementById('page-' + page).scrollTop = 0;

      setActivePage(page);
    }, 380);

    setTimeout(() => { tLogo.style.opacity = '0'; }, 550);

    setTimeout(() => {
      panel.style.transformOrigin = 'top';
      panel.style.transform = 'scaleY(0)';
      setTimeout(() => {
        panel.style.transformOrigin = 'bottom';
        isTransitioning = false;
      }, 450);
    }, 650);
  }

  // Browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    // Intrările din istoric puse de noi au state.page; cele venite dintr-o
    // navigare "hard" (link deschis direct) nu au, așa că citim din URL.
    const target = (e.state && e.state.page) || pageFromPath(window.location.pathname);
    if (!target || target === currentPage) return;
    const inBack = navHistory.slice(0, -1).includes(target);
    if (inBack) {
      navFuture.push(navHistory.pop());
      navigateTo(target, true);
    } else {
      navHistory.push(target);
      navigateTo(target, true);
    }
  });

  // Când cineva intră direct pe /servicii/ de pe telefon, trebuie să ajungă
  // fix la secțiune. Un singur scroll nu e destul: imaginile lazy și fonturile
  // de deasupra se așază după aceea și împing secțiunea mai jos, așa că
  // recalculăm diferența până se stabilizează — sau până când userul
  // scrollează singur, caz în care ne oprim imediat.
  function settleScrollTo(targetEl) {
    let cancelled = false;
    const cancel = function () { cancelled = true; };
    window.addEventListener('wheel', cancel, { once: true, passive: true });
    window.addEventListener('touchstart', cancel, { once: true, passive: true });

    let tries = 0;
    (function align() {
      if (cancelled || tries++ > 12) {
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
        return;
      }
      const navBar = document.querySelector('nav');
      const offset = navBar ? navBar.offsetHeight : 72;
      const delta = targetEl.getBoundingClientRect().top - offset - 1;
      if (Math.abs(delta) > 2) window.scrollBy({ top: delta, behavior: 'auto' });
      setTimeout(align, 120);
    })();
  }

  // Secțiunea de start vine din URL, nu din sessionStorage: fișierul static
  // servit la /servicii/ are deja clasa .active pusă pe secțiunea corectă,
  // deci pagina e corectă și fără JavaScript.
  (function initFromUrl() {
    const page = pageFromPath(window.location.pathname);
    window.history.replaceState({ page }, '', pathFor(page));
    navHistory = [page];

    const targetEl = document.getElementById('page-' + page);
    if (!targetEl) { setActivePage('home'); return; }

    if (isMobileNav()) {
      if (isMobileFormPage(page)) {
        targetEl.classList.add('mobile-form-open');
        targetEl.scrollTop = 0;
        document.body.classList.add('mobile-form-lock');
        setActivePage(page);
      } else {
        setActivePage(page);
        if (page === 'home') return;
        settleScrollTo(targetEl);
        window.addEventListener('load', function() {
          setTimeout(function() { settleScrollTo(targetEl); }, 0);
        });
      }
    } else {
      document.querySelectorAll('.page.active').forEach(function(el) {
        if (el !== targetEl) el.classList.remove('active');
      });
      targetEl.classList.add('active');
      setActivePage(page);
    }
  })();

  // Hide cursor on touch devices
  let cursorHideTimer;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!isTouchDevice) {
    document.addEventListener('mousemove', () => {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '1';
      clearTimeout(cursorHideTimer);
    });
  }

  // PHONE — digits only (colaboram form)
  document.getElementById('col-phone').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  // COLABORAM SUBMIT
  function showError(fieldId, msg) {
    const el = document.getElementById(fieldId);
    el.style.borderColor = 'rgba(255,80,80,0.65)';
    el.style.boxShadow = '0 0 0 3px rgba(255,80,80,0.13)';
    el.focus();
    let tip = el.parentElement.querySelector('.field-error-tip');
    if (!tip) { tip = document.createElement('span'); tip.className = 'field-error-tip'; el.parentElement.appendChild(tip); }
    tip.textContent = msg;
    const clear = () => { el.style.borderColor=''; el.style.boxShadow=''; if(tip&&tip.parentElement)tip.remove(); };
    el.addEventListener('input', clear, { once: true });
    setTimeout(clear, 3500);
  }

    async function submitColab() {
    const name = document.getElementById('col-name').value.trim();
    const email = document.getElementById('col-email').value.trim();
    const phone = document.getElementById('col-phone').value.trim();
    const btn = document.getElementById('colabSubmitBtn');

    const pkg = document.getElementById('col-pkg').value;
    const project = document.getElementById('col-project').value.trim();
    if (!name)    { showError('col-name',    'Numele este obligatoriu.'); return; }
    if (!phone)   { showError('col-phone',   'Telefonul este obligatoriu.'); return; }
    if (!email)   { showError('col-email',   'Emailul este obligatoriu.'); return; }
    if (!pkg)     { showError('col-pkg',     'Selectează un pachet.'); return; }
    if (!project) { showError('col-project', 'Descrie pe scurt proiectul.'); return; }

    btn.disabled = true;
    btn.textContent = 'Se trimite...';

    const payload = { name, email, phone, pachet: pkg, proiect: project };

    if (pkg === 'Custom') {
      const videoPill = (document.querySelector('#colQVideo .cust-pill.active') || {}).textContent || '';
      const videoCustom = document.getElementById('colQVideoCustom').value.trim();
      payload.video_luna   = videoCustom || videoPill || '—';
      payload.revizii      = (document.querySelector('#colQRevizii .cust-pill.active')  || {}).textContent || '—';
      payload.script       = (document.querySelector('#colQScript .cust-pill.active')   || {}).textContent || '—';
      payload.filmare      = (document.querySelector('#colQFilmare .cust-pill.active')  || {}).textContent || '—';
      const platArr        = [...document.querySelectorAll('#colQPlatforme .cust-pill.active')].map(p => p.textContent);
      payload.platforme    = platArr.length ? platArr.join(', ') : '—';
    }

    try {
      await fetch('https://formspree.io/f/xlgyglbo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch(e) {}

    document.getElementById('colaboramForm').style.display = 'none';
    document.getElementById('colabSuccessWrap').style.display = 'block';
    setTimeout(() => { window.location.reload(); }, 3000);
  }

  // CONTACT SUBMIT
  async function submitContact() {
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const btn = document.getElementById('submitBtn');

    const mesaj = document.getElementById('c-project').value.trim();
    if (!name)  { showError('c-name',    'Numele este obligatoriu.'); return; }
    if (!email) { showError('c-email',   'Emailul este obligatoriu.'); return; }
    if (!mesaj) { showError('c-project', 'Mesajul este obligatoriu.'); return; }

    btn.disabled = true;
    btn.textContent = 'Se trimite...';

    try {
      await fetch('https://formspree.io/f/xlgyglbo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name, email,
          mesaj: mesaj
        })
      });
    } catch(e) {}

    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('successWrap').style.display = 'block';
    setTimeout(() => { window.location.reload(); }, 3000);
  }
  // MOBILE DRAWER
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function toggleDrawer() {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  function openDrawer() {
    mobileDrawer.classList.add('open');
    hamburgerBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateDrawerActive();
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  function drawerNav(page) {
    closeDrawer();
    setTimeout(() => navigateTo(page), 200);
  }

  function updateDrawerActive() {
    document.querySelectorAll('.mobile-drawer-links a').forEach(a => a.classList.remove('active'));
    const mob = document.getElementById('mob-' + currentPage);
    if (mob) mob.classList.add('active');
  }

  // Close drawer on outside click
  mobileDrawer.addEventListener('click', function(e) {
    if (e.target === mobileDrawer) closeDrawer();
  });
  // PHONE — digits only (colaboram-custom form)
  document.getElementById('cc-phone').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  // QUESTIONNAIRE PILLS
  function cqPill(btn, groupId, multi) {
    if (!multi) {
      document.querySelectorAll('#' + groupId + ' .cust-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
    } else {
      btn.classList.toggle('active');
    }
  }

  // VIDEO PILLS — also clears the custom input
  function cqPillVideo(btn, groupId, val) {
    document.querySelectorAll('#' + groupId + ' .cust-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const customInput = document.getElementById(groupId === 'colQVideo' ? 'colQVideoCustom' : 'ccVideoCustom');
    if (customInput) customInput.value = '';
  }

  // SHOW/HIDE CUSTOM QUESTIONNAIRE ON COLABORAM PAGE
  function onPkgChange(val) {
    const q = document.getElementById('colCustomQ');
    if (val === 'Custom') {
      q.style.display = 'flex';
    } else {
      q.style.display = 'none';
    }
  }

  // COLABORARE CUSTOM SUBMIT
  async function submitColabCustom() {
    const name     = document.getElementById('cc-name').value.trim();
    const email    = document.getElementById('cc-email').value.trim();
    const phone    = document.getElementById('cc-phone').value.trim();
    const descriere = document.getElementById('cc-descriere').value.trim();
    const btn      = document.getElementById('colabCustomSubmitBtn');

    if (!name)     { showError('cc-name',     'Numele este obligatoriu.'); return; }
    if (!phone)    { showError('cc-phone',    'Telefonul este obligatoriu.'); return; }
    if (!email)    { showError('cc-email',    'Emailul este obligatoriu.'); return; }
    if (!descriere){ showError('cc-descriere','Descrie pe scurt ce .'); return; }

    const videoPill    = (document.querySelector('#ccVideo .cust-pill.active') || {}).textContent || '';
    const videoCustom  = document.getElementById('ccVideoCustom').value.trim();
    const video    = videoCustom || videoPill || '—';
    const revizii  = (document.querySelector('#ccRevizii .cust-pill.active') || {}).textContent || '—';
    const script   = (document.querySelector('#ccScript .cust-pill.active') || {}).textContent || '—';
    const filmare  = (document.querySelector('#ccFilmare .cust-pill.active') || {}).textContent || '—';
    const platfArr = [...document.querySelectorAll('#ccPlatforme .cust-pill.active')].map(p => p.textContent);
    const platforme = platfArr.length ? platfArr.join(', ') : '—';

    btn.disabled = true;
    btn.textContent = 'Se trimite...';

    try {
      await fetch('https://formspree.io/f/xlgyglbo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          pachet: 'Colaborare Custom',
          video_luna: video,
          revizii,
          script,
          filmare,
          platforme,
          descriere
        })
      });
    } catch(e) {}

    document.getElementById('colabCustomForm').style.display = 'none';
    document.getElementById('colabCustomSuccessWrap').style.display = 'block';
    setTimeout(() => { window.location.reload(); }, 3000);
  }
  // ===== PORTOFOLIU — FILTRE PE CATEGORII =====
  // Categoria fiecărui proiect stă în data-cat pe .video-card, iar numărul de
  // proiecte de pe fiecare buton se calculează din DOM — așa că un clip nou
  // adăugat în grilă apare automat la filtrul potrivit, fără alte modificări.
  function filterPortfolio(cat, btn) {
    const cards = document.querySelectorAll('#page-portofoliu .video-card');
    let shown = 0;

    cards.forEach(function (card) {
      const match = cat === 'toate' || card.getAttribute('data-cat') === cat;
      card.hidden = !match;
      if (match) shown++;
      // Un clip ascuns nu are voie să ruleze mai departe în fundal.
      if (!match) {
        card.querySelectorAll('video').forEach(function (v) { v.pause(); v.currentTime = 0; });
      }
    });

    document.querySelectorAll('#page-portofoliu .porto-filter').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b === btn));
    });

    const empty = document.getElementById('portoEmpty');
    if (empty) empty.style.display = shown ? 'none' : 'block';
  }

  (function initPortfolioCounts() {
    const cards = document.querySelectorAll('#page-portofoliu .video-card');
    if (!cards.length) return;
    document.querySelectorAll('#page-portofoliu .porto-filter-count').forEach(function (el) {
      const cat = el.getAttribute('data-count-for');
      const n = cat === 'toate'
        ? cards.length
        : document.querySelectorAll('#page-portofoliu .video-card[data-cat="' + cat + '"]').length;
      el.textContent = n;
      // Ascundem filtrele fără proiecte, ca să nu ducă spre o grilă goală.
      if (!n) el.closest('.porto-filter').hidden = true;
    });
  })();

  // (navigateTo handles all page switching — no duplicate showPage needed)
  // ===== VIDEO MODAL =====
  // ─── VIDEO MODAL ───
  function openVideoModal(src, title) {
    const overlay = document.getElementById('videoModalOverlay');
    const player  = document.getElementById('videoModalPlayer');
    const titleEl = document.getElementById('videoModalTitle');

    // Opreşte preview-urile din carduri
    document.querySelectorAll('.video-wrap video').forEach(v => {
      v.pause();
      v.currentTime = 0;
    });

    player.src = src;
    titleEl.textContent = title;
    overlay.classList.add('open');
    document.body.classList.add('modal-open');

    // Blochează scroll pe containerul paginii active
    const activePage = document.querySelector('.page.active');
    if (activePage) activePage.style.overflow = 'hidden';

    player.play().catch(() => {});
  }

  function closeVideoModal() {
    const overlay = document.getElementById('videoModalOverlay');
    const player  = document.getElementById('videoModalPlayer');
    player.pause();
    player.src = '';
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');

    // Restabileşte scroll pe pagina activă
    const activePage = document.querySelector('.page.active');
    if (activePage) activePage.style.overflow = '';

    // Notifica componentele ca modalul s-a inchis
    document.dispatchEvent(new Event('modalClosed'));
  }

  // ===== IMAGE LIGHTBOX =====
  function openImageModal(src, alt) {
    const overlay = document.getElementById('imgModalOverlay');
    const pic = document.getElementById('imgModalPic');

    pic.src = src;
    pic.alt = alt || '';
    overlay.classList.add('open');
    document.body.classList.add('modal-open');

    const activePage = document.querySelector('.page.active');
    if (activePage) activePage.style.overflow = 'hidden';
  }

  function closeImageModal() {
    const overlay = document.getElementById('imgModalOverlay');
    const pic = document.getElementById('imgModalPic');
    overlay.classList.remove('open');
    pic.src = '';
    document.body.classList.remove('modal-open');

    const activePage = document.querySelector('.page.active');
    if (activePage) activePage.style.overflow = '';

    document.dispatchEvent(new Event('modalClosed'));
  }

  // Închide cu Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeVideoModal();
      closeImageModal();
    }
  });

  // Iniţializare event listeners pe modal – după ce DOM-ul e complet
  document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('videoModalOverlay');
    const closeBtn = document.getElementById('videoModalClose');

    // Click pe fundal = închide
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeVideoModal();
    });

    // Buton X
    closeBtn.addEventListener('click', closeVideoModal);

    // Blochează scroll complet – wheel + touch
    overlay.addEventListener('wheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    overlay.addEventListener('touchmove', function(e) {
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    // ─── Lightbox imagine ───
    const imgOverlay = document.getElementById('imgModalOverlay');
    const imgCloseBtn = document.getElementById('imgModalClose');

    imgOverlay.addEventListener('click', function(e) {
      if (e.target === imgOverlay) closeImageModal();
    });

    imgCloseBtn.addEventListener('click', closeImageModal);

    imgOverlay.addEventListener('wheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    imgOverlay.addEventListener('touchmove', function(e) {
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });
  });


  (function() {
    const cards = document.querySelectorAll('.testi-card');
    if (!cards.length) return;

    // Observer fara root restrictiv – functioneaza chiar dupa modal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('testi-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // viewport global, nu containerul paginii
      threshold: 0.05,
      rootMargin: '0px 0px 0px 0px'
    });

    cards.forEach(card => observer.observe(card));

    // Fallback: dupa ce se inchide modalul, re-verifica cardurile vizibile
    document.addEventListener('modalClosed', function() {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          card.classList.add('testi-visible');
        }
      });
    });
  })();


  // SCROLL-SPY MOBIL — ține meniul sincronizat în timpul scroll-ului liber
  (function() {
    if (!isMobileNav()) return;
    const ids = ['home','despre','servicii','portofoliu','preturi','contact'];
    const sections = ids.map(id => document.getElementById('page-' + id)).filter(Boolean);
    if (!sections.length) return;

    const spy = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          setActivePage(entry.target.id.replace('page-', ''));
        }
      });
    }, { root: null, threshold: 0, rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function(sec) { spy.observe(sec); });
  })();

  // NEWSLETTER POPUP
  (function() {
    function initNewsletter() {
      var backdrop   = document.getElementById('nlBackdrop');
      var closeBtn   = document.getElementById('nlClose');
      var submitBtn  = document.getElementById('nlSubmit');
      var emailInput = document.getElementById('nlEmail');

      if (!backdrop || !closeBtn || !submitBtn || !emailInput) {
        console.warn('Newsletter: elemente lipsa');
        return;
      }

      function openNl() {
        backdrop.style.display = 'flex';
        backdrop.style.opacity = '0';
        setTimeout(function() { backdrop.style.opacity = '1'; }, 10);
      }
      function closeNl() {
        backdrop.style.opacity = '0';
        setTimeout(function() { backdrop.style.display = 'none'; }, 300);
      }

      setTimeout(openNl, 30000);

      closeBtn.addEventListener('click', closeNl);

      backdrop.addEventListener('click', function(e) {
        if (e.target === backdrop) closeNl();
      });

      submitBtn.addEventListener('click', function() {
        var email = emailInput.value.trim();
        var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!valid) {
          emailInput.style.borderColor = 'rgba(239,68,68,0.6)';
          emailInput.focus();
          setTimeout(function() { emailInput.style.borderColor = ''; }, 2000);
          return;
        }
        // Notificare pentru tine
        emailjs.send('service_388u2vq', 'template_izp45s8', {
          email: email,
          sursa: 'Newsletter Popup',
          mesaj: 'Abonat nou la newsletter: ' + email
        });
        // Welcome email pentru abonat
        emailjs.send('service_388u2vq', 'template_e5vzaj8', {
          email: email,
          name: email
        });
        document.getElementById('nlFormContent').style.display = 'none';
        document.getElementById('nlSuccess').style.display = 'flex';
        setTimeout(closeNl, 3000);
      });

      emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') submitBtn.click();
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNewsletter);
    } else {
      initNewsletter();
    }
  })();
