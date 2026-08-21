import { rpc } from '@stellar/stellar-sdk'

export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
export const RPC_URL = 'https://soroban-testnet.stellar.org'
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'

export const SPLIT_CONTRACT_ID = 'CCXLPKQCXVHAYW7UNZWLCAW54NBCGP754OEFGWPUQ5PNJPTREMMXUEHY'
export const REPUTATION_CONTRACT_ID = 'CCPDWYE2RPQ7RZSJNITNMFB3JMPSZWL7NH4BIRT44XDPZ2X4TICQKVSQ'
export const NATIVE_TOKEN_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'

export const server = new rpc.Server(RPC_URL)
