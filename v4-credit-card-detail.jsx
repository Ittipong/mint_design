// Credit Card Detail — bottom sheet for a single credit card
//   Hero (card snapshot · ยอดใช้บัตรใบนี้ + เป้าหมาย/note ของ user) → Quick Actions
//   → Billing card (ยอดใช้จ่ายเดือนนี้ · utilization bar · timeline ตัดรอบ/กำหนดชำระ)
//     NOTE: Mint Money ไม่ได้เชื่อมกับ bank API → คำนวณยอดบิลจริง + ขั้นต่ำไม่ได้
//     จึง honest framing: โชว์ "ยอดที่คุณบันทึก" + label ตรงๆ ว่ามาจาก user
//     ไม่แตะขั้นต่ำเลย (ธนาคารแต่ละใบนโยบาย/floor ต่างกัน — เดาแล้ว user เชื่อ = harm)
//   → Recent transactions (group by date) → Sticky footer (บันทึก + ชำระบัตร)
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
//   negSoft is a desaturated coral for "may overspend / urgent" callouts —
//   reads as warning without the alarm-bell saturation of error400.
//   divider is 1-step lighter than n300 to soften list separators.
const INK = {
  muted: '#6B6B78',     // secondary text — labels, hints (AA on white)
  faint: '#9A99A6',     // tertiary text — only for >=11px hints/suffix
  divider: '#ECECF1',   // soft separator
  posInk: '#3F8C5C',    // positive amount text (AA on white)
  negSoft: '#C45A3D',   // desaturated coral for "may overspend" callouts
};

const fmt = (n) => Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtSigned = (n) => `${n < 0 ? '- ' : '+ '}${fmt(n)}`;

// ────────────────────────────────────────────────
// Mock data — KBank Credit (mid-cycle, used > statement)
// ────────────────────────────────────────────────
const CC = {
  account: {
    icon: 'card', bg: W3.walletViolet100, ic: W3.walletViolet,
    name: 'KBank Credit', sub: 'บัตรเครดิต Visa',
    used: 56000, limit: 80000,
    goal: 'ใช้เท่าที่จำเป็น · เก็บเครดิตไว้ใช้ตอนฉุกเฉิน', // user-entered ตอน setup
  },
  billing: {
    // honest data — only what we know from user input
    monthSpent: 13440,       // ยอดที่ user log ในเดือนปฏิทินนี้
    cycleCutDate: '24 พ.ค.', // user-provided ตอน setup card
    daysUntilCut: 9,
    dueDate: '14 มิ.ย.',     // user-provided (มักจะ = ตัดรอบ + ~20 วัน)
    daysUntilDue: 30,
  },
  days: [
    { day: 14, dayName: 'วันพุธ', monthYear: 'พฤษภาคม 2569', total: -2480, txs: [
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Lazada', sub: 'ของใช้ในบ้าน', amt: -1280 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'Foodpanda', sub: 'ข้าวเที่ยง', amt: -195 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Apple', sub: 'iCloud+ รายเดือน', amt: -99 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'After You', sub: 'ของหวาน', amt: -380 },
      { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'Grab', sub: 'อโศก-สีลม', amt: -185 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Shopee', sub: 'ฟิล์มกล้อง', amt: -341 },
    ]},
    { day: 12, dayName: 'วันจันทร์', monthYear: 'พฤษภาคม 2569', total: -3200, txs: [
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ร้านอาหารญี่ปุ่น', sub: 'Ootoya', amt: -680 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Uniqlo', sub: 'เสื้อยืด 3 ตัว', amt: -1290 },
      { icon: 'bill', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Netflix', sub: 'รายเดือน', amt: -419 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'Starbucks', sub: 'กาแฟ + เค้ก', amt: -245 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Watsons', sub: 'ของใช้ส่วนตัว', amt: -566 },
    ]},
    { day: 10, dayName: 'วันเสาร์', monthYear: 'พฤษภาคม 2569', total: -1850, txs: [
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'ปิ้งย่างเกาหลี', sub: 'Bornga', amt: -1450 },
      { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'Bake a Wish', sub: 'เค้กชิ้น', amt: -180 },
      { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'Grab', sub: 'ขากลับ', amt: -220 },
    ]},
    { day: 8, dayName: 'วันพฤหัสบดี', monthYear: 'พฤษภาคม 2569', total: -990, txs: [
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Spotify Premium', sub: 'รายเดือน', amt: -119 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'MK Restaurant', sub: 'มื้อเย็น', amt: -560 },
      { icon: 'coffee', bg: W3.walletPink100, ic: W3.walletPink, name: 'Amazon Cafe', sub: 'อเมริกาโน่', amt: -65 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: '7-Eleven', sub: 'น้ำ + ขนม', amt: -246 },
    ]},
    { day: 5, dayName: 'วันจันทร์', monthYear: 'พฤษภาคม 2569', total: -4920, txs: [
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'IKEA', sub: 'โต๊ะทำงาน', amt: -3490 },
      { icon: 'food', bg: W3.walletBrown100, ic: W3.walletBrown, name: 'Sukishi', sub: 'มื้อกลางวัน', amt: -890 },
      { icon: 'transport', bg: W3.walletRed100, ic: W3.walletRed, name: 'Grab', sub: 'พาของกลับ', amt: -540 },
    ]},
  ],
};

