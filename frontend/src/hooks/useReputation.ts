import { useCallback, useEffect, useState } from 'react'
import { getReputationClient } from '../lib/contractClient'
import type { Score } from '../contracts/kitty-reputation/src'

export function useReputation(address: string | null) {
  const [score, setScore] = useState<Score | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!address) {
      setScore(null)
      return
    }
    setLoading(true)
    try {
      const client = getReputationClient()
      const tx = await client.get_score({ address })
      setScore(tx.result)
    } catch {
      setScore(null)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { score, loading, refresh }
}
