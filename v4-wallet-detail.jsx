// Wallet Detail — bottom sheet for a single account (savings / e-Wallet / cash)
//   Hero (account snapshot) → Quick Actions → Monthly in/out → Top categories
//   → Linked goals/budgets → Recent transactions (grouped by date) → View all CTA
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
//   posInk / negInk are amount-text colors; they are darker than walletGreen / error400
//   so numbers stay legible without resorting to bold red/green.
//   divider is 1-step lighter than n300 to reduce visual noise of dashed lines.
const INK = {
  muted: '#6B6B78',     // secondary text — labels, hints (AA on white)
  faint: '#9A99A6',     // tertiary text — only for >=11px hints
  divider: '#ECECF1',   // soft separator
  posInk: '#3F8C5C',    // positive amount text (AA on white)
  negSoft: '#C45A3D',   // desaturated coral for "may overspend" callouts
};

const fmt = (n) => Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtSigned = (n) => `${n < 0 ? '- ' : '+ '}${fmt(n)}`;

// ────────────────────────────────────────────────
// Mock data — one wallet's detail
// ────────────────────────────────────────────────
const WD = {
  account: {
    icon: 'piggy', bg: W3.walletGreen100, ic: W3.walletGreen,
    name: 'kbank', sub: 'เงินสด', amt: 461528.00,
    purpose: 'จัดการเงินเดือนให้เพียงพอทั้งเดือน',
  },
  month: {
    inAmt: 28500, inDelta: +12,
    outAmt: 12200, outDelta: -5,
    daysInMonth: 31, daysElapsed: 15,
  },
  linked: [
    { type: 'goal', icon: 'plane', bg: W3.walletPink100, ic: W3.walletPink, name: 'เที่ยวญี่ปุ่น', pct: 62, hint: '4 เดือน' },
    { type: 'budget', icon: 'budget', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'งบใช้จ่ายรายเดือน', pct: 69, hint: '฿ 13,800 / 20,000' },
    { type: 'budget', icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'งบกาแฟ+ขนม', pct: 26, hint: '฿ 1,040 / 4,000' },
  ],
  days: [
    { day: 14, dayName: 'วันพุธ', monthYear: 'พฤษภาคม 2569', total: -445, txs: [
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร', sub: 'ข้าวมันไก่', amt: -85 },
      { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'กาแฟ', sub: 'Amazon ลาเต้เย็น', amt: -65 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ช้อปปิ้ง', sub: '7-Eleven', amt: -295 },
    ]},
    { day: 13, dayName: 'วันอังคาร', monthYear: 'พฤษภาคม 2569', total: -915, txs: [
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร', sub: 'ร้านหมูกระทะ', amt: -520 },
      { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'BTS/MRT', sub: 'สยาม-อโศก', amt: -45 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ช้อปปิ้ง', sub: 'Watsons', amt: -350 },
    ]},
    { day: 12, dayName: 'วันจันทร์', monthYear: 'พฤษภาคม 2569', total: +28500, txs: [
      { icon: 'wallet', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'เงินเดือน', sub: 'บริษัท ABC', amt: +28500 },
    ]},
    { day: 11, dayName: 'วันอาทิตย์', monthYear: 'พฤษภาคม 2569', total: -1240, txs: [
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'อาหาร', sub: 'ผัดไทย', amt: -50 },
      { icon: 'bill', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ค่าไฟ', sub: 'การไฟฟ้านครหลวง', amt: -890 },
      { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'กาแฟ', sub: 'Starbucks', amt: -180 },
      { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'แท็กซี่', sub: 'Grab', amt: -120 },
    ]},
    { day: 9, dayName: 'วันศุกร์', monthYear: 'พฤษภาคม 2569', total: -680, txs: [
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร', sub: 'After You', amt: -240 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ช้อปปิ้ง', sub: 'Big C', amt: -440 },
    ]},
    { day: 7, dayName: 'วันพุธ', monthYear: 'พฤษภาคม 2569', total: -310, txs: [
      { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'กาแฟ', sub: 'Amazon', amt: -55 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'อาหาร', sub: 'ก๋วยเตี๋ยว', amt: -75 },
      { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'BTS/MRT', sub: 'สถานี', amt: -45 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ช้อปปิ้ง', sub: 'Tops', amt: -135 },
    ]},
    { day: 5, dayName: 'วันจันทร์', monthYear: 'พฤษภาคม 2569', total: -1150, txs: [
      { icon: 'bill', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ค่าน้ำ', sub: 'การประปา', amt: -320 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหาร', sub: 'ส้มตำ', amt: -130 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ช้อปปิ้ง', sub: 'Lazada', amt: -700 },
    ]},
  ],
};

// ────────────────────────────────────────────────
// Sheet header
// ────────────────────────────────────────────────
function SheetHeader({ title }) {
  return (
    <>
      {/* drag handle */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: W3.n300 }} />
      </div>
      {/* title row */}
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
// Hero card — account snapshot
// ────────────────────────────────────────────────
function HeroCard({ a }) {
  return (
    <div style={{ margin: '14px 16px 14px', ...card(1), padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CatIcon kind={a.icon} containerSize={56} color={a.ic} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: W3.n900, letterSpacing: -0.1, lineHeight: 1.2 }}>{a.name}</div>
          <div style={{ fontSize: 13, color: INK.muted, marginTop: 3 }}>{a.sub}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {/* Wallet balance — this is the #1 number on this screen; sized larger than monthly net below */}
          <div style={{ fontSize: 22, fontWeight: 700, color: W3.n900, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>
            {fmt(a.amt)}
          </div>
          <div style={{ fontSize: 11, color: INK.faint, marginTop: 2, letterSpacing: 0.3 }}>THB</div>
        </div>
      </div>
      {/* Divider: dashed → solid hairline. One calm separator, not a dotted strip-line. */}
      <div style={{ height: 1, background: INK.divider, margin: '14px 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 13, color: INK.muted, flexShrink: 0, fontWeight: 500 }}>เป้าหมาย</div>
        <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 600, color: W3.n800, lineHeight: 1.4 }}>{a.purpose}</div>
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Month picker chip — page-level scope control
// ────────────────────────────────────────────────
function MonthPickerChip() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: W3.n200, borderRadius: 999,
      padding: '8px 12px', cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent', userSelect: 'none',
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke={W3.n700} strokeWidth="1.8" />
        <path d="M4 9h16M9 3v4M15 3v4" stroke={W3.n700} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div style={{ fontSize: 13, fontWeight: 700, color: W3.n900 }}>เดือนนี้</div>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke={W3.n700} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>);

}

// ────────────────────────────────────────────────
// Monthly summary — hero net + in/out breakdown + pace projection
// One card, not three. Net is the hero number user came here to see.
// ────────────────────────────────────────────────
function MonthSummary({ m }) {
  const net = m.inAmt - m.outAmt;
  const netGood = net >= 0;
  const daysLeft = Math.max(0, m.daysInMonth - m.daysElapsed);
  const avgDay = Math.round(m.outAmt / Math.max(1, m.daysElapsed));
  const projectedOut = Math.round(avgDay * m.daysInMonth);
  const projectedNet = m.inAmt - projectedOut;
  const paceOk = projectedNet >= 0;
  const paceLabel = paceOk ?
    `~฿ ${projectedNet.toLocaleString()}` :
    `อาจขาด ~฿ ${Math.abs(projectedNet).toLocaleString()}`;

  // Stat chip — mirrors BillingCard's TimelineChip badge pattern.
  // Amount bumped 12 → 14 because "เข้า/ออก" is the supporting evidence behind the hero net;
  // users glance here second, so it deserves readable size, not micro-text.
  const StatChip = ({ icon, label, amount }) =>
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 12,
      background: W3.n200,
    }}>
      <div style={{ flexShrink: 0, display: 'flex' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* label 12 → 13 to collapse onto the shared ramp (26/20/14/13/11), no ad-hoc sizes */}
        <div style={{ fontSize: 13, color: INK.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900, marginTop: 2, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', letterSpacing: -0.1 }}>
          ฿ {amount.toLocaleString()}
        </div>
      </div>
    </div>;

  return (
    <div style={{ margin: '0 16px 14px' }}>
      {/* hero net card — one card replaces in/out/net stack */}
      <div style={{ ...card(1), padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: INK.muted, fontWeight: 600 }}>กระแสเงินสุทธิ · เดือนนี้</div>
          <MonthPickerChip />
        </div>
        {/* Monthly net — DROPPED 28 → 20 so it sits clearly below the wallet balance (26px hero).
            Previously 28 > 26 inverted the hierarchy and made the two numbers tie/compete.
            Now there is one protagonist (balance) and a clearly-subordinate card metric. */}
        <div style={{
          fontSize: 18, fontWeight: 700,
          color: netGood ? W3.n900 : INK.negSoft,
          letterSpacing: -0.2, marginTop: 6,
          fontVariantNumeric: 'tabular-nums', lineHeight: 1.15,
        }}>
          {netGood ? '+' : '−'}฿ {Math.abs(net).toLocaleString()}
        </div>

        {/* in/out as side-by-side stat chips — mirrors BillingCard's timeline-chip badge.
            Divider dashed → solid hairline; spacing tightened to an 8pt rhythm (16/12). */}
        <div style={{ height: 1, background: INK.divider, margin: '16px 0 12px' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <StatChip
            label="เข้า"
            amount={m.inAmt}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke={W3.walletGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatChip
            label="ออก"
            amount={m.outAmt}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke={INK.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* pace as a single line, no extra card (marginTop 14 → 16 for 8pt rhythm) */}
        <div style={{
          marginTop: 16, fontSize: 13, color: INK.muted,
          display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1.4,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="9" stroke={INK.muted} strokeWidth="1.8" />
            <path d="M12 7v5l3 2" stroke={INK.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>คาดสิ้นเดือน</span>
          <b style={{ color: paceOk ? W3.n900 : INK.negSoft, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{paceLabel}</b>
          <span style={{ color: INK.faint }}>· อีก {daysLeft} วัน</span>
        </div>
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Quick actions — primary CTA + secondary icon strip
// บันทึก is the daily-frequency primary action; โอน/ปรับยอด/รายงาน are secondary.
// ดูรายการทั้งหมด removed — transactions list is below this section already.
// ────────────────────────────────────────────────
function QuickActions({ accent }) {
  const SecondaryChip = ({ icon, label }) =>
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
      {/* secondary strip — 2 navigation chips. Primary/transfer CTAs live in sticky footer. */}
      <div style={{ display: 'flex', gap: 8 }}>
        <SecondaryChip label="ดูรายการ" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h10" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        } />
        <SecondaryChip label="รายงาน" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 20V10M12 20V4M19 20v-7" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        } />
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Linked goals / budgets
// ────────────────────────────────────────────────
function LinkedSection({ list }) {
  return (
    <div style={{ margin: '0 16px 14px', ...card(1), padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>ผูกกับเป้าหมาย / งบ</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: INK.muted }}>{list.length} รายการ</div>
      </div>
      {list.map((l, i) =>
        // Row padding 7 → 9 to hit 44pt tap target with the 32px icon and to give the progress bar air.
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: i === 0 ? 'none' : `1px solid ${INK.divider}` }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: l.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CatIcon kind={l.icon} containerSize={32} color={l.ic} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
              {/* Badge bumped 9 → 10 + padding eased — 9px Thai/Latin caps becomes unreadable at typical viewing distance */}
              <div style={{ fontSize: 10, fontWeight: 700, color: l.ic, background: l.bg, padding: '2px 7px', borderRadius: 6, letterSpacing: 0.4, flexShrink: 0 }}>
                {l.type === 'goal' ? 'GOAL' : 'BUDGET'}
              </div>
            </div>
            <div style={{ marginTop: 6, height: 5, borderRadius: 3, background: W3.n200, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, l.pct)}%`, height: '100%', background: l.ic, borderRadius: 3 }} />
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{l.pct}%</div>
            <div style={{ fontSize: 11, color: INK.muted, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{l.hint}</div>
          </div>
        </div>
      )}
    </div>);

}

// ────────────────────────────────────────────────
// Transactions — grouped by date (day card)
// ────────────────────────────────────────────────
function DayCard({ d }) {
  return (
    // padding-bottom 4 → 8 so the last tx row breathes; horizontal 14 → 16 for visual rhythm with hero cards above.
    <div style={{ margin: '0 16px 12px', ...card(1), padding: '14px 16px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 10 }}>
        {/* Date number tightened: 28 → 26, letterSpacing softened — -1 was too crowded for tabular digits */}
        <div style={{ fontSize: 26, fontWeight: 700, color: W3.n900, letterSpacing: -0.5, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{d.day}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: W3.n900, lineHeight: 1.2 }}>{d.dayName}</div>
          <div style={{ fontSize: 11.5, color: INK.muted, marginTop: 2 }}>{d.monthYear}</div>
        </div>
        {/* Day total — uses posInk (darker green, AA-compliant) instead of pastel walletGreen which fails contrast at this size */}
        <div style={{ fontSize: 14, fontWeight: 700, color: d.total >= 0 ? INK.posInk : W3.n900, fontVariantNumeric: 'tabular-nums' }}>
          {fmtSigned(d.total)} ฿
        </div>
      </div>
      <div style={{ height: 1, borderTop: `1px dashed ${INK.divider}` }} />
      {d.txs.map((t, i) =>
        // Row padding 8 → 10 — more vertical air makes a long list scannable without crowding
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
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>รายการล่าสุด</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: INK.muted }}>{count} รายการ</div>
      </div>
      {days.map((d, i) => <DayCard key={i} d={d} />)}
    </>);

}

function ViewAllCTA({ accent }) {
  return (
    <div style={{ margin: '4px 16px 20px' }}>
      <div style={{
        width: '100%', padding: '12px 16px',
        background: `color-mix(in srgb, ${accent} 14%, transparent)`,
        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: accent }}>ดูทั้งหมด</div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Sticky primary CTA — bottom of sheet, always reachable while scrolling
// ────────────────────────────────────────────────
function StickyRecordButton({ accent }) {
  return (
    <div style={{
      padding: '12px 16px 20px',
      background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
      borderTop: `1px solid ${INK.divider}`,
      display: 'flex', gap: 10,
    }}>
      {/* secondary — โอน (outlined, accent border + text) */}
      <div style={{
        flex: 1, padding: '14px',
        background: '#fff',
        border: `1.5px solid ${accent}`,
        color: accent, borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 8h14m-3-3l3 3-3 3M20 16H6m3 3l-3-3 3-3" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.1 }}>โอน</div>
      </div>

      {/* primary — บันทึกรายการ (filled accent, bigger flex weight) */}
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

// ────────────────────────────────────────────────
// Faded background of the "Wallets" page behind the sheet
// ────────────────────────────────────────────────
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

// ────────────────────────────────────────────────
// Main screen — modal sheet over faded Wallets header
// ────────────────────────────────────────────────
function WalletDetailV4() {
  // CTAs use the app's primary color, not the wallet's icon color —
  // primary keeps the action language consistent across all wallets.
  const accent = W3.primary400;
  const txCount = WD.days.reduce((s, d) => s + d.txs.length, 0);

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="23:19" />

      {/* faded wallets header behind the sheet */}
      <FadedBehind />

      {/* dim backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', pointerEvents: 'none' }} />

      {/* the sheet — overlays the rest of the screen */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 80, bottom: 0,
        background: '#fff',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        boxShadow: '0 -12px 30px rgba(0,0,0,0.10)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <SheetHeader title="กระเป๋าเงิน" />
        <div style={{ flex: 1, overflow: 'auto', background: W3.n200, paddingBottom: 90 }}>
          <HeroCard a={WD.account} />
          <MonthSummary m={WD.month} />
          <QuickActions accent={accent} />
          <LinkedSection list={WD.linked} />
          <TransactionsSection days={WD.days} count={txCount} />
        </div>

        {/* sticky primary CTA — sits above scroll, always reachable */}
        <StickyRecordButton accent={accent} />
      </div>
    </div>);

}

window.WalletDetailV4 = WalletDetailV4;
})();