// ────────────────────────────────────────────────
// Sheet header — drag handle + title + close + more
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
// Hero card — same skeleton as WalletDetail HeroCard
// Top row: icon · name · ยอดใช้บัตรใบนี้ (ยอดที่ user บันทึก, รอบบิลปัจจุบัน)
// Bottom row: เป้าหมาย (free-text note ที่ user กรอกตอนสร้างบัตร)
//   Hero number = `used` (ยอดสะสมในบัตรใบนี้) ไม่ใช่ "monthSpent" เพราะ
//   ยอดสะสม / limit คือสิ่งที่ user ต้องตัดสินใจก่อน "รูดต่อ" — เป็น primary anxiety
// ────────────────────────────────────────────────
function CreditHero({ a }) {
  const hasGoal = a.goal && a.goal.trim().length > 0;
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
          {/* Card balance (used) — #1 number on this screen; sized larger than monthSpent
              inside BillingCard so the two don't compete. 800 → 700 (Sarabun-friendly). */}
          <div style={{ fontSize: 22, fontWeight: 700, color: W3.n900, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>
            {fmt(a.used)}
          </div>
          <div style={{ fontSize: 11, color: INK.faint, marginTop: 2, letterSpacing: 0.3 }}>THB</div>
        </div>
      </div>
      {/* Divider: dashed → solid hairline — one calm separator instead of a dotted strip */}
      <div style={{ height: 1, background: INK.divider, margin: '14px 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 13, color: INK.muted, flexShrink: 0, fontWeight: 500 }}>เป้าหมาย</div>
        {hasGoal ? (
          <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 600, color: W3.n800, lineHeight: 1.4 }}>
            {a.goal}
          </div>
        ) : (
          <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 500, color: INK.faint, lineHeight: 1.4 }}>
            ยังไม่ได้ตั้ง · แตะเพื่อเขียน
          </div>
        )}
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Quick actions — match WalletDetail (ดูรายการ · รายงาน)
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
// Billing card — honest reflector (no bank API)
//   Big number: ยอดใช้จ่ายเดือนนี้ (calendar month, จาก tx ที่ user log)
//   Utilization: progress bar — วงเงินที่ใช้ / วงเงินทั้งหมด
//   Timeline: ตัดรอบ + กำหนดชำระ (user-provided)
//   Disclaimer: ตอกย้ำว่ายอดจริงอาจต่าง → ให้เช็คใบจริงก่อนจ่าย
//   ไม่มีขั้นต่ำ (เดาแล้ว harm)
// ────────────────────────────────────────────────
function BillingCard({ b, a }) {
  const dueUrgent = b.daysUntilDue <= 7;
  const cutUrgent = b.daysUntilCut <= 3;
  const pct = Math.round((a.used / a.limit) * 100);
  const pctHigh = pct >= 80;
  // pctHigh uses negSoft (desaturated coral) instead of error400 — the message is
  // "watch this", not "alarm". Hard-saturated red on a frequent screen tires the eye.
  const barColor = pctHigh ? INK.negSoft : a.ic;

  // Timeline chip — bumped to mirror WalletDetail's StatChip:
  //   label 10.5 → 12, value 12 → 14, padding 8/10 → 10/12, gap 8 → 10.
  //   Old micro-text was unreadable at typical viewing distance.
  const TimelineChip = ({ icon, label, date, days, urgent }) =>
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 12,
      background: urgent
        ? `color-mix(in srgb, ${INK.negSoft} 10%, transparent)`
        : W3.n200,
    }}>
      <div style={{ flexShrink: 0, display: 'flex' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* label 12 → 13 to sit on the shared ramp (26/20/14/13/11) */}
        <div style={{ fontSize: 13, color: urgent ? INK.negSoft : INK.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900, marginTop: 2, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', letterSpacing: -0.1 }}>
          {date}<span style={{ fontWeight: 500, color: urgent ? INK.negSoft : INK.faint }}> · อีก {days} วัน</span>
        </div>
      </div>
    </div>;

  return (
    <div style={{ margin: '0 16px 14px', ...card(1), padding: '16px 18px' }}>
      {/* header — utilization is the true hero of this card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: INK.muted, fontWeight: 600 }}>การใช้วงเงิน · รอบบิลนี้</div>
        <div style={{
          width: 22, height: 22, borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
        title="ยอดจริงจากธนาคารอาจต่างจากที่บันทึก — แตะดูรายละเอียด">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={INK.muted} strokeWidth="1.7" />
            <path d="M12 8v.01M12 11v5" stroke={INK.muted} strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Card metric = utilization % (NOT a second baht number).
          The `used` baht figure already lives in the Hero above — repeating it here
          at 28px created two competing giant numbers. The card's unique job is the
          *ratio* (how close to the limit), so % becomes the single card protagonist
          at 20px — clearly subordinate to the 26px Hero balance. */}
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{
          fontSize: 18, fontWeight: 700,
          color: pctHigh ? INK.negSoft : W3.n900,
          letterSpacing: -0.2, lineHeight: 1.15,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {pct}%
        </div>
        <div style={{ fontSize: 13, color: INK.muted, fontWeight: 500 }}>ของวงเงิน</div>
      </div>

      {/* progress bar */}
      <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: W3.n200, overflow: 'hidden' }}>
        <div style={{
          width: `${Math.min(100, pct)}%`, height: '100%',
          background: barColor, borderRadius: 3,
        }} />
      </div>

      {/* Supporting caption — used / limit as small reference text under the bar,
          where the % anchors it. No longer a headline number, so it informs without
          competing. monthSpent moved out of this chunk to reduce simultaneous data points. */}
      <div style={{
        marginTop: 8, fontSize: 13, color: INK.muted, lineHeight: 1.4,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <b style={{ color: W3.n800, fontWeight: 700 }}>฿ {a.used.toLocaleString()}</b>
        {' '}จาก ฿ {a.limit.toLocaleString()}
        <span style={{ color: INK.faint }}> · บันทึกเดือนนี้ ฿ {b.monthSpent.toLocaleString()}</span>
      </div>

      {/* Divider: dashed → solid hairline; 8pt rhythm (16/14) */}
      <div style={{ height: 1, background: INK.divider, margin: '16px 0 14px' }} />

      {/* timeline — ตัดรอบ + กำหนดชำระ side-by-side */}
      <div style={{ display: 'flex', gap: 8 }}>
        <TimelineChip
          urgent={cutUrgent}
          label="ตัดรอบบิล"
          date={b.cycleCutDate}
          days={b.daysUntilCut}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke={cutUrgent ? INK.negSoft : INK.muted} strokeWidth="1.8" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke={cutUrgent ? INK.negSoft : INK.muted} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />
        <TimelineChip
          urgent={dueUrgent}
          label="กำหนดชำระ"
          date={b.dueDate}
          days={b.daysUntilDue}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="13" rx="2" stroke={dueUrgent ? INK.negSoft : INK.muted} strokeWidth="1.8" />
              <path d="M3 10h18" stroke={dueUrgent ? INK.negSoft : INK.muted} strokeWidth="1.8" />
              <path d="M7 15h4" stroke={dueUrgent ? INK.negSoft : INK.muted} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      {/* Trust disclaimer — kept visible (deliberate honesty signal: no bank API), but calmed.
          11.5 ad-hoc → 13 on-ramp; color INK.faint → INK.muted so the footnote passes
          WCAG AA at small size yet still reads quieter than headline text via no bg / thin icon. */}
      <div style={{
        marginTop: 14,
        display: 'flex', alignItems: 'flex-start', gap: 6,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
          <circle cx="12" cy="12" r="9" stroke={INK.muted} strokeWidth="1.8" />
          <path d="M12 8v.01M12 11v5" stroke={INK.muted} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 13, color: INK.muted, lineHeight: 1.4 }}>
          ยอดจริงจากธนาคารอาจต่างจากที่บันทึก — เช็คใบแจ้งหนี้ก่อนชำระ
        </div>
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Transactions — grouped by date (day card) — identical to WalletDetail
// ────────────────────────────────────────────────
function DayCard({ d }) {
  return (
    <div style={{ margin: '0 16px 12px', ...card(1), padding: '14px 16px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 10 }}>
        {/* Date 28 → 26, letter-spacing -1 → -0.5 — tighter feels cramped with tabular digits */}
        <div style={{ fontSize: 26, fontWeight: 700, color: W3.n900, letterSpacing: -0.5, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{d.day}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: W3.n900, lineHeight: 1.2 }}>{d.dayName}</div>
          <div style={{ fontSize: 11.5, color: INK.muted, marginTop: 2 }}>{d.monthYear}</div>
        </div>
        {/* posInk replaces washed walletGreen — AA-compliant at this size */}
        <div style={{ fontSize: 14, fontWeight: 700, color: d.total >= 0 ? INK.posInk : W3.n900, fontVariantNumeric: 'tabular-nums' }}>
          {fmtSigned(d.total)} ฿
        </div>
      </div>
      <div style={{ height: 1, borderTop: `1px dashed ${INK.divider}` }} />
      {d.txs.map((t, i) =>
        // Row padding 8 → 10 for breathing room on long lists
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
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>รายการในรอบบิลนี้</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: INK.muted }}>{count} รายการ</div>
      </div>
      {days.map((d, i) => <DayCard key={i} d={d} />)}
    </>);

}

// ────────────────────────────────────────────────
// Sticky footer — primary บันทึกรายการ + secondary ชำระบัตร
// ────────────────────────────────────────────────
function StickyFooter({ accent }) {
  return (
    <div style={{
      padding: '12px 16px 20px',
      background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
      borderTop: `1px solid ${INK.divider}`,
      display: 'flex', gap: 10,
    }}>
      {/* secondary — ชำระบัตร (outlined accent) */}
      <div style={{
        flex: 1, padding: '14px',
        background: '#fff',
        border: `1.5px solid ${accent}`,
        color: accent, borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="13" rx="2" stroke={accent} strokeWidth="1.8" />
          <path d="M3 10h18" stroke={accent} strokeWidth="1.8" />
          <path d="M7 15h4" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.1 }}>ชำระบัตร</div>
      </div>

      {/* primary — บันทึกรายการ (filled accent) */}
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
// Faded background of "Wallets" page behind the sheet
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
function CreditCardDetailV4() {
  const accent = W3.primary400;
  const txCount = CC.days.reduce((s, d) => s + d.txs.length, 0);

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
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <SheetHeader title="บัตรเครดิต" />
        <div style={{ flex: 1, overflow: 'auto', background: W3.n200, paddingBottom: 90 }}>
          <CreditHero a={CC.account} />
          <BillingCard b={CC.billing} a={CC.account} />
          <QuickActions accent={accent} />
          <TransactionsSection days={CC.days} count={txCount} />
        </div>

        <StickyFooter accent={accent} />
      </div>
    </div>);

}

window.CreditCardDetailV4 = CreditCardDetailV4;
})();
