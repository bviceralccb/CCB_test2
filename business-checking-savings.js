(() => {
  'use strict';

  const explorer = document.getElementById('business-explorer');
  if (!explorer) return;

  const tabs = document.getElementById('business-account-tabs');
  const controls = [...tabs.querySelectorAll('[data-business-tab]')];
  const accounts = [...explorer.querySelectorAll('[data-business-product]')].map(element => ({
    id: element.dataset.businessProduct,
    element,
    summary: element.querySelector(':scope > summary'),
    panel: element.querySelector('.business-account-body'),
    tab: controls.find(tab => tab.dataset.businessTab === element.dataset.businessProduct)
  }));
  const photo = explorer.querySelector('.business-account-photo');
  const photoImage = photo.querySelector('img');
  const photoCaption = photo.querySelector('figcaption');
  const desktop = window.matchMedia('(min-width: 992px)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = accounts[0].id;

  const pageHeader = document.querySelector('.site-header');
  const updateHeaderOffset = () => {
    if (!pageHeader) return;
    const stickyTop = Math.max(0, parseFloat(getComputedStyle(pageHeader).top) || 0);
    const offset = Math.ceil(pageHeader.getBoundingClientRect().height + stickyTop + 20);
    document.documentElement.style.setProperty('--business-header-offset', offset + 'px');
  };
  updateHeaderOffset();
  if (pageHeader && 'ResizeObserver' in window) {
    const headerObserver = new ResizeObserver(updateHeaderOffset);
    headerObserver.observe(pageHeader);
  }
  window.addEventListener('resize', updateHeaderOffset);

  const syncSelection = id => {
    const current = accounts.find(account => account.id === id);
    if (!current) return;
    selected = id;
    accounts.forEach(account => {
      const active = account.id === id;
      account.tab.classList.toggle('is-active', active);
      account.tab.setAttribute('aria-selected', String(active));
      account.tab.tabIndex = active ? 0 : -1;
    });
    if (photoImage.getAttribute('src') !== current.element.dataset.image) {
      photoImage.src = current.element.dataset.image;
    }
    photoImage.alt = current.element.dataset.imageAlt;
    photoCaption.textContent = current.tab.querySelector('strong').textContent;
  };

  const selectAccount = (id, focusTab = false) => {
    const current = accounts.find(account => account.id === id);
    if (!current) return;
    accounts.forEach(account => { account.element.open = account === current; });
    syncSelection(id);
    if (focusTab) current.tab.focus();
  };

  controls.forEach((control, index) => {
    control.addEventListener('click', () => selectAccount(control.dataset.businessTab));
    control.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowDown') next = (index + 1) % controls.length;
      else if (event.key === 'ArrowUp') next = (index - 1 + controls.length) % controls.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = controls.length - 1;
      else return;
      event.preventDefault();
      selectAccount(controls[next].dataset.businessTab, true);
    });
  });

  accounts.forEach(account => {
    account.element.addEventListener('toggle', () => {
      if (!account.element.open) return;
      accounts.forEach(other => { if (other !== account) other.element.open = false; });
      syncSelection(account.id);
    });
  });

  const applyLayout = () => {
    const navHadFocus = tabs.contains(document.activeElement);
    const summaryHadFocus = accounts.some(account => account.summary === document.activeElement);
    tabs.hidden = !desktop.matches;
    accounts.forEach(account => {
      account.panel.setAttribute('role', desktop.matches ? 'tabpanel' : 'region');
      account.panel.setAttribute('aria-labelledby', desktop.matches ? account.tab.id : account.summary.id);
    });
    if (desktop.matches) {
      selectAccount(selected, summaryHadFocus);
    } else if (navHadFocus) {
      accounts.find(account => account.id === selected).summary.focus();
    }
  };

  document.documentElement.classList.add('business-enhanced');
  const initialAccount = accounts.find(account => '#' + account.element.id === window.location.hash);
  selectAccount(initialAccount ? initialAccount.id : selected);
  applyLayout();
  desktop.addEventListener('change', applyLayout);

  document.querySelectorAll('[data-business-account-link]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.dataset.businessAccountLink;
      const account = accounts.find(item => item.id === id);
      if (!account) return;
      event.preventDefault();
      selectAccount(id);
      window.history.replaceState(null, '', '#' + account.element.id);
      const destination = desktop.matches ? document.getElementById('explore-business-accounts') : account.element;
      destination.scrollIntoView({ behavior: motion.matches ? 'auto' : 'smooth', block: 'start' });
      if (desktop.matches) account.tab.focus({ preventScroll: true });
      else account.summary.focus({ preventScroll: true });
    });
  });

  window.addEventListener('hashchange', () => {
    const account = accounts.find(item => '#' + item.element.id === window.location.hash);
    if (account) selectAccount(account.id);
  });

  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      let order = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.style.setProperty('--business-delay', Math.min(order++ * 70, 210) + 'ms');
        entry.target.classList.add('business-enter');
        entry.target.addEventListener('animationend', () => {
          entry.target.classList.remove('business-enter');
          entry.target.style.removeProperty('--business-delay');
        }, { once: true });
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.business-reveal').forEach(element => observer.observe(element));
  }
})();
