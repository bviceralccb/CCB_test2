(() => {
  'use strict';
  const page = document.querySelector('.cash-page');
  if (!page) return;
  const header = document.querySelector('.site-header');
  const updateHeaderOffset = () => {
    if (!header) return;
    const stickyTop = Math.max(0, parseFloat(getComputedStyle(header).top) || 0);
    const offset = Math.ceil(header.getBoundingClientRect().height + stickyTop + 20);
    document.documentElement.style.setProperty('--cash-header-offset', offset + 'px');
  };
  document.documentElement.classList.add('cash-enhanced');
  updateHeaderOffset();
  if (header && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(updateHeaderOffset);
    observer.observe(header);
  }
  window.addEventListener('resize', updateHeaderOffset);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      let order = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.style.setProperty('--cash-delay', Math.min(order++ * 70, 210) + 'ms');
        entry.target.classList.add('cash-enter');
        entry.target.addEventListener('animationend', () => {
          entry.target.classList.remove('cash-enter');
          entry.target.style.removeProperty('--cash-delay');
        }, {once:true});
      });
    }, {threshold:0.1});
    document.querySelectorAll('.cash-reveal').forEach(element => observer.observe(element));
  }
})();
