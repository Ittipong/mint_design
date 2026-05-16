// Icon Library Manager — full screen page (เปิดจาก More menu)
//   เปลี่ยน mental model: "เลือกใช้ icon ตอนนี้" (picker) vs "จัด library ของฉัน" (manager)
//
// Layout:
//   1. Header เต็มจอ ไม่ใช่ sheet — title "ไอคอน" + ปุ่ม "+" สร้าง
//   2. Hero stats: "X packs · Y icons · Z custom"
//   3. Search bar
//   4. Section 1: Packs ของฉัน (active) — list pack ที่ enable แล้ว, swipe to remove
//   5. Section 2: Custom Icons (ของฉัน upload/emoji) — grid + CTA "+ เพิ่ม"
//   6. Section 3: Store (pack ที่ซื้อเพิ่มได้ — รวม premium)
//
// ไม่มี tabs — scroll continuous เพราะเป็น management ไม่ใช่ navigation
(function () {
const W = window.MINT;

function I({ kind, size = 22, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'piggy': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/></svg>;
    case 'wallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" fill={color}/></svg>;
    case 'card': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2.5" fill={color}/></svg>;
    case 'plane': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M21 11l-9 4-2 5-2-3-3-2 5-2 4-9 7 7z" fill={color}/></svg>;
    case 'food': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={color}/></svg>;
    case 'shop': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 9l1.5-4h13L20 9v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" fill={color}/><rect x="5" y="13" width="14" height="7" fill={color} opacity="0.7"/></svg>;
    case 'star': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9 12 3z" fill={color}/></svg>;
    case 'gift': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="18" height="3" fill={color}/><rect x="5" y="12" width="14" height="9" fill={color} opacity="0.85"/></svg>;
    case 'crown': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 8l4 5 5-8 5 8 4-5v10H3V8z" fill={color}/></svg>;
    case 'plus': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    case 'back': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'search': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke={color} strokeWidth="2" fill="none"/><path d="M16 16l4 4" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'chev': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'dots': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.6" fill={color}/><circle cx="12" cy="12" r="1.6" fill={color}/><circle cx="19" cy="12" r="1.6" fill={color}/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'lock': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" fill={color}/><path d="M8 10V7a4 4 0 018 0v3" stroke={color} strokeWidth="1.8" fill="none"/></svg>;
    default: return null;
  }
}

const MY_PACKS = [
  { k: 'basic', name: 'Basic Icons', count: 10, ic: 'wallet', bg: W.walletViolet100, color: W.walletViolet, isDefault: true },
  { k: 'finance', name: 'Finance Plus', count: 24, ic: 'card', bg: W.walletGreen100, color: W.walletGreen },
  { k: 'travel', name: 'Travel & Lifestyle', count: 32, ic: 'plane', bg: W.info200, color: W.info400 },
];

const CUSTOM_ICONS = ['🏠', '🚗', '☕️', '🎁', '✈️', '🍜', '💼', '🎮'];

const STORE_PACKS = [
  { k: 'food', name: 'Food & Drinks', count: 28, ic: 'food', bg: W.walletPink100, color: W.walletPink, price: 'ฟรี' },
  { k: 'premium', name: 'Premium Set · 120 ไอคอน', count: 120, ic: 'crown', bg: '#FCEFD9', color: W.warning400, price: '฿ 49', isPremium: true },
  { k: 'shopping', name: 'Shopping & Brands', count: 40, ic: 'shop', bg: W.walletRed100, color: W.walletRed, price: '฿ 29' },
  { k: 'fitness', name: 'Health & Fitness', count: 18, ic: 'star', bg: W.walletGreen100, color: W.walletGreen, price: '฿ 19' },
];

function LibraryManager() {
  return (
    <div style={{ background: W.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:25" />

      {/* Header */}
      <div style={{ padding: '4px 16px 12px', background: '#fff', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${W.n300}` }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <I kind="back" size={20} color={W.n800} />
        </div>
        <div style={{ flex: 1, fontSize: 17, fontWeight: 700, color: W.n900 }}>จัดการไอคอน</div>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: W.primary100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <I kind="plus" size={18} color={W.primary500} />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 30 }}>

        {/* Hero stats */}
        <div style={{ padding: '16px 16px 0', display: 'flex', gap: 8 }}>
          {[
            { num: '3', label: 'แพ็ค' },
            { num: '66', label: 'ไอคอน' },
            { num: '8', label: 'ของฉัน' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: '#fff', borderRadius: 12, padding: '12px 10px',
              textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: W.n900, letterSpacing: -0.5 }}>{s.num}</div>
              <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* SECTION 1: ของฉัน (active) */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>แพ็คของฉัน</div>
            <div style={{ fontSize: 11, color: '#6B6B78' }}>{MY_PACKS.length} แพ็ค · เปิดใช้</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            {MY_PACKS.map((p, i) => (
              <div key={p.k} style={{
                padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
                borderTop: i ? `1px solid ${W.n300}` : 'none', cursor: 'pointer',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: p.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I kind={p.ic} size={22} color={p.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: W.n900, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.name}
                    {p.isDefault && (
                      <div style={{
                        padding: '2px 6px', borderRadius: 6, background: W.primary100,
                        fontSize: 9, fontWeight: 700, color: W.primary500, letterSpacing: 0.3,
                      }}>DEFAULT</div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 1 }}>{p.count} ไอคอน</div>
                </div>
                <I kind="dots" size={18} color={W.n400} />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Custom (emoji / upload) */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>ไอคอนของฉัน</div>
            <div style={{ fontSize: 11, color: W.primary500, fontWeight: 600, cursor: 'pointer' }}>+ เพิ่ม</div>
          </div>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '14px',
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10,
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}>
            {CUSTOM_ICONS.map((e, i) => (
              <div key={i} style={{
                aspectRatio: '1 / 1', borderRadius: 12, background: W.n200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, cursor: 'pointer',
              }}>{e}</div>
            ))}
            <div style={{
              aspectRatio: '1 / 1', borderRadius: 12, background: W.n200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: `1px dashed ${W.n400}`,
            }}>
              <I kind="plus" size={18} color={W.n400} />
            </div>
          </div>
        </div>

        {/* SECTION 3: Store */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>คลังไอคอนเพิ่มเติม</div>
            <div style={{ fontSize: 11, color: '#6B6B78' }}>ดูทั้งหมด ›</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STORE_PACKS.map(p => (
              <div key={p.k} style={{
                background: '#fff', borderRadius: 14, padding: '14px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                border: p.isPremium ? `1.5px solid ${W.warning400}` : 'none',
                position: 'relative',
              }}>
                {p.isPremium && (
                  <div style={{
                    position: 'absolute', top: -8, left: 14,
                    padding: '2px 8px', borderRadius: 6, background: W.warning400,
                    fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: 0.5,
                  }}>✦ PREMIUM</div>
                )}
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: p.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I kind={p.ic} size={24} color={p.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 1 }}>{p.count} ไอคอน · พรีวิวก่อนซื้อ</div>
                </div>
                <button style={{
                  padding: '7px 14px', borderRadius: 16,
                  background: p.price === 'ฟรี' ? W.primary400 : W.n900,
                  color: '#fff', border: 'none', fontSize: 12, fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {p.price !== 'ฟรี' && <I kind="lock" size={11} color="#fff" />}
                  {p.price}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>);
}

window.IconLibraryManager = LibraryManager;
})();
