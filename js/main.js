/* ===================================================
   ENHANCED MAIN.JS
   Jánosi Dalma - Pszichoterápia Website
   =================================================== */

/* ---------------------------------------------------
   MOBIL MENÜ
--------------------------------------------------- */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isVisible = mobileMenu.style.display === "flex";
    mobileMenu.style.display = isVisible ? "none" : "flex";
    menuBtn.classList.toggle("active");
  });

  // Bezárás kattintásra
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.style.display = "none";
      menuBtn.classList.remove("active");
    });
  });
}

/* ---------------------------------------------------
   DARK MODE TOGGLE
--------------------------------------------------- */
function initDarkMode() {
  // Ellenőrizzük a mentett témát
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Toggle gomb létrehozása
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
    
    // Ikon csere
    toggleBtn.innerHTML = newTheme === 'dark'
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM12 4c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1s1 .4 1 1v2c0 .6-.4 1-1 1zm0 20c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1s1 .4 1 1v2c0 .6-.4 1-1 1zM23 12c0 .6-.4 1-1 1h-2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1zM5 12c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1zm13.7 6.3c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-1.4 1.4zM6.7 7.7c-.4.4-1 .4-1.4 0L3.9 6.3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.4 1.4c.4.4.4 1 0 1.4zm11 0c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L15 7.7c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.3 1.4zm-11 9.6c.4.4.4 1 0 1.4l-1.4 1.4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0z"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  });
}

/* ---------------------------------------------------
   SCROLL TO TOP BUTTON
--------------------------------------------------- */
function initScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Vissza a tetejére');
  scrollBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.4 1.4 4.6-4.6 4.6 4.6L18 14z"/></svg>';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------
   LAZY LOADING KÉPEKHEZ
--------------------------------------------------- */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
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

  images.forEach(img => imageObserver.observe(img));
}

/* ---------------------------------------------------
   NYELVVÁLTÓ - Cookie-val
--------------------------------------------------- */
function getCurrentLang() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  
  if (urlLang && ['hu', 'ro', 'en'].includes(urlLang)) {
    return urlLang;
  }
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'lang') {
      return value;
    }
  }
  
  return 'hu';
}

let currentLang = getCurrentLang();

function setLangCookie(lang) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `lang=${lang};expires=${expires.toUTCString()};path=/`;
}

document.querySelectorAll(".lang-switcher button").forEach(btn => {
  if (btn.dataset.lang === currentLang) {
    btn.classList.add('active');
  }
  
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    setLangCookie(currentLang);
    
    document.querySelectorAll(".lang-switcher button").forEach(b => {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    loadStaticText();
    
    if (document.getElementById("blogContainer")) {
      loadBlogList();
    }
    if (document.getElementById("postTitle")) {
      loadBlogPost();
    }
  });
});

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
   STATIKUS SZÖVEGEK BETÖLTÉSE
--------------------------------------------------- */
let cachedTranslations = null;

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
      console.error("❌ Hiba a lang.json betöltésekor:", error);
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
   BLOG LISTA BETÖLTÉSE + KERESÉS + KATEGÓRIÁK
--------------------------------------------------- */
let allPosts = [];
let currentCategory = 'all';

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
      console.error("❌ Hiba a blog-posts.json betöltésekor:", error);
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

  container.innerHTML = "";
  
  posts.forEach(post => {
    const title = post.title && post.title[currentLang] 
      ? post.title[currentLang] 
      : 'Untitled';
    
    const postLink = basePath + `blog-post.html?id=${post.id}&lang=${currentLang}`;
    const imageSrc = post.image.startsWith('/') ? post.image : basePath + post.image;
    
    const categoryBadge = post.category 
      ? `<span class="badge badge-category">${post.category[currentLang] || post.category.hu}</span>`
      : '';
    
    container.innerHTML += `
      <a href="${postLink}" class="blog-card card fade-in">
        <div class="blog-card-image card-image">
          <img data-src="${imageSrc}" src="${basePath}images/placeholder.jpg" alt="${title}" class="lazy">
        </div>
        <div class="blog-card-content card-content">
          ${categoryBadge}
          <h3>${title}</h3>
        </div>
      </a>
    `;
  });

  // Lazy loading inicializálás az új képekhez
  initLazyLoading();
}

