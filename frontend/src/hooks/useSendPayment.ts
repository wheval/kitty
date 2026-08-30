import { useCallback, useState } from 'react'
import { sendPayment } from '../lib/sendPayment'
import { classifyError } from '../lib/errors'
import { idleTx, type TxState } from '../lib/txStatus'

export function useSendPayment(publicKey: string | null) {
  const [state, setState] = useState<TxState<null>>(idleTx<null>())

  const send = useCallback(
    async (destination: string, amountXlm: string) => {
      if (!publicKey) {
        setState({
          status: 'error',
          hash: null,
          result: null,
          error: { type: 'wallet_not_found', message: 'Connect a wallet first.' },
        })
        return
      }

      setState({ status: 'pending', hash: null, result: null, error: null })
      try {
        const { hash } = await sendPayment(publicKey, destination, amountXlm)
        setState({ status: 'success', hash, result: null, error: null })
      } catch (err) {
        setState({ status: 'error', hash: null, result: null, error: classifyError(err) })
      }
    },
    [publicKey],
  )

  const reset = useCallback(() => setState(idleTx<null>()), [])

  return { ...state, send, reset }
}
