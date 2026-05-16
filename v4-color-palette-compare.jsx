// Color Picker · Bottom Sheet — 3 preview variants for review
//   Variant A · Tint    — SVG icon tinted with paired colors (current direction)
//   Variant B · Asset   — flat 3D-style colorful icon asset (matches old design vibe)
//   Variant C · Emoji   — emoji icon · iOS-native feel
//
// Shared:
//   - 20 paired tokens · 5 hue families × 4 shades
//   - Hero icon container scaled to transaction-icon proportions
//     (transaction list uses 32×32 / radius 10 / icon ~20px = 62% ratio)
//     Hero scales up but keeps same 62% icon/container ratio + radius/container ratio.
//   - Auto-apply on tap · no scroll
(function () {
const W = window.MINT;

function I({ kind, size = 20, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'piggy': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'close': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2.2" strokeLinecap="round"/></svg>;
  }
}

// ─── 20 paired tokens · 5 families ───────────────────────────────────────────
const GROUPS = [
  { name: 'มินต์ & เขียว', items: [
    { k: 'mint',  ic: W.primary400,   bg: W.primary100,        label: 'มินต์' },
    { k: 'green', ic: W.walletGreen,  bg: W.walletGreen100,    label: 'เขียว' },
    { k: 'sage',  ic: '#7CA982',      bg: '#D8E8DA',           label: 'เซจ' },
    { k: 'lime',  ic: '#A6BB52',      bg: '#E6EDC6',           label: 'มะนาว' },
  ]},
  { name: 'ฟ้า & น้ำเงิน', items: [
    { k: 'turquoise', ic: '#4DBDB8',  bg: '#C5EEEC',           label: 'เทอร์ควอยซ์' },
    { k: 'sky',       ic: W.info400,  bg: W.info200,           label: 'ฟ้า' },
    { k: 'indigo',    ic: '#5C7CCB',  bg: '#D5DDEE',           label: 'คราม' },
    { k: 'navy',      ic: '#4060A6',  bg: '#C9D2E3',           label: 'กรม' },
  ]},
  { name: 'ม่วง & ชมพู', items: [
    { k: 'violet',    ic: W.walletViolet, bg: W.walletViolet100, label: 'ม่วง' },
    { k: 'lavender',  ic: '#B59AD9',      bg: '#E8DCF5',         label: 'ลาเวนเดอร์' },
    { k: 'pink',      ic: W.walletPink,   bg: W.walletPink100,   label: 'ชมพู' },
    { k: 'rose',      ic: '#E59AB5',      bg: '#F5D9E3',         label: 'กุหลาบ' },
  ]},
  { name: 'ส้ม & แดง', items: [
    { k: 'coral',  ic: W.walletRed, bg: W.walletRed100, label: 'ส้มแดง' },
    { k: 'red',    ic: '#D85647',   bg: '#F3CFCB',      label: 'แดง' },
    { k: 'orange', ic: '#E89A4A',   bg: '#FAE0C5',      label: 'ส้ม' },
    { k: 'peach',  ic: '#F0B07A',   bg: '#FCE2CA',      label: 'พีช' },
  ]},
  { name: 'เหลือง & น้ำตาล', items: [
    { k: 'amber',   ic: W.warning400,   bg: '#FCEFD9',         label: 'เหลือง' },
    { k: 'mustard', ic: '#C49B2E',      bg: '#EDDFB0',         label: 'มัสตาร์ด' },
    { k: 'brown',   ic: W.walletBrown,  bg: W.walletBrown100,  label: 'น้ำตาล' },
    { k: 'sand',    ic: '#B8A176',      bg: '#E8DEC5',         label: 'ทราย' },
  ]},
];

const ALL_PAIRS = GROUPS.flatMap(g => g.items);

// ─── Hero icon container — scales to transaction proportions ───────────────
//   Transaction icon (from v4-wallet-detail): 32×32 / radius 10 / icon ~20px
//   ratios: radius/container = 0.31  ·  icon/container = 0.62
//
//   Hero size 56 → radius 18 · icon 34
const HERO_SIZE = 56;
const HERO_RADIUS = 18;
const HERO_ICON = 34;

// ─── Variant A · Tint (SVG icon colored by paired tokens) ───────────────────
function HeroTint({ sel }) {
  return (
    <div style={{
      width: HERO_SIZE, height: HERO_SIZE, borderRadius: HERO_RADIUS,
      background: sel.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.2s ease',
    }}>
      <I kind="piggy" size={HERO_ICON} color={sel.ic} />
    </div>
  );
}

// ─── Variant B · Asset (flat 3D-style colorful illustration) ────────────────
//   Mimics the iOS asset look from the original create-wallet screenshot:
//   purple wallet body + yellow tag + slight depth shading. Does NOT recolor
//   per selection — assets have their own brand palette (which is the whole
//   POINT of the asset approach: branded illustrations vs theme tokens).
function HeroAsset({ sel }) {
  return (
    <div style={{
      width: HERO_SIZE, height: HERO_SIZE, borderRadius: HERO_RADIUS,
      background: sel.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.2s ease',
    }}>
      {/* asset-style wallet · multi-color · with depth */}
      <svg width={HERO_ICON + 4} height={HERO_ICON + 4} viewBox="0 0 32 32" fill="none">
        {/* shadow */}
        <ellipse cx="16" cy="27" rx="9" ry="1.5" fill="#000" opacity="0.10"/>
        {/* wallet body — base */}
        <path d="M5.5 9.5C5.5 8.4 6.4 7.5 7.5 7.5h17c1.1 0 2 .9 2 2v13c0 1.1-.9 2-2 2h-17c-1.1 0-2-.9-2-2v-13z" fill="#7C6BCF"/>
        {/* wallet body — top highlight */}
        <path d="M5.5 9.5C5.5 8.4 6.4 7.5 7.5 7.5h17c1.1 0 2 .9 2 2v3h-21v-3z" fill="#9989E0"/>
        {/* tag/button */}
        <circle cx="22" cy="16" r="2" fill="#F5C148"/>
        <circle cx="22" cy="16" r="0.8" fill="#C99928"/>
        {/* fold line */}
        <path d="M5.5 16h21" stroke="#5E4FA8" strokeWidth="0.6" opacity="0.3"/>
      </svg>
    </div>
  );
}

// ─── Variant C · Emoji ──────────────────────────────────────────────────────
function HeroEmoji({ sel }) {
  return (
    <div style={{
      width: HERO_SIZE, height: HERO_SIZE, borderRadius: HERO_RADIUS,
      background: sel.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: HERO_ICON,
      lineHeight: 1,
      transition: 'background 0.2s ease',
    }}>
      🐷
    </div>
  );
}

// ─── Swatch (shared across all 3 variants) ──────────────────────────────────
function Swatch({ p, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: p.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: active
          ? `0 0 0 2px #fff, 0 0 0 4px ${p.ic}`
          : `inset 0 0 0 1px rgba(0,0,0,0.04)`,
        transition: 'box-shadow 0.15s ease',
      }}>
        {active && <I kind="check" size={18} color={p.ic} />}
      </div>
    </div>
  );
}

