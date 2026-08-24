import { useCallback, useEffect, useState } from 'react'
import { scValToNative } from '@stellar/stellar-sdk'
import { server, SPLIT_CONTRACT_ID } from '../lib/stellar'
import { getSplitClient } from '../lib/contractClient'
import type { SplitRecord } from '../contracts/kitty-split/src'

export type MySplit = {
  id: bigint
  record: SplitRecord
  role: 'creator' | 'recipient'
}

// Soroban RPC nodes only retain events for a limited window. Try a generous
// lookback first; if the node rejects it as before its retention horizon,
// fall back to a shorter one instead of failing outright.
const LOOKBACK_LEDGERS = 120_000
const FALLBACK_LOOKBACK_LEDGERS = 17_280
const CONCURRENCY = 5

async function collectCreatedSplitIds(): Promise<bigint[]> {
  const latest = await server.getLatestLedger()
  const ids = new Set<bigint>()

  const scan = async (lookback: number) => {
    ids.clear()
    let cursor: string | undefined
    const startLedger = Math.max(latest.sequence - lookback, 1)

    for (;;) {
      const request = cursor
        ? { filters: [{ type: 'contract' as const, contractIds: [SPLIT_CONTRACT_ID] }], cursor, limit: 1000 }
        : {
            filters: [{ type: 'contract' as const, contractIds: [SPLIT_CONTRACT_ID] }],
            startLedger,
            limit: 1000,
          }

      const res = await server.getEvents(request)
      for (const event of res.events) {
        const topic0 = event.topic[0] ? scValToNative(event.topic[0]) : null
        if (topic0 !== 'created') continue
        const id = event.topic[1] ? (scValToNative(event.topic[1]) as bigint) : null
        if (id !== null) ids.add(id)
      }

      if (res.events.length === 0) break
      cursor = res.cursor
    }
  }

  try {
    await scan(LOOKBACK_LEDGERS)
  } catch {
    await scan(FALLBACK_LOOKBACK_LEDGERS)
  }

  return [...ids]
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let index = 0
  const worker = async () => {
    while (index < items.length) {
      const current = index++
      results[current] = await fn(items[current])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

export function useMySplits(address: string | null) {
  const [splits, setSplits] = useState<MySplit[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!address) {
      setSplits([])
      return
    }
    setLoading(true)
    try {
      const ids = await collectCreatedSplitIds()
      const client = getSplitClient()

      const records = await mapLimit(ids, CONCURRENCY, async (id): Promise<MySplit | null> => {
        try {
          const tx = await client.get_split({ split_id: id })
          if (tx.result.isErr()) return null
          const record = tx.result.unwrap()
          if (record.creator === address) return { id, record, role: 'creator' }
          if (record.recipients.includes(address)) return { id, record, role: 'recipient' }
          return null
        } catch {
          return null
        }
      })

      const mine = records.filter((r): r is MySplit => r !== null)
      mine.sort((a, b) => (b.id > a.id ? 1 : b.id < a.id ? -1 : 0))
      setSplits(mine)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { splits, loading, refresh }
}
