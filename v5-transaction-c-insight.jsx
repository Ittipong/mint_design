// v5-C · Insight-first — premium fintech take. Gradient hero with a weekly
// mini bar-chart + in/out segmented bar, then a timeline rail (dots + connector)
// down the left, rows in soft cards, solid-color category icons. More visual depth.
const C5 = window.MINT;

function C5MiniChart() {
  // weekly spend buckets (relative heights); last week highlighted
  const bars = [40, 65, 38, 80, 52, 95, 70];
  const max = Math.max(...bars);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 44 }}>
      {bars.map((b, i) => (
        <div key={i} style={{
          flex: 1, height: `${(b / max) * 100}%`, borderRadius: 4,
          background: i === bars.length - 1 ? '#fff' : 'rgba(255,255,255,0.4)',
        }} />
      ))}
    </div>
  );
}

function C5Hero() {
  const s = window.V5_SUMMARY;
  const inPct = Math.round((s.income / (s.income + s.total)) * 100);
  return (
    <div style={{
      margin: '12px 14px 0', borderRadius: 22, padding: '18px 20px',
      background: `linear-gradient(135deg, ${C5.primary400} 0%, ${C5.primary600} 100%)`,
      boxShadow: '0 10px 30px rgba(44,122,123,0.35)', color: '#fff',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 3 }}>ใช้จ่ายเดือนนี้</div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.7, fontVariantNumeric: 'tabular-nums' }}>
            {window.v5fmt(s.spent)} ฿
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.22)', borderRadius: 9, padding: '5px 9px',
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700,
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 9.5L1.5 3.5h9z" fill="#fff"/></svg>
          {Math.abs(s.deltaPct)}%
        </div>
      </div>

      <div style={{ marginTop: 14 }}><C5MiniChart /></div>

      <div style={{ marginTop: 14, paddingTop: 13, borderTop: '1px solid rgba(255,255,255,0.22)', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)' }}>เงินเข้า</div>
          <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>฿{s.total.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)' }}>เงินออก</div>
          <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>฿{s.start.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

function C5Row({ it, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: '#fff', borderRadius: 14, padding: '11px 14px',
      marginBottom: last ? 0 : 8,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.035)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, background: it.gc, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <window.V5CatGlyph kind={it.kind} size={22} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C5.n900 }}>{it.label}</div>
        {it.sub && <div style={{ fontSize: 12.5, color: C5.n400, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.sub}</div>}
      </div>
      <window.V5Amount value={it.amt} size={15} />
    </div>
  );
}

function C5Group({ g, lastGroup }) {
  const total = window.v5DayTotal(g.items);
  return (
    <div style={{ display: 'flex', gap: 12, padding: '0 14px' }}>
      {/* timeline rail */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30, flexShrink: 0 }}>
        <div style={{ width: 36, textAlign: 'center', paddingTop: 2 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C5.n900, lineHeight: 1 }}>{g.day}</div>
          <div style={{ fontSize: 10, color: C5.n400, marginTop: 1 }}>{g.wd.replace('วัน', '')}</div>
        </div>
        {!lastGroup && <div style={{ flex: 1, width: 2, background: C5.n300, marginTop: 6, borderRadius: 1 }} />}
      </div>
      {/* rows */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: 16 }}>
        <div style={{ fontSize: 11.5, color: C5.n400, marginBottom: 7, fontVariantNumeric: 'tabular-nums' }}>
          รวม {total > 0 ? '+' : '−'}{window.v5fmt(total)} ฿
        </div>
        {g.items.map((it, i) => <C5Row key={i} it={it} last={i === g.items.length - 1} />)}
      </div>
    </div>
  );
}

function TransactionV5C() {
  return (
    <div style={{ background: C5.n200, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <window.V5StatusBar />
      <window.V5TopBar />
      <window.V5MonthTabs active="เมษายน" />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 96 }}>
        <C5Hero />
        <div style={{ height: 16 }} />
        {window.V5_GROUPS.map((g, i) => (
          <C5Group key={i} g={g} lastGroup={i === window.V5_GROUPS.length - 1} />
        ))}
      </div>
      <window.MintFab bottom={100} right={20} />
      <window.BottomNav active="transaction" />
    </div>
  );
}

window.TransactionV5C = TransactionV5C;
