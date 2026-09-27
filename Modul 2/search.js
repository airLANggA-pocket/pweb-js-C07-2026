function debounce(fn, delay = 400) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const searchInput = document.getElementById('searchInput');
const sortFilter = document.getElementById('sortFilter');

function applyFiltersAndSort() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sortValue = sortFilter.value;

  let result = allProducts.filter((product) => {
    const matchKeyword =
      product.title.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword);
    const matchCategory = category === 'all' || product.category === category;
    return matchKeyword && matchCategory;
  });

  if (sortValue === 'price-asc') result = result.slice().sort((a, b) => a.price - b.price);
  else if (sortValue === 'price-desc') result = result.slice().sort((a, b) => b.price - a.price);
  else if (sortValue === 'rating-desc') result = result.slice().sort((a, b) => b.rating - a.rating);

  displayedProducts = result;
  visibleCount = BATCH_SIZE;
  renderProducts();
}

const debouncedSearch = debounce(applyFiltersAndSort, 400);

searchInput.addEventListener('input', debouncedSearch);
categoryFilter.addEventListener('change', applyFiltersAndSort);
sortFilter.addEventListener('change', applyFiltersAndSort);