/* ==========================================================
   AVISO DE MAIORIDADE
   - aparece na primeira visita (guarda a confirmação no navegador)
   - não fecha com Esc nem clicando fora
   - "Sou menor de idade" mantém o site bloqueado
   ========================================================== */
(function () {
  "use strict";

  var CHAVE = "veta-maioridade";
  var dialogo = document.getElementById("aviso-idade");
  if (!dialogo) return;

  var pergunta = document.getElementById("idade-pergunta");
  var negado = document.getElementById("idade-negado");

  function jaConfirmou() {
    try { return localStorage.getItem(CHAVE) === "1"; } catch (e) { return false; }
  }
  function guardar() {
    try { localStorage.setItem(CHAVE, "1"); } catch (e) {}
  }

  function mostrarPainel(qual) {
    pergunta.hidden = qual !== "pergunta";
    negado.hidden = qual !== "negado";
    var alvo = qual === "pergunta" ? document.getElementById("idade-sim") : document.getElementById("idade-voltar");
    alvo.focus();
  }

  function abrir() {
    if (typeof dialogo.showModal === "function") dialogo.showModal();
    else dialogo.setAttribute("open", "");
    mostrarPainel("pergunta");
  }

  function fechar() {
    if (typeof dialogo.close === "function") dialogo.close();
    else dialogo.removeAttribute("open");
  }

  /* Esc não dispensa o aviso */
  dialogo.addEventListener("cancel", function (e) { e.preventDefault(); });

  document.getElementById("idade-sim").addEventListener("click", function () {
    guardar();
    fechar();
  });
  document.getElementById("idade-nao").addEventListener("click", function () { mostrarPainel("negado"); });
  document.getElementById("idade-voltar").addEventListener("click", function () { mostrarPainel("pergunta"); });

  if (!jaConfirmou()) abrir();
})();
