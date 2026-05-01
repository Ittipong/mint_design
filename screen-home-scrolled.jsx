// Home Scrolled screen — upcoming payments, wallets, savings, budget
const MH2 = window.MINT;

function SectionCard({ title, right, children }) {
  return (
    <div style={{
      margin: '12px 16px 0',
      background: '#fff', borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: MH2.n900 }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Row({ avatar, label, sublabel, amount, amountColor, badge, isFirst }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 0',
      borderTop: isFirst ? 'none' : `1px dashed ${MH2.n300}`,
    }}>
      {avatar}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: MH2.n900 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: MH2.n400, marginTop: 1 }}>{sublabel}</div>}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: amountColor || MH2.n900 }}>{amount}</div>
        {badge && (
          <div style={{
            display: 'inline-block', marginTop: 3,
            background: MH2.warning200 || '#F9E6AE', color: '#8B6836',
            fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
          }}>{badge}</div>
        )}
      </div>
    </div>
  );
}

function ProgressRow({ icon, bg, label, percent }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 17, background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: MH2.n900 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: MH2.primary500 }}>{percent}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: MH2.n300 }}>
            <div style={{
              width: `${percent}%`, height: '100%', borderRadius: 3,
              background: MH2.primary400,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeScrolledScreen() {
  return (
    <div style={{
      background: MH2.n200, height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        background: `linear-gradient(180deg, ${MH2.gradStart} 0%, ${MH2.n200} 100%)`,
      }}>
        <MintStatusBar time="21:37" />
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '0 20px 10px',
        }}>
          <div>
            <div style={{ fontSize: 13, color: MH2.n600, marginBottom: 2 }}>Net Worth</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: MH2.n900 }}>฿ 125,430.00</div>
          </div>
          <div style={{ position: 'relative' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 3a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V9a6 6 0 00-6-6zM9 18a3 3 0 006 0" stroke={MH2.n700} strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            <div style={{
              position: 'absolute', top: -2, right: -2,
              width: 16, height: 16, borderRadius: 8,
              background: MH2.error400, color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>1</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 84 }}>
        {/* รายการที่ต้องจ่าย */}
        <SectionCard title="รายการที่ต้องจ่าย">
          <Row
            isFirst
            avatar={<div style={{ width:34, height:34, borderRadius:17, background: MH2.walletPink100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎬</div>}
            label="หนัง" sublabel="20 เม.ย." amount="1,111.00 €" badge="อีก 2 วัน"
          />
          <Row
            avatar={<div style={{ width:34, height:34, borderRadius:17, background: MH2.walletPink100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎮</div>}
            label="เกม" sublabel="2 มิ.ย." amount="2,222.00 €" badge="2 มิ.ย."
          />
        </SectionCard>

        {/* กระเป๋าเงิน */}
        <SectionCard
          title="กระเป๋าเงิน"
          right={<div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ color: MH2.primary500, fontSize:18, fontWeight:400 }}>+</span>
            <span style={{ fontSize: 12, color: MH2.primary500, fontWeight: 600 }}>ดูทั้งหมด</span>
          </div>}
        >
          <Row
            isFirst
            avatar={<div style={{ width:34, height:34, borderRadius:17, background: '#fff', border: `1.5px solid ${MH2.n300}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🥧</div>}
            label="Kbank Credit" sublabel="บัตรเครดิต"
            amount="75,000.00 ฿"
            amountColor={MH2.primary500}
          />
          <div style={{ fontSize: 11, color: MH2.n400, marginTop: -6, paddingLeft: 46, marginBottom: 4, textAlign:'right' }}>
            วงเงินคงเหลือ
          </div>
          <Row
            avatar={<div style={{ width:34, height:34, borderRadius:17, background: MH2.walletGreen100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>💼</div>}
            label="CardX" sublabel="บัตรเครดิต"
            amount="47,000.00 ฿"
            amountColor={MH2.primary500}
          />
          <div style={{ fontSize: 11, color: MH2.n400, marginTop: -6, paddingLeft: 46, textAlign:'right' }}>
            วงเงินคงเหลือ
          </div>
          <div style={{
            textAlign: 'center', marginTop: 10, paddingTop: 8,
            fontSize: 12, color: MH2.primary500, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M2 3.5l3 3 3-3" stroke={MH2.primary500} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            แสดงเพิ่มเติม (5)
          </div>
        </SectionCard>

        {/* การออม */}
        <SectionCard
          title="การออม"
          right={<div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:MH2.n600 }}>
            <span>2 เป้าหมาย · </span>
            <span style={{ color: MH2.primary500, fontWeight:600 }}>42,303.23 ฿</span>
            <span style={{ color: MH2.primary500, fontWeight:600, marginLeft: 4 }}>ดูทั้งหมด ›</span>
          </div>}
        >
          <ProgressRow icon="✈️" bg={MH2.info200} label="เที่ยวอังกฤษ" percent={42} />
          <ProgressRow icon="🗾" bg="#FFE3A8" label="Japan" percent={20} />
        </SectionCard>

        {/* งบประมาณ */}
        <SectionCard
          title="งบประมาณ"
          right={<div style={{ fontSize:12, color:MH2.n600 }}>
            1 รายการ · เหลือ <span style={{ fontWeight: 700, color: MH2.n900 }}>0.00 ฿</span>
          </div>}
        >
          <Row
            isFirst
            avatar={<div style={{ width:34, height:34, borderRadius:17, background: MH2.walletPink100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>📊</div>}
            label="งบใช้จ่ายรายเดือน" amount=""
          />
        </SectionCard>
      </div>

      <MintFab bottom={100} right={20} />
      <BottomNav active="home" />
    </div>
  );
}

window.HomeScrolledScreen = HomeScrolledScreen;
