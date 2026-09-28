const highlight = document.querySelector('#highlight-video');
const soundButton = document.querySelector('#sound-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const updateSound = () => { soundButton.querySelector('span').textContent = highlight.muted ? 'Turn sound on' : 'Mute video'; soundButton.setAttribute('aria-label', highlight.muted ? 'Turn highlight video sound on' : 'Mute highlight video'); };
soundButton.addEventListener('click', () => { highlight.muted = !highlight.muted; if (highlight.paused) highlight.play().catch(() => {}); updateSound(); });
highlight.addEventListener('volumechange', updateSound);
if (reducedMotion.matches) { highlight.autoplay = false; highlight.pause(); }
document.querySelectorAll('[data-seek]').forEach(button => button.addEventListener('click', () => { highlight.currentTime = Number(button.dataset.seek); highlight.play().catch(() => {}); document.querySelector('#highlight').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' }); }));
const dialog = document.querySelector('#figure-dialog');
document.querySelectorAll('[data-figure]').forEach(button => button.addEventListener('click', () => { dialog.querySelector('img').src = button.dataset.figure; dialog.querySelector('img').alt = button.dataset.caption; dialog.querySelector('p').textContent = button.dataset.caption; dialog.showModal(); }));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
const navLinks = [...document.querySelectorAll('.nav-links a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); }); }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));
  const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && !reducedMotion.matches && video.dataset.userPaused !== 'true') { video.dataset.observerPaused = 'false'; video.play().catch(() => {}); }
    else if (!entry.isIntersecting && !video.paused) { video.dataset.observerPaused = 'true'; video.pause(); }
  }), { threshold: 0.4 });
  document.querySelectorAll('.demo-media video').forEach(video => {
    video.addEventListener('pause', () => { if (video.dataset.observerPaused !== 'true' && !video.ended) video.dataset.userPaused = 'true'; });
    video.addEventListener('play', () => { video.dataset.userPaused = 'false'; });
    videoObserver.observe(video);
  });
}
document.addEventListener('visibilitychange', () => {
  document.querySelectorAll('video').forEach(video => {
    if (document.hidden) {
      video.dataset.resumeOnVisible = String(!video.paused);
      if (!video.paused) { video.dataset.observerPaused = 'true'; video.pause(); }
    } else if (video.dataset.resumeOnVisible === 'true' && !reducedMotion.matches) {
      const rect = video.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) video.play().catch(() => {});
      video.dataset.resumeOnVisible = 'false';
    }
  });
});
