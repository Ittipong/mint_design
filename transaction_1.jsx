// Add Transaction Bottom Sheet · 01 · รายจ่าย (improved)
// Function: AddTxnE_Expense
// Depends on transaction_shared.jsx (must load first)

const TC = window.MINT;
const TE = window.MINT;
const {
  ESheetShell, ETabs, EAmountHero, EFieldRow,
  ECategoryChips, EWalletCatRow,
  EMetaRow, ETagsRow, EReportToggle,
  CATEGORY_COLORS,
} = window;

function AddTxnE_Expense() {
  const [cat, setCat] = React.useState(null); // { key, subKey: string|null }
  const [tags, setTags] = React.useState([]);
  const [inReport, setInReport] = React.useState(true);
  const [txns] = React.useState([
    {
      type: 'expense', amount: 120,
      cat: { label: 'อาหาร', icon: 'food', bg: '#FEE2E2', ic: '#EF4444' },
      catLabel: 'อาหาร', merchant: 'ข้าวกลางวัน',
      walletLabel: 'ครอบครัว', time: '08:45',
    },
    {
      type: 'expense', amount: 44,
      cat: { label: 'เดินทาง', icon: 'transport', bg: '#DBEAFE', ic: '#3B82F6' },
      catLabel: 'เดินทาง', merchant: 'BTS',
      walletLabel: 'ครอบครัว', time: '08:15',
    },
  ]);

  return (
    <ESheetShell txns={txns}>
      <ETabs active="expense" />

      <EAmountHero amount="85" sign="−" />

      {/* Wallet + Category — 2-column tiles */}
      <EWalletCatRow catValue={cat} onCatChange={setCat} />

      <EMetaRow />

      <ETagsRow value={tags} onChange={setTags} />

      <EReportToggle value={inReport} onChange={setInReport} />
    </ESheetShell>
  );
}

window.AddTxnE_Expense = AddTxnE_Expense;
