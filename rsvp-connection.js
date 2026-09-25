/* Private reports stay behind the Apps Script owner's Google identity. */
(() => {
'use strict';
const endpoint='https://script.google.com/macros/s/AKfycbxsAzg-Ug908kMIN0jNgF2IlunR_PhnnXjh2a1SNLibzAVwnDXtUS4oaMJdOvuD28B6dA/exec';
const channel='wedding-rsvp-v1';
let frame=null,ready=null,remote=null,remoteOrigin='',nonce='',readyResolve,readyReject,readyTimer;
const pending=new Map();
function trusted(origin){try{const u=new URL(origin);return u.protocol==='https:'&&(u.hostname==='script.googleusercontent.com'||u.hostname.endsWith('-script.googleusercontent.com'));}catch{return false;}}
function reset(){if(frame)frame.remove();frame=null;remote=null;ready=null;remoteOrigin='';clearTimeout(readyTimer);}
window.addEventListener('message',e=>{
 const m=e.data;if(!m||m.channel!==channel||m.nonce!==nonce||!trusted(e.origin))return;
 if(m.ready===true&&!remote&&readyResolve){remote=e.source;remoteOrigin=e.origin;clearTimeout(readyTimer);readyResolve();readyResolve=null;readyReject=null;return;}
 if(e.source!==remote||e.origin!==remoteOrigin)return;
 const task=pending.get(m.id);if(!task)return;clearTimeout(task.timer);pending.delete(m.id);
 if(m.result&&m.result.ok===true)task.resolve(m.result);else task.reject(Error(m.result?.error||'دریافت یا ثبت پاسخ انجام نشد.'));
});
function connect(){
 if(ready)return ready;
 nonce=crypto.randomUUID();
 ready=new Promise((resolve,reject)=>{readyResolve=resolve;readyReject=reject;});
 frame=document.createElement('iframe');frame.title='اتصال امن پاسخ‌های مهمان‌ها';frame.hidden=true;frame.setAttribute('aria-hidden','true');frame.src=endpoint+'?nonce='+encodeURIComponent(nonce);document.body.append(frame);
 readyTimer=setTimeout(()=>{const reject=readyReject;readyResolve=null;readyReject=null;reset();reject?.(Error('اتصال به گوگل برقرار نشد؛ اینترنت را بررسی و دوباره تلاش کنید.'));},45000);
 return ready;
}
async function call(action,payload){
 if(!['read','submit','import'].includes(action))throw Error('درخواست معتبر نیست.');
 await connect();const id=crypto.randomUUID();
 return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('هنوز تأیید گوگل دریافت نشده؛ دوباره تلاش کنید.'));},45000);pending.set(id,{resolve,reject,timer});remote.postMessage({channel,nonce,id,action,payload},remoteOrigin);});
}
window.WeddingConnection={connect,call,endpoint};
})();
