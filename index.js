
const bedrock = require("bedrock-protocol");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

// Host details for your server
const SERVER_HOST = "haddock.aternos.host";
const SERVER_PORT = 56328;
const BOT_USERNAME = "AFK_Bot";

// Simple web server to keep host online
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>AFK Bot Dashboard</title>
      <style>
        body { font-family: sans-serif; background: #0d1117; color: #c9d1d9; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: #161b22; padding: 24px; border-radius: 8px; border: 1px solid #30363d; text-align: center; }
        h1 { color: #58a6ff; font-size: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Bedrock AFK Bot Status</h1>
        <p>Bot is actively running and managing server connection.</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Listening on port ${PORT}`);
});

// Bot connection management
function createBot() {
  console.log(`[Bot] Connecting to ${SERVER_HOST}:${SERVER_PORT}...`);

      const client = bedrock.createClient({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    offline: true,
    skipPing: false,
  });

  client.on("spawn", () => {
    console.log("[Bot] Successfully connected and spawned in the world!");
  });

  client.on("error", (err) => {
    console.error("[Bot Error]", err.message || err);
  });

  client.on("close", () => {
    console.log("[Bot] Disconnected. Reconnecting in 30 seconds...");
    setTimeout(createBot, 30000);
  });
}

createBot();
