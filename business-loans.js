(() => {
  'use strict';
  const page = document.querySelector('.loan-page');
  if (!page) return;
  const header = document.querySelector('.site-header');
  const updateHeaderOffset = () => {
    if (!header) return;
    const stickyTop = Math.max(0, parseFloat(getComputedStyle(header).top) || 0);
    const offset = Math.ceil(header.getBoundingClientRect().height + stickyTop + 20);
    document.documentElement.style.setProperty('--loan-header-offset', offset + 'px');
  };
  document.documentElement.classList.add('loan-enhanced');
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
        entry.target.style.setProperty('--loan-delay', Math.min(order++ * 70, 210) + 'ms');
        entry.target.classList.add('loan-enter');
        entry.target.addEventListener('animationend', () => {
          entry.target.classList.remove('loan-enter');
          entry.target.style.removeProperty('--loan-delay');
        }, {once:true});
      });
    }, {threshold:0.1});
    document.querySelectorAll('.loan-reveal').forEach(element => observer.observe(element));
  }
})();
