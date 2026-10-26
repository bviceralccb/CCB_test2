(() => {
  'use strict';
  if (!document.querySelector('.mobile-banking-page')) return;
  const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.mobile-feature').forEach(card => {
    const front = card.querySelector('.mobile-feature-front');
    const back = card.querySelector('.mobile-feature-back');
    const openButton = card.querySelector('.mobile-feature-open');
    const closeButton = card.querySelector('.mobile-feature-close');
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
    card.classList.add('mobile-flip-ready');
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

  const cards = document.querySelectorAll('.mobile-feature');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting);
    entering.forEach((entry, index) => {
      const card = entry.target;
      card.style.animationDelay = (index * 100) + 'ms';
      card.classList.add('feature-enter');
      card.addEventListener('animationend', () => {
        card.classList.remove('feature-enter');
        card.style.animationDelay = '';
      }, {once:true});
      observer.unobserve(card);
    });
  }, {threshold:0.15});
  cards.forEach(card => observer.observe(card));
})();
