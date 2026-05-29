// v5 Transaction redesign — shared primitives for the 3 versions (A/B/C).
// Why: header/tabs/nav/icons/data are identical across versions; only the
// summary + list layout differs, so we keep the diff focused per file.
const V5 = window.MINT;

// ─── Clean iOS status bar (no DEBUG ribbon, matches screenshot 08:37) ──
function V5StatusBar({ time = '08:37' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 30px 8px', position: 'relative', zIndex: 20,
      fontFamily: '-apple-system, "SF Pro Text", system-ui',
    }}>
      <span style={{ fontSize: 17, fontWeight: 600, color: '#000', letterSpacing: -0.3 }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          {[0,1,2,3].map(i => (
            <rect key={i} x={i*5} y={9 - i*2.5} width="3.2" height={3 + i*2.5} rx="1" fill="#000"/>
          ))}
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="#000"/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="#000"/>
          <circle cx="8.5" cy="10.5" r="1.5" fill="#000"/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#000" strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="13" height="9" rx="2" fill="#000"/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="#000" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Category line glyphs (consistent 1.7 stroke, no emoji) ───────────
function V5CatGlyph({ kind, size = 22, color = '#fff' }) {
  const p = { stroke: color, strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    credit: <><rect x="3" y="6" width="18" height="12.5" rx="2.5" {...p}/><path d="M3 10.5h18" {...p}/><path d="M6.5 14.5h3" {...p}/></>,
    food:   <><path d="M6 8h10.5v2.5a5.25 5.25 0 0 1-10.5 0z" {...p}/><path d="M16.5 9h2a1.6 1.6 0 0 1 0 3.2h-2" {...p}/><path d="M8 4.5v1.6M11 4v2.1M14 4.5v1.6" {...p}/></>,
    shop:   <><path d="M6 8.5h12l-1 10.5H7z" {...p}/><path d="M9 8.5a3 3 0 0 1 6 0" {...p}/></>,
    salary: <><rect x="3" y="7" width="18" height="10.5" rx="2" {...p}/><circle cx="12" cy="12.25" r="2.6" {...p}/><path d="M6 10v4.5M18 10v4.5" {...p}/></>,
    piggy:  <><path d="M4 12.5a6 6 0 0 1 6-6h2.5a6 6 0 0 1 6 6c0 1.3-.4 2.5-1.1 3.5v2H15v-1.3a6.4 6.4 0 0 1-3.4 0V18H9v-1.7a6 6 0 0 1-3.4-3.3H4z" {...p}/><circle cx="9" cy="11.3" r="0.9" fill={color} stroke="none"/><path d="M4 11.5c-.9-.3-1.3.3-1.3 1" {...p}/></>,
    car:    <><path d="M4.5 13l1.4-4.3A2 2 0 0 1 7.8 7.3h8.4a2 2 0 0 1 1.9 1.4L19.5 13v4.5h-2.2V16H6.7v1.5H4.5z" {...p}/><circle cx="7.8" cy="15" r="1.1" {...p}/><circle cx="16.2" cy="15" r="1.1" {...p}/></>,
    transfer: <><path d="M4 9.2h12.5M13.5 6l3 3.2-3 3.2" {...p}/><path d="M20 14.8H7.5M10.5 18l-3-3.2 3-3.2" {...p}/></>,
    bill:   <><path d="M6.5 3.5h11v17l-1.8-1.1-1.8 1.1-1.8-1.1-1.8 1.1-1.8-1.1-1.8 1.1z" {...p}/><path d="M9 8h6M9 11h6M9 14h4" {...p}/></>,
    wallet: <><path d="M4 8.5a2.5 2.5 0 0 1 2.5-2.5h10A2.5 2.5 0 0 1 19 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 4 15.5z" {...p}/><path d="M15 11h5v3h-5a1.5 1.5 0 0 1 0-3z" {...p}/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{paths[kind] || paths.shop}</svg>;
}

// ─── Tinted round category icon ───────────────────────────────────────
function V5Icon({ kind, tint, glyphColor, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2, background: tint,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <V5CatGlyph kind={kind} size={size * 0.55} color={glyphColor} />
    </div>
  );
}

// ─── Money formatter (tabular, grouped) ───────────────────────────────
function v5fmt(n) {
  return Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Amount text — income = teal w/ +, expense = neutral dark w/ − (keeps "ลดสีแดง")
function V5Amount({ value, size = 15, weight = 700 }) {
  const income = value > 0;
  return (
    <span style={{
      fontSize: size, fontWeight: weight,
      color: income ? V5.primary600 : V5.n900,
      fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', letterSpacing: -0.2,
    }}>
      {income ? '+ ' : '− '}{v5fmt(value)} ฿
    </span>
  );
}

// ─── Top app bar (wallet + balance + actions) ─────────────────────────
function V5TopBar() {
  const Action = ({ children }) => (
    <button style={{
      width: 38, height: 38, borderRadius: 19, border: 'none', background: 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    }}>{children}</button>
  );
  const sk = { stroke: V5.n700, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 10px 4px 14px' }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, background: V5.primary400,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="13" rx="3" fill="#fff"/>
          <path d="M3 10h18" stroke={V5.primary400} strokeWidth="1.6"/>
        </svg>
      </div>
      <button style={{
        display: 'flex', alignItems: 'baseline', gap: 6, border: 'none', background: 'transparent',
        cursor: 'pointer', padding: '4px 6px', minWidth: 0, flex: 1,
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: V5.n900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 84 }}>กระเป๋า…</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: V5.n400, fontVariantNumeric: 'tabular-nums' }}>123,834.00 ฿</span>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
          <path d="M3 4.5l3 3 3-3" {...sk} />
        </svg>
      </button>
      <Action><svg width="20" height="20" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" {...sk}/><path d="M16.5 16.5L21 21" {...sk}/></svg></Action>
      <Action><svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v3h3" {...sk}/><path d="M12 8v4l2.5 1.5" {...sk}/></svg></Action>
      <Action><svg width="20" height="20" viewBox="0 0 24 24">{[5,12,19].map(cy => <circle key={cy} cx="12" cy={cy} r="1.7" fill={V5.n700}/>)}</svg></Action>
    </div>
  );
}

// ─── Month tabs ───────────────────────────────────────────────────────
function V5MonthTabs({ active = 'เมษายน' }) {
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'เดือนนี้', 'แผนในอนาคต'];
  return (
    <div style={{
      padding: '4px 14px 0', display: 'flex', gap: 18, overflowX: 'hidden',
      borderBottom: `1px solid ${V5.n300}`,
    }}>
      {months.map(m => {
        const on = m === active;
        return (
          <div key={m} style={{
            padding: '6px 2px 9px', position: 'relative', whiteSpace: 'nowrap',
            fontSize: 15, fontWeight: on ? 700 : 500,
            color: on ? V5.primary600 : V5.n400,
          }}>
            {m}
            {on && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2.5, borderRadius: 2, background: V5.primary400 }} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared sample data (from screenshot + extra rows for density) ─────
const V5_SUMMARY = { spent: 27480, deltaPct: -32.7, start: 68980, total: 96460, income: 45000 };

const V5_GROUPS = [
  { day: '25', wd: 'วันเสาร์', md: 'เมษายน 2569', items: [
    { kind: 'credit', tint: V5.walletViolet100, gc: V5.walletViolet, label: 'จ่ายบัตรเครดิต', sub: 'จ่ายบิลบัตร SCB', amt: -3000 },
    { kind: 'food',   tint: '#FCE7C7', gc: '#D9982B', label: 'ร้านกาแฟ', sub: 'Starbucks', amt: -185 },
    { kind: 'shop',   tint: V5.walletPink100, gc: V5.walletPink, label: 'ช้อปปิ้ง', sub: 'Lazada', amt: -1290 },
  ]},
  { day: '24', wd: 'วันศุกร์', md: 'เมษายน 2569', items: [
    { kind: 'salary', tint: V5.walletGreen100, gc: V5.walletGreen, label: 'เงินเดือน', sub: 'บริษัท ABC จำกัด', amt: 45000 },
  ]},
  { day: '23', wd: 'วันพฤหัสบดี', md: 'เมษายน 2569', items: [
    { kind: 'piggy', tint: V5.walletGreen100, gc: V5.walletGreen, label: 'โอนเงินออม', sub: 'ออมดาวน์รถ', amt: -3000 },
    { kind: 'car',   tint: V5.info200, gc: V5.info400, label: 'ค่าน้ำมัน', sub: 'PTT Station', amt: -800 },
  ]},
  { day: '15', wd: 'วันพุธ', md: 'เมษายน 2569', items: [
    { kind: 'transfer', tint: V5.info200, gc: V5.info400, label: 'โอนเงิน', sub: 'โอนเข้าออมทรัพย์', amt: -10000 },
  ]},
  { day: '10', wd: 'วันศุกร์', md: 'เมษายน 2569', items: [
    { kind: 'bill', tint: V5.walletViolet100, gc: V5.walletViolet, label: 'ค่าบิล', sub: 'ค่าไฟฟ้า MEA', amt: -1200 },
    { kind: 'food', tint: '#FCEFC7', gc: '#D9982B', label: 'ค่าอาหาร', sub: 'ร้านอาหารตามสั่ง', amt: -260 },
  ]},
];

function v5DayTotal(items) { return items.reduce((s, it) => s + it.amt, 0); }

Object.assign(window, {
  V5StatusBar, V5CatGlyph, V5Icon, v5fmt, V5Amount, V5TopBar, V5MonthTabs,
  V5_SUMMARY, V5_GROUPS, v5DayTotal,
});
