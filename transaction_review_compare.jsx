// Add Transaction Bottom Sheet · Before / After UX review compare
// BEFORE  = window.AddTxnE_Expense  (current, from transaction_1.jsx)
// AFTER   = AddTxnE_Expense_After   (defined here — production-tuned)
// Depends on transaction_shared.jsx + v2-primitives.jsx (CatIcon) + primitives.jsx (MintStatusBar)
//
// AFTER = production-grade pass (no numpad, no merchant field — note only):
//   F1  amount = tappable field, starts 0.00, focus ring + additive quick chips (+20/+50/+100/+500)
//   F2  split CTA reachable (chevron → บันทึก & เพิ่มอีก / แบบประจำ)
//   F3  captions use accessible gray (≈5.4:1) instead of n400 (~2.2:1)
//   F4  ALL touch targets ≥44×44 (tabs, header scan, date steppers, tag button, clear)
//   F5  frequent-category chips inline = 1-tap for common categories
//   F6  note field inline (single line) — merchant field removed per spec
//   F7  title follows the selected type tab
//   F8  single scan entry (header only) + currency hidden (THB default)
//   F9  progressive disclosure: ป้ายกำกับ + รวมในรายงาน collapsed under "เพิ่มเติม"
//   F10 primary save uses primary600 (white text 5.0:1)
//   F11 save is DISABLED until amount > 0 (no zero-value submits)
//   F12 saved-session footer is genuinely expandable (no dead chevron)
//   F13 report toggle is interactive; disclosure uses a chevron (not a "+")
//   F14 clear-amount uses "×" (not a trash icon that reads as delete-record)

const TR = window.MINT;

// Accessible caption gray — replaces n400 (#B0AEBA ≈ 2.18:1 on white) → ≈ 5.4:1
const CAP = '#6E6B7A';

// Type meta — drives header title + amount sign. Body stays expense-shaped in this
// prototype; in production each type renders its own field set.
const TR_TYPES = [
  { key: 'expense',  label: 'รายจ่าย',    title: 'เพิ่มรายจ่าย',    sign: '−' },
  { key: 'income',   label: 'รายรับ',     title: 'เพิ่มรายรับ',     sign: '+' },
  { key: 'credit',   label: 'บัตรเครดิต', title: 'เพิ่มบัตรเครดิต', sign: '−' },
  { key: 'transfer', label: 'โอนเงิน',    title: 'โอนเงิน',          sign: ''  },
  { key: 'saving',   label: 'ออมเงิน',    title: 'เพิ่มเงินออม',    sign: '+' },
];

const TR_FREQ_CATS = [
  { key: 'food',      label: 'อาหาร',   icon: 'food',      bg: '#FEE2E2', ic: '#EF4444' },
  { key: 'transport', label: 'เดินทาง', icon: 'transport', bg: '#DBEAFE', ic: '#3B82F6' },
  { key: 'shopping',  label: 'ของใช้',  icon: 'shopping',  bg: '#DCFCE7', ic: '#22C55E' },
  { key: 'bills',     label: 'บิล',     icon: 'budget',    bg: '#FEF3C7', ic: '#F59E0B' },
];

const TR_QUICK_AMOUNTS = [20, 50, 100, 500];

const TR_SAVED = [
  { merchant: 'ข้าวกลางวัน', wallet: 'ครอบครัว', time: '08:45', amount: 120, bg: '#FEE2E2', ic: '#EF4444', icon: 'food' },
  { merchant: 'BTS', wallet: 'ครอบครัว', time: '08:15', amount: 44, bg: '#DBEAFE', ic: '#3B82F6', icon: 'transport' },
];

function trFmt(n) {
  return Number(n || 0).toLocaleString('en-US');
}

