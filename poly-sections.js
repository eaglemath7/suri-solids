(function(root){
const S=RevolutionSections;
function cut(faces,mode='level',position=0,custom=null){
 const n=custom?custom.n:mode==='level'?[0,1,0]:mode==='vertical'?[1,0,0]:[1/Math.sqrt(3),1/Math.sqrt(3),1/Math.sqrt(3)],all=faces.flat(),values=all.map(p=>S.dot(p,n)),lo=Math.min(...values),hi=Math.max(...values),d=(custom?custom.d:(lo+hi)/2)+position*(hi-lo)*.45+1e-7;
 const triangles=faces.flatMap(f=>f.slice(1,-1).map((_,i)=>[f[0],f[i+1],f[i+2]]));
 let loops=S.section(triangles,n,d).map(loop=>loop.filter((p,i)=>{let a=loop[(i+loop.length-1)%loop.length],b=loop[(i+1)%loop.length],u=p.map((x,k)=>x-a[k]),v=b.map((x,k)=>x-p[k]);return Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-7}));
 let ref=Math.abs(n[1])<.9?[0,1,0]:[1,0,0],u=[n[1]*ref[2]-n[2]*ref[1],n[2]*ref[0]-n[0]*ref[2],n[0]*ref[1]-n[1]*ref[0]],len=Math.hypot(...u);u=u.map(x=>x/len);let v=[n[1]*u[2]-n[2]*u[1],n[2]*u[0]-n[0]*u[2],n[0]*u[1]-n[1]*u[0]];
 return {n,d,u,v,loops,faces:faces.map(f=>S.clip(f,n,d)),flat:loops.map(l=>l.map(p=>[S.dot(p,u),S.dot(p,v)]))};
}
function split(faces,mode='level',position=0,custom=null){let section=cut(faces,mode,position,custom),positive=faces.map(f=>S.clip(f,section.n.map(x=>-x),-section.d));return {...section,negative:section.faces,positive}}
function planeFromStroke(start,end,view){let dx=end[0]-start[0],dy=end[1]-start[1],length=Math.hypot(dx,dy);if(length<18)return null;let screenNX=-dy/length,screenNY=-dx/length;if(screenNX< -1e-9||Math.abs(screenNX)<1e-9&&screenNY<0){screenNX=-screenNX;screenNY=-screenNY}let cam=[screenNX,screenNY,.32],len=Math.hypot(...cam);cam=cam.map(x=>x/len);let cy=Math.cos(view.yaw),sy=Math.sin(view.yaw),cp=Math.cos(view.pitch),sp=Math.sin(view.pitch),y=cp*cam[1]+sp*cam[2],z=-sp*cam[1]+cp*cam[2],n=[cy*cam[0]-sy*z,y,sy*cam[0]+cy*z],center=view.fitCenter||[0,0],x=((start[0]+end[0])/2-view.w/2)/view.scale+center[0],screenY=(view.h*.52-(start[1]+end[1])/2)/view.scale+center[1];return {n,d:cam[0]*x+cam[1]*screenY+cam[2]*(view.depthCenter||0)}}
root.PolySections={cut,split,planeFromStroke};
})(typeof window==='undefined'?globalThis:window);
