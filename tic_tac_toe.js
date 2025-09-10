// Jogo da Velha (Tic-Tac-Toe) com Árvore de Busca
// Versão inicial: IA x IA e IA x Humano no terminal

// Representação do tabuleiro: array de 9 posições
// 'X', 'O' ou null

class NoJogo {
    constructor(tabuleiro, jogadorAtual) {
        this.tabuleiro = tabuleiro.slice(); // Estado do tabuleiro
        this.jogadorAtual = jogadorAtual;   // 'X' ou 'O'
        this.filhos = [];                   // Próximos estados possíveis
        this.pai = null;                    // Nó pai (opcional)
        this.jogada = null;                 // Jogada que levou a este nó
    }
}

// Função para verificar se o jogo terminou
function verificaFim(tabuleiro) {
    const linhas = [
        [0,1,2], [3,4,5], [6,7,8], // Linhas
        [0,3,6], [1,4,7], [2,5,8], // Colunas
        [0,4,8], [2,4,6]           // Diagonais
    ];
    for (const [a,b,c] of linhas) {
        if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            return tabuleiro[a]; // 'X' ou 'O' venceu
        }
    }
    if (tabuleiro.every(casa => casa)) return 'Empate';
    return null; // Jogo não terminou
}

// Gera todos os próximos estados possíveis para o jogador atual
function geraFilhos(no) {
    if (verificaFim(no.tabuleiro)) return; // Não gera filhos se o jogo acabou
    for (let i = 0; i < 9; i++) {
        if (!no.tabuleiro[i]) {
            const novoTabuleiro = no.tabuleiro.slice();
            novoTabuleiro[i] = no.jogadorAtual;
            const proximoJogador = no.jogadorAtual === 'X' ? 'O' : 'X';
            const filho = new NoJogo(novoTabuleiro, proximoJogador);
            filho.pai = no;
            filho.jogada = i;
            no.filhos.push(filho);
        }
    }
}

// Função para imprimir o tabuleiro no terminal
function imprimeTabuleiro(tabuleiro) {
    let str = '';
    for (let i = 0; i < 9; i++) {
        str += tabuleiro[i] ? tabuleiro[i] : '-';
        if ((i+1)%3 === 0) str += '\n';
        else str += ' ';
    }
    console.log(str);
}

// Função para a IA escolher a melhor jogada (Minimax simplificado)
function minimax(no, maximizando) {
    const resultado = verificaFim(no.tabuleiro);
    if (resultado === 'X') return { score: 1 };
    if (resultado === 'O') return { score: -1 };
    if (resultado === 'Empate') return { score: 0 };
    geraFilhos(no);
    let melhorScore = maximizando ? -Infinity : Infinity;
    let melhorJogada = null;
    for (const filho of no.filhos) {
        const { score } = minimax(filho, !maximizando);
        if (maximizando) {
            if (score > melhorScore) {
                melhorScore = score;
                melhorJogada = filho.jogada;
            }
        } else {
            if (score < melhorScore) {
                melhorScore = score;
                melhorJogada = filho.jogada;
            }
        }
    }
    return { score: melhorScore, jogada: melhorJogada };
}

const fs = require('fs');
const path = require('path');
const HISTORICO_PATH = path.join(__dirname, 'historico_jogos.json');

function salvarHistorico(jogo) {
    let historico = [];
    try {
        historico = JSON.parse(fs.readFileSync(HISTORICO_PATH, 'utf8'));
    } catch (e) {}
    historico.push(jogo);
    fs.writeFileSync(HISTORICO_PATH, JSON.stringify(historico, null, 2));
}

function jogarIAvsIA() {
    let tabuleiro = Array(9).fill(null);
    let jogador = 'X';
    let acoes = [];
    const primeiroJogador = jogador;
    while (!verificaFim(tabuleiro)) {
        imprimeTabuleiro(tabuleiro);
        const raiz = new NoJogo(tabuleiro, jogador);
        const { jogada } = minimax(raiz, jogador === 'X');
        acoes.push({ jogador, posicao: jogada });
        tabuleiro[jogada] = jogador;
        jogador = jogador === 'X' ? 'O' : 'X';
    }
    imprimeTabuleiro(tabuleiro);
    const resultado = verificaFim(tabuleiro);
    console.log('Resultado:', resultado);
    salvarHistorico({
        tipo: 'IAxIA',
        primeiroJogador,
        acoes,
        tabuleiroFinal: tabuleiro.slice(),
        resultado,
        data: new Date().toISOString()
    });
}

// Função para ler uma linha do terminal (promessa)
function lerLinha(pergunta) {
    return new Promise(resolve => {
        process.stdout.write(pergunta);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.once('data', data => {
            process.stdin.pause();
            resolve(data.trim());
        });
    });
}

// Função para jogar IA x Humano (agora assíncrona)
async function jogarIAxHumano() {
    let tabuleiro = Array(9).fill(null);
    let jogador = 'X';
    let acoes = [];
    let resp = await lerLinha('Você quer ser X ou O? ');
    const humano = resp.toUpperCase() === 'X' ? 'X' : 'O';
    const primeiroJogador = jogador;
    while (!verificaFim(tabuleiro)) {
        imprimeTabuleiro(tabuleiro);
        if (jogador === humano) {
            let pos = await lerLinha('Sua jogada (0-8): ');
            pos = parseInt(pos);
            while (isNaN(pos) || pos < 0 || pos > 8 || tabuleiro[pos]) {
                pos = await lerLinha('Posição inválida ou ocupada! Escolha outra (0-8): ');
                pos = parseInt(pos);
            }
            acoes.push({ jogador, posicao: pos });
            tabuleiro[pos] = jogador;
        } else {
            const raiz = new NoJogo(tabuleiro, jogador);
            const { jogada } = minimax(raiz, jogador === 'X');
            acoes.push({ jogador, posicao: jogada });
            tabuleiro[jogada] = jogador;
            console.log(`IA jogou na posição ${jogada}`);
        }
        jogador = jogador === 'X' ? 'O' : 'X';
    }
    imprimeTabuleiro(tabuleiro);
    const resultado = verificaFim(tabuleiro);
    console.log('Resultado:', resultado);
    salvarHistorico({
        tipo: 'IAxHumano',
        primeiroJogador,
        acoes,
        tabuleiroFinal: tabuleiro.slice(),
        resultado,
        data: new Date().toISOString()
    });
}

// Menu simples no terminal (agora assíncrono)
async function menu() {
    console.log('Jogo da Velha com Árvore de Busca');
    console.log('1. IA x IA');
    console.log('2. IA x Humano');
    let opcao = await lerLinha('Escolha uma opção: ');
    opcao = parseInt(opcao);
    if (opcao === 1) jogarIAvsIA();
    else if (opcao === 2) await jogarIAxHumano();
    else console.log('Opção inválida!');
}

menu();
