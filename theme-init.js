(() => {
  'use strict';

  const storageKey = 'ccb-color-mode';
  let choice = 'light';

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'dark') choice = 'dark';
    if (stored === 'system') window.localStorage.setItem(storageKey, 'light');
  } catch (_) {
    // The control still works for this page when storage is unavailable.
  }

  const apply = () => {
    document.documentElement.setAttribute('data-bs-theme', choice);
    document.documentElement.setAttribute('data-theme-choice', choice);
    const browserColor = document.querySelector('meta[name="theme-color"]');
    if (browserColor) browserColor.content = choice === 'dark' ? '#0b2031' : '#013c68';
  };

  apply();

  window.CCBTheme = {
    getChoice: () => choice,
    setChoice: (next) => {
      if (next !== 'light' && next !== 'dark') return;
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
