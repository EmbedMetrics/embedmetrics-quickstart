# EmbedMetrics React Embedding Sample

A simple React application demonstrating how to integrate EmbedMetrics chat widget into your React app.

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Start the Token Server

First, make sure you have the token minting server running:

```bash
# In another terminal, from the repository root
cd server-token-minting
npm run dev
# or
yarn dev
```

This starts the token server on `http://localhost:3001`.

### 3. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration (all variables are required):

```bash
# Your EmbedMetrics App ID from the dashboard (same as server-token-minting)
REACT_APP_APP_ID=your-actual-app-id-here

# EmbedMetrics Platform API URL (same as server-token-minting)
REACT_APP_PLATFORM_API_URL=https://api.embedmetrics.com

# Token server URL (where your backend runs)
REACT_APP_TOKEN_SERVER_URL=http://localhost:3001/demo/token
```

> **Important**: Configure your EmbedMetrics app in the Admin Console to allow requests from your client app's origin (e.g., `http://localhost:3000` for development, or your production domain). Without proper origin configuration, the widget will fail to load.

**Note**: The app will show console warnings if any required environment variables are missing.

### 4. Start the React App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the chat widget.

## How It Works

1. **Token Fetching**: The app fetches a JWT token from your backend server
2. **SDK Initialization**: Initializes the EmbedMetrics SDK with your API URL
3. **Widget Rendering**: Renders the chat widget with authentication
4. **Error Handling**: Automatically refreshes tokens when they expire

> ⚠️ **Important**: In this sample, the client includes demo user information in the token request.
> In production, your backend should resolve the authenticated user (session/JWT/IdP) and **not** trust client-provided identity.

## Configuration

### Environment Setup

The demo expects:

- **Token Server**: Running on `http://localhost:3001` (from `server-token-minting/`)
- **EmbedMetrics API**: `https://api.embedmetrics.com` (configured in `src/config.js`)

### Customizing the Widget

You can customize the EmbedMetrics widget by modifying the `config` and `theme` props in `src/App.js`:

```javascript
<EmbedMetricsApp
  appId="your-app-id"
  token={token}
  config={{
    header: { visible: false }, // Hide the header
    // Add other config options
  }}
  theme={{
    "--em-primary-color": "#007acc", // Custom theme colors
    // Add other CSS custom properties
  }}
/>
```

## Project Structure

```
react-embedding/
├── .env.example           # Environment variables template
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js             # Main component with EmbedMetrics integration
│   ├── App.css            # Styling
│   ├── config.js          # Configuration settings
│   ├── index.js           # App entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Troubleshooting

### "Failed to get token"

- Make sure the token server is running: `cd server-token-minting && npm run dev`
- Check that it's accessible at `http://localhost:3001`
- Ensure your token server CORS allows `http://localhost:3000` (see `CORS_ORIGINS` in the server sample)
- Verify the token server returns a valid non-empty token

### "Invalid app ID"

- Check that `REACT_APP_APP_ID` is set correctly in `.env`
- Verify the app ID in your EmbedMetrics dashboard

### Widget doesn't load

- Check browser console for errors
- Verify `REACT_APP_PLATFORM_API_URL` is set correctly in `.env`
- Ensure your EmbedMetrics app is configured to allow your client origin in the dashboard
- Ensure CORS is properly configured on your backend

### Build issues

- Run `npm install` to ensure all dependencies are installed
- Clear node_modules: `rm -rf node_modules && npm install`

### Environment variable issues

- Make sure you're editing `.env` (not `.env.example`)
- Restart the development server after changing environment variables
- Check that variable names start with `REACT_APP_`
- Look for console warnings about missing required variables

## Next Steps

- Replace the demo token server with your production backend
- Add user authentication to identify users properly
- Customize the UI to match your brand
- Add error boundaries for better error handling
- Implement proper logging and monitoring

## License

This sample code is licensed under the MIT License. See the main repository LICENSE file for details.
