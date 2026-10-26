(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var KEY='brity-guide-checklists-v1';
  var store={};
  try{store=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){store={};}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}

  /* 모바일 메뉴 */
  var nav=$('#nav'), menuBtn=$('#menuBtn');
  if(menuBtn){menuBtn.addEventListener('click',function(){var o=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o?'true':'false');});
    $$('a',nav).forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');});});}

  /* 스크롤 진행 + 현재 섹션 표시 + 맨 위로 */
  var prog=$('#progress'), toTop=$('#toTop');
  var navLinks=$$('#nav a'); var targets=navLinks.map(function(a){return $(a.getAttribute('href'));});
  function onScroll(){
    var h=document.documentElement; var max=h.scrollHeight-h.clientHeight; var y=h.scrollTop||document.body.scrollTop;
    if(prog) prog.style.width=(max>0?Math.min(100,y/max*100):0)+'%';
    if(toTop) toTop.classList.toggle('show',y>600);
    var cur=-1; for(var i=0;i<targets.length;i++){ if(targets[i]&&targets[i].getBoundingClientRect().top<=90) cur=i; }
    navLinks.forEach(function(a,i){a.classList.toggle('active',i===cur);});
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(toTop) toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});

  /* 체크리스트 */
  var lists=$$('.checklist[data-list]'); var totalN=0;
  function render(list){
    var id=list.getAttribute('data-list'); var boxes=$$('input[type=checkbox]',list); var st=store[id]||[];
    var n=0; boxes.forEach(function(b,i){b.checked=!!st[i]; b.parentNode.classList.toggle('on',b.checked); if(b.checked)n++;});
    var tag=$('.tag',list); if(tag) tag.textContent=n+'/'+boxes.length;
    var m=$('.meter i',list); if(m) m.style.width=(boxes.length?n/boxes.length*100:0)+'%';
    var done=$('[data-done="'+id.replace('step','')+'"]'); if(done) done.textContent=(n===boxes.length&&n>0)?'✓ 완료':(n>0?n+'/'+boxes.length:'');
  }
  function renderTotal(){
    var n=0; lists.forEach(function(l){ (store[l.getAttribute('data-list')]||[]).forEach(function(v){if(v)n++;}); });
    var el=$('#totalProgress'); if(el) el.textContent=n+' / '+totalN;
  }
  lists.forEach(function(list){
    var id=list.getAttribute('data-list'); var boxes=$$('input[type=checkbox]',list); totalN+=boxes.length;
    boxes.forEach(function(b,i){ b.addEventListener('change',function(){ var st=store[id]||(store[id]=[]); st[i]=b.checked; save(); render(list); renderTotal(); }); });
    var r=$('[data-reset]',list); if(r) r.addEventListener('click',function(){ if(confirm('이 단계의 체크 표시를 모두 지울까요?')){ store[id]=[]; save(); render(list); renderTotal(); } });
    render(list);
  });
  renderTotal();
  var resetAll=$('#resetAll'); if(resetAll) resetAll.addEventListener('click',function(){ if(confirm('모든 단계의 체크 표시를 지울까요?')){ store={}; save(); lists.forEach(render); renderTotal(); } });
  var printBtn=$('#printBtn'); if(printBtn) printBtn.addEventListener('click',function(){ $$('details').forEach(function(d){d.open=true;}); window.print(); });

  /* 템플릿 복사 */
  $$('[data-copy]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var src=$('#'+btn.getAttribute('data-copy')); if(!src) return;
      var text=src.innerText.replace(/\s*←[^\n]*/g,'').replace(/[ \t]+\n/g,'\n').trim();
      var ok=function(){ var c=$('[data-copied="'+btn.getAttribute('data-copy')+'"]'); if(c){c.hidden=false; setTimeout(function(){c.hidden=true;},2000);} };
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(ok,function(){fallback(text);ok();}); } else { fallback(text); ok(); }
    });
  });
  function fallback(t){ var ta=document.createElement('textarea'); ta.value=t; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');}catch(e){} document.body.removeChild(ta); }

  /* 해시로 열린 아코디언 펼치기 */
  function openHash(){ var h=location.hash; if(!h) return; var el=$(h); if(!el) return; var d=el.closest&&el.closest('details'); if(d) d.open=true; }
  window.addEventListener('hashchange',openHash); openHash();
})();
