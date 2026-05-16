// Add Transaction Bottom Sheet · 07 · ออมเงิน · ออม
// Function: AddTxnD_SavingDeposit
// Depends on transaction_shared.jsx (must load first)

const TC = window.MINT;
const TE = window.MINT;
const {
  ESheetShell, ETabs, EAmountHero, EFieldRow,
  ECategoryChips, EWalletCatRow,
  EMetaRow, ETagsRow, EReportToggle,
  CATEGORY_COLORS,
} = window;

function AddTxnD_SavingDeposit() {
  const [tags, setTags] = React.useState([]);
  const [inReport, setInReport] = React.useState(true);
  const [txns] = React.useState([
    {
      type: 'income',
      amount: 5000,
      cat: { label: 'ออมเงิน', icon: 'saving', bg: TC.primary100, ic: TC.primary500 },
      catLabel: 'ออมเงิน',
      merchant: 'เที่ยวอังกฤษ',
      walletLabel: 'ครอบครัว',
      time: '09:30',
    },
  ]);
  const goal = {
    name: 'เที่ยวอังกฤษ',
    saved: 49100, target: 100000, by: '31 ธ.ค. 2569', daysLeft: 246,
    monthly: 7190, addedThisMonth: 7200,
    icon: 'plane', bg: TC.primary100, ic: TC.primary500,
  };
  const newAmount = 7161;
  const newSaved = goal.saved + newAmount;
  const newPct = (newSaved / goal.target) * 100;
  const oldPct = (goal.saved / goal.target) * 100;

  return (
    <ESheetShell txns={txns}>
      <ETabs active="saving" />

      {/* Saving sub-tabs */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {[
            { key: 'deposit', label: 'ออมเงิน' },
            { key: 'withdraw', label: 'ถอนเงิน' },
          ].map(t => {
            const on = t.key === 'deposit';
            return (
              <div key={t.key} style={{
                padding: '8px 16px', borderRadius: 999,
                background: on ? TC.primary100 : '#fff',
                color: on ? TC.primary600 : TC.n600,
                fontSize: 13, fontWeight: on ? 700 : 500,
                border: on ? `1.5px solid ${TC.primary500}` : `1px solid ${TC.n300}`,
                flexShrink: 0,
              }}>{t.label}</div>
            );
          })}
        </div>
      </div>

      {/* Goal preview card */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: '12px 14px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 18px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, background: goal.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <CatIcon kind={goal.icon} size={18} color={goal.ic} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TC.n900 }}>{goal.name}</div>
              <div style={{ fontSize: 11, color: TC.n400, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CatIcon kind="budget" size={14} color={TC.n400} />
                {goal.by} · เหลืออีก {goal.daysLeft} วัน
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke={TC.n400} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Progress preview */}
          <div style={{ marginTop: 12, position: 'relative' }}>
            <div style={{
              height: 10, borderRadius: 5, background: TC.n300, overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${oldPct}%`, background: `linear-gradient(90deg, ${TC.primary300}, ${TC.primary500})`,
              }} />
              <div style={{
                position: 'absolute', left: `${oldPct}%`, top: 0, bottom: 0,
                width: `${newPct - oldPct}%`,
                background: `repeating-linear-gradient(45deg, ${TC.primary200}, ${TC.primary200} 4px, ${TC.primary300} 4px, ${TC.primary300} 8px)`,
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: TC.n400 }}>
              <span>
                <span style={{ color: TC.n700, fontWeight: 700 }}>฿{goal.saved.toLocaleString()}</span>
                <span style={{ color: TC.primary600, fontWeight: 700 }}> +฿{newAmount.toLocaleString()}</span>
              </span>
              <span>
                <span style={{ color: TC.primary600, fontWeight: 700 }}>{newPct.toFixed(0)}%</span>
                <span> · ฿{goal.target.toLocaleString()}</span>
              </span>
            </div>
          </div>

          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 10,
            background: TC.primary100, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3a6 6 0 016 6c0 3-2 4-2 6h-8c0-2-2-3-2-6a6 6 0 016-6z" stroke={TC.primary600} strokeWidth="1.6"/>
              <path d="M9 18h6M10 21h4" stroke={TC.primary600} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 11, color: TC.primary600, flex: 1 }}>
              แนะนำ ฿{goal.monthly.toLocaleString()}/เดือน · เดือนนี้ออมไปแล้ว ฿{goal.addedThisMonth.toLocaleString()}
            </div>
          </div>
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
          <span style={{ fontSize: 28, fontWeight: 700, color: TC.primary500, letterSpacing: -0.5 }}>{'+'}</span>
          <span style={{
            fontSize: 56, fontWeight: 800, color: TC.n900,
            letterSpacing: -2, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}>
            7,161
          </span>
          <span style={{ fontSize: 22, fontWeight: 600, color: TC.n400, fontVariantNumeric: 'tabular-nums' }}>.00</span>
          <span style={{ fontSize: 13, color: TC.n400, fontWeight: 600, marginLeft: 4 }}>฿</span>
        </div>
      </div>

      {/* Wallet row */}
      <div style={{ padding: '0 16px 10px' }}>
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TC.walletPink100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="piggy" size={18} color={TC.walletPink} />
          </div>}
          label="จากกระเป๋า"
          value="ครอบครัว"
          hint="คงเหลือ 34,368 ฿"
        />
      </div>

      <EMetaRow />

      <ETagsRow value={tags} onChange={setTags} />

      <EReportToggle value={inReport} onChange={setInReport} />
    </ESheetShell>
  );
}

window.AddTxnD_SavingDeposit = AddTxnD_SavingDeposit;
