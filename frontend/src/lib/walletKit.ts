import type { StellarWalletsKit as StellarWalletsKitType } from '@creit.tech/stellar-wallets-kit'

let initialized: Promise<typeof StellarWalletsKitType> | null = null

/**
 * The wallet kit pulls in SDKs for every supported wallet (including
 * hardware wallets), which is heavy. Loading it only when a user actually
 * tries to connect keeps it out of the initial page bundle.
 */
export function getWalletKit(): Promise<typeof StellarWalletsKitType> {
  if (!initialized) {
    initialized = (async () => {
      const [{ StellarWalletsKit, Networks }, { FreighterModule }, { xBullModule }, { AlbedoModule }, { LobstrModule }, { RabetModule }, { HanaModule }] =
        await Promise.all([
          import('@creit.tech/stellar-wallets-kit'),
          import('@creit.tech/stellar-wallets-kit/modules/freighter'),
          import('@creit.tech/stellar-wallets-kit/modules/xbull'),
          import('@creit.tech/stellar-wallets-kit/modules/albedo'),
          import('@creit.tech/stellar-wallets-kit/modules/lobstr'),
          import('@creit.tech/stellar-wallets-kit/modules/rabet'),
          import('@creit.tech/stellar-wallets-kit/modules/hana'),
        ])

      StellarWalletsKit.init({
        network: Networks.TESTNET,
        modules: [
          new FreighterModule(),
          new xBullModule(),
          new AlbedoModule(),
          new LobstrModule(),
          new RabetModule(),
          new HanaModule(),
        ],
      })

      return StellarWalletsKit
    })()
  }
  return initialized
}
