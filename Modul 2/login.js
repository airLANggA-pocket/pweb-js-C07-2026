const LOGIN_API = 'https://dummyjson.com/users?limit=0';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

function setLoading(isLoading) {
  loginBtn.disabled = isLoading;
  btnText.hidden = isLoading;
  loadingSpinner.hidden = !isLoading;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function hideError() {
  errorMessage.hidden = true;
  errorMessage.textContent = '';
}

togglePassword.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  togglePassword.textContent = isHidden ? '🙈' : '👁';
});

// Kalau sudah login, langsung ke landing page
if (localStorage.getItem('firstName')) {
  window.location.href = 'landing.html';
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const username = document.getElementById('username').value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showError('Username dan password wajib diisi.');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(LOGIN_API);

    if (!res.ok) {
      throw new Error('Gagal terhubung ke server. Coba lagi nanti.');
    }

    const data = await res.json();
    const users = data.users;

    const matchedUser = users.find(
      (user) =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password
    );

    if (!matchedUser) {
      throw new Error('Username atau password salah.');
    }

    localStorage.setItem('firstName', matchedUser.firstName);
    localStorage.setItem('userId', matchedUser.id);

    window.location.href = 'landing.html';
  } catch (err) {
    showError(err.message || 'Terjadi kesalahan, silakan coba lagi.');
  } finally {
    setLoading(false);
  }
});