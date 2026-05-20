/* ============================================================
   BARSHA BAISHAKHI PRUSTY — PORTFOLIO JAVASCRIPT
   All interactive features, animations & utilities
   ============================================================ */

/* ─────────────────────────────────────────
   1. LOADING SCREEN
───────────────────────────────────────── */
window.addEventListener('load', () => {
  // Give loader a little extra time for visual effect
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      // Remove from DOM after transition
      setTimeout(() => loader.remove(), 600);
    }
    // Trigger initial hero animations
    triggerHeroReveal();
  }, 2200);
});

/* ─────────────────────────────────────────
   2. PARTICLE BACKGROUND CANVAS
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Particle configuration
  const config = {
    count: 70,
    maxRadius: 2.5,
    minRadius: 0.8,
    speed: 0.35,
    connectionDistance: 130,
    lineOpacity: 0.08,
    dotOpacity: 0.4,
    colors: ['#6366f1', '#a855f7', '#06b6d4', '#f59e0b'],
  };

  let particles = [];
  let animId;

  // Resize canvas to full window
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create a single particle with random properties
  function createParticle() {
    return {
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * config.speed,
      vy:  (Math.random() - 0.5) * config.speed,
      r:   Math.random() * (config.maxRadius - config.minRadius) + config.minRadius,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
    };
  }

  // Build initial particle array
  for (let i = 0; i < config.count; i++) {
    particles.push(createParticle());
  }

  // Draw a single frame
  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)            p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0)            p.y = canvas.height;
      if (p.y > canvas.height)p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = config.dotOpacity;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw connection lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < config.connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          // Fade line based on distance
          const alpha = config.lineOpacity * (1 - dist / config.connectionDistance);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    animId = requestAnimationFrame(drawFrame);
  }

  drawFrame();
})();


/* ─────────────────────────────────────────
   3. CUSTOM CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  // Move dot instantly, ring with lag
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Enlarge on hoverable elements
  const hoverTargets = 'a, button, .skill-card, .project-card, .cert-card, .strength-card, .contact-item';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


/* ─────────────────────────────────────────
   4. NAVBAR — scroll effect & active link
───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add .scrolled class to navbar when page is scrolled
  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  // Update active nav link based on scroll position
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // Smooth close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('hamburger').classList.remove('active');
    });
  });
})();


/* ─────────────────────────────────────────
   5. HAMBURGER MENU TOGGLE
───────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
})();


/* ─────────────────────────────────────────
   6. THEME TOGGLE (Dark / Light)
───────────────────────────────────────── */
(function initTheme() {
  const toggle   = document.getElementById('themeToggle');
  const icon     = document.getElementById('themeIcon');
  const htmlEl   = document.documentElement;

  // Load saved theme from localStorage
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  htmlEl.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('portfolio-theme', next);
  });
})();


/* ─────────────────────────────────────────
   7. TYPING ANIMATION (Hero Section)
───────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Python Full Stack Developer',
    'Django Backend Engineer',
    'React.js Frontend Dev',
    'REST API Specialist',
    'UI/UX Enthusiast',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  const typingSpeed   = 75;   // ms per character (typing)
  const deletingSpeed = 40;   // ms per character (deleting)
  const pauseTime     = 2200; // ms to hold completed phrase

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Type forward
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Pause before deleting
        isDeleting = true;
        setTimeout(type, pauseTime);
        return;
      }
      setTimeout(type, typingSpeed);
    } else {
      // Delete backward
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, deletingSpeed);
    }
  }

  // Start after loader disappears
  setTimeout(type, 2600);
})();


/* ─────────────────────────────────────────
   8. SCROLL REVEAL ANIMATIONS
───────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve once visible (animation runs once)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  revealEls.forEach(el => observer.observe(el));
})();

/* Hero section reveal (called after loader) */
function triggerHeroReveal() {
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 180);
  });
}


/* ─────────────────────────────────────────
   9. ANIMATED COUNTER (About Stats)
───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }
})();


/* ─────────────────────────────────────────
   10. SKILL BAR ANIMATION
───────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        // Slight delay for visual polish
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ─────────────────────────────────────────
   11. SKILLS FILTER TABS
───────────────────────────────────────── */
(function initSkillTabs() {
  const tabs  = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const selected = tab.getAttribute('data-tab');

      // Show/hide cards
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (selected === 'all' || category === selected) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 20);
        } else {
          card.classList.add('hidden');
        }
      });

      // Re-trigger skill bar fills for visible cards
      document.querySelectorAll('.skill-card:not(.hidden) .skill-fill').forEach(fill => {
        fill.style.width = '0%';
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 300);
      });
    });
  });
})();


