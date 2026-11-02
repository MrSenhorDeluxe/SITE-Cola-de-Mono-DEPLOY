/* ==========================================================
   CARROSSEL — rotação automática a cada 5 s
   - pausa ao passar o mouse ou ao focar um controle
   - botão de pausa, setas e pontos de navegação
   - sem rotação automática se o usuário prefere menos movimento
   ========================================================== */
(function () {
  "use strict";

  var raiz = document.getElementById("carrossel");
  if (!raiz) return;

  var trilho = raiz.querySelector(".carrossel__trilho");
  var slides = raiz.querySelectorAll(".carrossel__slide");
  var viewport = raiz.querySelector(".carrossel__viewport");
  var pontosBox = raiz.querySelector(".carrossel__pontos");
  var btnPausa = raiz.querySelector('[data-carrossel="pausa"]');
  var INTERVALO = parseInt(raiz.dataset.intervalo, 10) || 5000;

  var atual = 0;
  var timer = null;
  var pausadoPeloUsuario = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pausadoTemporario = false;

  var pontos = Array.prototype.map.call(slides, function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "carrossel__ponto";
    b.setAttribute("aria-label", "Ir para o slide " + (i + 1));
    b.addEventListener("click", function () { ir(i); iniciar(); });
    pontosBox.appendChild(b);
    return b;
  });

  function ir(i) {
    atual = (i + slides.length) % slides.length;
    trilho.style.transform = "translateX(" + (-100 * atual) + "%)";
    slides.forEach(function (s, n) {
      if (n === atual) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true");
    });
    pontos.forEach(function (p, n) { p.setAttribute("aria-current", String(n === atual)); });
    var prox = slides[(atual + 1) % slides.length].querySelector("img");
    if (prox) prox.loading = "eager";
  }

  function parar() { clearInterval(timer); timer = null; }

  function iniciar() {
    parar();
    if (pausadoPeloUsuario || pausadoTemporario) return;
    timer = setInterval(function () { ir(atual + 1); }, INTERVALO);
  }

  raiz.querySelector('[data-carrossel="anterior"]').addEventListener("click", function () { ir(atual - 1); iniciar(); });
  raiz.querySelector('[data-carrossel="proximo"]').addEventListener("click", function () { ir(atual + 1); iniciar(); });

  function atualizarBotaoPausa() {
    btnPausa.setAttribute("aria-pressed", String(pausadoPeloUsuario));
    btnPausa.textContent = pausadoPeloUsuario ? "▶" : "❚❚";
    btnPausa.setAttribute("aria-label", pausadoPeloUsuario ? "Retomar rotação automática" : "Pausar rotação automática");
  }
  btnPausa.addEventListener("click", function () {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    atualizarBotaoPausa();
    iniciar();
  });

  function pausaTemp(valor) { pausadoTemporario = valor; iniciar(); }
  viewport.addEventListener("mouseenter", function () { pausaTemp(true); });
  viewport.addEventListener("mouseleave", function () { pausaTemp(false); });
  raiz.addEventListener("focusin", function () { pausaTemp(true); });
  raiz.addEventListener("focusout", function () { pausaTemp(false); });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) parar(); else iniciar();
  });

  raiz.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { ir(atual - 1); iniciar(); }
    if (e.key === "ArrowRight") { ir(atual + 1); iniciar(); }
  });

  var x0 = null;
  viewport.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { ir(atual + (dx < 0 ? 1 : -1)); iniciar(); }
    x0 = null;
  }, { passive: true });

  atualizarBotaoPausa();
  ir(0);
  iniciar();
})();
