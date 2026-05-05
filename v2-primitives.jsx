// v2 primitives — refined status bar (no DEBUG), new nav labels, custom icons
const M2 = window.MINT;

// Status bar V2 — no DEBUG ribbon
function MintStatusBarV2({ time = '21:29' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 30px 10px', position: 'relative', zIndex: 20,
      fontFamily: '-apple-system, "SF Pro Text", system-ui',
    }}>
      <span style={{ fontSize: 17, fontWeight: 600, color: '#000', letterSpacing: -0.3 }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="20" height="10" viewBox="0 0 20 10">
          {[0,1,2,3,4].map(i => <circle key={i} cx={2 + i*4} cy="5" r="1.4" fill="#000"/>)}
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="#000"/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="#000"/>
          <circle cx="8.5" cy="10.5" r="1.5" fill="#000"/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#000" strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill="#000"/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="#000" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// Asset-backed PNG icons (under assets/cetegory_icons/) — render at 2x/3x for retina
const CAT_ICON_ASSETS = {
  food: 'food', transport: 'bus', shopping: 'shopping', cart: 'shopping',
  piggy: 'piggy', card: 'credit', wallet: 'wallet',
  coffee: 'coffee', movie: 'movie', bill: 'bill',
  gas: 'gas', game: 'game', home: 'house', plane: 'travel',
  budget: 'chart',
};

// Custom category icons — PNG asset for size >= 16; SVG below that (raster smear at small sizes)
function CatIcon({ kind, containerSize, color = '#fff' }) {
  const iconSize = containerSize ? containerSize / 1.7 : 20;
  const s = { width: iconSize, height: iconSize, display: 'block' };
  const assetName = CAT_ICON_ASSETS[kind];
  if (assetName && iconSize >= 16) {
    return (
      <img
        src={`assets/cetegory_icons/${assetName}.png`}
        srcSet={`assets/cetegory_icons/2.0x/${assetName}.png 2x, assets/cetegory_icons/3.0x/${assetName}.png 3x`}
        alt=""
        style={{ ...s, objectFit: 'contain' }}
      />
    );
  }
  switch (kind) {
    case 'coffee':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M4 9h12v6a4 4 0 01-4 4H8a4 4 0 01-4-4V9z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M16 11h2a3 3 0 010 6h-2" stroke={color} strokeWidth="1.8"/>
        <path d="M7 5c1 0 1 1 0 2M11 5c1 0 1 1 0 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>;
    case 'movie':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.8"/>
        <path d="M3 9h18M8 5v14M16 5v14" stroke={color} strokeWidth="1.5"/>
      </svg>;
    case 'bill':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M5 3h11l3 3v15H5V3z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 10h6M9 13h6M9 16h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>;
    case 'cart':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M3 4h2l2 11h11l2-8H7" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
        <circle cx="9" cy="19" r="1.5" stroke={color} strokeWidth="1.5"/>
        <circle cx="17" cy="19" r="1.5" stroke={color} strokeWidth="1.5"/>
      </svg>;
    case 'gas':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M5 20V5a2 2 0 012-2h5a2 2 0 012 2v15M5 12h9" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M14 8l3 2v7a2 2 0 002 2h0a2 2 0 002-2V9l-3-3" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>;
    case 'game':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="11" rx="4" stroke={color} strokeWidth="1.8"/>
        <circle cx="16" cy="12" r="1.2" fill={color}/>
        <circle cx="18.5" cy="14" r="1.2" fill={color}/>
        <path d="M6.5 11v3M5 12.5h3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>;
    case 'plane':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M20 14l-7-1V4.5a1.5 1.5 0 00-3 0V13L3 14v2l7-1 1 5-2 1v1l3-1 3 1v-1l-2-1 1-5 7 1v-2z" fill={color}/>
      </svg>;
    case 'home':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>;
    case 'piggy':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M4 13c0-4 3-6 7-6s7 2 7 6v3h-1l-1 3h-2l-.5-2h-5L8 19H6l-1-3H4v-3z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="15" cy="12" r=".8" fill={color}/>
      </svg>;
    case 'card':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8"/>
        <path d="M2 10h20M6 16h4" stroke={color} strokeWidth="1.8"/>
      </svg>;
    case 'wallet':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M3 7a2 2 0 012-2h13a2 2 0 012 2v2h-2a3 3 0 000 6h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>;
    case 'japan':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M12 3l3 6 6 1-4.5 4 1 6L12 17l-5.5 3 1-6L3 10l6-1z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>;
    case 'budget':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
        <path d="M12 3v9l6 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>;
    // Below: simplified SVG glyphs for kinds whose detailed PNG would smear at small sizes (<16)
    case 'food':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M5 11h14a7 7 0 01-14 0z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M3 20h18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9 7V4M12 7V3M15 7V4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>;
    case 'transport':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <rect x="5" y="4" width="14" height="14" rx="3" stroke={color} strokeWidth="1.8"/>
        <path d="M5 13h14" stroke={color} strokeWidth="1.6"/>
        <circle cx="9" cy="16" r="1.1" fill={color}/>
        <circle cx="15" cy="16" r="1.1" fill={color}/>
        <path d="M8 21l-1 1M16 21l1 1" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>;
    case 'shopping':
      return <svg style={s} viewBox="0 0 24 24" fill="none">
        <path d="M5 8h14l-1 12H6L5 8z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 8V6a3 3 0 016 0v2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>;
    default:
      // No SVG glyph defined: fall back to PNG even at small size (better than blank)
      if (assetName) {
        return (
          <img
            src={`assets/cetegory_icons/${assetName}.png`}
            srcSet={`assets/cetegory_icons/2.0x/${assetName}.png 2x, assets/cetegory_icons/3.0x/${assetName}.png 3x`}
            alt=""
            style={{ ...s, objectFit: 'contain' }}
          />
        );
      }
      return null;
  }
}

// Home indicator (same)
function HomeIndicatorV2() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
      height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      paddingBottom: 8, pointerEvents: 'none',
    }}>
      <div style={{ width: 139, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.3)' }} />
    </div>
  );
}

