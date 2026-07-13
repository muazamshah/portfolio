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

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
const interactiveCards = document.querySelectorAll('.skill-card, .project-card, .achievement-card');

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



