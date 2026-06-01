// Financial Summary — bottom sheet opened by tapping the Net Worth header on Home.
//   PURPOSE: help the user UNDERSTAND their money at a glance — not list accounts.
//   Health-dashboard layout: Net Worth hero → health score + ratios → asset/liability
//   summary cards → composition → actionable insights. Reuses v4 sheet primitives.
(function () {
const NW = window.MINT;

const card = (elev = 1) => ({
  background: '#fff', borderRadius: 16,
  boxShadow: elev === 2 ?
    '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.05)' :
    '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
});
const INK = {
  muted: '#6B6B78',
  faint: '#9A99A6',
  divider: '#ECECF1',
  posInk: '#3F8C5C',   // asset / good
  negSoft: '#C45A3D',  // liability / debt
};
const fmt = (n) => Math.abs(n).toLocaleString('en-US');

// ────────────────────────────────────────────────
// Summary figures (reconciled): สินทรัพย์ − หนี้สิน = 125,430
// ────────────────────────────────────────────────
const ASSET = 460473;
const LIAB = 335043;
const NETWORTH = ASSET - LIAB;          // 125,430
const LIQUID = 335473;                   // เงินสด + บัญชีออม
const GOALS = 125000;                    // เป้าหมายออม
const DEBT_RATIO = Math.round((LIAB / ASSET) * 100);  // 73%
const SAVE_RATE = 18;                    // อัตราออม (รายรับ → ออม)
const RUNWAY = 6;                        // สภาพคล่อง (เดือน)
const SCORE = 72;                        // health score 0-100
const DEBT_INTEREST = 3400;              // ดอกเบี้ยโดยประมาณ/เดือน
const DEBT_LIMIT = 450000;
const DEBT_UTIL = Math.round((LIAB / DEBT_LIMIT) * 100);  // 74%
const DEBT_DOWN = 12000;                 // หนี้ลดลงเดือนนี้

const SPARK = [40, 35, 45, 42, 55, 48, 62];

// Score band → label + color
function scoreBand(s) {
  if (s >= 80) return { label: 'ดีมาก', color: NW.walletGreen };
  if (s >= 60) return { label: 'ดี', color: NW.primary500 };
  if (s >= 40) return { label: 'พอใช้', color: NW.warning400 };
  return { label: 'ควรปรับ', color: NW.walletRed };
}

// ────────────────────────────────────────────────
// Sheet header
// ────────────────────────────────────────────────
function SheetHeader() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: NW.n300 }} />
      </div>
      <div style={{ padding: '6px 18px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={NW.n800} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: NW.n900 }}>สรุปการเงิน</div>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.6" fill={NW.n800} />
            <circle cx="12" cy="12" r="1.6" fill={NW.n800} />
            <circle cx="12" cy="19" r="1.6" fill={NW.n800} />
          </svg>
        </div>
      </div>
      <div style={{ height: 1, background: INK.divider }} />
    </>
  );
}

