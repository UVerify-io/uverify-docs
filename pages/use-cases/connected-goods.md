# Connected Goods

## The Problem

A brand wants to give the owner of a physical product (a sneaker, a piece of art, a collector's item) a unique on-chain identity tied to that specific object. They want to:

- Prove that the person holding the item is its legitimate owner
- Let the owner mint an NFT representing the item
- Give the owner a controllable "link tree" for the item (social accounts, provenance story, owner history)

But they do not want to build a backend. And they do not want to allow anyone to just scan a QR code and claim ownership; physical possession of the item must be required.

## How UVerify Solves It

The certificate for each item contains a **hashed secret**. The secret itself is embedded in the QR code URL. If you have physical access to the item, you can scan the QR code, which provides the secret to the certificate page. The page validates the secret against the on-chain hash, and if it matches, it unlocks NFT minting and control of the item's link tree.

No app to install. No backend to run. The certificate page is the application.

## The Pattern: QR-Gated Access

```
Physical item
    └── QR code on the item: https://app.uverify.io/verify/<hash>?secret=<plaintext-secret>
            ↓ (user scans)
    Certificate page
        1. Reads secret from URL
        2. Hashes the secret
        3. Compares to on-chain hashed_secret in metadata
        4. If match → unlocks NFT minting + link tree control
        5. If no match / no secret → shows read-only product info
```

Only someone with physical access to the item can read the QR code and obtain the secret. A screenshot of the QR code shared online would also share the secret, so this pattern is suited for scenarios where possession implies authorisation, not for high-security authentication.

## Implementation

### Step 1: Generate a secret per item

For each physical item, generate a unique random secret:

```js
const secret = crypto.randomUUID(); // e.g. "f3a1b2c4-..."
const hashedSecret = sha256(secret);
```

### Step 2: Prepare metadata

Record the hashed secret (not the plaintext secret) on-chain:

```json
{
  "uverify_template_id": "socialHub",
  "productName": "Air Max Collab #042",
  "manufacturer": "ExampleBrand",
  "hashed_secret": "<sha256 of the secret>",
  "serialNumber": "AM-042"
}
```

### Step 3: Generate the QR code URL

Embed the plaintext secret in the URL as a query parameter:

```
https://app.uverify.io/verify/<hash>?secret=<plaintext-secret>
```

Print this QR code on the item. The secret travels with the physical object.

### Step 4: What the certificate page does

The `socialHub` template (used for Connected Goods) detects the `secret` query parameter and calls the UVerify backend extension at `/api/v1/extension/connected-goods/`. The backend:

1. Hashes the provided secret
2. Compares to the on-chain `hashed_secret`
3. If valid: returns authorisation for NFT minting and link tree write access
4. If invalid: returns read-only mode

### Step 5: The link tree

The owner of the item can connect their Cardano wallet and update the item's link tree, adding links to their social media profiles, portfolio, or other accounts. These updates are signed transactions on Cardano, making the link tree tamper-proof and permanently associated with the item's certificate.

## What the Owner Sees

1. Scans QR code → certificate page opens
2. Sees product info (read-only view for anyone)
3. Clicks "Claim this item"
4. Connects Cardano wallet
5. Secret is validated → minting is unlocked
6. Mints the NFT representing their ownership
7. Adds their social links to the item's link tree

All of this runs in the browser. No app, no account, no server infrastructure needed by the brand beyond the initial certificate notarization.

## Backend Extension

This use case uses the Connected Goods extension in the UVerify backend. When self-hosting, enable it in your `.env`:

```env
CONNECTED_GOODS_EXTENSION_ENABLED=true
CONNECTED_GOODS_SERVICE_WALLET_ADDRESS=addr1...
CONNECTED_GOODS_ENCRYPTION_SALT=your-random-salt
```

See [Self-Hosting](../self-hosting) for the full backend setup.
