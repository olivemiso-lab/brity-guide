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
  document.documentElement.classList.add('js');
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var KEY='brity-guide-checklists-v1';
  var store={};
  try{store=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){store={};}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}

  /* 모바일 메뉴 */
  var nav=$('#nav'), menuBtn=$('#menuBtn');
  var backdrop=document.createElement('div'); backdrop.className='nav-backdrop'; document.body.appendChild(backdrop);
  function closeMenu(){ nav.classList.remove('open'); backdrop.classList.remove('show'); document.body.classList.remove('menu-open'); if(menuBtn) menuBtn.setAttribute('aria-expanded','false'); }
  backdrop.addEventListener('click',closeMenu);
  if(menuBtn){menuBtn.addEventListener('click',function(){var o=nav.classList.toggle('open');backdrop.classList.toggle('show',o);document.body.classList.toggle('menu-open',o);menuBtn.setAttribute('aria-expanded',o?'true':'false');});
    $$('a',nav).forEach(function(a){a.addEventListener('click',closeMenu);});}

  /* 스크롤 진행 + 현재 섹션 표시 + 맨 위로 */
  var prog=$('#progress'), toTop=$('#toTop');
  var navLinks=[]; var targets=[];
  var pg=document.body.getAttribute('data-page'); $$('#nav a').forEach(function(a){a.classList.toggle('active',a.getAttribute('data-nav')===pg);});
  function onScroll(){
    var h=document.documentElement; var max=h.scrollHeight-h.clientHeight; var y=h.scrollTop||document.body.scrollTop;
    if(prog) prog.style.width=(max>0?Math.min(100,y/max*100):0)+'%';
    if(toTop) toTop.classList.toggle('show',y>600);
    var curEl=null; for(var i=0;i<targets.length;i++){ if(targets[i]&&targets[i].getBoundingClientRect().top<=90) curEl=targets[i]; }
    navLinks.forEach(function(a){a.classList.toggle('active',!!curEl&&a.getAttribute('href')==='#'+curEl.id);});
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(toTop) toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});


  /* 5단계 탭 */
  var stepsWrap=$('#steps');
  if(stepsWrap){
    var stepEls=$$('.step',stepsWrap);
    function showStep(id,scroll){
      var found=false;
      stepEls.forEach(function(s){var on=s.id===id; s.classList.toggle('active',on); if(on)found=true;});
      if(!found){ stepEls.forEach(function(s,i){s.classList.toggle('active',i===0);}); id=stepEls[0].id; }
      $$('.step-card').forEach(function(c){c.classList.toggle('current',c.getAttribute('data-tab')===id);});
      $$('.seg a').forEach(function(c){c.classList.toggle('current',c.getAttribute('data-tab')===id);});
      if(scroll){ var top=stepsWrap.getBoundingClientRect().top+window.pageYOffset-124; window.scrollTo({top:top,behavior:'smooth'}); }
    }
    document.addEventListener('click',function(e){
      var a=e.target.closest('[data-tab]'); if(!a) return;
      e.preventDefault(); var id=a.getAttribute('data-tab'); history.replaceState(null,'','#'+id); showStep(id,true);
    });
    $$('.chip[href^="#step"]').forEach(function(ch){ ch.setAttribute('data-tab',ch.getAttribute('href').slice(1)); });
    var initial=(location.hash||'#step1').slice(1);
    if(/^step[1-6]$/.test(initial)){ showStep(initial,false); if(location.hash){ setTimeout(function(){showStep(initial,true);},50);} }
    else { showStep('step1',false); }
    window.addEventListener('hashchange',function(){ var h=location.hash.slice(1); if(/^step[1-6]$/.test(h)) showStep(h,true); });
  }


  /* 사이드바: 현재 페이지·위치 표시, 단계 완료, 전체 진행률 */
  var sbEl=$('#sidebar');
  if(sbEl){
    document.body.classList.add('has-sidebar');
    var page=(location.pathname.split('/').pop()||'index.html');
    var pgKey=page.replace('.html','')||'index'; if(pgKey==='appendix') pgKey='guide';
    $$('.sb-group[data-part]',sbEl).forEach(function(gp){ var isCur=gp.getAttribute('data-part')===pgKey; gp.classList.toggle('collapsed',!isCur); var lab=$('.sb-label',gp); if(lab){ lab.setAttribute('role','button'); lab.setAttribute('tabindex','0'); lab.style.cursor='pointer'; var toggle=function(){gp.classList.toggle('collapsed');}; lab.addEventListener('click',toggle); lab.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();} }); } });
    var sbLinks=$$('[data-sb]',sbEl);
    var sbTargets=sbLinks.map(function(a){var v=a.getAttribute('data-sb'); var f=v.split('#')[0], h=v.split('#')[1]; return (f===page&&h)?document.getElementById(h):null;});
    function sbSpy(){
      var cur=null; var onGuideTabs=!!$('#steps');
      for(var i=0;i<sbTargets.length;i++){ var t=sbTargets[i]; if(!t) continue; if(onGuideTabs&&t.classList.contains('step')&&!t.classList.contains('active')) continue; if(t.getBoundingClientRect().top<=120) cur=i; }
      sbLinks.forEach(function(a,i){a.classList.toggle('active',i===cur||(cur===null&&a.getAttribute('data-sb')===page&&page==='index.html'));});
      if(cur===null){ var home=$('.sb-home',sbEl); if(home) home.classList.toggle('active',page==='index.html'); }
    }
    window.addEventListener('scroll',sbSpy,{passive:true}); sbSpy();
    document.addEventListener('click',function(e){ if(e.target.closest('[data-tab]')) setTimeout(sbSpy,450); });
    // 길라잡이 페이지에서는 단계 링크가 탭을 바꾸도록
    if($('#steps')) $$('.sb-step',sbEl).forEach(function(a){ a.setAttribute('data-tab','step'+a.getAttribute('data-sbstep')); });
  }
  function sbUpdate(){
    if(!sbEl) return; var total=0,n=0;
    var ids=['step1','step2','step3','step4','step5','step6']; var counts=[6,8,7,8,8,3];
    ids.forEach(function(id,i){ var st=store[id]||[]; var c=0; st.forEach(function(v){if(v)c++;}); n+=c; total+=counts[i]; var a=$('[data-sbstep="'+(i+1)+'"]',sbEl); if(a) a.classList.toggle('done',c===counts[i]); var sg=$('.seg a[data-tab="'+id+'"]'); if(sg) sg.classList.toggle('done',c===counts[i]); });
    var p=$('#sbProgress'); if(p) p.textContent=n+' / '+total; var m=$('#sbMeter'); if(m) m.style.width=(n/total*100)+'%';
  }


  /* 화면에 들어올 때 살짝 떠오르기 */
  var revealEls=$$('.card, .step-card, .promise, .scenario, .chart, .tile, .door, .kpi, .quote, .week, .media, .deck');
  if('IntersectionObserver' in window && revealEls.length){
    revealEls.forEach(function(el,i){ el.classList.add('reveal'); el.style.transitionDelay=((i%6)*40)+'ms'; });
    var io=new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{rootMargin:'0px 0px -8% 0px',threshold:.05});
    revealEls.forEach(function(el){ io.observe(el); });
    setTimeout(function(){ revealEls.forEach(function(el){ el.classList.add('in'); }); },2500);
  }

  /* 체크리스트 */
  var lists=$$('.checklist[data-list]'); var totalN=0;
  function render(list){
    var id=list.getAttribute('data-list'); var boxes=$$('input[type=checkbox]',list); var st=store[id]||[];
    var n=0; boxes.forEach(function(b,i){b.checked=!!st[i]; b.parentNode.classList.toggle('on',b.checked); if(b.checked)n++;});
    var tag=$('.tag',list); if(tag) tag.textContent=n+'/'+boxes.length;
    var all=(n===boxes.length&&n>0); var wasComplete=list.classList.contains('complete'); list.classList.toggle('complete',all);
    var h4=$('h4',list); var cel=$('.celebrate',list);
    if(all&&!cel&&h4){ cel=document.createElement('span'); cel.className='celebrate'; cel.textContent='✓ 이 단계를 마쳤습니다'; h4.parentNode.insertBefore(cel,h4.nextSibling); }
    if(!all&&cel) cel.parentNode.removeChild(cel);
    var m=$('.meter i',list); if(m) m.style.width=(boxes.length?n/boxes.length*100:0)+'%';
    var done=$('[data-done="'+id.replace('step','')+'"]'); if(done) done.textContent=(n===boxes.length&&n>0)?'✓ 완료':(n>0?n+'/'+boxes.length:'');
    var td=$('[data-tocdone="'+id.replace('step','')+'"]'); if(td){ td.textContent='✓'; td.classList.toggle('on',n===boxes.length&&n>0); }
  }
  function renderTotal(){
    var n=0; lists.forEach(function(l){ (store[l.getAttribute('data-list')]||[]).forEach(function(v){if(v)n++;}); });
    var el=$('#totalProgress'); if(el) el.textContent=n+' / '+totalN;
  }
  lists.forEach(function(list){
    $$('label',list).forEach(function(l){ var txt=''; var nodes=Array.prototype.slice.call(l.childNodes); nodes.forEach(function(n){ if(n.nodeType===3){ txt+=n.textContent; l.removeChild(n);} }); var sp=document.createElement('span'); sp.className='t'; sp.textContent=txt.trim(); l.appendChild(sp); });
    var id=list.getAttribute('data-list'); var boxes=$$('input[type=checkbox]',list); totalN+=boxes.length;
    boxes.forEach(function(b,i){ b.addEventListener('change',function(){ var st=store[id]||(store[id]=[]); st[i]=b.checked; save(); render(list); renderTotal(); sbUpdate(); }); });
    var r=$('[data-reset]',list); if(r) r.addEventListener('click',function(){ if(confirm('이 단계의 체크 표시를 모두 지울까요?')){ store[id]=[]; save(); render(list); renderTotal(); sbUpdate(); } });
    render(list);
  });
  renderTotal(); sbUpdate();
  var resetAll=$('#resetAll'); if(resetAll) resetAll.addEventListener('click',function(){ if(confirm('모든 단계의 체크 표시를 지울까요?')){ store={}; save(); lists.forEach(render); renderTotal(); sbUpdate(); } });
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
      else frame='<div class="frame placeholder"><div><span><svg class="ic lg" aria-hidden="true"><use href="#i-film"/></svg></span>영상 준비 중</div></div>';
      return '<div class="media">'+frame+'<div class="body"><h4>'+esc(v.title)+'</h4><p>'+esc(v.desc)+'</p>'+(v.length?'<div class="meta">⏱ '+esc(v.length)+'</div>':'')+'</div></div>';
    }).join('');
  }
  var dl=$('#deckList'); if(dl&&window.TRAINING){
    dl.innerHTML=TRAINING.decks.map(function(d){
      var frame=d.embed?'<div class="frame"><iframe src="'+esc(d.embed)+'" title="'+esc(d.title)+'" loading="lazy" allowfullscreen></iframe></div>':'<div class="frame placeholder"><div><svg class="ic lg" aria-hidden="true"><use href="#i-presentation"/></svg> 슬라이드 준비 중</div></div>';
      var acts='';
      if(d.embed) acts+='<a class="btn outline small" href="'+esc(d.embed.replace(/\?embed.*$/,''))+'" target="_blank" rel="noopener">새 창에서 보기 ↗</a>';
      if(d.pdf) acts+='<a class="btn outline small" href="'+esc(d.pdf)+'" download>PDF 내려받기</a>';
      return '<div class="deck">'+frame+'<div class="body"><div><h4>'+esc(d.title)+'</h4><p>'+esc(d.desc)+'</p></div><div class="actions">'+acts+'</div></div></div>';
    }).join('');
  }


  /* 사이트 내 검색: 제목·FAQ·아코디언 요약을 색인 */
  var si=$('#siteSearch'), sr=$('#searchResults');
  if(si&&sr){
    var index=(window.SEARCH_INDEX||[]).slice();
    if(!index.length) $$('h2[id], h3[id], section[id] h2, section[id] h3, details summary, .tile, .faq details').forEach(function(el){
      var sec=el.closest('section[id]'); var secTitle=sec?($('h2',sec)||{}).textContent||'':'';
      var target=el.id?('#'+el.id):(el.closest('details')&&el.closest('details').id?('#'+el.closest('details').id):(el.id?('#'+el.id):(sec?('#'+sec.id):null)));
      if(el.classList.contains('tile')) target=el.getAttribute('href');
      if(!target) return;
      var title=(el.tagName==='SUMMARY'||el.classList.contains('tile'))?el.textContent:el.textContent;
      var body=''; if(el.tagName==='SUMMARY'){var p=el.parentNode; body=(p.textContent||'').slice(0,400);} else if(el.classList.contains('tile')){body=el.textContent;}
      index.push({t:title.replace(/\s+/g,' ').trim(), b:body.replace(/\s+/g,' ').trim(), href:target, sec:secTitle.trim()});
    });
    // 중복 제거
    var seen={}; index=index.filter(function(it){var k=it.href+'|'+it.t; if(seen[k]) return false; seen[k]=1; return true;});
    function hl(t,q){return esc(t).replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>');}
    si.addEventListener('input',function(){
      var q=si.value.trim(); if(q.length<1){sr.hidden=true; sr.innerHTML=''; return;}
      var ql=q.toLowerCase();
      var hits=index.filter(function(it){return it.t.toLowerCase().indexOf(ql)>=0||it.b.toLowerCase().indexOf(ql)>=0;}).slice(0,12);
      sr.hidden=false;
      sr.innerHTML=hits.length?hits.map(function(it){
        var i=it.b.toLowerCase().indexOf(ql); var snip=i>=0?it.b.slice(Math.max(0,i-30),i+70):it.b.slice(0,90);
        return '<a href="'+esc(it.href)+'"><b>'+hl(it.t,q)+'</b><span>'+(it.sec?esc(it.sec)+' · ':'')+hl(snip,q)+'</span></a>';
      }).join(''):'<div class="none">찾는 내용이 없습니다. 다른 말로 입력해 보세요. 예: 편집, 링크, 알림</div>';
    });
    sr.addEventListener('click',function(e){ var a=e.target.closest('a'); if(!a) return; sr.hidden=true; var href=a.getAttribute('href'); if(href.indexOf('#')!==0) return; var el=$(href); var d=el&&el.closest?el.closest('details'):null; if(d) d.open=true; if(el&&el.tagName==='DETAILS') el.open=true; });
    document.addEventListener('click',function(e){ if(!e.target.closest('.search-box')) sr.hidden=true; });
    si.addEventListener('keydown',function(e){ if(e.key==='Escape'){sr.hidden=true;} if(e.key==='Enter'){var a=$('a',sr); if(a) a.click();} });
  }


  /* 우리 학교 사용 약속 만들기 */
  var pb=$('#promiseBuilder');
  if(pb){
    var PKEY='brity-guide-promises-v1'; var pst={};
    try{pst=JSON.parse(localStorage.getItem(PKEY)||'{}')||{};}catch(e){pst={};}
    var P=[
      ['워크스페이스, 대화방, 쪽지, Brity 드라이브 등의 용도를 구분해요.','어떤 내용을 어디에 올릴 것인가를 가장 먼저 정합니다.'],
      ['공지는 정해진 형식으로 작성해요.','제목에 [제출] [안내] [협조] [일정] 분류를 표시하고, 내용·기한·링크·문의를 적습니다.'],
      ['질문과 답변은 해당 공지의 답글로 남겨요.','여러 사람에게 도움이 되는 질문은 해당 공지의 답글(스레드)로 남깁니다. 개인정보가 포함된 내용은 별도 연락 방법을 활용합니다.'],
      ['단순 확인은 이모지로 표시해요.','"확인했습니다", "네" 같은 답글 대신 이모지 반응으로 표시합니다.'],
      ['자료는 가급적 드라이브 링크로 공유해요.','공동으로 사용하거나 수정하는 자료는 Brity 드라이브에 보관하고 링크로 공유합니다.'],
      ['메시지 발송 시간과 알림을 배려해요.','근무시간 외 또는 휴일에는 긴급하지 않은 메시지 발송을 자제하고, 다음 근무일에 전달해도 되는 내용은 예약 발송 기능을 활용합니다.'],
      ['개인정보와 공식 업무처리 기준을 지켜요.','학생 개인정보나 민감한 내용은 공개 워크스페이스에 게시하지 않고, 전자결재 등 공식 절차가 필요한 업무는 기존 시스템과 절차를 따릅니다.']
    ];
    var inputs=$$('[data-b]',pb), picks=$$('[data-bp]',pb), sheet=$('#bSheet');
    inputs.forEach(function(i){ if(pst[i.getAttribute('data-b')]) i.value=pst[i.getAttribute('data-b')]; });
    picks.forEach(function(p){ var k='p'+p.getAttribute('data-bp'); if(k in pst) p.checked=!!pst[k]; });
    function v(k){ var i=$('[data-b="'+k+'"]',pb); return i&&i.value.trim(); }
    function fill(val,ph){ return val?('<span class="fill">'+esc(val)+'</span>'):('<span class="fill">'+ph+'</span>'); }
    function renderSheet(){
      var school=v('school'), ws=v('ws'), time=v('time'), ask=v('ask');
      var circ=['①','②','③','④','⑤','⑥','⑦']; var items='';
      picks.forEach(function(p,i){ if(!p.checked) return; var extra='';
        if(i===0&&ws) extra='<span>전체 공지는 <b>'+esc(ws)+'</b> 워크스페이스에 게시합니다.</span>';
        if(i===5&&time) extra='<span>우리 학교는 <b>'+esc(time)+'</b>에는 긴급하지 않은 메시지 발송을 자제합니다.</span>';
        items+='<li><b>'+circ[i]+' '+esc(P[i][0])+'</b><span>'+esc(P[i][1])+'</span>'+extra+'</li>'; });
      sheet.innerHTML='<h4>'+fill(school,'○○초등학교')+' Brity 메신저 사용 약속</h4><p class="sub">학교 구성원이 함께 지키는 사용 원칙 · 출처: 우리 학교 Brity 메신저 정착 길라잡이(2026 경기도학교업무개선정책실행연구회 1분과)</p>'
        +(items?'<ol>'+items+'</ol>':'<p style="color:var(--muted)">지킬 약속을 하나 이상 고르세요.</p>')
        +'<div class="foot">사용 중 궁금한 점은 '+fill(ask,'문의 창구')+'에 문의합니다.</div>';
    }
    function savePB(){ inputs.forEach(function(i){pst[i.getAttribute('data-b')]=i.value;}); picks.forEach(function(p){pst['p'+p.getAttribute('data-bp')]=p.checked;}); try{localStorage.setItem(PKEY,JSON.stringify(pst));}catch(e){} }
    pb.addEventListener('input',function(){savePB();renderSheet();}); pb.addEventListener('change',function(){savePB();renderSheet();});
    renderSheet();
    var bc=$('#bCopy'); if(bc) bc.addEventListener('click',function(){ var t=sheet.innerText.replace(/\n{3,}/g,'\n\n').trim(); var ok=function(){var c=$('#bCopied'); if(c){c.hidden=false; setTimeout(function(){c.hidden=true;},2000);} };
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(ok,function(){fallback(t);ok();}); } else { fallback(t); ok(); } });
    var bp=$('#bPrint'); if(bp) bp.addEventListener('click',function(){ document.body.classList.add('print-sheet'); window.print(); setTimeout(function(){document.body.classList.remove('print-sheet');},500); });
  }


  /* 부록 진단표 */
  var DKEY='brity-guide-diag-v1'; var dst={};
  try{dst=JSON.parse(localStorage.getItem(DKEY)||'{}')||{};}catch(e){dst={};}
  function dsave(){try{localStorage.setItem(DKEY,JSON.stringify(dst));}catch(e){}}
  var diags=$$('.diag[data-diag]');
  if(diags.length){
    var VERD={pre:[[4,'현재 소통 환경 양호','기존 강점 유지 및 필요한 부분 보완','g'],[3,'일부 개선 필요','취약 영역 중심으로 전환 계획 수립','y'],[1,'전반적 개선 필요','소통 기준 정비 및 집중 지원 방안 마련','r']],
              post:[[4,'안정적 정착','지속 운영 및 정기 점검','g'],[3,'부분 정착','취약 영역 중심 보완','y'],[1,'집중 개선 필요','운영 기준 재점검 및 추가 지원','r']]};
    function dvals(key){ var v=[]; for(var i=1;i<=10;i++){ var x=dst[key+'q'+i]; v.push(x?Number(x):null);} return v; }
    function davg(key){ var v=dvals(key).filter(function(x){return x;}); if(v.length<10) return null; return v.reduce(function(a,b){return a+b;},0)/10; }
    function renderDiag(d){
      var key=d.getAttribute('data-diag');
      $$('.qrow',d).forEach(function(r,i){ var val=dst[key+'q'+(i+1)]; $$('label',r).forEach(function(l){ var inp=$('input',l); inp.checked=(val&&String(val)===inp.value); l.classList.toggle('on',inp.checked); }); });
      var avg=davg(key); var cnt=dvals(key).filter(function(x){return x;}).length;
      var ae=$('[data-avg]',d), ve=$('[data-verdict]',d);
      if(avg===null){ ae.innerHTML=(cnt?cnt+'/10':'–')+'<small>10문항 평균</small>'; ve.innerHTML='<b>'+(cnt?'남은 문항 '+(10-cnt)+'개에 점수를 매기세요':'문항에 점수를 매기면 판정이 나옵니다')+'</b><span>'+(key==='pre'?'4.0~5.0 현재 소통 환경 양호 · 3.0~3.9 일부 개선 필요 · 1.0~2.9 전반적 개선 필요':'4.0~5.0 안정적 정착 · 3.0~3.9 부분 정착 · 1.0~2.9 집중 개선 필요')+'</span>'; }
      else { var vv=VERD[key].filter(function(x){return avg>=x[0];})[0]||VERD[key][2]; ae.innerHTML=avg.toFixed(1)+'<small>10문항 평균</small>'; ve.innerHTML='<b><span class="lv '+vv[3]+'">'+(key==='pre'?'출발점':'정착 수준')+'</span>'+vv[1]+'</b><span>'+vv[2]+'</span>'; }
    }
    diags.forEach(function(d){ var key=d.getAttribute('data-diag');
      d.addEventListener('change',function(e){ var t=e.target; if(t.type!=='radio') return; var m=t.name.match(/q(\d+)$/); dst[key+'q'+m[1]]=t.value; dsave(); renderDiag(d); renderCmp(); });
      var rb=$('[data-diagreset="'+key+'"]'); if(rb) rb.addEventListener('click',function(){ if(confirm('이 진단표의 점수를 모두 지울까요?')){ for(var i=1;i<=10;i++) delete dst[key+'q'+i]; dsave(); renderDiag(d); renderCmp(); } });
      renderDiag(d); });
    $$('[data-pick]').forEach(function(box){ var k=box.getAttribute('data-pick'); $$('input',box).forEach(function(inp){ var saved=dst[k]||[]; if(inp.type==='radio') inp.checked=(saved===inp.value); else inp.checked=saved.indexOf(inp.value)>=0;
      inp.addEventListener('change',function(){ if(inp.type==='radio') dst[k]=inp.value; else dst[k]=$$('input',box).filter(function(i){return i.checked;}).map(function(i){return i.value;}); dsave(); }); }); });
    function renderCmp(){
      var t=$('#cmpTable'); if(!t) return; var pre=dvals('pre'), post=dvals('post');
      for(var i=1;i<=10;i++){ var a=pre[i-1], b=post[i-1]; $('[data-pre="'+i+'"]',t).textContent=a?a.toFixed(1)+'점':'–'; $('[data-post="'+i+'"]',t).textContent=b?b.toFixed(1)+'점':'–'; var de=$('[data-delta="'+i+'"]',t); if(a&&b){ var d=b-a; de.textContent=(d>0?'+':'')+d.toFixed(1); de.className='num delta '+(d>0?'up':d<0?'down':''); } else { de.textContent='–'; de.className='num delta'; } }
      var pa=davg('pre'), pb=davg('post'); $('[data-pre="avg"]',t).textContent=pa!==null?pa.toFixed(2)+'점':'–'; $('[data-post="avg"]',t).textContent=pb!==null?pb.toFixed(2)+'점':'–'; var dd=$('[data-delta="avg"]',t); if(pa!==null&&pb!==null){ var d2=pb-pa; dd.textContent=(d2>0?'+':'')+d2.toFixed(2); dd.className='num delta '+(d2>0?'up':d2<0?'down':''); } else { dd.textContent='–'; dd.className='num delta'; }
    }
    renderCmp();
    var ops=$('#opsTable');
    if(ops){ $$('[data-op]',ops).forEach(function(i){ if(dst['op_'+i.getAttribute('data-op')]!==undefined) i.value=dst['op_'+i.getAttribute('data-op')]; i.addEventListener('input',function(){ dst['op_'+i.getAttribute('data-op')]=i.value; dsave(); renderOps(); }); i.addEventListener('change',function(){ dst['op_'+i.getAttribute('data-op')]=i.value; dsave(); renderOps(); }); });
      function v(k){ var x=dst['op_'+k]; return (x===undefined||x==='')?null:Number(x); }
      function renderOps(){
        [['ws','ws_a','ws_b'],['fmt','fmt_a','fmt_b'],['new','new_a','new_b']].forEach(function(r){ var a=v(r[1]), b=v(r[2]); $('[data-res="'+r[0]+'"]',ops).textContent=(a!==null&&b)?(a/b*100).toFixed(1)+'%':'–'; });
        [['dup','dup_pre','dup_post'],['ask','ask_pre','ask_post'],['file','file_pre','file_post']].forEach(function(r){ var a=v(r[1]), b=v(r[2]); var el=$('[data-res="'+r[0]+'"]',ops); if(b===null){el.textContent='–';return;} if(a===null){el.textContent='전환 후 '+b+'건 (전환 전 자료 없음)';return;} var d=b-a; el.textContent=a+'건 → '+b+'건 ('+(d>0?'+':'')+d+'건)'; });
        var h=dst['op_handover']; $('[data-res="handover"]',ops).textContent=h||'–';
      }
      renderOps();
    }
    var dp=$('#diagPrint'); if(dp) dp.addEventListener('click',function(){ window.print(); });
    var dr=$('#diagResetAll'); if(dr) dr.addEventListener('click',function(){ if(confirm('부록1·2·3의 입력을 모두 지울까요?')){ dst={}; dsave(); location.reload(); } });
  }

  /* 해시로 열린 아코디언 펼치기 */
  function openHash(){ var h=location.hash; if(!h) return; var el=$(h); if(!el) return; var d=el.closest&&el.closest('details'); if(d) d.open=true; if(el.tagName==='DETAILS') el.open=true; }
  window.addEventListener('hashchange',openHash); openHash();
})();
