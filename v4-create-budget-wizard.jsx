// Create Budget — 5-step Wizard
//   Step 1: เลือกประเภทงบ          (preset tiles — gives smart defaults for color+icon)
//   Step 2: ตั้งชื่อและหน้าตา       (name + icon/color, with live preview)
//   Step 3: ยอดงบ + ช่วงเวลา       (amount hero + currency + period chips + repeat toggle)
//   Step 4: กระเป๋าและหมวดหมู่      (multi-wallet selection with nested category chips)
//   Step 5: เป้าหมาย AI            (required — budget-specific motivations)
//
// Why 5 steps (not 4 like the others):
//   - Old form crams 6+ sections (basic info, wallets, categories, period, repeat, goal).
//   - Wallet+category selection is genuinely complex — multi-select with nested chips
//     per wallet — and earns its own step.
//   - Splitting period/wallet from each other keeps each step focused (<30s).
//
// Visual language mirrors the other wizards (INK + eyebrow + SectionCard + gradient wash).
(function () {
const W = window.MINT;

const INK = {
  surface: '#F4F5F8',
  muted:   '#6B6B78',
  faint:   '#9A99A6',
  divider: '#ECECF1',
  hairline:'#F0F0F4',
};

const cardShadow = '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)';
const card = { background: '#fff', borderRadius: 16, boxShadow: cardShadow };

function Eyebrow({ children }) {
  return (
    <div style={{
      fontSize: 10, color: INK.faint, fontWeight: 600,
      letterSpacing: 0.6, textTransform: 'uppercase',
    }}>{children}</div>
  );
}

function Header({ step, total = 5, title, onBack }) {
  return (
    <div style={{ background: '#fff', paddingBottom: 12 }}>
      <div style={{ padding: '6px 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {onBack ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke={W.n800} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke={W.n800} strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: W.n900 }}>{title}</div>
        <div style={{ width: 32, fontSize: 12, color: W.n400, textAlign: 'right' }}>{step}/{total}</div>
      </div>
      {/* progress segments — N bars separated by white gaps so user can count steps */}
      <div style={{ display: 'flex', gap: 4, margin: '4px 16px 0' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < step ? W.primary400 : W.n300,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

function StepIntro({ title, sub }) {
  return (
    <div style={{ padding: '18px 20px 8px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: W.n900, letterSpacing: -0.3, lineHeight: 1.3 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: INK.muted, marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

function StickyCta({ label, disabled }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 34, padding: '12px 16px 0',
      background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
    }}>
      <button disabled={disabled} style={{
        width: '100%', height: 50, borderRadius: 14, border: 'none',
        background: disabled ? W.n300 : W.primary400,
        color: disabled ? INK.faint : '#fff',
        fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 4px 14px rgba(56,178,172,0.32)',
        transition: 'all 0.15s',
      }}>{label}</button>
    </div>
  );
}

function WIcon({ kind, size = 24, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'food': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={color}/><circle cx="12" cy="12" r="5" fill={W.n800} opacity="0.2"/></svg>;
    case 'car': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 13l1.5-5h13L20 13v5h-2v-2H6v2H4v-5z" fill={color}/><circle cx="7.5" cy="15.5" r="1.5" fill={W.n800}/><circle cx="16.5" cy="15.5" r="1.5" fill={W.n800}/></svg>;
    case 'shopping': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14l-1 13H6L5 7z" fill={color}/><path d="M9 7V5a3 3 0 016 0v2" stroke={W.n800} strokeWidth="1.4" fill="none"/></svg>;
    case 'gift': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="18" height="3" fill={color}/><rect x="5" y="12" width="14" height="9" fill={color} opacity="0.85"/><rect x="11" y="9" width="2" height="12" fill={W.n800} opacity="0.4"/></svg>;
    case 'home': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" fill={color}/></svg>;
    case 'heart': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.5-9-9c-1-2.3 0-5 2.5-6s4.5 1 4.5 1 2-2 4.5-1 3.5 3.7 2.5 6c-2 4.5-9 9-9 9z" fill={color}/></svg>;
    case 'calc': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" fill={color}/><rect x="7" y="5" width="10" height="4" rx="1" fill={W.n800} opacity="0.3"/><circle cx="9" cy="13" r="1" fill={W.n800}/><circle cx="12" cy="13" r="1" fill={W.n800}/><circle cx="15" cy="13" r="1" fill={W.n800}/><circle cx="9" cy="17" r="1" fill={W.n800}/><circle cx="12" cy="17" r="1" fill={W.n800}/><circle cx="15" cy="17" r="1" fill={W.n800}/></svg>;
    case 'pie': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={color}/><path d="M12 3v9l8 3a9 9 0 00-8-12z" fill={W.n800} opacity="0.35"/></svg>;
    case 'envelope': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" fill={color}/><path d="M3 7l9 7 9-7" stroke={W.n800} strokeWidth="1.4" fill="none" opacity="0.5"/></svg>;
    case 'piggy': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'wallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" fill={color}/><circle cx="17" cy="13" r="1.4" fill={W.n800}/></svg>;
    case 'cash': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill={color}/><circle cx="12" cy="12" r="2.5" fill="none" stroke={W.n800} strokeWidth="1.4"/></svg>;
    case 'card': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2.5" fill={color}/><rect x="2" y="10" width="20" height="2.5" fill={W.n800} opacity="0.5"/></svg>;
    case 'savings': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 11c0-2.8 2.7-5 6-5 1.4 0 2.6.4 3.6 1.1L17 6l-.5 2.6c.9.9 1.5 2.1 1.5 3.4 0 .9-.3 1.7-.7 2.5l.7 1.5h-2.5l-.6-.6c-.7.4-1.5.6-2.4.6h-1l-1 2h-2v-2H7c-1.1 0-2-.9-2-2v-2.5L3 12l1-2 1 1z" fill={color}/></svg>;
    case 'ewallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2.5" fill={color}/><rect x="9" y="6" width="6" height="7" rx="1" fill={W.n800} opacity="0.2"/></svg>;
    case 'qr': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" fill={color}/><rect x="14" y="3" width="7" height="7" fill={color}/><rect x="3" y="14" width="7" height="7" fill={color}/><rect x="14" y="14" width="3" height="3" fill={color}/><rect x="18" y="18" width="3" height="3" fill={color}/></svg>;
    case 'plane': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M21 11l-9 4-2 5-2-3-3-2 5-2 4-9 7 7z" fill={color}/></svg>;
    case 'coffee': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h12v8a4 4 0 01-4 4H9a4 4 0 01-4-4V7z" fill={color}/><path d="M17 9h2a2 2 0 010 4h-2" fill="none" stroke={color} strokeWidth="1.8"/></svg>;
    case 'gas': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 4h7v16H5z" fill={color}/><path d="M13 8h2l2 2v8a2 2 0 002 2" stroke={color} strokeWidth="1.6" fill="none"/></svg>;
    case 'shop': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 9l1.5-4h13L20 9v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" fill={color}/><rect x="5" y="13" width="14" height="7" fill={color} opacity="0.7"/></svg>;
    case 'chart': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="14" width="3" height="6" rx="1" fill={color}/><rect x="10" y="10" width="3" height="10" rx="1" fill={color}/><rect x="16" y="6" width="3" height="14" rx="1" fill={color}/></svg>;
    case 'music': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 18V5l11-2v13" stroke={color} strokeWidth="1.8" fill="none"/><circle cx="7" cy="18" r="2.5" fill={color}/><circle cx="18" cy="16" r="2.5" fill={color}/></svg>;
    case 'crown': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 8l4 5 5-8 5 8 4-5v10H3V8z" fill={color}/></svg>;
    case 'star-line': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9 12 3z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    case 'library': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/></svg>;
    case 'plus': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    case 'close': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case 'chev': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'arrow': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}

function SectionCard({ title, meta, leadingIcon, trailing, onToggle, collapsible, open = true, children }) {
  return (
    <div style={{
      margin: '0 16px 12px',
      background: '#fff', borderRadius: 16,
      boxShadow: cardShadow, overflow: 'hidden',
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '14px 16px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: collapsible ? 'pointer' : 'default',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {leadingIcon}
          <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, letterSpacing: -0.1 }}>{title}</div>
          {meta && <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted }}>· {meta}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {trailing}
          {collapsible && (
            <div style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'flex' }}>
              <WIcon kind="chev" size={16} color={INK.faint} />
            </div>
          )}
        </div>
      </div>
      {open && children}
    </div>
  );
}

// ─── Step 1 — Budget type tiles ───
const BUDGET_TYPES = [
  { k: 'food',          label: 'อาหาร & เครื่องดื่ม', desc: 'ค่าข้าว/กาแฟ/ร้านอาหาร',     icon: 'food',     bg: W.walletBrown100,  ic: W.walletBrown },
  { k: 'transport',     label: 'เดินทาง',            desc: 'น้ำมัน/แท็กซี่/รถไฟฟ้า',     icon: 'car',      bg: W.walletRed100,    ic: W.walletRed },
  { k: 'shopping',      label: 'ช้อปปิ้ง',            desc: 'เสื้อผ้า/ของใช้/online',      icon: 'shopping', bg: W.walletPink100,   ic: W.walletPink },
  { k: 'entertainment', label: 'บันเทิง',            desc: 'หนัง/คอนเสิร์ต/เกม',        icon: 'gift',     bg: W.walletViolet100, ic: W.walletViolet },
  { k: 'housing',       label: 'ที่อยู่อาศัย',         desc: 'ค่าเช่า/ค่าน้ำไฟ',           icon: 'home',     bg: W.walletGreen100,  ic: W.walletGreen },
  { k: 'health',        label: 'สุขภาพ',              desc: 'หมอ/ฟิตเนส/ยา',             icon: 'heart',    bg: W.primary100,      ic: W.primary500 },
  { k: 'education',     label: 'การศึกษา',           desc: 'คอร์ส/หนังสือ',              icon: 'calc',     bg: W.info200,         ic: W.info400 },
  { k: 'total',         label: 'รวมทุกอย่าง',        desc: 'งบรายเดือนทั้งหมด',          icon: 'pie',      bg: '#FCEFD9',         ic: W.warning400 },
];

function StepOne() {
  const [sel, setSel] = React.useState('food');
  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={1} title="สร้างงบประมาณ" />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="งบนี้คุมเรื่องอะไร?" sub="เลือกประเภท — Mint จะแนะนำหมวดหมู่และไอคอนให้" />
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {BUDGET_TYPES.map(t => {
            const active = sel === t.k;
            return (
              <div key={t.k} onClick={() => setSel(t.k)} style={{
                ...card, padding: '14px 12px', cursor: 'pointer',
                border: active ? `1.5px solid ${W.primary400}` : '1.5px solid transparent',
                boxShadow: active ? '0 4px 14px rgba(56,178,172,0.22)' : card.boxShadow,
                position: 'relative',
              }}>
                {active && (
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, background: W.primary400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WIcon kind="check" size={11} color="#fff" />
                  </div>
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: t.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                }}>
                  <WIcon kind={t.icon} size={22} color={t.ic} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: INK.muted, marginTop: 2, lineHeight: 1.3 }}>{t.desc}</div>
              </div>
            );
          })}
        </div>
        {/* CUSTOM ESCAPE HATCH — full-width dashed bar for "ตั้งเอง" */}
        <div style={{ padding: '4px 16px 0' }}>
          <div onClick={() => setSel('custom')} style={{
            padding: '14px 16px', borderRadius: 16,
            background: sel === 'custom' ? W.primary100 : 'transparent',
            border: sel === 'custom' ? `1.5px solid ${W.primary400}` : `1.5px dashed ${INK.faint}`,
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: sel === 'custom' ? W.primary400 : 'transparent',
              border: sel === 'custom' ? 'none' : `1.5px dashed ${INK.faint}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <WIcon kind="plus" size={18} color={sel === 'custom' ? '#fff' : INK.muted} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: sel === 'custom' ? W.primary500 : W.n800 }}>
                ตั้งเอง
              </div>
              <div style={{ fontSize: 11, color: INK.muted, marginTop: 2, lineHeight: 1.3 }}>
                ไม่ตรงสักอัน · กำหนดประเภทเอง
              </div>
            </div>
            {sel === 'custom' && (
              <div style={{
                width: 18, height: 18, borderRadius: 9, background: W.primary400,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <WIcon kind="check" size={11} color="#fff" />
              </div>
            )}
          </div>
        </div>
      </div>
      <StickyCta label="ถัดไป" />
    </div>
  );
}

// ─── Step 2 — Name + icon + color ───
const COLORS = [
  { k: 'brown',  c: W.walletBrown,  bg: W.walletBrown100 },
  { k: 'red',    c: W.walletRed,    bg: W.walletRed100 },
  { k: 'pink',   c: W.walletPink,   bg: W.walletPink100 },
  { k: 'violet', c: W.walletViolet, bg: W.walletViolet100 },
  { k: 'green',  c: W.walletGreen,  bg: W.walletGreen100 },
  { k: 'teal',   c: W.primary400,   bg: W.primary100 },
];

const BUDGET_FAVES = ['food', 'car', 'shopping', 'home', 'pie'];
const BASIC        = ['savings', 'ewallet', 'qr', 'shop', 'chart', 'pie', 'calc', 'envelope', 'wallet', 'cash'];
const STD          = ['home', 'car', 'food', 'coffee', 'gift', 'gas', 'shopping', 'plane'];

const PACKS = [
  { name: 'Food & Drinks', count: 28,  ic: 'pie',   bg: W.walletPink100, color: W.walletPink,   price: 'ฟรี',  isPremium: false },
  { name: 'Premium Pack',  count: 120, ic: 'crown', bg: '#FCEFD9',       color: W.warning400,  price: '฿ 49', isPremium: true  },
];

function StepTwo() {
  const [name, setName] = React.useState('อาหาร & เครื่องดื่ม');
  const [color, setColor] = React.useState(COLORS[0]);
  const [icon, setIcon] = React.useState('food');
  const [openPacks, setOpenPacks] = React.useState({ basic: true, standard: false });
  const togglePack = (k) => setOpenPacks(p => ({ ...p, [k]: !p[k] }));

  const IconCell = ({ k }) => {
    const active = icon === k;
    return (
      <div onClick={() => setIcon(k)} style={{
        aspectRatio: '1 / 1',
        background: active ? color.bg : INK.surface,
        borderRadius: 14,
        boxShadow: active ? `inset 0 0 0 1.5px ${color.c}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative',
        transition: 'background 0.15s, box-shadow 0.15s',
      }}>
        <WIcon kind={k} size={26} color={active ? color.c : W.n700} />
        {active && (
          <div style={{
            position: 'absolute', top: 4, right: 4,
            width: 16, height: 16, borderRadius: 8, background: color.c,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <WIcon kind="check" size={10} color="#fff" />
          </div>
        )}
      </div>
    );
  };

  const Grid = ({ kinds }) => (
    <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
      {kinds.map(k => <IconCell key={k} k={k} />)}
    </div>
  );

  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={2} title="สร้างงบประมาณ" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="ตั้งชื่อและหน้าตา" sub="เปลี่ยนได้ภายหลัง" />

        {/* PREVIEW */}
        <div style={{
          padding: '4px 16px 20px',
          background: `linear-gradient(180deg, ${color.bg} 0%, transparent 100%)`,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: color.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <WIcon kind={icon} size={28} color={color.c} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Eyebrow>ตัวอย่าง</Eyebrow>
              <div style={{
                fontSize: 15, fontWeight: 700, color: W.n900, marginTop: 2, letterSpacing: -0.1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {name || 'ชื่องบประมาณ'}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: INK.muted, marginTop: 2 }}>
                งบประมาณ
              </div>
            </div>
          </div>
        </div>

        {/* NAME */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '14px 16px 14px',
        }}>
          <Eyebrow>ชื่องบประมาณ</Eyebrow>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="เช่น อาหารรายเดือน"
            style={{
              width: '100%', border: 'none', outline: 'none',
              fontSize: 15, fontWeight: 600, color: W.n900,
              fontFamily: 'inherit', background: 'transparent', padding: 0, marginTop: 6,
            }} />
        </div>

        {/* COLOR */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '14px 16px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Eyebrow>เลือกสี</Eyebrow>
            <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted }}>สีหลัก · ดู 20 สี</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {COLORS.map(c => {
              const active = color.k === c.k;
              return (
                <div key={c.k} onClick={() => setColor(c)} style={{
                  flexShrink: 0, width: 36, height: 36, borderRadius: 18,
                  background: c.bg, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? `0 0 0 2px #fff, 0 0 0 4px ${c.c}` : 'none',
                  transition: 'box-shadow 0.15s ease',
                }}>
                  {active && <WIcon kind="check" size={16} color={c.c} />}
                </div>);
            })}
            <div style={{
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 12px', borderRadius: 999,
              background: INK.surface, cursor: 'pointer',
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: 8, overflow: 'hidden',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
              }}>
                <div style={{ background: W.walletGreen }} />
                <div style={{ background: W.walletPink }} />
                <div style={{ background: W.info400 }} />
                <div style={{ background: W.warning400 }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: W.n800 }}>ทั้งหมด</div>
            </div>
          </div>
        </div>

        {/* ICON sections */}
        <SectionCard title="ใช้บ่อย" meta="แตะค้างเพื่อปักหมุด" leadingIcon={<WIcon kind="star-line" size={14} color={W.warning400} />}>
          <Grid kinds={BUDGET_FAVES} />
        </SectionCard>

        <SectionCard title="Basic Icons" meta={`${BASIC.length} ไอคอน`} collapsible open={openPacks.basic} onToggle={() => togglePack('basic')}>
          <Grid kinds={BASIC} />
        </SectionCard>

        <SectionCard title="ขนส่ง & ไลฟ์สไตล์" meta={`${STD.length} ไอคอน`} collapsible open={openPacks.standard} onToggle={() => togglePack('standard')}>
          <Grid kinds={STD} />
        </SectionCard>

        <div style={{ margin: '0 16px 16px', background: '#fff', borderRadius: 16, boxShadow: cardShadow, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, letterSpacing: -0.1 }}>คลังไอคอนเพิ่มเติม</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted }}>· ติดตั้งเพิ่มได้</div>
            </div>
          </div>
          {PACKS.map(p => (
            <div key={p.name} style={{
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderTop: `1px solid ${INK.hairline}`, cursor: 'pointer',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <WIcon kind={p.ic} size={20} color={p.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: W.n900 }}>{p.name}</div>
                  {p.isPremium && <div style={{ padding: '2px 6px', borderRadius: 6, background: '#FCEFD9', color: W.warning400, fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>PRO</div>}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted, marginTop: 2 }}>{p.count} ไอคอน</div>
              </div>
              <button style={{
                padding: '6px 14px', borderRadius: 999,
                background: p.isPremium ? INK.surface : W.primary100,
                color: p.isPremium ? W.n900 : W.primary500,
                border: 'none', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
              }}>{p.price}</button>
            </div>
          ))}
          <div style={{ padding: '14px 16px', borderTop: `1px solid ${INK.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
            <WIcon kind="library" size={14} color={W.primary500} />
            <div style={{ fontSize: 13, fontWeight: 700, color: W.primary500 }}>เปิดคลังไอคอนทั้งหมด</div>
            <WIcon kind="arrow" size={12} color={W.primary500} />
          </div>
        </div>
      </div>
      <StickyCta label="ถัดไป" />
    </div>
  );
}

// ─── Step 3 — Budget amount + currency + period + repeat ───
const CURRENCIES = [
  { code: 'THB', name: 'บาทไทย',      symbol: '฿', flag: '🇹🇭' },
  { code: 'USD', name: 'ดอลลาร์สหรัฐ', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'ยูโร',         symbol: '€', flag: '🇪🇺' },
  { code: 'JPY', name: 'เยนญี่ปุ่น',    symbol: '¥', flag: '🇯🇵' },
];

const PERIODS = [
  { k: 'daily',   label: 'รายวัน' },
  { k: 'weekly',  label: 'รายสัปดาห์' },
  { k: 'monthly', label: 'รายเดือน' },
  { k: 'yearly',  label: 'รายปี' },
];

function StepThree() {
  const [amt, setAmt] = React.useState('5,000');
  const [currency, setCurrency] = React.useState(CURRENCIES[0]);
  const [period, setPeriod] = React.useState('monthly');
  const [repeat, setRepeat] = React.useState(true);

  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={3} title="สร้างงบประมาณ" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="ยอดและช่วงเวลา" sub="ตั้งเพดานการใช้จ่ายของงบนี้" />

        {/* AMOUNT — hero amount card */}
        <div style={{
          margin: '8px 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '20px 16px 18px', textAlign: 'center',
        }}>
          <Eyebrow>งบประมาณ</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            <span style={{ fontSize: 18, color: INK.faint, fontWeight: 600 }}>{currency.symbol}</span>
            <input value={amt} onChange={e => setAmt(e.target.value)}
              style={{
                border: 'none', outline: 'none', fontSize: 38, fontWeight: 700, color: W.n900,
                textAlign: 'center', width: '70%', fontFamily: 'inherit', background: 'transparent',
                letterSpacing: -1,
              }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {['1,000', '3,000', '5,000', '10,000'].map(p => (
              <div key={p} onClick={() => setAmt(p)} style={{
                padding: '6px 12px', borderRadius: 999, background: INK.surface,
                fontSize: 12, color: W.n800, fontWeight: 600, cursor: 'pointer',
              }}>{currency.symbol} {p}</div>
            ))}
          </div>
        </div>

        {/* CURRENCY row */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: INK.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>{currency.flag}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow>สกุลเงิน</Eyebrow>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, marginTop: 2 }}>
              {currency.code} — {currency.name} ({currency.symbol})
            </div>
          </div>
          <WIcon kind="arrow" size={16} color={INK.faint} />
        </div>

        {/* PERIOD — segmented chip row */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '14px 16px 14px',
        }}>
          <Eyebrow>ช่วงเวลา</Eyebrow>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {PERIODS.map(p => {
              const active = period === p.k;
              return (
                <div key={p.k} onClick={() => setPeriod(p.k)} style={{
                  flex: 1, minWidth: 70,
                  padding: '10px 8px', borderRadius: 12,
                  background: active ? W.primary100 : INK.surface,
                  border: active ? `1.5px solid ${W.primary400}` : '1.5px solid transparent',
                  textAlign: 'center', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  color: active ? W.primary500 : W.n800,
                  transition: 'all 0.15s',
                }}>
                  {p.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* REPEAT toggle */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>ทำซ้ำงบประมาณนี้</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted, marginTop: 2 }}>
              สร้างใหม่อัตโนมัติเมื่อจบรอบ
            </div>
          </div>
          <div onClick={() => setRepeat(!repeat)} style={{
            width: 44, height: 26, borderRadius: 13,
            background: repeat ? W.primary400 : W.n300,
            position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
            flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 3, left: repeat ? 21 : 3,
              width: 20, height: 20, borderRadius: 10, background: '#fff',
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}/>
          </div>
        </div>
      </div>
      <StickyCta label="ถัดไป" />
    </div>
  );
}

// ─── Step 4 — Wallets + nested category chips ───
const ALL_CATEGORIES = [
  { k: 'food',     label: 'อาหาร',    ic: 'food',     bg: W.walletBrown100, color: W.walletBrown },
  { k: 'clothes',  label: 'เสื้อผ้า',  ic: 'shopping', bg: W.walletPink100,  color: W.walletPink },
  { k: 'transport',label: 'เดินทาง',  ic: 'car',      bg: W.walletRed100,   color: W.walletRed },
  { k: 'coffee',   label: 'กาแฟ',     ic: 'coffee',   bg: W.walletBrown100, color: W.walletBrown },
  { k: 'gift',     label: 'ของขวัญ',   ic: 'gift',     bg: W.walletPink100,  color: W.walletPink },
  { k: 'gas',      label: 'น้ำมัน',   ic: 'gas',      bg: W.walletRed100,   color: W.walletRed },
];

// Initial state — 2 wallets pre-picked with categories (mirror old UI screenshot)
const INITIAL_BUDGET_WALLETS = [
  {
    id: 'patshop',
    name: 'Pat shop', icon: 'piggy', bg: W.walletPink100, color: W.walletPink,
    categories: ['food', 'clothes', 'transport'],
  },
  {
    id: 'test',
    name: 'test', icon: 'wallet', bg: W.walletViolet100, color: W.walletViolet,
    categories: ['transport'],
  },
];

function StepFour() {
  const [wallets, setWallets] = React.useState(INITIAL_BUDGET_WALLETS);
  const removeWallet = (id) => setWallets(ws => ws.filter(w => w.id !== id));
  const removeCategory = (walletId, catK) => setWallets(ws => ws.map(w =>
    w.id === walletId ? { ...w, categories: w.categories.filter(k => k !== catK) } : w
  ));

  const CategoryChip = ({ cat, onRemove }) => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px 6px 6px', borderRadius: 999,
      background: INK.surface,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 11, background: cat.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <WIcon kind={cat.ic} size={13} color={cat.color} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: W.n900 }}>{cat.label}</div>
      <div onClick={onRemove} style={{ cursor: 'pointer', display: 'flex', padding: 1 }}>
        <WIcon kind="close" size={12} color={INK.faint} />
      </div>
    </div>
  );

  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={4} title="สร้างงบประมาณ" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="นับจากกระเป๋าและหมวดไหน?" sub="งบจะรวมเฉพาะ tx ที่ตรงกับกระเป๋า + หมวดหมู่ที่เลือก" />

        {/* WALLETS list */}
        <div style={{ padding: '8px 0 0' }}>
          {wallets.map(wallet => {
            const walletCats = wallet.categories.map(k => ALL_CATEGORIES.find(c => c.k === k)).filter(Boolean);
            return (
              <div key={wallet.id} style={{
                margin: '0 16px 12px', background: '#fff', borderRadius: 16,
                boxShadow: cardShadow, padding: '14px 16px 14px',
              }}>
                {/* wallet header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: wallet.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <WIcon kind={wallet.icon} size={18} color={wallet.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: W.n900 }}>
                    {wallet.name}
                  </div>
                  <div onClick={() => removeWallet(wallet.id)} style={{
                    width: 28, height: 28, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}>
                    <WIcon kind="close" size={16} color={INK.faint} />
                  </div>
                </div>

                {/* categories */}
                <div style={{ marginTop: 12 }}>
                  <Eyebrow>รายจ่าย</Eyebrow>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {walletCats.map(cat => (
                      <CategoryChip key={cat.k} cat={cat} onRemove={() => removeCategory(wallet.id, cat.k)} />
                    ))}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 999,
                      background: W.primary100, cursor: 'pointer',
                    }}>
                      <WIcon kind="plus" size={12} color={W.primary500} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: W.primary500 }}>เลือกหมวดหมู่</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* + เพิ่มกระเป๋า — full-width ghost button */}
        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: W.primary100, borderRadius: 14,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer',
          }}>
            <WIcon kind="plus" size={16} color={W.primary500} />
            <div style={{ fontSize: 14, fontWeight: 700, color: W.primary500 }}>เพิ่มกระเป๋า</div>
          </div>
        </div>

        {/* helper hint */}
        <div style={{
          margin: '12px 16px 0', padding: '10px 12px',
          background: INK.surface, borderRadius: 10,
          fontSize: 11, color: INK.muted, lineHeight: 1.5,
        }}>
          💡 ถ้าไม่ระบุหมวดหมู่ จะนับ tx จากกระเป๋านั้นทุกประเภท
        </div>
      </div>
      <StickyCta label="ถัดไป" />
    </div>
  );
}

// ─── Step 5 — AI goal (required, budget-specific examples) ───
const BUDGET_GOAL_EXAMPLES = [
  { text: 'จำกัดค่าเดินทางไม่เกิน ฿150/วัน',          ic: 'car' },
  { text: 'เก็บ ฿2,000 เพื่อไปคอนเสิร์ตเดือนหน้า',   ic: 'music' },
  { text: 'ลดค่าใช้จ่ายฟุ่มเฟือยลง 20% เดือนนี้',     ic: 'piggy' },
  { text: 'คุมค่ากินข้าวนอกบ้านให้น้อยลง',          ic: 'food' },
  { text: 'ติดตามรายจ่ายให้ครบทุกบาท',              ic: 'chart' },
  { text: 'ฝึกออมเงินอัตโนมัติทุกเดือน',            ic: 'savings' },
];

function StepFive() {
  const [goal, setGoal] = React.useState('');
  const valid = goal.trim().length > 0;
  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={5} title="สร้างงบประมาณ" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="ตั้งเป้าหมายงบนี้" sub="ให้ AI ช่วยเตือนและแนะนำเมื่อใกล้เกินงบ" />

        <div style={{
          margin: '8px 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, overflow: 'hidden',
        }}>
          {/* header */}
          <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${W.walletViolet}, ${W.primary400})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16, flexShrink: 0,
            }}>✦</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, letterSpacing: -0.1 }}>
                  เป้าหมายของงบ
                </div>
                <div style={{
                  padding: '2px 6px', borderRadius: 6,
                  background: W.walletRed100, color: W.walletRed,
                  fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
                }}>จำเป็น</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted, marginTop: 2 }}>
                เลือกตัวอย่างหรือพิมพ์เอง
              </div>
            </div>
          </div>

          {/* input */}
          <div style={{
            margin: '0 16px 14px', padding: '12px 14px',
            background: INK.surface, borderRadius: 12,
            boxShadow: valid ? `inset 0 0 0 1.5px ${W.walletViolet}` : 'none',
            transition: 'box-shadow 0.15s',
          }}>
            <input value={goal} onChange={e => setGoal(e.target.value)}
              placeholder="พิมพ์เป้าหมายของงบนี้..."
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontSize: 14, fontWeight: 500, color: W.n900,
                fontFamily: 'inherit', background: 'transparent', padding: 0,
              }} />
          </div>

          {/* examples */}
          <div style={{ padding: '0 16px 8px' }}>
            <Eyebrow>ตัวอย่างเป้าหมาย</Eyebrow>
          </div>
          <div>
            {BUDGET_GOAL_EXAMPLES.map((ex, i) => {
              const selected = goal === ex.text;
              return (
                <div key={ex.text} onClick={() => setGoal(ex.text)} style={{
                  padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
                  borderTop: i ? `1px solid ${INK.hairline}` : 'none',
                  cursor: 'pointer',
                  background: selected ? W.walletViolet100 : 'transparent',
                  transition: 'background 0.15s',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: selected ? W.walletViolet : INK.surface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'background 0.15s',
                  }}>
                    <WIcon kind={ex.ic} size={16} color={selected ? '#fff' : W.n700} />
                  </div>
                  <div style={{
                    flex: 1, minWidth: 0, fontSize: 13,
                    fontWeight: selected ? 700 : 500,
                    color: selected ? W.n900 : W.n800,
                  }}>{ex.text}</div>
                  {selected && (
                    <div style={{
                      width: 20, height: 20, borderRadius: 10, background: W.walletViolet,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <WIcon kind="check" size={12} color="#fff" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <StickyCta label="สร้างงบประมาณ" disabled={!valid} />
    </div>
  );
}

window.CreateBudgetWizard_Step1 = StepOne;
window.CreateBudgetWizard_Step2 = StepTwo;
window.CreateBudgetWizard_Step3 = StepThree;
window.CreateBudgetWizard_Step4 = StepFour;
window.CreateBudgetWizard_Step5 = StepFive;
})();
