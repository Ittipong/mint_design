// Wallets v3 — Money Map redesign
//   Single scrollable "Money Map" replaces the 4-tab segment.
//   Each section drills into a focused detail page (Accounts / Credit / Goals / Budget).
//   The shared belief: users open Finance to answer "Am I OK this month?", not to navigate four ledgers.
const W3 = window.MINT;

const w3card = (elev = 1) => ({
  background: '#fff', borderRadius: 16,
  boxShadow: elev === 2
    ? '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.05)'
    : '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
});

// ────────────────────────────────────────────────
// Mock data — one source for the Map and all drill-downs
// ────────────────────────────────────────────────
const MM = {
  monthLabel: 'พฤษภาคม 2026',
  daysInMonth: 31,
  daysLeft: 12,

  // Budgets — user-named jars (like goals), each with own icon. Not tied to category names.
  budgets: [
    { icon: 'budget', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'งบใช้จ่ายรายเดือน', spent: 13800, limit: 20000 },
    { icon: 'plane',  bg: W3.walletGreen100,  ic: W3.walletGreen,  name: 'งบเที่ยวสุดสัปดาห์', spent: 3400,  limit: 8000 },
    { icon: 'coffee', bg: W3.walletPink100,   ic: W3.walletPink,   name: 'งบกาแฟ+ขนม',       spent: 1040,  limit: 4000 },
  ],

  accounts: [
    { icon: 'piggy', bg: W3.walletPink100, ic: W3.walletPink, name: 'ครอบครัว', sub: 'บัญชีออมทรัพย์', amt: 180600 },
    { icon: 'wallet', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'TrueMoney', sub: 'e-Wallet', amt: 45200 },
    { icon: 'piggy', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'เงินสด', sub: 'พกติดตัว', amt: 20000 },
  ],

  credits: [
    { icon: 'card', bg: W3.walletGreen100,  ic: W3.walletGreen,  name: 'KTC Visa',     statement: 4200,  limit: 30000,  used: 4200,  minPay: 420,  dueDate: '15 พ.ค.', daysUntilDue: 4 },
    { icon: 'card', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'KBank Credit', statement: 18000, limit: 80000,  used: 56000, minPay: 1800, dueDate: '25 พ.ค.', daysUntilDue: 14 },
    { icon: 'card', bg: W3.walletPink100,   ic: W3.walletPink,   name: 'SCB M Visa',   statement: 7800,  limit: 50000,  used: 12300, minPay: 780,  dueDate: '20 พ.ค.', daysUntilDue: 9 },
  ],

  goals: [
    { icon: 'plane', bg: W3.walletPink100, ic: W3.walletPink, name: 'เที่ยวญี่ปุ่น',  saved: 62000, target: 100000, monthsLeft: 4,  pct: 62, track: 'on' },
    { icon: 'home',  bg: W3.walletViolet100, ic: W3.walletViolet, name: 'เงินดาวน์รถ', saved: 27000, target: 150000, monthsLeft: 14, pct: 18, track: 'behind' },
  ],

  // monthly net flows
  savedThisMonth: 8000,
};

