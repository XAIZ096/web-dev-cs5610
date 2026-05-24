export function initCarousel(
  trackSelector,
  prevSelector,
  nextSelector,
  dotsSelector,
) {
  const track = document.querySelector(trackSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);
  const dotsContainer = document.querySelector(dotsSelector);
  if (!track) return;

  const cards = Array.from(track.children);
  const cardWidth = () => cards[0].getBoundingClientRect().width + 24; // 24 = gap
  let current = 0;

  // build dots
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    dot.setAttribute("aria-label", `Go to project ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function goTo(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    track.style.transform = `translateX(-${current * cardWidth()}px)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === cards.length - 1;
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  goTo(0);
}

export function initCardGifs() {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    const img = card.querySelector(".project-card__image");
    if (!img || !img.dataset.gif) return;

    const staticSrc = img.src;
    const gifSrc = img.dataset.gif;

    card.addEventListener("mouseenter", () => {
      img.src = gifSrc;
    });

    card.addEventListener("mouseleave", () => {
      img.src = staticSrc;
    });
  });
}
