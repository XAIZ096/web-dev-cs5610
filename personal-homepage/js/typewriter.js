const phrases = [
  "Full Stack Developer",
  "Masters Student",
  "Java & Spring Boot Developer",
  "React & Node.js Enthusiast",
  "Open to Opportunities",
  "Coffee-Driven Coder",
];

const TYPE_SPEED = 80; // ms per character typed
const DELETE_SPEED = 40; // ms per character deleted
const PAUSE_AFTER = 1800; // ms to wait after fully typed
const PAUSE_BEFORE = 400; // ms to wait before typing next

export function initTypewriter(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    el.textContent = current.slice(0, charIndex);

    if (!isDeleting && charIndex === current.length) {
      setTimeout(() => {
        isDeleting = true;
        tick();
      }, PAUSE_AFTER);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(tick, PAUSE_BEFORE);
      return;
    }

    setTimeout(tick, isDeleting ? DELETE_SPEED : TYPE_SPEED);
  }
  tick();
}
