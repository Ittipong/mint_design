// Add Transaction Bottom Sheet · 00 · ✦ AI (S0 Empty)
// Function: AddTxnAI_Empty
//   Duplicate ของ "02 · รายรับ" → เพิ่มแท็บ "✦ AI" เป็นแท็บแรก + default
//   โหมด AI: พิมพ์ / พูด / ถ่ายสลิป → transaction (ยังไม่มี input = empty state)
// Depends on tokens.js + primitives.jsx (MintStatusBar)

const TAI = window.MINT;

// ─── Tab row (AI แทรกเป็นตัวแรก + selected) ────────────────────────
function AITabs() {
  const tops = [
    { key: 'ai',       label: '✦ AI' },
    { key: 'expense',  label: 'รายจ่าย' },
    { key: 'income',   label: 'รายรับ' },
    { key: 'credit',   label: 'บัตรเครดิต' },
    { key: 'transfer', label: 'โอนเงิน' },
    { key: 'saving',   label: 'ออมเงิน' },
  ];
  const active = 'ai';
  return (
    <div style={{ padding: '0 16px 14px', flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {tops.map(t => {
          const on = t.key === active;
          const isAI = t.key === 'ai';
          return (
            <div key={t.key} style={{
              padding: '8px 16px', borderRadius: 999,
              // AI selected = gradient ม่วง→เขียว ให้ดูพิเศษกว่าแท็บปกติ
              background: on
                ? (isAI ? `linear-gradient(135deg, ${TAI.walletViolet} 0%, ${TAI.primary400} 100%)` : TAI.n900)
                : '#fff',
              color: on ? '#fff' : TAI.n600,
              fontSize: 13, fontWeight: on ? 700 : 500,
              border: on ? 'none' : `1px solid ${TAI.n300}`,
              boxShadow: on && isAI ? '0 4px 12px rgba(148,154,235,0.35)' : 'none',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>{t.label}</div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Example chip (กดแล้วเติมข้อความลง input) ──────────────────────
function AIExampleChip({ label }) {
  return (
    <div style={{
      padding: '9px 16px', borderRadius: 999,
      background: '#FAF9FF', border: `1px solid ${TAI.walletViolet100}`,
      color: '#5E5BD8', fontSize: 13, fontWeight: 600,
      cursor: 'pointer', flexShrink: 0,
    }}>{label}</div>
  );
}

// ─── Input bar — text + mic + camera + send (icon inline ในแถบเดียว) ─
function AIInputBar() {
  const iconBtn = (child) => (
    <div style={{
      width: 34, height: 34, borderRadius: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0,
    }}>{child}</div>
  );
  return (
    <div style={{
      padding: '10px 16px 20px', background: TAI.n200, flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: '#fff', borderRadius: 999,
        border: `1px solid ${TAI.n300}`,
        padding: '6px 6px 6px 18px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 14px rgba(0,0,0,0.04)',
      }}>
        <div style={{ flex: 1, fontSize: 14, color: TAI.n400, fontWeight: 500 }}>
          พิมพ์หรือพูด…
        </div>
        {/* mic */}
        {iconBtn(
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="3" width="6" height="11" rx="3" stroke={TAI.n600} strokeWidth="1.8"/>
            <path d="M5 11a7 7 0 0014 0M12 18v3" stroke={TAI.n600} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        )}
        {/* camera */}
        {iconBtn(
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 8a2 2 0 012-2h1.5l1-2h5l1 2H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              stroke={TAI.n600} strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="12" cy="12.5" r="3" stroke={TAI.n600} strokeWidth="1.8"/>
          </svg>
        )}
        {/* send */}
        <div style={{
          width: 38, height: 38, borderRadius: 999,
          background: `linear-gradient(135deg, ${TAI.walletViolet} 0%, ${TAI.primary400} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 4px 10px rgba(148,154,235,0.35)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Screen — S0 Empty ────────────────────────────────────────────
function AddTxnAI_Empty() {
  return (
    <div style={{
      background: TAI.n200,
      height: '100%', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <MintStatusBar time="09:30" />

      <div style={{
        background: TAI.n200, height: '90%',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, flexShrink: 0 }}>
          <div style={{ width: 36, height: 5, borderRadius: 3, background: TAI.n300 }} />
        </div>

        {/* Header — title + close */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 18px 14px', flexShrink: 0,
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: TAI.n900, letterSpacing: -0.2 }}>เพิ่มรายการ</div>
          <div style={{
            width: 30, height: 30, borderRadius: 999, background: '#fff',
            border: `1px solid ${TAI.n300}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke={TAI.n600} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <AITabs />

        {/* Empty hero — กึ่งกลาง */}
        <div style={{
          flex: 1, overflow: 'auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '0 24px', textAlign: 'center',
        }}>
          {/* ✦ glyph */}
          <div style={{
            width: 64, height: 64, borderRadius: 20, marginBottom: 18,
            background: `linear-gradient(135deg, ${TAI.walletViolet} 0%, ${TAI.primary400} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 30,
            boxShadow: '0 8px 20px rgba(148,154,235,0.35)',
          }}>✦</div>

          <div style={{ fontSize: 19, fontWeight: 700, color: TAI.n900, letterSpacing: -0.2 }}>
            เล่าให้ Mint ฟังได้เลย
          </div>
          <div style={{ fontSize: 13.5, color: TAI.n400, fontWeight: 500, marginTop: 6 }}>
            พิมพ์ · พูด · หรือถ่ายสลิป
          </div>

          {/* Example chips */}
          <div style={{ fontSize: 12, color: TAI.n400, fontWeight: 600, margin: '28px 0 12px' }}>
            ลองแบบนี้
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
          }}>
            <AIExampleChip label="กาแฟ 300" />
            <AIExampleChip label="เงินเดือน 35000" />
            <AIExampleChip label="ค่าเน็ต 599" />
          </div>
        </div>

        {/* Input bar pinned bottom */}
        <AIInputBar />
      </div>
    </div>
  );
}

window.AddTxnAI_Empty = AddTxnAI_Empty;
