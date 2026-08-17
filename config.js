// NIVECO PRO 7.3 public runtime configuration.
// Firebase web configuration is public client-side configuration. Never put service-account private keys here.
window.NIVECO_CONFIG = Object.freeze({
  firebaseApiKey: 'AIzaSyCWbcm9rxiPOMmjJ5MDdpP34tydUaPzkZ4',
  firebaseAuthDomain: 'niveco-insights.firebaseapp.com',
  firebaseProjectId: 'niveco-insights',
  firebaseStorageBucket: 'niveco-insights.firebasestorage.app',
  firebaseMessagingSenderId: '1028919515058',
  firebaseAppId: '1:1028919515058:web:4dcc86755d9eb34da236ab'
});

// Startup safety patch: never let a broken/slow script trap the app behind the splash.
(() => {
  const revealApp = () => {
    const splash = document.getElementById('splashScreen');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      splash.style.pointerEvents = 'none';
      setTimeout(() => splash.remove(), 320);
    }
    const shell = document.getElementById('appShell');
    if (shell) shell.style.display = '';
  };

  const replaceSplashSymbol = () => {
    const card = document.querySelector('#splashScreen .splash-card');
    if (!card) return;
    card.innerHTML = `
      <div aria-label="NIVECO" style="display:grid;place-items:center;gap:12px">
        <div style="width:104px;height:78px;display:grid;align-content:space-between" aria-hidden="true">
          <i style="display:block;height:16px;border-radius:999px;background:linear-gradient(90deg,#1aa7ff,#19d5c6)"></i>
          <i style="display:block;height:16px;border-radius:999px;background:linear-gradient(90deg,#1aa7ff,#19d5c6)"></i>
          <i style="display:block;height:16px;border-radius:999px;background:linear-gradient(90deg,#1aa7ff,#19d5c6)"></i>
        </div>
        <strong style="font:900 24px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:4px;color:#f7fbff">NIVECO</strong>
      </div>`;
  };

  document.addEventListener('DOMContentLoaded', () => {
    replaceSplashSymbol();
    setTimeout(revealApp, 1300);
  }, { once: true });

  // Failsafe for runtime errors before app.js reaches its own splash cleanup.
  window.addEventListener('error', () => setTimeout(revealApp, 120));
  window.addEventListener('unhandledrejection', () => setTimeout(revealApp, 120));
  setTimeout(revealApp, 4000);
})();
