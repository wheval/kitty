import type { Score } from '../contracts/kitty-reputation/src'
import { Skeleton } from './Skeleton'

type ReputationBadgeProps = {
  score: Score | null
  loading: boolean
}

function fromStroops(amount: bigint) {
  return (Number(amount) / 10_000_000).toString()
}

export function ReputationBadge({ score, loading }: ReputationBadgeProps) {
  if (loading) return <Skeleton width="160px" height="1em" />

  if (!score || score.payments === 0) {
    return <span className="reputation-pill">No on-chain payment history yet</span>
  }

  return (
    <span className="reputation-pill">
      🐱 {score.payments} share{score.payments === 1 ? '' : 's'} paid on time · {fromStroops(score.total_paid)} XLM
      total
    </span>
  )
}
