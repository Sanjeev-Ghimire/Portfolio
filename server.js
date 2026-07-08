require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware - Set UTF-8 encoding
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set UTF-8 headers for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Accept-Charset', 'utf-8');
  next();
});

// Routes
app.use("/", require("./routes/poems"));
app.use("/contact", require("./routes/contact"));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Poetry page
app.get("/poetry.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "poetry.html"));
});

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio running on port ${PORT}`);
  console.log(`📝 Poetry API available at http://localhost:${PORT}/api/poems`);
  console.log(`✨ Supports Unicode - Devanagari, Hindi, Nepali, and other scripts`);
});
