# Custom Templates

The certificate page in UVerify is driven by a template system. Every certificate carries a `uverify_template_id` field in its on-chain metadata. When the certificate page loads, it reads this field and renders the corresponding template.

This means the certificate page can look and behave completely differently depending on what the issuer put into the metadata at notarization time. A diploma, a product passport, and a social hub all run on the same infrastructure, differentiated entirely by their template.

## What a Template Controls

A template controls:

- The entire visual layout of the certificate page
- Which wallet interactions are available (connect wallet, mint NFT, update link tree)
- Whether access is restricted to specific issuer addresses (whitelist)
- The colour scheme, background, and component styles
- Which metadata fields are read and how they are displayed

## Template Options

| Option | When to use |
|---|---|
| [Built-in templates](./templates/built-in) | Use an existing template by setting `uverify_template_id` in your metadata |
| [Build a custom template](./templates/building-a-template) | Create a fully custom certificate UI for your brand or use case |

## Template Selection

When a certificate page loads at `app.uverify.io/verify/<hash>`, it:

1. Fetches the certificate data from the backend API
2. Reads `metadata.uverify_template_id`
3. Looks up the template in the registered template list
4. Renders the template, passing it the hash, metadata, certificate data, pagination controls, and runtime `extra` context

If no `uverify_template_id` is present, the `default` template is used.

If a template has a `whitelist` configured, it only activates when the certificate was issued from one of the whitelisted Cardano addresses. Certificates from other issuers fall back to the `default` template.
