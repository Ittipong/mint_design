// Home v3 — AI insight hero ON TOP, chat below it, quick add sticky bottom
const H3 = window.MINT;

function HomeV3() {
  const [insightIdx, setInsightIdx] = React.useState(0);
  const insights = [
    { quote: '"เห็นว่าเดือนนี้คุณใช้จ่ายส่วนบันเทิงเยอะกว่าเดือนก่อน 15% เลยนะ"' },
    { quote: '"คุณใกล้ถึงเป้าหมายเที่ยวอังกฤษแล้ว — ออมเพิ่มอีก 21,000 ฿ ก็ถึงแล้วน้า"' },
    { quote: '"งบประมาณเดือนนี้เหลืออีก 8,450 ฿ ใช้อย่างระมัดระวังนะ"' },
  ];
  const ins = insights[insightIdx];

  return (
    <div style={{ background: H3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBarV2 time="21:29" />

      {/* Greeting */}
      <div style={{ padding: '0 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, color: H3.n600 }}>สวัสดีตอนค่ำ 🌙</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: H3.n900, marginTop: 1 }}>ภูมิ</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', padding: '6px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: H3.warning400 }}>
            🔥 7 วัน
          </div>
          <div style={{ position: 'relative' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V9a6 6 0 00-6-6zM9 18a3 3 0 006 0" stroke={H3.n700} strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            <div style={{ position:'absolute', top:-1, right:-1, width:7, height:7, borderRadius:4, background: H3.error400, border:'1.5px solid #fff' }} />
          </div>
        </div>
      </div>

      {/* Net Worth strip */}
      <div style={{ margin: '0 20px 10px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 12, color: H3.n400 }}>Net Worth</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: H3.n900, letterSpacing: -0.3 }}>฿ 125,430</span>
        <span style={{ fontSize: 11, color: H3.primary500, fontWeight: 600 }}>↑ 2.4%</span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 190 }}>

        {/* HERO AI INSIGHT CARD — ตามต้นฉบับ 100% */}
        <div style={{ margin: '0 16px 14px' }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '32px 24px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
            minHeight: 340,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative',
          }}>
            {/* subtle gradient ring top-left */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 80,
              background: `radial-gradient(ellipse at top left, ${H3.walletPink100} 0%, transparent 60%)`,
              borderTopLeftRadius: 20, borderTopRightRadius: 20,
              pointerEvents: 'none', opacity: 0.6,
            }}/>

            {/* Lightbulb icon */}
            <div style={{ fontSize: 54, marginTop: 56, marginBottom: 28, lineHeight: 1 }}>💡</div>

            {/* Quote */}
            <div style={{
              fontSize: 16, color: H3.n900, textAlign: 'center',
              lineHeight: 1.55, fontWeight: 500, padding: '0 12px',
              maxWidth: 280,
            }}>
              {ins.quote}
            </div>

            {/* Divider + read more */}
            <div style={{
              marginTop: 36, display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', justifyContent: 'center',
            }}>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: H3.n300 }}/>
              <div style={{ fontSize: 13, color: H3.n600, fontWeight: 500, cursor: 'pointer' }}>อ่านเพิ่ม</div>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: H3.n300 }}/>
            </div>
          </div>

          {/* pagination dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            {insights.map((_, i) => (
              <div key={i} onClick={() => setInsightIdx(i)} style={{
                width: i === insightIdx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === insightIdx ? H3.primary400 : H3.n300,
                transition: 'all 0.2s', cursor: 'pointer',
              }} />
            ))}
          </div>
        </div>

        {/* AI Chat entry — gradient violet→teal, chat-like with 3 suggestion chips */}
        <div style={{
          margin: '0 16px 12px',
          background: `linear-gradient(135deg, ${H3.walletViolet100} 0%, #fff 45%, ${H3.primary100} 100%)`,
          borderRadius: 18,
          border: `1px solid ${H3.walletViolet100}`,
          padding: '14px 14px 12px',
          boxShadow: '0 2px 10px rgba(148,154,235,0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `linear-gradient(135deg, ${H3.walletViolet} 0%, ${H3.primary400} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15,
              boxShadow: '0 2px 6px rgba(148,154,235,0.35)',
            }}>✦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: H3.n900 }}>สอบถาม AI</div>
              <div style={{ fontSize: 11, color: H3.n600 }}>ถามคำถามเกี่ยวกับการเงินของคุณ</div>
            </div>
          </div>

          {/* Chat-like input preview */}
          <div style={{
            background: 'rgba(255,255,255,0.75)',
            border: `1px solid rgba(148,154,235,0.25)`,
            borderRadius: 22,
            padding: '9px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 10,
          }}>
            <div style={{ flex: 1, fontSize: 12, color: H3.n400, fontStyle: 'italic' }}>
              พิมพ์คำถามของคุณ...
            </div>
            <div style={{
              width: 26, height: 26, borderRadius: 13,
              background: `linear-gradient(135deg, ${H3.walletViolet} 0%, ${H3.primary400} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M4 20l16-8L4 4v6l10 2-10 2v6z" fill="#fff"/>
              </svg>
            </div>
          </div>

          {/* 3 suggestion chips */}
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
                color: H3.n700, fontWeight: 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Upcoming bill — inline alert */}
        <div style={{
          margin: '0 16px',
          background: '#fff', borderRadius: 14,
          padding: '11px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          border: `1px solid ${H3.n300}`,
          borderLeft: `3px solid ${H3.warning400}`,
        }}>
          <div style={{ width: 30, height: 30, borderRadius: 10, background: H3.walletPink100, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CatIcon kind="movie" size={16} color={H3.walletPink} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: H3.warning400, fontWeight: 600 }}>⚑ ต้องจ่ายใน 2 วัน</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: H3.n900 }}>หนัง · 1,111.00 €</div>
          </div>
          <div style={{ fontSize: 12, color: H3.primary500, fontWeight: 600 }}>จ่าย ›</div>
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
    </div>
  );
}

window.HomeV3 = HomeV3;
