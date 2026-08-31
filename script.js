const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');
menu?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

/* Lightbox for the project report pages. The buttons carry the full-size
   source and caption, so a gallery works from the markup alone.

   Buttons are grouped by data-gallery, so next and previous stay inside one
   project instead of running from the last Maven page into the first Porsche
   view. Within a gallery a source that appears twice — a hero shot repeated
   in the strip below it — is one entry, not two. */
const box = document.getElementById('lightbox');
const shots = [...document.querySelectorAll('.shot-open')];

if (shots.length && box) {
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-cap');
  const closeBtn = box.querySelector('.lb-close');

  const galleries = new Map();   // gallery name -> deduplicated button list
  const spot = new Map();        // button -> { list, index } it opens at

  shots.forEach(btn => {
    const name = btn.dataset.gallery || 'default';
    if (!galleries.has(name)) galleries.set(name, []);
    const list = galleries.get(name);
    let i = list.findIndex(b => b.dataset.src === btn.dataset.src);
    if (i === -1) { list.push(btn); i = list.length - 1; }
    spot.set(btn, { list, index: i });
  });

  let list = [];
  let at = 0;
  let lastFocus = null;

  const show = i => {
    at = (i + list.length) % list.length;
    const b = list[at];
    img.src = b.dataset.src;
    img.alt = b.querySelector('img').alt;
    cap.textContent = b.dataset.cap;
  };

  const open = btn => {
    const where = spot.get(btn);
    list = where.list;
    lastFocus = document.activeElement;
    show(where.index);
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

  shots.forEach(b => b.addEventListener('click', () => open(b)));
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
