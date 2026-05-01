// v4 — Add Transaction redesign — 3 variations
// All wrapped in their own PhoneFrame, sharing v2 status bar (no DEBUG ribbon).
// Design language matches existing Mint Money screens: Sarabun, teal primary,
// white sheets on n200 bg, soft shadows, Thai copy.

const T = window.MINT;

// ─── Shared header for the modal sheet ────────────────────
function AddTxnHeader({ title = 'เพิ่มธุรกรรม', onSave, saveEnabled = true, saveLabel = 'เสร็จ' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 18px 14px',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 18, display: 'flex',
        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke={T.n800} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: T.n900, letterSpacing: -0.2 }}>{title}</div>
      <div style={{
        fontSize: 15, fontWeight: 700,
        color: saveEnabled ? T.primary500 : T.n400,
        letterSpacing: 0.2, padding: '8px 4px',
      }}>{saveLabel}</div>
    </div>
  );
}

// Drag handle for modal sheet
function SheetHandle() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
      <div style={{ width: 36, height: 5, borderRadius: 3, background: T.n300 }} />
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────
function formatAmount(s) {
  if (!s || s === '0') return '0';
  const [int, dec] = s.split('.');
  const intF = Number(int).toLocaleString('en-US');
  return dec !== undefined ? `${intF}.${dec}` : intF;
}

// Category data (shared)
const EXPENSE_CATS = [
  { key: 'food',    label: 'อาหาร',     icon: 'coffee', bg: '#FFE4D9', ic: '#E07A55' },
  { key: 'shop',    label: 'ช้อปปิ้ง',  icon: 'cart',   bg: '#F2E1FA', ic: '#B66FCE' },
  { key: 'travel',  label: 'เดินทาง',   icon: 'gas',    bg: '#DCE9FB', ic: '#5C8BD9' },
  { key: 'bill',    label: 'ค่าใช้จ่าย', icon: 'bill',   bg: '#FFF1D6', ic: '#D69A2E' },
  { key: 'home',    label: 'บ้าน',      icon: 'home',   bg: '#EBDBD3', ic: '#A07D6B' },
  { key: 'fun',     label: 'บันเทิง',   icon: 'movie',  bg: '#F2D5DB', ic: '#D87791' },
  { key: 'travel2', label: 'ท่องเที่ยว', icon: 'plane',  bg: '#DAF7E0', ic: '#5DA76C' },
  { key: 'save',    label: 'ออม',       icon: 'piggy',  bg: '#B2F5EA', ic: '#2C7A7B' },
];