// 44×44 hit area wrapping a small visual icon (F4)
function TRIconButton({ onClick, ariaLabel, disabled, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      style={{
        width: 44, height: 44, borderRadius: 12, border: 'none',
        background: 'transparent', cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, opacity: disabled ? 0.4 : 1, fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

// ─── F1 · Amount field (tappable, no numpad) + additive quick chips ───
function TRAmountField({ amount, sign, focused, onFocus, onAdd, onClear }) {
  return (
    <div style={{ margin: '0 16px 12px' }}>
      <div
        onClick={onFocus}
        role="button"
        aria-label="แตะเพื่อกรอกจำนวนเงิน"
        style={{
          background: '#fff', borderRadius: 18, padding: '18px 18px 16px',
          cursor: 'pointer',
          border: focused ? `2px solid ${TR.primary500}` : '2px solid transparent',
          boxShadow: focused
            ? `0 0 0 4px ${TR.primary100}, 0 4px 14px rgba(0,0,0,0.05)`
            : '0 1px 2px rgba(0,0,0,0.03), 0 4px 14px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.15s, border-color 0.15s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: CAP, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            จำนวนเงิน
          </div>
          {/* F8: currency hidden — THB only, static caption (not a fake button) */}
          <div style={{ fontSize: 12, color: CAP, fontWeight: 600 }}>บาท · ฿</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minHeight: 46 }}>
          <div style={{
            fontSize: 44, fontWeight: 800,
            color: amount > 0 ? TR.n900 : TR.n400,
            letterSpacing: -1, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}>
            {amount > 0 ? sign : ''}{trFmt(amount)}
            <span style={{ color: amount > 0 ? CAP : TR.n400, fontWeight: 500 }}>.00</span>
          </div>
          {focused && (
            <div style={{ width: 2, height: 30, background: TR.primary500, animation: 'cursor-blink 1s infinite' }} />
          )}
        </div>

        {!focused && amount === 0 && (
          <div style={{ fontSize: 12, color: CAP, fontWeight: 500, marginTop: 4 }}>
            แตะเพื่อกรอกจำนวนเงิน
          </div>
        )}
      </div>

      {/* F1: additive quick-amount chips — "+" prefix makes the additive model explicit */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
        {TR_QUICK_AMOUNTS.map(v => (
          <button
            key={v}
            onClick={() => onAdd(v)}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 12, border: `1px solid ${TR.n300}`,
              background: '#fff', color: TR.n900, fontSize: 13, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer', minHeight: 44,
            }}
          >
            +{v}
          </button>
        ))}
        {/* F14: clear uses "×", not a trash icon */}
        <TRIconButton onClick={onClear} ariaLabel="ล้างจำนวนเงิน" disabled={amount === 0}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={CAP} strokeWidth="1.8"/>
            <path d="M9 9l6 6M15 9l-6 6" stroke={CAP} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </TRIconButton>
      </div>
    </div>
  );
}

// ─── tabs (drive title) — F4 height 44 ────────────────────────
function TRTabs({ active, onChange }) {
  return (
    <div style={{ padding: '0 16px 14px' }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
        {TR_TYPES.map(t => {
          const on = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              aria-pressed={on}
              style={{
                padding: '0 18px', minHeight: 44, borderRadius: 999,
                background: on ? TR.n900 : '#fff',
                color: on ? '#fff' : TR.n700,
                fontSize: 13, fontWeight: on ? 700 : 600,
                border: on ? 'none' : `1px solid ${TR.n300}`,
                flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── F5 · Wallet row + frequent category chips (1-tap) ────────
function TRWalletCategory({ cat, onCat }) {
  return (
    <div style={{ padding: '0 16px 12px' }}>
      {/* Wallet row */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: '10px 12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minHeight: 56,
        marginBottom: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: TR.walletPink100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <CatIcon kind="piggy" containerSize={36} color={TR.walletPink} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: CAP, fontWeight: 600, letterSpacing: 0.2 }}>กระเป๋า</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: TR.n900 }}>ครอบครัว</div>
        </div>
        <div style={{ fontSize: 12, color: CAP, fontWeight: 600, marginRight: 4 }}>34,368฿</div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" stroke={CAP} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Category — frequent chips inline (F5) */}
      <div style={{ fontSize: 12, color: CAP, fontWeight: 600, letterSpacing: 0.2, padding: '0 2px 6px' }}>
        หมวดหมู่
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -16px', padding: '2px 16px 4px', scrollbarWidth: 'none' }}>
        {TR_FREQ_CATS.map(c => {
          const on = cat?.key === c.key;
          return (
            <button
              key={c.key}
              onClick={() => onCat(on ? null : { key: c.key })}
              aria-pressed={on}
              style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '10px 12px 8px', minWidth: 66, minHeight: 64,
                background: on ? c.bg : '#fff', borderRadius: 14,
                border: on ? `1.5px solid ${c.ic}` : `1px solid ${TR.n300}`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: on ? '#fff' : c.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CatIcon kind={c.icon} containerSize={32} color={c.ic} />
              </div>
              <div style={{ fontSize: 11, fontWeight: on ? 700 : 600, color: on ? c.ic : TR.n700 }}>{c.label}</div>
            </button>
          );
        })}
        {/* ดูทั้งหมด */}
        <button
          style={{
            flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 14px 8px', minWidth: 72, minHeight: 64,
            background: TR.primary100, borderRadius: 14, border: `1px solid ${TR.primary500}33`,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="6" r="1.4" fill={TR.primary600}/>
              <circle cx="5" cy="12" r="1.4" fill={TR.primary600}/>
              <circle cx="5" cy="18" r="1.4" fill={TR.primary600}/>
              <path d="M10 6h10M10 12h10M10 18h10" stroke={TR.primary600} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: TR.primary600 }}>ดูทั้งหมด</div>
        </button>
      </div>
    </div>
  );
}

// ─── F4 · Date stepper (44×44 arrows) ─────────────────────────
function TRDateRow() {
  const TODAY = React.useMemo(() => new Date(2026, 4, 1), []);
  const [date, setDate] = React.useState(TODAY);
  const step = (d) => { const n = new Date(date); n.setDate(n.getDate() + d); setDate(n); };
  const pad = (n) => String(n).padStart(2, '0');
  const ddmmyyyy = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  const future = Math.round((date - TODAY) / 86400000) >= 0;

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '4px 8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke={TR.primary500} strokeWidth="1.6"/>
            <path d="M3 10h18M8 2v4M16 2v4" stroke={TR.primary500} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 12, fontWeight: 600, color: CAP }}>วันที่</div>
        </div>
        <div style={{ flex: 1 }} />
        <TRIconButton onClick={() => step(-1)} ariaLabel="วันก่อนหน้า">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke={TR.n700} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </TRIconButton>
        <div style={{
          fontSize: 14, fontWeight: 700, color: TR.n900, minWidth: 96, textAlign: 'center',
          fontVariantNumeric: 'tabular-nums', letterSpacing: 0.3, cursor: 'pointer',
        }}>
          {ddmmyyyy}
        </div>
        <TRIconButton onClick={() => step(1)} ariaLabel="วันถัดไป" disabled={future}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={future ? TR.n300 : TR.n700} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </TRIconButton>
      </div>
    </div>
  );
}

// ─── F6 · Note field — inline single line (merchant removed) ──
function TRNoteField({ value, onChange }) {
  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '4px 12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        display: 'flex', alignItems: 'center', gap: 10, minHeight: 52,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M4 5h16M4 10h16M4 15h10" stroke={CAP} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="เพิ่มโน้ต (ไม่บังคับ)"
          aria-label="โน้ต"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 15, fontWeight: 600, color: TR.n900, fontFamily: 'inherit',
            padding: '12px 0',
          }}
        />
      </div>
    </div>
  );
}

// ─── F9/F13 · Advanced disclosure: tags + report (interactive) ─
function TRAdvanced({ open, onToggle }) {
  const [tags, setTags] = React.useState([]);
  const [inReport, setInReport] = React.useState(true);

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px', minHeight: 44, fontFamily: 'inherit',
        }}
      >
        {/* F13: chevron-only disclosure (no "+") */}
        <div style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 600, color: TR.n900 }}>
          เพิ่มเติม — ป้ายกำกับ, รายงาน
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M6 9l6 6 6-6" stroke={CAP} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
          {/* tags */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '10px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: 12, color: CAP, fontWeight: 600, marginBottom: 8 }}>ป้ายกำกับ</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {tags.map(t => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 6px 6px 10px',
                  borderRadius: 999, background: TR.primary100, color: TR.primary600, fontSize: 12, fontWeight: 600,
                }}>
                  #{t}
                  <button onClick={() => setTags(tags.filter(x => x !== t))} aria-label={`ลบ ${t}`} style={{
                    width: 18, height: 18, borderRadius: 999, border: 'none', background: 'transparent',
                    cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TR.primary600,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
                  </button>
                </span>
              ))}
              <button
                onClick={() => setTags(t => t.includes('ของขวัญ') ? t : [...t, 'ของขวัญ'])}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0 14px', minHeight: 44,
                  borderRadius: 999, background: 'transparent', color: TR.n700, border: `1px dashed ${TR.n400}`,
                  fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
                เพิ่มป้าย
              </button>
            </div>
          </div>

          {/* report toggle — F13 interactive */}
          <button
            onClick={() => setInReport(v => !v)}
            role="switch"
            aria-checked={inReport}
            style={{
              background: '#fff', borderRadius: 14, padding: '10px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              display: 'flex', alignItems: 'center', gap: 10, border: 'none', cursor: 'pointer',
              width: '100%', textAlign: 'left', fontFamily: 'inherit', minHeight: 56,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TR.n900 }}>รวมในรายงาน</div>
              <div style={{ fontSize: 12, color: CAP, fontWeight: 500, marginTop: 1 }}>
                {inReport ? 'นับในยอดรวม สรุปงบ และกราฟ' : 'ไม่นับในสรุป — ใช้กับรายการชั่วคราว'}
              </div>
            </div>
            <div style={{ width: 40, height: 24, borderRadius: 999, background: inReport ? TR.primary500 : TR.n300, position: 'relative', transition: 'background 0.15s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: inReport ? 18 : 2, width: 20, height: 20, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.15s' }} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── F12 · Saved-session footer — genuinely expandable ────────
