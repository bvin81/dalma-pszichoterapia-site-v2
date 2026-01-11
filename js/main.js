/* ===================================================
   OPTIMALIZED MAIN.JS - Performance Enhanced + Multi-language Fix
   Jánosi Dalma - Pszichoterápia Website
   Version 2.1 - 2026.01.11
   =================================================== */

/* ---------------------------------------------------
   PERFORMANCE UTILITIES
--------------------------------------------------- */

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const rafThrottle = (callback) => {
  let requestId = null;
  let lastArgs;

  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };

  const throttled = function (...args) {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };

  throttled.cancel = () => {
    cancelAnimationFrame(requestId);
    requestId = null;
  };

  return throttled;
};

/* ---------------------------------------------------
   GLOBAL STATE
--------------------------------------------------- */
let cachedTranslations = null;
let currentLang = getCurrentLang();
let allPosts = [];
let currentCategory = 'all';

/* ---------------------------------------------------
   LANGUAGE MANAGEMENT
--------------------------------------------------- */

function getCurrentLang() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  
  if (urlLang && ['hu', 'ro', 'en'].includes(urlLang)) {
    return urlLang;
  }
  
  try {
    const stored = localStorage.getItem('lang');
    if (stored && ['hu', 'ro', 'en'].includes(stored)) {
      return stored;
    }
  } catch (e) {
    console.warn('LocalStorage not available:', e);
  }
  
  return 'hu';
}

function setLangCookie(lang) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `lang=${lang};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  
  try {
    localStorage.setItem('lang', lang);
  } catch (e) {
    console.warn('LocalStorage not available:', e);
  }
}

/* ---------------------------------------------------
   LANGUAGE SWITCHER - Event Delegation
--------------------------------------------------- */
const langSwitcher = document.querySelector(".lang-switcher");
if (langSwitcher) {
  const activeBtn = langSwitcher.querySelector(`[data-lang="${currentLang}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  langSwitcher.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    
    const newLang = btn.dataset.lang;
    if (newLang === currentLang) return;
    
    currentLang = newLang;
    setLangCookie(currentLang);
    
    langSwitcher.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    loadStaticText();
    
    if (document.getElementById("blogContainer")) {
      updateBlogSearchAndFilters(); // Frissíti a keresőmező és kategória gombokat
      renderBlogPosts(allPosts);
    }
    if (document.getElementById("postTitle")) {
      loadBlogPost();
    }
  });
}

/* ---------------------------------------------------
   MOBILE MENU
--------------------------------------------------- */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isVisible = mobileMenu.style.display === "flex";
    mobileMenu.style.display = isVisible ? "none" : "flex";
    menuBtn.classList.toggle("active");
    menuBtn.setAttribute('aria-expanded', !isVisible);
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === 'A') {
      mobileMenu.style.display = "none";
      menuBtn.classList.remove("active");
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------------------------------------------------
   DARK MODE
--------------------------------------------------- */
function initDarkMode() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.setAttribute('aria-label', 'Témaváltás');
  toggleBtn.innerHTML = savedTheme === 'dark' 
    ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM12 4c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1s1 .4 1 1v2c0 .6-.4 1-1 1zm0 20c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1s1 .4 1 1v2c0 .6-.4 1-1 1zM23 12c0 .6-.4 1-1 1h-2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1zM5 12c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1zm13.7 6.3c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-1.4 1.4zM6.7 7.7c-.4.4-1 .4-1.4 0L3.9 6.3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.4 1.4c.4.4.4 1 0 1.4zm11 0c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L15 7.7c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.3 1.4zm-11 9.6c.4.4.4 1 0 1.4l-1.4 1.4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    toggleBtn.innerHTML = newTheme === 'dark'
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM12 4c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1s1 .4 1 1v2c0 .6-.4 1-1 1zm0 20c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1s1 .4 1 1v2c0 .6-.4 1-1 1zM23 12c0 .6-.4 1-1 1h-2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1zM5 12c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1zm13.7 6.3c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-1.4 1.4zM6.7 7.7c-.4.4-1 .4-1.4 0L3.9 6.3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.4 1.4c.4.4.4 1 0 1.4zm11 0c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L15 7.7c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.3 1.4zm-11 9.6c.4.4.4 1 0 1.4l-1.4 1.4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0z"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  });
}

