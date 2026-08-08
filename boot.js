(() => {
  const revealApp = () => {
    const splash = document.getElementById('splashScreen');
    if (splash) {
      splash.classList.add('hide');
      splash.style.pointerEvents = 'none';
      setTimeout(() => splash.remove(), 450);
    }
    const home = document.getElementById('home');
    if (home && !document.querySelector('.panel.active')) home.classList.add('active');
  };

  // Never let a failed startup dependency trap the user on the splash screen.
  setTimeout(revealApp, 900);
  window.addEventListener('error', () => setTimeout(revealApp, 0));
  window.addEventListener('unhandledrejection', () => setTimeout(revealApp, 0));

  // Load the real application from a separate Vercel route so this boot shim
  // can always recover the UI even if the main bundle throws during startup.
  const core = document.createElement('script');
  core.src = '/app-core.js?v=7.3.4';
  core.onload = () => setTimeout(revealApp, 1100);
  core.onerror = revealApp;
  document.head.appendChild(core);
})();
