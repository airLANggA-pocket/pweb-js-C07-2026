const modalOverlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');

function renderModal(product) {
  modalBox.innerHTML = `
    <button class="modal-close" id="modalCloseBtn">&times;</button>
    <img src="${product.thumbnail}" alt="${product.title}">
    <span class="modal-category">${product.category}</span>
    <h2 class="modal-name">${product.title}</h2>
    <p class="modal-brand">Brand: ${product.brand || '-'}</p>
    <div class="modal-price-row">
      <span class="modal-price">${formatPrice(product.price)}</span>
      <span class="product-rating">★ ${product.rating}</span>
    </div>
    <p class="modal-stock">Stok tersedia: ${product.stock}</p>
    <p class="modal-desc">${product.description}</p>
    <button class="modal-add-btn" id="modalAddBtn" data-id="${product.id}">Tambah ke Keranjang</button>
  `;
  modalOverlay.hidden = false;
}

function closeModal() {
  modalOverlay.hidden = true;
  modalBox.innerHTML = '';
}

// Event Delegation: listener dipasang di container grid (parent), BUKAN di tiap card
productGrid.addEventListener('click', (e) => {
  if (e.target.closest('.add-cart-btn')) return; // sudah ditangani cart.js

  const card = e.target.closest('.product-card');
  if (!card) return;

  const product = allProducts.find((p) => p.id === Number(card.dataset.id));
  if (product) renderModal(product);
});

modalBox.addEventListener('click', (e) => {
  if (e.target.id === 'modalCloseBtn') closeModal();
  if (e.target.id === 'modalAddBtn') {
    addToCart(e.target.dataset.id);
    closeModal();
  }
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal(); // klik area gelap = tutup
});