/* Opt-in notifications. No changes to RSVP submission or invitation capacity. */
(() => {
'use strict';
const API='https://negar-hossein-notifications.hosseinkarimi7000.chatgpt.site/api/',storeKey='wedding-push-device-v1';
const params=new URLSearchParams(location.hash.replace(/^#invite=/,''));
let invite=window.WeddingGuests.invitation(params);
try{if(invite.id==='general'&&new URLSearchParams(location.search).has('restore-invite')){const old=localStorage.getItem('wedding-last-invite');if(old){location.replace('./'+old);return;}}if(invite.id!=='general')localStorage.setItem('wedding-last-invite',location.hash);}catch{}
if(invite.id==='general')return;
const area=document.querySelector('#rsvp .focus-content');if(!area)return;
const box=document.createElement('section');box.className='notification-box';box.setAttribute('aria-label','خبرهای مراسم');
const heading=document.createElement('h3');heading.textContent='خبرهای مراسم';const note=document.createElement('p');note.textContent='با انتخاب شما، یادآوری‌ها و خبرهای مراسم روی همین دستگاه دریافت می‌شود. هر زمان بخواهید می‌توانید غیرفعالش کنید.';
const status=document.createElement('p');status.className='notification-status';status.setAttribute('role','status');
const enable=document.createElement('button');enable.type='button';enable.className='gold-button';enable.textContent='دریافت خبرهای مراسم';enable.disabled=true;
const disable=document.createElement('button');disable.type='button';disable.textContent='لغو دریافت خبرها';disable.hidden=true;
const feed=document.createElement('div');feed.className='notification-feed';feed.setAttribute('aria-live','polite');
box.append(heading,note,enable,disable,status,feed);area.append(box);
let config,registration,busy=false,saved=null;try{saved=JSON.parse(localStorage.getItem(storeKey)||'null');}catch{}
async function api(path,data){const r=await fetch(API+path,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json'}:undefined,body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(20000)});const j=await r.json();if(!r.ok)throw Error(j.error||'اتصال برقرار نشد.');return j;}
const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
const inApp=/Instagram|FBAN|FBAV|; wv\)/.test(navigator.userAgent);
function state(){const active=Notification.permission==='granted'&&saved?.guestId===invite.id&&saved?.enabled;enable.hidden=!!active;disable.hidden=!active;enable.disabled=busy||!config||!registration;}
async function initialise(){
 if(ios&&!standalone){status.textContent='در آیفون: کارت را در Safari باز کنید؛ از منوی اشتراک‌گذاری «Add to Home Screen» را بزنید، سپس از آیکون کارت وارد شوید و دریافت خبرها را فعال کنید.';enable.hidden=true;return;}
 if(!window.isSecureContext||!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)||inApp){status.textContent='برای دریافت نوتیف، کارت را در مرورگر اصلی گوشی باز کنید. خبرها داخل همین کارت هم نمایش داده می‌شوند.';enable.hidden=true;return;}
 try{localStorage.setItem('wedding-push-storage-check','1');localStorage.removeItem('wedding-push-storage-check');config=await api('config');registration=await navigator.serviceWorker.register('./notification-sw.js',{scope:'./'});await navigator.serviceWorker.ready;
 const sub=await registration.pushManager.getSubscription();if(!sub||Notification.permission!=='granted'){if(saved?.enabled&&saved.guestId===invite.id){await api('unsubscribe',{id:saved.id,secret:saved.secret}).catch(()=>{});saved.enabled=false;localStorage.setItem(storeKey,JSON.stringify(saved));}}
 if(Notification.permission==='denied')status.textContent='اجازه اعلان بسته است؛ در تنظیمات مرورگر یا گوشی، اعلان این کارت را فعال کنید.';
 else if(sub&&saved?.enabled&&saved.guestId===invite.id){await api('subscribe',{guestId:invite.id,subscription:sub.toJSON(),secret:saved.secret});status.textContent='دریافت خبرها روی این دستگاه فعال است.';}
 else status.textContent=saved?.enabled&&saved.guestId!==invite.id?'با زدن دکمه، دریافت خبرها روی این دستگاه به دعوتِ '+invite.name+' تغییر می‌کند و جای دعوت قبلی را می‌گیرد.':'برای دریافت خبرها، دکمه بالا را بزنید.';state();
 }catch{status.textContent='اتصال سرویس برقرار نشد. اینترنت را بررسی کنید و دوباره تلاش کنید.';enable.disabled=false;enable.textContent='تلاش دوباره';}
}
enable.addEventListener('click',async()=>{
 if(busy)return;if(!config||!registration){enable.disabled=true;await initialise();return;}
 busy=true;state();
 // Request immediately within the user gesture, before awaiting other work.
 const permission=Notification.permission==='granted'?Promise.resolve('granted'):Notification.requestPermission();
 try{if(await permission!=='granted'){status.textContent=Notification.permission==='denied'?'اجازه اعلان بسته است؛ آن را از تنظیمات مرورگر یا گوشی فعال کنید.':'دریافت خبرها فعال نشد؛ خبرها داخل کارت قابل مشاهده‌اند.';return;}
 const bytes=Uint8Array.from(atob(config.publicKey.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-config.publicKey.length%4)%4)),c=>c.charCodeAt(0));
 const subscription=await registration.pushManager.getSubscription()||await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes});
 const result=await api('subscribe',{guestId:invite.id,subscription:subscription.toJSON(),secret:saved?.secret});const next={id:result.id,secret:result.secret,guestId:invite.id,enabled:true};try{localStorage.setItem(storeKey,JSON.stringify(next));}catch(error){await api('unsubscribe',{id:next.id,secret:next.secret});await subscription.unsubscribe();throw Error('ذخیره تنظیمات دستگاه ممکن نشد؛ فضای مرورگر را بررسی کنید.');}saved=next;status.textContent='فعال شد؛ خبرهای دعوتِ '+invite.name+' روی این دستگاه دریافت می‌شود.';
 }catch(e){status.textContent='فعال‌سازی کامل نشد: '+e.message;}finally{busy=false;state();}
});
disable.addEventListener('click',async()=>{if(busy)return;busy=true;disable.disabled=true;try{await api('unsubscribe',{id:saved.id,secret:saved.secret});saved.enabled=false;localStorage.setItem(storeKey,JSON.stringify(saved));const sub=await registration.pushManager.getSubscription();await sub?.unsubscribe();status.textContent='دریافت خبرها لغو شد.';}catch(e){status.textContent='لغو کامل نشد: '+e.message;}finally{busy=false;disable.disabled=false;state();}});
let currentDialog=null;
async function news(){if(document.hidden||!navigator.onLine)return;try{const result=await api('feed?guest='+encodeURIComponent(invite.id));feed.replaceChildren();for(const m of result.messages){const article=document.createElement('article'),h=document.createElement('strong'),p=document.createElement('p');h.textContent=m.title;p.textContent=m.body;article.append(h,p);feed.append(article);}if(currentDialog||document.querySelector('#card')?.hidden)return;const unread=result.messages.find(m=>{try{return !localStorage.getItem('wedding-news-seen-'+m.id);}catch{return false;}});if(unread){const dialog=document.createElement('dialog'),title=document.createElement('h3'),body=document.createElement('p'),close=document.createElement('button');dialog.className='notification-dialog';title.textContent=unread.title;body.textContent=unread.body;close.type='button';close.textContent='خواندم، ممنون';dialog.append(title,body,close);document.body.append(dialog);currentDialog=dialog;const dismiss=()=>{try{localStorage.setItem('wedding-news-seen-'+unread.id,'1');}catch{}dialog.close();dialog.remove();currentDialog=null;};close.addEventListener('click',dismiss);dialog.addEventListener('cancel',e=>{e.preventDefault();dismiss();});dialog.showModal();}}catch{}}
initialise();news();setInterval(news,60000);document.querySelector('#enter-button')?.addEventListener('click',()=>setTimeout(news,2000));document.addEventListener('visibilitychange',()=>{if(!document.hidden)news();});window.addEventListener('online',news);
})();
