// Home v3-temp — Option B' (compact Net Worth hero) + avatar-only greeting
// Priority: AI Insight = star, Net Worth = informational header
const HT = window.MINT;

function HomeV3Temp() {
  const [insightIdx, setInsightIdx] = React.useState(0);
  const [hidden, setHidden] = React.useState(false);
  const insights = [
    { quote: '"เห็นว่าเดือนนี้คุณใช้จ่ายส่วนบันเทิงเยอะกว่าเดือนก่อน 15% เลยนะ"' },
    { quote: '"คุณใกล้ถึงเป้าหมายเที่ยวอังกฤษแล้ว — ออมเพิ่มอีก 21,000 ฿ ก็ถึงแล้วน้า"' },
    { quote: '"งบประมาณเดือนนี้เหลืออีก 8,450 ฿ ใช้อย่างระมัดระวังนะ"' },
  ];
  const ins = insights[insightIdx];

  // Sparkline path
  const sparkData = [40, 35, 45, 42, 55, 48, 62];
  const sparkW = 70, sparkH = 22;
  const sparkMax = Math.max(...sparkData), sparkMin = Math.min(...sparkData);
  const sparkPath = sparkData.map((v, i) => {
    const x = (i / (sparkData.length - 1)) * sparkW;
    const y = sparkH - ((v - sparkMin) / (sparkMax - sparkMin)) * (sparkH - 2) - 1;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div style={{ background: HT.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBarV2 time="21:29" />

      {/* Compact header: avatar + streak + notification */}
      <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 17,
          background: `linear-gradient(135deg, ${HT.walletPink}, ${HT.walletViolet})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 14, fontWeight: 700,
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        }}>ภ</div>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: HT.warning400 }}>
          🔥 7 วัน
        </div>
        <div style={{ position: 'relative' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V9a6 6 0 00-6-6zM9 18a3 3 0 006 0" stroke={HT.n700} strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          <div style={{ position:'absolute', top:-1, right:-1, width:7, height:7, borderRadius:4, background: HT.error400, border:'1.5px solid #fff' }} />
        </div>
      </div>

      {/* Net Worth Hero compact — 110px */}
      <div style={{
        margin: '0 16px 12px',
        background: '#fff', borderRadius: 18,
        padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: HT.n400, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>Net Worth</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" onClick={() => setHidden(!hidden)} style={{ cursor: 'pointer' }}>
              {hidden
                ? <path d="M3 3l18 18M10.5 10.7a2 2 0 002.8 2.8M6.5 6.5C4.5 8 3 10 2 12c2 4 6 7 10 7 1.5 0 3-.4 4.3-1M10 5.2A9 9 0 0112 5c4 0 8 3 10 7-.5 1-1.2 2-2 2.8" stroke={HT.n400} strokeWidth="1.6" strokeLinecap="round"/>
                : <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke={HT.n400} strokeWidth="1.6"/><circle cx="12" cy="12" r="3" stroke={HT.n400} strokeWidth="1.6"/></>}
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke={HT.n400} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: HT.n900, letterSpacing: -0.5 }}>
            {hidden ? '฿ •••,•••' : '฿ 125,430'}
          </div>
          <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`}>
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={HT.primary400} stopOpacity="0.25"/>
                <stop offset="1" stopColor={HT.primary400} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`${sparkPath} L ${sparkW} ${sparkH} L 0 ${sparkH} Z`} fill="url(#sparkFill)"/>
            <path d={sparkPath} stroke={HT.primary400} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, marginBottom: 10 }}>
          <span style={{ color: HT.primary500, fontWeight: 700 }}>↑ 2,935 ฿ (2.4%)</span>
          <span style={{ color: HT.n400 }}>· 7 วันที่แล้ว</span>
        </div>

        <div style={{
          display: 'flex', gap: 8, paddingTop: 8,
          borderTop: `1px solid ${HT.n300}`,
          fontSize: 11,
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: HT.primary400 }}/>
            <span style={{ color: HT.n400 }}>สินทรัพย์</span>
            <span style={{ color: HT.n900, fontWeight: 600, marginLeft: 'auto' }}>{hidden ? '•••' : '460,473 ฿'}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: HT.error400 }}/>
            <span style={{ color: HT.n400 }}>หนี้สิน</span>
            <span style={{ color: HT.n900, fontWeight: 600, marginLeft: 'auto' }}>{hidden ? '•••' : '335,043 ฿'}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 190 }}>

        {/* HERO AI INSIGHT CARD */}
        <div style={{ margin: '0 16px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13 }}>✦</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: HT.n900 }}>AI Insight ประจำวัน</span>
            </div>
            <div style={{ fontSize: 10, color: HT.n400 }}>อัปเดต 5 ชม. ที่แล้ว</div>
          </div>

          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '28px 24px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
            minHeight: 260,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 80,
              background: `radial-gradient(ellipse at top left, ${HT.walletPink100} 0%, transparent 60%)`,
              borderTopLeftRadius: 20, borderTopRightRadius: 20,
              pointerEvents: 'none', opacity: 0.6,
            }}/>
            <div style={{ fontSize: 46, marginTop: 20, marginBottom: 18, lineHeight: 1, position: 'relative' }}>💡</div>
            <div style={{
              fontSize: 15, color: HT.n900, textAlign: 'center',
              lineHeight: 1.55, fontWeight: 500, padding: '0 12px',
              maxWidth: 280, position: 'relative',
            }}>
              {ins.quote}
            </div>
            <div style={{
              marginTop: 24, display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', justifyContent: 'center',
            }}>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: HT.n300 }}/>
              <div style={{ fontSize: 13, color: HT.n600, fontWeight: 500, cursor: 'pointer' }}>อ่านเพิ่ม</div>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: HT.n300 }}/>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            {insights.map((_, i) => (
              <div key={i} onClick={() => setInsightIdx(i)} style={{
                width: i === insightIdx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === insightIdx ? HT.primary400 : HT.n300,
                transition: 'all 0.2s', cursor: 'pointer',
              }} />
            ))}
          </div>
        </div>

        {/* AI Chat entry */}
        <div style={{
          margin: '0 16px 12px',
          background: `linear-gradient(135deg, ${HT.walletViolet100} 0%, #fff 45%, ${HT.primary100} 100%)`,
          borderRadius: 18,
          border: `1px solid ${HT.walletViolet100}`,
          padding: '14px 14px 12px',
          boxShadow: '0 2px 10px rgba(148,154,235,0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `linear-gradient(135deg, ${HT.walletViolet} 0%, ${HT.primary400} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15,
              boxShadow: '0 2px 6px rgba(148,154,235,0.35)',
            }}>✦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: HT.n900 }}>สอบถาม AI</div>
              <div style={{ fontSize: 11, color: HT.n600 }}>ถามคำถามเกี่ยวกับการเงินของคุณ</div>
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.75)',
            border: `1px solid rgba(148,154,235,0.25)`,
            borderRadius: 22,
            padding: '9px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 10,
          }}>
            <div style={{ flex: 1, fontSize: 12, color: HT.n400, fontStyle: 'italic' }}>
              พิมพ์คำถามของคุณ...
            </div>
            <div style={{
              width: 26, height: 26, borderRadius: 13,
              background: `linear-gradient(135deg, ${HT.walletViolet} 0%, ${HT.primary400} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M4 20l16-8L4 4v6l10 2-10 2v6z" fill="#fff"/>
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              '💡 เดือนนี้ใช้อะไรเยอะสุด?',
              '📈 ออมได้เท่าไหร่?',
              '🎯 ถึงเป้าเมื่อไหร่?',
            ].map((s, i) => (
              <div key={i} style={{
                fontSize: 11, padding: '6px 10px', borderRadius: 14,
                background: 'rgba(255,255,255,0.85)',
                border: `1px solid rgba(148,154,235,0.3)`,
                color: HT.n700, fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Upcoming bill */}
        <div style={{
          margin: '0 16px',
          background: '#fff', borderRadius: 14,
          padding: '11px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          border: `1px solid ${HT.n300}`,
          borderLeft: `3px solid ${HT.warning400}`,
        }}>
          <div style={{ width: 30, height: 30, borderRadius: 10, background: HT.walletPink100, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CatIcon kind="movie" size={16} color={HT.walletPink} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: HT.warning400, fontWeight: 600 }}>⚑ ต้องจ่ายใน 2 วัน</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: HT.n900 }}>หนัง · 1,111.00 €</div>
          </div>
          <div style={{ fontSize: 12, color: HT.primary500, fontWeight: 600 }}>จ่าย ›</div>
        </div>
      </div>

      {/* Quick Add */}
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
            flex: 1, background: HT.primary400, color: '#fff', border: 'none',
            borderRadius: 12, padding: '12px 14px', fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(56,178,172,0.3)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
            บันทึกรายจ่าย
          </button>
          {['🎤', '📷', '⋯'].map((ic, i) => (
            <button key={i} style={{
              width: 44, height: 44, background: HT.n200, border: 'none',
              borderRadius: 12, fontSize: 18, color: HT.n700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'inherit',
            }}>{ic}</button>
          ))}
        </div>
      </div>

      <BottomNavV2 active="home" />
    </div>
  );
}

window.HomeV3Temp = HomeV3Temp;
