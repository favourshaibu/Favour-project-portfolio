// ===== Mobile navigation toggle =====
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");

// Guard: only run if both elements exist on this page
if (navToggle && navMenu) {
  // Open or close the menu and keep the button's ARIA state in sync
  function setMenu(isOpen) {
    navMenu.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  // Clicking the hamburger flips the current state
  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  // Clicking any link closes the menu
  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  // Pressing Escape closes the menu
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });
}
