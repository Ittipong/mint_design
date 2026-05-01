// AI Chat screen — เข้ามาจาก tap "พิมพ์คำถามของคุณ..."
// Design: friendly AI chat with rich responses (cards, charts, quick replies)
const AIC = window.MINT;

function AIChatScreen() {
  return (
    <div style={{
      background: AIC.n200, height: '100%', position: 'relative',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <MintStatusBarV2 time="21:32" />

      {/* Header */}
      <div style={{
        padding: '0 16px 12px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#fff',
        borderBottom: `1px solid ${AIC.n300}`,
        paddingTop: 2, paddingBottom: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: AIC.n200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke={AIC.n700} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: `linear-gradient(135deg, ${AIC.walletViolet} 0%, ${AIC.primary400} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 18,
          boxShadow: '0 2px 8px rgba(148,154,235,0.35)',
        }}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: AIC.n900 }}>Mint AI</div>
          <div style={{ fontSize: 11, color: AIC.primary500, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: AIC.primary400, display: 'inline-block' }}/>
            ออนไลน์ · พร้อมตอบคำถาม
          </div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="1.8" fill={AIC.n700}/>
          <circle cx="12" cy="12" r="1.8" fill={AIC.n700}/>
          <circle cx="12" cy="19" r="1.8" fill={AIC.n700}/>
        </svg>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Date separator */}
        <div style={{ textAlign: 'center', fontSize: 11, color: AIC.n400, margin: '0 0 -2px' }}>
          วันนี้ · 21:30
        </div>

        {/* AI greeting message */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${AIC.walletViolet}, ${AIC.primary400})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13,
          }}>✦</div>
          <div style={{
            background: '#fff', padding: '10px 14px',
            borderRadius: '16px 16px 16px 4px',
            maxWidth: '78%',
            fontSize: 13.5, color: AIC.n900, lineHeight: 1.5,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            สวัสดีครับคุณภูมิ 👋<br/>
            มีอะไรให้ Mint AI ช่วยเรื่องการเงินของคุณไหมครับ?
          </div>
        </div>

        {/* User message */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            background: AIC.primary400, color: '#fff',
            padding: '10px 14px',
            borderRadius: '16px 16px 4px 16px',
            maxWidth: '78%',
            fontSize: 13.5, lineHeight: 1.5, fontWeight: 500,
            boxShadow: '0 2px 6px rgba(56,178,172,0.25)',
          }}>
            เดือนนี้ฉันใช้จ่ายอะไรเยอะสุด?
          </div>
        </div>

        {/* AI response with rich card */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${AIC.walletViolet}, ${AIC.primary400})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13,
          }}>✦</div>
          <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              background: '#fff', padding: '10px 14px',
              borderRadius: '16px 16px 16px 4px',
              fontSize: 13.5, color: AIC.n900, lineHeight: 1.5,
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              เดือนนี้คุณใช้จ่าย <strong>หมวดเดินทาง</strong> มากที่สุด คิดเป็น <strong style={{ color: AIC.primary500 }}>42%</strong> ของยอดรวม นี่คือ top 3 หมวด:
            </div>

            {/* Rich category card */}
            <div style={{
              background: '#fff', borderRadius: 14,
              padding: '12px 14px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {[
                { ic: 'gas', bg: AIC.walletViolet, name: 'เดินทาง', amt: '27,859', pct: 42 },
                { ic: 'cart', bg: AIC.warning400, name: 'อาหาร', amt: '13,929', pct: 21 },
                { ic: 'movie', bg: AIC.walletPink, name: 'บันเทิง', amt: '12,603', pct: 19 },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: c.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CatIcon kind={c.ic} size={15} color="#fff"/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: AIC.n900 }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: AIC.n700 }}><strong>{c.pct}%</strong> · {c.amt} ฿</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: AIC.n300, overflow: 'hidden' }}>
                      <div style={{ width: `${c.pct}%`, height: '100%', background: c.bg }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insight tip */}
            <div style={{
              background: '#FFF8DC', border: '1px solid #F0DFA0',
              borderRadius: 12, padding: '10px 12px',
              fontSize: 12, color: AIC.n700, lineHeight: 1.5,
              display: 'flex', gap: 8,
            }}>
              <div style={{ fontSize: 16, lineHeight: 1 }}>💡</div>
              <div>
                <strong>Tip:</strong> คุณใช้เดินทางเพิ่ม <strong>+18%</strong> จากเดือนก่อน ลองใช้ขนส่งสาธารณะสัปดาห์ละ 2 วัน จะประหยัดประมาณ 2,500 ฿/เดือน
              </div>
            </div>

            <div style={{ fontSize: 10, color: AIC.n400, padding: '0 4px' }}>21:31</div>
          </div>
        </div>

        {/* Typing indicator */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${AIC.walletViolet}, ${AIC.primary400})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13,
          }}>✦</div>
          <div style={{
            background: '#fff', padding: '10px 14px',
            borderRadius: '16px 16px 16px 4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            display: 'flex', gap: 3, alignItems: 'center',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: 3, background: AIC.n400,
                animation: `typing 1.4s ${i * 0.2}s infinite`,
                opacity: 0.4,
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Quick reply chips + Input bar — pinned bottom */}
      <div style={{
        padding: '10px 16px 12px',
        background: 'linear-gradient(180deg, rgba(247,247,250,0) 0%, rgba(247,247,250,1) 30%)',
        paddingTop: 18,
      }}>
        {/* Quick replies */}
        <div style={{
          display: 'flex', gap: 6, overflowX: 'hidden', marginBottom: 10,
          paddingBottom: 2,
        }}>
          {[
            'แล้วเดือนก่อนล่ะ?',
            'วิธีลดค่าใช้จ่าย',
            'ตั้งงบเดินทาง',
          ].map((q, i) => (
            <div key={i} style={{
              fontSize: 12, padding: '7px 12px', borderRadius: 16,
              background: '#fff',
              border: `1px solid ${AIC.walletViolet100}`,
              color: AIC.walletViolet, fontWeight: 600,
              whiteSpace: 'nowrap', cursor: 'pointer',
            }}>{q}</div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          background: '#fff', borderRadius: 24,
          padding: '6px 6px 6px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: `1px solid ${AIC.n300}`,
        }}>
          <div style={{ flex: 1, fontSize: 13, color: AIC.n400, padding: '6px 0' }}>
            ถามอะไรก็ได้เกี่ยวกับการเงิน...
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 17,
            background: AIC.n200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="3" width="6" height="11" rx="3" stroke={AIC.n700} strokeWidth="1.8"/>
              <path d="M5 11a7 7 0 0014 0M12 18v3" stroke={AIC.n700} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 17,
            background: `linear-gradient(135deg, ${AIC.walletViolet} 0%, ${AIC.primary400} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(148,154,235,0.35)',
            cursor: 'pointer',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 20l16-8L4 4v6l10 2-10 2v6z" fill="#fff"/>
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

window.AIChatScreen = AIChatScreen;
