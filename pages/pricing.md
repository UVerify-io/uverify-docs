# Pricing

UVerify has no platform subscription fee. What you pay is the Cardano network transaction fee, plus an optional service fee that only applies when you use a custom Bootstrap Datum with a non-zero fee configured.

## The First Transaction: State Minting (~2 ADA)

The very first time you use UVerify, a **User State** is created on-chain. This state is a UTXO managed by UVerify's smart contract that tracks your certificates, fee countdown, and other session data.

Creating this state requires minting a token and locking a UTXO at the contract address. The UTXO must carry the Cardano minUTXO amount (currently 1 ADA) plus the transaction fee, making the first transaction approximately **2 ADA** total.

This is a one-time cost. After the state exists, **subsequent certificate transactions cost only the regular network fee (~0.34 ADA)**.

The ADA locked in the state UTXO is not lost. When you opt out of UVerify or your state is fully consumed, the locked ADA is returned to your wallet.

## Ongoing Certificate Fees

Every UVerify certificate is recorded in a Cardano transaction. Cardano computes transaction fees using a linear formula based on transaction size (minFee A/B parameters set by the network).

For UVerify transactions after the initial state creation:

- **Hash only, minimal metadata**: around **0.34 ADA** per transaction
- **Hash + rich metadata (up to the 16kB transaction size limit)**: up to around **0.45 ADA** per transaction

There is no platform fee on top of this when using the default Bootstrap Datum.

## Why There Is a Fee Interval (minUTXO)

Cardano requires every UTXO to carry a minimum amount of ADA, currently 1 ADA (the minUTXO value). This is a protocol-level constraint, not something UVerify controls.

If a service fee were collected on every single certificate, the fee output would need to meet the 1 ADA minUTXO threshold regardless of how small the intended fee is. For low-volume users issuing one certificate at a time, this would mean paying at least 1 ADA in service fee per certificate, which is disproportionate.

The **fee interval** solves this: the service fee is accumulated and collected once every N certificates. This way the output only needs to be created when it is large enough to make economic sense, and users avoid paying 1 ADA or more for every single notarization.

## Batch Size: The Biggest Lever on Cost

The `batch_size` field in a Bootstrap Datum controls how many SHA-256 certificate hashes are packed into a single Cardano transaction. This is the most powerful cost-reduction mechanism available.

### How it works

A Cardano transaction can carry up to 16kB of data. A SHA-256 hash is 32 bytes. When metadata is kept minimal or stored off-chain (e.g. on IPFS, with only a reference on-chain), a transaction can be filled with as many certificate hashes as fit within that 16kB limit.

The Cardano network fee for a full batch transaction is only marginally higher than for a single-certificate transaction, because the fee scales with transaction size and a batch of hashes is still compact data.

### Cost comparison

| Batch size | Transaction fee (approx.) | Network cost per certificate |
|---|---|---|
| 1 (default) | ~0.34 ADA | ~0.34 ADA |
| 10 | ~0.36 ADA | ~0.036 ADA |
| 50 | ~0.40 ADA | ~0.008 ADA |
| 100+ | ~0.45 ADA | ~0.004 ADA or less |

For a university issuing 500 diplomas, using a batch size of 50 reduces the network cost from ~170 ADA down to roughly 4 ADA total.

### Off-chain metadata

If your use case can store rich metadata off-chain (on IPFS, in your own database, or in a content-addressed store) and only put the hash or a reference on-chain, you can maximize the number of certificates per transaction and drive per-certificate costs as low as possible.

### Merkle trees: near-zero cost for large datasets

For use cases where you need to notarize thousands or millions of data points (lab records, supply chain events, audit logs), a Merkle tree lets you anchor the entire dataset in a single certificate.

The idea: build a Merkle tree from all your records off-chain, then record only the **Merkle root hash** in one UVerify certificate. Any individual record can later be proven to be part of that dataset by providing its Merkle proof (the path of sibling hashes up to the root), without touching the blockchain again.

```
1,000,000 records
    → compute Merkle tree off-chain
    → one SHA-256 root hash
    → one UVerify certificate (~0.34 ADA)
    → ~0.00000034 ADA per record
```

Anyone can verify that a specific record is included by checking its Merkle proof against the on-chain root. The certificate page shows the root hash and timestamp; verification of individual records happens locally.

## Custom Bootstrap Datum: Configurable Service Fee

When an operator sets up a custom Bootstrap Datum, they configure a service fee on top of the Cardano network fee. This fee is charged to users who create certificates through that Bootstrap Datum.

### Fee splitting

The service fee is distributed among the designated fee receivers defined in the Bootstrap Datum. This enables revenue sharing between the service operator and UVerify, or between multiple parties in a partnership.

For example, if you run a university certificate issuance service:
- You configure a 2 ADA fee per 10 certificates
- 80% goes to your address
- 20% goes to the UVerify fee receiver

The split is configured in the Bootstrap Datum's `fee_receivers` field and enforced by the smart contract on-chain. No manual invoicing or reconciliation is needed.

## Testnet: Free Testing

The Cardano preprod testnet uses test ADA that has no real-world value. You can get free test ADA from the [Cardano Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet/) and test your integration at zero cost before going to mainnet.

The UVerify public instance supports both mainnet and preprod. Set `VITE_CARDANO_NETWORK=preprod` in your frontend config to use the test environment.

## Fee Sponsorship

ADA is available on exchanges. If your organization faces regulatory barriers to acquiring ADA and you are building a project that is a good fit for UVerify, reach out. We offer fee sponsorship for selected projects to help you get started on mainnet.

Contact [hello@uverify.io](mailto:hello@uverify.io) or [join our Discord](https://discord.gg/Dvqkynn6xc).

## Summary

| Scenario | Cost |
|---|---|
| First transaction (state creation) | ~2 ADA (refundable on opt-out) |
| Single certificate, default Bootstrap Datum | ~0.34 ADA (network fee only) |
| Single certificate, rich on-chain metadata | up to ~0.45 ADA |
| Batch of 50 certificates | ~0.008 ADA per certificate |
| Merkle root of 1,000,000 records | ~0.34 ADA total (~0.00000034 ADA per record) |
| Custom Bootstrap Datum with service fee | Network fee + service fee collected at interval |
| Testnet (preprod) | Free (test ADA from faucet) |
| Fee sponsorship | Available on request |