/* ─────────────────────────────────────────
   12. BACK TO TOP BUTTON
───────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─────────────────────────────────────────
   13. CONTACT FORM HANDLER
───────────────────────────────────────── */
(function initContactForm() {
  const sendBtn = document.getElementById('sendMessage');
  const success = document.getElementById('formSuccess');

  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    // Get field values
    const name    = document.getElementById('contactName')?.value.trim();
    const email   = document.getElementById('contactEmail')?.value.trim();
    const subject = document.getElementById('contactSubject')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      shakeButton(sendBtn);
      return;
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      shakeButton(sendBtn);
      return;
    }

    // Simulate form submission (replace with actual backend/EmailJS)
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled  = true;

    setTimeout(() => {
      sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      if (success) success.classList.add('visible');

      // Reset after 4 seconds
      setTimeout(() => {
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        sendBtn.disabled  = false;
        if (success) success.classList.remove('visible');
        // Clear fields
        ['contactName','contactEmail','contactSubject','contactMessage'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
      }, 4000);
    }, 1600);
  });

  // Shake animation on validation fail
  function shakeButton(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 500);
  }

  // Inject shake keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ─────────────────────────────────────────
   14. RESUME DOWNLOAD BUTTON
───────────────────────────────────────── */
(function initResumeDownload() {
  const btns = document.querySelectorAll('#resumeDownload, #resumeDownload2');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Replace '/resume.pdf' with your actual resume file path
      // For demo: shows a visual feedback
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Opening...';
      btn.style.pointerEvents = 'none';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.pointerEvents = '';
       window.open('./Barsha Python Full Stack Dev Resume.pdf', '_blank');
      }, 1200);
    });
  });
})();


/* ─────────────────────────────────────────
   15. FOOTER YEAR (auto-updates)
───────────────────────────────────────── */
(function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ─────────────────────────────────────────
   16. SMOOTH SCROLL for anchor links
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH   = document.getElementById('navbar')?.offsetHeight || 72;
        const top    = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ─────────────────────────────────────────
   17. PROJECT CARD — Tilt Effect on hover
───────────────────────────────────────── */
(function initCardTilt() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = (-dy * 6).toFixed(2);
      const tiltY  = (dx  * 6).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
})();


/* ─────────────────────────────────────────
   18. FLOATING BACKGROUND SHAPES (extra depth)
───────────────────────────────────────── */
(function initFloatingShapes() {
  // Subtle parallax on blobs based on mouse movement
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;

    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 8;
      blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
})();


/* ─────────────────────────────────────────
   19. NAVBAR LINK HOVER MAGNETIC EFFECT
───────────────────────────────────────── */
(function initMagneticLinks() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mousemove', (e) => {
      const rect = link.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.2;
      const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.2;
      link.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────
   20. PAGE VISIBILITY — pause particles on hidden
───────────────────────────────────────── */
(function initVisibilityPause() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  document.addEventListener('visibilitychange', () => {
    canvas.style.opacity = document.hidden ? '0' : '1';
  });
})();


/* ─────────────────────────────────────────
   21. EDUCATION CARDS — reveal with stagger
───────────────────────────────────────── */
(function initEduReveal() {
  const items = document.querySelectorAll('.edu-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => {
    item.classList.add('reveal-up');
    observer.observe(item);
  });
})();


/* ─────────────────────────────────────────
   22. CONSOLE EASTER EGG
───────────────────────────────────────── */
console.log(
  '%c👩‍💻 Barsha Baishakhi Prusty | Python Full Stack Developer\n' +
  '%cPortfolio built with ❤️ using pure HTML, CSS & JavaScript\n' +
  '%c📧 barshamamali15@gmail.com | 🔗 github.com/barshabaishakhi-pythonfs',
  'color:#6366f1;font-size:18px;font-weight:bold;',
  'color:#a855f7;font-size:13px;',
  'color:#06b6d4;font-size:12px;'
);
