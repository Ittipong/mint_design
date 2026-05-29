// Create Wallet — Design C.1 · "Single page · essentials-first (progressive disclosure)"
//
// Third single-page sibling to A.1 / B.1. Shares the same sticky preview bar so
// the trio reads as one family, but its information architecture is the point:
//
//   UX basis (ui-ux-pro-max form rules):
//     • progressive-disclosure — show only what's needed; reveal the rest on demand
//     • primary-action — one CTA per screen
//     • "fields ≤ 3–4 for best completion"
//
//   So C1 shows ONLY the essentials up front — ประเภท · ชื่อ · ไอคอน&สี · ยอด —
//   and tucks สกุลเงิน + เป้าหมาย AI under a collapsible "ตั้งค่าเพิ่มเติม".
//   First-time create feels effortless; power users expand for more.
//
//   create → advanced collapsed (fast path), CTA "สร้างกระเป๋า"
//   edit   → advanced expanded (data already exists), CTA "บันทึกการแก้ไข", + delete
(function () {
const W = window.MINT;

const INK = {
  surface: '#F4F5F8',
  muted:   '#6B6B78',
  faint:   '#9A99A6',
  divider: '#ECECF1',
  hairline:'#F0F0F4',
};

const cardShadow = '0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)';

function Eyebrow({ children }) {
  return (
    <div style={{
      fontSize: 10, color: INK.faint, fontWeight: 600,
      letterSpacing: 0.6, textTransform: 'uppercase',
    }}>{children}</div>
  );
}

// ─── Wallet icons (inline svg) — self-contained, mirrors A1/B1 ───
function WIcon({ kind, size = 24, color = '#fff' }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'savings':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 11c0-2.8 2.7-5 6-5 1.4 0 2.6.4 3.6 1.1L17 6l-.5 2.6c.9.9 1.5 2.1 1.5 3.4 0 .9-.3 1.7-.7 2.5l.7 1.5h-2.5l-.6-.6c-.7.4-1.5.6-2.4.6h-1l-1 2h-2v-2H7c-1.1 0-2-.9-2-2v-2.5L3 12l1-2 1 1z" fill={color}/><circle cx="14" cy="10" r="0.9" fill={W.n800}/></svg>;
    case 'cash':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill={color}/><circle cx="12" cy="12" r="2.5" fill="none" stroke={W.n800} strokeWidth="1.4"/><circle cx="6" cy="12" r="0.8" fill={W.n800}/><circle cx="18" cy="12" r="0.8" fill={W.n800}/></svg>;
    case 'ewallet':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2.5" fill={color}/><rect x="9" y="17" width="6" height="1.6" rx="0.8" fill={W.n800} opacity="0.4"/><rect x="9" y="6" width="6" height="7" rx="1" fill={W.n800} opacity="0.2"/></svg>;
    case 'qr':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" fill={color}/><rect x="14" y="3" width="7" height="7" fill={color}/><rect x="3" y="14" width="7" height="7" fill={color}/><rect x="14" y="14" width="3" height="3" fill={color}/><rect x="18" y="18" width="3" height="3" fill={color}/></svg>;
    case 'salary':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7z" fill={color}/><path d="M9 7V5a3 3 0 016 0v2" stroke={W.n800} strokeWidth="1.4" fill="none"/></svg>;
    case 'shop':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 9l1.5-4h13L20 9v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" fill={color}/><rect x="5" y="13" width="14" height="7" fill={color} opacity="0.7"/></svg>;
    case 'piggy':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-3 3-5 7-5s7 2 7 5c0 1-.4 2-1 2.8L18 17h-2l-.5-1.5c-.8.3-1.6.5-2.5.5h-2l-.5 1.5H8.5L7 14c-.5-.4-.8-.7-1.2-1L4 13v-2l1.4.2C5.1 11 5 11.4 5 12z" fill={color}/><circle cx="14" cy="11" r="0.8" fill={W.n800}/></svg>;
    case 'wallet': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" fill={color}/><circle cx="17" cy="13" r="1.4" fill={W.n800}/></svg>;
    case 'chart': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="14" width="3" height="6" rx="1" fill={color}/><rect x="10" y="10" width="3" height="10" rx="1" fill={color}/><rect x="16" y="6" width="3" height="14" rx="1" fill={color}/></svg>;
    case 'calc': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" fill={color}/><rect x="7" y="5" width="10" height="4" rx="1" fill={W.n800} opacity="0.3"/><circle cx="9" cy="13" r="1" fill={W.n800}/><circle cx="12" cy="13" r="1" fill={W.n800}/><circle cx="15" cy="13" r="1" fill={W.n800}/><circle cx="9" cy="17" r="1" fill={W.n800}/><circle cx="12" cy="17" r="1" fill={W.n800}/><circle cx="15" cy="17" r="1" fill={W.n800}/></svg>;
    case 'home': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" fill={color}/></svg>;
    case 'gift': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="18" height="3" fill={color}/><rect x="5" y="12" width="14" height="9" fill={color} opacity="0.85"/><rect x="11" y="9" width="2" height="12" fill={W.n800} opacity="0.4"/></svg>;
    case 'plane': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M21 11l-9 4-2 5-2-3-3-2 5-2 4-9 7 7z" fill={color}/></svg>;
    case 'check': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'chev': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'trash': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>;
    default: return null;
  }
}

const COLORS = [
  { k: 'green',  c: W.walletGreen,  bg: W.walletGreen100 },
  { k: 'violet', c: W.walletViolet, bg: W.walletViolet100 },
  { k: 'pink',   c: W.walletPink,   bg: W.walletPink100 },
  { k: 'red',    c: W.walletRed,    bg: W.walletRed100 },
  { k: 'brown',  c: W.walletBrown,  bg: W.walletBrown100 },
  { k: 'teal',   c: W.primary400,   bg: W.primary100 },
];
const colorOf = (k) => COLORS.find(c => c.k === k) || COLORS[0];

const TYPES = [
  { k: 'savings', label: 'บัญชีออมทรัพย์', ic: 'piggy',   color: 'green'  },
  { k: 'cash',    label: 'เงินสด',          ic: 'cash',    color: 'brown'  },
  { k: 'ewallet', label: 'e-Wallet',        ic: 'ewallet', color: 'violet' },
  { k: 'qr',      label: 'พร้อมเพย์',        ic: 'qr',      color: 'teal'   },
  { k: 'salary',  label: 'บัญชีเงินเดือน',   ic: 'salary',  color: 'pink'   },
  { k: 'shop',    label: 'บัญชีขายของ',      ic: 'shop',    color: 'red'    },
  { k: 'custom',  label: 'กระเป๋าทั่วไป',     ic: 'wallet',  color: 'teal'   },
];
const typeOf = (k) => TYPES.find(t => t.k === k) || TYPES[0];

const GOAL_CHIPS = [
  { text: 'เก็บเงินไปเที่ยวญี่ปุ่น', ic: 'plane' },
  { text: 'ออมเงินซื้อบ้าน',        ic: 'home'  },
  { text: 'ติดตามรายจ่ายประจำวัน',   ic: 'calc'  },
  { text: 'เก็บฉุกเฉิน 6 เดือน',    ic: 'piggy' },
];

// ─── Header — ✕ close · centered title · "บันทึก" shortcut ───
function Header({ title, saveEnabled }) {
  return (
    <div style={{ background: INK.surface, paddingBottom: 4 }}>
      <div style={{ padding: '6px 12px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={W.n800} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: W.n900 }}>{title}</div>
        <div style={{
          minWidth: 36, padding: '0 6px', textAlign: 'right',
          fontSize: 15, fontWeight: 700,
          color: saveEnabled ? W.primary500 : INK.faint,
          cursor: saveEnabled ? 'pointer' : 'default',
        }}>บันทึก</div>
      </div>
    </div>
  );
}

// ─── Sticky preview bar — shared family look with A1/B1 ───
function PreviewBar({ name, type, color, icon, amount }) {
  const t = typeOf(type);
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 5, background: INK.surface, padding: '8px 16px 12px' }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14, boxShadow: cardShadow,
        outline: `1.5px solid ${color.bg}`,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, background: color.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <WIcon kind={icon} size={28} color={color.c} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15, fontWeight: 700, color: W.n900, letterSpacing: -0.1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name || 'ชื่อกระเป๋า'}
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: INK.muted, marginTop: 2 }}>{t.label}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <Eyebrow>ยอด</Eyebrow>
          <div style={{ fontSize: 16, fontWeight: 700, color: W.n900, marginTop: 2, letterSpacing: -0.3 }}>
            ฿{amount || '0'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Form row chrome.
function Row({ children, divider, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderTop: divider ? `1px solid ${INK.hairline}` : 'none',
      cursor: onClick ? 'pointer' : 'default',
    }}>{children}</div>
  );
}

