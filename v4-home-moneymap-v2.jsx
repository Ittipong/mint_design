// Home V3 — Money Map + AI Brief · v2 (improvements applied)
// Changes from v1:
//   #1 AI Brief พูด "insight/recommendation" ไม่ทวนตัวเลขที่ Money Map มี
//   #2 ลด sections บน home เหลือ 2 ที่ urgent ที่สุด + ลิ้งค์ "ดูทั้งหมด"
//   #3 AI Brief มีปุ่ม refresh + timestamp
//   #4 Empty state สำหรับ user ใหม่ (artboard แยก)
const HM2 = window.MINT;

const hm2Card = (elev = 1) => ({
  background: '#fff', borderRadius: 16,
  boxShadow: elev === 2 ?
    '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.05)' :
    '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)'
});

function HM2SectionShell({ title, summary, children }) {
  return (
    <div style={{ margin: '0 16px 12px', ...hm2Card(1), padding: '14px 16px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: HM2.n900 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: HM2.n400, fontVariantNumeric: 'tabular-nums' }}>{summary}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={HM2.n400} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {children}
    </div>
  );
}

function HM2MiniBar({ pct, color }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div style={{ height: 5, borderRadius: 3, background: HM2.n300, overflow: 'hidden' }}>
      <div style={{ width: `${clamped}%`, height: '100%', background: color || HM2.primary500, borderRadius: 3 }} />
    </div>
  );
}

// ─── "รายการที่ต้องจ่าย" Section ──────────────────────────────────
// รวม: (1) credit billing รอบเดือน — มี status ก่อนกำหนด/ใกล้กำหนด/เกินกำหนด
//      (2) recurring transaction — มี confirm pay button
function PayDueSection() {
  // Status logic from daysUntilDue
  const statusOf = (days) => {
    if (days < 0) return { label: `เกิน ${Math.abs(days)} วัน`, color: HM2.error400, bg: HM2.error100, urgent: true };
    if (days <= 3) return { label: `อีก ${days} วัน`, color: HM2.warning400, bg: '#FFF4DC', urgent: true };
    if (days <= 7) return { label: `อีก ${days} วัน`, color: HM2.n700, bg: HM2.n200, urgent: false };
    return { label: `อีก ${days} วัน`, color: HM2.n400, bg: HM2.n200, urgent: false };
  };

  // Item types
  const items = [
    // Credit card billings
    { type: 'credit', icon: 'card', bg: HM2.walletGreen100, ic: HM2.walletGreen, name: 'KTC Visa', sub: 'รอบบิล 5–14 พ.ค.', amount: 4200, daysUntilDue: -1, dueDate: '13 พ.ค.' },
    { type: 'credit', icon: 'card', bg: HM2.walletViolet100, ic: HM2.walletViolet, name: 'KBank Credit', sub: 'รอบบิล 11–10 พ.ค.', amount: 18000, daysUntilDue: 3, dueDate: '17 พ.ค.' },
    // Recurring
    { type: 'recurring', icon: 'movie', bg: HM2.walletPink100, ic: HM2.walletPink, name: 'Netflix', sub: 'รายเดือน', amount: 419, daysUntilDue: 2, dueDate: '16 พ.ค.' },
    { type: 'recurring', icon: 'home', bg: HM2.walletBrown100, ic: HM2.walletBrown, name: 'ค่าเช่าห้อง', sub: 'รายเดือน', amount: 8500, daysUntilDue: 7, dueDate: '21 พ.ค.' },
  ];

  // Sort: overdue → urgent → soon
  items.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  const shown = items.slice(0, 3);
  const overdueCount = items.filter(x => x.daysUntilDue < 0).length;
  const urgentCount = items.filter(x => x.daysUntilDue >= 0 && x.daysUntilDue <= 3).length;

  // Top-right summary
  let summary;
  if (overdueCount > 0) summary = <span style={{ color: HM2.error400 }}>เกินกำหนด {overdueCount}</span>;
  else if (urgentCount > 0) summary = <span style={{ color: HM2.warning400 }}>ใกล้กำหนด {urgentCount}</span>;
  else summary = <span>ทั้งหมด {items.length}</span>;

  return (
    <div style={{ margin: '0 16px 12px', ...hm2Card(1), padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: HM2.n900 }}>รายการที่ต้องจ่าย · {items.length}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: HM2.n400 }}>{summary}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={HM2.n400} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {shown.map((item, i) => {
        const st = statusOf(item.daysUntilDue);
        const isRecurring = item.type === 'recurring';
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 0',
            borderTop: i === 0 ? 'none' : `1px solid ${HM2.n200}`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: item.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              position: 'relative',
            }}>
              <CatIcon kind={item.icon} size={16} color={item.ic} />
              {isRecurring && (
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 14, height: 14, borderRadius: 7, background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  fontSize: 9,
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"
                      stroke={HM2.n600} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: HM2.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  color: st.color, background: st.bg,
                  padding: '2px 7px', borderRadius: 8,
                  whiteSpace: 'nowrap',
                  letterSpacing: 0.2,
                }}>{st.label}</div>
              </div>
              <div style={{ fontSize: 10.5, color: HM2.n400, marginTop: 2 }}>
                {item.sub} · {item.dueDate}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: HM2.n900, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {item.amount.toLocaleString()}
              </div>
              {isRecurring ? (
                <button style={{
                  background: HM2.primary100, color: HM2.primary600, border: 'none',
                  borderRadius: 14, padding: '4px 10px', fontSize: 10, fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}>
                  <svg width="9" height="9" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke={HM2.primary600} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ยืนยันจ่าย
                </button>
              ) : (
                <button style={{
                  background: st.urgent ? HM2.primary400 : HM2.n200,
                  color: st.urgent ? '#fff' : HM2.n700,
                  border: 'none',
                  borderRadius: 14, padding: '4px 10px', fontSize: 10, fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer',
                  boxShadow: st.urgent ? '0 2px 4px rgba(56,178,172,0.3)' : 'none',
                }}>
                  จ่ายบัตร
                </button>
              )}
            </div>
          </div>
        );
      })}

      {items.length > shown.length && (
        <div style={{
          marginTop: 6, paddingTop: 8, borderTop: `1px solid ${HM2.n200}`,
          fontSize: 11, color: HM2.primary500, fontWeight: 600, textAlign: 'center',
          cursor: 'pointer',
        }}>
          ดูอีก {items.length - shown.length} รายการ ›
        </div>
      )}
    </div>
  );
}