function DynamicIslandV2() {
  return (
    <div style={{
      position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
      width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
    }} />
  );
}

function PhoneFrameV2({ children, bg = M2.n200 }) {
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 48, overflow: 'hidden',
      position: 'relative', background: bg,
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: 'Sarabun, -apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <DynamicIslandV2 />
      {children}
      <HomeIndicatorV2 />
    </div>
  );
}

// FAB
function MintFabV2({ bottom = 100, right = 20 }) {
  return (
    <button style={{
      position: 'absolute', bottom, right, zIndex: 40,
      width: 56, height: 56, borderRadius: 28, border: 'none',
      background: M2.primary400,
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

// Bottom nav V2 — renamed: Home / Wallets / Activity / Insights / More
function BottomNavV2({ active = 'home' }) {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'wallets', label: 'Wallets' },
    { key: 'activity', label: 'Activity' },
    { key: 'insights', label: 'Insights' },
    { key: 'more', label: 'More' },
  ];
  const icon = (key, isActive) => {
    const c = isActive ? M2.primary500 : M2.n400;
    const f = isActive ? M2.primary100 : 'none';
    const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none' };
    switch (key) {
      case 'home':
        return <svg {...common}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" stroke={c} strokeWidth="1.8" fill={f} strokeLinejoin="round"/></svg>;
      case 'wallets':
        return <svg {...common}><path d="M3 7a2 2 0 012-2h13a2 2 0 012 2v2h-2a3 3 0 000 6h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke={c} strokeWidth="1.8" fill={f} strokeLinejoin="round"/></svg>;
      case 'activity':
        return <svg {...common}><path d="M3 12h4l2-6 4 12 2-6h6" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
      case 'insights':
        return <svg {...common}><path d="M4 19V9M10 19V4M16 19v-7M22 19H2" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>;
      case 'more':
        return <svg {...common}><circle cx="6" cy="12" r="1.6" fill={c}/><circle cx="12" cy="12" r="1.6" fill={c}/><circle cx="18" cy="12" r="1.6" fill={c}/></svg>;
    }
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderTop: `0.5px solid ${M2.n300}`,
      paddingTop: 10, paddingBottom: 28,
      display: 'flex',
    }}>
      {items.map(item => {
        const isActive = item.key === active;
        return (
          <div key={item.key} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, position: 'relative',
          }}>
            <div>{icon(item.key, isActive)}</div>
            <div style={{
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              color: isActive ? M2.primary500 : M2.n400,
              letterSpacing: 0.2,
            }}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  MintStatusBarV2, DynamicIslandV2, HomeIndicatorV2, PhoneFrameV2,
  MintFabV2, BottomNavV2, CatIcon,
});
