# EmbedMetrics Quickstart

Sample integrations built by EmbedMetrics.

This repository contains quickstart samples to help you embed EmbedMetrics in your application and handle secure server-side token minting. Each sample is self-contained and shows a different integration pattern.

> Note: These are **samples** for learning and integration testing. They are not production-hardened.

## Requirements

- Node.js 18+
- An EmbedMetrics App ID and Client Secret (from the Admin Console)

## What's inside

| Path                      | What it shows                               | Notes                                     |
| ------------------------- | ------------------------------------------- | ----------------------------------------- |
| **/react-embedding**      | React app embedding the EmbedMetrics widget | Uses a backend token endpoint             |
| **/vanilla-js-embedding** | Framework-free page embedding               | Coming soon - Minimal JS, same token flow |
| **/server-token-minting** | Backend token broker (Node/Express)         | Mints short-lived user tokens             |

## 2-minute quickstart

1. **Start the token server**

```bash
cd server-token-minting
cp .env.example .env
# Edit .env with PLATFORM_API_URL, APP_ID, APP_CLIENT_SECRET
npm run dev
# Server at http://localhost:3001
```

2. **Run the React sample**

```bash
cd ../react-embedding
cp .env.example .env.local
# Edit .env.local with REACT_APP_APP_ID and REACT_APP_TOKEN_SERVER_URL
npm start
# Open http://localhost:3000
```

## Docs for each sample

- [React Embedding](./react-embedding/README.md)
- [Vanilla JS Embedding](./vanilla-js-embedding/README.md)
- [Server Token Minting](./server-token-minting/README.md)

## License

All sample code in this repository is licensed under the [MIT License](./LICENSE).
You are free to use, modify, and adapt it in your own projects.