// ────────────────────────────────────────────────
// Hero — net worth + change + sparkline + hide toggle
// ────────────────────────────────────────────────
function HeroCard({ hidden, onToggle }) {
  const w = 88, h = 32;
  const max = Math.max(...SPARK), min = Math.min(...SPARK);
  const path = SPARK.map((v, i) => {
    const x = (i / (SPARK.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 3) - 1.5;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div style={{ margin: '14px 16px 12px', ...card(1), padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: INK.muted, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>Net Worth</div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" onClick={onToggle} style={{ cursor: 'pointer' }}>
          {hidden
            ? <path d="M3 3l18 18M10.5 10.7a2 2 0 002.8 2.8M6.5 6.5C4.5 8 3 10 2 12c2 4 6 7 10 7 1.5 0 3-.4 4.3-1M10 5.2A9 9 0 0112 5c4 0 8 3 10 7-.5 1-1.2 2-2 2.8" stroke={INK.faint} strokeWidth="1.6" strokeLinecap="round" />
            : <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke={INK.faint} strokeWidth="1.6" /><circle cx="12" cy="12" r="3" stroke={INK.faint} strokeWidth="1.6" /></>}
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: NW.n900, letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>
          ฿ {hidden ? '•••,•••' : fmt(NETWORTH)}
        </div>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ marginBottom: 2 }}>
          <defs>
            <linearGradient id="nwHeroSpark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={NW.primary400} stopOpacity="0.22" />
              <stop offset="1" stopColor={NW.primary400} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#nwHeroSpark)" />
          <path d={path} stroke={NW.primary400} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginTop: 6 }}>
        <span style={{ color: NW.primary500, fontWeight: 700 }}>↑ 2,935 ฿ (2.4%)</span>
        <span style={{ color: INK.faint }}>· 7 วันที่แล้ว</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Health score — score ring + key ratios (the "how am I doing" card)
// ────────────────────────────────────────────────
function ScoreRing({ score, color }) {
  const r = 32, c = 2 * Math.PI * r, off = c * (1 - score / 100);
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
      <circle cx="40" cy="40" r={r} stroke={NW.n200} strokeWidth="7" fill="none" />
      <circle cx="40" cy="40" r={r} stroke={color} strokeWidth="7" fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
        transform="rotate(-90 40 40)" />
      <text x="40" y="38" textAnchor="middle" fontSize="22" fontWeight="700" fill={NW.n900} fontFamily="Sarabun, sans-serif">{score}</text>
      <text x="40" y="52" textAnchor="middle" fontSize="9" fill={INK.faint} fontFamily="Sarabun, sans-serif">/ 100</text>
    </svg>
  );
}

function RatioRow({ label, value, status }) {
  // status: 'good' | 'warn' | 'bad'
  const map = {
    good: { color: INK.posInk, dot: NW.walletGreen },
    warn: { color: NW.warning400, dot: NW.warning400 },
    bad:  { color: INK.negSoft, dot: NW.walletRed },
  };
  const m = map[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
      <div style={{ width: 7, height: 7, borderRadius: 4, background: m.dot, flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13, color: INK.muted, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function HealthCard() {
  const band = scoreBand(SCORE);
  return (
    <div style={{ margin: '0 16px 12px', ...card(1), padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <ScoreRing score={SCORE} color={band.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: INK.muted, fontWeight: 600 }}>สุขภาพการเงิน</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: band.color, lineHeight: 1.2, marginTop: 2 }}>{band.label}</div>
          <div style={{ fontSize: 12, color: INK.faint, marginTop: 3, lineHeight: 1.4 }}>
            ออมสม่ำเสมอ แต่ภาระหนี้ยังสูง — ลดหนี้บัตรเพื่อยกระดับ
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: INK.divider, margin: '12px 0 4px' }} />
      <RatioRow label="หนี้ต่อสินทรัพย์" value={`${DEBT_RATIO}%`} status="warn" />
      <RatioRow label="สภาพคล่อง (เดือนสำรอง)" value={`~${RUNWAY} เดือน`} status="good" />
      <RatioRow label="อัตราการออม" value={`${SAVE_RATE}%`} status="good" />
    </div>
  );
}

// ────────────────────────────────────────────────
// Two summary cards — สินทรัพย์ vs หนี้สิน (rolled-up, not per-account)
// ────────────────────────────────────────────────
function SummaryTile({ label, amount, sub, accent, trend, hidden }) {
  return (
    <div style={{ flex: 1, ...card(1), padding: '14px 14px 13px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: accent }} />
      <div style={{ fontSize: 12, color: INK.muted, fontWeight: 600, marginLeft: 4 }}>{label}</div>
      <div style={{ fontSize: 21, fontWeight: 700, color: NW.n900, letterSpacing: -0.4, fontVariantNumeric: 'tabular-nums', marginTop: 4, marginLeft: 4 }}>
        {hidden ? '•••' : fmt(amount)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, marginLeft: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: trend.color }}>{trend.text}</span>
      </div>
      <div style={{ fontSize: 11, color: INK.faint, marginTop: 5, marginLeft: 4, lineHeight: 1.3 }}>{sub}</div>
    </div>
  );
}

function SummaryRow({ hidden }) {
  return (
    <div style={{ margin: '0 16px 12px', display: 'flex', gap: 12 }}>
      <SummaryTile
        label="สินทรัพย์" amount={ASSET} accent={NW.walletGreen}
        trend={{ text: '↑ โต 1.8%', color: INK.posInk }}
        sub={`เงินสดคล่อง ${Math.round((LIQUID / ASSET) * 100)}%`} hidden={hidden} />
      <SummaryTile
        label="หนี้สิน" amount={LIAB} accent={NW.walletRed}
        trend={{ text: '↓ ลด 3.4%', color: INK.posInk }}
        sub={`ดอกเบี้ย ~${fmt(DEBT_INTEREST)}/เดือน`} hidden={hidden} />
    </div>
  );
}

// ────────────────────────────────────────────────
// Composition — asset breakdown bar + debt rollup
// ────────────────────────────────────────────────
function CompositionCard({ hidden }) {
  const liqPct = Math.round((LIQUID / ASSET) * 100);
  return (
    <div style={{ margin: '0 16px 12px', ...card(1), padding: '16px 18px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: NW.n900, marginBottom: 12 }}>องค์ประกอบสินทรัพย์</div>
      <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ width: `${liqPct}%`, background: NW.walletGreen }} />
        <div style={{ flex: 1, background: NW.walletPink }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: NW.walletGreen }} />
          <div>
            <div style={{ fontSize: 12, color: INK.muted }}>เงินสด + ออม</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NW.n900, fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>
              {hidden ? '•••' : fmt(LIQUID)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: INK.muted }}>เป้าหมายออม</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NW.n900, fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>
              {hidden ? '•••' : fmt(GOALS)}
            </div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: NW.walletPink }} />
        </div>
      </div>

      <div style={{ height: 1, background: INK.divider, margin: '14px 0' }} />

      <div style={{ fontSize: 14, fontWeight: 700, color: NW.n900, marginBottom: 12 }}>ภาระหนี้</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: INK.muted }}>วงเงินใช้ไป (utilization)</div>
          <div style={{ marginTop: 6, height: 8, borderRadius: 4, background: NW.n200, overflow: 'hidden' }}>
            <div style={{ width: `${DEBT_UTIL}%`, height: '100%', borderRadius: 4, background: DEBT_UTIL >= 80 ? NW.walletRed : NW.warning400 }} />
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: DEBT_UTIL >= 80 ? INK.negSoft : NW.warning400, fontVariantNumeric: 'tabular-nums' }}>{DEBT_UTIL}%</div>
      </div>
      <div style={{ fontSize: 11, color: INK.faint, marginTop: 8 }}>
        บัตรเครดิต 2 ใบ · ดอกเบี้ยรวม ~{fmt(DEBT_INTEREST)} ฿/เดือน
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Insights — actionable narrative (what should I do)
// ────────────────────────────────────────────────
function InsightCard({ emoji, title, body, cta, accentBg, accentBorder }) {
  return (
    <div style={{
      margin: '0 16px 10px', ...card(1),
      padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12,
      borderLeft: `3px solid ${accentBorder}`,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NW.n900, lineHeight: 1.25 }}>{title}</div>
        <div style={{ fontSize: 12, color: INK.muted, marginTop: 2, lineHeight: 1.35 }}>{body}</div>
      </div>
      {cta && <div style={{ fontSize: 13, color: NW.primary500, fontWeight: 700, flexShrink: 0 }}>{cta} ›</div>}
    </div>
  );
}

