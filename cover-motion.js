/* A living cover from the original photo, with the couple and text left intact.
   Only the side garlands and the small background bird are locally displaced.
   No generated replacement, whole-photo pan, zoom, or change to the source file. */
(() => {
  'use strict';
  const gate=document.querySelector('#gate'),photo=gate?.querySelector('.cover-photo');
  if(!gate||!photo)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const canvas=document.createElement('canvas');
  canvas.className='cover-living';canvas.setAttribute('aria-hidden','true');
  gate.insertBefore(canvas,photo.nextSibling);
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx){canvas.remove();return;}
  const W=941,H=1672,rows=[];
  const smooth=(a,b,x)=>{const n=Math.max(0,Math.min(1,(x-a)/(b-a)));return n*n*(3-2*n);};
  // The full couple is inside x=158..805, y=565..1380. Lettering has
  // x=242..708 above y=482, and x=255..706 below y=1380. Rows never enter them.
  for(let y=0;y<H;y+=8){
    const top=1-smooth(390,565,y),foot=smooth(1380,1500,y);
    rows.push({y,h:Math.min(8,H-y),left:145+90*top+90*foot,right:115+105*top+120*foot});
  }
  const lamps=[[161,424,34,57,0],[742,433,32,53,2.1],[212,512,24,36,1.3],
    [678,515,23,35,3],[76,971,40,56,1.2],[853,975,36,57,3.5],
    [53,1240,52,69,2.7],[901,1280,48,72,.9]];
  let ready=false,stopped=false,raf=0,lastFrame=0,lastTick=0,time=0;
  const active=()=>ready&&!stopped&&!reduced.matches&&!document.hidden&&!gate.hidden&&!gate.classList.contains('leaving');
  // Two anchored strips bend around their shared centre. Their outer bounds
  // never move: no duplicate outline, edge gap, or seam into the still centre.
  function bend(x,y,w,h,amount){
    const mid=w*.5,a=mid+amount,b=mid-amount;
    ctx.drawImage(photo,x,y,mid,h,x,y,a,h);
    ctx.drawImage(photo,x+mid,y,mid,h,x+a,y,b,h);
  }
  function draw(){
    ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.drawImage(photo,0,0,W,H);
    const onset=smooth(0,1.5,time);
    for(const row of rows){
      const phase=row.y*.008;
      const left=(4.5*Math.sin(time*.78+phase)+1.5*Math.sin(time*1.11-phase*.6))*onset;
      const right=(4*Math.sin(time*.64+phase+2.1)+1.7*Math.sin(time*.97-phase))*onset;
      bend(0,row.y,row.left,row.h,left);
      bend(W-row.right,row.y,row.right,row.h,right);
    }
    // The bird above the groom floats gently within its own background patch.
    // Its bottom limit is 562, clear of the groom's hair at approximately 570.
    for(let y=505;y<562;y+=3){
      const envelope=Math.sin((y-505)/57*Math.PI)**2;
      bend(467,y,87,Math.min(3,562-y),2.2*Math.sin(time*.83)*envelope*onset);
    }
    // Very soft candlelight restricted to the eight existing lanterns.
    for(const [x,y,rx,ry,phase] of lamps){
      ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);
      const glow=ctx.createRadialGradient(0,0,0,0,0,1);
      const strength=(.065+.032*Math.sin(time*1.45+phase)+.012*Math.sin(time*2.1+phase))*onset;
      glow.addColorStop(0,`rgba(255,219,148,${strength})`);glow.addColorStop(1,'rgba(255,219,148,0)');
      ctx.fillStyle=glow;ctx.fillRect(-1,-1,2,2);ctx.restore();
    }
  }
  function frame(now){
    raf=0;if(!active())return;
    if(now-lastFrame>=1000/40){
      time+=lastTick?Math.min((now-lastTick)/1000,.065):0;
      lastTick=now;lastFrame=now;draw();
    }
    raf=requestAnimationFrame(frame);
  }
  function sync(){
    const running=active();canvas.classList.toggle('is-ready',running);
    canvas.dataset.motion=running?'running':'paused';
    if(!running){cancelAnimationFrame(raf);raf=0;lastTick=0;}
    else if(!raf){lastFrame=0;raf=requestAnimationFrame(frame);}
  }
  function resize(){
    if(!ready||stopped)return;
    const scale=(matchMedia('(min-width:760px)').matches?Math.min:Math.max)(gate.clientWidth/W,gate.clientHeight/H);
    const w=W*scale,h=H*scale,ratio=Math.min(devicePixelRatio||1,1.5);
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    canvas.style.left=(gate.clientWidth-w)/2+'px';canvas.style.top=(gate.clientHeight-h)/2+'px';
    canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';draw();
  }
  new ResizeObserver(resize).observe(gate);
  new MutationObserver(sync).observe(gate,{attributes:true,attributeFilter:['hidden','class']});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  photo.decode().then(()=>{ready=true;resize();sync();}).catch(()=>{stopped=true;sync();canvas.remove();});
})();
