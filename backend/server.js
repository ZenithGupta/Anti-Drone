const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let logs = []; // in-memory storage

// Store a new log
app.post("/api/logs", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  const logEntry = { id: logs.length + 1, message, time: new Date() };
  logs.push(logEntry);

  res.json({ success: true, log: logEntry });
});

// Get all logs
app.get("/api/logs", (req, res) => {
  res.json(logs);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
