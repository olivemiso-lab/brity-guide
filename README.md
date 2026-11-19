# 우리 학교 Brity 메신저 정착 길라잡이

**사이트: https://brity-guide.vercel.app/**

GOE 메신저에서 Brity 메신저로 전환하는 학교를 위한 **학교 맞춤형 6단계 실천 가이드** 웹사이트입니다.
2026 경기도학교업무개선정책실행연구회 1분과(G-ONE 현장 적용 사례·안착 방안 연구) 연구 자료를 바탕으로 만들었습니다.

## 구성
- `index.html` 홈 · `intro.html` 메신저 소개 · `guide.html` 정착 길라잡이(6단계, 설문 분석) · `cases.html` 활용 사례 · `faq.html` FAQ · `appendix.html` 부록 진단표
- `style.css` — 스타일 (모바일 대응, 인쇄 스타일 포함)
- `app.js` — 체크리스트 저장(localStorage), 공지 템플릿 복사, 메뉴·진행률
- `img/` — 길라잡이 삽화

빌드 도구 없이 순수 HTML·CSS·JS로만 작성되어 파일을 바로 고쳐 올리면 됩니다.

## 배포 (Vercel)
Vercel 프로젝트가 이 저장소에 연결되어 있어 `main`에 푸시하면 https://brity-guide.vercel.app/ 에 자동으로 다시 배포됩니다. 빌드 명령 없는 정적 사이트입니다.

## 연수 자료(소개 영상·연수 슬라이드) 넣기
`app.js` 맨 위 `TRAINING` 목록만 고치면 됩니다. 파일은 `training/` 폴더에 있습니다.
- 소개 영상: `training/brity-guide-intro.mp4` (2분 21초), 첫 화면 `training/intro-poster.jpg`. 음악을 바꾸려면 같은 이름으로 덮어쓰면 됩니다.
  YouTube로 바꾸려면 `file` 대신 `youtube: '영상ID'` (주소의 `v=` 뒤 11자리).
- 연수 슬라이드: 그림 `training/slides/01.png`~`21.png` (PPT의 발표용 21장, 숨김 슬라이드 제외), 장마다 제목은 `slides.titles`.
  PDF `training/brity-training-slides.pdf`, 학교 수정용 원본 `training/brity-training-school-edit.pptx`. 내려받기를 빼려면 `pdf`·`pptx` 줄을 지웁니다.
- 슬라이드를 새로 뽑을 때: PowerPoint에서 숨김이 아닌 슬라이드만 1920×1080 PNG로 내보내고, PDF는 "다른 이름으로 저장 → PDF"(숨김 슬라이드 제외).

## 원문과 다른 곳 (검토 의견 반영분, 작성자 확인 전)
- 적용 예시 ①의 공지 날짜를 평일로, ①·④의 첨부 파일을 드라이브 링크로 바꿈
- 적용 예시 ③을 "평가계획 작성 방법 문의"에서 "공지와 무관한 개별 문의"로 바꿈
- 약속 ⑥ 본문 끝을 "활용하도록 합니다"로 고침
- 9가지 약속 포스터 그림은 싣지 않고 본문의 7가지만 사용
- 설문 만족도 평균은 원자료 집계값(2.6)을 사용 (원문 본문 2.46)

## 원칙
- 학교명과 개인 이름은 싣지 않습니다. 현장 사례는 'A초등학교'로 익명 처리합니다.
- 본문은 길라잡이 원문을 따르며, 수치로 확인되지 않은 성과는 쓰지 않습니다.
