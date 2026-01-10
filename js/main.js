// =====================================================
// MAIN.JS - KOMPLEX VIZUÁLIS VERZIÓ
// Jánosi Dalma pszichoterápia oldal
// 2026.01.10 - scroll animációk és interaktív elemek
// =====================================================

// ---------------------------------------------------
// MOBIL MENÜ
// ---------------------------------------------------
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.style.display = 
      mobileMenu.style.display === 'flex' ? 'none' : 'flex';
  });
}

// ---------------------------------------------------
// NYELVVÁLTÓ - cookie alapú
// ---------------------------------------------------
function getCurrentLang() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (['hu', 'ro', 'en'].includes(urlLang)) return urlLang;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'lang') return value;
  }
  return 'hu';
}

let currentLang = getCurrentLang();

function setLangCookie(lang) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `lang=${lang};expires=${expires.toUTCString()};path=/`;
}

document.querySelectorAll('.lang-switcher button').forEach(btn => {
  if (btn.dataset.lang === currentLang) {
    btn.style.fontWeight = 'bold';
    btn.style.color = '#819A88';
  }
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    setLangCookie(currentLang);
    document.querySelectorAll('.lang-switcher button').forEach(b => {
      b.style.fontWeight = 'normal';
      b.style.color = '';
    });
    btn.style.fontWeight = 'bold';
    btn.style.color = '#819A88';
    loadStaticText();
    
    if (document.getElementById('blogContainer')) loadBlogList();
    if (document.getElementById('postTitle')) loadBlogPost();
  });
});

// ---------------------------------------------------
// GITHUB PAGES FIX - Automatikus base path
// ---------------------------------------------------
function getBasePath() {
  const path = window.location.pathname;
  
  if (path.includes('service')) {
    const parts = path.split('/').filter(p => p);
    const repoIndex = parts.findIndex(p => p !== '');
    if (repoIndex > 0 && parts[repoIndex] !== 'service') {
      return '/' + parts.slice(0, repoIndex).join('/');
    }
    return '..';
  }
  
  const parts = path.split('/').filter(p => p !== '');
  if (parts.length === 1 && parts[0] !== 'index.html' && parts[0] !== 'blog.html') {
    return '/' + parts[0];
  }
  return '.';
}

// ---------------------------------------------------
// STATIKUS SZÖVEGEK BETÖLTÉSE
// ---------------------------------------------------
let cachedTranslations = null;

function loadStaticText() {
  if (cachedTranslations) {
    updateDOM(cachedTranslations);
    return;
  }
  
  const basePath = getBasePath();
  const langPath = `${basePath}/lang.json`;
  
  fetch(langPath)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      cachedTranslations = data;
      updateDOM(data);
    })
    .catch(error => {
      console.error('Hiba a lang.json betöltésekor:', error);
    });
}

function updateDOM(data) {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (data[key] && data[key][currentLang]) {
      el.innerHTML = data[key][currentLang];
    }
  });
  
  document.querySelectorAll('[data-key-placeholder]').forEach(el => {
    const key = el.dataset.keyPlaceholder;
    if (data[key] && data[key][currentLang]) {
      el.placeholder = data[key][currentLang];
    }
  });
}

// ---------------------------------------------------
// BLOG LISTA BETÖLTÉSE
// ---------------------------------------------------
function loadBlogList() {
  const container = document.getElementById('blogContainer');
  if (!container) return;
  
  const basePath = getBasePath();
  const blogPath = `${basePath}/blog-posts.json`;
  
  fetch(blogPath)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(posts => {
      container.innerHTML = '';
      posts.forEach((post, index) => {
        const title = post.title[currentLang] || post.title || 'Untitled';
        const postLink = `${basePath}/blog-post.html?id=${post.id}&lang=${currentLang}`;
        const imageSrc = post.image.startsWith('http') || post.image.startsWith('/') 
          ? post.image 
          : `${basePath}/${post.image}`;
        
        const card = `
          <a href="${postLink}" class="blog-card fade-in delay-${(index % 6) + 1}">
            <div class="blog-card-image">
              <img src="${imageSrc}" alt="${title}" 
                   onerror="this.src='${basePath}/images/placeholder.jpg'">
            </div>
            <div class="blog-card-content">
              <h3>${title}</h3>
            </div>
          </a>
        `;
        container.innerHTML += card;
      });
      
      // Scroll animáció trigger
      setTimeout(() => {
        observeElements();
      }, 100);
    })
    .catch(error => {
      console.error('Hiba a blog-posts.json betöltésekor:', error);
      container.innerHTML = '<p style="text-align:center;color:#999;">Nem sikerült betölteni a blogposztokat.</p>';
    });
}

// ---------------------------------------------------
// BLOG BEJEGYZÉS BETÖLTÉSE
// ---------------------------------------------------
function loadBlogPost() {
  const postTitle = document.getElementById('postTitle');
  const postContent = document.getElementById('postContent');
  const postImage = document.getElementById('postImage');
  
  if (!postTitle || !postContent || !postImage) return;
  
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  if (!id) {
    postContent.innerHTML = '<p style="text-align:center;color:#999;">Nincs megadva blogposzt azonosító.</p>';
    return;
  }
  
  const basePath = getBasePath();
  const blogPath = `${basePath}/blog-posts.json`;
  
  fetch(blogPath)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(posts => {
      const post = posts.find(p => p.id == id);
      if (!post) {
        postContent.innerHTML = '<p style="text-align:center;color:#999;">A keresett blogposzt nem található.</p>';
        return;
      }
      
      const title = post.title[currentLang] || post.title || 'Untitled';
      const imageSrc = post.image.startsWith('http') || post.image.startsWith('/') 
        ? post.image 
        : `${basePath}/${post.image}`;
      
      postTitle.innerHTML = title;
      postImage.src = imageSrc;
      postImage.alt = title;
      postImage.onerror = function() { this.src = `${basePath}/images/placeholder.jpg`; };
      
      postContent.innerHTML = '';
      if (post.content && post.content[currentLang]) {
        post.content[currentLang].forEach(block => {
          postContent.innerHTML += block;
        });
      } else {
        postContent.innerHTML = '<p style="color:#999;">Nincs elérhető tartalom ezen a nyelven.</p>';
      }
    })
    .catch(error => {
      console.error('Hiba a blogposzt betöltésekor:', error);
      postContent.innerHTML = '<p style="text-align:center;color:#999;">Nem sikerült betölteni a blogposztot.</p>';
    });
}