const INCOME_CATS = [
  { key: 'salary', label: 'เงินเดือน', icon: 'wallet', bg: '#B2F5EA', ic: '#2C7A7B' },
  { key: 'freelance', label: 'ฟรีแลนซ์', icon: 'budget', bg: '#DAF7E0', ic: '#5DA76C' },
  { key: 'invest', label: 'ลงทุน', icon: 'piggy', bg: '#FFF1D6', ic: '#D69A2E' },
  { key: 'gift', label: 'ของขวัญ', icon: 'piggy', bg: '#F2D5DB', ic: '#D87791' },
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

// ═══════════════════════════════════════════════════════════════
// VARIATION A — Compact Refined
// Cleans the original: one row of type pills, bigger amount with
// inline keypad cue, category as horizontal chip strip, one tap to
// expand. Save button is solid teal & enabled.
// ═══════════════════════════════════════════════════════════════
function AddTxnA() {
  const types = [
    { key: 'expense', label: 'รายจ่าย' },
    { key: 'income',  label: 'รายรับ' },
    { key: 'transfer', label: 'โอน' },
    { key: 'save',    label: 'ออม' },
  ];
  const activeType = 'expense';
  const amount = '420';
  const selectedCat = EXPENSE_CATS[0];

  return (
    <div style={{ background: T.n200, height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <MintStatusBarV2 time="08:59" />
      <SheetHandle />
      <AddTxnHeader saveEnabled={true} />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px' }}>
        {/* Type segmented — single row, sticky-feel */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: 4, display: 'flex',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)',
          marginBottom: 14,
        }}>
          {types.map(t => {
            const on = t.key === activeType;
            return (
              <div key={t.key} style={{
                flex: 1, textAlign: 'center', padding: '9px 4px', borderRadius: 10,
                fontSize: 13, fontWeight: on ? 700 : 500,
                color: on ? '#fff' : T.n600,
                background: on ? T.primary500 : 'transparent',
                letterSpacing: 0.2,
              }}>{t.label}</div>
            );
          })}
        </div>

        {/* AMOUNT — hero card */}
        <div style={{
          background: '#fff', borderRadius: 18, padding: '20px 18px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 14px rgba(0,0,0,0.04)',
          marginBottom: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 11, color: T.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>จำนวนเงิน</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: T.n600,
                background: T.n200, padding: '3px 8px', borderRadius: 8,
              }}>THB ▾</div>
              <div style={{
                width: 30, height: 30, borderRadius: 8, background: T.n200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2"
                    stroke={T.n600} strokeWidth="1.8" strokeLinecap="round"/>
                  <rect x="8" y="9" width="8" height="6" rx="1" stroke={T.n600} strokeWidth="1.8"/>
                </svg>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: T.n900, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              -{formatAmount(amount)}
              <span style={{ color: T.n400, fontWeight: 500 }}>.00</span>
            </div>
            <div style={{
              width: 2, height: 30, background: T.primary500,
              animation: 'cursor-blink 1s infinite',
            }} />
          </div>
          <div style={{ fontSize: 11, color: T.n400, marginTop: 6 }}>≈ ค่ากาแฟ + ค่ามื้อกลางวัน</div>
        </div>

        {/* Category — horizontal chip strip */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8, padding: '0 4px' }}>หมวดหมู่</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '2px' }}>
            {EXPENSE_CATS.slice(0, 6).map(c => {
              const on = c.key === selectedCat.key;
              return (
                <div key={c.key} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  flexShrink: 0, width: 64,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: c.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: on ? `0 0 0 2px ${T.primary500}, 0 4px 10px rgba(56,178,172,0.25)` : 'none',
                  }}>
                    <CatIcon kind={c.icon} size={26} color={c.ic} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: on ? 700 : 500, color: on ? T.n900 : T.n600 }}>{c.label}</div>
                </div>
              );
            })}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, width: 64 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: '#fff',
                border: `1.5px dashed ${T.n300}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke={T.n400} strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div style={{ fontSize: 11, color: T.n600 }}>เพิ่ม</div>
            </div>
          </div>
        </div>

        {/* Wallet + Date row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <FieldCard
            label="กระเป๋า"
            icon={<div style={{ width: 28, height: 28, borderRadius: 10, background: T.walletPink100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CatIcon kind="piggy" size={16} color={T.walletPink} />
            </div>}
            value="ครอบครัว" />
          <FieldCard
            label="วันที่"
            icon={<div style={{ width: 28, height: 28, borderRadius: 10, background: T.primary100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CatIcon kind="budget" size={16} color={T.primary500} />
            </div>}
            value="วันนี้" />
        </div>

        {/* Note */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '12px 14px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 4h11l3 3v13a1 1 0 01-1 1H5V4z" stroke={T.n400} strokeWidth="1.6" strokeLinejoin="round"/>
            <path d="M9 10h7M9 13h7M9 16h4" stroke={T.n400} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 13, color: T.n400, flex: 1 }}>เพิ่มบันทึก…</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M16 4l4 4-12 12H4v-4L16 4z" stroke={T.n400} strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Tag + Toggle inline */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '10px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)', flex: 1,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 12V4h8l10 10-8 8L3 12z" stroke={T.primary500} strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="7.5" cy="7.5" r="1.2" fill={T.primary500}/>
            </svg>
            <div style={{ fontSize: 12, color: T.n600 }}># กลางวัน</div>
            <div style={{ fontSize: 12, color: T.n600 }}># งาน</div>
          </div>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '10px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ fontSize: 12, color: T.n700, fontWeight: 600 }}>นับในรายงาน</div>
            <Toggle on />
          </div>
        </div>

        {/* Save */}
        <button style={{
          width: '100%', padding: '15px', borderRadius: 14, border: 'none',
          background: T.primary500, color: '#fff',
          fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
          letterSpacing: 0.3, cursor: 'pointer',
          boxShadow: '0 6px 14px rgba(44,122,123,0.3)',
        }}>บันทึกธุรกรรม</button>
      </div>
    </div>
  );
}

function FieldCard({ label, icon, value }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '10px 12px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: T.n400, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 13, color: T.n900, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke={T.n400} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function Toggle({ on, size = 0.85 }) {
  return (
    <div style={{
      width: 36 * size, height: 22 * size, borderRadius: 999,
      background: on ? T.primary400 : T.n300,
      position: 'relative', flexShrink: 0,
      transition: 'background 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: 2 * size, left: on ? (16 * size) : (2 * size),
        width: 18 * size, height: 18 * size, borderRadius: 999, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VARIATION B — Numpad-first
// Amount is the hero. Big tabular display top, custom 12-key numpad
// bottom, contextual category & wallet between. Optimized for fast
// repeat entry — most users tap amount, pick a category, save.
// ═══════════════════════════════════════════════════════════════
function AddTxnB() {
  const types = [
    { key: 'expense', label: 'รายจ่าย', sign: '-', color: T.error400 },
    { key: 'income',  label: 'รายรับ',  sign: '+', color: T.primary500 },
    { key: 'transfer',label: 'โอนเงิน',  sign: '↔', color: T.info400 },
  ];
  const active = types[0];
  const amount = '180';
  const selectedCat = EXPENSE_CATS[0];

  const keys = [
    ['1','2','3'], ['4','5','6'], ['7','8','9'], ['.','0','⌫']
  ];

  return (
    <div style={{ background: T.n200, height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <MintStatusBarV2 time="08:59" />
      <SheetHandle />
      <AddTxnHeader />

      {/* Type pills */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {types.map(t => {
            const on = t.key === active.key;
            return (
              <div key={t.key} style={{
                flex: 1, padding: '9px 8px', borderRadius: 12,
                background: on ? '#fff' : 'transparent',
                border: on ? 'none' : `1px solid ${T.n300}`,
                boxShadow: on ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 9, background: on ? t.color : 'transparent',
                  border: on ? 'none' : `1.5px solid ${T.n400}`,
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{on ? t.sign : ''}</div>
                <div style={{ fontSize: 13, fontWeight: on ? 700 : 500, color: on ? T.n900 : T.n600 }}>{t.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Amount hero */}
      <div style={{ padding: '8px 16px 14px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.n400, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>จำนวนเงิน · THB</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginTop: 6 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: active.color, letterSpacing: -0.5 }}>{active.sign}</span>
          <span style={{ fontSize: 56, fontWeight: 800, color: T.n900, letterSpacing: -2, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {formatAmount(amount)}
          </span>
          <span style={{ fontSize: 24, fontWeight: 600, color: T.n400, fontVariantNumeric: 'tabular-nums' }}>.00</span>
        </div>
        {/* Calculator quick-add */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
          {['+50', '+100', '+500', '+1k'].map(q => (
            <div key={q} style={{
              padding: '5px 12px', borderRadius: 999, background: '#fff',
              border: `1px solid ${T.n300}`, fontSize: 11, fontWeight: 600, color: T.n600,
            }}>{q}</div>
          ))}
        </div>
      </div>

      {/* Category strip + wallet/date inline */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: 10,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {EXPENSE_CATS.slice(0, 5).map(c => {
              const on = c.key === selectedCat.key;
              return (
                <div key={c.key} style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  padding: '5px 10px 5px 5px', borderRadius: 999,
                  background: on ? c.bg : T.n200,
                  border: on ? `1.5px solid ${c.ic}` : '1.5px solid transparent',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 12,
                    background: on ? '#fff' : c.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CatIcon kind={c.icon} size={14} color={c.ic} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: on ? 700 : 500, color: on ? T.n900 : T.n600 }}>{c.label}</div>
                </div>
              );
            })}
            <div style={{
              padding: '5px 10px', borderRadius: 999, background: T.n200,
              fontSize: 12, color: T.n600, display: 'flex', alignItems: 'center', gap: 4,
            }}>+ เพิ่ม</div>
          </div>
          <div style={{ height: 1, background: T.n300, margin: '8px -10px 8px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{ width: 22, height: 22, borderRadius: 8, background: T.walletPink100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CatIcon kind="piggy" size={13} color={T.walletPink} />
              </div>
              <div style={{ fontSize: 12, color: T.n900, fontWeight: 600 }}>ครอบครัว</div>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.n400} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ width: 1, height: 16, background: T.n300 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CatIcon kind="budget" size={14} color={T.primary500} />
              <div style={{ fontSize: 12, color: T.n900, fontWeight: 600 }}>วันนี้</div>
            </div>
            <div style={{ width: 1, height: 16, background: T.n300 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 4h11l3 3v13H5V4z" stroke={T.n400} strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontSize: 12, color: T.n400 }}>+ บันทึก</div>
            </div>
          </div>
        </div>
      </div>

      {/* Numpad */}
      <div style={{ padding: '0 12px 8px', display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {keys.flat().map(k => (
            <div key={k} style={{
              background: '#fff', borderRadius: 12, padding: '11px 0',
              fontSize: 22, fontWeight: 600, color: T.n900,
              textAlign: 'center', fontVariantNumeric: 'tabular-nums',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>{k}</div>
          ))}
        </div>
        <div style={{ width: 76, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            flex: 1, background: '#fff', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 600, color: T.n700,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>+/−</div>
          <div style={{
            flex: 3, background: T.primary500, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff',
            boxShadow: '0 6px 14px rgba(44,122,123,0.3)',
            letterSpacing: 0.3,
          }}>บันทึก</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VARIATION C — Smart Bottom Sheet (with suggestions)
// Shorter sheet — doesn't fill the screen. Uses smart defaults
// (last category, wallet, today) so user can save with 1 tap.
// Surfaces frequent merchants ("คุณมักจะเลือก…"), receipt scan.
// ═══════════════════════════════════════════════════════════════
function AddTxnC() {
  const types = [
    { key: 'expense', label: 'รายจ่าย' },
    { key: 'income',  label: 'รายรับ' },
    { key: 'transfer', label: 'โอน' },
  ];
  const activeType = 'expense';
  const amount = '85';
  const selectedCat = EXPENSE_CATS[0];

  return (
    <div style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.3))', height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <MintStatusBarV2 time="08:59" />

      {/* Backdrop content peek */}
      <div style={{
        position: 'absolute', top: 60, left: 0, right: 0, padding: '0 20px', opacity: 0.35,
      }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>กิจกรรม</div>
        <div style={{ marginTop: 14 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              background: '#fff', height: 56, borderRadius: 14, marginBottom: 10,
              opacity: 0.6,
            }} />
          ))}
        </div>
      </div>

      {/* Sheet */}
      <div style={{
        background: T.n200, borderRadius: '24px 24px 0 0',
        padding: '0 0 28px',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
        position: 'relative',
      }}>
        <SheetHandle />

        <div style={{ padding: '12px 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.n900 }}>เพิ่มธุรกรรม</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Receipt scan */}
            <div style={{
              padding: '6px 12px', borderRadius: 999, background: '#fff',
              border: `1px solid ${T.n300}`, display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 600, color: T.n700,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2"
                  stroke={T.n700} strokeWidth="1.8" strokeLinecap="round"/>
                <rect x="8" y="9" width="8" height="6" rx="1" stroke={T.n700} strokeWidth="1.8"/>
              </svg>
              สแกนใบเสร็จ
            </div>
          </div>
        </div>

        {/* Type pill row — slim */}
        <div style={{ padding: '0 18px 12px', display: 'flex', gap: 6 }}>
          {types.map(t => {
            const on = t.key === activeType;
            return (
              <div key={t.key} style={{
                padding: '6px 14px', borderRadius: 999,
                background: on ? T.n900 : '#fff',
                color: on ? '#fff' : T.n600,
                fontSize: 12, fontWeight: on ? 700 : 500,
                border: on ? 'none' : `1px solid ${T.n300}`,
              }}>{t.label}</div>
            );
          })}
        </div>

        {/* Amount + category combined row */}
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{
            background: '#fff', borderRadius: 18, padding: '16px 18px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.n400, fontWeight: 600, letterSpacing: 0.4 }}>จำนวน · THB</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: T.n900, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>
                    -{formatAmount(amount)}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: T.n400 }}>.00</span>
                </div>
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 4px',
                borderLeft: `1px dashed ${T.n300}`,
                paddingLeft: 14, minWidth: 70,
              }}>
                <CatChipIcon cat={selectedCat} size={36} />
                <div style={{ fontSize: 11, fontWeight: 600, color: T.n900 }}>{selectedCat.label}</div>
                <div style={{ fontSize: 10, color: T.primary500 }}>เปลี่ยน ▾</div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart suggestions */}
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ fontSize: 11, color: T.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', padding: '0 4px', marginBottom: 8 }}>
            ที่คุณเลือกบ่อย
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px' }}>
            {[
              { name: 'กาแฟร้านประจำ', sub: '85 ฿', cat: EXPENSE_CATS[0] },
              { name: 'ข้าวกลางวัน',   sub: '120 ฿', cat: EXPENSE_CATS[0] },
              { name: 'BTS',           sub: '44 ฿',  cat: EXPENSE_CATS[2] },
              { name: '7-11',          sub: '—',     cat: EXPENSE_CATS[1] },
            ].map(s => (
              <div key={s.name} style={{
                background: '#fff', borderRadius: 12, padding: '8px 10px',
                display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
                border: `1px solid ${T.n300}`,
              }}>
                <CatChipIcon cat={s.cat} size={28} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.n900 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: T.n400 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact meta row */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '4px 4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          }}>
            <MetaCell
              icon={<div style={{ width: 22, height: 22, borderRadius: 7, background: T.walletPink100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CatIcon kind="piggy" size={12} color={T.walletPink} />
              </div>}
              label="กระเป๋า" value="ครอบครัว" />
            <MetaCell
              icon={<CatIcon kind="budget" size={14} color={T.primary500} />}
              label="วันที่" value="วันนี้" sep />
            <MetaCell
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 12V4h8l10 10-8 8L3 12z" stroke={T.primary500} strokeWidth="1.8" strokeLinejoin="round"/>
                <circle cx="7.5" cy="7.5" r="1.2" fill={T.primary500}/>
              </svg>}
              label="แท็ก" value="+ เพิ่ม" sep />
          </div>
        </div>

        {/* Note input — inline */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h11l3 3v13H5V4z" stroke={T.n400} strokeWidth="1.6"/>
              <path d="M9 10h7M9 13h7" stroke={T.n400} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 13, color: T.n900, flex: 1 }}>กาแฟลาเต้ ร้านที่ทำงาน</div>
          </div>
        </div>

        {/* Save bar */}
        <div style={{ padding: '0 16px', display: 'flex', gap: 8 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke={T.n700} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <button style={{
            flex: 1, padding: '14px', borderRadius: 14, border: 'none',
            background: T.primary500, color: '#fff',
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            letterSpacing: 0.3, cursor: 'pointer',
            boxShadow: '0 6px 14px rgba(44,122,123,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            บันทึก & เพิ่มอีก
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaCell({ icon, label, value, sep }) {
  return (
    <div style={{
      padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8,
      borderLeft: sep ? `1px solid ${T.n300}` : 'none',
    }}>
      {icon}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 9, color: T.n400 }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.n900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Wrap each in a phone frame, side by side with the original
// ═══════════════════════════════════════════════════════════════
function AddTxnOriginal() {
  // Faithful recreation of the screenshot for side-by-side comparison
  const T2 = T;
  return (
    <div style={{ background: T2.n200, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <MintStatusBarV2 time="08:59" />
      <SheetHandle />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 14px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke={T2.n800} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 16, fontWeight: 600, color: T2.n900 }}>เพิ่มธุรกรรม</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T2.primary400 }}>เสร็จ</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        {/* tabs row 1 */}
        <div style={{ background: '#fff', padding: 4, borderRadius: 12, display: 'flex', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: 6 }}>
          <div style={{ flex: 1, padding: '8px', textAlign: 'center', borderRadius: 9, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', fontSize: 13, fontWeight: 700 }}>รายจ่าย</div>
          <div style={{ flex: 1, padding: '8px', textAlign: 'center', fontSize: 13, color: T2.n600 }}>รายรับ</div>
        </div>
        {/* tabs row 2 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 4px 14px', fontSize: 12, color: T2.n600 }}>
          <span>บัตรเครดิต</span><span>โอนเงิน</span><span>ออมเงิน</span>
        </div>
        {/* amount */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: T2.n400, marginBottom: 4 }}>จำนวน</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: T2.n200, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>THB</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>0</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" stroke={T2.n400} strokeWidth="1.6"/></svg>
          </div>
        </div>
        {/* row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: T2.walletPink100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🐷</div>
            <div style={{ fontSize: 12, flex: 1 }}>ครอบครัว</div>
            <span style={{ fontSize: 10, color: T2.n400 }}>▾</span>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: T2.n300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>◆</div>
            <div style={{ fontSize: 11, color: T2.n400, flex: 1 }}>เลือกหมวดหมู่</div>
            <span style={{ fontSize: 10, color: T2.n400 }}>▾</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: T2.primary100, padding: '3px 7px', borderRadius: 6, fontSize: 11, fontWeight: 600, color: T2.n900 }}>📅 28 เม.ย. 2026</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, color: T2.n400, flex: 1 }}>📝 จดบันทึก</div>
            <span style={{ fontSize: 10 }}>✎</span>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: '10px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🏷️</span><span style={{ fontSize: 13, color: T2.n400, flex: 1 }}>แท็ก</span><span style={{ color: T2.n400 }}>▾</span>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>นับในรายงาน</div>
            <div style={{ fontSize: 11, color: T2.n400 }}>รายการนี้ถูกนับในรายงานสรุป</div>
          </div>
          <Toggle on />
        </div>
        <button style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: T2.primary100, color: T2.primary500, fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
        }}>บันทึก</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  AddTxnOriginal, AddTxnA, AddTxnB, AddTxnC,
});