/* ---------------------------------------------------
   BLOG KERESÉS
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
    <input type="text" id="blogSearch" placeholder="Keresés a blogban...">
  `;
  
  searchContainer.insertBefore(searchBar, document.getElementById('blogContainer'));

  const searchInput = document.getElementById('blogSearch');
  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = e.target.value.toLowerCase();
      filterPosts(query, currentCategory);
    }, 300);
  });
}

/* ---------------------------------------------------
   KATEGÓRIA SZŰRŐ
--------------------------------------------------- */
function initCategoryFilter() {
  const searchContainer = document.querySelector('.blog-list .container');
  if (!searchContainer || document.getElementById('categoryFilter')) return;

  // Kategóriák kinyerése a posztokból
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
    
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = cat;
      
      const searchQuery = document.getElementById('blogSearch')?.value.toLowerCase() || '';
      filterPosts(searchQuery, cat);
    });
    
    filterBar.appendChild(btn);
  });

  const blogContainer = document.getElementById('blogContainer');
  searchContainer.insertBefore(filterBar, blogContainer);
}

function filterPosts(query, category) {
  let filtered = allPosts;

  // Kategória szűrés
  if (category !== 'all') {
    filtered = filtered.filter(post => post.category?.en === category);
  }

  // Keresés
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
   BLOG BEJEGYZÉS BETÖLTÉSE + KAPCSOLÓDÓ POSZTOK
--------------------------------------------------- */
function loadBlogPost() {
  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const postImage = document.getElementById("postImage");
  
  if (!postTitle || !postContent || !postImage) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  
  if (!id) {
    console.error("❌ Nincs ID paraméter az URL-ben!");
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
        console.error("❌ Nem található a bejegyzés:", id);
        postContent.innerHTML = '<p class="no-results">A keresett blogposzt nem található.</p>';
        return;
      }

      const title = post.title && post.title[currentLang] 
        ? post.title[currentLang] 
        : 'Untitled';
      postTitle.innerHTML = title;

      const imageSrc = post.image.startsWith('/') ? post.image : basePath + post.image;
      postImage.setAttribute('data-src', imageSrc);
      postImage.src = basePath + 'images/placeholder.jpg';
      postImage.alt = title;
      postImage.classList.add('lazy');

      postContent.innerHTML = "";
      if (post.content && post.content[currentLang]) {
        post.content[currentLang].forEach(block => {
          postContent.innerHTML += block;
        });
      } else {
        postContent.innerHTML = '<p class="no-results">Nincs elérhető tartalom ezen a nyelven.</p>';
      }

      // Kapcsolódó posztok
      renderRelatedPosts(posts, post, basePath);

      // Lazy loading
      initLazyLoading();
    })
    .catch(error => {
      console.error("❌ Hiba a blogposzt betöltésekor:", error);
      postContent.innerHTML = '<p class="no-results">Nem sikerült betölteni a blogposztot.</p>';
    });
}

/* ---------------------------------------------------
   KAPCSOLÓDÓ POSZTOK
--------------------------------------------------- */
function renderRelatedPosts(allPosts, currentPost, basePath) {
  const postContent = document.getElementById("postContent");
  if (!postContent) return;

  // Ugyanabból a kategóriából, de ne az aktuális poszt
  const related = allPosts
    .filter(p => 
      p.id !== currentPost.id && 
      p.category?.en === currentPost.category?.en
    )
    .slice(0, 3);

  if (related.length === 0) return;

  const relatedSection = document.createElement('div');
  relatedSection.className = 'related-posts';
  relatedSection.innerHTML = `
    <h3>Kapcsolódó cikkek</h3>
    <div class="related-posts-grid">
      ${related.map(post => {
        const title = post.title?.[currentLang] || 'Untitled';
        const imageSrc = post.image.startsWith('/') ? post.image : basePath + post.image;
        const postLink = basePath + `blog-post.html?id=${post.id}&lang=${currentLang}`;
        
        return `
          <a href="${postLink}" class="blog-card card">
            <div class="blog-card-image card-image">
              <img data-src="${imageSrc}" src="${basePath}images/placeholder.jpg" alt="${title}" class="lazy">
            </div>
            <div class="blog-card-content card-content">
              <h3 class="fs-base">${title}</h3>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  `;

  postContent.appendChild(relatedSection);
}



/* ---------------------------------------------------
   KAPCSOLAT ŰRLAP
--------------------------------------------------- */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot ellenőrzés
    if (this.website.value !== "") {
      console.warn("⚠️ Spam gyanú: honeypot mező kitöltve.");
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
      console.error("❌ EmailJS hiba:", err);
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}

/* ---------------------------------------------------
   OLDAL BETÖLTÉSEKOR
--------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  console.log("🚀 Oldal betöltve, base path:", getBasePath());
  
  // Alapvető funkciók inicializálása
  initDarkMode();
  initScrollToTop();
  initLazyLoading();
  loadStaticText();

  // Blog specifikus
  if (document.getElementById("blogContainer")) {
    loadBlogList();
  }

  if (document.getElementById("postTitle")) {
    loadBlogPost();
  }

  // Smooth reveal animációk
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
});
