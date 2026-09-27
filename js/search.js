const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// debounce func
function debounce(func, delay = 400) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function applyFiltersAndRender() {
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
  const selectedSort = sortSelect ? sortSelect.value : 'default';

  // filtering
  filteredProducts = rawProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                          product.category.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // sorting
  if (selectedSort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'rating-high') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(true);
}

// Event listeners
if (searchInput) {
  searchInput.addEventListener('input', debounce(() => {
    applyFiltersAndRender();
  }, 400));
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', applyFiltersAndRender);
}

if (sortSelect) {
  sortSelect.addEventListener('change', applyFiltersAndRender);
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    renderProducts(false);
  });
}