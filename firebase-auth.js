(() => {
  'use strict';

  const FIREBASE_API_KEY = 'AIzaSyCWbcm9rxiPOMmjJ5MDdpP34tydUaPzkZ4';
  const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(FIREBASE_API_KEY)}`;
  const STORAGE_KEY = 'niveco60_auth';
  const ADMIN_EMAIL = 'nivecoinsights@gmail.com';

  function friendlyError(code) {
    const value = String(code || '');
    if (value.includes('INVALID_LOGIN_CREDENTIALS') || value.includes('INVALID_PASSWORD') || value.includes('EMAIL_NOT_FOUND')) {
      return 'Incorrect email or password.';
    }
    if (value.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) return 'Too many attempts. Please try again later.';
    if (value.includes('NETWORK_REQUEST_FAILED')) return 'Network error. Please check your internet connection.';
    return 'Unable to sign in right now. Please try again.';
  }

  async function firebaseLogin(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const emailEl = document.getElementById('adminEmail');
    const passwordEl = document.getElementById('adminPassword');
    const messageEl = document.getElementById('loginMessage');
    const button = document.getElementById('loginBtn');
    if (!emailEl || !passwordEl || !button) return;

    const email = emailEl.value.trim().toLowerCase();
    const password = passwordEl.value;
    if (messageEl) messageEl.textContent = '';

    if (email !== ADMIN_EMAIL || !password) {
      if (messageEl) messageEl.textContent = 'Incorrect email or password.';
      return;
    }

    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = 'Signing in…';

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.idToken) throw new Error(data?.error?.message || `HTTP_${response.status}`);

      sessionStorage.setItem(STORAGE_KEY, '1');
      sessionStorage.setItem('niveco_firebase_uid', data.localId || '');
      sessionStorage.setItem('niveco_firebase_email', data.email || email);
      if (messageEl) messageEl.textContent = '';

      if (typeof window.renderAdmin === 'function') window.renderAdmin();
      if (typeof window.toast === 'function') window.toast('Admin login successful');
    } catch (error) {
      if (messageEl) messageEl.textContent = friendlyError(error?.message);
    } finally {
      button.disabled = false;
      button.textContent = oldText;
    }
  }

  function install() {
    const button = document.getElementById('loginBtn');
    if (!button || button.dataset.firebaseAuthInstalled === '1') return;
    button.dataset.firebaseAuthInstalled = '1';
    button.addEventListener('click', firebaseLogin, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
