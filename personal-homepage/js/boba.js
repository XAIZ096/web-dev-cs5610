const SKILLS = {
  Languages: "Java, Python, C, C++, SQL",
  Backend: "Spring Boot, Spring MVC, Spring Cloud, Hibernate, JPA, Node.js",
  Cloud: "Kubernetes, Docker, Git, Maven",
  Messaging: "Apache Kafka, Confluent Kafka, Spring Kafka",
  Databases: "MySQL, MongoDB, Couchbase, IBM DB2, IBM IMS",
  Monitoring: "Grafana, Dynatrace, Splunk",
  Frontend: "HTML, CSS, JS, Bootrap, Angular, TypeScript, jQuery",
  DevOps: "CI/CD, Jenkins, GitHub Actions",
  Architecture: "Microservices, Event-Driven Architecture, RESTful APIs",
};

const DROP_POSITIONS = [
  // bottom row - 2 balls
  { x: "42%", end: "190px" },
  { x: "58%", end: "190px" },
  // middle row - 3 balls
  { x: "34%", end: "150px" },
  { x: "48%", end: "150px" },
  { x: "66%", end: "150px" },
  // top row - 4 balls
  { x: "32%", end: "110px" },
  { x: "38%", end: "110px" },
  { x: "54%", end: "110px" },
  { x: "68%", end: "110px" },
];

const EXPLODE_POSITIONS = [
  { x: "7%", y: "18%" },
  { x: "82%", y: "12%" },
  { x: "23%", y: "82%" },
  { x: "73%", y: "58%" },
  { x: "12%", y: "48%" },
  { x: "88%", y: "78%" },
  { x: "42%", y: "95%" },
  { x: "61%", y: "10%" },
  { x: "35%", y: "35%" },
];

export function initBoba(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const balls = section.querySelectorAll(".boba-ball");
  const cupWrapper = section.querySelector(".boba-cup-wrapper");
  const container = section.querySelector(".boba-balls-container");
  const detail = section.querySelector(".skill-detail");
  const detailName = section.querySelector(".skill-detail__name");
  const detailTechs = section.querySelector(".skill-detail__techs");
  let isExploded = false;

  balls.forEach((ball, i) => {
    const pos = DROP_POSITIONS[i] || DROP_POSITIONS[0];
    ball.style.setProperty("--drop-x", pos.x);
    ball.style.setProperty("--drop-end", pos.end);

    let delay;
    if (i < 2) {
      delay = i * 0.08;
    } else if (i < 5) {
      delay = 0.25 + (i - 2) * 0.08;
    } else {
      delay = 0.55 + (i - 5) * 0.08;
    }

    ball.style.setProperty("--drop-delay", `${delay}s`);
    ball.style.setProperty("--drop-duration", "0.4s");
  });

  // scroll trigger
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (isExploded) return;
          balls.forEach((ball) => {
            ball.classList.remove("is-dropped");
            void ball.offsetWidth;
            ball.classList.add("is-dropped");
          });
          playBobaSound();
        } else {
          if (isExploded) return;
          balls.forEach((ball) => ball.classList.remove("is-dropped"));
        }
      });
    },
    { threshold: 0.4 },
  );

  observer.observe(section);

  const hint = section.querySelector(".boba-hint");

  // click cup - explode balls across section / return to cup
  cupWrapper.addEventListener("click", () => {
    // always hide hint on first click - before any isExploded check
    if (hint) hint.classList.add("is-hidden");

    if (isExploded) {
      isExploded = false;
      container.classList.remove("is-exploding");
      section.classList.remove("is-exploded");

      balls.forEach((ball) => {
        container.appendChild(ball);
        ball.classList.remove("is-exploded");
        void ball.offsetWidth;
        ball.classList.add("is-dropped");
      });
      playBobaSound();
      return;
    }

    isExploded = true;
    container.classList.add("is-exploding");
    section.classList.add("is-exploded");

    balls.forEach((ball, i) => {
      const pos = EXPLODE_POSITIONS[i] || EXPLODE_POSITIONS[0];
      section.appendChild(ball);
      ball.style.setProperty("--explode-x", pos.x);
      ball.style.setProperty("--explode-y", pos.y);
      ball.classList.remove("is-dropped");
      void ball.offsetWidth;
      ball.classList.add("is-exploded");
    });
  });

  // hover - show skill name and tech list
  balls.forEach((ball) => {
    // desktop hover
    ball.addEventListener("mouseenter", () => {
      const skill = ball.dataset.skill;
      if (!skill || !detail) return;
      detailName.textContent = skill;
      detailTechs.textContent = SKILLS[skill] || "";
      detail.classList.add("is-visible");
    });

    ball.addEventListener("mouseleave", () => {
      if (!detail) return;
      detail.classList.remove("is-visible");
    });

    // mobile tap
    ball.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        const skill = ball.dataset.skill;
        if (!skill || !detail) return;
        detailName.textContent = skill;
        detailTechs.textContent = SKILLS[skill] || "";
        detail.classList.add("is-visible");
      },
      { passive: false },
    );
  });

  document.addEventListener("touchstart", (e) => {
    if (!detail) return;
    const tappedBall = e.target.closest(".boba-ball");
    if (!tappedBall) {
      detail.classList.remove("is-visible");
    }
  });

  let dropSound = null;

  function playBobaSound() {
    if (!dropSound) return;
    dropSound.currentTime = 0;
    dropSound.play().catch(() => {});
  }

  // browser policy not letting me play on scroll without user interaction.
  // unlock audio on first user interaction
  function unlockAudio() {
    if (dropSound) return;
    dropSound = new Audio("/assets/audio/boba-drop.mp3");
    dropSound.volume = 0.1;
  }

  document.addEventListener("click", unlockAudio, { once: true });
  document.addEventListener("keydown", unlockAudio, { once: true });
}
