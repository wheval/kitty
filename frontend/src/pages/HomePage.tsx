import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateSplit } from '../hooks/useCreateSplit'
import { CreateSplit } from '../components/CreateSplit'
import { TransactionStatus } from '../components/TransactionStatus'
import { ContactsManager } from '../components/ContactsManager'
import { getRecentSplits, addRecentSplit } from '../lib/recentSplits'

type HomePageProps = {
  address: string | null
}

export function HomePage({ address }: HomePageProps) {
  const navigate = useNavigate()
  const createSplit = useCreateSplit(address)
  const [lookupInput, setLookupInput] = useState('')
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    setRecent(getRecentSplits())
  }, [])

  useEffect(() => {
    if (createSplit.status === 'success' && createSplit.result !== null) {
      const id = createSplit.result.toString()
      addRecentSplit(id)
      navigate(`/split/${id}`)
    }
  }, [createSplit.status, createSplit.result, navigate])

  const handleLookup = () => {
    const trimmed = lookupInput.trim()
    if (/^\d+$/.test(trimmed)) {
      navigate(`/split/${trimmed}`)
    }
  }

  return (
    <>
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

      {recent.length > 0 && (
        <div className="card">
          <label>Recent splits (this browser)</label>
          <div className="recipient-row" style={{ flexWrap: 'wrap' }}>
            {recent.map((id) => (
              <button
                key={id}
                className="btn-secondary btn-small"
                onClick={() => navigate(`/split/${id}`)}
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
