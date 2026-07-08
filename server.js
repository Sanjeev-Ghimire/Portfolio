require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB (only connect if MONGO_URL exists)
if (process.env.MONGO_URL) {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("✅ MongoDB Connected");
    })
    .catch((error) => {
      console.log("MongoDB Error:", error.message);
    });
} else {
  console.log("⚠️ MONGO_URL not found. Skipping MongoDB connection.");
}

// Contact API
app.use("/contact", require("./routes/contact"));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio running on port ${PORT}`);
});
