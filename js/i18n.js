/* ==========================================================
   i18n — troca de idioma da interface (ESP / PT-BR / ENG)
   Os textos ficam em js/lang/pt.js, es.js e en.js.
   ========================================================== */
(function () {
  "use strict";

  /* Preenchido por js/lang/pt.js, es.js e en.js (carregados antes deste arquivo) */
  var DICIONARIO = window.I18N_DICT || {};

  var HTML_LANG = { pt: "pt-BR", es: "es", en: "en" };
  var CHAVE = "veta-idioma";
  var atual = "pt";

  function lerPreferencia() {
    try { var v = localStorage.getItem(CHAVE); if (DICIONARIO[v]) return v; } catch (e) {}
    return "pt";
  }

  function t(chave) {
    return (DICIONARIO[atual] && DICIONARIO[atual][chave]) || DICIONARIO.pt[chave] || chave;
  }

  function aplicar(lang) {
    if (!DICIONARIO[lang]) lang = "pt";
    atual = lang;
    document.documentElement.lang = HTML_LANG[lang];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    try { localStorage.setItem(CHAVE, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("idiomachange", { detail: { lang: lang } }));
  }

  window.I18N = { t: t, aplicar: aplicar, idioma: function () { return atual; }, inicial: lerPreferencia };
})();
