const cards = document.querySelectorAll(".card");
const overlay = document.getElementById("overlay");
const bench = document.getElementById("bench");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const startRect = card.getBoundingClientRect();
    const scale = 1.6;

    // Create a shell that we will scale like a bitmap
    const shell = document.createElement("div");
    shell.className = "zoom-shell";
    Object.assign(shell.style, {
      top: `${startRect.top}px`,
      left: `${startRect.left}px`,
      width: `${startRect.width}px`,
      height: `${startRect.height}px`,
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    });

    // Clone the card inside; disable hover on the clone
    const clone = card.cloneNode(true);
    clone.classList.add("no-hover");
    shell.appendChild(clone);
    document.body.appendChild(shell);

    // Hide real card + show overlay
    card.classList.add("hidden-card");
    overlay.classList.add("visible");
    bench.classList.add("blurred");

    // ---- EXPAND (centered) ----
    requestAnimationFrame(() => {
      shell.style.top = "50%";
      shell.style.left = "50%";
      shell.style.transform = `translate(-50%, -50%) scale(${scale})`;
      shell.style.boxShadow = "0 0 40px rgba(0,0,0,0.8)";
    });

    // ---- COLLAPSE ----
    overlay.onclick = () => {
      overlay.classList.remove("visible");
      bench.classList.remove("blurred");

      // Move shell back to exact start box; scale back to 1
      shell.style.top = `${startRect.top}px`;
      shell.style.left = `${startRect.left}px`;
      shell.style.transform = "none";
      shell.style.boxShadow = "0 0 0 rgba(0,0,0,0)";

      shell.addEventListener(
        "transitionend",
        () => {
          // One paint to guarantee final alignment, then restore original
          shell.style.transition = "none";
          void shell.offsetHeight;
          shell.remove();
          card.classList.remove("hidden-card");
        },
        { once: true }
      );
    };
  });
});
