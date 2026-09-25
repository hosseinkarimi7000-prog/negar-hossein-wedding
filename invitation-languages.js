/* Southern Kurdish draft aimed at the Sahneh area; fine local usage needs a native review.
   Proper names, route URLs and all RSVP values remain unchanged. */
(() => {
'use strict';
const pairs={
 requiredField:['لطفاً این قسمت را تکمیل کنید.','تکایە ئی بەشە پڕ بکەنەوە.'],
 capacity:['این دعوت، با مهر برای {n} نفر از شما عزیزان است.','ئی بانگهێشتە وە مەهر، ئڕا {n} کەس لە ئێوە ئازیزەیلە.'],
 generalCapacity:['لطفاً تعداد کل افرادی را که همراه شما می‌آیند، با احتساب خودتان انتخاب کنید.','تکایە ژمارەی هەموو کەسەیلێ کە هەمڕاتان یەن، وە خۆتانەوە، هەڵبژێرن.'],
 separateTime:['۱۹:۰۰ تا ۲۲:۰۰','۱۹:۰۰ تا ۲۲:۰۰'],
 separateTitle:['آغازِ دیدار و شیرینیِ جشن','دەسپێکی دیدار و شیرینیِ شایی'],
 separateNote:['از ساعت هفت تا ده شب، با شیرینی و شادی پذیرای شما هستیم؛ بانوان عزیز در سالن بانوان و آقایان گرامی در سالن آقایان، هر کدام در فضایی جداگانه، مهمان جشن ما خواهند بود.','لە سەعات حەوت تا دەی شەو، وە شیرینی و شایی پێشوازیتان کەیم؛ خانمە ئازیزەیل لە ساڵنێ خانمەیل و پیاوە بەڕێزەیل لە ساڵنێ پیاوەیل، هەر کام لە جێگایێ جیا، میوان شاییِ ئێمەن.'],
 dinnerTime:['۲۲:۰۰','۲۲:۰۰'],dinnerTitle:['شام را مهمان ما باشید','شام، میوانمان بوون'],
 dinnerNote:['ساعت ده شب، سفرهٔ شام به افتخار حضور شما عزیزان آماده است؛ خوشحالیم که میزبانتان هستیم.','سەعات دەی شەو، سفرەی شام وە شان دیدار ئێوە ئازیزەیل ئامادەس؛ دڵخۆشیم کە میواندارِ ئێوەیم.'],
 togetherTime:['۲۲:۳۰ تا سپیده‌دم','۲۲:۳۰ تا سەفەق'],togetherTitle:['ادامهٔ شادی؛ همه در کنار هم','شایی هەر هەی؛ هەموومان وەیەکەوە'],
 togetherNote:['از ده‌ونیم، خانم‌ها و آقایان همراه خانواده‌ها کنار هم جمع می‌شویم؛ با موسیقی، رقص و خنده، تا هرقدر که دل‌هایمان هوای جشن داشته باشد… تا سپیده‌دم.','لە سەعات دە و نیوەوە، خانمەیل و پیاوەیل وە بنەماڵەیلەوە، هەموومان وەیەکەوە کۆ بوویم؛ وە ساز و هەڵپەڕکێ و خەنە، تا هەر وەخت دڵمان شایی بخوازێ… تا سەفەق.'],
 aqdTime:['۱۸:۰۰ تا ۱۹:۰۰','۱۸:۰۰ تا ۱۹:۰۰'],aqdTitle:['لحظهٔ پیوند ما','دەمی پەیوەندِ ئێمە'],
 aqdNote:['کنار سفرهٔ عقد، دعای خیر شما بدرقهٔ آغاز زندگی‌مان خواهد بود.','لە کەنار سفرەی عەقد، دوعای خێرِ ئێوە هەمڕای دەسپێک ژیانمان بوو.'],
 musicPlay:['پخش موسیقی','لێدان گۆرانی'],musicPause:['توقف موسیقی','وەستانن گۆرانی'],musicOn:['موسیقی روشن','گۆرانی لێدرێ'],musicRetry:['پخش دوبارهٔ موسیقی','دیسان لێدان گۆرانی'],
 personCount:['{n} نفر','{n} کەس'],extraLegend:['همراه اضافهٔ {n}','هەمڕای زیادەی {n}'],extraName:['نام و نام خانوادگی همراه {n}','ناو و ناوی بنەماڵەی هەمڕای {n}'],extraRelation:['نسبت همراه {n} با شما','نسبەت هەمڕای {n} وە ئێوە'],extraPlaceholder:['مثلاً خواهر، فرزند یا دوست','وەک خوشک، ڕۆڵە یا دۆس'],
 attendanceError:['حضور یا عدم حضور را انتخاب کنید.','تکایە هەڵبژێرن کە یەن یا نایەن.'],countError:['تعداد همراهان معتبر نیست.','ژمارەی هەمڕاەیل دروست نیە.'],extrasError:['نام و نام خانوادگی و نسبت هر همراه اضافه را کامل کنید.','ناو، ناوی بنەماڵە و نسبەت هەر هەمڕای زیادە پڕ بکەنەوە.'],
 sending:['در حال ثبت پاسخ مهربان شما…','وەڵام مەهربانتان تۆمار بوو…'],
 successYes:['پاسخ شما ثبت شد؛ با عشق چشم‌به‌راه {n} نفر از شما عزیزان هستیم. ♡','وەڵامتان تۆمار بی؛ وە عەشق چاوەڕوان {n} کەس لە ئێوە ئازیزەیلیم. ♡'],
 successNo:['پاسخ شما ثبت شد؛ جای شما سبز و مهرتان همیشه همراه ماست. ♡','وەڵامتان تۆمار بی؛ جێگاتان سەوز و مەهرتان هەمیشە هەمڕای ئێمەس. ♡'],
 networkError:['هنوز تأیید ثبت را دریافت نکردیم. لطفاً اتصال را بررسی کنید و دوباره بزنید.','هێشتا دڵنیایی تۆمار وەڵام نەهاتە؛ تکایە ئینتەرنێت بپشکنن و دیسان هەوڵ بدەن.'],
 languageLabel:['زبان دعوت‌نامه','زمان بانگهێشتنامە'],
 languageChanged:['زبان کارت فارسی شد.','زمان کارت کوردی بی.'],
 title:['دعوت‌نامهٔ عاشقانهٔ نگار و حسین','بانگهێشتنامەی عاشقانەی نگار و حسین']
};
const staticCopy=[
 ['#welcome .eyebrow','وە ناو خودایی کە نگار ئافەرید'],
 ['#welcome .dedication','حکایەتِ ئێمە، ڕەسی وە جوانترین وەرزی…'],
 ['#welcome .opening-line','لە ناو هەموو ڕووداوەیل دنیا،<br>ئێمە وەیەک ڕەسیم…'],
 ['#welcome .opening-note','و ئێستا، دەسپێک «هەمیشە»مان<br>وە هاتنِ ئێوە شایی کەیم.'],
 ['.date-line','چوارشەمە، ۲۲ مەهر ۱۴۰۵'],
 ['.scroll-hint','هێدی هێدی وەرەق بدەن <span aria-hidden="true">↓</span>'],
 ['#invitation .eyebrow','نامەیێ ئڕا ئازیزترینەیلمان'],
 ['#invitation h2','ئی شادیە، وە ئێوە تەواو بوو'],
 ['#invitation .focus-content>p:nth-of-type(4)','دڵمان ئەوە خوازێ کە ساڵەیلێ دواتر، وەختی باس شەو شاییمان کەیم، لە ناو یادەیل، دەنگ خەنەی ئێوە بێ؛ گەرمی نیگاتان و خۆشی دەمەیلێ کە وەیەکەوە وەسەرمان بەرن.'],
 ['#invitation .focus-content>p:nth-of-type(5)','حکایەت هەمڕاییِ ئێمە ڕەسیە وە شەوێ کە دەسپێک یەک عومرە؛ ئڕا ئی دەسپێکە، چی لە بوونِ ئێوە لە کەنارمان شیرینترە؟'],
 ['#invitation .focus-content>p:nth-of-type(6)','بێن وەیەکەوە بخەنیم، هەڵپەڕیم و یاد بسازیم. هاتنِ ئێوە تەنیا هاتن ئڕا شاییێ نیە؛ بەشێ ئازیز لە جوانترین شەو ژیانمانە.'],
 ['#invitation .closing-line','ئی شەوە، وە ئێوە یادگار بوو'],
 ['#schedule .eyebrow','قەراڕ عاشقانەی ئێمە'],['#schedule h2','شەوێ ئڕا هەمیشە'],
 ['.countdown-scene .eyebrow','هەر دەم، نزیکتر وە دیدارتان'],['#countdown-title','تا شەو یەک‌بوون'],
 ['.countdown-scene .focus-content>p:nth-of-type(2)','هەر ڕۆژێ کە وەرەو، شەوق دیدارتان فرەتر بوو؛<br>تا شەوێ کە دەس لە دەس یەک، وە ئێوە شایی کەیم.'],
 ['.countdown-grid div:nth-child(1)>span','ڕۆژ'],['.countdown-grid div:nth-child(2)>span','سەعات'],['.countdown-grid div:nth-child(3)>span','دەقیقە'],['.countdown-grid div:nth-child(4)>span','سانیە'],
 ['.countdown-scene .closing-line','چە خۆشە ئی دیدارە…'],
 ['#rsvp .eyebrow','چاوەڕوان وەڵامتانیم'],['#rsvp h2','لە کەنارمان بوون؟'],
 ['#rsvp .focus-content>p:nth-of-type(2)','لە ئێستاوە، وە دیدارتان دڵخۆشیم. ئڕا ئەوەی هەموو شتێ ئڕا پێشوازی لە ئێوە و هەمڕا ئازیزەیلتان ئامادە بکەیم، هەر ئێرە خەوەر هاتنتانمان بدەن.'],
 ['label[for="rsvp-name"]','ناو و ناوی بنەماڵەی ئێوە'],['.attendance legend','ئی شەوە لە کەنارمانین؟'],
 ['.choice:has(input[value="yes"])>span','وە عەشق، لە کەنارتانیم'],['.choice:has(input[value="no"])>span','لە دوورەوە وە شادیتان دڵخۆشیم'],
 ['label[for="confirmed-count"]','ژمارەی هەموو میوانەیل، وە خۆتانەوە'],
 ['label[for="guest-message"]','چەند قسە لە دڵ ئێوە، ئڕا دڵ ئێمە <small>وە خواست خۆتان</small>'],
 ['.submit-button','تۆمار وەڵام وە مەهر <span aria-hidden="true">♡</span>'],
 ['.farewell','سپاس کە لە حکایەت ژیانمان هەن؛<br>چە لە کەنارمان، چە وە مەهرێ کە لە دوورەوە نێرن.'],['.signature','وە عەشق، نگار و حسین'],
 ['#location .eyebrow','نیشانی شەوێ پڕ لە یاد'],['#location h2','قەراڕمان لە باخ'],
 ['#location .focus-content>p:nth-of-type(2)','لە ناو ڕووناکی باخ و بۆن گوڵەیل،<br>چاوەڕوان قەدەم پڕمەهرتانیم.'],
 ['.map-open>span','دەس لێ بدەن؛ قەراڕمان هەر ئێرەس ↗'],['.map-button','دۆزین ڕێگا لە جێگای ئێوەوە'],
 ['#card footer p','۲۲ مەهر ۱۴۰۵ <span aria-hidden="true">♡</span> دەسپێک هەمیشەی ئێمە']
];
const attributes=[
 ['#rsvp-name','placeholder','ناوی ئازیزتان'],['#guest-message','placeholder','ئارەزوو، دوعای خێر یا یادگاری مەهربانتان…'],
 ['.countdown-grid','aria-label','وەخت ماوە تا شایی'],['.map-options','aria-label','هەڵبژاردن ڕێگادۆز'],
 ['.map-preview iframe','title','دیمەن لە سەرەوەی باغ تالار قصر لِنا و ڕێگاگەل'],['.map-open','aria-label','واکردن نەخشەی باغ تالار قصر لِنا لە گووگڵ مەپ']
];
// Snapshot only authored display nodes. User-entered form values are never replaced.
const bound=staticCopy.flatMap(([selector,kurdish])=>[...document.querySelectorAll(selector)].map(node=>({node,kurdish,persian:node.innerHTML})));
const boundAttributes=attributes.map(([selector,name,kurdish])=>{const node=document.querySelector(selector);return{node,name,kurdish,persian:node?.getAttribute(name)};}).filter(x=>x.node);
let language='fa',entered=false;
function t(key,args={}){const pair=pairs[key];if(!pair)throw new Error('Missing invitation phrase: '+key);return pair[language==='sdh'?1:0].replace(/\{(\w+)\}/g,(_,k)=>String(args[k]??''));}
const bar=document.querySelector('#language-switch');let queued=false;
function fade(){queued=false;const amount=Math.min(1,Math.max(0,(window.scrollY-20)/140));bar.style.setProperty('--language-opacity',String(1-amount));bar.style.setProperty('--language-rise',`${amount*-9}px`);bar.classList.toggle('is-faded',amount>=1);bar.inert=amount>=1;}
function queueFade(){if(!queued){queued=true;requestAnimationFrame(fade);}}
function apply(next,{announce=true,remember=true}={}){
 language=next==='sdh'?'sdh':'fa';
 document.querySelector('#card').lang=language;
 if(entered){document.documentElement.lang=language;document.title=t('title');document.querySelector('#music-control').lang=language;}
 for(const b of bound)b.node.innerHTML=language==='sdh'?b.kurdish:b.persian;
 for(const b of boundAttributes)b.node.setAttribute(b.name,language==='sdh'?b.kurdish:b.persian);
 bar.setAttribute('aria-label',t('languageLabel'));
 for(const button of bar.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
 if(remember){try{localStorage.setItem('wedding-language',language);}catch{}}
 document.dispatchEvent(new CustomEvent('wedding:language'));
 if(announce)document.querySelector('#language-status').textContent=t('languageChanged');
 queueFade();
}
bar.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(button)apply(button.dataset.language);});
window.addEventListener('scroll',queueFade,{passive:true});window.addEventListener('resize',queueFade,{passive:true});
window.WeddingI18n={t,get language(){return language;},enter(){entered=true;let saved='fa';try{saved=localStorage.getItem('wedding-language')||'fa';}catch{}apply(saved,{announce:false,remember:false});}};
})();
