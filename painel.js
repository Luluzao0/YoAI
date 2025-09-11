// Carrega e exibe o histórico de jogos do arquivo JSON
document.addEventListener('DOMContentLoaded', function() {
    carregarHistoricoJogos();
});

async function carregarHistoricoJogos() {
    try {
        const response = await fetch('historico_jogos.json');
        const jogos = await response.json();
        
        const lista = document.getElementById('games-list');
        
        if (!jogos || jogos.length === 0) {
            lista.innerHTML = `
                <div class="no-games">
                    <h3>📝 Nenhuma partida encontrada</h3>
                    <p>Execute o script <code>node tic_tac_toe.js</code> para começar a jogar!</p>
                </div>
            `;
            return;
        }
        
        // Mostra estatísticas gerais
        exibirEstatisticas(jogos);
        
        // Ordena jogos do mais recente para o mais antigo
        const jogosOrdenados = jogos.slice().reverse();
        
        // Cria cards para cada jogo
        jogosOrdenados.forEach(jogo => {
            const card = criarCardJogo(jogo);
            lista.appendChild(card);
        });
        
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        document.getElementById('games-list').innerHTML = `
            <div class="error">
                <h3>❌ Erro ao carregar histórico</h3>
                <p>Verifique se o arquivo <code>historico_jogos.json</code> existe na pasta do projeto.</p>
                <p><strong>Erro:</strong> ${error.message}</p>
            </div>
        `;
    }
}

function exibirEstatisticas(jogos) {
    const stats = {
        total: jogos.length,
        iaVsIa: jogos.filter(j => j.tipo === 'IAxIA').length,
        iaVsHumano: jogos.filter(j => j.tipo === 'IAxHumano').length,
        vitoriasX: jogos.filter(j => j.resultado === 'X').length,
        vitoriasO: jogos.filter(j => j.resultado === 'O').length,
        empates: jogos.filter(j => j.resultado === 'Empate').length
    };
    
    const statsDiv = document.createElement('div');
    statsDiv.className = 'statistics';
    statsDiv.innerHTML = `
        <h2>📊 Estatísticas Gerais</h2>
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-number">${stats.total}</span>
                <span class="stat-label">Total de Partidas</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.iaVsIa}</span>
                <span class="stat-label">IA vs IA</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.iaVsHumano}</span>
                <span class="stat-label">IA vs Humano</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.vitoriasX}</span>
                <span class="stat-label">Vitórias X</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.vitoriasO}</span>
                <span class="stat-label">Vitórias O</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.empates}</span>
                <span class="stat-label">Empates</span>
            </div>
        </div>
    `;
    
    const lista = document.getElementById('games-list');
    lista.appendChild(statsDiv);
}

function criarCardJogo(jogo) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // Header do card com informações básicas
    const header = document.createElement('div');
    header.className = 'game-header';
    header.innerHTML = `
        <div class="game-info">
            <span class="game-type">${jogo.tipo || 'N/A'}</span>
            <span class="game-starter">Primeiro: <strong>${jogo.primeiroJogador || 'N/A'}</strong></span>
            ${jogo.id ? `<span class="game-id">ID: ${jogo.id}</span>` : ''}
        </div>
        <span class="game-date">${formatarData(jogo.data)}</span>
    `;
    card.appendChild(header);
    
    // Resultado da partida
    const result = document.createElement('div');
    result.className = `game-result result-${jogo.resultado?.toLowerCase() || 'unknown'}`;
    const iconeResultado = obterIconeResultado(jogo.resultado);
    result.innerHTML = `${iconeResultado} <strong>Resultado: ${jogo.resultado || 'N/A'}</strong>`;
    card.appendChild(result);
    
    // Container principal com tabuleiro e ações
    const content = document.createElement('div');
    content.className = 'game-content';
    
    // Tabuleiro final (se existir)
    if (jogo.tabuleiroFinal) {
        const tabuleiroContainer = document.createElement('div');
        tabuleiroContainer.className = 'tabuleiro-container';
        tabuleiroContainer.innerHTML = '<h4>🎲 Tabuleiro Final:</h4>';
        tabuleiroContainer.appendChild(criarTabuleiro(jogo.tabuleiroFinal));
        content.appendChild(tabuleiroContainer);
    }
    
    // Lista de ações (se existir)
    if (jogo.acoes && jogo.acoes.length > 0) {
        const acoesContainer = document.createElement('div');
        acoesContainer.className = 'acoes-container';
        acoesContainer.innerHTML = `
            <h4>📝 Sequência de Jogadas:</h4>
            <div class="acoes-lista">
                ${jogo.acoes.map((acao, index) => 
                    `<span class="acao-item">
                        <strong>${index + 1}.</strong> 
                        <span class="jogador ${acao.jogador?.toLowerCase() || ''}">${acao.jogador || '?'}</span> 
                        → ${posicaoParaTexto(acao.posicao)}
                    </span>`
                ).join('')}
            </div>
        `;
        content.appendChild(acoesContainer);
    }
    
    card.appendChild(content);
    return card;
}

function criarTabuleiro(tabuleiro) {
    const grid = document.createElement('div');
    grid.className = 'tabuleiro';
    
    for (let i = 0; i < 9; i++) {
        const casa = document.createElement('div');
        casa.className = 'casa';
        
        const valor = tabuleiro[i];
        if (valor === 'X') {
            casa.classList.add('x');
            casa.textContent = 'X';
        } else if (valor === 'O') {
            casa.classList.add('o');
            casa.textContent = 'O';
        } else {
            casa.classList.add('vazia');
            casa.textContent = '·';
        }
        
        // Adiciona tooltip com a posição
        casa.title = `Posição ${i}`;
        
        grid.appendChild(casa);
    }
    
    return grid;
}

function posicaoParaTexto(posicao) {
    const mapeamento = {
        0: 'Canto superior esquerdo (0)',
        1: 'Topo centro (1)',
        2: 'Canto superior direito (2)',
        3: 'Centro esquerda (3)',
        4: 'Centro (4)',
        5: 'Centro direita (5)',
        6: 'Canto inferior esquerdo (6)',
        7: 'Base centro (7)',
        8: 'Canto inferior direito (8)'
    };
    
    return mapeamento[posicao] || `Posição ${posicao}`;
}

function formatarData(dataString) {
    if (!dataString) return 'Data não disponível';
    
    try {
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return 'Data inválida';
    }
}

function obterIconeResultado(resultado) {
    switch (resultado) {
        case 'X':
            return '❌';
        case 'O':
            return '⭕';
        case 'Empate':
            return '🤝';
        default:
            return '❓';
    }
}

// Adiciona listener para recarregar a página quando necessário
document.addEventListener('keydown', function(event) {
    if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        location.reload();
    }
});
