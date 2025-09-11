
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTA = 3000;
const CAMINHO_HISTORICO = path.join(__dirname, 'historico_jogos.json');

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
    // Retorna o histórico de partidas
    fs.readFile(CAMINHO_HISTORICO, (erro, dados) => {
      if (erro) {
        enviarJSON(resposta, []);
      } else {
        resposta.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        resposta.end(dados);
      }
    });
  } else if (requisicao.method === 'POST' && requisicao.url === '/salvar-partida') {
    // Salva uma nova partida
    let corpo = '';
    requisicao.on('data', parte => { corpo += parte; });
    requisicao.on('end', () => {
      let novaPartida;
      try {
        novaPartida = JSON.parse(corpo);
      } catch {
        return enviarJSON(resposta, { erro: 'JSON inválido' }, 400);
      }
      fs.readFile(CAMINHO_HISTORICO, (erro, dados) => {
        let historico = [];
        if (!erro) {
          try { historico = JSON.parse(dados); } catch {}
        }
        historico.push(novaPartida);
        fs.writeFile(CAMINHO_HISTORICO, JSON.stringify(historico, null, 2), erro2 => {
          if (erro2) return enviarJSON(resposta, { erro: 'Falha ao salvar' }, 500);
          enviarJSON(resposta, { sucesso: true });
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

servidor.listen(PORTA, () => {
  console.log('Servidor rodando em http://localhost:' + PORTA);
});
