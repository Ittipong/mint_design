// Add Transaction Bottom Sheet · 05 · บัตรเครดิต · กดเงินสด
// Function: AddTxnD_CreditWithdraw
// Depends on transaction_shared.jsx (must load first)

const TC = window.MINT;
const TE = window.MINT;
const {
  ESheetShell, ETabs, EAmountHero, EFieldRow,
  ECategoryChips, EWalletCatRow,
  EMetaRow, ETagsRow, EReportToggle,
  CATEGORY_COLORS,
} = window;

function AddTxnD_CreditWithdraw() {
  const [tags, setTags] = React.useState([]);
  const [inReport, setInReport] = React.useState(true);
  const [txns] = React.useState([
    {
      type: 'transfer',
      amount: 2000,
      cat: { label: 'กดเงินสด', icon: 'card', bg: TC.walletViolet100, ic: TC.walletViolet },
      catLabel: 'กดเงินสด',
      merchant: 'Kbank Credit',
      walletLabel: 'เงินสด',
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
            const on = t.key === 'withdraw';
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

      {/* Amount hero */}
      <div style={{
        margin: '0 16px 12px', background: '#fff', borderRadius: 18,
        padding: '20px 18px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, color: TC.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>
          จำนวนเงิน
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: TC.n900, letterSpacing: -0.5 }}>{'−'}</span>
          <span style={{
            fontSize: 56, fontWeight: 800, color: TC.n900,
            letterSpacing: -2, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}>
            2,000
          </span>
          <span style={{ fontSize: 22, fontWeight: 600, color: TC.n400, fontVariantNumeric: 'tabular-nums' }}>.00</span>
          <span style={{ fontSize: 13, color: TC.n400, fontWeight: 600, marginLeft: 4 }}>฿</span>
        </div>
        <div style={{ fontSize: 12, color: TC.error500, marginTop: 8, fontWeight: 500 }}>
          ค่าธรรมเนียม 3% ≈ 60 ฿ · ดอกเบี้ยเริ่มทันที
        </div>
      </div>

      {/* Card & Wallet rows */}
      <div style={{ padding: '0 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletViolet100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="card" size={18} color={TC.walletViolet} />
          </div>}
          label="กดเงินสดจาก"
          value="Kbank Credit"
          hint="วงเงินสด 50,000 ฿"
        />
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletGreen100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="wallet" size={18} color={TC.walletGreen} />
          </div>}
          label="เข้ากระเป๋า"
          value="เงินสด"
        />

        {/* Warning alert */}
        <div style={{
          padding: '8px 12px', borderRadius: 10,
          background: TC.error100, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={TC.error400} strokeWidth="1.8"/>
            <path d="M12 8v5M12 16v.5" stroke={TC.error400} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 11, color: TC.error500, flex: 1 }}>
            ค่าธรรมเนียม 60 ฿ + ดอกเบี้ย 16% ต่อปี เริ่มคิดทันที
          </div>
        </div>
      </div>

      <EMetaRow />

      <ETagsRow value={tags} onChange={setTags} />

      <EReportToggle value={inReport} onChange={setInReport} />
    </ESheetShell>
  );
}

window.AddTxnD_CreditWithdraw = AddTxnD_CreditWithdraw;