/* ---------------------------------------------------
   SCROLL TO TOP
--------------------------------------------------- */
function initScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Vissza a tetejére');
  scrollBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.4 1.4 4.6-4.6 4.6 4.6L18 14z"/></svg>';
  document.body.appendChild(scrollBtn);

  const handleScroll = rafThrottle(() => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  window.addEventListener('scroll', handleScroll, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------
   LAZY LOADING
--------------------------------------------------- */
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  } else {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/* ---------------------------------------------------
   BASE PATH DETECTION
--------------------------------------------------- */
function getBasePath() {
  const path = window.location.pathname;
  
  if (path.includes("/service/")) {
    const parts = path.split('/');
    const repoIndex = parts.findIndex(p => p !== '');
    
    if (repoIndex >= 0 && parts[repoIndex] !== 'service') {
      return `/${parts[repoIndex]}/`;
    }
    return "../";
  }
  
  const parts = path.split('/').filter(p => p !== '');
  
  if (parts.length > 1 && parts[0] !== 'index.html' && parts[0] !== 'blog.html') {
    return `/${parts[0]}/`;
  }
  
  return "./";
}

/* ---------------------------------------------------
   STATIC TEXT LOADING
--------------------------------------------------- */
function loadStaticText() {
  if (cachedTranslations) {
    updateDOM(cachedTranslations);
    return;
  }
  
  const basePath = getBasePath();
  const langPath = basePath + "lang.json";

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
      console.error("❌ Error loading lang.json:", error);
    });
}

function updateDOM(data) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.dataset.key;
    if (data[key] && data[key][currentLang]) {
      el.innerHTML = data[key][currentLang];
    }
  });

  document.querySelectorAll("[data-key-placeholder]").forEach(el => {
    const key = el.dataset.keyPlaceholder;
    if (data[key] && data[key][currentLang]) {
      el.placeholder = data[key][currentLang];
    }
  });
}

/* ---------------------------------------------------
   BLOG LIST
--------------------------------------------------- */
function loadBlogList() {
  const container = document.getElementById("blogContainer");
  if (!container) return;

  const basePath = getBasePath();
  const blogPath = basePath + "blog-posts.json";

  fetch(blogPath)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(posts => {
      allPosts = posts;
      renderBlogPosts(posts);
      initBlogSearch();
      initCategoryFilter();
    })
    .catch(error => {
      console.error("❌ Error loading blog posts:", error);
      container.innerHTML = '<p class="no-results">Nem sikerült betölteni a blogposztokat.</p>';
    });
}

