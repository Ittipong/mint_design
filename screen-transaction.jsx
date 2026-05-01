// Transaction screen — monthly tabs, summary card, dated transaction groups
const MT = window.MINT;

function TxAvatar({ emoji, bg }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 19, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, flexShrink: 0,
    }}>{emoji}</div>
  );
}

function TxHeader() {
  return (
    <div style={{ padding: '2px 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <PiggyAvatar size={34} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: MT.n900 }}>ครอบครัว</span>
        <span style={{ fontSize: 13, color: MT.n400 }}>· 2,531.23 ฿</span>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: 2 }}>
          <path d="M3 4.5l3 3 3-3" stroke={MT.n400} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke={MT.n700} strokeWidth="1.8"/>
          <path d="M16 16l4 4" stroke={MT.n700} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={MT.n700} strokeWidth="1.8"/>
          <path d="M12 7v5l3 2" stroke={MT.n700} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <svg width="18" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="1.8" fill={MT.n700}/>
          <circle cx="12" cy="12" r="1.8" fill={MT.n700}/>
          <circle cx="12" cy="19" r="1.8" fill={MT.n700}/>
        </svg>
      </div>
    </div>
  );
}

function MonthTabs({ active = 'มีนาคม' }) {
  const months = ['68', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เดือนนี้', 'แผนในอนาคต'];
  return (
    <div style={{
      padding: '6px 12px 0',
      display: 'flex', gap: 16, overflowX: 'hidden', position: 'relative',
    }}>
      {months.map(m => {
        const isActive = m === active;
        return (
          <div key={m} style={{
            padding: '6px 4px 10px', position: 'relative',
            fontSize: 14, fontWeight: isActive ? 700 : 500,
            color: isActive ? MT.primary500 : (m === '68' ? MT.n400 : MT.n700),
            whiteSpace: 'nowrap',
          }}>
            {m}
            {isActive && (
              <div style={{
                position: 'absolute', bottom: 4, left: 0, right: 0,
                height: 2.5, borderRadius: 2, background: MT.primary400,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SummaryCard() {
  return (
    <div style={{
      margin: '12px 16px 0',
      background: '#fff', borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: MT.n400, marginBottom: 4 }}>ยอดเดือนนี้</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: MT.error400, letterSpacing: -0.5 }}>
            - 1,625.00 ฿
          </div>
        </div>
        <div style={{
          marginTop: 4,
          background: MT.n200, borderRadius: 8, padding: '4px 8px',
          display: 'flex', alignItems: 'center', gap: 3,
          fontSize: 12, fontWeight: 700, color: MT.n700,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M5 2l4 6H1z" fill={MT.primary500}/>
          </svg>
          77.2%
        </div>
      </div>
      <div style={{
        marginTop: 10, paddingTop: 10,
        borderTop: `1px dashed ${MT.n300}`,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, color: MT.n400,
      }}>
        <span>เริ่มต้นฯ ฿16,960</span>
        <span style={{ width: 1, background: MT.n300 }} />
        <span>ยอดรวม ฿15,335</span>
      </div>
      <div style={{
        marginTop: 10, paddingTop: 10,
        borderTop: `1px dashed ${MT.n300}`,
        textAlign: 'center', fontSize: 13, fontWeight: 600,
        color: MT.primary500,
      }}>
        ดูรายงาน →
      </div>
    </div>
  );
}

function TxRow({ emoji, bg, label, sublabel, amount, isIncome, isFirst, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0',
      borderTop: isFirst ? 'none' : `1px dashed ${MT.n300}`,
    }}>
      <TxAvatar emoji={emoji} bg={bg} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: MT.n900 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: MT.n400, marginTop: 1 }}>{sublabel}</div>}
      </div>
      <div style={{
        fontSize: 14, fontWeight: 700,
        color: isIncome ? MT.primary500 : MT.n900,
      }}>{amount}</div>
    </div>
  );
}

function DateGroup({ day, weekday, month, total, children }) {
  return (
    <div style={{
      margin: '12px 16px 0',
      background: '#fff', borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, paddingBottom: 8 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: MT.n900, lineHeight: 1, letterSpacing: -0.5 }}>
          {day}
        </div>
        <div style={{ flex: 1, paddingBottom: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: MT.n900 }}>{weekday}</div>
          <div style={{ fontSize: 11, color: MT.n400 }}>{month}</div>
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: MT.n900, paddingBottom: 2,
        }}>{total}</div>
      </div>
      {children}
    </div>
  );
}

function TransactionScreen() {
  return (
    <div style={{
      background: MT.n200, height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <MintStatusBar time="21:29" />
      <TxHeader />
      <MonthTabs active="มีนาคม" />
      <div style={{ height: 1, background: MT.n300, opacity: 0.6 }} />
      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 84 }}>
        <SummaryCard />

        <DateGroup day="31" weekday="วันอังคาร" month="มีนาคม 2569" total="- 1,710.00 ฿">
          <TxRow isFirst emoji="🍔" bg="#FCD38E" label="กาแฟ" amount="- 120.00 ฿" />
          <TxRow emoji="🎬" bg={MT.walletPink100} label="หนัง" sublabel="Major Cineplex" amount="- 150.00 ฿" />
          <TxRow emoji="🧾" bg={MT.walletViolet100} label="ค่าบิล" amount="- 1,440.00 ฿" />
        </DateGroup>

        <DateGroup day="30" weekday="วันจันทร์" month="มีนาคม 2569" total="- 560.00 ฿">
          <TxRow isFirst emoji="🍔" bg="#FCD38E" label="ซื้อวัตถุดิบ" sublabel="Makro" amount="- 560.00 ฿" />
        </DateGroup>

        <DateGroup day="29" weekday="วันอาทิตย์" month="มีนาคม 2569" total="- 4,7...">
          <TxRow isFirst emoji="🚗" bg={MT.walletViolet100} label="น้ำมัน" amount="- 525.00 ฿" />
        </DateGroup>
      </div>

      <MintFab bottom={100} right={20} />
      <BottomNav active="transaction" />
    </div>
  );
}

window.TransactionScreen = TransactionScreen;
