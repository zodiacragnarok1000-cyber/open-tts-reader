(() => {
  'use strict';
  const synth = window.speechSynthesis;
  const textInput = document.querySelector('#textInput');
  const voiceSelect = document.querySelector('#voiceSelect');
  const rate = document.querySelector('#rate');
  const pitch = document.querySelector('#pitch');
  const volume = document.querySelector('#volume');
  const rateOut = document.querySelector('#rateOut');
  const pitchOut = document.querySelector('#pitchOut');
  const volumeOut = document.querySelector('#volumeOut');
  const statusText = document.querySelector('#statusText');
  const progressText = document.querySelector('#progressText');
  const progressBar = document.querySelector('#progressBar');
  const playBtn = document.querySelector('#playBtn');
  const pauseBtn = document.querySelector('#pauseBtn');
  const stopBtn = document.querySelector('#stopBtn');
  const fileInput = document.querySelector('#fileInput');
  const dropZone = document.querySelector('#dropZone');
  const themeBtn = document.querySelector('#themeBtn');
  let voices = [];
  let chunks = [];
  let current = 0;
  let running = false;

  function setStatus(text){ statusText.textContent = text; }
  function setProgress(){
    const pct = chunks.length ? Math.min(100, Math.round((current / chunks.length) * 100)) : 0;
    progressText.textContent = pct + '%'; progressBar.style.width = pct + '%';
  }
  function splitText(text, max = 900){
    const clean = text.replace(/\r\n?/g,'\n').trim(); if(!clean) return [];
    const paragraphs = clean.split(/\n{2,}/);
    const out = [];
    for(const p of paragraphs){
      if(p.length <= max){ out.push(p); continue; }
      const sentences = p.match(/[^.!?…]+(?:[.!?…]+|$)/gu) || [p];
      let buf='';
      for(const s of sentences){
        const next=(buf+' '+s).trim();
        if(buf && next.length>max){ out.push(buf); buf=s.trim(); }
        else if(s.length>max){
          for(let i=0;i<s.length;i+=max) out.push(s.slice(i,i+max).trim()); buf='';
        } else buf=next;
      }
      if(buf) out.push(buf);
    }
    return out.filter(Boolean);
  }
  function loadVoices(){
    voices = synth.getVoices();
    voiceSelect.innerHTML='';
    if(!voices.length){ const o=document.createElement('option');o.textContent='Голоса загружаются…';voiceSelect.appendChild(o);return; }
    voices.slice().sort((a,b)=>a.lang.localeCompare(b.lang)||a.name.localeCompare(b.name)).forEach((v)=>{
      const o=document.createElement('option'); o.value=voices.indexOf(v); o.textContent=`${v.name} — ${v.lang}${v.default?' — по умолчанию':''}`; voiceSelect.appendChild(o);
    });
  }
  function selectedVoice(){ return voices[Number(voiceSelect.value)] || null; }
  function speakNext(){
    if(!running || current >= chunks.length){ running=false; setStatus('Готово'); if(current>=chunks.length)setProgress(); return; }
    const u = new SpeechSynthesisUtterance(chunks[current]);
    const v=selectedVoice(); if(v) u.voice=v;
    u.rate=Number(rate.value); u.pitch=Number(pitch.value); u.volume=Number(volume.value);
    u.lang=v?.lang || document.documentElement.lang || 'ru-RU';
    u.onstart=()=>setStatus(`Чтение: фрагмент ${current+1} из ${chunks.length}`);
    u.onboundary=(e)=>{ if(typeof e.charIndex==='number'){ const base=current/chunks.length; const within=Math.min(1,e.charIndex/Math.max(1,u.text.length)); progressBar.style.width=((base+within/chunks.length)*100).toFixed(1)+'%'; }};
    u.onend=()=>{ current++; setProgress(); speakNext(); };
    u.onerror=(e)=>{ running=false; setStatus(`Ошибка синтеза: ${e.error || 'unknown'}`); };
    synth.speak(u);
  }
  function play(){
    if(synth.paused){ synth.resume(); running=true; setStatus('Продолжение'); return; }
    synth.cancel(); chunks=splitText(textInput.value); current=0; setProgress();
    if(!chunks.length){setStatus('Нет текста');return;} running=true; speakNext();
  }
  playBtn.addEventListener('click',play);
  pauseBtn.addEventListener('click',()=>{ if(synth.speaking&&!synth.paused){synth.pause();setStatus('Пауза');} else if(synth.paused){synth.resume();setStatus('Продолжение');} });
  stopBtn.addEventListener('click',()=>{synth.cancel();running=false;current=0;setProgress();setStatus('Остановлено');});
  [rate,pitch,volume].forEach(el=>el.addEventListener('input',()=>{rateOut.textContent=Number(rate.value).toFixed(2)+'×';pitchOut.textContent=Number(pitch.value).toFixed(2);volumeOut.textContent=Math.round(Number(volume.value)*100)+'%';}));
  document.querySelector('#openBtn').addEventListener('click',()=>fileInput.click());
  async function readFile(file){
    const text=await file.text();
    if(/\.html?$/i.test(file.name)){
      const doc=new DOMParser().parseFromString(text,'text/html');
      doc.querySelectorAll('script,style,noscript,nav,footer,aside,form').forEach(n=>n.remove());
      textInput.value=doc.body?.innerText || '';
    } else textInput.value=text;
    setStatus(`Загружено: ${file.name}`);
  }
  fileInput.addEventListener('change',()=>fileInput.files[0]&&readFile(fileInput.files[0]));
  ['dragenter','dragover'].forEach(e=>dropZone.addEventListener(e,ev=>{ev.preventDefault();dropZone.classList.add('active');}));
  ['dragleave','drop'].forEach(e=>dropZone.addEventListener(e,ev=>{ev.preventDefault();dropZone.classList.remove('active');}));
  dropZone.addEventListener('drop',ev=>{const f=ev.dataTransfer.files[0];if(f)readFile(f);});
  document.querySelector('#copyBtn').addEventListener('click',async()=>{await navigator.clipboard.writeText(textInput.value);setStatus('Текст скопирован');});
  document.querySelector('#exportBtn').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([textInput.value],{type:'text/plain;charset=utf-8'}));a.download='tts-text.txt';a.click();URL.revokeObjectURL(a.href);});
  document.querySelector('#clearBtn').addEventListener('click',()=>{synth.cancel();running=false;textInput.value='';current=0;chunks=[];setProgress();setStatus('Очищено');});
  themeBtn.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('tts-theme',document.body.classList.contains('dark')?'dark':'light');});
  if(localStorage.getItem('tts-theme')==='dark')document.body.classList.add('dark');
  if('onvoiceschanged' in synth)synth.addEventListener('voiceschanged',loadVoices); loadVoices();
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
