// Lo-fi navigation structure comparison — 5 options ในไฟล์เดียว
//   ทุก artboard ขนาด 390×844 · ใช้ grayscale + dashed box เพื่อ focus ที่โครงสร้าง
//   ไม่มีสี brand · ไม่มี content จริง · เน้นว่า "nav อยู่ที่ไหน · มีกี่ชั้น"
//
//   00 — Current (v4 Root Pager ปัจจุบัน)
//   A  — Keep 2-pager + แก้เฉพาะจุด
//   B  — AI-first (Chat = root, finance = quick action ใน chat)
//   C  — Finance-first + AI FAB กลาง bottom nav
//   D  — ChatGPT-style sidebar (swipe drawer ↔ chat)
(function () {
const N = {
  ink:   '#1A1A1A',
  gray1: '#9AA0A6',  // border / label
  gray2: '#D0D4D9',  // dashed
  gray3: '#EEF0F2',  // fill light
  gray4: '#F7F8F9',  // page bg
  accent:'#1A1A1A',  // active marker (mono)
};

// ─── Lo-fi primitives ────────────────────────────────────────────────
function Box({ label, h, fill = '#fff', dashed = true, children, style }) {
  return (
    <div style={{
      border: `1px ${dashed ? 'dashed' : 'solid'} ${N.gray1}`,
      background: fill,
      height: h,
      padding: 8,
      fontSize: 11,
      color: N.gray1,
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}>
      {label && <div style={{ fontSize: 10, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</div>}
      {children}
    </div>
  );
}

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
      {/* artboard title strip */}
      <div style={{
        padding: '10px 14px',
        background: '#fff',
        borderBottom: `1px solid ${N.gray3}`,
        flexShrink: 0,
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

// ─── 00 · Current ─────────────────────────────────────────────────────
function NavLoFi_Current() {
  return (
    <Frame
      title="00 · Current — v4 Root Pager"
      note="2 nav: top segment (Chat|Finance) + bottom nav 5 ปุ่ม · 'Finance' ชนกัน · bell หายเมื่อมี page action"
    >
      <StatusBar />
      {/* top segment */}
      <div style={{
        height: 44, padding: '0 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', border: `1px solid ${N.gray2}`,
      }}>
        <span style={{ fontSize: 10, color: N.gray1 }}>(action)</span>
        <div style={{ display: 'flex', gap: 4, padding: 3, background: N.gray3, borderRadius: 8 }}>
          <span style={{ padding: '4px 18px', background: '#fff', borderRadius: 6, fontSize: 11, color: N.ink, fontWeight: 600 }}>Chat</span>
          <span style={{ padding: '4px 18px', fontSize: 11, color: N.gray1 }}>Finance</span>
        </div>
        <span style={{ fontSize: 10, color: N.gray1 }}>🔔</span>
      </div>
      <Box label="content (Chat OR Finance — swipeable)" h={null} style={{ flex: 1 }}>
        <div style={{ margin: 'auto', fontSize: 11, color: N.gray1, textAlign: 'center' }}>
          [ MelonChat embedded ]<br/>หรือ<br/>[ HomeV3 / Wallets / Tx / Report ]
        </div>
      </Box>
      {/* bottom nav (only visible on Finance side) */}
      <div style={{
        height: 56, background: '#fff', border: `1px solid ${N.gray2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        fontSize: 10, color: N.gray1,
      }}>
        <span>🏠 Home</span>
        <span style={{ color: N.ink, fontWeight: 600 }}>💰 Finance⚠</span>
        <span>📋 Tx</span>
        <span>📊 Report</span>
        <span>⋯ More</span>
      </div>
      <div style={{ fontSize: 10, color: '#C44', textAlign: 'center', marginTop: 2 }}>
        ⚠ "Finance" ชนกับ tab segment ด้านบน
      </div>
    </Frame>
  );
}

// ─── A · Keep 2-pager + fix ──────────────────────────────────────────
function NavLoFi_A() {
  return (
    <Frame
      title="A · Keep 2-pager + แก้เฉพาะจุด"
      note="rename Chat|Money + ตั้งชื่อ tab ใน bottom ไม่ชน + ใส่ title ใต้ pill + bell อยู่ขวาเสมอ"
    >
      <StatusBar />
      <div style={{
        height: 48, padding: '0 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', border: `1px solid ${N.gray2}`,
      }}>
        <span style={{ fontSize: 10, color: N.gray1 }}>🔍</span>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: N.gray3, borderRadius: 9 }}>
          <span style={{ padding: '6px 22px', background: '#fff', borderRadius: 7, fontSize: 12, color: N.ink, fontWeight: 600 }}>Melon</span>
          <span style={{ padding: '6px 22px', fontSize: 12, color: N.gray1 }}>Money</span>
        </div>
        <span style={{ fontSize: 10, color: N.gray1 }}>🔔 ⋮</span>
      </div>
      <div style={{ fontSize: 10, color: N.gray1, padding: '0 4px' }}>รายการ · มีนาคม 2026 ← subtitle context</div>
      <Box label="content" h={null} style={{ flex: 1 }}>
        <div style={{ margin: 'auto', fontSize: 11, color: N.gray1 }}>[ swipeable Chat ↔ Money ]</div>
      </Box>
      <div style={{
        height: 56, background: '#fff', border: `1px solid ${N.gray2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        fontSize: 10, color: N.gray1,
      }}>
        <span>🏠 Home</span>
        <span style={{ color: N.ink, fontWeight: 600 }}>💰 Wallet</span>
        <span>📋 Tx</span>
        <span>📊 Report</span>
        <span>⋯ More</span>
      </div>
      <div style={{ fontSize: 10, color: '#3A7', textAlign: 'center', marginTop: 2 }}>
        ✓ ชื่อไม่ชน · bell ไม่หาย · tap target 48px
      </div>
    </Frame>
  );
}

// ─── B · AI-first ────────────────────────────────────────────────────
function NavLoFi_B() {
  return (
    <Frame
      title="B · AI-first (Chat = root)"
      note="Chat เป็น surface เดียว · finance pages = quick action / bottom sheet · ไม่มี nav ชั้นใดเลย"
    >
      <StatusBar />
      <div style={{
        height: 48, padding: '0 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', border: `1px solid ${N.gray2}`,
      }}>
        <span style={{ fontSize: 11, color: N.ink, fontWeight: 600 }}>🍈 Melon</span>
        <span style={{ fontSize: 10, color: N.gray1 }}>🔔 ⋮</span>
      </div>
      <Box label="greeting / suggestions" h={70} />
      <div style={{ display: 'flex', gap: 6 }}>
        <Box label="💰 ยอดเงิน" h={60} style={{ flex: 1 }} fill="#fff" dashed={false} />
        <Box label="📋 บันทึก" h={60} style={{ flex: 1 }} fill="#fff" dashed={false} />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Box label="📊 รายงาน" h={60} style={{ flex: 1 }} fill="#fff" dashed={false} />
        <Box label="🎯 เป้าหมาย" h={60} style={{ flex: 1 }} fill="#fff" dashed={false} />
      </div>
      <div style={{ fontSize: 10, color: N.gray1, padding: '4px 4px 0' }}>↑ tile กด = เปิด bottom sheet (ไม่ navigate)</div>
      <Box label="suggested questions / chat history" h={null} style={{ flex: 1 }} />
      <div style={{
        height: 56, background: '#fff', border: `1px solid ${N.gray2}`,
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
        fontSize: 11, color: N.gray1,
      }}>
        <span>📷</span>
        <span style={{ flex: 1, padding: '6px 10px', background: N.gray3, borderRadius: 20 }}>ลองถามอะไรก็ได้...</span>
        <span>🎤</span>
      </div>
      <div style={{ fontSize: 10, color: '#3A7', textAlign: 'center', marginTop: 2 }}>
        ✓ AI = first-class · ตรง concept · 1 surface · pattern แบบ Grok
      </div>
    </Frame>
  );
}

// ─── C · Finance-first + AI FAB ──────────────────────────────────────
function NavLoFi_C() {
  return (
    <Frame
      title="C · Finance-first + AI center button"
      note="title bar เดิม + AI gradient ปุ่มกลาง bottom nav (เปิด full-screen chat) · nav 1 ชั้น · learning curve ต่ำสุด"
    >
      <StatusBar />
      <div style={{
        height: 48, padding: '0 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', border: `1px solid ${N.gray2}`,
      }}>
        <span style={{ fontSize: 12, color: N.ink, fontWeight: 600 }}>รายการ · มีนาคม 2026</span>
        <span style={{ fontSize: 10, color: N.gray1 }}>🔍 🔔</span>
      </div>
      <Box label="content (Home / Wallets / Tx / Report)" h={null} style={{ flex: 1 }}>
        <div style={{ margin: 'auto', fontSize: 11, color: N.gray1 }}>[ standard finance page ]</div>
      </Box>
      <div style={{
        height: 64, background: '#fff', border: `1px solid ${N.gray2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        fontSize: 10, color: N.gray1, position: 'relative',
      }}>
        <span>🏠 Home</span>
        <span>💰 Wallet</span>
        <div style={{
          width: 52, height: 52, borderRadius: 26,
          background: `repeating-linear-gradient(135deg, ${N.gray1} 0 4px, ${N.ink} 4px 8px)`,
          marginTop: -20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>🍈</div>
        <span>📊 Report</span>
        <span>⋯ More</span>
      </div>
      <div style={{ fontSize: 10, color: '#3A7', textAlign: 'center', marginTop: 2 }}>
        ✓ ปุ่ม AI เด่นที่สุด · nav ชั้นเดียว · port ง่าย<br/>
        <span style={{ color: '#C84' }}>~ AI = destination ไม่ใช่ in-flow</span>
      </div>
    </Frame>
  );
}

// ─── D · ChatGPT-style sidebar ───────────────────────────────────────
function NavLoFi_D() {
  return (
    <Frame
      title="D · ChatGPT-style sidebar"
      note="2 panel swipe: ซ้าย = sidebar (history + finance shortcut) / ขวา = chat · pattern เดียวกับ ChatGPT 2026"
    >
      <StatusBar />
      <div style={{ flex: 1, display: 'flex', gap: 6, overflow: 'hidden' }}>
        {/* sidebar */}
        <div style={{
          width: '38%', display: 'flex', flexDirection: 'column', gap: 4,
          background: '#fff', border: `1px solid ${N.gray2}`, padding: 8,
        }}>
          <div style={{ fontSize: 10, color: N.gray1, padding: '4px 0' }}>🔍 ค้นหา</div>
          <div style={{ fontSize: 11, color: N.ink, padding: 6, background: N.gray3, borderRadius: 6, fontWeight: 600 }}>+ แชทใหม่</div>
          <div style={{ borderTop: `1px dashed ${N.gray2}`, marginTop: 6, paddingTop: 6 }}>
            <div style={{ fontSize: 9, color: N.gray1, marginBottom: 4 }}>FINANCE</div>
            <div style={{ fontSize: 10, color: N.ink, padding: '4px 0' }}>💰 กระเป๋า</div>
            <div style={{ fontSize: 10, color: N.ink, padding: '4px 0' }}>📋 รายการ</div>
            <div style={{ fontSize: 10, color: N.ink, padding: '4px 0' }}>📊 รายงาน</div>
            <div style={{ fontSize: 10, color: N.ink, padding: '4px 0' }}>🎯 เป้าหมาย</div>
          </div>
          <div style={{ borderTop: `1px dashed ${N.gray2}`, marginTop: 6, paddingTop: 6 }}>
            <div style={{ fontSize: 9, color: N.gray1, marginBottom: 4 }}>HISTORY</div>
            <div style={{ fontSize: 10, color: N.gray1, padding: '3px 0' }}>· เมื่อวาน</div>
            <div style={{ fontSize: 10, color: N.gray1, padding: '3px 0' }}>· 2 วันก่อน</div>
            <div style={{ fontSize: 10, color: N.gray1, padding: '3px 0' }}>· สัปดาห์ก่อน</div>
          </div>
        </div>
        {/* chat panel */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: '#fff', border: `1px solid ${N.gray2}`,
        }}>
          <div style={{
            padding: '10px 12px', borderBottom: `1px solid ${N.gray3}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: N.ink }}>🍈 Melon</span>
            <span style={{ fontSize: 9, color: N.gray1 }}>🔔 ⋮</span>
          </div>
          <div style={{ flex: 1, padding: 8, fontSize: 10, color: N.gray1 }}>
            [ chat thread ]
          </div>
          <div style={{
            margin: 8, padding: '6px 8px',
            background: N.gray3, borderRadius: 16,
            fontSize: 10, color: N.gray1,
          }}>
            📎 พิมพ์... 🎤
          </div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: N.gray1, textAlign: 'center' }}>← swipe ระหว่าง sidebar ↔ chat →</div>
      <div style={{ fontSize: 10, color: '#3A7', textAlign: 'center' }}>
        ✓ pattern จริงจาก ChatGPT 2026 · chat = home · finance pages = overlay จาก sidebar
      </div>
    </Frame>
  );
}

window.NavLoFi_Current = NavLoFi_Current;
window.NavLoFi_A = NavLoFi_A;
window.NavLoFi_B = NavLoFi_B;
window.NavLoFi_C = NavLoFi_C;
window.NavLoFi_D = NavLoFi_D;
})();
