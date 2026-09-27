/* Bailamos site — product-tour modal.
   Mirrors city-map.js: overlay is `hidden` until opened, body scroll locks while
   open, Esc / backdrop / close button all dismiss, focus returns to the trigger.
   The full video is preload="none", so nothing downloads until someone opens it. */
(function () {
  const overlay = document.getElementById("tourOverlay");
  const video = document.getElementById("tourVideo");
  if (!overlay || !video) return;

  let lastTrigger = null;

  function open(e) {
    lastTrigger = e && e.currentTarget ? e.currentTarget : null;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => overlay.classList.add("open"));
    // Play only once the source is actually attached (preload="none").
    video.play().catch(() => {}); // autoplay refusal is fine — controls are visible
  }

  function close() {
    overlay.classList.remove("open");
    video.pause();
    video.currentTime = 0;
    const wl = document.getElementById("wlOverlay");
    if (!wl || wl.hidden) document.body.style.overflow = "";
    setTimeout(() => { overlay.hidden = true; }, 240);
    if (lastTrigger && typeof lastTrigger.focus === "function" && (!wl || wl.hidden)) {
      lastTrigger.focus();
    }
  }

  document.querySelectorAll("[data-tour-open]").forEach((el) =>
    el.addEventListener("click", open)
  );
  overlay.querySelectorAll("[data-tour-close]").forEach((el) =>
    el.addEventListener("click", close)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });

  /* The ambient loop is decorative: never let it fight reduced-motion. */
  const loop = document.getElementById("flyLoop");
  if (loop && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    loop.removeAttribute("autoplay");
    loop.pause();
  }
})();
