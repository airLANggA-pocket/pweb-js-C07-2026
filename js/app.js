// state gloval
let rawProducts = [];      
let filteredProducts = []; 
let currentPage = 1;
const ITEMS_PER_PAGE = 8;  

// main dom
const productGrid = document.getElementById('product-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const categoryFilter = document.getElementById('category-filter');

// fetch product from API
async function fetchProducts() {
  try {
    productGrid.innerHTML = '<p class="loading-text">Memuat produk...</p>';

    const response = await fetch('https://dummyjson.com/products?limit=100');
    if (!response.ok) throw new Error('Gagal mengambil data dari server');

    const data = await response.json();
    rawProducts = data.products;
    filteredProducts = [...rawProducts];

    populateCategories(rawProducts);

    renderProducts(true);
  } catch (error) {
    productGrid.innerHTML = `<p class="error-text">❌ Gagal memuat produk: ${error.message}</p>`;
  }
}

// dropdown categories
function populateCategories(products) {
  if (!categoryFilter) return;
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// render card product
function renderProducts(resetPage = false) {
  if (!productGrid) return;

  if (resetPage) {
    currentPage = 1;
    productGrid.innerHTML = '';
  }

  const startIndex = 0;
  const endIndex = currentPage * ITEMS_PER_PAGE;
  const itemsToRender = filteredProducts.slice(startIndex, endIndex);

  if (itemsToRender.length === 0) {
    productGrid.innerHTML = '<p class="empty-text">Produk tidak ditemukan.</p>';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  productGrid.innerHTML = itemsToRender.map(product => {
    const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="badge-discount">-${Math.round(product.discountPercentage)}%</div>
        <img src="${product.thumbnail}" alt="${product.title}" class="product-thumb" loading="lazy">
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.title}</h3>
          <div class="product-rating">⭐ ${product.rating}</div>
          <div class="product-price">
            <span class="price-current">$${discountedPrice}</span>
            <span class="price-original">$${product.price}</span>
          </div>
          <button class="btn-add-cart" data-id="${product.id}">+ Keranjang</button>
        </div>
      </div>
    `;
  }).join('');

  if (loadMoreBtn) {
    if (endIndex >= filteredProducts.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-block';
    }
  }
}

document.addEventListener('DOMContentLoaded', fetchProducts);