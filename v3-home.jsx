// Home v3 — AI insight hero ON TOP, chat below it, quick add sticky bottom
const H3 = window.MINT;


function HomeV3({ hideStatusBar = false } = {}) {
  const [insightIdx] = React.useState(0);
  const [nwExpanded, setNwExpanded] = React.useState(false);
  const [nwHidden, setNwHidden] = React.useState(false);
  const insights = [
    { quote: '"เห็นว่าเดือนนี้คุณใช้จ่ายส่วนบันเทิงเยอะกว่าเดือนก่อน 15% เลยนะ"' },
    { quote: '"คุณใกล้ถึงเป้าหมายเที่ยวอังกฤษแล้ว — ออมเพิ่มอีก 21,000 ฿ ก็ถึงแล้วน้า"' },
    { quote: '"งบประมาณเดือนนี้เหลืออีก 8,450 ฿ ใช้อย่างระมัดระวังนะ"' },
  ];
  const ins = insights[insightIdx];

  // Sparkline path — used only when Net Worth card is expanded
  const sparkData = [40, 35, 45, 42, 55, 48, 62];
  const sparkW = 70, sparkH = 22;
  const sparkMax = Math.max(...sparkData), sparkMin = Math.min(...sparkData);
  const sparkPath = sparkData.map((v, i) => {
    const x = (i / (sparkData.length - 1)) * sparkW;
    const y = sparkH - ((v - sparkMin) / (sparkMax - sparkMin)) * (sparkH - 2) - 1;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  // When embedded under RootPager (hideStatusBar=true), the compact segment sits directly above.
  // 32px = Apple HIG large-title spacing — clearly separates Net Worth (hero) from segment (tab control).
  // Standalone HomeV3 keeps its original 0px top — status bar already gives air.
  const topPad = hideStatusBar ? 32 : 0;

  return (
    <div style={{ background: H3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {!hideStatusBar && <MintStatusBarV2 time="21:29" />}

      {!nwExpanded ? (
        /* Compact Net Worth anchor — top-left, bell on right · tap to expand */
        <div style={{ padding: `${topPad}px 16px 16px`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div onClick={() => setNwExpanded(true)} style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: 11, color: H3.n400, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.6 }}>Net Worth</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: H3.n900, letterSpacing: -0.8, lineHeight: 1.1 }}>฿ 125,430</span>
              <span style={{ fontSize: 12, color: H3.primary500, fontWeight: 700 }}>↑ 2.4%</span>
            </div>
          </div>
          {/* Bell only renders standalone — RootPager moves it to segment header */}
          {!hideStatusBar && (
            <div style={{ position: 'relative', marginTop: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V9a6 6 0 00-6-6zM9 18a3 3 0 006 0" stroke={H3.n700} strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              <div style={{ position:'absolute', top:-1, right:-1, width:7, height:7, borderRadius:4, background: H3.error400, border:'1.5px solid #fff' }} />
            </div>
          )}
        </div>
      ) : (
        /* Expanded Net Worth card — full breakdown · tap chevron to collapse */
        <div
          onClick={() => setNwExpanded(false)}
          style={{
            margin: `${topPad}px 16px 12px`,
            background: '#fff', borderRadius: 18,
            padding: '14px 16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            cursor: 'pointer',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 11, color: H3.n400, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>Net Worth</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" onClick={(e) => { e.stopPropagation(); setNwHidden(!nwHidden); }} style={{ cursor: 'pointer' }}>
                {nwHidden
                  ? <path d="M3 3l18 18M10.5 10.7a2 2 0 002.8 2.8M6.5 6.5C4.5 8 3 10 2 12c2 4 6 7 10 7 1.5 0 3-.4 4.3-1M10 5.2A9 9 0 0112 5c4 0 8 3 10 7-.5 1-1.2 2-2 2.8" stroke={H3.n400} strokeWidth="1.6" strokeLinecap="round"/>
                  : <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke={H3.n400} strokeWidth="1.6"/><circle cx="12" cy="12" r="3" stroke={H3.n400} strokeWidth="1.6"/></>}
              </svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(90deg)' }}>
                <path d="M9 6l6 6-6 6" stroke={H3.n400} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: H3.n900, letterSpacing: -0.5 }}>
              {nwHidden ? '฿ •••,•••' : '฿ 125,430'}
            </div>
            <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`}>
              <defs>
                <linearGradient id="nwSparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={H3.primary400} stopOpacity="0.25"/>
                  <stop offset="1" stopColor={H3.primary400} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={`${sparkPath} L ${sparkW} ${sparkH} L 0 ${sparkH} Z`} fill="url(#nwSparkFill)"/>
              <path d={sparkPath} stroke={H3.primary400} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, marginBottom: 10 }}>
            <span style={{ color: H3.primary500, fontWeight: 700 }}>↑ 2,935 ฿ (2.4%)</span>
            <span style={{ color: H3.n400 }}>· 7 วันที่แล้ว</span>
          </div>

          <div style={{
            display: 'flex', gap: 8, paddingTop: 8,
            borderTop: `1px solid ${H3.n300}`,
            fontSize: 11,
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: H3.primary400 }}/>
              <span style={{ color: H3.n400 }}>สินทรัพย์</span>
              <span style={{ color: H3.n900, fontWeight: 600, marginLeft: 'auto' }}>{nwHidden ? '•••' : '460,473 ฿'}</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: H3.error400 }}/>
              <span style={{ color: H3.n400 }}>หนี้สิน</span>
              <span style={{ color: H3.n900, fontWeight: 600, marginLeft: 'auto' }}>{nwHidden ? '•••' : '335,043 ฿'}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 14, paddingBottom: 190 }}>

        {/* HERO AI INSIGHT CARD — Apple Intelligence animated gradient border */}
        <div style={{ margin: '0 16px 12px' }}>
          <div style={{ position: 'relative' }}>
            {/* Blurred glow halo behind the card — the "intelligence" aura */}
            <div className="ai-hero-halo" aria-hidden="true" />

            {/* Flowing gradient ring = the animated border */}
            <div className="ai-hero-ring">
              <div style={{
                background: '#fff',
                borderRadius: 18.4,
                padding: '32px 24px 24px',
                minHeight: 340,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Lightbulb icon — bigger focal */}
                <div style={{ fontSize: 64, marginTop: 48, marginBottom: 24, lineHeight: 1, position: 'relative' }}>💡</div>

                {/* Quote — larger, tighter line-height */}
                <div style={{
                  fontSize: 18, color: H3.n900, textAlign: 'center',
                  lineHeight: 1.5, fontWeight: 500, padding: '0 8px',
                  maxWidth: 290, letterSpacing: -0.1,
                }}>
                  {ins.quote}
                </div>

                {/* Divider + read more */}
                <div style={{
                  marginTop: 32, display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', justifyContent: 'center',
                }}>
                  <div style={{ flex: 1, maxWidth: 60, height: 1, background: H3.n300 }}/>
                  <div style={{ fontSize: 12, color: H3.n600, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.2 }}>อ่านเพิ่ม</div>
                  <div style={{ flex: 1, maxWidth: 60, height: 1, background: H3.n300 }}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming bill — inline alert */}
        <div style={{
          margin: '0 16px',
          background: '#fff', borderRadius: 14,
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          border: `1px solid ${H3.n200}`,
          borderLeft: `3px solid ${H3.warning400}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: H3.walletPink100, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CatIcon kind="movie" size={16} color={H3.walletPink} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: H3.warning400, fontWeight: 600, letterSpacing: 0.1 }}>⚑ ต้องจ่ายใน 2 วัน</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: H3.n900, marginTop: 1, letterSpacing: -0.1 }}>หนัง · 1,111.00 €</div>
          </div>
          <div style={{ fontSize: 12, color: H3.primary500, fontWeight: 700 }}>จ่าย ›</div>
        </div>
      </div>

      {/* Quick Add — sticky at bottom, above nav (KEPT AS-IS) */}
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
            flex: 1, background: H3.primary400, color: '#fff', border: 'none',
            borderRadius: 12, padding: '12px 14px', fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(56,178,172,0.3)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
            บันทึกรายจ่าย
          </button>
          {[
            { ic: '🎤' },
            { ic: '📷' },
            { ic: '⋯' },
          ].map((b, i) => (
            <button key={i} style={{
              width: 44, height: 44, background: H3.n200, border: 'none',
              borderRadius: 12, fontSize: 18, color: H3.n700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'inherit',
            }}>{b.ic}</button>
          ))}
        </div>
      </div>

      <BottomNavV2 active="home" />

      {/* Apple Intelligence-style flowing gradient border + glow halo */}
      <style>{`
        @keyframes aiFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ai-hero-ring {
          position: relative;
          border-radius: 20px;
          padding: 1.6px;
          background: linear-gradient(120deg,
            ${H3.primary400}, ${H3.primary300}, ${H3.walletViolet},
            ${H3.walletPink}, ${H3.info400}, ${H3.primary400});
          background-size: 300% 300%;
          /* animation: aiFlow 8s ease-in-out infinite; */ /* re-enable to flow */
          background: ${H3.n200}; /* HIDE apple-intel border — delete this line to restore gradient */
        }
        .ai-hero-halo {
          display: none; /* HIDE apple-intel glow — delete this line to restore halo */
          position: absolute;
          inset: -4px;
          border-radius: 24px;
          background: linear-gradient(120deg,
            ${H3.primary400}, ${H3.primary300}, ${H3.walletViolet},
            ${H3.walletPink}, ${H3.info400}, ${H3.primary400});
          background-size: 300% 300%;
          filter: blur(10px);
          opacity: 0.28;
          /* animation: aiFlow 8s ease-in-out infinite; */ /* hidden for now — re-enable to flow */
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .ai-hero-ring, .ai-hero-halo { animation: none; }
        }
      `}</style>
    </div>
  );
}

window.HomeV3 = HomeV3;
