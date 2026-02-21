# Product Passports

## The Problem

A consumer buys a luxury bag, a supplement, or an electronic component. How do they know it is genuine? QR codes on packaging can be copied. Certificates of authenticity are easy to fake. Brand databases require an account and internet connection to the brand's own servers, which may go offline, change, or be acquired.

Product authenticity needs to be verifiable by anyone, forever, without depending on the brand's continued infrastructure.

## How UVerify Solves It

The manufacturer records a product's identity on the Cardano blockchain at the point of production. The certificate stores structured product metadata and a unique serial number. A QR code printed on the packaging or attached to the product points to the certificate page.

Anyone who scans the QR code sees the authenticated product data instantly, on a permanent record that cannot be altered or taken down.

## Implementation

### Step 1: Prepare product metadata

```json
{
  "uverify_template_id": "productVerification",
  "productName": "Titanium Road Frame Pro",
  "manufacturer": "ExampleBikes GmbH",
  "productionDate": "2024-11-15",
  "materialInfo": "Grade 9 titanium, handbuilt in Germany",
  "serialNumber": "TRF-2024-00842",
  "imageUrl": "https://cdn.examplebikes.com/products/trf-pro.jpg"
}
```

The `productVerification` template renders these fields in a product card layout. The `imageUrl` is shown as the product image. The serial number provides the unique identifier for each physical unit.

### Step 2: Notarize per-unit or per-batch

**Per unit**: hash the serial number (or a combination of serial number + production batch data) and notarize each product individually. Best for high-value items.

**Per batch**: hash a batch manifest file containing all serial numbers and notarize once. Cheaper per unit; verification requires checking the manifest.

### Step 3: Generate and attach QR codes

Generate a QR code for each certificate URL:
```
https://app.uverify.io/verify/<sha256-hash>
```

Print the QR code on the product label, packaging, or attach an NFC tag (see [Connected Goods](./connected-goods) for an NFC-enhanced version).

### Step 4: Consumer verification

The consumer scans the QR code with their phone. No app required; a standard browser opens the certificate page. They see:
- Product name, manufacturer, production date
- Material information and serial number
- Product image
- Blockchain transaction timestamp and explorer link

The page is self-contained. Even if the manufacturer's website disappears, the certificate remains verifiable on Cardano indefinitely.

## Advanced: Asymmetric NFC Verification

For high-value goods, a passive QR code can be copied onto a counterfeit. The `productVerification` template supports **asymmetric NFC chips** (via `@uverify/asymmetric-nfc`): the chip holds a private key and signs a server challenge. The certificate page verifies the signature against the public key stored on-chain. Only the genuine physical chip can produce a valid signature; a counterfeit with just the QR code cannot pass this check.

See the [Connected Goods](./connected-goods) use case for the full NFC pattern.

## White-Labelling

Brands typically want the verification page to carry their own domain and visual identity. A custom Bootstrap Datum and a branded UI deployment achieve this. See [UVerify as a Platform](../platform) and [Self-Hosting](../self-hosting).
