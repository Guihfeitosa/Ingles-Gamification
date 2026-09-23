const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createPagesServer} = require('./scripts/serve-pages.cjs');

async function checkBase(basePath) {
  const server = createPagesServer(basePath);
  await new Promise((resolve,reject) => {server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const origin = `http://127.0.0.1:${server.address().port}`;
  const site = origin + basePath;
  try {
    const response = await fetch(site, {redirect:'manual'});
    assert.equal(response.status,200,'Project root must serve application without redirect');
    const html = await response.text();
    assert.equal(html,fs.readFileSync('dist/index.html','utf8'));
    assert.match(html,/<div id="app"><\/div>/);
    assert.doesNotMatch(html,/<base\b|http-equiv=["']refresh|README\.md/i);
    const assets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(m=>m[1]);
    for (const asset of assets) {
      if (asset.startsWith('data:')) continue;
      assert.ok(!asset.startsWith('/') && !/^[a-z]+:/i.test(asset),`Nonrelative entry asset: ${asset}`);
      const url = new URL(asset,site);
      assert.ok(url.pathname.startsWith(basePath));
      const result = await fetch(url);
      assert.equal(result.status,200,`${asset} must load under ${basePath}`);
      assert.equal(await result.text(),fs.readFileSync(path.join('dist',asset),'utf8'));
      assert.match(result.headers.get('content-type'),asset.endsWith('.css')?/text\/css/:/javascript/);
    }
    for (const route of ['home','lesson/0/0','exercises','sim/orbit','game/0','profile']) {
      const result = await fetch(site + '#' + route);
      assert.equal(result.status,200);
      assert.equal(await result.text(),html,'Hash route reload must serve the same entry');
    }
    for (const excluded of ['README.md','GITHUB-PAGES.md','package.json','.github/workflows/deploy.yml','dist/index.html']) {
      assert.equal((await fetch(site+excluded)).status,404,`${excluded} must not be in published artifact`);
    }
    const css = fs.readFileSync('dist/style.css','utf8');
    for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      const asset = match[1];
      if (/^(?:https:|data:)/.test(asset)) continue; // Intentional external Google Fonts, with local fallbacks.
      assert.ok(!asset.startsWith('/'),`Root-relative CSS asset: ${asset}`);
      assert.equal((await fetch(new URL(asset,site+'style.css'))).status,200);
    }
    const app = fs.readFileSync('dist/app.js','utf8');
    assert.doesNotMatch(app,/(?:src|href)=["']\//,'App-generated links must not leave project path');
    assert.match(app,/page=location\.hash\.slice\(1\)\|\|'home'/);
    assert.match(app,/localStorage\.getItem\('orbita-v1'\)/);
    assert.match(app,/localStorage\.setItem\('orbita-v1'/);
    console.log(`Pages OK at ${basePath}: direct index, CSS/JS, hash refresh, isolated dist and stable storage key.`);
  } finally {
    await new Promise(resolve=>server.close(resolve));
  }
}

(async()=>{
  const workflow=fs.readFileSync('.github/workflows/deploy.yml','utf8');
  assert.match(workflow,/path: \.\/dist\s/);
  assert.match(workflow,/branches: \[main\]/);
  assert.match(workflow,/run: npm test/);
  assert.ok(!fs.existsSync('.github/workflows/pages.yml'),'Do not retain competing Pages workflows');
  assert.ok(fs.existsSync('dist/.nojekyll'));
  await checkBase('/Ingles-Gamification/');
  await checkBase('/nome-do-repositorio/');
  await checkBase('/');
})().catch(error=>{console.error(error);process.exitCode=1});
