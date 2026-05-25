// Root Pager — หน้า root ใหม่ของ app · pager 2 หน้า
//   Layout: status bar → compact segment (header) → content (swipeable)
//     - Page 1 "Chat":    MelonChatInit (embedded mode, ซ่อน "Melon Chat" header)
//     - Page 2 "Finance": HomeV3 (hideStatusBar=true, มี bottom tabbar ของตัวเอง)
//   Segment เป็นแบบ compact iOS-style (pill, centered, ~30px tall) ไม่มี title bar
//   เพื่อให้ได้พื้นที่ content เพิ่ม ~50px
//   Swipe ได้ทั้ง 2 ทิศ (gesture ของ PageView ในจริง — artboard เป็น static demo)
(function () {
const RP = window.MINT;

// ─── Bell icon — global header action (right side of segment row) ───
function HeaderBell() {
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a6 6 0 00-6 6v3l-2 3v1h16v-1l-2-3V9a6 6 0 00-6-6zM9 18a3 3 0 006 0"
              stroke={RP.n700} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
      <div style={{
        position:'absolute', top:-1, right:-1, width:7, height:7, borderRadius:4,
        background: RP.error400, border:'1.5px solid #fff',
      }}/>
    </div>
  );
}

// ─── Compact segmented control (iOS-style) ───────────────────────────
// Acts as the screen's only header (no title bar). flex:1 wrappers on
// both sides keep the pill optically centered regardless of how many
// icons sit in rightSlot (1 bell ↔ 3 page actions).
function CompactSegment({ active, leftSlot, rightSlot }) {
  const items = [
    { key: 'chat',    label: 'Chat' },
    { key: 'finance', label: 'Finance' },
  ];
  const right = rightSlot !== undefined ? rightSlot : <HeaderBell />;
  return (
    <div style={{
      padding: '8px 16px 12px',
      display: 'flex', alignItems: 'center',
      background: 'transparent',
    }}>
      {/* Left slot — page-specific actions (e.g. Transaction's 🔍); mirror keeps pill centered */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 14 }}>
        {leftSlot}
      </div>

      <div style={{
        display: 'inline-flex',
        background: 'rgba(118,118,128,0.12)',
        padding: 3,
        borderRadius: 9,
        flexShrink: 0,
      }}>
        {items.map(it => {
          const isActive = it.key === active;
          return (
            <div key={it.key} style={{
              padding: '5px 26px',
              borderRadius: 7,
              background: isActive ? '#fff' : 'transparent',
              boxShadow: isActive
                ? '0 3px 8px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.04)'
                : 'none',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#1A1A1A' : '#6B6B78',
              letterSpacing: -0.1,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}>{it.label}</div>
          );
        })}
      </div>

      {/* Right slot — bell by default, or page-specific actions (e.g. Transaction's 🔍 ⏱ ⋮) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14 }}>
        {right}
      </div>
    </div>
  );
}

// ─── Shell — status bar + segment + content ─────────────────────────
// headerBg = สีของ status bar + segment area (white = ให้ pill contrast ชัด)
// contentBg = สีของ content area (ตามแต่ละ tab — Chat=white, Finance=grey)
// 2 zones นี้ทำให้ segment อ่านเป็น "header" ไม่ใช่ floating control
function RootPagerShell({ active, headerBg = '#fff', contentBg = '#fff', leftSlot, rightSlot, children }) {
  return (
    <div style={{
      background: headerBg, height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'Sarabun, -apple-system, system-ui, sans-serif',
    }}>
      <MintStatusBarV2 time="10:13" />
      <CompactSegment active={active} leftSlot={leftSlot} rightSlot={rightSlot} />
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: contentBg }}>
        {children}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Page 1 — Chat tab active
// ────────────────────────────────────────────────────────────────────
function RootPagerChat() {
  return (
    <RootPagerShell active="chat" headerBg="#fff" contentBg="#fff">
      {/* MelonChatInit ใน embedded mode: ไม่มี status bar / "Melon Chat" header */}
      <MelonChatInit embedded />
    </RootPagerShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// Page 2 — Finance tab active (= Home v3 + tabbar)
// ────────────────────────────────────────────────────────────────────
function RootPagerFinance() {
  return (
    <RootPagerShell active="finance" headerBg="#fff" contentBg={RP.n200}>
      {/* HomeV3 ปิด status bar ของตัวเอง · bottom tabbar ของ HomeV3 ยังคงอยู่
          contentBg=grey จะถูก HomeV3 ทับด้วย bg ของตัวเองอยู่แล้ว — ใส่ไว้กัน flash */}
      <HomeV3 hideStatusBar />
    </RootPagerShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// Page 2 (sub) — Finance · กระเป๋า (bottom-tab = Wallets)
//   User เปิด Finance segment แล้วกดที่ bottom tab "Wallets" → FinanceScreen
// ────────────────────────────────────────────────────────────────────
// Right-side action for Wallets page — plain "+" icon (matches TxRightActions style)
function WalletsRightActions() {
  return (
    <div style={{ cursor: 'pointer', display: 'flex' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke={RP.n700} strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function RootPagerWallets() {
  return (
    <RootPagerShell active="finance" headerBg="#fff" contentBg={RP.n200}
      rightSlot={<WalletsRightActions />}>
      <FinanceScreen hideStatusBar />
    </RootPagerShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// Page 2 (sub) — Finance · Transaction (bottom-tab = Activity)
//   User เปิด Finance segment แล้วกดที่ bottom tab "Activity" → TransactionScreen
//   Bell ของ default shell ถูกแทนด้วยปุ่มของหน้า Transaction:
//     left  → 🔍 search (primary discovery action)
//     right → ⏱ upcoming, ⋮ more
//   วาง search ฝั่งซ้ายช่วยให้นิ้วโป้งขวาเข้าถึง ⋮ ได้ง่ายขึ้น และ
//   ให้ search ไม่ปนกับ overflow menu
// ────────────────────────────────────────────────────────────────────
function TxSearchAction() {
  return (
    <div style={{ cursor: 'pointer', display: 'flex' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={RP.n700} strokeWidth="1.8"/>
        <path d="M16 16l4 4" stroke={RP.n700} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function TxRightActions() {
  return (
    <>
      {/* upcoming/scheduled */}
      <div style={{ cursor: 'pointer', display: 'flex' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={RP.n700} strokeWidth="1.8"/>
          <path d="M12 7v5l3 2" stroke={RP.n700} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      {/* more */}
      <div style={{ cursor: 'pointer', display: 'flex' }}>
        <svg width="18" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="1.8" fill={RP.n700}/>
          <circle cx="12" cy="12" r="1.8" fill={RP.n700}/>
          <circle cx="12" cy="19" r="1.8" fill={RP.n700}/>
        </svg>
      </div>
    </>
  );
}

function RootPagerTransaction() {
  return (
    <RootPagerShell active="finance" headerBg="#fff" contentBg={RP.n200}
      leftSlot={<TxSearchAction />}
      rightSlot={<TxRightActions />}>
      <TransactionScreen hideStatusBar />
    </RootPagerShell>
  );
}

window.RootPagerChat = RootPagerChat;
window.RootPagerFinance = RootPagerFinance;
window.RootPagerWallets = RootPagerWallets;
window.RootPagerTransaction = RootPagerTransaction;
})();
