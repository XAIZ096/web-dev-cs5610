import { initTypewriter } from "./typewriter.js";
import { initTilt } from "./tilt.js";
import { initCarousel, initCardGifs } from "./carousel.js";
import { initBoba } from "./boba.js";

document.addEventListener("DOMContentLoaded", () => {
  initTypewriter(".typewriter-text");
  initTilt(".hero-portrait-wrapper");
  initCarousel(
    ".carousel-track",
    ".carousel-btn--prev",
    ".carousel-btn--next",
    ".carousel-dots",
  );
  initCardGifs();
  initBoba("#skills");
});
