// Add Transaction Bottom Sheet · 02 · รายรับ
// Function: AddTxnD_Income
// Depends on transaction_shared.jsx (must load first)

const TC = window.MINT;
const TE = window.MINT;
const {
  ESheetShell, ETabs, EAmountHero, EFieldRow,
  ECategoryChips, EWalletCatRow,
  EMetaRow, ETagsRow, EReportToggle,
  CATEGORY_COLORS,
} = window;

function AddTxnD_Income() {
  const [cat, setCat] = React.useState(null);
  const [tags, setTags] = React.useState([]);
  const [inReport, setInReport] = React.useState(true);
  const [txns] = React.useState([
    {
      type: 'income',
      amount: 35000,
      cat: CATEGORY_COLORS[0],
      catLabel: 'เงินเดือน',
      merchant: 'เงินเดือน',
      walletLabel: 'ครอบครัว',
      time: '09:00',
    },
  ]);

  return (
    <ESheetShell txns={txns}>
      <ETabs active="income" />

      <EAmountHero amount="35,000" sign="+" />

      <div style={{ padding: '0 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletPink100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="piggy" size={18} color={TC.walletPink} />
          </div>}
          label="เข้ากระเป๋า"
          value="ครอบครัว"
          hint="คงเหลือ 34,368฿"
        />
        <ECategoryChips value={cat} onChange={setCat} />
      </div>

      <EMetaRow />

      <ETagsRow value={tags} onChange={setTags} />

      <EReportToggle value={inReport} onChange={setInReport} />
    </ESheetShell>
  );
}

window.AddTxnD_Income = AddTxnD_Income;
