// Create Hub — Step 0 of the unified create flow
//   จุดเข้าเดียวก่อนเข้า flow สร้างทั้ง 4 ประเภท:
//   กระเป๋า/บัญชี · บัตรเครดิต · เป้าหมายออม · งบประมาณ
//
// Why a shared Step 0:
//   - ทั้ง 4 flow เป็น wizard ภาษาเดียวกัน (v4 family) — user ควรเข้า
//     จากจุดเดียว แล้วไหลต่อเข้า wizard ของประเภทนั้นด้วย chrome เดิม
//   - Step 0 ไม่มี progress bar เพราะจำนวน step ต่างกัน (4 หรือ 5)
//     ขึ้นกับประเภทที่เลือก — progress เริ่มนับเมื่อเข้า wizard แล้ว
//   - FLOW PREVIEW card ล่าง grid โชว์ว่าเลือกแล้วจะเจอกี่ขั้น อะไรบ้าง
//     → ลดความกลัว form ยาว + ยืนยันว่าเป็น flow เดียวกันทุกประเภท
//
// Visual language mirrors v4-create-wallet-a-wizard.jsx (tiles, StepIntro,
// StickyCta, INK palette) — Step 0 อ่านเป็น "หน้าแรกของ wizard เดียวกัน"
(function () {
const W = window.MINT;

// INK palette — mirrors v4-create-wallet-a-wizard.jsx so hub feels like part
// of the same family. WCAG AA on white at body sizes.
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

// ─── Header — wizard chrome minus progress (Step 0 has no step count) ───
function HubHeader({ title }) {
  return (
    <div style={{ background: '#fff', paddingBottom: 12 }}>
      <div style={{ padding: '6px 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={W.n800} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: W.n900 }}>{title}</div>
        {/* right spacer balances close button so title stays centered */}
        <div style={{ width: 32 }} />
      </div>
    </div>
  );
}

// ─── Step intro: "Big question" ───
function StepIntro({ title, sub }) {
  return (
    <div style={{ padding: '18px 20px 8px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: W.n900, letterSpacing: -0.3, lineHeight: 1.3 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: INK.muted, marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

// ─── Icons (subset of wizard WIcon — only kinds the hub needs) ───
function HIcon({ kind, size = 24, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'wallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" fill={color}/><circle cx="17" cy="13" r="1.4" fill={W.n800}/></svg>;
    case 'card': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2.5" fill={color}/><rect x="2" y="10" width="20" height="2.5" fill={W.n800} opacity="0.5"/></svg>;
    case 'piggy': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'pie': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={color}/><path d="M12 3v9l8 3a9 9 0 00-8-12z" fill={W.n800} opacity="0.35"/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}

// ─── Sticky CTA — identical to wizard steps ───
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

// ─── 4 create entities — colors match each entity's detail/wizard palette ───
// steps = ป้าย step ของ wizard ปลายทาง (ตรงกับ artboard labels ใน canvas)
const ENTITIES = [
  {
    k: 'wallet', label: 'กระเป๋า / บัญชี', desc: 'เงินสด · ธนาคาร · e-Wallet',
    icon: 'wallet', bg: W.walletGreen100, ic: W.walletGreen,
    steps: ['เลือกประเภทกระเป๋า', 'ตั้งชื่อ + ไอคอน + สี', 'ยอดเริ่มต้น + สกุลเงิน', 'เป้าหมาย AI'],
  },
  {
    k: 'credit', label: 'บัตรเครดิต', desc: 'วงเงิน · รอบบิล · วันชำระ',
    icon: 'card', bg: W.walletViolet100, ic: W.walletViolet,
    steps: ['เลือกธนาคาร', 'ตั้งชื่อ + เลข 4 หลัก', 'วงเงิน + รอบบิล', 'เป้าหมาย AI'],
  },
  {
    k: 'goal', label: 'เป้าหมายออม', desc: 'ออมเพื่อเป้าหมาย มีกำหนดเวลา',
    icon: 'piggy', bg: W.walletPink100, ic: W.walletPink,
    steps: ['เลือกประเภทเป้าหมาย', 'ตั้งชื่อ + ไอคอน + สี', 'ยอด + วันที่ตั้งเป้า', 'เหตุผล AI'],
  },
  {
    k: 'budget', label: 'งบประมาณ', desc: 'คุมรายจ่ายตามหมวดหมู่',
    icon: 'pie', bg: '#FCEFD9', ic: W.warning400,
    steps: ['เลือกประเภทงบ', 'ตั้งชื่อ + ไอคอน + สี', 'ยอด + ช่วงเวลา', 'กระเป๋า + หมวดหมู่', 'เป้าหมาย AI'],
  },
];

// ─── Flow preview — proves "same flow, same UI" before user commits ───
// Segment bar on top mirrors the wizard progress bar (all unstarted) so the
// user recognises the exact chrome they are about to enter.
function FlowPreview({ ent }) {
  return (
    <div style={{ ...card, margin: '4px 16px 12px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, letterSpacing: -0.1 }}>ขั้นตอนถัดไป</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted }}>· {ent.steps.length} ขั้นตอน</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: INK.faint }}>~1 นาที</div>
      </div>
      {/* progress segments — same motif as wizard header, not started yet */}
      <div style={{ display: 'flex', gap: 4, margin: '0 16px 12px' }}>
        {ent.steps.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: W.n300 }} />
        ))}
      </div>
      {ent.steps.map((st, i) => (
        <div key={st} style={{
          padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
          borderTop: `1px solid ${INK.hairline}`,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 12, background: ent.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontSize: 11, fontWeight: 700, color: ent.ic,
          }}>{i + 1}</div>
          <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500, color: W.n800 }}>{st}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Hub screen (Step 0) ───
function CreateHub({ initial = 'wallet' }) {
  const [sel, setSel] = React.useState(initial);
  const ent = ENTITIES.find(e => e.k === sel);
  return (
    <div style={{ background: W.n200, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <HubHeader title="สร้างใหม่" />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <StepIntro title="วันนี้อยากสร้างอะไร?" sub="ทุกแบบใช้ขั้นตอนเดียวกัน — เลือกแล้วดูขั้นตอนได้ก่อนเริ่ม" />
        <div style={{ padding: '16px 16px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ENTITIES.map(t => {
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
                    <HIcon kind="check" size={11} />
                  </div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <HIcon kind={t.icon} size={22} color={t.ic} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: W.n900 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: INK.muted, marginTop: 2, lineHeight: 1.3 }}>{t.desc}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: INK.faint, marginTop: 8 }}>
                  {t.steps.length} ขั้นตอน
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '0 20px 8px' }}>
          <Eyebrow>ตัวอย่างขั้นตอน</Eyebrow>
        </div>
        <FlowPreview ent={ent} />
      </div>
      <StickyCta label="ถัดไป" />
    </div>
  );
}

// Export 2 states — default (wallet, 4 steps) vs budget (5 steps) to show the
// flow preview adapting per entity.
window.CreateHub_Default = () => <CreateHub initial="wallet" />;
window.CreateHub_Budget  = () => <CreateHub initial="budget" />;
})();
