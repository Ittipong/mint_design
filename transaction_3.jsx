// Add Transaction Bottom Sheet · 03 · บัตรเครดิต · จ่ายบัตร
// Function: AddTxnD_CreditPay
// Depends on transaction_shared.jsx (must load first)

const TC = window.MINT;
const TE = window.MINT;
const {
  ESheetShell, ETabs, EAmountHero, EFieldRow,
  ECategoryChips, EWalletCatRow,
  EMetaRow, ETagsRow, EReportToggle,
  CATEGORY_COLORS,
} = window;

function AddTxnD_CreditPay() {
  const [tags, setTags] = React.useState([]);
  const [inReport, setInReport] = React.useState(true);
  const [txns] = React.useState([
    {
      type: 'transfer',
      amount: 3500,
      cat: { label: 'บัตรเครดิต', icon: 'card', bg: TC.walletViolet100, ic: TC.walletViolet },
      catLabel: 'จ่ายบัตร',
      merchant: 'Kbank Credit',
      walletLabel: 'ครอบครัว',
      time: '10:00',
    },
  ]);

  return (
    <ESheetShell txns={txns}>
      <ETabs active="credit" />

      {/* Segment tabs */}
      <div style={{ margin: '0 16px 12px', padding: '4px', background: TC.n200, borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[
            { key: 'pay', label: 'จ่ายบัตรเครดิต' },
            { key: 'cashback', label: 'รับ Cashback' },
            { key: 'withdraw', label: 'กดเงินสด' },
          ].map(t => {
            const on = t.key === 'pay';
            return (
              <div key={t.key} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10,
                background: on ? '#fff' : 'transparent',
                color: on ? TC.n900 : TC.n400,
                fontSize: 13, fontWeight: on ? 700 : 500,
                textAlign: 'center',
                boxShadow: on ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}>{t.label}</div>
            );
          })}
        </div>
      </div>

      {/* Amount hero with hint — matches EAmountHero style */}
      <div style={{
        margin: '0 16px 12px', background: '#fff', borderRadius: 18,
        padding: '20px 18px 18px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 14px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: TC.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>จำนวนเงิน</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: TC.n600,
              background: TC.n200, padding: '3px 8px', borderRadius: 8
            }}>THB ▾</div>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: TC.n200,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2"
                stroke={TC.n600} strokeWidth="1.8" strokeLinecap="round" />
                <rect x="8" y="9" width="8" height="6" rx="1" stroke={TC.n600} strokeWidth="1.8" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: TC.n900, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {'−'}3,500
            <span style={{ color: TC.n400, fontWeight: 500 }}>.00</span>
          </div>
          <div style={{
            width: 2, height: 30, background: TC.primary500,
            animation: 'cursor-blink 1s infinite'
          }} />
        </div>
        <div style={{ fontSize: 12, color: TC.n500, marginTop: 8, fontWeight: 500 }}>
          ขั้นต่ำเดือนนี้: 1,200 ฿ · กำหนด 5 พ.ค.
        </div>
      </div>

      {/* Card & Wallet rows — arrow shows money flow direction */}
      <div style={{ padding: '0 16px 10px', position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletViolet100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="card" size={18} color={TC.walletViolet} />
          </div>}
          label="ชำระบัตรเครดิต"
          value="Kbank Credit"
          hint="ค้างชำระ 116,547 ฿"
          prominent
        />
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 28, height: 28, borderRadius: 999,
          background: '#fff', border: `1.5px solid ${TC.n300}`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1, pointerEvents: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M6 13l6 6 6-6" stroke={TC.primary500} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletPink100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="piggy" size={18} color={TC.walletPink} />
          </div>}
          label="จ่ายจากกระเป๋า"
          value="ครอบครัว"
          hint="คงเหลือ 34,368 ฿"
          prominent
        />
      </div>

      <EMetaRow />

      <ETagsRow value={tags} onChange={setTags} />

      <EReportToggle value={inReport} onChange={setInReport} />
    </ESheetShell>
  );
}

window.AddTxnD_CreditPay = AddTxnD_CreditPay;
