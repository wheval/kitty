import { Link } from 'react-router-dom'
import './LandingPage.css'

export function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-nav">
        <div className="landing-wrap landing-nav-inner">
          <img src="/brand/kitty_logo_lockup_color.png" alt="Kitty" style={{ height: 28 }} />
          <div className="landing-nav-links">
            <a href="#how">How it works</a>
            <a href="#roadmap">Roadmap</a>
            <Link to="/app" className="landing-btn landing-btn-primary">
              Launch app
            </Link>
          </div>
        </div>
      </div>

      <div className="landing-hero">
        <div className="landing-hero-blob-a" />
        <div className="landing-hero-blob-b" />
        <div className="landing-wrap landing-hero-grid">
          <div>
            <div style={{ marginBottom: 22 }}>
              <span className="landing-pill landing-pill-live">● Live on Stellar Testnet</span>
            </div>
            <h1 className="landing-h1">One pool for everything you split with friends.</h1>
            <p className="landing-sub">
              Bills, subscriptions, trips, recurring fees — paid back instantly on-chain,
              wherever everyone is, whatever wallet they use. No more "I'll Venmo you later."
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap' }}>
              <Link to="/app" className="landing-btn landing-btn-primary">
                Launch app →
              </Link>
              <a href="#how" className="landing-btn landing-btn-ghost">
                See how it works
              </a>
            </div>
            <div className="landing-feature-row">
              <span className="landing-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--violet)" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
                Settles instantly on-chain
              </span>
              <span className="landing-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--violet)" strokeWidth="2">
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <path d="M3 10h18" />
                </svg>
                Any Stellar wallet
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="landing-card landing-preview-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Dinner in Lisbon</span>
                <span className="landing-pill" style={{ background: 'color-mix(in oklch, var(--violet) 12%, white)', color: 'var(--violet-deep)' }}>
                  #204
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderTop: '1px solid var(--border)' }}>
                <span className="mono muted">GADD…BCZA</span>
                <span className="badge badge-paid">✓ paid</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderTop: '1px solid var(--border)' }}>
                <span className="mono muted">GB4U…RZEO</span>
                <span className="badge badge-pending">pending</span>
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>On-chain reputation</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--violet-deep)' }}>12 shares paid on time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="how" className="landing-wrap" style={{ padding: '30px 0 90px' }}>
        <h2 className="landing-section-title">Not another app that just tracks who owes what.</h2>
        <div className="landing-diff-grid">
          <div className="landing-card" style={{ padding: 28 }}>
            <div className="landing-diff-icon" style={{ background: 'color-mix(in oklch, var(--violet) 12%, white)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--violet-deep)" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>It actually settles</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
              Splitwise tracks an IOU — you still have to pay separately. Kitty moves real money
              the moment someone pays their share.
            </p>
          </div>

          <div className="landing-card" style={{ padding: 28 }}>
            <div className="landing-diff-icon" style={{ background: 'color-mix(in oklch, var(--pink) 12%, white)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="2">
                <path d="M12 2 3 7v6c0 5 4 9 9 9s9-4 9-9V7l-9-5Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>On-chain reputation</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
              Every on-time payment is recorded by a second smart contract — a public,
              unfakeable record of who's reliable. No other split app has this.
            </p>
          </div>

          <div className="landing-card" style={{ padding: 28 }}>
            <div className="landing-diff-icon" style={{ background: 'color-mix(in oklch, var(--violet) 12%, white)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--violet-deep)" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M2 9h20" />
              </svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>Wallet-agnostic</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
              Freighter, xBull, Albedo, Lobstr, Rabet, Hana — pay from whatever Stellar wallet
              you already use.
            </p>
          </div>
        </div>
      </div>

      <div id="roadmap" className="landing-roadmap">
        <div className="landing-wrap">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 className="landing-section-title" style={{ color: 'white' }}>
              Built in the open, on Stellar testnet
            </h2>
            <p style={{ color: '#B9B4E0', fontSize: 15, margin: '12px 0 0' }}>
              Here's exactly what works today, and what's next.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
            <div>
              <div className="landing-pill landing-pill-live" style={{ marginBottom: 18 }}>
                ● Available now
              </div>
              <ul className="landing-roadmap-list">
                {[
                  'Split a bill, settle instantly on-chain',
                  'Multi-wallet support (6 Stellar wallets)',
                  'On-chain payment reputation',
                  'Real-time status via on-chain events',
                  'Save contacts, split to a name',
                ].map((t) => (
                  <li className="landing-roadmap-item" key={t} style={{ color: 'white' }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5EE6A3" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="landing-pill" style={{ marginBottom: 18, background: 'rgba(255,255,255,0.08)', color: '#B9B4E0' }}>
                ○ Coming next
              </div>
              <ul className="landing-roadmap-list">
                {[
                  'Cross-border stablecoin settlement',
                  'Group savings pools for subscriptions & recurring fees',
                  'Pay straight to a TikTok, IG, or X handle',
                  'Mainnet launch',
                ].map((t) => (
                  <li className="landing-roadmap-item" key={t} style={{ color: '#B9B4E0' }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#8A84C4" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-wrap" style={{ padding: '88px 0', textAlign: 'center' }}>
        <h2 className="landing-section-title" style={{ maxWidth: 540 }}>
          Front the bill once. Never chase anyone again.
        </h2>
        <Link to="/app" className="landing-btn landing-btn-primary" style={{ marginTop: 28 }}>
          Launch app →
        </Link>
      </div>

      <div className="landing-footer">
        <div className="landing-wrap landing-footer-inner">
          <img src="/brand/kitty_logo_mark_navy.png" alt="Kitty" style={{ height: 20, opacity: 0.6 }} />
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            Built on Stellar · Soroban smart contracts · Testnet
          </span>
        </div>
      </div>
    </div>
  )
}
