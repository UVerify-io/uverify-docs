# How UVerify Works

This page explains the core concepts behind UVerify. You do not need to understand all of it to get started, but it will help you build more sophisticated integrations and appreciate what makes UVerify different from a simple timestamping service.

Prefer video? The [Cardano Foundation open office hours session on YouTube](https://www.youtube.com/watch?v=Pvk8aat8PTQ) covers UVerify as a platform and walks through the pet necklace use case in detail.

## The Core Idea: Hash, Not File

When you submit a document to UVerify, your file never leaves your device. The app computes a SHA-256 fingerprint (hash) of the file locally and sends only that hash to the Cardano blockchain. The hash is deterministic: the same file always produces the same hash. It is effectively impossible to reverse-engineer the original file from the hash alone.

This means:
- **Privacy by design**: No one (not even UVerify) ever sees your file
- **Permanent proof**: Once the hash is on-chain, the Cardano blockchain ensures it can never be deleted or altered
- **Instant verification**: Anyone who has the original file can verify it in seconds by hashing it locally and comparing to the on-chain record

## The Certificate Page as a Dapp

A UVerify certificate page is not a static document. It is a fully interactive decentralized application whose behaviour is determined by multiple sources of data, all composed at runtime in the viewer's browser:

```
On-chain data (hash, metadata, template ID)
  +
URL parameters (optional, for privacy-split patterns)
  +
Connected wallet (optional, for write operations)
  +
Network requests (external APIs, company intranet, IPFS)
  +
User-provided data (e.g. a file dropped onto the page)
  =
Certificate dapp
```

This architecture means that the same Cardano smart contract and the same frontend can serve completely different experiences depending on what was written into the certificate at notarization time, who is viewing it, and what data is accessible to them. A diploma, a product passport, a social link tree, and a GDPR-compliant pet necklace all run on the same infrastructure, differentiated entirely by their template and on-chain metadata.

### Context-aware rendering

A template can make network requests at load time and render differently depending on the result. This opens up viewer-dependent certificate experiences:

- An **external auditor** opens the certificate URL and sees the public view: hash verified, timestamp, issuer, basic metadata.
- An **HR employee** on the company intranet opens the same URL. The template makes an authenticated request to an internal API and gets back enriched data: candidate name, full assessment results, internal reference numbers. The employee sees a fully detailed view that is invisible to anyone outside the network.

No configuration change is needed on-chain between the two cases. The same certificate adapts to its viewer automatically.

### File-drop verification

Another pattern inverts the usual flow. Instead of storing the document data on-chain, the certificate stores only the hash and shows minimal public information (for example: exam passed, date, issuing organisation). The template includes a file drop field.

When an HR employee drops the candidate's certificate PDF onto the page:

1. The browser hashes the file locally (SHA-256, no upload)
2. The computed hash is compared to the on-chain hash
3. If they match, the full document data is extracted from the file and displayed alongside the verified proof

The document itself never goes anywhere. The blockchain provides the proof that the hash was recorded at a specific time by a specific issuer. The file provides the readable data. The two are joined locally in the viewer's browser.

This pattern is useful whenever you want to avoid storing personal or sensitive data on-chain or in any central system, while still giving authorised parties a seamless verification experience.

### Template Selection

The key metadata field is `uverify_template_id`. When a certificate page loads, it reads this field and selects the corresponding template:

| Template ID | What it renders |
|---|---|
| `default` | Standard verification: hash status, metadata viewer, issuer card, block explorer link |
| `monochrome` | Same as default but with a monochrome theme |
| `diploma` | A formatted diploma certificate using `name`, `title`, `issuer`, `description` metadata |
| `socialHub` | A social profile hub with wallet-connect and NFT minting (Connected Goods use case) |
| `productVerification` | Product authentication with asymmetric NFC chip verification |
| `tadamon` | Branded template for a PoC with the Tadamon UNDP program |
| _your custom ID_ | Any template you build and register with the UI |

If no `uverify_template_id` is present, the `default` template is used.

### The `extra` Object

Every template receives a runtime `extra` object in addition to the on-chain data. This is not stored on the blockchain. It is derived by the certificate page at load time:

```typescript
type UVerifyCertificateExtraData = {
  hashedMultipleTimes: boolean; // same hash was notarized more than once
  firstDateTime: string;        // human-readable date of the first notarization
  issuer: string;               // resolved Cardano address of the issuer
  serverError: boolean;         // backend API call failed (not 404)
  isLoading: boolean;           // data is still being fetched
}
```

## The Fee System: Bootstrap Datum and User State

Certificate creation is not free. Every Cardano transaction has a network fee. On top of that, UVerify has its own configurable service fee layer managed by two on-chain constructs.

### Bootstrap Datum

A Bootstrap Datum is the root configuration object for a certificate issuance environment. Think of it as a smart contract configuration that defines:

- Who is allowed to create certificates (allowlist, or open to all)
- What the service fee is and how often it is charged
- Who receives the fee (fee splitting between the operator and UVerify)
- How large a batch of certificates can be in a single transaction
- Which custom UI templates are unlocked

Every user starts with the **default Bootstrap Datum**, which has no service fee and standard settings. If you want your own branding, fee structure, or access control, you get a custom Bootstrap Datum provisioned by the UVerify team.

### User State

When a user creates their first certificate, a **User State** is forked from a Bootstrap Datum. This is a personal on-chain record that:

- Inherits the fee rules and batch size from the Bootstrap Datum at the moment of creation
- Tracks how many certificates have been issued (countdown to renewal)
- Stores the list of certificate hashes for that user

The User State is stable. Even if the Bootstrap Datum is updated or rotated, your state keeps its original terms until it expires or reaches its transaction limit, at which point it renews automatically.

```
Bootstrap Datum (operator-level config)
    └── User State (per-user session, forked from Bootstrap Datum)
            └── UVerifyCertificate (each notarized hash)
```

### Fee Charging

Because Cardano uses a UTXO model, sending very small amounts creates "dust" UTXOs that degrade performance. To avoid charging tiny fees on every single certificate, UVerify charges the service fee at a configurable **fee interval**: for example, once every 10 certificates. This keeps per-certificate costs reasonable even at low fee settings.

## Privacy-Split Patterns

URL parameters are first-class citizens in UVerify's dapp model. Some use cases intentionally split data between:

1. **On-chain**: the hash and structured metadata (permanent, public)
2. **URL parameter**: a piece of data needed to reconstruct the full hash (ephemeral, shareable only with physical access)

This enables patterns like the [pet necklace](./use-cases/pet-necklace) use case, where the on-chain certificate stores only part of the data and the NFC chip in the necklace carries the other part. The certificate page joins both halves and verifies the SHA-256 hash, revealing private information only when both parts are present. No server infrastructure is needed by the service provider.

## Data Flow

```
User opens certificate URL
    |
Certificate page hashes URL params (if any)
    |
GET api.uverify.io/api/v1/verify/{hash}
    |
Backend queries Cardano (via Blockfrost or Koios)
    |
Returns: array of UVerifyCertificate objects
    |
Certificate page reads uverify_template_id from metadata
    |
Renders the matching template with on-chain data + extra context
```

For notarization (creating a certificate), the flow goes through a CIP-30 browser wallet. The user signs the transaction locally and it is submitted to Cardano. UVerify never holds your private keys.

### Shorthand: verify by message

Instead of computing a hash yourself, you can pass a plain text message as a URL parameter and the app will hash it automatically:

```
https://app.uverify.io/verify?message=Hello%20World
```

This resolves to the certificate deeplink for the SHA-256 hash of that message:

```
https://app.uverify.io/verify/a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e/1
```

Useful for quick lookups, sharing links to text-based certificates, and testing.
