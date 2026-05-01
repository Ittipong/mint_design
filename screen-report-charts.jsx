// Report Charts screen — line chart (income/expense) + bar chart trends
const MRC = window.MINT;

// Line chart: pink = expenses, teal = income
function LineChart() {
  // Mock data for 30 days
  // Expense (pink) - big spike around day 4-5
  // Income (teal) - big spike at day 1, small later
  const w = 320, h = 180, pad = { t: 10, r: 12, b: 22, l: 28 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;

  // income: start high (30k at day 1), then near 0, except small bump
  const income = [30, 28, 1, -10, 0, 2, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // expense: low, spike to 14k at day 5, then ~0
  const expense = [0, 0, 0, 2, 14, 8, 3, 1, 0.5, 0.5, 0.5, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3];

  const max = 30;
  const min = -10;
  const x = (i) => pad.l + (i / 29) * iw;
  const y = (v) => pad.t + ih * (1 - (v - min) / (max - min));

  const toPath = (arr) => arr.map((v, i) => `${i===0?'M':'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {/* gridlines */}
      {[30, 20, 10, 0].map(v => (
        <g key={v}>
          <line x1={pad.l} x2={w-pad.r} y1={y(v)} y2={y(v)} stroke="#F0F0F0" strokeDasharray="3 3"/>
          <text x={2} y={y(v)+3} fontSize="10" fill={MRC.n400}>{v===0?'0':`${v}k`}</text>
        </g>
      ))}
      {/* x labels */}
      {[0, 6, 12, 29].map((i, k) => (
        <g key={i}>
          <text x={x(i)} y={h-9} fontSize="9" fill={MRC.n400} textAnchor="middle">
            {k === 3 ? 'วันนี้' : (i+1)}
          </text>
          {k < 3 && (
            <text x={x(i)} y={h-0} fontSize="8" fill={MRC.n400} textAnchor="middle">เม.ย.</text>
          )}
        </g>
      ))}
      {/* expense line */}
      <path d={toPath(expense)} stroke={MRC.error300} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* income line */}
      <path d={toPath(income)} stroke={MRC.primary400} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BarChart() {
  // three months of bars, teal/red/violet groups
  const w = 320, h = 200, pad = { t: 10, r: 12, b: 20, l: 32 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const max = 75, min = -25;
  const y = (v) => pad.t + ih * (1 - (v - min) / (max - min));
  const zeroY = y(0);

  // groups with bars: teal(income), pink(expense), violet(other)
  const groups = [
    { tealTop: 32, tealBot: -5, pinkTop: 10, pinkBot: -22, violet: 8 },
    { tealTop: 38, tealBot: -3, pinkTop: 8, pinkBot: -20, violet: 5 },
    { tealTop: 62, tealBot: -8, pinkTop: 12, pinkBot: -25, violet: 0 },
    { tealTop: 28, tealBot: -6, pinkTop: 26, pinkBot: -18, violet: 8 },
  ];

  const barW = 7;
  const groupGap = iw / groups.length;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {[75, 50, 25, 0, -25].map(v => (
        <g key={v}>
          <line x1={pad.l} x2={w-pad.r} y1={y(v)} y2={y(v)} stroke={v===0?MRC.n400:'#F0F0F0'} strokeDasharray={v===0?undefined:'3 3'} strokeWidth={v===0?0.8:1}/>
          <text x={2} y={y(v)+3} fontSize="10" fill={MRC.n400}>{v===0?'0':(v>0?`${v}k`:`-${Math.abs(v)}k`)}</text>
        </g>
      ))}
      {groups.map((g, i) => {
        const gx = pad.l + groupGap * i + groupGap / 2;
        const xs = [gx - barW*1.4, gx, gx + barW*1.4];
        return (
          <g key={i}>
            {/* teal */}
            <rect x={xs[0]-barW/2} y={y(g.tealTop)} width={barW} height={zeroY - y(g.tealTop)} rx="1.5" fill={MRC.primary300}/>
            <rect x={xs[0]-barW/2} y={zeroY} width={barW} height={y(g.tealBot) - zeroY} rx="1.5" fill={MRC.primary200} opacity="0.6"/>
            {/* pink */}
            <rect x={xs[1]-barW/2} y={y(g.pinkTop)} width={barW} height={zeroY - y(g.pinkTop)} rx="1.5" fill={MRC.error300}/>
            <rect x={xs[1]-barW/2} y={zeroY} width={barW} height={y(g.pinkBot) - zeroY} rx="1.5" fill={MRC.error200} opacity="0.8"/>
            {/* violet */}
            <rect x={xs[2]-barW/2} y={y(g.violet > 0 ? g.violet : 2)} width={barW} height={Math.abs(zeroY - y(g.violet > 0 ? g.violet : 2))} rx="1.5" fill={MRC.walletViolet}/>
          </g>
        );
      })}
    </svg>
  );
}

function ReportChartsScreen() {
  return (
    <div style={{
      background: MRC.n200, height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 84 }}>
        <ReportHeader time="21:38" />
        <RMonthTabs />
        <div style={{ height: 1, background: MRC.n300, opacity: 0.6 }} />

        {/* Daily income/expense line */}
        <div style={{
          margin: '12px 16px 0',
          background: '#fff', borderRadius: 16, padding: '14px 16px 10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: MRC.n900 }}>สมุดรายรับ-รายจ่าย</div>
            <div style={{ fontSize: 12, color: MRC.primary500, fontWeight: 600 }}>ดูทั้งหมด</div>
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
            <LineChart />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: MRC.n700 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: MRC.error300 }} />
              รายจ่าย
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: MRC.n700 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: MRC.primary400 }} />
              รายรับ
            </div>
          </div>
        </div>

        {/* Trend bar chart */}
        <div style={{
          margin: '12px 16px 0',
          background: '#fff', borderRadius: 16, padding: '14px 16px 10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: MRC.n900 }}>แนวโน้มการเงิน</div>
            <div style={{ fontSize: 12, color: MRC.primary500, fontWeight: 600 }}>ดูทั้งหมด</div>
          </div>
          <div style={{
            marginTop: 6, textAlign: 'right',
            fontSize: 12, color: MRC.n600,
          }}>
            รายรับ <span style={{ color: MRC.error400, fontWeight: 700 }}>↓41.6%</span>
            <span style={{ marginLeft: 10 }}>รายจ่าย <span style={{ color: MRC.error400, fontWeight: 700 }}>↑33.6%</span></span>
          </div>
          <div style={{ fontSize: 10, color: MRC.n400, textAlign: 'right', marginTop: 2 }}>
            จากค่าเฉลี่ย 3 เดือนที่แล้ว
          </div>
          <div style={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
            <BarChart />
          </div>
        </div>
      </div>

      <MintFab bottom={100} right={20} />
      <BottomNav active="report" />
    </div>
  );
}

window.ReportChartsScreen = ReportChartsScreen;