// ─── Sheet shell · variant-agnostic ─────────────────────────────────────────
function ColorPickerSheet({ Hero, variantTag }) {
  const [sel, setSel] = React.useState(ALL_PAIRS[8]); // violet default

  return (
    <div style={{ background: W.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:25" />

      {/* faded host */}
      <div style={{ flex: 1, padding: '12px 20px', opacity: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <I kind="close" size={18} color={W.n800} />
          <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: W.n900 }}>สร้างกระเป๋าใหม่</div>
          <div style={{ width: 24 }}/>
        </div>
      </div>

      {/* dim backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', pointerEvents: 'none' }} />

      {/* BOTTOM SHEET */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 200,
        background: '#fff',
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        boxShadow: '0 -12px 30px rgba(0,0,0,0.10)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: W.n300 }} />
        </div>

        {/* header */}
        <div style={{ padding: '6px 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <I kind="close" size={20} color={W.n800} />
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: W.n900 }}>เลือกสี</div>
            <div style={{ fontSize: 9, color: '#9A99A6', fontWeight: 600, marginTop: 1, letterSpacing: 0.5 }}>
              PREVIEW · {variantTag}
            </div>
          </div>
          <div style={{ width: 32 }}/>
        </div>

        {/* HERO PREVIEW — fixed size, matches transaction icon proportions */}
        <div style={{
          padding: '14px 0 18px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <Hero sel={sel} />
          <div style={{ fontSize: 13, fontWeight: 700, color: W.n900 }}>
            {sel.label}
          </div>
        </div>

        {/* COLOR GRID · 5 rows × 4 swatches · no scroll */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {GROUPS.map(g => (
            <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 64, fontSize: 11, fontWeight: 600, color: '#6B6B78',
                lineHeight: 1.25, flexShrink: 0,
              }}>{g.name}</div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {g.items.map(p => (
                  <Swatch key={p.k} p={p} active={sel.k === p.k} onClick={() => setSel(p)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>);
}

// 3 variants
window.ColorPickerTint  = () => <ColorPickerSheet Hero={HeroTint}  variantTag="TINT (SVG · paired tokens)" />;
window.ColorPickerAsset = () => <ColorPickerSheet Hero={HeroAsset} variantTag="ASSET (flat 3D illustration)" />;
window.ColorPickerEmoji = () => <ColorPickerSheet Hero={HeroEmoji} variantTag="EMOJI (iOS native)" />;

// Backwards-compat: ColorPaletteNew points at Tint variant
window.ColorPaletteNew = window.ColorPickerTint;
})();
