/**
 * integracao_dados.js
 * Módulo responsável por consumir os dados gerados pela automação (Python)
 * e injetar dinamicamente na interface (DOM).
 */

document.addEventListener("DOMContentLoaded", () => {
    
    const DATA_URL = './dados_midia_kit.json';

    async function inicializarDados() {
        try {
            const resposta = await fetch(DATA_URL);
            if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

            const dados = await resposta.json();
            injetarDadosNoDOM(dados);

        } catch (erro) {
            console.error("Erro ao carregar dados do Mídia Kit.", erro);
        } finally {
            inicializarAnimacoes();
        }
    }

    function injetarDadosNoDOM(dados) {
        // Métricas simples
        const seguidoresK = (dados.Seguidores / 1000).toFixed(1);
        document.getElementById('val-seguidores').setAttribute('data-target', seguidoresK);
        
        const crescimentoK = (dados.Crescimento_30d / 1000).toFixed(1);
        document.getElementById('stat-crescimento').innerText = `+${crescimentoK}K NO ÚLTIMO MÊS`;
        
        const impressoesK = Math.floor(dados.Impressoes_30d / 1000);
        document.getElementById('val-impressoes').setAttribute('data-target', impressoesK);
        
        document.getElementById('val-engajamento').setAttribute('data-target', dados['Taxa_Engajamento_%']);
        document.getElementById('val-salvos').setAttribute('data-target', dados.Media_Salvos_Post);
        document.getElementById('val-compartilhamentos').setAttribute('data-target', dados.Media_Compartilhamentos_Post);

        // Processamento de strings complexas (Regex)
        processarIdades(dados.Faixa_Etaria);
        processarCidades(dados.Top_5_Cidades);
    }

    function processarIdades(stringIdades) {
        if (!stringIdades || stringIdades === "N/A") return;
        
        const container = document.getElementById('container-idades');
        // Mantém o título e limpa o resto
        container.innerHTML = '<h3 class="font-bold text-sm mb-4 uppercase">% FAIXA ETÁRIA</h3>';
        
        // Separa a string do Python e pega apenas os 4 maiores públicos
        const itens = stringIdades.split(' | ').slice(0, 4);

        itens.forEach((item, index) => {
            // Extrai a faixa (Ex: 25-34 anos) e a porcentagem (Ex: 36.5)
            const match = item.match(/\d+º (.*?) \(([\d.]+)%\)/);
            if (match) {
                const label = match[1];
                const pct = match[2];
                const delayClass = index === 0 ? '' : `delay-${index * 100}`;
                
                container.innerHTML += `
                <div class="flex items-center gap-4 text-xs font-bold mt-4">
                    <span class="w-20 whitespace-nowrap flex-shrink-0">${label}</span>
                    <div class="h-3 bg-detalhe2 rounded-r-full transition-all duration-1000 ${delayClass} fill-bar w-0" data-width="${pct}%"></div>
                    <span class="flex-shrink-0"><span class="counter" data-target="${pct}">0</span>%</span>
                </div>`;
            }
        });
    }

    function processarCidades(stringCidades) {
        if (!stringCidades || stringCidades === "N/A") return;

        const container = document.getElementById('container-cidades');
        // Mantém a estrela em SVG
        const svg = `<svg class="absolute -left-10 top-0 w-48 h-48 opacity-20 parallax-el" data-speed="-0.05" fill="none" stroke="#ffb236" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        container.innerHTML = svg;

        // Pegamos o top 3 cidades
        const itens = stringCidades.split(' | ').slice(0, 3);
        
        // Classes Tailwind para criar o efeito "escadinha" visual
        const widths = ['w-full', 'w-10/12 ml-auto block', 'w-3/4'];

        itens.forEach((item, index) => {
            const match = item.match(/\d+º (.*?) \(([\d.]+)%\)/);
            if (match) {
                // A Meta retorna nomes feios como "São Paulo, São Paulo (state)". 
                // Isso corta a vírgula e pega só a cidade: "SÃO PAULO"
                const cityName = match[1].split(',')[0].toUpperCase();
                const pct = Math.round(parseFloat(match[2]));
                const widthClass = widths[index] || 'w-full';

                container.innerHTML += `
                <div class="bg-detalhe2 text-principal font-bold px-4 py-3 rounded-full inline-block shadow-lg relative z-10 ${widthClass} text-center hover:scale-[1.03] transition-transform whitespace-nowrap text-xs md:text-sm mt-4">
                    ${cityName} (${pct}%)
                </div>`;
            }
        });
    }

    function inicializarAnimacoes() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    if (entry.target.querySelector('.fill-bar')) {
                        entry.target.querySelectorAll('.fill-bar').forEach(bar => {
                            setTimeout(() => { bar.style.width = bar.getAttribute('data-width'); }, 300);
                        });
                    }
                    
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

        const parallaxElements = document.querySelectorAll('.parallax-el');
        window.addEventListener('scroll', () => {
            let scrollY = window.pageYOffset;
            parallaxElements.forEach(el => {
                let speed = el.getAttribute('data-speed');
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }

    inicializarDados();
});
