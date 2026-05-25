// Grok-style navigation — lo-fi · 3 states + 1 flow diagram
//
//   Mental model:
//   ┌────────┐   swipe right    ┌──────────────────┐
//   │  MENU  │ ←──────────────  │ CHAT │ TRANS     │
//   │ (full) │  swipe left      │  ←── swipe ──→   │
//   └────────┘ ──────────────→  └──────────────────┘
//
//   - MENU = full-page (profile + menu list + chat history)
//   - PAGER = 2 tabs (Chat ↔ Transaction) swipeable + top segment
//   - From Chat, swipe right → reveal Menu (replaces whole pager)
//   - From Menu, swipe left → back to Pager (last position remembered)
//   - From Transaction, swipe right ≠ menu — must return to Chat first
//     (เพราะ Tx มี internal horizontal gesture เช่น เลื่อนเดือน)
(function () {
const N = {
  ink:   '#1A1A1A',
  gray1: '#9AA0A6',
  gray2: '#D0D4D9',
  gray3: '#EEF0F2',
  gray4: '#F7F8F9',
  edge:  '#C44',  // gesture boundary marker
  good:  '#3A7',
};

// ─── Lo-fi primitives ────────────────────────────────────────────────
function StatusBar() {
  return (
    <div style={{
      height: 44, padding: '0 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontSize: 11, color: N.gray1, borderBottom: `1px solid ${N.gray3}`,
      flexShrink: 0,
    }}>
      <span>status bar</span>
      <span>10:13</span>
    </div>
  );
}

function Frame({ title, note, children }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: N.gray4,
      fontFamily: 'Sarabun, -apple-system, system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '10px 14px', background: '#fff',
        borderBottom: `1px solid ${N.gray3}`, flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: N.ink, letterSpacing: -0.1 }}>{title}</div>
        <div style={{ fontSize: 11, color: N.gray1, marginTop: 2, lineHeight: 1.4 }}>{note}</div>
      </div>
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, h = 38, fill = '#fff', dashed = true, bold = false, right }) {
  return (
    <div style={{
      height: h, padding: '0 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: fill,
      border: `1px ${dashed ? 'dashed' : 'solid'} ${N.gray2}`,
      fontSize: 11, color: bold ? N.ink : N.gray1, fontWeight: bold ? 600 : 400,
      flexShrink: 0,
    }}>
      <span>{label}</span>
      {right && <span style={{ fontSize: 10, color: N.gray1 }}>{right}</span>}
    </div>
  );
}

// ─── Top bar of Pager: hamburger ☰ · pill · new chat ─────────────────
function PagerTopBar({ active }) {
  return (
    <div style={{
      height: 44, padding: '0 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#fff', border: `1px solid ${N.gray2}`,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 14, color: N.ink }}>☰</span>
      <div style={{ display: 'flex', gap: 4, padding: 3, background: N.gray3, borderRadius: 8 }}>
        <span style={{
          padding: '5px 22px', borderRadius: 6, fontSize: 12,
          background: active === 'chat' ? '#fff' : 'transparent',
          color: active === 'chat' ? N.ink : N.gray1,
          fontWeight: active === 'chat' ? 600 : 500,
        }}>Chat</span>
        <span style={{
          padding: '5px 22px', borderRadius: 6, fontSize: 12,
          background: active === 'tx' ? '#fff' : 'transparent',
          color: active === 'tx' ? N.ink : N.gray1,
          fontWeight: active === 'tx' ? 600 : 500,
        }}>Transaction</span>
      </div>
      <span style={{ fontSize: 14, color: N.ink }}>＋</span>
    </div>
  );
}

