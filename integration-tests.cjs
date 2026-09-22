const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let html='',saved=null;const elements=new Map();
function elem(id){if(!elements.has(id))elements.set(id,{innerHTML:'',value:'',textContent:'',classList:{add(){},remove(){}},click(){}});return elements.get(id)}
const app=elem('app');Object.defineProperty(app,'innerHTML',{get:()=>html,set:v=>{html=v;elements.clear();elements.set('app',app)}});
const sandbox={console,Date,Math,JSON,Number,String,Array,Object,Set,Error,RegExp,Infinity,Map,Blob,URL,window:{scrollTo(){},addEventListener(){}},document:{hidden:false,documentElement:{},querySelector:s=>{if(s==='#app')return app;if(s==='#toast')return elem('toast');if(['#scene','#hero-orbit','#game-scene'].includes(s))return null;if(html.includes(`id="${s.slice(1)}"`))return elem(s.slice(1));return null},querySelectorAll:()=>[]},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},location:{hash:'#home'},history:{replaceState(){}},setInterval(){},setTimeout(){return 1},clearTimeout(){},cancelAnimationFrame(){},performance:{now:()=>0},matchMedia:()=>({matches:false})};
vm.createContext(sandbox);for(const f of ['content.js','exercises.js','physics.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),sandbox);Object.assign(sandbox,sandbox.window);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
const run=s=>vm.runInContext(s,sandbox);let checks=0;
// A wrong answer costs one heart and is recoverable by a correct review.
run("location.hash='#lesson/0/0';render();session.stage='quiz';selection=1;check()");assert.equal(run('state.hearts'),4);assert.equal(run('state.mistakes[0]'),'0-0');checks+=2;
run("location.hash='#review';render();session.key='0-0';selection=0;check();advance()");assert.equal(run('state.hearts'),5);assert.equal(run('state.mistakes.length'),0);checks+=2;
// Entire curriculum: lesson prerequisites, unit tests, translations and once-only XP.
for(let u=0;u<10;u++){
 if(u<9){run(`location.hash='#lesson/${u+1}/0';render()`);assert.ok(html.includes('One discovery at a time')||html.includes('Uma descoberta de cada vez'));checks++}
 for(let l=0;l<4;l++){
  run(`location.hash='#lesson/${u}/${l}';render();session.stage='quiz';selection=UNITS[${u}].lessons[${l}].answer;state.lang=1;render(false)`);
  assert.ok(html.includes(run(`UNITS[${u}].lessons[${l}].question[1]`)));checks++;
  run('check();advance()');assert.equal(run('session.complete'),true);assert.equal(run(`done(${u},${l})`),true);checks+=2;
 }
 run(`location.hash='#test/${u}';render()`);for(let l=0;l<4;l++)run(`selection=UNITS[${u}].lessons[${l}].answer;check();advance()`);
 assert.equal(run(`state.tests.includes(${u})`),true);checks++;
}
assert.equal(run('state.xp'),1200);assert.equal(run('state.done.length'),40);checks+=2;
run("location.hash='#lesson/0/0';render();selection=0;check();advance()");assert.equal(run('state.xp'),1200);checks++;
for(let g=0;g<8;g++){run(`location.hash='#game/${g}';render()`);for(let r=0;r<5;r++)run(`selection=gameQuestion(${g},${r}).answer;check();advance()`);assert.equal(run('game.round'),5);checks++}
assert.equal(run('state.xp'),1600);checks++;
run("location.hash='#game/0';render();selection=gameQuestion(0,0).answer;check();advance()");assert.equal(run('state.xp'),1600);checks++;
// Profile JSON can round-trip; invalid data rejected without committing.
run('validateImport(JSON.parse(JSON.stringify(state)))');assert.throws(()=>run("validateImport({lang:0,name:'x',avatar:'<script>'})"));assert.equal(JSON.parse(saved).xp,1600);checks+=2;
// Extra practice: bilingual rendering, valid answer keys and all 40 complete flows.
const extras=sandbox.EXTRA_EXERCISES;assert.equal(extras.length,10);checks++;
for(let u=0;u<10;u++){
 assert.equal(extras[u].length,4);checks++;
 for(let l=0;l<4;l++){
  const q=extras[u][l],key=`${u}-${l+4}`;
  for(const field of ['title','question','why']){assert.ok(q[field].length===2&&q[field].every(v=>typeof v==='string'&&v.length>0));checks++}
  if(q.type==='choice')assert.ok(q.options[q.answer]&&q.options.every(v=>v.length===2&&v.every(Boolean)));else assert.ok(Number.isFinite(q.answer));checks++;
  run(`location.hash='#exercises';render();session.key='${key}';selection=practiceQuestion('${key}').answer;state.lang=0;render(false)`);
  assert.ok(html.includes(q.question[0]));run('state.lang=1;render(false)');assert.ok(html.includes(q.question[1]));checks+=2;
  run('check()');assert.equal(run('feedback.ok'),true);run('advance()');assert.equal(run(`state.practiceDone.includes('${key}')`),true);checks+=2;
 }
}
assert.equal(run('state.done.length'),40);assert.equal(run('state.tests.length'),10);assert.equal(run('state.xp'),1600);checks+=3;
run("location.hash='#exercises';render();session.key='0-4';selection=100;check()");assert.equal(run('state.mistakes.includes(\'0-4\')'),true);assert.equal(run('state.hearts'),5);checks+=2;
run('validateImport(JSON.parse(JSON.stringify(state)))');checks++;
run("location.hash='#review';render();session.key='0-4';selection=75;check();advance()");assert.equal(run('state.mistakes.length'),0);checks++;
run("const legacy=JSON.parse(JSON.stringify(state));delete legacy.practiceDone;validateImport(legacy);state={...fresh(),...legacy}");assert.equal(run('state.practiceDone.length'),0);assert.equal(run('state.done.length'),40);checks+=2;
console.log(`${checks} integration checks passed: full curriculum, games, 40 extra bilingual exercises, review, legacy imports, persistence and XP deduplication.`);
