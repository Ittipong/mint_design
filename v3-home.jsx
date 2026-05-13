// Home v3 — AI insight hero ON TOP, chat below it, quick add sticky bottom
const H3 = window.MINT;

// === AI Chat card — conversational bubble preview ===
function AiChatCard() {
  return (
    <div style={{
      margin: '0 16px 12px',
      background: '#fff',
      borderRadius: 18,
      border: `1px solid ${H3.n200}`,
      padding: '14px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: `linear-gradient(135deg, ${H3.walletViolet} 0%, ${H3.primary400} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14,
          boxShadow: '0 2px 6px rgba(148,154,235,0.3)',
        }}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: H3.n900 }}>คุยกับ AI</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: H3.primary500 }}/>
            <div style={{ fontSize: 11, color: H3.n600 }}>พร้อมตอบทุกคำถามเงิน ๆ ทอง ๆ</div>
          </div>
        </div>
      </div>

      {/* AI bubble */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <div style={{
          maxWidth: '78%',
          background: H3.walletViolet100,
          border: `1px solid ${H3.walletViolet100}`,
          borderRadius: '14px 14px 14px 4px',
          padding: '8px 12px',
          fontSize: 12, color: H3.n900, lineHeight: 1.45,
        }}>
          สวัสดี! อยากรู้อะไรเกี่ยวกับการเงินคุณวันนี้? 👋
        </div>
      </div>

      {/* tap-to-reply chips, right-aligned like outgoing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', marginBottom: 12 }}>
        {[
          '💡 เดือนนี้ใช้อะไรเยอะสุด?',
          '📈 เดือนนี้ออมได้กี่บาท?',
          '🎯 ถึงเป้าเที่ยวอังกฤษเมื่อไหร่?',
        ].map((s, i) => (
          <div key={i} style={{
            fontSize: 12, padding: '7px 12px',
            borderRadius: '14px 14px 4px 14px',
            background: '#fff',
            border: `1.5px solid ${H3.primary400}`,
            color: H3.primary500, fontWeight: 600,
            cursor: 'pointer',
          }}>{s}</div>
        ))}
      </div>

      {/* input bar at bottom of card */}
      <div style={{
        background: H3.n100 || '#F7F7FA',
        border: `1px solid ${H3.n200}`,
        borderRadius: 22,
        padding: '8px 8px 8px 14px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{ flex: 1, fontSize: 12, color: H3.n400 }}>พิมพ์คำถาม หรือกดเลือกข้างบน...</div>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: H3.n200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3zM5 11a7 7 0 0014 0M12 18v3" stroke={H3.n700} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: `linear-gradient(135deg, ${H3.walletViolet} 0%, ${H3.primary400} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M4 20l16-8L4 4v6l10 2-10 2v6z" fill="#fff"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function HomeV3() {
  const [insightIdx] = React.useState(0);
  const insights = [
    { quote: '"เห็นว่าเดือนนี้คุณใช้จ่ายส่วนบันเทิงเยอะกว่าเดือนก่อน 15% เลยนะ"' },
    { quote: '"คุณใกล้ถึงเป้าหมายเที่ยวอังกฤษแล้ว — ออมเพิ่มอีก 21,000 ฿ ก็ถึงแล้วน้า"' },
    { quote: '"งบประมาณเดือนนี้เหลืออีก 8,450 ฿ ใช้อย่างระมัดระวังนะ"' },
  ];
  const ins = insights[insightIdx];

  return (
    <div style={{ background: H3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBarV2 time="21:29" />

      {/* Net Worth anchor — top-left, bell on right */}
      <div style={{ padding: '0 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: H3.n400, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.6 }}>Net Worth</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: H3.n900, letterSpacing: -0.8, lineHeight: 1.1 }}>฿ 125,430</span>
            <span style={{ fontSize: 12, color: H3.primary500, fontWeight: 700 }}>↑ 2.4%</span>
          </div>
        </div>
        <div style={{ position: 'relative', marginTop: 6 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V9a6 6 0 00-6-6zM9 18a3 3 0 006 0" stroke={H3.n700} strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          <div style={{ position:'absolute', top:-1, right:-1, width:7, height:7, borderRadius:4, background: H3.error400, border:'1.5px solid #fff' }} />
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 190 }}>

        {/* HERO AI INSIGHT CARD — anchored, heavier presence */}
        <div style={{ margin: '0 16px 12px' }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '32px 24px 24px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.06)',
            border: `1px solid ${H3.n200}`,
            minHeight: 340,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* stronger gradient ring top */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 120,
              background: `radial-gradient(ellipse at top left, ${H3.walletPink100} 0%, transparent 65%)`,
              pointerEvents: 'none', opacity: 0.85,
            }}/>

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

        <AiChatCard />

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
    </div>
  );
}

window.HomeV3 = HomeV3;
