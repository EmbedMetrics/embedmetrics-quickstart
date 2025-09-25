import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());

// --- CORS: read from env --------------------------------------
// .env example:
// CORS_ORIGINS=http://localhost:5173,http://localhost:5174
const parseOrigins = (raw) =>
  (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const ALLOWED_ORIGINS = parseOrigins(process.env.CORS_ORIGINS);
const corsOptions = {
  origin: (origin, cb) => {
    // Allow non-browser tools (no Origin header) and explicit allowed origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: false,
};
app.use(cors(corsOptions));

// --- Env -------------------------------------------------------
const {
  PLATFORM_API_URL,
  APP_ID,
  APP_CLIENT_SECRET,
  PORT = 3001,
} = process.env;

if (!PLATFORM_API_URL || !APP_ID || !APP_CLIENT_SECRET) {
  console.error(
    "[demo-server] Missing env vars PLATFORM_API_URL, APP_ID, APP_CLIENT_SECRET"
  );
  process.exit(1);
}

// --- Helpers ---------------------------------------------------
function verifyExpiresAt(expires_at) {
  if (!expires_at) return { ok: false, reason: "missing expires_at" };
  const ms = Date.parse(expires_at);
  if (Number.isNaN(ms))
    return { ok: false, reason: "invalid expires_at format" };
  const now = Date.now();
  if (ms <= now)
    return { ok: false, reason: "expires_at is not in the future" };
  return { ok: true };
}

// --- Routes ----------------------------------------------------
// Align path with frontend usage: /demo/token
app.post("/demo/token", async (req, res) => {
  try {
    const {
      userId = "demo-user-123", // demo-only; do not trust in production
      userName = "Demo User", // demo-only; do not trust in production
    } = req.body ?? {};

    const url = `${PLATFORM_API_URL}/api/apps/${APP_ID}/user-tokens`;
    const response = await axios.post(
      url,
      {
        user_id: userId,
        display_name: userName,
        duration: "PT15M",
      },
      {
        headers: { Authorization: `Bearer ${APP_CLIENT_SECRET}` },
        timeout: 10_000,
      }
    );

    // Expect { token, expires_at }
    const { token, expires_at } = response.data ?? {};
    const check = verifyExpiresAt(expires_at);
    if (!token || !check.ok) {
      console.error(
        "[demo-server] Invalid mint response:",
        !token ? "missing token" : check.reason
      );
      return res
        .status(502)
        .json({ error: "Invalid token response from platform" });
    }

    // No caching of tokens
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.set("Pragma", "no-cache");

    return res.status(200).json({ token, expires_at });
  } catch (error) {
    const status = error.response?.status ?? 500;
    const retryAfter = error.response?.headers?.["retry-after"];
    if (retryAfter) res.set("Retry-After", retryAfter);

    // Don't leak secrets or internals
    const msg =
      error.response?.data?.error || error.message || "Token minting failed";
    console.error("[demo-server] Token minting failed:", msg);

    return res.status(status).json({ error: "Failed to mint token" });
  }
});

app.listen(Number(PORT), () => {
  console.log(`[demo-server] listening on http://localhost:${PORT}`);
  console.log(`[demo-server] Platform API: ${PLATFORM_API_URL}`);
  console.log(`[demo-server] App ID: ${APP_ID}`);
  console.log(
    `[demo-server] CORS allowed origins: ${
      ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS.join(", ") : "(none specified)"
    }`
  );
});
