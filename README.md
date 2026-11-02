# VETA Cola de Mono — site demonstrativo

Landing page + página de vendas (simulada) para a bebida chilena Cola de Mono (CH Exports).

## Estrutura

```
veta-site/
├── index.html          Landing page (início, sobre nós, valores)
├── produtos.html       Catálogo + finalização da compra (2 etapas na mesma página)
├── css/
│   ├── tokens.css      Paletas de cores, fontes e escala tipográfica (arquivo "Estilização")
│   ├── base.css        Reset, tipografia, botões, acessibilidade
│   ├── layout.css      Cabeçalho e rodapé compartilhados
│   ├── home.css        Estilos da landing page
│   ├── carrossel.css   Estilos do carrossel da landing page
│   ├── idade.css       Estilos do aviso de maioridade
│   └── produtos.css    Estilos do catálogo, resumo e formulário
├── js/
│   ├── lang/           Todos os textos do site: pt.js, es.js e en.js (mesmas chaves nos 3)
│   ├── i18n.js         Motor de troca de idioma (lê js/lang/*.js)
│   ├── main.js         Menu mobile e troca de idioma
│   ├── carrossel.js    Carrossel com rotação automática (5 s)
│   ├── idade.js        Aviso de maioridade (primeira visita)
│   └── produtos.js     Seleção de produto, quantidade, total, validação e confirmação simulada
└── assets/img/         logos/, produtos/ e fotos/ (WebP otimizado; logos em PNG)
```

## Como usar

Abra `index.html` no navegador (as fontes vêm do Google Fonts, então é preciso internet).
Para servir localmente: `python3 -m http.server` na pasta do projeto.

## Pontos de edição

- **Textos:** edite os valores em `js/lang/pt.js`, `es.js` e `en.js`. Cada elemento do HTML aponta para uma chave via `data-i18n`; o texto em português dentro do HTML é só o conteúdo inicial (antes do JS carregar).
- **Produtos e preços:** atributos `data-*` de cada `<article class="produto">` em `produtos.html`.
- **Cores e fontes:** `css/tokens.css`.
- **Banner de produtos:** `assets/img/fotos/banner-especiarias.webp` (recorte de baixa resolução — troque por uma foto própria).
- **Links das redes sociais:** `href="#"` no rodapé.
- **Fluxo de compra:** `#compra/<produto>` na URL abre a etapa de compra. Nada é enviado nem salvo.
- **Carrossel:** slides em `index.html` (`<section class="carrossel">`); o intervalo fica em `data-intervalo` (ms).
- **Aviso de maioridade:** `<dialog id="aviso-idade">` nas duas páginas; a confirmação fica salva no navegador (`localStorage`, chave `veta-maioridade`). Para testar de novo, limpe os dados do site ou rode `localStorage.removeItem('veta-maioridade')` no console.
