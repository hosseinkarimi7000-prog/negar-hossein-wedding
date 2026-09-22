(() => {
  const params = new URLSearchParams(location.search);
  const fa = new Intl.NumberFormat('fa-IR');
  const clean = (value, fallback) => (value || fallback).replace(/[<>]/g, '').trim().slice(0, 80);
  const guest = clean(params.get('name'), 'مهمان گرامی');
  const guestId = clean(params.get('id'), 'general');
  const tier = ['aqd', 'ceremony'].includes(params.get('tier')) ? params.get('tier') : 'ceremony';

  document.querySelector('#guest-name').textContent = guest;
  document.querySelector('#hero-guest').textContent = guest;
  document.querySelector('#guest-id').value = guestId;
  document.querySelector('#rsvp-name').value = guest === 'مهمان گرامی' ? '' : guest;

  const schedules = {
    aqd: [
      ['۱۸:۰۰ تا ۱۹:۰۰', 'مراسم عقد', 'حضور شما در این لحظه صمیمی برایمان ارزشمند است'],
      ['۱۹:۰۰ تا ۲۲:۰۰', 'پذیرایی و شام', 'شیرینی، شام و جشن در کنار عزیزان'],
      ['۲۲:۳۰ تا سپیده‌دم', 'ادامه جشن خانوادگی', 'با حضور هم‌زمان خانم‌ها و آقایان']
    ],
    ceremony: [
      ['۱۹:۰۰ تا ۲۲:۰۰', 'پذیرایی و شام', 'شیرینی، شام و جشن در کنار عزیزان'],
      ['۲۲:۳۰ تا سپیده‌دم', 'ادامه جشن خانوادگی', 'با حضور هم‌زمان خانم‌ها و آقایان']
    ]
  };
  document.querySelector('#timeline').innerHTML = schedules[tier].map(([time, title, note]) => `
    <div class="timeline-item"><div class="timeline-time">${time}</div><div class="timeline-copy"><strong>${title}</strong><span>${note}</span></div></div>
  `).join('');

  const music = document.querySelector('#music');
  const control = document.querySelector('#music-control');
  const label = document.querySelector('#music-label');
  const setMusicState = (playing) => {
    control.classList.toggle('paused', !playing);
    control.setAttribute('aria-pressed', String(playing));
    control.setAttribute('aria-label', playing ? 'توقف موسیقی' : 'پخش موسیقی');
    label.textContent = playing ? 'موسیقی روشن' : 'پخش موسیقی';
  };
  document.querySelector('#enter-button').addEventListener('click', async () => {
    document.querySelector('#gate').classList.add('hidden');
    try { await music.play(); setMusicState(true); } catch { setMusicState(false); }
  });
  control.addEventListener('click', async () => {
    if (music.paused) { try { await music.play(); setMusicState(true); } catch { setMusicState(false); } }
    else { music.pause(); setMusicState(false); }
  });

  const wedding = new Date('2026-10-14T19:00:00+03:30').getTime();
  const renderCountdown = () => {
    const diff = Math.max(0, wedding - Date.now());
    const values = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60
    };
    Object.entries(values).forEach(([key, value]) => document.querySelector(`[data-unit="${key}"]`).textContent = fa.format(value));
  };
  renderCountdown(); setInterval(renderCountdown, 1000);

  const form = document.querySelector('#rsvp-form');
  const status = document.querySelector('#form-status');
  const countSelect = form.querySelector('select[name="count"]');
  form.querySelectorAll('input[name="attendance"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const absent = radio.checked && radio.value === 'no';
      countSelect.disabled = absent;
      if (absent) countSelect.value = '1';
    });
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type=submit]');
    button.disabled = true; status.className = 'form-status'; status.textContent = 'در حال ثبت پاسخ…';
    try {
      const response = await fetch(form.action, {method: 'POST', body: new FormData(form), headers: {'Accept': 'application/json'}});
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || 'خطا در ثبت پاسخ');
      status.className = 'form-status success'; status.textContent = 'پاسخ شما ثبت شد؛ ممنون که خبرمان کردید.';
    } catch (error) {
      status.className = 'form-status error'; status.textContent = 'پاسخ ثبت نشد. لطفاً دوباره تلاش کنید.';
    } finally { button.disabled = false; }
  });
})();
