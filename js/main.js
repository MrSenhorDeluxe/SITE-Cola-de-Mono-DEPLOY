/* ==========================================================
   MAIN — comportamentos compartilhados (menu e idioma)
   ========================================================== */
(function () {
  "use strict";

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var aberto = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(aberto));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { window.I18N.aplicar(btn.getAttribute("data-lang")); });
  });

  window.I18N.aplicar(window.I18N.inicial());
})();
