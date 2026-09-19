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
var RUNTIME_URL='https://drive.google.com/uc?export=download&id=13HBt6ENPHHHKDOKLFGNWiEowriBwzKZc';
var runtimePromise=null;
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
function weekId(dateStr){var d=parseDate(dateStr);var day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return iso(d);}
function setAudio(src){
  if(!src){fab.hidden=true;return;}
  audio.src=src;fab.hidden=false;fab.classList.remove('playing');fab.innerHTML='▶ <span>Listen</span>';
}
fab.onclick=function(){
  if(audio.paused){audio.play();fab.classList.add('playing');fab.innerHTML='❚❚ <span>Playing</span>';}
  else{audio.pause();fab.classList.remove('playing');fab.innerHTML='▶ <span>Listen</span>';}
};
audio.onended=function(){fab.classList.remove('playing');fab.innerHTML='▶ <span>Listen</span>';};
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
    app.innerHTML=h;setAudio(d.audio||(date==='2026-09-17'?'https://drive.google.com/uc?export=download&id=1Ee99cJkRNWJIpX71Xy3PbDL6fzqsgJp8':null));window.scrollTo(0,0);
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
