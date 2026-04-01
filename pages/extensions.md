# Certificate Extensions

UVerify extensions build on top of the core certificate infrastructure to unlock additional on-chain behaviors. While a standard UVerify certificate permanently records a hash on Cardano, extensions go further by attaching token-based mechanics to those certificates.

Each extension is a separate Aiken smart contract (validator) that interacts with the UVerify state validator. The backend provides ready-made transaction builders so you do not have to write any Cardano transaction logic yourself.

## Available Extensions

### [Fractionized Certificate](./extensions/fractionized-certificate)

Issue a certificate that allows multiple claimants to mint a fixed supply of fungible tokens. Ideal for reward distributions, token airdrops tied to verifiable credentials, or any scenario where a certificate represents a divisible asset.

### [Tokenizable Certificate](./extensions/tokenizable-certificate)

Attach a unique NFT to a certificate. The designated owner can redeem it once to receive a non-fungible token, with optional [CIP-68](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0068) support for rich on-chain metadata.

## Common Architecture

Both extensions share the same underlying design:

- A **sorted linked-list** of UTxOs lives at the validator script address. Each node holds one certificate entry and a pointer to the next node (by key, in ascending byte order).
- A special **HEAD node** stores the global configuration (deployer key, allowed inserters, UVerify validator hash, and extension-specific settings).
- Every insert transaction atomically updates the UVerify state validator in the same transaction, so the on-chain certificate record and the extension node are always in sync.
- The backend handles **EUTXO contention** automatically: if two inserts conflict on the same predecessor node, the second transaction is rebuilt using a fork-and-orphan strategy.

## API

Both extensions expose the same two REST endpoints:

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/v1/extension/{type}/build` | Build a transaction (Init / Insert / Claim or Redeem) |
| `GET`  | `/api/v1/extension/{type}/status/{key}` | Query the current on-chain node status |

Where `{type}` is `fractionized-certificate` or `tokenizable-certificate`.

Full request/response schemas are available in the [API Docs](./api-docs).