// ────────────────────────────────────────────────
// Headers
// ────────────────────────────────────────────────
function MoneyMapHeader({ alerts = 3 }) {
  return (
    <>
      <MintStatusBarV2 time="08:23" />
      <div style={{ padding: '4px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: W3.n900, letterSpacing: -0.3 }}>การเงิน</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Alerts bell with badge */}
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 17V11a6 6 0 0112 0v6l1.5 2H4.5L6 17z" stroke={W3.n700} strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M10 21h4" stroke={W3.n700} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            {alerts > 0 && (
              <div style={{
                position: 'absolute', top: -2, right: -3,
                minWidth: 14, height: 14, borderRadius: 7, padding: '0 3px',
                background: W3.error400, color: '#fff',
                fontSize: 9, fontWeight: 700, lineHeight: '14px', textAlign: 'center',
              }}>{alerts}</div>
            )}
          </div>
          {/* Settings */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke={W3.n700} strokeWidth="1.8"/>
            <path d="M19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 00-2-1.2L14 3h-4l-.5 2.5a7 7 0 00-2 1.2l-2.4-.9-2 3.4 2 1.6A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.5c.7-.3 1.4-.7 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" stroke={W3.n700} strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </>
  );
}

function DrillHeader({ title, onBack, action }) {
  return (
    <>
      <MintStatusBarV2 time="08:23" />
      <div style={{ padding: '4px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke={W3.n800} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, fontSize: 18, fontWeight: 700, color: W3.n900, letterSpacing: -0.2 }}>{title}</div>
        {action}
      </div>
    </>
  );
}

const PlusBtn = () => (
  <div style={{
    width: 36, height: 36, borderRadius: 18,
    background: W3.primary500, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 2px 6px rgba(56,178,172,0.30)',
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  </div>
);

// ────────────────────────────────────────────────
// Section primitives
// ────────────────────────────────────────────────
function SectionShell({ title, summary, children }) {
  return (
    <div style={{ margin: '0 16px 12px', ...w3card(1), padding: '14px 16px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: W3.n400, fontVariantNumeric: 'tabular-nums' }}>{summary}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={W3.n400} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      {children}
    </div>
  );
}

function MiniBar({ pct, color }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div style={{ height: 5, borderRadius: 3, background: W3.n300, overflow: 'hidden' }}>
      <div style={{ width: `${clamped}%`, height: '100%', background: color || W3.primary500, borderRadius: 3 }} />
    </div>
  );
}

// ────────────────────────────────────────────────
// PAGE 1 — Money Map (formerly WalletsV3_Accounts)
// ────────────────────────────────────────────────
function WalletsV3_Accounts() {
  const totalBudgetSpent = MM.budgets.reduce((s, x) => s + x.spent, 0);
  const totalBudgetLimit = MM.budgets.reduce((s, x) => s + x.limit, 0);
  const usedPct = (totalBudgetSpent / totalBudgetLimit) * 100;

  const accountsTotal = MM.accounts.reduce((s, a) => s + a.amt, 0);
  const creditUsed = MM.credits.reduce((s, c) => s + c.used, 0);
  const creditLimit = MM.credits.reduce((s, c) => s + c.limit, 0);
  const nextDueCard = MM.credits.slice().sort((a, b) => a.daysUntilDue - b.daysUntilDue)[0];

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MoneyMapHeader />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110, paddingTop: 4 }}>
        {/* SECTION — บัญชี */}
        <SectionShell title="บัญชี" summary={`฿ ${accountsTotal.toLocaleString()}`}>
          {MM.accounts.slice(0, 3).map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${W3.n200}` }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CatIcon kind={a.icon} size={16} color={a.ic} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: W3.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                <div style={{ fontSize: 10.5, color: W3.n400 }}>{a.sub}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.n900, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {a.amt.toLocaleString()}
              </div>
            </div>
          ))}
        </SectionShell>

        {/* SECTION — บัตรเครดิต */}
        <SectionShell title="บัตรเครดิต" summary={`ใช้ ฿ ${creditUsed.toLocaleString()} / ${(creditLimit / 1000).toFixed(0)}k`}>
          {MM.credits.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${W3.n200}` }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CatIcon kind="card" size={16} color={c.ic} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: W3.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div style={{ fontSize: 10.5, color: W3.n400 }}>ครบกำหนด {c.dueDate} · อีก {c.daysUntilDue} วัน</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.n900, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {c.statement.toLocaleString()}
              </div>
            </div>
          ))}
        </SectionShell>

        {/* SECTION — เป้าหมาย */}
        <SectionShell title="เป้าหมาย" summary={`+ ฿ ${MM.savedThisMonth.toLocaleString()} เดือนนี้`}>
          {MM.goals.slice(0, 2).map((g, i) => (
            <div key={i} style={{ padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${W3.n200}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CatIcon kind={g.icon} size={16} color={g.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: W3.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: W3.n900, fontVariantNumeric: 'tabular-nums' }}>{g.pct}%</div>
                </div>
                <div style={{ fontSize: 10.5, color: W3.n400 }}>อีก {g.monthsLeft}ด.</div>
              </div>
              <div style={{ marginTop: 5, marginLeft: 40 }}>
                <MiniBar pct={g.pct} color={W3.primary500} />
              </div>
            </div>
          ))}
        </SectionShell>

        {/* SECTION — งบประมาณ (jars) */}
        <SectionShell title="งบประมาณ" summary={`ใช้แล้ว ${usedPct.toFixed(0)}%`}>
          {MM.budgets.slice(0, 2).map((bg, i) => {
            const pct = (bg.spent / bg.limit) * 100;
            return (
              <div key={i} style={{ padding: '7px 0', borderTop: i === 0 ? 'none' : `1px solid ${W3.n200}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: bg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CatIcon kind={bg.icon} size={16} color={bg.ic} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 600, color: W3.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bg.name}</div>
                  <div style={{ fontSize: 11, color: W3.n400, fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ color: W3.n900, fontWeight: 700 }}>฿ {bg.spent.toLocaleString()}</span>
                    <span> / {bg.limit.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ marginTop: 5, marginLeft: 40 }}>
                  <MiniBar pct={pct} color={W3.primary500} />
                </div>
              </div>
            );
          })}
          {MM.budgets.length > 2 && (
            <div style={{ marginTop: 8, fontSize: 11, color: W3.n400 }}>+ อีก {MM.budgets.length - 2} งบ</div>
          )}
        </SectionShell>
      </div>

<BottomNavV2 active="wallets" />
    </div>
  );
}

// ────────────────────────────────────────────────
// DRILL — บัตรเครดิต
// ────────────────────────────────────────────────
function WalletsV3_Credit() {
  const dueWithin30 = MM.credits.reduce((s, c) => s + c.statement, 0);
  const totalMin = MM.credits.reduce((s, c) => s + c.minPay, 0);
  const totalUsed = MM.credits.reduce((s, c) => s + c.used, 0);
  const totalLimit = MM.credits.reduce((s, c) => s + c.limit, 0);

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <DrillHeader title="บัตรเครดิต" />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        {/* HERO — total due within 30 days */}
        <div style={{ margin: '0 16px 14px', ...w3card(2), padding: '18px 20px' }}>
          <div style={{ fontSize: 12, color: W3.n400, fontWeight: 600 }}>ยอดที่ต้องจ่ายภายใน 30 วัน</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: W3.n900, marginTop: 4, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>
            ฿ {dueWithin30.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: W3.n400, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            ใช้ <span style={{ color: W3.n900, fontWeight: 700 }}>฿ {totalUsed.toLocaleString()}</span> / {totalLimit.toLocaleString()} · ขั้นต่ำรวม <span style={{ color: W3.n900, fontWeight: 700 }}>฿ {totalMin.toLocaleString()}</span>
          </div>
        </div>

        {/* LIST */}
        {MM.credits.map((c, i) => {
          const pct = (c.used / c.limit) * 100;
          return (
            <div key={i} style={{ margin: '0 16px 10px', ...w3card(1), padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CatIcon kind="card" size={18} color={c.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W3.n900 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: W3.n400, marginTop: 2 }}>ครบกำหนด {c.dueDate} · อีก {c.daysUntilDue} วัน</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W3.n900, fontVariantNumeric: 'tabular-nums' }}>฿ {c.statement.toLocaleString()}</div>
                  <div style={{ fontSize: 10.5, color: W3.n400, marginTop: 1 }}>ยอดบิล</div>
                </div>
              </div>
              {/* utilization */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: W3.n400, marginBottom: 5 }}>
                  <span>ใช้ไป <span style={{ color: W3.n900, fontWeight: 700 }}>{pct.toFixed(0)}%</span></span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{c.used.toLocaleString()} / {c.limit.toLocaleString()}</span>
                </div>
                <MiniBar pct={pct} color={W3.primary500} />
              </div>
              {/* min row + cta */}
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${W3.n200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: W3.n400 }}>ขั้นต่ำ <span style={{ color: W3.n900, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>฿ {c.minPay.toLocaleString()}</span></div>
                <button style={{ background: 'rgb(205, 236, 234)', color: 'rgb(39, 125, 120)', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 600, padding: '6px 12px', fontFamily: 'inherit', cursor: 'pointer' }}>จ่ายบัตรนี้</button>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNavV2 active="wallets" />
    </div>
  );
}

// ────────────────────────────────────────────────
// DRILL — เป้าหมาย
// ────────────────────────────────────────────────
function WalletsV3_Goals() {
  // Monthly target — ideal pace = remaining ÷ monthsLeft
  const monthlyTarget = MM.goals.reduce((s, g) => s + Math.ceil((g.target - g.saved) / Math.max(1, g.monthsLeft)), 0);
  const ratio = MM.savedThisMonth / monthlyTarget;
  const ratioPct = Math.round(ratio * 100);
  const delta = MM.savedThisMonth - monthlyTarget;

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <DrillHeader title="เป้าหมาย" />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        {/* HERO — saved this month vs plan */}
        <div style={{ margin: '0 16px 14px', ...w3card(2), padding: '18px 20px' }}>
          <div style={{ fontSize: 12, color: W3.n400, fontWeight: 600 }}>ออมเดือนนี้</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: W3.n900, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>
              ฿ {MM.savedThisMonth.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: W3.n900, fontWeight: 700 }}>
              {delta >= 0 ? '+' : ''}{delta.toLocaleString()} จากแผน
            </div>
          </div>
          <div style={{ fontSize: 11, color: W3.n400, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            แผน <span style={{ color: W3.n900, fontWeight: 700 }}>฿ {monthlyTarget.toLocaleString()} / เดือน</span> · ทำได้ <span style={{ color: W3.n900, fontWeight: 700 }}>{ratioPct}%</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <MiniBar pct={Math.min(120, ratioPct)} color={W3.primary500} />
          </div>
        </div>

        {/* LIST */}
        {MM.goals.map((g, i) => {
          const remain = g.target - g.saved;
          const monthly = Math.ceil(remain / Math.max(1, g.monthsLeft));
          const trackLabel = g.track === 'behind' ? 'ช้ากว่าแผน' : g.track === 'ahead' ? 'เร็วกว่ากำหนด' : 'ตามแผน';
          return (
            <div key={i} style={{ margin: '0 16px 10px', ...w3card(1), padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CatIcon kind={g.icon} size={18} color={g.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W3.n900 }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: W3.n400, fontWeight: 500, marginTop: 2 }}>{trackLabel}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: W3.n900, fontVariantNumeric: 'tabular-nums' }}>{g.pct}%</div>
                  <div style={{ fontSize: 10.5, color: W3.n400, marginTop: 1 }}>อีก {g.monthsLeft} เดือน</div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <MiniBar pct={g.pct} color={W3.primary500} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: W3.n400, fontVariantNumeric: 'tabular-nums' }}>
                  <span><span style={{ color: W3.n900, fontWeight: 700 }}>฿ {g.saved.toLocaleString()}</span> / {g.target.toLocaleString()}</span>
                  <span>เหลือ ฿ {remain.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${W3.n200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: W3.n400 }}>ออมเดือนละ <span style={{ color: W3.n900, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>฿ {monthly.toLocaleString()}</span></div>
                <button style={{ background: 'rgb(205, 236, 234)', color: 'rgb(39, 125, 120)', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 600, padding: '6px 12px', fontFamily: 'inherit', cursor: 'pointer' }}>+ ฝาก</button>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNavV2 active="wallets" />
    </div>
  );
}

// ────────────────────────────────────────────────
// DRILL — งบประมาณ
// ────────────────────────────────────────────────
function WalletsV3_Budget() {
  const totalBudgetSpent = MM.budgets.reduce((s, x) => s + x.spent, 0);
  const totalBudgetLimit = MM.budgets.reduce((s, x) => s + x.limit, 0);
  const usedPct = (totalBudgetSpent / totalBudgetLimit) * 100;
  const remaining = totalBudgetLimit - totalBudgetSpent;
  const monthPct = Math.round(((MM.daysInMonth - MM.daysLeft) / MM.daysInMonth) * 100);
  const dailyLeft = Math.max(0, Math.round(remaining / Math.max(1, MM.daysLeft)));

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <DrillHeader title="งบประมาณ" />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        {/* HERO — daily allowance + dual progress (used vs month elapsed) */}
        <div style={{ margin: '0 16px 14px', ...w3card(2), padding: '18px 20px' }}>
          <div style={{ fontSize: 12, color: W3.n400, fontWeight: 600 }}>ใช้ได้ต่อวัน</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: W3.n900, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>
              ฿ {dailyLeft.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: W3.n400, fontWeight: 500 }}>/ วันที่เหลือ</div>
          </div>
          <div style={{ fontSize: 11, color: W3.n400, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            งบเหลือ <span style={{ color: W3.n900, fontWeight: 700 }}>฿ {remaining.toLocaleString()}</span> · เหลือ <span style={{ color: W3.n900, fontWeight: 700 }}>{MM.daysLeft} วัน</span>
          </div>
          {/* dual progress: budget used vs month elapsed marker */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: W3.n400, marginBottom: 4 }}>
              <span>งบใช้ไป {usedPct.toFixed(0)}%</span>
              <span>เดือนผ่านไป {monthPct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: W3.n300, overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: `${Math.min(100, usedPct)}%`, height: '100%', background: W3.primary500, borderRadius: 4 }} />
              <div style={{ position: 'absolute', left: `${monthPct}%`, top: -3, bottom: -3, width: 2, background: W3.n700, transform: 'translateX(-1px)' }} />
            </div>
          </div>
        </div>

        {/* LIST — budget jars (each with own icon + name, like goals) */}
        {MM.budgets.map((bg, i) => {
          const pct = (bg.spent / bg.limit) * 100;
          const over = pct > 100;
          const dailyLeftJar = Math.max(0, Math.round((bg.limit - bg.spent) / Math.max(1, MM.daysLeft)));
          return (
            <div key={i} style={{ margin: '0 16px 10px', ...w3card(1), padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: bg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CatIcon kind={bg.icon} size={18} color={bg.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W3.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bg.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: W3.n900, fontVariantNumeric: 'tabular-nums' }}>{pct.toFixed(0)}%</div>
                  <div style={{ fontSize: 10.5, color: W3.n400, marginTop: 1 }}>ใช้ไป</div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <MiniBar pct={pct} color={W3.primary500} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: W3.n400, fontVariantNumeric: 'tabular-nums' }}>
                  <span><span style={{ color: W3.n900, fontWeight: 700 }}>฿ {bg.spent.toLocaleString()}</span> / {bg.limit.toLocaleString()}</span>
                  <span>{over ? `เกิน ฿ ${(bg.spent - bg.limit).toLocaleString()}` : `เหลือ ฿ ${(bg.limit - bg.spent).toLocaleString()}`}</span>
                </div>
              </div>

              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${W3.n200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: W3.n400 }}>
                  {over
                    ? <span style={{ color: W3.n900, fontWeight: 700 }}>เกินงบแล้ว</span>
                    : <>ใช้ต่อวัน <span style={{ color: W3.n900, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>฿ {dailyLeftJar.toLocaleString()}</span></>}
                </div>
                <button style={{ background: 'rgb(205, 236, 234)', color: 'rgb(39, 125, 120)', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 600, padding: '6px 12px', fontFamily: 'inherit', cursor: 'pointer' }}>ปรับงบ</button>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNavV2 active="wallets" />
    </div>
  );
}

Object.assign(window, {
  WalletsV3_Accounts, WalletsV3_Credit, WalletsV3_Goals, WalletsV3_Budget,
});
