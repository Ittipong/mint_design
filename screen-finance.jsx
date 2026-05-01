// Finance screen — wallets/cards/goals/budget tabs
const MF = window.MINT;

function FinanceHeader() {
  return (
    <div>
      <MintStatusBar time="21:37" />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 16px 12px',
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: MF.n900 }}>การเงิน</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke={MF.primary500} strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={MF.n700} strokeWidth="1.8"/>
            <path d="M12 7v5l3 2" stroke={MF.n700} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <svg width="18" height="22" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.8" fill={MF.n700}/>
            <circle cx="12" cy="12" r="1.8" fill={MF.n700}/>
            <circle cx="12" cy="19" r="1.8" fill={MF.n700}/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function FinanceTabs({ active = 'กระเป๋า' }) {
  const tabs = ['กระเป๋า', 'บัตรเครดิต', 'เป้าหมาย', 'งบประมาณ'];
  return (
    <div style={{
      margin: '0 16px', padding: 4,
      background: MF.n200, borderRadius: 12,
      display: 'flex', gap: 2,
    }}>
      {tabs.map(t => {
        const isActive = t === active;
        return (
          <div key={t} style={{
            flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 10,
            fontSize: 13, fontWeight: isActive ? 700 : 500,
            color: isActive ? MF.n900 : MF.n400,
            background: isActive ? '#fff' : 'transparent',
            boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
          }}>{t}</div>
        );
      })}
    </div>
  );
}

function TotalCard() {
  return (
    <div style={{
      margin: '14px 16px 0',
      background: '#fff', borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: MF.n400, marginBottom: 4 }}>ยอดเงินรวม</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: MF.error400, letterSpacing: -0.5 }}>
            - 354,786.76 ฿
          </div>
        </div>
        <div style={{ fontSize: 12, color: MF.n400, marginTop: 4 }}>3 กระเป๋า</div>
      </div>
      <div style={{
        marginTop: 12, height: 6, borderRadius: 3,
        background: MF.n300, overflow: 'hidden', display: 'flex',
      }}>
        <div style={{ width: '17%', background: MF.primary400 }} />
        <div style={{ flex: 1, background: MF.error300 }} />
      </div>
      <div style={{
        marginTop: 8, display: 'flex', justifyContent: 'space-between',
        fontSize: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: MF.primary400 }} />
          <span style={{ fontWeight: 600, color: MF.n700 }}>68,696.32 ฿</span>
        </div>
        <div style={{ color: MF.n400 }}>เดือนนี้</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: MF.error400 }} />
          <span style={{ fontWeight: 600, color: MF.n700 }}>335,043.12 ฿</span>
        </div>
      </div>
    </div>
  );
}

function WalletRow({ icon, bg, name, type, amount, amountColor }) {
  return (
    <div style={{
      margin: '10px 16px 0',
      background: '#fff', borderRadius: 16, padding: '12px 16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 20, background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: MF.n900 }}>{name}</div>
        <div style={{ fontSize: 11, color: MF.n400, marginTop: 1 }}>{type}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: amountColor || MF.primary500 }}>{amount}</div>
        <div style={{ fontSize: 11, color: MF.n400, marginTop: 1 }}>ยอดคงเหลือ</div>
      </div>
    </div>
  );
}

function FinanceScreen() {
  return (
    <div style={{
      background: MF.n200, height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 84, paddingTop: 2 }}>
        <FinanceHeader />
        <FinanceTabs />
        <TotalCard />

        <div style={{
          margin: '20px 16px 6px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: MF.n900 }}>บัญชีทั่วไป</span>
          <span style={{
            background: MF.n300, color: MF.n600,
            fontSize: 11, fontWeight: 600,
            padding: '1px 8px', borderRadius: 10,
          }}>3</span>
        </div>

        <WalletRow icon="🐷" bg={MF.walletPink100} name="ครอบครัว" type="บัญชีออมทรัพย์" amount="2,531.23 ฿" />
        <WalletRow icon="💼" bg={MF.walletGreen100} name="TrueMonney" type="e-Wallet" amount="- 101,129.31 ฿" amountColor={MF.error400} />
        <WalletRow icon="👛" bg={MF.walletBrown100} name="Home" type="เงินสด" amount="- 6,789.00 €" amountColor={MF.error400} />

        <div style={{
          margin: '14px 16px 0', padding: '14px 16px',
          border: `1.5px dashed ${MF.n300}`, borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: MF.primary500, fontSize: 14, fontWeight: 600,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke={MF.primary500} strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          สร้างกระเป๋าใหม่
        </div>
      </div>

      <MintFab bottom={100} right={20} />
      <BottomNav active="finance" />
    </div>
  );
}

window.FinanceScreen = FinanceScreen;
