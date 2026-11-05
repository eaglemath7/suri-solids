/* 회전 단면의 경계를 회전시킨 삼각형 망과 절단 평면의 교선으로 계산한다. */
(function(root){
const T=Math.PI*2,R=1.6,H=2.1;
const profiles={
 cylinder:{name:'원기둥',label:'직사각형',points:[[0,-H],[R,-H],[R,H],[0,H]]},
 cone:{name:'원뿔',label:'직각삼각형',points:[[0,-H],[R,-H],[0,H]]},
 sphere:{name:'구',label:'반원',points:Array.from({length:65},(_,i)=>[R*Math.sin(i*Math.PI/64),R*Math.cos(i*Math.PI/64)])},
 frustum:{name:'원뿔대',label:'사다리꼴',points:[[0,-H],[R,-H],[.7,H],[0,H]]},
 doublecone:{name:'두 원뿔을 붙인 모양',label:'삼각형',points:[[0,-H],[R,0],[0,H]]},
 hemisphere:{name:'반구',label:'사분원',points:[[0,0],...Array.from({length:33},(_,i)=>[R*Math.cos(i*Math.PI/64),R*Math.sin(i*Math.PI/64)])]},
 hollow:{name:'속이 빈 원기둥',label:'축에서 떨어진 직사각형',points:[[.75,-H],[R,-H],[R,H],[.75,H]]},
 stepped:{name:'계단 모양 회전체',label:'계단 모양',points:[[0,-H],[R,-H],[R,0],[.85,0],[.85,H],[0,H]]},
 torus:{name:'도넛 모양',label:'축에서 떨어진 원',points:Array.from({length:64},(_,i)=>[1.15+.5*Math.cos(i*T/64),.5*Math.sin(i*T/64)])}
};
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),key=p=>p.map(v=>Math.round(v*1e5)).join(',');
function mesh(type,angle=T){let p=profiles[type].points,out=[],steps=Math.max(1,Math.ceil(96*angle/T)),at=([r,y],a)=>[r*Math.cos(a),y,r*Math.sin(a)];for(let j=0;j<steps;j++)for(let i=0;i<p.length;i++){let a=at(p[i],j*angle/steps),b=at(p[(i+1)%p.length],j*angle/steps),c=at(p[(i+1)%p.length],(j+1)*angle/steps),d=at(p[i],(j+1)*angle/steps);for(let f of [[a,b,c],[a,c,d]]){let u=f[1].map((v,k)=>v-f[0][k]),v=f[2].map((v,k)=>v-f[0][k]);if(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-10)out.push(f)}}return out}
function clip(face,n,d){let out=[];face.forEach((a,i)=>{let b=face[(i+1)%face.length],da=dot(a,n)-d,db=dot(b,n)-d;if(da<=1e-8)out.push(a);if((da<0&&db>0)||(da>0&&db<0))out.push(mix(a,b,da/(da-db)))});return out}
function section(faces,n,d){let segments=new Map;for(let f of faces){let hits=new Map;f.forEach((a,i)=>{let b=f[(i+1)%f.length],da=dot(a,n)-d,db=dot(b,n)-d;if(Math.abs(da)<1e-8)hits.set(key(a),a);if(da*db<0){let p=mix(a,b,da/(da-db));hits.set(key(p),p)}});let h=[...hits.values()];if(h.length===2){let k=h.map(key).sort().join('|');segments.set(k,h)}}let links=new Map;for(let [id,[a,b]] of segments)for(let p of [a,b]){let k=key(p);if(!links.has(k))links.set(k,[]);links.get(k).push(id)}let loops=[];while(segments.size){let [id,[a,b]]=segments.entries().next().value;segments.delete(id);let loop=[a,b],start=key(a),next=key(b);for(let guard=0;guard<20000&&next!==start;guard++){let edge=(links.get(next)||[]).find(k=>segments.has(k));if(!edge)break;let [u,v]=segments.get(edge);segments.delete(edge);let p=key(u)===next?v:u;loop.push(p);next=key(p)}if(next===start&&loop.length>3)loops.push(loop.slice(0,-1))}return loops}
function plane(mode,degrees=35,height=0){let a=degrees*Math.PI/180;return mode==='axis'?{n:[0,0,1],d:0,u:[1,0,0],v:[0,1,0]}:mode==='level'?{n:[0,1,0],d:height,u:[1,0,0],v:[0,0,1]}:{n:[0,Math.cos(a),Math.sin(a)],d:height*Math.cos(a),u:[1,0,0],v:[0,-Math.sin(a),Math.cos(a)]}}
root.RevolutionSections={profiles,mesh,clip,section,plane,dot};
})(typeof window==='undefined'?globalThis:window);
