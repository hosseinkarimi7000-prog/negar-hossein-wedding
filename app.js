(() => {
  'use strict';
  const params=new URLSearchParams(location.hash.startsWith('#invite=')?location.hash.slice(8):location.search);
  const invite=WeddingGuests.invitation(params), fa=n=>new Intl.NumberFormat('fa-IR').format(n), $=s=>document.querySelector(s);
  $('#hero-guest').textContent=invite.name;$('#guest-id').value=invite.id;$('#rsvp-name').value=invite.name==='مهمان گرامی'?'':invite.name;
  const capacity=invite.seats?`این دعوت برای ${fa(invite.seats)} نفر از شما عزیزان است`:'خوشحالیم که همراه ما هستید';
  $('#invited-label').textContent=capacity;$('#rsvp-capacity').textContent=invite.seats?capacity:'برای اعلام حضور، لطفاً لینک اختصاصی دعوت‌تان را باز کنید.';
  const rows=[['۱۹:۰۰ تا ۲۲:۰۰','پذیرایی و شام','به صرف شیرینی و شام در کنار عزیزان'],['۲۲:۳۰ تا سپیده‌دم','جشن خانوادگی','با حضور هم‌زمان خانم‌ها و آقایان']];
  if(invite.tier==='aqd')rows.unshift(['۱۸:۰۰ تا ۱۹:۰۰','مراسم عقد','در آغاز پیوندمان کنار ما باشید']);
  $('#timeline').innerHTML=rows.map(([time,title,note])=>`<div class="timeline-item"><div class="timeline-time">${time}</div><div class="timeline-copy"><strong>${title}</strong><span>${note}</span></div></div>`).join('');
  const dove='<svg class="dove" viewBox="0 0 100 90"><path class="wing left-wing" d="M50 51C38 41 25 19 8 9C12 38 24 55 49 59Z"/><path class="wing right-wing" d="M52 52C62 31 82 14 96 9C90 37 75 55 55 60Z"/><path d="M47 52C45 60 38 69 29 78L50 73L57 63C66 65 71 58 69 52C67 46 61 45 58 48L55 51Z"/></svg>';
  $('#flight').innerHTML=dove.repeat(3);
  const music=$('#music'),control=$('#music-control');let userPaused=false;
  const sync=()=>{const playing=!music.paused;control.classList.toggle('paused',!playing);control.setAttribute('aria-pressed',String(playing));control.setAttribute('aria-label',playing?'توقف موسیقی':'پخش موسیقی');$('#music-label').textContent=playing?'موسیقی روشن':'پخش موسیقی';};
  const play=()=>{if(!userPaused)music.play().catch(sync);};
  music.addEventListener('play',sync);music.addEventListener('pause',sync);music.addEventListener('error',()=>$('#music-label').textContent='تلاش دوباره برای موسیقی');
  control.addEventListener('click',()=>{if(music.paused){userPaused=false;play();}else{userPaused=true;music.pause();}});
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('#music-control')&&music.paused)play();},{once:true});document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('#music-control'))play();},{once:true});play();
  $('#enter-button').addEventListener('click',()=>{$('#enter-button').disabled=true;play();$('#gate').classList.add('leaving');setTimeout(()=>{$('#gate').hidden=true;$('#card').hidden=false;window.scrollTo({top:0,behavior:'instant'});$('#card').classList.add('card-arrived');const heading=$('.hero h1');heading.tabIndex=-1;heading.focus({preventScroll:true});},matchMedia('(prefers-reduced-motion: reduce)').matches?0:2000);});
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.section,.portrait-break').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
  const wedding=new Date(invite.tier==='aqd'?'2026-10-14T18:00:00+03:30':'2026-10-14T19:00:00+03:30').getTime();
  function tick(){const d=Math.max(0,wedding-Date.now());Object.entries({days:Math.floor(d/86400000),hours:Math.floor(d/3600000)%24,minutes:Math.floor(d/60000)%60,seconds:Math.floor(d/1000)%60}).forEach(([k,v])=>$(`[data-unit="${k}"]`).textContent=fa(v));}tick();setInterval(tick,1000);
  const form=$('#rsvp-form'),count=$('#confirmed-count'),extras=$('#extra-guests'),status=$('#form-status');
  if(!invite.seats){form.hidden=true;return;}
  for(let i=1;i<=invite.seats*2;i++)count.add(new Option(`${fa(i)} نفر`,String(i)));count.value=String(invite.seats);
  function renderExtras(){const needed=count.disabled?0:Math.max(0,Number(count.value)-invite.seats);while(extras.children.length>needed)extras.lastElementChild.remove();while(extras.children.length<needed){const i=extras.children.length+1,field=document.createElement('fieldset');field.className='extra-person';field.innerHTML=`<legend>همراه اضافهٔ ${fa(i)}</legend><label>نام و نام خانوادگی همراه ${fa(i)}<input name="extra_${i}_name" maxlength="100" autocomplete="off" required></label><label>نسبت همراه ${fa(i)} با دعوت‌شونده<input name="extra_${i}_relationship" maxlength="100" placeholder="مثلاً خواهر، فرزند یا دوست" required></label>`;extras.append(field);}}
  count.addEventListener('change',renderExtras);form.querySelectorAll('[name=attendance]').forEach(r=>r.addEventListener('change',()=>{const yes=form.elements.attendance.value==='yes';$('#attendance-details').hidden=!yes;count.disabled=!yes;renderExtras();}));
  let submitting=false;
  form.addEventListener('submit',async e=>{e.preventDefault();if(submitting||!form.reportValidity())return;status.className='form-status';let payload;
    try{payload=WeddingGuests.response(invite,form.elements.attendance.value,count.value,[...extras.children].map(f=>({name:f.querySelector('input').value,relationship:f.querySelectorAll('input')[1].value})));}catch(error){status.textContent=error.message;status.classList.add('error');return;}
    submitting=true;const button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='در حال ثبت پاسخ…';
    const body=new FormData(form);body.set('response_time',new Date().toISOString());Object.entries(payload).forEach(([k,v])=>body.set(k,k==='additional_guests'?JSON.stringify(v):String(v)));
    body.set('تعداد دعوت‌شده',String(invite.seats));body.set('تعداد تأییدشده',String(payload.confirmed_count));body.set('خلاصه پاسخ',`${invite.name} | دعوت: ${invite.seats} نفر | تأیید: ${payload.confirmed_count} نفر | ${payload.attendance==='yes'?'می‌آیند':'نمی‌آیند'}`);
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
    try{const response=await fetch(form.action,{method:'POST',body,headers:{Accept:'application/json'},signal:controller.signal});if(!response.ok)throw Error('not accepted');status.className='form-status success';status.textContent=`پاسخ شما ثبت شد؛ ${payload.confirmed_count?`منتظر حضور ${fa(payload.confirmed_count)} نفر از شما عزیزان هستیم.`:'جای شما در جشن‌مان سبز خواهد بود.'}`;}
    catch{status.className='form-status error';status.textContent='تأیید ثبت دریافت نشد. اتصال را بررسی کنید و دوباره تلاش کنید.';}finally{clearTimeout(timer);submitting=false;button.disabled=false;}
  });
})();
