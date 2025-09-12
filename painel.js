// Carrega e exibe o histórico de partidas
document.addEventListener('DOMContentLoaded', function() {
    carregarHistorico();
});

async function carregarHistorico() {
    try {
        console.log('Carregando histórico do servidor...');
        const response = await fetch('/historico');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const partidas = await response.json();
        console.log('Partidas recebidas:', partidas);
        
        const gamesList = document.getElementById('games-list');
        const emptyState = document.getElementById('empty-state');
        
        if (!partidas || partidas.length === 0) {
            console.log('Nenhuma partida encontrada');
            gamesList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        console.log(`Exibindo ${partidas.length} partidas`);
        emptyState.style.display = 'none';
        gamesList.style.display = 'grid';
        
        exibirEstatisticas(partidas);
        exibirPartidas(partidas);
        
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        document.getElementById('games-list').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <h3 style="color: #374151; margin-bottom: 0.5rem;">Erro ao carregar histórico</h3>
                <p>Verifique se o servidor está rodando.</p>
                <p><small>Erro: ${error.message}</small></p>
            </div>
        `;
    }
}

function exibirEstatisticas(partidas) {
    const stats = {
        total: partidas.length,
        autoPlay: partidas.filter(p => p.tipo === 'IAxIA').length,
        vsJogador: partidas.filter(p => p.tipo === 'IAxHumano').length,
        vitoriasX: partidas.filter(p => p.resultado === 'X').length,
        vitoriasO: partidas.filter(p => p.resultado === 'O').length,
        empates: partidas.filter(p => p.resultado === 'Empate' || p.resultado === 'empate').length
    };
    
    console.log('Estatísticas calculadas:', stats);
    
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">Total</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.autoPlay}</div>
            <div class="stat-label">Auto Play</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.vsJogador}</div>
            <div class="stat-label">Vs Jogador</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.vitoriasX}</div>
            <div class="stat-label">Vitórias X</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.vitoriasO}</div>
            <div class="stat-label">Vitórias O</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.empates}</div>
            <div class="stat-label">Empates</div>
        </div>
    `;
}

function exibirPartidas(partidas) {
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = ''; // Limpa conteúdo anterior
    
    // Ordena partidas da mais recente para mais antiga
    const partidasOrdenadas = partidas.slice().reverse();
    console.log('Exibindo partidas ordenadas:', partidasOrdenadas.length);
    
    partidasOrdenadas.forEach((partida, index) => {
        console.log(`Criando card para partida ${index + 1}:`, partida);
        const card = criarCardPartida(partida);
        gamesList.appendChild(card);
    });
}

function criarCardPartida(partida) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const gameHeader = document.createElement('div');
    gameHeader.className = 'game-header';
    
    const gameType = document.createElement('span');
    gameType.className = partida.tipo === 'IAxIA' ? 'game-type auto' : 'game-type vs-player';
    gameType.textContent = partida.tipo === 'IAxIA' ? 'Auto Play' : 'Vs Jogador';
    
    const gameDate = document.createElement('span');
    gameDate.className = 'game-date';
    gameDate.textContent = formatarData(partida.data);
    
    gameHeader.appendChild(gameType);
    gameHeader.appendChild(gameDate);
    card.appendChild(gameHeader);
    
    // Tabuleiro
    if (partida.tabuleiroFinal && Array.isArray(partida.tabuleiroFinal)) {
        const gameBoard = document.createElement('div');
        gameBoard.className = 'game-board';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            
            const valor = partida.tabuleiroFinal[i];
            if (valor === 'X') {
                cell.classList.add('x');
                cell.textContent = 'X';
            } else if (valor === 'O') {
                cell.classList.add('o');
                cell.textContent = 'O';
            }
            
            gameBoard.appendChild(cell);
        }
        
        card.appendChild(gameBoard);
    }
    
    // Resultado
    const gameResult = document.createElement('div');
    gameResult.className = 'game-result';
    
    if (partida.resultado === 'X') {
        gameResult.classList.add('result-win-x');
        gameResult.textContent = 'Jogador X venceu';
    } else if (partida.resultado === 'O') {
        gameResult.classList.add('result-win-o');
        gameResult.textContent = 'Jogador O venceu';
    } else if (partida.resultado === 'Empate') {
        gameResult.classList.add('result-tie');
        gameResult.textContent = 'Empate';
    } else {
        gameResult.classList.add('result-tie');
        gameResult.textContent = 'Resultado indefinido';
    }
    
    card.appendChild(gameResult);
    
    // Botão para visualizar árvore binária
    const btnArvore = document.createElement('button');
    btnArvore.textContent = 'Ver Árvore';
    btnArvore.style = 'margin-top:1rem; background:#1d4ed8; color:white; border:none; border-radius:6px; padding:0.5rem 1rem; font-weight:600; cursor:pointer;';
    btnArvore.onclick = () => mostrarArvoreBinaria(partida);
    card.appendChild(btnArvore);

    return card;
}

