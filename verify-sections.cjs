const assert=require('node:assert/strict');require('./revolution-sections.js');const S=RevolutionSections;
for(const type of Object.keys(S.profiles))for(const mode of ['axis','level','oblique'])for(const height of [-.17,0,.13]){const plane=S.plane(mode,35,height),loops=S.section(S.mesh(type),plane.n,plane.d);if(type==='hemisphere'&&mode==='level'&&height<0){assert.equal(loops.length,0);continue}assert(loops.length,`${type}/${mode} missing`);for(const loop of loops){assert(loop.length>=3);for(const p of loop)assert(Math.abs(S.dot(p,plane.n)-plane.d)<1e-6)}}
const area=(loop,p)=>Math.abs(loop.reduce((sum,a,i)=>{let b=loop[(i+1)%loop.length];return sum+S.dot(a,p.u)*S.dot(b,p.v)-S.dot(b,p.u)*S.dot(a,p.v)},0)/2);
for(const [mode,expected] of [['axis',3.2*4.2],['level',Math.PI*1.6**2],['oblique',Math.PI*1.6**2/Math.cos(35*Math.PI/180)]]){let p=S.plane(mode),l=S.section(S.mesh('cylinder'),p.n,p.d);assert(Math.abs(area(l[0],p)/expected-1)<.002)}
assert.equal(S.section(S.mesh('hollow'),[0,1,0],0).length,2);
assert.equal(S.section(S.mesh('torus'),[0,0,1],0).length,2);
assert.equal(S.section(S.mesh('doublecone'),[0,0,1],0)[0].length,4);
console.log('PASS: 9 profiles × 3 slice directions × 3 heights; coplanar closed sections, analytic cylinder areas, hollow rings and disconnected torus sections.');
