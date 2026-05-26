/* ===================================
   THEMBILE SELABE — Portfolio Script
=================================== */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let fx = mx, fy = my;

  if (window.matchMedia('(pointer: fine)').matches && cursor && follower) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function animateCursor() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animateCursor);
    })();

    const hoverTargets = document.querySelectorAll(
      'a, button, .portfolio-item, .service-card, .tag, .filter-btn, .social-link'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
  }

  /* ── NAVBAR SCROLL ── */
  const nav = document.getElementById('nav');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    highlightNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── NAV TOGGLE (mobile) ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── ACTIVE NAV LINK ── */
  function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + window.innerHeight * 0.4;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link   = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (link) {
        link.style.color = (scrollY >= top && scrollY < bottom)
          ? 'var(--pink-mid)' : '';
      }
    });
  }

  /* ── SCROLL REVEAL ── */
  const fadeEls = document.querySelectorAll(
    '.about-grid > *, .stat, .portfolio-item, .service-card, .contact-grid > *, .section-header'
  );

  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.stat-num[data-count]');

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  /* ── PORTFOLIO FILTER ── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portItems   = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portItems.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        if (show) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  /* ── CONTACT FORM ── */
  const sendBtn     = document.getElementById('sendBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        shakeBtn(sendBtn);
        return;
      }

      sendBtn.textContent = 'Sending…';
      sendBtn.disabled = true;

      // Simulate async send
      setTimeout(() => {
        sendBtn.textContent = 'Sent! ✦';
        formSuccess.classList.add('visible');
        // Clear inputs
        ['name', 'email', 'project', 'message'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        setTimeout(() => {
          sendBtn.textContent = 'Send Message ✦';
          sendBtn.disabled = false;
          formSuccess.classList.remove('visible');
        }, 4000);
      }, 1200);
    });
  }

  function shakeBtn(btn) {
    btn.classList.add('shake');
    btn.addEventListener('animationend', () => btn.classList.remove('shake'), { once: true });
  }

  /* ── PARALLAX BLOBS (subtle) ── */
  const blobs = document.querySelectorAll('.blob');

  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 0.4;
      blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });

  /* ── INJECT SHAKE KEYFRAME ── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
    .shake { animation: shake 0.45s ease; }
  `;
  document.head.appendChild(style);

})();