// Função para abrir o modal e renderizar a árvore binária
function mostrarArvoreBinaria(partida) {
    const modal = document.getElementById('modal-arvore');
    const container = document.getElementById('arvore-binaria-container');
    container.innerHTML = '<div style="color:#6b7280;">Gerando árvore...</div>';
    modal.style.display = 'flex';
    setTimeout(() => {
        try {
            renderizarArvoreBinaria(partida, container);
        } catch (e) {
            container.innerHTML = '<div style="color:#dc2626;">Erro ao gerar árvore: ' + e.message + '</div>';
        }
    }, 100);
}

// Função para fechar o modal
function fecharModalArvore() {
    document.getElementById('modal-arvore').style.display = 'none';
}


// Renderiza a árvore binária de busca (Minimax) em SVG
function renderizarArvoreBinaria(partida, container) {
    if (!window.JogoDaVelhaIA || !window.JogoDaVelhaIA.No || !window.JogoDaVelhaIA.minimax) {
        container.innerHTML = '<div style="color:#dc2626;">Funções de IA não carregadas.</div>';
        return;
    }
    // Reconstrói o estado inicial da partida
    let tabuleiroInicial = Array.isArray(partida.acoes) && partida.acoes.length > 0 ? Array(9).fill(null) : (partida.tabuleiroFinal || Array(9).fill(null));
    let jogadorInicial = 'X';
    if (Array.isArray(partida.acoes) && partida.acoes.length > 0) {
        for (let i = 0; i < partida.acoes.length; i++) {
            if (i === 0) break;
            const acao = partida.acoes[i-1];
            tabuleiroInicial[acao.posicao] = acao.jogador;
            jogadorInicial = acao.jogador === 'X' ? 'O' : 'X';
        }
    }
    // Cria nó raiz
    const raiz = new window.JogoDaVelhaIA.No(tabuleiroInicial, jogadorInicial);
    // Gera árvore até profundidade 3 para visualização (evita travar navegador)
    const treeData = buildTreeData(raiz, 0, 3);
    container.innerHTML = '';
    container.appendChild(renderTreeSVG(treeData));
}

// Constrói dados da árvore para renderização SVG
function buildTreeData(no, profundidade, maxProfundidade) {
    const tab = no.tabuleiro.map(v => v || '-').join('');
    const label = `${tab} (${no.jogadorAtual})`;
    if (profundidade >= maxProfundidade) {
        return { label, children: [] };
    }
    const jogadas = window.JogoDaVelhaIA.jogadasValidas(no.tabuleiro);
    const children = jogadas.map(jogada => {
        const novoTab = [...no.tabuleiro];
        novoTab[jogada] = no.jogadorAtual;
        const proxJogador = no.jogadorAtual === 'X' ? 'O' : 'X';
        const filho = new window.JogoDaVelhaIA.No(novoTab, proxJogador, jogada);
        return buildTreeData(filho, profundidade + 1, maxProfundidade);
    });
    return { label, children };
}

