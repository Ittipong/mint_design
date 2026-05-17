// Melon Chat — AI assistant สำหรับเรื่องเงิน
//   ตามรูปต้นฉบับ: full-width chat (ไม่มี bubble avatar) · title "Melon Chat" ใหญ่
//   suggestion chips สีม่วงอ่อน · wallet selector chip · input + cam/gallery/mic
//   bottom nav 5 ปุ่ม โดยกลางคือ "Ai" (ไอคอน gradient + label สี info)
//
// 2 designs:
//   1) MelonChatInit   — เปิดมาครั้งแรก ยังไม่มี chat · greeting + suggested questions
//                        + shortcuts (บันทึกรายจ่าย/ดูงบ/สรุปเดือน)
//   2) MelonChatActive — ตามรูป screenshot · long AI message + recommendation
//                        + quick replies follow-up
(function () {
const MC = window.MINT;

// ─── Tokens เฉพาะ chat (เน้นอ่านง่าย) ───────────────────────────────
const INK = {
  body: '#1A1A1A',       // ตัวข้อความหลัก
  muted: '#6B6B78',      // hint/timestamp
  divider: '#ECECF1',
  chipBorder: '#D9D7FF', // ขอบ suggestion (lavender อ่อน)
  chipBg: '#FAF9FF',
  chipText: '#5E5BD8',   // text ใน suggestion (violet เข้ม อ่านง่ายบนขาว)
  walletChipBg: '#E8F4F2', // pastel teal ของ wallet selector
};

// ─── Header — "Melon Chat" + history + plus ─────────────────────────
function MelonHeader() {
  return (
    <div style={{
      padding: '6px 20px 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#fff',
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: INK.body, letterSpacing: -0.4 }}>
        Melon Chat
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* history (clock with back arrow) */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 12a9 9 0 109-9 9 9 0 00-6.5 2.8" stroke={INK.body} strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M3 4v4h4" stroke={INK.body} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7v5l3 2" stroke={INK.body} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        {/* plus (new chat) */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke={INK.body} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Wallet selector chip ──────────────────────────────────────────
function WalletChip({ label = 'เลือกกระเป๋า' }) {
  return (
    <div style={{
      alignSelf: 'flex-start',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: INK.walletChipBg,
      borderRadius: 999,
      padding: '7px 12px 7px 8px',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 12,
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="13" rx="2" stroke={MC.primary500} strokeWidth="1.8"/>
          <path d="M3 10h18" stroke={MC.primary500} strokeWidth="1.8"/>
        </svg>
      </div>
      <span style={{ fontSize: 13.5, color: INK.body, fontWeight: 500 }}>{label}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke={INK.body} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── Input bar + camera/gallery/mic ────────────────────────────────
function InputBar({ placeholder = 'ถามเรื่องเงิน หรือบันทึกรายจ่าย…' }) {
  return (
    <div style={{
      margin: '0 16px',
      background: '#fff',
      borderRadius: 22,
      padding: '14px 18px 12px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
      border: `1px solid ${INK.divider}`,
    }}>
      <div style={{ fontSize: 14.5, color: '#A8A6B4', padding: '2px 0 12px' }}>
        {placeholder}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* camera */}
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: MC.n200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 8h3l2-2h6l2 2h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke={MC.n700} strokeWidth="1.6" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="3.4" stroke={MC.n700} strokeWidth="1.6"/>
            </svg>
          </div>
          {/* gallery */}
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: MC.n200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke={MC.n700} strokeWidth="1.6"/>
              <circle cx="9" cy="10" r="1.5" stroke={MC.n700} strokeWidth="1.6"/>
              <path d="M5 17l4-4 4 4 3-3 3 3" stroke={MC.n700} strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        {/* mic */}
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          background: MC.n200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="3" width="6" height="11" rx="3" stroke={MC.n700} strokeWidth="1.8"/>
            <path d="M5 11a7 7 0 0014 0M12 18v3" stroke={MC.n700} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Design 1 — Init state: greeting + suggested questions + shortcuts
// ────────────────────────────────────────────────────────────────────
function MelonChatInit({ embedded = false } = {}) {
  // embedded=true → ซ่อน status bar + "Melon Chat" header (ใช้ใน RootPager)
  // Shortcut tiles อยู่บน — ลัด actions ที่ user ใช้บ่อย (ไม่เปิดเป็น chat)
  const shortcuts = [
    { icon: 'wallet',   label: 'บันทึก\nรายจ่าย',  bg: MC.walletGreen100, ic: MC.walletGreen },
    { icon: 'budget',   label: 'ดูงบ\nเดือนนี้',    bg: MC.walletViolet100, ic: MC.walletViolet },
    { icon: 'piggy',    label: 'สรุป\nเป้าหมาย',   bg: MC.walletPink100,  ic: MC.walletPink },
    { icon: 'card',     label: 'หนี้บัตร\nทั้งหมด', bg: MC.walletRed100,  ic: MC.walletRed },
  ];

  // Suggested prompts — 2 กลุ่ม กลุ่มละ 2 (compact, ไม่เกินขอบ)
  const groups = [
    {
      icon: '💡', title: 'ลองถาม Melon',
      prompts: [
        'เดือนนี้ใช้จ่ายอะไรเยอะสุด',
        'พอมีเงินซื้อ iPhone ใหม่ไหม',
      ],
    },
    {
      icon: '🧾', title: 'ลัดบันทึก',
      prompts: [
        'จ่ายค่ากาแฟ 120 บาท',
        'รับเงินเดือน 45,000',
      ],
    },
  ];

  return (
    <div style={{
      background: '#fff', height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'Sarabun, -apple-system, system-ui, sans-serif',
    }}>
      {!embedded && <MintStatusBarV2 time="10:13" />}
      {!embedded && <MelonHeader />}

      {/* Scrollable content — compact spacing to fit 844 viewport */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '4px 16px 0' }}>
        {/* Greeting hero — compact */}
        <div style={{ textAlign: 'center', padding: '6px 8px 12px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 10px',
            background: `linear-gradient(135deg, ${MC.walletGreen} 0%, ${MC.primary300} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(78,178,160,0.28)',
            fontSize: 26,
          }}>🍈</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: INK.body, marginBottom: 2 }}>
            สวัสดีครับ ผม Melon
          </div>
          <div style={{ fontSize: 12.5, color: INK.muted, lineHeight: 1.5 }}>
            ให้ผมช่วยดูเรื่องเงิน หรือบันทึกรายจ่าย ได้แค่พิมพ์ถาม
          </div>
        </div>

        {/* Shortcut tiles — 4 ปุ่มเรียงนอน */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
          {shortcuts.map((s, i) => (
            <div key={i} style={{
              background: '#fff',
              border: `1px solid ${INK.divider}`,
              borderRadius: 14,
              padding: '10px 6px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              cursor: 'pointer',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CatIcon kind={s.icon} containerSize={32} color={s.ic}/>
              </div>
              <div style={{
                fontSize: 10.5, fontWeight: 600, color: INK.body, textAlign: 'center',
                lineHeight: 1.25, whiteSpace: 'pre-line',
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Suggested prompt groups */}
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, fontWeight: 700, color: INK.muted, letterSpacing: 0.3,
              padding: '0 4px 6px',
            }}>
              <span style={{ fontSize: 13 }}>{g.icon}</span>
              <span>{g.title}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {g.prompts.map((p, pi) => (
                <div key={pi} style={{
                  background: INK.chipBg,
                  border: `1px solid ${INK.chipBorder}`,
                  borderRadius: 12,
                  padding: '9px 14px',
                  fontSize: 13, color: INK.chipText, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer',
                }}>
                  <span>{p}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M9 7h8v8" stroke={INK.chipText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: wallet chip + input + tabbar */}
      <div style={{ padding: '8px 20px 8px' }}>
        <WalletChip />
      </div>
      <div style={{ paddingBottom: 24 }}>
        <InputBar />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Design 2 — Active state: long AI response + quick replies (ตามรูป)
// ────────────────────────────────────────────────────────────────────
function MelonChatActive() {
  const quickReplies = [
    'เดือนนี้รายรับเท่าไหร่',
    'พอมีเงินปิด CardX เต็มไหม',
    'ช่วยดูหนี้ CardX เป็นบาทให้หน่อย',
  ];

  // Bullet list helper — receives JSX nodes so we can highlight inline parts
  const Bullets = ({ items }) => (
    <ul style={{
      listStyle: 'none', padding: 0, margin: '6px 0 0',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {items.map((it, i) => (
        <li key={i} style={{
          display: 'flex', gap: 10, fontSize: 14, color: INK.body, lineHeight: 1.55,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: 3, background: INK.body,
            marginTop: 9, flexShrink: 0,
          }}/>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{
      background: '#fff', height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'Sarabun, -apple-system, system-ui, sans-serif',
    }}>
      <MintStatusBarV2 time="10:13" />
      <MelonHeader />

      {/* Chat body (scrollable) — full-width text, no avatar bubbles */}
      <div style={{
        flex: 1, overflow: 'hidden',
        padding: '2px 18px 0',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* AI response (top section is cut off — implies scrollback) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: INK.body, lineHeight: 1.45 }}>
            Personal Loan มักจะดีกว่าถ้า:
          </div>
          <Bullets items={[
            'ได้ดอกเบี้ยต่ำกว่าบัตร (~12-15%)',
            'อยากจบเป็นก้อนเดียว ไม่ต้องทบทุกเดือน',
            'มีวินัยผ่อนตรงเวลา',
          ]}/>

          <div style={{ fontSize: 13.5, fontWeight: 700, color: INK.body, lineHeight: 1.45, marginTop: 4 }}>
            จ่ายขั้นต่ำก็พอได้ถ้า:
          </div>
          <Bullets items={[
            <>มีแผนจะปิดหมดภายใน <strong>2-3 เดือน</strong> (แล้วดอกเบี้ยจะน้อยมาก)</>,
            'หรือกำลังหาเงินก้อนมาโปะอยู่',
          ]}/>

          {/* divider */}
          <div style={{ height: 1, background: INK.divider, margin: '10px 0 4px' }}/>

          {/* Recommendation */}
          <div style={{ fontSize: 13.5, color: INK.body, lineHeight: 1.55 }}>
            <strong>แต่ทางที่ดีที่สุดสำหรับคุณตอนนี้:</strong> ยอด CardX แค่ 28,000 เยน
            {' '}(~6,700 บาท) — ถ้าสามารถหาเงินก้อนมาจ่ายเต็มได้
            {' '}<strong>นี่คือทางที่ถูกสุด = ดอกเบี้ย 0%</strong> 🎯
          </div>

          {/* Follow-up question */}
          <div style={{ fontSize: 13.5, color: INK.body, lineHeight: 1.55, marginTop: 2 }}>
            มีเงินเก็บพอปิดล้มทั้งยอดได้ไหมครับ? หรืออยากให้ช่วยดูรายรับเดือนนี้ว่าพอจ่ายเต็มไหวไหม? 💪
          </div>

          {/* Quick reply chips — เรียงตั้ง 3 ใบ */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            alignItems: 'flex-start', marginTop: 6,
          }}>
            {quickReplies.map((q, i) => (
              <div key={i} style={{
                padding: '7px 14px',
                borderRadius: 999,
                background: INK.chipBg,
                border: `1px solid ${INK.chipBorder}`,
                color: INK.chipText,
                fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer',
              }}>{q}</div>
            ))}
          </div>

          {/* timestamp */}
          <div style={{
            fontSize: 11, color: '#B5B3C0', textAlign: 'right',
            padding: '6px 4px 0',
          }}>10:11</div>
        </div>
      </div>

      {/* Wallet selector chip — sits above input */}
      <div style={{ padding: '8px 20px 8px' }}>
        <WalletChip />
      </div>

      {/* Input bar */}
      <div style={{ paddingBottom: 24 }}>
        <InputBar />
      </div>
    </div>
  );
}

window.MelonChatInit = MelonChatInit;
window.MelonChatActive = MelonChatActive;
})();
