# Getting Started with UVerify

UVerify proves a document is authentic and unchanged, using the Cardano blockchain. Your file never leaves your device. UVerify computes a unique fingerprint (SHA-256 hash) locally and records only that fingerprint on-chain.

The certificate page that proves a document's authenticity is not just a static page. It is a fully interactive decentralized application (dapp). Depending on how it was configured, it can connect to Cardano wallets, mint NFTs, enforce access control, and run entirely different user interfaces, all driven by on-chain data.

## Choose Your Path

There are three ways to use UVerify, each targeting a different level of involvement.

---

### Path 1: Just use the web app

No code required. Visit [app.uverify.io](https://app.uverify.io), drag and drop a file or paste text, and your fingerprint is recorded on-chain in one transaction.

**You need:**
- A Cardano wallet (e.g. [Eternl](https://eternl.io), [Lace](https://www.lace.io), or [Vespr](https://vespr.xyz))
- ADA to cover the Cardano network transaction fee

**No ADA yet?** On preprod, the Cardano testnet, you can get free test ADA from the [Cardano Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet/). On mainnet, ADA is available on exchanges. If your organization faces regulatory barriers to acquiring ADA, reach out. We offer [fee sponsorship](./pricing#fee-sponsorship) for projects that are a good fit.

---

### Path 2: Automate with the API

Use the [UVerify REST API](./api-docs) to notarize documents programmatically. No API key, no rate limits. The public instance at `https://api.uverify.io` is open to anyone.

**Good for:**
- Automated pipelines that hash and record documents in bulk
- Backend services that need to verify whether a hash exists on-chain
- Integrating UVerify into your own product without building a frontend

**You need:**
- An HTTP client (curl, fetch, axios, etc.)
- A Cardano wallet to sign transactions if you are notarizing (verification is read-only)

---

### Path 3: Build on top of UVerify

Create a fully white-labelled certificate experience using [UVerify as a Platform](./platform) and [Custom Templates](./templates). You get your own branding, your own fee structure, and the certificates your users create look and feel like they came from you.

**Good for:**
- Universities issuing verifiable diplomas
- Brands shipping physical goods with on-chain product passports
- Any service where your users need tamper-proof certificates under your brand

**You need:**
- A custom [Bootstrap Datum](./platform/bootstrap-datum) (reach out to [hello@uverify.io](mailto:hello@uverify.io) or [join our Discord](https://discord.gg/Dvqkynn6xc))
- Optionally: a custom UI template built with `npx @uverify/cli init`

Or go fully independent and [self-host the entire stack](./self-hosting). The backend and frontend are both open source.

---

## Core Concept: The Certificate as a Dapp

A UVerify certificate page is not a static document. It is a dapp whose behaviour is determined by:

1. **On-chain data**: the hash, metadata, issuer, and template ID stored in the Cardano transaction
2. **The template**: selected via the `uverify_template_id` metadata field; controls the entire look and behaviour of the page
3. **URL parameters**: can carry partial data (e.g. a split secret for privacy-preserving use cases)

This means the same infrastructure can power a diploma viewer, a product authentication page, a GDPR-compliant pet necklace, or an NFT-gating system, with zero additional server infrastructure for the service provider.

See [How It Works](./concepts) for a deeper explanation.

## Key Resources

| What you want to do | Where to go |
|---|---|
| Understand the concepts | [How It Works](./concepts) |
| See concrete use cases | [Use Cases](./use-cases) |
| Use the API | [API Docs](./api-docs) |
| Build a custom certificate UI | [Custom Templates](./templates) |
| White-label UVerify for your brand | [UVerify as a Platform](./platform) |
| Run UVerify yourself | [Self-Hosting](./self-hosting) |
| Understand fees | [Pricing](./pricing) |
