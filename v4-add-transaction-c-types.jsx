// v4 — Add Transaction · Variation C (Smart Bottom Sheet) — full type coverage
// Types: Expense, Income, CreditCard (pay/cashback/withdraw), Transfer, Saving (deposit/withdraw)
// Design language: Sarabun, teal primary, white sheets on n200 bg, soft shadows.
// All sheets share a 2-tier tab system that mirrors the original app, but with
// the sheet-style patterns from Variation C (smart suggestions, compact meta row,
// inline amount card, "บันทึก & เพิ่มอีก" CTA).

const TC = window.MINT;

// ─── Shared chrome ────────────────────────────────────────
function CSheetShell({ children, peek = false }) {
  return (
    <div style={{
      background: peek
        ? 'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.25))'
        : TC.n200,
      height: '100%', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <MintStatusBarV2 time="09:30" />
      {peek && (
        <div style={{
          position: 'absolute', top: 60, left: 0, right: 0, padding: '0 20px', opacity: 0.3,
        }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>กิจกรรม</div>
          <div style={{ marginTop: 14 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: '#fff', height: 56, borderRadius: 14, marginBottom: 10, opacity: 0.55 }} />
            ))}
          </div>
        </div>
      )}
      <div style={{
        background: TC.n200, borderRadius: peek ? '24px 24px 0 0' : 0,
        padding: '0 0 24px',
        boxShadow: peek ? '0 -10px 30px rgba(0,0,0,0.15)' : 'none',
        position: 'relative',
        height: peek ? 'auto' : '100%',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div style={{ width: 36, height: 5, borderRadius: 3, background: TC.n300 }} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 18px 12px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke={TC.n800} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 17, fontWeight: 700, color: TC.n900 }}>เพิ่มธุรกรรม</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: TC.primary500 }}>เสร็จ</div>
        </div>
        {children}
      </div>
    </div>
  );
}

