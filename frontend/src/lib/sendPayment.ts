import { Asset, BASE_FEE, Operation, TransactionBuilder, rpc } from '@stellar/stellar-sdk'
import { server, NETWORK_PASSPHRASE } from './stellar'
import { getWalletKit } from './walletKit'

export type SendPaymentResult = {
  hash: string
}

/**
 * A direct wallet-to-wallet XLM payment — deliberately a plain classic
 * Stellar payment, not a Soroban contract call. No split record, no
 * reputation update: this is the low-friction "just send it" path from
 * the Level 4 spec, kept intentionally separate from the split/reputation
 * mechanics.
 */
export async function sendPayment(
  source: string,
  destination: string,
  amountXlm: string,
): Promise<SendPaymentResult> {
  const account = await server.getAccount(source)
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount: amountXlm,
      }),
    )
    .setTimeout(60)
    .build()

  const kit = await getWalletKit()
  const { signedTxXdr } = await kit.signTransaction(tx.toXdr(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: source,
  })

  const signedTx = TransactionBuilder.fromXdr(signedTxXdr, NETWORK_PASSPHRASE)
  const sendResult = await server.sendTransaction(signedTx)

  if (sendResult.status === 'ERROR') {
    throw new Error(sendResult.errorResult?.toString() ?? 'Transaction submission failed.')
  }

  const finalStatus = await server.pollTransaction(sendResult.hash, {
    attempts: 20,
    sleepStrategy: rpc.BasicSleepStrategy,
  })

  if (finalStatus.status !== 'SUCCESS') {
    throw new Error(`Payment failed: ${finalStatus.status}`)
  }

  return { hash: sendResult.hash }
}
