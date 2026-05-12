// v4 — Add Transaction · Variation E (Expense, improved)
// แก้ปัญหาจาก UX review ของ AddTxnD_Expense:
//   1. ลบ category ที่ซ้ำ 3 ที่ → เหลือแถวเดียว
//   2. ย้าย "เพิ่มแล้ว" ไป footer แบบ collapse
//   3. เพิ่ม merchant + recent chips (ลด tap)
//   4. เพิ่ม quick-amount chips
//   5. Split CTA: บันทึก / & เพิ่มอีก, เปลี่ยน "ปิด" → "ยกเลิก"
//   6. ปุ่ม PromptPay slip import (เด่นกว่า scan)
//   7. ขยาย font label เล็ก ๆ ให้อ่านได้ (12px+)
//   8. ซ่อน currency picker (THB เท่านั้นใน default)

const TE = window.MINT;

// ─── Improved sheet shell ────────────────────────────────────
function ESheetShell({ children, txns = [] }) {
  const [expanded, setExpanded] = React.useState(false);
  const [splitOpen, setSplitOpen] = React.useState(false);

  const total = txns.reduce((s, t) => s + (t.type === 'expense' ? -t.amount : t.amount), 0);

  return (
    <div style={{
      background: TE.n200,
      height: '100%', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <MintStatusBarV2 time="09:30" />

      {/* Sheet — ใช้ 90% เหมือนเดิม แต่ใช้พื้นที่คุ้มค่ากว่า */}
      <div style={{
        background: TE.n200,
        height: '90%',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, flexShrink: 0 }}>
          <div style={{ width: 36, height: 5, borderRadius: 3, background: TE.n300 }} />
        </div>

        {/* Header — focused title + 2 quick-import buttons */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 18px 14px', flexShrink: 0,
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: TE.n900, letterSpacing: -0.2 }}>เพิ่มรายจ่าย</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Receipt scan — pill style (matches AddTxnC) */}
            <div style={{
              padding: '6px 12px', borderRadius: 999, background: '#fff',
              border: `1px solid ${TE.n300}`, display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 600, color: TE.n700, cursor: 'pointer',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2"
                  stroke={TE.n700} strokeWidth="1.8" strokeLinecap="round"/>
                <rect x="8" y="9" width="8" height="6" rx="1" stroke={TE.n700} strokeWidth="1.8"/>
              </svg>
              สแกนใบเสร็จ
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>

        {/* Saved-txns collapsed footer (เก็บไว้ล่างแทนบน) */}
        {txns.length > 0 && (
          <div style={{
            padding: expanded ? '10px 16px 0' : '10px 16px',
            background: TE.n200,
            borderTop: `1px solid ${TE.n300}`,
            flexShrink: 0,
          }}>
            <div
              onClick={() => setExpanded(!expanded)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 11, background: TE.primary500,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TE.n800, flex: 1 }}>
                บันทึกแล้ว {txns.length} รายการ · เซสชันนี้
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: total < 0 ? TE.error400 : TE.primary500 }}>
                {total < 0 ? '−' : '+'}{Math.abs(total).toLocaleString()}฿
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M6 15l6-6 6 6" stroke={TE.n500} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            {expanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 0 4px' }}>
                {txns.map((t, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', background: '#fff', borderRadius: 10,
                  }}>
                    <CatChipIcon cat={t.cat} size={28} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TE.n900 }}>{t.merchant || t.catLabel}</div>
                      <div style={{ fontSize: 11, color: TE.n400 }}>{t.walletLabel} · {t.time}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.type === 'expense' ? TE.error400 : TE.primary500 }}>
                      {t.type === 'expense' ? '−' : '+'}{t.amount.toLocaleString()}฿
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sticky bottom action bar — split CTA */}
        <div style={{
          padding: '12px 16px 20px',
          background: TE.n200,
          flexShrink: 0,
          display: 'flex', gap: 8,
          position: 'relative',
        }}>
          {/* Cancel — text-only, less weight than ปิด ที่ดูเหมือน save */}
          <button style={{
            padding: '14px 18px', borderRadius: 14, border: 'none',
            background: 'transparent', color: TE.n600,
            fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer',
          }}>
            ยกเลิก
          </button>
          {/* Primary save */}
          <button style={{
            flex: 1, padding: '14px', borderRadius: 14, border: 'none',
            background: TE.primary500, color: '#fff',
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            letterSpacing: 0.3, cursor: 'pointer',
            boxShadow: '0 6px 14px rgba(44,122,123,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            บันทึก
            <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 500 }}>· 85฿</span>
          </button>
          {/* Split chevron — reveals "& เพิ่มอีก" */}
          <button
            onClick={() => setSplitOpen(!splitOpen)}
            style={{
              width: 50, height: 50, borderRadius: 14, border: 'none',
              background: TE.primary600, color: '#fff',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(44,122,123,0.3)',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: splitOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Reveal: บันทึก & เพิ่มอีก */}
          {splitOpen && (
            <div style={{
              position: 'absolute', right: 16, bottom: 78,
              background: '#fff', borderRadius: 12, padding: 6,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.08)',
              minWidth: 200,
            }}>
              <div style={{
                padding: '10px 12px', borderRadius: 8,
                fontSize: 13, fontWeight: 600, color: TE.n900,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={TE.primary500} strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                บันทึก & เพิ่มอีก
              </div>
              <div style={{
                padding: '10px 12px', borderRadius: 8,
                fontSize: 13, fontWeight: 600, color: TE.n900,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6v6l4 2" stroke={TE.primary500} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke={TE.primary500} strokeWidth="2"/>
                </svg>
                บันทึกแบบประจำ (รายเดือน)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Type tabs (เหมือน DTabs แต่ tweak font) ──────────────
function ETabs({ active }) {
  const tops = [
    { key: 'expense',  label: 'รายจ่าย' },
    { key: 'income',   label: 'รายรับ' },
    { key: 'credit',   label: 'บัตรเครดิต' },
    { key: 'transfer', label: 'โอนเงิน' },
    { key: 'saving',   label: 'ออมเงิน' },
  ];
  return (
    <div style={{ padding: '0 16px 14px' }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {tops.map(t => {
          const on = t.key === active;
          return (
            <div key={t.key} style={{
              padding: '8px 16px', borderRadius: 999,
              background: on ? TE.n900 : '#fff',
              color: on ? '#fff' : TE.n600,
              fontSize: 13, fontWeight: on ? 700 : 500,
              border: on ? 'none' : `1px solid ${TE.n300}`,
              flexShrink: 0,
            }}>{t.label}</div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hero amount (no avatar, no hint, no extra noise) ──────
const CURRENCIES = [
  { code: 'THB', symbol: '฿', flag: '🇹🇭', name: 'บาท' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'ดอลลาร์สหรัฐ' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'ยูโร' },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'เยน' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'ปอนด์' },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', name: 'หยวน' },
  { code: 'KRW', symbol: '₩', flag: '🇰🇷', name: 'วอน' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'ดอลลาร์สิงคโปร์' },
];

function EAmountHero({ amount = '85', sign = '−' }) {
  const [curCode, setCurCode] = React.useState('THB');
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const cur = CURRENCIES.find(c => c.code === curCode) || CURRENCIES[0];

  return (
    <div style={{
      margin: '0 16px 12px', background: '#fff', borderRadius: 18,
      padding: '20px 18px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
      textAlign: 'center',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: TE.n400, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          จำนวนเงิน
        </div>
        <button
          onClick={() => setPickerOpen(o => !o)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 8, border: 'none',
            background: TE.n200, color: TE.n700,
            fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer', letterSpacing: 0.3,
          }}
        >
          <span style={{ fontSize: 12 }}>{cur.flag}</span>
          {cur.code}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" style={{ transform: pickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: TE.error400, letterSpacing: -0.5 }}>{sign}</span>
        <span style={{
          fontSize: 56, fontWeight: 800, color: TE.n900,
          letterSpacing: -2, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>
          {Number(amount.replace(/,/g,'')).toLocaleString('en-US')}
        </span>
        <span style={{ fontSize: 22, fontWeight: 600, color: TE.n400, fontVariantNumeric: 'tabular-nums' }}>.00</span>
        <span style={{ fontSize: 13, color: TE.n400, fontWeight: 600, marginLeft: 4 }}>{cur.symbol}</span>
      </div>

      {pickerOpen && (
        <>
          <div
            onClick={() => setPickerOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 30 }}
          />
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            marginTop: 4, zIndex: 31,
            background: '#fff', borderRadius: 14,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)',
            border: `1px solid ${TE.n200}`,
            minWidth: 220, maxHeight: 280, overflowY: 'auto',
            padding: 6,
          }}>
            {CURRENCIES.map(c => {
              const on = c.code === curCode;
              return (
                <button
                  key={c.code}
                  onClick={() => { setCurCode(c.code); setPickerOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, border: 'none',
                    background: on ? TE.primary100 : 'transparent',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: on ? TE.primary600 : TE.n900 }}>
                      {c.code} <span style={{ color: TE.n400, fontWeight: 500 }}>· {c.symbol}</span>
                    </div>
                    <div style={{ fontSize: 11, color: TE.n400, fontWeight: 500 }}>{c.name}</div>
                  </div>
                  {on && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">+CHIP_ICON_SIZE
                      <path d="M5 13l4 4L19 7" stroke={TE.primary600} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
      {/* Quick-amount chips */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
        {['+50', '+100', '+500', '+1k', 'C'].map((q, i) => (
          <div key={q} style={{
            padding: '6px 14px', borderRadius: 999,
            background: i === 4 ? TE.error100 : TE.n200,
            color: i === 4 ? TE.error500 : TE.n700,
            fontSize: 12, fontWeight: 700, letterSpacing: 0.2,
            cursor: 'pointer',
          }}>{q}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Wallet disclosure row (one-time setup, low-frequency change) ────────
function EFieldRow({ icon, label, value, hint, prominent }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '12px 14px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: TE.n400, fontWeight: 500 }}>{label}</div>
        <div style={{
          fontSize: prominent ? 16 : 14,
          color: TE.n900,
          fontWeight: prominent ? 700 : 600,
          letterSpacing: prominent ? 0.1 : 0,
        }}>{value}</div>
      </div>
      {hint && (
        <div style={{ fontSize: 11, color: TE.n400, textAlign: 'right' }}>{hint}</div>
      )}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke={TE.n400} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ─── Category data tree (shared by chip rail + full picker) ────────
const CATEGORY_TREE = [
  { key: 'food',      label: 'อาหาร',   icon: 'food',      bg: '#FEE2E2', ic: '#EF4444',
    subs: [
      { key: 'lunch',    label: 'ข้าวกลางวัน' },
      { key: 'dinner',   label: 'ข้าวเย็น' },
      { key: 'coffee',   label: 'กาแฟ/ชา' },
      { key: 'snack',    label: 'ขนม' },
      { key: 'delivery', label: 'ส่งอาหาร' },
      { key: 'restaurant', label: 'ร้านอาหาร' },
    ] },
  { key: 'transport', label: 'เดินทาง', icon: 'transport', bg: '#DBEAFE', ic: '#3B82F6',
    subs: [
      { key: 'bts',     label: 'BTS/MRT' },
      { key: 'taxi',    label: 'แท็กซี่' },
      { key: 'grab',    label: 'Grab' },
      { key: 'fuel',    label: 'น้ำมัน' },
      { key: 'parking', label: 'ที่จอดรถ' },
      { key: 'toll',    label: 'ค่าทางด่วน' },
    ] },
  { key: 'shopping',  label: 'ของใช้',  icon: 'shopping',  bg: '#DCFCE7', ic: '#22C55E',
    subs: [
      { key: 'home',        label: 'ของใช้ในบ้าน' },
      { key: 'clothes',     label: 'เสื้อผ้า' },
      { key: 'cosmetics',   label: 'เครื่องสำอาง' },
      { key: 'electronics', label: 'อิเล็กทรอนิกส์' },
    ] },
  { key: 'bills',     label: 'บิล',     icon: 'budget',    bg: '#FEF3C7', ic: '#F59E0B',
    subs: [
      { key: 'water',    label: 'ค่าน้ำ' },
      { key: 'electric', label: 'ค่าไฟ' },
      { key: 'internet', label: 'อินเทอร์เน็ต' },
      { key: 'mobile',   label: 'มือถือ' },
      { key: 'rent',     label: 'ค่าเช่า' },
      { key: 'insurance', label: 'ประกัน' },
    ] },
  { key: 'fun',       label: 'บันเทิง', icon: 'piggy',     bg: '#F3E8FF', ic: '#A855F7',
    subs: [
      { key: 'movies',    label: 'หนัง' },
      { key: 'games',     label: 'เกม' },
      { key: 'streaming', label: 'สตรีมมิ่ง' },
      { key: 'social',    label: 'สังสรรค์' },
    ] },
  { key: 'health',    label: 'สุขภาพ',  icon: 'food',      bg: '#FFE4E6', ic: '#F43F5E',
    subs: [
      { key: 'doctor',   label: 'หมอ' },
      { key: 'medicine', label: 'ยา' },
      { key: 'fitness',  label: 'ฟิตเนส' },
      { key: 'vitamins', label: 'วิตามิน' },
    ] },
  { key: 'other',     label: 'อื่นๆ',   icon: 'budget',    bg: '#E5E7EB', ic: '#6B7280',
    subs: [
      { key: 'gift',    label: 'ของขวัญ' },
      { key: 'donate',  label: 'บริจาค' },
      { key: 'fee',     label: 'ค่าธรรมเนียม' },
    ] },
];

const FREQUENT_CAT_KEYS = ['food', 'transport', 'shopping', 'bills'];

function findCat(key) { return CATEGORY_TREE.find(c => c.key === key); }
function findSub(cat, subKey) { return cat?.subs.find(s => s.key === subKey); }

// ─── Category chip rail — frequent + "ดูทั้งหมด" + bottom-sheet picker ────────
function ECategoryChips({ value, onChange }) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickerCat, setPickerCat] = React.useState(null); // step-2 category being drilled into

  const CHIP_CONTAINER = 32;
  const CHIP_ICON_SIZE = Math.round(CHIP_CONTAINER * 0.5); // 50% of container
  const BREADCRUMB_CONTAINER = 28;
  const BREADCRUMB_ICON_SIZE = Math.round(BREADCRUMB_CONTAINER * 0.5); // 50% of container

  const frequent = FREQUENT_CAT_KEYS.map(findCat);
  const selectedCat = value ? findCat(value.key) : null;
  const selectedSub = selectedCat && value?.subKey ? findSub(selectedCat, value.subKey) : null;
  // Show breadcrumb chip when current selection isn't in the visible 4 OR when a sub-cat is chosen.
  const showBreadcrumb = selectedCat && (!FREQUENT_CAT_KEYS.includes(selectedCat.key) || !!selectedSub);

  const openPicker = () => { setPickerCat(null); setPickerOpen(true); };
  const closePicker = () => { setPickerOpen(false); setPickerCat(null); };

  const pickCategory = (cat) => {
    if (!cat.subs || cat.subs.length === 0) {
      onChange?.({ key: cat.key, subKey: null });
      closePicker();
    } else {
      setPickerCat(cat);
    }
  };
  const pickSub = (cat, sub) => {
    onChange?.({ key: cat.key, subKey: sub.key });
    closePicker();
  };
  const pickCategoryOnly = (cat) => {
    onChange?.({ key: cat.key, subKey: null });
    closePicker();
  };

  const renderChip = (c) => {
    const on = value?.key === c.key && !value?.subKey;
    return (
      <div
        key={c.key}
        onClick={() => onChange?.({ key: c.key, subKey: null })}
        style={{
          flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          padding: '10px 12px 8px', minWidth: 64,
          background: on ? c.bg : '#fff',
          borderRadius: 14,
          border: on ? `1.5px solid ${c.ic}` : `1px solid ${TE.n300}`,
          boxShadow: on
            ? `0 2px 8px ${c.ic}22, 0 1px 2px rgba(0,0,0,0.04)`
            : '0 1px 2px rgba(0,0,0,0.03)',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <div style={{
          width: CHIP_CONTAINER, height: CHIP_CONTAINER, borderRadius: 10,
          background: on ? '#fff' : c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CatIcon kind={c.icon} size={CHIP_ICON_SIZE} color={c.ic} />
        </div>
        <div style={{
          fontSize: 11, fontWeight: on ? 700 : 600,
          color: on ? c.ic : TE.n700,
          letterSpacing: 0.1,
        }}>
          {c.label}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '0 2px 6px',
      }}>
        <div style={{ fontSize: 12, color: TE.n500, fontWeight: 600, letterSpacing: 0.2 }}>
          หมวดหมู่
        </div>
        <div style={{ fontSize: 11, color: TE.n400, fontWeight: 500 }}>
          {selectedCat ? 'แตะเพื่อเปลี่ยน' : 'ใช้บ่อย หรือดูทั้งหมด'}
        </div>
      </div>

      {/* Breadcrumb summary — visible whenever a non-frequent cat or sub-cat is picked */}
      {showBreadcrumb && (
        <div
          onClick={openPicker}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', marginBottom: 8,
            background: selectedCat.bg, borderRadius: 12,
            border: `1px solid ${selectedCat.ic}33`,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: BREADCRUMB_CONTAINER, height: BREADCRUMB_CONTAINER, borderRadius: 9, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CatIcon kind={selectedCat.icon} size={BREADCRUMB_ICON_SIZE} color={selectedCat.ic} />
          </div>
          <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: selectedCat.ic, letterSpacing: 0.1 }}>
            {selectedCat.label}
            {selectedSub && (
              <>
                <span style={{ margin: '0 6px', color: `${selectedCat.ic}88`, fontWeight: 500 }}>›</span>
                <span style={{ color: TE.n900 }}>{selectedSub.label}</span>
              </>
            )}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={selectedCat.ic} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        margin: '0 -16px', padding: '2px 16px 4px',
        scrollbarWidth: 'none',
      }}>
        {frequent.map(renderChip)}

        {/* ดูทั้งหมด — prominent pill, replaces the dashed tile */}
        <div
          onClick={openPicker}
          style={{
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 14px 8px', minWidth: 72,
            background: TE.primary100, borderRadius: 14,
            border: `1px solid ${TE.primary500}33`,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: CHIP_CONTAINER, height: CHIP_CONTAINER, borderRadius: 10, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={CHIP_ICON_SIZE} height={CHIP_ICON_SIZE} viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="6" r="1.4" fill={TE.primary600}/>
              <circle cx="5" cy="12" r="1.4" fill={TE.primary600}/>
              <circle cx="5" cy="18" r="1.4" fill={TE.primary600}/>
              <path d="M10 6h10M10 12h10M10 18h10" stroke={TE.primary600} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: TE.primary600, letterSpacing: 0.1 }}>
            ดูทั้งหมด
          </div>
        </div>
      </div>

      {pickerOpen && (
        <ECategoryPicker
          step2Cat={pickerCat}
          onBack={() => setPickerCat(null)}
          onClose={closePicker}
          onPickCategory={pickCategory}
          onPickSub={pickSub}
          onPickCategoryOnly={pickCategoryOnly}
          currentValue={value}
        />
      )}
    </div>
  );
}

// ─── Bottom-sheet picker (overlays inside ESheetShell) ────────
function ECategoryPicker({ step2Cat, onBack, onClose, onPickCategory, onPickSub, onPickCategoryOnly, currentValue }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const inStep2 = !!step2Cat;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15, 23, 42, 0.38)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'relative',
        background: TE.n200,
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.18)',
        maxHeight: '78%',
        display: 'flex', flexDirection: 'column',
        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        opacity: mounted ? 1 : 0,
        transition: 'transform 0.22s ease, opacity 0.22s ease',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div style={{ width: 36, height: 5, borderRadius: 3, background: TE.n300 }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px 12px',
        }}>
          {inStep2 ? (
            <button
              onClick={onBack}
              style={{
                width: 32, height: 32, borderRadius: 10, border: 'none',
                background: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke={TE.n700} strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          ) : <div style={{ width: 32 }} />}

          <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, color: TE.n900 }}>
            {inStep2 ? step2Cat.label : 'เลือกหมวดหมู่'}
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 10, border: 'none',
              background: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke={TE.n700} strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px' }}>
          {!inStep2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CATEGORY_TREE.map(c => {
                const on = currentValue?.key === c.key;
                return (
                  <div
                    key={c.key}
                    onClick={() => onPickCategory(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 14px',
                      background: '#fff', borderRadius: 14,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      border: on ? `1.5px solid ${c.ic}` : '1.5px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 12, background: c.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CatIcon kind={c.icon} size={18} color={c.ic} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TE.n900 }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: TE.n400, fontWeight: 500, marginTop: 2 }}>
                        {c.subs.length} หมวดย่อย
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke={TE.n400} strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                );
              })}
            </div>
          )}

          {inStep2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Allow choosing the parent category by itself (no sub-cat) */}
              <div
                onClick={() => onPickCategoryOnly(step2Cat)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: step2Cat.bg, borderRadius: 14,
                  border: `1px solid ${step2Cat.ic}33`,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CatIcon kind={step2Cat.icon} size={16} color={step2Cat.ic} />
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: step2Cat.ic }}>
                  ใช้ {step2Cat.label} (ไม่ระบุหมวดย่อย)
                </div>
              </div>

              {step2Cat.subs.map(s => {
                const on = currentValue?.key === step2Cat.key && currentValue?.subKey === s.key;
                return (
                  <div
                    key={s.key}
                    onClick={() => onPickSub(step2Cat, s)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 14px',
                      background: '#fff', borderRadius: 14,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      border: on ? `1.5px solid ${step2Cat.ic}` : '1.5px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, background: step2Cat.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CatIcon kind={step2Cat.icon} size={16} color={step2Cat.ic} />
                    </div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: TE.n900 }}>{s.label}</div>
                    {on && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke={step2Cat.ic} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Compact meta row (Date stepper + Note) ─────────────────────
function EMetaRow() {
  const TODAY = React.useMemo(() => new Date(2026, 4, 1), []);
  const [date, setDate] = React.useState(TODAY);

  const stepDay = (delta) => {
    const next = new Date(date);
    next.setDate(next.getDate() + delta);
    setDate(next);
  };

  const pad = (n) => String(n).padStart(2, '0');
  const ddmmyyyy = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  const dayDiff = Math.round((date - TODAY) / 86400000);

  const headerIcon = (svg) => (
    <div style={{
      width: 18, height: 18, borderRadius: 5, background: TE.primary100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>{svg}</div>
  );

  const arrowBtn = (dir, dim, onClick) => (
    <button
      onClick={onClick}
      aria-label={dir === 'left' ? 'วันก่อนหน้า' : 'วันถัดไป'}
      style={{
        width: 24, height: 24, borderRadius: 6, border: 'none',
        background: 'transparent', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: dim ? TE.n300 : TE.n600, flexShrink: 0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );

  return (
    <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {/* Date cell */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: '8px 10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img
            src="assets/add_transactions/calendar.png"
            srcSet="assets/add_transactions/2.0x/calendar.png 2x, assets/add_transactions/3.0x/calendar.png 3x"
            alt=""
            style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ fontSize: 11, fontWeight: 600, color: TE.n700, letterSpacing: 0.2 }}>วันที่</div>
        </div>
        <div style={{ borderTop: `1px solid ${TE.n200}`, marginTop: 6, paddingTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            {arrowBtn('left', false, () => stepDay(-1))}
            <div
              onClick={() => console.log('open calendar')}
              style={{
                flex: 1, textAlign: 'center', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, color: TE.n900,
                fontVariantNumeric: 'tabular-nums', letterSpacing: 0.3,
              }}
            >
              {ddmmyyyy}
            </div>
            {arrowBtn('right', dayDiff > 0, () => stepDay(1))}
          </div>
        </div>
      </div>

      {/* Note cell */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: '8px 10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img
            src="assets/add_transactions/notes.png"
            srcSet="assets/add_transactions/2.0x/notes.png 2x, assets/add_transactions/3.0x/notes.png 3x"
            alt=""
            style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ fontSize: 11, fontWeight: 600, color: TE.n700, letterSpacing: 0.2 }}>บันทึก</div>
        </div>
        <div style={{ borderTop: `1px solid ${TE.n200}`, marginTop: 6, paddingTop: 6 }}>
          <div style={{
            fontSize: 13, fontWeight: 500, color: TE.n400,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 24,
          }}>
            + เพิ่มบันทึก…
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tag picker — multi-select with search + create ───────
const PRESET_TAGS = [
  'ทริปเชียงใหม่', 'งานบริษัท', 'ลดน้ำหนัก', 'ของขวัญ',
  'ครอบครัว', 'งานแต่ง', 'reimburse', 'ของฟุ่มเฟือย',
  'ค่ารักษา', 'ค่าเรียน', 'ลงทุน',
];

function ETagsRow({ value = [], onChange, allTags = PRESET_TAGS }) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [pool, setPool] = React.useState(allTags);

  const toggle = (tag) => {
    if (value.includes(tag)) onChange?.(value.filter(t => t !== tag));
    else onChange?.([...value, tag]);
  };
  const remove = (tag) => onChange?.(value.filter(t => t !== tag));

  const q = query.trim();
  const filtered = q ? pool.filter(t => t.toLowerCase().includes(q.toLowerCase())) : pool;
  const exactExists = pool.some(t => t.toLowerCase() === q.toLowerCase());
  const canCreate = q.length > 0 && !exactExists;

  const createTag = () => {
    if (!canCreate) return;
    setPool([q, ...pool]);
    onChange?.([...value, q]);
    setQuery('');
  };

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '8px 10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img
              src="assets/common/tag.png"
              srcSet="assets/common/2.0x/tag.png 2x, assets/common/3.0x/tag.png 3x"
              alt=""
              style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
            />
            <div style={{ fontSize: 11, fontWeight: 600, color: TE.n700, letterSpacing: 0.2 }}>ป้ายกำกับ</div>
          </div>
          {value.length > 0 && (
            <div style={{ fontSize: 10, fontWeight: 600, color: TE.n400 }}>{value.length} ป้าย</div>
          )}
        </div>

        <div style={{ borderTop: `1px solid ${TE.n200}`, marginTop: 6, paddingTop: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            {value.map(tag => (
              <div key={tag} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 4px 4px 10px', borderRadius: 999,
                background: TE.primary100, color: TE.primary600,
                fontSize: 12, fontWeight: 600, letterSpacing: 0.1,
              }}>
                #{tag}
                <button
                  onClick={() => remove(tag)}
                  aria-label={`ลบ ${tag}`}
                  style={{
                    width: 18, height: 18, borderRadius: 999, border: 'none',
                    background: 'transparent', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: TE.primary600,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => { setQuery(''); setPickerOpen(true); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 999,
                background: 'transparent', color: TE.n600,
                border: `1px dashed ${TE.n400}`,
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
              </svg>
              {value.length === 0 ? 'เพิ่มป้าย' : 'เพิ่ม'}
            </button>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <>
          <div
            onClick={() => setPickerOpen(false)}
            style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
              zIndex: 20,
            }}
          />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            background: '#fff', borderRadius: '20px 20px 0 0',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
            zIndex: 21, maxHeight: '70%', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
              <div style={{ width: 36, height: 5, borderRadius: 3, background: TE.n300 }} />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 18px 6px',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: TE.n900 }}>เลือกป้ายกำกับ</div>
              <button
                onClick={() => setPickerOpen(false)}
                aria-label="ปิด"
                style={{
                  width: 30, height: 30, borderRadius: 999, border: 'none',
                  background: TE.n200, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke={TE.n700} strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div style={{ padding: '6px 16px 10px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: TE.n200, borderRadius: 10, padding: '8px 12px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke={TE.n500} strokeWidth="2"/>
                  <path d="M16 16l4 4" stroke={TE.n500} strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ค้นหาหรือพิมพ์เพื่อสร้างใหม่"
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 13, color: TE.n900, fontFamily: 'inherit',
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="ล้าง"
                    style={{
                      width: 18, height: 18, borderRadius: 999, border: 'none',
                      background: TE.n300, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                    }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
              {canCreate && (
                <button
                  onClick={createTag}
                  style={{
                    width: '100%', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 12px', borderRadius: 12,
                    background: TE.primary100, border: `1px solid ${TE.primary500}33`,
                    cursor: 'pointer', marginBottom: 8, fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5v14" stroke={TE.primary600} strokeWidth="2.4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: TE.primary600 }}>
                    สร้างป้ายใหม่ "{q}"
                  </div>
                </button>
              )}

              {filtered.length === 0 && !canCreate && (
                <div style={{
                  textAlign: 'center', padding: '24px 12px',
                  fontSize: 12, color: TE.n400, fontWeight: 500,
                }}>
                  ไม่พบป้ายที่ตรงกับ "{q}"
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {filtered.map(tag => {
                  const on = value.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggle(tag)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        background: on ? TE.primary100 : 'transparent',
                        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: on ? TE.primary500 : '#fff',
                        border: on ? 'none' : `1.5px solid ${TE.n300}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {on && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: on ? 700 : 500, color: on ? TE.primary600 : TE.n900 }}>
                        #{tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{
              padding: '10px 16px 14px', borderTop: `1px solid ${TE.n200}`,
              display: 'flex', gap: 8,
            }}>
              <button
                onClick={() => setPickerOpen(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                  background: TE.n200, color: TE.n700,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                เสร็จ ({value.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Include-in-report toggle ─────────────────────────────
function EReportToggle({ value = true, onChange }) {
  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div
        onClick={() => onChange?.(!value)}
        style={{
          background: '#fff', borderRadius: 14, padding: '10px 12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 10,
          background: value ? TE.primary100 : TE.n200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'background 0.15s',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"
                  stroke={value ? TE.primary500 : TE.n500} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TE.n900, letterSpacing: 0.1 }}>
            รวมในรายงาน
          </div>
          <div style={{ fontSize: 11, color: TE.n400, fontWeight: 500, marginTop: 1 }}>
            {value
              ? 'นับในยอดรวม สรุปงบ และกราฟ'
              : 'ไม่นับในสรุป — ใช้กับโอนเงิน/รายการชั่วคราว'}
          </div>
        </div>
        <div
          role="switch"
          aria-checked={value}
          style={{
            width: 40, height: 24, borderRadius: 999, flexShrink: 0,
            background: value ? TE.primary500 : TE.n300,
            position: 'relative', transition: 'background 0.15s',
          }}
        >
          <div style={{
            position: 'absolute', top: 2, left: value ? 18 : 2,
            width: 20, height: 20, borderRadius: 999, background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left 0.15s',
          }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// E · EXPENSE (improved version of D)
// ═══════════════════════════════════════════════════════════════
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

      {/* Category — manual chip pick; Wallet — disclosure row */}
      <div style={{ padding: '0 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ECategoryChips value={cat} onChange={setCat} />
        <EFieldRow
          icon={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TE.walletPink100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon kind="piggy" size={18} color={TE.walletPink} />
          </div>}
          label="กระเป๋า"
          value="ครอบครัว"
          hint="คงเหลือ 34,368฿"
        />
      </div>

      <EMetaRow />

      <ETagsRow value={tags} onChange={setTags} />

      <EReportToggle value={inReport} onChange={setInReport} />
    </ESheetShell>
  );
}

// ── Exports ─────────────────────────────────────────────────
Object.assign(window, {
  AddTxnE_Expense,
  ESheetShell, ETabs, EAmountHero, EFieldRow,
  ECategoryChips, ECategoryPicker,
  EMetaRow, ETagsRow, EReportToggle,
});