// Edge gesture hint — แสดงขอบที่ swipe ได้
function EdgeHint({ side, label }) {
  const pos = side === 'left' ? { left: 0 } : { right: 0 };
  return (
    <div style={{
      position: 'absolute', top: 0, bottom: 0, width: 12,
      ...pos,
      background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, ${N.edge}33, transparent)`,
      borderLeft: side === 'left' ? `2px dashed ${N.edge}` : 'none',
      borderRight: side === 'right' ? `2px dashed ${N.edge}` : 'none',
      pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        writingMode: 'vertical-rl', fontSize: 9, color: N.edge,
        letterSpacing: 1, fontWeight: 600,
      }}>{label}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// State 1 — MENU page (full-screen, swipe-revealed from chat)
// ────────────────────────────────────────────────────────────────────
function GrokNav_Menu() {
  return (
    <Frame
      title="1 · MENU page (full-screen)"
      note="หน้าซ้ายสุด · profile + menu + chat history · swipe ทางซ้าย → กลับ Pager (Chat tab)"
    >
      <StatusBar />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
        {/* top: close + search */}
        <div style={{
          height: 44, padding: '0 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', border: `1px solid ${N.gray2}`,
        }}>
          <span style={{ fontSize: 14, color: N.ink }}>✕</span>
          <span style={{ fontSize: 12, color: N.gray1 }}>🔍 ค้นหา</span>
          <span style={{ fontSize: 14, color: N.ink }}>⚙</span>
        </div>

        {/* profile card */}
        <div style={{
          padding: 12, background: '#fff',
          border: `1px solid ${N.gray2}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: N.gray3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: N.ink }}>Ittipong K.</div>
            <div style={{ fontSize: 10, color: N.gray1 }}>Free plan · upgrade →</div>
          </div>
        </div>

        {/* menu section */}
        <div style={{ fontSize: 9, color: N.gray1, padding: '6px 4px 2px', letterSpacing: 1 }}>MENU</div>
        <Row label="＋ แชทใหม่" bold dashed={false} />
        <Row label="💰 กระเป๋าและบัตร" />
        <Row label="🎯 เป้าหมาย / งบประมาณ" />
        <Row label="📊 รายงาน" />
        <Row label="⚙ ตั้งค่า" />

        {/* history section */}
        <div style={{ fontSize: 9, color: N.gray1, padding: '6px 4px 2px', letterSpacing: 1 }}>CHAT HISTORY</div>
        <Row label="· สรุปยอดมีนาคม" right="เมื่อวาน" />
        <Row label="· วางแผนเที่ยวญี่ปุ่น" right="2 วันก่อน" />
        <Row label="· ลดค่าใช้จ่ายยังไงดี" right="สัปดาห์ก่อน" />
        <Row label="· ดูทั้งหมด →" />

        <EdgeHint side="right" label="SWIPE ←" />
      </div>
      <div style={{ fontSize: 10, color: N.gray1, textAlign: 'center' }}>
        ขอบขวา = swipe ซ้ายเพื่อกลับ Pager
      </div>
    </Frame>
  );
}

// ────────────────────────────────────────────────────────────────────
// State 2 — Pager · Chat tab (default landing)
// ────────────────────────────────────────────────────────────────────
function GrokNav_Chat() {
  return (
    <Frame
      title="2 · PAGER · Chat tab (default)"
      note="หน้าเริ่มต้น · ☰ เปิด Menu (หรือ swipe ขวา) · ＋ แชทใหม่ · swipe ซ้าย → Transaction"
    >
      <StatusBar />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
        <PagerTopBar active="chat" />

        {/* chat greeting area */}
        <div style={{
          flex: 1, background: '#fff', border: `1px solid ${N.gray2}`,
          padding: 12, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontSize: 11, color: N.ink, fontWeight: 600 }}>🍈 สวัสดี! วันนี้ให้ช่วยอะไรดี</div>
          <div style={{
            border: `1px dashed ${N.gray2}`, padding: 8, fontSize: 10, color: N.gray1,
          }}>shortcut tiles · suggested questions</div>
          <div style={{
            border: `1px dashed ${N.gray2}`, padding: 8, fontSize: 10, color: N.gray1,
            flex: 1,
          }}>chat thread (เมื่อมีบทสนทนา)</div>
        </div>

        {/* input bar */}
        <div style={{
          height: 48, background: '#fff', border: `1px solid ${N.gray2}`,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
          fontSize: 11, color: N.gray1,
        }}>
          <span>📷</span>
          <span style={{ flex: 1, padding: '6px 10px', background: N.gray3, borderRadius: 20 }}>ลองถามอะไรก็ได้...</span>
          <span>🎤</span>
        </div>

        <EdgeHint side="left" label="SWIPE → MENU" />
        <EdgeHint side="right" label="SWIPE ← TX" />
      </div>
    </Frame>
  );
}

