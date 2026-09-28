const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.querySelector('#hero-video');
const heroToggle = document.querySelector('#hero-toggle');
const film = document.querySelector('#highlight-video');
const clips = [...document.querySelectorAll('.demo-media video')];
const allVideos = [heroVideo, ...clips, film];

function playVideo(video) {
  if (video.error) video.load();
  return video.play().catch(() => { updateVideoUI(video); });
}
function updateVideoUI(video) {
  const parent = video.parentElement;
  const button = parent.querySelector('.video-play');
  if (button) button.classList.toggle('is-playing', !video.paused && !video.ended);
  const error = parent.querySelector('.video-error');
  if (error) error.hidden = !video.error;
  if (video === heroVideo) {
    const paused = video.paused;
    heroToggle.querySelector('.hero-toggle-label').textContent = paused ? 'Play background' : 'Pause background';
    heroToggle.querySelector('.pause-icon').textContent = paused ? '▶' : 'Ⅱ';
    heroToggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
  }
}
allVideos.forEach(video => {
  if (video !== film) { video.muted = true; video.defaultMuted = true; }
  ['playing', 'pause', 'ended', 'error', 'loadeddata'].forEach(event => video.addEventListener(event, () => updateVideoUI(video)));
  const button = video.parentElement.querySelector('.video-play');
  if (button) button.addEventListener('click', () => playVideo(video));
  if (reducedMotion.matches && video !== film) { video.autoplay = false; video.pause(); }
  updateVideoUI(video);
});
heroToggle.addEventListener('click', () => { if (heroVideo.paused) playVideo(heroVideo); else heroVideo.pause(); });
if (!reducedMotion.matches) playVideo(heroVideo);
heroVideo.addEventListener('timeupdate', () => {
  if (heroVideo.duration) document.querySelector('.hero-timeline span').style.transform = `scaleX(${heroVideo.currentTime / heroVideo.duration})`;
});

document.querySelectorAll('[data-seek]').forEach(button => button.addEventListener('click', () => {
  const seekAndPlay = () => { film.currentTime = Number(button.dataset.seek); playVideo(film); };
  if (film.readyState >= 1) seekAndPlay();
  else { film.addEventListener('loadedmetadata', seekAndPlay, { once: true }); film.load(); }
  document.querySelector('#highlight').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
}));

const dialog = document.querySelector('#figure-dialog');
document.querySelectorAll('[data-figure]').forEach(button => button.addEventListener('click', () => {
  dialog.querySelector('img').src = button.dataset.figure;
  dialog.querySelector('img').alt = button.dataset.caption;
  dialog.querySelector('p').textContent = button.dataset.caption;
  dialog.showModal();
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); }
});

const navLinks = [...document.querySelectorAll('.nav-links a')];
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
  const section = [...document.querySelectorAll('section[id]')].filter(el => el.getBoundingClientRect().top < innerHeight * .4).pop();
  navLinks.forEach(link => { if (section && link.hash === '#' + section.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
}
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

if ('IntersectionObserver' in window) {
  if (!reducedMotion.matches) document.documentElement.classList.add('enhanced');
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => reveals.observe(el));
  // Native autoplay and controls remain the fallback; the observer only starts newly visible clips.
  const clipObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting && !reducedMotion.matches && !entry.target.dataset.userPaused) playVideo(entry.target);
  }), { threshold: .15 });
  clips.forEach(video => {
    ['pointerdown', 'keydown'].forEach(event => video.addEventListener(event, () => { video.dataset.interactedAt = String(Date.now()); }));
    video.addEventListener('pause', () => { if (!document.hidden && !video.dataset.backgroundPaused && Date.now() - Number(video.dataset.interactedAt || 0) < 1200) video.dataset.userPaused = 'true'; });
    video.addEventListener('playing', () => { delete video.dataset.userPaused; delete video.dataset.backgroundPaused; });
    clipObserver.observe(video);
  });
}
document.addEventListener('visibilitychange', () => {
  allVideos.forEach(video => {
    if (document.hidden) {
      video.dataset.resume = String(!video.paused);
      if (!video.paused) { video.dataset.backgroundPaused = 'true'; video.pause(); }
    } else if (video.dataset.resume === 'true') {
      delete video.dataset.resume;
      if (!reducedMotion.matches || video === film) playVideo(video);
    }
  });
});
