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

  const socialLinks = footerSections[3].querySelector('.social-links');
  if (socialLinks) {
    const linkedInLink = document.createElement('a');
    linkedInLink.href = 'https://www.linkedin.com/company/chinocommercialbank';
    linkedInLink.target = '_blank';
    linkedInLink.rel = 'noopener noreferrer';
    linkedInLink.setAttribute('aria-label', 'Chino Commercial Bank on LinkedIn');
    linkedInLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle><path d="M10 9h4v1.7A5 5 0 0 1 22 15v6h-4v-6a2 2 0 0 0-4 0v6h-4z"></path></svg>';
    socialLinks.appendChild(linkedInLink);
  }

  const accessibilityBadge = document.createElement('a');
  accessibilityBadge.className = 'footer-accessibility';
  accessibilityBadge.href = 'accessibility.html';
  accessibilityBadge.innerHTML = '<img src="accessibility-icon.svg" alt="" aria-hidden="true"><span>Website Accessibility</span>';
  footerSections[3].appendChild(accessibilityBadge);
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

const aboutDropdown = document.querySelector('.nav-dropdown');
if (aboutDropdown) {
  const dropdownToggle = aboutDropdown.querySelector('.nav-dropdown-toggle');
  const dropdownMenu = aboutDropdown.querySelector('.nav-submenu');

  const setAboutDropdown = (open) => {
    aboutDropdown.classList.toggle('is-open', open);
    dropdownToggle.setAttribute('aria-expanded', String(open));
  };

  dropdownToggle.addEventListener('click', () => {
    setAboutDropdown(!aboutDropdown.classList.contains('is-open'));
  });

  dropdownMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setAboutDropdown(false);
  });

  document.addEventListener('click', (event) => {
    if (!aboutDropdown.contains(event.target)) setAboutDropdown(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && aboutDropdown.classList.contains('is-open')) {
      setAboutDropdown(false);
      dropdownToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) setAboutDropdown(false);
  });
}
