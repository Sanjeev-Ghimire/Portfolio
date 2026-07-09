require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// API Routes
// ===============================
app.use("/api", require("./routes/poems"));
app.use("/contact", require("./routes/contact"));

// ===============================
// Static Files
// ===============================
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// Routes
// ===============================

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Poetry Page
app.get("/poetry.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "poetry.html"));
});

// Handle 404
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log("🚀 Portfolio Server Started");
  console.log(`🌐 Running on Port: ${PORT}`);
  console.log(`📖 Poetry API: /api/poems`);
  console.log(`📧 Contact API: /contact`);
  console.log("======================================");
});
