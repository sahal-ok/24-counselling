// ========================================
// MOBILE MENU
// ========================================

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");

  if (mobileMenu.classList.contains("active")) {
    menuButton.textContent = "✕";
  } else {
    menuButton.textContent = "☰";
  }
});


// Close mobile menu when clicking a link

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    menuButton.textContent = "☰";
  });
});


// ========================================
// FAQ ACCORDION
// ========================================

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {

  question.addEventListener("click", () => {

    const currentItem = question.parentElement;

    document.querySelectorAll(".faq-item").forEach((item) => {

      if (item !== currentItem) {
        item.classList.remove("active");
      }

    });

    currentItem.classList.toggle("active");

  });

});


// ========================================
// HEADER SHADOW ON SCROLL
// ========================================

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 20) {
    header.style.boxShadow =
      "0 5px 25px rgba(30, 55, 45, 0.08)";
  } else {
    header.style.boxShadow = "none";
  }

});


// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {

  link.addEventListener("click", function (event) {

    const targetId = this.getAttribute("href");

    if (targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {

      event.preventDefault();

      const headerHeight = header.offsetHeight;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    }

  });

});


// ========================================
// SIMPLE SCROLL REVEAL
// ========================================

const revealElements = document.querySelectorAll(
  ".psychologist-card, .service-card, .testimonial, .process-item"
);

const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        revealObserver.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.1
  }
);


revealElements.forEach((element) => {

  element.style.opacity = "0";
  element.style.transform = "translateY(25px)";
  element.style.transition =
    "opacity 0.6s ease, transform 0.6s ease";

  revealObserver.observe(element);

});