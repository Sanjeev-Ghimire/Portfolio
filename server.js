require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const app = express();

// middleware

app.use(cors());

app.use(express.json());

// connect frontend

app.use(express.static("public"));

// MongoDB connection

mongoose
  .connect(process.env.MONGO_URL)

  .then(() => {
    console.log("✅ MongoDB Connected");
  })

  .catch((error) => {
    console.log("MongoDB Error:", error.message);
  });

// contact API

app.use(
  "/contact",

  require("./routes/contact"),
);

// home page

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// server start

app.listen(
  process.env.PORT,

  () => {
    console.log(`🚀 Portfolio running on http://localhost:${process.env.PORT}`);
  },
);