// ─── Essentials — the only thing shown up front: type · name · icon&color · amount ───
function Essentials({ state, set }) {
  const { type, name, color, icon, amount } = state;
  const t = typeOf(type);
  const tcol = colorOf(t.color);
  return (
    <div style={{
      margin: '0 16px 12px', background: '#fff', borderRadius: 16,
      boxShadow: cardShadow, overflow: 'hidden',
    }}>
      {/* TYPE — dropdown-style row → opens type menu */}
      <Row onClick={() => {}}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: tcol.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <WIcon kind={t.ic} size={20} color={tcol.c} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Eyebrow>ประเภท</Eyebrow>
          <div style={{ fontSize: 14, fontWeight: 600, color: W.n900, marginTop: 1 }}>{t.label}</div>
        </div>
        <WIcon kind="chev" size={18} color={INK.faint} />
      </Row>

      {/* NAME */}
      <Row divider>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Eyebrow>ชื่อกระเป๋า</Eyebrow>
          <input value={name} onChange={e => set({ name: e.target.value })}
            placeholder="เช่น ออมทรัพย์ KBank"
            style={{
              width: '100%', border: 'none', outline: 'none',
              fontSize: 15, fontWeight: 600, color: W.n900,
              fontFamily: 'inherit', background: 'transparent', padding: 0, marginTop: 2,
            }} />
        </div>
      </Row>

      {/* ICON & COLOR — tappable → picker sheet */}
      <Row divider onClick={() => {}}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: color.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <WIcon kind={icon} size={20} color={color.c} />
        </div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: W.n900 }}>ไอคอน & สี</div>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: color.c }} />
        <WIcon kind="chev" size={16} color={INK.faint} />
      </Row>

      {/* AMOUNT */}
      <Row divider>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: INK.muted }}>ยอดเงิน</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 15, color: INK.faint, fontWeight: 600 }}>฿</span>
          <input value={amount} onChange={e => set({ amount: e.target.value })}
            placeholder="0"
            style={{
              border: 'none', outline: 'none', fontSize: 18, fontWeight: 700, color: W.n900,
              textAlign: 'right', width: `${Math.max((amount || '0').length, 1) + 0.5}ch`,
              fontFamily: 'inherit', background: 'transparent', letterSpacing: -0.5,
            }} />
        </div>
      </Row>
    </div>
  );
}

