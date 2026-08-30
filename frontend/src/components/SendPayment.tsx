import { useState } from 'react'
import { RecipientInput } from './RecipientInput'

type SendPaymentProps = {
  disabled: boolean
  pending: boolean
  onSend: (destination: string, amountXlm: string) => void
}

export function SendPayment({ disabled, pending, onSend }: SendPaymentProps) {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')

  const numericAmount = Number(amount)
  const canSend = address.length > 0 && numericAmount > 0 && !disabled

  const handleSubmit = () => {
    if (!canSend) return
    onSend(address, amount)
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Send money</h2>
      <p className="muted" style={{ marginTop: 0, fontSize: '0.85rem' }}>
        Send straight to family or a friend — no split needed.
      </p>

      <div className="recipient-row" style={{ alignItems: 'flex-start' }}>
        <RecipientInput address={address} onAddressChange={setAddress} />
        <input
          className="amount-input"
          type="number"
          min="0"
          step="0.0000001"
          placeholder="XLM"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button
        className="btn-primary"
        style={{ marginTop: 8 }}
        disabled={!canSend || pending}
        onClick={handleSubmit}
      >
        {pending ? 'Sending…' : 'Send'}
      </button>

      {disabled && <p className="muted">Connect your wallet to send.</p>}
    </div>
  )
}
