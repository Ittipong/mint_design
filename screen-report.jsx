// Report screen 1 — summary + pie chart
const MR = window.MINT;

function ReportHeader({ time = '21:37' }) {
  return (
    <>
      <MintStatusBar time={time} />
      <div style={{ padding: '2px 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <PiggyAvatar size={34} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: MR.n900 }}>ครอบครัว</span>
          <span style={{ fontSize: 13, color: MR.n400 }}>· 2,531.23 ฿</span>
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: 2 }}>
            <path d="M3 4.5l3 3 3-3" stroke={MR.n400} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={MR.n700} strokeWidth="1.8"/>
            <path d="M12 7v5l3 2" stroke={MR.n700} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <svg width="18" height="22" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.8" fill={MR.n700}/>
            <circle cx="12" cy="12" r="1.8" fill={MR.n700}/>
            <circle cx="12" cy="19" r="1.8" fill={MR.n700}/>
          </svg>
        </div>
      </div>
    </>
  );
}

function RMonthTabs({ active = 'เดือนนี้' }) {
  const months = ['68', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เดือนนี้', 'แผนในอนาคต'];
  return (
    <div style={{ padding: '6px 12px 0', display: 'flex', gap: 16, overflow: 'hidden' }}>
      {months.map(m => {
        const isActive = m === active;
        return (
          <div key={m} style={{
            padding: '6px 4px 10px', position: 'relative',
            fontSize: 14, fontWeight: isActive ? 700 : 500,
            color: isActive ? MR.primary500 : (m === '68' ? MR.n400 : MR.n700),
            whiteSpace: 'nowrap',
          }}>
            {m}
            {isActive && (
              <div style={{
                position: 'absolute', bottom: 4, left: 0, right: 0,
                height: 2.5, borderRadius: 2, background: MR.primary400,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReportSummary() {
  return (
    <div style={{
      margin: '12px 16px 0',
      background: '#fff', borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 12, color: MR.n400 }}>ยอดวันนี้</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: MR.error400, letterSpacing: -0.5, marginTop: 2 }}>
        - 24,112.43 ฿
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 12, color: MR.error400, fontWeight: 600 }}>
        -257.2%
        <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 2l5 5 3-3 4 4" stroke={MR.error400} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ color: MR.n400, fontWeight: 400 }}>จากเดือนที่แล้ว</span>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: MR.n400 }}>เริ่มต้นเดือน
        <span style={{ float: 'right', color: MR.n700, fontWeight: 600 }}>15,335.00 ฿</span>
      </div>
      <div style={{ marginTop: 6, height: 6, borderRadius: 3, background: MR.n300, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '30%', background: MR.primary400 }} />
        <div style={{ flex: 1, background: MR.error300 }} />
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: MR.n200, borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 11, color: MR.n400 }}>รายรับ</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: MR.n900, marginTop: 2 }}>26,885.00 ฿</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2, fontSize: 11, color: MR.error400, fontWeight: 600 }}>
            -56.6% <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 1l4 4 4-4" stroke={MR.error400} strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          </div>
        </div>
        <div style={{ flex: 1, background: MR.n200, borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 11, color: MR.n400 }}>รายจ่าย</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: MR.n900, marginTop: 2 }}>66,332.43 ฿</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2, fontSize: 11, color: MR.primary500, fontWeight: 600 }}>
            +4.2% <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 7l4-4 4 4" stroke={MR.primary500} strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px dashed ${MR.n300}`, textAlign: 'center', fontSize: 13, fontWeight: 600, color: MR.primary500 }}>
        ดูรายการ →
      </div>
    </div>
  );
}

function DonutChart() {
  // segments: label, percent, color
  const segs = [
    { pct: 42, color: '#FCD38E' }, // yellow biggest
    { pct: 21, color: MR.walletPink100 },
    { pct: 11, color: MR.walletPink200 || '#F2CBD8' },
    { pct: 7, color: '#FAD5CC' },
    { pct: 19, color: '#FEE5C2' },
  ];
  const r = 62, cx = 90, cy = 90, circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={MR.n200} strokeWidth="28" />
      {segs.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="28"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

function CategoryPieSection() {
  return (
    <div style={{
      margin: '12px 16px 0',
      background: '#fff', borderRadius: 16, padding: '14px 16px 6px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: MR.n900 }}>สรุปตามหมวดหมู่</div>
        <div style={{ fontSize: 12, color: MR.primary500, fontWeight: 600 }}>ดูทั้งหมด</div>
      </div>

      <div style={{
        margin: '12px 0', padding: 4,
        background: MR.n200, borderRadius: 10,
        display: 'flex', gap: 2,
      }}>
        {['รายจ่าย', 'รายรับ', 'ทั้งหมด'].map((t, i) => {
          const isActive = i === 0;
          return (
            <div key={t} style={{
              flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 8,
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? MR.n900 : MR.n400,
              background: isActive ? '#fff' : 'transparent',
              boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            }}>{t}</div>
          );
        })}
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: '14px 0 18px' }}>
        <DonutChart />
        {/* callouts */}
        <div style={{ position: 'absolute', top: 10, right: 60, fontSize: 11, color: MR.n700, fontWeight: 600 }}>7%</div>
        <div style={{ position: 'absolute', top: 34, left: 34, fontSize: 11, color: MR.n700, fontWeight: 600 }}>11%</div>
        <div style={{ position: 'absolute', top: 92, left: 14, fontSize: 11, color: MR.n700, fontWeight: 600 }}>21%</div>

        {/* category bullets */}
        <div style={{ position: 'absolute', top: 20, right: 92,
          width: 24, height: 24, borderRadius: 12, background: MR.walletPink100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
          border: '1.5px solid #fff',
        }}>⋯</div>
        <div style={{ position: 'absolute', top: 48, left: 58,
          width: 24, height: 24, borderRadius: 12, background: MR.walletPink100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
          border: '1.5px solid #fff',
        }}>🛍</div>
        <div style={{ position: 'absolute', top: 108, left: 42,
          width: 24, height: 24, borderRadius: 12, background: MR.walletPink100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
          border: '1.5px solid #fff',
        }}>🎭</div>
        <div style={{ position: 'absolute', bottom: 18, right: 50,
          width: 26, height: 26, borderRadius: 13, background: MR.info200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          border: '1.5px solid #fff',
        }}>🚗</div>
      </div>
    </div>
  );
}

function ReportScreen() {
  return (
    <div style={{
      background: MR.n200, height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 84 }}>
        <ReportHeader />
        <RMonthTabs />
        <div style={{ height: 1, background: MR.n300, opacity: 0.6 }} />
        <ReportSummary />
        <CategoryPieSection />
      </div>

      <MintFab bottom={100} right={20} />
      <BottomNav active="report" />
    </div>
  );
}

window.ReportScreen = ReportScreen;
window.ReportHeader = ReportHeader;
window.RMonthTabs = RMonthTabs;