// ─── Parse "**bold**" markdown — LLM-friendly format
//     LLM ส่งกลับเป็น string ธรรมดา ใช้ ** ครอบคำที่ต้องการเน้น
//     ไม่ต้องมี color/JSX → maintainable + ปลอดภัย
function parseEmphasis(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <b key={i} style={{ fontWeight: 700, color: HM2.n900 }}>{part.slice(2, -2)}</b>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ─── AI Brief Card — design จาก HomeV3 (centered lightbulb) + refresh + timestamp ──
function AIBriefCardV2({ insights, idx, setIdx, lastUpdate = '5 นาทีที่แล้ว' }) {
  const ins = insights[idx];
  const [refreshing, setRefreshing] = React.useState(false);
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      if (insights && setIdx) setIdx((idx + 1) % insights.length);
      setRefreshing(false);
    }, 600);
  };

  return (
    <div style={{ margin: '0 16px 14px' }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '28px 24px 22px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative',
      }}>
        {/* subtle gradient ring top-left (จาก HomeV3) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 80,
          background: `radial-gradient(ellipse at top left, ${HM2.walletPink100} 0%, transparent 60%)`,
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          pointerEvents: 'none', opacity: 0.6,
        }}/>

        {/* Refresh button — corner */}
        <button
          onClick={handleRefresh}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'transform 0.6s',
            transform: refreshing ? 'rotate(360deg)' : 'rotate(0deg)',
          }}
          title="สร้างคำแนะนำใหม่"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"
              stroke={HM2.n600} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Lightbulb */}
        <div style={{ fontSize: 48, marginTop: 28, marginBottom: 16, lineHeight: 1 }}>💡</div>

        {/* Headline — centered */}
        <div style={{
          fontSize: 15, color: HM2.n600, textAlign: 'center',
          lineHeight: 1.5, fontWeight: 500, padding: '0 6px',
          maxWidth: 300,
          opacity: refreshing ? 0.4 : 1, transition: 'opacity 0.3s',
        }}>
          {parseEmphasis(ins.headline)}
        </div>
        <div style={{
          fontSize: 12, color: HM2.n600, textAlign: 'center',
          lineHeight: 1.5, marginTop: 8, padding: '0 6px',
          maxWidth: 300,
          opacity: refreshing ? 0.4 : 1, transition: 'opacity 0.3s',
        }}>
          {parseEmphasis(ins.detail)}
        </div>

        {/* Action chips — centered */}
        <div style={{
          marginTop: 18, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap',
          width: '100%',
          opacity: refreshing ? 0.4 : 1, transition: 'opacity 0.3s',
        }}>
          <div style={{
            background: HM2.primary400, color: '#fff',
            padding: '8px 14px', borderRadius: 20,
            fontSize: 12, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            boxShadow: '0 2px 6px rgba(56,178,172,0.3)',
            cursor: 'pointer',
          }}>
            <span>{ins.cta || 'ถามต่อ'}</span>
            <svg width="11" height="11" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
          </div>
          {ins.chips.map((c, i) => (
            <div key={i} style={{
              background: '#fff', color: HM2.n700,
              padding: '8px 14px', borderRadius: 20,
              fontSize: 12, fontWeight: 500,
              border: `1px solid ${HM2.n300}`,
              cursor: 'pointer',
            }}>{c}</div>
          ))}
        </div>

        {/* Timestamp — subtle bottom */}
        <div style={{
          marginTop: 16, fontSize: 10, color: HM2.n400, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 3, background: HM2.primary400 }} />
          <span>มิ้นท์ · อัปเดต {lastUpdate}</span>
        </div>
      </div>

      {insights && insights.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {insights.map((_, i) => (
            <div key={i} onClick={() => setIdx && setIdx(i)} style={{
              width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
              background: i === idx ? HM2.primary400 : HM2.n300,
              transition: 'all 0.2s', cursor: 'pointer',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main: HomeV3_MoneyMapV2 ───────────────────────────────────
function HomeV3_MoneyMapV2() {
  const data = window.MM || { accounts: [], credits: [], goals: [], budgets: [], savedThisMonth: 0, daysInMonth: 31, daysLeft: 12 };
  const creditUsed = data.credits.reduce((s, c) => s + c.used, 0);
  const creditLimit = data.credits.reduce((s, c) => s + c.limit, 0);

  // #1 RECOMMENDATION-focused insights — ไม่ทวนตัวเลขที่ Map มีอยู่แล้ว
  // LLM-friendly format: plain string with **bold** markers (ไม่ใช้ JSX + inline color)
  //   → backend ส่งกลับเป็น JSON: { headline, detail, cta, chips } ได้ทันที
  const [insightIdx, setInsightIdx] = React.useState(0);
  const insights = [
    {
      headline: 'บัตร **KTC** มียอดในบัญชีพอจ่ายเต็มค่ะ — **จ่ายเลยจะคุ้มดอกเบี้ย** 💡',
      detail: 'ดอกเบี้ยบัตรเครดิตอยู่ที่ 16%/ปี · ถ้าจ่ายเต็มตอนนี้ประหยัดได้ **~฿56/เดือน**',
      cta: 'จ่ายเต็มเลย',
      chips: ['เลื่อนเตือน', 'ขอคำแนะนำเพิ่ม'],
    },
    {
      headline: 'เดือนนี้คุณ **ออมเกินแผน** — รักษาจังหวะนี้ **เที่ยวญี่ปุ่นถึงก่อนกำหนด 1 เดือน** ✨',
      detail: 'ลองตั้ง **โอนออมอัตโนมัติเดือนละ ฿2,000** จะถึงเป้าเร็วขึ้นอีก 6 สัปดาห์',
      cta: 'ตั้งโอนอัตโนมัติ',
      chips: ['ดูแผนเต็ม', 'ขอตัวเลือกอื่น'],
    },
    {
      headline: '**งบกาแฟ+ขนม** เหลือเยอะกว่าค่าเฉลี่ย — **ลดงบ?** ☕',
      detail: 'ใช้ไปแค่ 26% ของงบ ฿4,000 · ลดเหลือ ฿2,500 จะมีเงินออมเพิ่ม **฿1,500/เดือน**',
      cta: 'ปรับงบใหม่',
      chips: ['คงงบเดิม', 'ทำไมเหลือเยอะ?'],
    },
  ];

  return (
    <div style={{ background: HM2.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="08:23" />

      {/* Greeting header */}
      <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: HM2.n400, letterSpacing: 0.2 }}>พุธ · 14 พ.ค. · เช้านี้ ☀</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: HM2.n900, marginTop: 2, letterSpacing: -0.3 }}>สวัสดี, ภูมิ</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#fff', padding: '6px 10px', borderRadius: 16,
            fontSize: 11, fontWeight: 700, color: HM2.warning400,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>🔥 7 วัน</div>
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 17V11a6 6 0 0112 0v6l1.5 2H4.5L6 17z" stroke={HM2.n700} strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M10 21h4" stroke={HM2.n700} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: -1, right: -1, width: 7, height: 7, borderRadius: 4, background: HM2.error400, border: '1.5px solid #fff' }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>

        {/* #3 AI BRIEF V2 — with refresh + timestamp */}
        <AIBriefCardV2 insights={insights} idx={insightIdx} setIdx={setInsightIdx} lastUpdate="5 นาทีที่แล้ว" />

        {/* รายการที่ต้องจ่าย — credit billing + recurring subscriptions */}
        <PayDueSection />

        {/* #2 MONEY MAP — only 2 urgent sections (credit + goals) */}

        {/* บัตรเครดิต — ใกล้ครบกำหนด เป็น urgent action */}
        <HM2SectionShell title="บัตรเครดิต · 3 ใบ" summary={`ครบกำหนด 4 วัน`}>
          {data.credits.slice(0, 2).map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${HM2.n200}` }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CatIcon kind="card" size={16} color={c.ic} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: HM2.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div style={{
                  fontSize: 10.5,
                  color: c.daysUntilDue <= 5 ? HM2.warning400 : HM2.n400,
                  fontWeight: c.daysUntilDue <= 5 ? 600 : 400,
                }}>
                  {c.daysUntilDue <= 5 ? '⚑ ' : ''}ครบ {c.dueDate} · อีก {c.daysUntilDue} วัน
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: HM2.n900, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {c.statement.toLocaleString()}
              </div>
            </div>
          ))}
          {data.credits.length > 2 && (
            <div style={{ marginTop: 6, fontSize: 11, color: HM2.n400 }}>+ อีก {data.credits.length - 2} ใบ</div>
          )}
        </HM2SectionShell>

        {/* เป้าหมาย — แสดง progress + motivation */}
        <HM2SectionShell title="เป้าหมาย · 2 รายการ" summary={`+ ฿ ${data.savedThisMonth.toLocaleString()} เดือนนี้`}>
          {data.goals.slice(0, 2).map((g, i) => (
            <div key={i} style={{ padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${HM2.n200}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CatIcon kind={g.icon} size={16} color={g.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: HM2.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: HM2.n900, fontVariantNumeric: 'tabular-nums' }}>{g.pct}%</div>
                </div>
                <div style={{ fontSize: 10.5, color: HM2.n400 }}>อีก {g.monthsLeft}ด.</div>
              </div>
              <div style={{ marginTop: 5, marginLeft: 40 }}>
                <HM2MiniBar pct={g.pct} color={HM2.primary500} />
              </div>
            </div>
          ))}
        </HM2SectionShell>

        {/* ดูทั้งหมด → Finance tab */}
        <div style={{
          margin: '4px 16px 0',
          padding: '12px 16px',
          background: 'transparent',
          borderRadius: 14,
          border: `1px dashed ${HM2.n300}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontSize: 12, color: HM2.n600, fontWeight: 600,
          cursor: 'pointer',
        }}>
          <span>ดูบัญชี + งบประมาณทั้งหมดที่หน้าการเงิน</span>
          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke={HM2.n600} strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* Quick Add — sticky */}
      <div style={{
        position: 'absolute', bottom: 84, left: 0, right: 0, zIndex: 25,
        padding: '16px 16px 0',
        background: 'linear-gradient(180deg, rgba(247,247,250,0) 0%, rgba(247,247,250,1) 50%)',
      }}>
        <div style={{
          background: '#fff', borderRadius: 16,
          boxShadow: '0 -2px 12px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)',
          padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <button style={{
            flex: 1, background: HM2.primary400, color: '#fff', border: 'none',
            borderRadius: 12, padding: '12px 14px', fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(56,178,172,0.3)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
            บันทึกรายจ่าย
          </button>
          {[{ ic: '🎤' }, { ic: '📷' }, { ic: '⋯' }].map((b, i) => (
            <button key={i} style={{
              width: 44, height: 44, background: HM2.n200, border: 'none',
              borderRadius: 12, fontSize: 18, color: HM2.n700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'inherit',
            }}>{b.ic}</button>
          ))}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

// ─── #4 Empty State — user ใหม่ที่ยังไม่บันทึกอะไร ─────────────
// ─── Empty section helper — same shell as HM2SectionShell with onboarding CTA ──
function HM2EmptySection({ title, summary, emoji, message, ctaLabel }) {
  return (
    <div style={{ margin: '0 16px 12px', ...hm2Card(1), padding: '14px 16px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: HM2.n900 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: HM2.n400 }}>{summary}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={HM2.n400} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* Onboarding cell — dashed border to signal "missing/optional" */}
      <div style={{
        padding: '14px 12px',
        border: `1px dashed ${HM2.n300}`,
        borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: HM2.n200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>{emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: HM2.n600, lineHeight: 1.4 }}>{message}</div>
        </div>
        <button style={{
          background: HM2.primary100, color: HM2.primary600,
          border: 'none', borderRadius: 14,
          padding: '6px 12px', fontSize: 11, fontWeight: 700,
          fontFamily: 'inherit', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>{ctaLabel}</button>
      </div>
    </div>
  );
}

// ─── #4 Empty State — user ใหม่ที่ยังไม่บันทึกอะไร ─────────────
//      ใช้โครงสร้างเดียวกับ "Money Map v2 · main" ทุกอย่าง — แต่ทุก section เป็น empty state
function HomeV3_MoneyMapEmpty() {
  // Onboarding insight — ใช้ AIBriefCardV2 component เดียวกับหน้าหลัก
  const onboardingInsights = [
    {
      headline: 'ยินดีต้อนรับสู่ **Mint Money** ค่ะ! ฉันชื่อ **มิ้นท์** ✨',
      detail: 'ลองบันทึกรายการแรก แล้วฉันจะช่วยวิเคราะห์การใช้เงิน · แนะนำเป้าหมาย · เตือนรายการที่ต้องจ่าย',
      cta: '＋ บันทึกรายการแรก',
      chips: ['📷 สแกนใบเสร็จ', '💼 เพิ่มบัญชี'],
    },
  ];

  return (
    <div style={{ background: HM2.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="08:23" />

      {/* Greeting — same as main but with onboarding tone */}
      <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: HM2.n400, letterSpacing: 0.2 }}>วันนี้ · เริ่มต้นใหม่ 🌱</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: HM2.n900, marginTop: 2, letterSpacing: -0.3 }}>ยินดีต้อนรับ, ภูมิ</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Streak placeholder — show "วันที่ 1" instead of 7 days */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#fff', padding: '6px 10px', borderRadius: 16,
            fontSize: 11, fontWeight: 700, color: HM2.n400,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: `1px dashed ${HM2.n300}`,
          }}>🔥 วันที่ 1</div>
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 17V11a6 6 0 0112 0v6l1.5 2H4.5L6 17z" stroke={HM2.n700} strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M10 21h4" stroke={HM2.n700} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>

        {/* AI BRIEF — ใช้ component เดียวกันกับหน้าหลัก, แต่ onboarding insight */}
        <AIBriefCardV2 insights={onboardingInsights} idx={0} setIdx={() => {}} lastUpdate="เมื่อสักครู่" />

        {/* รายการที่ต้องจ่าย — empty */}
        <HM2EmptySection
          title="รายการที่ต้องจ่าย"
          summary="0 รายการ"
          emoji="💳"
          message="เพิ่มบัตรเครดิตหรือตั้งรายการประจำ (subscription, ค่าเช่า) แล้วมิ้นท์จะเตือนเมื่อใกล้ครบกำหนด"
          ctaLabel="ตั้งค่า"
        />

        {/* บัตรเครดิต — empty */}
        <HM2EmptySection
          title="บัตรเครดิต"
          summary="0 ใบ"
          emoji="💼"
          message="เพิ่มบัตรเพื่อติดตามยอดใช้, วงเงิน, และวันครบกำหนดทั้งหมดในที่เดียว"
          ctaLabel="＋ เพิ่มบัตร"
        />

        {/* เป้าหมาย — empty */}
        <HM2EmptySection
          title="เป้าหมาย"
          summary="0 รายการ"
          emoji="🎯"
          message="ตั้งเป้าแรก — เช่น เที่ยวญี่ปุ่น, ดาวน์รถ — แล้วดูความคืบหน้าทุกเดือน"
          ctaLabel="＋ ตั้งเป้า"
        />

        {/* ดูทั้งหมด → Finance tab */}
        <div style={{
          margin: '4px 16px 0',
          padding: '12px 16px',
          background: 'transparent',
          borderRadius: 14,
          border: `1px dashed ${HM2.n300}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontSize: 12, color: HM2.n600, fontWeight: 600,
          cursor: 'pointer',
        }}>
          <span>ดูบัญชี + งบประมาณทั้งหมดที่หน้าการเงิน</span>
          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke={HM2.n600} strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* Quick Add — same as main page (ไม่ใช่ปุ่มเดียว full-width) */}
      <div style={{
        position: 'absolute', bottom: 84, left: 0, right: 0, zIndex: 25,
        padding: '16px 16px 0',
        background: 'linear-gradient(180deg, rgba(247,247,250,0) 0%, rgba(247,247,250,1) 50%)',
      }}>
        <div style={{
          background: '#fff', borderRadius: 16,
          boxShadow: '0 -2px 12px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)',
          padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <button style={{
            flex: 1, background: HM2.primary400, color: '#fff', border: 'none',
            borderRadius: 12, padding: '12px 14px', fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(56,178,172,0.3)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
            บันทึกรายจ่าย
          </button>
          {[{ ic: '🎤' }, { ic: '📷' }, { ic: '⋯' }].map((b, i) => (
            <button key={i} style={{
              width: 44, height: 44, background: HM2.n200, border: 'none',
              borderRadius: 12, fontSize: 18, color: HM2.n700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'inherit',
            }}>{b.ic}</button>
          ))}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

Object.assign(window, { HomeV3_MoneyMapV2, HomeV3_MoneyMapEmpty, AIBriefCardV2 });
