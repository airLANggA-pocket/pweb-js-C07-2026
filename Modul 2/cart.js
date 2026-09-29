// ---------- AUTH GUARD ----------
const firstName = localStorage.getItem('firstName');
if (!firstName) {
  window.location.href = 'login.html';
}

document.getElementById('greeting').textContent = `Halo, ${firstName}`;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('firstName');
  localStorage.removeItem('userId');
  // localStorage.removeItem('cart'); =====REV=====
  window.location.href = 'login.html';
});

// ---------- CART CRUD (localStorage) ----------
const CART_KEY = 'cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = allProducts.find((p) => p.id === Number(productId));
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, title: product.title, price: product.price, qty: 1 });
  }

  saveCart(cart);
}

// =====REV=====
// tiap user punya cart sendiri 
function getCartKey() {
  const userId = localStorage.getItem('userId') || 'guest';
  return `cart_${userId}`;
}

function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  updateCartUI();
}

function increaseQty(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === Number(productId));
  if (!item) return;

  item.qty += 1;
  saveCart(cart);
  renderCartModal();
}

function decreaseQty(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === Number(productId));
  if (!item) return;

  if (item.qty > 1) {
    item.qty -= 1;
  } else {
    return removeFromCart(productId);
  }
  saveCart(cart);
  renderCartModal();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== Number(productId));
  saveCart(cart);
  renderCartModal();
}

function updateCartUI() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  document.getElementById('cartBadge').textContent = totalQty;
  document.getElementById('cartTotal').textContent = formatPrice(totalPrice);
}

// ---------- EVENT DELEGATION: tombol "Tambah ke Keranjang" di grid produk ----------
productGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-cart-btn');
  if (!btn) return;
  e.stopPropagation();
  addToCart(btn.dataset.id);
});

// ---------- CART VIEW MODAL ----------
const cartIcon = document.getElementById('cartIcon');

function renderCartModal() {
  const cart = getCart();

  if (cart.length === 0) {
    modalBox.innerHTML = `
      <button class="modal-close" id="modalCloseBtn">&times;</button>
      <h2 class="modal-name">Keranjang Belanja</h2>
      <p class="modal-desc">Keranjangmu masih kosong.</p>
    `;
    modalOverlay.hidden = false;
    return;
  }

  const itemsHtml = cart.map((item) => `
    <div class="cart-item-row" data-id="${item.id}">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.title}</span>
        <span class="cart-item-price">${formatPrice(item.price)} x ${item.qty}</span>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn increase-btn" data-id="${item.id}">+</button>
        <button class="qty-btn decrease-btn" data-id="${item.id}">-</button>
        <button class="qty-btn remove-btn" data-id="${item.id}">Hapus</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  modalBox.innerHTML = `
    <button class="modal-close" id="modalCloseBtn">&times;</button>
    <h2 class="modal-name">Keranjang Belanja</h2>
    <div class="cart-items-list">${itemsHtml}</div>
    <div class="cart-modal-total">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
  `;
  modalOverlay.hidden = false;
}

cartIcon.addEventListener('click', renderCartModal);

modalBox.addEventListener('click', (e) => {
  if (e.target.id === 'modalCloseBtn') closeModal();

  const increaseBtn = e.target.closest('.increase-btn');
  if (increaseBtn) increaseQty(increaseBtn.dataset.id);

  const decreaseBtn = e.target.closest('.decrease-btn');
  if (decreaseBtn) decreaseQty(decreaseBtn.dataset.id);

  const removeBtn = e.target.closest('.remove-btn');
  if (removeBtn) removeFromCart(removeBtn.dataset.id);
});

updateCartUI();