const bedrock = require("bedrock-protocol");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const SERVER_HOST = process.env.SERVER_HOST || "dragonet.aternos.host";
const SERVER_PORT = parseInt(process.env.SERVER_PORT) || 56328;
const BOT_USERNAME = process.env.BOT_USERNAME || "AFK_Bot";

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE HTML>
    <html>
      <head><title>AFK Bot Status</title></head>
      <body>
        <h1>Bedrock AFK Bot is Running</h1>
      </body>
    </html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Listening on port ${PORT}`);
});

function createBot() {
  console.log(`[Bot] Connecting to ${SERVER_HOST}:${SERVER_PORT}...`);

  const client = bedrock.createClient({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    offline: true,
    skipPing: true,
    profilesFolder: null,
    version: "1.21.50"
  });

  client.on("spawn", () => {
    console.log("[Bot] Successfully connected and spawned in the world!");
  });

  client.on("death", () => {
    console.log("[Bot] Bot died! Attempting to respawn...");
    client.queue("respawn", { state: 0 });
  });

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
