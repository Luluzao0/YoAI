
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTA = 3000;
const CAMINHO_HISTORICO = path.join(__dirname, 'historico_jogos.json');

function validarPartida(partida) {
  // Valida se a partida tem os campos obrigatórios
  if (!partida.tipo || !partida.data) {
    return { valida: false, erro: 'Campos obrigatórios faltando (tipo, data)' };
  }
  
  // Valida tipo da partida
  if (!['IAxIA', 'IAxHumano'].includes(partida.tipo)) {
    return { valida: false, erro: 'Tipo de partida inválido' };
  }
  
  // Valida resultado
  if (partida.resultado && !['X', 'O', 'Empate', null].includes(partida.resultado)) {
    return { valida: false, erro: 'Resultado inválido' };
  }
  
  // Valida tabuleiro final (se fornecido)
  if (partida.tabuleiroFinal && (!Array.isArray(partida.tabuleiroFinal) || partida.tabuleiroFinal.length !== 9)) {
    return { valida: false, erro: 'Tabuleiro final deve ser um array de 9 elementos' };
  }
  
  return { valida: true };
}

function inicializarArquivoHistorico() {
  // Cria o arquivo de histórico se não existir
  if (!fs.existsSync(CAMINHO_HISTORICO)) {
    try {
      fs.writeFileSync(CAMINHO_HISTORICO, '[]', 'utf8');
      console.log('Arquivo de histórico criado:', CAMINHO_HISTORICO);
    } catch (erro) {
      console.error('Erro ao criar arquivo de histórico:', erro);
    }
  }
}

function enviarJSON(resposta, dados, status = 200) {
  resposta.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  resposta.end(JSON.stringify(dados));
}

function enviarArquivo(resposta, caminhoArquivo, tipoConteudo) {
  fs.readFile(caminhoArquivo, (erro, dados) => {
    if (erro) {
      resposta.writeHead(404);
      resposta.end('Arquivo não encontrado');
    } else {
      resposta.writeHead(200, { 'Content-Type': tipoConteudo, 'Access-Control-Allow-Origin': '*' });
      resposta.end(dados);
    }
  });
}

const servidor = http.createServer((requisicao, resposta) => {
  if (requisicao.method === 'GET' && requisicao.url === '/historico') {
    // Retorna o histórico de partidas com tratamento de erro
    fs.readFile(CAMINHO_HISTORICO, (erro, dados) => {
      if (erro) {
        console.log('Arquivo de histórico não encontrado, retornando array vazio');
        enviarJSON(resposta, []);
      } else {
        try {
          const historico = JSON.parse(dados);
          resposta.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          resposta.end(dados);
        } catch (erroJson) {
          console.error('Erro ao ler JSON do histórico:', erroJson);
          enviarJSON(resposta, [], 200);
        }
      }
    });
  } else if (requisicao.method === 'POST' && requisicao.url === '/salvar-partida') {
    // Salva uma nova partida com validação
    let corpo = '';
    requisicao.on('data', parte => { corpo += parte; });
    requisicao.on('end', () => {
      let novaPartida;
      try {
        novaPartida = JSON.parse(corpo);
      } catch {
        return enviarJSON(resposta, { erro: 'JSON inválido' }, 400);
      }
      
      // Valida a partida
      const validacao = validarPartida(novaPartida);
      if (!validacao.valida) {
        return enviarJSON(resposta, { erro: validacao.erro }, 400);
      }

      // Normaliza o campo resultado para 'X', 'O' ou 'Empate'
      if (typeof novaPartida.resultado === 'string') {
        if (novaPartida.resultado.toUpperCase() === 'X') novaPartida.resultado = 'X';
        else if (novaPartida.resultado.toUpperCase() === 'O') novaPartida.resultado = 'O';
        else if (novaPartida.resultado.toLowerCase() === 'empate') novaPartida.resultado = 'Empate';
      }

      // Adiciona timestamp se não existir
      if (!novaPartida.data) {
        novaPartida.data = new Date().toISOString();
      }

      // Adiciona ID único
      novaPartida.id = Date.now() + Math.random().toString(36).substr(2, 9);

      fs.readFile(CAMINHO_HISTORICO, (erro, dados) => {
        let historico = [];
        if (!erro) {
          try { 
            historico = JSON.parse(dados); 
          } catch (erroJson) {
            console.error('Erro ao ler JSON do histórico:', erroJson);
            // Se o arquivo estiver corrompido, cria um novo
            historico = [];
          }
        }

        historico.push(novaPartida);

        fs.writeFile(CAMINHO_HISTORICO, JSON.stringify(historico, null, 2), erro2 => {
          if (erro2) {
            console.error('Erro ao salvar partida:', erro2);
            return enviarJSON(resposta, { erro: 'Falha ao salvar partida' }, 500);
          }
          console.log(`Partida salva: ${novaPartida.tipo} - ${novaPartida.resultado || 'Em andamento'}`);
          enviarJSON(resposta, { sucesso: true, id: novaPartida.id });
        });
      });
    });
  } else if (requisicao.method === 'OPTIONS') {
    // CORS preflight
    resposta.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    resposta.end();
  } else {
    // Servir arquivos estáticos (index.html, painel.html, etc)
    let arquivo = requisicao.url === '/' ? '/index.html' : requisicao.url;
    let extensao = path.extname(arquivo);
    let tipoConteudo = 'text/html';
    if (extensao === '.js') tipoConteudo = 'application/javascript';
    if (extensao === '.css') tipoConteudo = 'text/css';
    if (extensao === '.json') tipoConteudo = 'application/json';
    enviarArquivo(resposta, path.join(__dirname, arquivo), tipoConteudo);
  }
});

// Inicializa o arquivo de histórico
inicializarArquivoHistorico();

servidor.listen(PORTA, () => {
  console.log('Servidor rodando em http://localhost:' + PORTA);
  console.log('Rotas disponíveis:');
  console.log('  GET  /historico - Buscar histórico de partidas');
  console.log('  POST /salvar-partida - Salvar nova partida');
  console.log('  GET  / - Servir arquivos estáticos');
});
