// Carrega e exibe o histórico de jogos
fetch('historico_jogos.json')
  .then(res => res.json())
  .then(jogos => {
    const lista = document.getElementById('games-list');
    if (!jogos.length) {
      lista.innerHTML = '<p>Nenhum jogo encontrado.</p>';
      return;
    }
    jogos.reverse().forEach(jogo => {
      lista.appendChild(criarCardJogo(jogo));
    });
  });

function criarCardJogo(jogo) {
  const card = document.createElement('div');
  card.className = 'game-card';

  // Header
  const header = document.createElement('div');
  header.className = 'game-header';
  header.innerHTML = `
    <span class="game-type">${jogo.tipo}</span>
    <span>Início: <b>${jogo.primeiroJogador || '?'}</b></span>
    <span class="game-date">${formatarData(jogo.data)}</span>
  `;
  card.appendChild(header);

  // Resultado
  const result = document.createElement('div');
  result.className = 'game-result';
  result.textContent = `Resultado: ${jogo.resultado}`;
  card.appendChild(result);

  // Tabuleiro final
  if (jogo.tabuleiroFinal) {
    card.appendChild(criarTabuleiro(jogo.tabuleiroFinal));
  }

  // Lista de ações
  if (jogo.acoes) {
    const acaoDiv = document.createElement('div');
    acaoDiv.className = 'acao-lista';
    acaoDiv.innerHTML = '<b>Jogadas:</b> ' + jogo.acoes.map((a, i) =>
      `<span>${i+1}. ${a.jogador} → ${posicaoParaTexto(a.posicao)}</span>`
    ).join('');
    card.appendChild(acaoDiv);
  }

  return card;
}

function criarTabuleiro(tab) {
  const grid = document.createElement('div');
  grid.className = 'tabuleiro';
  for (let i = 0; i < 9; i++) {
    const casa = document.createElement('div');
    let valor = tab[i];
    casa.className = 'casa';
    if (!valor) {
      casa.classList.add('vazia');
      valor = '-';
    }
    if (valor === 'O') casa.classList.add('O');
    casa.textContent = valor;
    grid.appendChild(casa);
  }
  return grid;
}

function posicaoParaTexto(pos) {
  const mapa = [
    'Canto superior esquerdo', 'Topo', 'Canto superior direito',
    'Esquerda', 'Centro', 'Direita',
    'Canto inferior esquerdo', 'Base', 'Canto inferior direito'
  ];
  return mapa[pos] || pos;
}

function formatarData(data) {
  if (!data) return '';
  const d = new Date(data);
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
