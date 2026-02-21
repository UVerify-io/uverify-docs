# UVerify Docs

Developer documentation for [UVerify](https://uverify.io), hosted at [docs.uverify.io](https://docs.uverify.io).

Built with [Nextra](https://nextra.site) (Next.js) and deployed to Firebase Hosting.

## Running locally

```bash
npm install
npm run dev
```

The docs will be available at `http://localhost:3000`.

## Building

```bash
npm run build
```

Static output goes to `dist/`.

## Deploying

```bash
npm run deploy
```

This builds the site and deploys it to Firebase Hosting. You need to be authenticated with Firebase CLI and have access to the project.

## Structure

```
pages/              # Documentation pages (Nextra/MDX)
  _meta.js          # Top-level navigation
  index.md          # Getting Started
  concepts.md       # How It Works
  use-cases/        # Use case guides
  self-hosting.mdx  # Self-hosting guide
  templates/        # Custom Templates
  platform/         # UVerify as a Platform
  pricing.md        # Pricing
  api-docs.mdx      # API Docs (Swagger UI)
  sdk.mdx           # SDK reference
components/         # React components used in MDX pages
public/             # Static assets (images)
```

## Contributing

Pages are written in Markdown or MDX. Navigation order and labels are controlled by `_meta.js` files in each directory.

If you find an error or want to improve the docs, open an issue or a pull request.

## License

GPL-3.0
