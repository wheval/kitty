import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSplit } from '../hooks/useSplit'
import { useSplitEvents } from '../hooks/useSplitEvents'
import { usePayShare } from '../hooks/usePayShare'
import { SplitStatus } from '../components/SplitStatus'
import { TransactionStatus } from '../components/TransactionStatus'
import { addRecentSplit } from '../lib/recentSplits'

type SplitPageProps = {
  address: string | null
  onPaid: () => void
}

export function SplitPage({ address, onPaid }: SplitPageProps) {
  const { id } = useParams<{ id: string }>()
  const isValidId = !!id && /^\d+$/.test(id)
  const splitId = isValidId ? BigInt(id!) : null

  const { split, loading, refresh } = useSplit(splitId)
  const events = useSplitEvents(splitId)
  const payShare = usePayShare(address)

  useEffect(() => {
    if (isValidId) addRecentSplit(id!)
  }, [isValidId, id])

  useEffect(() => {
    if (payShare.status === 'success') {
      refresh()
      onPaid()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payShare.status, refresh])

  if (!isValidId) {
    return (
      <div className="card">
        <p className="error">"{id}" isn't a valid split ID.</p>
        <Link to="/">← Back home</Link>
      </div>
    )
  }

  return (
    <>
      <Link to="/" className="muted" style={{ display: 'inline-block', marginBottom: 12 }}>
        ← Back
      </Link>

      <SplitStatus
        splitId={splitId!}
        split={split}
        loading={loading}
        myAddress={address}
        payPending={payShare.status === 'pending'}
        onPay={() => payShare.payShare(splitId!)}
        events={events}
        onRefresh={refresh}
      />
      <TransactionStatus
        status={payShare.status}
        hash={payShare.hash}
        error={payShare.error}
        successLabel="Your share is paid — reputation updated"
      />
    </>
  )
}
