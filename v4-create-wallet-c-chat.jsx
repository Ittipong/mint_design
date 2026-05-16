// Create Wallet — Design C · "Conversational Setup"
//   AI ถามทีละขั้น แบบบทสนทนา — user ตอบด้วย chips (เร็ว) หรือพิมพ์
//   - friendly tone — ลด "ฟอร์มกรอกเอกสาร" feel
//   - quick reply chips ทำให้ไม่ต้องพิมพ์
//   - summary card ก่อนจบ → confirm ก่อนสร้าง
//   - AI goal สอดอยู่ใน flow ธรรมชาติ (AI ถาม "อยากตั้งเป้าหมายไหม") — ไม่กิน slot
//
// Why conversational:
//   - first-time user รู้สึกว่า "มี AI คอยช่วย" → match กับ brand "Mint AI"
//   - แบ่ง decision ทีละจุด — ไม่ overwhelm
//   - Trade-off: ช้ากว่า preset สำหรับ power user → ควรมีปุ่ม "skip to form" ใน production
(function () {
const W = window.MINT;

const cardSh = '0 1px 2px rgba(0,0,0,0.04)';

function WIcon({ kind, size = 24, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'savings': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 11c0-2.8 2.7-5 6-5 1.4 0 2.6.4 3.6 1.1L17 6l-.5 2.6c.9.9 1.5 2.1 1.5 3.4 0 .9-.3 1.7-.7 2.5l.7 1.5h-2.5l-.6-.6c-.7.4-1.5.6-2.4.6h-1l-1 2h-2v-2H7c-1.1 0-2-.9-2-2v-2.5L3 12l1-2 1 1z" fill={color}/></svg>;
    case 'cash': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill={color}/></svg>;
    case 'ewallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2.5" fill={color}/></svg>;
    case 'qr': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" fill={color}/><rect x="14" y="3" width="7" height="7" fill={color}/><rect x="3" y="14" width="7" height="7" fill={color}/></svg>;
    case 'salary': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7z" fill={color}/></svg>;
    case 'shop': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 9l1.5-4h13L20 9v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" fill={color}/></svg>;
    case 'piggy': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}

// ─── Chat primitives ───
function AiBubble({ children }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `linear-gradient(135deg, ${W.walletViolet}, ${W.primary400})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13,
      }}>✦</div>
      <div style={{
        background: '#fff', padding: '10px 14px',
        borderRadius: '16px 16px 16px 4px', maxWidth: '78%',
        fontSize: 13.5, color: W.n900, lineHeight: 1.5, boxShadow: cardSh,
      }}>{children}</div>
    </div>);
}

function UserBubble({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        background: W.primary400, color: '#fff', padding: '10px 14px',
        borderRadius: '16px 16px 4px 16px', maxWidth: '78%',
        fontSize: 13.5, lineHeight: 1.5, fontWeight: 500,
        boxShadow: '0 2px 6px rgba(56,178,172,0.25)',
      }}>{children}</div>
    </div>);
}

function ChipRow({ chips }) {
  return (
    <div style={{ marginLeft: 36, display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: -4 }}>
      {chips.map((c, i) => (
        <div key={i} style={{
          padding: '8px 12px', borderRadius: 16, background: '#fff',
          fontSize: 12.5, color: W.primary500, fontWeight: 600,
          border: `1px solid ${W.primary200}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {c.icon && (
            <div style={{ width: 18, height: 18, borderRadius: 4, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WIcon kind={c.icon} size={11} color={c.ic} />
            </div>
          )}
          {c.label}
        </div>
      ))}
    </div>
  );
}

function CreateWalletC() {
  return (
    <div style={{ background: W.n200, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />

      {/* Header — Mint AI feel */}
      <div style={{
        padding: '4px 16px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', borderBottom: `1px solid ${W.n300}`,
      }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={W.n800} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: `linear-gradient(135deg, ${W.walletViolet} 0%, ${W.primary400} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 18,
          boxShadow: '0 2px 8px rgba(148,154,235,0.35)',
        }}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: W.n900 }}>สร้างกระเป๋าใหม่</div>
          <div style={{ fontSize: 11, color: W.primary500, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: W.primary400, display: 'inline-block' }}/>
            Mint AI ช่วยคุณตั้งค่า
          </div>
        </div>
        {/* skip-to-form escape */}
        <div style={{
          padding: '5px 10px', borderRadius: 10, background: W.n200,
          fontSize: 11, color: W.n700, fontWeight: 600, cursor: 'pointer',
        }}>ข้าม</div>
      </div>

      {/* Chat scroll */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ textAlign: 'center', fontSize: 11, color: W.n400, marginBottom: -2 }}>วันนี้ · 12:03</div>

        {/* Q1: type */}
        <AiBubble>
          สวัสดีครับ 👋<br/>
          อยากสร้างกระเป๋าแบบไหนดี?
        </AiBubble>
        <ChipRow chips={[
          { label: 'ออมทรัพย์', icon: 'piggy',   bg: W.walletGreen100, ic: W.walletGreen },
          { label: 'เงินสด',    icon: 'cash',    bg: W.walletBrown100, ic: W.walletBrown },
          { label: 'e-Wallet',  icon: 'ewallet', bg: W.walletViolet100, ic: W.walletViolet },
          { label: 'เงินเดือน',  icon: 'salary',  bg: W.walletPink100,  ic: W.walletPink },
          { label: 'อื่นๆ' },
        ]}/>

        <UserBubble>ออมทรัพย์</UserBubble>

        {/* Q2: name */}
        <AiBubble>
          ดีครับ 👍 ตั้งชื่อกระเป๋าเลยครับ
          <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 4 }}>หรือเลือกจากที่แนะนำด้านล่าง</div>
        </AiBubble>
        <ChipRow chips={[
          { label: 'KBank ออมทรัพย์' },
          { label: 'SCB ออมทรัพย์' },
          { label: 'กรุงไทย ออมทรัพย์' },
          { label: 'เงินเก็บ' },
        ]}/>

        <UserBubble>KBank ออมทรัพย์</UserBubble>

        {/* Q3: balance */}
        <AiBubble>
          เยี่ยม! ตอนนี้มีเงินในบัญชีเท่าไรครับ?
          <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 4 }}>Mint จะใช้เป็นยอดเริ่มต้น</div>
        </AiBubble>
        <ChipRow chips={[
          { label: '฿ 0' },
          { label: '฿ 10,000' },
          { label: '฿ 50,000' },
          { label: 'พิมพ์เอง' },
        ]}/>

        <UserBubble>฿ 15,000</UserBubble>

        {/* Q4: AI goal */}
        <AiBubble>
          เกือบเสร็จแล้วครับ ✨<br/>
          อยากให้ Mint AI ช่วยตั้ง <strong>เป้าหมาย</strong> สำหรับกระเป๋านี้ไหม?
          <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 4 }}>ข้ามได้ — ตั้งภายหลังเสมอ</div>
        </AiBubble>
        <ChipRow chips={[
          { label: '🎯 ติดตามรายจ่ายประจำวัน' },
          { label: '💰 จัดการเงินเดือนให้พอ' },
          { label: '✂️ ลดค่าใช้จ่ายไม่จำเป็น' },
          { label: 'ข้ามไปก่อน' },
        ]}/>

        {/* SUMMARY CARD before final create */}
        <AiBubble>
          พร้อมแล้วครับ! ตรวจสอบข้อมูลก่อนสร้าง 👇
        </AiBubble>
        <div style={{ marginLeft: 36, marginRight: 8 }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '14px 14px',
            boxShadow: cardSh, display: 'flex', flexDirection: 'column', gap: 10,
            border: `1px solid ${W.primary200}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: W.walletGreen100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WIcon kind="piggy" size={24} color={W.walletGreen} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>KBank ออมทรัพย์</div>
                <div style={{ fontSize: 11, color: W.n400 }}>บัญชีออมทรัพย์</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: W.n900 }}>฿ 15,000</div>
            </div>
            {/* edit hints */}
            <div style={{ display: 'flex', gap: 6, paddingTop: 8, borderTop: `1px solid ${W.n300}` }}>
              <div style={{ flex: 1, fontSize: 11, color: W.primary500, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>
                เปลี่ยนชื่อ
              </div>
              <div style={{ width: 1, background: W.n300 }}/>
              <div style={{ flex: 1, fontSize: 11, color: W.primary500, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>
                เปลี่ยนสี
              </div>
              <div style={{ width: 1, background: W.n300 }}/>
              <div style={{ flex: 1, fontSize: 11, color: W.primary500, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>
                เปลี่ยนยอด
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky create button */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34, padding: '12px 16px 0',
        background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
      }}>
        <button style={{
          width: '100%', height: 50, borderRadius: 14, border: 'none',
          background: W.primary400, color: '#fff', fontSize: 16, fontWeight: 700,
          fontFamily: 'inherit', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(56,178,172,0.32)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <WIcon kind="check" size={20} />
          สร้างกระเป๋า
        </button>
      </div>
    </div>);
}

window.CreateWalletC_Chat = CreateWalletC;
})();
