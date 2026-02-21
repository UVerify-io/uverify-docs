# Academic Credentials

## The Problem

A university student graduates after four years of hard work. They receive their diploma, a PDF or a physical document. When they apply for a job abroad, the employer has no reliable way to verify it is genuine without calling the university directly, waiting days for a response, and hoping the records are still accessible.

Credential fraud is widespread. And even legitimate credentials are hard to verify quickly, especially across borders or long after graduation.

## How UVerify Solves It

The university computes a SHA-256 hash of the diploma document and records it on the Cardano blockchain, along with structured metadata (recipient name, degree, date, issuing institution). The resulting certificate lives at a permanent URL, verifiable by anyone, instantly, forever.

The certificate page uses the `diploma` template, which formats the data as a human-readable diploma rather than a raw hash viewer. No one needs to call the university. No infrastructure needs to be maintained by the university after issuance.

## Implementation

### Step 1: Prepare metadata

When notarizing the diploma, include structured metadata in the transaction:

```json
{
  "uverify_template_id": "diploma",
  "issuer": "University of Example",
  "name": "Jane Doe",
  "title": "Master of Science in Computer Science",
  "description": "Awarded with distinction, June 2024"
}
```

The `diploma` template reads these fields and renders them in a formatted layout. The `issuer` field is used as the institution name, `name` as the graduate's name, and `title` as the degree.

### Step 2: Notarize via API or web app

**Via the web app** (`app.uverify.io`): upload the diploma PDF, fill in the metadata fields, and sign with the institution's Cardano wallet.

**Via the API**: POST the hash and metadata programmatically to batch-notarize an entire graduating class in a single workflow.

### Step 3: Distribute the certificate URL

Each certificate lives at:
```
https://app.uverify.io/verify/<sha256-hash>
```

Include this URL (or a QR code pointing to it) in the physical diploma, the email to the graduate, or the registrar's portal. The graduate shares this link with employers or other institutions.

### Step 4: Verification (no account needed)

Anyone who receives the link opens it in a browser. The certificate page shows:
- Whether the hash is verified on-chain
- The metadata (name, degree, institution)
- The Cardano transaction ID and block explorer link
- When it was first notarized

No login, no API key, no phone call to the university.

## White-Labelling

If the university wants the certificate page to carry its own branding and domain, set up a custom Bootstrap Datum and deploy a white-labelled UVerify frontend. Graduates then see `verify.university.edu/<hash>` instead of `app.uverify.io`. See [UVerify as a Platform](../platform) and [Self-Hosting](../self-hosting).

## Batch Issuance

A graduating class of 500 students does not require 500 separate transactions. The Bootstrap Datum's `batch_size` field controls how many certificates are packed into a single transaction, significantly reducing per-certificate fees.

See [Pricing](../pricing) for fee calculations.
