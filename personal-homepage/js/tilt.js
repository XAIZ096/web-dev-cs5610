export function initTilt(wrapperSelector) {
  const wrapper = document.querySelector(".hero-portrait-wrapper");
  const container = document.querySelector(".hero-portrait-container");
  const icons = document.querySelectorAll(".orbit-icon");
  if (!wrapper || !container) return;

  const TILT_ANGLE = 15;
  const TRANSITION_DURATION = 1400; // 1200ms + 160ms delay + buffer
  let transitionTimer = null;

  container.addEventListener("mouseenter", () => {
    container.classList.add("is-hovered");
    wrapper.style.transform = `perspective(600px) rotateY(${TILT_ANGLE}deg)`;

    transitionTimer = setTimeout(() => {
      icons.forEach((icon) => {
        icon.style.pointerEvents = "auto";
      });
    }, TRANSITION_DURATION);
  });

  container.addEventListener("mouseleave", () => {
    if (transitionTimer) {
      clearTimeout(transitionTimer);
      transitionTimer = null;
    }

    // disable icons immediately on leave
    icons.forEach((icon) => {
      icon.style.pointerEvents = "none";
    });

    container.classList.remove("is-hovered");
    wrapper.style.transform = "perspective(600px) rotateY(0deg)";
  });
}
