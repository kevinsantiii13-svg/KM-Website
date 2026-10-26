// Gallery photos. To add a photo: put the file in /images/gallery/ and add a line below.
// category must be one of: kitchens, bathrooms, basements, decks, painting, other
const PHOTOS = [
  { src: '/images/bathroom-real.jpg',  category: 'bathrooms', title: 'Marble primary bathroom' },
  { src: '/images/kitchen.jpg',        category: 'kitchens',  title: 'Warm, considered kitchen' },
  { src: '/images/kitchen-after.jpg',  category: 'kitchens',  title: 'Open-plan kitchen refresh' },
  { src: '/images/basement.jpg',       category: 'basements', title: 'Room to gather' },
  { src: '/images/deck.jpg',           category: 'decks',     title: 'Outside, made useful' },
  { src: '/images/deck-after.jpg',     category: 'decks',     title: 'Evening-ready deck' },
  { src: '/images/entry.jpg',          category: 'other',     title: 'Custom entry & mudroom' },
];

// Before & after projects. Add new ones at the top; they show first.
// real: true marks actual KM projects (placeholders have real: false).
const BEFORE_AFTER = [
  { before: '/images/bathroom-before.jpg', after: '/images/bathroom-after.jpg', category: 'bathrooms', title: 'Primary bathroom remodel', real: true },
  { before: '/images/kitchen-before.jpg',  after: '/images/kitchen-after.jpg',  category: 'kitchens',  title: 'Kitchen transformation', real: false },
  { before: '/images/deck-before.jpg',     after: '/images/deck-after.jpg',     category: 'decks',     title: 'Outdoor living transformation', real: false },
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
  BEFORE_AFTER.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  counts.all = PHOTOS.length + BEFORE_AFTER.length;

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
    const baWrap = document.getElementById('ba-wrap');
    const baList = document.getElementById('ba-list');
    const photosHead = document.getElementById('photos-head');
    const pairs = BEFORE_AFTER.filter(p => cat === 'all' || p.category === cat);
    baList.innerHTML = pairs.map((p, i) => `
      <div class="ba-item${i === 0 ? ' ba-feature' : ''}">
        <div class="ba">
          <img src="${p.before}" alt="${p.title}, before" class="ba-before">
          <img src="${p.after}" alt="${p.title}, after" class="ba-after">
          <span class="ba-label before">Before</span>
          <span class="ba-label after">After</span>
          <div class="ba-handle"><span class="ba-knob"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/></svg></span></div>
          <input type="range" min="0" max="100" value="50" aria-label="Drag to compare ${p.title} before and after">
        </div>
        <h3><small>${CATEGORIES[p.category]}</small>${p.title}</h3>
      </div>`).join('');
    baWrap.hidden = !pairs.length;
    photosHead.hidden = !pairs.length || !visible.length;
    if (typeof initBeforeAfter === 'function') initBeforeAfter(baList);
    grid.innerHTML = '';
    visible.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.className = 'g-item';
      btn.type = 'button';
      btn.innerHTML = `<img src="${p.src}" alt="${p.title}" loading="lazy"><span class="g-cap"><small>${CATEGORIES[p.category]}</small><strong>${p.title}</strong></span>`;
      btn.addEventListener('click', () => openLightbox(i));
      grid.appendChild(btn);
    });
    if (!visible.length && !pairs.length) {
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
