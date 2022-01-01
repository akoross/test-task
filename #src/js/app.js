import testWebP from "./modules/testWebP.js";
testWebP();
import isMobile from "./modules/isMobile.js";
isMobile();
import spollers from "./modules/spollers.js";
spollers();

if (document.body.classList.values("_touch")) {
  const menuArrows = document.querySelectorAll(".menu__arrow");
  if (menuArrows.length > 0) {
    menuArrows.forEach((e) => {
      e.addEventListener("click", () => {
        e.parentElement.classList.toggle("_active");
      });
    });
  }
}

//---- прокрутка при клике

const menuLinks = document.querySelectorAll(".menu__link[data-goto]");
if (menuLinks.length > 0) {
  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.dataset.goto && document.querySelector(link.dataset.goto)) {
        const gotoBlock = document.querySelector(link.dataset.goto);
        const gotoBlockValue =
          gotoBlock.getBoundingClientRect().top +
          pageXOffset -
          document.querySelector("header").offsetHeight;

        if (menuIcon.classList.contains("_active")) {
          document.body.classList.remove("_lock");
          menuIcon.classList.remove("_active");
          menuBody.classList.remove("_active");
        }

        window.scrollTo({
          top: gotoBlockValue,
          behavior: "smooth",
        });
        e.preventDefault();
      }
    });
  });
}

//------burger---

const menuIcon = document.querySelector(".menu__icon");
const menuBody = document.querySelector(".menu__body");
if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    document.body.classList.toggle("_lock");
    menuIcon.classList.toggle("_active");
    menuBody.classList.toggle("_active");
  });
}
