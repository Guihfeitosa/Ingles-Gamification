# Publicação no GitHub Pages

O workflow `.github/workflows/pages.yml` executa `npm test` e publica somente `dist/`, colocando `dist/index.html` na raiz do site.

Na primeira configuração, selecione **Settings → Pages → Build and deployment → Source → GitHub Actions** no repositório.

Depois de enviar o workflow para a branch `main`, a publicação ocorre automaticamente a cada push. Também é possível executá-la em **Actions → Publish Orbita to GitHub Pages → Run workflow**.

Endereço esperado após uma publicação bem-sucedida:

https://guihfeitosa.github.io/Ingles-Gamification/

O resultado da publicação aparece na aba Actions. Se houver falha, consulte o passo que falhou; se a implantação aguardar aprovação do ambiente `github-pages`, um responsável pelo repositório deverá aprová-la.

Nenhuma chave de API ou segredo manual é necessário. O fluxo usa as permissões temporárias do GitHub Actions para publicar o site.
