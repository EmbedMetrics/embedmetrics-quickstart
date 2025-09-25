// EmbedMetrics Configuration
// Values are read from environment variables (.env)
// See .env.example for available options

const config = {
  // Your EmbedMetrics App ID from the dashboard
  appId: process.env.REACT_APP_APP_ID,

  // EmbedMetrics Platform API URL
  apiUrl: process.env.REACT_APP_PLATFORM_API_URL,

  // Token server URL (where you run the server-token-minting backend)
  tokenUrl: process.env.REACT_APP_TOKEN_SERVER_URL,

  // Demo user information (not configurable via env vars for simplicity)
  demoUser: {
    userId: "demo-user-123",
    userName: "Demo User",
  },
};

// Dev-time validation (console warnings)
if (!config.appId) console.warn("[react-embedding] Missing REACT_APP_APP_ID");
if (!config.apiUrl)
  console.warn("[react-embedding] Missing REACT_APP_PLATFORM_API_URL");
if (!config.tokenUrl)
  console.warn("[react-embedding] Missing REACT_APP_TOKEN_SERVER_URL");

export default config;
