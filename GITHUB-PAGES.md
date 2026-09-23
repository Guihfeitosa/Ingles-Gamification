# Publicação no GitHub Pages

O workflow `.github/workflows/deploy.yml` publica **o conteúdo** de `dist`, e não o repositório inteiro. `dist/index.html` torna-se `/Ingles-Gamification/index.html`, servido diretamente na URL principal. README e documentação não entram no artefato publicado. Não há redirecionamento nem página intermediária na aplicação.

## Ativação no repositório

Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**. Esta configuração pertence ao GitHub e não é alterada apenas adicionando um arquivo YAML ao repositório. Se continuar como **Deploy from a branch / (root)**, o Pages poderá continuar exibindo o README.

Envie as alterações à branch `main`. Em **Actions → Deploy Orbita to GitHub Pages**, aguarde os jobs de validação e publicação ficarem verdes. Há também o comando **Run workflow** para execução manual. Não são necessários tokens ou segredos adicionais.

URL após publicação bem-sucedida:

https://guihfeitosa.github.io/Ingles-Gamification/

## O que o workflow faz

1. Obtém a branch `main` e prepara Node.js 24.
2. Executa as verificações de Física, progressão e caminhos de publicação (`npm test`).
3. Empacota somente `./dist` com `actions/upload-pages-artifact`.
4. Configura Pages e publica o artefato com `actions/deploy-pages`, no ambiente `github-pages`.

O projeto é HTML/CSS/JavaScript puro, sem dependências npm e sem compilação. Assim, não precisa de `npm install` ou build que reescreva `dist`. `.nojekyll` identifica o conteúdo como estático. O workflow anterior `pages.yml` foi substituído para evitar duas implantações simultâneas.

## Caminhos, navegação e progresso

- CSS e scripts usam caminhos relativos `./arquivo`, sem `/` inicial e sem `/dist` na URL publicada.
- O favicon está embutido. Ilustrações e objetos 3D são desenhados localmente em Canvas: não há modelos externos a baixar.
- As fontes Google mantêm URLs HTTPS externas intencionais, com fallback local. Elas não dependem do nome do repositório.
- A navegação continua por fragmentos: `/#home`, `/#lesson/0/0`, `/#sim/orbit`. Recarregar uma tela interna solicita o mesmo `index.html` ao Pages, sem depender de regras de reescrita ou `404.html`.
- O idioma e progresso mantêm a chave `orbita-v1`. LocalStorage é vinculado à origem: mudar de `/dist/` para a raiz **no mesmo domínio** preserva os dados; dados de localhost não são transferidos automaticamente para github.io. Para transferir entre origens, use Exportar/Importar em Configurações.

## Validação local da publicação

Execute `npm test` para testar também o artefato sob `/`, `/Ingles-Gamification/` e `/nome-do-repositorio/`.

Execute `npm run preview:pages` e abra http://127.0.0.1:5184/Ingles-Gamification/ para uma prévia que serve somente `dist` sob o caminho do repositório. A prévia não publica nem envia dados ao GitHub.
