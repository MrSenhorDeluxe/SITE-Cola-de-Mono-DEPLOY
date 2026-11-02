/* ==========================================================
   PRODUTOS — seleção, resumo e finalização simulada
   Os dados de cada produto vêm dos atributos data-* do HTML.
   ========================================================== */
(function () {
  "use strict";

  var etapaProdutos = document.getElementById("etapa-produtos");
  var etapaCompra = document.getElementById("etapa-compra");
  var form = document.getElementById("form-compra");
  var dialogo = document.getElementById("dialogo-sucesso");

  var el = {
    img: document.getElementById("resumo-img"),
    nome: document.getElementById("resumo-nome"),
    preco: document.getElementById("resumo-preco"),
    qtd: document.getElementById("resumo-qtd"),
    total: document.getElementById("resumo-total")
  };

  var banner = document.querySelector(".banner");
  var selecionado = null;
  var quantidade = 1;

  var brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  var clpNum = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });
  var clp = { format: function (v) { return "$" + clpNum.format(v) + " CLP"; } };

  function produtoPorId(id) {
    return document.querySelector('.produto[data-produto="' + id + '"]');
  }

  function lerProduto(artigo) {
    return {
      id: artigo.dataset.produto,
      nome: artigo.querySelector("h2").textContent,
      brl: parseFloat(artigo.dataset.brl),
      clp: parseInt(artigo.dataset.clp, 10),
      img: artigo.dataset.img
    };
  }

  function atualizarResumo() {
    if (!selecionado) return;
    el.img.src = selecionado.img;
    el.nome.textContent = selecionado.nome;
    el.preco.textContent = brl.format(selecionado.brl) + " | " + clp.format(selecionado.clp);
    el.qtd.textContent = quantidade;
    el.total.textContent = brl.format(selecionado.brl * quantidade) + " | " + clp.format(selecionado.clp * quantidade);
  }

  /* ---------- navegação entre etapas (via hash) ---------- */
  function mostrar() {
    var m = location.hash.match(/^#compra\/([\w-]+)/);
    var artigo = m && produtoPorId(m[1]);

    if (artigo) {
      var mudou = !selecionado || selecionado.id !== m[1];
      selecionado = lerProduto(artigo);
      if (mudou) quantidade = 1;
      atualizarResumo();
      etapaProdutos.hidden = true;
      etapaCompra.hidden = false;
      banner.hidden = true;
      window.scrollTo({ top: 0 });
      document.getElementById("compra-titulo").setAttribute("tabindex", "-1");
      document.getElementById("compra-titulo").focus({ preventScroll: true });
    } else {
      etapaCompra.hidden = true;
      etapaProdutos.hidden = false;
      banner.hidden = false;
    }
  }

  document.querySelectorAll("[data-selecionar]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      location.hash = "compra/" + btn.closest(".produto").dataset.produto;
    });
  });

  document.querySelector("[data-voltar]").addEventListener("click", function () {
    history.pushState("", document.title, location.pathname + location.search);
    mostrar();
  });

  window.addEventListener("hashchange", mostrar);

  /* ---------- quantidade ---------- */
  document.querySelectorAll("[data-qtd]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      quantidade = Math.min(24, Math.max(1, quantidade + parseInt(btn.dataset.qtd, 10)));
      atualizarResumo();
    });
  });

  /* ---------- validação do formulário ---------- */
  function validarCampo(campo) {
    var msg = "";
    var valor = campo.value.trim();
    if (campo.required && !valor) msg = window.I18N.t("erro.obrigatorio");
    else if (campo.type === "email" && valor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) msg = window.I18N.t("erro.email");

    var alvo = form.querySelector('[data-erro-de="' + campo.id + '"]');
    if (alvo) alvo.textContent = msg;
    campo.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") validarCampo(e.target);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var invalidos = Array.prototype.filter.call(form.querySelectorAll("input"), function (c) {
      return !validarCampo(c);
    });
    if (invalidos.length) { invalidos[0].focus(); return; }

    /* Simulação: nenhum dado é enviado. */
    if (typeof dialogo.showModal === "function") dialogo.showModal();
    else dialogo.setAttribute("open", "");
  });

  document.getElementById("dialogo-fechar").addEventListener("click", function () {
    dialogo.close();
    form.reset();
    history.pushState("", document.title, location.pathname + location.search);
    mostrar();
  });

  document.addEventListener("idiomachange", function () {
    if (!selecionado) return;
    selecionado.nome = lerProduto(produtoPorId(selecionado.id)).nome;
    atualizarResumo();
  });

  mostrar();
})();
