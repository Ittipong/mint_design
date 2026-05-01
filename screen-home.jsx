// Home screen — Net Worth header, AI insight card, quick add, upcoming payments
const MH = window.MINT;

function HomeHeader({ title = 'Net Worth', amount = '฿ 125,430.00' }) {
  return (
    <div style={{
      position: 'relative', paddingTop: 2,
      background: `linear-gradient(180deg, ${MH.gradStart} 0%, ${MH.gradMid} 70%, ${MH.gradEnd} 100%)`,
    }}>
      <MintStatusBar time="21:29" />
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '0 20px 14px',
      }}>
        <div>
          <div style={{ fontSize: 13, color: MH.n600, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: MH.n900, letterSpacing: -0.3 }}>{amount}</div>
        </div>
        <div style={{ position: 'relative', marginTop: 4 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 3a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V9a6 6 0 00-6-6zM9 18a3 3 0 006 0" stroke={MH.n700} strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          <div style={{
            position: 'absolute', top: -2, right: -2,
            width: 16, height: 16, borderRadius: 8,
            background: MH.error400, color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>1</div>
        </div>
      </div>
    </div>
  );
}

function AICard() {
  return (
    <div style={{
      margin: '10px 16px 0',
      background: `linear-gradient(180deg, ${MH.gradStart} 0%, #fff 40%, #fff 100%)`,
      borderRadius: 20, padding: '28px 20px 22px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>💡</div>
      <div style={{
        fontSize: 15, fontWeight: 600, color: MH.n900,
        lineHeight: 1.45, letterSpacing: 0.1,
        textWrap: 'pretty',
      }}>
        "เห็นว่าเดือนนี้คุณใช้จ่ายส่วนบันเทิงเยอะกว่าเดือนก่อน 15% เลยนะ"
      </div>
      <div style={{
        marginTop: 18, display: 'flex', alignItems: 'center', gap: 10,
        color: MH.n400, fontSize: 12,
      }}>
        <div style={{ flex: 1, height: 1, background: MH.n300 }} />
        <span>อ่านเพิ่ม</span>
        <div style={{ flex: 1, height: 1, background: MH.n300 }} />
      </div>
    </div>
  );
}

function QuickAdd() {
  const actions = [
    { icon: '✏️', label: 'พิมพ์เอง', bg: '#fff' },
    { icon: '💬', label: 'เสียง', bg: MH.primary200 },
    { icon: '📷', label: 'ถ่ายรูป', bg: MH.primary200 },
    { icon: '🖼️', label: 'เลือกรูป', bg: MH.primary200 },
    { icon: '✏️', label: 'อื่นๆ', bg: '#fff' },
  ];
  return (
    <div style={{ marginTop: 16, paddingLeft: 16 }}>
      <div style={{
        fontSize: 14, fontWeight: 600, color: MH.n900, marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span style={{ color: MH.primary500, fontWeight: 700 }}>+</span> เพิ่มรายการใหม่
      </div>
      <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
        {actions.map((a, i) => (
          <div key={i} style={{
            flexShrink: 0, width: 66, height: 80,
            background: '#fff', borderRadius: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              background: a.bg === '#fff' ? 'transparent' : MH.primary200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>
              {a.icon}
            </div>
            <div style={{ fontSize: 11, color: MH.n700 }}>{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AskAICard() {
  return (
    <div style={{
      margin: '14px 16px 0', padding: '10px 14px',
      background: '#fff', borderRadius: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
      border: `1px solid ${MH.walletViolet100}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `linear-gradient(135deg, ${MH.walletViolet} 0%, ${MH.primary300} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>✨</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: MH.n900 }}>สอบถาม AI</div>
        <div style={{ fontSize: 11, color: MH.n400 }}>ถามคำถามเกี่ยวกับการเงินของคุณ</div>
      </div>
      <div style={{
        width: 28, height: 28, borderRadius: 14,
        background: MH.walletViolet100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="10" height="14" viewBox="0 0 10 14">
          <path d="M2 2l6 5-6 5" stroke={MH.walletViolet} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

function UpcomingPreview() {
  return (
    <div style={{
      margin: '14px 16px 0',
      background: '#fff', borderRadius: 16, padding: '12px 16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: MH.n900, marginBottom: 10 }}>
        รายการที่ต้องจ่าย
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 17,
          background: MH.walletPink100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>🎬</div>
        <div style={{ flex: 1, fontSize: 13, color: MH.n900, fontWeight: 500 }}>หนัง</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: MH.n900 }}>1,111.00 €</div>
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <div style={{
      background: MH.n200, height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 84 }}>
        <HomeHeader />
        <AICard />
        <QuickAdd />
        <AskAICard />
        <UpcomingPreview />
      </div>
      <BottomNav active="home" />
    </div>
  );
}

window.HomeScreen = HomeScreen;
