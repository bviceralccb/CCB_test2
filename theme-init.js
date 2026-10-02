(() => {
  'use strict';

  const storageKey = 'ccb-color-mode';
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
  let choice = 'system';

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark' || stored === 'system') choice = stored;
  } catch (_) {
    // The control still works for this page when storage is unavailable.
  }

  const apply = () => {
    const resolved = choice === 'system' ? (systemPreference.matches ? 'dark' : 'light') : choice;
    document.documentElement.setAttribute('data-bs-theme', resolved);
    document.documentElement.setAttribute('data-theme-choice', choice);
    const browserColor = document.querySelector('meta[name="theme-color"]');
    if (browserColor) browserColor.content = resolved === 'dark' ? '#0b2031' : '#013c68';
  };

  apply();
  systemPreference.addEventListener('change', () => {
    if (choice === 'system') apply();
  });

  window.CCBTheme = {
    getChoice: () => choice,
    setChoice: (next) => {
      if (!['system', 'light', 'dark'].includes(next)) return;
      choice = next;
      try {
        window.localStorage.setItem(storageKey, choice);
      } catch (_) {
        // Keep the selection active for this page.
      }
      apply();
    }
  };
})();
