import type { SplitRecord } from '../contracts/kitty-split/src'
import type { PaidEvent } from '../hooks/useSplitEvents'
import { Skeleton } from './Skeleton'

type SplitStatusProps = {
  splitId: bigint
  split: SplitRecord | null
  loading: boolean
  myAddress: string | null
  payPending: boolean
  onPay: () => void
  events: PaidEvent[]
  onRefresh: () => void
}

function shorten(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

function fromStroops(amount: bigint) {
  return (Number(amount) / 10_000_000).toString()
}

export function SplitStatus({
  splitId,
  split,
  loading,
  myAddress,
  payPending,
  onPay,
  events,
  onRefresh,
}: SplitStatusProps) {
  if (loading && !split) {
    return (
      <div className="card">
        <Skeleton width="140px" height="1.4em" />
        <div style={{ marginTop: 12 }}>
          <Skeleton width="80%" height="1em" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Skeleton height="2.5em" />
        </div>
      </div>
    )
  }

  if (!split) return null

  const myIndex = myAddress
    ? split.recipients.findIndex((r) => r === myAddress)
    : -1
  const iOwe = myIndex >= 0 && !split.paid[myIndex]

  return (
    <div className="card">
      <div className="row">
        <h2 style={{ margin: 0 }}>
          Split <span className="mono">#{splitId.toString()}</span>
        </h2>
        <button className="btn-secondary btn-small" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <p className="muted">
        Fronted by <span className="mono">{shorten(split.creator)}</span> — total{' '}
        <strong>{fromStroops(split.total)} XLM</strong>
      </p>

      {split.recipients.map((recipient, i) => (
        <div className="recipient-item" key={recipient}>
          <span className="mono">{shorten(recipient)}</span>
          <span>
            <span className="mono" style={{ marginRight: 10 }}>
              {fromStroops(split.amounts[i])} XLM
            </span>
            {split.paid[i] ? (
              <span className="badge badge-paid">✓ paid</span>
            ) : (
              <span className="badge badge-pending">pending</span>
            )}
          </span>
        </div>
      ))}

      {iOwe && (
        <button
          className="btn-primary"
          style={{ marginTop: 16 }}
          disabled={payPending}
          onClick={onPay}
        >
          {payPending ? 'Paying…' : `Pay my share (${fromStroops(split.amounts[myIndex])} XLM)`}
        </button>
      )}

      {events.length > 0 && (
        <div className="event-log">
          <strong>Live activity</strong>
          {events.map((e) => (
            <div className="event-log-item" key={e.id}>
              {shorten(e.payer)} paid {fromStroops(e.amount)} XLM
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
