const http = require("http");
const mqtt = require("mqtt");
const WebSocket = require("ws");

// MQTT broker URL and options
const mqttBrokerUrl = "mqtt://38.242.254.49:1883";
const mqttClient = mqtt.connect(mqttBrokerUrl);

//HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running.");
});

const port = 3001;

// Attaching the WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  // Subscribing to the MQTT topic
  mqttClient.subscribe("/test/+/events");

  // send MQTT message to the WebSocket
  mqttClient.on("message", (topic, message) => {
    ws.send(message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    mqttClient.unsubscribe("/test/+/events");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