function renderBlogPosts(posts) {
  const container = document.getElementById("blogContainer");
  if (!container) return;

  const basePath = getBasePath();
  
  if (posts.length === 0) {
    container.innerHTML = '<p class="no-results">Nincs találat.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  
  posts.forEach(post => {
    const title = post.title?.[currentLang] || 'Untitled';
    const postLink = basePath + `blog-post.html?id=${post.id}&lang=${currentLang}`;
    const imageSrc = post.image.startsWith('/') ? post.image : basePath + post.image;
    const categoryBadge = post.category 
      ? `<span class="badge badge-category">${post.category[currentLang] || post.category.hu}</span>`
      : '';
    
    const card = document.createElement('a');
    card.href = postLink;
    card.className = 'blog-card card fade-in';
    card.innerHTML = `
      <div class="blog-card-image card-image">
        <img src="${imageSrc}" alt="${title}" loading="lazy">
      </div>
      <div class="blog-card-content card-content">
        ${categoryBadge}
        <h3>${title}</h3>
      </div>
    `;
    
    fragment.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
}

/* ---------------------------------------------------
   BLOG SEARCH
--------------------------------------------------- */
function initBlogSearch() {
  const searchContainer = document.querySelector('.blog-list .container');
  if (!searchContainer || document.getElementById('blogSearch')) return;

  const searchBar = document.createElement('div');
  searchBar.className = 'search-bar';
  searchBar.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
    <input type="text" id="blogSearch" placeholder="${getSearchPlaceholder()}">
  `;
  
  searchContainer.insertBefore(searchBar, document.getElementById('blogContainer'));

  const searchInput = document.getElementById('blogSearch');
  
  const debouncedSearch = debounce((query) => {
    filterPosts(query.toLowerCase(), currentCategory);
  }, 300);

  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });
}

function getSearchPlaceholder() {
  if (!cachedTranslations) return 'Keresés a blogban...';
  const key = 'blog_search_placeholder';
  return cachedTranslations[key]?.[currentLang] || 'Keresés a blogban...';
}

/* ---------------------------------------------------
   CATEGORY FILTER
--------------------------------------------------- */
function initCategoryFilter() {
  const searchContainer = document.querySelector('.blog-list .container');
  if (!searchContainer || document.getElementById('categoryFilter')) return;

  const categories = ['all', ...new Set(allPosts.map(post => post.category?.en).filter(Boolean))];
  
  const filterBar = document.createElement('div');
  filterBar.className = 'category-filter';
  filterBar.id = 'categoryFilter';
  
  const categoryNames = {
    'all': { hu: 'Összes', ro: 'Toate', en: 'All' },
    'anxiety': { hu: 'Szorongás', ro: 'Anxietate', en: 'Anxiety' },
    'relationships': { hu: 'Kapcsolatok', ro: 'Relații', en: 'Relationships' },
    'family': { hu: 'Családterápia', ro: 'Terapie de familie', en: 'Family Therapy' },
    'personal-growth': { hu: 'Személyes fejlődés', ro: 'Dezvoltare personală', en: 'Personal Growth' }
  };

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = cat === 'all' ? 'category-btn active' : 'category-btn';
    btn.textContent = categoryNames[cat]?.[currentLang] || cat;
    btn.dataset.category = cat;
    filterBar.appendChild(btn);
  });

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;

    filterBar.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    
    const searchQuery = document.getElementById('blogSearch')?.value.toLowerCase() || '';
    filterPosts(searchQuery, currentCategory);
  });

  const blogContainer = document.getElementById('blogContainer');
  searchContainer.insertBefore(filterBar, blogContainer);
}

/* ---------------------------------------------------
   UPDATE BLOG SEARCH AND FILTERS (Nyelvváltáskor)
--------------------------------------------------- */
function updateBlogSearchAndFilters() {
  // Frissítjük a keresőmező placeholder-ét
  const searchInput = document.getElementById('blogSearch');
  if (searchInput && cachedTranslations) {
    searchInput.placeholder = cachedTranslations['blog_search_placeholder']?.[currentLang] || 'Keresés a blogban...';
  }

  // Frissítjük a kategória gombok szövegét
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    const categoryNames = {
      'all': { hu: 'Összes', ro: 'Toate', en: 'All' },
      'anxiety': { hu: 'Szorongás', ro: 'Anxietate', en: 'Anxiety' },
      'relationships': { hu: 'Kapcsolatok', ro: 'Relații', en: 'Relationships' },
      'family': { hu: 'Családterápia', ro: 'Terapie de familie', en: 'Family Therapy' },
      'personal-growth': { hu: 'Személyes fejlődés', ro: 'Dezvoltare personală', en: 'Personal Growth' }
    };

    categoryFilter.querySelectorAll('.category-btn').forEach(btn => {
      const cat = btn.dataset.category;
      btn.textContent = categoryNames[cat]?.[currentLang] || cat;
    });
  }
}

function filterPosts(query, category) {
  let filtered = allPosts;

  if (category !== 'all') {
    filtered = filtered.filter(post => post.category?.en === category);
  }

  if (query) {
    filtered = filtered.filter(post => {
      const title = (post.title?.[currentLang] || '').toLowerCase();
      const content = (post.content?.[currentLang] || []).join(' ').toLowerCase();
      return title.includes(query) || content.includes(query);
    });
  }

  renderBlogPosts(filtered);
}

/* ---------------------------------------------------
   BLOG POST LOADING
--------------------------------------------------- */
function loadBlogPost() {
  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const postImage = document.getElementById("postImage");
  
  if (!postTitle || !postContent || !postImage) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  
  if (!id) {
    console.error("❌ No ID parameter in URL!");
    postContent.innerHTML = '<p class="no-results">Nincs megadva blogposzt azonosító.</p>';
    return;
  }

  const basePath = getBasePath();
  const blogPath = basePath + "blog-posts.json";

  fetch(blogPath)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(posts => {
      const post = posts.find(p => p.id == id);
      
      if (!post) {
        console.error("❌ Post not found:", id);
        postContent.innerHTML = '<p class="no-results">A keresett blogposzt nem található.</p>';
        return;
      }

      const title = post.title?.[currentLang] || 'Untitled';
      postTitle.textContent = title;

      const imageSrc = post.image.startsWith('/') ? post.image : basePath + post.image;
      postImage.src = imageSrc;
      postImage.alt = title;

      if (post.content?.[currentLang]) {
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content[currentLang].join('');
        fragment.appendChild(tempDiv);
        postContent.innerHTML = '';
        postContent.appendChild(fragment);
      } else {
        postContent.innerHTML = '<p class="no-results">Nincs elérhető tartalom ezen a nyelven.</p>';
      }

      renderRelatedPosts(posts, post, basePath);
    })
    .catch(error => {
      console.error("❌ Error loading blog post:", error);
      postContent.innerHTML = '<p class="no-results">Nem sikerült betölteni a blogposztot.</p>';
    });
}

/* ---------------------------------------------------
   RELATED POSTS
--------------------------------------------------- */
function renderRelatedPosts(allPosts, currentPost, basePath) {
  const postContent = document.getElementById("postContent");
  if (!postContent) return;

  const related = allPosts
    .filter(p => 
      p.id !== currentPost.id && 
      p.category?.en === currentPost.category?.en
    )
    .slice(0, 3);

  if (related.length === 0) return;

  const relatedSection = document.createElement('div');
  relatedSection.className = 'related-posts';
  
  const title = document.createElement('h3');
  title.textContent = 'Kapcsolódó cikkek';
  relatedSection.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'related-posts-grid';

  related.forEach(post => {
    const postTitle = post.title?.[currentLang] || 'Untitled';
    const imageSrc = post.image.startsWith('/') ? post.image : basePath + post.image;
    const postLink = basePath + `blog-post.html?id=${post.id}&lang=${currentLang}`;
    
    const card = document.createElement('a');
    card.href = postLink;
    card.className = 'blog-card card';
    card.innerHTML = `
      <div class="blog-card-image card-image">
        <img src="${imageSrc}" alt="${postTitle}" loading="lazy">
      </div>
      <div class="blog-card-content card-content">
        <h3 class="fs-base">${postTitle}</h3>
      </div>
    `;
    
    grid.appendChild(card);
  });

  relatedSection.appendChild(grid);
  postContent.appendChild(relatedSection);
}

/* ---------------------------------------------------
   CONTACT FORM
--------------------------------------------------- */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  let emailJSLoaded = false;

  const loadEmailJS = () => {
    if (emailJSLoaded) return;
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      emailjs.init("_Rq7FAjiXz4lWprzY");
      emailJSLoaded = true;
    };
    document.head.appendChild(script);
  };

  contactForm.addEventListener('focus', loadEmailJS, { once: true, capture: true });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (this.website.value !== "") {
      console.warn("⚠️ Spam detected: honeypot filled.");
      return;
    }

    if (!emailJSLoaded) {
      alert("Kérlek várj egy pillanatot...");
      loadEmailJS();
      setTimeout(() => contactForm.requestSubmit(), 1000);
      return;
    }

    const fullName = this.lastname.value + " " + this.firstname.value;
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.innerHTML = '<span class="loading"></span> Küldés...';
    submitBtn.disabled = true;

    emailjs.send("service_wlz0mh8", "template_htc2v29", {
      name: fullName,
      email: this.email.value,
      phone: this.phone.value || "Nincs megadva",
      message: this.message.value
    })
    .then(() => {
      alert("Köszönöm! Az üzenet sikeresen elküldve.");
      this.reset();
    })
    .catch((err) => {
      alert("Hiba történt az üzenet küldésekor. Kérlek próbáld újra!");
      console.error("❌ EmailJS error:", err);
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}

/* ---------------------------------------------------
   PAGE INITIALIZATION
--------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  console.log("🚀 Page loaded, base path:", getBasePath());
  
  initDarkMode();
  initScrollToTop();
  initLazyLoading();
  loadStaticText();

  if (document.getElementById("blogContainer")) {
    loadBlogList();
  }

  if (document.getElementById("postTitle")) {
    loadBlogPost();
  }

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.card, .service-card, section').forEach(el => {
      observer.observe(el);
    });
  }
});
