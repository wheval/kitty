import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateSplit } from '../hooks/useCreateSplit'
import { useSendPayment } from '../hooks/useSendPayment'
import { useMySplits } from '../hooks/useMySplits'
import { CreateSplit } from '../components/CreateSplit'
import { SendPayment } from '../components/SendPayment'
import { TransactionStatus } from '../components/TransactionStatus'
import { ContactsManager } from '../components/ContactsManager'
import { AddressLabel } from '../components/SplitStatus'
import { getRecentSplits, addRecentSplit } from '../lib/recentSplits'

type HomePageProps = {
  address: string | null
}

export function HomePage({ address }: HomePageProps) {
  const navigate = useNavigate()
  const createSplit = useCreateSplit(address)
  const sendPayment = useSendPayment(address)
  const { splits: mySplits, loading: mySplitsLoading } = useMySplits(address)
  const [lookupInput, setLookupInput] = useState('')
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    setRecent(getRecentSplits())
  }, [])

  useEffect(() => {
    if (createSplit.status === 'success' && createSplit.result !== null) {
      const id = createSplit.result.toString()
      addRecentSplit(id)
      navigate(`/app/split/${id}`)
    }
  }, [createSplit.status, createSplit.result, navigate])

  const handleLookup = () => {
    const trimmed = lookupInput.trim()
    if (/^\d+$/.test(trimmed)) {
      navigate(`/app/split/${trimmed}`)
    }
  }

  return (
    <>
      <SendPayment
        disabled={!address}
        pending={sendPayment.status === 'pending'}
        onSend={(destination, amount) => sendPayment.send(destination, amount)}
      />
      <TransactionStatus
        status={sendPayment.status}
        hash={sendPayment.hash}
        error={sendPayment.error}
        successLabel="Sent"
      />

      <CreateSplit
        disabled={!address}
        pending={createSplit.status === 'pending'}
        onCreate={(recipients, amounts) => createSplit.createSplit(recipients, amounts)}
      />
      <TransactionStatus
        status={createSplit.status}
        hash={createSplit.hash}
        error={createSplit.error}
        successLabel="Split created — redirecting…"
      />

      <div className="card">
        <label htmlFor="lookup">View an existing split by ID</label>
        <div className="recipient-row">
          <input
            id="lookup"
            placeholder="0"
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
          />
          <button className="btn-secondary" onClick={handleLookup} type="button">
            View
          </button>
        </div>
      </div>

      <ContactsManager />

      {address && (
        <div className="card">
          <label>Your splits</label>
          <p className="muted" style={{ marginTop: 0, fontSize: '0.85rem' }}>
            Every split this wallet created or was added to, found on-chain — works from any
            device, not just this browser.
          </p>
          {mySplitsLoading && <p className="muted">Loading…</p>}
          {!mySplitsLoading && mySplits.length === 0 && (
            <p className="muted">No splits found for this wallet yet.</p>
          )}
          {mySplits.map((s) => {
            const paidCount = s.record.paid.filter(Boolean).length
            const counterparty = s.role === 'creator' ? null : s.record.creator
            return (
              <div className="recipient-item" key={s.id.toString()}>
                <span>
                  #{s.id.toString()}{' '}
                  <span className="muted">
                    · {s.role === 'creator' ? 'you created' : (
                      <>
                        owed to <AddressLabel address={counterparty!} />
                      </>
                    )}
                  </span>
                </span>
                <span className="row" style={{ gap: 10, width: 'auto' }}>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    {paidCount}/{s.record.recipients.length} paid
                  </span>
                  <button
                    className="btn-secondary btn-small"
                    onClick={() => navigate(`/app/split/${s.id}`)}
                    type="button"
                  >
                    View
                  </button>
                </span>
              </div>
            )
          })}
        </div>
      )}

      {recent.length > 0 && (
        <div className="card">
          <label>Recent splits (this browser)</label>
          <div className="recipient-row" style={{ flexWrap: 'wrap' }}>
            {recent.map((id) => (
              <button
                key={id}
                className="btn-secondary btn-small"
                onClick={() => navigate(`/app/split/${id}`)}
                type="button"
              >
                #{id}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
