const cards = document.querySelectorAll(".card");
const overlay = document.getElementById("overlay");
const board = document.getElementById("board");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    // prevent double-zooming
    if (card.classList.contains("zoomed")) return;

    // Capture position & size
    const rect = card.getBoundingClientRect();

    // Placeholder to preserve layout
    const placeholder = document.createElement("div");
    placeholder.style.width = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    placeholder.style.flexShrink = "0";
    card.parentNode.insertBefore(placeholder, card);

    // Remember original location
    const originalParent = card.parentNode;
    const originalNextSibling = card.nextSibling;

    // Move card to body for zoom animation
    document.body.appendChild(card);

    // Prepare card for fixed positioning
    card.style.position = "fixed";
    card.style.top = `${rect.top}px`;
    card.style.left = `${rect.left}px`;
    card.style.width = `${rect.width}px`;
    card.style.height = `${rect.height}px`;
    card.style.margin = "0";
    card.style.zIndex = "1001";
    card.style.transformOrigin = "top left";
    card.style.transition = "all 0.6s cubic-bezier(0.4,0,0.2,1)";
    card.style.transform = "scale(1)";

    card.classList.add("zoomed");

    // Show overlay
    overlay.classList.add("visible");
    board.classList.add("blurred");

    // Force reflow
    void card.offsetWidth;

    // Calculate centered translation
    const scale = 1.7;
    const scaledWidth = rect.width * scale;
    const scaledHeight = rect.height * scale;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    const centeredLeft = viewportCenterX - scaledWidth / 2;
    const centeredTop = viewportCenterY - scaledHeight / 2;

    const translateX = centeredLeft - rect.left;
    const translateY = centeredTop - rect.top;

    // Animate zoom
    card.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    card.style.boxShadow = "0 0 40px rgba(0,0,0,0.8)";

    // --- Define handler function ---
    const collapseHandler = () => {
      // remove listener immediately so we don't stack
      overlay.removeEventListener("click", collapseHandler);

      overlay.classList.remove("visible");
      board.classList.remove("blurred");

      // Animate back
      card.style.top = `${rect.top}px`;
      card.style.left = `${rect.left}px`;
      card.style.transform = "scale(1)";
      card.style.boxShadow = "0 5px 12px rgba(0,0,0,0.3)";

      const handleTransitionEnd = (e) => {
        if (e.target !== card) return;

        card.removeEventListener("transitionend", handleTransitionEnd);

        // Restore to original layout
        if (originalNextSibling && originalNextSibling.parentNode === originalParent) {
          originalParent.insertBefore(card, originalNextSibling);
        } else {
          originalParent.appendChild(card);
        }

        placeholder.remove();

        // Reset styles
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        card.style.height = "";
        card.style.margin = "";
        card.style.zIndex = "";
        card.style.transformOrigin = "";
        card.style.transition = "";
        card.style.transform = "";
        card.style.boxShadow = "";

        card.classList.remove("zoomed");
      };

      card.addEventListener("transitionend", handleTransitionEnd, { once: true });
    };

    // --- Attach listener each time we zoom a card ---
    overlay.addEventListener("click", collapseHandler);
  });
});
