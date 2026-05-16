// Add Custom Icon — bottom sheet เปิดจากปุ่ม "+" ใน Library Manager
//   แทน design เก่าที่ใช้ 3 tabs (Image / Emoji / Standard) — แตก mental model
//
// New mental model: "ฉันมีไอคอนใหม่ จะเพิ่มจากที่ไหนก็ได้"
//   → scroll continuous (ไม่มี tabs) — ดูตัวเลือกพร้อมกัน
//   → live preview ด้านบน — กดอะไรเห็นทันที
//   → 3 sections เรียงตามความถี่ใช้: Emoji (fast) → รูป (custom) → คลังมาตรฐาน (browse)
//
// Match CI ของ v4-icon-library-manager.jsx:
//   bg n200 · white card 14r · primary400 CTA · plus chip 32x32 primary100
//   ไม่ใช้ pill segmented tabs (CI ของ library manager คือ scroll continuous)
(function () {
const W = window.MINT;

const card = {
  background: '#fff', borderRadius: 14,
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
};

function I({ kind, size = 20, color = W.n800 }) {
  const s = { width: size, height: size };
  switch (kind) {
    case 'close': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case 'dots': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.6" fill={color}/><circle cx="12" cy="12" r="1.6" fill={color}/><circle cx="19" cy="12" r="1.6" fill={color}/></svg>;
    case 'chev': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'photo': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={color} strokeWidth="1.8"/><circle cx="9" cy="11" r="2" stroke={color} strokeWidth="1.8"/><path d="M3 17l5-5 4 4 3-3 6 6" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/></svg>;
    case 'cam': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 8h3l2-2h6l2 2h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke={color} strokeWidth="1.8"/><circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="1.8"/></svg>;
    case 'smile': return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/><circle cx="9" cy="10" r="1.2" fill={color}/><circle cx="15" cy="10" r="1.2" fill={color}/><path d="M8 14c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case 'grid': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8"/><rect x="13" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8"/><rect x="4" y="13" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8"/><rect x="13" y="13" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8"/></svg>;
    case 'plus': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round"/></svg>;
    case 'sparkle': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill={color}/></svg>;
    default: return null;
  }
}

// Quick-pick emoji samples — finance-related defaults (เปลี่ยนได้จาก settings ทีหลัง)
const EMOJI_SAMPLES = ['😀', '🍔', '🏠', '💵', '❤️', '🚗', '☕️', '🎁', '✈️', '🍜'];

// 6 icons แสดง preview ของคลังมาตรฐาน (placeholder svg — ของจริง pull จาก pack)
const STD_PREVIEW = ['food', 'shop', 'cup', 'gift', 'card', 'plane'];

// ────────────────────────────────────────────────
// Sheet header — drag handle + title + close + more
// (match v4-credit-card-detail.jsx SheetHeader 1:1)
// ────────────────────────────────────────────────
function SheetHeader({ title }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: W.n300 }} />
      </div>
      <div style={{ padding: '6px 18px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <I kind="close" size={20} color={W.n800} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: W.n900 }}>{title}</div>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <I kind="dots" size={20} color={W.n800} />
        </div>
      </div>
      <div style={{ height: 1, background: W.n300 }} />
    </>);
}

// ────────────────────────────────────────────────
// Live preview — 80x80 rounded square
// แสดง emoji/รูป/icon ที่ user เพิ่งเลือก หรือ dashed placeholder ตอนยังไม่มี
// ทำให้รู้สึก "ทุก action ที่ทำด้านล่าง สะท้อนที่นี่ทันที"
// ────────────────────────────────────────────────
function LivePreview({ selected }) {
  const empty = !selected;
  return (
    <div style={{ padding: '20px 16px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: empty ? 'transparent' : W.primary100,
        border: empty ? `1.5px dashed ${W.n400}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 40,
      }}>
        {empty ? <I kind="sparkle" size={28} color={W.n400} /> : selected.value}
      </div>
      <div style={{ fontSize: 12, color: '#6B6B78' }}>
        {empty ? 'เลือกไอคอนจากด้านล่าง' : `จาก ${selected.source}`}
      </div>
    </div>);
}

// ────────────────────────────────────────────────
// Section header — ใช้ซ้ำทั้ง 3 sections
// ────────────────────────────────────────────────
function SectionHead({ icon, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <I kind={icon} size={16} color={W.n800} />
        <div style={{ fontSize: 14, fontWeight: 700, color: W.n900 }}>{title}</div>
      </div>
      {action}
    </div>);
}

// ────────────────────────────────────────────────
// Section: Emoji
// Inline text input + ปุ่ม "เลือก" (เปิด native emoji keyboard)
// แถว quick samples ด้านล่าง — กดได้ทันที, ไม่ต้องพิมพ์
// ────────────────────────────────────────────────
function EmojiSection({ onPick, picked }) {
  return (
    <div style={{ padding: '0 16px', marginTop: 18 }}>
      <SectionHead icon="smile" title="Emoji" />
      <div style={{ ...card, padding: '12px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{
            flex: 1, height: 40, borderRadius: 10, background: W.n200,
            display: 'flex', alignItems: 'center', padding: '0 12px',
            fontSize: 18, color: W.n400,
          }}>
            {picked?.source === 'emoji' ? picked.value : 'พิมพ์หรือเลือก…'}
          </div>
          <button style={{
            padding: '0 16px', height: 40, borderRadius: 10,
            background: W.primary100, color: W.primary500,
            border: 'none', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
          }}>เลือก</button>
        </div>
        <div style={{ height: 1, background: W.n300, margin: '12px 0' }} />
        <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 8 }}>ใช้บ่อย</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {EMOJI_SAMPLES.map(e => {
            const isPicked = picked?.source === 'emoji' && picked.value === e;
            return (
              <div key={e} onClick={() => onPick({ source: 'emoji', value: e })} style={{
                width: 44, height: 44, borderRadius: 12,
                background: isPicked ? W.primary100 : W.n200,
                border: isPicked ? `1.5px solid ${W.primary400}` : '1.5px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, cursor: 'pointer',
              }}>{e}</div>);
          })}
        </div>
      </div>
    </div>);
}

// ────────────────────────────────────────────────
// Section: รูปภาพ
// 2 chip buttons แถวเดียว — ไม่มี big upload state, ไม่มี redundant CTA
// (design เก่า: big icon block + 2 cards + ปุ่ม "อัปโหลด" ล่าง = 3 ครั้ง CTA แสดงเรื่องเดียวกัน)
// ────────────────────────────────────────────────
function PhotoSection({ onPick, picked }) {
  const Chip = ({ icon, label, kind }) => {
    const isPicked = picked?.source === kind;
    return (
      <div onClick={() => onPick({ source: kind, value: '🖼' })} style={{
        flex: 1, ...card, padding: '14px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        cursor: 'pointer',
        border: isPicked ? `1.5px solid ${W.primary400}` : '1.5px solid transparent',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: W.primary100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I kind={icon} size={20} color={W.primary500} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: W.n900 }}>{label}</div>
      </div>);
  };
  return (
    <div style={{ padding: '0 16px', marginTop: 18 }}>
      <SectionHead icon="photo" title="รูปภาพ" />
      <div style={{ display: 'flex', gap: 8 }}>
        <Chip icon="cam" label="ถ่ายรูป" kind="camera" />
        <Chip icon="photo" label="เลือกจากแกลเลอรี่" kind="gallery" />
      </div>
    </div>);
}

// ────────────────────────────────────────────────
// Section: คลังมาตรฐาน
// แถวพรีวิว 6 ตัว + chevron → push ไป full-screen picker
// (design เก่ายัด grid 50+ icons ทั้ง section — ปนกับ "เพิ่ม custom")
// ────────────────────────────────────────────────
function StandardSection({ onPick, picked }) {
  return (
    <div style={{ padding: '0 16px', marginTop: 18 }}>
      <SectionHead
        icon="grid"
        title="คลังมาตรฐาน"
        action={
          <div style={{
            fontSize: 11, fontWeight: 600, color: W.primary500,
            display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
          }}>
            ดูทั้งหมด <I kind="chev" size={12} color={W.primary500} />
          </div>
        }
      />
      <div style={{ ...card, padding: '12px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {STD_PREVIEW.map(k => {
            const isPicked = picked?.source === 'standard' && picked.value === k;
            return (
              <div key={k} onClick={() => onPick({ source: 'standard', value: k })} style={{
                flex: 1, aspectRatio: '1 / 1', borderRadius: 12,
                background: isPicked ? W.primary100 : W.n200,
                border: isPicked ? `1.5px solid ${W.primary400}` : '1.5px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <StdIcon k={k} color={W.n800} />
              </div>);
          })}
        </div>
      </div>
    </div>);
}

// Small placeholder std-icon set (mono) — match standard-tab style
function StdIcon({ k, color }) {
  const s = { width: 22, height: 22 };
  switch (k) {
    case 'food': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M7 3v8M7 11c-2 0-3-1.5-3-4V3M11 3v8c0 1.5-1 2-2 2v8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M17 3c-2 0-3 2-3 5s1 4 3 4v9" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case 'shop': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 8l1-3h12l1 3M5 8h14v11H5V8z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 11v2M15 11v2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case 'cup': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 8h12v6a4 4 0 01-4 4H9a4 4 0 01-4-4V8z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/><path d="M17 10h2a2 2 0 010 4h-2" stroke={color} strokeWidth="1.8"/></svg>;
    case 'gift': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="9" width="16" height="3" stroke={color} strokeWidth="1.8"/><rect x="6" y="12" width="12" height="9" stroke={color} strokeWidth="1.8"/><path d="M12 9V5M9 9c0-2 1.5-3 3-3M15 9c0-2-1.5-3-3-3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case 'card': return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke={color} strokeWidth="1.8"/><path d="M3 10h18" stroke={color} strokeWidth="1.8"/></svg>;
    case 'plane': return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M21 11l-9 4-2 5-2-3-3-2 5-2 4-9 7 7z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}

// ────────────────────────────────────────────────
// Sticky bottom CTA — บันทึก (enabled เมื่อมี selection เท่านั้น)
// ปุ่มเก่า disabled ทุก state จนเห็นไม่ออกว่ากดได้ตอนไหน → state ต้องชัด
// ────────────────────────────────────────────────
function StickyCTA({ enabled }) {
  return (
    <div style={{
      padding: '12px 16px 18px',
      background: '#fff',
      borderTop: `1px solid ${W.n300}`,
    }}>
      <button style={{
        width: '100%', height: 50, borderRadius: 14,
        background: enabled ? W.primary400 : W.n300,
        color: enabled ? '#fff' : '#6B6B78',
        border: 'none', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
        cursor: enabled ? 'pointer' : 'not-allowed',
      }}>
        บันทึกเข้าคลังของฉัน
      </button>
    </div>);
}

// ────────────────────────────────────────────────
// Main — composes scrim + sheet
// ────────────────────────────────────────────────
function AddCustomIcon() {
  // demo state: pick emoji 🍔 by default to showcase preview
  const [picked, setPicked] = React.useState({ source: 'emoji', value: '🍔' });
  const sourceLabel = picked?.source === 'emoji' ? 'Emoji'
    : picked?.source === 'camera' ? 'กล้อง'
    : picked?.source === 'gallery' ? 'แกลเลอรี่'
    : picked?.source === 'standard' ? 'คลังมาตรฐาน'
    : '';
  const displayPicked = picked ? { ...picked, source: sourceLabel } : null;

  return (
    <div style={{ background: W.n200, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MintStatusBar time="14:00" />

      {/* Scrim — visualize ว่าเป็น bottom sheet ที่เปิดบนหน้า library */}
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
        zIndex: 0,
      }} />

      {/* Sheet container — ดันชิดล่าง, รัศมีมุมบน */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: '#fff', borderRadius: '20px 20px 0 0',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90%',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
        zIndex: 1,
      }}>
        <SheetHeader title="เพิ่มไอคอน" />

        {/* Scrollable body — background n200 ให้ section card ลอย */}
        <div style={{ flex: 1, overflow: 'auto', background: W.n200, paddingBottom: 16 }}>
          <LivePreview selected={displayPicked} />
          <EmojiSection picked={picked} onPick={setPicked} />
          <PhotoSection picked={picked} onPick={setPicked} />
          <StandardSection picked={picked} onPick={setPicked} />
        </div>

        <StickyCTA enabled={!!picked} />
      </div>
    </div>);
}

window.IconAddCustom = AddCustomIcon;
})();
