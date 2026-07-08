require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware - Set UTF-8 encoding FIRST
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(cors());

// Set UTF-8 headers for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Accept-Charset', 'utf-8');
  next();
});

// API Routes FIRST (before static files)
app.use("/api", require("./routes/poems"));
app.use("/contact", require("./routes/contact"));

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, "public")));

// HTML Routes (catch-all at the end)
app.get("/poetry.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "poetry.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio running on port ${PORT}`);
  console.log(`📝 Poetry API available at http://localhost:${PORT}/api/poems`);
  console.log(`📧 Contact API available at http://localhost:${PORT}/contact`);
  console.log(`✨ Supports Unicode - Devanagari, Hindi, Nepali, and other scripts`);
});
