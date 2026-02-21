# Private Chain Attestations

## The Problem

Many organizations run private or permissioned blockchains: supply chain ledgers, consortium chains, internal audit trails. These chains are great for coordination within a closed group but have a fundamental limitation: their records are only as trustworthy as the consortium operating them.

External parties (regulators, auditors, customers) who need to verify something from a private chain face a trust problem. They cannot independently verify the private ledger. They have to trust the operator.

A similar problem exists for organizations that need to produce a public, verifiable record of events that happened in an off-chain system: a laboratory information management system (LIMS), an ERP, a quality management system.

## How UVerify Solves It

At regular intervals (or at key event points), the private system computes a hash of its current state (or of a specific record) and records it on the Cardano public blockchain via UVerify. This creates a **cryptographic anchor**: a public, tamper-proof proof that at a specific moment in time, the private system was in a specific state.

External parties can verify the anchor without accessing the private chain. The operator cannot retroactively alter the private chain without breaking the hash.

## Patterns

### Batch anchoring

At the end of each business day, compute a Merkle root of all transactions that occurred during the day and record it on Cardano. External auditors can verify individual transactions by checking their inclusion in the Merkle tree and verifying the root against the on-chain record.

```
Private chain records (day N)
    ↓ Merkle root computation
SHA-256 hash of the Merkle root
    ↓
UVerify API → Cardano transaction (once per day)
```

### Event anchoring

For high-stakes events (lab test completion, quality sign-off, regulatory submission), notarize the specific record immediately. The certificate stores a reference (document ID, batch number, etc.) so auditors can cross-reference against the private system.

```json
{
  "system": "LIMS v3.2",
  "event_type": "batch_release",
  "batch_id": "BATCH-2024-09142",
  "operator_id": "QC-TEAM-07",
  "private_chain_tx": "0xabc123..."
}
```

### Cross-chain attestation

Data from a private chain (Hyperledger Fabric, R3 Corda, a private Ethereum network) is summarized and anchored on Cardano. The certificate provides a public proof of the private chain's state at a given block height.

## Implementation

### Step 1: Compute the hash in your system

```python
import hashlib, json

record = {
    "batch_id": "BATCH-2024-09142",
    "result": "PASS",
    "timestamp": "2024-09-14T14:23:00Z"
}

hash_input = json.dumps(record, sort_keys=True).encode()
sha256_hash = hashlib.sha256(hash_input).hexdigest()
```

### Step 2: Notarize via the UVerify API

Notarization on Cardano is a two-step process: build an unsigned transaction, then sign and submit it.

**Build the transaction:**

```bash
curl -X POST https://api.uverify.io/api/v1/transaction/build \
  -H "Content-Type: application/json" \
  -d '{
    "type": "default",
    "address": "<your_cardano_address>",
    "certificates": [
      {
        "hash": "<sha256_hash>",
        "algorithm": "SHA-256",
        "metadata": {
          "system": "LIMS v3.2",
          "event_type": "batch_release",
          "batch_id": "BATCH-2024-09142"
        }
      }
    ]
  }'
```

The response contains an `unsignedTransaction`. Sign it with your Cardano wallet and submit:

```bash
curl -X POST https://api.uverify.io/api/v1/transaction/submit \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": "<signed_transaction_cbor>",
    "witnessSet": "<witness_set_cbor>"
  }'
```

See the full [API Docs](../api-docs) for all request and response fields.

### Step 3: Store the certificate URL

Once the transaction is confirmed on-chain, the certificate is accessible at:

```
https://app.uverify.io/verify/<sha256_hash>
```

Store this URL alongside the original record in your private system. When an auditor requests verification, provide both the original record and the certificate URL.

### Step 4: Auditor verification

The auditor:
1. Opens the certificate URL
2. Sees the on-chain hash, timestamp, and metadata
3. Independently computes the SHA-256 hash of the record they received
4. Compares: if the hashes match, the record has not been altered since notarization

No account, no login, no access to the private chain required by the auditor.

## Scalability

For high-frequency anchoring, use the batch size feature of a custom Bootstrap Datum to pack multiple hashes into a single Cardano transaction, reducing per-record costs significantly. See [Pricing](../pricing) and [UVerify as a Platform](../platform).
