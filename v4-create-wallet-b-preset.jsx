// Create Wallet — Design B · "Smart Single Page (Preset-Driven)"
//   หน้าเดียว แต่ฉลาด: เลือก preset → fill ชื่อ/icon/สี ให้อัตโนมัติ → ผู้ใช้แก้ก็ได้
//   - Live preview card บนสุด — เห็นว่า "กำลังสร้างอะไร" ตลอดเวลา
//   - Preset chips แนวนอน 1 แถว (horizontal scroll) — เปรียบเทียบกับ 6 chips wrap 3 แถวของ old
//   - ปรับแต่งเพิ่มเติม collapse — power user ค่อยเปิด
//   - AI goal เป็น opt-in card แยก ไม่กิน vertical space ถ้าไม่ใช้
//   - ยอดเริ่มต้น = hero field ด้านล่าง (รองมือ thumb)
//
// Why single page:
//   - เร็วกว่า wizard สำหรับ returning user
//   - preset = path of least resistance สำหรับ first-time user
(function () {
const W = window.MINT;

const card = {
  background: '#fff', borderRadius: 16,
  boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
};

function WIcon({ kind, size = 24, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'savings': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 11c0-2.8 2.7-5 6-5 1.4 0 2.6.4 3.6 1.1L17 6l-.5 2.6c.9.9 1.5 2.1 1.5 3.4 0 .9-.3 1.7-.7 2.5l.7 1.5h-2.5l-.6-.6c-.7.4-1.5.6-2.4.6h-1l-1 2h-2v-2H7c-1.1 0-2-.9-2-2v-2.5L3 12l1-2 1 1z" fill={color}/><circle cx="14" cy="10" r="0.9" fill={W.n800}/></svg>;
    case 'cash': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill={color}/><circle cx="12" cy="12" r="2.5" fill="none" stroke={W.n800} strokeWidth="1.4"/></svg>;
    case 'ewallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2.5" fill={color}/><rect x="9" y="6" width="6" height="7" rx="1" fill={W.n800} opacity="0.2"/></svg>;
    case 'qr': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" fill={color}/><rect x="14" y="3" width="7" height="7" fill={color}/><rect x="3" y="14" width="7" height="7" fill={color}/><rect x="14" y="14" width="3" height="3" fill={color}/><rect x="18" y="18" width="3" height="3" fill={color}/></svg>;
    case 'salary': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7z" fill={color}/><path d="M9 7V5a3 3 0 016 0v2" stroke={W.n800} strokeWidth="1.4" fill="none"/></svg>;
    case 'shop': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 9l1.5-4h13L20 9v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" fill={color}/><rect x="5" y="13" width="14" height="7" fill={color} opacity="0.7"/></svg>;
    case 'piggy': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'chev': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'plus': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    default: return null;
  }
}

// ─── Presets — "Smart starting points" ───
//   each preset bundles type + suggested name + icon + color
const PRESETS = [
  { k: 'kbank-savings', label: 'KBank ออมทรัพย์', icon: 'piggy', color: W.walletGreen, bg: W.walletGreen100, subtype: 'บัญชีออมทรัพย์' },
  { k: 'cash',          label: 'เงินสดในกระเป๋า',  icon: 'cash',  color: W.walletBrown, bg: W.walletBrown100, subtype: 'เงินสด' },
  { k: 'truemoney',     label: 'TrueMoney Wallet', icon: 'ewallet', color: W.walletViolet, bg: W.walletViolet100, subtype: 'e-Wallet' },
  { k: 'salary',        label: 'บัญชีเงินเดือน',   icon: 'salary', color: W.walletPink, bg: W.walletPink100, subtype: 'เงินเดือน' },
  { k: 'promptpay',     label: 'พร้อมเพย์',         icon: 'qr',    color: W.info400, bg: W.info200, subtype: 'PromptPay' },
  { k: 'shop',          label: 'รายได้เสริม',       icon: 'shop',  color: W.walletRed, bg: W.walletRed100, subtype: 'ขายของ' },
];

function CreateWalletB() {
  const [preset, setPreset] = React.useState(PRESETS[0]);
  const [name, setName] = React.useState(PRESETS[0].label);
  const [advanced, setAdvanced] = React.useState(false);
  const [useAi, setUseAi] = React.useState(false);

  const pick = (p) => { setPreset(p); setName(p.label); };

  return (
    <div style={{ background: W.n200, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />

      {/* Header */}
      <div style={{ background: '#fff', padding: '6px 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={W.n800} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: W.n900 }}>สร้างกระเป๋าใหม่</div>
        <div style={{ width: 32 }}/>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>

        {/* HERO LIVE PREVIEW — sticky feeling, big, gradient bg */}
        <div style={{
          padding: '20px 16px 0',
          background: `linear-gradient(180deg, ${preset.bg} 0%, ${W.n200} 100%)`,
        }}>
          <div style={{ fontSize: 11, color: '#6B6B78', textAlign: 'center', marginBottom: 8, fontWeight: 500, letterSpacing: 0.5 }}>
            กำลังสร้าง
          </div>
          <div style={{
            ...card, padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: preset.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s',
            }}>
              <WIcon kind={preset.icon} size={28} color={preset.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: W.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name || 'กระเป๋าใหม่'}
              </div>
              <div style={{ fontSize: 11, color: W.n400, marginTop: 2 }}>{preset.subtype}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: W.n900, marginTop: 8 }}>฿ 0.00</div>
            </div>
          </div>
        </div>

        {/* Preset chips — horizontal scroll, 1 row */}
        <div style={{ padding: '20px 0 0' }}>
          <div style={{ padding: '0 16px', fontSize: 13, fontWeight: 600, color: W.n900, marginBottom: 10 }}>
            เลือกแบบเร็ว
            <span style={{ fontSize: 11, color: '#6B6B78', fontWeight: 400, marginLeft: 6 }}>· แตะเพื่อเริ่ม</span>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 4px' }}>
            {PRESETS.map(p => {
              const active = preset.k === p.k;
              return (
                <div key={p.k} onClick={() => pick(p)} style={{
                  flexShrink: 0, padding: '10px 12px', borderRadius: 14,
                  background: active ? p.bg : '#fff',
                  border: active ? `1.5px solid ${p.color}` : `1px solid ${W.n300}`,
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  minWidth: 130,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: p.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <WIcon kind={p.icon} size={18} color={p.color} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: W.n900, lineHeight: 1.2 }}>
                    {p.label}
                  </div>
                </div>);
            })}
            {/* "อื่นๆ" tile */}
            <div style={{
              flexShrink: 0, padding: '10px 14px', borderRadius: 14,
              background: '#fff', border: `1px dashed ${W.n400}`,
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            }}>
              <WIcon kind="plus" size={14} color={W.n700}/>
              <div style={{ fontSize: 12, fontWeight: 600, color: W.n700 }}>อื่นๆ</div>
            </div>
          </div>
        </div>

        {/* Name field */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ ...card, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 4 }}>ชื่อกระเป๋า</div>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, color: W.n900, fontWeight: 600, fontFamily: 'inherit', background: 'transparent' }} />
          </div>
        </div>

        {/* Initial balance — hero numpad-style */}
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ ...card, padding: '18px 16px' }}>
            <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 4 }}>ยอดเริ่มต้น</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 14, color: W.n400, fontWeight: 600 }}>฿</span>
              <input defaultValue="0.00"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 28, fontWeight: 700, color: W.n900, fontFamily: 'inherit', background: 'transparent', letterSpacing: -0.5 }} />
              <span style={{ fontSize: 12, color: W.n400 }}>THB</span>
            </div>
          </div>
        </div>

        {/* Advanced toggle — collapse */}
        <div style={{ padding: '12px 16px 0' }}>
          <div onClick={() => setAdvanced(!advanced)} style={{
            ...card, padding: '12px 14px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: W.n800 }}>ปรับแต่งเพิ่มเติม</div>
              <div style={{ fontSize: 11, color: W.n400 }}>ไอคอน · สี · สกุลเงิน</div>
            </div>
            <div style={{ transform: advanced ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
              <WIcon kind="chev" size={16} color={W.n400} />
            </div>
          </div>
          {advanced && (
            <div style={{ ...card, padding: '14px 14px', marginTop: 8 }}>
              {/* color swatches */}
              <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 8 }}>สี</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {[W.walletGreen, W.walletViolet, W.walletPink, W.walletRed, W.walletBrown, W.primary400].map((c, i) => (
                  <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: c, cursor: 'pointer',
                    boxShadow: i === 0 ? `0 0 0 2px #fff, 0 0 0 3.5px ${c}` : 'none' }} />
                ))}
              </div>
              {/* currency */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: `1px solid ${W.n300}` }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: W.n200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🇹🇭</div>
                <div style={{ flex: 1, fontSize: 13, color: W.n800, fontWeight: 500 }}>THB — บาทไทย</div>
                <WIcon kind="chev" size={14} color={W.n400} />
              </div>
            </div>
          )}
        </div>

        {/* AI goal — opt-in card */}
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{
            ...card, padding: '14px 14px',
            border: useAi ? `1.5px solid ${W.walletViolet}` : '1.5px solid transparent',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${W.walletViolet}, ${W.primary400})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16,
              }}>✦</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: W.n900 }}>ให้ AI ช่วยตั้งเป้าหมาย</div>
                <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 1 }}>ไม่จำเป็น · ตั้งภายหลังก็ได้</div>
              </div>
              <div onClick={() => setUseAi(!useAi)} style={{
                width: 44, height: 26, borderRadius: 13, background: useAi ? W.primary400 : W.n300,
                position: 'relative', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{
                  position: 'absolute', top: 3, left: useAi ? 21 : 3,
                  width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}/>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34, padding: '12px 16px 0',
        background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
      }}>
        <button style={{
          width: '100%', height: 50, borderRadius: 14, border: 'none',
          background: W.primary400, color: '#fff', fontSize: 16, fontWeight: 700,
          fontFamily: 'inherit', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(56,178,172,0.32)',
        }}>สร้างกระเป๋า</button>
      </div>
    </div>);
}

window.CreateWalletB_Preset = CreateWalletB;
})();
