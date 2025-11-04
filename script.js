const cards = document.querySelectorAll(".card");
const overlay = document.getElementById("overlay");
const bench = document.getElementById("bench");

cards.forEach(card => {
  card.addEventListener("click", () => {
    const rect = card.getBoundingClientRect();

    const clone = card.cloneNode(true);
    clone.classList.add("animating-card");
    Object.assign(clone.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: 0,
      zIndex: 999,
      transformOrigin: "center center",
      opacity: "1"
    });
    document.body.appendChild(clone);

    card.classList.add("hidden-card");
    overlay.classList.add("visible");
    bench.classList.add("blurred");

    requestAnimationFrame(() => {
      clone.style.top = "50%";
      clone.style.left = "50%";
      clone.style.transform = "translate(-50%, -50%) scale(1.5)";
      clone.style.boxShadow = "0 0 40px rgba(0,0,0,0.8)";
    });

    overlay.onclick = () => {
      const endRect = card.getBoundingClientRect();

      overlay.classList.remove("visible");
      bench.classList.remove("blurred");

      clone.style.transition = "all 0.55s cubic-bezier(0.4, 0, 0.2, 1)";
      clone.style.top = `${endRect.top}px`;
      clone.style.left = `${endRect.left}px`;
      clone.style.width = `${endRect.width}px`;
      clone.style.height = `${endRect.height}px`;
      clone.style.transform = "translate(0,0) scale(1)";
      clone.style.boxShadow = "0 0 0 rgba(0,0,0,0)";

      clone.addEventListener("transitionend", () => {
        clone.remove();
        card.classList.remove("hidden-card");
      }, { once: true });
    };
  });
});
