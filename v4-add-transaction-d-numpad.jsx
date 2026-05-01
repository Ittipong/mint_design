// v4 — Add Transaction · Variation D (Smart Bottom Sheet)
// Supports "add more" pattern: saved txns stack at top, form resets each time.
// Full type coverage: Expense, Income, CreditCard, Transfer, Saving (deposit/withdraw).

const TC = window.MINT;

// ─── Transaction Category Color System ────────────────────────
// All category colors unified (for both expense & income)
const CATEGORY_COLORS = [
  { label: 'แดง', bg: '#FEE2E2', ic: '#EF4444', icon: 'food' },
  { label: 'ส้ม', bg: '#FED7AA', ic: '#F97316', icon: 'home' },
  { label: 'เหลือง', bg: '#FEF3C7', ic: '#F59E0B', icon: 'shopping' },
  { label: 'เขียว', bg: '#DCFCE7', ic: '#22C55E', icon: 'health' },
  { label: 'ฟ้า', bg: '#DBEAFE', ic: '#3B82F6', icon: 'transport' },
  { label: 'ม่วง', bg: '#E9D5FF', ic: '#9333EA', icon: 'fun' },
  { label: 'ชมพู', bg: '#FCE7F3', ic: '#EC4899', icon: 'shopping' },
  { label: 'เทา', bg: TC.n200, ic: TC.n600, icon: 'other' },
  { label: 'เขียวมิ้นต์', bg: TC.primary100, ic: TC.primary500, icon: 'salary' },
  { label: 'น้ำตาล', bg: TC.walletBrown100, ic: TC.walletBrown, icon: 'other' },
];

// Wallet colors
const WALLET_COLORS = [
  { label: 'ชมพู', bg: TC.walletPink100, ic: TC.walletPink },
  { label: 'เขียว', bg: TC.walletGreen100, ic: TC.walletGreen },
  { label: 'ม่วง', bg: TC.walletViolet100, ic: TC.walletViolet },
  { label: 'แดง', bg: TC.walletRed100, ic: TC.walletRed },
  { label: 'น้ำตาล', bg: TC.walletBrown100, ic: TC.walletBrown },
];

// Small icon avatar (rounded square)
function CatChipIcon({ cat, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 12, background: cat.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <CatIcon kind={cat.icon} size={size * 0.55} color={cat.ic} />
    </div>
  );
}

function MetaCell({ icon, label, value, sep }) {
  return (
    <div style={{
      padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8,
      borderLeft: sep ? `1px solid ${TC.n300}` : 'none',
    }}>
      {icon}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 9, color: TC.n400 }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: TC.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
    </div>
  );
}

