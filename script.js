document.querySelectorAll('#primary-nav a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const navigation = document.getElementById('primary-nav');
    if (window.innerWidth < 992 && navigation.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    }
  });
});

document.querySelectorAll('.service-icon, .benefit-grid > div > span, .online-banking-features > div > span, .location-card > span, .button b, .nav-cta span, .play-link > span, .security-badge > span, .status').forEach((element) => {
  element.setAttribute('aria-hidden', 'true');
});

document.querySelectorAll('.online-banking-features > div').forEach((feature) => {
  feature.setAttribute('role', 'listitem');
});

document.querySelectorAll('.service-spotlight').forEach((serviceSpotlight) => {
  const entries = [...serviceSpotlight.querySelectorAll('.service-entry')];
  const image = serviceSpotlight.querySelector('.service-visual img');
  const caption = serviceSpotlight.querySelector('.service-visual figcaption');

  const selectService = (selected) => {
    entries.forEach((entry) => {
      const expanded = entry === selected;
      entry.classList.toggle('is-active', expanded);
      entry.querySelector('.service-toggle').setAttribute('aria-expanded', String(expanded));
      entry.querySelector('.service-panel').hidden = !expanded;
    });

    const button = selected.querySelector('.service-toggle');
    if (image.getAttribute('src') !== button.dataset.image) image.src = button.dataset.image;
    image.alt = button.dataset.imageAlt;
    caption.textContent = button.dataset.caption;
  };

  entries.forEach((entry) => {
    entry.querySelector('.service-toggle').addEventListener('click', () => selectService(entry));
  });

  const selectLinkedService = () => {
    const linked = entries.find((entry) => `#${entry.id}` === window.location.hash);
    if (linked) selectService(linked);
  };
  window.addEventListener('hashchange', selectLinkedService);
  selectLinkedService();

  entries.slice(1).forEach((entry) => {
    const preload = new Image();
    preload.src = entry.querySelector('.service-toggle').dataset.image;
  });
});

const footerSections = document.querySelectorAll('.footer-grid > div');
if (footerSections[2]) {
  footerSections[2].setAttribute('role', 'navigation');
  footerSections[2].setAttribute('aria-label', 'Support links');
}
if (footerSections[3]) {
  footerSections[3].setAttribute('role', 'group');
  footerSections[3].setAttribute('aria-label', 'Connect and accessibility');

}

const themeControls = document.querySelectorAll('.footer-theme input[name="ccb-theme"]');
if (window.CCBTheme && themeControls.length) {
  themeControls.forEach((control) => {
    control.checked = control.value === window.CCBTheme.getChoice();
    control.addEventListener('change', () => {
      if (control.checked) window.CCBTheme.setChoice(control.value);
    });
  });
}

const backToTop = document.querySelector('.back-to-top');

const homepageCarousel = document.getElementById('banking-carousel');
if (homepageCarousel && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  bootstrap.Carousel.getOrCreateInstance(homepageCarousel).pause();
}

if (backToTop) {
  const updateBackToTop = () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  };

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  });
}

document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
  const dropdownToggle = dropdown.querySelector('.nav-dropdown-toggle');
  const dropdownMenu = dropdown.querySelector('.nav-submenu');

  const setDropdown = (open) => {
    dropdown.classList.toggle('is-open', open);
    dropdownToggle.setAttribute('aria-expanded', String(open));
  };

  dropdownToggle.addEventListener('click', () => {
    const willOpen = !dropdown.classList.contains('is-open');
    document.querySelectorAll('.nav-dropdown.is-open').forEach((openDropdown) => {
      openDropdown.classList.remove('is-open');
      openDropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
    setDropdown(willOpen);
  });

  dropdownMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setDropdown(false);
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) setDropdown(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dropdown.classList.contains('is-open')) {
      setDropdown(false);
      dropdownToggle.focus();
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 992) {
    document.querySelectorAll('.nav-dropdown.is-open').forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  }
});