function Insights() {
  return (
    <div style={{ marginTop: 2 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: NW.n900, margin: '0 22px 8px' }}>คำแนะนำ</div>
      <InsightCard
        emoji="🎉" accentBg={NW.walletGreen100} accentBorder={NW.walletGreen}
        title={`หนี้ลดลง ${fmt(DEBT_DOWN)} ฿ เดือนนี้`}
        body="ทำได้ดีมาก — รักษาจังหวะนี้ไว้จะปลอดบัตรเร็วขึ้น" />
      <InsightCard
        emoji="⏰" accentBg={NW.walletPink100} accentBorder={NW.warning400}
        title="ต้องจ่ายบัตร SCB ใน 5 วัน"
        body="ขั้นต่ำ 12,350 ฿ · จ่ายเต็มเพื่อเลี่ยงดอกเบี้ย" cta="จ่าย" />
    </div>
  );
}

// ────────────────────────────────────────────────
// Sheet body (scrollable)
// ────────────────────────────────────────────────
function SheetBody() {
  const [hidden, setHidden] = React.useState(false);
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 28, background: NW.n200 }}>
      <HeroCard hidden={hidden} onToggle={() => setHidden(h => !h)} />
      <HealthCard />
      <SummaryRow hidden={hidden} />
      <CompositionCard hidden={hidden} />
      <Insights />
    </div>
  );
}

// ────────────────────────────────────────────────
// Artboard — Home behind + dim backdrop + sheet
// ────────────────────────────────────────────────
function NetWorthDetailV5() {
  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', background: NW.n200 }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <HomeScreen />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 64,
        background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <SheetHeader />
        <SheetBody />
      </div>
    </div>
  );
}

window.NetWorthDetailV5 = NetWorthDetailV5;
})();
