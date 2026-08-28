const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');
menu?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

/* Lightbox for the Power BI report pages. The buttons carry the full-size
   source and caption, so the gallery works from the markup alone. */
const shots = [...document.querySelectorAll('.shot-open')];
const box = document.getElementById('lightbox');

if (shots.length && box) {
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-cap');
  const closeBtn = box.querySelector('.lb-close');
  let at = 0;
  let lastFocus = null;

  const show = i => {
    at = (i + shots.length) % shots.length;
    const b = shots[at];
    img.src = b.dataset.src;
    img.alt = b.querySelector('img').alt;
    cap.textContent = b.dataset.cap;
  };

  const open = i => {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    box.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
    lastFocus?.focus();
  };

  shots.forEach((b, i) => b.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(at - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(at + 1));

  // clicking the backdrop closes; clicking the image itself does not
  box.addEventListener('click', e => { if (e.target === box) close(); });

  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });
}
