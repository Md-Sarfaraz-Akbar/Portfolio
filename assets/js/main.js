document.documentElement.classList.add('js');

(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const terminalCode = document.querySelector('#terminalText code');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  const ring = document.getElementById('cursorRing');
  const mascot = document.getElementById('mascot');
  const particles = document.getElementById('particleLayer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  let savedTheme = localStorage.getItem('portfolio-theme');
  if (!savedTheme) savedTheme = 'dark';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const terminalLines = [
    '$ mvn spring-boot:run',
    'profile: "backend"',
    'framework: "spring-boot"',
    'database: "postgresql"',
    'cloud: "azure"',
    '',
    '✓ API server ready'
  ];

  if (terminalCode) {
    if (reducedMotion) {
      terminalCode.textContent = terminalLines.join('\n');
    } else {
      let line = 0;
      let char = 0;
      let output = '';
      const type = () => {
        if (line >= terminalLines.length) return;
        const current = terminalLines[line];
        if (char < current.length) {
          output += current[char++];
          terminalCode.textContent = output;
          setTimeout(type, current[0] === '$' ? 42 : 25);
        } else {
          output += '\n';
          terminalCode.textContent = output;
          line++;
          char = 0;
          setTimeout(type, line === terminalLines.length ? 60 : 115);
        }
      };
      setTimeout(type, 350);
    }
  }

  const revealEls = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  const magneticEls = document.querySelectorAll('.magnetic');
  if (!reducedMotion) {
    magneticEls.forEach(el => {
      el.addEventListener('pointermove', event => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  let lastParticle = 0;
  window.addEventListener('pointermove', event => {
    if (ring) {
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
    }
    if (mascot && window.innerWidth > 900 && !reducedMotion) {
      const x = (event.clientX / window.innerWidth - 0.5) * 22;
      const y = (event.clientY / window.innerHeight - 0.5) * 18;
      const rotate = (event.clientX / window.innerWidth - 0.5) * 8;
      mascot.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      const eyes = mascot.querySelectorAll('.eye');
      eyes.forEach(eye => {
        eye.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      });
    }
    if (!particles || reducedMotion || window.innerWidth <= 900) return;
    const now = performance.now();
    if (now - lastParticle < 55) return;
    lastParticle = now;
    const dot = document.createElement('span');
    dot.className = 'particle';
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    dot.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 26)}px`);
    dot.style.setProperty('--dy', `${Math.round((Math.random() - 0.5) * 26)}px`);
    particles.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  }, { passive: true });

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (scrollTop / max) * 100 : 0}%`;
    if (backTop) backTop.classList.toggle('show', scrollTop > 650);
  }
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const selector = link.getAttribute('href');
      const target = selector && document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  document.getElementById('emailButton')?.addEventListener('click', event => {
    event.preventDefault();
    alert('Email contact is not published because no email address was provided.');
  });
})();