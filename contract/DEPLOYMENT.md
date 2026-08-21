# Kitty — Testnet Deployment (Level 3)

Two contracts, wired together via a genuine cross-contract call.

- **Network:** Stellar Testnet
- **KittySplit contract ID:** `CCXLPKQCXVHAYW7UNZWLCAW54NBCGP754OEFGWPUQ5PNJPTREMMXUEHY`
- **KittyReputation contract ID:** `CCPDWYE2RPQ7RZSJNITNMFB3JMPSZWL7NH4BIRT44XDPZ2X4TICQKVSQ`
- **Native token (SAC) address:** `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`

## Deploy transactions

- KittyReputation deploy: [`53bd9f959cd4f8bb85ccca8a6afc7657616ff3fa081377e5eceecd5134157a96`](https://stellar.expert/explorer/testnet/tx/53bd9f959cd4f8bb85ccca8a6afc7657616ff3fa081377e5eceecd5134157a96)
- KittySplit deploy: [`790d484ea8807e75c2342042e55f56375f01a8497c3e2ff550532615d5a46a12`](https://stellar.expert/explorer/testnet/tx/790d484ea8807e75c2342042e55f56375f01a8497c3e2ff550532615d5a46a12)

## Inter-contract call — verified on-chain

`pay_share` on KittySplit calls `record_payment` on KittyReputation in the same transaction.

- **Example `pay_share` call (triggers the cross-contract call):** [`41398a124eb5fe228721a4f603c33a7b7c32a20c406110ddca0226a5c86e21e7`](https://stellar.expert/explorer/testnet/tx/41398a124eb5fe228721a4f603c33a7b7c32a20c406110ddca0226a5c86e21e7)
- Verified by querying `KittyReputation.get_score(alice)` immediately after: `{"payments":1,"total_paid":"500000000"}` — the reputation contract's storage was written by KittySplit's contract call, not by a separate direct call.

## Redeploying

```bash
cd contract
cargo build --target wasm32v1-none --release   # builds both contracts; kitty-split needs
                                                 # kitty-reputation's wasm to already exist
                                                 # (linked via contractimport!)

stellar contract deploy --wasm target/wasm32v1-none/release/kitty_reputation.wasm \
  --source <identity> --network testnet --alias kitty-reputation

stellar contract deploy --wasm target/wasm32v1-none/release/kitty_split.wasm \
  --source <identity> --network testnet --alias kitty-split

stellar contract invoke --id <reputation-id> --source <identity> --network testnet \
  -- initialize --split_contract <split-id>

stellar contract invoke --id <split-id> --source <identity> --network testnet \
  -- initialize --native_token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
     --reputation_contract <reputation-id>
```

## Verified end-to-end on testnet

1. `create_split` — split id `0`, two recipients, 50 XLM each.
2. `pay_share` (Alice) — transferred 50 XLM to creator, emitted a `paid` event, **and** called `KittyReputation.record_payment` in the same transaction.
3. `get_score` (Alice, on KittyReputation) — confirmed `{"payments":1,"total_paid":"500000000"}`, proving the cross-contract write landed.
