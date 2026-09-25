/* Living cover: animate the original photo only outside protected people/type.
   The source image is never edited. WebGL failure / reduced motion uses it as-is. */
(() => {
  'use strict';
  const gate = document.querySelector('#gate');
  const photo = gate?.querySelector('.cover-photo');
  if (!gate || !photo) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'cover-living';
  canvas.setAttribute('aria-hidden', 'true');
  gate.insertBefore(canvas, photo.nextSibling);
  const gl = canvas.getContext('webgl', {alpha:false, antialias:false, depth:false, stencil:false, powerPreference:'low-power'});
  if (!gl) { canvas.remove(); return; }
  const vertex = `attribute vec2 position; varying vec2 uv;
    void main(){uv=(position+1.0)*0.5;gl_Position=vec4(position,0.0,1.0);}`;
  const fragment = `precision highp float;
    uniform sampler2D photo; uniform float time; varying vec2 uv;
    const vec2 size=vec2(941.0,1672.0);
    float oval(vec2 p,vec2 c,vec2 r){return 1.0-smoothstep(0.62,1.0,length((p-c)/r));}
    float lamp(vec2 p,vec2 c,vec2 r,float phase){
      return oval(p,c,r)*(0.055+0.028*sin(time*1.45+phase)+0.012*sin(time*2.1+phase));
    }
    void main(){
      vec2 p=vec2(uv.x,1.0-uv.y)*size;
      float top=1.0-smoothstep(390.0,580.0,p.y);
      float foot=smoothstep(1380.0,1500.0,p.y);
      float leftWidth=145.0+90.0*top+90.0*foot;
      float rightWidth=115.0+105.0*top+120.0*foot;
      float left=1.0-smoothstep(leftWidth-35.0,leftWidth,p.x);
      float right=smoothstep(size.x-rightWidth,size.x-rightWidth+35.0,p.x);
      float edge=max(left,right);
      // Hard safe regions also suppress lantern light: both people and all lettering.
      float people=step(158.0,p.x)*step(p.x,805.0)*step(565.0,p.y)*step(p.y,1380.0);
      float upperType=step(242.0,p.x)*step(p.x,708.0)*(1.0-step(482.0,p.y));
      float lowerType=step(255.0,p.x)*step(p.x,706.0)*step(1380.0,p.y);
      float safe=1.0-max(people,max(upperType,lowerType));
      float phase=p.y*0.009+(right>left?2.2:0.0);
      // Slow, unequal wind at the two sides; millimetric motion, never zooming.
      vec2 breeze=vec2(3.4*sin(time*0.77+phase)+1.2*sin(time*1.17-phase),
                      1.9*sin(time*0.59+phase*0.7));
      vec2 delta=breeze*edge;
      // The three existing birds breathe/rock gently, without synthetic wing flaps.
      float birds=oval(p,vec2(70.0,87.0),vec2(60.0,66.0))
                 +oval(p,vec2(867.0,91.0),vec2(58.0,63.0));
      delta=mix(delta,vec2(0.8*sin(time*0.83),1.9*sin(time*1.05)),clamp(birds,0.0,1.0));
      float distantBird=oval(p,vec2(511.0,539.0),vec2(45.0,35.0));
      delta+=distantBird*vec2(1.7*sin(time*0.71),2.2*sin(time*0.94));
      delta*=safe*smoothstep(0.0,1.5,time);
      vec2 samplePoint=clamp(p+delta,vec2(0.5),size-0.5);
      vec3 color=texture2D(photo,samplePoint/size).rgb;
      float glow=lamp(p,vec2(161.0,424.0),vec2(34.0,57.0),0.0)
                +lamp(p,vec2(742.0,433.0),vec2(32.0,53.0),2.1)
                +lamp(p,vec2(212.0,512.0),vec2(24.0,36.0),1.3)
                +lamp(p,vec2(678.0,515.0),vec2(23.0,35.0),3.0)
                +lamp(p,vec2(76.0,971.0),vec2(40.0,56.0),1.2)
                +lamp(p,vec2(853.0,975.0),vec2(36.0,57.0),3.5)
                +lamp(p,vec2(53.0,1240.0),vec2(52.0,69.0),2.7)
                +lamp(p,vec2(901.0,1280.0),vec2(48.0,72.0),0.9);
      color+=vec3(1.0,0.66,0.25)*glow*safe*smoothstep(0.0,1.5,time);
      gl_FragColor=vec4(color,1.0);
    }`;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Cover shader unavailable');
    return shader;
  }
  let program, texture, timeLocation, ready = false, stopped = false;
  let raf = 0, lastFrame = 0, elapsed = 0, lastTick = 0;
  function active() { return ready && !stopped && !reduced.matches && !document.hidden && !gate.hidden && !gate.classList.contains('leaving'); }
  function render(now) {
    raf = 0;
    if (!active()) return;
    if (now-lastFrame >= 1000/45) {
      elapsed += lastTick ? Math.min((now-lastTick)/1000,0.05) : 0;
      lastTick=now; lastFrame=now;
      gl.uniform1f(timeLocation,elapsed); gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }
    raf=requestAnimationFrame(render);
  }
  function sync() {
    const running=active();
    canvas.classList.toggle('is-ready',running);
    canvas.dataset.motion=running?'running':'paused';
    if (!running) {cancelAnimationFrame(raf);raf=0;lastTick=0;}
    else if (!raf) {lastFrame=0;raf=requestAnimationFrame(render);}
  }
  function resize() {
    if (!ready || stopped) return;
    const scale=(matchMedia('(min-width:760px)').matches?Math.min:Math.max)(gate.clientWidth/941,gate.clientHeight/1672);
    const width=941*scale,height=1672*scale;
    const ratio=Math.min(devicePixelRatio||1,1.5);
    canvas.style.width=width+'px';canvas.style.height=height+'px';
    canvas.style.left=(gate.clientWidth-width)/2+'px';canvas.style.top=(gate.clientHeight-height)/2+'px';
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform1f(timeLocation,elapsed);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
  function fallback() {stopped=true;ready=false;sync();canvas.hidden=true;}
  async function init() {
    try {
      await photo.decode();
      program=gl.createProgram();
      gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));
      gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
      if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('Cover program unavailable');
      gl.useProgram(program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
      texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,photo);
      gl.uniform1i(gl.getUniformLocation(program,'photo'),0);timeLocation=gl.getUniformLocation(program,'time');
      ready=true;resize();sync();
    } catch {fallback();}
  }
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fallback();});
  new ResizeObserver(resize).observe(gate);
  new MutationObserver(sync).observe(gate,{attributes:true,attributeFilter:['hidden','class']});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  init();
})();
