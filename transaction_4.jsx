// Add Transaction Bottom Sheet · 04 · บัตรเครดิต · รับ Cashback
// Function: AddTxnD_CreditCashback
// Depends on transaction_shared.jsx (must load first)

const TC = window.MINT;
const TE = window.MINT;
const {
  ESheetShell, ETabs, EAmountHero, EFieldRow,
  ECategoryChips, EWalletCatRow,
  EMetaRow, ETagsRow, EReportToggle,
  CATEGORY_COLORS,
} = window;

function AddTxnD_CreditCashback() {
  const [tags, setTags] = React.useState([]);
  const [inReport, setInReport] = React.useState(true);
  const [txns] = React.useState([
    {
      type: 'income',
      amount: 240,
      cat: { label: 'Cashback', icon: 'card', bg: TC.primary100, ic: TC.primary500 },
      catLabel: 'Cashback',
      merchant: 'Kbank Credit',
      walletLabel: 'Kbank Credit',
      time: '09:30',
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
            const on = t.key === 'cashback';
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

      {/* Amount hero — matches EAmountHero style */}
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
            <span style={{ color: TC.primary500 }}>{'+'}</span>240
            <span style={{ color: TC.n400, fontWeight: 500 }}>.00</span>
          </div>
          <div style={{
            width: 2, height: 30, background: TC.primary500,
            animation: 'cursor-blink 1s infinite'
          }} />
        </div>
        <div style={{ fontSize: 12, color: TC.primary500, marginTop: 8, fontWeight: 500 }}>
          Cashback ลดค้างชำระ Kbank Credit
        </div>
      </div>

      {/* Card row + Promo */}
      <div style={{ padding: '0 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletViolet100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="card" size={18} color={TC.walletViolet} />
          </div>}
          label="เข้าบัตรเครดิต"
          value="Kbank Credit"
          hint="ค้างชำระ 116,547 ฿"
        />

        {/* Promo card */}
        <div style={{
          background: TC.primary100, borderRadius: 12, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={TC.primary500} strokeWidth="1.8"/>
              <path d="M8 14l3-6 2 4 3-3" stroke={TC.primary500} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TC.primary600 }}>โปรโมชั่น 5% คืน</div>
            <div style={{ fontSize: 11, color: TC.n600 }}>หมวดร้านอาหาร · เม.ย. 2569</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke={TC.primary500} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <EMetaRow />

      <ETagsRow value={tags} onChange={setTags} />

      <EReportToggle value={inReport} onChange={setInReport} />
    </ESheetShell>
  );
}

window.AddTxnD_CreditCashback = AddTxnD_CreditCashback;
