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

document.querySelectorAll('.service-card').forEach((card) => {
  const link = card.querySelector('a');
  const heading = card.querySelector('h3');
  if (link && heading) link.setAttribute('aria-label', `Learn more about ${heading.textContent.trim()}`);
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
