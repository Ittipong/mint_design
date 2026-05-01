// Shared primitives for Mint Money screens
const M = window.MINT;

// ─── Status bar (real iOS style) ──────────────────────────
function MintStatusBar({ time = '21:29' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 30px 10px', position: 'relative', zIndex: 20,
      fontFamily: '-apple-system, "SF Pro Text", system-ui',
    }}>
      <span style={{ fontSize: 17, fontWeight: 600, color: '#000', letterSpacing: -0.3 }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {/* dotted ... cellular */}
        <svg width="20" height="10" viewBox="0 0 20 10">
          {[0,1,2,3,4].map(i => (
            <circle key={i} cx={2 + i*4} cy="5" r="1.4" fill="#000" opacity="0.35" />
          ))}
        </svg>
        {/* wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="#000"/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="#000"/>
          <circle cx="8.5" cy="10.5" r="1.5" fill="#000"/>
        </svg>
        {/* battery */}
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#000" strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill="#000"/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="#000" fillOpacity="0.4"/>
        </svg>
      </div>
      {/* DEBUG ribbon */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 90, height: 90,
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: 14, right: -24, transform: 'rotate(45deg)',
          background: '#D33',
          color: '#fff', fontSize: 10, fontWeight: 800,
          padding: '2px 30px', letterSpacing: 1,
          fontFamily: '-apple-system, system-ui',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}>DEBUG</div>
      </div>
    </div>
  );
}

// ─── Dynamic island ───────────────────────────────────────
function DynamicIsland() {
  return (
    <div style={{
      position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
      width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
    }} />
  );
}

// ─── Home indicator ───────────────────────────────────────
function HomeIndicator() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
      height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      paddingBottom: 8, pointerEvents: 'none',
    }}>
      <div style={{
        width: 139, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

// ─── Phone shell ──────────────────────────────────────────
function PhoneFrame({ children, bg = M.n200 }) {
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 48, overflow: 'hidden',
      position: 'relative', background: bg,
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: 'Sarabun, -apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <DynamicIsland />
      {children}
      <HomeIndicator />
    </div>
  );
}

// ─── FAB (teal add button) ────────────────────────────────
function MintFab({ bottom = 100, right = 20 }) {
  return (
    <button style={{
      position: 'absolute', bottom, right, zIndex: 40,
      width: 56, height: 56, borderRadius: 28, border: 'none',
      background: M.primary400,
      boxShadow: '0 6px 16px rgba(56,178,172,0.45), 0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// ─── Bottom nav bar ───────────────────────────────────────
function BottomNav({ active = 'home' }) {
  const items = [
    { key: 'home', label: 'Home', icon: HomeIcon },
    { key: 'finance', label: 'Finance', icon: FinanceIcon },
    { key: 'transaction', label: 'Transaction', icon: TransactionIcon },
    { key: 'report', label: 'Report', icon: ReportIcon },
    { key: 'more', label: 'More', icon: MoreIcon },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderTop: `0.5px solid ${M.n300}`,
      paddingTop: 8, paddingBottom: 28,
      display: 'flex',
    }}>
      {items.map(item => {
        const isActive = item.key === active;
        const Icon = item.icon;
        return (
          <div key={item.key} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, position: 'relative',
          }}>
            {isActive && item.key === 'home' && (
              <div style={{
                position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                width: 36, height: 36, borderRadius: 10,
                background: M.primary100, opacity: 0.45,
              }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Icon active={isActive} />
            </div>
            <div style={{
              fontSize: 10, fontWeight: isActive ? 600 : 400,
              color: isActive ? M.primary500 : M.n400,
              letterSpacing: 0.2,
            }}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Nav icons (outlined when inactive, filled teal when active) ──
function HomeIcon({ active }) {
  const c = active ? M.primary500 : M.n400;
  const fill = active ? M.primary200 : 'none';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.5z"
        stroke={c} strokeWidth="1.6" fill={fill} strokeLinejoin="round"/>
    </svg>
  );
}
function FinanceIcon({ active }) {
  const c = active ? M.primary500 : M.n400;
  const fill = active ? M.primary200 : 'none';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke={c} strokeWidth="1.6" fill={fill}/>
      <path d="M12 9v7M9.5 11.5h5M9.5 14h5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function TransactionIcon({ active }) {
  const c = active ? M.primary500 : M.n400;
  const fill = active ? M.primary200 : 'none';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l5 5v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke={c} strokeWidth="1.6" fill={fill} strokeLinejoin="round"/>
      <path d="M14 3v5h5" stroke={c} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
      <path d="M9 13h7M9 16h5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function ReportIcon({ active }) {
  const c = active ? M.primary500 : M.n400;
  const fill = active ? M.primary200 : 'none';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3a9 9 0 109 9h-9V3z" stroke={c} strokeWidth="1.6" fill={fill} strokeLinejoin="round"/>
      <path d="M14 3a7 7 0 017 7h-7V3z" stroke={c} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}
function MoreIcon({ active }) {
  const c = active ? M.primary500 : M.n400;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {[[6,6],[12,6],[18,6],[6,12],[12,12],[18,12],[6,18],[12,18],[18,18]].map(([x,y],i) => (
        <rect key={i} x={x-2.5} y={y-2.5} width="5" height="5" rx="1" stroke={c} strokeWidth="1.5" fill="none"/>
      ))}
    </svg>
  );
}

// ─── Piggy avatar (ครอบครัว) ──────────────────────────────
function PiggyAvatar({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size/2,
      background: M.walletPink100, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.6,
    }}>🐷</div>
  );
}

Object.assign(window, {
  MintStatusBar, DynamicIsland, HomeIndicator, PhoneFrame,
  MintFab, BottomNav, PiggyAvatar,
  HomeIcon, FinanceIcon, TransactionIcon, ReportIcon, MoreIcon,
});
