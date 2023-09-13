const http = require("http");
const mqtt = require("mqtt");
const WebSocket = require("ws");

// MQTT broker URL and options
const mqttBrokerUrl = "mqtt://38.242.254.49:1883";
const mqttClient = mqtt.connect(mqttBrokerUrl);

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running.");
});

const port = 3001;

// Attach the WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  // Subscribe to the MQTT topic
  mqttClient.subscribe("/test/+/events");

  // Handle MQTT messages and send them to the WebSocket
  mqttClient.on("message", (topic, message) => {
    // Send the MQTT message to the WebSocket client
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
