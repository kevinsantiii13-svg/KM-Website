// Gallery photos. To add a photo: put the file in /images/gallery/ and add a line below.
// category must be one of: kitchens, bathrooms, basements, decks, painting, other
const PHOTOS = [
  { src: '/images/bathroom-real.jpg',  category: 'bathrooms', title: 'Marble primary bathroom' },
  { src: '/images/kitchen.jpg',        category: 'kitchens',  title: 'Warm, considered kitchen' },
  { src: '/images/kitchen-after.jpg',  category: 'kitchens',  title: 'Open-plan kitchen refresh' },
  { src: '/images/basement-real.jpg',  category: 'basements', title: 'Finished basement & wet bar' },
  { src: '/images/deck.jpg',           category: 'decks',     title: 'Outside, made useful' },
  { src: '/images/deck-after.jpg',     category: 'decks',     title: 'Evening-ready deck' },
  { src: '/images/entry.jpg',          category: 'other',     title: 'Custom entry & mudroom' },
];

const CATEGORIES = {
  all: 'All work',
  kitchens: 'Kitchens',
  bathrooms: 'Bathrooms',
  basements: 'Basements',
  decks: 'Decks',
  painting: 'Painting',
  other: 'Other',
};

(() => {
  const grid = document.getElementById('gallery-grid');
  const filters = document.getElementById('filters');
  if (!grid || !filters) return;

  const counts = PHOTOS.reduce((c, p) => (c[p.category] = (c[p.category] || 0) + 1, c), {});
  counts.all = PHOTOS.length;

  // Build filter buttons
  Object.entries(CATEGORIES).forEach(([key, label]) => {
    const b = document.createElement('button');
    b.className = 'filter';
    b.type = 'button';
    b.dataset.cat = key;
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `${label}<span class="count">${counts[key] || 0}</span>`;
    b.addEventListener('click', () => {
      history.replaceState(null, '', key === 'all' ? location.pathname : '#' + key);
      render(key);
    });
    filters.appendChild(b);
  });

  let visible = [];
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="2"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 5l1.5-2h5L16 5"/></svg>';

  function render(cat) {
    if (!CATEGORIES[cat]) cat = 'all';
    filters.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    visible = PHOTOS.filter(p => cat === 'all' || p.category === cat);
    grid.innerHTML = '';
    visible.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.className = 'g-item';
      btn.type = 'button';
      btn.innerHTML = `<img src="${p.src}" alt="${p.title}" loading="lazy"><span class="g-cap"><small>${CATEGORIES[p.category]}</small><strong>${p.title}</strong></span>`;
      btn.addEventListener('click', () => openLightbox(i));
      grid.appendChild(btn);
    });
    if (!visible.length) {
      grid.innerHTML = `<div class="g-empty">${icon}<strong>${CATEGORIES[cat]} photos coming soon</strong>We're adding new projects. Call 508-969-6252 to see examples of our ${CATEGORIES[cat].toLowerCase()} work.</div>`;
    }
  }

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('figcaption');
  let idx = 0;
  function show(i) {
    idx = (i + visible.length) % visible.length;
    const p = visible[idx];
    lbImg.src = p.src;
    lbImg.alt = p.title;
    lbCap.innerHTML = `<small>${CATEGORIES[p.category]}</small>${p.title}`;
  }
  function openLightbox(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
  function closeLightbox() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  let startX = null;
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    startX = null;
  });

  render(location.hash.slice(1) || 'all');
  window.addEventListener('hashchange', () => render(location.hash.slice(1) || 'all'));
})();
