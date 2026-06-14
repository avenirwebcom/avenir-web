// =============================================
// ISHIHARA — Main Script
// =============================================

// --- Header scroll effect ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// --- Hamburger menu ---
const hamburger = document.getElementById('hamburger');
let mobileNav, mobileOverlay;

function buildMobileMenu() {
  mobileOverlay = document.createElement('div');
  mobileOverlay.className = 'mobile-overlay';

  mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.innerHTML = `
    <a href="#services" class="mobile-link">サービス</a>
    <a href="#works" class="mobile-link">制作実績</a>
    <a href="#pricing" class="mobile-link">料金</a>
    <a href="#faq" class="mobile-link">FAQ</a>
    <a href="#contact" class="mobile-link">お問い合わせ</a>
  `;

  document.body.appendChild(mobileOverlay);
  document.body.appendChild(mobileNav);

  mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });
}

function openMobileMenu() {
  mobileNav.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.classList.add('active');
}

function closeMobileMenu() {
  mobileNav.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.classList.remove('active');
}

buildMobileMenu();
hamburger.addEventListener('click', () => {
  if (mobileNav.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// --- Intersection Observer for animations ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(el);
      setTimeout(() => {
        el.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Hero fade-up elements
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => heroObserver.observe(el));

// Trigger hero animations on load
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  }, 200);
});

// --- FAQ Accordion ---
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');

    document.querySelectorAll('.faq-q.open').forEach(other => {
      other.classList.remove('open');
      other.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
    });

    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// --- Form submission simulation ---
function handleFormSubmit(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = '送信中...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '';
      form.reset();
      document.getElementById('modal').classList.add('active');
    }, 1200);
  });
}

handleFormSubmit('contactForm');
handleFormSubmit('diagnosisForm');

// --- Smooth scroll for nav links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Staggered reveal for cards ---
const cardGroups = ['.services-grid', '.works-grid', '.pricing-grid', '.problem-cards'];
cardGroups.forEach(selector => {
  const grid = document.querySelector(selector);
  if (!grid) return;
  const cards = grid.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 100);
      });
      obs.disconnect();
    }
  }, { threshold: 0.05 });
  if (cards.length) obs.observe(grid);
});

// --- Number counter animation ---
function animateNumber(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }

  requestAnimationFrame(update);
}

// Observe stat numbers
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateNumber);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// --- Close modal on outside click ---
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('active');
  }
});
