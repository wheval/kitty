import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useWallet } from './hooks/useWallet'
import { useReputation } from './hooks/useReputation'
import { WalletConnect } from './components/WalletConnect'
import { ReputationBadge } from './components/ReputationBadge'
import { HomePage } from './pages/HomePage'
import { SplitPage } from './pages/SplitPage'
import { LandingPage } from './pages/LandingPage'

function AppShell() {
  const wallet = useWallet()
  const reputation = useReputation(wallet.address)

  return (
    <div className="app">
      <header>
        <img src="/brand/kitty_logo_lockup_color.png" alt="Kitty" className="brand-logo" />
        <p className="tagline">Split a bill, settle it on-chain.</p>
      </header>

      <WalletConnect
        address={wallet.address}
        connecting={wallet.connecting}
        error={wallet.error}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
      />

      {wallet.address && (
        <div className="card" style={{ paddingTop: 14, paddingBottom: 14 }}>
          <ReputationBadge score={reputation.score} loading={reputation.loading} />
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage address={wallet.address} />} />
        <Route
          path="split/:id"
          element={<SplitPage address={wallet.address} onPaid={reputation.refresh} />}
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/*" element={<AppShell />} />
    </Routes>
  )
}

export default App