// Renderiza a árvore em SVG (layout simples, hierárquico)
function renderTreeSVG(treeData) {
    // Parâmetros de layout
    const nodeRadius = 28;
    const nodeGapY = 90;
    const nodeGapX = 60;
    // Calcula posições dos nós
    let maxX = 0, maxY = 0;
    function layout(node, depth, x) {
        node.depth = depth;
        node.x = x;
        node.y = depth * nodeGapY + nodeRadius + 10;
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, node.y);
        if (!node.children || node.children.length === 0) return 1;
        let width = 0;
        node.children.forEach(child => {
            width += layout(child, depth + 1, x + width * nodeGapX);
        });
        // Centraliza o nó pai em relação aos filhos
        if (node.children.length > 0) {
            const first = node.children[0];
            const last = node.children[node.children.length - 1];
            node.x = (first.x + last.x) / 2;
        }
        return width || 1;
    }
    layout(treeData, 0, 0);
    // Coleta todos os nós para desenhar
    const nodes = [];
    function collect(node) {
        nodes.push(node);
        if (node.children) node.children.forEach(collect);
    }
    collect(treeData);
    // SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', Math.max(600, (maxX + 2) * nodeGapX));
    svg.setAttribute('height', maxY + nodeRadius * 2);
    svg.style.display = 'block';
    svg.style.margin = '0 auto';
    // Desenha linhas
    nodes.forEach(node => {
        if (node.children) {
            node.children.forEach(child => {
                const line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', node.x + nodeRadius);
                line.setAttribute('y1', node.y);
                line.setAttribute('x2', child.x + nodeRadius);
                line.setAttribute('y2', child.y);
                line.setAttribute('stroke', '#888');
                line.setAttribute('stroke-width', '2');
                svg.appendChild(line);
            });
        }
    });
    // Desenha nós
    nodes.forEach(node => {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', node.x + nodeRadius);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', nodeRadius);
        circle.setAttribute('fill', '#fff');
        circle.setAttribute('stroke', '#222');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);
        // Texto
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', node.x + nodeRadius);
        text.setAttribute('y', node.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-family', 'monospace');
        text.setAttribute('fill', '#222');
        text.textContent = node.label.length > 13 ? node.label.slice(0, 13) + '…' : node.label;
        svg.appendChild(text);
    });
    return svg;
}

// Função recursiva para gerar árvore DOM até profundidade máxima
function gerarArvoreVisual(no, profundidade, maxProfundidade) {
    const div = document.createElement('div');
    div.style.marginLeft = profundidade === 0 ? '0' : '2rem';
    div.style.marginTop = '0.5rem';
    div.style.borderLeft = profundidade > 0 ? '2px solid #d1d5db' : 'none';
    div.style.paddingLeft = profundidade > 0 ? '1rem' : '0';
    // Mostra tabuleiro e jogador
    const tab = no.tabuleiro.map(v => v || '-').join('');
    const info = document.createElement('div');
    info.innerHTML = `<span style="font-family:monospace;">[${tab}]</span> <span style="color:#2563eb; font-weight:600;">(${no.jogadorAtual})</span>`;
    div.appendChild(info);
    if (profundidade >= maxProfundidade) {
        const limit = document.createElement('div');
        limit.style.color = '#6b7280';
        limit.textContent = '...';
        div.appendChild(limit);
        return div;
    }
    // Gera filhos
    const jogadas = window.JogoDaVelhaIA.jogadasValidas(no.tabuleiro);
    for (const jogada of jogadas) {
        const novoTab = [...no.tabuleiro];
        novoTab[jogada] = no.jogadorAtual;
        const proxJogador = no.jogadorAtual === 'X' ? 'O' : 'X';
        const filho = new window.JogoDaVelhaIA.No(novoTab, proxJogador, jogada);
        div.appendChild(gerarArvoreVisual(filho, profundidade + 1, maxProfundidade));
    }
    return div;
}

function formatarData(dataString) {
    if (!dataString) return 'Data não disponível';
    
    try {
        const data = new Date(dataString);
        const agora = new Date();
        const diferenca = agora - data;
        const minutos = Math.floor(diferenca / 60000);
        const horas = Math.floor(diferenca / 3600000);
        const dias = Math.floor(diferenca / 86400000);
        
        if (minutos < 1) return 'Agora mesmo';
        if (minutos < 60) return `${minutos}m atrás`;
        if (horas < 24) return `${horas}h atrás`;
        if (dias < 7) return `${dias}d atrás`;
        
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return 'Data inválida';
    }
}
