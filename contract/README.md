# Kitty contracts — Soroban

Two contracts, wired together with a genuine cross-contract call.

- **`kitty-split`** — tracks a group bill split on-chain: a creator fronts an expense, recipients each pay their own share directly to the creator in native XLM. After a successful payment, it calls into `kitty-reputation` to report the payment.
- **`kitty-reputation`** — tracks each address's on-time-payment count and total volume, writable only by the authorized `kitty-split` deployment (enforced via `require_auth` on the split contract's own address).

Deployment details, contract IDs, and the transaction hash proving the cross-contract call happened on-chain: [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Build

`kitty-split` embeds `kitty-reputation`'s compiled wasm via `contractimport!`, so build order matters:

```bash
cargo build -p kitty-reputation --target wasm32v1-none --release
cargo build --target wasm32v1-none --release
```

## Test

```bash
cargo test --workspace
```

7 tests total: 3 in `kitty-reputation` (score recording, unauthorized-caller rejection, double-initialize rejection), 4 in `kitty-split` (including one that verifies the cross-contract call actually updates `kitty-reputation`'s state, not just that `kitty-split`'s own storage changed).