// ---------------------------------------------------
// KAPCSOLAT ŰRLAP - HONEYPOT + EMAILJS
// ---------------------------------------------------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.website && this.website.value !== '') {
      console.warn('Spam gyanú: honeypot mező kitöltve.');
      return;
    }
    
    const fullName = `${this.lastname.value} ${this.firstname.value}`.trim();
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Küldés...';
    submitBtn.disabled = true;
    
    emailjs.send('service_wlz0mh8', 'template_htc2v29', {
      name: fullName,
      email: this.email.value,
      phone: this.phone.value || 'Nincs megadva',
      message: this.message.value
    })
    .then(() => {
      alert('Köszönöm! Az üzenet sikeresen elküldve.');
      this.reset();
    })
    .catch(err => {
      alert('Hiba történt az üzenet küldésekor. Kérlek próbáld újra!');
      console.error('EmailJS hiba:', err);
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}

// ---------------------------------------------------
// HERO PARALLAX HATÁS
// ---------------------------------------------------
let parallaxTicking = false;

function updateHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const rect = hero.getBoundingClientRect();
  const scrollProgress = -(rect.top / window.innerHeight) * 0.5;
  hero.style.setProperty('--scroll-progress', scrollProgress);
  hero.classList.add('parallax');
}

function requestParallaxTick() {
  if (!parallaxTicking) {
    requestAnimationFrame(updateHeroParallax);
    parallaxTicking = true;
  }
}

window.addEventListener('scroll', () => {
  requestParallaxTick();
  parallaxTicking = false;
}, { passive: true });

// ---------------------------------------------------
// SCROLL ANIMÁCIÓK - INTERSECTION OBSERVER
// ---------------------------------------------------
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Service kártyák animációja
  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.classList.add('fade-in');
    card.classList.add(`delay-${(index % 6) + 1}`);
    observer.observe(card);
  });
  
  // Blog kártyák animációja
  document.querySelectorAll('.blog-card').forEach((card) => {
    observer.observe(card);
  });
  
  // About section animáció
  const aboutImage = document.querySelector('.about-image');
  const aboutText = document.querySelector('.about-text');
  
  if (aboutImage) {
    aboutImage.classList.add('slide-in-left');
    observer.observe(aboutImage);
  }
  
  if (aboutText) {
    aboutText.classList.add('slide-in-right');
    observer.observe(aboutText);
  }
  
  // Kapcsolat form animáció
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.classList.add('fade-in');
    observer.observe(contactForm);
  }
  
  // Service detail animációk
  const serviceLeft = document.querySelector('.two-columns .left');
  const infoBox = document.querySelector('.info-box');
  
  if (serviceLeft) {
    serviceLeft.classList.add('fade-in');
    observer.observe(serviceLeft);
  }
  
  if (infoBox) {
    infoBox.classList.add('fade-in', 'delay-2');
    observer.observe(infoBox);
  }
}

// ---------------------------------------------------
// HEADER SCROLL EFFEKT
// ---------------------------------------------------
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
}, { passive: true });

// ---------------------------------------------------
// SMOOTH SCROLL NAVIGÁCIÓ
// ---------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip empty anchors
    if (href === '#' || href === '#!') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Mobil menü bezárása
      if (mobileMenu && mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
      }
    }
  });
});

// ---------------------------------------------------
// IMAGE LAZY LOADING ENHANCEMENT
// ---------------------------------------------------
function enhanceImageLoading() {
  const images = document.querySelectorAll('img[src]');
  
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '0';
      setTimeout(() => {
        this.style.transition = 'opacity 0.5s ease';
        this.style.opacity = '1';
      }, 50);
    });
  });
}

// ---------------------------------------------------
// PRELOADER (opcionális)
// ---------------------------------------------------
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
          preloader.remove();
        }, 500);
      }, 500);
    });
  }
}

// ---------------------------------------------------
// SERVICE CARD IMAGE OVERFLOW FIX
// ---------------------------------------------------
function setupServiceCards() {
  document.querySelectorAll('.service-card').forEach(card => {
    const img = card.querySelector('img');
    if (img) {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.style.borderRadius = '16px 16px 0 0';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    }
  });
}

// ---------------------------------------------------
// OLDAL BETÖLTÉSEKOR
// ---------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  loadStaticText();
  
  if (document.getElementById('blogContainer')) loadBlogList();
  if (document.getElementById('postTitle')) loadBlogPost();
  
  // Parallax inicializálás
  setTimeout(updateHeroParallax, 100);
  
  // Scroll animációk indítása
  setTimeout(() => {
    observeElements();
  }, 300);
  
  // Service cards setup
  setupServiceCards();
  
  // Image loading enhancement
  enhanceImageLoading();
  
  // Preloader
  initPreloader();
});

// Performance optimization - debounce scroll
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add resize handler
window.addEventListener('resize', debounce(() => {
  updateHeroParallax();
}, 250));
