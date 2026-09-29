const PRODUCTS_API = 'https://dummyjson.com/products?limit=0';
const BATCH_SIZE = 8;

let allProducts = [];
let displayedProducts = [];
let visibleCount = BATCH_SIZE;

const productGrid = document.getElementById('productGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const globalError = document.getElementById('globalError');
const resultCount = document.getElementById('resultCount');
const categoryFilter = document.getElementById('categoryFilter');

function showGlobalError(message) {
  globalError.textContent = message;
  globalError.hidden = false;
}

// function formatPrice(usd) {
//   return 'Rp' + Math.round(usd * 15000).toLocaleString('id-ID');
// }

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = product.id;

  card.innerHTML = `
    <img src="${product.thumbnail}" alt="${product.title}">
    <div class="product-info">
      <span class="product-category">${product.category}</span>
      <span class="product-name">${product.title}</span>
      <div class="product-price-row">
        <span class="product-price">${(product.price)}</span>
        ${product.discountPercentage ? `<span class="product-discount">-${Math.round(product.discountPercentage)}%</span>` : ''}
      </div>
      <span class="product-rating">★ ${product.rating}</span>
    </div>
    <button class="add-cart-btn" data-id="${product.id}">Tambah ke Keranjang</button>
  `;
  return card;
}

function renderProducts() {
  productGrid.innerHTML = '';

  if (displayedProducts.length === 0) {
    productGrid.innerHTML = '<div class="empty-state">Produk tidak ditemukan.</div>';
    resultCount.textContent = '0 produk';
    loadMoreBtn.hidden = true;
    return;
  }

  const productsToShow = displayedProducts.slice(0, visibleCount);
  const fragment = document.createDocumentFragment();
  productsToShow.forEach((p) => fragment.appendChild(createProductCard(p)));
  productGrid.appendChild(fragment);

  resultCount.textContent = `${displayedProducts.length} produk`;
  loadMoreBtn.hidden = visibleCount >= displayedProducts.length;
}

loadMoreBtn.addEventListener('click', () => {
  visibleCount += BATCH_SIZE;
  renderProducts();
});

function populateCategoryOptions() {
  const categories = [...new Set(allProducts.map((p) => p.category))].sort();
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(opt);
  });
}

async function fetchProducts() {
  try {
    const res = await fetch(PRODUCTS_API);
    if (!res.ok) throw new Error('Gagal mengambil data produk dari server.');

    const data = await res.json();
    allProducts = data.products;
    displayedProducts = [...allProducts];

    populateCategoryOptions();
    renderProducts();
  } catch (err) {
    showGlobalError(err.message || 'Terjadi kesalahan saat memuat produk. Silakan refresh halaman.');
  }
}

fetchProducts();