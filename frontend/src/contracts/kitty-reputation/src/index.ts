import { Buffer } from "buffer";
import {
  Client as ContractClient,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  AssembledTransaction,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
} from "@stellar/stellar-sdk/contract";
import type { u32, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCPDWYE2RPQ7RZSJNITNMFB3JMPSZWL7NH4BIRT44XDPZ2X4TICQKVSQ",
  }
} as const

export const Errors = {
  1: {message:"AlreadyInitialized"},
  2: {message:"NotInitialized"},
  3: {message:"Unauthorized"}
}


export interface Score {
  payments: u32;
  total_paid: i128;
}

export type DataKey = {tag: "SplitContract", values: void} | {tag: "Score", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a get_score transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Read an address's payment reputation.
   */
  get_score: ({address}: {address: string}, options?: MethodOptions) => Promise<AssembledTransaction<Score>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set the one contract allowed to report payments (the KittySplit
   * contract). Can only be called once.
   */
  initialize: ({split_contract}: {split_contract: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a record_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Record that `payer` settled a share of `amount`. Only callable by the
   * authorized split contract, which must authorize itself for this call.
   */
  record_payment: ({split_contract, payer, amount}: {split_contract: string, payer: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  public readonly options: ContractClientOptions;
  constructor(options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAABAAAAAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAgAAAAAAAAAMVW5hdXRob3JpemVkAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAABVNjb3JlAAAAAAAAAgAAAAAAAAAIcGF5bWVudHMAAAAEAAAAAAAAAAp0b3RhbF9wYWlkAAAAAAAL",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAADVNwbGl0Q29udHJhY3QAAAAAAAABAAAAAAAAAAVTY29yZQAAAAAAAAEAAAAT",
        "AAAAAAAAACVSZWFkIGFuIGFkZHJlc3MncyBwYXltZW50IHJlcHV0YXRpb24uAAAAAAAACWdldF9zY29yZQAAAAAAAAEAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAEAAAfQAAAABVNjb3JlAAAA",
        "AAAAAAAAAGNTZXQgdGhlIG9uZSBjb250cmFjdCBhbGxvd2VkIHRvIHJlcG9ydCBwYXltZW50cyAodGhlIEtpdHR5U3BsaXQKY29udHJhY3QpLiBDYW4gb25seSBiZSBjYWxsZWQgb25jZS4AAAAACmluaXRpYWxpemUAAAAAAAEAAAAAAAAADnNwbGl0X2NvbnRyYWN0AAAAAAATAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAAItSZWNvcmQgdGhhdCBgcGF5ZXJgIHNldHRsZWQgYSBzaGFyZSBvZiBgYW1vdW50YC4gT25seSBjYWxsYWJsZSBieSB0aGUKYXV0aG9yaXplZCBzcGxpdCBjb250cmFjdCwgd2hpY2ggbXVzdCBhdXRob3JpemUgaXRzZWxmIGZvciB0aGlzIGNhbGwuAAAAAA5yZWNvcmRfcGF5bWVudAAAAAAAAwAAAAAAAAAOc3BsaXRfY29udHJhY3QAAAAAABMAAAAAAAAABXBheWVyAAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAA+kAAAACAAAAAw==" ]),
      options
    )
    this.options = options;
  }
  public readonly fromJSON = {
    get_score: this.txFromJSON<Score>,
        initialize: this.txFromJSON<Result<void>>,
        record_payment: this.txFromJSON<Result<void>>
  }
}