import { useCallback, useState } from 'react'
import { getWalletKit } from '../lib/walletKit'
import { classifyError, type KittyError } from '../lib/errors'

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<KittyError | null>(null)

  const connect = useCallback(async () => {
    setError(null)
    setConnecting(true)
    try {
      const kit = await getWalletKit()
      const { address } = await kit.authModal()
      setAddress(address)
    } catch (err) {
      setError(classifyError(err))
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      const kit = await getWalletKit()
      await kit.disconnect()
    } catch {
      // Best-effort: still clear local state below even if the module has no-op disconnect.
    }
    setAddress(null)
    setError(null)
  }, [])

  return { address, connecting, error, connect, disconnect }
}
