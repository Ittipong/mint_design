// HomeV3 — variations for "what goes below the AI Brief card"
// Design principle: AI Brief คือ hero แล้ว → ของล่างต้องเงียบ, ไม่แย่งสายตา, ไม่ทวนข้อมูล
const HV = window.MINT;

// ─── Variant 1: Nothing (calm/minimal) ────────────────────────
// แสดงแค่ AI Brief เด่นๆ ไม่มีอะไรเลยล่าง — สบายตาที่สุด
// Trade-off: เสีย opportunity ให้ user เข้าถึง upcoming/wallets/txns จาก home
function HomeV3_Empty() {
  return <HomeV3 below={null} />;
}

// ─── Variant 2: Single nearest bill (status quo, แต่ refined) ──
// 1 bullet เดียว, urgency ชัด — fits "ไม่ตาลาย"
function HomeV3_UpcomingBill() {
  return <HomeV3 />;
}

// ─── Variant 3: Today snapshot — 3 horizontal pills ───────────
// แสดงสถิติวันนี้แบบเบาๆ ในหนึ่งบรรทัด · ไม่ทวนตัวเลขใน Brief เพราะ Brief พูดถึงงบ ส่วนนี้พูดถึง flow
function HomeV3_TodayPills() {
  const pills = [
    { label: 'รายรับ', amt: '+ 0', color: HV.n400, bg: '#fff' },
    { label: 'รายจ่าย', amt: '− 850', color: HV.error400, bg: '#fff' },
    { label: 'รายการ', amt: '3', color: HV.n900, bg: '#fff' },
  ];
  return (
    <HomeV3 below={
      <div style={{ margin: '0 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 4px 8px',
        }}>
          <div style={{ fontSize: 11, color: HV.n400, fontWeight: 600, letterSpacing: 0.4 }}>วันนี้</div>
          <div style={{ fontSize: 11, color: HV.primary500, fontWeight: 600 }}>ดูทั้งหมด ›</div>
        </div>
        <div style={{
          background: '#fff', borderRadius: 14,
          padding: '4px',
          display: 'flex', alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {pills.map((p, i) => (
            <div key={i} style={{
              flex: 1, padding: '10px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              borderRight: i < pills.length - 1 ? `1px solid ${HV.n200}` : 'none',
            }}>
              <div style={{ fontSize: 10, color: HV.n400, fontWeight: 500 }}>{p.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: p.color, letterSpacing: -0.2 }}>{p.amt}</div>
            </div>
          ))}
        </div>
      </div>
    }/>
  );
}

// ─── Variant 4: Recent transactions list (3 latest) ───────────
// แสดง flow ล่าสุด · เสริม "เห็นตัวเองทำอะไร" ไม่ใช่ "ตัวเลขสรุป" · drives habit
function HomeV3_RecentTxns() {
  const txns = [
    { icon: '☕', bg: HV.walletBrown100, label: 'คาเฟ่อเมซอน', time: '14:20', amt: '− ฿ 85' },
    { icon: '🛒', bg: HV.walletGreen100, label: '7-Eleven', time: '12:08', amt: '− ฿ 245' },
    { icon: '🍜', bg: HV.walletPink100, label: 'ก๋วยเตี๋ยวเรือ', time: '11:30', amt: '− ฿ 60' },
  ];
  return (
    <HomeV3 below={
      <div style={{
        margin: '0 16px',
        background: '#fff', borderRadius: 14,
        padding: '6px 14px 4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 2px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: HV.n900 }}>วันนี้ · 3 รายการ</div>
          <div style={{ fontSize: 11, color: HV.primary500, fontWeight: 600 }}>ทั้งหมด ›</div>
        </div>
        {txns.map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 0',
            borderTop: i === 0 ? 'none' : `1px solid ${HV.n200}`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 9, background: t.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>{t.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: HV.n900 }}>{t.label}</div>
              <div style={{ fontSize: 10, color: HV.n400, marginTop: 1 }}>{t.time}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: HV.error400 }}>{t.amt}</div>
          </div>
        ))}
      </div>
    }/>
  );
}

Object.assign(window, {
  HomeV3_Empty, HomeV3_UpcomingBill, HomeV3_TodayPills, HomeV3_RecentTxns,
});
