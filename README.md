# Orbita

Plataforma educacional bilíngue (pt-BR/en), estática e sem dependências de execução externas obrigatórias. Abra `dist/index.html` diretamente ou execute `npm start` e visite http://127.0.0.1:5173.

Inclui 40 aulas em dez unidades, dez avaliações, 80 exercícios (40 questões das aulas e 40 desafios extras), revisão de erros, oito jogos com cinco rodadas, oito simuladores, modelos com projeção 3D e rotação por mouse/toque/teclado, perfil e conquistas. Jogos concedem XP apenas na primeira conclusão de cada rodada; aulas e testes também concedem XP uma vez. A prática adicional registra questões resolvidas e encaminha erros para revisão, sem gastar vidas ou conceder XP extra.

Os dados são locais ao navegador, com exportação e importação em Configurações. Trocar idioma preserva a atividade e o progresso. Fontes online são opcionais, com fallback local. Não há conta, backend ou sincronização entre dispositivos. O conteúdo é independente, sem vínculo com ETEC/Centro Paula Souza.

## Estrutura

- `dist/content.js`: aulas, questões e controles com textos pareados PT/EN.
- `dist/exercises.js`: 40 exercícios extras, quatro por unidade, com gabaritos e resoluções PT/EN.
- `dist/physics.js`: cálculos em unidades SI.
- `dist/scene.js`: visualizações 3D em Canvas 2D com projeção perspectiva.
- `dist/app.js`: navegação, estado local, jogos e interface.
- `dist/style.css`: layout responsivo e preferências de movimento.

Cada simulador mostra hipóteses e aproximações. Os modelos 3D são esquemáticos; valores e gráficos usam as unidades indicadas. Forças: bloco inicialmente parado e coeficientes estático e cinético iguais. Órbita: circular ideal. Calor: sem perdas ou mudança de fase. Lançamento: sem resistência do ar, níveis inicial e final iguais. Hidrostática distingue pressão manométrica de absoluta, e objeto flutuante de totalmente submerso.

Verificação: `npm test` (777 verificações de fórmulas, limites, conteúdo e progressão). Consulte `VALIDATION.md` para o escopo da revisão. O progresso não é validado por servidor e destina-se a estudo pessoal.