// ────────────────────────────────────────────────────────────────────
// State 3 — Pager · Transaction tab
// ────────────────────────────────────────────────────────────────────
function GrokNav_Tx() {
  return (
    <Frame
      title="3 · PAGER · Transaction tab"
      note="swipe ซ้ายจาก Chat · ☰ เปิด Menu · ขอบซ้าย ≠ Menu (กัน gesture ชนกับ swipe เปลี่ยนเดือน)"
    >
      <StatusBar />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
        <PagerTopBar active="tx" />

        {/* month strip */}
        <div style={{
          height: 36, background: '#fff', border: `1px solid ${N.gray2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 14px', fontSize: 11, color: N.ink, fontWeight: 600,
        }}>
          <span style={{ color: N.gray1 }}>‹ กุมภาพันธ์</span>
          <span>มีนาคม 2026</span>
          <span style={{ color: N.gray1 }}>เมษายน ›</span>
        </div>

        {/* summary */}
        <div style={{
          background: '#fff', border: `1px solid ${N.gray2}`, padding: 12,
          display: 'flex', justifyContent: 'space-around', fontSize: 11, color: N.gray1,
        }}>
          <div>รายรับ<br/><span style={{ color: N.ink, fontWeight: 600 }}>+45,200</span></div>
          <div>รายจ่าย<br/><span style={{ color: N.ink, fontWeight: 600 }}>−32,140</span></div>
          <div>คงเหลือ<br/><span style={{ color: N.ink, fontWeight: 600 }}>+13,060</span></div>
        </div>

        {/* tx list */}
        <Row label="🍜 อาหารกลางวัน" right="−120" />
        <Row label="⛽ เติมน้ำมัน" right="−800" />
        <Row label="💰 เงินเดือน" right="+45,200" bold />
        <Row label="🛒 ของใช้บ้าน" right="−1,240" />
        <div style={{ flex: 1, border: `1px dashed ${N.gray2}`, fontSize: 10, color: N.gray1,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          [ rest of list ]
        </div>

        <EdgeHint side="right" label="SWIPE ← CHAT" />
      </div>
      <div style={{ fontSize: 10, color: '#C84', textAlign: 'center' }}>
        ⚠ ขอบซ้ายของ Tx = boundary ของ pager · ไม่เปิด Menu โดยตรง
      </div>
    </Frame>
  );
}

// ────────────────────────────────────────────────────────────────────
// State 4 — Flow diagram (เห็นทุก page เรียงกัน + gesture)
// ────────────────────────────────────────────────────────────────────
function GrokNav_Flow() {
  const Mini = ({ title, children, w }) => (
    <div style={{
      width: w, height: '100%', background: '#fff',
      border: `1px solid ${N.gray2}`, borderRadius: 8,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '6px 8px', fontSize: 10, fontWeight: 600, color: N.ink,
        background: N.gray3, borderBottom: `1px solid ${N.gray2}`,
      }}>{title}</div>
      <div style={{ flex: 1, padding: 6, fontSize: 9, color: N.gray1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {children}
      </div>
    </div>
  );
  return (
    <Frame
      title="4 · Flow — 3 horizontal pages"
      note="MENU ← Chat ↔ Transaction · top segment แสดงแค่ 2 tab (Chat/Tx) · Menu = meta-nav เปิดด้วย ☰ หรือ swipe right"
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 8, padding: '8px 0', overflow: 'hidden' }}>
        <Mini title="① MENU" w="32%">
          <div style={{ background: N.gray3, padding: 4, borderRadius: 4 }}>👤 profile</div>
          <div>＋ แชทใหม่</div>
          <div>💰 กระเป๋า</div>
          <div>🎯 เป้าหมาย</div>
          <div>⚙ ตั้งค่า</div>
          <div style={{ borderTop: `1px dashed ${N.gray2}`, paddingTop: 3, marginTop: 3 }}>· เมื่อวาน</div>
          <div>· 2 วันก่อน</div>
        </Mini>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: N.edge }}>
          <div>↔</div>
          <div style={{ writingMode: 'vertical-rl', marginTop: 4 }}>swipe</div>
        </div>

        <Mini title="② CHAT (default)" w="32%">
          <div style={{ background: N.gray3, padding: 3, borderRadius: 3, fontSize: 8 }}>☰ [Chat|Tx] ＋</div>
          <div>🍈 greeting</div>
          <div style={{ border: `1px dashed ${N.gray2}`, padding: 3, flex: 1 }}>chat thread</div>
          <div style={{ background: N.gray3, padding: 3, borderRadius: 3, fontSize: 8 }}>📷 input 🎤</div>
        </Mini>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: N.edge }}>
          <div>↔</div>
          <div style={{ writingMode: 'vertical-rl', marginTop: 4 }}>swipe</div>
        </div>

        <Mini title="③ TRANSACTION" w="32%">
          <div style={{ background: N.gray3, padding: 3, borderRadius: 3, fontSize: 8 }}>☰ [Chat|Tx] ＋</div>
          <div>‹ มี.ค. 2026 ›</div>
          <div style={{ display: 'flex', gap: 3, fontSize: 8 }}>
            <span>+45k</span><span>−32k</span>
          </div>
          <div style={{ border: `1px dashed ${N.gray2}`, padding: 3, flex: 1 }}>list</div>
        </Mini>
      </div>

      {/* gesture rules */}
      <div style={{
        background: '#fff', border: `1px solid ${N.gray2}`,
        padding: 10, fontSize: 10, color: N.ink, lineHeight: 1.6,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Gesture rules</div>
        <div>· <b>Chat → swipe ขวา</b> → Menu slide in (full-page)</div>
        <div>· <b>Menu → swipe ซ้าย / กด ✕</b> → กลับ Pager ตำแหน่งเดิม</div>
        <div>· <b>Chat ↔ Tx</b> → swipe ภายใน pager · pill segment แสดง active</div>
        <div>· <b>Tx → swipe ขวา ≠ Menu</b> → ต้องไป Chat ก่อน (กัน gesture ชน month strip)</div>
        <div>· ☰ ปุ่ม top-left ของ Pager = shortcut เปิด Menu ทุกเมื่อ</div>
      </div>
    </Frame>
  );
}

// ────────────────────────────────────────────────────────────────────
// State 4 — Interactive prototype · swipe / click / drag จริง
// ────────────────────────────────────────────────────────────────────
//   Gesture rules implemented:
//   - drag horizontal บน slider พื้นที่ใดก็ได้ที่ไม่ใช่ปุ่ม (data-role="button")
//   - threshold = 18% ของความกว้าง → snap ไป page ถัดไป
//   - Tx → swipe ขวา: clamp ไม่ให้เลย Chat (block ไป Menu)
//   - resistance ที่ขอบ (rubber-band) เพื่อ feedback ว่ามี boundary
//   - ☰ จาก Tx → ยังเปิด Menu ได้ (button shortcut bypass gesture rule)
//   - กดที่ pill, ☰, ✕ → setPage ทันที (transition smooth)
// ────────────────────────────────────────────────────────────────────
function GrokNav_Prototype({ bare = false } = {}) {
  // bare=true → hide dev chrome / use safe-area-inset for real mobile / measure actual width
  //
  // Two nested sliders:
  //   OUTER · Menu ↔ Pager       (full-page slide · top bar moves with Pager)
  //   INNER · Chat ↔ Transaction (content-only slide · shared top bar stays put)
  //
  // Gesture target is decided per drag from current state + direction:
  //   Pager.Chat + swipe right → OUTER (open Menu)
  //   Pager.Chat + swipe left  → INNER (to Tx)
  //   Pager.Tx   + swipe right → INNER (back to Chat) ← blocks Tx→Menu
  //   Pager.Tx   + swipe left  → INNER (resist, at end)
  //   Menu       + swipe left  → OUTER (close Menu)
  //   Menu       + swipe right → OUTER (resist, at end)
  const rootRef = React.useRef(null);
  const [PAGE_W, setPageW] = React.useState(390);
  React.useLayoutEffect(() => {
    const update = () => {
      if (rootRef.current) setPageW(rootRef.current.offsetWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [outerPage, setOuterPage] = React.useState(1); // 0=Menu · 1=Pager
  const [innerTab, setInnerTab] = React.useState(1);   // 1=Chat · 2=Tx
  const [drag, setDrag] = React.useState({ target: null, dx: 0 });
  const [dragging, setDragging] = React.useState(false);
  const dragRef = React.useRef({ target: null, dx: 0, locked: false });
  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const stateRef = React.useRef({ outerPage: 1, innerTab: 1 });
  React.useEffect(() => { stateRef.current = { outerPage, innerTab }; }, [outerPage, innerTab]);

  const beginDrag = (e) => {
    if (e.target.closest && e.target.closest('[data-role="button"]')) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    startX.current = x;
    startY.current = y;
    dragRef.current = { target: null, dx: 0, locked: false };
    setDrag({ target: null, dx: 0 });
    setDragging(true);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const getXY = (e) => e.touches
      ? [e.touches[0].clientX, e.touches[0].clientY]
      : [e.clientX, e.clientY];

    const onMove = (e) => {
      const [x, y] = getXY(e);
      const dx = x - startX.current;
      const dy = y - startY.current;
      let { target, locked } = dragRef.current;
      const { outerPage: op, innerTab: it } = stateRef.current;

      // Lock gesture axis on first decisive move
      if (!locked) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical scroll → abandon gesture entirely
          dragRef.current = { target: 'v', dx: 0, locked: true };
          setDrag({ target: null, dx: 0 });
          return;
        }
        // Horizontal → pick slider target from current state + direction
        if (op === 0) {
          target = 'outer';
        } else { // pager
          if (it === 1) target = dx > 0 ? 'outer' : 'inner';
          else target = 'inner'; // tx: both directions handled by inner
        }
        dragRef.current = { target, dx: 0, locked: true };
      }
      if (target === 'v') return;

      // Edge resistance per target
      let d = dx;
      if (target === 'outer') {
        if (op === 0 && d < 0) {} // valid (closing menu)
        else if (op === 0 && d > 0) d = d * 0.25; // past menu right edge
        else if (op === 1 && d < 0) d = d * 0.25; // past pager right edge
        // op===1 && d>0 = opening menu, valid
      } else if (target === 'inner') {
        if (it === 1 && d < 0) {} // valid (chat → tx)
        else if (it === 1 && d > 0) d = d * 0.25; // chat trying to scroll right inside → resist
        else if (it === 2 && d > 0) {} // valid (tx → chat)
        else if (it === 2 && d < 0) d = d * 0.25; // past tx right edge
      }
      dragRef.current = { target, dx: d, locked: true };
      setDrag({ target, dx: d });
    };

    const onUp = () => {
      const { target, dx } = dragRef.current;
      const { outerPage: op, innerTab: it } = stateRef.current;
      const t = PAGE_W * 0.18;
      if (target === 'outer') {
        if (dx > t && op === 1) setOuterPage(0);
        else if (dx < -t && op === 0) setOuterPage(1);
      } else if (target === 'inner') {
        if (dx > t && it === 2) setInnerTab(1);
        else if (dx < -t && it === 1) setInnerTab(2);
      }
      setDrag({ target: null, dx: 0 });
      setDragging(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, PAGE_W]);

  const outerDx = drag.target === 'outer' ? drag.dx : 0;
  const innerDx = drag.target === 'inner' ? drag.dx : 0;
  const outerOffset = -outerPage * PAGE_W + outerDx;
  const innerOffset = -(innerTab - 1) * PAGE_W + innerDx;
  const offset = outerOffset; // keep old name for downstream code below
  const page = outerPage === 0 ? 0 : innerTab; // 0=menu, 1=chat, 2=tx (for indicator)
  const setPage = (p) => {
    if (p === 0) {
      // Tx → Menu must route through Chat per gesture rule (button is exempt
      // but keep indicator behavior consistent with the swipe rule)
      if (outerPage === 1 && innerTab === 2) {
        setInnerTab(1);
        setTimeout(() => setOuterPage(0), 100);
      } else setOuterPage(0);
    } else {
      setOuterPage(1);
      setInnerTab(p);
    }
  };

  return (
    <div ref={rootRef} style={{
      width: '100%', height: '100%', background: N.gray4,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'Sarabun, -apple-system, system-ui, sans-serif',
    }}>
      {!bare && (
        <>
          {/* title strip */}
          <div style={{
            padding: '10px 14px', background: '#fff',
            borderBottom: `1px solid ${N.gray3}`, flexShrink: 0,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: N.ink, letterSpacing: -0.1 }}>
              4 · Interactive prototype
            </div>
            <div style={{ fontSize: 11, color: N.gray1, marginTop: 2, lineHeight: 1.4 }}>
              ลาก / คลิก ☰ ✕ pill ได้จริง · จาก Tx ลองลากขวาดู → ติดที่ Chat (ต้องกด ☰ ถึงไป Menu)
            </div>
          </div>
          {/* fake status bar */}
          <div style={{
            height: 32, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 11, color: N.gray1, background: '#fff',
            borderBottom: `1px solid ${N.gray3}`, flexShrink: 0,
          }}>
            <span>10:13</span>
            <span>•••  🔋</span>
          </div>
        </>
      )}

      {/* OUTER slider viewport: Menu ↔ Pager */}
      <div
        onMouseDown={beginDrag}
        onTouchStart={beginDrag}
        style={{
          flex: 1, overflow: 'hidden', position: 'relative',
          background: '#fff', userSelect: 'none', touchAction: 'pan-y',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <div style={{
          display: 'flex',
          width: PAGE_W * 2, height: '100%',
          transform: `translateX(${outerOffset}px)`,
          transition: dragging && drag.target === 'outer'
            ? 'none'
            : 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
          willChange: 'transform',
        }}>
          <ProtoMenu w={PAGE_W} bare={bare} onClose={() => setOuterPage(1)} />

          {/* PAGER: fixed top bar + INNER slider (Chat content ↔ Tx content) */}
          <div style={{
            flex: `0 0 ${PAGE_W}px`, height: '100%',
            display: 'flex', flexDirection: 'column',
          }}>
            <ProtoTopBar
              active={innerTab}
              bare={bare}
              onMenu={() => setOuterPage(0)}
              onTab={setInnerTab}
            />
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                display: 'flex',
                width: PAGE_W * 2, height: '100%',
                transform: `translateX(${innerOffset}px)`,
                transition: dragging && drag.target === 'inner'
                  ? 'none'
                  : 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
                willChange: 'transform',
              }}>
                <ProtoChatContent w={PAGE_W} bare={bare} />
                <ProtoTxContent   w={PAGE_W} bare={bare} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!bare && (
        <div style={{
          padding: '8px 14px 10px', background: '#fff',
          borderTop: `1px solid ${N.gray3}`, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {['MENU', 'CHAT', 'TX'].map((label, i) => (
              <div
                key={i}
                data-role="button"
                onClick={() => {
                  if (i === 0 && page === 2) { setPage(1); setTimeout(() => setPage(0), 100); }
                  else setPage(i);
                }}
                style={{
                  padding: '3px 10px', borderRadius: 10, cursor: 'pointer',
                  background: page === i ? N.ink : N.gray3,
                  color: page === i ? '#fff' : N.gray1,
                  fontSize: 9, fontWeight: 700, letterSpacing: 0.6,
                  transition: 'all 0.2s',
                }}
              >{label}</div>
            ))}
          </div>
          <div style={{ fontSize: 9.5, color: N.gray1, marginTop: 6, textAlign: 'center', lineHeight: 1.5 }}>
            drag/swipe · กด pill ก็สลับ · ☰ จาก Tx เปิด Menu ได้ (bypass rule)
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Inner pages of the prototype ────────────────────────────────────
function ProtoTopBar({ active, onMenu, onTab, bare }) {
  const Tab = ({ keyId, label }) => (
    <span
      data-role="button"
      onClick={(e) => { e.stopPropagation(); onTab(keyId); }}
      style={{
        padding: '5px 22px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
        background: active === keyId ? '#fff' : 'transparent',
        color: active === keyId ? N.ink : N.gray1,
        fontWeight: active === keyId ? 600 : 500,
        boxShadow: active === keyId ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
        transition: 'all 0.18s',
        userSelect: 'none',
      }}
    >{label}</span>
  );
  return (
    <div style={{
      paddingTop: bare ? 'calc(env(safe-area-inset-top) + 6px)' : 0,
      flexShrink: 0, background: '#fff',
      borderBottom: `1px solid ${N.gray3}`,
    }}>
    <div style={{
      height: 44, padding: '0 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span
        data-role="button"
        onClick={(e) => { e.stopPropagation(); onMenu(); }}
        style={{ fontSize: 18, color: N.ink, cursor: 'pointer', padding: 4, userSelect: 'none' }}
      >☰</span>
      <div style={{ display: 'flex', gap: 4, padding: 3, background: N.gray3, borderRadius: 8 }}>
        <Tab keyId={1} label="Chat" />
        <Tab keyId={2} label="Transaction" />
      </div>
      <span
        data-role="button"
        style={{ fontSize: 18, color: N.ink, cursor: 'pointer', padding: 4, userSelect: 'none' }}
      >＋</span>
    </div>
    </div>
  );
}

function ProtoMenu({ w, bare, onClose }) {
  const Item = ({ icon, label, right, bold }) => (
    <div data-role="button" style={{
      padding: '10px 8px', display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 12, color: bold ? N.ink : '#3a3a3a', fontWeight: bold ? 600 : 400,
      cursor: 'pointer', borderRadius: 6, userSelect: 'none',
    }}>
      <span style={{ width: 18, textAlign: 'center' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {right && <span style={{ fontSize: 10, color: N.gray1 }}>{right}</span>}
    </div>
  );
  return (
    <div style={{
      flex: `0 0 ${w}px`, height: '100%', display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${N.gray3}`, background: '#fff',
    }}>
      <div style={{
        paddingTop: bare ? 'calc(env(safe-area-inset-top) + 6px)' : 0,
        flexShrink: 0, background: '#fff', borderBottom: `1px solid ${N.gray3}`,
      }}>
        <div style={{
          height: 44, padding: '0 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span data-role="button" onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{ fontSize: 16, color: N.ink, cursor: 'pointer', padding: 4, userSelect: 'none' }}>✕</span>
          <span style={{ fontSize: 12, color: N.gray1 }}>🔍  ค้นหาแชท</span>
          <span data-role="button" style={{ fontSize: 16, color: N.ink, cursor: 'pointer', padding: 4 }}>⚙</span>
        </div>
      </div>
      <div style={{
        flex: 1, overflow: 'auto', padding: 12,
        paddingBottom: bare ? 'calc(env(safe-area-inset-bottom) + 16px)' : 12,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div data-role="button" style={{
          padding: 12, background: N.gray4, borderRadius: 10, marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22, background: N.gray3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: N.ink }}>Ittipong K.</div>
            <div style={{ fontSize: 10, color: N.gray1, marginTop: 2 }}>Free plan · upgrade →</div>
          </div>
          <span style={{ color: N.gray1, fontSize: 12 }}>›</span>
        </div>

        <div style={{ fontSize: 9, color: N.gray1, padding: '8px 4px 2px', letterSpacing: 1, fontWeight: 600 }}>MENU</div>
        <Item icon="＋" label="แชทใหม่" bold />
        <Item icon="💰" label="กระเป๋าและบัตร" />
        <Item icon="🎯" label="เป้าหมาย / งบประมาณ" />
        <Item icon="📊" label="รายงาน" />
        <Item icon="⚙" label="ตั้งค่า" />

        <div style={{ fontSize: 9, color: N.gray1, padding: '12px 4px 2px', letterSpacing: 1, fontWeight: 600 }}>CHAT HISTORY</div>
        <Item icon="·" label="สรุปยอดมีนาคม" right="เมื่อวาน" />
        <Item icon="·" label="วางแผนเที่ยวญี่ปุ่น" right="2 วันก่อน" />
        <Item icon="·" label="ลดค่าใช้จ่ายยังไงดี" right="สัปดาห์ก่อน" />
        <Item icon="·" label="คำนวณดอกเบี้ย" right="ที่แล้ว" />
        <div data-role="button" style={{
          padding: '8px', fontSize: 11, color: N.gray1,
          textAlign: 'center', cursor: 'pointer', marginTop: 4,
        }}>ดูทั้งหมด →</div>
      </div>
    </div>
  );
}

// Chat content WITHOUT top bar (top bar lives in the Pager wrapper)
function ProtoChatContent({ w, bare }) {
  return (
    <div style={{
      flex: `0 0 ${w}px`, height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
        background: N.gray4, overflow: 'hidden',
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: N.ink, marginTop: 8 }}>
          🍈  สวัสดี! วันนี้ให้ช่วยอะไรดี
        </div>
        <div style={{ fontSize: 11, color: N.gray1 }}>ลองถามอะไรก็ได้ หรือเลือก shortcut</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {['💰 ยอดเงินวันนี้', '📋 บันทึกค่ากาแฟ', '📊 สรุปเดือนนี้', '🎯 เป้าหมายญี่ปุ่น'].map(t => (
            <div key={t} data-role="button" style={{
              padding: '7px 12px', background: '#fff', borderRadius: 18, fontSize: 11,
              color: N.ink, border: `1px solid ${N.gray3}`, cursor: 'pointer',
            }}>{t}</div>
          ))}
        </div>
        <div style={{
          flex: 1, padding: 12, background: '#fff',
          border: `1px dashed ${N.gray2}`, borderRadius: 10,
          fontSize: 11, color: N.gray1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          [ chat thread เมื่อมีบทสนทนา ]
        </div>
      </div>
      <div style={{
        background: '#fff', borderTop: `1px solid ${N.gray3}`,
        padding: '8px 12px',
        paddingBottom: bare ? 'calc(env(safe-area-inset-bottom) + 8px)' : 8,
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <span data-role="button" style={{ fontSize: 16, cursor: 'pointer' }}>📷</span>
        <span style={{ flex: 1, padding: '8px 14px', background: N.gray3, borderRadius: 20, fontSize: 12, color: N.gray1 }}>
          ลองถามอะไรก็ได้...
        </span>
        <span data-role="button" style={{ fontSize: 16, cursor: 'pointer' }}>🎤</span>
      </div>
    </div>
  );
}

// Tx content WITHOUT top bar
function ProtoTxContent({ w, bare }) {
  const tx = [
    { i: '🍜', l: 'อาหารกลางวัน',     r: '−120',    g: false },
    { i: '⛽', l: 'เติมน้ำมัน',         r: '−800',    g: false },
    { i: '💰', l: 'เงินเดือน',          r: '+45,200', g: true  },
    { i: '🛒', l: 'ของใช้บ้าน',         r: '−1,240',  g: false },
    { i: '☕', l: 'กาแฟเช้า',           r: '−85',     g: false },
    { i: '🚕', l: 'แท็กซี่กลับบ้าน',    r: '−180',    g: false },
  ];
  return (
    <div style={{
      flex: `0 0 ${w}px`, height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: 14,
      paddingBottom: bare ? 'calc(env(safe-area-inset-bottom) + 16px)' : 14,
      gap: 6, background: N.gray4, overflow: 'auto',
    }}>
      <div style={{
        height: 38, background: '#fff', borderRadius: 8, border: `1px solid ${N.gray3}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 14px', fontSize: 12, fontWeight: 600, color: N.ink, flexShrink: 0,
      }}>
        <span style={{ color: N.gray1, fontWeight: 400 }}>‹ ก.พ.</span>
        <span>มีนาคม 2026</span>
        <span style={{ color: N.gray1, fontWeight: 400 }}>เม.ย. ›</span>
      </div>
      <div style={{
        background: '#fff', borderRadius: 8, border: `1px solid ${N.gray3}`,
        padding: 10, display: 'flex', justifyContent: 'space-around',
        fontSize: 10, color: N.gray1, flexShrink: 0,
      }}>
        <div style={{ textAlign: 'center' }}>รายรับ
          <div style={{ color: '#0a7', fontWeight: 700, fontSize: 13, marginTop: 2 }}>+45,200</div>
        </div>
        <div style={{ textAlign: 'center' }}>รายจ่าย
          <div style={{ color: '#c44', fontWeight: 700, fontSize: 13, marginTop: 2 }}>−32,140</div>
        </div>
        <div style={{ textAlign: 'center' }}>คงเหลือ
          <div style={{ color: N.ink, fontWeight: 700, fontSize: 13, marginTop: 2 }}>+13,060</div>
        </div>
      </div>
      {tx.map((x, idx) => (
        <div key={idx} data-role="button" style={{
          background: '#fff', borderRadius: 8, border: `1px solid ${N.gray3}`,
          padding: '11px 12px', display: 'flex', justifyContent: 'space-between',
          fontSize: 12, color: N.ink, cursor: 'pointer', flexShrink: 0,
        }}>
          <span>{x.i}  {x.l}</span>
          <span style={{ color: x.g ? '#0a7' : N.ink, fontWeight: 600 }}>{x.r}</span>
        </div>
      ))}
    </div>
  );
}

window.GrokNav_Menu = GrokNav_Menu;
window.GrokNav_Chat = GrokNav_Chat;
window.GrokNav_Tx = GrokNav_Tx;
window.GrokNav_Flow = GrokNav_Flow;
window.GrokNav_Prototype = GrokNav_Prototype;
})();
