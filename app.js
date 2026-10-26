/* ===== 연수 자료 목록 (여기만 고치면 됩니다) =====
   동영상: youtube 는 영상 주소의 v= 뒤 11자리 ID / 구글 드라이브 영상은 drive:'파일ID' (링크 공유 설정 필요) / 직접 파일은 file:'video/파일명.mp4' (작은 파일만)
   슬라이드: Canva 공유 → 더보기 → 삽입(Embed) 에서 나온 주소를 embed 에 넣고, PDF로 내려받을 파일이 있으면 pdf 에 경로 */
var TRAINING = {
  videos: [
    { title: '브리티 메신저 시작하기', desc: '설치·로그인부터 워크스페이스 공지 확인까지', youtube: '', length: '' },
    { title: '한글 협업문서 함께 작성하기', desc: '링크로 열기 → 편집 → 내 칸 입력 → 저장', youtube: '', length: '' }
  ],
  decks: [
    { title: '브리티 메신저 사용 설명서 (연수 슬라이드)', desc: '교직원 연수용 Canva 슬라이드', embed: '', pdf: '' }
  ]
};

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


  /* 연수 자료 렌더링 */
  function esc(t){return String(t||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  var vg=$('#videoGrid'); if(vg&&window.TRAINING){
    vg.innerHTML=TRAINING.videos.map(function(v){
      var frame;
      if(v.youtube) frame='<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/'+esc(v.youtube)+'?rel=0" title="'+esc(v.title)+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>';
      else if(v.drive) frame='<div class="frame"><iframe src="https://drive.google.com/file/d/'+esc(v.drive)+'/preview" title="'+esc(v.title)+'" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe></div>';
      else if(v.file) frame='<div class="frame"><video controls preload="metadata" src="'+esc(v.file)+'"></video></div>';
      else frame='<div class="frame placeholder"><div><span>🎬</span>영상 준비 중</div></div>';
      return '<div class="media">'+frame+'<div class="body"><h4>'+esc(v.title)+'</h4><p>'+esc(v.desc)+'</p>'+(v.length?'<div class="meta">⏱ '+esc(v.length)+'</div>':'')+'</div></div>';
    }).join('');
  }
  var dl=$('#deckList'); if(dl&&window.TRAINING){
    dl.innerHTML=TRAINING.decks.map(function(d){
      var frame=d.embed?'<div class="frame"><iframe src="'+esc(d.embed)+'" title="'+esc(d.title)+'" loading="lazy" allowfullscreen></iframe></div>':'<div class="frame placeholder"><div>📑 슬라이드 준비 중</div></div>';
      var acts='';
      if(d.embed) acts+='<a class="btn outline small" href="'+esc(d.embed.replace(/\?embed.*$/,''))+'" target="_blank" rel="noopener">새 창에서 보기 ↗</a>';
      if(d.pdf) acts+='<a class="btn outline small" href="'+esc(d.pdf)+'" download>PDF 내려받기</a>';
      return '<div class="deck">'+frame+'<div class="body"><div><h4>'+esc(d.title)+'</h4><p>'+esc(d.desc)+'</p></div><div class="actions">'+acts+'</div></div></div>';
    }).join('');
  }

  /* 해시로 열린 아코디언 펼치기 */
  function openHash(){ var h=location.hash; if(!h) return; var el=$(h); if(!el) return; var d=el.closest&&el.closest('details'); if(d) d.open=true; }
  window.addEventListener('hashchange',openHash); openHash();
})();
