# Verificação da entrega

## Adaptação para GitHub Pages

- Workflow único em `.github/workflows/deploy.yml`; o antigo `pages.yml` foi substituído. Publicação somente de `dist`, após os testes, a cada push em `main` ou execução manual.
- `npm test` passou: 777 verificações existentes e a nova suíte `pages-tests.cjs`, usando HTTP real em `/`, `/Ingles-Gamification/` e `/nome-do-repositorio/`.
- A raiz da publicação respondeu 200 diretamente com o HTML da aplicação; todos os scripts e CSS referenciados responderam 200 com conteúdo e tipo corretos. README, documentação, configuração e `/dist/index.html` não fazem parte dos caminhos publicados.
- Recursos locais relativos; favicon embutido; objetos 3D desenhados por `scene.js`. A URL HTTPS de Google Fonts é intencional e tem fallback local. Conteúdo, estilos e regras de progresso não foram alterados.
- Navegador em `http://127.0.0.1:5184/Ingles-Gamification/`: Home renderizada diretamente com CSS e modelo orbital. Primeira aula respondida, troca PT → EN durante a questão preservada, recompensa de 20 XP concedida. Após recarregar `#lesson/0/1`, a aula desbloqueada e o idioma inglês continuaram disponíveis.
- Os oito simuladores renderizaram os resultados; modelo orbital respondeu à rotação por teclado e ao botão de animação. Recarregar `#sim/orbit` manteve a rota e renderizou o simulador.
- Jogo Motion Race: primeira rodada concluída, segunda apresentada, total acumulado de 30 XP preservado após recarregar `#game/0`. Troca de volta para português funcionou. Nenhum erro de console registrado nesses fluxos.
- Verificação remota limitada: a página Settings/Pages exige login e o navegador disponível estava desconectado. Não foi possível alterar ou confirmar a fonte de publicação remota nem executar uma implantação online nesta revisão. A validação acima reproduz localmente o artefato e o caminho de um GitHub Pages de projeto.

## Verificações anteriores

- `npm test`: **777 verificações aprovadas** (279 de fórmulas e conteúdo; 498 de integração).
- Ampliação: 40 exercícios extras, com renderização nos dois idiomas, conclusão registrada, encaminhamento de erros à revisão e importação compatível com arquivos de progresso anteriores. IDs de aulas e desbloqueios foram preservados. Esta ampliação foi verificada pela suíte de integração; a inspeção de navegador abaixo corresponde à entrega original.
- Modelos: movimento, atrito estático/cinético no modelo declarado, conservação de energia, lançamento, pressão e empuxo, calor, torque e órbita.
- Casos: corpo parado por atrito; frenagem até repouso; energia total constante durante a queda; objeto flutuante e objeto mais denso que o líquido; pressão absoluta versus manométrica; raio orbital multiplicado por quatro; calor negativo.
- Integração em ambiente de teste: 40 aulas, dez testes, 40 rodadas de jogos, desbloqueio sequencial, perda/recuperação de vidas, revisão, persistência, importação e XP sem duplicação.
- Navegador: seleção de resposta preservada ao mudar PT → EN; aula concluída e recompensa de 20 XP; oito simuladores renderizados sem erros de console; conservação de 196 J ao mudar a altura; câmera rotacionada por teclado; layout examinado a 390 × 844.
- WebMCP: leitura do progresso e abertura de simulador validadas; identificador inválido rejeitado sem alterar o estado.

## Limites explícitos

Aplicativo local, sem backend ou sincronização automática. Os modelos são projeções 3D leves em Canvas, com aproximações e escalas esquemáticas descritas na interface. Os jogos são desafios curtos de Física com modelos visuais, e não jogos comerciais de ação. O material é introdutório e independente, sem vínculo oficial com ETEC/Centro Paula Souza.

A publicação agora usa o workflow do GitHub Pages, independente do plugin Sites. O repositório precisa estar configurado com **Settings → Pages → Source → GitHub Actions** e receber as alterações para que a versão online seja atualizada. As instruções ficam apenas na documentação do projeto, fora de `dist`.
