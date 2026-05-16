// Home V3 — Money Map + AI Brief
// Concept: รวม "AI Brief" (สิ่งที่ AI อยากบอกวันนี้) + "Money Map" (4 sections สรุปทุกอย่าง)
// = home page เดียวที่ user เปิดมาเห็นทั้ง insight และ position ของตัวเอง
const HMM = window.MINT;

const hmmCard = (elev = 1) => ({
  background: '#fff', borderRadius: 16,
  boxShadow: elev === 2 ?
    '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.05)' :
    '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)'
});

function HMMSectionShell({ title, summary, children }) {
  return (
    <div style={{ margin: '0 16px 12px', ...hmmCard(1), padding: '14px 16px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: HMM.n900 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: HMM.n400, fontVariantNumeric: 'tabular-nums' }}>{summary}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={HMM.n400} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {children}
    </div>
  );
}

function HMMMiniBar({ pct, color }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div style={{ height: 5, borderRadius: 3, background: HMM.n300, overflow: 'hidden' }}>
      <div style={{ width: `${clamped}%`, height: '100%', background: color || HMM.primary500, borderRadius: 3 }} />
    </div>
  );
}

function HomeV3_MoneyMap() {
  // Reuse the MM data already defined globally
  const data = window.MM || {
    accounts: [], credits: [], goals: [], budgets: [], savedThisMonth: 0,
    daysInMonth: 31, daysLeft: 12,
  };

  const accountsTotal = data.accounts.reduce((s, a) => s + a.amt, 0);
  const creditUsed = data.credits.reduce((s, c) => s + c.used, 0);
  const creditLimit = data.credits.reduce((s, c) => s + c.limit, 0);
  const totalBudgetSpent = data.budgets.reduce((s, x) => s + x.spent, 0);
  const totalBudgetLimit = data.budgets.reduce((s, x) => s + x.limit, 0);
  const usedPct = totalBudgetSpent / totalBudgetLimit * 100;

  const [insightIdx, setInsightIdx] = React.useState(0);
  const insights = [
    {
      headline: <>เดือนนี้ออมไปแล้ว <b style={{ color: HMM.primary600 }}>฿ 8,000</b> เกินแผน <b style={{ color: HMM.primary600 }}>+฿1,200</b> เลยค่ะ ✨</>,
      detail: <>ถ้ารักษาจังหวะแบบนี้ <b>เที่ยวญี่ปุ่น</b> จะถึงเป้าก่อนกำหนด 1 เดือนเลยค่ะ</>,
      chips: ['ดูเป้าหมาย', 'ทำไมเกินแผน?'],
    },
    {
      headline: <>วันนี้ใช้ไปแล้ว <b style={{ color: HMM.error400 }}>฿ 390</b> จากงบรายวัน ฿1,150 — เหลืออีก <b style={{ color: HMM.primary600 }}>฿ 760</b></>,
      detail: <>สังเกตว่า <b>งบกาแฟ+ขนม</b> เดือนนี้เหลือเยอะ เก็บออมเพิ่มได้น้า</>,
      chips: ['ตั้งโอนออมอัตโนมัติ', 'ดูแผนเต็ม'],
    },
    {
      headline: <>บัตร <b>KTC Visa</b> ครบกำหนดอีก <b style={{ color: HMM.warning400 }}>4 วัน</b> · ยอด ฿ 4,200 💳</>,
      detail: <>มียอดในบัญชีพอจ่ายเต็ม → จ่ายเลยดีไหมคะ จะได้ไม่ลืม</>,
      chips: ['จ่ายเต็มเลย', 'เลื่อนเตือนพรุ่งนี้'],
    },
  ];
  const ins = insights[insightIdx];

  return (
    <div style={{ background: HMM.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="08:23" />

      {/* Greeting header */}
      <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: HMM.n400, letterSpacing: 0.2 }}>พุธ · 14 พ.ค. · เช้านี้ ☀</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: HMM.n900, marginTop: 2, letterSpacing: -0.3 }}>สวัสดี, ภูมิ</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#fff', padding: '6px 10px', borderRadius: 16,
            fontSize: 11, fontWeight: 700, color: HMM.warning400,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>🔥 7 วัน</div>
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 17V11a6 6 0 0112 0v6l1.5 2H4.5L6 17z" stroke={HMM.n700} strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M10 21h4" stroke={HMM.n700} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: -1, right: -1, width: 7, height: 7, borderRadius: 4, background: HMM.error400, border: '1.5px solid #fff' }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>

        {/* AI BRIEF WIDGET */}
        <div style={{ margin: '0 16px 14px' }}>
          <div style={{
            position: 'relative',
            background: `linear-gradient(135deg, ${HMM.walletViolet100} 0%, #fff 50%, ${HMM.primary100} 100%)`,
            borderRadius: 20,
            padding: '16px 16px 14px',
            boxShadow: '0 4px 14px rgba(148,154,235,0.15), 0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid rgba(255,255,255,0.7)',
            overflow: 'hidden',
          }}>
            {/* AI identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `linear-gradient(135deg, ${HMM.walletViolet} 0%, ${HMM.primary400} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15,
                boxShadow: '0 2px 8px rgba(148,154,235,0.4)',
              }}>✦</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: HMM.n900 }}>มิ้นท์ · AI ผู้ช่วย</div>
                <div style={{ fontSize: 10, color: HMM.primary500, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: HMM.primary400 }} />
                  สรุปจากข้อมูลของคุณ
                </div>
              </div>
              <div style={{ fontSize: 10, color: HMM.n400, background: 'rgba(255,255,255,0.7)', padding: '3px 8px', borderRadius: 10 }}>เช้านี้</div>
            </div>

            {/* Brief */}
            <div style={{ fontSize: 14, color: HMM.n900, lineHeight: 1.5, fontWeight: 500, marginBottom: 6 }}>
              {ins.headline}
            </div>
            <div style={{ fontSize: 12, color: HMM.n600, lineHeight: 1.5, marginBottom: 12 }}>
              {ins.detail}
            </div>

            {/* Action chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <div style={{
                background: HMM.primary400, color: '#fff',
                padding: '7px 12px', borderRadius: 18,
                fontSize: 11, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 5,
                boxShadow: '0 2px 6px rgba(56,178,172,0.3)',
                cursor: 'pointer',
              }}>
                <span>ถามต่อ</span>
                <svg width="10" height="10" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round"/></svg>
              </div>
              {ins.chips.map((c, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.85)', color: HMM.n700,
                  padding: '7px 12px', borderRadius: 18,
                  fontSize: 11, fontWeight: 500,
                  border: '1px solid rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                }}>{c}</div>
              ))}
            </div>
          </div>

          {/* pagination dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            {insights.map((_, i) => (
              <div key={i} onClick={() => setInsightIdx(i)} style={{
                width: i === insightIdx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === insightIdx ? HMM.primary400 : HMM.n300,
                transition: 'all 0.2s', cursor: 'pointer',
              }} />
            ))}
          </div>
        </div>

        {/* MONEY MAP — 4 sections */}
        {/* บัญชี */}
        <HMMSectionShell title="บัญชี" summary={`฿ ${accountsTotal.toLocaleString()}`}>
          {data.accounts.slice(0, 3).map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${HMM.n200}` }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CatIcon kind={a.icon} size={16} color={a.ic} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: HMM.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                <div style={{ fontSize: 10.5, color: HMM.n400 }}>{a.sub}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: HMM.n900, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {a.amt.toLocaleString()}
              </div>
            </div>
          ))}
        </HMMSectionShell>

        {/* บัตรเครดิต */}
        <HMMSectionShell title="บัตรเครดิต" summary={`ใช้ ฿ ${creditUsed.toLocaleString()} / ${(creditLimit / 1000).toFixed(0)}k`}>
          {data.credits.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${HMM.n200}` }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CatIcon kind="card" size={16} color={c.ic} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: HMM.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div style={{ fontSize: 10.5, color: HMM.n400 }}>ครบกำหนด {c.dueDate} · อีก {c.daysUntilDue} วัน</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: HMM.n900, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {c.statement.toLocaleString()}
              </div>
            </div>
          ))}
        </HMMSectionShell>

        {/* เป้าหมาย */}
        <HMMSectionShell title="เป้าหมาย" summary={`+ ฿ ${data.savedThisMonth.toLocaleString()} เดือนนี้`}>
          {data.goals.slice(0, 2).map((g, i) => (
            <div key={i} style={{ padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${HMM.n200}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CatIcon kind={g.icon} size={16} color={g.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: HMM.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: HMM.n900, fontVariantNumeric: 'tabular-nums' }}>{g.pct}%</div>
                </div>
                <div style={{ fontSize: 10.5, color: HMM.n400 }}>อีก {g.monthsLeft}ด.</div>
              </div>
              <div style={{ marginTop: 5, marginLeft: 40 }}>
                <HMMMiniBar pct={g.pct} color={HMM.primary500} />
              </div>
            </div>
          ))}
        </HMMSectionShell>

        {/* งบประมาณ */}
        <HMMSectionShell title="งบประมาณ" summary={`ใช้แล้ว ${usedPct.toFixed(0)}%`}>
          {data.budgets.slice(0, 2).map((bg, i) => {
            const pct = bg.spent / bg.limit * 100;
            return (
              <div key={i} style={{ padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${HMM.n200}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: bg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CatIcon kind={bg.icon} size={16} color={bg.ic} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 600, color: HMM.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bg.name}</div>
                  <div style={{ fontSize: 11, color: HMM.n400, fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ color: HMM.n900, fontWeight: 700 }}>฿ {bg.spent.toLocaleString()}</span>
                    <span> / {bg.limit.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ marginTop: 5, marginLeft: 40 }}>
                  <HMMMiniBar pct={pct} color={HMM.primary500} />
                </div>
              </div>
            );
          })}
          {data.budgets.length > 2 && (
            <div style={{ marginTop: 8, fontSize: 11, color: HMM.n400 }}>+ อีก {data.budgets.length - 2} งบ</div>
          )}
        </HMMSectionShell>
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
            flex: 1, background: HMM.primary400, color: '#fff', border: 'none',
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
              width: 44, height: 44, background: HMM.n200, border: 'none',
              borderRadius: 12, fontSize: 18, color: HMM.n700, cursor: 'pointer',
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

// Expose MM data globally so HomeV3_MoneyMap can read it
// (v3-wallets.jsx defines MM in module scope — re-declare here)
window.HomeV3_MoneyMap = HomeV3_MoneyMap;
