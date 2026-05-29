// v5-D · Refined — improves the user's latest design (transaction_new.PNG).
// Keeps: 3-col summary + budget bar + eye toggle, collapsible date sections,
// timeline, per-row time, Thai bottom nav + AI. Improves: connected timeline
// rail (was orphaned dots), time merged into subtitle line, removed per-row
// chevron clutter, crisp SVG icons. Income = green, expense = dark.
const D5 = window.MINT;
const D5_GREEN = '#1F9D6B';

function D5Amount({ value, size = 15, weight = 700 }) {
  const inc = value > 0;
  return (
    <span style={{
      fontSize: size, fontWeight: weight, color: inc ? D5_GREEN : D5.n900,
      fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', letterSpacing: -0.2,
    }}>{inc ? '+ ' : '- '}{window.v5fmt(value)} ฿</span>
  );
}

// ─── Top app bar (2-line wallet + balance, sliders icon) ──────────────
function D5TopBar() {
  const Act = ({ children }) => (
    <button style={{ width: 40, height: 40, borderRadius: 20, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{children}</button>
  );
  const sk = { stroke: D5.n700, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px 8px 16px' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#8B5CF6,#6D5AE6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="21" height="21" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="3" fill="#fff"/><path d="M3 10h18" stroke="#7A5AF8" strokeWidth="1.6"/></svg>
      </div>
      <button style={{ flex: 1, minWidth: 0, textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: D5.n900 }}>กระเป๋าสตางค์</span>
          <svg width="13" height="13" viewBox="0 0 12 12"><path d="M3 4.5l3 3 3-3" {...sk}/></svg>
        </div>
        <div style={{ fontSize: 13, color: D5.n400, fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>123,834.00 ฿</div>
      </button>
      <Act><svg width="21" height="21" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" {...sk}/><path d="M16.5 16.5L21 21" {...sk}/></svg></Act>
      <Act><svg width="21" height="21" viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10" {...sk}/><circle cx="16" cy="7" r="2.4" {...sk}/><circle cx="8" cy="17" r="2.4" {...sk}/></svg></Act>
      <Act><svg width="21" height="21" viewBox="0 0 24 24">{[5,12,19].map(cy => <circle key={cy} cx="12" cy={cy} r="1.8" fill={D5.n700}/>)}</svg></Act>
    </div>
  );
}

function D5Tabs({ active = 'เดือนนี้' }) {
  const months = ['กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'เดือนนี้', 'แผนในอนาคต'];
  return (
    <div style={{ padding: '2px 16px 0', display: 'flex', gap: 18, overflowX: 'hidden', borderBottom: `1px solid ${D5.n300}` }}>
      {months.map(m => {
        const on = m === active;
        return (
          <div key={m} style={{ padding: '6px 1px 9px', position: 'relative', whiteSpace: 'nowrap', fontSize: 15, fontWeight: on ? 700 : 500, color: on ? D5.primary600 : D5.n400 }}>
            {m}
            {on && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2.5, borderRadius: 2, background: D5.primary400 }} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Summary: 3 columns + budget bar + eye toggle ─────────────────────
function D5Summary() {
  const [hidden, setHidden] = React.useState(false);
  const Col = ({ label, children, flex = 1, alignR }) => (
    <div style={{ flex, minWidth: 0, textAlign: alignR ? 'right' : 'left' }}>
      <div style={{ fontSize: 12.5, color: D5.n400, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
  const Div = () => <div style={{ width: 1, alignSelf: 'stretch', background: D5.n300, margin: '2px 12px' }} />;
  return (
    <div style={{ margin: '12px 16px 0', background: '#fff', borderRadius: 18, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 28px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Col label="รายรับ"><div style={{ fontSize: 16, fontWeight: 700, color: D5_GREEN, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.3 }}>+ 2,000.00 ฿</div></Col>
        <Div />
        <Col label="รายจ่าย"><div style={{ fontSize: 16, fontWeight: 700, color: D5.n900, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.3 }}>- 10,531.00 ฿</div></Col>
        <Div />
        <Col label="คงเหลือ" flex={1.2} alignR>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: D5.primary600, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5 }}>
              {hidden ? '••••••' : '113,303'}
            </span>
            {!hidden && <span style={{ fontSize: 13, fontWeight: 700, color: D5.primary600 }}>.00 ฿</span>}
          </div>
        </Col>
        <button onClick={() => setHidden(h => !h)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 0 8px', marginTop: 16 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={D5.n400} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      <div style={{ marginTop: 15, height: 8, borderRadius: 4, background: D5.n200, overflow: 'hidden' }}>
        <div style={{ width: '21%', height: '100%', borderRadius: 4, background: `linear-gradient(90deg,${D5.primary300},${D5.primary400})` }} />
      </div>
      <div style={{ marginTop: 9, textAlign: 'center', fontSize: 12.5, color: D5.n400 }}>
        ใช้ไป <b style={{ color: D5.n700 }}>21%</b> ของงบประมาณเดือนนี้
      </div>
    </div>
  );
}

// ─── Transaction row with connected timeline rail ─────────────────────
function D5Row({ it, first, last }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {/* rail */}
      <div style={{ width: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 2, flex: 1, background: first ? 'transparent' : D5.n300 }} />
        <div style={{ width: 9, height: 9, borderRadius: 5, background: '#fff', border: `2px solid ${D5.n400}` }} />
        <div style={{ width: 2, flex: 1, background: last ? 'transparent' : D5.n300 }} />
      </div>
      {/* content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12, minHeight: 62, borderTop: first ? 'none' : `1px solid ${D5.n200}` }}>
        <window.V5Icon kind={it.kind} tint={it.tint} glyphColor={it.gc} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: D5.n900 }}>{it.label}</div>
          <div style={{ fontSize: 12.5, color: D5.n400, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {it.sub} · {it.time}
          </div>
        </div>
        <D5Amount value={it.amt} size={15} />
      </div>
    </div>
  );
}

// ─── Collapsible date section ─────────────────────────────────────────
function D5Section({ g }) {
  const [open, setOpen] = React.useState(true);
  const total = g.items.reduce((s, it) => s + it.amt, 0);
  return (
    <div style={{ margin: '16px 16px 0' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 4px 8px', fontFamily: 'inherit',
      }}>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: D5.n900 }}>
          {g.head ? <span>{g.head} <span style={{ color: D5.n400, fontWeight: 500 }}>· {g.date}</span></span> : g.date}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <D5Amount value={total} size={14} />
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 200ms' }}>
            <path d="M4 10l4-4 4 4" stroke={D5.n400} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && (
        <div style={{ background: '#fff', borderRadius: 18, padding: '4px 16px 4px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 22px rgba(0,0,0,0.04)' }}>
          {g.items.map((it, i) => <D5Row key={i} it={it} first={i === 0} last={i === g.items.length - 1} />)}
        </div>
      )}
    </div>
  );
}

// ─── Bottom nav (Thai labels + AI assistant) ──────────────────────────
function D5BottomNav() {
  const items = [
    { key: 'home', label: 'หน้าหลัก' }, { key: 'acct', label: 'บัญชี' },
    { key: 'tx', label: 'รายการ' }, { key: 'ai', label: 'AI ผู้ช่วย' }, { key: 'more', label: 'เพิ่มเติม' },
  ];
  const active = 'tx';
  const ic = (key, on) => {
    const c = on ? D5.primary500 : D5.n400;
    const s = { stroke: c, strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (key === 'home') return <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" {...s}/></svg>;
    if (key === 'acct') return <svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2.5" {...s}/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M12 11v4M10.3 12.2h2.7a1.2 1.2 0 0 1 0 2.4h-2a1.2 1.2 0 0 0 0 2.4H13.7" {...s}/></svg>;
    if (key === 'tx') return <svg width="24" height="24" viewBox="0 0 24 24"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill={on ? D5.primary200 : 'none'} {...s}/><path d="M14 3v5h5M9 13h6M9 16h4" {...s}/></svg>;
    if (key === 'ai') return <svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="11" rx="3" {...s}/><path d="M12 4v4M8 13h.01M16 13h.01M9.5 16h5" {...s}/><circle cx="12" cy="4" r="1" fill={c} stroke="none"/></svg>;
    return <svg width="24" height="24" viewBox="0 0 24 24">{[[7,7],[14,7],[7,14],[14,14]].map(([x,y],i)=><rect key={i} x={x-2.5} y={y-2.5} width="5.5" height="5.5" rx="1.4" {...s}/>)}</svg>;
  };
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: `0.5px solid ${D5.n300}`, paddingTop: 8, paddingBottom: 28, display: 'flex' }}>
      {items.map(it => {
        const on = it.key === active;
        return (
          <div key={it.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {ic(it.key, on)}
            <div style={{ fontSize: 10, fontWeight: on ? 600 : 400, color: on ? D5.primary500 : D5.n400 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

const D5_GROUPS = [
  { head: 'วันนี้', date: '20 พ.ค. 2569', items: [
    { kind: 'food',   tint: '#FCE7C7', gc: '#D9982B', label: 'อาหาร', sub: 'น้ำแข็ง (ใหญ่)', time: '07:45', amt: -30 },
    { kind: 'wallet', tint: D5.info200, gc: D5.info400, label: 'อื่นๆ', sub: 'กล่องสำเร็จรูป', time: '07:30', amt: -16 },
    { kind: 'car',    tint: D5.info200, gc: D5.walletRed, label: 'เดินทาง', sub: 'ค่าบริการขนส่งเพิ่มเติม', time: '07:15', amt: -3 },
    { kind: 'shop',   tint: D5.walletPink100, gc: D5.walletPink, label: 'ช้อปปิ้ง', sub: 'บัตรเครดิต', time: '06:30', amt: -100 },
  ]},
  { head: 'เมื่อวาน', date: '19 พ.ค. 2569', items: [
    { kind: 'car',  tint: D5.info200, gc: D5.walletRed, label: 'เดินทาง', sub: 'EMS ในประเทศ', time: '18:20', amt: -67 },
    { kind: 'shop', tint: D5.walletPink100, gc: D5.walletPink, label: 'ช้อปปิ้ง', sub: 'ค่าบัตรเครดิต', time: '14:10', amt: -10000 },
    { kind: 'bill', tint: '#E8EEFC', gc: D5.info400, label: 'ค่าบิล', sub: 'เติมเงินโทรศัพท์', time: '09:30', amt: -500 },
    { kind: 'food', tint: '#FCEFC7', gc: '#D9982B', label: 'อาหาร', sub: 'น้ำทิพย์', time: '08:10', amt: -25 },
  ]},
  { head: null, date: '18 พ.ค. 2569', items: [
    { kind: 'piggy', tint: D5.walletGreen100, gc: D5.walletGreen, label: 'รับเงินถอน', sub: 'ถอนเงินซื้อตั๋วเครื่องบิน', time: '21:15', amt: 2000 },
  ]},
];

function TransactionV5D() {
  return (
    <div style={{ background: D5.n200, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <window.V5StatusBar time="07:57" />
      <D5TopBar />
      <D5Tabs active="เดือนนี้" />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 96 }}>
        <D5Summary />
        {D5_GROUPS.map((g, i) => <D5Section key={i} g={g} />)}
      </div>
      <window.MintFab bottom={100} right={20} />
      <D5BottomNav />
    </div>
  );
}

window.TransactionV5D = TransactionV5D;
