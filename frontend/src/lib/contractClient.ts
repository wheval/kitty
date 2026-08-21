import { Client as SplitClient } from '../contracts/kitty-split/src'
import { Client as ReputationClient } from '../contracts/kitty-reputation/src'
import { SPLIT_CONTRACT_ID, REPUTATION_CONTRACT_ID, NETWORK_PASSPHRASE, RPC_URL } from './stellar'
import { StellarWalletsKit } from './walletKit'

export function getSplitClient(publicKey?: string) {
  return new SplitClient({
    contractId: SPLIT_CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey,
    signTransaction: (xdr, opts) => StellarWalletsKit.signTransaction(xdr, opts),
  })
}

export function getReputationClient(publicKey?: string) {
  return new ReputationClient({
    contractId: REPUTATION_CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey,
    signTransaction: (xdr, opts) => StellarWalletsKit.signTransaction(xdr, opts),
  })
}
