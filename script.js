/* =========================================
   Cart State
   ========================================= */
let cartCount = 0;

/* =========================================
   Cart counter
   ========================================= */
function addToCart(btn) {
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;

  // Brief button feedback
  btn.textContent = 'Added!';
  btn.style.background = 'var(--color-accent)';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.style.background = '';
    btn.style.color = '';
  }, 1200);
}

/* =========================================
   Search functionality
   ========================================= */
const searchInput  = document.getElementById('search-input');
const searchBtn    = document.getElementById('search-btn');
const productsGrid = document.getElementById('products-grid');
const noResults    = document.getElementById('no-results');
const sectionTitle = document.querySelector('.section-title');

if (!searchInput || !searchBtn || !productsGrid || !noResults || !sectionTitle) {
  console.error('Search: one or more required elements are missing from the DOM.');
}

function filterProducts(query) {
  if (!productsGrid || !noResults || !sectionTitle) return;

  const cards = productsGrid.querySelectorAll('.product-card');
  // Sanitize: strip to plain text only (no HTML interpretation)
  const q = String(query).trim().toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    if (!q || name.includes(q)) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';

  if (q) {
    // Use textContent (never innerHTML) to prevent XSS
    sectionTitle.textContent = `Results for "${q}"`;
  } else {
    sectionTitle.textContent = 'Featured Products';
  }
}

searchInput.addEventListener('input', () => {
  filterProducts(searchInput.value);
});

searchBtn.addEventListener('click', () => {
  filterProducts(searchInput.value);
  // Scroll down to products on mobile
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    filterProducts(searchInput.value);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  }
});

/* =========================================
   Mobile Menu
   ========================================= */
const menuBtn    = document.getElementById('menu-btn');
const closeBtn   = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const overlay    = document.getElementById('menu-overlay');

if (!menuBtn || !closeBtn || !mobileMenu || !overlay) {
  console.error('Mobile menu: one or more required elements are missing from the DOM.');
}

function openMenu() {
  if (!mobileMenu || !overlay) return;
  mobileMenu.classList.add('open');
  overlay.classList.add('active');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (!mobileMenu || !overlay) return;
  mobileMenu.classList.remove('open');
  overlay.classList.remove('active');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (menuBtn) menuBtn.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
if (overlay) overlay.addEventListener('click', closeMenu);

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* =========================================
   Header shadow on scroll
   ========================================= */
const header = document.getElementById('site-header');

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}
