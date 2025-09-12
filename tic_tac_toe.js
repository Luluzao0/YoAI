// Jogo da Velha com Árvore de Busca - Algoritmo Minimax com Poda Alfa-Beta
// Projeto para disciplina de Inteligência Artificial
// Biblioteca de funções para lógica do jogo

// Classe que representa cada nó da árvore de busca
class No {
    constructor(tabuleiro, jogadorAtual, jogadaAnterior = null) {
        this.tabuleiro = [...tabuleiro]; // Estado atual do tabuleiro (cópia)
        this.jogadorAtual = jogadorAtual; // Jogador que deve jogar neste estado
        this.jogadaAnterior = jogadaAnterior; // Jogada que levou a este estado
        this.filhos = []; // Estados filhos possíveis
    }
}

// Função para verificar se há um vencedor no tabuleiro
function vencedor(tabuleiro) {
    if (!Array.isArray(tabuleiro) || tabuleiro.length !== 9) return null;
    const combinacoesVitoria = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];
    for (const [a, b, c] of combinacoesVitoria) {
        if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            return tabuleiro[a]; // Retorna 'X' ou 'O'
        }
    }
    return null; // Nenhum vencedor
}

// Função para verificar se o jogo acabou (vitória ou empate)
function acabou(tabuleiro) {
    if (!Array.isArray(tabuleiro)) {
        // Tenta converter para array se for string ou objeto
        if (typeof tabuleiro === 'string') {
            try {
                tabuleiro = JSON.parse(tabuleiro);
            } catch {
                return false;
            }
        } else if (typeof tabuleiro === 'object' && tabuleiro !== null) {
            tabuleiro = Object.values(tabuleiro);
        } else {
            return false;
        }
    }
    return vencedor(tabuleiro) !== null || tabuleiro.every(casa => casa !== null);
}

// Função para determinar o resultado final do jogo
function resultadoFinal(tabuleiro) {
    if (!Array.isArray(tabuleiro) || tabuleiro.length !== 9) return null;
    const ganhador = vencedor(tabuleiro);
    if (ganhador) return ganhador;
    if (tabuleiro.every(casa => casa !== null)) return 'Empate';
    return null; // Jogo ainda não terminou
}

// Função para obter todas as jogadas válidas (posições livres)
function jogadasValidas(tabuleiro) {
    if (!Array.isArray(tabuleiro) || tabuleiro.length !== 9) return [];
    const jogadas = [];
    for (let i = 0; i < 9; i++) {
        if (tabuleiro[i] === null) {
            jogadas.push(i);
        }
    }
    return jogadas;
}

// Algoritmo Minimax com Poda Alfa-Beta
function minimax(no, maximizando, alpha = -Infinity, beta = Infinity, profundidade = 0) {
    const resultado = resultadoFinal(no.tabuleiro);
    
    // Casos base: jogo terminou
    if (resultado === 'X') return { score: 10 - profundidade, jogada: null }; // X vence (IA)
    if (resultado === 'O') return { score: profundidade - 10, jogada: null }; // O vence (adversário)
    if (resultado === 'Empate') return { score: 0, jogada: null }; // Empate
    
    const jogadas = jogadasValidas(no.tabuleiro);
    let melhorJogada = jogadas[0];
    
    if (maximizando) {
        let maxScore = -Infinity;
        
        for (const jogada of jogadas) {
            // Cria um novo estado do tabuleiro
            const novoTabuleiro = [...no.tabuleiro];
            novoTabuleiro[jogada] = no.jogadorAtual;
            
            // Cria nó filho
            const proximoJogador = no.jogadorAtual === 'X' ? 'O' : 'X';
            const filho = new No(novoTabuleiro, proximoJogador, jogada);
            
            // Chamada recursiva
            const { score } = minimax(filho, false, alpha, beta, profundidade + 1);
            
            if (score > maxScore) {
                maxScore = score;
                melhorJogada = jogada;
            }
            
            // Poda Alfa-Beta
            alpha = Math.max(alpha, score);
            if (beta <= alpha) {
                break; // Poda beta
            }
        }
        
        return { score: maxScore, jogada: melhorJogada };
    } else {
        let minScore = Infinity;
        
        for (const jogada of jogadas) {
            // Cria um novo estado do tabuleiro
            const novoTabuleiro = [...no.tabuleiro];
            novoTabuleiro[jogada] = no.jogadorAtual;
            
            // Cria nó filho
            const proximoJogador = no.jogadorAtual === 'X' ? 'O' : 'X';
            const filho = new No(novoTabuleiro, proximoJogador, jogada);
            
            // Chamada recursiva
            const { score } = minimax(filho, true, alpha, beta, profundidade + 1);
            
            if (score < minScore) {
                minScore = score;
                melhorJogada = jogada;
            }
            
            // Poda Alfa-Beta
            beta = Math.min(beta, score);
            if (beta <= alpha) {
                break; // Poda alfa
            }
        }
        
        return { score: minScore, jogada: melhorJogada };
    }
}

// Função para a IA fazer uma jogada ótima
function jogadaIA(tabuleiro, simboloIA = 'O') {
    if (acabou(tabuleiro)) {
        return null; // Jogo já terminou
    }
    
    const no = new No(tabuleiro, simboloIA);
    const maximizando = simboloIA === 'X';
    const { jogada, score } = minimax(no, maximizando);
    
    return { posicao: jogada, score: score };
}

// Função para criar um novo jogo
function novoJogo() {
    return Array(9).fill(null);
}

// Função para fazer uma jogada no tabuleiro
function fazerJogada(tabuleiro, posicao, jogador) {
    if (!Array.isArray(tabuleiro) || tabuleiro.length !== 9) return null;
    if (tabuleiro[posicao] !== null || posicao < 0 || posicao > 8) {
        return null; // Jogada inválida
    }
    const novoTabuleiro = [...tabuleiro];
    novoTabuleiro[posicao] = jogador;
    return novoTabuleiro;
}

// Função para simular uma partida completa IA vs IA
function simularPartidaIAvsIA() {
    let tabuleiro = novoJogo();
    let jogadorAtual = 'X';
    const acoes = [];
    while (Array.isArray(tabuleiro) && !acabou(tabuleiro)) {
        const jogada = jogadaIA(tabuleiro, jogadorAtual);
        if (!jogada || typeof jogada.posicao !== 'number') break;
        tabuleiro = fazerJogada(tabuleiro, jogada.posicao, jogadorAtual);
        acoes.push({ jogador: jogadorAtual, posicao: jogada.posicao });
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
    }
    return {
        tabuleiroFinal: Array.isArray(tabuleiro) ? tabuleiro : [],
        resultado: resultadoFinal(tabuleiro),
        acoes: acoes
    };
}

// Exporta as funções para uso em Node.js ou navegador
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = {
        No,
        vencedor,
        acabou,
        resultadoFinal,
        jogadasValidas,
        minimax,
        jogadaIA,
        novoJogo,
        fazerJogada,
        simularPartidaIAvsIA
    };
} else if (typeof window !== 'undefined') {
    // Navegador - disponibiliza funções globalmente
    window.JogoDaVelhaIA = {
        No,
        vencedor,
        acabou,
        resultadoFinal,
        jogadasValidas,
        minimax,
        jogadaIA,
        novoJogo,
        fazerJogada,
        simularPartidaIAvsIA
    };
}
