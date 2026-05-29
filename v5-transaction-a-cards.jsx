// v5-A · Refined Cards — evolution of the current per-date card layout.
// Fixes: compact date badge (was a giant 28px number), daily total demoted to
// a muted pill (kills the single-row redundancy), tabular right-aligned amounts,
// income in teal, denser rows. Familiar but cleaner.
const A5 = window.MINT;

function A5Summary() {
  const s = window.V5_SUMMARY;
  const inPct = Math.round((s.income / (s.income + s.total)) * 100);
  return (
    <div style={{
      margin: '12px 14px 0', background: '#fff', borderRadius: 18, padding: '16px 18px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 28px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: A5.n400, marginBottom: 3 }}>ใช้จ่ายเดือนนี้</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: A5.n900, letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums' }}>
            {window.v5fmt(window.V5_SUMMARY.spent)} ฿
          </div>
        </div>
        <div style={{
          marginTop: 4, background: A5.primary100, borderRadius: 9, padding: '5px 9px',
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 13, fontWeight: 700, color: A5.primary600,
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 9.5L1.5 3.5h9z" fill={A5.primary600}/></svg>
          {Math.abs(s.deltaPct)}%
        </div>
      </div>

      {/* in / out split bar */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: A5.n200 }}>
          <div style={{ width: `${inPct}%`, background: A5.primary400 }} />
          <div style={{ flex: 1, background: A5.walletRed }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12.5, color: A5.n400 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: A5.primary400, marginRight: 5 }} />
            เข้า <b style={{ color: A5.n700, fontVariantNumeric: 'tabular-nums' }}>฿{s.total.toLocaleString()}</b>
          </span>
          <span style={{ fontSize: 12.5, color: A5.n400 }}>
            ออก <b style={{ color: A5.n700, fontVariantNumeric: 'tabular-nums' }}>฿{s.start.toLocaleString()}</b>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: A5.walletRed, marginLeft: 5 }} />
          </span>
        </div>
      </div>

      <button style={{
        marginTop: 12, width: '100%', border: 'none', background: A5.n200, borderRadius: 11,
        padding: '11px 0', fontSize: 14, fontWeight: 600, color: A5.primary600, cursor: 'pointer',
        fontFamily: 'inherit',
      }}>ดูรายงาน →</button>
    </div>
  );
}

function A5Row({ it, first }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, padding: '8px 0',
      borderTop: first ? 'none' : `1px solid ${A5.n200}`,
    }}>
      <window.V5Icon kind={it.kind} tint={it.tint} glyphColor={it.gc} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: A5.n900 }}>{it.label}</div>
        {it.sub && <div style={{ fontSize: 12.5, color: A5.n400, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.sub}</div>}
      </div>
      <window.V5Amount value={it.amt} size={15} />
    </div>
  );
}

function A5DateCard({ g }) {
  const total = window.v5DayTotal(g.items);
  const single = g.items.length === 1;
  return (
    <div style={{
      margin: '12px 14px 0', background: '#fff', borderRadius: 18, padding: '12px 16px 8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 22px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 6 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, background: A5.n200,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: A5.n900, lineHeight: 1 }}>{g.day}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: A5.n900 }}>{g.wd}</div>
          <div style={{ fontSize: 11.5, color: A5.n400 }}>{g.md}</div>
        </div>
        {/* daily total demoted to a muted pill; hidden when single row to kill redundancy */}
        {!single && (
          <div style={{
            background: A5.n200, borderRadius: 8, padding: '4px 10px',
            fontSize: 13, fontWeight: 700, color: total > 0 ? A5.primary600 : A5.n700,
            fontVariantNumeric: 'tabular-nums',
          }}>{total > 0 ? '+' : '−'}{window.v5fmt(total)}</div>
        )}
      </div>
      {g.items.map((it, i) => <A5Row key={i} it={it} first={i === 0} />)}
    </div>
  );
}

function TransactionV5A() {
  return (
    <div style={{ background: A5.n200, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <window.V5StatusBar />
      <window.V5TopBar />
      <window.V5MonthTabs active="เมษายน" />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 96 }}>
        <A5Summary />
        {window.V5_GROUPS.map((g, i) => <A5DateCard key={i} g={g} />)}
      </div>
      <window.MintFab bottom={100} right={20} />
      <window.BottomNav active="transaction" />
    </div>
  );
}

window.TransactionV5A = TransactionV5A;
