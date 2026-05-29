// v5-B · Timeline List — drops per-date cards for one continuous sheet with
// sticky section headers (date pill left, daily total right) + flat rows with
// hairline dividers. iOS Wallet / Settings feel: highest density & scannability.
const B5 = window.MINT;

function B5HeroStrip() {
  const s = window.V5_SUMMARY;
  return (
    <div style={{ padding: '14px 18px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: B5.n400, marginBottom: 2 }}>ใช้จ่ายเดือนนี้</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: B5.n900, letterSpacing: -0.7, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
            {window.v5fmt(s.spent)} <span style={{ fontSize: 18 }}>฿</span>
          </div>
        </div>
        <div style={{
          background: B5.primary100, borderRadius: 9, padding: '5px 9px', marginBottom: 4,
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: B5.primary600,
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 9.5L1.5 3.5h9z" fill={B5.primary600}/></svg>
          {Math.abs(s.deltaPct)}%
        </div>
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 10, fontSize: 12.5, color: B5.n400 }}>
        <span>เข้า <b style={{ color: B5.primary600, fontVariantNumeric: 'tabular-nums' }}>฿{s.total.toLocaleString()}</b></span>
        <span>ออก <b style={{ color: B5.n700, fontVariantNumeric: 'tabular-nums' }}>฿{s.start.toLocaleString()}</b></span>
        <span style={{ marginLeft: 'auto', color: B5.primary600, fontWeight: 600 }}>ดูรายงาน →</span>
      </div>
    </div>
  );
}

function B5SectionHeader({ g }) {
  const total = window.v5DayTotal(g.items);
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '7px 18px', background: 'rgba(247,247,250,0.92)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: B5.n900 }}>{g.day}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: B5.n700 }}>{g.wd}</span>
        <span style={{ fontSize: 11.5, color: B5.n400 }}>{g.md.replace(' 2569', '')}</span>
      </div>
      <span style={{
        fontSize: 12.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
        color: total > 0 ? B5.primary600 : B5.n400,
      }}>{total > 0 ? '+' : '−'}{window.v5fmt(total)} ฿</span>
    </div>
  );
}

function B5Row({ it, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '0 18px', background: '#fff' }}>
      <window.V5Icon kind={it.kind} tint={it.tint} glyphColor={it.gc} size={40} />
      <div style={{
        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12,
        minHeight: 60, borderBottom: last ? 'none' : `1px solid ${B5.n200}`,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: B5.n900 }}>{it.label}</div>
          {it.sub && <div style={{ fontSize: 12.5, color: B5.n400, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.sub}</div>}
        </div>
        <window.V5Amount value={it.amt} size={15} />
      </div>
    </div>
  );
}

function B5Group({ g }) {
  return (
    <div>
      <B5SectionHeader g={g} />
      <div style={{ background: '#fff' }}>
        {g.items.map((it, i) => <B5Row key={i} it={it} last={i === g.items.length - 1} />)}
      </div>
    </div>
  );
}

function TransactionV5B() {
  return (
    <div style={{ background: B5.n200, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <window.V5StatusBar />
      <window.V5TopBar />
      <window.V5MonthTabs active="เมษายน" />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 96 }}>
        <div style={{ background: '#fff', borderBottom: `1px solid ${B5.n300}` }}>
          <B5HeroStrip />
        </div>
        {window.V5_GROUPS.map((g, i) => <B5Group key={i} g={g} />)}
      </div>
      <window.MintFab bottom={100} right={20} />
      <window.BottomNav active="transaction" />
    </div>
  );
}

window.TransactionV5B = TransactionV5B;
