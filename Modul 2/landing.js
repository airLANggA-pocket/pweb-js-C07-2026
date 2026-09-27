// ---------- AUTH GUARD ----------
const firstName = localStorage.getItem('firstName');
if (!firstName) {
  window.location.href = 'login.html';
}
document.getElementById('greeting').textContent = `Halo, ${firstName}`;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('firstName');
  localStorage.removeItem('userId');
  localStorage.removeItem('cart');
  window.location.href = 'login.html';
});

// ---------- CART BADGE ----------
const CART_KEY = 'cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartBadge').textContent = totalQty;
}

document.getElementById('cartIcon').addEventListener('click', () => {
  window.location.href = 'index.html';
});

updateCartBadge();

// ---------- PRODUK UNGGULAN (fetch terbatas) ----------
const FEATURED_API = 'https://dummyjson.com/products?limit=4';const featuredGrid = document.getElementById('featuredGrid');
let featuredProducts = [];

function formatPrice(usd) {
  return 'Rp' + Math.round(usd * 15000).toLocaleString('id-ID');
}

function renderFeatured() {
  featuredGrid.innerHTML = '';
  featuredProducts.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = p.id;
    card.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.title}">
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <span class="product-name">${p.title}</span>
        <div class="product-price-row"><span class="product-price">${formatPrice(p.price)}</span></div>
        <span class="product-rating">★ ${p.rating}</span>
      </div>
      <button class="add-cart-btn" data-id="${p.id}">Tambah ke Keranjang</button>
    `;
    featuredGrid.appendChild(card);
  });
}

async function loadFeatured() {
  try {
    const res = await fetch(FEATURED_API);
    if (!res.ok) throw new Error('Gagal memuat produk unggulan.');

    const data = await res.json();
    featuredProducts = data.products;
    renderFeatured();
  } catch (err) {
    const errorBox = document.getElementById('globalErrorLanding');
    errorBox.textContent = err.message || 'Terjadi kesalahan saat memuat produk.';
    errorBox.hidden = false;
  }
}

featuredGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-cart-btn');

  if (btn) {
    const product = featuredProducts.find((p) => p.id === Number(btn.dataset.id));
    if (!product) return;

    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: product.id, title: product.title, price: product.price, qty: 1 });
    }

    saveCart(cart);
    return;
  }

  const card = e.target.closest('.product-card');
  if (card) window.location.href = 'index.html';
});

loadFeatured();

// ---------- HERO SLIDESHOW ----------
const slides = document.querySelectorAll('.hero-slide');
const dotsContainer = document.getElementById('slideDots');
const prevBtn = document.getElementById('slidePrev');
const nextBtn = document.getElementById('slideNext');

let currentSlide = 0;
let slideInterval;

// buat dot sesuai jumlah slide
slides.forEach((_, index) => {
  const dot = document.createElement('span');
  dot.className = 'slide-dot' + (index === 0 ? ' active' : '');
  dot.dataset.index = index;
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.slide-dot');

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 3500);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

nextBtn.addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

// Event delegation untuk klik dot
dotsContainer.addEventListener('click', (e) => {
  const dot = e.target.closest('.slide-dot');
  if (!dot) return;
  goToSlide(Number(dot.dataset.index));
  resetAutoSlide();
});

startAutoSlide();