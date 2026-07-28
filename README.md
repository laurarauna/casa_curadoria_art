# 🏺 Casa Curadoria | Portfólio B2B

> **Live Demo:** [casacuradoria.art](https://casacuradoria.art)

Repositório oficial do portfólio web da **Casa Curadoria**. Desenvolvido para apresentar métricas de autoridade, engajamento e formatos comerciais (B2B) para marcas de alto padrão no nicho de móveis, design de interiores e decoração.

---

## 🎨 Conceito e Direção de Arte
O design do site foi construído sob o conceito de uma **"Galeria de Arte com Borogodô"**. A interface utiliza respiro visual (white space), tipografia serifada elegante e uma paleta de cores exclusivas para transmitir sofisticação, calor e brasilidade.

**Paleta de Cores (Tailwind Config):**
*   🔴 `principal`: `#721f16` (Vermelho Profundo)
*   🌕 `fundo`: `#ebd4ac` (Bege Areia)
*   🌿 `detalhe1`: `#576e36` (Verde Oliva)
*   ☀️ `detalhe2`: `#ffb236` (Amarelo Ouro)
*   🟠 `detalhe3`: `#ef4f28` (Laranja Vibrante)

---

## 🚀 Tecnologias Utilizadas
O projeto prioriza performance, carregamento rápido e facilidade de manutenção, utilizando uma stack enxuta:

*   **HTML5:** Estrutura semântica e acessível.
*   **Tailwind CSS (CDN):** Estilização utilitária e design 100% responsivo (Mobile-first).
*   **Vanilla JavaScript:** Utilizado para injeção de dados dinâmicos e animações de rolagem (via `IntersectionObserver`).
*   **Vercel:** Hospedagem e Deploy Contínuo (CI/CD) integrado ao GitHub.
*   **Figma:** Prototipação e extração de assets (SVGs e WebP).

---

## ⚙️ Estrutura e Funcionalidades

### 1. Atualização Rápida de Métricas (Data Logic)
Para evitar buscas manuais no HTML na hora de atualizar os números de mídia kit, todas as métricas estão centralizadas em um objeto JavaScript no final do arquivo `index.html`. 
Para atualizar o site mensalmente, basta alterar os valores neste bloco:

```javascript
const mockData = {
    "Seguidores": 11.5,
    "Crescimento_30d": "+4,5K",
    "Media_Alcance_Post": "10.8K",
    "Taxa_Engajamento_%": 14.6,
    "Media_Salvos_Post": 405,
    "Media_Compartilhamentos_Post": 183,
    "Impressoes_Mensais": 142
};
