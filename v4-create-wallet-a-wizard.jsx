// Create Wallet — Design A · "Wizard 3-step"
//   Step 1: เลือกประเภทกระเป๋า   (visual tiles, 2-col grid)
//   Step 2: ตั้งชื่อ + ไอคอน + สี (live preview card บนสุด — เห็นผลทันที)
//   Step 3: ยอดเริ่มต้น + AI goal (optional, collapsed by default)
//
// Why wizard:
//   - old design ยัด 5 sections ในหน้าเดียว → cognitive overload, scroll ยาว
//   - แยก 3 ขั้น = focus ทีละเรื่อง → first-time user ทำเสร็จเร็วขึ้น
//   - AI goal เป็น optional ชัดเจน (อยู่ step สุดท้าย + label "ข้ามได้")
//
// Steps shown side-by-side as 3 artboards เพื่อ review ทั้ง flow ในจอเดียว.
(function () {
const W = window.MINT;

const card = {
  background: '#fff', borderRadius: 16,
  boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
};

// ─── Header (close + title + progress) ───
function Header({ step, total = 3, title, onBack }) {
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
      {/* progress bar */}
      <div style={{ height: 3, background: W.n300, borderRadius: 2, margin: '4px 16px 0' }}>
        <div style={{ width: `${(step / total) * 100}%`, height: '100%', background: W.primary400, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

// ─── Step intro: "Big question" ───
function StepIntro({ title, sub }) {
  return (
    <div style={{ padding: '18px 20px 8px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: W.n900, letterSpacing: -0.3, lineHeight: 1.3 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: '#6B6B78', marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

// ─── Wallet icons (inline svg) ───
function WIcon({ kind, size = 24, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'savings':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 11c0-2.8 2.7-5 6-5 1.4 0 2.6.4 3.6 1.1L17 6l-.5 2.6c.9.9 1.5 2.1 1.5 3.4 0 .9-.3 1.7-.7 2.5l.7 1.5h-2.5l-.6-.6c-.7.4-1.5.6-2.4.6h-1l-1 2h-2v-2H7c-1.1 0-2-.9-2-2v-2.5L3 12l1-2 1 1z" fill={color}/><circle cx="14" cy="10" r="0.9" fill={W.n800}/></svg>;
    case 'cash':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill={color}/><circle cx="12" cy="12" r="2.5" fill="none" stroke={W.n800} strokeWidth="1.4"/><circle cx="6" cy="12" r="0.8" fill={W.n800}/><circle cx="18" cy="12" r="0.8" fill={W.n800}/></svg>;
    case 'ewallet':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2.5" fill={color}/><rect x="9" y="17" width="6" height="1.6" rx="0.8" fill={W.n800} opacity="0.4"/><rect x="9" y="6" width="6" height="7" rx="1" fill={W.n800} opacity="0.2"/></svg>;
    case 'qr':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" fill={color}/><rect x="14" y="3" width="7" height="7" fill={color}/><rect x="3" y="14" width="7" height="7" fill={color}/><rect x="14" y="14" width="3" height="3" fill={color}/><rect x="18" y="18" width="3" height="3" fill={color}/></svg>;
    case 'salary':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7z" fill={color}/><path d="M9 7V5a3 3 0 016 0v2" stroke={W.n800} strokeWidth="1.4" fill="none"/></svg>;
    case 'shop':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 9l1.5-4h13L20 9v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" fill={color}/><rect x="5" y="13" width="14" height="7" fill={color} opacity="0.7"/></svg>;
    case 'other':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2" fill={color}/><circle cx="12" cy="12" r="2" fill={color}/><circle cx="18" cy="12" r="2" fill={color}/></svg>;
    case 'piggy':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}

// ─── Step 1 — Pick a wallet type (tiles) ───
const TYPES = [
  { k: 'savings',  label: 'บัญชีออมทรัพย์', desc: 'เงินฝากธนาคาร', bg: W.walletGreen100, ic: W.walletGreen },
  { k: 'cash',     label: 'เงินสด',         desc: 'เงินในกระเป๋า',  bg: W.walletBrown100, ic: W.walletBrown },
  { k: 'ewallet',  label: 'e-Wallet',       desc: 'TrueMoney, Rabbit', bg: W.walletViolet100, ic: W.walletViolet },
  { k: 'qr',       label: 'พร้อมเพย์',       desc: 'บัญชี PromptPay',  bg: W.info200,        ic: W.info400 },
  { k: 'salary',   label: 'บัญชีเงินเดือน',  desc: 'รับเงินเดือนเข้า', bg: W.walletPink100,  ic: W.walletPink },
  { k: 'shop',     label: 'บัญชีขายของ',    desc: 'ร้านค้า / freelance', bg: W.walletRed100, ic: W.walletRed },
];

function StepOne() {
  const [sel, setSel] = React.useState('savings');
  return (
    <div style={{ background: W.n200, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={1} title="สร้างกระเป๋าใหม่" />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="เริ่มจากเลือกประเภทกระเป๋า" sub="ช่วยให้ Mint จัดหมวด รายรับ–รายจ่ายให้ถูกต้อง" />
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {TYPES.map(t => {
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
                    <WIcon kind="check" size={11} />
                  </div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <WIcon kind={t.k} size={22} color={t.ic} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: W.n900 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 2, lineHeight: 1.3 }}>{t.desc}</div>
              </div>
            );
          })}
        </div>
        {/* "อื่นๆ" — text link, ไม่กิน slot ใน grid */}
        <div style={{ padding: '4px 20px', fontSize: 13, color: W.primary500, fontWeight: 600, cursor: 'pointer' }}>
          + ประเภทอื่นๆ
        </div>
      </div>
      <StickyCta label="ถัดไป" />
    </div>);
}

// ─── Step 2 — Customize: name, icon, color (with LIVE PREVIEW) ───
const COLORS = [
  { k: 'green',  c: W.walletGreen,  bg: W.walletGreen100 },
  { k: 'violet', c: W.walletViolet, bg: W.walletViolet100 },
  { k: 'pink',   c: W.walletPink,   bg: W.walletPink100 },
  { k: 'red',    c: W.walletRed,    bg: W.walletRed100 },
  { k: 'brown',  c: W.walletBrown,  bg: W.walletBrown100 },
  { k: 'teal',   c: W.primary400,   bg: W.primary100 },
];
const ICONS = ['piggy', 'salary', 'cash', 'ewallet', 'qr', 'shop', 'savings', 'other'];

function StepTwo() {
  const [name, setName] = React.useState('บัญชีออมทรัพย์ KBank');
  const [color, setColor] = React.useState(COLORS[0]);
  const [icon, setIcon] = React.useState('piggy');
  return (
    <div style={{ background: W.n200, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={2} title="สร้างกระเป๋าใหม่" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="ตั้งชื่อและเลือกหน้าตา" sub="ดูตัวอย่างด้านบนได้เลย — เปลี่ยนได้ภายหลัง" />

        {/* LIVE PREVIEW CARD — แสดงผลทันที */}
        <div style={{ padding: '8px 20px 16px' }}>
          <div style={{
            ...card, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14,
            background: `linear-gradient(135deg, ${color.bg} 0%, #fff 80%)`,
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: color.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WIcon kind={icon} size={28} color={color.c} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 2 }}>ตัวอย่าง</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: W.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name || 'ชื่อกระเป๋า'}
              </div>
              <div style={{ fontSize: 11, color: W.n400, marginTop: 2 }}>บัญชีออมทรัพย์</div>
            </div>
          </div>
        </div>

        {/* Name */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 12, color: '#6B6B78', marginBottom: 6, fontWeight: 500 }}>ชื่อกระเป๋า</div>
          <div style={{ ...card, padding: '12px 14px' }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="เช่น บัญชีรายจ่ายประจำวัน"
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, color: W.n900, fontFamily: 'inherit', background: 'transparent' }} />
          </div>
        </div>

        {/* Icon strip */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ fontSize: 12, color: '#6B6B78', marginBottom: 8, fontWeight: 500 }}>ไอคอน</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {ICONS.map(k => {
              const active = icon === k;
              return (
                <div key={k} onClick={() => setIcon(k)} style={{
                  flexShrink: 0, width: 48, height: 48, borderRadius: 12,
                  background: active ? color.bg : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: active ? `1.5px solid ${color.c}` : `1px solid ${W.n300}`,
                  cursor: 'pointer',
                }}>
                  <WIcon kind={k} size={22} color={active ? color.c : W.n400} />
                </div>);
            })}
            <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${W.n300}`, cursor: 'pointer', fontSize: 18, color: W.n400 }}>+</div>
          </div>
        </div>

        {/* Color swatches */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ fontSize: 12, color: '#6B6B78', marginBottom: 8, fontWeight: 500 }}>สี</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {COLORS.map(c => {
              const active = color.k === c.k;
              return (
                <div key={c.k} onClick={() => setColor(c)} style={{
                  width: 34, height: 34, borderRadius: 17, background: c.c, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? `0 0 0 3px #fff, 0 0 0 4.5px ${c.c}` : 'none',
                }}>
                  {active && <WIcon kind="check" size={16} />}
                </div>);
            })}
          </div>
        </div>

        {/* Currency — collapsed for less common edit */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ ...card, padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: W.n200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🇹🇭</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#6B6B78' }}>สกุลเงิน</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: W.n900 }}>THB — บาทไทย (฿)</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={W.n400} strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>
      <StickyCta label="ถัดไป" />
    </div>);
}

// ─── Step 3 — Initial balance + optional AI goal ───
function StepThree() {
  const [amt, setAmt] = React.useState('15,000');
  const [useAi, setUseAi] = React.useState(false);
  return (
    <div style={{ background: W.n200, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header step={3} title="สร้างกระเป๋าใหม่" onBack />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="ยอดเงินตอนนี้เท่าไร?" sub="ใส่ยอดคงเหลือปัจจุบัน — Mint จะใช้เริ่มต้นนับ" />

        {/* Big amount field — hero treatment, like add-transaction */}
        <div style={{ padding: '24px 20px 12px' }}>
          <div style={{ ...card, padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 6 }}>ยอดเริ่มต้น (บาท)</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, color: W.n400, fontWeight: 600 }}>฿</span>
              <input value={amt} onChange={e => setAmt(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 36, fontWeight: 700, color: W.n900,
                  textAlign: 'center', width: '70%', fontFamily: 'inherit', background: 'transparent', letterSpacing: -1 }} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {['0', '5,000', '10,000', '50,000'].map(p => (
                <div key={p} onClick={() => setAmt(p)} style={{
                  padding: '6px 12px', borderRadius: 16, background: W.n200,
                  fontSize: 12, color: W.n700, fontWeight: 500, cursor: 'pointer',
                }}>฿ {p}</div>
              ))}
            </div>
          </div>
        </div>

        {/* AI goal — opt-in card, clearly secondary */}
        <div style={{ padding: '20px 20px 0' }}>
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
                <div style={{ fontSize: 14, fontWeight: 600, color: W.n900 }}>ให้ AI ช่วยตั้งเป้าหมาย</div>
                <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 1 }}>ข้ามได้ — ตั้งภายหลังก็ได้</div>
              </div>
              {/* toggle */}
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
            {useAi && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${W.n300}` }}>
                <input placeholder="เช่น เก็บเงินไปเที่ยวญี่ปุ่น"
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: W.n900, fontFamily: 'inherit', background: 'transparent', padding: '4px 0' }} />
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['ติดตามรายจ่ายประจำวัน', 'ลดค่าใช้จ่ายไม่จำเป็น', 'แยกเงินครอบครัว'].map(s => (
                    <div key={s} style={{
                      padding: '6px 10px', borderRadius: 12, background: W.walletViolet100,
                      fontSize: 11, color: W.n700, cursor: 'pointer',
                    }}>+ {s}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <StickyCta label="สร้างกระเป๋า" />
    </div>);
}

// ─── Sticky CTA ───
function StickyCta({ label }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 34, padding: '12px 16px 0',
      background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
    }}>
      <button style={{
        width: '100%', height: 50, borderRadius: 14, border: 'none',
        background: W.primary400, color: '#fff', fontSize: 16, fontWeight: 700,
        fontFamily: 'inherit', cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(56,178,172,0.32)',
      }}>{label}</button>
    </div>
  );
}

// Export 3 step screens — render side-by-side in canvas
window.CreateWalletA_Step1 = StepOne;
window.CreateWalletA_Step2 = StepTwo;
window.CreateWalletA_Step3 = StepThree;
})();
