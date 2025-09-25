# EmbedMetrics Server Token Minting Sample

A lightweight Node.js/Express server that demonstrates how to securely mint user tokens for the EmbedMetrics Platform.

## What This Server Does

This sample acts as a **secure token broker** between your frontend app and the EmbedMetrics API:

- 🔑 **Keeps secrets safe**: never expose `APP_CLIENT_SECRET` in the browser
- 🪙 **Mints short-lived user tokens** via the Platform API
- 🛡️ **Handles errors** with proper status codes and safe logging

This pattern is required for any production integration of EmbedMetrics, where the backend must handle token minting.

---

## Quick Start

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment

Copy the example file and edit with your values:

```bash
cp ./.env.example ./.env
```

Update `./.env`:

```bash
PLATFORM_API_URL=https://api.embedmetrics.com
APP_ID=your-app-id-from-admin-console
APP_CLIENT_SECRET=emsk_live_XXXXXXXXXX_YYYYYYYYYYYYYYYYYYYY
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
PORT=3001
```

### 3. Start the server

```bash
# Run in development mode (with hot reload)
yarn dev

# Run in standard mode (no hot reload)
yarn start
```

Server runs at [http://localhost:3001](http://localhost:3001).

> Note: This server is provided as a sample for learning and integration testing. It is not intended for direct production use without further security and deployment hardening.

---

## API Reference

### `POST /demo/token`

Mints a new JWT token for end-user authentication with a default duration of 15 minutes.

**Request body:**

```json
{
  "userId": "demo-user-123",
  "userName": "Demo User"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2024-01-01T12:30:00Z"
}
```

**Error codes:**

- `400` — Invalid request
- `401` — Invalid credentials
- `403` — App access denied
- `429` — Rate limit exceeded (with `Retry-After` header)
- `500` — Server error

> ⚠️ **Important**: In this sample, the client sends `userId` and `userName` directly in the request body for demonstration purposes.  
> In a real production setup, the demo server should **not trust client-provided user info**. Instead, it should:
>
> - Resolve the authenticated user from a session, JWT, or your identity provider
> - Use that server-validated identity when calling the EmbedMetrics API to mint tokens

---

## How It Works

Production flow

```

Frontend (React/Vanilla) --> /demo/token --> Sample Server (Token Broker) --> /api/apps/:appId/user-tokens --> EmbedMetrics Platform API
        ^                                                                                                              |
        |--------------------------------------- { token } <--- { token, expires_at } ---------------------------------|

```

---

## Environment Variables

| Variable            | Description                        | Required |
| ------------------- | ---------------------------------- | -------- |
| `PLATFORM_API_URL`  | EmbedMetrics Platform API base URL | ✅       |
| `APP_ID`            | Your app ID from Admin Console     | ✅       |
| `APP_CLIENT_SECRET` | Client secret (format: `emsk_...`) | ✅       |
| `CORS_ORIGINS`      | Comma-separated allowed origins    | ❌       |
| `PORT`              | Local server port (default: 3001)  | ❌       |

---

## Troubleshooting

**Env var errors**

- Ensure `.env` exists in the root
- Double-check variable names

**CORS errors in browser**

- Verify proxy config matches `http://localhost:3001`
- Confirm sample server is running
- Check that the request origin is listed in `CORS_ORIGINS` (or leave empty to allow all origins)
- Note: Non-browser tools (curl, Postman) are allowed even without specifying `CORS_ORIGINS`

**401: Token fetch failed**

- Check `APP_CLIENT_SECRET`
- Verify app is active in the Admin Console

**Connection refused**

- Confirm `PLATFORM_API_URL` is set to `https://api.embedmetrics.com`
- Check local networking

---

## License

All sample code in this repository is licensed under the [MIT License](../LICENSE).
You are free to use and adapt it in your own projects.
