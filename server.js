require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
if (mongoUrl) {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("⚠️ MongoDB connection failed:", err.message));
} else {
  console.log("⚠️ MONGO_URL not configured - poems will not persist");
}

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
});
