// ============================================================
// AUTH — Login & Register
// ============================================================

// Show error helper
function showError(msg) {
  const el = document.getElementById('authError');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

// ============================================================
// REGISTER
// ============================================================
async function register() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showError('Isi email & password terlebih dahulu!');
    return;
  }

  if (password.length < 6) {
    showError('Password minimal 6 karakter.');
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    showError(error.message);
  } else {
    alert('✅ Registrasi berhasil! Silakan login.');
    window.location.href = 'index.html';
  }
}

// ============================================================
// LOGIN
// ============================================================
async function login() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showError('Isi email & password terlebih dahulu!');
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    showError(error.message);
  } else {
    window.location.href = 'dashboard.html';
  }
}

// Allow Enter key
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const isRegister = window.location.href.includes('register');
    isRegister ? register() : login();
  }
});
