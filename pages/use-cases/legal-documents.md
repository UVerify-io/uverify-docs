# Legal Documents

## The Problem

Contracts, attestations, notarial deeds, and other legal documents often need to prove two things:

1. The document existed at a specific point in time (proof of existence)
2. The document has not been altered since then (proof of integrity)

Traditional approaches rely on notaries, timestamping authorities, or trusted third parties. These are expensive, slow, and depend on the continued existence of an institution. Documents stored in a company's database can be silently altered. Emails can be backdated. PDFs can be re-generated with a different date.

## How UVerify Solves It

Recording a document's SHA-256 hash on the Cardano blockchain creates an immutable, timestamped proof of existence. Cardano's block timestamp proves when the hash was first recorded. The blockchain's cryptographic guarantees make retroactive alteration computationally impossible.

No third party needs to be trusted. Anyone who holds the original document can verify it by hashing it locally and comparing to the on-chain record.

## What Gets Proven

When a document's hash is on-chain, you can prove:

- **The document existed at block N** (block timestamp is verifiable on any Cardano explorer)
- **The document has not been changed** since notarization (any change would produce a different hash)
- **Who notarized it** (the Cardano address that submitted the transaction is on-chain)

What you cannot prove from a UVerify certificate alone:

- The identity of the signer (only that a specific Cardano address notarized it)
- That the content of the document is legally valid (UVerify is a notarization tool, not a legal authority)

## Implementation

### One-time proof of existence

For a single document, no integration needed. Visit [app.uverify.io](https://app.uverify.io), drag the document, sign with your wallet.

Include any identifying metadata you want recorded on-chain:

```json
{
  "document_type": "Service Agreement",
  "parties": "ACME Corp and ExampleLtd",
  "version": "1.0",
  "reference": "SA-2024-00127"
}
```

### Automated notarization pipeline

For organizations that produce large volumes of documents, use the API to automate the process:

1. Document is finalized and stored in your system
2. Your backend computes the SHA-256 hash
3. POST to the UVerify API to build the transaction
4. Sign and submit using your organization's Cardano wallet
5. Store the certificate URL alongside the document in your records system

### Multi-party documents

If multiple parties need to independently notarize the same document (e.g. both signatories to a contract), each party hashes the same final document and records it from their own wallet. The certificate page at `app.uverify.io/verify/<hash>` will show all notarizations of that hash, including each party's Cardano address and timestamp.

## Jurisdictional Note

UVerify provides cryptographic proof of existence and integrity. Whether this constitutes legally admissible evidence depends on the jurisdiction. Cardano blockchain records have been used in legal proceedings in several countries, but you should consult a legal expert for your specific situation. UVerify does not provide legal advice.

## Long-Term Archival

Cardano is a proof-of-stake blockchain with a strong decentralization model. There is no central entity that can delete or alter on-chain records. The certificate URL will remain resolvable as long as at least one public node indexes the Cardano blockchain, which given Cardano's open-source and decentralized nature is expected to be the case indefinitely.

For the highest assurance, store the certificate URL, the original document, and the transaction ID together in your own archival system.
