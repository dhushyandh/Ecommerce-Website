const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: path.join(__dirname, "config/config.env") });

// Models
require("./models/userModel");
require("./models/productModel");
require("./models/orderModel");

// Routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const payment = require("./routes/payment");
const errorMiddleware = require("./middlewares/error");

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Uploads (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// =======================
// PRODUCTION (CRA build)
// =======================
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Serve manifest/service-worker/index from build; use app.use fallback
  app.get('/manifest.json', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/manifest.json'));
  });

  app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/service-worker.js'));
  });

  // Fallback for client-side routing — use app.use so router param parsing isn't involved
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });

}

// Error middleware (LAST)
app.use(errorMiddleware);

module.exports = app;
