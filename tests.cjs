const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);for(const f of ['content.js','exercises.js','physics.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),ctx);const P=ctx.window.Physics,U=ctx.window.UNITS,S=ctx.window.SIMS;let checks=0;function near(actual,expected){assert.ok(Math.abs(actual-expected)<Math.max(1,Math.abs(expected))*1e-10,`${actual} != ${expected}`);checks++}
near(P.motion({x0:2,v:3,a:2,t:4}).position,30);near(P.motion({x0:0,v:10,a:-2,t:5}).velocity,0);
near(P.forces({m:5,f:5,mu:.2}).net,0);near(P.forces({m:5,f:30,mu:.2}).acceleration,4.04);
for(let p=0;p<=1;p+=.1)near(P.energy({m:2,h:10,v:3,p}).total,205);
const proj=P.projectile({angle:45,v:20,g:10,p:1});near(proj.range,40);near(proj.maxHeight,10);near(proj.y,0);
const floating=P.hydro({rho:1000,obj:600,vol:.005,depth:2});near(floating.submerged,.6);near(floating.buoyancy,floating.weight);near(floating.gauge,19600);near(floating.absolute,120925);
const sinking=P.hydro({rho:1000,obj:1200,vol:.005,depth:2});assert.ok(sinking.buoyancy<sinking.weight);checks++;
near(P.heat({m:1,temp:20,q:4180,material:'water'}).final,21);near(P.heat({m:2,temp:30,q:-900,material:'iron'}).final,29);
near(P.torque({f1:20,d1:1,f2:10,d2:2}).net,0);
const orbit=P.orbit({mass:5.972,radius:10000,sat:500}),outer=P.orbit({mass:5.972,radius:40000,sat:500});near(outer.speed,orbit.speed/2);near(outer.force,orbit.force/16);near(outer.period,orbit.period*8);
assert.equal(U.length,10);assert.equal(S.length,8);checks+=2;
for(const u of U){assert.equal(u.lessons.length,4);for(const q of u.lessons){for(const k of ['title','text','example','question','why']){assert.equal(q[k].length,2);assert.ok(q[k].every(x=>typeof x==='string'&&x.length>0));checks++}if(q.type!=='number'){assert.ok(q.answer>=0&&q.answer<q.options.length);for(const o of q.options)assert.ok(o.length===2&&o.every(Boolean))}else assert.ok(Number.isFinite(q.answer));checks++}}
for(const s of S){const v=Object.fromEntries(s.controls.map(c=>[c[0],c[4]]));const result=P[s.id](v);assert.ok(Object.values(result).every(x=>typeof x==='boolean'||Number.isFinite(x)));checks++;}
console.log(`${checks} checks passed: eight physics models, limit cases, energy conservation, orbital scaling, 40 bilingual lessons and valid answer keys.`);
