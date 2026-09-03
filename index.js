const bedrock = require("bedrock-protocol");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

// Host details using environment variables with fallbacks
const SERVER_HOST = process.env.SERVER_HOST || "mouthbrooder.aternos.host";
const SERVER_PORT = parseInt(process.env.SERVER_PORT) || 56328;
const BOT_USERNAME = "AFK_Bot";

// Express web server for UptimeRobot monitoring
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
        body { font-family: sans-serif; background: #0d1117; color: #c9d1d9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
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
  skipPing: true,
  version: '1.26.45.1'
});
  
  client.on("spawn", () => {
    console.log("[Bot] Successfully connected and spawned in the world!");
  });

  // Auto-Respawn on Death
  client.on("death", () => {
    console.log("[Bot] Bot died! Attempting to respawn...");
    client.queue("respawn", {
      state: 0,
    });
  });

  // Log server chat
  client.on("text", (packet) => {
    console.log(`[Chat Log] ${packet.source_name || "Server"}: ${packet.message}`);
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