// ─── Advanced — collapsed by default; holds currency + AI goal ───
function Advanced({ open, onToggle, goal, set }) {
  const valid = goal.trim().length > 0;
  return (
    <div style={{
      margin: '0 16px 12px', background: '#fff', borderRadius: 16,
      boxShadow: cardShadow, overflow: 'hidden',
    }}>
      {/* toggle header */}
      <div onClick={onToggle} style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, letterSpacing: -0.1 }}>ตั้งค่าเพิ่มเติม</div>
            <div style={{
              padding: '2px 6px', borderRadius: 6, background: INK.surface,
              color: INK.muted, fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
            }}>ไม่บังคับ</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: INK.muted, marginTop: 2 }}>
            สกุลเงิน · เป้าหมาย AI
          </div>
        </div>
        <div style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'flex' }}>
          <WIcon kind="chev" size={18} color={INK.faint} />
        </div>
      </div>

      {open && (
        <div>
          {/* CURRENCY */}
          <Row divider onClick={() => {}}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: INK.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>🇹🇭</div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: W.n900 }}>สกุลเงิน</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: INK.muted }}>THB — บาทไทย</div>
            <WIcon kind="chev" size={16} color={INK.faint} />
          </Row>

          {/* AI GOAL */}
          <div style={{ borderTop: `1px solid ${INK.hairline}`, padding: '14px 16px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: `linear-gradient(135deg, ${W.walletViolet}, ${W.primary400})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 14, flexShrink: 0,
              }}>✦</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: W.n900, letterSpacing: -0.1 }}>เป้าหมายของกระเป๋า</div>
            </div>
            <div style={{
              margin: '10px 0 12px', padding: '12px 14px',
              background: INK.surface, borderRadius: 12,
              boxShadow: valid ? `inset 0 0 0 1.5px ${W.walletViolet}` : 'none',
              transition: 'box-shadow 0.15s',
            }}>
              <input value={goal} onChange={e => set({ goal: e.target.value })}
                placeholder="พิมพ์เป้าหมายของคุณ..."
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  fontSize: 14, fontWeight: 500, color: W.n900,
                  fontFamily: 'inherit', background: 'transparent', padding: 0,
                }} />
            </div>
          </div>

          <div style={{ padding: '0 16px 8px' }}><Eyebrow>ตัวอย่างยอดนิยม</Eyebrow></div>
          <div>
            {GOAL_CHIPS.map((ex, i) => {
              const sel = goal === ex.text;
              return (
                <div key={ex.text} onClick={() => set({ goal: ex.text })} style={{
                  padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
                  borderTop: `1px solid ${INK.hairline}`,
                  cursor: 'pointer',
                  background: sel ? W.walletViolet100 : 'transparent',
                  transition: 'background 0.15s',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: sel ? W.walletViolet : INK.surface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'background 0.15s',
                  }}>
                    <WIcon kind={ex.ic} size={16} color={sel ? '#fff' : W.n700} />
                  </div>
                  <div style={{
                    flex: 1, minWidth: 0, fontSize: 13,
                    fontWeight: sel ? 700 : 500,
                    color: sel ? W.n900 : W.n800,
                  }}>{ex.text}</div>
                  {sel && (
                    <div style={{
                      width: 20, height: 20, borderRadius: 10, background: W.walletViolet,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <WIcon kind="check" size={12} color="#fff" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Delete row — edit mode only ───
function DeleteRow() {
  return (
    <div style={{
      margin: '4px 16px 0', padding: '14px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer',
    }}>
      <WIcon kind="trash" size={18} color={W.walletRed} />
      <div style={{ fontSize: 14, fontWeight: 700, color: W.walletRed }}>ลบกระเป๋านี้</div>
    </div>
  );
}

// ─── Sticky bottom CTA ───
function StickyCta({ label, disabled }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 34, padding: '12px 16px 0',
      background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
    }}>
      <button disabled={disabled} style={{
        width: '100%', height: 50, borderRadius: 14, border: 'none',
        background: disabled ? W.n300 : W.primary400,
        color: disabled ? INK.faint : '#fff',
        fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 4px 14px rgba(56,178,172,0.32)',
        transition: 'all 0.15s',
      }}>{label}</button>
    </div>
  );
}

// ─── Page — one component, two modes ───
function CreateWalletC1({ mode = 'create' }) {
  const isEdit = mode === 'edit';
  const seed = isEdit
    ? { name: 'KBank ออมทรัพย์', type: 'savings', colorKey: 'green', icon: 'piggy', amount: '15,000', goal: 'เก็บฉุกเฉิน 6 เดือน' }
    : { name: '', type: 'savings', colorKey: 'green', icon: 'piggy', amount: '', goal: '' };

  const [state, setState] = React.useState(seed);
  // advanced starts expanded only when editing (data already exists there)
  const [openAdvanced, setOpenAdvanced] = React.useState(isEdit);
  const set = (patch) => setState(s => ({ ...s, ...patch }));
  const color = colorOf(state.colorKey);

  const canSave = state.name.trim().length > 0;

  return (
    <div style={{ background: INK.surface, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="12:03" />
      <Header title={isEdit ? 'แก้ไขกระเป๋า' : 'สร้างกระเป๋าใหม่'} saveEnabled={canSave} />
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
        <PreviewBar name={state.name} type={state.type} color={color} icon={state.icon} amount={state.amount} />
        <Essentials state={{ ...state, color }} set={set} />
        <Advanced open={openAdvanced} onToggle={() => setOpenAdvanced(o => !o)} goal={state.goal} set={set} />
        {isEdit && <DeleteRow />}
      </div>
      <StickyCta label={isEdit ? 'บันทึกการแก้ไข' : 'สร้างกระเป๋า'} disabled={!canSave} />
    </div>
  );
}

window.CreateWalletC1_Create = () => <CreateWalletC1 mode="create" />;
window.CreateWalletC1_Edit   = () => <CreateWalletC1 mode="edit" />;
})();
