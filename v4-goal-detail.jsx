// Goal Detail — bottom sheet for a single savings goal
//   Hero (saved / target · %) → Quick Actions
//   → Plan card (ออมเดือนละ · ETA · เหลืออีก · pace bar)
//   → Recent contributions (deposits / withdrawals) → Sticky footer (ถอน + ออม)
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
//   posInk is darker than walletGreen so deposit amounts stay legible without
//   the pastel-on-white contrast failure.
const INK = {
  muted: '#6B6B78',     // secondary text — labels, hints (AA on white)
  faint: '#9A99A6',     // tertiary text — only for >=11px hints/suffix
  divider: '#ECECF1',   // soft separator
  posInk: '#3F8C5C',    // positive amount text (AA on white)
  negSoft: '#C45A3D',   // desaturated coral for "behind plan" callouts
};

const fmt = (n) => Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtSigned = (n) => `${n < 0 ? '- ' : '+ '}${fmt(n)}`;

// ────────────────────────────────────────────────
// Mock data — เที่ยวญี่ปุ่น (62% · 4 months left · on-track)
// ────────────────────────────────────────────────
const GD = {
  goal: {
    icon: 'plane', bg: W3.walletPink100, ic: W3.walletPink,
    name: 'เที่ยวญี่ปุ่น', sub: 'เป้าหมายระยะกลาง',
    saved: 62000, target: 100000,
  },
  plan: {
    monthsLeft: 4,
    eta: 'ก.ย. 2569',
    track: 'on', // 'on' | 'behind' | 'ahead'
    // perMonth & remaining derived in render
  },
  days: [
    { day: 14, dayName: 'วันพุธ', monthYear: 'พฤษภาคม 2569', total: +5000, txs: [
      { icon: 'wallet', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'ออมประจำเดือน', sub: 'โอนจาก ครอบครัว', amt: +5000 },
    ]},
    { day: 7, dayName: 'วันพุธ', monthYear: 'พฤษภาคม 2569', total: +1500, txs: [
      { icon: 'wallet', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'เพิ่มเงินออม', sub: 'โอนจาก TrueMoney', amt: +2500 },
      { icon: 'shopping', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'ถอนชั่วคราว', sub: 'เผื่อค่าใช้จ่าย', amt: -1000 },
    ]},
    { day: 1, dayName: 'วันพฤหัสบดี', monthYear: 'พฤษภาคม 2569', total: +5000, txs: [
      { icon: 'wallet', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'ออมประจำเดือน', sub: 'โอนจาก ครอบครัว', amt: +5000 },
    ]},
    { day: 24, dayName: 'วันพุธ', monthYear: 'เมษายน 2569', total: +3000, txs: [
      { icon: 'wallet', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'โบนัสจ่ายเข้าออม', sub: 'โอนจาก ครอบครัว', amt: +3000 },
    ]},
    { day: 12, dayName: 'วันเสาร์', monthYear: 'เมษายน 2569', total: +4500, txs: [
      { icon: 'wallet', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'ออมประจำเดือน', sub: 'โอนจาก ครอบครัว', amt: +4500 },
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
// Hero — icon | name | big = saved (emotional anchor)
// bottom row = target · %
//   saved = "เก็บมาได้แค่ไหนแล้ว" — sense of accomplishment.
//   The actionable "เหลืออีก" moves to PlanCard hero where it pairs with
//   per-month plan and ETA. Two-stage hierarchy: feel → plan.
// ────────────────────────────────────────────────
function GoalHero({ g }) {
  const pct = Math.round((g.saved / g.target) * 100);
  return (
    <div style={{ margin: '14px 16px 14px', ...card(1), padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CatIcon kind={g.icon} containerSize={56} color={g.ic} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: W3.n900, letterSpacing: -0.1, lineHeight: 1.2 }}>{g.name}</div>
          <div style={{ fontSize: 13, color: INK.muted, marginTop: 3 }}>{g.sub}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {/* Saved — #1 hero of this screen. 800 → 700 (Sarabun-friendly). */}
          <div style={{ fontSize: 26, fontWeight: 700, color: W3.n900, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>
            {fmt(g.saved)}
          </div>
          <div style={{ fontSize: 11, color: INK.faint, marginTop: 2, letterSpacing: 0.3 }}>THB</div>
        </div>
      </div>
      <div style={{ height: 1, borderTop: `1px dashed ${INK.divider}`, margin: '14px 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 12, color: INK.muted, flexShrink: 0, fontWeight: 500 }}>เป้าหมาย</div>
        <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 600, color: W3.n800, fontVariantNumeric: 'tabular-nums', lineHeight: 1.4 }}>
          ฿ {g.target.toLocaleString()} <span style={{ color: INK.faint, fontWeight: 500 }}>· {pct}%</span>
        </div>
      </div>
    </div>);

}

// ────────────────────────────────────────────────
// Quick actions — ดูรายการ · รายงาน
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
// Plan card — protagonist:
//   ออมเดือนละ (hero) + ETA badge + ออมแล้ว/เหลือ + progress bar + status hint
// ────────────────────────────────────────────────
function PlanCard({ g, p }) {
  const remaining = g.target - g.saved;
  const perMonth = Math.ceil(remaining / Math.max(1, p.monthsLeft));
  const pct = Math.round((g.saved / g.target) * 100);
  const isBehind = p.track === 'behind';
  const trackLabel = p.track === 'ahead' ? 'เร็วกว่าแผน' : p.track === 'behind' ? 'ช้ากว่าแผน' : 'ตามแผน';
  const trackColor = isBehind ? INK.negSoft : INK.posInk;

  // Stat chip — mirrors WalletDetail StatChip:
  //   label 10.5 → 12, value 12 → 14, padding 8/10 → 10/12. Old micro-text fails.
  const StatChip = ({ icon, label, value }) =>
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 12,
      background: W3.n200,
    }}>
      <div style={{ flexShrink: 0, display: 'flex' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: INK.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900, marginTop: 2, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', letterSpacing: -0.1 }}>
          {value}
        </div>
      </div>
    </div>;

  return (
    <div style={{ margin: '0 16px 14px', ...card(1), padding: '16px 18px' }}>
      {/* header — title + ETA chip (chip type 11 → 12 so the date is readable) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: INK.muted, fontWeight: 600 }}>แผนการออม</div>
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: W3.n200, fontSize: 12, fontWeight: 700, color: W3.n800,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="15" rx="2" stroke={INK.muted} strokeWidth="1.8" />
            <path d="M4 9h16M9 3v4M15 3v4" stroke={INK.muted} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          ครบ {p.eta} · อีก {p.monthsLeft} เดือน
        </div>
      </div>

      {/* HERO change — was "ต้องออมต่อเดือน" (action), now "เหลือต้องเก็บอีก".
          Reason: when reopening this sheet, the user's first question is
          "ขาดอีกเท่าไหร่ถึงจะถึงเป้า?" — that's the gap-closing number.
          perMonth becomes a sub-line answer to "แล้วต้องเก็บเดือนละเท่าไหร่?".
          Sized 28 (not 30) to stay below GoalHero's 26 + suffix, preventing
          two competing hero numbers on the same screen. */}
      <div style={{
        fontSize: 28, fontWeight: 700, color: W3.n900,
        letterSpacing: -0.3, marginTop: 8, lineHeight: 1.1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        ฿ {remaining.toLocaleString()}
      </div>
      <div style={{ fontSize: 13, color: INK.muted, marginTop: 4, lineHeight: 1.4 }}>
        เหลือต้องเก็บอีก · เดือนละ <b style={{ color: W3.n800, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>฿ {perMonth.toLocaleString()}</b>
      </div>

      {/* progress bar */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: INK.muted, fontWeight: 600 }}>ความคืบหน้า</div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: trackColor,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: trackColor }} />
            {trackLabel} · {pct}%
          </div>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: W3.n200, overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, pct)}%`, height: '100%',
            background: isBehind ? INK.negSoft : g.ic, borderRadius: 3,
          }} />
        </div>
      </div>

      <div style={{ height: 1, borderTop: `1px dashed ${INK.divider}`, margin: '14px 0 12px' }} />

      {/* saved / monthly contribution as stat chips. Swap "เหลืออีก" → "เดือนละ"
          to avoid duplicating the new hero. */}
      <div style={{ display: 'flex', gap: 8 }}>
        <StatChip
          label="ออมแล้ว"
          value={`฿ ${g.saved.toLocaleString()}`}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke={INK.posInk} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatChip
          label="เก็บเดือนละ"
          value={`฿ ${perMonth.toLocaleString()}`}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={INK.muted} strokeWidth="1.8" />
              <path d="M12 7v5l3 2" stroke={INK.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>
    </div>);

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
        <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>การออมล่าสุด</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: INK.muted }}>{count} รายการ</div>
      </div>
      {days.map((d, i) => <DayCard key={i} d={d} />)}
    </>);
}

// ────────────────────────────────────────────────
// Sticky footer — ถอนออก (secondary) + ออมเงิน (primary)
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
          <path d="M12 19V5M5 12l-7-7M12 19l7-7M12 19l-7-7" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.1 }}>ถอนออก</div>
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
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.1 }}>ออมเงิน</div>
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

function GoalDetailV4() {
  const accent = W3.primary400;
  const txCount = GD.days.reduce((s, d) => s + d.txs.length, 0);

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
        <SheetHeader title="เป้าหมาย" />
        <div style={{ flex: 1, overflow: 'auto', background: W3.n200, paddingBottom: 90 }}>
          <GoalHero g={GD.goal} />
          <PlanCard g={GD.goal} p={GD.plan} />
          <QuickActions accent={accent} />
          <TransactionsSection days={GD.days} count={txCount} />
        </div>
        <StickyFooter accent={accent} />
      </div>
    </div>);
}

window.GoalDetailV4 = GoalDetailV4;
})();
