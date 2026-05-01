// Mint Money v2 screens — improved UX
// P0: reduced red usage, reorg Home, renamed nav, no DEBUG
// P1: full BE year, currency flags, custom icons, elevation hierarchy
const V = window.MINT;

// — shared cards
const card = (elev = 1) => ({
  background: '#fff', borderRadius: 16,
  boxShadow: elev === 2
    ? '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.05)'
    : '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
});

const CurFlag = ({ c = 'THB' }) => {
  const map = { THB: '🇹🇭', EUR: '🇪🇺', USD: '🇺🇸', GBP: '🇬🇧', JPY: '🇯🇵' };
  return <span style={{ fontSize: 11, marginRight: 3 }}>{map[c] || ''}</span>;
};

// ── V2 Home
function HomeV2() {
  return (
    <div style={{ background: V.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: `linear-gradient(180deg, ${V.gradStart} 0%, ${V.n200} 100%)` }}>
        <MintStatusBarV2 time="21:29" />
        <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, color: V.n600, marginBottom: 2 }}>ยอดรวมทั้งหมด</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: V.n900, letterSpacing: -0.3 }}>฿ 125,430.00</div>
            <div style={{ fontSize: 12, color: V.n400, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: V.primary500, fontWeight: 600 }}>↑ 2.4%</span> จากเดือนที่แล้ว
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 3a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V9a6 6 0 00-6-6zM9 18a3 3 0 006 0" stroke={V.n700} strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            <div style={{ position:'absolute', top:-2, right:-2, width:8, height:8, borderRadius:4, background: V.primary400, border:'1.5px solid #fff' }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 92 }}>
        {/* Wallets — promoted above the fold */}
        <div style={{ margin: '12px 16px 0', ...card(2), padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: V.n900 }}>กระเป๋าเงิน</div>
            <div style={{ fontSize: 12, color: V.primary500, fontWeight: 600 }}>ดูทั้งหมด ›</div>
          </div>
          {[
            { icon: 'piggy', bg: V.walletPink100, ic: V.walletPink, name: 'ครอบครัว', sub: 'บัญชีออมทรัพย์', amt: '2,531.23', cur: 'THB' },
            { icon: 'card', bg: V.primary100, ic: V.primary500, name: 'Kbank Credit', sub: 'วงเงินคงเหลือ', amt: '75,000.00', cur: 'THB' },
          ].map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i > 0 ? `1px solid ${V.n300}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CatIcon kind={w.icon} size={18} color={w.ic} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: V.n900 }}>{w.name}</div>
                <div style={{ fontSize: 11, color: V.n400 }}>{w.sub}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: V.n900 }}>
                <CurFlag c={w.cur}/>{w.amt} ฿
              </div>
            </div>
          ))}
        </div>

        {/* Budget at-a-glance — second most important */}
        <div style={{ margin: '10px 16px 0', ...card(1), padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: V.n900 }}>งบประมาณเดือนนี้</div>
            <div style={{ fontSize: 12, color: V.n400 }}>เหลือ <strong style={{ color: V.n900 }}>8,450 ฿</strong></div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: V.n300, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '72%', background: V.primary400 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: V.n400 }}>
            <span>ใช้ไป 21,550 ฿</span>
            <span>ทั้งหมด 30,000 ฿</span>
          </div>
        </div>

        {/* Upcoming — urgency via count, not red */}
        <div style={{ margin: '10px 16px 0', ...card(1), padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: V.n900 }}>รายการที่ต้องจ่าย</div>
            <div style={{ fontSize: 12, color: V.primary500, fontWeight: 600 }}>2 รายการ</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: V.walletPink100, display: 'flex', alignItems:'center', justifyContent:'center' }}>
              <CatIcon kind="movie" size={16} color={V.walletPink} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: V.n900 }}>หนัง</div>
              <div style={{ fontSize: 10, color: V.warning400, fontWeight: 600 }}>⚑ อีก 2 วัน</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: V.n900 }}>
              <CurFlag c="EUR"/>1,111.00 €
            </div>
          </div>
        </div>

        {/* AI insight — compressed to a single row */}
        <div style={{
          margin: '10px 16px 0', padding: '12px 14px',
          background: '#fff', borderRadius: 14,
          border: `1px solid ${V.walletViolet100}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `linear-gradient(135deg, ${V.walletViolet}, ${V.primary300})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, flexShrink: 0,
          }}>✦</div>
          <div style={{ flex: 1, fontSize: 12, color: V.n700, lineHeight: 1.4 }}>
            เดือนนี้ใช้จ่ายบันเทิง <strong>+15%</strong> · <span style={{ color: V.walletViolet, fontWeight: 600 }}>ดูเพิ่ม ›</span>
          </div>
        </div>

        {/* Quick add — simplified: one primary + overflow */}
        <div style={{ margin: '14px 16px 0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: V.n600, marginBottom: 8 }}>เพิ่มรายการใหม่</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              flex: 1, background: V.primary400, color: '#fff', border: 'none',
              borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'inherit',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
              พิมพ์รายการ
            </button>
            {['🎙', '📷'].map((ic, i) => (
              <button key={i} style={{
                width: 46, background: '#fff', border: `1px solid ${V.n300}`, borderRadius: 12,
                fontSize: 18, color: V.n700, cursor: 'pointer',
              }}>{ic}</button>
            ))}
          </div>
        </div>
      </div>
      <BottomNavV2 active="home" />
    </div>
  );
}

// ── V2 Wallets (was Finance)
function WalletsV2() {
  const tabs = ['กระเป๋า', 'บัตรเครดิต', 'เป้าหมาย', 'งบประมาณ'];
  return (
    <div style={{ background: V.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBarV2 time="21:37" />
      <div style={{ padding: '4px 16px 12px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>กระเป๋าเงิน</div>
        <div style={{ display: 'flex', gap: 14 }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke={V.primary500} strokeWidth="2.2" strokeLinecap="round"/></svg>
          <svg width="18" height="22" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.8" fill={V.n700}/><circle cx="12" cy="12" r="1.8" fill={V.n700}/><circle cx="12" cy="19" r="1.8" fill={V.n700}/></svg>
        </div>
      </div>
      <div style={{ margin: '0 16px', padding: 4, background: V.n300, borderRadius: 12, display: 'flex' }}>
        {tabs.map((t, i) => (
          <div key={t} style={{
            flex: 1, textAlign: 'center', padding: '8px', borderRadius: 10,
            fontSize: 13, fontWeight: i === 0 ? 700 : 500,
            color: i === 0 ? V.n900 : V.n600,
            background: i === 0 ? '#fff' : 'transparent',
          }}>{t}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 92 }}>
        {/* Summary — neutral, not red */}
        <div style={{ margin: '14px 16px 0', ...card(2), padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, color: V.n400 }}>ยอดสุทธิ</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: V.n900, letterSpacing: -0.5 }}>฿ -354,786</div>
            </div>
            <div style={{ fontSize: 12, color: V.n400, marginTop: 4 }}>3 กระเป๋า</div>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '8px 10px', background: V.primary100, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: V.n600 }}>เงินสด</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: V.primary600 }}>฿ 68,696</div>
            </div>
            <div style={{ flex: 2, padding: '8px 10px', background: V.error100, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: V.n600 }}>หนี้สิน</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: V.error400 }}>฿ 335,043</div>
            </div>
          </div>
        </div>

        <div style={{ margin: '20px 16px 6px', fontSize: 13, fontWeight: 700, color: V.n900 }}>บัญชีทั่วไป <span style={{ color: V.n400, fontWeight: 500 }}>· 3</span></div>

        {[
          { icon: 'piggy', bg: V.walletPink100, ic: V.walletPink, name: 'ครอบครัว', sub: 'บัญชีออมทรัพย์', amt: '2,531.23', cur: 'THB', sign: 1 },
          { icon: 'wallet', bg: V.walletGreen100, ic: V.walletGreen, name: 'TrueMoney', sub: 'e-Wallet', amt: '101,129.31', cur: 'THB', sign: -1 },
          { icon: 'home', bg: V.walletBrown100, ic: V.walletBrown, name: 'Home', sub: 'เงินสด', amt: '6,789.00', cur: 'EUR', sign: -1 },
        ].map((w, i) => (
          <div key={i} style={{ margin: '8px 16px 0', ...card(1), padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: w.bg, display: 'flex', alignItems:'center', justifyContent:'center' }}>
              <CatIcon kind={w.icon} size={20} color={w.ic} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: V.n900 }}>{w.name}</div>
              <div style={{ fontSize: 11, color: V.n400 }}>{w.sub}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: w.sign < 0 ? V.error400 : V.n900 }}>
                <CurFlag c={w.cur}/>{w.sign < 0 ? '-' : ''}{w.amt}
              </div>
              <div style={{ fontSize: 10, color: V.n400 }}>ยอดคงเหลือ</div>
            </div>
          </div>
        ))}

        <div style={{
          margin: '12px 16px 0', padding: '14px', border: `1.5px dashed ${V.n300}`, borderRadius: 14,
          textAlign: 'center', color: V.primary500, fontSize: 14, fontWeight: 600,
        }}>+ สร้างกระเป๋าใหม่</div>
      </div>
      <MintFabV2 /><BottomNavV2 active="wallets" />
    </div>
  );
}

// ── V2 Activity (was Transaction)
function ActivityV2() {
  return (
    <div style={{ background: V.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBarV2 time="21:29" />
      <div style={{ padding: '2px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: V.walletPink100, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <CatIcon kind="piggy" size={18} color={V.walletPink} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>ครอบครัว</div>
          <div style={{ fontSize: 11, color: V.n400 }}>2,531.23 ฿</div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke={V.n700} strokeWidth="1.8" fill="none"/><path d="M16 16l4 4" stroke={V.n700} strokeWidth="1.8" strokeLinecap="round"/></svg>
          <svg width="18" height="22" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.8" fill={V.n700}/><circle cx="12" cy="12" r="1.8" fill={V.n700}/><circle cx="12" cy="19" r="1.8" fill={V.n700}/></svg>
        </div>
      </div>

      {/* Month tabs — with fade edges + full BE year */}
      <div style={{ position: 'relative' }}>
        <div style={{ padding: '2px 16px 0', display: 'flex', gap: 18, overflow: 'hidden' }}>
          {['2568', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เดือนนี้'].map((m, i) => {
            const active = m === 'มีนาคม';
            return (
              <div key={m} style={{
                padding: '6px 2px 10px', position: 'relative',
                fontSize: 14, fontWeight: active ? 700 : 500,
                color: active ? V.primary500 : (i === 0 ? V.n400 : V.n700),
                whiteSpace: 'nowrap',
              }}>
                {m}
                {active && <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, height: 2.5, borderRadius: 2, background: V.primary400 }} />}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 30, height: '100%', background: 'linear-gradient(270deg, rgba(247,247,250,1) 0%, rgba(247,247,250,0) 100%)', pointerEvents: 'none' }} />
      </div>
      <div style={{ height: 1, background: V.n300, opacity: 0.5 }} />

      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 92 }}>
        {/* Summary — toned down, no red */}
        <div style={{ margin: '12px 16px 0', ...card(2), padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 12, color: V.n400 }}>ยอดใช้จ่ายเดือนนี้</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: V.n900, marginTop: 2, letterSpacing: -0.5 }}>1,625.00 ฿</div>
              <div style={{ fontSize: 11, color: V.n600, marginTop: 4 }}>
                <span style={{ color: V.primary500, fontWeight: 700 }}>↑ 77.2%</span> จากเดือนที่แล้ว
              </div>
            </div>
            <button style={{
              background: V.primary100, color: V.primary600, border: 'none',
              fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 20,
              fontFamily: 'inherit',
            }}>ดูรายงาน ›</button>
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${V.n300}`, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <div><div style={{ color: V.n400 }}>ยอดต้นเดือน</div><div style={{ fontWeight: 600, color: V.n700 }}>16,960 ฿</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ color: V.n400 }}>ยอดคงเหลือ</div><div style={{ fontWeight: 600, color: V.n700 }}>15,335 ฿</div></div>
          </div>
        </div>

        {/* Groups — flat list; amounts are neutral */}
        {[
          { d: '31', wd: 'วันอังคาร', m: 'มีนาคม 2568', tot: '1,710.00', rows: [
            { ic: 'coffee', bg: V.warning400, name: 'กาแฟ', amt: '120.00' },
            { ic: 'movie', bg: V.walletPink, name: 'หนัง', sub: 'Major Cineplex', amt: '150.00' },
            { ic: 'bill', bg: V.walletViolet, name: 'ค่าบิล', amt: '1,440.00' },
          ]},
          { d: '30', wd: 'วันจันทร์', m: 'มีนาคม 2568', tot: '560.00', rows: [
            { ic: 'cart', bg: V.warning400, name: 'ซื้อวัตถุดิบ', sub: 'Makro', amt: '560.00' },
          ]},
          { d: '29', wd: 'วันอาทิตย์', m: 'มีนาคม 2568', tot: '525.00', rows: [
            { ic: 'gas', bg: V.walletViolet, name: 'น้ำมัน', amt: '525.00' },
          ]},
        ].map((g, i) => (
          <div key={i} style={{ margin: '10px 16px 0', ...card(1), padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, paddingBottom: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: V.n900, lineHeight: 1 }}>{g.d}</div>
              <div style={{ flex: 1, paddingBottom: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{g.wd}</div>
                <div style={{ fontSize: 11, color: V.n400 }}>{g.m}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: V.n900, paddingBottom: 2 }}>-{g.tot} ฿</div>
            </div>
            {g.rows.map((r, j) => (
              <div key={j} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderTop: j === 0 ? 'none' : `1px solid ${V.n300}`,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: r.bg, display: 'flex', alignItems:'center', justifyContent:'center' }}>
                  <CatIcon kind={r.ic} size={18} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                  {r.sub && <div style={{ fontSize: 11, color: V.n400 }}>{r.sub}</div>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: V.n700 }}>-{r.amt} ฿</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <MintFabV2 /><BottomNavV2 active="activity" />
    </div>
  );
}

// ── V2 Insights (Reports combined)
function InsightsV2() {
  return (
    <div style={{ background: V.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBarV2 time="21:37" />
      <div style={{ padding: '4px 16px 10px' }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>รายงาน</div>
        <div style={{ fontSize: 12, color: V.n400, marginTop: 2 }}>มีนาคม 2568</div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 92 }}>
        {/* Hero summary — big number but NOT red */}
        <div style={{ margin: '0 16px', ...card(2), padding: '18px 20px' }}>
          <div style={{ fontSize: 12, color: V.n400 }}>ยอดสุทธิเดือนนี้</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: V.n900, letterSpacing: -0.5, marginTop: 4 }}>-24,112.43 ฿</div>
          <div style={{ fontSize: 12, marginTop: 4, color: V.error400, fontWeight: 600, display:'flex', alignItems:'center', gap: 4 }}>
            ↓ 257.2% <span style={{ color: V.n400, fontWeight: 400 }}>เทียบกับเดือนที่แล้ว</span>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, padding: '10px 12px', background: V.primary100, borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: V.n600 }}>รายรับ</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: V.primary600 }}>26,885 ฿</div>
              <div style={{ fontSize: 10, color: V.n600, marginTop: 2 }}>↓ 56.6%</div>
            </div>
            <div style={{ flex: 1, padding: '10px 12px', background: V.error100, borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: V.n600 }}>รายจ่าย</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: V.error400 }}>66,332 ฿</div>
              <div style={{ fontSize: 10, color: V.n600, marginTop: 2 }}>↑ 4.2%</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ margin: '12px 16px 0', ...card(1), padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>หมวดรายจ่าย</div>
            <div style={{ fontSize: 12, color: V.primary500, fontWeight: 600 }}>ดูทั้งหมด ›</div>
          </div>
          {[
            { ic: 'gas', bg: V.walletViolet, name: 'เดินทาง', pct: 42, amt: '27,859' },
            { ic: 'cart', bg: V.warning400, name: 'อาหาร', pct: 21, amt: '13,929' },
            { ic: 'movie', bg: V.walletPink, name: 'บันเทิง', pct: 19, amt: '12,603' },
            { ic: 'bill', bg: V.primary400, name: 'ค่าบิล', pct: 11, amt: '7,296' },
            { ic: 'game', bg: V.info400, name: 'อื่นๆ', pct: 7, amt: '4,643' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CatIcon kind={c.ic} size={16} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: V.n700 }}><strong>{c.pct}%</strong> · {c.amt} ฿</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: V.n300, overflow: 'hidden' }}>
                  <div style={{ width: `${c.pct}%`, height: '100%', background: c.bg, borderRadius: 3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trend preview */}
        <div style={{ margin: '12px 16px 0', ...card(1), padding: '14px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>แนวโน้ม 4 เดือน</div>
          <svg width="100%" height="100" viewBox="0 0 320 100" preserveAspectRatio="none">
            {[0,1,2,3].map(i => {
              const x = 40 + i * 70;
              const income = [45, 52, 28, 38][i];
              const expense = [30, 40, 55, 48][i];
              return (
                <g key={i}>
                  <rect x={x-10} y={100-income} width="9" height={income} fill={V.primary400} rx="1.5"/>
                  <rect x={x} y={100-expense} width="9" height={expense} fill={V.error300} rx="1.5"/>
                  <text x={x-1} y="98" fontSize="8" fill={V.n400} textAnchor="middle">{['ธ.ค.','ม.ค.','ก.พ.','มี.ค.'][i]}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <MintFabV2 /><BottomNavV2 active="insights" />
    </div>
  );
}

Object.assign(window, { HomeV2, WalletsV2, ActivityV2, InsightsV2 });
