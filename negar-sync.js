(() => {
  'use strict';
  const endpoint = 'https://script.google.com/macros/s/AKfycbw0O01B9U1xtRzdF33V53XxaU5HLzknBK5UgjF35tLkFMrXrCz9QktIHshdu1cucZ4IAw/exec';
  const channel = 'wedding-negar-v1';
  const status = document.querySelector('#negar-sync-status');
  const panel = document.querySelector('#negar-online');
  if (!endpoint) {
    status.textContent = 'اتصال آنلاین دعوت‌های نگار هنوز راه‌اندازی نشده است.';
    return;
  }
  let frame, remote, origin, nonce, ready;
  const pending = new Map();
  function trusted(value) {
    try { const u = new URL(value); return u.protocol === 'https:' &&
      (u.hostname === 'script.googleusercontent.com' || u.hostname.endsWith('-script.googleusercontent.com')); }
    catch { return false; }
  }
  window.addEventListener('message', event => {
    const m = event.data;
    if (!m || m.channel !== channel || m.nonce !== nonce || !trusted(event.origin)) return;
    if (m.ready && !remote) { remote = event.source; origin = event.origin; ready?.(); return; }
    if (event.source !== remote || event.origin !== origin) return;
    const task = pending.get(m.id); if (!task) return;
    clearTimeout(task.timer); pending.delete(m.id);
    if (m.result?.ok) task.resolve(m.result);
    else task.reject(Error(m.result?.error || 'ارتباط با گوگل برقرار نشد.'));
  });
  function connect() {
    if (frame) return frame.promise;
    nonce = crypto.randomUUID();
    frame = document.createElement('iframe');
    frame.title = 'اتصال دعوت‌های نگار'; frame.hidden = true;
    frame.setAttribute('aria-hidden', 'true');
    frame.src = endpoint + '?nonce=' + encodeURIComponent(nonce);
    frame.promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => { frame?.remove(); frame = null; reject(Error('ورود به حساب گوگل انجام نشد.')); }, 45000);
      ready = () => { clearTimeout(timer); resolve(); };
    });
    document.body.append(frame);
    return frame.promise;
  }
  async function call(action, payload) {
    await connect();
    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(Error('پاسخی از گوگل دریافت نشد.')); }, 45000);
      pending.set(id, {resolve, reject, timer});
      remote.postMessage({channel, nonce, id, action, payload}, origin);
    });
  }
  const fa = n => new Intl.NumberFormat('fa-IR').format(n);
  let role = '', busy = false, queued = false;
  const synced = new Map();
  function localChanges() {
    const {guests, deleted} = window.getLocalInvitations();
    return [...guests.map(guest => ({guest, deleted:false})),
      ...deleted.map(guest => ({guest, deleted:true}))];
  }
  async function upload() {
    if (role !== 'negar') return;
    if (busy) { queued = true; return; }
    busy = true;
    try {
      do {
        queued = false;
        const changes = localChanges().filter(change =>
          synced.get(change.guest.id) !== JSON.stringify(change));
        for (let i = 0; i < changes.length; i += 100) {
          const batch = changes.slice(i, i + 100);
          await call('apply', batch);
          batch.forEach(change => synced.set(change.guest.id, JSON.stringify(change)));
        }
      } while (queued);
      status.textContent = 'دعوت‌های نگار آنلاین ثبت شدند؛ حسین آن‌ها را در گزارش خود می‌بیند.';
    } catch (error) { status.textContent = error.message + ' دعوت‌ها در همین گوشی حفظ شده‌اند؛ برای تلاش دوباره صفحه را باز کنید.'; }
    finally { busy = false; }
  }
  function showOwner(data) {
    window.setNegarInvitations(data.guests, data.deleted);
    panel.hidden = false;
    const list = document.querySelector('#negar-online-list');
    list.replaceChildren();
    const seats = data.guests.reduce((sum, guest) => sum + guest.seats, 0);
    document.querySelector('#negar-online-totals').textContent = `${fa(data.guests.length)} دعوت‌نامه · ${fa(seats)} نفر دعوت‌شده توسط نگار`;
    for (const guest of data.guests) {
      const p = document.createElement('p');
      p.textContent = `${guest.name} · ${fa(guest.seats)} نفر · ${guest.tier === 'aqd' ? 'عقد و مراسم' : 'مراسم'}`;
      list.append(p);
    }
    status.textContent = 'دعوت‌های نگار از گوگل دریافت شد؛ هنگام بازبودن صفحه هر ۳۰ ثانیه به‌روز می‌شوند.';
  }
  async function refresh() {
    try {
      const data = await call('state');
      role = data.role;
      if (role === 'negar') {
        document.querySelector('#attendance-report').hidden = true;
        panel.hidden = true;
        await upload();
      } else showOwner(data);
    } catch (error) { status.textContent = error.message + ' آخرین اطلاعات ذخیره‌شده در مرورگر حفظ شده‌اند.'; }
  }
  window.addEventListener('wedding:invitations-changed', () => upload());
  document.querySelector('#negar-sync-now').addEventListener('click', refresh);
  setInterval(() => { if (!document.hidden) refresh(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  refresh();
})();
