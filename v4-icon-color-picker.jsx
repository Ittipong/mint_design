// Unified Icon + Color Picker — bottom sheet
//   เปิดจาก: tap icon/color slot ในหน้า Create Wallet (หรือ Edit Wallet)
//   เป้าหมาย: เลือก icon + สี + เห็น preview ในแผ่นเดียว — ไม่ต้องเปิด 2 sheets
//
// Visual rewrite (v2):
//   - Adopted INK palette (muted/faint/divider) from v4-wallet-detail for AA-grade
//     secondary text and a quieter divider tone (#ECECF1 vs harsher n300).
//   - Spacing scale locked to multiples of 4 (4/8/12/16/20/24). No more 10/14 outliers.
//   - Typography rhythm:
//       Section title : 14/700 n900
//       Section meta  : 11/500 INK.muted        (e.g. "10 ไอคอน")
//       Eyebrow caps  : 10/600 INK.faint LS=0.6 (e.g. "ตัวอย่าง", "เลือกสี")
//       Row label     : 13/600 n900
//       Body hint     : 12/500 INK.muted
//   - Cards-on-canvas: sheet body switches to neutral n200 so each section reads as a
//     calm card with one soft shadow and NO border. Borders + shadows together were
//     the #1 cause of "ตาลาย".
//   - Color row redesigned: trailing "ทั้งหมด" becomes a neutral ghost chip, divider
//     line removed (whitespace separates), check ring uses soft glow not double-shadow.
//   - Store pack rows: borders dropped in favor of a single thin divider; price pill
//     shrunk and tinted to its category so it stops shouting.
(function () {
const W = window.MINT;

// Eye-friendly overlay tokens — mirror v4-wallet-detail.jsx so the two screens feel
// like part of the same family. WCAG AA on white at body text sizes.
const INK = {
  surface: '#F4F5F8',   // sheet body — sits between cards so white pops
  muted:   '#6B6B78',   // secondary text (5.6:1 on white)
  faint:   '#9A99A6',   // tertiary text — 11px+ only
  divider: '#ECECF1',   // soft separator — replaces n300 for in-card dividers
  hairline:'#F0F0F4',   // even softer — for row separation inside cards
};

// 5-hue swatch row — full palette lives in Color Picker Sheet (artboard 03).
const PAIRS = [
  { k: 'mint',   ic: W.primary400,   bg: W.primary100 },
  { k: 'sky',    ic: W.info400,      bg: W.info200 },
  { k: 'violet', ic: W.walletViolet, bg: W.walletViolet100 },
  { k: 'coral',  ic: W.walletRed,    bg: W.walletRed100 },
  { k: 'amber',  ic: W.warning400,   bg: '#FCEFD9' },
];

// Single shadow recipe — used everywhere a card is needed. Borders are forbidden
// on any container that already carries this shadow.
const cardShadow = '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)';

function WIcon({ kind, size = 22, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'piggy': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'wallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" fill={color}/><circle cx="17" cy="13" r="1.4" fill={W.n800}/></svg>;
    case 'salary': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7z" fill={color}/><path d="M9 7V5a3 3 0 016 0v2" stroke={W.n800} strokeWidth="1.4" fill="none"/></svg>;
    case 'cash': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill={color}/><circle cx="12" cy="12" r="2.5" fill="none" stroke={W.n800} strokeWidth="1.4"/></svg>;
    case 'card': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2.5" fill={color}/><rect x="2" y="10" width="20" height="2.5" fill={W.n800} opacity="0.5"/></svg>;
    case 'savings': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 11c0-2.8 2.7-5 6-5 1.4 0 2.6.4 3.6 1.1L17 6l-.5 2.6c.9.9 1.5 2.1 1.5 3.4 0 .9-.3 1.7-.7 2.5l.7 1.5h-2.5l-.6-.6c-.7.4-1.5.6-2.4.6h-1l-1 2h-2v-2H7c-1.1 0-2-.9-2-2v-2.5L3 12l1-2 1 1z" fill={color}/></svg>;
    case 'ewallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2.5" fill={color}/><rect x="9" y="6" width="6" height="7" rx="1" fill={W.n800} opacity="0.2"/></svg>;
    case 'qr': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" fill={color}/><rect x="14" y="3" width="7" height="7" fill={color}/><rect x="3" y="14" width="7" height="7" fill={color}/><rect x="14" y="14" width="3" height="3" fill={color}/><rect x="18" y="18" width="3" height="3" fill={color}/></svg>;
    case 'shop': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 9l1.5-4h13L20 9v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" fill={color}/><rect x="5" y="13" width="14" height="7" fill={color} opacity="0.7"/></svg>;
    case 'chart': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="14" width="3" height="6" rx="1" fill={color}/><rect x="10" y="10" width="3" height="10" rx="1" fill={color}/><rect x="16" y="6" width="3" height="14" rx="1" fill={color}/></svg>;
    case 'pie': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={color}/><path d="M12 3v9l8 3a9 9 0 00-8-12z" fill={W.n800} opacity="0.35"/></svg>;
    case 'calc': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" fill={color}/><rect x="7" y="5" width="10" height="4" rx="1" fill={W.n800} opacity="0.3"/><circle cx="9" cy="13" r="1" fill={W.n800}/><circle cx="12" cy="13" r="1" fill={W.n800}/><circle cx="15" cy="13" r="1" fill={W.n800}/><circle cx="9" cy="17" r="1" fill={W.n800}/><circle cx="12" cy="17" r="1" fill={W.n800}/><circle cx="15" cy="17" r="1" fill={W.n800}/></svg>;
    case 'envelope': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" fill={color}/><path d="M3 7l9 7 9-7" stroke={W.n800} strokeWidth="1.4" fill="none" opacity="0.5"/></svg>;
    case 'home': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" fill={color}/></svg>;
    case 'car': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 13l1.5-5h13L20 13v5h-2v-2H6v2H4v-5z" fill={color}/><circle cx="7.5" cy="15.5" r="1.5" fill={W.n800}/><circle cx="16.5" cy="15.5" r="1.5" fill={W.n800}/></svg>;
    case 'food': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={color}/><circle cx="12" cy="12" r="5" fill={W.n800} opacity="0.2"/></svg>;
    case 'coffee': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h12v8a4 4 0 01-4 4H9a4 4 0 01-4-4V7z" fill={color}/><path d="M17 9h2a2 2 0 010 4h-2" fill="none" stroke={color} strokeWidth="1.8"/></svg>;
    case 'gift': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="18" height="3" fill={color}/><rect x="5" y="12" width="14" height="9" fill={color} opacity="0.85"/><rect x="11" y="9" width="2" height="12" fill={W.n800} opacity="0.4"/></svg>;
    case 'gas': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 4h7v16H5z" fill={color}/><path d="M13 8h2l2 2v8a2 2 0 002 2" stroke={color} strokeWidth="1.6" fill="none"/></svg>;
    case 'shopping': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14l-1 13H6L5 7z" fill={color}/><path d="M9 7V5a3 3 0 016 0v2" stroke={W.n800} strokeWidth="1.4" fill="none"/></svg>;
    case 'plane': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M21 11l-9 4-2 5-2-3-3-2 5-2 4-9 7 7z" fill={color}/></svg>;
    case 'chev': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'close': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case 'star-line': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9 12 3z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    case 'library': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/></svg>;
    case 'crown': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 8l4 5 5-8 5 8 4-5v10H3V8z" fill={color}/></svg>;
    case 'arrow': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'plus': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    default: return null;
  }
}

// ────────────────────────────────────────────────
// Header — handle / close / title / library entry
// ────────────────────────────────────────────────
function PickerHeader({ title }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: W.n300 }} />
      </div>
      <div style={{ padding: '4px 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <WIcon kind="close" size={20} color={W.n800} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: W.n900, letterSpacing: -0.1 }}>{title}</div>
        {/* Library entry — ghost (no fill) so the close+title axis stays the visual primary */}
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <WIcon kind="library" size={18} color={W.n700} />
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────
// Section frame — uniform card chrome for every grid section.
// All four grid sections (ใช้บ่อย / ของฉัน / Basic / ขนส่ง) share this.
// Header layout: title (14/700) + meta (11/500) on left; optional trailing slot on right.
// ────────────────────────────────────────────────
function SectionCard({ title, meta, leadingIcon, trailing, onToggle, collapsible, open = true, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, marginBottom: 12,
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

// ────────────────────────────────────────────────
// Main picker
// ────────────────────────────────────────────────
function IconColorPicker() {
  const [pair, setPair] = React.useState(PAIRS[2]); // violet default
  const [icon, setIcon] = React.useState('piggy');
  const [openPacks, setOpenPacks] = React.useState({ basic: true, standard: true });

  const togglePack = (k) => setOpenPacks(p => ({ ...p, [k]: !p[k] }));

  const FAVES = ['piggy', 'wallet', 'salary', 'cash', 'card'];
  const BASIC = ['savings', 'ewallet', 'qr', 'shop', 'chart', 'pie', 'calc', 'envelope', 'wallet', 'cash'];
  const STD   = ['home', 'car', 'food', 'coffee', 'gift', 'gas', 'shopping', 'plane'];

  // ── Icon cell ─────────────────────────────────
  // Active state: tinted bg + colored icon + small check badge.
  // Inactive: flat n200 tile, NO border (whitespace + grid gap define the shape).
  const IconCell = ({ k }) => {
    const active = icon === k;
    return (
      <div onClick={() => setIcon(k)} style={{
        aspectRatio: '1 / 1',
        background: active ? pair.bg : INK.surface,
        borderRadius: 14,
        boxShadow: active ? `inset 0 0 0 1.5px ${pair.ic}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.15s, box-shadow 0.15s',
      }}>
        <WIcon kind={k} size={26} color={active ? pair.ic : W.n700} />
        {active && (
          <div style={{
            position: 'absolute', top: 4, right: 4,
            width: 16, height: 16, borderRadius: 8, background: pair.ic,
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
    <div style={{ background: W.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:25" />

      {/* faded host screen */}
      <div style={{ flex: 1, padding: '12px 20px', opacity: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <WIcon kind="close" size={18} color={W.n800} />
          <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: W.n900 }}>สร้างกระเป๋าใหม่</div>
          <div style={{ width: 24 }}/>
        </div>
      </div>

      {/* dim backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', pointerEvents: 'none' }} />

      {/* SHEET */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 90,
        background: '#fff',
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        boxShadow: '0 -12px 30px rgba(0,0,0,0.10)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <PickerHeader title="ไอคอน & สี" />

        {/* ── LIVE PREVIEW ───────────────────────────
            Floating card on a soft gradient wash. Card itself has no shadow — the
            tinted wash IS the elevation cue, which keeps the area calm. */}
        <div style={{
          padding: '4px 16px 20px',
          background: `linear-gradient(180deg, ${pair.bg} 0%, transparent 100%)`,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: pair.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <WIcon kind={icon} size={28} color={pair.ic} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: INK.faint, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>ตัวอย่าง</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: W.n900, marginTop: 2, letterSpacing: -0.1 }}>KBank ออมทรัพย์</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: INK.muted, marginTop: 2 }}>บัญชีออมทรัพย์ · ฿ 15,000</div>
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ────────────────────────
            Body bg switches to INK.surface so every white card visually pops without
            needing borders. This is the single biggest fix for "ตาลาย": stop stacking
            white-on-white-with-borders. */}
        <div style={{ flex: 1, overflow: 'auto', background: INK.surface, padding: '16px 0 120px' }}>

          {/* ── COLOR ROW ─────────────────────────────
              Single card. Eyebrow label sits above, swatches in a clean row.
              "ทั้งหมด" trailing chip is intentionally low-contrast (neutral text on
              n200 fill, NO border) so the colored swatches remain the focal point. */}
          <div style={{
            margin: '0 16px 12px', background: '#fff', borderRadius: 16,
            boxShadow: cardShadow, padding: '14px 16px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: INK.faint, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>เลือกสี</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted }}>สีหลัก · ดู 20 สี</div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {PAIRS.map(p => {
                const active = pair.k === p.k;
                // Active ring uses ic color at low alpha — softer than a hard double-stroke
                return (
                  <div key={p.k} onClick={() => setPair(p)} style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: 18,
                    background: p.bg, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: active
                      ? `0 0 0 2px #fff, 0 0 0 4px ${p.ic}`
                      : 'none',
                    transition: 'box-shadow 0.15s ease',
                  }}>
                    {active && <WIcon kind="check" size={16} color={p.ic} />}
                  </div>
                );
              })}
              {/* Trailing "ทั้งหมด" — ghost neutral chip. No border, no colorful disc, just
                  a quiet 4-dot color preview and label. Stops competing with swatches. */}
              <div style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px', borderRadius: 999,
                background: INK.surface,
                cursor: 'pointer',
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

          {/* ── ใช้บ่อย ─────────────────────────────── */}
          <SectionCard
            title="ใช้บ่อย"
            meta="แตะค้างเพื่อปักหมุด"
            leadingIcon={<WIcon kind="star-line" size={14} color={W.warning400} />}
          >
            <Grid kinds={FAVES} />
          </SectionCard>

          {/* ── ไอคอนของฉัน ──────────────────────────
              Trailing "+ เพิ่ม" is a soft primary chip — not loud, but still inviting. */}
          <SectionCard
            title="ไอคอนของฉัน"
            meta="4 ตัว · emoji + ภาพ"
            trailing={
              <div style={{
                padding: '6px 12px', borderRadius: 999, background: W.primary100,
                fontSize: 11, fontWeight: 700, color: W.primary500, cursor: 'pointer',
              }}>+ เพิ่ม</div>
            }
          >
            <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {['🏠', '☕️', '🎮', '✈️'].map(e => (
                <div key={e} style={{
                  aspectRatio: '1 / 1',
                  background: INK.surface,
                  borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 24, lineHeight: 1,
                }}>{e}</div>
              ))}
              {/* + cell — dashed outline ONLY here, where it semantically means "add" */}
              <div style={{
                aspectRatio: '1 / 1',
                background: '#fff',
                borderRadius: 14,
                boxShadow: `inset 0 0 0 1px ${INK.divider}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <WIcon kind="plus" size={18} color={INK.muted} />
              </div>
            </div>
          </SectionCard>

          {/* ── Built-in packs ──────────────────────── */}
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

          {/* ── คลังไอคอนเพิ่มเติม — teaser packs ────
              Pack rows: single hairline divider between rows (no borders), price
              chip tinted to its category (no harsh black/teal pills), footer CTA
              becomes a flat link instead of a heavy panel. */}
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

            {[
              { name: 'Food & Drinks', count: 28, ic: 'pie',   bg: W.walletPink100, color: W.walletPink,   price: 'ฟรี',  isPremium: false },
              { name: 'Premium Pack',  count: 120, ic: 'crown', bg: '#FCEFD9',       color: W.warning400,  price: '฿ 49', isPremium: true  },
            ].map((p, i) => (
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
                {/* Price chip — tinted, low-key. Free pack uses primary100 tint;
                    paid pack uses neutral n200 + n900 text so it doesn't shout. */}
                <button style={{
                  padding: '6px 14px', borderRadius: 999,
                  background: p.isPremium ? INK.surface : W.primary100,
                  color: p.isPremium ? W.n900 : W.primary500,
                  border: 'none', fontSize: 12, fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer',
                }}>{p.price}</button>
              </div>
            ))}

            {/* Footer CTA — flat link, not a panel. Pulls user toward Library Manager
                without adding another visual block. */}
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

        {/* ── Sticky apply ─────────────────────────── */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '14px 16px 28px',
          background: 'linear-gradient(to top, #fff 65%, rgba(255,255,255,0))',
        }}>
          <button style={{
            width: '100%', height: 50, borderRadius: 16, border: 'none',
            background: W.primary400, color: '#fff',
            fontSize: 15, fontWeight: 700, letterSpacing: -0.1,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(56,178,172,0.32)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <WIcon kind="check" size={18} color="#fff" />
            ใช้
          </button>
        </div>
      </div>
    </div>
  );
}

window.IconColorPickerUnified = IconColorPicker;
})();
