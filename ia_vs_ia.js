// Jogo da Velha IA vs IA com animação e salvamento
// Requer tic_tac_toe.js já carregado

const boardDiv = document.getElementById('gameBoard');
const statusDiv = document.getElementById('status');
const btnIniciar = document.getElementById('btnIniciar');

function criarTabuleiroVisual(tabuleiro) {
    boardDiv.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.disabled = true;
        if (tabuleiro[i]) {
            cell.textContent = tabuleiro[i];
            cell.classList.add(tabuleiro[i].toLowerCase());
        } else {
            cell.textContent = '';
        }
        boardDiv.appendChild(cell);
    }
}

btnIniciar.onclick = async function() {
    btnIniciar.disabled = true;
    statusDiv.textContent = 'Simulando duelo IA x IA...';
    let simulacao = JogoDaVelhaIA.simularPartidaIAvsIA();
    let tabuleiro = JogoDaVelhaIA.novoJogo();
    criarTabuleiroVisual(tabuleiro);
    let i = 0;
    async function animarJogadas() {
        if (i >= simulacao.acoes.length) {
            tabuleiro = simulacao.tabuleiroFinal;
            criarTabuleiroVisual(tabuleiro);
            let mensagem;
            if (simulacao.resultado === 'X') mensagem = '🤖 IA (X) venceu!';
            else if (simulacao.resultado === 'O') mensagem = '🤖 IA (O) venceu!';
            else mensagem = '🤝 Empate entre as IAs!';
            statusDiv.textContent = mensagem;
            // Salvar histórico
            const dadosPartida = {
                tipo: 'IAxIA',
                tabuleiroFinal: Array.isArray(simulacao.tabuleiroFinal) ? simulacao.tabuleiroFinal : [],
                resultado: simulacao.resultado,
                data: new Date().toISOString(),
                acoes: simulacao.acoes
            };
            try {
                await fetch('/salvar-partida', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosPartida)
                });
            } catch (e) {
                console.error('Erro ao salvar partida no histórico:', e);
            }
            btnIniciar.disabled = false;
            return;
        }
        const acao = simulacao.acoes[i];
        statusDiv.textContent = `IA (${acao.jogador}) está pensando...`;
        setTimeout(() => {
            tabuleiro = JogoDaVelhaIA.fazerJogada([...tabuleiro], acao.posicao, acao.jogador);
            criarTabuleiroVisual(tabuleiro);
            statusDiv.textContent = `IA (${acao.jogador}) jogou na posição ${acao.posicao + 1}`;
            i++;
            setTimeout(animarJogadas, 10000);
        }, 10000);
    }
    animarJogadas();
};

// Inicializa tabuleiro vazio ao abrir
criarTabuleiroVisual(JogoDaVelhaIA.novoJogo());
