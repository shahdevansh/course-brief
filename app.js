(function(){
"use strict";
var app=document.getElementById('app');
var fab=document.getElementById('voice-fab');
var audio=document.getElementById('voice-audio');
var TZ='America/Los_Angeles';
function todayStr(){var d=new Date(new Date().toLocaleString('en-US',{timeZone:TZ}));return iso(d);}
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function parseDate(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function addDays(s,n){var d=parseDate(s);d.setDate(d.getDate()+n);return iso(d);}
function fmtDay(s){return parseDate(s).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});}
function fmtTime(t){if(!t)return'';var d=new Date(t);return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:TZ});}
function fmtDue(t){if(!t)return'no due date';var d=new Date(t);return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',timeZone:TZ})+' '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:TZ});}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
var state={date:null};
var RUNTIME_URL='https://drive.usercontent.google.com/download?id=13HBt6ENPHHHKDOKLFGNWiEowriBwzKZc&export=download';
var runtimePromise=null;
var AUDIO28_BASE64=null;
var AUDIO29_BASE64=null;
var AUDIO30_BASE64=null;
var AUDIO08_BASE64=null;
function loadAudio08(){if(AUDIO08_BASE64)return Promise.resolve(AUDIO08_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement("script");tag.src="audio08-parts.js";tag.onload=function(){try{AUDIO08_BASE64=PARTS08.join("");resolve(AUDIO08_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
var AUDIO07_BASE64=null;
function loadAudio07(){if(AUDIO07_BASE64)return Promise.resolve(AUDIO07_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement("script");tag.src="audio07-parts.js/audio07-parts.js";tag.onload=function(){try{AUDIO07_BASE64=PARTS07.join("");resolve(AUDIO07_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
var AUDIO06_BASE64=null;
function loadAudio06(){if(AUDIO06_BASE64)return Promise.resolve(AUDIO06_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement("script");tag.src="audio06-parts.js";tag.onload=function(){try{AUDIO06_BASE64=PARTS06.join("");resolve(AUDIO06_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
var AUDIO05_BASE64=null;
function loadAudio05(){if(AUDIO05_BASE64)return Promise.resolve(AUDIO05_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement("script");tag.src="audio05-parts.js";tag.onload=function(){try{AUDIO05_BASE64=PARTS05.join("");resolve(AUDIO05_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
var AUDIO03_BASE64=null;
function loadAudio03(){if(AUDIO03_BASE64)return Promise.resolve(AUDIO03_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement("script");tag.src="audio03-parts.js";tag.onload=function(){try{AUDIO03_BASE64=PARTS03.join("");resolve(AUDIO03_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
var AUDIO02_BASE64=null;
function loadAudio02(){if(AUDIO02_BASE64)return Promise.resolve(AUDIO02_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement("script");tag.src="audio02-parts.js";tag.onload=function(){try{AUDIO02_BASE64=PARTS02.join("");resolve(AUDIO02_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
var AUDIO01_BASE64=null;
function loadAudio01(){if(AUDIO01_BASE64)return Promise.resolve(AUDIO01_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement("script");tag.src="audio01-parts.js";tag.onload=function(){try{AUDIO01_BASE64=PARTS01.join("");resolve(AUDIO01_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
function loadAudio30(){if(AUDIO30_BASE64)return Promise.resolve(AUDIO30_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement("script");tag.src="audio30-parts.js";tag.onload=function(){try{AUDIO30_BASE64=PARTS30.join("");resolve(AUDIO30_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
function loadAudio29(){if(AUDIO29_BASE64)return Promise.resolve(AUDIO29_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement('script');tag.src='audio29-parts.js';tag.onload=function(){try{AUDIO29_BASE64=PARTS29.join('');resolve(AUDIO29_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
function loadAudio28(){if(AUDIO28_BASE64)return Promise.resolve(AUDIO28_BASE64);return new Promise(function(resolve,reject){var tag=document.createElement('script');tag.src='audio28-parts.js';tag.onload=function(){try{AUDIO28_BASE64=PARTS.join('');resolve(AUDIO28_BASE64);}catch(e){reject(e);}};tag.onerror=reject;document.head.appendChild(tag);});}
function loadRuntime(){if(!runtimePromise)runtimePromise=fetch(RUNTIME_URL,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('runtime');return r.json();}).catch(function(){return fetch('runtime-fallback.json',{cache:'no-cache'}).then(function(r){return r.json();});});return runtimePromise;}
function route(){
  var h=location.hash||'';
  var m=h.match(/^#\/day\/(\d{4}-\d{2}-\d{2})/);
  var w=h.match(/^#\/week\/([\w-]+)/);
  if(m){state.date=m[1];loadDay(m[1]);}
  else if(w){loadWeek(w[1]);}
  else{state.date=todayStr();location.replace('#/day/'+state.date);}
}
window.addEventListener('hashchange',route);
document.getElementById('nav-today').onclick=function(){location.hash='#/day/'+todayStr();};
document.getElementById('nav-prev').onclick=function(){if(state.date)location.hash='#/day/'+addDays(state.date,-1);};
document.getElementById('nav-next').onclick=function(){if(state.date)location.hash='#/day/'+addDays(state.date,1);};
document.getElementById('nav-week').onclick=function(){if(state.date){location.hash='#/week/'+weekId(state.date);}};
function weekId(dateStr){var d=parseDate(dateStr);var day=d.getDay();d.setDate(d.getDate()+(day===0?1:1-day));return iso(d);}
function setAudio(src){
  if(!src){audio.removeAttribute('src');fab.hidden=true;return;}
  audio.src=src;fab.hidden=false;fab.classList.remove('playing');fab.innerHTML='▶ <span>Listen</span>';
}
function resetAudioButton(){fab.classList.remove('playing');fab.innerHTML='▶ <span>Listen</span>';}
fab.onclick=async function(){
  if(!audio.paused){audio.pause();resetAudioButton();return;}
  try{
    if(state.date==='2026-09-28'||state.date==='2026-09-29'||state.date==='2026-09-30'||state.date==='2026-10-01'||state.date==='2026-10-02'||state.date==='2026-10-03'||state.date==='2026-10-05'||state.date==='2026-10-06'||state.date==='2026-10-07'||state.date==='2026-10-08'){
      var b64=state.date==='2026-09-28'?await loadAudio28():(state.date==='2026-10-08'?await loadAudio08():state.date==='2026-10-07'?await loadAudio07():state.date==='2026-10-06'?await loadAudio06():state.date==='2026-10-05'?await loadAudio05():state.date==='2026-10-03'?await loadAudio03():state.date==='2026-10-02'?await loadAudio02():state.date==='2026-10-01'?await loadAudio01():(state.date==='2026-09-30'?await loadAudio30():await loadAudio29()));
      if(!audio.src.startsWith('blob:')){
        var raw=atob(b64), bytes=new Uint8Array(raw.length);
        for(var i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
        audio.src=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
      }
    }
    await audio.play();fab.classList.add('playing');fab.innerHTML='❚❚ <span>Playing</span>';
  }catch(e){resetAudioButton();console.error('Audio playback failed',e);}
};
audio.onended=resetAudioButton;audio.onerror=resetAudioButton;
function matIcon(k){return {pdf:'📄',slides:'📊',link:'🔗',page:'📃',video:'🎬',audio:'🎧',zip:'🗜️'}[k]||'📎';}
function courseAnchor(c,i){return "course-"+(c.code||c.short||("class-"+i)).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function renderCourse(c,i){
  var h='<section class="course" id="'+courseAnchor(c,i)+'"><div class="chead"><div><h2>'+esc(c.short||c.name)+'</h2><div class="code">'+esc(c.code||'')+(c.name&&c.short?' · '+esc(c.name):'')+'</div></div>';
  if(c.status&&c.status!=='enrolled')h+='<span class="badge '+esc(c.status)+'">'+esc(c.status.toUpperCase())+'</span>';
  else h+='<span class="badge enrolled">ENROLLED</span>';
  h+='</div>';
  if(c.meeting){h+='<div class="meeting"><span>🕒 '+esc(c.meeting.label||((c.meeting.start||'')+(c.meeting.end?'–'+c.meeting.end:'')))+'</span>'+(c.meeting.location?'<span>📍 '+esc(c.meeting.location)+'</span>':'' )+(c.meeting.calendar_url?'<a href="'+esc(c.meeting.calendar_url)+'">Calendar ↗</a>':'')+'</div>';}
  if(c.prep&&c.prep.length){h+='<h3 class="sec">Do before class</h3><ul class="prep">';c.prep.forEach(function(p){h+='<li class="'+(p.optional?'optional':'')+'">'+esc(p.text)+(p.optional?'<span class="opt">OPTIONAL</span>':'')+'</li>';});h+='</ul>';}
  if(c.takeaways&&c.takeaways.length){h+='<h3 class="sec">What you should know before class</h3><ul class="takeaways">';c.takeaways.forEach(function(t){h+='<li>'+esc(t)+'</li>';});h+='</ul>';}
  if(c.session_summary){h+='<div class="session-detail"><h3>'+esc(c.session_summary.title||"Class detail")+'</h3><p>'+esc(c.session_summary.text||"")+'</p></div>';}
  if(c.materials&&c.materials.length){h+='<h3 class="sec">Materials</h3>';c.materials.forEach(function(m){h+='<a class="mat" href="'+esc(m.url)+'" target="_blank" rel="noopener"><span class="ic">'+matIcon(m.kind)+'</span><span class="t">'+esc(m.title)+(m.note?' <span style="color:var(--muted)">· '+esc(m.note)+'</span>':'')+'</span><span class="dl">Open ↗</span></a>';});}
  if(c.deliverables&&c.deliverables.length){h+='<h3 class="sec">Deliverables</h3>';c.deliverables.forEach(function(d){h+=renderDeliv(d);});}
  if(c.announcements&&c.announcements.length){h+='<h3 class="sec">Announcements</h3>';c.announcements.forEach(function(a){h+='<div class="ann"><b>'+esc(a.title)+'</b> — '+esc(a.text)+'</div>';});}
  h+='</section>';return h;
}
function renderDeliv(d){
  var cls='deliv '+(d.status||'');
  var h='<div class="'+cls+'"><div class="dtop"><span class="dname">'+esc(d.title)+'</span><span class="due">'+esc(d.due_label||fmtDue(d.due))+'</span></div>';
  var meta=[];if(d.course)meta.push(d.course);if(d.points!=null)meta.push(d.points+' pts');if(d.est_minutes)meta.push('~'+(d.est_minutes>=90?(Math.round(d.est_minutes/30)/2)+'h':d.est_minutes+'min'));
  if(meta.length)h+='<div class="meta">'+esc(meta.join(' · '))+'</div>';
  if(d.instructions)h+='<div class="instr">'+esc(d.instructions)+'</div>';
  h+='<div class="acts">';
  if(d.assignment_url)h+='<a class="btn" href="'+esc(d.assignment_url)+'" target="_blank" rel="noopener">Assignment ↗</a>';
  if(d.submit_url)h+='<a class="btn primary" href="'+esc(d.submit_url)+'" target="_blank" rel="noopener">Submit ↗</a>';
  h+='</div></div>';return h;
}
function loadDay(date){
  state.date=date;app.innerHTML='<div class="loading">Loading '+fmtDay(date)+'…</div>';setAudio(null);
  loadRuntime().then(function(rt){var d=rt.days&&rt.days[date];if(!d)throw new Error('nf');return d;}).then(function(d){
    var h='<div class="day-head"><h1>'+fmtDay(date)+'</h1><div class="sub">'+(d.courses?d.courses.length:0)+' class'+(d.courses&&d.courses.length===1?'':'es')+(d.generated_at?' · updated '+esc(d.generated_at):'')+'</div></div>';
    if(d.day_summary)h+='<div class="summary">'+esc(d.day_summary)+'</div>';
    if(d.courses&&d.courses.length){h+='<nav class="class-crumbs" aria-label="Classes today"><span>Jump to:</span>';d.courses.forEach(function(c,i){h+='<a href="#'+courseAnchor(c,i)+'">'+esc(c.short||c.name)+'</a>';});h+='</nav>';d.courses.forEach(function(c,i){h+=renderCourse(c,i);});}else{h+='<div class="empty">No classes this day.</div>';}
    if(d.other_deliverables&&d.other_deliverables.length){h+='<h3 class="sec" style="margin-top:24px">Also due</h3>';d.other_deliverables.forEach(function(x){h+=renderDeliv(x);});}
    h+='<footer>Generated from bCourses + your calendar. Recall over accuracy: if something looks missing, it may not be posted yet.</footer>';
    app.innerHTML=h;setAudio(d.audio||(date==='2026-10-08'?'audio08.mp3':null)||(date==='2026-10-07'?'audio07.mp3':null)||(date==='2026-10-06'?'audio06.mp3':null)||(date==='2026-10-05'?'audio05.mp3':null)||(date==='2026-10-03'?'audio03.mp3':null)||(date==='2026-10-02'?'audio02.mp3':null)||(date==='2026-10-01'?'audio01.mp3':null)||(date==='2026-09-30'?'audio30.mp3':null)||(date==='2026-09-17'?'https://drive.usercontent.google.com/download?id=1Ee99cJkRNWJIpX71Xy3PbDL6fzqsgJp8&export=download':null));window.scrollTo(0,0);
  }).catch(function(){
    app.innerHTML='<div class="day-head"><h1>'+fmtDay(date)+'</h1></div><div class="empty">No brief generated for this day yet.<br><br><a class="btn" href="#/day/'+todayStr()+'">Back to today</a></div>';setAudio(null);
  });
}
function loadWeek(wk){
  state.date=wk;app.innerHTML='<div class="loading">Loading week…</div>';setAudio(null);
  loadRuntime().then(function(rt){var w=rt.weeks&&rt.weeks[wk];if(!w)throw new Error('nf');return w;}).then(function(w){
    var h='<div class="day-head"><h1>Week of '+esc(w.range||wk)+'</h1><div class="sub">Weekly prep view'+(w.generated_at?' · updated '+esc(w.generated_at):'')+'</div></div>';
    if(w.summary)h+='<div class="summary">'+esc(w.summary)+'</div>';
    if(w.total_est_hours)h+='<div class="wk-total">Estimated total prep: <b>'+w.total_est_hours+'h</b> this week</div>';
    (w.courses||[]).forEach(function(c){
      h+='<section class="wk-course"><h2>'+esc(c.short||c.name)+'</h2><div class="sess">'+esc((c.sessions||[]).join(' · '))+'</div>';
      if(c.agenda)h+='<div style="font-size:14px;margin-bottom:8px">'+esc(c.agenda)+'</div>';
      if(c.readings&&c.readings.length){h+='<h3 class="sec">Readings / prep</h3><ul>';c.readings.forEach(function(r){h+='<li>'+esc(r)+'</li>';});h+='</ul>';}
      if(c.deliverables&&c.deliverables.length){h+='<h3 class="sec">Deliverables</h3>';c.deliverables.forEach(function(d){h+=renderDeliv(d);});}
      if(c.est_hours)h+='<div class="hrs">~'+c.est_hours+'h prep</div>';
      h+='</section>';
    });
    h+='<footer>Weekly view generated Sunday mornings. Daily pages carry the full detail.</footer>';
    app.innerHTML=h;window.scrollTo(0,0);
  }).catch(function(){
    app.innerHTML='<div class="day-head"><h1>Week</h1></div><div class="empty">No weekly view generated yet. It is created every Sunday morning.<br><br><a class="btn" href="#/day/'+todayStr()+'">Back to today</a></div>';
  });
}
route();
})();
