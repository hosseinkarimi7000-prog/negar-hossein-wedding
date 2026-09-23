/* Botanical layers retain square aspect ratios; only the independent paper border stretches. */
(() => {
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const scenes=[...document.querySelectorAll('.scene')];
const sprites=[];const assets={};let raf=0,started=false,last=0;
for(const [key,url] of Object.entries({dove:'assets/dove-sprite.png',tango:'assets/tango-atlas-v6.png'})) {const img=new Image();img.src=url;assets[key]=img;}
function canvas(type,parent,phase){const c=document.createElement('canvas');c.width=c.height=256;c.className=type+'-sprite';parent.append(c);sprites.push({c,ctx:c.getContext('2d'),type,phase,scene:parent.closest('.scene')});}
for(const [index,scene] of scenes.entries()){
 const frame=scene.querySelector('.floral-frame');
 const art=document.createElement('div');art.className='garden-art';art.setAttribute('aria-hidden','true');
 art.innerHTML='<span class="gold-outline"></span><span class="bouquet corner-a"></span><span class="bouquet corner-b"></span><span class="bouquet corner-c"></span><span class="bouquet corner-d"></span>'+
 ['a','b','c','d'].map((s,i)=>`<span class="leaf-sprig leaf-${s}" style="--delay:${-i*1.2-index}s"></span>`).join('')+
 ['a','b','c','d'].map((s,i)=>`<span class="rose rose-${s}" style="--delay:${-i-index}s"><i class="rose-bud"></i><i class="rose-bloom"></i></span>`).join('')+
 ['a','b'].map((s,i)=>`<span class="pearl-chain pearl-${s}" style="--delay:${-index-i}s">${Array.from({length:13},(_,n)=>`<i style="--n:${n}"></i>`).join('')}</span>`).join('');
 frame.prepend(art);
 for(let n=0;n<2;n++){const bird=document.createElement('span');bird.className=`chapter-bird chapter-bird-${n}`;bird.setAttribute('aria-hidden','true');frame.append(bird);canvas('dove',bird,index*.13+n*.27);}
 const stage=document.createElement('div');stage.className='dance-stage';stage.setAttribute('aria-hidden','true');const couple=document.createElement('span');couple.className='dancing-couple';stage.append(couple);frame.append(stage);canvas('tango',couple,index*.34);
}
// Ease adjacent painted poses at the display refresh rate instead of holding low-frame-rate steps.
function draw(s,time){const img=assets[s.type];if(!img.complete||!img.naturalWidth)return;const rows=s.type==='dove'?2:4,total=rows*4,duration=s.type==='dove'?.52:3.6;const phase=reduced.matches?0:((time/1000/duration+s.phase)%1)*total;const f=Math.floor(phase),blend=phase-f,w=img.naturalWidth/4,h=img.naturalHeight/rows;const ctx=s.ctx;ctx.clearRect(0,0,256,256);ctx.globalCompositeOperation='source-over';
 const render=(i,alpha)=>{ctx.globalAlpha=alpha;ctx.drawImage(img,(i%4)*w,Math.floor(i/4)*h,w,h,0,0,256,256);};render(f,1-blend);ctx.globalCompositeOperation='lighter';render((f+1)%total,blend);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
}
function paint(time){raf=0;if(document.hidden||!started)return;const vh=innerHeight;const visible=new Set();for(const [i,scene] of scenes.entries()){
 const r=scene.getBoundingClientRect(),active=r.bottom>-180&&r.top<vh+180;scene.classList.toggle('garden-active',active);if(!active)continue;visible.add(scene);
 const progress=Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));const blossom=Math.max(0,Math.min(1,(progress-.12)/.38));
 scene.style.setProperty('--bloom',reduced.matches?1:blossom.toFixed(3));scene.style.setProperty('--bloom-scale',(.45+blossom*.55).toFixed(3));scene.style.setProperty('--bud-opacity',(1-blossom).toFixed(3));
 const sway=reduced.matches?0:Math.sin(progress*Math.PI*3+i)*7;scene.style.setProperty('--scroll-sway',`${sway.toFixed(2)}deg`);
 const travel=Math.max(0,Math.min(1,(progress-.25)/.5));const available=scene.querySelector('.floral-frame').clientWidth-120;scene.style.setProperty('--dance-x',`${(reduced.matches?available*.72:24+travel*(available-48)).toFixed(1)}px`);
 scene.style.setProperty('--dance-turn',`${reduced.matches?0:Math.sin(travel*Math.PI*2)*5}deg`);
 scene.style.setProperty('--flight-x',`${Math.sin(progress*Math.PI*2+i)*28}px`);scene.style.setProperty('--flight-y',`${Math.sin(progress*Math.PI*3)*45}px`);
 }
 for(const s of sprites)if(visible.has(s.scene))draw(s,time);
 last=time;if(!reduced.matches)raf=requestAnimationFrame(paint);
}
function start(){started=true;if(!raf)raf=requestAnimationFrame(paint);}
window.WeddingGarden={start};document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(started)start();});
window.addEventListener('scroll',()=>{if(started&&!raf)raf=requestAnimationFrame(paint);},{passive:true});reduced.addEventListener('change',()=>{cancelAnimationFrame(raf);raf=0;if(started)start();});
})();
