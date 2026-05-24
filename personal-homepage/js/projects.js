// scroll-triggered fade-in for project sections

function initProjectAnimations() {
  const sections = document.querySelectorAll(".project-detail, .project-wip");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.15 },
  );

  sections.forEach((section) => observer.observe(section));
}

// smooth scroll to anchor if navigated from home page carousel
function initAnchorScroll() {
  const hash = window.location.hash;
  if (!hash) return;

  const target = document.querySelector(hash);
  if (!target) return;

  setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 400); // wait for page fade-in to complete
}

document.addEventListener("DOMContentLoaded", () => {
  initProjectAnimations();
  initAnchorScroll();
});