function TRSavedFooter({ txns }) {
  const [expanded, setExpanded] = React.useState(false);
  const total = txns.reduce((s, t) => s - t.amount, 0);

  return (
    <div style={{ padding: '10px 16px', background: TR.n200, borderTop: `1px solid ${TR.n300}`, flexShrink: 0 }}>
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        style={{
          width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, padding: 0, fontFamily: 'inherit', minHeight: 44,
        }}
      >
        <div style={{ width: 22, height: 22, borderRadius: 11, background: TR.primary500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: TR.n900, flex: 1, textAlign: 'left' }}>
          บันทึกแล้ว {txns.length} รายการ · เซสชันนี้
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: TR.error400 }}>−{trFmt(Math.abs(total))}฿</div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          <path d="M6 15l6-6 6 6" stroke={CAP} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 0 2px' }}>
          {txns.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#fff', borderRadius: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CatIcon kind={t.icon} containerSize={28} color={t.ic} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TR.n900 }}>{t.merchant}</div>
                <div style={{ fontSize: 11, color: CAP }}>{t.wallet} · {t.time}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TR.error400 }}>−{trFmt(t.amount)}฿</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AFTER — production-tuned sheet
// ═══════════════════════════════════════════════════════════════
function AddTxnE_Expense_After() {
  const [type, setType] = React.useState('expense');
  const [amount, setAmount] = React.useState(0);
  const [focused, setFocused] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [cat, setCat] = React.useState(null);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [splitOpen, setSplitOpen] = React.useState(false);

  const meta = TR_TYPES.find(t => t.key === type);
  const canSave = amount > 0; // F11

  return (
    <div style={{ background: TR.n200, height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <MintStatusBar time="09:30" />

      <div style={{
        background: TR.n200, height: '90%', borderRadius: '24px 24px 0 0',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.15)', position: 'relative',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, flexShrink: 0 }}>
          <div style={{ width: 36, height: 5, borderRadius: 3, background: TR.n300 }} />
        </div>

        {/* header — dynamic title (F7) + single scan (F8), 44 target (F4) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px 12px', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: TR.n900, letterSpacing: -0.2 }}>{meta.title}</div>
          <button style={{
            padding: '0 14px', minHeight: 44, borderRadius: 999, background: '#fff',
            border: `1px solid ${TR.n300}`, display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 600, color: TR.n700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2" stroke={TR.n700} strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="8" y="9" width="8" height="6" rx="1" stroke={TR.n700} strokeWidth="1.8"/>
            </svg>
            สแกนใบเสร็จ
          </button>
        </div>

        {/* scrollable content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <TRTabs active={type} onChange={setType} />
          <TRAmountField
            amount={amount}
            sign={meta.sign}
            focused={focused}
            onFocus={() => setFocused(true)}
            onAdd={(v) => { setAmount(a => a + v); setFocused(true); }}
            onClear={() => { setAmount(0); setFocused(false); }}
          />
          <TRWalletCategory cat={cat} onCat={setCat} />
          <TRDateRow />
          <TRNoteField value={note} onChange={setNote} />
          <TRAdvanced open={moreOpen} onToggle={() => setMoreOpen(o => !o)} />
        </div>

        {/* saved footer — expandable (F12) */}
        <TRSavedFooter txns={TR_SAVED} />

        {/* bottom action bar — cancel + save (disabled at 0, F11) + split CTA (F2) */}
        <div style={{ padding: '12px 16px 20px', background: TR.n200, flexShrink: 0, display: 'flex', gap: 8, position: 'relative' }}>
          <button style={{
            padding: '0 18px', minHeight: 50, borderRadius: 14, border: 'none', background: 'transparent',
            color: TR.n700, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          }}>
            ยกเลิก
          </button>

          <button
            disabled={!canSave}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px 0 0 14px', border: 'none',
              background: canSave ? TR.primary600 : TR.n300, color: canSave ? '#fff' : TR.n400,
              fontSize: 15, fontWeight: 700, fontFamily: 'inherit', letterSpacing: 0.3,
              cursor: canSave ? 'pointer' : 'default', minHeight: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              boxShadow: canSave ? '0 6px 14px rgba(44,122,123,0.3)' : 'none',
              transition: 'background 0.15s',
            }}
          >
            บันทึก
            {canSave && <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 500 }}>· {trFmt(amount)}฿</span>}
          </button>

          {/* split trigger — disabled with save (F2 + F11) */}
          <button
            onClick={() => canSave && setSplitOpen(o => !o)}
            disabled={!canSave}
            aria-label="ตัวเลือกบันทึกเพิ่มเติม"
            style={{
              width: 50, minHeight: 50, borderRadius: '0 14px 14px 0', border: 'none',
              background: canSave ? TR.primary600 : TR.n300, color: canSave ? '#fff' : TR.n400,
              cursor: canSave ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderLeft: canSave ? '1px solid rgba(255,255,255,0.25)' : `1px solid ${TR.n400}33`,
              boxShadow: canSave ? '0 6px 14px rgba(44,122,123,0.3)' : 'none',
              transition: 'background 0.15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: splitOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6" stroke={canSave ? '#fff' : TR.n400} strokeWidth="2.4" strokeLinecap="round"/>
            </svg>
          </button>

          {splitOpen && (
            <>
              <div onClick={() => setSplitOpen(false)} style={{ position: 'absolute', inset: 0, zIndex: 10 }} />
              <div style={{
                position: 'absolute', right: 16, bottom: 78, zIndex: 11,
                background: '#fff', borderRadius: 12, padding: 6, minWidth: 224,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.08)',
              }}>
                <button style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: 8, border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: TR.n900, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={TR.primary600} strokeWidth="2.5" strokeLinecap="round"/></svg>
                  บันทึก & เพิ่มอีก
                </button>
                <button style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: 8, border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: TR.n900, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={TR.primary600} strokeWidth="2"/><path d="M12 7v5l3 2" stroke={TR.primary600} strokeWidth="2" strokeLinecap="round"/></svg>
                  บันทึกแบบประจำ (รายเดือน)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

window.AddTxnE_Expense_After = AddTxnE_Expense_After;