// ─── Design Panel Component ──────────────────────────────────
function DesignPanel({ visible, onClose }) {
  if (!visible) return null;

  const [activeTab, setActiveTab] = React.useState('category');
  const [categoryColors, setCategoryColors] = React.useState(CATEGORY_COLORS);
  const [walletColors] = React.useState(WALLET_COLORS);
  const [selectedColor, setSelectedColor] = React.useState(null);

  const getColors = () => activeTab === 'wallet' ? walletColors : categoryColors;
  const getSetColors = () => activeTab === 'wallet' ? () => {} : setCategoryColors;

  const handleColorChange = (index, newColor) => {
    const colors = getColors();
    const setColors = getSetColors();
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], ...newColor };
    setColors(newColors);
  };

  const currentColors = getColors();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'transparent', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400,
        maxHeight: '80vh', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${TC.n300}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: TC.n900 }}>Design System</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: TC.n200, color: TC.n700, fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ยกเลิก
            </button>
            <button
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: TC.primary500, color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              บันทึก
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: `1px solid ${TC.n300}`,
          padding: '0 20px',
        }}>
          {[
            { key: 'category', label: 'หมวดหมู่' },
            { key: 'wallet', label: 'กระเป๋า' },
          ].map(tab => (
            <div
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedColor(null); }}
              style={{
                padding: '12px 16px', cursor: 'pointer',
                borderBottom: activeTab === tab.key ? `2px solid ${TC.primary500}` : '2px solid transparent',
                color: activeTab === tab.key ? TC.primary500 : TC.n600,
                fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 500,
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Content - List format */}
        <div style={{ padding: 20, overflow: 'auto', maxHeight: 500 }}>
          {currentColors.map((c, i) => (
            <div
              key={i}
              onClick={() => setSelectedColor(selectedColor === i ? null : i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 12,
                background: selectedColor === i ? TC.n200 : 'transparent',
                cursor: 'pointer',
                marginBottom: 8,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CatIcon kind={c.icon} size={22} color={c.ic} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: TC.n900 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: TC.n500, fontFamily: 'monospace' }}>{c.bg} / {c.ic}</div>
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: c.ic,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: c.bg }} />
              </div>
            </div>
          ))}

          {/* Color picker for selected */}
          {selectedColor !== null && (
            <div style={{
              background: TC.n100, borderRadius: 16, padding: 16, marginTop: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TC.n700, marginBottom: 12 }}>
                แก้ไขสี — {currentColors[selectedColor].label}
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                {/* BG color */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: TC.n500, marginBottom: 6 }}>สีพื้นหลัง</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['#FEE2E2','#FED7AA','#FEF3C7','#DCFCE7','#DBEAFE','#E9D5FF','#FCE7F3','#F3F4F6','#FFFFFF'].map(color => (
                      <div
                        key={color}
                        onClick={() => handleColorChange(selectedColor, { bg: color })}
                        style={{
                          width: 28, height: 28, borderRadius: 6, background: color,
                          cursor: 'pointer', border: currentColors[selectedColor].bg === color ? `2px solid ${TC.primary500}` : '1px solid #ddd',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* IC color */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: TC.n500, marginBottom: 6 }}>สีไอคอน</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['#EF4444','#F97316','#F59E0B','#22C55E','#3B82F6','#9333EA','#EC4899','#6B7280','#1A1A1A'].map(color => (
                      <div
                        key={color}
                        onClick={() => handleColorChange(selectedColor, { ic: color })}
                        style={{
                          width: 28, height: 28, borderRadius: 6, background: color,
                          cursor: 'pointer', border: currentColors[selectedColor].ic === color ? `2px solid ${TC.primary500}` : '1px solid #ddd',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom color input */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="color"
                  value={currentColors[selectedColor].bg}
                  onChange={(e) => handleColorChange(selectedColor, { bg: e.target.value })}
                  style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={currentColors[selectedColor].bg}
                  readOnly
                  style={{
                    flex: 1, padding: '6px 10px', borderRadius: 8, border: `1px solid ${TC.n300}`,
                    fontSize: 12, fontFamily: 'monospace',
                  }}
                />
                <button
                  onClick={() => setSelectedColor(null)}
                  style={{
                    padding: '6px 12px', borderRadius: 8, border: 'none',
                    background: TC.primary500, color: '#fff', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  เสร็จ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Transaction chip (shown in added list) ──────────────────
function AddedTxnChip({ txn }) {
  const isExpense = txn.type === 'expense';
  const isIncome = txn.type === 'income';
  const amountColor = isExpense ? TC.error500 : isIncome ? TC.primary500 : TC.n800;

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '8px 10px',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>
      <CatChipIcon cat={txn.cat} size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: TC.n900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {txn.merchant || txn.catLabel}
        </div>
        <div style={{ fontSize: 10, color: TC.n400 }}>{txn.walletLabel} · {txn.time}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: amountColor }}>
        {isExpense ? '-' : isIncome ? '+' : ''}{txn.amount.toLocaleString()}฿
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: 10, background: TC.primary100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke={TC.primary500} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Added transactions list ────────────────────────────────
function AddedTxnList({ txns }) {
  if (!txns || txns.length === 0) return null;
  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: TC.n400, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          เพิ่มแล้ว ({txns.length})
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: TC.primary500 }}>
          รวม {txns.reduce((s, t) => {
            if (t.type === 'expense') return s - t.amount;
            if (t.type === 'income') return s + t.amount;
            return s;
          }, 0).toLocaleString()}฿
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {txns.map((t, i) => (
          <AddedTxnChip key={i} txn={t} />
        ))}
      </div>
    </div>
  );
}

// ─── Sheet chrome — full 90% height with added txns list ────
function DSheetShell({ children, txns = [] }) {
  const [designPanelVisible, setDesignPanelVisible] = React.useState(false);

  return (
    <>
      {designPanelVisible && (
        <DesignPanel visible={true} onClose={() => setDesignPanelVisible(false)} />
      )}
      <div
        onClick={() => setDesignPanelVisible(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
          width: 56, height: 56, borderRadius: 16,
          background: TC.primary500, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{
        background: TC.n200,
        height: '100%', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <MintStatusBarV2 time="09:30" />

        {/* Sheet — 90% height */}
        <div style={{
          background: TC.n200,
          height: '90%',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, flexShrink: 0 }}>
            <div style={{ width: 36, height: 5, borderRadius: 3, background: TC.n300 }} />
          </div>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 18px 12px', flexShrink: 0,
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: TC.n900 }}>เพิ่มธุรกรรม</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                padding: '6px 12px', borderRadius: 999, background: '#fff',
                border: `1px solid ${TC.n300}`, display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 600, color: TC.n700,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2"
                    stroke={TC.n700} strokeWidth="1.8" strokeLinecap="round"/>
                  <rect x="8" y="9" width="8" height="6" rx="1" stroke={TC.n700} strokeWidth="1.8"/>
                </svg>
                สแกน
              </div>
            </div>
          </div>

          {/* Scrollable content: added txns + form */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <AddedTxnList txns={txns} />
            {children}
          </div>

          {/* Sticky bottom bar */}
          <div style={{
            padding: '12px 16px 20px',
            background: TC.n200,
            flexShrink: 0,
            display: 'flex', gap: 8,
          }}>
            <button style={{
              width: 72, height: 50, borderRadius: 14, border: 'none',
              background: '#fff', color: TC.n700,
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              ปิด
            </button>
            <button style={{
              flex: 1, padding: '14px', borderRadius: 14, border: 'none',
              background: TC.primary500, color: '#fff',
              fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
              letterSpacing: 0.3, cursor: 'pointer',
              boxShadow: '0 6px 14px rgba(44,122,123,0.3)',
            }}>
              บันทึก & เพิ่มอีก
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// 2-tier tabs (top scrollable type pills, bottom subtype segmented)
function DTabs({ active, sub, subOptions }) {
  const tops = [
    { key: 'expense',  label: 'รายจ่าย' },
    { key: 'income',   label: 'รายรับ' },
    { key: 'credit',   label: 'บัตรเครดิต' },
    { key: 'transfer', label: 'โอนเงิน' },
    { key: 'saving',   label: 'ออมเงิน' },
  ];
  return (
    <div style={{ padding: '0 16px 12px' }}>
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

// ─── Amount + Category Card (Variation C style) ────
function DAmountCard({ amount = '0', sign = '-', signColor, hint, selectedCat }) {
  const cat = selectedCat || CATEGORY_COLORS[0];
  return (
    <div style={{
      margin: '0 16px 10px', background: '#fff', borderRadius: 18, padding: '16px 18px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: TC.n400, fontWeight: 600, letterSpacing: 0.4 }}>จำนวน · THB</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: TC.n900, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>
              {sign}{Number(amount.replace(/,/g,'')).toLocaleString('en-US')}
            </span>
            <span style={{ fontSize: 16, fontWeight: 600, color: TC.n400 }}>.00</span>
          </div>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '8px 4px',
          borderLeft: `1px dashed ${TC.n300}`,
          paddingLeft: 14, minWidth: 70,
        }}>
          <CatChipIcon cat={cat} size={36} />
          <div style={{ fontSize: 11, fontWeight: 600, color: TC.n900 }}>{cat.label}</div>
          <div style={{ fontSize: 10, color: TC.primary500 }}>เปลี่ยน ▾</div>
        </div>
      </div>
      {hint && <div style={{ fontSize: 11, color: TC.n400, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

// Account/wallet picker row
function DAccountRow({ label, icon, name, sub, hint }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
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

// Down-arrow connector between two accounts
function DArrowConnector() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
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

// Smart suggestions chips
function DSuggestions({ items }) {
  return (
    <div style={{ padding: '0 16px 10px' }}>
      <div style={{ fontSize: 11, color: TC.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', padding: '0 4px', marginBottom: 8 }}>
        ที่คุณเลือกบ่อย
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: 2 }}>
        {items.map((s, i) => (
          <div key={i} style={{
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
  );
}

// Quick amount chips row
function DQuickChips({ items }) {
  return (
    <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, overflowX: 'auto' }}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: '7px 14px', borderRadius: 999, background: item.active ? TC.primary500 : '#fff',
          color: item.active ? '#fff' : TC.n600, fontSize: 12, fontWeight: 600,
          border: item.active ? 'none' : `1px solid ${TC.n300}`, flexShrink: 0, cursor: 'pointer',
        }}>
          {item.label}
        </div>
      ))}
    </div>
  );
}

// Compact meta row (date / tag / wallet) — Variation C style 3-col grid
function DMetaRow({ showNote = true }) {
  return (
    <>
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: '4px 4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        }}>
          <MetaCell
            icon={<div style={{ width: 22, height: 22, borderRadius: 7, background: TC.walletPink100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CatIcon kind="piggy" size={12} color={TC.walletPink} />
            </div>}
            label="กระเป๋า" value="ครอบครัว" />
          <MetaCell
            icon={<CatIcon kind="budget" size={14} color={TC.primary500} />}
            label="วันที่" value="วันนี้" sep />
          <MetaCell
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 12V4h8l10 10-8 8L3 12z" stroke={TC.primary500} strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="7.5" cy="7.5" r="1.2" fill={TC.primary500}/>
            </svg>}
            label="แท็ก" value="+ เพิ่ม" sep />
        </div>
      </div>
      {showNote && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h11l3 3v13H5V4z" stroke={TC.n400} strokeWidth="1.6"/>
              <path d="M9 10h7M9 13h7" stroke={TC.n400} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 13, color: TC.n900, flex: 1 }}>กาแฟลาเต้ ร้านที่ทำงาน</div>
          </div>
        </div>
      )}
    </>
  );
}

// Wallet icon helper
const DWalletIcon = ({ bg, ic, kind }) => (
  <div style={{
    width: 32, height: 32, borderRadius: 10, background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <CatIcon kind={kind} size={16} color={ic} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// D1 · EXPENSE
// ═══════════════════════════════════════════════════════════════
function AddTxnD_Expense() {
  const [txns] = React.useState([
    {
      type: 'expense',
      amount: 120,
      cat: CATEGORY_COLORS[0],
      catLabel: 'อาหาร',
      merchant: 'ข้าวกลางวัน',
      walletLabel: 'ครอบครัว',
      time: '08:45',
    },
    {
      type: 'expense',
      amount: 44,
      cat: CATEGORY_COLORS[4],
      catLabel: 'เดินทาง',
      merchant: 'BTS',
      walletLabel: 'ครอบครัว',
      time: '08:15',
    },
  ]);

  return (
    <DSheetShell txns={txns}>
      <DTabs active="expense" />
      <DAmountCard amount="85" sign="-" signColor={TC.error400} hint="หมวด: อาหาร · กระเป๋า: ครอบครัว" selectedCat={CATEGORY_COLORS[0]} />

      <DSuggestions items={[
        { name: 'กาแฟร้านประจำ', sub: '85 ฿', cat: CATEGORY_COLORS[0], on: true },
        { name: 'ข้าวกลางวัน',   sub: '120 ฿', cat: CATEGORY_COLORS[0] },
        { name: 'BTS',           sub: '44 ฿',  cat: CATEGORY_COLORS[4] },
        { name: '7-11',          sub: '—',     cat: CATEGORY_COLORS[1] },
      ]} />

      <div style={{ padding: '0 16px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <DAccountRow
          label="หมวดหมู่"
          icon={<DWalletIcon bg={CATEGORY_COLORS[0].bg} ic={CATEGORY_COLORS[0].ic} kind={CATEGORY_COLORS[0].icon} />}
          name="อาหาร" />
        <DAccountRow
          label="กระเป๋า"
          icon={<DWalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
          name="ครอบครัว" />
      </div>

      <DMetaRow />
    </DSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// D2 · INCOME
// ═══════════════════════════════════════════════════════════════
function AddTxnD_Income() {
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
    <DSheetShell txns={txns}>
      <DTabs active="income" />
      <DAmountCard amount="35,000" sign="+" signColor={TC.primary500} hint="หมวด: เงินเดือน · เข้า: ครอบครัว" selectedCat={CATEGORY_COLORS[0]} />

      <DSuggestions items={[
        { name: 'เงินเดือน', sub: '35,000 ฿ · ทุก 25', cat: CATEGORY_COLORS[0], on: true },
        { name: 'งาน Freelance', sub: 'ครั้งล่าสุด 8,500 ฿', cat: CATEGORY_COLORS[1] },
        { name: 'ปันผล', sub: 'ครั้งล่าสุด 1,200 ฿', cat: CATEGORY_COLORS[2] },
      ]} />

      <div style={{ padding: '0 16px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <DAccountRow
          label="หมวดหมู่"
          icon={<DWalletIcon bg={CATEGORY_COLORS[0].bg} ic={CATEGORY_COLORS[0].ic} kind={CATEGORY_COLORS[0].icon} />}
          name="เงินเดือน" />
        <DAccountRow
          label="เข้ากระเป๋า"
          icon={<DWalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
          name="ครอบครัว" />
      </div>

      <DMetaRow />
    </DSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// D3a · CREDIT CARD — จ่ายบัตร
// ═══════════════════════════════════════════════════════════════
function AddTxnD_CreditPay() {
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
    <DSheetShell txns={txns}>
      <DTabs active="credit" sub="pay" subOptions={[
        { key: 'pay', label: 'จ่ายบัตรเครดิต' },
        { key: 'cashback', label: 'รับ Cashback' },
        { key: 'withdraw', label: 'กดเงินสด' },
      ]} />
      <DAmountCard amount="3,500" sign="" hint="ขั้นต่ำเดือนนี้: 1,200 ฿ · กำหนด 5 พ.ค." />

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <DAccountRow
            label="ชำระบัตรเครดิต"
            icon={<DWalletIcon bg={TC.walletViolet100} ic={TC.walletViolet} kind="card" />}
            name="Kbank Credit"
            sub="ค้างชำระ 116,547 ฿" />
          <DArrowConnector />
          <DAccountRow
            label="จ่ายจากกระเป๋า"
            icon={<DWalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
            name="ครอบครัว"
            sub="คงเหลือ 34,368 ฿" />
        </div>

        <DQuickChips items={[
          { label: 'ขั้นต่ำ 1,200', active: true },
          { label: 'เต็ม 116,547', active: false },
          { label: '50% 58,273', active: false },
          { label: 'กำหนดเอง', active: false },
        ]} />
      </div>

      <DMetaRow />
    </DSheetShell>
  );
}

// D3b · CREDIT CARD — รับ Cashback
function AddTxnD_CreditCashback() {
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
    <DSheetShell txns={txns}>
      <DTabs active="credit" sub="cashback" subOptions={[
        { key: 'pay', label: 'จ่ายบัตรเครดิต' },
        { key: 'cashback', label: 'รับ Cashback' },
        { key: 'withdraw', label: 'กดเงินสด' },
      ]} />
      <DAmountCard amount="240" sign="+" signColor={TC.primary500} hint="Cashback ลดค้างชำระ Kbank Credit" />

      <div style={{ padding: '0 16px 10px' }}>
        <DAccountRow
          label="เข้าบัตรเครดิต"
          icon={<DWalletIcon bg={TC.walletViolet100} ic={TC.walletViolet} kind="card" />}
          name="Kbank Credit"
          sub="ค้างชำระ 116,547 ฿" />
      </div>

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

      <DMetaRow />
    </DSheetShell>
  );
}

// D3c · CREDIT CARD — กดเงินสด
function AddTxnD_CreditWithdraw() {
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
    <DSheetShell txns={txns}>
      <DTabs active="credit" sub="withdraw" subOptions={[
        { key: 'pay', label: 'จ่ายบัตรเครดิต' },
        { key: 'cashback', label: 'รับ Cashback' },
        { key: 'withdraw', label: 'กดเงินสด' },
      ]} />
      <DAmountCard amount="2,000" sign="" hint="ค่าธรรมเนียม 3% ≈ 60 ฿ · ดอกเบี้ยเริ่มทันที" />

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <DAccountRow
            label="กดเงินสดจาก"
            icon={<DWalletIcon bg={TC.walletViolet100} ic={TC.walletViolet} kind="card" />}
            name="Kbank Credit"
            sub="วงเงินสด 50,000 ฿" />
          <DArrowConnector />
          <DAccountRow
            label="เข้ากระเป๋า"
            icon={<DWalletIcon bg={TC.walletGreen100} ic={TC.walletGreen} kind="wallet" />}
            name="เงินสด" />
        </div>

        <div style={{
          marginTop: 8, padding: '8px 12px', borderRadius: 10,
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

      <DMetaRow />
    </DSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// D4 · TRANSFER
// ═══════════════════════════════════════════════════════════════
function AddTxnD_Transfer() {
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
    <DSheetShell txns={txns}>
      <DTabs active="transfer" />
      <DAmountCard amount="5,000" sign="" hint="โอนระหว่างกระเป๋า · ไม่นับเป็นรายจ่าย/รับ" />

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <DAccountRow
            label="โอนจาก"
            icon={<DWalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
            name="ครอบครัว"
            sub="คงเหลือ 34,368 ฿" />
          <DArrowConnector />
          <DAccountRow
            label="โอนไปยัง"
            icon={<DWalletIcon bg={TC.walletGreen100} ic={TC.walletGreen} kind="wallet" />}
            name="TrueMoney"
            sub="คงเหลือ 17,300 ฿" />
        </div>

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

      <DMetaRow />
    </DSheetShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// D5a · SAVING — ออมเงิน (deposit to goal)
// ═══════════════════════════════════════════════════════════════
function AddTxnD_SavingDeposit() {
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
    <DSheetShell txns={txns}>
      <DTabs active="saving" sub="deposit" subOptions={[
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

      <DAmountCard amount="7,161" sign="+" signColor={TC.primary500} selectedCat={{ label: 'ออมเงิน', icon: 'saving', bg: TC.primary100, ic: TC.primary500 }} />

      <div style={{ padding: '0 16px 10px' }}>
        <DAccountRow
          label="จากกระเป๋า"
          icon={<DWalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
          name="ครอบครัว"
          sub="คงเหลือ 34,368 ฿" />
      </div>
    </DSheetShell>
  );
}

// D5b · SAVING — ถอนเงิน
function AddTxnD_SavingWithdraw() {
  const [txns] = React.useState([
    {
      type: 'expense',
      amount: 2000,
      cat: { label: 'ถอนเงิน', icon: 'saving', bg: TC.error100, ic: TC.error400 },
      catLabel: 'ถอนเงิน',
      merchant: 'เที่ยวอังกฤษ',
      walletLabel: 'ครอบครัว',
      time: '09:30',
    },
  ]);
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
    <DSheetShell txns={txns}>
      <DTabs active="saving" sub="withdraw" subOptions={[
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

          {/* Progress with reduction */}
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
              ถอนแล้วจะช้ากว่าแผน · ต้องออมเพิ่ม ฿810/เดือน เพื่อให้ทันกำหนด
            </div>
          </div>
        </div>
      </div>

      <DAmountCard amount="5,000" sign="−" signColor={TC.error400} selectedCat={{ label: 'ออมเงิน', icon: 'saving', bg: TC.primary100, ic: TC.primary500 }} />

      <div style={{ padding: '0 16px 10px' }}>
        <DAccountRow
          label="เข้ากระเป๋า"
          icon={<DWalletIcon bg={TC.walletPink100} ic={TC.walletPink} kind="piggy" />}
          name="ครอบครัว" />
      </div>
    </DSheetShell>
  );
}

// ── Exports ─────────────────────────────────────────────────
Object.assign(window, {
  AddTxnD_Expense, AddTxnD_Income,
  AddTxnD_CreditPay, AddTxnD_CreditCashback, AddTxnD_CreditWithdraw,
  AddTxnD_Transfer,
  AddTxnD_SavingDeposit, AddTxnD_SavingWithdraw,
});
