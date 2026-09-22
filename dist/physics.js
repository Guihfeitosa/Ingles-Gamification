/* SI internally. Models and assumptions are displayed next to each experiment. */
window.Physics={
 motion:({x0,v,a,t})=>({position:x0+v*t+.5*a*t*t,velocity:v+a*t,acceleration:a,time:t}),
 forces:({m,f,mu})=>{const weight=m*9.8,friction=Math.min(f,mu*weight),net=f-friction;return{weight,normal:weight,friction,net,acceleration:net/m}},
 energy:({m,h,v,p})=>{const height=h*(1-p),potential=m*9.8*height,kinetic=.5*m*v*v+m*9.8*h*p;return{height,potential,kinetic,total:kinetic+potential,speed:Math.sqrt(2*kinetic/m)}},
 projectile:({angle,v,g,p})=>{const rad=angle*Math.PI/180,vx=v*Math.cos(rad),vy=v*Math.sin(rad),flight=2*vy/g,t=flight*p;return{range:vx*flight,maxHeight:vy*vy/(2*g),flight,x:vx*t,y:Math.max(0,vy*t-.5*g*t*t),t}},
 hydro:({rho,obj,depth,vol})=>{const weight=obj*vol*9.8,maxBuoyancy=rho*vol*9.8;return{gauge:rho*9.8*depth,absolute:101325+rho*9.8*depth,weight,maxBuoyancy,buoyancy:Math.min(weight,maxBuoyancy),submerged:Math.min(1,obj/rho),floats:obj<rho,neutral:obj===rho}},
 heat:({m,temp,q,material='water'})=>{const c={water:4180,aluminum:900,iron:450}[material];return{c,delta:q/(m*c),final:temp+q/(m*c),capacity:m*c}},
 torque:({f1,d1,f2,d2})=>({left:f1*d1,right:f2*d2,net:f1*d1-f2*d2,support:f1+f2}),
 orbit:({mass,radius,sat})=>{const M=mass*1e24,r=radius*1000,G=6.6743e-11,speed=Math.sqrt(G*M/r);return{speed,force:G*M*sat/r**2,period:2*Math.PI*r/speed,acceleration:G*M/r**2}}
};
