const parallaxSections = Array.from(document.querySelectorAll("[data-parallax-section]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateParallax() {
  if (prefersReducedMotion.matches) {
    return;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  parallaxSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const travel = rect.height + viewportHeight;
    const progress = clamp((viewportHeight - rect.top) / travel, 0, 1);
    const centeredProgress = progress - 0.5;

    section.querySelectorAll("[data-parallax-layer]").forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      const offset = centeredProgress * depth * viewportHeight;

      layer.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);

      if (layer.classList.contains("bespoke-service__media")) {
        const scale = 1.08 + Math.abs(centeredProgress) * 0.08;
        layer.style.setProperty("--parallax-scale", scale.toFixed(4));
      }
    });
  });
}

let ticking = false;

function requestParallaxUpdate() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    updateParallax();
    ticking = false;
  });
}

function ensureVideosLoop() {
  document.querySelectorAll("video").forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const play = () => video.play().catch(() => {});
    play();
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      play();
    });
  });
}

window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", requestParallaxUpdate);
window.addEventListener("load", () => {
  ensureVideosLoop();
  updateParallax();
});

updateParallax();
