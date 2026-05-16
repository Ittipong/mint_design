// Budget Detail — bottom sheet for a single budget jar
//   Hero (spent / limit · %) → Quick Actions
//   → Pace card (เหลือใช้ · เหลือกี่วัน · ใช้ต่อวัน · แนะนำต่อวัน · pace bar)
//   → Recent transactions → Sticky footer (ตั้งค่างบ + บันทึก)
(function () {
const W3 = window.MINT;

const card = (elev = 1) => ({
  background: '#fff', borderRadius: 16,
  boxShadow: elev === 2 ?
    '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.05)' :
    '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
});

// Eye-friendly palette overlay — applied on top of MINT tokens.
//   inkMuted (WCAG AA on white, 5.6:1) replaces n400 for secondary text.
//   negSoft is a desaturated coral for "over-pace / over-budget" — communicates
//   warning without the alarm-bell saturation of error400 on a frequent screen.
const INK = {
  muted: '#6B6B78',     // secondary text — labels, hints (AA on white)
  faint: '#9A99A6',     // tertiary text — only for >=11px hints/suffix
  divider: '#ECECF1',   // soft separator
  posInk: '#3F8C5C',    // positive amount text (AA on white)
  negSoft: '#C45A3D',   // desaturated coral for "over budget / over pace" callouts
};

const fmt = (n) => Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtSigned = (n) => `${n < 0 ? '- ' : '+ '}${fmt(n)}`;

// ────────────────────────────────────────────────
// Mock data — งบใช้จ่ายรายเดือน (69% used · day 15 of 31)
// ────────────────────────────────────────────────
const BD = {
  budget: {
    icon: 'budget', bg: W3.walletViolet100, ic: W3.walletViolet,
    name: 'งบใช้จ่ายรายเดือน', sub: 'งบรายเดือน',
    spent: 13800, limit: 20000,
  },
  cycle: {
    daysInMonth: 31,
    daysElapsed: 15,
    // daysLeft, remaining, avgPerDay, recPerDay computed
  },
  // Scope — which wallets + categories count into this budget.
  //   Categories may overlap across wallets (e.g. ร้านอาหาร appears in both
  //   KBank + SCB) which is normal; the sub-count dedupes by name.
  scope: {
    wallets: [
      {
        name: 'กสิกร เงินสด',
        bg: W3.walletGreen100, ic: W3.walletGreen,
        cats: [
          { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร' },
          { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'กาแฟ' },
          { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ช้อปปิ้ง' },
        ],
      },
      {
        name: 'SCB ออมทรัพย์',
        bg: W3.walletViolet100, ic: W3.walletViolet,
        cats: [
          { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร' },
          { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'BTS/MRT' },
          { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ของใช้' },
        ],
      },
    ],
  },
  days: [
    { day: 14, dayName: 'วันพุธ', monthYear: 'พฤษภาคม 2569', total: -1250, txs: [
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร', sub: 'ข้าวมันไก่ + ก๋วยเตี๋ยว', amt: -250 },
      { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'กาแฟ', sub: 'Amazon ลาเต้เย็น', amt: -65 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ช้อปปิ้ง', sub: '7-Eleven', amt: -295 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'มื้อเย็น', sub: 'Sushi Hiro', amt: -640 },
    ]},
    { day: 12, dayName: 'วันจันทร์', monthYear: 'พฤษภาคม 2569', total: -890, txs: [
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ช้อปปิ้ง', sub: 'Watsons', amt: -340 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร', sub: 'After You', amt: -240 },
      { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'BTS/MRT', sub: 'สยาม-อโศก', amt: -45 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Tops', sub: 'ของใช้', amt: -265 },
    ]},
    { day: 10, dayName: 'วันเสาร์', monthYear: 'พฤษภาคม 2569', total: -1560, txs: [
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ของใช้บ้าน', sub: 'Big C', amt: -890 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร', sub: 'หมูกระทะ', amt: -520 },
      { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'กาแฟ', sub: 'Starbucks', amt: -150 },
    ]},
    { day: 8, dayName: 'วันพฤหัสบดี', monthYear: 'พฤษภาคม 2569', total: -670, txs: [
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ผัดไทย', sub: 'ป้าตุ๊ก', amt: -50 },
      { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'กาแฟ', sub: 'Amazon', amt: -65 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'มื้อเย็น', sub: 'MK', amt: -420 },
      { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'แท็กซี่', sub: 'Grab', amt: -135 },
    ]},
    { day: 5, dayName: 'วันจันทร์', monthYear: 'พฤษภาคม 2569', total: -2200, txs: [
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Lazada', sub: 'เสื้อผ้า', amt: -1450 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร', sub: 'ส้มตำ', amt: -130 },
      { icon: 'bill', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ค่าน้ำ', sub: 'การประปา', amt: -320 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Tops', sub: 'ของใช้', amt: -300 },
    ]},
  ],
};

// ────────────────────────────────────────────────
// Sheet header
// ────────────────────────────────────────────────
function SheetHeader({ title }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: W3.n300 }} />
      </div>
      <div style={{ padding: '6px 18px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={W3.n800} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: W3.n900 }}>{title}</div>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.6" fill={W3.n800} />
            <circle cx="12" cy="12" r="1.6" fill={W3.n800} />
            <circle cx="12" cy="19" r="1.6" fill={W3.n800} />
          </svg>
        </div>
      </div>
      <div style={{ height: 1, background: INK.divider }} />
    </>);

}

// ────────────────────────────────────────────────
// Hero — icon | name | big = spent (so user reads "how much I've spent")
//   spent = behavioral mirror — confronting how much went out feels honest.
//   The actionable "remaining" lives in PaceCard hero where it pairs with
//   per-day recommendation. Two-stage: confront → guide.
// ────────────────────────────────────────────────
function BudgetHero({ b }) {
  const pct = Math.round((b.spent / b.limit) * 100);
  return (
    <div style={{ margin: '14px 16px 14px', ...card(1), padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CatIcon kind={b.icon} containerSize={56} color={b.ic} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: W3.n900, letterSpacing: -0.1, lineHeight: 1.2 }}>{b.name}</div>
          <div style={{ fontSize: 13, color: INK.muted, marginTop: 3 }}>{b.sub}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {/* Spent — #1 hero of this screen. 800 → 700 (Sarabun-friendly). */}
          <div style={{ fontSize: 26, fontWeight: 700, color: W3.n900, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>
            {fmt(b.spent)}
          </div>
          <div style={{ fontSize: 11, color: INK.faint, marginTop: 2, letterSpacing: 0.3 }}>THB</div>
        </div>
      </div>
      <div style={{ height: 1, borderTop: `1px dashed ${INK.divider}`, margin: '14px 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 12, color: INK.muted, flexShrink: 0, fontWeight: 500 }}>งบ</div>
        <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 600, color: W3.n800, fontVariantNumeric: 'tabular-nums', lineHeight: 1.4 }}>
          ฿ {b.limit.toLocaleString()} <span style={{ color: INK.faint, fontWeight: 500 }}>· {pct}%</span>
        </div>
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Quick actions
// ────────────────────────────────────────────────
function QuickActions({ accent }) {
  const Chip = ({ icon, label }) =>
    <div style={{
      flex: 1, ...card(1), padding: '12px 10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none',
    }}>
      {icon}
      <div style={{ fontSize: 13, fontWeight: 600, color: W3.n800 }}>{label}</div>
    </div>;
  return (
    <div style={{ margin: '0 16px 14px' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Chip label="ดูรายการ" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h10" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        } />
        <Chip label="รายงาน" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 20V10M12 20V4M19 20v-7" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        } />
      </div>
    </div>);
}

// ────────────────────────────────────────────────
// Pace card — protagonist:
//   เหลือใช้ (hero) + days-left badge + ใช้ต่อวัน/แนะนำต่อวัน + pace bar
//   pace bar = comparison of spent% vs time% (over-pace = warning)
// ────────────────────────────────────────────────
function PaceCard({ b, c }) {
  const remaining = b.limit - b.spent;
  const daysLeft = Math.max(0, c.daysInMonth - c.daysElapsed);
  const avgPerDay = Math.round(b.spent / Math.max(1, c.daysElapsed));
  const recPerDay = Math.max(0, Math.round(remaining / Math.max(1, daysLeft)));
  const spentPct = Math.round((b.spent / b.limit) * 100);
  const timePct = Math.round((c.daysElapsed / c.daysInMonth) * 100);
  const overPace = spentPct > timePct;
  const overBudget = b.spent > b.limit;
  const status = overBudget ? 'เกินงบ' : overPace ? 'เร็วกว่าจังหวะ' : 'ตามจังหวะ';
  // Status uses negSoft + posInk overlay colors so warnings remain calm —
  // a screen the user opens every few days shouldn't flash an alarm red.
  const statusColor = overBudget || overPace ? INK.negSoft : INK.posInk;

  // Stat chip — mirrors WalletDetail StatChip:
  //   label 10.5 → 12, value 12 → 14, padding 8/10 → 10/12.
  const StatChip = ({ icon, label, value, tone }) =>
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 12,
      background: tone
        ? `color-mix(in srgb, ${tone} 10%, transparent)`
        : W3.n200,
    }}>
      <div style={{ flexShrink: 0, display: 'flex' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: tone || INK.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900, marginTop: 2, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', letterSpacing: -0.1 }}>
          {value}
        </div>
      </div>
    </div>;

  return (
    <div style={{ margin: '0 16px 14px', ...card(1), padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: INK.muted, fontWeight: 600 }}>เหลือใช้เดือนนี้</div>
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: W3.n200, fontSize: 12, fontWeight: 700, color: W3.n800,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={INK.muted} strokeWidth="1.8" />
            <path d="M12 7v5l3 2" stroke={INK.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          เหลืออีก {daysLeft} วัน
        </div>
      </div>

      {/* Hero = remaining — answers "เหลือใช้กี่บาท". 800 → 700, size 30 → 28
          so it sits below BudgetHero's 26+suffix without competing. */}
      <div style={{
        fontSize: 28, fontWeight: 700,
        color: overBudget ? INK.negSoft : W3.n900,
        letterSpacing: -0.3, marginTop: 8, lineHeight: 1.1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        ฿ {remaining.toLocaleString()}
      </div>
      <div style={{ fontSize: 13, color: INK.muted, marginTop: 4, lineHeight: 1.4 }}>
        เหลือใช้ · แนะนำวันละ <b style={{ color: W3.n800, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>฿ {recPerDay.toLocaleString()}</b>
      </div>

      {/* progress bar */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: INK.muted, fontWeight: 600 }}>การใช้จ่าย</div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: statusColor,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: statusColor }} />
            {status} · {spentPct}%
          </div>
        </div>
        <div style={{ position: 'relative', height: 6, borderRadius: 3, background: W3.n200, overflow: 'visible' }}>
          <div style={{
            width: `${Math.min(100, spentPct)}%`, height: '100%',
            background: overPace || overBudget ? INK.negSoft : b.ic,
            borderRadius: 3,
          }} />
          {/* time-elapsed marker — softened from n700 (near-black) to INK.muted
              so it reads as a guide tick, not a hard rule line */}
          <div style={{
            position: 'absolute', left: `${Math.min(100, timePct)}%`, top: -2, bottom: -2,
            width: 2, background: INK.muted, borderRadius: 1, transform: 'translateX(-1px)',
          }} />
        </div>
        <div style={{ fontSize: 11.5, color: INK.faint, marginTop: 6, lineHeight: 1.3 }}>
          ขีดเทา = เดือนผ่านไป {timePct}%
        </div>
      </div>

      <div style={{ height: 1, borderTop: `1px dashed ${INK.divider}`, margin: '14px 0 12px' }} />

      {/* avg / recommended — side-by-side stat chips. Actual avg tinted negSoft
          when over-pace so the user sees "current behavior" as the lever to fix. */}
      <div style={{ display: 'flex', gap: 8 }}>
        <StatChip
          label="ใช้เฉลี่ย/วัน"
          value={`฿ ${avgPerDay.toLocaleString()}`}
          tone={overPace || overBudget ? INK.negSoft : null}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 17l5-5 4 4 7-8" stroke={overPace || overBudget ? INK.negSoft : INK.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 8h6v6" stroke={overPace || overBudget ? INK.negSoft : INK.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatChip
          label="แนะนำใช้/วัน"
          value={`฿ ${recPerDay.toLocaleString()}`}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={INK.posInk} strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke={INK.posInk} strokeWidth="1.8" />
              <circle cx="12" cy="12" r="1.4" fill={INK.posInk} />
            </svg>
          }
        />
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Scope section — wallets + categories that feed this budget
//   Placed before Transactions so it answers "ทำไมรายการพวกนี้ถึงนับ"
//   right when the user starts scanning the list below.
//   Chips use neutral n200 bg + colored category icon → scannable without
//   becoming a rainbow that competes with the hero/pace cards above.
// ────────────────────────────────────────────────
function ScopeSection({ scope }) {
  const walletCount = scope.wallets.length;
  const uniqueCats = new Set();
  scope.wallets.forEach((w) => w.cats.forEach((c) => uniqueCats.add(c.name)));
  const catCount = uniqueCats.size;

  const Chip = ({ c }) =>
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px 5px 5px', borderRadius: 999,
      background: W3.n200,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 999,
        background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <CatIcon kind={c.icon} containerSize={22} color={c.ic} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: W3.n800, letterSpacing: -0.1 }}>{c.name}</div>
    </div>;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 18px 10px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>ขอบเขตงบ</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: INK.muted, fontVariantNumeric: 'tabular-nums' }}>
          {walletCount} กระเป๋า · {catCount} หมวด
        </div>
      </div>
      <div style={{ margin: '0 16px 14px', ...card(1), padding: '16px 18px' }}>
        {scope.wallets.map((w, i) =>
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <CatIcon kind="wallet" containerSize={36} color={w.ic} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900, letterSpacing: -0.1, lineHeight: 1.25 }}>
                {w.name}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, marginLeft: 48 }}>
              {w.cats.map((c, j) => <Chip key={j} c={c} />)}
            </div>
            {i < scope.wallets.length - 1 &&
              <div style={{ height: 1, borderTop: `1px dashed ${INK.divider}`, margin: '14px 0' }} />}
          </div>
        )}
      </div>
    </>);
}

// ────────────────────────────────────────────────
// Transactions — group by date
// ────────────────────────────────────────────────
function DayCard({ d }) {
  return (
    <div style={{ margin: '0 16px 12px', ...card(1), padding: '14px 16px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: W3.n900, letterSpacing: -0.5, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{d.day}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: W3.n900, lineHeight: 1.2 }}>{d.dayName}</div>
          <div style={{ fontSize: 11.5, color: INK.muted, marginTop: 2 }}>{d.monthYear}</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: d.total >= 0 ? INK.posInk : W3.n900, fontVariantNumeric: 'tabular-nums' }}>
          {fmtSigned(d.total)} ฿
        </div>
      </div>
      <div style={{ height: 1, borderTop: `1px dashed ${INK.divider}` }} />
      {d.txs.map((t, i) =>
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CatIcon kind={t.icon} containerSize={32} color={t.ic} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: W3.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.25 }}>{t.name}</div>
            <div style={{ fontSize: 12, color: INK.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.sub}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.amt >= 0 ? INK.posInk : W3.n900, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
            {fmtSigned(t.amt)} ฿
          </div>
        </div>
      )}
    </div>);
}

function TransactionsSection({ days, count }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 18px 10px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>รายการที่นับเข้างบนี้</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: INK.muted }}>{count} รายการ</div>
      </div>
      {days.map((d, i) => <DayCard key={i} d={d} />)}
    </>);
}

// ────────────────────────────────────────────────
// Sticky footer — ตั้งค่างบ (secondary) + บันทึกรายการ (primary)
// ────────────────────────────────────────────────
function StickyFooter({ accent }) {
  return (
    <div style={{
      padding: '12px 16px 20px',
      background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
      borderTop: `1px solid ${INK.divider}`,
      display: 'flex', gap: 10,
    }}>
      <div style={{
        flex: 1, padding: '14px',
        background: '#fff', border: `1.5px solid ${accent}`,
        color: accent, borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke={accent} strokeWidth="1.8" />
          <path d="M19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 00-2-1.2L14 3h-4l-.5 2.5a7 7 0 00-2 1.2l-2.4-.9-2 3.4 2 1.6A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.5c.7-.3 1.4-.7 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" stroke={accent} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.1 }}>ตั้งค่างบ</div>
      </div>

      <div style={{
        flex: 1.4, padding: '14px',
        background: accent, color: '#fff', borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none',
        boxShadow: `0 6px 18px color-mix(in srgb, ${accent} 35%, transparent)`,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.1 }}>บันทึกรายการ</div>
      </div>
    </div>);
}

function FadedBehind() {
  return (
    <div style={{ padding: '4px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.55 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: W3.n900, letterSpacing: -0.3 }}>การเงิน</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 17V11a6 6 0 0112 0v6l1.5 2H4.5L6 17z" stroke={W3.n700} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 21h4" stroke={W3.n700} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke={W3.n700} strokeWidth="1.8" />
          <path d="M19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 00-2-1.2L14 3h-4l-.5 2.5a7 7 0 00-2 1.2l-2.4-.9-2 3.4 2 1.6A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.5c.7-.3 1.4-.7 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" stroke={W3.n700} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
    </div>);
}

function BudgetDetailV4() {
  const accent = W3.primary400;
  const txCount = BD.days.reduce((s, d) => s + d.txs.length, 0);

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="23:19" />
      <FadedBehind />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 80, bottom: 0,
        background: '#fff',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        boxShadow: '0 -12px 30px rgba(0,0,0,0.10)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <SheetHeader title="งบประมาณ" />
        <div style={{ flex: 1, overflow: 'auto', background: W3.n200, paddingBottom: 90 }}>
          <BudgetHero b={BD.budget} />
          <PaceCard b={BD.budget} c={BD.cycle} />
          <QuickActions accent={accent} />
          <ScopeSection scope={BD.scope} />
          <TransactionsSection days={BD.days} count={txCount} />
        </div>
        <StickyFooter accent={accent} />
      </div>
    </div>);
}

window.BudgetDetailV4 = BudgetDetailV4;
})();
