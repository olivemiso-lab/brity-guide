#!/usr/bin/env python3
"""모든 페이지의 제목·FAQ·타일을 모아 search-index.js 를 만듭니다. 내용을 고친 뒤 실행:  python3 tools/build_search_index.py"""
import re, html, json, os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pages={'index':'홈','intro':'메신저 소개','guide':'정착 길라잡이','cases':'활용 사례','faq':'FAQ'}
def text(s): return html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>','',s))).strip()
out=[]
for pg,label in pages.items():
    src=open(os.path.join(root,pg+'.html'),encoding='utf-8').read()
    main=src[src.index('<main'):src.index('</main>')]
    # 섹션 제목
    for m in re.finditer(r'<section[^>]*id="([^"]+)"[^>]*>(.*?)</section>',main,re.S):
        sid,body=m.group(1),m.group(2)
        h2=re.search(r'<h2[^>]*>(.*?)</h2>',body,re.S)
        sec_title=text(h2.group(1)) if h2 else label
        if h2: out.append({'t':sec_title,'b':text(body)[:200],'href':f'{pg}.html#{sid}','sec':label})
        for h in re.finditer(r'<h3[^>]*?(?:id="([^"]+)")?[^>]*>(.*?)</h3>',body,re.S):
            hid=h.group(1); t=text(h.group(2))
            if t and len(t)<80: out.append({'t':t,'b':'','href':f'{pg}.html#{hid or sid}','sec':sec_title})
        for d in re.finditer(r'<details[^>]*?(?:id="([^"]+)")?[^>]*>\s*<summary>(.*?)</summary>(.*?)</details>',body,re.S):
            did=d.group(1); t=text(d.group(2)); b=text(d.group(3))[:400]
            out.append({'t':t,'b':b,'href':f'{pg}.html#{did or sid}','sec':sec_title})
        for tl in re.finditer(r'<a class="tile" href="([^"]+)">(.*?)</a>',body,re.S):
            out.append({'t':text(tl.group(2)),'b':'','href':tl.group(1) if '.html' in tl.group(1) else f'{pg}.html{tl.group(1)}','sec':label})
# 중복 제거
seen=set(); uniq=[]
for it in out:
    k=(it['href'],it['t'])
    if k in seen: continue
    seen.add(k); uniq.append(it)
open(os.path.join(root,'search-index.js'),'w',encoding='utf-8').write('window.SEARCH_INDEX='+json.dumps(uniq,ensure_ascii=False)+';\n')
print(len(uniq),'entries')
