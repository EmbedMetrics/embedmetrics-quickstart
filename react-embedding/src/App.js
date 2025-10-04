import React, { useState, useEffect } from "react";
import { EmbedMetricsApp } from "@embedmetrics/sdk/react";
import { initEmbedMetrics } from "@embedmetrics/sdk";
import config from "./config";
import "./App.css";
import theme from "./themes/discordTheme.ts";

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch authentication token from your backend
  const fetchToken = async () => {
    try {
      const response = await fetch(config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: config.demoUser.userId,
          userName: config.demoUser.userName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.status}`);
      }

      const data = await response.json();
      return data.token;
    } catch (err) {
      console.error("Token fetch failed:", err);
      throw err;
    }
  };

  // Initialize EmbedMetrics and fetch token on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize the EmbedMetrics SDK
        initEmbedMetrics({
          apiUrl: config.apiUrl,
        });

        // Get authentication token
        const authToken = await fetchToken();
        if (typeof authToken === "string" && authToken.length > 0) {
          setToken(authToken);
        } else {
          throw new Error("Empty token");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle authentication errors (token expired, etc.)
  const handleAuthError = async () => {
    try {
      const newToken = await fetchToken();
      if (typeof newToken === "string" && newToken.length > 0) {
        setToken(newToken);
        return newToken;
      }
      throw new Error("Empty token");
    } catch (err) {
      setError("Failed to refresh authentication");
      return null;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <h2>Loading EmbedMetrics...</h2>
          <p>Please wait while we set up the chat widget.</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  // Main app with EmbedMetrics widget
  return (
    <div className="app">
      <header className="header">
        <h1>EmbedMetrics React Demo</h1>
        <p>Ask about your data, right inside your app</p>
      </header>

      <main className="main">
        <div className="chat-container">
          <EmbedMetricsApp
            appId={config.appId}
            token={token}
            onAuthError={handleAuthError}
            onError={(err) => {
              console.error("EmbedMetrics error:", err);
            }}
            // Optional: Customize the appearance
            config={{
              header: { visible: true },
            }}
            // theme={theme}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
