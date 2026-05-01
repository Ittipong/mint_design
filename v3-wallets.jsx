// Wallets v3 — เรียบง่ายเหมือน v2 + improvements รอบ 2
// Improvements (รอบ 2):
//   • กระเป๋า: sign logic ถูก (savings = +, debt = -), chevron, currency hint แปลงเป็น ฿
//   • บัตรเครดิต: status pill เปลี่ยนสีตาม utilization, countdown วันตัดรอบ, ขั้นต่ำต้องจ่าย
//   • เป้าหมาย: "ออมเดือนละ X ฿" suggestion, on-track badge (เร็ว/ตามแผน/ช้า)
//   • งบประมาณ: "เหลือใช้วันละ X" hint, sub-category mini bars, days left
const W3 = window.MINT;

const w3card = (elev = 1) => ({
  background: '#fff', borderRadius: 16,
  boxShadow: elev === 2
    ? '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.05)'
    : '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
});

// — Shared header (title + actions + segmented tabs)
function WalletsV3Header({ active = 0 }) {
  const tabs = ['กระเป๋า', 'บัตรเครดิต', 'เป้าหมาย', 'งบประมาณ'];
  return (
    <>
      <MintStatusBarV2 time="08:23" />
      <div style={{ padding: '4px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: W3.n900, letterSpacing: -0.3 }}>การเงิน</div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke={W3.n700} strokeWidth="2.2" strokeLinecap="round"/></svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={W3.n700} strokeWidth="1.8"/>
            <path d="M12 7v5l3 2" stroke={W3.n700} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <svg width="18" height="22" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.8" fill={W3.n700}/><circle cx="12" cy="12" r="1.8" fill={W3.n700}/><circle cx="12" cy="19" r="1.8" fill={W3.n700}/></svg>
        </div>
      </div>
      <div style={{ margin: '0 16px 14px', padding: 4, background: W3.n300, borderRadius: 12, display: 'flex' }}>
        {tabs.map((t, i) => (
          <div key={t} style={{
            flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 10,
            fontSize: 13, fontWeight: i === active ? 700 : 500,
            color: i === active ? W3.n900 : W3.n600,
            background: i === active ? '#fff' : 'transparent',
            boxShadow: i === active ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
          }}>{t}</div>
        ))}
      </div>
    </>
  );
}

const Chevron = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 4, flexShrink: 0 }}>
    <path d="M9 6l6 6-6 6" stroke={color || W3.n400} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CalIcon = ({ color }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={color || W3.n400} strokeWidth="1.8"/>
    <path d="M3 9h18M8 3v4M16 3v4" stroke={color || W3.n400} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// TAB 1 — กระเป๋า
// ═══════════════════════════════════════════════════════════════
function WalletsV3_Accounts() {
  // sign: +1 = positive (savings/cash), -1 = debt
  // foreignAmt: optional original-currency amount; amt is THB-equivalent
  const accounts = [
    { icon: 'piggy', bg: W3.walletPink100, ic: W3.walletPink, name: 'ครอบครัว', sub: 'บัญชีออมทรัพย์', amt: 34368.77, cur: '฿', sign: +1 },
    { icon: 'wallet', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'TrueMoney', sub: 'e-Wallet', amt: 17300.50, cur: '฿', sign: +1 },
    { icon: 'piggy', bg: W3.walletGreen100, ic: W3.walletGreen, name: 'Pad shop', sub: 'บัญชีขายของ', amt: 7800.00, cur: '$', signCur: '$', foreignAmt: 216.50, sign: +1 },
    { icon: 'card', bg: W3.walletViolet100, ic: W3.walletViolet, name: 'Kbank Credit', sub: 'บัตรเครดิต', amt: 116547.11, cur: '฿', sign: -1 },
  ];

  const positive = accounts.filter(a => a.sign > 0).reduce((s, a) => s + a.amt, 0);
  const negative = accounts.filter(a => a.sign < 0).reduce((s, a) => s + a.amt, 0);
  const total = positive - negative;
  const posPct = (positive / (positive + negative)) * 100;

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <WalletsV3Header active={0} />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        {/* Summary — v2 style: label + big number + count, then two pills */}
        <div style={{ margin: '0 16px 16px', ...w3card(2), padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 12, color: W3.n400 }}>ยอดสุทธิ</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: W3.n900, letterSpacing: -0.5, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                {total < 0 ? '฿ -' : '฿ '}{Math.abs(total).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div style={{ fontSize: 12, color: W3.n400, marginTop: 2 }}>{accounts.length} กระเป๋า</div>
          </div>
          <div style={{ fontSize: 10, color: W3.n400, marginTop: 12, marginBottom: 6, fontWeight: 500, letterSpacing: 0.3, textTransform: 'uppercase' }}>เดือนนี้</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '8px 10px', background: W3.primary100, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: W3.n600 }}>รายรับ</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.primary600, fontVariantNumeric: 'tabular-nums' }}>
                + ฿ 51,885
              </div>
            </div>
            <div style={{ flex: 1, padding: '8px 10px', background: W3.error100, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: W3.n600 }}>รายจ่าย</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.error400, fontVariantNumeric: 'tabular-nums' }}>
                - ฿ 116,547
              </div>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div style={{ margin: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>บัญชีทั่วไป</div>
          <div style={{
            background: W3.n300, color: W3.n600, fontSize: 11, fontWeight: 600,
            padding: '1px 7px', borderRadius: 8, minWidth: 18, textAlign: 'center',
          }}>{accounts.length}</div>
        </div>

        {/* Account list — no bar; just balance (matches v2) */}
        {accounts.map((w, i) => (
          <div key={i} style={{ margin: '0 16px 8px', ...w3card(1), padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: w.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <CatIcon kind={w.icon} size={20} color={w.ic} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: W3.n900 }}>{w.name}</div>
              <div style={{ fontSize: 11, color: W3.n400, marginTop: 1 }}>{w.sub}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: w.sign < 0 ? W3.error400 : W3.n900, fontVariantNumeric: 'tabular-nums' }}>
                {w.sign < 0 ? '- ' : ''}{w.amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
              </div>
              <div style={{ fontSize: 10.5, color: W3.n400, marginTop: 1 }}>
                {w.foreignAmt ? `≈ ${w.foreignAmt.toLocaleString()} ${w.signCur}` : 'ยอดคงเหลือ'}
              </div>
            </div>
          </div>
        ))}

        <div style={{
          margin: '8px 16px 0', padding: '14px',
          border: `1.5px dashed ${W3.n400}`, borderRadius: 14,
          textAlign: 'center', color: W3.primary500, fontSize: 14, fontWeight: 600,
        }}>+ สร้างกระเป๋าใหม่</div>
      </div>

      <MintFabV2 />
      <BottomNavV2 active="wallets" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 2 — บัตรเครดิต
// ═══════════════════════════════════════════════════════════════
function WalletsV3_Credit() {
  // util level: low (<30%), med (30-70%), high (>70%)
  const cards = [
    {
      icon: 'card', bg: W3.walletGreen100, ic: W3.walletGreen,
      name: 'CardX', used: 3000, limit: 50000, minPay: 300,
      cycle: 25, daysUntilCycle: 5,
    },
    {
      icon: 'card', bg: W3.walletViolet100, ic: W3.walletViolet,
      name: 'Kbank Credit', used: 56000, limit: 80000, minPay: 5600,
      cycle: 1, daysUntilCycle: 12,
    },
  ];

  const totalUsed = cards.reduce((s, c) => s + c.used, 0);
  const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
  const totalAvailable = totalLimit - totalUsed;
  const totalPct = (totalUsed / totalLimit) * 100;
  const totalMinPay = cards.reduce((s, c) => s + c.minPay, 0);

  const utilStatus = (pct) => {
    if (pct < 30) return { label: 'วงเงินเหลือเยอะ', color: W3.primary500, dot: W3.primary400, bg: 'transparent' };
    if (pct < 70) return { label: 'ใช้พอดี', color: W3.n600, dot: W3.n500 || W3.n400, bg: 'transparent' };
    return { label: 'ใกล้เต็มวงเงิน', color: W3.warning400, dot: W3.warning400, bg: 'transparent' };
  };

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <WalletsV3Header active={1} />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <div style={{ margin: '0 16px 16px', ...w3card(2), padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 12, color: W3.n400 }}>วงเงินคงเหลือ</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: W3.n900, letterSpacing: -0.5, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {totalAvailable.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: W3.n400, marginTop: 2 }}>
                จากวงเงินรวม <span style={{ color: W3.n700, fontWeight: 600 }}>฿ {totalLimit.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: W3.n400, marginTop: 2 }}>{cards.length} บัตร</div>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '8px 10px', background: W3.primary100, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: W3.n600 }}>ใช้ไป {totalPct.toFixed(0)}%</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.primary600, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {totalUsed.toLocaleString()}
              </div>
            </div>
            <div style={{ flex: 1, padding: '8px 10px', background: W3.n300, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: W3.n600 }}>ขั้นต่ำงวดนี้</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.n800, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {totalMinPay.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ margin: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>ใช้งาน</div>
          <div style={{ background: W3.n300, color: W3.n600, fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 8, minWidth: 18, textAlign: 'center' }}>{cards.length}</div>
        </div>

        {cards.map((c, i) => {
          const pct = (c.used / c.limit) * 100;
          const balance = c.limit - c.used;
          const status = utilStatus(pct);
          const pctColor = pct < 70 ? W3.n800 : W3.warning400;
          const soon = c.daysUntilCycle <= 7;
          return (
            <div key={i} style={{ margin: '0 16px 10px', ...w3card(1), padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: c.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CatIcon kind={c.icon} size={20} color={c.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W3.n900 }}>{c.name}</div>
                </div>
                <div style={{
                  fontSize: 11, color: status.color, fontWeight: 600,
                  background: status.bg,
                  padding: status.bg !== 'transparent' ? '3px 9px' : '0',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: status.dot }}/>
                  {status.label}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 12, color: W3.n400 }}>วงเงินคงเหลือ</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: W3.primary600, fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>
                    ฿ {balance.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: W3.n400, marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>
                    ใช้ไป {c.used.toLocaleString()} / {c.limit.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: pctColor }}>{pct.toFixed(0)}%</div>
                  <div style={{ fontSize: 11, color: soon ? W3.warning400 : W3.n400, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', fontWeight: soon ? 600 : 400 }}>
                    <CalIcon color={soon ? W3.warning400 : W3.n400}/>
                    ตัดรอบ {c.cycle} · อีก {c.daysUntilCycle} วัน
                  </div>
                </div>
              </div>

              {/* min payment row + CTA */}
              <div style={{
                marginTop: 10, paddingTop: 10, borderTop: `1px solid ${W3.n300}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontSize: 11, color: W3.n400 }}>
                  ขั้นต่ำ <span style={{ color: W3.n700, fontWeight: 600 }}>{c.minPay.toLocaleString()}.00 ฿</span>
                </div>
                <button style={{
                  background: '#fff', color: W3.primary500,
                  border: `1px solid ${W3.primary300}`, borderRadius: 18,
                  fontSize: 12, fontWeight: 600, padding: '6px 16px',
                  fontFamily: 'inherit', cursor: 'pointer',
                }}>จ่ายบัตร</button>
              </div>
            </div>
          );
        })}

        <div style={{
          margin: '6px 16px 0', padding: '14px',
          border: `1.5px dashed ${W3.n400}`, borderRadius: 14,
          textAlign: 'center', color: W3.primary500, fontSize: 14, fontWeight: 600,
        }}>+ เพิ่มบัตรเครดิตใหม่</div>
      </div>

      <MintFabV2 />
      <BottomNavV2 active="wallets" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 3 — เป้าหมาย
// ═══════════════════════════════════════════════════════════════
function WalletsV3_Goals() {
  // monthsLeft used to compute "ออมเดือนละ X" + on-track status
  const goals = [
    {
      icon: 'plane', bg: W3.primary100, ic: W3.primary500,
      name: 'เที่ยวอังกฤษ', saved: 41900, target: 100000, by: 'ธ.ค. 2569', monthsLeft: 8,
      pct: 42, track: 'ahead', // ahead | on | behind
    },
    {
      icon: 'japan', bg: W3.walletPink100, ic: W3.walletPink,
      name: 'Japan', saved: 2000, target: 10000, by: 'ส.ค. 2569', monthsLeft: 4,
      pct: 20, track: 'behind',
    },
  ];

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalPct = (totalSaved / totalTarget) * 100;

  const trackInfo = (t) => {
    if (t === 'ahead') return { label: 'เร็วกว่ากำหนด', color: W3.primary500, dot: W3.primary400, bg: 'transparent' };
    if (t === 'on') return { label: 'ตามแผน', color: W3.primary500, dot: W3.primary400, bg: 'transparent' };
    return { label: 'ช้ากว่าแผน', color: W3.warning400, dot: W3.warning400, bg: 'transparent' };
  };

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <WalletsV3Header active={2} />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <div style={{ margin: '0 16px 16px', ...w3card(2), padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 12, color: W3.n400 }}>ยอดออมรวม</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: W3.n900, letterSpacing: -0.5, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {totalSaved.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div style={{ fontSize: 12, color: W3.n400, marginTop: 2 }}>{goals.length} เป้าหมาย</div>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '8px 10px', background: W3.primary100, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: W3.n600 }}>เป้ารวม</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.primary600, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {totalTarget.toLocaleString()}
              </div>
            </div>
            <div style={{ flex: 1, padding: '8px 10px', background: W3.n300, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: W3.n600 }}>คืบหน้า {totalPct.toFixed(0)}%</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.n700, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {(totalTarget - totalSaved).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ margin: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>กำลังออม</div>
          <div style={{ background: W3.n300, color: W3.n600, fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 8, minWidth: 18, textAlign: 'center' }}>{goals.length}</div>
        </div>

        {goals.map((g, i) => {
          const remain = g.target - g.saved;
          const monthly = Math.ceil(remain / g.monthsLeft);
          const track = trackInfo(g.track);
          return (
            <div key={i} style={{ margin: '0 16px 10px', ...w3card(1), padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: g.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CatIcon kind={g.icon} size={20} color={g.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W3.n900 }}>{g.name}</div>
                </div>
                <div style={{
                  fontSize: 11, color: track.color, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: track.dot }}/>
                  {track.label}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 12, color: W3.n700, fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ fontWeight: 700, color: W3.n900 }}>฿{g.saved.toLocaleString()}</span>
                    <span style={{ color: W3.n400 }}> / ฿{g.target.toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: 11, color: W3.n400, marginTop: 1 }}>
                    เหลืออีก ฿{remain.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: W3.primary500 }}>{g.pct}%</div>
                  <div style={{ fontSize: 11, color: W3.n400, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <CalIcon/>{g.by}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 10, position: 'relative' }}>
                <div style={{
                  height: 8, borderRadius: 4, background: W3.n300,
                  overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    width: `${Math.min(100, g.pct)}%`, height: '100%',
                    background: g.track === 'behind'
                      ? `linear-gradient(90deg, ${W3.warning400}, ${W3.warning400})`
                      : `linear-gradient(90deg, ${W3.primary300}, ${W3.primary500})`,
                    borderRadius: 4,
                  }} />
                </div>
                {/* expected pace marker */}
                {(() => {
                  // expected pace = months elapsed / total months
                  // assume total months = saved/(target/totalMonths). We have monthsLeft.
                  // approximate: expected pct based on monthly contribution needed vs already saved
                  const totalMonthsAssumed = g.monthsLeft + Math.round(g.saved / Math.max(1, Math.ceil(g.target / (g.monthsLeft + Math.round(g.saved/(g.target/12) || 1)))));
                  const expectedPct = g.track === 'ahead' ? Math.max(15, g.pct - 12)
                                    : g.track === 'behind' ? Math.min(95, g.pct + 18)
                                    : g.pct;
                  return (
                    <div style={{
                      position: 'absolute', left: `${expectedPct}%`, top: -2, bottom: -2,
                      width: 2, background: W3.n600, transform: 'translateX(-1px)',
                    }} title="เป้าหมาย ณ วันนี้" />
                  );
                })()}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginTop: 6, fontSize: 10, color: W3.n400,
                }}>
                  <span>เริ่ม</span>
                  <span style={{ color: W3.n600 }}>เป้า ณ วันนี้</span>
                  <span>฿{(g.target/1000).toFixed(0)}k</span>
                </div>
              </div>

              {/* monthly suggestion + CTA */}
              <div style={{
                marginTop: 10, paddingTop: 10, borderTop: `1px solid ${W3.n300}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontSize: 11, color: W3.n400 }}>
                  ออมเดือนละ <span style={{ color: W3.n700, fontWeight: 600 }}>{monthly.toLocaleString()} ฿</span> เพื่อให้ทันกำหนด
                </div>
                <button style={{
                  background: '#fff', color: W3.primary500,
                  border: `1px solid ${W3.primary300}`, borderRadius: 18,
                  fontSize: 12, fontWeight: 600, padding: '6px 16px',
                  fontFamily: 'inherit', cursor: 'pointer',
                }}>ออมเงิน</button>
              </div>
            </div>
          );
        })}

        <div style={{
          margin: '6px 16px 0', padding: '14px',
          border: `1.5px dashed ${W3.n400}`, borderRadius: 14,
          textAlign: 'center', color: W3.primary500, fontSize: 14, fontWeight: 600,
        }}>+ สร้างเป้าหมายใหม่</div>
      </div>

      <MintFabV2 />
      <BottomNavV2 active="wallets" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 4 — งบประมาณ
// ═══════════════════════════════════════════════════════════════
function WalletsV3_Budget() {
  // budget with sub-categories (mini-bars)
  const budgets = [
    {
      icon: 'budget', bg: W3.walletViolet100, ic: W3.walletViolet,
      name: 'งบใช้จ่ายรายเดือน', spent: 11200, limit: 15000, period: 'พ.ค. 2569',
      subs: [
        { name: 'อาหาร', spent: 6200, limit: 7000, color: W3.warning400 },
        { name: 'เดินทาง', spent: 3500, limit: 4000, color: W3.walletViolet },
        { name: 'บันเทิง', spent: 1500, limit: 4000, color: W3.walletPink },
      ],
    },
  ];

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalPct = (totalSpent / totalLimit) * 100;

  // pacing: day 18 of 30
  const monthPct = 60;
  const daysLeft = 12;

  return (
    <div style={{ background: W3.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <WalletsV3Header active={3} />

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <div style={{ margin: '0 16px 16px', ...w3card(2), padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 12, color: W3.n400 }}>ใช้ไปแล้ว</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: totalPct > 100 ? W3.error400 : W3.n900, letterSpacing: -0.5, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div style={{ fontSize: 12, color: W3.n400, marginTop: 2 }}>เหลือ {daysLeft} วัน</div>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '8px 10px', background: W3.primary100, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: W3.n600 }}>งบรวม</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.primary600, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {totalLimit.toLocaleString()}
              </div>
            </div>
            <div style={{ flex: 1, padding: '8px 10px', background: W3.error100, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: W3.n600 }}>{totalPct > 100 ? `เกินงบ ${totalPct.toFixed(0)}%` : `ใช้ไป ${totalPct.toFixed(0)}%`}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: W3.error400, fontVariantNumeric: 'tabular-nums' }}>
                ฿ {Math.abs(totalLimit - totalSpent).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ margin: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: W3.n900 }}>กำลังใช้งาน</div>
          <div style={{ background: W3.n300, color: W3.n600, fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 8, minWidth: 18, textAlign: 'center' }}>{budgets.length}</div>
        </div>

        {budgets.map((b, i) => {
          const pct = (b.spent / b.limit) * 100;
          const remain = b.limit - b.spent;
          const dailyLeft = Math.max(0, Math.floor(remain / daysLeft));
          const over = pct > 100;
          const onPace = pct <= monthPct + 5;
          const status = over
            ? { label: 'เกินงบ', color: W3.error400, dot: W3.error400, bg: W3.error100 }
            : onPace
              ? { label: 'ตามจังหวะ', color: W3.primary500, dot: W3.primary400, bg: 'transparent' }
              : { label: 'ใช้เร็วกว่าแผน', color: W3.warning400, dot: W3.warning400, bg: 'transparent' };
          return (
            <div key={i} style={{ margin: '0 16px 10px', ...w3card(1), padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: b.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CatIcon kind={b.icon} size={20} color={b.ic} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W3.n900 }}>{b.name}</div>
                </div>
                <div style={{
                  fontSize: 11, color: status.color, fontWeight: 600,
                  background: status.bg,
                  padding: status.bg !== 'transparent' ? '3px 9px' : '0',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: status.dot }}/>
                  {status.label}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 12, color: W3.n700, fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ fontWeight: 700, color: over ? W3.error400 : W3.n900 }}>฿{b.spent.toLocaleString()}</span>
                    <span style={{ color: W3.n400 }}> / ฿{b.limit.toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: 11, color: over ? W3.error400 : W3.n400, marginTop: 1, fontWeight: over ? 600 : 400 }}>
                    {over
                      ? `เกินงบ ฿${(b.spent - b.limit).toLocaleString()}`
                      : `เหลือใช้วันละ ฿${dailyLeft.toLocaleString()} · ${daysLeft} วัน`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: over ? W3.error400 : (onPace ? W3.primary500 : W3.warning400) }}>{pct.toFixed(0)}%</div>
                  <div style={{ fontSize: 11, color: W3.n400, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <CalIcon/>{b.period}
                  </div>
                </div>
              </div>

              {/* Progress bar with pace marker */}
              <div style={{ marginTop: 10, position: 'relative' }}>
                <div style={{
                  height: 8, borderRadius: 4, background: W3.n300,
                  overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    width: `${Math.min(100, pct)}%`, height: '100%',
                    background: over
                      ? W3.error400
                      : onPace
                        ? `linear-gradient(90deg, ${W3.primary300}, ${W3.primary500})`
                        : `linear-gradient(90deg, ${W3.warning400}, ${W3.warning400})`,
                    borderRadius: 4,
                  }} />
                </div>
                {/* "today" pace marker */}
                <div style={{
                  position: 'absolute', left: `${monthPct}%`, top: -2, bottom: -2,
                  width: 2, background: W3.n700, transform: 'translateX(-1px)',
                }} />
                <div style={{
                  position: 'absolute', left: `${monthPct}%`, top: 12,
                  transform: 'translateX(-50%)',
                  fontSize: 9, color: W3.n600, fontWeight: 600,
                  background: '#fff', padding: '0 4px',
                }}>วันนี้</div>
              </div>

              {/* Sub-category breakdown WITH bars */}
              {b.subs && (
                <div style={{ marginTop: 22, paddingTop: 12, borderTop: `1px solid ${W3.n300}` }}>
                  <div style={{ fontSize: 10, color: W3.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>หมวดย่อย</div>
                  {b.subs.map((s, j) => {
                    const sp = (s.spent / s.limit) * 100;
                    const subOver = sp > 100;
                    const subRemain = s.limit - s.spent;
                    return (
                      <div key={j} style={{ marginTop: j === 0 ? 0 : 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 4, background: subOver ? W3.error400 : s.color }}/>
                            <div style={{ fontSize: 12, fontWeight: 600, color: W3.n900 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: subOver ? W3.error400 : W3.n400, fontWeight: subOver ? 600 : 400 }}>
                              {subOver ? `เกิน ฿${Math.abs(subRemain).toLocaleString()}` : `เหลือ ฿${subRemain.toLocaleString()}`}
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: W3.n700, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                            ฿{s.spent.toLocaleString()} / ฿{s.limit.toLocaleString()}
                          </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            height: 6, borderRadius: 3, background: W3.n300, overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${Math.min(100, sp)}%`, height: '100%',
                              background: subOver ? W3.error400 : s.color,
                              borderRadius: 3,
                            }} />
                          </div>
                          {/* pace marker on sub-bar */}
                          <div style={{
                            position: 'absolute', left: `${monthPct}%`, top: -1, bottom: -1,
                            width: 1.5, background: W3.n600, transform: 'translateX(-1px)',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div style={{
          margin: '6px 16px 0', padding: '14px',
          border: `1.5px dashed ${W3.n400}`, borderRadius: 14,
          textAlign: 'center', color: W3.primary500, fontSize: 14, fontWeight: 600,
        }}>+ สร้างงบประมาณใหม่</div>
      </div>

      <MintFabV2 />
      <BottomNavV2 active="wallets" />
    </div>
  );
}

Object.assign(window, {
  WalletsV3_Accounts, WalletsV3_Credit, WalletsV3_Goals, WalletsV3_Budget,
});
