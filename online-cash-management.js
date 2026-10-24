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
  const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.cash-card').forEach(card => {
    const front = card.querySelector('.cash-card-front');
    const back = card.querySelector('.cash-card-back');
    const openButton = card.querySelector('.cash-card-open');
    const closeButton = card.querySelector('.cash-card-close');
    const backTitle = back?.querySelector('h3');
    if (!front || !back || !openButton || !closeButton || !backTitle) return;
    let hovered = false;
    let pinned = false;
    let suppressHover = false;
    const setOpen = (open, moveFocus = false) => {
      card.classList.toggle('is-flipped', open);
      front.inert = open;
      back.inert = !open;
      front.setAttribute('aria-hidden', String(open));
      back.setAttribute('aria-hidden', String(!open));
      openButton.setAttribute('aria-expanded', String(open));
      if (moveFocus) (open ? backTitle : openButton).focus({preventScroll:true});
    };
    openButton.hidden = false;
    closeButton.hidden = false;
    setOpen(false);
    card.classList.add('cash-flip-ready');
    card.addEventListener('pointerenter', event => {
      if (!hoverPointer.matches || event.pointerType === 'touch') return;
      hovered = true;
      if (!suppressHover && !card.contains(document.activeElement)) setOpen(true);
    });
    card.addEventListener('pointerleave', () => {
      hovered = false;
      suppressHover = false;
      if (!pinned && !card.contains(document.activeElement)) setOpen(false);
    });
    openButton.addEventListener('click', () => {
      pinned = true;
      setOpen(true, true);
    });
    const close = () => {
      pinned = false;
      suppressHover = hovered;
      setOpen(false, true);
    };
    closeButton.addEventListener('click', close);
    card.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !card.classList.contains('is-flipped')) return;
      event.preventDefault();
      close();
    });
    card.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (card.contains(document.activeElement)) return;
        pinned = false;
        if (!hovered || suppressHover) setOpen(false);
      });
    });
  });
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