// 2-tier tabs (top: รายจ่าย/รายรับ/บัตรเครดิต/โอนเงิน/ออมเงิน, bottom: subtype)
function CTabs({ active, sub, subOptions }) {
  // top tabs as horizontal scrollable pills
  const tops = [
    { key: 'expense', label: 'รายจ่าย' },
    { key: 'income',  label: 'รายรับ' },
    { key: 'credit',  label: 'บัตรเครดิต' },
    { key: 'transfer',label: 'โอนเงิน' },
    { key: 'saving',  label: 'ออมเงิน' },
  ];
  return (
    <div style={{ padding: '0 14px 12px' }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {tops.map(t => {
          const on = t.key === active;
          return (
            <div key={t.key} style={{
              padding: '7px 14px', borderRadius: 999,
              background: on ? TC.n900 : '#fff',
              color: on ? '#fff' : TC.n600,
              fontSize: 12, fontWeight: on ? 700 : 500,
              border: on ? 'none' : `1px solid ${TC.n300}`,
              flexShrink: 0,
            }}>{t.label}</div>
          );
        })}
      </div>
      {subOptions && (
        <div style={{
          marginTop: 10, padding: 4, background: TC.n300, borderRadius: 11, display: 'flex',
        }}>
          {subOptions.map(s => {
            const on = s.key === sub;
            return (
              <div key={s.key} style={{
                flex: 1, textAlign: 'center', padding: '7px 4px', borderRadius: 8,
                fontSize: 12, fontWeight: on ? 700 : 500,
                color: on ? TC.n900 : TC.n600,
                background: on ? '#fff' : 'transparent',
                boxShadow: on ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}>{s.label}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Compact amount card with sign + currency + scan
function CAmountCard({ amount = '0', sign = '-', signColor, hint }) {
  return (
    <div style={{
      margin: '0 16px 10px', background: '#fff', borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, color: TC.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>จำนวน</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: TC.n600, background: TC.n200, padding: '3px 8px', borderRadius: 7 }}>THB ▾</div>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: TC.n200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2" stroke={TC.n600} strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="8" y="9" width="8" height="6" rx="1" stroke={TC.n600} strokeWidth="1.8"/>
            </svg>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        {sign && <span style={{ fontSize: 22, fontWeight: 700, color: signColor || TC.n900 }}>{sign}</span>}
        <span style={{ fontSize: 38, fontWeight: 800, color: TC.n900, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>{amount}</span>
        <span style={{ fontSize: 18, fontWeight: 600, color: TC.n400 }}>.00</span>
      </div>
      {hint && <div style={{ fontSize: 11, color: TC.n400, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

// Account/wallet picker row
function CAccountRow({ label, icon, name, sub, hint, dim }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
      border: dim ? `1px dashed ${TC.n300}` : 'none',
      boxShadow: dim ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
    }}>
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: TC.n400, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 13, color: name ? TC.n900 : TC.n400, fontWeight: name ? 600 : 500 }}>{name || hint || 'เลือกกระเป๋า'}</div>
      </div>
      {sub && <div style={{ fontSize: 11, color: TC.n400, textAlign: 'right' }}>{sub}</div>}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke={TC.n400} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// Down-arrow connector between two accounts (transfer / pay-from)
function CArrowConnector() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 14, background: TC.primary100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v16M6 14l6 6 6-6" stroke={TC.primary500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// Compact meta row (date / tag / note) like Variation C
function CMetaRow({ showNote = true }) {
  return (
    <>
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 12, padding: '4px 4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        }}>
          <MetaCell
            icon={<CatIcon kind="budget" size={14} color={TC.primary500} />}
            label="วันที่" value="วันนี้" />
          <MetaCell
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 12V4h8l10 10-8 8L3 12z" stroke={TC.primary500} strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="7.5" cy="7.5" r="1.2" fill={TC.primary500}/>
            </svg>}
            label="แท็ก" value="+ เพิ่ม" sep />
          <MetaCell
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={TC.n600} strokeWidth="1.8"/>
              <path d="M12 8v4l3 2" stroke={TC.n600} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>}
            label="เวลา" value="09:30" sep />
        </div>
      </div>
      {showNote && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '11px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h11l3 3v13H5V4z" stroke={TC.n400} strokeWidth="1.6"/>
              <path d="M9 10h7M9 13h7" stroke={TC.n400} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 12, color: TC.n400, flex: 1 }}>เพิ่มบันทึก…</div>
          </div>
        </div>
      )}
    </>
  );
}

// Save bar (FAB + primary)
function CSaveBar({ label = 'บันทึก & เพิ่มอีก' }) {
  return (
    <div style={{ padding: '0 16px', display: 'flex', gap: 8, marginTop: 'auto' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2" stroke={TC.n700} strokeWidth="1.8" strokeLinecap="round"/>
          <rect x="8" y="9" width="8" height="6" rx="1" stroke={TC.n700} strokeWidth="1.8"/>
        </svg>
      </div>
      <button style={{
        flex: 1, padding: '14px', borderRadius: 12, border: 'none',
        background: TC.primary500, color: '#fff',
        fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
        letterSpacing: 0.3, cursor: 'pointer',
        boxShadow: '0 6px 14px rgba(44,122,123,0.3)',
      }}>{label}</button>
    </div>
  );
}

// Wallet icon shorthand
const WalletIcon = ({ bg, ic, kind }) => (
  <div style={{
    width: 32, height: 32, borderRadius: 10, background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <CatIcon kind={kind} size={16} color={ic} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// 1 · EXPENSE
// ═══════════════════════════════════════════════════════════════
function AddTxnC_Expense() {
  return (
    <CSheetShell>
      <CTabs active="expense" />
      <CAmountCard amount="85" sign="-" signColor={TC.error400} hint="หมวด: อาหาร · กระเป๋า: ครอบครัว" />

      {/* Smart suggestions */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{ fontSize: 10, color: TC.n400, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', padding: '0 4px', marginBottom: 6 }}>
          ที่คุณเลือกบ่อย
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: 2 }}>
          {[
            { name: 'กาแฟร้านประจำ', sub: '85 ฿', cat: EXPENSE_CATS[0], on: true },
            { name: 'ข้าวกลางวัน',   sub: '120 ฿', cat: EXPENSE_CATS[0] },
            { name: 'BTS',           sub: '44 ฿',  cat: EXPENSE_CATS[2] },
            { name: '7-11',          sub: '—',     cat: EXPENSE_CATS[1] },
          ].map(s => (
            <div key={s.name} style={{
              background: '#fff', borderRadius: 12, padding: '7px 10px',
              display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              border: s.on ? `1.5px solid ${TC.primary500}` : `1px solid ${TC.n300}`,
            }}>
              <CatChipIcon cat={s.cat} size={26} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: TC.n900 }}>{s.name}</div>
                <div style={{ fontSize: 10, color: TC.n400 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category + Wallet */}
      <div style={{ padding: '0 16px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <CAccountRow
          label="หมวดหมู่"
          icon={<WalletIcon bg={EXPENSE_CATS[0].bg} ic={EXPENSE_CATS[0].ic} kind={EXPENSE_CATS[0].icon} />}
          name="อาหาร" />
        <CAccountRow
          label="กระเป๋า"
          icon={<WalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
          name="ครอบครัว" />
      </div>

      <CMetaRow />
      <CSaveBar />
    </CSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2 · INCOME
// ═══════════════════════════════════════════════════════════════
function AddTxnC_Income() {
  return (
    <CSheetShell>
      <CTabs active="income" />
      <CAmountCard amount="35,000" sign="+" signColor={TC.primary500} hint="หมวด: เงินเดือน · เข้า: ครอบครัว" />

      {/* Quick repeat */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{ fontSize: 10, color: TC.n400, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', padding: '0 4px', marginBottom: 6 }}>
          รายรับประจำ
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: 2 }}>
          {[
            { name: 'เงินเดือน', sub: '35,000 ฿ · ทุก 25', cat: INCOME_CATS[0], on: true },
            { name: 'งาน Freelance', sub: 'ครั้งล่าสุด 8,500 ฿', cat: INCOME_CATS[1] },
            { name: 'ปันผล', sub: 'ครั้งล่าสุด 1,200 ฿', cat: INCOME_CATS[2] },
          ].map(s => (
            <div key={s.name} style={{
              background: '#fff', borderRadius: 12, padding: '7px 10px',
              display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              border: s.on ? `1.5px solid ${TC.primary500}` : `1px solid ${TC.n300}`,
              minWidth: 160,
            }}>
              <CatChipIcon cat={s.cat} size={26} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: TC.n900 }}>{s.name}</div>
                <div style={{ fontSize: 10, color: TC.n400 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <CAccountRow
          label="หมวดหมู่"
          icon={<WalletIcon bg={INCOME_CATS[0].bg} ic={INCOME_CATS[0].ic} kind={INCOME_CATS[0].icon} />}
          name="เงินเดือน" />
        <CAccountRow
          label="เข้ากระเป๋า"
          icon={<WalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
          name="ครอบครัว" />
      </div>

      <CMetaRow />
      <CSaveBar />
    </CSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3a · CREDIT CARD — จ่ายบัตร (Pay)
// ═══════════════════════════════════════════════════════════════
function AddTxnC_CreditPay() {
  return (
    <CSheetShell>
      <CTabs active="credit" sub="pay" subOptions={[
        { key: 'pay', label: 'จ่ายบัตรเครดิต' },
        { key: 'cashback', label: 'รับ Cashback' },
        { key: 'withdraw', label: 'กดเงินสด' },
      ]} />
      <CAmountCard amount="3,500" sign="" signColor={TC.n900} hint="ขั้นต่ำเดือนนี้: 1,200 ฿ · กำหนด 5 พ.ค." />

      {/* From → To: pay TO credit, FROM bank */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <CAccountRow
            label="ชำระบัตรเครดิต"
            icon={<WalletIcon bg={TC.walletViolet100} ic={TC.walletViolet} kind="card" />}
            name="Kbank Credit"
            sub="ค้างชำระ 116,547 ฿" />
          <CArrowConnector />
          <CAccountRow
            label="จ่ายจากกระเป๋า"
            icon={<WalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
            name="ครอบครัว"
            sub="คงเหลือ 34,368 ฿" />
        </div>

        {/* Quick pay amount chips */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {[
            { label: 'ขั้นต่ำ', value: '1,200', color: TC.warning400 },
            { label: 'เต็มจำนวน', value: '116,547', color: TC.primary500 },
            { label: '50%', value: '58,273', color: TC.n600 },
            { label: 'กำหนดเอง', value: null, color: TC.n600 },
          ].map(c => (
            <div key={c.label} style={{
              flex: 1, padding: '7px 6px', borderRadius: 10,
              background: '#fff', border: `1px solid ${TC.n300}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: TC.n400 }}>{c.label}</div>
              {c.value && <div style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.value}</div>}
              {!c.value && <div style={{ fontSize: 11, fontWeight: 600, color: c.color }}>—</div>}
            </div>
          ))}
        </div>
      </div>

      <CMetaRow />
      <CSaveBar />
    </CSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3b · CREDIT CARD — รับ Cashback
// ═══════════════════════════════════════════════════════════════
function AddTxnC_CreditCashback() {
  return (
    <CSheetShell>
      <CTabs active="credit" sub="cashback" subOptions={[
        { key: 'pay', label: 'จ่ายบัตรเครดิต' },
        { key: 'cashback', label: 'รับ Cashback' },
        { key: 'withdraw', label: 'กดเงินสด' },
      ]} />
      <CAmountCard amount="240" sign="+" signColor={TC.primary500} hint="Cashback ลดค้างชำระ Kbank Credit" />

      <div style={{ padding: '0 16px 10px' }}>
        <CAccountRow
          label="เข้าบัตรเครดิต"
          icon={<WalletIcon bg={TC.walletViolet100} ic={TC.walletViolet} kind="card" />}
          name="Kbank Credit"
          sub="ค้างชำระ 116,547 ฿" />
      </div>

      {/* Cashback source / promo */}
      <div style={{ padding: '0 16px 10px' }}>
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

      <CMetaRow />
      <CSaveBar />
    </CSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3c · CREDIT CARD — กดเงินสด (Withdraw)
// ═══════════════════════════════════════════════════════════════
function AddTxnC_CreditWithdraw() {
  return (
    <CSheetShell>
      <CTabs active="credit" sub="withdraw" subOptions={[
        { key: 'pay', label: 'จ่ายบัตรเครดิต' },
        { key: 'cashback', label: 'รับ Cashback' },
        { key: 'withdraw', label: 'กดเงินสด' },
      ]} />
      <CAmountCard amount="2,000" sign="" signColor={TC.n900} hint="ค่าธรรมเนียม 3% ≈ 60 ฿ · ดอกเบี้ยเริ่มทันที" />

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <CAccountRow
            label="กดเงินสดจาก"
            icon={<WalletIcon bg={TC.walletViolet100} ic={TC.walletViolet} kind="card" />}
            name="Kbank Credit"
            sub="วงเงินสด 50,000 ฿" />
          <CArrowConnector />
          <CAccountRow
            label="เข้ากระเป๋า"
            icon={<WalletIcon bg={TC.walletGreen100} ic={TC.walletGreen} kind="wallet" />}
            name="เงินสด" />
        </div>

        {/* Fee + interest warning */}
        <div style={{
          marginTop: 8, padding: '8px 12px', borderRadius: 10,
          background: TC.error100, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={TC.error400} strokeWidth="1.8"/>
            <path d="M12 8v5M12 16v.5" stroke={TC.error400} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 11, color: TC.error500, flex: 1 }}>
            ค่าธรรมเนียม <b>60 ฿</b> + ดอกเบี้ย <b>16% ต่อปี</b> เริ่มคิดทันที
          </div>
        </div>
      </div>

      <CMetaRow />
      <CSaveBar />
    </CSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4 · TRANSFER
// ═══════════════════════════════════════════════════════════════
function AddTxnC_Transfer() {
  return (
    <CSheetShell>
      <CTabs active="transfer" />
      <CAmountCard amount="5,000" sign="" hint="โอนระหว่างกระเป๋า · ไม่นับเป็นรายจ่าย/รับ" />

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <CAccountRow
            label="โอนจาก"
            icon={<WalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
            name="ครอบครัว"
            sub="คงเหลือ 34,368 ฿" />
          <CArrowConnector />
          <CAccountRow
            label="โอนไปยัง"
            icon={<WalletIcon bg={TC.walletGreen100} ic={TC.walletGreen} kind="wallet" />}
            name="TrueMoney"
            sub="คงเหลือ 17,300 ฿" />
        </div>

        {/* Optional fee */}
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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

      <CMetaRow />
      <CSaveBar />
    </CSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5a · SAVING — ออมเงิน (deposit to goal)
// ═══════════════════════════════════════════════════════════════
function AddTxnC_SavingDeposit() {
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
    <CSheetShell>
      <CTabs active="saving" sub="deposit" subOptions={[
        { key: 'deposit', label: 'ออมเงิน' },
        { key: 'withdraw', label: 'ถอนเงิน' },
      ]} />

      {/* Goal preview card with progress preview */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: '12px 14px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 18px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, background: goal.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <CatIcon kind={goal.icon} size={20} color={goal.ic} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TC.n900 }}>{goal.name}</div>
              <div style={{ fontSize: 11, color: TC.n400, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CatIcon kind="budget" size={11} color={TC.n400} />
                {goal.by} · เหลืออีก {goal.daysLeft} วัน
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke={TC.n400} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Progress preview: old → new */}
          <div style={{ marginTop: 12, position: 'relative' }}>
            <div style={{
              height: 10, borderRadius: 5, background: TC.n300, overflow: 'hidden', position: 'relative',
            }}>
              {/* old portion */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${oldPct}%`, background: `linear-gradient(90deg, ${TC.primary300}, ${TC.primary500})`,
              }} />
              {/* new portion (lighter) */}
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

          {/* Insight */}
          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 10,
            background: TC.primary100, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3a6 6 0 016 6c0 3-2 4-2 6h-8c0-2-2-3-2-6a6 6 0 016-6z" stroke={TC.primary600} strokeWidth="1.6"/>
              <path d="M9 18h6M10 21h4" stroke={TC.primary600} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 11, color: TC.primary600, flex: 1 }}>
              แนะนำ <b>฿{goal.monthly.toLocaleString()}/เดือน</b> · เดือนนี้ออมไปแล้ว ฿{goal.addedThisMonth.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <CAmountCard amount="7,161" sign="+" signColor={TC.primary500} />

      <div style={{ padding: '0 16px 10px' }}>
        <CAccountRow
          label="จากกระเป๋า"
          icon={<WalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
          name="ครอบครัว"
          sub="คงเหลือ 34,368 ฿" />
      </div>

      <CMetaRow showNote={false} />
      <CSaveBar />
    </CSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5b · SAVING — ถอนเงินจากเป้าหมาย (Withdraw)
// ═══════════════════════════════════════════════════════════════
function AddTxnC_SavingWithdraw() {
  const goal = {
    name: 'เที่ยวอังกฤษ',
    saved: 49100, target: 100000, by: '31 ธ.ค. 2569', daysLeft: 246,
    icon: 'plane', bg: TC.primary100, ic: TC.primary500,
  };
  const withdrawAmt = 5000;
  const newSaved = goal.saved - withdrawAmt;
  const newPct = (newSaved / goal.target) * 100;
  const oldPct = (goal.saved / goal.target) * 100;

  return (
    <CSheetShell>
      <CTabs active="saving" sub="withdraw" subOptions={[
        { key: 'deposit', label: 'ออมเงิน' },
        { key: 'withdraw', label: 'ถอนเงิน' },
      ]} />

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: '12px 14px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 18px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: goal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CatIcon kind={goal.icon} size={20} color={goal.ic} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TC.n900 }}>{goal.name}</div>
              <div style={{ fontSize: 11, color: TC.n400 }}>{goal.by}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke={TC.n400} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Progress: shows reduction with red strike portion */}
          <div style={{ marginTop: 12 }}>
            <div style={{
              height: 10, borderRadius: 5, background: TC.n300, overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${newPct}%`, background: `linear-gradient(90deg, ${TC.primary300}, ${TC.primary500})`,
              }} />
              <div style={{
                position: 'absolute', left: `${newPct}%`, top: 0, bottom: 0,
                width: `${oldPct - newPct}%`,
                background: `repeating-linear-gradient(45deg, ${TC.error200}, ${TC.error200} 4px, ${TC.error300} 4px, ${TC.error300} 8px)`,
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: TC.n400 }}>
              <span>
                <span style={{ color: TC.n700, fontWeight: 700 }}>฿{newSaved.toLocaleString()}</span>
                <span style={{ color: TC.error400, fontWeight: 700 }}> −฿{withdrawAmt.toLocaleString()}</span>
              </span>
              <span>{newPct.toFixed(0)}% · ฿{goal.target.toLocaleString()}</span>
            </div>
          </div>

          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 10,
            background: TC.error100, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={TC.error400} strokeWidth="1.8"/>
              <path d="M12 8v5M12 16v.5" stroke={TC.error400} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 11, color: TC.error500, flex: 1 }}>
              ถอนแล้วจะช้ากว่าแผน · ต้องออมเพิ่ม <b>฿810/เดือน</b> เพื่อให้ทันกำหนด
            </div>
          </div>
        </div>
      </div>

      <CAmountCard amount="5,000" sign="−" signColor={TC.error400} />

      <div style={{ padding: '0 16px 10px' }}>
        <CAccountRow
          label="เข้ากระเป๋า"
          icon={<WalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
          name="ครอบครัว" />
      </div>

      <CMetaRow showNote={false} />
      <CSaveBar />
    </CSheetShell>
  );
}

Object.assign(window, {
  AddTxnC_Expense, AddTxnC_Income,
  AddTxnC_CreditPay, AddTxnC_CreditCashback, AddTxnC_CreditWithdraw,
  AddTxnC_Transfer,
  AddTxnC_SavingDeposit, AddTxnC_SavingWithdraw,
});
