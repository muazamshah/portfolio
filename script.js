const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const sections = document.querySelectorAll('.section');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const loader = document.getElementById('pageLoader');
const loaderProgressBar = document.getElementById('loaderProgressBar');
const loaderPercentage = document.getElementById('loaderPercentage');
const loaderStatus = document.getElementById('loaderStatus');
const typingText = document.getElementById('typingText');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

const typingPhrases = [
  'Machine Learning Enthusiast',
  'NLP & Chatbot Developer',
  'Prompt Engineering Explorer',
  'AI Assistant Builder'
];
let currentPhrase = 0;
let typingIndex = 0;
let isDeleting = false;

function typeHeroText() {
  const phrase = typingPhrases[currentPhrase];
  if (!typingText) return;

  if (isDeleting) {
    typingText.textContent = phrase.slice(0, typingIndex - 1);
    typingIndex -= 1;
  } else {
    typingText.textContent = phrase.slice(0, typingIndex + 1);
    typingIndex += 1;
  }

  if (!isDeleting && typingIndex === phrase.length) {
    setTimeout(() => {
      isDeleting = true;
      typeHeroText();
    }, 1200);
    return;
  }

  if (isDeleting && typingIndex === 0) {
    isDeleting = false;
    currentPhrase = (currentPhrase + 1) % typingPhrases.length;
  }

  const delay = isDeleting ? 80 : 120;
  setTimeout(typeHeroText, delay);
}

// ============================================
// LOADING SCREEN - Animated Progress
// ============================================
const loadingMessages = [
  'Initializing...',
  'Loading assets...',
  'Configuring modules...',
  'Almost ready...',
  'Welcome!'
];

// Generate falling digital rain drops
function createLoaderRain() {
  const rainContainer = document.getElementById('loaderRain');
  if (!rainContainer) return;
  
  for (let i = 0; i < 80; i++) {
    const drop = document.createElement('div');
    drop.className = 'loader-rain-drop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    drop.style.animationDelay = (Math.random() * 3) + 's';
    drop.style.height = (Math.random() * 40 + 30) + 'px';
    rainContainer.appendChild(drop);
  }
}

function animateLoader() {
  if (!loaderProgressBar || !loaderStatus) return;
  
  let progress = 0;
  let msgIndex = 0;
  
  // Update status text periodically
  const statusInterval = setInterval(() => {
    msgIndex = Math.min(msgIndex + 1, loadingMessages.length - 1);
    if (loaderStatus) {
      loaderStatus.textContent = loadingMessages[msgIndex];
    }
  }, 400);
  
  // Animate progress bar from 0 to 100%
  const progressInterval = setInterval(() => {
    progress += Math.random() * 8 + 2; // 2-10% increments
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      
      // Set final status
      if (loaderStatus) {
        loaderStatus.textContent = 'Welcome!';
      }
      
      // Hide loader after a brief pause
      setTimeout(() => {
        if (loader) {
          loader.classList.add('hidden');
        }
        // Start typing animation after loader hides
        typeHeroText();
      }, 500);
    }
    
    if (loaderProgressBar) {
      loaderProgressBar.style.width = Math.min(progress, 100) + '%';
    }
    if (loaderPercentage) {
      loaderPercentage.textContent = Math.round(Math.min(progress, 100)) + '%';
    }
  }, 200);
}

window.addEventListener('load', () => {
  createLoaderRain();
  animateLoader();
});

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
    navToggle.classList.toggle('open');
    const expanded = siteNav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
}

// Close mobile nav when clicking outside or pressing Escape
document.addEventListener('click', (e) => {
  if (!siteNav || !navToggle) return;
  const isOpen = siteNav.classList.contains('open');
  if (!isOpen) return;
  const target = e.target;
  if (!siteNav.contains(target) && !navToggle.contains(target)) {
    siteNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && siteNav && siteNav.classList.contains('open')) {
    siteNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ============================================
// ULTRA SMOOTH SCROLLING
// ============================================
// Custom smooth scrolling with easing for ultra-smooth performance

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();
  
  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    
    window.scrollTo(0, startY + distance * easedProgress);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      event.preventDefault();
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80; // Account for fixed header
      smoothScrollTo(targetPosition, 1200);
      
      if (siteNav && siteNav.classList.contains('open') && navToggle) {
        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -120px 0px',
  threshold: 0.2,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Add visible class to timeline items within the section
      const timelineItems = entry.target.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 200);
      });
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

// Keep the sticky navigation in sync with the section currently in view.
const navSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  });
}, {
  rootMargin: '-35% 0px -55% 0px',
  threshold: 0,
});

document.querySelectorAll('main section[id]').forEach((section) => navSectionObserver.observe(section));

window.addEventListener('scroll', () => {
  if (!scrollTopBtn) return;
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    smoothScrollTo(0, 1000);
  });
}

// ============================================
// CUSTOM CURSOR DOTS (Desktop Only)
// ============================================
// Create dot 1 (cyan - follows cursor directly)
const cursorDot1 = document.createElement('div');
cursorDot1.className = 'cursor-dot cursor-dot-1';
document.body.appendChild(cursorDot1);

// Create dot 2 (violet - trails behind)
const cursorDot2 = document.createElement('div');
cursorDot2.className = 'cursor-dot cursor-dot-2';
document.body.appendChild(cursorDot2);

let mouseX = 0;
let mouseY = 0;
let dot2X = 0;
let dot2Y = 0;

// Show cursor dots after a short delay
setTimeout(() => {
  cursorDot1.classList.add('visible');
  cursorDot2.classList.add('visible');
}, 300);

// Track mouse movement for cursor dot 1
document.addEventListener('mousemove', (e) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot1.style.left = mouseX + 'px';
  cursorDot1.style.top = mouseY + 'px';
});

// Animate dot 2 to follow dot 1 with smooth delay
function animateCursorTrail() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Smoothly interpolate dot 2 towards dot 1
  dot2X += (mouseX - dot2X) * 0.12;
  dot2Y += (mouseY - dot2Y) * 0.12;
  
  cursorDot2.style.left = dot2X + 'px';
  cursorDot2.style.top = dot2Y + 'px';
  
  requestAnimationFrame(animateCursorTrail);
}

animateCursorTrail();

// Subtle depth interaction for the futuristic project and skill panels.
const interactiveCards = document.querySelectorAll('.skill-card, .achievement-card');

interactiveCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 900) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-6px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// ============================================
// 3D GLASSMORPHISM PROJECTS CAROUSEL
// ============================================
(function () {
  const carousel = document.getElementById('projectsCarousel');
  const stage = document.getElementById('projectsStage');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (!carousel || !stage) return;

  const cards = Array.from(stage.querySelectorAll('.project-card'));
  const total = cards.length;
  if (total === 0) return;

  let current = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === current ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      dot.addEventListener('click', () => {
        goTo(i);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function update() {
    cards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');
      const offset = (i - current + total) % total;

      if (offset === 0) {
        card.classList.add('is-active');
        card.setAttribute('aria-hidden', 'false');
      } else if (offset === 1) {
        card.classList.add('is-next');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === total - 1) {
        card.classList.add('is-prev');
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.classList.add('is-hidden');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }
  }

  function goTo(index) {
    current = (index + total) % total;
    update();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
    else if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  // Touch / swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next(); else prev();
      resetAutoplay();
    } else {
      startAutoplay();
    }
  }, { passive: true });

  buildDots();
  update();
  startAutoplay();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 150);
  });
})();



