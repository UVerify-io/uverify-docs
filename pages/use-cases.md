# Use Cases

UVerify is a general-purpose document notarization platform. Because the certificate page is a fully programmable dapp, the same infrastructure can serve radically different use cases, from university diplomas to GDPR-compliant pet necklaces to NFT-gated physical goods.

This section walks through six real use cases in detail: the problem they solve, how UVerify addresses it, and what it takes to implement each one.

| Use Case | Core Pattern | Infrastructure Needed |
|---|---|---|
| [Academic Credentials](./use-cases/academic-credentials) | Diploma template + institutional issuer | None beyond a Cardano wallet |
| [Product Passports](./use-cases/product-passports) | Metadata-rich certificate + QR on packaging | None beyond a Cardano wallet |
| [Connected Goods](./use-cases/connected-goods) | QR with embedded secret → NFT minting | Custom Bootstrap Datum |
| [Pet Necklace](./use-cases/pet-necklace) | NFC + split secret + GDPR-safe data reveal | None (zero server infrastructure) |
| [Legal Documents](./use-cases/legal-documents) | Timestamped proof of existence | None beyond a Cardano wallet |
| [Private Chain Attestations](./use-cases/private-chain-attestations) | Bridge from private ledger to public verifiability | API integration |
