// KM Home Improvement — shared behaviour
const KM = {
  phone: '508-969-6252',
  phoneTel: '+15089696252',
  // Set this to the business email to have quote requests open an email to it.
  // While empty, the form opens a text message to the phone number instead.
  email: '',
};

// Header: solid background after scrolling, mobile menu toggle
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const nav = header.querySelector('.nav');
  const toggle = header.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      header.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
})();

// Reveal on scroll
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(e => io.observe(e));
})();

// Before / after sliders
function initBeforeAfter(root = document) {
  root.querySelectorAll('.ba').forEach(ba => {
    const range = ba.querySelector('input[type=range]');
    if (!range || range.dataset.ready) return;
    range.dataset.ready = '1';
    const set = v => ba.style.setProperty('--pos', v + '%');
    set(range.value);
    range.addEventListener('input', () => set(range.value));
  });
}
initBeforeAfter();

// Quote form
(() => {
  const form = document.getElementById('quote-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = Object.fromEntries(new FormData(form));
    const lines = [
      `New quote request from ${d.name}`,
      `Phone: ${d.phone}`,
      d.email ? `Email: ${d.email}` : '',
      `Project: ${d.project}`,
      d.town ? `Town: ${d.town}` : '',
      d.details ? `Details: ${d.details}` : '',
    ].filter(Boolean);
    const body = encodeURIComponent(lines.join('\n'));
    if (KM.email) {
      const subject = encodeURIComponent(`Quote request — ${d.project}`);
      window.location.href = `mailto:${KM.email}?subject=${subject}&body=${body}`;
      status.textContent = 'Your email app should open with your request filled in. Just press send.';
    } else {
      window.location.href = `sms:${KM.phoneTel}?&body=${body}`;
      status.innerHTML = `Your messages app should open with your request filled in. If it doesn't, call or text us at <a href="tel:${KM.phoneTel}"><strong>${KM.phone}</strong></a>.`;
    }
    status.classList.add('show');
  });
})();

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
