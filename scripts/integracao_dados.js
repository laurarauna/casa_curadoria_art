/**
 * integracao_dados.js
 * Módulo responsável por consumir os dados gerados pela automação (Python)
 * e injetar dinamicamente na interface (DOM).
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Caminho para o JSON atualizado via GitOps (GitHub Actions)
    const DATA_URL = './dados_midia_kit.json';

    async function inicializarDados() {
        try {
            const resposta = await fetch(DATA_URL);
            
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            const dados = await resposta.json();
            injetarDadosNoDOM(dados);

        } catch (erro) {
            console.error("Erro ao carregar dados do Mídia Kit. Usando dados estáticos de fallback.", erro);
        } finally {
            // Independentemente de dar erro ou sucesso, inicializa as animações
            inicializarAnimacoes();
        }
    }

    function injetarDadosNoDOM(dados) {
        // 1. Seguidores (Ex: 11533 -> 11.5)
        const seguidoresK = (dados.Seguidores / 1000).toFixed(1);
        document.getElementById('val-seguidores').setAttribute('data-target', seguidoresK);
        
        // 2. Crescimento
        const crescimentoK = (dados.Crescimento_30d / 1000).toFixed(1);
        document.getElementById('stat-crescimento').innerText = `+${crescimentoK}K NO ÚLTIMO MÊS`;
        
        // 3. Impressões (Ex: 142307 -> 142)
        const impressoesK = Math.floor(dados.Impressoes_30d / 1000);
        document.getElementById('val-impressoes').setAttribute('data-target', impressoesK);
        
        // 4. Métricas de Engajamento e Relacionamento
        document.getElementById('val-engajamento').setAttribute('data-target', dados['Taxa_Engajamento_%']);
        document.getElementById('val-salvos').setAttribute('data-target', dados.Media_Salvos_Post);
        document.getElementById('val-compartilhamentos').setAttribute('data-target', dados.Media_Compartilhamentos_Post);

        /* 
         * Aqui também entrará futuramente a lógica para quebrar as strings 
         * de "Faixa_Etaria" e "Top_5_Cidades" e injetar nas barras visuais.
         */
    }

    function inicializarAnimacoes() {
        // Observer para Fade Up
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Animação das barras
                    if (entry.target.querySelector('.fill-bar')) {
                        entry.target.querySelectorAll('.fill-bar').forEach(bar => {
                            setTimeout(() => { bar.style.width = bar.getAttribute('data-width'); }, 300);
                        });
                    }
                    
                    // Animação dos contadores numéricos
                    if (entry.target.querySelector('.counter')) {
                        entry.target.querySelectorAll('.counter').forEach(counter => {
                            const target = parseFloat(counter.getAttribute('data-target'));
                            const isDecimal = target % 1 !== 0;
                            let current = 0;
                            const increment = target / 50; 
                            
                            const updateCounter = () => {
                                current += increment;
                                if (current < target) {
                                    counter.innerText = isDecimal ? current.toFixed(1) : Math.ceil(current);
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    counter.innerText = target;
                                }
                            };
                            setTimeout(updateCounter, 400); 
                        });
                    }
                    obs.unobserve(entry.target); 
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Efeito Parallax
        const parallaxElements = document.querySelectorAll('.parallax-el');
        window.addEventListener('scroll', () => {
            let scrollY = window.pageYOffset;
            parallaxElements.forEach(el => {
                let speed = el.getAttribute('data-speed');
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }

    // Inicia a aplicação
    inicializarDados();
});
