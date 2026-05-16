// Create Credit Card — 4-step Wizard
//   Step 1: เลือกธนาคารผู้ออกบัตร  (issuer tiles, 2-col grid — gives smart color defaults)
//   Step 2: ตั้งชื่อและหน้าตา      (name + last-4 digits + icon/color, with live preview)
//   Step 3: วงเงินและรอบบิล        (limit + outstanding + statement/due date + alert + currency)
//   Step 4: เป้าหมาย AI            (required goal with CC-specific examples)
//
// Why 4 steps (not the old single-page form):
//   - Old form crams 10+ fields on one screen — first-time user feels overwhelmed.
//   - Wizard splits by user mental task: identify card → personalize → billing → goal.
//   - Each step <30s to complete; total flow ~2 min, the same as old form but with
//     less cognitive load per screen.
//
// Visual language mirrors v4-create-wallet-a-wizard.jsx + v4-icon-color-picker.jsx
// (INK palette, eyebrow caps, SectionCard chrome, gradient-wash preview).
(function () {
const W = window.MINT;

// INK palette — mirrors the wallet wizard so both flows feel like one family.
const INK = {
  surface: '#F4F5F8',
  muted:   '#6B6B78',
  faint:   '#9A99A6',
  divider: '#ECECF1',
  hairline:'#F0F0F4',
};

const cardShadow = '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)';

const card = {
  background: '#fff', borderRadius: 16,
  boxShadow: cardShadow,
};

// Eyebrow caps — 10/600 INK.faint, letter-spacing 0.6, uppercase
function Eyebrow({ children }) {
  return (
    <div style={{
      fontSize: 10, color: INK.faint, fontWeight: 600,
      letterSpacing: 0.6, textTransform: 'uppercase',
    }}>{children}</div>
  );
}

// ─── Header (close/back + title + progress) ───
function Header({ step, total = 4, title, onBack }) {
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
      <div style={{ height: 3, background: W.n300, borderRadius: 2, margin: '4px 16px 0' }}>
        <div style={{ width: `${(step / total) * 100}%`, height: '100%', background: W.primary400, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

// ─── Step intro — large question + supporting line ───
function StepIntro({ title, sub }) {
  return (
    <div style={{ padding: '18px 20px 8px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: W.n900, letterSpacing: -0.3, lineHeight: 1.3 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: INK.muted, marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

// ─── Sticky CTA ───
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

// ─── Icons (svg) — superset; supports issuer logos as letters + standard set ───
function WIcon({ kind, size = 24, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'card': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2.5" fill={color}/><rect x="2" y="10" width="20" height="2.5" fill={W.n800} opacity="0.5"/></svg>;
    case 'wallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" fill={color}/><circle cx="17" cy="13" r="1.4" fill={W.n800}/></svg>;
    case 'shopping': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14l-1 13H6L5 7z" fill={color}/><path d="M9 7V5a3 3 0 016 0v2" stroke={W.n800} strokeWidth="1.4" fill="none"/></svg>;
    case 'shop': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 9l1.5-4h13L20 9v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" fill={color}/><rect x="5" y="13" width="14" height="7" fill={color} opacity="0.7"/></svg>;
    case 'gift': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="18" height="3" fill={color}/><rect x="5" y="12" width="14" height="9" fill={color} opacity="0.85"/><rect x="11" y="9" width="2" height="12" fill={W.n800} opacity="0.4"/></svg>;
    case 'plane': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M21 11l-9 4-2 5-2-3-3-2 5-2 4-9 7 7z" fill={color}/></svg>;
    case 'piggy': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'salary': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7z" fill={color}/><path d="M9 7V5a3 3 0 016 0v2" stroke={W.n800} strokeWidth="1.4" fill="none"/></svg>;
    case 'cash': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill={color}/><circle cx="12" cy="12" r="2.5" fill="none" stroke={W.n800} strokeWidth="1.4"/></svg>;
    case 'savings': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 11c0-2.8 2.7-5 6-5 1.4 0 2.6.4 3.6 1.1L17 6l-.5 2.6c.9.9 1.5 2.1 1.5 3.4 0 .9-.3 1.7-.7 2.5l.7 1.5h-2.5l-.6-.6c-.7.4-1.5.6-2.4.6h-1l-1 2h-2v-2H7c-1.1 0-2-.9-2-2v-2.5L3 12l1-2 1 1z" fill={color}/></svg>;
    case 'ewallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2.5" fill={color}/><rect x="9" y="6" width="6" height="7" rx="1" fill={W.n800} opacity="0.2"/></svg>;
    case 'qr': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" fill={color}/><rect x="14" y="3" width="7" height="7" fill={color}/><rect x="3" y="14" width="7" height="7" fill={color}/><rect x="14" y="14" width="3" height="3" fill={color}/><rect x="18" y="18" width="3" height="3" fill={color}/></svg>;
    case 'chart': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="14" width="3" height="6" rx="1" fill={color}/><rect x="10" y="10" width="3" height="10" rx="1" fill={color}/><rect x="16" y="6" width="3" height="14" rx="1" fill={color}/></svg>;
    case 'pie': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={color}/><path d="M12 3v9l8 3a9 9 0 00-8-12z" fill={W.n800} opacity="0.35"/></svg>;
    case 'calc': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" fill={color}/><rect x="7" y="5" width="10" height="4" rx="1" fill={W.n800} opacity="0.3"/><circle cx="9" cy="13" r="1" fill={W.n800}/><circle cx="12" cy="13" r="1" fill={W.n800}/><circle cx="15" cy="13" r="1" fill={W.n800}/><circle cx="9" cy="17" r="1" fill={W.n800}/><circle cx="12" cy="17" r="1" fill={W.n800}/><circle cx="15" cy="17" r="1" fill={W.n800}/></svg>;
    case 'envelope': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" fill={color}/><path d="M3 7l9 7 9-7" stroke={W.n800} strokeWidth="1.4" fill="none" opacity="0.5"/></svg>;
    case 'home': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" fill={color}/></svg>;
    case 'car': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 13l1.5-5h13L20 13v5h-2v-2H6v2H4v-5z" fill={color}/><circle cx="7.5" cy="15.5" r="1.5" fill={W.n800}/><circle cx="16.5" cy="15.5" r="1.5" fill={W.n800}/></svg>;
    case 'food': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={color}/><circle cx="12" cy="12" r="5" fill={W.n800} opacity="0.2"/></svg>;
    case 'coffee': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h12v8a4 4 0 01-4 4H9a4 4 0 01-4-4V7z" fill={color}/><path d="M17 9h2a2 2 0 010 4h-2" fill="none" stroke={color} strokeWidth="1.8"/></svg>;
    case 'gas': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 4h7v16H5z" fill={color}/><path d="M13 8h2l2 2v8a2 2 0 002 2" stroke={color} strokeWidth="1.6" fill="none"/></svg>;
    case 'bell': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 16V11a6 6 0 0112 0v5l1.5 2H4.5L6 16z" fill={color}/><path d="M10 19a2 2 0 004 0" stroke={W.n800} strokeWidth="1.5" fill="none"/></svg>;
    case 'calendar': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2.5" fill={color}/><path d="M3 9h18M8 3v4M16 3v4" stroke={W.n800} strokeWidth="1.4" opacity="0.5"/></svg>;
    case 'crown': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 8l4 5 5-8 5 8 4-5v10H3V8z" fill={color}/></svg>;
    case 'star-line': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9 12 3z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    case 'library': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/></svg>;
    case 'plus': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    case 'arrow': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'chev': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}

// SectionCard — uniform card chrome for grid sections (mirrors picker)
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

// ─── Step 1 — Pick issuer (bank) ───
// Bank tiles use brand colors so the user recognizes their card at a glance.
// Picking an issuer pre-fills color + suggested name in Step 2 (smart defaults).
const ISSUERS = [
  { k: 'kbank',    name: 'KBank',     sub: 'Kasikorn Bank',         logo: 'K',  bg: W.walletGreen100,  ic: W.walletGreen },
  { k: 'scb',      name: 'SCB',       sub: 'Siam Commercial',       logo: 'S',  bg: W.walletViolet100, ic: W.walletViolet },
  { k: 'bbl',      name: 'BBL',       sub: 'Bangkok Bank',          logo: 'B',  bg: W.info200,         ic: W.info400 },
  { k: 'krungsri', name: 'Krungsri',  sub: 'Bank of Ayudhya',       logo: 'ก',  bg: '#FCEFD9',         ic: W.warning400 },
  { k: 'ktb',      name: 'Krungthai', sub: 'KTB',                   logo: 'ก',  bg: W.walletPink100,   ic: W.walletPink },
  { k: 'citi',     name: 'Citi',      sub: 'Citibank',              logo: 'C',  bg: W.walletRed100,    ic: W.walletRed },
  { k: 'ktc',      name: 'KTC',       sub: 'Krungthai Card',        logo: 'K',  bg: W.primary100,      ic: W.primary500 },
  { k: 'aeon',     name: 'AEON',      sub: 'AEON Thana Sinsap',     logo: 'A',  bg: W.walletPink100,   ic: W.walletPink },
  { k: 'amex',     name: 'AMEX',      sub: 'American Express',      logo: 'A',  bg: W.walletBrown100,  ic: W.walletBrown },
  { k: 'other',    name: 'อื่นๆ',     sub: 'ระบุเอง',                logo: '+',  bg: W.n200,            ic: W.n700 },
];

function StepOne() {
  const [sel, setSel] = React.useState('kbank');
  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={1} title="สร้างบัตรเครดิต" />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="เลือกธนาคารผู้ออกบัตร" sub="Mint จะใช้สีและไอคอนของธนาคารเป็นค่าเริ่มต้น" />
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ISSUERS.map(t => {
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
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 10,
                  fontSize: 20, fontWeight: 800, color: t.ic, letterSpacing: -0.5,
                }}>
                  {t.logo}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: INK.muted, marginTop: 2, lineHeight: 1.3 }}>{t.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
      <StickyCta label="ถัดไป" />
    </div>
  );
}

// ─── Step 2 — Customize: name + last-4 digits + icon + color ───
// Layout mirrors wallet Step 2 (preview wash → name → color → icon sections).
// Extra: last-4-digits input under name. Live preview shows "•••• 1234" sub.
const COLORS = [
  { k: 'violet', c: W.walletViolet, bg: W.walletViolet100 },
  { k: 'green',  c: W.walletGreen,  bg: W.walletGreen100 },
  { k: 'pink',   c: W.walletPink,   bg: W.walletPink100 },
  { k: 'red',    c: W.walletRed,    bg: W.walletRed100 },
  { k: 'brown',  c: W.walletBrown,  bg: W.walletBrown100 },
  { k: 'teal',   c: W.primary400,   bg: W.primary100 },
];

// CC-flavored "frequently used" — emphasizes card/shopping over savings/cash
const CC_FAVES = ['card', 'wallet', 'shopping', 'gift', 'plane'];
const BASIC    = ['savings', 'ewallet', 'qr', 'shop', 'chart', 'pie', 'calc', 'envelope', 'wallet', 'cash'];
const STD      = ['home', 'car', 'food', 'coffee', 'gift', 'gas', 'shopping', 'plane'];

const PACKS = [
  { name: 'Travel & Miles', count: 32,  ic: 'plane', bg: W.info200,     color: W.info400,    price: 'ฟรี',  isPremium: false },
  { name: 'Premium Pack',   count: 120, ic: 'crown', bg: '#FCEFD9',     color: W.warning400, price: '฿ 49', isPremium: true  },
];

function StepTwo() {
  const [name, setName] = React.useState('KBank Visa');
  const [last4, setLast4] = React.useState('1234');
  const [color, setColor] = React.useState(COLORS[0]);
  const [icon, setIcon] = React.useState('card');
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
      <Header step={2} title="สร้างบัตรเครดิต" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="ตั้งชื่อและหน้าตา" sub="เปลี่ยนได้ภายหลัง" />

        {/* PREVIEW — white card on gradient wash. Card has NO shadow (wash = elevation). */}
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
                {name || 'ชื่อบัตร'}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: INK.muted, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                บัตรเครดิต · •••• {last4 || '----'}
              </div>
            </div>
          </div>
        </div>

        {/* NAME + LAST-4 — two fields in one card */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px 12px' }}>
            <Eyebrow>ชื่อบัตร</Eyebrow>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="เช่น KBank Visa"
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontSize: 15, fontWeight: 600, color: W.n900,
                fontFamily: 'inherit', background: 'transparent', padding: 0, marginTop: 6,
              }} />
          </div>
          <div style={{ borderTop: `1px solid ${INK.hairline}`, padding: '12px 16px 14px' }}>
            <Eyebrow>เลขบัตร (4 หลักท้าย)</Eyebrow>
            <input value={last4} onChange={e => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234" inputMode="numeric" maxLength="4"
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontSize: 15, fontWeight: 600, color: W.n900,
                fontFamily: 'inherit', background: 'transparent', padding: 0, marginTop: 6,
                letterSpacing: 2, fontVariantNumeric: 'tabular-nums',
              }} />
          </div>
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
        <SectionCard
          title="ใช้บ่อย"
          meta="แตะค้างเพื่อปักหมุด"
          leadingIcon={<WIcon kind="star-line" size={14} color={W.warning400} />}
        >
          <Grid kinds={CC_FAVES} />
        </SectionCard>

        <SectionCard
          title="Basic Icons"
          meta={`${BASIC.length} ไอคอน`}
          collapsible
          open={openPacks.basic}
          onToggle={() => togglePack('basic')}
        >
          <Grid kinds={BASIC} />
        </SectionCard>

        <SectionCard
          title="ขนส่ง & ไลฟ์สไตล์"
          meta={`${STD.length} ไอคอน`}
          collapsible
          open={openPacks.standard}
          onToggle={() => togglePack('standard')}
        >
          <Grid kinds={STD} />
        </SectionCard>

        {/* คลังไอคอนเพิ่มเติม — pack store + library footer */}
        <div style={{
          margin: '0 16px 16px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
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
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: p.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <WIcon kind={p.ic} size={20} color={p.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: W.n900 }}>{p.name}</div>
                  {p.isPremium && (
                    <div style={{
                      padding: '2px 6px', borderRadius: 6,
                      background: '#FCEFD9', color: W.warning400,
                      fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
                    }}>PRO</div>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted, marginTop: 2 }}>{p.count} ไอคอน</div>
              </div>
              <button style={{
                padding: '6px 14px', borderRadius: 999,
                background: p.isPremium ? INK.surface : W.primary100,
                color: p.isPremium ? W.n900 : W.primary500,
                border: 'none', fontSize: 12, fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>{p.price}</button>
            </div>
          ))}
          <div style={{
            padding: '14px 16px', borderTop: `1px solid ${INK.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer',
          }}>
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

// ─── Step 3 — Billing: limit + outstanding + statement/due date + alert + currency ───
const CURRENCIES = [
  { code: 'THB', name: 'บาทไทย',      symbol: '฿', flag: '🇹🇭' },
  { code: 'USD', name: 'ดอลลาร์สหรัฐ', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'ยูโร',         symbol: '€', flag: '🇪🇺' },
  { code: 'JPY', name: 'เยนญี่ปุ่น',    symbol: '¥', flag: '🇯🇵' },
];

function StepThree() {
  const [limit, setLimit] = React.useState('80,000');
  const [outstanding, setOutstanding] = React.useState('13,440');
  const [statementDay, setStatementDay] = React.useState(20);
  const [dueDay, setDueDay] = React.useState(5);
  const [alertOn, setAlertOn] = React.useState(true);
  const [currency, setCurrency] = React.useState(CURRENCIES[0]);

  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={3} title="สร้างบัตรเครดิต" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="วงเงินและรอบบิล" sub="Mint จะติดตามและเตือนก่อนถึงกำหนดชำระ" />

        {/* LIMIT — hero amount card */}
        <div style={{
          margin: '8px 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '20px 16px 18px', textAlign: 'center',
        }}>
          <Eyebrow>วงเงินสูงสุด</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            <span style={{ fontSize: 18, color: INK.faint, fontWeight: 600 }}>{currency.symbol}</span>
            <input value={limit} onChange={e => setLimit(e.target.value)}
              style={{
                border: 'none', outline: 'none', fontSize: 38, fontWeight: 700, color: W.n900,
                textAlign: 'center', width: '70%', fontFamily: 'inherit', background: 'transparent',
                letterSpacing: -1,
              }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {['30,000', '50,000', '100,000', '300,000'].map(p => (
              <div key={p} onClick={() => setLimit(p)} style={{
                padding: '6px 12px', borderRadius: 999, background: INK.surface,
                fontSize: 12, color: W.n800, fontWeight: 600, cursor: 'pointer',
              }}>{currency.symbol} {p}</div>
            ))}
          </div>
        </div>

        {/* OUTSTANDING — current unpaid amount */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '14px 16px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Eyebrow>ยอดค้างชำระปัจจุบัน</Eyebrow>
            <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted }}>ยังไม่จ่าย</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 15, color: INK.faint, fontWeight: 600 }}>{currency.symbol}</span>
            <input value={outstanding} onChange={e => setOutstanding(e.target.value)}
              style={{
                border: 'none', outline: 'none', fontSize: 24, fontWeight: 700, color: W.n900,
                fontFamily: 'inherit', background: 'transparent', padding: 0,
                fontVariantNumeric: 'tabular-nums', flex: 1,
              }} />
          </div>
        </div>

        {/* BILLING CYCLE — statement + due date pickers */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px 8px' }}>
            <Eyebrow>รอบบิล</Eyebrow>
          </div>
          <div style={{ padding: '10px 16px 10px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: INK.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <WIcon kind="calendar" size={18} color={W.n700} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: INK.muted, fontWeight: 500 }}>วันสรุปยอด</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, marginTop: 1 }}>
                ทุกวันที่ {statementDay} ของเดือน
              </div>
            </div>
            <WIcon kind="arrow" size={16} color={INK.faint} />
          </div>
          <div style={{
            padding: '10px 16px 14px', display: 'flex', alignItems: 'center', gap: 12,
            borderTop: `1px solid ${INK.hairline}`, cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: W.walletRed100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <WIcon kind="calendar" size={18} color={W.walletRed} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: INK.muted, fontWeight: 500 }}>วันครบกำหนดชำระ</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, marginTop: 1 }}>
                ทุกวันที่ {dueDay} ของเดือนถัดไป
              </div>
            </div>
            <WIcon kind="arrow" size={16} color={INK.faint} />
          </div>
        </div>

        {/* NOTIFICATION toggle */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: alertOn ? W.primary100 : INK.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'background 0.15s',
          }}>
            <WIcon kind="bell" size={18} color={alertOn ? W.primary500 : W.n700} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>แจ้งเตือนก่อนกำหนดชำระ</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted, marginTop: 2 }}>เตือน 3 วันก่อนครบกำหนด</div>
          </div>
          <div onClick={() => setAlertOn(!alertOn)} style={{
            width: 44, height: 26, borderRadius: 13,
            background: alertOn ? W.primary400 : W.n300,
            position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
            flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 3, left: alertOn ? 21 : 3,
              width: 20, height: 20, borderRadius: 10, background: '#fff',
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}/>
          </div>
        </div>

        {/* CURRENCY row */}
        <div style={{
          margin: '0 16px 12px', background: '#fff', borderRadius: 16,
          boxShadow: cardShadow, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: INK.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>{currency.flag}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow>สกุลเงิน</Eyebrow>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, marginTop: 2 }}>
              {currency.code} — {currency.name} ({currency.symbol})
            </div>
          </div>
          <WIcon kind="arrow" size={16} color={INK.faint} />
        </div>
      </div>
      <StickyCta label="ถัดไป" />
    </div>
  );
}

// ─── Step 4 — AI goal (required, CC-specific examples) ───
const CC_GOAL_EXAMPLES = [
  { text: 'ใช้เท่าที่จำเป็น · เก็บไว้ใช้ตอนฉุกเฉิน', ic: 'piggy' },
  { text: 'ปิดยอดเต็มทุกเดือน · ไม่ให้เกิดดอกเบี้ย',  ic: 'check' },
  { text: 'เก็บแต้ม cashback / ไมล์',                ic: 'gift' },
  { text: 'แยกค่าใช้จ่ายธุรกิจจากส่วนตัว',           ic: 'envelope' },
  { text: 'ใช้เฉพาะค่าน้ำมัน',                      ic: 'gas' },
  { text: 'ผ่อน 0% เครื่องใช้ในบ้าน',                ic: 'home' },
];

function StepFour() {
  const [goal, setGoal] = React.useState('');
  const goalValid = goal.trim().length > 0;
  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={4} title="สร้างบัตรเครดิต" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="ตั้งเป้าหมายบัตรนี้" sub="ให้ AI ช่วยเตือนและแนะนำเมื่อใกล้เกินวงเงิน" />

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
                  เป้าหมายของบัตร
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
            boxShadow: goalValid ? `inset 0 0 0 1.5px ${W.walletViolet}` : 'none',
            transition: 'box-shadow 0.15s',
          }}>
            <input value={goal} onChange={e => setGoal(e.target.value)}
              placeholder="พิมพ์เป้าหมายของบัตรนี้..."
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontSize: 14, fontWeight: 500, color: W.n900,
                fontFamily: 'inherit', background: 'transparent', padding: 0,
              }} />
          </div>

          {/* examples */}
          <div style={{ padding: '0 16px 8px' }}>
            <Eyebrow>ตัวอย่างยอดนิยม</Eyebrow>
          </div>
          <div>
            {CC_GOAL_EXAMPLES.map((ex, i) => {
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
      <StickyCta label="สร้างบัตร" disabled={!goalValid} />
    </div>
  );
}

// Export 4 step screens — render side-by-side in canvas
window.CreateCreditWizard_Step1 = StepOne;
window.CreateCreditWizard_Step2 = StepTwo;
window.CreateCreditWizard_Step3 = StepThree;
window.CreateCreditWizard_Step4 = StepFour;
})();
