// =====REV=====

const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('regErrorMessage');

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.hidden = false;
}

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.hidden = true;

  const firstName = document.getElementById('regFirstName').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  if (!firstName || !username || !password) {
    showError('Semua field wajib diisi.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('custom_users')) || [];

  const isExist = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
  if (isExist) {
    showError('Username sudah digunakan.');
    return;
  }

  users.push({
    id: Date.now(),
    firstName: firstName,
    username: username,
    password: password
  });

  localStorage.setItem('custom_users', JSON.stringify(users));
  alert('Registrasi berhasil! Silakan login.');
  window.location.href = 'login.html';
});