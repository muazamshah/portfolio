const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const sections = document.querySelectorAll('.section');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const loader = document.getElementById('pageLoader');
const typingText = document.getElementById('typingText');

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

window.addEventListener('load', () => {
  if (loader) {
    loader.style.display = 'none';
  }
  typeHeroText();
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
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

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



