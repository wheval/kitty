import { useState } from 'react'
import { RecipientInput } from './RecipientInput'

type Recipient = { address: string; amount: string }

type CreateSplitProps = {
  disabled: boolean
  pending: boolean
  onCreate: (recipients: string[], amounts: bigint[]) => void
}

function toStroops(xlm: string): bigint | null {
  const num = Number(xlm)
  if (!num || num <= 0) return null
  return BigInt(Math.round(num * 10_000_000))
}

export function CreateSplit({ disabled, pending, onCreate }: CreateSplitProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: '', amount: '' },
    { address: '', amount: '' },
  ])

  const updateAddress = (index: number, address: string) => {
    setRecipients((prev) => prev.map((r, i) => (i === index ? { ...r, address } : r)))
  }

  const updateAmount = (index: number, amount: string) => {
    setRecipients((prev) => prev.map((r, i) => (i === index ? { ...r, amount } : r)))
  }

  const addRecipient = () => setRecipients((prev) => [...prev, { address: '', amount: '' }])
  const removeRecipient = (index: number) =>
    setRecipients((prev) => prev.filter((_, i) => i !== index))

  const validRecipients = recipients.filter(
    (r) => r.address.length > 0 && toStroops(r.amount) !== null,
  )
  const canSubmit = validRecipients.length === recipients.length && recipients.length > 0 && !disabled

  const total = recipients.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

  const handleSubmit = () => {
    const addresses = recipients.map((r) => r.address)
    const amounts = recipients.map((r) => toStroops(r.amount)!)
    onCreate(addresses, amounts)
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Create a split</h2>

      {recipients.map((r, i) => (
        <div key={i} className="recipient-row" style={{ alignItems: 'flex-start' }}>
          <RecipientInput
            address={r.address}
            onAddressChange={(address) => updateAddress(i, address)}
          />
          <input
            className="amount-input"
            type="number"
            min="0"
            step="0.0000001"
            placeholder="XLM"
            value={r.amount}
            onChange={(e) => updateAmount(i, e.target.value)}
          />
          {recipients.length > 1 && (
            <button
              className="btn-secondary btn-small"
              onClick={() => removeRecipient(i)}
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button className="btn-secondary btn-small" onClick={addRecipient} type="button">
        + Add recipient
      </button>

      {total > 0 && (
        <p className="muted" style={{ marginTop: 14 }}>
          Total: <strong className="mono">{total} XLM</strong>
        </p>
      )}

      <button
        className="btn-primary"
        style={{ marginTop: 8 }}
        disabled={!canSubmit || pending}
        onClick={handleSubmit}
      >
        {pending ? 'Creating…' : 'Create split'}
      </button>

      {disabled && <p className="muted">Connect your wallet to create a split.</p>}
    </div>
  )
}
