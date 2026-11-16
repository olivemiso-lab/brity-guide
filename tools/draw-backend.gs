/**
 * 뽑기판 재고 서버 (Google Apps Script 웹 앱)
 * - 시트 "재고": A열 등급, B열 선물, C열 준비 수량, D열 남은 수량
 * - 시트 "기록": 뽑을 때마다 한 줄씩 (시각, 등급, 선물, 기기ID)
 * 배포: 배포 > 새 배포 > 유형 "웹 앱", 실행 주체 "나", 액세스 "모든 사용자"
 */
var SHEET_STOCK = '재고';
var SHEET_LOG = '기록';

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var st = ss.getSheetByName(SHEET_STOCK) || ss.insertSheet(SHEET_STOCK);
  st.clear();
  st.getRange(1, 1, 6, 4).setValues([
    ['등급', '선물', '준비 수량', '남은 수량'],
    ['1등', '모두 다 받기', 3, 3],
    ['2등', '페레로 로쉐', 15, 15],
    ['3등', '신라면 컵라면', 50, 50],
    ['4등', '하리보 젤리', 80, 80],
    ['5등', '마이쮸', 102, 102]
  ]);
  st.getRange(1, 1, 1, 4).setFontWeight('bold');
  st.setFrozenRows(1);
  var lg = ss.getSheetByName(SHEET_LOG) || ss.insertSheet(SHEET_LOG);
  lg.clear();
  lg.getRange(1, 1, 1, 4).setValues([['시각', '등급', '선물', '기기ID']]).setFontWeight('bold');
  lg.setFrozenRows(1);
}

function readStock_() {
  var st = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_STOCK);
  var rows = st.getRange(2, 1, st.getLastRow() - 1, 4).getValues();
  return rows.filter(function (r) { return r[0]; }).map(function (r, i) {
    return { row: i + 2, rank: String(r[0]), name: String(r[1]), total: Number(r[2]) || 0, left: Number(r[3]) || 0 };
  });
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// GET: 남은 수량 조회
function doGet(e) {
  var stock = readStock_().map(function (s) { return { rank: s.rank, name: s.name, total: s.total, left: s.left }; });
  return out_({ ok: true, stock: stock });
}

// POST: 추첨 (남은 수량 비율로 뽑고 1 차감)
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var body = {};
    try { body = JSON.parse(e.postData.contents || '{}'); } catch (err) {}
    var device = String(body.device || '').slice(0, 64);

    var stock = readStock_();
    var pool = stock.filter(function (s) { return s.left > 0; });
    var totalLeft = pool.reduce(function (a, s) { return a + s.left; }, 0);
    if (totalLeft <= 0) return out_({ ok: false, reason: 'soldout', stock: stock });

    var r = Math.random() * totalLeft, pick = pool[pool.length - 1];
    for (var i = 0; i < pool.length; i++) { r -= pool[i].left; if (r < 0) { pick = pool[i]; break; } }

    var st = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_STOCK);
    st.getRange(pick.row, 4).setValue(pick.left - 1);
    var lg = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_LOG);
    lg.appendRow([new Date(), pick.rank, pick.name, device]);

    var after = readStock_().map(function (s) { return { rank: s.rank, name: s.name, total: s.total, left: s.left }; });
    return out_({ ok: true, prize: { rank: pick.rank, name: pick.name }, stock: after });
  } catch (err) {
    return out_({ ok: false, reason: 'error', message: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}
