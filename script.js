const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => siteNav.classList.remove("open"));
  });
}
