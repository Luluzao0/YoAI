# 🎮 Jogo da Velha com Árvore de Busca

Este projeto foi desenvolvido para a disciplina de **Inteligência Artificial**, demonstrando a implementação do algoritmo **Minimax com Poda Alfa-Beta** em um jogo clássico.

## 👥 Equipe de Desenvolvimento
- **Luis Guilherme Busaglo Lopes**
- **Patrick Melo Albuquerque** 
- **Suami Gomes Santos**
- **John Lennon Vicente Silva**

---

## 📋 Sobre o Projeto

Este é um **Jogo da Velha (Tic-Tac-Toe)** implementado em JavaScript que utiliza uma **árvore de busca** para representar todos os estados possíveis do jogo. O objetivo é demonstrar como a Inteligência Artificial pode tomar decisões ótimas em jogos de estratégia.

### 🧠 Algoritmo Implementado
- **Minimax com Poda Alfa-Beta**: Algoritmo que explora recursivamente todos os estados possíveis do jogo
- **Árvore de Estados**: Cada nó representa um estado do tabuleiro, cada ramo uma jogada possível
- **Decisões Ótimas**: A IA sempre escolhe a melhor jogada disponível

---

## 🏗️ Estrutura do Projeto

```
jogo-da-velha/
├── README.md              # Documentação do projeto
├── tic_tac_toe.js         # Script principal (Node.js)
├── historico_jogos.json   # Histórico de partidas
├── painel.html           # Interface web para visualizar histórico
├── painel.js             # Lógica do painel web
├── style.css             # Estilos do painel
└── index.html            # (Opcional) Jogo jogável no navegador
```

---

## 🚀 Como Executar

### Pré-requisitos
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)

### Executando o Jogo

#### **Jogo Web Interativo**
1. **Abra o arquivo** `index.html` em qualquer navegador web
2. **Jogue contra a IA** clicando nas células do tabuleiro
3. **Acompanhe sua pontuação** na parte inferior

#### **Visualizar Histórico**
1. **Abra o arquivo** `painel.html` em qualquer navegador web
2. **Visualize** todas as partidas salvas com detalhes completos
3. **Analise** as estratégias e padrões das jogadas

### Funcionalidades Disponíveis

1. **🎮 Jogo Interativo**: Jogue contra a IA diretamente no navegador
2. **📊 Painel de Histórico**: Visualize todas as partidas com estatísticas
3. **🧠 IA Inteligente**: Algoritmo Minimax com Poda Alfa-Beta
4. **💾 Persistência**: Dados salvos automaticamente no navegador

---

## 🎯 Funcionalidades

### Biblioteca de IA (`tic_tac_toe.js`)
- ✅ **Algoritmo Minimax com Poda Alfa-Beta** completo
- ✅ **Classe `No`** para representação da árvore de busca
- ✅ **Funções de lógica do jogo** (vencedor, acabou, jogadas válidas)
- ✅ **API simples** para integração em projetos web
- ✅ **Exportação modular** para Node.js e navegador
- ✅ **Simulação de partidas** IA vs IA

### Jogo Web Interativo (`index.html`)
- ✅ **Interface moderna** e responsiva
- ✅ **Jogo contra IA** em tempo real
- ✅ **Sistema de pontuação** persistente
- ✅ **Feedback visual** e animações
- ✅ **Controles intuitivos** de tabuleiro

### Histórico de Jogos (`historico_jogos.json`)
Cada partida salva contém:
```json
{
  "id": 1694123456789,
  "data": "2023-09-07T15:30:45.123Z",
  "tipo": "IAxHumano",
  "primeiroJogador": "X",
  "acoes": [
    {"jogador": "X", "posicao": 4},
    {"jogador": "O", "posicao": 0}
  ],
  "tabuleiroFinal": ["O", null, null, null, "X", null, null, null, null],
  "resultado": "Empate"
}
```

### Painel Web (`painel.html`)
- 📊 **Visualização completa** do histórico de jogos
- 🎨 **Interface moderna** e responsiva
- 🎯 **Cards informativos** com detalhes de cada partida
- 🎲 **Tabuleiro visual** mostrando o estado final
- 📝 **Lista de ações** passo a passo

---

## 🧮 Como Funciona a IA

### Algoritmo Minimax
A IA utiliza o algoritmo **Minimax** para avaliar todos os movimentos possíveis:

1. **Explora recursivamente** todos os estados futuros do jogo
2. **Avalia cada estado** com uma pontuação (vitória, derrota, empate)
3. **Maximiza** suas chances de vitória
4. **Minimiza** as chances do oponente

### Poda Alfa-Beta
Para otimizar a performance, implementamos a **Poda Alfa-Beta**:
- ✂️ **Corta ramos** desnecessários da árvore de busca
- ⚡ **Reduz significativamente** o número de estados avaliados
- 🎯 **Mantém o resultado ótimo** sem perda de qualidade

### Sistema de Pontuação
- **+10**: IA vence (ajustado pela profundidade)
- **-10**: IA perde (ajustado pela profundidade)  
- **0**: Empate
- **Profundidade**: Favorece vitórias mais rápidas

---

## 💡 Conceitos de IA Demonstrados

- **🌳 Árvore de Busca**: Representação de todos os estados possíveis
- **🎯 Minimax**: Algoritmo de decisão para jogos de soma zero
- **✂️ Poda Alfa-Beta**: Otimização para reduzir espaço de busca
- **🤖 Tomada de Decisão**: Como a IA escolhe a melhor jogada
- **📊 Avaliação de Estados**: Sistema de pontuação para estados do jogo

---

## 🔍 Visualizando o Histórico

Para ver o histórico completo das partidas:

1. **Abra o arquivo** `painel.html` em qualquer navegador web
2. **Visualize** todas as partidas salvas com detalhes completos
3. **Analise** as estratégias e padrões das jogadas

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido para demonstrar:
- Implementação prática de algoritmos de busca em IA
- Representação de problemas através de árvores de estados
- Otimização de algoritmos através de técnicas de poda
- Desenvolvimento de interfaces para visualização de dados

### 📚 Referências Teóricas
- Algoritmos de busca adversarial
- Teoria dos jogos aplicada à IA
- Estruturas de dados em árvore
- Otimização algorítmica

---

## 🚀 Melhorias Futuras

- 🌐 **Versão web jogável** (`index.html`)
- 📱 **Interface mobile** responsiva  
- 📈 **Estatísticas avançadas** de performance
- 🎨 **Temas visuais** personalizáveis
- 🔧 **Configurações de dificuldade** da IA

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da disciplina de Inteligência Artificial.

---

**💡 Dica**: Execute várias partidas para ver como a IA sempre joga de forma ótima e analise os padrões no painel web!
