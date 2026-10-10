(() => {
  const cards = [...document.querySelectorAll('#board-of-directors .board-card')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!cards.length || motion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([
        { opacity: 0, transform: 'translateY(36px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 800, delay: Number(entry.target.dataset.delay), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  cards.forEach(card => observer.observe(card));
  motion.addEventListener('change', () => {
    if (motion.matches) {
      observer.disconnect();
      cards.forEach(card => card.getAnimations().forEach(animation => animation.cancel()));
    }
  });
})();