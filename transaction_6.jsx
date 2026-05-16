// Add Transaction Bottom Sheet · 06 · โอนเงิน
// Function: AddTxnD_Transfer
// Depends on transaction_shared.jsx (must load first)

const TC = window.MINT;
const TE = window.MINT;
const {
  ESheetShell, ETabs, EAmountHero, EFieldRow,
  ECategoryChips, EWalletCatRow,
  EMetaRow, ETagsRow, EReportToggle,
  CATEGORY_COLORS,
} = window;

function AddTxnD_Transfer() {
  const [tags, setTags] = React.useState([]);
  const [inReport, setInReport] = React.useState(false);
  const [txns] = React.useState([
    {
      type: 'transfer',
      amount: 500,
      cat: { label: 'โอนเงิน', icon: 'transfer', bg: TC.primary100, ic: TC.primary500 },
      catLabel: 'โอนเงิน',
      merchant: 'ครอบครัว → TrueMoney',
      walletLabel: 'ครอบครัว',
      time: '09:00',
    },
  ]);

  return (
    <ESheetShell txns={txns}>
      <ETabs active="transfer" />

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
          <span style={{
            fontSize: 56, fontWeight: 800, color: TC.n900,
            letterSpacing: -2, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}>
            5,000
          </span>
          <span style={{ fontSize: 22, fontWeight: 600, color: TC.n400, fontVariantNumeric: 'tabular-nums' }}>.00</span>
          <span style={{ fontSize: 13, color: TC.n400, fontWeight: 600, marginLeft: 4 }}>฿</span>
        </div>
        <div style={{ fontSize: 12, color: TC.n500, marginTop: 8, fontWeight: 500 }}>
          โอนระหว่างกระเป๋า · ไม่นับเป็นรายจ่าย/รับ
        </div>
      </div>

      {/* From/To rows */}
      <div style={{ padding: '0 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletPink100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="piggy" size={18} color={TC.walletPink} />
          </div>}
          label="โอนจาก"
          value="ครอบครัว"
          hint="คงเหลือ 34,368 ฿"
        />
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletGreen100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="wallet" size={18} color={TC.walletGreen} />
          </div>}
          label="โอนไปยัง"
          value="TrueMoney"
          hint="คงเหลือ 17,300 ฿"
        />

        {/* Fee row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', borderRadius: 12, padding: '10px 12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={TC.n600} strokeWidth="1.8"/>
              <path d="M9 9c0-1.5 1.5-2 3-2s3 0.5 3 2c0 2-3 2-3 4M12 17v.5" stroke={TC.n600} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 12, color: TC.n700, fontWeight: 600 }}>ค่าธรรมเนียม</div>
          </div>
          <div style={{ fontSize: 12, color: TC.n400 }}>+ เพิ่ม</div>
        </div>
      </div>

      <EMetaRow />

      <ETagsRow value={tags} onChange={setTags} />

      <EReportToggle value={inReport} onChange={setInReport} />
    </ESheetShell>
  );
}

window.AddTxnD_Transfer = AddTxnD_Transfer;
