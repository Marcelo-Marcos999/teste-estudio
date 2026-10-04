# teste-estudio
teste

## Funcionalidades

### Alternância de tema (claro/escuro)
Na `StatusBar` há um botão de alternância de tema (ícone 🌙/☀️). Ao clicar, o tema
alterna entre claro e escuro, aplicando a classe `light`/`dark` no elemento raiz
(`<html>`) e atualizando as variáveis CSS. A escolha é persistida em `localStorage`
e restaurada automaticamente ao recarregar a página.

### Modo de jogo (PvP/PvAI)
No `ResetButton` há um botão secundário que alterna o modo de jogo entre **PvP**
(jogador contra jogador) e **PvAI** (jogador contra a IA). O modo atual é exibido
na `StatusBar` e no `Scoreboard`, e a seleção é persistida em `localStorage`.

### Placar
O `Scoreboard` mostra as pontuações dos jogadores (e da IA no modo PvAI), além de
um indicador do modo atual ("Modo: PvP/PvAI"). As cores acompanham o tema
selecionado.
